class Utils {
    constructor() {

    }

}

export class UtilsString extends Utils {
    constructor() {
        super()
    }

    /**
     * 递归获取字符串返回数组
     * @param str string 要截取的文本
     * @param intercept string 用于查询开始索引的字符串
     * @param endIntercept string 用于查询结束索引的字符串
     *   */
    static interceptStr(str, intercept, endIntercept, startIndex = 0 , arr = []) {
        const index = str.indexOf(intercept, startIndex);
        const interceptLength = intercept.length;
        const strStartIndex = index + interceptLength;
        const strEndIndex = str.indexOf(endIntercept, strStartIndex);
        const result = str.substring(strStartIndex, strEndIndex);
        if (index !== -1) {
            arr.push(result);
                return this.interceptStr(str, intercept, endIntercept, strEndIndex , arr);
        } else {
            return arr;
        }
    }

    /**
     * 创建本地js时间戳+数学对象random生成的随机数拼接的字符串并返回
      */
    static createFileName(){
        const timeStamp = new Date().getTime();
        const randNum = Math.random().toString().substr(2);
        return `${timeStamp}${randNum}`
    }
}

export class UtilsFun extends Utils {
	constructor() {
		super()
	}

	/**
	 * 函数防抖
	 * @param callBack { Function }  延迟执行的回调函数
	 * @param delay { Number } default:200 设定定时器的延迟执行时长 单位ms
	 * @param flag { Boolean } default:false false为首次触发不进行防抖处理
	 * */
	static debounce(callBack, delay = 200, flag = false) {
		let timer = null;
		return function() {
			if (flag) {
				if (timer) clearTimeout(timer);
				timer = setTimeout(() => callBack.apply(this, arguments), delay)
			} else {
				if (timer === null) callBack.apply(this, arguments);
				if (timer) clearTimeout(timer)
				timer = setTimeout(() => callBack.apply(this, arguments), delay);
			}
		}
	}
}