import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import GlobalStyle from "./styles/global";

import Routes from "./routes";

import AppProvider from "./hooks";

const App: React.FC = () => {
  return (
    <Router>
      {/* AppProvider needs to wrap all elements that will have access to the context API */}
      <AppProvider>
        <Routes />
      </AppProvider>

      <GlobalStyle />
    </Router>
  );
};

export default App;
