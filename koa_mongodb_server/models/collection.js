const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-');

//初始化 mongoose-auto-increment
// autoIncrement.initialize(mongoose.connection);

mongoose.pluralize(null); //去掉集合后面s

const { Schema, model } = mongoose;
const versionKey = { versionKey: false };

//模型生成函数
const createModel = (options) => {
  const schema = new Schema(options, versionKey);
  schema.pre("save", async function (next) {
    if (this.isNew) {
      const lastDocument = await this.constructor.findOne(
        {},
        {},
        { sort: { id: -1 } }
      );
      const lastId = lastDocument ? lastDocument.id : 0;
      this.id = lastId + 1;
    }
    next();
  });
  return schema;
};

//管理员表
const adminSchema = createModel({
  account: String,
  password: String,
  created: { type: String, default: new Date().toISOString() },
  creator: { type: String, default: null },
  modified: { type: String, default: null },
  identity_card: { type: String, default: null },
  real_name: { type: String, default: null },
  reg_time: { type: String, default: null },
  type: { type: Number, default: 1 },
  id: { type: Number, default: 0, unique: true },
});

const navSchema = new Schema(
  {
    id: { type: Number, auto: true },
    url: String,
    title: String,
  },
  versionKey
);

//学生图表数据
const studentDataSchema = new Schema(
  {
    id: { type: Number, auto: true },
    year: String,
    count: Number,
  },
  versionKey
);

//教师图表数据
const teacherDataSchema = createModel({
  name: String,
  value: Number,
  id: { type: Number, default: 0, unique: true },
});

//轮播图
const bannerSchema = createModel(
  {
    created: { type: String, default: new Date().toISOString() },
    creator: { type: String, default: null },
    id: { type: Number, default: 0, unique: true },
    name: String,
    path: String,
  }
);

//课程表
const courseSchema = createModel({
  name: String,
  created: String,
  creator: String,
  modified: String,
  id: { type: Number, default: 0, unique: true },
});

//排课表
const scheduleSchema = createModel({
  teacher_id: Number,
  course_id: Number,
  teacher_name: { type: String, default: null },
  course_name: { type: String, default: null },
  created: { type: String, default: new Date().toISOString() },
  time_start: String,
  creator: { type: String, default: null },
  modified: { type: String, default: null },
  id: { type: Number, default: 0, unique: true },
});

//老师表
const teacherSchema = createModel({
  account: String,
  password: String,
  created: String,
  creator: { type: String, default: null },
  modified: { type: String, default: null },
  identity_card: { type: String, default: null },
  real_name: { type: String, default: null },
  reg_time: { type: String, default: null },
  type: { type: Number, default: 2 },
  id: { type: Number, default: 0, unique: true },
});

//学生表
const studentSchema = createModel({
  account: String,
  password: String,
  created: String,
  creator: { type: String, default: null },
  modified: { type: String, default: null },
  identity_card: { type: String, default: null },
  real_name: { type: String, default: null },
  reg_time: { type: String, default: null },
  type: { type: Number, default: 3 },
  id: { type: Number, default: 0, unique: true },
});

//角色表
const roleSchema = createModel({
  role_name: { type: String, require: true },
  role_dsc: { type: String, require: true },
  created: { type: String, default: new Date().toISOString() },
  creator: { type: String, default: null },
  modified: { type: String, default: null },
  type: { type: Number, default: null },
  id: { type: Number, default: 0, unique: true },
});

//文件下载表
const fileSchema = createModel({
  course_id: { type: Number, require: true },
  created: { type: String, default: new Date().toISOString() },
  creator: { type: String, default: null },
  ext: { type: String, default: null },
  id: { type: Number, default: 0, unique: true },
  name: { type: String, require: true },
  path: { type: String, default: null },
});

//token令牌黑名单
const blacklistTokenSchema = new Schema(
  {
    account: { type: String, required: true },
    token: { type: String, required: true },
    expiration: { type: Date },
  },
  versionKey
);
// navSchema.plugin(autoIncrement.plugin,{ model: 'Nav', field: 'id', startAt: 1, incrementBy: 1 });

module.exports = {
  modelAdmin: model("admin", adminSchema),
  modelNav: model("nav", navSchema),
  modelBanner: model("banner", bannerSchema),
  modelDataStudent: model("studentData", studentDataSchema),
  modelDataTeacher: model("teacherData", teacherDataSchema),
  modelTeacher: model("teacher", teacherSchema),
  modelStudent: model("student", studentSchema),
  modelCourse: model("course", courseSchema),
  modelRole: model("role", roleSchema),
  modelBlacklistToken: model("blacklistToken", blacklistTokenSchema),
  modelFile: model("file", fileSchema),
  modelSchedule: model("schedule", scheduleSchema),
};
