const router = require("@koa/router")();
const { modelRole } = require("../../models/collection");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const useCtxRes = require("../../utils/useCtxRes");
const {getLoggedInUser} =require("../../utils/loggedInUser")


//角色新增或者编辑
router.post("/create-update", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const id = ctx.request.body.id;
  const { role_name, role_dsc,type} = ctx.request.body;

  try {
    if (id) {
      let result = await modelRole.updateOne({ id }, { role_name,role_dsc,type,modified:new Date().toISOString() });
      if (result) {
        logger.info(`(user:${currentUser}) role 更新-20000 更新成功`, "role");
        return ctxRes._20000("更新");
      }
    } else {
      let course = await modelRole.findOne({ role_name });
      if (course) {
        logger.warn(
          `(user:${currentUser}) role 新增-_20004 角色已存在，请勿重复添加`,
          "role"
        );
        return ctxRes._20004(`角色`);
      }
      let result = await modelRole.create({ role_name, role_dsc,type});
      if (result) {
        logger.info(`(user:${currentUser}) role 新增-20000 添加成功`, "role");
        return ctxRes._20000("添加");
      }
    }
  } catch (error) {
    logger.error(`(user:${currentUser}) role 新增-20001 ${error.message}`, "role");
    return ctxRes._20001(error.message);
  }
});

//角色列表
router.get("/list", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const { pageNo = 1, pageSize = 10 } = ctx.query;
  try {
    const skip = (pageNo - 1) * pageSize; //跳过多少条
    const total = await modelRole.countDocuments({});
    const totalPages = Math.ceil(total / pageSize);
    const courses = await modelRole
      .find({},{_id:0})
      .sort({ created: -1 })
      .skip(skip)
      .limit(pageSize);
    logger.info(`(user:${currentUser}) role 获取列表-20000 获取成功`, "role");
    ctx.body = {
      code: 20000,
      msg: "success",
      data: {
        list: courses,
        pageNo,
        pageSize,
        totalPages,
        rows:total,
      },
    };
  } catch (error) {

    logger.error(`(user:${currentUser}) role 获取列表-20001 ${error.message}`, "role");
    return ctxRes._20001(error.message);
  }
});

//删除角色
router.delete("/removeUser/:id", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  let { id } = ctx.params;
  id = Number(id);
  try {
    const course =  modelRole.findOne({id});
    if (!course) {
      logger.warn(`(user:${currentUser}) role id-${id} 删除-20005 角色不存在`, "role");
      return ctxRes._20005("角色");
    }
    
    await modelRole.findOneAndDelete({id});
    logger.info(`(user:${currentUser}) role id-${id} 删除-20000 删除成功`, "role");
    ctxRes._20000("删除");
  } catch (error) {
    logger.error(`(user:${currentUser}) role id-${id} 删除-20001 ${error.message}`, "role");
    return ctxRes._20001(error.message);
  }
});


module.exports = router.routes();
