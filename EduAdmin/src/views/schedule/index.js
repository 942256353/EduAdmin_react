import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  Modal,
  DatePicker,
  Form,
  Input,
  notification,
  Popconfirm,
  Select
} from "antd";
import {
  scheduleListAPI,
  scheduleDeleteAPI,
  scheduleCreateUpdateAPI,
  teacherAllAPI,
  courseAllAPI,
} from "../../api/api";
import { dateFormat } from "../../utils/common";
import dayjs from "dayjs";
import MyPagination from "../../components/pagination";
import { getPermission } from "../../utils/permission";
import { getType } from "../../utils/userType";
import { getUserInfo } from "../../utils/userInfo";

export default function Schedule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [category, setCategory] = useState("add");
  const [row, setRow] = useState({});
  const [form] = Form.useForm();
  const type = getType();
  const userInfo = JSON.parse(getUserInfo());
  const [teacher, setTeacher] = useState([]);
  const [course, setCourse] = useState([]);
  const [total, setTotal] = useState(0);
  const permission = getPermission();
  const [queryParams, setQueryParams] = useState({
    pageNo: 1,
    pageSize: 10,
  });
  //显示弹窗
  const showModal = (record, type) => {
    setCategory(type);
    setRow(record);
    const value =
      type === "add"
        ? form.resetFields()
        : {
            ...record,
            time_start: dayjs(record.time_start, "YYYY-MM-DD"), //antd日期需要转为对象方式
          };
    form.setFieldsValue(value);
    setIsModalOpen(true);
  };
  //弹窗确认
  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        let res = await scheduleCreateUpdateAPI({ ...row, ...values });
        if (res) {
          notification.success({
            message: "成功",
            description: "提交成功",
          });
          getScheduleList();
          setIsModalOpen(false);
        }
      })
      .catch((err) => {
        notification.error({
          message: "错误",
          description: "请检查输入",
        });
        console.log(err);
      });
  };
  //弹窗关闭
  const handleCancel = () => {
    console.log("handleCancel");
    setIsModalOpen(false);
  };
  //获取排课列表
  const getScheduleList = async () => {
    let res = await scheduleListAPI(queryParams);
    if (res) {
      setDataSource(res.data.data.list);
      setTotal(res.data.data.rows);
    }
  };
  //删除排课
  const handleDelete = async (id) => {
    let res = await scheduleDeleteAPI(id);
    if (res) {
      notification.success({
        message: "成功",
        description: "删除成功",
      });
      getScheduleList();
    }
  };
  //教师下拉列表
  const getTeacherAll = async () => {
    const res = await teacherAllAPI();
    if (res) {
      const data = res.data.data;
      setTeacher(
        data.map((item) => ({ ...item, label: item.account, value: item.id }))
      );
    }
  };
  //课程下拉列表
  const getCourseAll = async () => {
    let res = await courseAllAPI();
    if (res) {
      const data = res.data.data;
      setCourse(
        data.map((item) => ({ ...item, label: item.name, value: item.id }))
      );
    }
  };
  //页码
  const onChange = (current, pageSize) => {
    console.log(current, pageSize);
    setQueryParams({ pageNo: current, pageSize });
  };
  useEffect(() => {
    getTeacherAll();
    getCourseAll();
  }, []);
  useEffect(() => {
    getScheduleList();
  }, [queryParams]);
  const columns = [
    {
        title: "排课老师",
        dataIndex: "teacher_name",
      },
    {
      title: "排课名称",
      dataIndex: "course_name",
    },
    {
      title: "授课日期",
      dataIndex: "time_start",
      render: (text) => <span>{dateFormat(text)}</span>,
    },
    
  ];
  const updateColumn = (record)=>(<a onClick={() => showModal(record, "update")}>编辑</a>);
  const deleteColumn = (record)=>(<Popconfirm
    title="温馨提示：删除后不可恢复"
    description="你确定删除这门排课吗?"
    onConfirm={() => handleDelete(record.id)}
    okText="确定"
    cancelText="取消"
  >
    <a>删除</a>
  </Popconfirm>);
  const operationColumn ={
    title: "操作",
    render: (_, record) => (
      <Space size="middle">
        {type=='2'?(record.teacher_id==userInfo.id?updateColumn(record):null):updateColumn(record)}
        {type=='2'?(record.teacher_id==userInfo.id?deleteColumn(record):null):deleteColumn(record)}
      </Space>
    ),
  };
  if (permission && !columns.some((column) => column.title === "操作")) {
    columns.push(operationColumn);
  }
  const rules = {
    time_start: [{ required: true, message: "请选择日期" }],
  };
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  return (
    <div>
      <Table
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        title={() => permission?(
          <Button type="primary" onClick={() => showModal(null, "add")}>
            新增排课
          </Button>
        ):null}
        footer={() => (
          <>
            <MyPagination
              defaultCurrent={queryParams.pageNo}
              defaultPageSize={queryParams.pageSize}
              total={total}
              onChange={onChange}
            />
          </>
        )}
      />

      <Modal
        title={category === "add" ? "新增排课" : "编辑排课"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        maskClosable={false}
      >
        <Form
         form={form}
         labelCol={{
           span: 8,
         }}
         wrapperCol={{
           span: 16,
         }}
         initialValues={{
           teacher_id:type=='2'?userInfo.id:""
         }}
         style={{
           width: "100%",
           height: "auto",
           padding: "10px 0",
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
                allowClear
                style={{
                    width: 200,
                  }}
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
                allowClear
                style={{
                    width: 200,
                  }}
                options={course}
              ></Select>
            </Form.Item>
            <Form.Item
              label="授课日期"
              name="time_start"
              rules={rules["time_start"]}
            >
              <DatePicker placeholder="请选择日期" />
            </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
