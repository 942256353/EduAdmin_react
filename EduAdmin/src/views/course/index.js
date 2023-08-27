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
} from "antd";
import {
  courseListAPI,
  courseDeleteAPI,
  courseCreateUpdateAPI,
} from "../../api/api";
import { dateFormat } from "../../utils/common";
import dayjs from "dayjs";
import MyPagination from "../../components/pagination";
import { getPermission } from "../../utils/permission";

export default function Course() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [category, setCategory] = useState("add");
  const [row, setRow] = useState({});
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [queryParams, setQueryParams] = useState({
    pageNo: 1,
    pageSize: 10,
  });
  const permission = getPermission();
  console.log("permission", permission);
  //显示弹窗
  const showModal = (record, type) => {
    setCategory(type);
    setRow(record);
    const value =
      type === "add"
        ? form.resetFields()
        : {
            ...record,
            created: dayjs(record.created, "YYYY-MM-DD"), //antd日期需要转为对象方式
          };
    form.setFieldsValue(value);
    setIsModalOpen(true);
  };
  //弹窗确认
  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        let res = await courseCreateUpdateAPI({ ...row, ...values });
        if (res) {
          notification.success({
            message: "成功",
            description: "提交成功",
          });
          getCourseList();
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
  //获取科目列表
  const getCourseList = async () => {
    let res = await courseListAPI(queryParams);
    if (res) {
      setDataSource(res.data.data.list);
      setTotal(res.data.data.rows);
    }
  };
  //删除课程
  const handleDelete = async (id) => {
    let res = await courseDeleteAPI(id);
    if (res) {
      notification.success({
        message: "成功",
        description: "删除成功",
      });
      getCourseList();
    }
  };
  //页码
  const onChange = (current, pageSize) => {
    console.log(current, pageSize);
    setQueryParams({ pageNo: current, pageSize });
  };
  useEffect(() => {
    getCourseList();
  }, [queryParams]);
  const columns = [
    {
      title: "课程名称",
      dataIndex: "name",
    },
    {
      title: "创建日期",
      dataIndex: "created",
      render: (text) => <span>{dateFormat(text)}</span>,
    },
  ];
  const operationColumn = {
    title: "操作",
    render: (_, record) => (
      <Space size="middle">
        <a onClick={() => showModal(record, "update")}>编辑</a>
        <Popconfirm
          title="温馨提示：删除后不可恢复"
          description="你确定删除这门课程吗?"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>
      </Space>
    ),
  };
  if (permission && !columns.some((column) => column.title === "操作")) {
    columns.push(operationColumn);
  }
  const rules = {
    name: [{ required: true, message: "请输入课程名称" }],
    created: [{ required: true, message: "请选择创建时间" }],
  };
  return (
    <div>
      <Table
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        title={() =>
          permission ? (
            <Button type="primary" onClick={() => showModal(null, "add")}>
              新增科目
            </Button>
          ) : null
        }
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
        title={category === "add" ? "新增课程" : "编辑课程"}
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
            name: "",
          }}
          style={{
            width: "100%",
            height: "auto",
            padding: "10px 0",
          }}
        >
          <Form.Item label="课程名称" name="name" rules={rules["name"]}>
            <Input placeholder="请输入课程名称" allowClear />
          </Form.Item>
          <Form.Item label="创建日期" name="created" rules={rules["created"]}>
            <DatePicker
              placeholder="请选择日期"
              disabled={category === "update"}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
