const router = require("@koa/router")();
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const useCtxRes = require("../../utils/useCtxRes");
const multer = require("@koa/multer");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { getLoggedInUser } = require("../../utils/loggedInUser");
const { modelBanner } = require("../../models/collection");

//配置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/banners/");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const extName = originalName.substring(originalName.lastIndexOf("."));
    const preName = originalName.split(".")[0];
    const newName = preName + "_" + Date.now() + extName;
    cb(null, newName);
  },
});

//图片处理
const dealFile = (ctx, file) => {
  //将图片路径中的反斜杠替换为斜杠
  const relativePath = file.path.replace(/\\/g, "/");
  // //移除public目录部分，保留目录及图片名
  const path = relativePath.replace(/public/g, "");
  const downloadUrl = url.format({
    protocol: ctx.request.protocol,
    host: ctx.request.host,
    pathname: path, // 根据实际的路由配置来修改
  });
  file.path = downloadUrl;
};

const upload = multer({ storage: storage });

//图片上传
router.post("/create", upload.single("file"), async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  // 获取上传的图片信息
  const file = ctx.request.file;
  const { name } = ctx.request.body;
  if (!file || !name) {
    logger.error(
      `(user:${currentUser}) banner create 20001- file and name are required fields`,
      "banner"
    );
    ctxRes._20001("file and name are required fields");
    return;
  }

  // 检查是否已存在相同name的图片
  const existingFile = await modelBanner.findOne({
    name: name,
  });
  if (existingFile) {
    fs.unlinkSync(file.path);
    logger.error(
      `(user:${currentUser}) banner create 20001- 已存在相同图片名`,
      "banner"
    );
    ctxRes._20001("已存在相同图片名");
  } else {
    try {
      //存储图片信息
      await modelBanner.create({ path: file.path, name });
      logger.info(`(user:${currentUser}) banner create 20000- 图片上传成功`, "banner");
      ctxRes._20000("图片上传成功");
    } catch (error) {
      fs.unlinkSync(file.path);
      logger.error(
        `(user:${currentUser}) banner create 20001- 图片上传失败,${error.message}`,
        "banner"
      );
      ctxRes._20001(`图片上传失败,${error.message}`);
    }
  }
});

//图片下载列表
router.get("/list", async (ctx) => {
  const currentUser = getLoggedInUser().user.account;
  const ctxRes = useCtxRes(ctx);
  const { pageNo = 1, pageSize = 10 } = ctx.query;
  try {
    const skip = (pageNo - 1) * pageSize; //跳过多少条
    const total = await modelBanner.countDocuments({});
    const totalPages = Math.ceil(total / pageSize);
    const fileList = await modelBanner
      .find({}, { _id: 0 })
      .sort({ created: -1 })
      .skip(skip)
      .limit(pageSize);
    fileList.map((file) => dealFile(ctx, file));
    logger.info(`(user:${currentUser}) banner 获取列表-20000 success`, "banner");
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
    logger.error(
      `(user:${currentUser}) banner 获取列表-20001 ${error.message}`,
      "banner"
    );
    return ctxRes._20001(error.message);
  }
});

//图片删除
router.delete("/removeBanner/:id", async (ctx) => {
    const currentUser = getLoggedInUser().user.account;
    const ctxRes = useCtxRes(ctx);
    let { id } = ctx.params;
    id = Number(id);
    try {
      const file = await modelBanner.findOne({ id });
      if (!file) {
        logger.error(`(user:${currentUser}) banner 删除图片-id(${id})-20005 图片不存在`, "banner");
        return ctxRes._20005("图片不存在");
      }
      await modelBanner.deleteOne({ id });
      // const path = file.path.replace()
      fs.unlinkSync(file.path);
      logger.info(`(user:${currentUser}) banner 删除图片-id(${id})-20000 success`, "banner");
      return ctxRes._20000("删除");
    } catch (error) {
      logger.error(`(user:${currentUser}) banner 图片删除-id(${id})-20001 ${error.message}`, "banner");
      return ctxRes._20001(error.message);
    }
  });

module.exports = router.routes();
