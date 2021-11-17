import { db } from "../util/admin";
import config from "../util/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { getStorage, uploadBytes, ref } from "firebase/storage";
import { Response } from "express";
import * as BusBoy from "busboy";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

// TODO: Replace the following with your app's Firebase project configuration
// const app = initializeApp(config);

import {
  validateLoginData,
  validateSignupData,
  reduceUserDetails,
} from "../util/validators";
import { userRequest } from "../util/types";
// import { user } from 'firebase-functions/v1/auth';

// TODO: Handle error display with reusable modal

// Sign user in
const signUp = async (req: any, res: any) => {
  const newUser = {
    email: req!.body.email,
    password: req!.body.password,
    confirmPassword: req!.body.confirmPassword,
    handle: req!.body.handle,
  };

  console.log("sign up contents", req.body);
  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const noImg = "no-img.png";

  let token: string, userId: string;

  const docRef = doc(db, "users", newUser.handle);
  const docSnap = getDoc(docRef);
  docSnap
    .then((doc) => {
      if (doc.exists()) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        const auth = getAuth();
        return createUserWithEmailAndPassword(
          auth,
          newUser.email,
          newUser.password
        );
      }
    })
    .then((data: UserCredential) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(async (idToken: string) => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        userId,
      };
      const userRef = doc(db, "users", newUser.handle);
      const userSnap = await setDoc(userRef, userCredentials);
      return userSnap;
    })
    .then(() => {
      // console.log({"returning access token": token})
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email already in use" });
      } else {
        return res.status(500).json({ general: err.message }); // change this error code to Something went wrong later
      }
    });
};

// Log user in
const logIn = (req: any, res: any) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  const auth = getAuth();
  signInWithEmailAndPassword(auth, user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type, Accept"
      );
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      return res.json({ token });
    })
    .catch((err) => {
      console.error("[error from Login]", err); // this if block might be cause of a crash later
      return res
        .status(400)
        .json({ general: "Something went wrong, pls try again" });
    });
};

const uploadUserImage = (req: userRequest, res: Response) => {
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName: string;
  let imageToBeUploaded: { filepath?: string; mimetype?: string } = {};
  let mimeType = "";

  busboy.on(
    "file",
    (
      fieldname: string,
      file,
      filename: string,
      encoding: string,
      mimetype: string
    ) => {
      console.log(fieldname);
      console.log(filename);
      console.log(mimetype);
      mimeType = mimetype;
      //img.png
      const imageExtension =
        filename.split(".")[filename.split(".").length - 1];
      imageFileName = `${Math.round(
        Math.random() * 100000000
      )}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      console.log("this is file path ", filepath);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    }
  );
  busboy.on(
    "finish",
    (
      fieldname: string,
      file: NodeJS.ReadStream, // TODO: find out what file is in Busboy;
      filename: string,
      encoding: string,
      mimetype: string
    ) => {
      console.log(fieldname);
      console.log(filename);
      console.log(mimetype);
      mimeType = mimetype;
      console.log("this is mimetype", mimeType);
      console.log(mimeType != "image/jpeg");
      if (mimeType != "image/png" && mimeType != "image/jpeg") {
        res.status(400).json({
          error: "wrong file type submitted",
        });
        return;
      }

      const storage = getStorage();
      const storageRef = ref(storage, imageFileName);
      const filepath = path.join(os.tmpdir(), imageFileName);
      console.log("this is file path ", filepath);
      imageToBeUploaded = { filepath, mimetype };
      // Create a reference to 'images/mountains.jpg'
      const metadata = {
        contentType: imageToBeUploaded.mimetype,
      };
      const fileContent = fs.readFileSync(imageToBeUploaded.filepath!);
      // 'file' comes from the Blob or File API

      uploadBytes(storageRef, fileContent, metadata)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log("[Image successfully uploaded now wetting it to user]");
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
          const userRef = doc(db, "users", req.user!.handle);
          updateDoc(userRef, { imageUrl });
        })
        .then(() => {
          console.log("[Image upload process successful]");
          res.json({ message: "Image Uploaded successfully" });
          return;
        })
        .catch((err) => {
          console.error({ "error from uploadUserImage": err.code });
          res.status(500).json({ error: err.code });
          return;
        });
    }
  );

  busboy.end();
};

const uploadCoverImage = (req: userRequest, res: Response) => {
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName: string;
  let imageToBeUploaded: { filepath?: string; mimetype?: string } = {};
  let mimeType = "";

  busboy.on(
    "file",
    (
      fieldname: string,
      file,
      filename: string,
      encoding: string,
      mimetype: string
    ) => {
      console.log(fieldname);
      console.log(filename);
      console.log(mimetype);
      mimeType = mimetype;
      //img.png
      const imageExtension =
        filename.split(".")[filename.split(".").length - 1];
      imageFileName = `${Math.round(
        Math.random() * 100000000
      )}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      console.log("this is file path ", filepath);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    }
  );
  busboy.on(
    "finish",
    (
      fieldname: string,
      file: NodeJS.ReadStream, // TODO: find out what file is in Busboy;
      filename: string,
      encoding: string,
      mimetype: string
    ) => {
      console.log(fieldname);
      console.log(filename);
      console.log(mimetype);
      mimeType = mimetype;
      console.log("this is mimetype", mimeType);
      console.log(mimeType != "image/jpeg");
      if (mimeType != "image/png" && mimeType != "image/jpeg") {
        res.status(400).json({
          error: "wrong file type submitted",
        });
        return;
      }

      const storage = getStorage();
      const storageRef = ref(storage, imageFileName);
      const filepath = path.join(os.tmpdir(), imageFileName);
      console.log("this is file path ", filepath);
      imageToBeUploaded = { filepath, mimetype };
      // Create a reference to 'images/mountains.jpg'
      const metadata = {
        contentType: imageToBeUploaded.mimetype,
      };
      const fileContent = fs.readFileSync(imageToBeUploaded.filepath!);
      // 'file' comes from the Blob or File API

      uploadBytes(storageRef, fileContent, metadata)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log("[Image successfully uploaded now wetting it to user]");
          const coverUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
          const userRef = doc(db, "users", req.user!.handle);
          updateDoc(userRef, { coverUrl });
        })
        .then(() => {
          console.log("[Cover Image upload process successful]");
          res.json({ message: "Cover Image Uploaded successfully" });
          return;
        })
        .catch((err) => {
          console.error({ "error from uploadCoverImage": err.code });
          res.status(500).json({ error: err.code });
          return;
        });
    }
  );

  busboy.end();
};

