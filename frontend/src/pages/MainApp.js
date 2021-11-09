import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import useStore from "../store/useStore";
import Main from "../components/Main";
import Navbar from "../components/Navbar";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import CreatePost from "../components/CreatePost";

function MainApp() {
  const match = useRouteMatch();
  return (
    <>
      <Navbar />
      <div className="section-container">
        <SidebarLeft />

        <main>
          <Switch>
            <Route exact path={`${match.path}/`} component={Main} />
            <Route
              path={`${match.path}/people`}
              component={() => {
                return <div>People sub route</div>;
              }}
            />
            <Route
              path={`${match.path}/jobs`}
              component={() => {
                return <div>Jobs sub route</div>;
              }}
            />
            <Route
              path={`${match.path}/notifications`}
              component={() => {
                return <div>Notification sub route</div>;
              }}
            />
          </Switch>
        </main>
        <SidebarRight />
        <CreatePost/>
      </div>
    </>
  );
}

export default MainApp;
