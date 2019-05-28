const cloud = require('wx-server-sdk')
cloud.init({
	env: 'meetyou-f68599',
	traceUser: true,
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
	var n = Date.parse(new Date());
	var date = new Date(n);
	var t = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	let t2 = t.replace(/-/g, '/');
	var local_date = new Date(t2).getTime();
	const {
		OPENID,
		APPID,
		UNIONID,
	} = cloud.getWXContext()
	try {
		return await db.collection('Counters').where({
			set_time: _.lte(local_date),
			open_id: OPENID
		})
			.update({
				data: {
					lasting_ed: 0,
				},
			})
	} catch (e) {
		console.error(e)
	}
}