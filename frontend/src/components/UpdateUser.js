import React, { useState } from "react";
import styled from "styled-components";
import useStore from "../store/useStore";

function UpdateUser() {
  const { editUserDetails, updateUser, toggleUpdateUser } = useStore();

  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [userImage, setUserImage] = useState();
  const [coverImage, setCoverImage] = useState();

  const handleUserImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    setUserImage(formData);
  };

  const handleCoverImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    setCoverImage(formData);
  };

  const handleImageUploadClick = (imageId) => {
    const fileInput = document.getElementById(imageId);
    fileInput.click();
  };

  return (
    <StyledUpdateUser className="update-user-container" toggle={updateUser}>
      <div className="close" onClick={toggleUpdateUser}></div>
      <input
        type="text"
        className="handle"
        placeholder="update handle"
        onChange={setHandle}
      />
      <textarea
        cols="30"
        rows="10"
        className="bio"
        placeholder="add/update bio"
        onChange={setBio}
      ></textarea>
      <input
        type="text"
        className="role"
        placeholder="add/update role"
        onChange={setRole}
      />
      <div className="update-images-container">
        <button
          className="user-image"
          onClick={() => {
            handleImageUploadClick("userImage");
          }}
          id="userImage"
        >
          Update Profile Image
        </button>
        <button
          className="cover-image"
          onClick={() => {
            handleImageUploadClick("coverImage");
          }}
          id="coverImage"
        >
          Update Cover Image
        </button>
      </div>
      <input type="file" id="userImage" onChange={handleUserImageChange} />
      <input type="file" id="coverImage" onChange={handleCoverImageChange} />

      <button
        className="submit"
        onClick={() => {
          editUserDetails({ handle, bio, role }, userImage, coverImage);
        }}
      >
        Update Details
      </button>
    </StyledUpdateUser>
  );
}

export default UpdateUser;

const StyledUpdateUser = styled.div`
  width: 90%;
  padding: 10px 20px;
  border-radius: 20px;
  /* background-color: ${({ theme }) => theme.cardBackground}; */
  background-color: #fff;
  margin-bottom: 20px;
  position: fixed;
  z-index: 4;
  top: 50%;
  transform: translateY(-50%);
  max-width: 650px;
  .close {
    float: right;
    background: url("../assets/close.svg") no-repeat center;
    width: 50px;
    height: 50px;
  }
  .handle,
  .bio,
  .role {
    border: none;
    padding: 10px;
    border-radius: 20px;
    background-color: rgb(246, 246, 246);
    height: 100%;
    width: 100%;
    margin: 10px 0;
    padding-left: 20px;
  }
  .update-images-container {
    display: flex;
    button {
      width: 100%;
      //border: none;
      //color: var(--card-background);
      //background-color: blue;
      padding: 20px;
    }
  }

  .submit {
    width: 100%;
    //border: none;
    //color: var(--card-background);
    //background-color: var(--accent);
    padding: 10px;
  }
  .shadow {
    ${({ toggleUpdateUser }) =>
      !toggleUpdateUser ? `display:block;` : `display:none;`}
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    pointer-events: none;
    position: fixed;
    z-index: 4;
    top: 0;
    left: 0;
  }
`;
