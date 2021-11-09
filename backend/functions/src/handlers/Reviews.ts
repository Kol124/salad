import { db } from "../util/admin";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  orderBy,
  setDoc,
  doc,
  getDoc,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { Response } from "express";
import { userRequest } from "../util/types";
import { getStorage, uploadBytes, ref } from "firebase/storage";
import config from "../util/config";
import * as BusBoy from "busboy";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

const getAllReviews = (req: userRequest, res: Response) => {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  getDocs(q)
    .then((data) => {
      let reviews: {}[] = [];
      data.forEach((doc) => {
        reviews.push({
          reviewId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
          title: doc.data().title,
          company: doc.data().company,
          rating: doc.data().rating,
          role: doc.data().role,
          position: doc.data().position,
          logo: doc.data().logo,
        });
      });
      return res.json(reviews);
    })
    .catch((err) => {
      console.trace({ "error from getAllReviews": err.message });
      return res.json([]);
    });
};

const postReview = (req: userRequest, res: Response) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ error: "Body must not be empty" });
  }

  const newReview = {
    body: req.body.body ? req.body.body : "",
    userHandle: req.user!.handle ? req.user!.handle : "",
    userImage: req.user!.imageUrl ? req.user!.imageUrl : "",
    title: req.body.title ? req.body.title : "",
    company: req.body.company ? req.body.company : "",
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    rating: req.body.rating ? req.body.rating : "",
    role: req.body.role ? req.body.role : "",
    position: req.body.position ? req.body.position : "",
    logo: req.body.logo ? req.body.logo : "",
  };
  console.log("[New review that is being created]", newReview);
  const reviewsRef = collection(db, "reviews");
  addDoc(reviewsRef, newReview)
    .then((doc) => {
      const resReview: DocumentData = newReview;
      resReview.reviewId = doc.id;
      return res.json({
        ...resReview,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
  return;
};

const reviewImage = (req: userRequest, res: Response) => {
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName: string;
  let imageToBeUploaded: { filepath?: string; mimeType?: string } = {};
  let filepath: string;
  let mimeType = "";
  let formData = new Map(); // doesnt have to be formdata, an object or array could have been used.

  busboy.on("field", function (fieldname, val) {
    formData.set(fieldname, val);
  });

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
      filepath = path.join(os.tmpdir(), imageFileName);
      console.log("this is file path ", filepath);
      imageToBeUploaded = { filepath, mimeType };
      file.pipe(fs.createWriteStream(filepath));
    }
  );
  busboy.on("finish", () => {
    if (formData.get("body").trim() === "") {
      return res.status(400).json({ error: "Body must not be empty" });
    }

    const newReview = {
      body: formData.get("body") ? formData.get("body") : "",
      userHandle: req.user!.handle ? req.user!.handle : "",
      userImage: req.user!.imageUrl ? req.user!.imageUrl : "",
      title: formData.get("title") ? formData.get("title") : "",
      company: formData.get("company") ? formData.get("company") : "",
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
      rating: formData.get("rating") ? formData.get("rating") : "",
      role: formData.get("role") ? formData.get("role") : "",
      position: formData.get("position") ? formData.get("position") : "",
      logo: formData.get("logo") ? formData.get("logo") : "",
      imageUrl: "",
    };

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
    imageToBeUploaded = { filepath, mimeType };
    // Create a reference to 'images/mountains.jpg'
    const metadata = {
      contentType: imageToBeUploaded.mimeType,
    };
    const fileContent = fs.readFileSync(imageToBeUploaded.filepath!);
    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, fileContent, metadata)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        console.log("[Image successfully uploaded now wetting it to user]");
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

        newReview.imageUrl = imageUrl;
        console.log("[New review that is being created]", newReview);
        const reviewsRef = collection(db, "reviews");
        addDoc(reviewsRef, newReview)
          .then((doc) => {
            const resReview: DocumentData = newReview;
            resReview.reviewId = doc.id;
            console.log("[ReviewData created]", doc);
            return res.json({
              ...resReview,
            });
          })
          .catch((err) => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
          });
      })
      .catch((err) => {
        res.status(500).json({ error: "something went wrong" });
        console.error(err);
      });
    return;
  });

  busboy.end(() => {
    console.log("[Image upload process successful]");
  });
};

const getReview = async (req: userRequest, res: Response) => {
  console.log("[checking req.params.reviewId]", req.params.reviewId);
  let reviewData: DocumentData = {};
  let reviewRef = doc(db, "reviews", req.params.reviewId);
  getDoc(reviewRef)
    .then(async (doc) => {
      if (!doc.exists()) {
        res.status(404).json({ error: "Review not found" });
        return;
      }
      reviewData = doc.data();
      reviewData.reviewId = doc.id;
      const commentsCollection = collection(db, "comments");
      const q = query(
        commentsCollection,
        where("reviewId", "==", req.params.reviewId),
        orderBy("createdAt", "desc")
      );
      return await getDocs(q);
    })
    .then((data: QuerySnapshot<DocumentData> | undefined) => {
      console.log("[comment data from getReview]", data);
      reviewData.comments = [];
      if (data) {
        data.forEach((doc) => {
          console.log("Foreach runs", doc, doc.data());
          reviewData.comments.push(doc.data());
        });
      }

      res.json(reviewData);
      return;
    })
    .catch((err) => {
      console.log({ "error from getScream": err });
      res.json([]);
      return;
    });
};

