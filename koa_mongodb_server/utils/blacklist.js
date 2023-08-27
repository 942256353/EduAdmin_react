const { modelBlacklistToken } = require("../models/collection");
const DEFAULT_EXPIRATION = 24 * 60 * 60 * 1000; // 默认过期时间为 24 小时
let timeId;

async function addToBlacklist(
  account,
  token,
  expiration = Date.now() + DEFAULT_EXPIRATION
) {
  let blacklistToken = new modelBlacklistToken({
    account,
    token,
    expiration,
  });
  await blacklistToken.save();
}

async function removeFromBlacklist(token) {
  await modelBlacklistToken.deleteOne({ token });
}

async function checkBlacklist(token) {
  const currentTime = new Date();
  await modelBlacklistToken.deleteMany({ expiration: { $lt: currentTime } });
}

// 每隔一定时间检查黑名单并删除过期的令牌
function startTimer() {
  if (!timeId) {
    timeId = setInterval(checkBlacklist, 60 * 60 * 1000); // 每小时执行一次检查
  }
}
// 停止定时器的函数
function stopTimer() {
  if (timeId) {
    clearInterval(timeId);
    timeId = null;
  }
}

module.exports = { addToBlacklist, startTimer };
