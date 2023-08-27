const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "default_secret_key";
const logger = require("../utils/logger");
const useCtxRes = require("../utils/useCtxRes");
const {
  modelAdmin,
  modelTeacher,
  modelStudent,
  modelBlacklistToken,
} = require("../models/collection");

/**
 * @param {string} token
 * @returns {boolean} 验证token通过与否
 */

const verifyToken = async (ctx, next) => {
  const token = ctx.headers["token"];
  const ctxRes = useCtxRes(ctx);
  if (!token) {
    logger.error(`登录密钥不存在`);
    return ctxRes._20002("登录密钥不存在，请重新登录");
  }
  let isBlacklistToken = (await modelBlacklistToken.find()).filter(
    (item) => item.token == token
  );
  if (isBlacklistToken.length > 0) {
    logger.error(`20002- 登录密钥已失效，请重新登录`);
    return ctxRes._20002("登录密钥已失效，请重新登录");
  }
  try {
    const { id } = jwt.verify(token, secretKey);
    let user;
    uesr = await modelAdmin.findById(id);
    if (uesr) {
      return next();
    }
    uesr = await modelTeacher.findById(id);
    if (uesr) {
      return next();
    }
    uesr = await modelStudent.findById(id);
    if (uesr) {
      return next();
    }
    logger.error(`20002- 登录密钥已失效，请重新登录`);
    return ctxRes._20002("登录密钥已失效，请重新登录");
  } catch (error) {
    if (error.name==='JsonWebTokenError') {
      logger.error(`20002- 登录密钥已失效，请重新登录`);
      return ctxRes._20002('登录密钥已失效，请重新登录');
    }
    if(error.name==='TokenExpiredError'){
      logger.error(`20002- 登录密钥已过期，请重新登录`);
      return ctxRes._20002('登录密钥已过期，请重新登录');
    }
    logger.error(`20001 ${error.name}`);
    return ctxRes._20001(error.message);
  }
};

module.exports = verifyToken;