//Like a Review
const likeReview = async (req: userRequest, res: Response) => {
  console.log("LikeReview backend runs");
  // Accessing the likes collection
  const likedCollectionRef = collection(db, "likes");
  //setting up a query promise to get specific document
  const q = query(
    likedCollectionRef,
    where("userHandle", "==", req.user!.handle),
    where("id", "==", req.params.reviewId),
    limit(1)
  );
  // Pre-declaring the doc variable because final access point is a forEach which returns void
  let likeDocument: QueryDocumentSnapshot<DocumentData> | undefined = undefined;
  // Awaiting the result of the query and assigning it to the doc variable

  await getDocs(q).then((data) =>
    data.forEach((doc) => {
      likeDocument = doc;
    })
  );
  console.log("This is likeDocument after all the hoops", likeDocument);

  // setting a specific review document reference
  const docRef = doc(db, `review`, req.params.reviewId);
  // Getting the actual Document ... but its a promise ?
  const reviewSnap = getDoc(docRef);

  let reviewData: DocumentData = {};

  reviewSnap
    .then((doc) => {
      if (!doc.exists()) {
        reviewData = doc.data()!;
        reviewData.reviewId = doc.id;
        return likeDocument;
      } else {
        res.json({ error: "Review not found" });
        return;
      }
    })
    .then((data) => {
      if (!data!.exists()) {
        // addDoc(likedCollectionRef,{}) check if this has an ID 👇
        setDoc(doc(likedCollectionRef), {
          reviewId: req.params.reviewId,
          userHandle: req.user!.handle,
        });
        reviewData.likeCount++;
        updateDoc(docRef, { likeCount: reviewData.likeCount });
        return res.json(reviewData);
      } else {
        return res.json({ error: "review already liked" });
      }
    })
    .catch((err) => {
      console.trace("[error from like review]", err);
      /* res.json({ error: err.code }); */
    });
};

const unlikeReview = async (req: userRequest, res: Response) => {
  const likedCollectionRef = collection(db, "likes");
  const q = query(
    likedCollectionRef,
    where("userHandle", "==", req.user!.handle),
    where("reviewId", "==", req.params.reviewId),
    limit(1)
  );

  let likeDocument: QueryDocumentSnapshot<DocumentData>;
  // Awaiting the result of the query and assigning it to the doc variable
  const likeDocumentSnapshot: QuerySnapshot<DocumentData> | void =
    await getDocs(q).then((data) =>
      data.forEach((doc) => {
        likeDocument = doc;
      })
    );

  const reviewDocRef = doc(db, "reviews", req.params.reviewId);
  const reviewDoc = getDoc(reviewDocRef);

  let reviewData: DocumentData;
  reviewDoc
    .then((doc) => {
      if (doc.exists()) {
        // probably change this ...
        reviewData = doc.data();
        reviewData.reviewId = doc.id;
        return likeDocument;
      } else {
        res.status(404).json({ error: "Review not found" });
        return;
      }
    })
    .then((data) => {
      if (!data?.exists) {
        res.status(400).json({ error: "Review not liked" });
        return;
      } else {
        deleteDoc(doc(likedCollectionRef, data.id))
          .then(() => {
            reviewData.likeCount--;
            updateDoc(reviewDocRef, { likeCount: reviewData.likeCount });
          })
          .then(() => {
            res.json(reviewData);
            return;
          });
      }
    });
};

const commentOnReview = async (req: userRequest, res: Response) => {
  const { reviewId } = req.params;

  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    reviewId: req.params.reviewId,
    userHandle: req.user?.handle,
    userImage: req.user?.imageUrl,
  };

  const reviewRef = doc(db, "review", reviewId);

  return getDoc(reviewRef)
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).json({ error: "review not found" });
        return;
      }
      return updateDoc(reviewRef, {
        commentCount: doc.data()!.commentCount + 1,
      });
    })
    .then(() => {
      return addDoc(collection(db, "comments"), newComment);
    })
    .catch((err) => {
      console.log("[error from commentOnreview]", err);
      res.status(500).json({ error: "Something went wrong" + err });
      return;
    });
};

const deleteReview = (req: userRequest, res: Response) => {
  const reviewRef = doc(db, "reviews", req.params.reviewId);
  getDoc(reviewRef)
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).json({ error: "Review not found" });
        return;
      }
      if (doc.data()?.userHandle !== req.user?.handle) {
        res.status(403).json({ error: " Unauthorized" });
        return;
      } else {
        deleteDoc(reviewRef);
      }
    })
    .then(() => {
      res.json({ message: "Review Deleted" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

export {
  getAllReviews,
  postReview,
  likeReview,
  unlikeReview,
  getReview,
  deleteReview,
  commentOnReview,
};
