/**
 * 正则 RegEx
 */
//验证电话号
function CheckTel(telStr) {
  if (CheckTel) {
    if (/^1(3|4|5|7|8)\d{9}$/.test(telStr)) {
      return true
    } else {
      return false
    }
  }
  return false
}
// 验证邮箱
function checkMail(mail) {
  var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
  if (!reg.test(mail)) {
    return false;
  } else {
    return true;
  }
}

export const RegEx = {
  CheckTel: CheckTel,
  checkMail: checkMail
}



/**
 * 关于对象的操作
 */
// 判断对象内每个值是否为空,空返回false
function isObjNull(obj) {
  if (obj) {
    if (JSON.stringify(obj) == "{}") {
      return false
    } else {
      for (let key in obj) {
        if (!obj[key]) {
          return false
        }
      }
    }
    return true
  } else {
    return false
  }
}

// 判断对象内值是否为空,required为判断标准，根据为空返回code:false
function isObjNullWithRequired(obj) {
  if (JSON.stringify(obj) == "{}" || !obj) {
    return {
      code: false,
      msg: "未找到值"
    }
  } else {
    for (let key in obj) {
      if (obj[key].required && !obj[key].value) {
        return {
          code: false,
          msg: obj[key].msg
        }
      }
    }
    return {
      code: true
    }
  }
}

export const ObjUtil = {
  isObjNull: isObjNull,
  isObjNullWithRequired: isObjNullWithRequired
}
/**通用 */
import AMap from "AMap"
// 获取用户地理位置
function getLocation() {
  return new Promise(function (resolve, reject) {
    AMap.plugin('AMap.Geolocation', function () {
      var geolocation = new AMap.Geolocation();
      geolocation.getCurrentPosition(function (status, result) {
        if (status == 'complete') {
          resolve(result)
        } else {
          reject(result)
        }
      });

    });
  })
}

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    " " + date.getHours() + seperator2 + date.getMinutes() +
    seperator2 + date.getSeconds();
  return currentdate;
}

/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 */

function randomWord(randomFlag, min, max) {
  var str = "",
    pos = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

/**
 * 获取网页地址栏参数
 * @param {string} name  参数名
 */
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * 比较两个数大小 A>=B true
 * @param {any} a 
 * @param {any} b 
 */
function CompareNum(a, b) {
  if (a >= b) {
    return true
  } else {
    return false
  }
}

export const Common = {
  getLocation: getLocation,
  getNowFormatDate: getNowFormatDate,
  randomWord: randomWord,
  GetQueryString: GetQueryString,
  CompareNum: CompareNum
}



function getToday() {
  var d = new Date();
  var y = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (mon < 10) {
    mon = "0" + mon
  }
  if (day < 10) {
    day = "0" + day
  }
  var date = y + "-" + mon + "-" + day
  return date
}

function getDays(days) {
  var today = new Date().getTime();
  var timestamp = today + days * 3600 * 24 * 1000
  var d = new Date(timestamp);
  var y = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (mon < 10) {
    mon = "0" + mon
  }
  if (day < 10) {
    day = "0" + day
  }
  var date = y + "-" + mon + "-" + day
  return date
}

function fmtDate(timestamp) {
  var d = new Date(timestamp * 1000);
  var y = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (mon < 10) {
    mon = "0" + mon
  }
  if (day < 10) {
    day = "0" + day
  }
  var date = y + "-" + mon + "-" + day
  return date
}

/**
 * 倒计时
 * 根据时间戳返回时分秒
 * @param {String} time 
 */
function countDown(mss) {
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = (mss % (1000 * 60)) / 1000;

  hours = hours < 10 ? ('0' + hours) : hours;
  minutes = minutes < 10 ? ('0' + minutes) : minutes;
  seconds = seconds < 10 ? ('0' + seconds) : seconds;
  // console.log(seconds)
  return hours + " :" + minutes + " :" + seconds;
}

/**
 * 比较两个日期，A>=B return ture;B可以不传，默认当前日期
 * @param {Date} a 
 * @param {Date} b 
 */
function CompareTimestamp(a, b) {
  console.log(a, b)
  let B = 0;
  if (!b) {
    B = new Date().getTime();
  } else {
    B = new Date(b).getTime();
  }
  let A = new Date(a).getTime();
  console.log(A, B)
  if (A >= B) {
    return true
  } else {
    return false
  }
}

export const Time = {
  getToday: getToday,
  getDays: getDays,
  fmtDate: fmtDate,
  countDown: countDown,
  CompareTimestamp: CompareTimestamp
}
