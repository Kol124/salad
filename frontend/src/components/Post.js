import React from "react";
import styled from "styled-components";
import defaultImg from "../assets/Salad Images/Rectangle 16.png";
import vector8 from "../assets/Vector-8.svg";
import vector9 from "../assets/Vector-9.svg";
import vector10 from "../assets/Vector-10.svg";
import LikeButton from "./LikeButton";
import useStore from "../store/useStore";
import postImg from "../assets/Salad Images/Rectangle-post.png";

function Post({ details }) {
  const { toggleFullReview } = useStore();
  // TODO: update post review and get review to contain all these parameters
  const {
    reviewId,
    body,
    userHandle,
    createdAt,
    commentCount,
    likeCount,
    userImage,
    title,
    company,
    rating,
    role,
    position,
    logo: logo,
  } = details;

  return (
    <StyledPost className="post-container">
      <div className="post-header">
        {logo ? <img src={logo} className="company-logo" /> : null}
        <div className="stars">{rating}</div>
      </div>
      <div className="post-body">
        <img src={postImg} alt="" className="post-img" />
        <div className="post-content">
          <div className="title">{title}</div>
          <div className="abstract">{body}</div>
          <div className="options-container">
            <div className="options">continue reading</div>
            <div className="options">2 minutes</div>
          </div>
          <div className="profile">
            <img
              src={userImage ? userImage : defaultImg}
              alt=""
              className="user-img"
            />
            <div className="userdetails-container">
              <div className="user-details">
                <div className="user-name">{userHandle}</div>
                <div className="user-role">{role}</div>
              </div>
              <div className="contact-container">
                <LikeButton reviewId={reviewId} />
                {likeCount}
                <i
                  id="comment"
                  onClick={() => {
                    toggleFullReview(reviewId);
                  }}
                ></i>{" "}
                {commentCount}
                <i id="share"></i>
              </div>
            </div>
          </div>
          <div className="tag-container">
            <div className="tag">{position}</div>
            {/* <div className="tag">{opinion}</div> */}
          </div>
        </div>
      </div>
    </StyledPost>
  );
}

export default Post;

const StyledPost = styled.div`
  @media (max-width: 1000px) {
    .post-body {
      flex-direction: column !important;
      .post-img {
        width: 100% !important;
      }
      .post-content {
        padding: 0 !important;
      }
    }
  }
  .post-container {
    width: 100%;
    border-radius: 20px;
    padding: 10px 20px;
    background-color: ${({ theme }) => theme.cardBackground};
    margin-bottom: 20px;

    .post-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .company-logo {
        width: 50px;
        height: 50px;
      }
      .stars {
        width: 100%;
        height: 15px;
      }
    }
    .post-body {
      display: flex;
      justify-content: center;
    }

    .post-img {
      width: 35%;
      height: 205px;
      border-radius: 20px;
    }
    .post-content {
      padding-left: 20px;
      padding-bottom: 15px;
      .title {
        font-size: 1.3rem;
        font-weight: 700;
        color: ${({ theme }) => theme.title};
      }
      .abstract {
        color: ${({ theme }) => theme.textColor};
        width: 100%;
        max-height: 65%;
        justify-content: center;
        text-align: justify;
        position: relative;
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
      }
      .options-container {
        display: flex;
        justify-content: space-between;
        .options {
          &:nth-child(1) {
            color: ${({ theme }) => theme.accent};
          }
          &:nth-child(2) {
            color: ${({ theme }) => theme.textColor};
            font-weight: 400;
          }
        }
      }
      .profile {
        display: flex;
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
          padding-left: 10px;
          .user-details {
            .user-name {
              color: ${({ theme }) => theme.title};
              font-size: 1.2rem;
            }
            .user-role {
              color: ${({ theme }) => theme.textColor};
            }
          }

          .contact-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30%;
            #like,
            #comment,
            #share {
              width: 50px;
              height: 50px;
            }
            #like {
              background: url(${vector8}) no-repeat center;
            }
            #comment {
              background: url(${vector9}) no-repeat center;
            }
            #comment {
              background: url(${vector10}) no-repeat center;
            }
          }
        }
      }
      .tag-container {
        display: flex;
        align-items: center;
        color: var(--text-color);
        padding-left: 50px;
        .tag {
          border-radius: 20px;
          padding: 5px 10px;
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
  }
`;
