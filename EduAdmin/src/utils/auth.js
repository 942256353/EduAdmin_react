const tokenKey = 'token';
export const setToken = (token)=>sessionStorage.setItem(tokenKey,token);
export const getToken = ()=>sessionStorage.getItem(tokenKey);
export const removeToken = ()=>sessionStorage.removeItem(tokenKey);