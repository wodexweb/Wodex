import React from "react";
import AllRoutes from "./Routes/AllRoutes";
import DocumentTitle from "./components/DocumentTitle/DocumentTitle";
import CursorFollower from "./components/CursorFollower/CursorFollower";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.scss";
import "./index.css";

const App: React.FC = () => {
  return (
    <>
      <DocumentTitle />
      <CursorFollower />
      <AllRoutes />
    </>
  );
};

export default App;
