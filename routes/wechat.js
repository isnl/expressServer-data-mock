const express = require("express");
const router = express.Router();
const jsSHA = require("jssha");
const { parseString } = require("xml2js");
const keywords = require("../data/keyword");
/**
 * 授权验证
 */
router.get("/", function (req, res, next) {
  const token = "peanut_wechat_token_express";
  //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  var signature = req.query.signature, //微信加密签名
    timestamp = req.query.timestamp, //时间戳
    nonce = req.query.nonce, //随机数
    echostr = req.query.echostr; //随机字符串

  //2.将token、timestamp、nonce三个参数进行字典序排序
  var array = [token, timestamp, nonce];
  array.sort();

  //3.将三个参数字符串拼接成一个字符串进行sha1加密
  var tempStr = array.join("");
  var shaObj = new jsSHA("SHA-1", "TEXT");
  shaObj.update(tempStr);
  var scyptoString = shaObj.getHash("HEX");

  //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (signature === scyptoString) {
    console.log("验证成功");
    res.send(echostr);
  } else {
    console.log("验证失败");
    res.send("验证失败");
  }
});
/**
 * 回复文字消息
 */
function textMsg(toUser, fromUser, content) {
  let resultXml = "<xml><ToUserName><![CDATA[" + fromUser + "]]></ToUserName>";
  resultXml += "<FromUserName><![CDATA[" + toUser + "]]></FromUserName>";
  resultXml += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
  resultXml += "<MsgType><![CDATA[text]]></MsgType>";
  resultXml += "<Content><![CDATA[" + content + "]]></Content></xml>";
  return resultXml;
}
/**
 * 回复图片消息
 */
function imgMsg(toUser, fromUser, media_id) {
  let xmlContent = "<xml><ToUserName><![CDATA[" + toUser + "]]></ToUserName>";
  xmlContent += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
  xmlContent += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
  xmlContent += "<MsgType><![CDATA[image]]></MsgType>";
  xmlContent +=
    "<Image><MediaId><![CDATA[" + media_id + "]]></MediaId></Image></xml>";
  return xmlContent;
}
router.post("/", function (req, res) {
  var buffer = [];
  req.on("data", function (data) {
    buffer.push(data);
  });
  // 内容接收完毕
  req.on("end", function () {
    var msgXml = Buffer.concat(buffer).toString("utf-8");
    parseString(msgXml, { explicitArray: false }, function (err, result) {
      if (err) throw err;
      result = result.xml;
      // console.log(result);
      const toUser = result.ToUserName;
      const fromUser = result.FromUserName;
      //回复普通消息
      if (result.MsgType === "text") {
        const content = result.Content;
        let keywordXml =
          "未找到当前关键字对应的数据，按类别可发送如下关键字：\n【前端】\n【资源】\n【小编微信】";
        keywords.forEach(item => {
          if (content === item.name) {
            keywordXml = item.xml;
          }
        });
        const sendXml = textMsg(toUser, fromUser, keywordXml);
        res.send(sendXml);
      } else if (result.MsgType === "image") {
        //回复图片
      }
    });
  });
});

module.exports = router;
