import request from "./request";

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

// 添加教室
export function saveClassroomId(data) {
  return request({
    url: "/v1/sel/stoseller/saveClassroomId",
    method: "post",
    data
  })
}

// 删除教室
export function deleteClassroomId(data) {
  return request({
    url: "/v1/sel/stoseller/deleteClassroomId",
    method: "post",
    data
  })
}

// 更新教室
export function updateClassroomId(data) {
  return request({
    url: "/v1/sel/stoseller/updateClassroomId",
    method: "post",
    data
  })
}
