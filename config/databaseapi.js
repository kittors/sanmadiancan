const axios = require('axios')
const qs = require('querystring')
const result = require('./handle.js')
// 凭借token的url地址
let param = qs.stringify({
	grant_type:'client_credential',
	appid:'wx4acab508e4021f1c',
	secret:'4e10c623d36ea0cfc8f3b36a3b2e7b53'
})

// 获取token的地址:必须要得到token才有权限操作云开发数据库 
let url = 'https://api.weixin.qq.com/cgi-bin/token?'+param

// 云环境id
let env = 'diancan-4gsoa7ac643ddedc'

// 数据库插入记录url 
let  Addurl = 'https://api.weixin.qq.com/tcb/databaseadd?access_token='

// 数据库查询记录 url
let  Tripurl = 'https://api.weixin.qq.com/tcb/databasequery?access_token='

class getToken{
	constructor() {
	    
	}
	// 获取token
	async gettoken(){
		try{
			let token = await axios.get(url)
			if(token.status == 200){
				return token.data.access_token
			}else{
				throw '获取token错误'
				// 出现throw这个关键词就会进入catch里面 并且throw给得值会在catch的参数里
			}
		}catch(e){
			throw new result(e,500)
		}
	}
	// 面向对象的方法里面是没有逗号间隔的
	// 调用云开发http api接口
	async posteve(dataurl,query){
		try{
			let token = await this.gettoken()
			let data = await axios.post(dataurl+token,{env,query})
			console.log(data);
			if(data.data.errcode == 0){
				return data.data
			}else{
				throw '请求出错'
			}
		}catch(e){
			throw new result(e,500)
		}
	}
}
module.exports = {getToken,Addurl,Tripurl}