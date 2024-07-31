import axios from "axios"

const http = axios.create({
  timeout: 5000
})

export const metingAPI = (server: string, type: string, id: number) => {
  return http({
    url: "https://meting.qjqq.cn/",
    method: "GET",
    params: {
      server: server,
      type: type,
      id: id,
      r: Math.random()
    }
  })
}

export const lrcAPI = (url: string) => {
  return http({
    url: url,
    method: "GET"
  })
}

export const bilibiliVideoInfoAPI = (bvid: string) => {
  return http({
    url: "/bilibili/view",
    method: "GET",
    params: {
      bvid: bvid
    }
  })
}