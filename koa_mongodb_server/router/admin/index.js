const router = require("@koa/router")();
const { modelAdmin,modelTeacher,modelStudent } = require("../../models/collection");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const useCtxRes = require("../../utils/useCtxRes");
const {getLoggedInUser} =require("../../utils/loggedInUser")


//管理员新增或者编辑
router.post("/create-update", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const id = ctx.request.body.id;
  const { account, password, created } = ctx.request.body;
  try {
    if (id) {
      let result = await modelAdmin.updateOne({ id }, { account, password });
      if (result) {
        logger.info(`(user:${currentUser}) admin 更新"${account}"-20000 更新成功`, "admin");
        return ctxRes._20000("更新");
      }
    } else {
      let course = await modelAdmin.findOne({ account });
      if (course) {
        logger.error(
          `(user:${currentUser}) admin 新增"${account}"-20004 管理员已存在，请勿重复添加`,
          "admin"
        );
        return ctxRes._20004(`管理员`);
      }
      let teacher = await modelTeacher.findOne({ account });
      let student = await modelStudent.findOne({ account });
      if (teacher || student) {
        logger.error(
          `(user:${currentUser}) admin 新增"${account}"-20001 该名称与老师或学生同名,无法添加`,
          "admin"
        );
        return ctxRes._20001(`该名称与老师或学生同名,无法添加`);
      }
      let result = await modelAdmin.create({ account, created, password });
      if (result) {
        logger.info(`(user:${currentUser}) admin 新增"${account}"-20000 添加成功`, "admin");
        return ctxRes._20000("添加");
      }
    }
  } catch (error) {
    logger.error(`(user:${currentUser}) admin 新增"${account}"-20001 ${error.message}`, "admin");
    return ctxRes._20001(error.message);
  }
});

//管理员列表
router.get("/list", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const { pageNo = 1, pageSize = 10 } = ctx.query;
  try {
    const skip = (pageNo - 1) * pageSize; //跳过多少条
    const total = await modelAdmin.countDocuments({});
    const totalPages = Math.ceil(total / pageSize);
    const courses = await modelAdmin
      .find({}, { _id: 0 })
      .sort({ created: -1 })
      .skip(skip)
      .limit(pageSize);
    logger.info(`(user:${currentUser}) admin 获取列表-20000 success`, "admin");
    ctx.body = {
      code: 20000,
      msg: "success",
      data: {
        list: courses,
        pageNo,
        pageSize,
        totalPages,
        rows: total,
      },
    };
  } catch (error) {
    logger.error(`(user:${currentUser}) admin 获取列表-20001${error.message}`, "admin");
    return ctxRes._20001(error.message);
  }
});

//删除管理员
router.delete("/removeUser/:id", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  let { id } = ctx.params;
  id = Number(id);
  try {
    const course = modelAdmin.findOne({ id });
    if (!course) {
      logger.warn(`(user:${currentUser}) admin id-${id} 删除-20005 管理员不存在`, "admin");
      return ctxRes._20005("管理员");
    }

    await modelAdmin.findOneAndDelete({ id });
    logger.info(`(user:${currentUser}) admin id-${id} 删除-20000 删除成功`, "admin");
    ctxRes._20000("删除");
  } catch (error) {
    logger.error(`(user:${currentUser}) admin id-${id} 删除-20001 ${error.message}`, "admin");
    return ctxRes._20001(error.message);
  }
});

module.exports = router.routes();
