// 公共参数校验
const result = require('./handle.js')

class checking{
	constructor(ctx,...obj) { //...obj 接收不固定参数
	    this.ctx = ctx
		this.obj = obj //接收一个数组字符串
		//console.log(obj);//[ '12312312', '123123123123', '18', '地球中国' ]
	}
	// 校验前端传来的值为undefined
	Errunder(){
		let bvc = this.obj.indexOf(undefined) //没有undefined返回-1  有的化就是0 或者1等等
		if(bvc !=-1){
			throw new result('参数填写错误',400)
		}
	}
	// 校验手机号码格式
	Phone(moblie,num){
		let phone = /^1[3456789]\d{9}$/
		if(!phone.test(this.obj[num])){
			throw new result(moblie,202)
		}
	}
	// 密码校验：6-20位数字和字母的结合
	Password(pass,num){
		let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
		if(!reg.test(this.obj[num])){
			throw new result(pass,202)
		}
	}
}
// 每一天子类都表示每种校验
// 注册校验
class regcheck extends checking{
	start(){
		super.Errunder()
		super.Phone('请填写正确的手机号码',0)
		super.Password('密码必须由6-20位数字和字母组合',1)
	}
}

module.exports = {regcheck}