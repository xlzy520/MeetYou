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
		APPID,
		UNIONID,
	} = cloud.getWXContext()
	try {
		return await db.collection('days').where({
			_id: event.id
		}).remove()
	} catch (e) {
		console.error(e)
	}
}
