export default {
  version: "0.0.1",
  setLItem(key, item) {
    localStorage.setItem(key, JSON.stringify(item));
  },
  getLItem(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) { }
  },
  removeLItem(key) {
    localStorage.removeItem(key);
  },
  setItem(key, item) {
    sessionStorage.setItem(key, JSON.stringify(item));
  },
  getItem(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (e) { }
  },
  removeItem(key) {
    sessionStorage.removeItem(key);
  },
  cleanItem(key) {
    sessionStorage.clean(key);
  },
  hashObj: {},
  modalInfo(_this, info) {
    setTimeout(function () {
      _this.$Modal.info({
        title: info.title || "温馨提示",
        content: info.content,
        onOk() {
          info.callback && info.callback();
        }
      });
    }, 300);
  },
  modalSuccess(_this, success) {
    setTimeout(function () {
      _this.$Modal.success({
        title: success.title || "温馨提示",
        content: success.content || "操作成功！",
        onOk() {
          success.callback && success.callback();
        }
      });
    }, 300);
  },
  modalWarning(_this, info) {
    setTimeout(function () {
      _this.$Modal.warning({
        title: info.title || "温馨提示",
        content: info.content,
        onOk() {
          info.callback && info.callback();
        }
      });
    }, 300);
  },
  modalError(_this, info) {
    setTimeout(function () {
      _this.$Modal.error({
        title: info.title || "温馨提示",
        content: info.content || "操作失败！",
        onOk() {
          info.callback && info.callback();
        }
      });
    }, 300);
  },
  //服务器错误提示
  showServerError(_this, err) {
    _this.$Message.error({
      content: err.message || "服务器错误，请稍后再试！",
      duration: 5
    });
  },
  //获取服务器的图片
  getImageData(url, image) {
    let Authorization = JSON.parse(sessionStorage.getItem("authorization"));
    return (
      url + "?Authorization=" + Authorization + "&filePath=" + image.filePath
    );
  },
  //获取服务器中的人员头像
  getHeadImageUrl(url, personId) {
    let Authorization = JSON.parse(sessionStorage.getItem("authorization"));
    return url + "?Authorization=" + Authorization + "&personId=" + personId;
  },
  isMobile() {
    var ua = navigator.userAgent,
      source = {};
    if (
      /AppleWebKit.*Mobile/i.test(ua) ||
      /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(
        ua
      )
    )
      source.Mobile = true;

    if (/like Mac OS X/.test(ua)) {
      source.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/
        .exec(ua)[2]
        .replace(/_/g, ".");
      source.iPhone = /iPhone/.test(ua);
      source.iPad = /iPad/.test(ua);
    }
    if (/Android/.test(ua)) {
      source.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];
    }

    if (/webOS\//.test(ua)) source.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

    if (/(Intel|PPC) Mac OS X/.test(ua)) {
      source.Mac =
        /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/
          .exec(ua)[2]
          .replace(/_/g, ".") || true;
    }

    if (/Windows NT/.test(ua))
      source.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
    if (
      source.Mobile ||
      source.iOS ||
      source.iPhone ||
      source.iPad ||
      source.Android
    ) {
      return true;
    }
    return false;
  },
  closeRightBox(e) {
    if ($("#rightBox").find(e.target).length === 0) {
      this.showRightBox("", "hide");
    }
  },
  /**
   * 复制内容到系统自带剪切板上
   */
  copyUrl(url) {
    var that = this;
    try {
      var aux = document.createElement("input");
      aux.setAttribute("value", url);
      document.body.appendChild(aux);
      // 执行选中
      aux.select();
      // 获得选中的内容
      var content = window.getSelection().toString();
      // 执行复制命令
      document.execCommand("copy");
      document.body.removeChild(aux);
      alert("复制成功");
    } catch (error) {
      console.log("您的浏览器暂时不支持直接复制，请手动复制！");
    }
  },
  downFile(url) {
    try {
      var downLoadElement = document.createElement("a");
      downLoadElement.href = url;
      downLoadElement.style.display = "none";
      document.body.appendChild(downLoadElement);
      downLoadElement.click();
      document.body.removeChild(downLoadElement);
    } catch (e) { }
  },
  downloadPic(url) {
    if (this.myBrowser() == "Chrome") {
      var $a = $("<a target='_block'></a>")
        .attr("href", url)
        .attr("download", url);
      $a[0].click();
    } else {
      window.open(url);
    }
  },
  pushHashList(_this, name) {
    var currentThis = this;
    var router = _this.$route;
    _this.$store.state.hashList = _this.$store.state.hashList.filter(function (
      v,
      k
    ) {
      v.currentPage = false;
      if (v.path === router.path) {
        v.currentPage = true;
        v.path = router.path;
        v.name = "【" + name + "】" + currentThis.hashObj[router.name];
      }
      return v;
    });
  },

  /**
   * @func  判断两个对象的值是否相等
   * @param {object} x - 参数
   * @param {object} y - 参数
   * @return  {boolean}
   */
  cmp(x, y) {
    if (x === y) {
      return true;
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false;
    }
    if (x.constructor !== y.constructor) {
      return false;
    }
    for (var p in x) {
      if (x.hasOwnProperty(p)) {
        if (!y.hasOwnProperty(p)) {
          return false;
        }
        if (x[p] === y[p]) {
          continue;
        }
        if (typeof x[p] !== "object") {
          return false;
        }
        if (!Object.equals(x[p], y[p])) {
          return false;
        }
      }
    }
    for (p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  },
  /**
   * 判断是否是数字
   */
  isNum: function (str) {
    return str != null && str != "" ? !isNaN(str) : false;
  },
  comfirmDelete(_this, callback, tipMsg) {
    tipMsg = tipMsg || "确定删除吗？";
    _this.$Modal.confirm({
      title: "提示",
      content: "<p>" + tipMsg + "</p>",
      onOk: () => {
        callback && callback();
      }
    });
  },

  showLoadding(flag) {
    if (flag) {
      if ($("#showLoading").is(':hidden')) {
        $("#showLoading").fadeIn(500);
      }
    } else {
      $("#showLoading").fadeOut(500);
    }
  },

  //标红一个关键字
  replace(value, search, isAll) {
    if (!value) {
      return;
    }

    if (!isAll) {
      var reg = new RegExp("([" + search + "]{1,})");
      // return value.replace(search, '<span style="color:#FF3000">' + search + '</span>')
      return value.replace(reg, `<span class='red'>$1</span>`);
    } else {
      var reg = new RegExp("([" + search + "]{1,})", "g");
      return value.replace(reg, `<span class='red'>$1</span>`);
    }
  },

  getClass(node, classname) {
    if (node.getElementsByClassName) {
      return node.getElementsByClassName(classname);
      //如果存在该标签 就返回
    } else {
      var elems = node.getElementsByTagName(node),
        defualt = [];
      for (var i = 0; i < elems.length; i++) {
        //遍历所有标签
        if (elems[i].className.indexOf(classname) != -1) {
          //查找相应类名的标签
          defualt[defualt.length] = elems[i];
        }
      }
      return defualt;
    }
  },
  //去除html标签
  parseTags(description) {
    description = description + "";
    description = description.replace(/(\n)/g, "");
    description = description.replace(/(\t)/g, "");
    description = description.replace(/(\r)/g, "");
    description = description.replace(/<\/?[^>]*>/g, "");
    description = description.replace(/\s*/g, "");
    return description;
  },
  //圆角转半角
  //全角转换为半角函数
  ToCDB(str) {
    var tmp = "";
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
        tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
      } else {
        tmp += String.fromCharCode(str.charCodeAt(i));
      }
    }
    return tmp;
  },
  /*base64*/
  encode64(input) {
    var keyStr =
      "ABCDEFGHIJKLMNOP" +
      "QRSTUVWXYZabcdef" +
      "ghijklmnopqrstuv" +
      "wxyz0123456789+/" +
      "=";
    var output = "";
    var chr1,
      chr2,
      chr3 = "";
    var enc1,
      enc2,
      enc3,
      enc4 = "";
    var i = 0;
    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output =
        output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output;
  },

  isChinese(temp) {
    var re = /[^\u4e00-\u9fa5]/;
    if (re.test(temp)) return false;
    return true;
  },
  //获取参数
  getQueryStringByName(name, href) {
    var href = href || window.location.href;
    var result = href.match(new RegExp("[?&]" + name + "=([^&]+)", "i"));
    if (result === null || result.length < 1) {
      return "";
    }
    return result[1] || "";
  },
  //判断浏览器类型
  myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("OPR") > -1;
    if (isOpera) {
      return "Opera";
    } //判断是否Opera浏览器 OPR/43.0.2442.991

    if (
      userAgent.indexOf("compatible") > -1 &&
      userAgent.indexOf("MSIE") > -1 &&
      !isOpera
    ) {
      return "IE";
    } //判断是否IE浏览器

    if (userAgent.indexOf("Firefox") > -1) {
      return "FF";
    } //判断是否Firefox浏览器  Firefox/51.0
    if (userAgent.indexOf("Trident") > -1) {
      return "IE";
    } //判断是否IE浏览器  Trident/7.0; rv:11.0
    if (userAgent.indexOf("Edge") > -1) {
      return "Edge";
    } //判断是否Edge浏览器  Edge/14.14393
    if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    } // Chrome/56.0.2924.87
    if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    } //判断是否Safari浏览
  },
  getExplorer() {
    var explorer = window.navigator.userAgent,
      compare = function(s) {
        return (explorer.indexOf(s) >= 0);
      },
      ie11 = (function() {
        return ("ActiveXObject" in window);
      })();
    if (compare("MSIE") || ie11) {
      return 'ie'; 
    } else if (compare("Firefox") && !ie11) {
      return 'Firefox'; 
    } else if (compare("Chrome") && !ie11) {
      if (explorer.indexOf("Edge") > -1) {
        return 'Edge';
      } else {
        return 'Chrome';
      }
    } else if (compare("Opera") && !ie11) {
      return 'Opera';
    } else if (compare("Safari") && !ie11) {
      return 'Safari';
    }
  },
  formatDate(date, fmt) {
    if (!date || new Date(date) == "Invalid Date") {
      return "";
    }
    Date.prototype.Format = function (fmt) {
      //author: meizz
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1 ?
              o[k] :
              ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    };
    return new Date(date).Format(fmt);
  },
  //校验区
  validateIdCard(rule, value, callback) {
    if (!value) {
      callback();
    } else if (
      !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(value) &&
      !/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
        value
      )
    ) {
      callback(new Error("请输入正确的证件号码"));
    } else {
      callback();
    }
  },
  validatePhone(rule, value, callback) {
    //固话跟手机
    var RegExp = /^[0-9]*$/;
    if (value && RegExp.test(value) == false) {
      callback(new Error("请输入正确的联系方式"));
    } else {
      callback();
    }
  },

  parseParam(param, key) {
    var _this = this;
    var paramStr = "";
    $.each(param, function (i) {
      paramStr += i + "=" + param[i] + "&";
    });
    return paramStr.slice(0, -1);
  },

  /*
   * 判断数据是否为空，可以验证字符串和数组和Object
   */
  isNull(obj) {
    return (
      obj == undefined ||
      obj == null ||
      obj == "" ||
      obj.length == 0 ||
      Object.keys(obj).length == 0
    );
  },
  /**
   * 数字补零
   *
   * @param str：要补齐零的数字
   * @param num：补零的个数，默认是1个
   */
  digit(str, num = 1) {
    str = str.toString();
    return str.padStart(num + 1, "0");
  },
  /*
   * 判断是否是数字
   */
  isNumber(str) {
    return !this.isNull(str) ? !isNaN(str) : false;
  },
  /**
   * 判断两个值是否相等
   * 注：强制比较，包括同一个字符，但是不同类型
   */
  equals(arg1, arg2) {
    return Object.is(arg1, arg2);
  },
  /**
   *
   * 判断是否是整数
   */
  isInteger(str) {
    return Number.isInteger(str);
  },

  /*
   * 将字符转换为数字
   *
   * @param str：数字字符串
   * @return 返回数字
   */
  parseInt(str) {
    return parseInt(str, 10);
  },
  /*
   * 去除字符串两边的空格
   */
  trim(str) {
    if (str == null || str == "") return;
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  /*
   * 去除字符串全部空格
   */
  trimAll(str) {
    if (this.isNull(str)) return;
    return str.replace(/\s/g, "");
  },
  /**
   * Map转为Object对象
   */
  mapToObject(map) {
    let obj = Object.create(null);
    for (let [k, v] of map) {
      obj[k] = v;
    }
    return obj;
  },
  /**
   * Object对象转为Map
   */
  objectToMap(obj) {
    let map = new Map();
    for (let k of Object.keys(obj)) {
      map.set(k, obj[k]);
    }
    return map;
  },
  /**
   * Map转为Json
   */
  mapToJson(map) {
    return JSON.stringify(this.mapToObject(map));
  },
  /**
   * Json转为Map
   */
  jsonToMap(json) {
    return this.objectToMap(JSON.parse(json));
  },
  /*
   * 获得默认日期，格式为：yyyy-MM-dd
   */
  getDefaultDate(date = new Date()) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(this.digit).join("-");
  },
  /*
   * 获得默认时间，格式为：yyyy-MM-dd HH:mm:ss
   */
  getDefaultTime(date = new Date()) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return (
      [year, month, day].map(this.digit).join("-") +
      " " + [hour, minute, second].map(this.digit).join(":")
    );
  },

  /**
   * 将日期字符串转换为数组
   *
   * @param dateStr:日期字符串 格式为yyyy-MM-dd HH:mm:ss
   * @return 返回数组
   */
  formatDateStrToArray(dateStr) {
    if (this.isNull(dateStr)) return;
    let array = new Array();
    if (dateStr.length <= 10) {
      array.push(dateStr.substring(0, 4));
      array.push(dateStr.substring(5, 7));
      array.push(dateStr.substring(8, 10));
    } else {
      array.push(dateStr.substring(0, 4));
      array.push(dateStr.substring(5, 7));
      array.push(dateStr.substring(8, 10));
      array.push(dateStr.substring(11, 13));
      array.push(dateStr.substring(14, 16));
      array.push(dateStr.substring(17, 19));
    }
    return array;
  },
  /**
   * 格式化日期字符串为日期对象
   *
   * @param dateStr：日期字符串，仅支持yyyy-MM-dd
   * @return 返回日期对象
   */
  formatStrToDate: function (dateStr) {
    if (this.isNull(dateStr)) return;
    return new Date(dateStr.split("-"));
  },
  /**
   * 将日期对象转为指定日期格式的字符串
   *
   * @param date:要转换的日期
   * @param formatStr:需要格式化的字符串，如yyyy/MM/dd HH:mm:ss，默认是yyyy-MM-dd
   * @return 返回指定格式的日期字符串
   */
  formatDateToStr(date, formatStr = "yyyy-MM-dd") {
    if (!date || new Date(date) == "Invalid Date") {
      return null;
    }
    // 日期字符串格式化
    let o = {
      "M+": date.getMonth() + 1, // 月
      "d+": date.getDate(), // 日
      "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
      "H+": date.getHours(), // 24小时制
      "m+": date.getMinutes(), // 分钟
      "s+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(formatStr)) {
      formatStr = formatStr.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(formatStr))
        formatStr = formatStr.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ?
            o[k] :
            ("00" + o[k]).substr(("" + o[k]).length)
        );
    }
    return formatStr;
  },

  /**
   * 获得加减后的天数
   *
   * @param date:需要操作的日期
   * @param n：加减日期的数量，可以是正负
   * @return 返回加减后的日期对象
   */
  getDiffDateNumber(date, n) {
    date.setDate(date.getDate() + n);
    return date;
  },
  /**
   * 获得两个日期之间所有日期
   *
   * @param start，开始时间，end：结束时间，可以是date和字符串类型,字符串支持yyyy-MM-dd
   * @return 返回日期字符串数组
   */
  getBetweenDateStr: function (beginStr, endStr) {
    let diffDates = [];
    let startDate = this.formatStrToDate(beginStr);
    let endDate = this.formatStrToDate(endStr);

    // 计算日期
    while (endDate.getTime() - startDate.getTime() >= 0) {
      let year = startDate.getFullYear();
      let month =
        startDate.getMonth().toString().length == 1 ?
          "0" + (startDate.getMonth() + 1).toString() :
          startDate.getMonth() + 1;
      let day =
        startDate.getDate().toString().length == 1 ?
          "0" + startDate.getDate() :
          startDate.getDate();
      diffDates.push(year + "-" + month + "-" + day);
      startDate.setDate(startDate.getDate() + 1);
    }
    // 返回结果
    return diffDates;
  },
  /**
   * 判断是否是闰年
   *
   * @param y:年份
   * @return 返回true和false
   */
  isLeap: function (y) {
    return (y % 100 !== 0 && y % 4 === 0) || y % 400 === 0;
  },
  /**
   * 根据年月日获得当天是周几
   *
   * @param date:日期
   * @param type:为0则返回周一，周二这样的汉字，为1返回1,2
   * @return 返回周几
   */
  getWeekOfDate: function (date, type = 0) {
    if (this.isNull(date)) return;
    let weekStr = null;
    if (type) {
      weekStr = new Array(
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      )[date.getDay()];
    } else {
      weekStr = new Array("7", "1", "2", "3", "4", "5", "6")[date.getDay()];
    }
    // 返回结果
    return weekStr;
  },
  /**
   * 数组中是否包含指定的字符串
   *
   * @param str：指定字符串
   * @param array：查找的数组
   * @return 返回true和false
   */
  containsInArray: function (str, array) {
    if (this.isNull(array)) return;
    for (let v of array) {
      if (str == v) {
        return true;
      }
    }
    return false;
  },
  /**
   * 获得字符串在数组中出现位置（可以用Array的includes方法代替）
   *
   * @param str:需要在数组中查找位置的字符串
   * @param array:数组
   * @return 返回位置
   */
  getIndexInArray: function (str, array) {
    if (this.isNull(str) || this.isNull(array)) return;
    return array.indexOf(str);
  },

  //防抖

  debounce(fn, wait) {
    var timeout = null;
    return function () {
      if (timeout !== null)
        clearTimeout(timeout);
      timeout = setTimeout(fn, wait);
    }
  },

  /**
   * @params list 需要校验的list
   * @params num one 需要的条数 all 可以多条
   */

  validateIds(that, list, num = 'all') {
    let type = true;
    if (!list.length) {
      type = false;
      that.$Message.error("请选择需要操作的内容！");
    } else if (num !== 'all' && list.length > num) {
      type = false;
      that.$Message.error(`请仅选择${num}条信息进行操作！`);
    }
    return type;
  },
  /**
   * 初始化日期控件，不要默认选中上次的日期
   */
  initDate() {
    $(".ivu-date-picker-cells-cell-today").addClass(
      "ivu-date-picker-cells-focused"
    );
    $(".ivu-date-picker-cells .ivu-date-picker-cells-focused").not(".ivu-date-picker-cells-cell-today").removeClass("ivu-date-picker-cells-focused");
  }

};

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})();