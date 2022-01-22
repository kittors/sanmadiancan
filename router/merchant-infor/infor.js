const router = require('koa-router')()  //实例化new项目
// 引入统一给前端返回的body响应
const result= require('../../config/result.js')
// 操作数据库的接口
const {getToken,Addurl,Tripurl} = require('../../config/databaseapi.js')
// 校验
const {regcheck} = require('../../config/checking.js')

//验证token的合法性
const {Auth} = require('../../token/auth.js')
// 图片上传
const {upload,cosfun} = require('../../cos/cos') 

// 图片上传接口name:'file'
router.post('/uploaders',upload.single('file'),async ctx=>{
	console.log(ctx.file);//接收前端上传的静态文件 ctx.file
	const res = await cosfun(ctx.file.filename,ctx.file.path)
	console.log(res);
})

module.exports = router.routes()