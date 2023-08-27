import axios from "axios";
import { notification, Spin, Modal } from "antd";
import React, { useState } from "react";
import { getToken } from "../utils/auth";

// axios.defaults.baseURL = "http://49.235.128.49:8010/api/";//已丢用
 axios.defaults.baseURL = "http://43.138.152.177:7003/api/";//线上地址
// axios.defaults.baseURL = "http://127.0.0.1:7003/api/"; //本地开发用

let requestCount = 0;
const getoLogin =()=>{
  window.location.href = "/login";
}
export const LoadingGlobal = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const hideLoading = () => {
    requestCount--;
    if (requestCount === 0) {
      setIsLoading(false);
    }
  };

  const showLoading = () => {
    requestCount++;
    setIsLoading(true);
  };

  axios.interceptors.request.use((config) => {
    config.headers["token"] = getToken();
    showLoading();
    return config;
  });
 
  axios.interceptors.response.use(
    (res) => {
      if (!res) {
        hideLoading();
        return;
      } 
      let { code, msg } = res.data;
      if (code === 20000) {
        hideLoading();
        return res;
      } else if (code === 20002) { //处理token失效
        Modal.error({
          title: "无登录信息,请重新登录",
          content: msg,
          onOk() {
            hideLoading();
            getoLogin();
          },
        });
      } else{
        notification.warning({
          message: ((typeof msg==='object')?msg.message:msg) || "服务器不给力！",
          description: "",
        });
        hideLoading();
        return;
      }
    },
    (err) => {
      notification.error({
        message: "服务器不给力！",
        description: err.message
      })
      requestCount--;
      if (requestCount === 0) {
        setIsLoading(false);
      }
      // return Promise.reject(err);
    }
  );

  return (
    <div>
      <Spin tip="Loading" spinning={isLoading} size="large">
        {children}
      </Spin>
    </div>
  );
};

export default axios;
