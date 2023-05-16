import axios from "axios";
import CONFIG from "../config/baseUrl";

// create an axios instance
const service = axios.create({
  baseURL: CONFIG.baseUrl, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 3 * 60 * 1000
});

const pending = [];
const CancelToken = axios.CancelToken;

const removePending = (ever) => {
  for (const p in pending) {
    const data = JSON.stringify(ever.data);
    if (pending[p].u === ever.url + "&" + data) { // 当前请求在数组中存在时执行函数体
      pending[p].f(); // 执行取消操作
      pending.splice(p, 1); // 把这条记录从数组中移除
    }
  }
};

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    removePending(config); // 在请求前执行一下取消操作
    config.cancelToken = new CancelToken((c) => {
      // 标识请求地址&请求方式拼接的字符
      pending.push({ u: config.url + "&" + JSON.stringify(config.data), f: c });
    });
    const store = window.APP.store;
    console.log("store.userinfo", store.state.userinfo)
    if (store.state.userinfo && store.state.userinfo.token) {
      config.headers["X-Auth-Token"] = store.state.userinfo.token;
      config.headers["X-Auth-Type"] = "app";
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  error => {
    // do something with request error
    // console.log(error); // for debug
    return Promise.reject(error);
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    removePending(response.config); // 执行一下取消操作，把已经完成的请求从pending中移除
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 402) {
        return Promise.reject(res.message);
      }
      return res;
    } else {
      return res;
    }
  },
  error => {
    if (error.constructor.name !== 'Cancel') {
      return Promise.reject(error);
    }
    return Promise.reject({});
  }
)

export default service;
