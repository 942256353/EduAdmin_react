import { useState, useEffect,} from "react";
import{useNavigate} from "react-router-dom";
import {
  Button,
  Form,
  Select,
  Card,
  DatePicker,
  notification,
  Input,
  Upload,
} from "antd";
import { courseAllAPI, fileUploadAPI } from "../../api/api";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function DataUpload() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [course, setCourse] = useState([]);

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
        const formData = new FormData();
        value.file = value.file[0].originFileObj;
        formData.append("course_id", value.course_id);
        formData.append("name", value.name);
        formData.append("file", value.file);
        console.log(formData);
        let res = await fileUploadAPI(formData);
        if (res) {
          notification.success({
            message: "上传成功",
          });
          form.resetFields();
          navigate('/home/information/dataDownload');
        }
      })
      .catch((err) => {
        console.log("err");
      });
  };
  //上传前
  const beforeUpload = (file) => {
    console.log(file);
    const isLt2M = file.size < 2 * 1024 * 1024;
    if (!isLt2M) { 
      notification.warning({
        message: "上传文件大小不能超过 2MB!",
      });
      return Upload.LIST_IGNORE;//不符合不展示
    } 
    return false;
  }
  //选择课程
  const onCourseChange = (value) =>{

    const name = course.filter(v=>v.id===value)?.[0]?.name;
    form.setFieldsValue({name})
  }
  useEffect(() => {
    getCourseAll();
  }, []);
  return (
    <Card title="资料上传" bordered>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        //   onFinish={onFinish}
        style={{
          maxWidth: "100%",
          height: "100%",
        }}
      >
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
            onChange={onCourseChange}
            style={{
              width: 500,
            }}
            allowClear
            options={course}
          ></Select>
        </Form.Item>
        <Form.Item
          label="文件名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入文件名称",
            },
          ]}
        >
          <Input
            placeholder="请输入文件名称"
            allowClear
            style={{
              width: 500,
            }}
          />
        </Form.Item>
        <Form.Item label="上传文件">
          <Form.Item
            name="file"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                message: "请选择文件上传",
              },
            ]}
            noStyle
          >
            <Upload.Dragger
              name="files"
              action=""
              accept=".rar"
              maxCount={1}
              beforeUpload={beforeUpload}
              title="请选择.rar文件上传"
              style={{
                width: 500,
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file(.rar) to this area to upload
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>资料上传</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
