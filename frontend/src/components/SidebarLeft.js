import React from "react";
import useStore from "../store/useStore";
import styled from "styled-components";

import defaultUserImg from "../assets/Salad Images/Rectangle 16.png";
import defaultUserBg from "../assets/image-top.png";
import add from "../assets/add.svg";
import play from "../assets/play.svg";
import graphs from "../assets/graphs.svg";
import addpeople from "../assets/addpeople.svg";
import bookmark from "../assets/bookmark.svg";
import settings from "../assets/settings.svg";
function SidebarLeft() {
  const { userDetails, drawer, togglePost } = useStore();
  return (
    <StyledSidebarLeft className="sidebar-container" toggle={drawer}>
      <div className="fullscreen-post">
        <div className="card-container">
          <img
            src={userDetails ? userDetails.bg : defaultUserBg}
            alt=""
            className="card-img-top"
          />
          <div className="user-details">
            <img
              src={userDetails ? userDetails.img : defaultUserImg}
              alt=""
              className="user-img"
            />
            <div className="user-name">
              {userDetails ? userDetails.name : "Username"}
            </div>
            <div className="user-role">
              {userDetails ? userDetails.role : "User role"}
            </div>
          </div>
          <div className="post-container">
            <div className="add-account">add another account</div>
            <div className="post-btn" onClick={togglePost}>
              Post
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-widgets">
        <ul>
          <li>
            <div className="widget-item">
              <div className="icon" id="play"></div>
              <p>Watch Lists</p>
            </div>
          </li>
          <li>
            <div className="widget-item">
              <div className="icon" id="graphs"></div>
              <p>Helpful Reviews</p>
            </div>
          </li>
          <li>
            <div className="widget-item">
              <div className="icon" id="add-people"></div>
              <p>Find colleagues</p>
            </div>
          </li>
          <li>
            <div className="widget-item">
              <div className="icon" id="bookmark"></div>
              <p>Bookmarks</p>
            </div>
          </li>
          <li>
            <div className="widget-item">
              <div className="icon" id="settings"></div>
              <p>Settings</p>
            </div>
          </li>
        </ul>
      </div>
    </StyledSidebarLeft>
  );
}

export default SidebarLeft;

const StyledSidebarLeft = styled.div`
  width: 22%;
  position: fixed;
  top: 80px;
  left: 0;
  padding: 0 10px;
  z-index: 2;
  @media (max-width: 1000px) {
    .fullscreen-post {
      .card-container {
        .user-details {
          .user-img {
            float: none !important;
            margin: 0 35% !important;
          }
          .user-name,
          .user-role {
            text-align: center;
            transform: translateY(-30px);
          }
        }
        .post-container {
          flex-direction: column;
          align-items: flex-start;
          .post-btn {
            margin-top: 10px;
            width: 100% !important;
          }
        }
      }
    }
  }

  @media (min-width: 630px) and(max-width:905px) {
    width: 30% !important;
    .fullscreen-post {
      border-radius: 20px 20px 0 0 !important;
    }
    .sidebar-widgets {
      background-color: white !important;
      border-radius: 0 0 20px 20px !important;
      ul {
        margin: 0;
      }
    }
  }

  @media (max-width: 630px) {
    bottom: 61px;
    top: auto;
    width: 100%;
    ${({ toggle }) => {
      return toggle
        ? `
    transform: translateY(0);
    `
        : `
    transform: translateY(110%);
    `;
    }}
    transition: 1s ease-in-out;
    .fullscreen-post {
      border-radius: 20px 20px 0 0 !important;
      .user-details {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
    .sidebar-widgets {
      background-color: white !important;
      border-radius: 0 !important;
      ul {
        margin: 0;
      }
    }
  }

  .fullscreen-post {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    .card-container {
      display: flex;
      align-items: flex-start;
      flex-direction: column;

      .card-img-top {
        width: 100%;
        height: 107px;
      }
      .user-details {
        width: 100%;
        background-color: ${({ theme }) => theme.cardBackground};
        .user-img {
          width: 60px;
          height: 60px;
          border-radius: 30%;
          transform: translateY(-30px);
          float: left;
          margin-left: 20px;
          margin-right: 10px;
        }
        .user-name {
          font-weight: 600;
          font-size: 1.2rem;
          color: ${({ theme }) => theme.title};
          padding-bottom: 10px;
        }
        .user-role {
          color: ${({ theme }) => theme.textColor};
        }
      }
      .post-container {
        width: 100%;
        background-color: ${({ theme }) => theme.cardBackground};
        padding: 20px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        border-top: 0.5px solid transparentize(rgb(149, 149, 149), 0.5);

        .add-account {
          margin-left: 30px;
          color: var(--text-color);
          position: relative;
          &::before {
            content: "";
            background: url(${add}) no-repeat center;
            width: 20px;
            height: 20px;
            background-size: contain;
            position: absolute;
            left: -30px;
          }
        }
        .post-btn {
          width: 30%;
          height: 100%;
          color: ${({ theme }) => theme.cardBackground};
          border-radius: 50px;
          background: ${({ theme }) => theme.accent} center no-repeat;
          text-align: center;
          padding: 10px;
        }
      }
    }
  }
  .sidebar-widgets {
    background: rgb(252, 253, 253);
    border-radius: 20px;
    height: fit-content;
    ul {
      width: 100%;
      padding: 1px;
      li {
        text-decoration: none;
        list-style: none;
        .widget-item {
          width: 100%;
          display: flex;
          .icon {
            width: 50px;
            height: 50px;
            margin-right: 5px;
          }

          #play {
            background: url(${play}) no-repeat center;
          }
          #graphs {
            background: url(${graphs}) no-repeat center;
          }
          #add-people {
            background: url(${addpeople}) no-repeat center;
          }
          #bookmark {
            background: url(${bookmark}) no-repeat center;
          }
          #settings {
            background: url(${settings}) no-repeat center;
          }

          p {
            color: ${({ theme }) => theme.textColor};
          }
        }
      }
    }
  }
`;
