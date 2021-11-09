import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import axios from "axios";
// import jwtDecode from "jwt-decode";
// import AuthRoute from "./util/AuthRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainApp from "./pages/MainApp";
import StateProvider from "./store/StateProvider";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./util/themes";
import useDarkMode from "./util/useDarkMode";
import { GlobalStyles } from "./util/GlobalStyles";

function App() {
  const [theme] = useDarkMode();

  return (
    <Router>
      <StateProvider>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          {/* <GlobalStyles> */}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route
              path="/app"
              component={() => {
                return (
                  <>
                    <GlobalStyles />
                    <MainApp />
                  </>
                );
              }}
            />
          </Switch>
          {/* </GlobalStyles> */}
        </ThemeProvider>
      </StateProvider>
    </Router>
  );
}

export default App;
