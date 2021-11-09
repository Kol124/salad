import React from 'react'
import vector from "../assets/Salad Images/Vector.png"
import styled from 'styled-components'
function SidebarRight() {
    return (
        <StyledSidebarRight className="sidebar-container-left">
        <div className="container-title"><p>Random</p></div>
        <div className="mini-post-container">
          <div className="company-details">
            <img
              src={vector}
              alt=""
              className="company-logo"
            />
            <div className="content">
              <div className="title">PayStack</div>
              <div className="catch-phrase">Over all rating</div>
              <div className="stars"></div>
            </div>
          </div>

          <div className="post-button">Post a review</div>
        </div>
        <div className="mini-post-container">
          <div className="company-details">
            <img
              src={vector}
              alt=""
              className="company-logo"
            />
            <div className="content">
              <div className="title">PayStack</div>
              <div className="catch-phrase">Over all rating</div>
              <div className="stars"></div>
            </div>
          </div>

          <div className="post-button">Post a review</div>
        </div>
      </StyledSidebarRight>
    )
}

export default SidebarRight

const StyledSidebarRight = styled.div`
 position: fixed;
  width: 22%;
  background-color: ${({theme})=>theme.cardBackground};
  border-radius: 20px;
  right: 10px;
  top: 100px;
  @media (max-width: 905px) {
    display: none;
  }

  .container-title {
    width: 100%;
    font-size: 1.5rem;
    padding-bottom: 10px;
    font-weight: 600;
    border-bottom: 1px solid ${({theme})=>theme.textColor};
    p {
      padding-left: 30px;
      font-size: 1.3rem;
      color: var(--title);
    }
  }
  .mini-post-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 20px 10px;
    @media (max-width: 1000px) {
      flex-direction: column;
      align-items: normal;
      .company-details {
        justify-content: normal !important;
        margin-bottom: 10px;
      }
    }
    .company-details {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .company-logo {
        width: 50px;
        height: 100%;
      }
      .content {
        padding-left: 10px;
        .title {
          font-size: 1.3rem;
          font-weight: 400;
          color: ${({theme})=>theme.title};
        }
        .catch-phrase {
          color: ${({theme})=>theme.textColor};
        }
        .stars {
            width: 100%;
          height: 15px;
        }
      }
    }

    .post-button {
      border-radius: 10px;
      background-color: ${({theme})=>theme.accent};
      color: black;
      padding: 10px 15px;
      text-align: center;
    }
  }
`