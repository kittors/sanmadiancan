const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')() //实例化
const cors = require('koa2-cors')
const abnormal =require('./config/adnormal.js')

app.use(cors())
app.use(json())
app.use(bodyParser())
app.use(abnormal)
// 全局异常处理

// 注册 登录
const login = require('./router/login/login.js')
// 商家设置
const uploaders=require('./router/merchant-infor/infor.js')

// 配置路由接口
router.use('/api',login)
router.use('/api',uploaders)

// 启动路由
app.use(router.routes()).use(router.allowedMethods())

// 启动自定义端口6000  不能和其他的程序造成端口冲突  不能和其他的程序启动的端口一样
app.listen(5000,()=>{console.log("启动服务器成功")})


