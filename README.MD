## 项目描述
教务管理系统为管理员、教师、学生定制，方便创建及管理教师、学生及课程信息，教师上传文件资
料，学生支持下载；不同角色登录查看不同权限。
目前设置种角色权限
1. 管理员：admin是超级拥有所有权限,其他的管理员都由admin 创建,在管理员列表只能编辑自己管理员信息，其它权限和admin一样
2. 教师：可以创建、修改、删除管理所有学生和课程、只能修改自己的教师信息和给自己排课，可以上传下载删除资料
3. 学生：基本上只有查看权限，可以修改自己信息和可以下载资料模块

## 技术栈
前端：create-react-app react18 react-router-dom6 md5 antd axios dayjs echarts  后端:nodejs+koa+mongoose

## 项目演示地址
http://43.138.152.177:8083/

## 项目安装运行
分别前后端两个项目
1.下载下来后分别进入文件夹进行依赖安装(npm install)
2.前端运行 npm start 
  后端运行 npm start(这里我默认nodemon运行，没安装的可以安装一下npm install nodemon)或者直接运行node app.js