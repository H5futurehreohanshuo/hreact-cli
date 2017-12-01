/**
 * 加密解密参数模块
 * @type {[type]}
 */
const enc = require('./encrypt.js');

/* 加密参数方法 第一个参数传变量名，第二个参数传变量值 */
function aesEncryptData(...args) { // 接收变量名
  const varName = args[0];
  // 接收变量值
  const varValue = args[1];
  // 调用方法获得公共参数
  const data = enc.commonData();
  // 引入加密算法
  const Encrypt = enc.encrypt;
  // 创建一个加密的对象(先清空)
  let aesArr = { ...data[5] };
  // 循环传入的所有参数
  for (let i = 0, len = varValue.length; i < len; i += 1) {
    varValue[i] = new Encrypt(data[0], data[1], data[2], data[3], data[4], varValue[i]);
    aesArr[varName[i]] = varValue[i].aesEncrypt();
  }
  const resultArr = [
    aesArr, varValue[0],
  ];
  return resultArr;
}

/* 解密参数方法 第一个参数传变量名，第二个参数传变量值 */
function aesDecryptData(aes, data) {
  return aes.aesDecrypt(data);
}
module.exports = {
  aesEncrypt: aesEncryptData,
  aesDecrypt: aesDecryptData,
};
