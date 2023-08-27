const router = require("@koa/router")();
const { modelStudent,modelAdmin,modelTeacher } = require("../../models/collection");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const useCtxRes = require("../../utils/useCtxRes")
const {getLoggedInUser} =require("../../utils/loggedInUser")


//学生新增或者编辑
router.post("/create-update", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const id = ctx.request.body.id;
  const { account, password,created } = ctx.request.body;

  try {
    let admin = await modelAdmin.findOne({ account });
    if (admin) {   
      logger.warn(`(user:${currentUser}) student 新增-20001 不能以"${account}"作为学生的姓名`,'student')
      return ctxRes._20001(`不能以"${account}"作为学生的姓名`);
    }
    let teacher = await modelTeacher.findOne({ account });
    if (teacher) {
      logger.warn(`(user:${currentUser}) student 新增-20001 已出现同名教师,无法添加`,'student')
      return ctxRes._20001(`已出现同名教师,无法添加`);
    }
    if (id) {
      let result = await modelStudent.updateOne({ id }, { account,password,modified:new Date().toISOString() });
      if (result) {
        logger.info(`(user:${currentUser}) student 更新-20000 更新成功`,'student')
        return ctxRes._20000("更新");
      }
    } else {
      let course = await modelStudent.findOne({ account });
      if (course) {
        logger.warn(`(user:${currentUser}) student 新增-20004 学生已存在，请勿重复添加`,'student')
        return ctxRes._20004(`学生`);
      }
      let result = await modelStudent.create({ account, created, password});
      if (result) {
        logger.info(`(user:${currentUser}) student 新增-20000 添加成功`,'student')
        return ctxRes._20000("添加");
      }
    }
  } catch (error) {
    logger.error(`(user:${currentUser}) student 新增-20001 ${error.message}`,'student')
    return ctxRes._20001(error.message);
  }
});

//学生列表
router.get("/list", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const { pageNo = 1, pageSize = 10 } = ctx.query;
  try {
    const skip = (pageNo - 1) * pageSize; //跳过多少条
    const total = await modelStudent.countDocuments({});
    const totalPages = Math.ceil(total / pageSize);
    const courses = await modelStudent
      .find({},{_id:0})
      .sort({ created: -1 })
      .skip(skip)
      .limit(pageSize);
    logger.info(`(user:${currentUser}) student 获取列表-20000 success`,'student')
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
    logger.error(`(user:${currentUser}) student 获取列表-20001 ${error.message}`,'student')
    return ctxRes._20001(error.message);
  }
});

//删除学生
router.delete("/removeUser/:id", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  let { id } = ctx.params;
  id = Number(id);
  try {
    const course =  modelStudent.findOne({id});
    if (!course) {
      logger.warn(`(user:${currentUser}) student id-${id} 删除-20005 学生不存在`,'student')
      return ctxRes._20005("学生");
    }
    
    await modelStudent.findOneAndDelete({id});
    logger.info(`(user:${currentUser}) student id-${id} 删除-20000 删除成功`,'student')
    ctxRes._20000("删除");
  } catch (error) {
    logger.error(`(user:${currentUser}) student id-${id} 删除-20001 ${error.message}`,'student')
    return ctxRes._20001(error.message);
  }
});

//获取近今年学生新增人的数
router.get("/count", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const result = [];
  try {
    for (let i = 1; i <= currentMonth; i++) {
      const month = i;
      const year = currentYear;
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      const startDateString = startDate.toISOString();
      const endDateString = endDate.toISOString();
      const newStudentsCount = await modelStudent.countDocuments({
        created: { $gte: startDateString, $lt: endDateString },
      });
      result.push({ month:month+'月', count: newStudentsCount });
    }

    logger.info(
      `(user:${currentUser}) student 获取今年来学生每月新增人数-20000 获取成功`,
      "student"
    );
    ctx.body = {
      code: 20000,
      msg: "success",
      data: result
    };
  } catch (error) {
    logger.error(
      `(user:${currentUser}) student 获取今年来学生每月新增人数-20001 获取失败,${error.message}`,
      "student"
    );
    return ctxRes._20001(`获取失败,${error.message}`);
  }
});

module.exports = router.routes();
