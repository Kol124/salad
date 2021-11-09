import React from 'react'
import { Link,useRouteMatch } from 'react-router-dom'
import useStore from '../store/useStore'
import styled from 'styled-components'
import Home from '../assets/Home.svg'
import people from '../assets/people.svg'
import job from '../assets/job.svg'
import bell from '../assets/bell.svg'
import search from '../assets/search.svg'
import logo from "../assets/salad_logo-removebg-preview 1.png"



function Navbar() {
const {toggleDrawer} = useStore()
  const match = useRouteMatch()
    return (
      <StyledNav className="nav-container">
        
        <div className="icon-container">
          <img
            src={logo}
            alt="logo"
            className="logo"
          />
        </div>
        <div className="nav-item-container">
          <ul>
            <Link className="nav-icon" to={`${match.url}/`} id="home"></Link>
            <Link className="nav-icon" to={`${match.url}/people`} id="people"></Link>
            <Link className="nav-icon" to={`${match.url}/jobs`} id="jobs"></Link>
            <Link className="nav-icon" to={`${match.url}/notification`} id="notification"></Link>
            <li className="nav-icon hamburger" id="hamburger" onClick={toggleDrawer}>
              <span></span><span></span><span></span>
            </li>
          </ul>
        </div>
        <div className="searchbar-container">
          <input type="text" className="searchbar" placeholder="Search Salad" />
        </div>
      </StyledNav>
    )
}

const StyledNav = styled.div`
width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 1;
  background-color: ${({theme})=>theme.bodyBackground};
  padding: 10px;
  top: 0;

  @media (min-width: 460px) and(max-width:630px) {
    display: block;
    margin: auto;
    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-item-container {
      width: 50%;
      position: fixed;
      background: ${({theme})=>theme.bodyBackground};
      bottom: 0;
      left: 25%;
      z-index: 2;
      border-radius: 20px;
      ul {
        padding: 0;
        #hamburger {
          display: flex !important;
        }
      }
    }

    .searchbar-container {
      width: 100% !important;
    }
  }

  @media (max-width: 460px) {
    display: block;
    margin: auto;
    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-item-container {
      width: 100% !important;
      position: fixed;
      background: ${({theme})=>theme.bodyBackground};
      bottom: 0;
      left: 0;
      z-index: 2;
      border-radius: 20px;
      ul {
        padding: 0;
        #hamburger {
          display: flex !important;
        }
      }
    }
    .searchbar-container {
      width: 100% !important;
    }
  }

  .icon-container {
    .logo {
      width: 150px;
      height: 100%;
      margin-left: 10px;
    }
  }
  .nav-item-container {
    width: 50%;
    z-index: 3;
    ul {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .nav-icon{
        width: 24px;
        height: 24px;}
      li {
        list-style: none;
        text-decoration: none;
        color: ${({theme})=>theme.textColor};
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      #home {
        background: url(${Home});
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      #people {
        background: url(${people});
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      #jobs {
        background: url(${job});
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      #notification {
        background: url(${bell});
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      #hamburger {
        display: flex;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        span {
          width: 100%;
          height: 2px;
          background-color: ${({theme})=>theme.textColor};
        }
      }
    }
  }
  .searchbar-container {
    width: 25%;
    .searchbar {
      width: 100%;
      border-radius: 20px;
      position: relative;
      border: none;
      padding: 20px;
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
        background: url(${search});
      }
    }
  }
`

export default Navbar
