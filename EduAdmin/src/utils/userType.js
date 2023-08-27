const typeKey = 'type';//缓存用户类型
export const setType = (type)=>sessionStorage.setItem(typeKey,type);
export const getType = ()=>sessionStorage.getItem(typeKey);
export const removeType = ()=>sessionStorage.removeItem(typeKey);