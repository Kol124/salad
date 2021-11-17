import * as functions from "firebase-functions";
import * as express from "express";
import {
  logIn,
  signUp,
  uploadUserImage,
  uploadCoverImage,
} from "./handlers/users";
import * as cors from "cors";
import { db, admin } from "./util/admin";
import {
  commentOnReview,
  deleteReview,
  getAllReviews,
  getReview,
  likeReview,
  postReview,
  unlikeReview,
} from "./handlers/Reviews";
import FBAuth from "./util/FBAuth";
import { writeBatch } from "firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

// Users
app.post("/login", logIn);
app.post("/signup", signUp);
app.post("/user/image", FBAuth, uploadUserImage);
app.post("/user/coverImage", FBAuth, uploadCoverImage);
// reviews routes
app.get("/reviews", getAllReviews);
app.post("/review", FBAuth, postReview);
app.post("/comment/:reviewId", FBAuth, commentOnReview);
app.get("/review/:reviewId", FBAuth, getReview);
app.delete("/review:reviewId", FBAuth, deleteReview);
app.post("/like/:reviewId", FBAuth, likeReview);
app.post("/unlike/:reviewId", FBAuth, unlikeReview);

exports.api = functions.https.onRequest(app);

interface pushNotificationInfoType {
  review?: string;
  sender?: string;
  recipient?: string;
  image?: string;
}

exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate(async (snapshot) => {
    console.log("creating notification on like");
    var pushNotificationInfo: pushNotificationInfoType = {};
    pushNotificationInfo.review = snapshot.data().reviewId;
    let reviewRef = doc(db, "reviews", snapshot.data().reviewId);
    await getDoc(reviewRef).then(async (document) => {
      if (
        document.exists() &&
        document.data().userHandle !== snapshot.data().userHandle
      ) {
        console.log("creating notification on like passed if statement");
        pushNotificationInfo.recipient = document.data()!.userHandle;
        pushNotificationInfo.sender = snapshot.data().userHandle;

        let notificationsRef = collection(db, "notifications", snapshot.id);
        await addDoc(notificationsRef, {
          createdAt: new Date().toISOString(),
          recipient: document.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "like",
          read: false,
          reviewId: document.id,
        }).then(async () => {
          let userRef = doc(db, "users", pushNotificationInfo.sender!);
          await getDoc(userRef)
            .then((doc) => {
              pushNotificationInfo.image = doc.data()!.imageUrl;
              return;
            })
            .then(() => {
              let pushNotificationRef = doc(
                db,
                "pushNotification",
                pushNotificationInfo.recipient!
              );
              getDoc(pushNotificationRef).then((doc) => {
                const token = doc.data()!.token;

                const title = JSON.stringify(
                  `${pushNotificationInfo.sender} liked  your review !`
                );
                const icon = JSON.stringify(`${pushNotificationInfo.image}`);
                const click = `users/${pushNotificationInfo.recipient}/review/${pushNotificationInfo.review}`;

                console.log("title", title);
                console.log("icon", icon);
                console.log("click", click);

                var payload = {
                  data: {
                    title: title,
                    body: "Notification from Salad",
                    icon: icon,
                    click: click,
                  },
                  token: token,
                };

                admin
                  .messaging()
                  .send(payload)
                  .then((response) => {
                    // Response is a message ID string.
                    console.log("Successfully sent message:", response);
                  })
                  .catch((error) => {
                    console.log("Error sending message:", error);
                  });
              });
            })
            .catch((err) => {
              console.error(err);
            });
        });
      }
    });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    console.log("deleting notification on unlike");
    deleteDoc(doc(db, "notifications", snapshot.id)).catch((err) => {
      console.error(err);
      return;
    });
  });

exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate(async (snapshot) => {
    console.log("creating notification on comment");
    var pushNotificationInfo: pushNotificationInfoType = {};
    pushNotificationInfo.review = snapshot.data().reviewId;
    let reviewRef = doc(db, "reviews", snapshot.data().reviewId);
    await getDoc(reviewRef).then(async (document) => {
      if (
        document.exists() &&
        document.data().userHandle !== snapshot.data().userHandle
      ) {
        console.log("creating notification on comment passed if statement");
        pushNotificationInfo.recipient = document.data().userHandle;
        pushNotificationInfo.sender = snapshot.data().userHandle;

        let notificationsRef = collection(db, "notifications", snapshot.id);
        await addDoc(notificationsRef, {
          createdAt: new Date().toISOString(),
          recipient: document.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "comment",
          read: false,
          reviewId: document.id,
        }).then(async () => {
          let userRef = doc(db, "users", pushNotificationInfo.sender!);
          await getDoc(userRef)
            .then((doc) => {
              pushNotificationInfo.image = doc.data()!.imageUrl;
              return;
            })
            .then(() => {
              let pushNotificationRef = doc(
                db,
                "pushNotification",
                pushNotificationInfo.recipient!
              );
              getDoc(pushNotificationRef).then((doc) => {
                const token = doc.data()!.token;

                const title = JSON.stringify(
                  `${pushNotificationInfo.sender} commented on your review !`
                );
                const icon = JSON.stringify(`${pushNotificationInfo.image}`);
                const click = `users/${pushNotificationInfo.recipient}/review/${pushNotificationInfo.review}`;

                console.log("title", title);
                console.log("icon", icon);
                console.log("click", click);

                var payload = {
                  data: {
                    title: title,
                    body: "Notification from Salad",
                    icon: icon,
                    click: click,
                  },
                  token: token,
                };

                admin
                  .messaging()
                  .send(payload)
                  .then((response) => {
                    // Response is a message ID string.
                    console.log("Successfully sent message:", response);
                  })
                  .catch((error) => {
                    console.log("Error sending message:", error);
                  });
              });
            })
            .catch((err) => {
              console.error(err);
            });
        });
      }
    });
  });

exports.onUserImageChange = functions.firestore
  .document("user/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());

    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("Image has changed");

      let batch = writeBatch(db);
      let reviewRef = collection(db, "reviews");
      let q = query(
        reviewRef,
        where("userhandle", "==", change.before.data().handle)
      );

      getDocs(q).then((data) => {
        data.forEach((document) => {
          let reviewRef = doc(db, "review", document.id);
          batch.update(reviewRef, { userImage: change.after.data().imageUrl });
        });
        return batch.commit();
      });
    } else return true;
    return;
  });

exports.onReviewDelete = functions.firestore
  .document("/review/{reviewId}")
  .onDelete(async (snapshot, context) => {
    const reviewId = context.params.reviewId;
    const batch = writeBatch(db);
    const commentCollection = collection(db, "comments");
    const q = query(commentCollection, where("reviewId", "==", reviewId));
    await getDocs(q)
      .then(async (data) => {
        data.forEach((document) => {
          batch.delete(doc(db, "comments", document.id));
        });
        const likeCollection = collection(db, "likes");
        const q = query(likeCollection, where("reviewId", "==", reviewId));
        await getDocs(q).then((data) => {
          data.forEach(async (document) => {
            batch.delete(doc(db, "likes", document.id));
            const notificationCollection = collection(db, "notifications");
            const q = query(
              notificationCollection,
              where("reviewId", "==", reviewId)
            );
            await getDocs(q).then((data) => {
              data.forEach((document) => {
                batch.delete(doc(db, "notifications", document.id));
              });
              batch.commit();
              return;
            });
          });
        });
      })
      .catch((err) => console.error(err));
  });
