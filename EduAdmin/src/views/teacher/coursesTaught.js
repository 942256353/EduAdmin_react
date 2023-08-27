import React,{ useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { Button, Form, Select, Card, DatePicker, notification } from "antd";
import {
  teacherAllAPI,
  courseAllAPI,
  scheduleCreateUpdateAPI,
} from "../../api/api";
import { getType } from "../../utils/userType";
import { getUserInfo } from "../../utils/userInfo";


const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

export default function CoursesTaught() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState([]);
  const [course, setCourse] = useState([]);
  const type = getType();
  const userInfo = JSON.parse(getUserInfo());
  const getTeacherAll = async () => {
    const res = await teacherAllAPI();
    if (res) {
      const data = res.data.data;
      setTeacher(
        data.map((item) => ({ ...item, label: item.account, value: item.id }))
      );
    }
  };

  const getCourseAll = async () => {
    let res = await courseAllAPI();
    if (res) {
      const data = res.data.data;
      setCourse(
        data.map((item) => ({ ...item, label: item.name, value: item.id }))
      );
    }
  };
  const rules = {
    time_start: [{ required: true, message: "请选择日期" }],
  };
  //提交
  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (value) => {
        let res = await scheduleCreateUpdateAPI(value);
        if (res) {
          const {msg} = res.data;
          notification.success({
            message: msg||"提交成功",
          });
          form.resetFields();
          navigate('/home/schedule');
        }
      })
      .catch((err) => {
        console.log("err");
      });
  };
  useEffect(() => {
    getTeacherAll();
    getCourseAll();
  }, []);
  return (
    <Card title="所授课程" bordered>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        //   onFinish={onFinish}
        style={{
          maxWidth: "100%",
          height: "100%",
        }}
        initialValues={{
          teacher_id: type=='2'?userInfo.id:'',
        }}
      >
        <Form.Item
          name="teacher_id"
          label="选择老师"
          rules={[
            {
              required: true,
              message: "请选择老师",
            },
          ]}
        >
          <Select
            placeholder="请选择老师"
            disabled={type=='2'}
            //   onChange={onGenderChange}
            style={{
              width: 500,
            }}
            allowClear
            options={teacher}
          ></Select>
        </Form.Item>
        <Form.Item
          name="course_id"
          label="选择课程"
          rules={[
            {
              required: true,
              message: "请选择课程",
            },
          ]}
        >
          <Select
            placeholder="请选择课程"
            //   onChange={onGenderChange}
            style={{
              width: 500,
            }}
            allowClear
            options={course}
          ></Select>
        </Form.Item>
        <Form.Item
          label="授课日期"
          name="time_start"
          rules={rules["time_start"]}
        >
          <DatePicker
            placeholder="请选择日期"
            style={{
              width: 500,
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
