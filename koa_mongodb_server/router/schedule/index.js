const router = require("@koa/router")();
const { modelSchedule, modelCourse, modelTeacher } = require("../../models/collection");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const useCtxRes = require("../../utils/useCtxRes");
const { getLoggedInUser } = require("../../utils/loggedInUser");

//排课新增
router.post("/create-update", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const id = ctx.request.body.id;
  const { teacher_id, course_id, time_start } = ctx.request.body;
  if (!teacher_id || !course_id || !time_start) {
    logger.error(
      `(user:${currentUser}) schedule create 20001- teacher_id and course_id and time_start are required fields`,
      "schedule"
    );
    return ctxRes._20001(
      "teacher_id and course_id and time_start are required fields"
    );
  }
  const teacher = await modelTeacher.findOne({ id: teacher_id });
  const course = await modelCourse.findOne({ id: course_id });
  const teacher_name = teacher && teacher.account;
  const course_name = course && course.name;
  try {
    if (id) {
      //修改
      await modelSchedule.updateOne(
        { id: id },
        {
          teacher_id,
          course_id,
          time_start,
          teacher_name,
          course_name,
          modified: new Date().toISOString(),
        }
      );
      logger.info(
        `(user:${currentUser}) schedule create 20000- 修改排课成功`,
        "schedule"
      );
      return ctxRes._20000("修改排课");
    } else {
      //检查该课程是否已经有老师排课
      const schedule = await modelSchedule.findOne({ course_id });
      if (schedule) {
        logger.error(
          `(user:${currentUser}) schedule create 20001- 所选课程已有老师排课`,
          "schedule"
        );
        return ctxRes._20001("所选课程已有老师排课");
      }
      //新增
      await modelSchedule.create({
        teacher_id,
        course_id,
        time_start,
        teacher_name,
        course_name,
      });
      logger.info(
        `(user:${currentUser}) schedule create 20000- 新增排课成功`,
        "schedule"
      );
      return ctxRes._20000("新增排课");
    }
  } catch (error) {
    logger.error(
      `(user:${currentUser}) schedule 新增-20001 ${error.message}`,
      "schedule"
    );
    return ctxRes._20001(error.message);
  }
});

//排课列表
router.get("/list", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const { pageNo = 1, pageSize = 10 } = ctx.query;
  try {
    const skip = (pageNo - 1) * pageSize; //跳过多少条
    const total = await modelSchedule.countDocuments({});
    const totalPages = Math.ceil(total / pageSize);
    const courses = await modelSchedule
      .find({}, { _id: 0 })
      .sort({ created: -1 })
      .skip(skip)
      .limit(pageSize);
    logger.info(`(user:${currentUser}) schedule 获取列表-20000 success`, 'schedule')
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
    logger.error(`(user:${currentUser}) schedule 获取列表-20001 ${error.message}`, 'schedule')
    return ctxRes._20001(error.message);
  }
});

//删除排课
router.delete("/delete/:id", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  let { id } = ctx.params;
  id = Number(id);
  try {
    const course = modelSchedule.findOne({ id });
    if (!course) {
      logger.warn(`(user:${currentUser}) schedule id-${id} 删除-20005 排课不存在`, 'schedule')
      return ctxRes._20005("排课");
    }

    await modelSchedule.findOneAndDelete({ id });
    logger.info(`(user:${currentUser}) schedule id-${id} 删除-20000 删除成功`, 'schedule')
    ctxRes._20000("删除");
  } catch (error) {
    logger.error(`(user:${currentUser}) schedule id-${id} 删除-20001 ${error.message}`, 'schedule')
    return ctxRes._20001(error.message);
  }
});


module.exports = router.routes();