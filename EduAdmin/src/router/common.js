import Index from '../views/home/index'
import Course from '../views/course/index'
import Schedule from '../views/schedule/index'
import Teacher from '../views/teacher/index'
import Student from '../views/student/index'
import TeacherInfo from "../views/teacher/teacherInfo";
import CoursesTaught from "../views/teacher/coursesTaught";
import Information from '../views/information/index'
import DataUpload from "../views/information/dataUpload";
import DataDownload from "../views/information/dataDownload";
import System from "../views/system/index";
import Banner from "../views/system/banner";
import Role from "../views/system/role";
import Admin from "../views/system/admin";
import {
    HomeOutlined,
    TeamOutlined,
    UserOutlined,
    TableOutlined,
    SolutionOutlined,
    IdcardOutlined,
    FolderOutlined,
    CloudUploadOutlined,
    CloudDownloadOutlined,
    CalendarOutlined,
    SettingOutlined,
    BulbOutlined,
    TrademarkCircleOutlined
  } from "@ant-design/icons";

export default [
    {
        title:'首页',
        icon:<HomeOutlined/>,
        url:'/home/index',
        name:'index',
        element:<Index/>,
    },
    {
        title:'课程管理',
        icon:<TableOutlined/>,
        url:'/home/course',
        name:'course',
        element:<Course/>,
    },
    {
        title:'教师管理',
        icon:<TeamOutlined/>,
        url:'/home/teacher',
        name:'teacher',
        element:<Teacher/>,
        children:[
            {
                title:'教师信息',
                icon:<IdcardOutlined/>,
                url:'/home/teacher/teacherInfo',
                name:'teacherInfo',
                element:<TeacherInfo/>,
            },
            {
                title:'所授课程',
                icon:<SolutionOutlined/>,
                name:'coursesTaught',
                url:'/home/teacher/coursesTaught',
                element:<CoursesTaught/>,
            }
        ]
    },
    {
        title:'排课管理',
        icon:<CalendarOutlined />,
        url:'/home/schedule',
        name:'schedule',
        element:<Schedule/>,
    },
    {
        title:'学生管理',
        icon:<UserOutlined/>,
        url:'/home/student',
        name:'student',
        element:<Student/>,
    },
    {
        title:'资料管理',
        icon:<FolderOutlined/>,
        url:'/home/information',
        name:'information',
        element:<Information/>,
        children:[
            {
                title:'资料上传',
                icon:<CloudUploadOutlined/>,
                url:'/home/information/dataUpload',
                name:'dataUpload',
                element:<DataUpload/>,
            },
            {
                title:'资料下载',
                icon:<CloudDownloadOutlined/>,
                url:'/home/information/dataDownload',
                name:'dataDownload',
                element:<DataDownload/>,
            }
        ]
    },
    {
        title:'系统管理',
        icon:<SettingOutlined/>,
        url:'/home/system',
        name:'system',
        element:<System/>,
        children:[
            // {
            //     title:'用户管理',
            //     icon:<UserOutlined/>,
            //     url:'/home/system/user',
            //     name:'user',
            //     element:<User/>,
            // }
            {
                title:'轮播图设置',
                icon:<BulbOutlined/>,
                url:'/home/system/banner',
                name:'banner',
                element:<Banner/>,
            },
            {
                title:'角色列表',
                icon:<TrademarkCircleOutlined/>,
                url:'/home/system/role',
                name:'role',
                element:<Role/>,
            },
            {
                title:'管理员列表',
                icon:<UserOutlined/>,
                url:'/home/system/admin',
                name:'admin',
                element:<Admin/>
            }
        ]
    }
]