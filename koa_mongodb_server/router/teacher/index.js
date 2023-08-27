const router = require("@koa/router")();
const {
  modelTeacher,
  modelAdmin,
  modelStudent,
  modelCourse,
  modelFile,
} = require("../../models/collection");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const useCtxRes = require("../../utils/useCtxRes");
const { getLoggedInUser } = require("../../utils/loggedInUser");

//老师新增或者编辑
router.post("/create-update", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const id = ctx.request.body.id;
  const { account, password, created } = ctx.request.body;
  try {
    let admin = await modelAdmin.findOne({ account });
    if (admin) {
      logger.warn(
        `(user:${currentUser}) teacher 新增-20001 不能以"${account}"作为老师的姓名`,
        "teacher"
      );
      return ctxRes._20001(`不能以"${account}"作为老师的姓名`);
    }
    let student = await modelStudent.findOne({ account });
    if (student) {
      logger.warn(
        `(user:${currentUser}) teacher 新增-20001 已出现同名学生,无法添加`,
        "teacher"
      );
      return ctxRes._20001(`已出现同名学生,无法添加`);
    }
    if (id) {
      let result = await modelTeacher.updateOne(
        { id },
        { account, password, modified: new Date().toISOString() }
      );
      if (result) {
        logger.info(
          `(user:${currentUser}) teacher 更新-20000 更新成功`,
          "teacher"
        );
        return ctxRes._20000("更新");
      }
    } else {
      let course = await modelTeacher.findOne({ account });
      if (course) {
        logger.warn(
          `(user:${currentUser}) teacher 新增-_20004 老师已存在，请勿重复添加`,
          "teacher"
        );
        return ctxRes._20004(`老师`);
      }
      let result = await modelTeacher.create({ account, created, password });
      if (result) {
        logger.info(
          `(user:${currentUser}) teacher 新增-20000 添加成功`,
          "teacher"
        );
        return ctxRes._20000("添加");
      }
    }
  } catch (error) {
    logger.error(
      `(user:${currentUser}) teacher 新增-20001 ${error.message}`,
      "teacher"
    );
    return ctxRes._20001(error.message);
  }
});

//老师列表
router.get("/list", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const { pageNo = 1, pageSize = 10 } = ctx.query;
  const ctxRes = useCtxRes(ctx);
  try {
    const skip = (pageNo - 1) * pageSize; //跳过多少条
    const total = await modelTeacher.countDocuments({});
    const totalPages = Math.ceil(total / pageSize);
    const courses = await modelTeacher
      .find({}, { _id: 0 })
      .sort({ created: -1 })
      .skip(skip)
      .limit(pageSize);
    logger.info(
      `(user:${currentUser}) teacher 获取列表-20000 success`,
      "teacher"
    );
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
    logger.error(
      `(user:${currentUser}) teacher 获取列表-20001 ${error.message}`,
      "teacher"
    );
    return ctxRes._20001(error.message);
  }
});

//所有老师
router.get("/all", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  try {
    const teachers = await modelTeacher.find({}, { _id: 0 });
    logger.info(`(user:${currentUser}) teacher all-20000 success`, "teacher");
    ctx.body = {
      code: 20000,
      msg: "success",
      data: teachers,
    };
  } catch (error) {
    logger.error(
      `(user:${currentUser}) teacher all-20001 ${error.message}`,
      "teacher"
    );
    return ctxRes._20001(error.message);
  }
});

//删除老师
router.delete("/removeUser/:id", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  let { id } = ctx.params;
  id = Number(id);
  try {
    const course = modelTeacher.findOne({ id });
    if (!course) {
      logger.warn(
        `(user:${currentUser}) teacher id-${id} 删除-20005 老师不存在`,
        "teacher"
      );
      return ctxRes._20005("老师");
    }

    await modelTeacher.findOneAndDelete({ id });
    logger.info(
      `(user:${currentUser}) teacher id-${id} 删除-20000 删除成功`,
      "teacher"
    );
    ctxRes._20000("删除");
  } catch (error) {
    logger.error(
      `(user:${currentUser}) teacher id-${id} 删除-20001 ${error.message}`,
      "teacher"
    );
    return ctxRes._20001(error.message);
  }
});

// //获取近五个月来每个月老师人的数
// router.get("/count", async (ctx) => {
//   const currentUser = getLoggedInUser().user.account;
//   const ctxRes = useCtxRes(ctx);
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth() + 1;
//   const currentYear = currentDate.getFullYear();

//   const result = [];
//   try {
//     for (let i = 4; i >= 0; i--) {
//       const month = currentMonth - i;
//       const year = currentYear;
//       if (month < 0) {
//         month += 12;
//         year -= 1;
//       }
//       const startDate = new Date(year, month, 1);
//       const endDate = new Date(year, month + 1, 1);
//       const startDateString = startDate.toISOString();
//       const endDateString = endDate.toISOString();
//       const newTeachersCount = await modelTeacher.countDocuments({
//         created: { $gte: startDateString, $lt: endDateString },
//       });
//       result.push({name: year+'-'+(month+1), value: newTeachersCount});
//     }

//     logger.info(
//       `(user:     ${currentUser}) teacher 获取近五个月来老师每月新增人数-20000 获取成功`,
//       "teacher"
//     );
//     ctx.body = {
//       code: 20000,
//       msg: "success",
//       data: result
//     };
//   } catch (error) {
//     logger.error(
//       `(user:${currentUser}) teacher 获取近五个月来老师每月新增人数-20001 获取失败,${error.message}`,
//       "teacher"
//     );
//     return ctxRes._20001(`获取失败,${error.message}`);
//   }
// });

//获取管理员、老师、学生、课程、所上的资料的数量情况
router.get("/count", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  try {
    
    const adminCount = await modelAdmin.countDocuments();
    const teacherCount = await modelTeacher.countDocuments();
    const studentCount = await modelStudent.countDocuments();
    const courseCount = await modelCourse.countDocuments();
    const fileCount = await modelFile.countDocuments();
    let result = [
      {name: '管理员', value: adminCount},
      {name: '老师', value: teacherCount},
      {name: '学生', value: studentCount},
      {name: '课程', value: courseCount},
      {name: '资料', value: fileCount}
    ];
    ctx.body = {
      code: 20000,
      msg: "success",
      data: result
    }
  } catch (error) {
    logger.error(
      `(user:${currentUser}) teacher 获取管理员、老师、学生、课程、所上的资料的数量-20001 获取失败,${error.message}`,
      "teacher"
    );
  }
});

module.exports = router.routes();
