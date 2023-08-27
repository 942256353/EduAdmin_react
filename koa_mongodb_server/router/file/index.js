const router = require("@koa/router")();
const { modelFile } = require("../../models/collection");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const useCtxRes = require("../../utils/useCtxRes");
const multer = require("@koa/multer");
const fs = require("fs");
const path = require("path");
const url = require("url");
const {getLoggedInUser} =require("../../utils/loggedInUser")


//配置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const extName = originalName.substring(originalName.lastIndexOf("."));
    const preName = originalName.split(".")[0];
    const newName = preName + "_" + Date.now() + extName;
    cb(null, newName);

  },
});

const upload = multer({ storage: storage });

//文件上传
router.post("/create", upload.single("file"), async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  // 获取上传的文件信息
  const file = ctx.request.file;
  const { course_id, name } = ctx.request.body;
  if (!file || !course_id || !name) {
    logger.error(
      `(user:${currentUser}) file create 20001- file and course_id and name are required fields`,
      "file"
    );
    ctxRes._20001("file and course_id and name are required fields");
    return;
  }

  // 检查相同course_id下是否已存在相同name的文件
  const existingFile = await modelFile.findOne({
    course_id: course_id,
    name: name,
  });
  if (existingFile) {
    fs.unlinkSync(file.path);
    logger.error(`(user:${currentUser}) file create 20001- 相同课程下已存在相同文件名`, "file");
    ctxRes._20001("相同课程下已存在相同文件名");
  } else {
    //存储文件信息
    modelFile.create({ course_id, path: file.path, name });
    logger.error(`(user:${currentUser}) file create 20000- 文件上传成功`, "file");
    ctxRes._20000("文件上传成功");
  }
});

//文件下载列表
router.get("/list", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const { pageNo = 1, pageSize = 10 } = ctx.query;
  try {
    const skip = (pageNo - 1) * pageSize; //跳过多少条
    const total = await modelFile.countDocuments({});
    const totalPages = Math.ceil(total / pageSize);
    const fileList = await modelFile
      .find({}, { _id: 0 })
      .sort({ created: -1 })
      .skip(skip)
      .limit(pageSize);
    fileList.map((item) => {
      let pre = item.path.split(".")[0];
      const extName = item.path.substring(item.path.lastIndexOf("."));
      item.path = pre.split("/").pop() + extName;
    });
    logger.info(`(user:${currentUser}) file 获取列表-20000 success`, "file");
    ctx.body = {
      code: 20000,
      msg: "success",
      data: {
        list: fileList,
        pageNo,
        pageSize,
        totalPages,
        rows: total,
      },
    };
  } catch (error) {
    logger.error(`(user:${currentUser}) file 获取列表-20001 ${error.message}`, "file");
    return ctxRes._20001(error.message);
  }
});

//文件下载
router.get("/download/:id", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const { id } = ctx.params;
  try {
    const file = await modelFile.findOne({ id });
    if (!file) {
      logger.error(`(user:${currentUser}) file 文件不存在-20001`, "file");
      return ctxRes._20001("文件不存在");
    }
    //将文件路径中的反斜杠替换为斜杠
    const relativePath = file.path.replace(/\\/g, "/");
    // //移除public目录部分，保留目录及文件名
    const path = relativePath.replace(/public/g, "");
    //返回文件流
    // // 基准目录，即项目的根目录
    // const baseDirectory = process.cwd();
    // // 文件的相对路径
    // const fileRelativePath = file.path;
    // // const filePath = path.join(__dirname, file.path);
    // // 构建完整的文件路径
    // const filePath = path.resolve(baseDirectory, fileRelativePath);
    // const fileStream = fs.createReadStream(filePath);
    // ctx.set("Content-Type", "application/octet-stream");
    // ctx.set("Content-Disposition", `attachment; filename=${file.path}`);
    // logger.info(`文件下载成功`, "file");
    // ctx.body = fileStream;

    // 返回文件路径
    // 构建完整的下载 URL
    const downloadUrl = url.format({
      protocol: ctx.request.protocol,
      host: ctx.request.host,
      pathname: path, // 根据实际的路由配置来修改
    });

    logger.info(`(user:${currentUser}) file 文件下载-20000 文件下载成功`, "file");
    file.path = downloadUrl;
    ctx.body = {
      code: 20000,
      data: file,
      msg: "文件下载成功",
    };
  } catch (error) {
    logger.error(`(user:${currentUser}) file 文件下载-20001 ${error.message}`, "file");
    return ctxRes._20001(error.message);
  }
});

//文件删除
router.delete("/removeFile/:id", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  let { id } = ctx.params;
  id = Number(id);
  try {
    const file = await modelFile.findOne({ id });
    if (!file) {
      logger.error(`(user:${currentUser}) file 删除文件-id(${id})-20005 文件不存在`, "file");
      return ctxRes._20005("文件不存在");
    }
    await modelFile.deleteOne({ id });
    // const path = file.path.replace()
    fs.unlinkSync(file.path);
    logger.info(`(user:${currentUser}) file 删除文件-id(${id})-20000 success`, "file");
    return ctxRes._20000("删除");
  } catch (error) {
    logger.error(`(user:${currentUser}) file 文件删除-id(${id})-20001 ${error.message}`, "file");
    return ctxRes._20001(error.message);
  }
});
module.exports = router.routes();
