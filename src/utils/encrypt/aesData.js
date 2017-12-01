/*
 * 加密解密参数模块
 */
var enc = require('./encrypt.js');
  /*
   * 加密参数方法
   * 第一个参数传变量名，第二个参数传变量值
   */
  function aesEncryptData(){
    //接收变量名
    var varName = arguments[0];
    //接收变量值
    var varValue = arguments[1];
    //调用方法获得公共参数
    var _data = enc.commonData();
    //引入加密算法
    var encrypt = enc.encrypt;
    //创建一个加密的对象(先清空)
    var aesArr = {};
    aesArr = _data[5];
    //循环传入的所有参数
    for(var i = 0,len = varValue.length;i<len;i++){
      varValue[i] = new encrypt(_data[0],_data[1],_data[2],_data[3],_data[4],varValue[i]);
      aesArr[varName[i]] = varValue[i].aesEncrypt();
    }
    var resultArr = [aesArr,varValue[0]];
    return resultArr;
  };

  /*
   * 解密参数方法
   * 第一个参数传变量名，第二个参数传变量值
   */
  function aesDecryptData(aes,data){
    return aes.aesDecrypt(data);
  };
  module.exports = {
    aesEncrypt:aesEncryptData,
    aesDecrypt:aesDecryptData
  }
