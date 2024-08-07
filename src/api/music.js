import request from "@/utils/request";

export const getSongListAPI = (gm) => {
  return request({
    url: "/dg_qqmusic.php",
    method: "get",
    params: {
      gm
    }
  })
}

export const getSongAPI = (id, gm) => {
  return request({
    url: "/dg_qqmusic.php",
    method: "get",
    params: {
      n: id,
      gm: gm,
    }
  })
}

export const getSQSongAPI = (id, msg) => {
  return request({
    url: "/dg_qqmusic_SQ.php",
    method: "get",
    params: {
      n: id,
      msg,
    },
  })
}

export const getSongLyricAPI = (msg) => {
  return request({
    url: '/dg_geci.php',
    method: "get",
    params: {
      msg,
      n:1,
      type:2
    },
  })
}