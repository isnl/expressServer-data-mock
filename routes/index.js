var express = require("express");
const request = require("request");
var router = express.Router();

//跨域请求头   *为允许所有域名  上线请自行修改
router.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Content-Type", "application/json");
  next();
});

/* GET home page. */
router.get("/", function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({
    name: "candy"
  });
});
router.get("/video", (req, res, next) => {
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
      .on("response", function(response) {
        this.pipe(res);
      });
  } catch (error) {
    res.json({
      msg: "error",
      code: 404
    });
  }
});

module.exports = router;
