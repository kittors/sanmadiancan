//-------------------------------注册-登录-接口-----------------------------
const router = require('koa-router')()  //实例化new项目
// 引入统一给前端返回的body响应
const result= require('../../config/result.js')
// 操作数据库的接口
const {getToken,Addurl,Tripurl} = require('../../config/databaseapi.js')
// 校验
const {regcheck} = require('../../config/checking.js')

// 生成token
const {gentoken} = require('../../token/jwt.js')

//验证token的合法性
const {Auth} = require('../../token/auth.js')

// 注册接口
router.post('/register',async ctx=>{
	// post提交的值在 ctx.request.body
	let {account,password}=ctx.request.body
	// 1.校验前端传来的值是否合法
	new regcheck(ctx,account,password).start()
	// console.log(account,password);
	console.log('1234');
	// 2.手机号码是否已经注册过了  到数据库里查询
	const query = `db.collection('business-acc').where({account:'${account}'}).get()`
	try{
		const user = await new getToken().posteve(Tripurl,query)
		console.log(user);
		if(user.data.length >0){
			// 已经注册过了
			new result(ctx,'已经注册过了',202).answer()
		}else{
			// 没有注册过
			// [账号，密码，uid：商家的唯一标识] 如果是平台 就需要uid
			// 生成商家的uid 唯一标识符
			const uid = new Date().getTime()
			console.log(uid);
			const struid =JSON.stringify(uid)
			const OBJ = {account,password,uid:struid}
			const STR = JSON.stringify(OBJ)
			const addquery = `db.collection('business-acc').add({data:${STR}})`
			const res = await new getToken().posteve(Addurl,addquery)
			new result(ctx,'注册成功').answer()
		}
	}catch(e){
		new result(ctx,'注册失败,服务器发生失败',500).answer()
	}
})

// 登录接口
router.post('/login',async ctx=>{
	let {account,password} = ctx.request.body
	const query = `db.collection('business-acc').where({account:'${account}',password:'${password}'}).get()`
	try{
		const user = await new getToken().posteve(Tripurl,query)
		if(user.data.length == 0){
			new result(ctx,'账号或者密码错误',202).answer()
		}else{
			const OBJ = JSON.parse(user.data[0])
			new result(ctx,'登录成功',200,{token:gentoken(OBJ.uid)}).answer()
		}
	}catch(e){
		new result(ctx,'登录失败,服务器发生错误',500).answer()
	}
})

// 测试token验证
// router.get('/ceshi',new Auth().m, async ctx=>{
// 	console.log('123');
// 	console.log(ctx.auth.uid);//1642731905655
// })

module.exports = router.routes()