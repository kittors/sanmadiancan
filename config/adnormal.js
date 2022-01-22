// 自定义的全局异常处理的中间件
const result = require('./handle.js')

const abnormal = async(ctx,next)=>{
	try{
		await next()//等待下一步
	}catch(err){
		console.log(err);
		const isresult =  err instanceof result //判断状态的具体性状态 返回的是一个布尔值
		if(isresult){
			// 已知错误
			ctx.body = {
				msg:err.msg
			}
			ctx.status = err.code
		}else{
			// 未知错误
			ctx.body = {
				msg:'服务器发生错误'
			}
			ctx.status = 500
		}
	}
	
}

module.exports = abnormal