class Utils {
  constructor() {}
}

// 字符串操作类
export class UtilsString extends Utils {
  constructor() {
    super();
  }

  /**
   * 递归获取字符串返回数组
   * @param str string 要截取的文本
   * @param intercept string 用于查询开始索引的字符串
   * @param endIntercept string 用于查询结束索引的字符串
   *   */
  static interceptStr(str, intercept, endIntercept, startIndex = 0, arr = []) {
    const index = str.indexOf(intercept, startIndex);
    const interceptLength = intercept.length;
    const strStartIndex = index + interceptLength;
    const strEndIndex = str.indexOf(endIntercept, strStartIndex);
    const result = str.substring(strStartIndex, strEndIndex);
    if (index !== -1) {
      arr.push(result);
      return this.interceptStr(str, intercept, endIntercept, strEndIndex, arr);
    } else {
      return arr;
    }
  }

  /**
   * 创建本地js时间戳+数学对象random生成的随机数拼接的字符串并返回
   */
  static createFileName() {
    const timeStamp = new Date().getTime();
    const randNum = Math.random().toString().substr(2);
    return `${timeStamp}${randNum}`;
  }

  /**
   * 传入时间戳或标准时间格式返回 年月日 时分秒的日期
   * @param timeStamp {Number} 要转换的时间戳
   * @param time {String} default:no no不返回时分秒 传入yes字符串返回时分秒
   * @param type {Number} default:1 1返回 xxxx-xx-xx格式 传入2返回xxxx年-xx月-xx日格式
   * */
  static calcDate(timeStamp, time = "no", type = "1") {
    const year = new Date(timeStamp).getFullYear();
    let month = new Date(timeStamp).getMonth() + 1;
    let day = new Date(timeStamp).getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    let hours;
    let minutes;
    let seconds;
    let timeResult = "";
    let dateResult = "";
    if (time == "yes") {
      hours = new Date(timeStamp).getHours();
      minutes = new Date(timeStamp).getMinutes();
      seconds = new Date(timeStamp).getSeconds();
      if (type == 1) timeResult += `${hours}:${minutes}:${seconds}`;
      if (type == 2) timeResult += `${hours}时${minutes}分${seconds}秒`;
    }
    if (type == 1) dateResult += `${year}-${month}-${day}  ${timeResult}`;
    if (type == 2) dateResult += `${year}年${month}月${day}日  ${timeResult}`;
    return dateResult.trim();
  }
}

// 函数操作类
export class UtilsFun extends Utils {
  constructor() {
    super();
  }

  /**
   * 函数防抖
   * @param callBack { Function }  延迟执行的回调函数
   * @param delay { Number } default:200 设定定时器的延迟执行时长 单位ms
   * @param flag { Boolean } default:false false为首次触发不进行防抖处理
   * */
  static debounce(callBack, delay = 200, flag = false) {
    let timer = null;
    return function () {
      if (flag) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callBack.apply(this, arguments), delay);
      } else {
        if (timer === null) callBack.apply(this, arguments);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callBack.apply(this, arguments), delay);
      }
    };
  }

  /**
   * 函数节流
   * @param flag {Boolean} default:false false为首次不对回调函数进行节流处理
   * */
  static throttle(callBack, delay = 200, flag = false) {
    try {
      let timer = null;
      if (!callBack) throw new Error("未传入callBack");
      return function () {
        if (flag === false) {
          if (timer === null) callBack.apply(this, arguments);
          if (timer) return;
          timer = setTimeout(() => {
            callBack.apply(this, arguments);
            timer = false;
          }, delay);
        }

        if (flag === true) {
          if (timer) return;
          timer = setTimeout(() => {
            callBack.apply(this, arguments);
            timer = false;
          }, delay);
        }
      };
    } catch (e) {
      throw e;
    }
  }
}

// 小程序常用API
export class WxApi extends Utils {
  constructor() {
    super();
  }

  /**
   * 发起微信支付
   * @param params {Object} 需要传入的参数 （必填项:timeStamp 当前时间戳 、nonceStr 随机字符串最大长度32、paySign 签名）
   * @param paymentPackage {String} 必填 (统一下单接口返回的prepay_id参数值)
   * @param callBack {Function} 选填 一般通过后端查询支付结果 如有需要callBack将在success内触发
   */
  static payment(params, paymentPackage, callBack) {
    wx.requestPayment({
      ...params,
      package: paymentPackage,
      success(res) {
        if (callBack) {
          callBack();
        }
      },
      fail(res) {
        console.log(res, "fail");
      },
    });
  }

  /**
   * @param delta {Number} 返回的页数
   * @param callBack {Function} 非必填 成功回调中触发的回调函数
   */
  static naviBack(delta, callBack) {
    wx.navigateBack({
      delta: delta,
      success() {
        if (callBack) callBack();
      },
    });
  }

  /**
   * @param url {String} 跳转路径
   * @param params {String} 非必填 跳转页面时携带的参数 ?id=1的完整参数
   * @param callBack {Function} 非必填 成功回调中触发的回调函数
   */
  static naviTo(url, params = false, callBack) {
    if (params !== false) url += params;
    wx.navigateTo({
      url,
      success() {
        if (callBack) callBack();
      },
    });
  }

  /**
   * 计算并返回rpx单位
   * @param px {Number} 传入px单位数值 计算出rpx值并返回
   */
  static calcRpx(px) {
    const systemInfo = wx.getSystemInfoSync();
    const { windowWidth } = systemInfo;
    const rpx = 750 / windowWidth;
    return px * rpx;
  }

  /**
   * 跳转tab页
   * @param url { String } 要跳转的Tab页路径
   * @param callBack { Function } 非必填 成功回调中执行的回调函数
   */
  static switchTab(url, callBack) {
    wx.switchTab({
      url,
      success() {
        if (callBack) callBack();
      },
    });
  }

  /**
   * 返回设备信息 可视宽高等
   * */
  static getSystem() {
    const systemInfo = wx.getSystemInfoSync();
    return systemInfo;
  }

  /**
   * 返回小程序右上角胶囊信息
   * */
  static getButton() {
    return wx.getMenuButtonBoundingClientRect();
  }

  /**
   * 返回计算过的胶囊高度
   * @param statusBar {Boolean} default:false 传入true返回包含状态栏高度的结果
   * */
  static calcButtonHeight(statusBar = false) {
    const { height } = this.getButton();
    const { statusBarHeight, system } = this.getSystem();
    const addHeight = system.indexOf("iOS") === -1 ? 12 : 8;
    let result = 0;
    if (statusBar === true) result += statusBarHeight;
    return height + result + addHeight;
  }

  /**
   * 获取wxml节点并返回节点信息,异步返回boundingClientRect结果  最好使用async await同步
   * @param name { String } css选择器的标签名称
   */
  static selectEl(name) {
    const query = wx.createSelectorQuery();
    return new Promise((resolve, reject) => {
      query
        .select(name)
        .boundingClientRect((res) => {
          resolve(res);
        })
        .exec();
    });
  }
}
