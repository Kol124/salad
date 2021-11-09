import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import jwtDecode from "jwt-decode";
import axios from "axios";
import {
  requestPermission,
  OnMessage,
  deleteSavedToken,
} from "./firebasemessaging";
const cors = require("cors");

// TODO: add backend base url
axios.defaults.baseURL = process.env.APP_API_URL;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
};

function useGlobalState() {
  const [token, setToken] = useState();
  const [authenticated, setAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [fullReview, setFullReview] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [singleReview, setSingleReview] = useState();
  const [user, setUser] = useState({});
  const history = useHistory();

  // const HelloWorld = () => {
  //   console.log("hello world!");
  //   return "Hello World";
  // };

  /* UI Functions */
  const [drawer, setDrawer] = useState(false);
  const [post, setPost] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);
  const toggleDrawer = () => {
    setDrawer(drawer ? false : true);
  };

  const togglePost = () => {
    setPost(post ? false : true);
  };

  const toggleFullReview = (reviewId) => {
    if (reviewId) getReview(reviewId);
    setFullReview(fullReview ? false : true);
  };

  const toggleUpdateUser = () => {
    setUpdateUser(updateUser ? false : true);
  };
  /* UI functions End */

  /* User Functions */
  const LoginCheck = () => {
    setToken(localStorage.getItem("FBIdToken"));

    if (token) {
      const decodedToken = jwtDecode(token);
      //console.log("this is decoded token,", decodedToken)
      if (decodedToken.exp * 1000 < Date.now()) {
        Logout();
        history.push("/login");
        deleteSavedToken();
      } else {
        setAuthorization(token);
        getUser();
        requestPermission();
        OnMessage();
      }
    }
  };

  const Login = (username, password) => {
    let userData = { username, password };
    console.log(userData);
    axios
      .post("/login", userData, {
        headers,
      })
      .then((res) => {
        console.log(res.data.token);
        setToken(res.data.token);
        setAuthorization(token);
        getUser();
        setErrors([]);
        requestPermission();
        OnMessage();
        history.push("/");
      });
  };

  const Logout = () => {
    axios.post("/logout");
    localStorage.removeItem("FBIdToken");
    delete axios.defaults.headers.common["Authorization"];
    setAuthenticated(false);
    deleteSavedToken();
    history.push("/");
  };

  const Signup = (email, username, password, confirmPassword) => {
    let userData = { email, username, password, confirmPassword };
    console.log(userData);

    axios
      .post(
        `http://localhost:5001/salad-72030/us-central1/api/signup`,
        userData,
        { headers }
      )
      .then((token) => {
        console.log(token);
        setToken(token);
        console.log("Set token !!!");
        setAuthorization(token);
        getUser();
        setErrors([]);
        history.push("/");
      });
  };

  const googleSignup = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("%c User Details:", "color:green", user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const setNotification = () => {
    axios
      .get("/user")
      .then((res) => {
        setNotification(res.data);
      })
      .catch((err) => {
        console.log({ "getUserData error": err });
      });
  };

  const uploadUserImage = (formData) => {
    axios
      .post("/user/image", formData, { headers: formData.getHeaders() })
      .then(() => {
        getUser();
      })
      .catch((err) => {
        console.log("[this is error from uploadUserImage]", err);
      });
  };

  const uploadCoverImage = (formData) => {
    axios
      .post("/user/coverImage", formData, { headers: formData.getHeaders() })
      .then(() => {
        getUser();
      })
      .catch((err) => {
        console.log("[this is error from uploadCoverImage]", err);
      });
  };

  const editUserDetails = (userDetails, userImage, coverImage) => {
    axios
      .post("/user", userDetails)
      .then(() => {
        getUser();
      })
      .catch((err) => console.log);
    if (userImage) {
      uploadUserImage(userImage);
    }
    if (coverImage) {
      uploadCoverImage(coverImage);
    }
  };

  const markNotificationsRead = (notificationsIds) => {
    axios
      .post("/notifications", notificationsIds)
      .then((res) => {
        setNotification((old) => old.map((not) => (not.read = true)));
      })
      .catch((err) => console.log);
  };

  const setAuthorization = (token) => {
    setAuthenticated(true);
    const FBIdToken = `Bearer ${token}`;
    console.log("[authorization token]", FBIdToken); // [DEBUGGING]
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
    requestPermission();
  };

  const getUser = () => {
    setUser(null);
    axios.get("/user").then((res) => {
      setUser(res.data);
    });
  };

  /* Review Functions */
  // Post a review
  const submitReview = (title, body, status, company, formData) => {
    if (!formData) {
      axios
        .post("/review", { title, body, status, company })
        .then((res) => {
          console.log(res.data);
          setAllReviews((old) => old.unshift(res.data));
        })
        .catch((err) => console.error);
    } else {
      formData.append("title", title);
      formData.append("body", body);
      formData.append("status", status);
      formData.append("company", company);
      axios
        .post("/reviewImage", formData, { headers: formData.getHeaders() })
        .then((res) => {
          console.log(res.data);
          setAllReviews((old) => old.unshift(res.data));
        })
        .catch((err) => console.error);
    }

    // TODO: create a real time listener to autoupdate *when the user wishes* the timeine
    // Probably use on scroll up exceed top or simple button with update now
  };

  // get All Reviews
  // TODO: find out where this function is actually called
  const getAllReviews = () => {
    setAllReviews(null);
    axios.get("/reviews").then((res) => {
      if (res.data.length !== 0) {
        setAllReviews(res.data);
      } else {
        //console.log("%c [dummy code executed ]", "color:yellow");
        setAllReviews([
          {
            userHandle: "user",
            body: "this is a dummy Review used for debug purposes, code should be removed in production",
            createdAt: "2020-03-20T15:03:11.656Z",
            likeCount: 5,
            commentCount: 2,
            reviewId: "2345678909876",
          },
        ]);
      }
    });
  };

  // get Single Review
  const getReview = (reviewId) => {
    setSingleReview(null);
    axios
      .get(`/review/${reviewId}`)
      .then((res) => {
        setSingleReview(res.data);
      })
      .catch((err) => {
        setSingleReview({});
        console.log("%c [Error from getReview]", "color:pink", err);
      });
  };

  const likeReview = (reviewId) => {
    axios
      .post(`/review/${reviewId}/like`)
      .then((res) => {
        console.log(res.data);
        let index = allReviews.findIndex(
          (review) => review.reviewId === res.data.reviewId
        );
        //TODO: confirm that this is state updating
        setAllReviews((old) => {
          old[index] = res.data;
        });
        if (singleReview.reviewId === res.data.reviewId)
          setSingleReview(res.data);
      })
      .catch((err) => console.error);
  };

  const unlikeReview = (reviewId) => {
    axios
      .post(`/review/${reviewId}/unlike`)
      .then((res) => {
        console.log(res.data);
        let index = allReviews.findIndex(
          (review) => review.reviewId === res.data.reviewId
        );
        //TODO: confirm that this is state updating
        setAllReviews((old) => {
          old[index] = res.data;
        });
        if (singleReview.reviewId === res.data.reviewId)
          setSingleReview(res.data);
      })
      .catch((err) => console.error);
  };

  const submitComment = (reviewId, commentData) => {
    axios.post(`/review/${reviewId}/comment`, commentData).then((res) => {
      setSingleReview((old) => {
        return { ...old, comments: [old.comments, ...res.data] };
      });
      setErrors([]);
    });
  };

  const deleteReview = (reviewId) => {
    axios
      .delete(`/review/${reviewId}`)
      .then(() => {
        let index = allReviews.findIndex(
          (review) => review.reviewId === reviewId
        );
        setAllReviews((old) => old.splice(index, 1));
      })
      .catch((err) => console.log(err));
  };

  const getUserData = (userHandle) => {
    console.log("getUser data runs");
    axios
      .get(`/user/${userHandle}`)
      .then((res) => {
        setAllReviews(res.data);
      })
      .catch(() => {
        setErrors(null);
      });
  };

  // LoginCheck();
  useEffect(() => {
    LoginCheck();
  }, []);

  return {
    user,
    authenticated,
    drawer,
    toggleDrawer,
    post,
    togglePost,
    fullReview,
    toggleFullReview,
    singleReview,
    Login,
    Signup,
    submitReview,
    setNotification,
    googleSignup,
    editUserDetails,
    markNotificationsRead,
    updateUser,
    toggleUpdateUser,
    submitComment,
    getAllReviews,
    likeReview,
    unlikeReview,
    deleteReview,
    getUserData,
  };
}

export default useGlobalState;
