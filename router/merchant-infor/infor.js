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
const { shopinfor, catecheck } = require("../../config/checking.js");

//验证token的合法性
const { Auth } = require("../../token/auth.js");
// 图片上传
const { upload, cosfun } = require("../../cos/cos");
const { query, querystring } = require("koa/lib/request");

// 图片上传接口name:'file'
router.post("/uploadres", upload.single("file"), async (ctx) => {
  //console.log(ctx.file);//接收前端上传的静态文件 ctx.file
  try {
    const res = await cosfun(ctx.file.filename, ctx.file.path);
    // console.log(res);
    new result(ctx, "SUCCESS", 200, "https://" + res).answer();
  } catch (e) {
    new result(ctx, "上传图片失败，服务器发生错误", 500).answer();
  } //域名/图片路径
});

// 商家信息上传
router.post("/uploadshop", new Auth().m, async (ctx) => {
  const { id, name, address, logo } = ctx.request.body;
  new shopinfor(ctx, name, address, logo).start();
  //   提交到数据库
  //数组类型不需要再用单引号 '${}'
  let query = `db.collection('shop-infor').add({data:{name:'${name}',address:'${address}',logo:${logo}}})`;
  try {
    await new getToken().posteve(Addurl, query);
    new result(ctx, "提交成功").answer();
  } catch (e) {
    new result(ctx, "提交失败,服务器发生错误", 500).answer();
  }
});

// 获取商家信息接口
router.get("/obtainshop", new Auth().m, async (ctx) => {
  const query = `db.collection('shop-infor').get()`;
  try {
    let res = await new getToken().posteve(Tripurl, query);
    const data = res.data.map((item) => {
      return JSON.parse(item);
    });
    new result(ctx, "SUCCESS", 200, data).answer();
  } catch (err) {
    console.log("错误信息：", err);
    new result(ctx, "提交失败,服务器发生错误", 500).answer();
  }
});

// 更新修改商家信息
router.post("/modifyshop", new Auth().m, async (ctx) => {
  const { id, name, address, logo } = ctx.request.body;
  new shopinfor(ctx, name, address, logo).start();
  //   提交到数据库修改
  const query = `db.collection('shop-infor').doc('${id}').update({data:{name:'${name}',address:'${address}',logo:${logo}}})`;
  try {
    await new getToken().posteve(Updateurl, query);
    new result(ctx, "修改成功").answer();
  } catch (error) {
    new result(ctx, "修改失败", 500), answer();
  }
});

// 添加菜品类目
router.post("/addcategory", new Auth().m, async (ctx) => {
  const { category } = ctx.request.body;
  // 校验不能为空
  new catecheck(ctx, category).start();
  //   时间戳生成分类id:Date().getTime() 1970年1月1日0年0分0秒0毫秒到现在的毫秒数
  const cid = "a" + new Date().getTime(); //a21312321312
  //查询数据库是否已经存在
  let query = `db.collection('dishes-category').where({label:'${category}'}).get()`;
  const cate = `db.collection('dishes-category').add({data:{value:'${category}',label:'${category}',cid:'${cid}',count:0,sele_quantity:0}})`;
  try {
    const res = await new getToken().posteve(Tripurl, query);
    console.log(res);
    if (res.data.length > 0) {
      //该类目已经存在
      new result(ctx, "该类目已经存在", 202).answer();
    } else {
      //该类目不存在
      await new getToken().posteve(Addurl, cate);
      new result(ctx, "菜品目录添加成功").answer();
    }
  } catch (e) {
    console.log(e);
    new result(ctx, "添加失败,服务器发生错误", 500).answer();
  }
});

// 获取菜品类目
router.get("/obtaincate", new Auth().m, async (ctx) => {
  // get路径携带的前端传来的分页数
  // ctx.query:获取get路径携带的值 wwww.baidu.com?page=1
  //关于分页 小程序端一次性返回20条数据 node.js端一次性默认返回10条数据 云函数默一次性认返回100条
  let { page } = ctx.query;
  let sk = page * 10;
  const query = `db.collection('dishes-category').limit(10).orderBy('cid','desc').skip(${sk}).get()`;
  try {
    const res = await new getToken().posteve(Tripurl, query);
    const data = res.data.map((item) => JSON.parse(item));
    const total = { total: res.pager.Total };
    const array = { ...{ result: data }, ...total };
    new result(ctx, "SUCCESS", 200, array).answer();
  } catch (e) {
    console.log(e);
    new result(ctx, "没有获取到菜品目录,服务器错误", 500).answer();
  }
});



module.exports = router.routes();
