// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
	env: 'meetyou-f68599',
    traceUser: true,
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	var n = Date.parse(new Date());
	var date = new Date(n);
	var t = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

	let t2 = t.replace(/-/g, '/');
	var local_date = new Date(t2).getTime();
	var lasting_ed=0;
	if (local_date > new Date(event.date).getTime()){
		lasting_ed=0
	}
	else lasting_ed=1
	const {
		OPENID,
		APPID,
		UNIONID,
	} = cloud.getWXContext()
	return await db.collection('Counters').add({
		data: {
			lasting_ed:lasting_ed,
			open_id:OPENID,
			des:event.des,
			title: event.title,
			date: event.date,
			set_time: new Date(event.date).getTime(),
			createNickname: event.nickName,
			createAvatarUrl: event.avatarUrl
		}
	})
	
}