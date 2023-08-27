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
  studentListAPI,
  studentCreateUpdateAPI,
  studentDeleteAPI,
} from "../../api/api";
import { dateFormat } from "../../utils/common";
import dayjs from "dayjs";
import md5 from "md5";
import MyPagination from "../../components/pagination";
import { getPermission } from "../../utils/permission";
import { getType } from "../../utils/userType";
import { getUserInfo } from "../../utils/userInfo";


export default function Student() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [category, setCategory] = useState("add");
  const [row, setRow] = useState({});
  const [form] = Form.useForm();
  const [total,setTotal] = useState(0);
  const permission = getPermission();
  const type = getType();
  const userInfo = JSON.parse(getUserInfo());
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
        let params = { ...row, ...values };
        params.password = md5(params.password);
        let res = await studentCreateUpdateAPI(params);
        if (res) {
          notification.success({
            message: "成功",
            description: "提交成功",
          });
          getstudentList();
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
  //获取学生列表
  const getstudentList = async () => {
    let res = await studentListAPI(queryParams);
    if (res) {
      setDataSource(res.data.data.list);
      setTotal(res.data.data.rows);
    }
  };
  //删除学生
  const handleDelete = async (id) => {
    let res = await studentDeleteAPI(id);
    if (res) {
      notification.success({
        message: "成功",
        description: "删除成功",
      });
      getstudentList();
    }
  };

  useEffect(() => {
    getstudentList();
  }, [queryParams]);
  //页码
  const onChange = (current, pageSize) => {
    console.log(current, pageSize);
    setQueryParams({ pageNo: current, pageSize });
  };
  const updateColumn = (record)=>(<a onClick={() => showModal(record, "update")}>编辑</a>);
  const deleteColumn = (record)=>( <Popconfirm
    title="温馨提示：删除后不可恢复"
    description="你确定删除这个学生吗?"
    onConfirm={() => handleDelete(record.id)}
    okText="确定"
    cancelText="取消"
  >
    <a>删除</a>
  </Popconfirm>);
  const columns = [
    {
      title: "学生姓名",
      dataIndex: "account",
    },
    {
      title: "密码",
      dataIndex: "password",
    },
    {
      title: "创建日期",
      dataIndex: "created",
      render: (text) => <span>{dateFormat(text)}</span>,
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space size="middle">
           {type=='3'?(record.id==userInfo.id?updateColumn(record):null):updateColumn(record)}
           {permission&&deleteColumn(record)}
        </Space>
      ),
    },
  ];
  const rules = {
    account: [{ required: true, message: "请输入学生姓名" }],
    password: [{ required: true, message: "请输入密码" }],
    created: [{ required: true, message: "请选择创建时间" }],
  };
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        pagination={false}
        title={() => permission?(
          <Button type="primary" onClick={() => showModal(null, "add")}>
            新增学生
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
        title={category === "add" ? "新增学生" : "编辑学生"}
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
            password:'',
            created: '',
          }}
          style={{
            width: "100%",
            height: "auto",
            padding: "10px 0",
          }}
        >
          <Form.Item label="学生姓名" name="account" rules={rules["account"]}>
            <Input placeholder="请输入学生姓名" allowClear />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={rules["password"]}>
            <Input.Password placeholder="请输入密码" allowClear />
          </Form.Item>
          <Form.Item label="创建日期" name="created" rules={rules["created"]}>
            <DatePicker placeholder="请选择日期" disabled={category==='update'}/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
