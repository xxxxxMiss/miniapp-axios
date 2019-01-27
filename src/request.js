export default function request(config) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      },
    })
  })
}
