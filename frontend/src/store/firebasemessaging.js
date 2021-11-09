import React from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import axios from "axios";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken,
} from "firebase/messaging";
import config from "../util/config";
import useStore from "./useStore";

const app = initializeApp(config);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

// Add the public key generated from the console here.

const setToken = (value) => {
  if (value === true) {
    localStorage.setItem("TokenSet", "true");
  } else {
    localStorage.setItem("TokenSet", "false");
  }
};

const getSavedToken = () => {
  //console.trace("checking Tokenset status",localStorage.getItem("TokenSet"))
  return localStorage.getItem("TokenSet");
};

const requestPermission = () => {
  if (localStorage.getItem("FBIdToken")) {
    if (getSavedToken() === "false" || getSavedToken() === null) {
      Notification.requestPermission()
        .then(() =>
          getToken(messaging, { vapidKey: process.env.vapidKey }).then(
            (token) => {
              axios
                .post("/pushNotification", { token })
                .then(() => {
                  console.log("Setting local storage TokenSet to true");
                  setToken(true);
                })
                .catch((err) => {
                  console.log("error sending from axios :(", err);
                });
            }
          )
        )
        .catch((err) => {
          console.log("error getting permission :(", err);
        });
    }
  }
};

const OnMessage = () => {
  //const { setNotification } = useStore();
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    navigator.serviceWorker.getRegistration().then(function (reg) {
      reg.showNotification("Hello world!");
    });
    //TODO: FIx notification getter
    //setNotification();
  });
  return <></>;
};

/* const tokenRefresh = () =>{
    onTokenRefresh(() => {
        getToken()
        .then((token) => {
            axios.post("/pushNotification",{body: JSON.stringify({ token: token })});
            console.log("token refreshed")
        })
        .catch((err) => {
          console.log("Unable to retrieve refreshed token ", err);
        });
          })
     
} */

const deleteSavedToken = () => {
  // Delete Instance ID token.
  // [START delete_token]
  getToken(messaging, { vapidKey: process.env.vapidKey })
    .then((currentToken) => {
      deleteToken(currentToken)
        .then(() => {
          console.log("Token deleted.");
          setToken(false);
        })
        .catch((err) => {
          console.log("Unable to delete token. ", err);
        });
      // [END delete_token]
    })
    .catch((err) => {
      console.log("Error retrieving Instance ID token. ", err);
    });
};

export { requestPermission, OnMessage, deleteSavedToken };
