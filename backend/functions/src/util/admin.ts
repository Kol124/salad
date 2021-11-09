import * as admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import config from "./config";
var serviceAccount = require("../../../service-account-key/salad-72030-firebase-adminsdk-7df9k-87d027c79d.json");
admin.initializeApp({
  /* credential: admin.credential.cert(
    JSON.parse(process.env.SERVICE_ACCOUNT_KEY!)
  ), */
  credential: admin.credential.cert(serviceAccount),

  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const app = initializeApp(config);
const db = getFirestore();

//const db = admin.database();
//module.exports = { admin, db };

export { admin, db, app };
