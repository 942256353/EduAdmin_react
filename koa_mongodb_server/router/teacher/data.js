const router = require("@koa/router")();

const { modelDataTeacher } = require("../../models/collection");

const teachers = [
  { value: 1048, name: "专任教师" },
  { value: 735, name: "辅导员" },
  { value: 580, name: "党政管理人员" },
  { value: 484, name: "专业技术人员" },
  { value: 300, name: "后勤人员" },
];

router.post("/create", async (ctx) => {
  const lastDocument = await modelDataTeacher.findOne({}, {}, {sort: { id: -1 } });
  let lastId = lastDocument ? lastDocument.id : 0;
  const teachersWithIds = teachers.map((item) => {
    return {
      id: ++lastId, 
      ...item,
    };
  });
  const res = await modelDataTeacher.insertMany(teachersWithIds);
  console.log(res);
  ctx.body = {
    code: 20000,
    message: "success",
    data: res,
  };
  console.log(res);
});

router.get("/list", async (ctx) => {
  const res = await modelDataTeacher.find({},{_id:0});
  ctx.body = {
    code: 20000,
    message: "success",
    data: res,
  };
});

module.exports = router.routes();
