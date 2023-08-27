const router = require("@koa/router")();
const { modelCourse } = require("../../models/collection");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const useCtxRes = require("../../utils/useCtxRes");
const {getLoggedInUser} =require("../../utils/loggedInUser")


//课程新增或者编辑
router.post("/create-update", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const id = ctx.request.body.id;
  const { name, created } = ctx.request.body;
  try {
    if (id) {
      let result = await modelCourse.updateOne({ id }, { name,modified:new Date().toISOString() });
      if (result) {
        logger.info(`(user:${currentUser}) course 更新-20000 更新成功`,'course')
        return ctxRes._20000("更新");
      }
    } else {
      let course = await modelCourse.findOne({ name });
      if (course) {
        logger.warn(`(user:${currentUser}) course 新增-20004 课程已存在，请勿重复添加`,'course')
        return ctxRes._20004(`课程`);
      }
      let result = await modelCourse.create({ name, created });
      if (result) {
        logger.info(`(user:${currentUser}) course 新增-20000 添加成功`,'course')
        return ctxRes._20000("添加");
      }
    }
  } catch (error) {
    logger.error(`(user:${currentUser}) course 新增-20001 ${error.message}`,'course')
    return ctxRes._20001(error.message);
  }
});

//课程列表
router.get("/list", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const { pageNo = 1, pageSize = 10 } = ctx.query;
  try {
    const skip = (pageNo - 1) * pageSize; //跳过多少条
    const total = await modelCourse.countDocuments({});
    const totalPages = Math.ceil(total / pageSize);
    const courses = await modelCourse
      .find({}, { _id: 0 })
      .sort({ created: -1 })
      .skip(skip)
      .limit(pageSize);
      logger.info(`(user:${currentUser}) course 获取列表-20000 success`,'course')
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
    logger.error(`(user:${currentUser}) course 获取列表-20001 ${error.message}`,'course')
    return ctxRes._20001(error.message);
  }
});

//所有课程
router.get("/all", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  try {
    const courses = await modelCourse.find({}, { _id: 0 });
    logger.info(`(user:${currentUser}) course all-20000 success`, "course");
    ctx.body = {
      code: 20000,
      msg: "success",
      data: courses
    };
  } catch (error) {
    logger.error(`(user:${currentUser}) course all-20001 ${error.message}`, "course");
    return ctxRes._20001(error.message);
  }
});

//删除课程
router.delete("/delete/:id", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  let { id } = ctx.params;
  id = Number(id);
  try {
    const course = modelCourse.findOne({id});
    if (!course) {
      logger.warn(`(user:${currentUser}) course id-${id} 删除-20005 课程不存在`,'course')
      return ctxRes._20005("课程");
    }

    await modelCourse.findOneAndDelete({id});
    logger.info(`(user:${currentUser}) course id-${id} 删除-20000 删除成功`,'course')
    ctxRes._20000("删除");
  } catch (error) {
    logger.error(`(user:${currentUser}) course id-${id} 删除-20001 ${error.message}`,'course')
    return ctxRes._20001(error.message);
  }
});

module.exports = router.routes();
