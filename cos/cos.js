const multer = require("@koa/multer");
const COS = require("cos-nodejs-sdk-v5");

var cos = new COS({
  SecretId: "AKIDjIbdOt73i6D4fy1mGTP4SZP3QWLs9AvO",
  SecretKey: "EBsISKvFI4ZnkQqzrSmpb6LJ1ScV7SXu",
  Protocol: "https:",
});

let Bucket = "saoma-1309369500";
let Region = "ap-nanjing";

let cosfun = function (filename, path) {
  return new Promise((resolve, reject) => {
    cos
      .uploadFile({
        Bucket,
        Region,
        Key: "diancan" + filename,
        FilePath: path,
      })
      .then((res) => {
        // console.log(res);
        resolve(res.Location);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 配置上传文件的所在的1.目录和2.更改文件名
const storage = multer.diskStorage({
  //磁盘存储引擎方法
  destination: (req, file, cb) => {
    //存储前端传来的文件夹
    cb(null, "upload/image");
  },
  filename: (req, file, cb) => {
    // 防止文件重名更改前缀
    let fileFormat = file.originalname.split(".");
    // Data.numw() 时间戳
    // 时间戳-12321312.png
    let num = `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.${
      fileFormat[fileFormat.length - 1]
    }`;
    // console.log(num); 1642861634352-1736098.png
    cb(null, num);
  },
});

const upload = multer({ storage });

module.exports = { upload, cosfun };
