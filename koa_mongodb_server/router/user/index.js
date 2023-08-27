const router = require("@koa/router")();
const {
  modelAdmin,
  modelTeacher,
  modelStudent,
  modelRole,
} = require("../../models/collection");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const useCtxRes = require("../../utils/useCtxRes");
const { addToBlacklist, startTimer } = require("../../utils/blacklist");
const {recordLoggedInUser,removeLoggedInUser,getLoggedInUser} =require("../../utils/loggedInUser");



const secretKey = process.env.SECRET_KEY || "default_secret_key";
let type;
let user;
let role;
router.post("/login", async (ctx) => {
  
  const { account, password } = ctx.request.body;
  const ctxRes = useCtxRes(ctx);
  //在数据库中查找
  user = await modelAdmin.findOne({ account});
  if (!user) {
    user = await modelTeacher.findOne({ account });
    if (!user) {
      user = await modelStudent.findOne({ account });
    }
  }
  if (!user) {
    logger.error(`"${account}"登录-20003 用户名不存在`, "login");
    return ctxRes._20003("用户名不存在");
  }
  if (user.password !== password) {
    logger.error(`"${account}"登录-20001 密码错误`, "login");
    return ctxRes._20003("密码错误");
  }
  type = user.type;
  role = await modelRole.findOne({ id: type },{_id:0});
  //生成token
  const token = jwt.sign(
    {
      id: user._id,
      account: user.account,
      timestamp: new Date() / 1000,
    },
    secretKey,
    {
      // expiresIn: 60 * 60 * 24,
      expiresIn: "0.5h",
    }
  );
  const userInfo = {...user._doc};
  delete userInfo.password;
  const data = {
    role: role,
    token,
    user: userInfo,
  };
  
  recordLoggedInUser(data);
  logger.info(`"${account}"登录-20000 登录成功`, "login");
  ctx.body = {
    code: 20000,
    msg: "登录成功",
    time: new Date().toISOString(),
    data,
  };
});
router.post("/loginout", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const token = ctx.headers["token"];
  const ctxRes = useCtxRes(ctx);
  if (!token) {
    logger.error(`登录密钥不存在，20001 退登失败`, "login");
    return ctxRes._20001(`登录密钥不存在，退登失败`);
  }
  try {
    const { account } = jwt.verify(token, secretKey);
    // 将token加入黑名单或其他操作以使其失效
    addToBlacklist(account, token); // 将token添加到黑名单数组中
    startTimer(); // 启动定时器
    logger.info(`${account} 20000 退登成功`, "login");
    removeLoggedInUser();
    return ctxRes._20000("退登");
  } catch (error) {
    if(error.name === "TokenExpiredError"){
      logger.info(`(user:${currentUser}) login 20000 退登成功`, "login");
      removeLoggedInUser();
      return ctxRes._20000("退登");
    }
    logger.error(`(user:${currentUser}) login 20001 退登失败 ${error.meassge}`, "login");
    return ctxRes._20001("退登失败");
  }
});
module.exports = router.routes();
