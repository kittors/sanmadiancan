const router = require("koa-router")(); //实例化new项目
// 引入统一给前端返回的body响应
const result = require("../../config/result.js");
// 操作数据库的接口
const {
  getToken,
  Addurl,
  Tripurl,
  Updateurl,
} = require("../../config/databaseapi.js");

// 校验
const {
  shopinfor,
  catecheck,
  unitcheck,
  putoncheck,
} = require("../../config/checking.js");

//验证token的合法性
const { Auth } = require("../../token/auth.js");
// 图片上传
const { upload, cosfun } = require("../../cos/cos");

// 时间模块
const moment = require("moment");
moment.locale("zh-cn");

// 获取菜品单位
router.get("/obtainunit", new Auth().m, async (ctx) => {
  const query = `db.collection('dishunit').get()`;
  try {
    const res = await new getToken().posteve(Tripurl, query);
    const data = res.data.map((item) => {
      return JSON.parse(item);
    });
    new result(ctx, "SUCCESS", 200, data).answer();
  } catch (e) {
    new result(ctx, "服务器发生错误", 500).answer();
  }
});

// 添加菜品单位
router.post("/dishunit", new Auth().m, async (ctx) => {
  const { unit } = ctx.request.body;
  //校验
  new unitcheck(ctx, unit).start();
  //提交到数据库
  //提交到数据库之前需要进行数据库查询
  const unid = new Date().getTime();
  const query = `db.collection('dishunit').where({label:'${unit}'}).get()`;
  const cate = `db.collection('dishunit').add({data:{value:'${unit}',label:'${unit}',unid:'${unid}'}})`;
  try {
    const res = await new getToken().posteve(Tripurl, query);
    if (res.data.length > 0) {
      new result(ctx, "该单位已经存在", 202).answer();
    } else {
      await new getToken().posteve(Addurl, cate);
      new result(ctx, "添加成功").answer();
    }
  } catch (e) {
    new result(ctx, "添加失败，服务器发生错误", 500).answer();
  }
});

// 上架菜品
router.post("/uploaddishes", new Auth().m, async (ctx) => {
  const { id, category, name, unitprice, unit, image, value } =
    ctx.request.body;
  // 校验
  new putoncheck(ctx, category, name, unitprice, unit, image, value).start();
  //当前时间 utcOffset(8) 东八区:北京时间
  const time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");
  console.log(time); //2022-01-23 22:44:19 北京时间 东八区
  //提交到数据库
  const _ = "db.command";
  const query = `db.collection('dishes-data').add({data:{category:'${category}',name:'${name}',unitprice:${unitprice},unit:'${unit}',image:${image},quantity:0,onsale:true,cid:'${value}',time:'${time}',monthlysale:0}})`;
  //对当前类目下的count字段自增
  const count = `db.collection('dishes-category').where({cid:'${value}'}).update({data:{count:_.inc(1)}})`;
  try {
    await new getToken().posteve(Addurl, query);
    await new getToken().posteve(Updateurl, count);
    new result(ctx, "添加成功").answer();
  } catch (e) {
    new result(ctx, "添加失败，服务器发生错误", 500).answer();
  }
});

// 获取菜品信息
router.get("/obtaindishes", new Auth().m, async (ctx) => {
  let { page } = ctx.query;
  let sk = page * 10;
  const query = `db.collection('dishes-data').orderBy('time','desc').limit(10).skip(${sk}).get()`;
  try {
    const res = await new getToken().posteve(Tripurl, query);
    const data = res.data.map((item) => {
      return JSON.parse(item);
    });
    const total = { total: res.pager.Total };
    const array = { ...{ result: data }, ...total };
    new result(ctx, "SUCCESS", 200, array).answer();
  } catch (error) {
    new result(ctx, "服务器发生错误", 500).answer();
  }
});

module.exports = router.routes();
