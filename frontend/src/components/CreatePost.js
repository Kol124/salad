import React, { useState } from "react";
import styled from "styled-components";
import useStore from "../store/useStore";
import Photo from "../assets/Salad post/Photo.svg";
import Video from "../assets/Salad post/Video.svg";
import Event from "../assets/Salad post/Event.svg";
import Article from "../assets/Salad post/Article.svg";
import Send from "../assets/Salad post/Send.svg";

/* import {ReactComponent  as Send} from "../assets/Salad post/Send.svg"; */
function CreatePost() {
  const { post, submitReview, togglePost } = useStore();
  const [title, setTitle] = useState();
  const [abstract, setAbstract] = useState();
  const [status, setStatus] = useState();
  const [formData, SetFormData] = useState();
  const [company, setCompany] = useState("dummyCompany");
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    SetFormData(formData);
  };

  const handleImageUploadClick = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  return (
    <StyledCreatePost post={post}>
      <div class="create-post-container">
        <div className="post-grid-container">
          <img src="../assets/Rectangle 16.svg" alt="" className="user-img" />
          {/* TODO: implement the search company function */}
          <input type="text" className="searchbox" placeholder="search" />
          <div className="close" onClick={togglePost}></div>
          <input
            type="text"
            className="title"
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <textarea
            type="text"
            className="abstract"
            placeholder="Write Something"
            onChange={(e) => {
              setAbstract(e.target.value);
            }}
          ></textarea>
          <div className="dropdown">
            <select
              id="rewvier-status"
              name="cars"
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            >
              <option value="Employee">Employee</option>
              <option value="Employer">Employer</option>
              <option value="Intern">Intern</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="base-buttons">
            <div className="icons" onClick={handleImageUploadClick}>
              <input
                id="imageInput"
                type="file"
                hidden={true}
                onChange={handleImageChange}
              ></input>
            </div>
            <div className="icons"></div>
            <div className="icons"></div>
            <div className="icons"></div>
            <div
              className="icons"
              onClick={() => {
                submitReview(title, abstract, status, company, formData);
                togglePost();
              }}
            >
              {/* <Send/> */}
            </div>
          </div>
        </div>
      </div>
      <div class="shadow"></div>
    </StyledCreatePost>
  );
}

export default CreatePost;

const StyledCreatePost = styled.div`
  .create-post-container {
    width: 80%;
    position: fixed;
    padding-top: 10px;
    border-radius: 20px;
    top: 25%;
    z-index: 5;
    background-color: #fff;
    height: 380px;
    max-width: 798px;
    left: 50%;
    transform: translate(-50%, 0);
    ${({ post }) => {
      return post ? `display:block;` : `display:none;`;
    }}
    @media (max-width:905px) {
      width: 95%;
      padding: 20px;
      .title {
        grid-area: 2/1/2 / span 5 !important;
      }
      .abstract {
        grid-area: 3/1/3 / span 5 !important;
      }
      .dropdown {
        grid-area: 4/1/4 / span 5 !important;
      }
    }

    .post-grid-container {
      display: grid;
      grid-template: 10% 20% 30% 20% 20% / 10% 1fr 10%;
      grid-gap: 20px;
      margin-top: 20px;
      .user-img {
        border-radius: 50%;
        grid-area: 1/1;
        width: 100%;
        padding-left: 10px;
        //height: 10%;
      }
      .searchbox {
        grid-area: 1/2;
        width: 100%;
        border-radius: 20px;
        position: relative;
        border: 1px solid;
        padding: 20px;
        background-color: #fff;
        &::placeholder {
          content: "search salad";
          color: transparentize(rgb(149, 149, 149), 0.5);
          font-weight: 400;
        }
        &::before {
          content: "";
          position: absolute;
          width: 30px;
          height: 30px;
          /* TODO: Fix search icon not showing */
          background: url("../assets/search.svg");
        }
      }
      .close {
        grid-area: 1/3;
        background: url("../assets/close.svg") no-repeat center;
      }
      .title {
        grid-area: 2/2;
        border: none;
        padding: 10px;
        border-radius: 20px;
        background-color: rgb(246, 246, 246);
        height: 100%;
        width: 100%;
        padding-left: 20px;
        //background-color: #fff;
      }
      .abstract {
        grid-area: 3/2;
        border: none;
        padding: 10px;
        border-radius: 20px;
        background-color: rgb(246, 246, 246);
        height: 100%;
        width: 100%;
        padding-left: 20px;
        //background-color: #fff;
      }
      .dropdown {
        grid-area: 4/2;
        select {
          border: none;
          padding: 10px;
          border-radius: 20px;
          background-color: rgb(246, 246, 246);
          height: 100%;
          width: 100%;
          //background-color: #fff;
        }
      }
      .base-buttons {
        grid-area: 5/1 /5 / span 5;
        display: flex;
        height: 100%;
        .icons {
          background-color: #ddeaf0;
          width: 100%;
          //height: 20%;

          &:nth-child(1) {
            background: url(${Photo}) #ddeaf0 no-repeat center;
          }
          &:nth-child(2) {
            background: url(${Video}) #ddeaf0 no-repeat center;
          }
          &:nth-child(3) {
            background: url(${Event}) #ddeaf0 no-repeat center;
          }
          &:nth-child(4) {
            background: url(${Article}) #ddeaf0 no-repeat center;
          }
          &:nth-child(5) {
            background: url(${Send}) #bfe5f7 no-repeat center;
          }
        }
      }
    }
  }
  .shadow {
    ${({ post }) => (post ? `display:block;` : `display:none;`)}
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
