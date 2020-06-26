// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID,
  } = cloud.getWXContext()
  return await db.collection('days').add({
    data: {
      open_id: OPENID,
      title: event.title,
      date: event.date,
      createdTime: new Date().getTime(),
    }
  })
  
}
