import React, { useState } from "react";
import useStore from "../store/useStore";
import styled from "styled-components";
import facebook from "../assets/facebook.svg";
import apple from "../assets/apple.svg";
import google from "../assets/google.svg";
import logo from "../assets/salad_logo-removebg-preview 1.png";
import vectorLeft from "../assets/Vector left.png";
import connected from "../assets/connected.svg";
import pana from "../assets/pana.svg";
import Character from "../assets/Character.svg";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [contact, setContact] = useState("");
  const { Signup } = useStore();

  return (
    <StyledSignup>
      <section>
        <nav>
          <div className="logo"></div>
        </nav>
      </section>
      <section>
        <main className="main-container">
          <div className="signup-container">
            <div className="signup-form">
              <form>
                <div className="form-header">Sign Up</div>
                <div className="input-container">
                  {" "}
                  <input
                    type="text"
                    className="email"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <label htmlFor="">Enter Email</label>
                </div>
                <div className="input-container">
                  {" "}
                  <input
                    type="text"
                    className="username"
                    required
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <label htmlFor="">Create User name</label>
                </div>
                {/* <div className="input-container">
                  {" "}
                  <input
                    type="number"
                    className="contact"
                    required
                    onChange={(e) => {
                      setContact(e.target.value);
                    }}
                  />
                  <label htmlFor="">Contact number</label>
                </div> */}
                <div className="input-container">
                  {" "}
                  <input
                    type="password"
                    className="password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <label htmlFor="">Password</label>
                </div>
                <div className="input-container">
                  {" "}
                  <input
                    type="password"
                    className="password"
                    required
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                  <label htmlFor="">Confirm Password</label>
                </div>
                <button
                  className="signup-button"
                  onClick={(e) => {
                    e.preventDefault();
                    Signup(email, username, password, confirmPassword);
                  }}
                >
                  Sign up
                </button>
                <p className="continue">or continue with</p>
                <div className="socials">
                  <i href="#" className="facebook"></i>
                  <i href="#" className="apple"></i>
                  <i href="#" className="google"></i>
                </div>
              </form>
            </div>
            <div className="background-img">
              <div className="background-container"></div>
            </div>
          </div>
        </main>
      </section>
    </StyledSignup>
  );
}

const StyledSignup = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900display=swap");

  * {
    margin: 0;
    padding: 0;
    font-family: "Poppins", sans-serif;
  }

  body {
    &:before {
      content: "";
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      background: url(${vectorLeft});
      width: 100%;
      width: 150px;
      z-index: -1;
      height: 150px;
    }
    &:after {
      content: "";
      display: block;
      bottom: 0;
      right: 0;
      background: url(${vectorLeft});
      width: 100%;
      width: 150px;
      position: fixed;
      height: 150px;
      transform: scaleX(-1);
      z-index: -1;
    }
  }

  nav {
    height: 100%;
    margin: 5px;
    .logo {
      width: 150px;
      height: 50px;
      background: url(${logo}) no-repeat;
      background-size: contain;
      border: none;
    }
  }

  .main-container {
    .signup-container {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      @media (max-width: 960px) {
        .signup-form {
          max-width: 80% !important;
          width: 80%;
        }
        .background-img {
          display: none;
        }
      }
      .signup-form {
        max-width: 400px;
        width: 80%;
        form {
          .form-header {
            font-size: 2rem;
            color: rgb(1, 1, 1);
            font-weight: 400;
          }
          .input-container {
            position: relative;
            label {
              color: rgb(194, 192, 255);
              position: absolute;
              top: 42px;
              left: 13px;
              transition: 0.5s;
              pointer-events: none;
            }
            .username,
            .password,
            .email,
            .contact {
              font-size: 1rem;
              background-color: rgb(240, 239, 255);
              border-radius: 10px;
              border: none;
              width: 94%;
              margin-top: 25px;
              padding: 15px 0 15px 20px;
            }

            &:focus-within > label,
            & input:valid + label {
              top: 0;
              color: rgb(77, 71, 195);
            }
            input:valid + label {
              top: 0;
              color: rgb(77, 71, 195);
            }
            input:valid {
              border: 1px solid rgba(77, 71, 195);
            }
          }

          .forgot {
            color: rgb(211, 211, 211);
            text-align: right;
            margin-top: 10px;
            width: 100%;
            font-size: 0.9rem;
            transition: 0.5s;
            &:hover {
              color: rgb(77, 71, 195);
            }
          }
          .signup-button {
            width: 100%;
            min-height: 50px;
            color: rgba(255, 255, 255, 1);
            box-shadow: 0 0 20px 10px rgb(198, 192, 216);
            border: none;
            background-color: rgb(77, 71, 195);
            padding: 10px;
            border-radius: 10px;
            margin-top: 25px;
            transition: 0.5s;
            &:hover {
              transform: translateY(-10px);
            }
          }
          .continue {
            font-weight: 400;
            color: rgb(211, 211, 211);
            text-align: center;
            margin: 20px;
            width: 100%;
            font-size: 0.9rem;
          }
          .socials {
            margin-top: 10px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            align-self: center;
            padding: 0 20px;
            i {
              background-size: cover;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              background-repeat: no-repeat;
              background-position: center;
              transition: 0.5s;
              &:hover {
                transform: translateY(-5px);
                filter: drop-shadow(0 0 1rem rgb(77, 71, 195));
              }
            }
            .facebook {
              background: url(${facebook}) no-repeat;
            }
            .apple {
              background: url(${apple}) no-repeat;
            }
            .google {
              background: url(${google}) no-repeat;
            }
          }
        }
      }
      .background-img {
        width: 50vw;
        .background-container {
          background: url(${connected}) #fbfaff no-repeat;
          background-size: contain;
          background-position: center;
          border-radius: 240px;
          position: relative;
          height: 83vh;
          width: 70%;
          &::before {
            content: "";
            background: url(${pana}) no-repeat;
            background-size: contain;
            position: absolute;
            top: -13%;
            right: 43%;
            transform: translateX(100%);
            width: 103%;
            height: 100%;
          }
          &::after {
            content: "";
            background: url(${Character}) no-repeat;
            background-size: contain;
            position: absolute;
            top: 5%;
            right: -5%;
            transform: translateX(100%);
            width: 55%;
            height: 100%;
          }
        }
      }
    }
  }
`;
