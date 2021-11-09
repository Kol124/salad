import React from "react";
import { Route, Redirect } from "react-router-dom";
import useStore from "../store/useStore";

const AuthRoute = ({ component: Component, ...rest }) => {
  // eslint-disable-next-line no-unused-expressions
  const { authenticated } = useStore();
  console.log(authenticated);

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === false ? <Redirect to="/" /> : <Component {...props} />
      }
    ></Route>
  );
};

export default AuthRoute;
