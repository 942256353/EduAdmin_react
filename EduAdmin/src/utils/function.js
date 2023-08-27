/**
 * 处理复杂对象深拷贝
 * @param {Object} obj
 */
export function deepCloneObj(obj, cache = new WeakMap()) {
  //检查原始值和函数，并直接返回
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  //检查是否有缓存
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  // 处理正则
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  // 处理时间
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理函数
  if (typeof obj === "function") {
    return new Function("return " + obj.toString())();
  }

 // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCloneObj(item, cache));
  }
  // 处理对象
  const cloneObj = new obj.constructor();
  cache.set(obj, cloneObj);
  Object.keys(obj).forEach((key) => {
    cloneObj[key] = deepCloneObj(obj[key], cache);
  });
  return cloneObj;
}
