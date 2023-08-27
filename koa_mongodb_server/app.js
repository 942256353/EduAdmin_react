const Koa = require("koa");
const json = require("koa-json"); //用于将http响应的数据转化为json格式
const bodyParser = require("koa-bodyparser"); //用于解析http请求的消息体
const cors = require("@koa/cors");
const mongoose = require("mongoose");
const router = require("@koa/router")();
const static = require("koa-static");
const verifyToken = require("./utils/verifyToken");
const app = new Koa();
const { BASE_URL } = require("./config/Account");
const PORT = 7003;
const logger = require("./utils/logger");

app.use(cors());
app.use(json());
app.use(bodyParser());
app.use(static("public"));

const user = require("./router/user/index");
const nav = require("./router/nav/index");
const banner = require("./router/banner/index");
const teacher = require("./router/teacher/index");
const student = require("./router/student/index");
const studentData = require("./router/student/data");
const teacherData = require("./router/teacher/data");
const course = require("./router/course/index");
const role = require("./router/role/index");
const admin = require("./router/admin/index");
const file = require("./router/file/index");
const schedule = require("./router/schedule/index");

router.prefix("/api");

// 应用 Token 验证中间件，但排除登录路由
router.use(async (ctx, next) => {
  if (ctx.path !== "/api/user/login" && ctx.path !== "/api/user/loginout") {
    return verifyToken(ctx, next);
  } else {
    return next();
  }
});

router.use("/user", user);
router.use("/nav", nav);
router.use("/banner", banner);
router.use("/studentData", studentData);
router.use("/teacherData", teacherData);
router.use("/teacher", teacher);
router.use("/student", student);
router.use("/course", course);
router.use("/role", role);
router.use("/admin", admin);
router.use("/material", file);
router.use("/schedule", schedule);

app.use(router.routes()).use(router.allowedMethods());
//连接数据库
mongoose
  .connect(BASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    logger.info("数据库连接成功");
  })
  .catch((err) => {
    logger.info(`数据库连接失败:${err.message}`);
  });

app.listen(PORT, () => {
  logger.info(`服务器启动成功，端口${PORT}`);
});