// Add user details
const addUserDetails = (req: userRequest, res: Response) => {
  let userDetails = reduceUserDetails(req.body);

  let userRef = doc(db, "users", req.user!.handle);
  updateDoc(userRef, userDetails)
    .then(() => {
      res.json({ message: "Details updated successfully" });
      return;
    })
    .catch((err) => {
      console.error(err.message);
      return res.status(500).json({ err: err.code });
    });
};

// getUserDetails handler to get a user's details
interface UserData {
  reviews?: any[];
  credentials?: {};
  likes?: any[];
  notifications?: any[];
  body?: any;
}

const getUserDetails = async (req: userRequest, res: Response) => {
  let userData: UserData = {};
  let userRef = doc(db, "users", req.params.handle);
  getDoc(userRef)
    .then(async (doc) => {
      if (!doc.exists) {
        res.status(404).json({ error: "Review not found" });
        return;
      } else {
        const reviewCollection = collection(db, "reviews");
        const q = query(
          reviewCollection,
          where("userHandle", "==", req.params.handle),
          orderBy("createdAt", "desc")
        );

        return await getDocs(q);
      }
    })
    .then((data) => {
      userData.reviews = [] as any;
      data!.forEach((document) => {
        userData.reviews!.push({
          body: document.data().body,
          createdAt: document.data().createdAt,
          userHandle: document.data().userHandle,
          userImage: document.data().userImage,
          likeCount: document.data().likeCount,
          commentCount: document.data().commentCount,
          reviewId: document.id,
        });
      });
      res.json(userData);
      return;
    })
    .catch((err) => {
      console.log("[error from getUser details]", err);
      res.status(500).json({ error: err });
      return;
    });
};

const getAuthenticatedUser = async (req: userRequest, res: Response) => {
  let userData: UserData = {};
  let userRef = doc(db, "users", req.user!.handle);
  getDoc(userRef)
    .then(async (doc) => {
      if (doc.exists()) {
        //res.status(404).json({ error: "Review not found" });
        userData.credentials = doc.data();
        const likesCollection = collection(db, "likes");
        const q = query(
          likesCollection,
          where("userHandle", "==", req.user!.handle)
        );
        userData.likes = [];
        await getDocs(q).then((data) =>
          data.forEach((doc) => {
            userData.likes!.push(doc.data());
          })
        );

        const notificationsCollection = collection(db, "notifications");
        const q2 = query(
          notificationsCollection,
          where("recipient", "==", req.user!.handle),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        userData.notifications = [];
        await getDocs(q2).then((data) => {
          userData.notifications!.push({
            recipient: doc.data().recipient,
            sender: doc.data().sender,
            createdAt: doc.data().createdAt,
            type: doc.data().type,
            read: doc.data().read,
            notificationId: doc.id,
            reviewId: doc.data().reviewId,
          });
        });

        res.json(userData);
        return;
      }
    })
    .catch((err) => {
      console.trace({ "getAuthenticated User error": err });
      res.status(500).json({ error: err.code });
      return;
    });
};

const markNotificationsRead = (req: UserData, res: Response) => {
  let batch = writeBatch(db);
  req.body.forEach((notificationId: string) => {
    const notificationRef = doc(db, "notifications", notificationId);
    batch.update(notificationRef, { read: true });
  });
  batch
    .commit()
    .then(() => {
      res.json({ message: "Notification marked read" });
      return;
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
      return;
    });
};

const setPushNotification = (req: userRequest, res: Response) => {
  console.log("finding out what token is", req.body.token);
  const notificationCredentials = {
    //        user:req.user.handle,
    token: req.body.token,
    //        image:req.user.imageUrl
  };

  let pushNotificationRef = collection(
    db,
    "pushNotification",
    req.user!.handle
  );
  addDoc(pushNotificationRef, notificationCredentials).then(() => {
    console.log("this is doc,", doc);
    res.status(200).send("OK");
    return;
  });
};

export {
  signUp,
  logIn,
  uploadUserImage,
  uploadCoverImage,
  addUserDetails,
  getUserDetails,
  getAuthenticatedUser,
};
