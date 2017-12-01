var sha = require('./sha256.min.js');
var CryptoJS = require('./crypto.min.js');

function encrypt(openid,Timestamp,t,alias,seq,data) {
    this.openid = openid;
    this.Timestamp = Timestamp;
    this.t = t;
    this.alias = alias;
    this.seq = seq;
    this.parameter = "";
    this.key = "";
    this.keyMake = "";
    this.data = data;
    this.encrypted = "";
    this.encrypt = "";
    this.decrypt = "";
};
encrypt.prototype.getKey = function() {
    //console.log(this.key);
    for (var i = 0; i < 4; i++) {
        if (this.seq.substring(i, i + 1) == "1") {
            this.key += this.openid;
        } else if (this.seq.substring(i, i + 1) == "2") {
            this.key += this.Timestamp;
        } else if (this.seq.substring(i, i + 1) == "3") {
            this.key += this.t;
        } else if (this.seq.substring(i, i + 1) == "4") {
            this.key += this.alias;
        }
    };
    this.key = sha.hex_sha256(this.key).substring(0, 16);
    this.keyMake = this.key;
    this.key = CryptoJS.enc.Utf8.parse(this.key);
};
encrypt.prototype.aesEncrypt = function() {
    this.getKey();
    this.data = CryptoJS.enc.Utf8.parse(this.data);
    this.encrypted = CryptoJS.AES.encrypt(this.data, this.key, {
        iv: this.key,
        mode: CryptoJS.mode.CBC
    });
    this.encrypted = this.encrypted.ciphertext.toString();
    //console.log(this.encrypted);
    return this.encrypted;
};
encrypt.prototype.aesDecrypt = function(data) {
    this.encrypt = data;
    this.encrypt = CryptoJS.enc.Hex.parse(this.encrypt);
    this.encrypt = CryptoJS.enc.Base64.stringify(this.encrypt);
    this.decrypt = CryptoJS.AES.decrypt(this.encrypt, this.key, {
        iv: this.key,
        mode: CryptoJS.mode.CBC
    });
    this.decrypt = CryptoJS.enc.Utf8.stringify(this.decrypt).toString();
    return this.decrypt;
};

//生成三位1-3的随机数
function mathRandom4(){
  var a = "";
  for (var i = 0; i < 4; i++) {
    a += parseInt(Math.random() * 4 + 1);
  };
  return a;
};
//传递公共参数
function commonEncryptData(){
    var arrData = [];
    //调用方法
    var _newTime = new Date().getTime();
    //产生随机数
    var randomNum = mathRandom4();
    var t = localStorage.getItem("t") || "";
    var alias = localStorage.getItem("alias") || "";
    /*if(userMsg.v){
      var v = userMsg.v;
    }else{*/
      var v = "";
    /*}*/
    //检测用户的token和alias是否存在 不存在就返回空值
    /*if (userMsg.t) {
        var t = userMsg.t;
        var alias = userMsg.alias;
    } else {
        var t = "";
        var alias = "";
    }*/
    arrData = [v,_newTime,t,alias,randomNum,
    {
       v:v,
       tm:_newTime,
       t:t,
       alias:alias,
       seq:randomNum
    }];
    return arrData;
};
module.exports = {
    commonData:commonEncryptData,
    encrypt:encrypt
}
