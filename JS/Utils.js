class Utils {
  constructor() {

  }

}

// 字符串操作类
export class Ustr extends Utils {
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

  /**
   * 传入两个时间戳 返回两个时间戳之间剩余的小时、分钟、秒 ，余数将向下取整
   * @param start {Number} 开始时间的时间戳
   * @param end {Number} 结束时间的时间戳
   * @param type {Number} 非必填 默认返回数组 1 为 00:00:00 格式时间 2 为 00时00分00秒格式
   *   */
  static calcEndDate(start, end, type) {
    const result = end - start;
    if (result <= 0) return 0;
    const MyDate = new Date(result);
    let hour = Math.floor(result / 3600000);
    hour = hour < 10 ? `0${hour}` : hour;
    let minute = MyDate.getMinutes();
    minute = minute < 10 ? `0${minute}` : minute;
    let second = MyDate.getSeconds();
    second = second < 10 ? `0${second}` : second;
    if (type === 1) return `${hour}:${minute}:${second}`;
    if (type === 2) return `${hour}时${minute}分${second}秒`
    return [hour, minute, second];
  }
}

// 函数操作类
export class Fun extends Utils {
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

  /**
   * 经纬度编码，度转换为度分秒,南北纬东西经的判断基于传入数值的正负值，北纬及东经为正数，反之亦然
   * @param {{lat : 00.00000000 , lng : 00.000000 }} latlng 传入经纬度对象
   * @param {Boolean} deCode 默认false 传入true返回无度数分秒拼接的对象 返回{lat : {deg : xxx , minutes : xxx , seconds} , lng : {xxx}}
   * @returns {{lat : 'xxx' , lng : 'xxx'}} 返回编码后的经纬度对象 
   */
  static encodeLatlng(latlng, deCode = false) {
    const {
      lat,
      lng
    } = latlng;

    // 判断南北纬和东西经
    const direction = {
      lat: 'N', // 北纬
      lng: 'E', // 东经
    };
    if (lat < 0) direction.lat = 'S'; // 南纬
    if (lng < 0) direction.lng = 'W'; // 西经
    // 得到度
    const la = Math.floor(lat);
    const ln = Math.floor(lng);
    // 计算分的包含小数结果
    const laTemp = (lat - la) * 60;
    const lnTemp = (lng - ln) * 60;
    // 得到分
    const laMinutes = Math.floor(laTemp);
    const lnMinutes = Math.floor(lnTemp);
    // 得到秒
    const laSeconds = Math.floor((laTemp - laMinutes) * 60);
    const lnSeconds = Math.floor((lnTemp - lnMinutes) * 60);
    let result;
    if (deCode) {
      result = {
        lat: {
          deg: la,
          minutes: laMinutes,
          seconds: laSeconds,
        },
        lng: {
          deg: ln,
          minutes: lnMinutes,
          seconds: lnSeconds,
        }
      }
    }
    if(!decode){
      result = {
        lat: `${la}°${laMinutes}.${laSeconds}' ${direction.lat}`,
        lng: `${ln}°${lnMinutes}.${lnSeconds}' ${direction.lng}`,
      }
    }
    return result;
  }
}

/**
 * 简化javaScript一些API的使用  
 */
export class Japi extends Utils {
  constructor() {
    super();
  }

  /**
   * 简化localStorage.setItem的使用
   * @param key {any} 设置键名，非字符串会自动转换为字符串
   * @param value {any} 设置值，非字符串会自动转换为字符串
   */
  static localSet(key, value) {
    if (typeof key !== 'string') key = JSON.stringify(key);
    if (typeof value !== 'string') value = JSON.stringify(value);
    localStorage.setItem(key, value)
  }

  /**
   * 简化localStorage.getItem的使用
   * @param key {String} 要获取的storage键名
   * @param JSONParse { Boolean } 默认false 传入true将对返回数据使用JSON.parse
   */
  static localGet(key, JSONParse = false) {
    let result = localStorage.getItem(key);
    if (JSONParse) result = JSON.parse(result);
    return result;
  }

  /**
   * 简化Object.property.toString.call()的使用
   * @param {any} data 传入任意类型数据，返回对应类型
   * @param {Boolean} whole 默认false，返回字符串截取过的结果，传入true，返回toString的正常结果 
   * @returns {String} 默认返回数据对应类型字符串 实例：Array
   */
  static getDataType(data, whole = false) {
    const jsType = Object.prototype.toString.call(data);
    if (whole) return jsType;
    const {
      length
    } = jsType;
    const type = jsType.slice(8, length - 1);
    return type;
  }
}

export default {
  Utils,
  Ustr,
  Fun,
  Japi,
}