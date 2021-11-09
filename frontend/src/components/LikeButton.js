import React from "react";
import useStore from "../store/useStore";
import { useHistory } from "react-router";
function LikeButton({ reviewId }) {
  const history = useHistory();
  const { user, likeReview, unlikeReview, authenticated } = useStore();
  let likedReview = () => {
    if (user.likes && user.likes.find((like) => like.reviewId === reviewId))
      return true;
    else return false;
  };
  let likeReviewFunc = () => {
    // console.log("likeReview function runs on button clike")
    likeReview(reviewId);

    //console.log("props.likeReview",likeReview)
  };
  let unlikeReviewFunc = () => {
    unlikeReview(reviewId);
  };
  return !authenticated ? (
    <i
      id="like"
      onClick={() => {
        history.push("/");
      }}
    ></i>
  ) : likedReview() ? (
    <i
      id="like"
      onClick={() => {
        unlikeReviewFunc(reviewId);
      }}
    ></i>
  ) : (
    <i
      id="like"
      onClick={() => {
        likeReviewFunc(reviewId);
      }}
    ></i>
  );
}

export default LikeButton;
