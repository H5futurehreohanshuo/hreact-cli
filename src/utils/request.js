import 'whatwg-fetch'
const aes = require("./encrypt/aesData"); // 引入加密算法
import { commonUrl, showAlert } from "./tool"; // 引入加密算法

/**
 * http 请求(未加密)
 * @param  {Object}   data           [要传的参数]
 * @param  {String}   url            [地址]
 * @param  {Function} cb             [请求成功之后的回调函数]
 * @param  {String}   [method="GET"] [请求类型,默认为GET] [可选参数:GET,POST]
 * @param  {String}   [responseType="json"] [返回数据的解析方式,默认为json] [可选参数:json,text]
 * @return {[type]}                  [description]
 */
export const request = (data, url, cb, method="GET", responseType="json") => {
  let httpUrl; // 请求的url(改造后)
  let httpInit; // 对象{请求头部,请求主体,模式,凭证,缓存模式等配置}

  if (method == "POST" || method == 'post') { // post 请求
    httpUrl = `${commonUrl}${url}`;
    httpInit = {
      method: method,
      body: JSON.stringify(data),
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded'
      })
    };
  } else { // get 请求
    let httpData = '?'; // get的参数
    // 对参数进行改造
    for (let value in data) {
      httpData += `${value}=${data[value]}&`
    }
    httpUrl = `${commonUrl}${url}${httpData}`;
    httpInit = {
      method: method,
    };
  }
  // 发送http请求
  fetch(httpUrl, httpInit)
  .then((response) => {
    if (responseType == "json") {
      return response.json();
    } else if (responseType == "text") {
      return response.text();
    } else {
      return response.json();
    }
  })
  .then((json) => {
    cb(json);
  })
  .catch((err) => {
    Toast.hide(); // 隐藏loading
    console.log(err);
    // 对网络连接中断进行判断
    if (!window.navigator.onLine) {
      showAlert("温馨提示", "网络环境不可用，请确认连接可用网络后重试", [
        {
          text: '确定',
          onPress: () => {

          },
          style: {color: '#108ee9'}
        }
      ]);
    } else {
      showAlert("温馨提示", "访问超时，请重试", [
        {
          text: '确定',
          onPress: () => {

          },
          style: {color: '#108ee9'}
        }
      ]);
    }
  });
}

/**
 * http 请求(加密)
 * @param  {Array}   keyArr          [参数的键名]
 * @param  {Array}   valArr          [参数的键值]
 * @param  {String}   url            [地址]
 * @param  {Function} cb             [请求成功之后的回调函数]
 * @param  {String}   [method="GET"] [请求类型,默认为GET]
 * @return {[type]}                  [description]
 */
 // 实例代码
 /*encryptRequest(['departure','arrivals','start','end'],['BJS', 'SHA', '2017-05-03', '2018-05-03'], '/h5/app/pricecalendar', function (res) {
   console.log(res);
 });*/
export const encryptRequest = (keyArr, valArr, url, cb, method="GET") => {
  let httpUrl; // 请求的url(改造后)
  let httpInit; // 对象{请求头部,请求主体,模式,凭证,缓存模式等配置}

  let aesData = aes.aesEncrypt(keyArr, valArr); // 对参数进行加密
  if (method == "POST" || method == 'post') { // post 请求
    let httpData = ''; // post的参数
    for (let value in aesData[0]) {
      httpData += `${value}=${aesData[0][value]}&`;
    }
    httpUrl = `${commonUrl}${url}`;
    httpInit = {
      method: method,
      body: httpData,
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      },
    };
  } else { // get 请求
    let httpData = '?'; // get的参数
    // 对参数进行改造
    for (let value in aesData[0]) {
      httpData += `${value}=${aesData[0][value]}&`
    }
    httpUrl = `${commonUrl}${url}${httpData}`;
    httpInit = {
      method: method,
    };
  }
  // 发送http请求
  fetch(httpUrl, httpInit)
  .then((response) => {
    return response.text();
  })
  .then((text) => {
    let res = aes.aesDecrypt(aesData[1], text);
    res = JSON.parse(res);
    cb(res);
  })
  .catch((err) => {
    Toast.hide(); // 隐藏loading
    console.log(err);
    // 对网络连接中断进行判断
    if (!window.navigator.onLine) {
      showAlert("温馨提示", "网络环境不可用，请确认连接可用网络后重试", [
        {
          text: '确定',
          onPress: () => {

          },
          style: {color: '#108ee9'}
        }
      ]);
    } else {
      showAlert("温馨提示", "访问超时，请重试", [
        {
          text: '确定',
          onPress: () => {

          },
          style: {color: '#108ee9'}
        }
      ]);
    }
  });
};
