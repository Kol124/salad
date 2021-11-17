import React, { useState } from "react";
import styled from "styled-components";
import useStore from "../store/useStore";

function FullReview() {
  const { singleReview, toggleFullReview, submitComment, fullReview } =
    useStore();
  const [commentText, setCommentText] = useState("");

  return (
    <StyledFullReview className="single-post-container" toggle={fullReview}>
      <div className="post-header">
        <div className="company-logo"></div>
        <div className="stars"></div>
        <div className="close" onClick={toggleFullReview}></div>
      </div>
      <div className="post-body">
        <img
          src="assets/Salad Images/Rectangle 21.png"
          alt=""
          className="post-img"
        />
        <div className="post-content">
          <div className="title">{singleReview.title}</div>
          <div className="abstract">{singleReview.body}</div>

          <div className="profile">
            <img
              src={
                singleReview.imageUrl
                  ? singleReview.imageUrl
                  : "assets/Salad Images/Rectangle 16.png"
              }
              alt=""
              className="user-img"
            />
            <div className="userdetails-container">
              <div className="user-details">
                <div className="user-name">{singleReview.userHandle}</div>
                <div className="user-role">{singleReview.role}</div>
              </div>
            </div>
          </div>
          {/* <div className="tag-container">
          <div className="tag">Employee</div>
          <div className="tag">Will Recommend</div>
        </div> */}
        </div>
      </div>

      <div className="comments-container">
        {singleReview.comments.map((comment) => {
          return (
            <Comments
              userHandle={comment.userHandle}
              userImage={comment.userImage}
              body={comment.body}
            />
          );
        })}
      </div>
      <div className="send-comment-container">
        <input
          type="text"
          className="comment-input"
          placeholder="Write comment"
          onChange={setCommentText}
        />
        <button
          className="sendBtn"
          onClick={() => {
            submitComment(singleReview.reviewId, commentText);
          }}
        ></button>
      </div>
      <div className="shadow"></div>
    </StyledFullReview>
  );
}

export default FullReview;

const Comments = ({ userHandle, userImage, body }) => {
  return (
    <div className="comment">
      <img
        src={userImage ? userImage : "assets/Salad Images/Rectangle 16.png"}
        alt=""
        className="userImage"
      />
      <div className="comment-content">
        <h2>{userHandle}</h2>
        <p>{body}</p>
      </div>
    </div>
  );
};

const StyledFullReview = styled.div`
  width: 90%;
  border-radius: 20px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.cardBackground};
  margin-bottom: 20px;
  position: fixed;
  z-index: 4;
  top: 10px;
  max-width: 650px;
  ${({ toggle }) => {
    return !toggle ? `display:block;` : `display:none;`;
  }}
  .post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .company-logo {
      background: url("../assets/Salad Images/Vector.png") no-repeat center;
      width: 50px;
      height: 50px;
    }
    .stars {
      // add the star system from previous systems
      width: 100%;
      height: 15px;
    }
    .close {
      background: url("../assets/close.svg") no-repeat center;
      width: 50px;
      height: 50px;
    }
  }
  .post-body {
    display: flex;
    justify-content: center;
    flex-direction: column;
    max-height: 360px;
    overflow: scroll;
  }

  .post-img {
    background-image: url("../assets/Salad Images/Rectangle 21.png");
    width: 100%;
    height: 205px;
    border-radius: 20px;
  }
  .post-content {
    padding: 0;
    .title {
      font-size: 1.3rem;
      font-weight: 700;
      color: ${({ theme }) => theme.title};
    }
    .abstract {
      color: ${({ theme }) => theme.textColor};
      width: 100%;
      max-height: 65%;
      overflow: scroll;
      justify-content: center;
      text-align: justify;
      position: relative;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
    }

    .profile {
      display: flex;
      flex-direction: row-reverse;
      margin-top: 20px;
      .user-img {
        border-radius: 50%;
        width: 50px;
        height: 50px;
      }
      .userdetails-container {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        flex-direction: row-reverse;
        padding-right: 10px;
        //justify-content: center;
        //flex-direction: column;

        .user-details {
          .user-name {
            color: var(--title);
            font-size: 1.2rem;
          }
          .user-role {
            color: ${({ theme }) => theme.textColor};
          }
        }
      }
    }
    .tag-container {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      //justify-content: f;
      color: ${({ theme }) => theme.textColor};
      padding-left: 50px;
      //transform: translateX(-1%);
      .tag {
        border-radius: 20px;
        padding: 5px 10px;
        //margin-right: 5px;
        text-align: center;
        &:nth-child(1) {
          background-color: rgb(200, 237, 255);
        }
        &:nth-child(2) {
          background-color: rgb(224, 224, 224);
        }
      }
    }
  }
  .comments-container {
    overflow: scroll;
    max-height: 300px;
    .comment {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 10px;
      .userImage {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      .comments-content {
      }
    }
  }
  .send-comment-container {
    display: flex;
    .comment-input {
      width: 100%;
      border-radius: 20px 0 0 20px;
      position: relative;
      border: none;
      padding: 20px;
      border: 1px solid #bfe5f7;
    }
    .sendBtn {
      background: url("../assets/Salad post/Send.svg")
        ${({ theme }) => theme.accent} no-repeat center;
      width: 65px;
      border-radius: 0 20px 20px 0;
      border: none;
      height: 60px;
    }
  }

  .shadow {
    ${({ toggle }) => (!toggle ? `display:block;` : `display:none;`)}
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    pointer-events: none;
    position: fixed;
    z-index: 4;
    top: 0;
    left: 0;
  }
`;
