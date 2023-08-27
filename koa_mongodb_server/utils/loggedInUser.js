const fs = require('fs');
const path = require('path');
const logger = require('./logger');

//项目根目录
const baseDirectory = process.cwd();

//用来缓存读取到的登录信息
let cacheLoggedInUser = null;

//当用户登录后，将用户信息写入文件
function recordLoggedInUser(user){
    cacheLoggedInUser = null;
    try{
        const useData = JSON.stringify(user);
        const filePath = path.join(baseDirectory, 'logged-in-user.json');
        fs.writeFileSync(filePath, useData);
        logger.info('用户登录成功，已记录用户信息');
    }catch(err){
        logger.error('记录用户信息失败');
    }
}

//当需要用户信息时，从文件中读取
function getLoggedInUser(){
    try{
        if(cacheLoggedInUser){
            return cacheLoggedInUser;
        }
        const filePath = path.join(baseDirectory, 'logged-in-user.json');
        const userData = fs.readFileSync(filePath,'utf-8');
        const user = JSON.parse(userData);
        //将用户信息缓存
        cacheLoggedInUser = user;
        logger.info('已读取用户信息');
        return user;
    }catch(err){
        logger.error('读取用户信息失败');
        return null;
    }
}

//当用户退出登录时，将用户信息从文件中删除
function removeLoggedInUser(){
    cacheLoggedInUser = null;
    try{
        const filePath = path.join(baseDirectory, 'logged-in-user.json');
        const emptyUserData = JSON.stringify({});
        fs.writeFileSync(filePath, emptyUserData);
        // fs.unlinkSync(filePath);
        logger.info('用户退出登录，已删除用户信息');
    }catch(err){
        logger.error('删除用户信息失败');
    }   
}
module.exports = {
    recordLoggedInUser,
    getLoggedInUser,
    removeLoggedInUser
}