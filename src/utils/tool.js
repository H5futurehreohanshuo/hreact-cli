import { Toast, Modal } from 'antd-mobile';
const sha1 = require('sha1');
const alert = Modal.alert;


// 判断访问终端和来源
export const getSystemInfo = () => {
  const system = {
    terminal: ""
  };
  // 终端
  const u = navigator.userAgent, app = navigator.appVersion;
  if (u.toLowerCase().indexOf('micromessenger') > -1) { // 微信端
    system.terminal = "WX";
  } else if (!!u.match(/(iPhone|iPod|Android|ios)/i)) { //移动终端
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) { // ios
      system.terminal = "IOS";
    } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // Android
      system.terminal = "Android";
    }
  } else { // PC端
    system.terminal = "PC";
  }
  return system;
};

// 公共地址
const origin = window.location.origin;
export const commonUrl = origin.indexOf('localhost') !== -1 ? 'http://localhost:8080/localhost' : origin;

/**
 * 配置一个每一个页面刚进入都需要调用的方法
 * @param  {String} title [需要更改的标题内容]
 * @return {[type]}       [description]
 */
export const enterPageFn = (title) => {
  // 获取系统信息
  let system = system();
  // 更改网页title
  document.title = title;
  // 判断如果环境是app的话需要和原生交互进行一些操作(落地页进行了单独判断)
  if (system.entrance == "app") {
    // 更新原生的title
    updateDocTitle(title);
  }
  // 微信环境下根据微信SDk设置一些微信专有的功能
  if (system.terminal == "WX") {
    jssdk();
  }
};

// 通过微信SDK设置微信功能
Tool.jssdk = () => {
	function guid () {
		function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
	}
	//获取js-sdk票据
	Tool.request(
    {},
    "/app/token",
    (data,textStatus) => {
      var timestamp = parseInt((new Date().getTime())/1000)+"";
    	var noncestr = guid();
    	var sdkurl = window.location.href.split("#");
    	var singna = "jsapi_ticket="+data+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+sdkurl[0];
      wx.config({
    		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    		appId: 'wx5ef54e044b7e4ce5', // 必填，公众号的唯一标识
    		timestamp:timestamp, // 必填，生成签名的时间戳
    		nonceStr: noncestr, // 必填，生成签名的随机串
    		signature: sha1(singna).toUpperCase(),// 必填，签名，见附录1
    		jsApiList: [
          "onMenuShareTimeline",
          "onMenuShareAppMessage"
        ]
    	});
    	wx.ready(function(res) {
        // 分享给朋友
        wx.onMenuShareAppMessage({
          title: "必达卡",
          desc: document.title,
          link: window.location.href,
          imgUrl: "https://oe7f0jikj.qnssl.com/biqu/web/bidaCard/src/small.jpeg"
        });
        // 分享到朋友圈
        wx.onMenuShareTimeline({
        	title: document.title,
          link: window.location.href,
          imgUrl: "https://oe7f0jikj.qnssl.com/biqu/web/bidaCard/src/small.jpeg",
        });
      });
    },
    "GET",
    "text"
  );
};

/**
 * input输入值替换掉某个对象当中的相应字段值
 * @param  {String} value [input的输入值]
 * @param  {String} key   [要替换的字段名]
 * @param  {Object} obj   [要替换其中的字段的对象]
 * @return {[type]}       [description]
 */
export const changeValue = (value, key, obj) => {
  obj[key] = value;
  return obj;
};

// 验证手机号
export const expPhone = (phone) => {
	var telReg = false;
	if (phone) {
		telReg = !!phone.match(/^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/);
	}
	return telReg;
};

//验证旅客姓名
export const expName = (name) => {
	var Reg = false;
	if (name) {
		Reg = !!name.match(/^([a-zA-Z]{1,20}|[\u4e00-\u9fa5]{1,10})$/g);
	}
	return Reg;
};

// 验证票号
export const expTicketNo = (ticketNo) => {
  var Reg = false;
	if (ticketNo) {
		Reg = !!ticketNo.match(/^\d{13}$/);
	}
	return Reg;
};

/**
 * 通用弹框
 * @param  {String} content [需要显示的内容]
 * @param  {Func} cd [点击确定以后的回调]
 * @return {[type]}         [description]
 */
export const showAlert = (content,cb) => {
  alert("温馨提示", content, [
    {
      text: "确定",
      onPress: () => {
        if (cb) {
          cb();
        }
      }
    }
  ]);
};

/**
 * 实现对对象的深拷贝
 * @param  {Object} obj1      [原对象]
 * @param  {Object} [obj2={}] [需要拷贝到哪个对象中去,这个对象中的值将被追加或者覆盖]
 * @return {Object}           [description]
 */
export const objDeepcopy = (obj1, obj2 = {}) => {
  for (var name in obj1) {
    // 先判断一下obj[name]是不是一个对象
    if (typeof obj1[name] === "object") {
      // 我们让要复制的对象的name项=数组或者是json
      obj2[name] = (obj1[name].constructor ===Array) ? [] : {};
      // 然后来无限调用函数自己 递归思想
      objDeepcopy(obj1[name],obj2[name]);
    } else {
      // 如果不是对象，直接等于即可，不会发生引用。
      obj2[name] = obj1[name];
    }
  }
  return obj2; //然后在把复制好的对象给return出去
};

// 获取屏幕高度和宽度
export const getWindowHeight = () => {
  var page = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  if (typeof page.width != "number") {
    if (document.compatMode == "number") {
      page.width = document.documentElement.clientWidth;
      page.height = document.documentElement.clientHeight;
    } else {
      page.width = document.body.clientWidth;
      page.height = document.body.clientHeight;
    }
  }
  return page;
};
