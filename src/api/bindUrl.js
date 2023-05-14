import request from "./request";

// 学生登录
export function loginMember(data) {
  return request({
    url: "/v1/mem/memmember/login",
    method: "post",
    data
  })
}

// 机构登录
export function loginSeller(data) {
  return request({
    url: "/v1/sel/memmember/login",
    method: "post",
    data
  })
}

// 获取机构
export function findStore(data) {
  return request({
    url: "/v1/sel/stostore/getStore",
    method: "post",
    data
  })
}
