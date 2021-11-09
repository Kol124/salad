import React, { useEffect } from "react";
import Post from "./Post";
import useStore from "../store/useStore";
import styled from "styled-components";

function Main() {
  const { allReviews, getAllReviews } = useStore();
  useEffect(() => {
    getAllReviews();
  }, []);
  return (
    <StyledMain class="main-container">
      {allReviews ? (
        allReviews.map((post) => {
          <Post details={post} />;
        })
      ) : (
        <div>stuff</div>
      )}
      <Post /* details={post} */ />;
      <Post /* details={post} */ />;
      <Post /* details={post} */ />;
      <Post /* details={post} */ />;
      <Post /* details={post} */ />;
      <Post /* details={post} */ />;
      <Post /* details={post} */ />;
    </StyledMain>
  );
}

export default Main;

const StyledMain = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
  flex-direction: column;
  width: 100%;
`;
