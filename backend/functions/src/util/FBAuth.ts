import { db, admin } from "./admin";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { NextFunction, Response } from "express";
import { userRequest } from "./types";

const FBAuth = (
  req: userRequest,
  res: Response,
  next: NextFunction
): NextFunction | Response | undefined => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      console.log("decodedToken", decodedToken);
      req.user = decodedToken;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userId", "==", req.user.uid), limit(1));

      await getDocs(q)
        .then((data) => {
          //console.log("FBAuth, get single data", data);
          //console.log("data.docs", data.docs);
          data.forEach((userDetails) => {
            req.user!.handle = userDetails.data().handle;
            console.log("getting handle", userDetails.data());
            req.user!.imageUrl = userDetails.data().imageUrl;
          });
          /* req.user.handle = data.docs[0].handle;
            console.log("getting handle", req.user.handle)
            req.user.imageUrl = data[0].doc.data()!.imageUrl; */
          return next();
        })
        .catch((err) => {
          console.error("Error while verifying token", err);
          return res.status(403).json(err);
        });
    });
  //console.log({userLoginToken:decodedToken})
  return;
};

export default FBAuth;
