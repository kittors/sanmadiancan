// 公共参数校验
const result = require("./handle.js");

class checking {
  constructor(ctx, ...obj) {
    //...obj 接收不固定参数
    this.ctx = ctx;
    this.obj = obj; //接收一个数组字符串
    //console.log(obj);//[ '12312312', '123123123123', '18', '地球中国' ]
  }
  // 校验前端传来的值为undefined
  Errunder() {
    let bvc = this.obj.indexOf(undefined); //没有undefined返回-1  有的化就是0 或者1等等
    if (bvc != -1) {
      throw new result("参数填写错误", 400);
    }
  }
  // 校验手机号码格式
  Phone(moblie, num) {
    let phone = /^1[3456789]\d{9}$/;
    if (!phone.test(this.obj[num])) {
      throw new result(moblie, 202);
    }
  }
  // 密码校验：6-20位数字和字母的结合
  Password(pass, num) {
    let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
    if (!reg.test(this.obj[num])) {
      throw new result(pass, 202);
    }
  }
  // 校验空数组的方法
  Arrfun(list, num) {
    if (JSON.parse(this.obj[num]).length === 0) {
      throw new result(list, 202);
    }
  }
  // 校验为空的
  Parameter(list) {
    let bvc = this.obj.indexOf("");
    if (bvc != -1) {
      throw new result(list[bvc], 202);
    }
  }
  // 空格符校验
  Blank(list) {
    let vbn = this.obj.filter((item) => {
      return item.split(" ").join("").length === 0;
    });
    let bvc = this.obj.indexOf(vbn[0]);
    if (bvc != -1) {
      throw new result(list[bvc], 202);
    }
  }
}
// 每一子类都表示每种校验
// 注册校验
class regcheck extends checking {
  start() {
    super.Errunder();
    super.Phone("请填写正确的手机号码", 0);
    super.Password("密码必须由6-20位数字和字母组合", 1);
  }
}

// 商家信息上传的校验
class shopinfor extends checking {
  start() {
    let arr = ["请输入店铺名称", "请输入店铺地址", "请上传店铺logo"];
    super.Errunder();
    super.Parameter(arr);
    super.Blank(arr);
    super.Arrfun("请上传店铺logo", 2);
  }
}

// 类目上传校验
class catecheck extends checking {
  start() {
    let arr = ["请输入菜品类目"];
    super.Errunder();
    super.Parameter(arr);
    super.Blank(arr);
  }
}

// 添加菜品单位校验
class unitcheck extends checking {
  start() {
    let arr = ["请输入菜品自定义单位"];
    super.Errunder();
    super.Parameter(arr);
    super.Blank(arr);
  }
}

// 上架菜品校验
class putoncheck extends checking {
  start() {
    let arr = [
      "请选择菜品类目",
      "请输入菜品名称",
      "请输入菜品价格",
      "请选择菜品单位",
      "请上传菜品图片",
      "请设置所属类目的cid",
    ];
    super.Errunder();
    super.Parameter(arr);
    super.Blank(arr);
    super.Arrfun("请上传菜品图片", 4);
  }
}

module.exports = { regcheck, shopinfor, catecheck, unitcheck, putoncheck };
