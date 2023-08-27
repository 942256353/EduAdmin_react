const userInfoKey = 'userInfo';
export const setUserInfo = (data)=>sessionStorage.setItem(userInfoKey,data);
export const getUserInfo = ()=>sessionStorage.getItem(userInfoKey);
export const removeUserInfo = ()=>sessionStorage.removeItem(userInfoKey);