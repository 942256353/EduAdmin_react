import "./App.css";
import React, { useEffect } from "react";
import { RouterConfig } from "./router";
import { notification } from "antd";
import { LoadingGlobal } from "./api/index";

function App() {
  useEffect(() => {
    notification.config({
      placement: "topRight",
      duration: 2,
      maxCount: 1,
    });
  }, []);
  return (
    <div className="App">
      <LoadingGlobal>
        <RouterConfig />
      </LoadingGlobal>
    </div>
  );
}

export default App;
