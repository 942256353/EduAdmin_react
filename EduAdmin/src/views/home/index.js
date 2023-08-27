import { Carousel, Card } from "antd";
import React, { useState, useEffect } from "react";
import Chart from "./chart/chart";
import usePieOption from "./chart/usePieOption";
import useBarOption from "./chart/useBarOption";
import Module from "./module";
import {
  TeamOutlined,
  UserOutlined,
  FolderOutlined,
  CalendarOutlined ,
} from "@ant-design/icons";
import { getToken } from "../../utils/auth";
import { bannerListAPI, categoryDataAPI, studentDataAPI } from "../../api/api";

const URL = process.env.REACT_APP_API_URL;

// 轮播图
export default function Index() {
  const [imgs, setImgs] = useState([]);
  const [students, setStudents] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [moduleData, setModuleData] = useState([
    { id: 1, name: "教师信息", icon: <UserOutlined />, url: "/home/category/categoryInfo" },
    { id: 2, name: "排课管理", icon: <CalendarOutlined  />, url: "/home/schedule" },
    { id: 3, name: "学生管理", icon: <TeamOutlined />, url: "/home/student" },
    { id: 4, name: "资料列表", icon: <FolderOutlined />, url: "/home/information/dataDownload" },
  ]);
  const barOption = useBarOption(students);
  const pieOption = usePieOption(categorys);

  const getBannerList = async () => {
    let res = await bannerListAPI();
    if (res) {
      let { code, data } = await res.data;
      if (code === 20000) {
        console.log(data.list);
        setImgs(data.list.map(item=>item.path));
      }
    }
  };

  const getStudentList = async () => {
    let res = await studentDataAPI();
    if (res) {
      let { code, data } = await res.data;
      if (code === 20000) {
        setStudents(data);
      }
    }
  };

  const getCategoryList = async () => {
    let res = await categoryDataAPI();
    if (res) {
      let { code, data } = await res.data;
      if (code === 20000) {
        setCategorys(data);
      }
    }
  };
  useEffect(() => {
    getBannerList();
    getStudentList();
    getCategoryList();
  }, []);
  return (
    <div>
      <div className="banner">
        <Carousel autoplay>
          {imgs.length > 0 &&
            imgs.map((img, index) => (
              <img key={index} src={img} alt="banner" />
            ))}
        </Carousel>
      </div>
      <div className="module-box">
        <div style={{ flex: "0 1 60%" }}>
          <Card title="各类别数量及占比" bordered>
            <Chart option={pieOption} height="430px" />
          </Card>
        </div>
        <div style={{ flex: "0 1 40%" }}>
          <div className="module-box">
            <div style={{ flex: "0 1 100%" }}>
              <Card title="组织架构" bordered>
                <Module moduleData={moduleData} height="200px" />
              </Card>
            </div>
          </div>
          <div className="module-box">
            <div style={{ flex: "0 1 100%" }}>
              <Card title="今年来学生新增人数统计" bordered>
                <Chart option={barOption} height="200px" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
