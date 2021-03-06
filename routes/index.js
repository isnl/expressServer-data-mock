var express = require("express");
const request = require("request");
const fs = require("fs");
const path = require("path");
var router = express.Router();

//跨域请求头   *为允许所有域名  上线请自行修改
router.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Content-Type", "application/json");
  next();
});
/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({
    name: "candy"
  });
});
router.get("/html2canvas", async function (req, res, next) {
  req.pipe(request(req.query.url).on("error", next)).pipe(res);
});
router.get("/douyin", (req, res, next) => {
  const queryUrl = req.query.url;
  try {
    request
      .get({
        url: queryUrl,
        gzip: true,
        headers: {
          "Content-Type": "application/octet-stream"
        }
      })
      .on("response", function (response) {
        const fileName = new Date().getTime() + ".mp4";
        const filePath = "./public/video/" + fileName;
        // res.set({
        //   "Content-type": "application/octet-stream",
        //   "Content-Disposition":
        //     "attachment;filename=" + new Date().getTime() + ".mp4"
        // });
        const writeStream = fs.createWriteStream(filePath);
        const reader = this.pipe(writeStream);
        reader.on("close", () => {
          setTimeout(() => {
            fs.unlink(filePath, er => {
              if (!er) {
                console.log("删除成功");
              }
            });
          }, 1000 * 60 * 5);
          res.json({
            url: `https://express.iiter.cn/video/${fileName}`
          });
          // res.download(filePath, fileName, err => {
          //   if (!err) {
          //     console.log("下载成功");
          //     //5分钟后删除此链接
          //     setTimeout(() => {
          //       fs.unlink(filePath, er => {
          //         if (!er) {
          //           console.log("删除成功");
          //         }
          //       });
          //     }, 1000 * 60 * 5);
          //   }
          // });
        });
        // res.download(filePath, fileName, err => {
        //   if (!err) {
        //     console.log("下载成功");
        //   }
        // });

        //直接下载
        // response.on("data", chunk => res.write(chunk, "binary"));
        // response.on("end", function() {
        //   res.end();
        // });

        //直接返回
        // this.pipe(res);
      });
  } catch (error) {
    res.json({
      msg: "error",
      code: 404
    });
  }
});

module.exports = router;
