import http from './http'

//登录
export const userLoginAPI = (data) => http.post('user/login', data);

//退录
export const userLoginoutAPI = () => http.post('user/loginout',{});

//首页类别图表数据
export const categoryDataAPI = () => http.get('teacher/count');

//首页学生图表数据
export const studentDataAPI = () => http.get('student/count');

//课程管理-获取课程列表
export const courseListAPI = (data) => http.get(`course/list`,data);

//课程管理-删除数据
export const courseDeleteAPI = (id) => http.delete(`course/delete/${id}`);

//课程管理-编辑课程
export const courseCreateUpdateAPI = (data) => http.post(`course/create-update`, data);

//课程管理-教师信息-获取老师列表
export const teacherListAPI = (data) => http.get(`teacher/list`, data);

//课程管理-编辑教师
export const teacherCreateUpdateAPI = (data) => http.post(`teacher/create-update`, data);

//课程管理-删除老师
export const teacherDeleteAPI = (id) => http.delete(`teacher/removeUser/${id}`);

//教师管理——所授课程-获取所有教师
export const teacherAllAPI = (data) => http.get(`teacher/all`, data);

//教师管理——所授课程-获取所有课程
export const courseAllAPI = (data) => http.get(`course/all`, data);

//排课管理-获取排课列表
export const scheduleListAPI = (data) => http.get(`schedule/list`, data);

//排课管理-删除排课数据
export const scheduleDeleteAPI = (id) => http.delete(`schedule/delete/${id}`);

//排课管理-编辑排课
export const scheduleCreateUpdateAPI = (data) => http.post(`schedule/create-update`, data);

//学生管理-获取学生列表
export const studentListAPI = (data) => http.get(`student/list`, data);

//学生管理-编辑学生
export const studentCreateUpdateAPI = (data) => http.post(`student/create-update`, data);

//学生管理-删除学生
export const studentDeleteAPI = (id) => http.delete(`student/removeUser/${id}`);

//资料管理-资料上传
export const fileUploadAPI = (data) => http.upload(`material/create`, data);

//资料管理-资料列表
export const fileListAPI = (data) => http.get(`material/list`, data);

//资料管理-资料列表-下载
export const fileDownloadAPI = (id) => http.get(`material/download/${id}`);

//资料管理-资料列表-删除
export const fileDeleteAPI = (id) => http.delete(`material/removeFile/${id}`);

//系统管理-轮播图设置-图片上传
export const bannerUploadAPI = (data) => http.upload(`banner/create`, data);

//系统管理-轮播图设置-轮播图列表
export const bannerListAPI = (data) => http.get(`banner/list`, data);

//系统管理-轮播图设置-轮播图删除
export const bannerDeleteAPI = (id) => http.delete(`banner/removeBanner/${id}`);

//系统管理-角色列表
export const roleListAPI = (data) => http.get(`role/list`, data);

//系统管理-管理员添加编辑
export const adminCreateUpdateAPI = (data) => http.post(`admin/create-update`, data);

//系统管理-管理员列表
export const adminListAPI = (data) => http.get(`admin/list`, data);

//系统管理-管理员列表-删除
export const adminDeleteAPI = (id) => http.delete(`admin/removeUser/${id}`);