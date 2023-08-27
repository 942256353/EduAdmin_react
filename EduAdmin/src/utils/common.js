/**
* 日期 年月日
* @param {string} date 时间戳
* @param {string} format 时间格式,例如:yyyy-MM-dd
* @return {string} 格式化后的时间字符串
*/ 
export const dateFormat = (date, format='yyyy-MM-dd') => {
  if (date == null || date == "") {
    return "";
  }
  date = new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
};

/**
* 日期 年月日 时分
* @param {string} date 时间戳
* @param {string} format 时间格式,例如:yyyy-MM-dd hh:mm
* @return {string} 格式化后的时间字符串
*/ 
export const dateFormat2 = (date, format='yyyy-MM-dd hh:mm') => {
  if (date == null || date == "") {
    return "";
  }
  date = new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "h+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
  };
  if (/(y+)/.test(format))      {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,      
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  return format;    
};
