import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  notification,
  Popconfirm,
  Form,
  Modal,
  Input,
  Button,
  Upload,
  Image 
} from "antd";
import {
  bannerListAPI,
  bannerDeleteAPI,
  bannerUploadAPI,
} from "../../api/api";
import { dateFormat } from "../../utils/common";
import MyPagination from "../../components/pagination";
import { InboxOutlined } from "@ant-design/icons";

export default function Banner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const fileList = [];
  const [queryParams, setQueryParams] = useState({
    pageNo: 1,
    pageSize: 10,
  });

  //显示弹窗
  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  //弹窗确认
  const handleOk = () => {
    form
      .validateFields()
      .then(async (value) => {
        console.log('value',value);
        const formData = new FormData();
        value.file = value.file[0].originFileObj;
        formData.append("name", value.name);
        formData.append("file", value.file);
        let res = await bannerUploadAPI(formData);
        if (res) {
          notification.success({
            message: "上传成功",
          });
          form.resetFields();
          setIsModalOpen(false);
          getBannerList();
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

  //获取图片列表
  const getBannerList = async () => {
    let res = await bannerListAPI(queryParams);
    if (res) {
      setDataSource(res.data.data.list);
      setTotal(res.data.data.rows);
    }
  };
  //页码
  const onChange = (current, pageSize) => {
    console.log(current, pageSize);
    setQueryParams({ pageNo: current, pageSize });
  };

  //图片删除
  const handleDelete = async (id) => {
    const res = await bannerDeleteAPI(id);
    if (res) {
      notification.success({
        message: "删除成功",
      });
      getBannerList();
    }
  };
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  //上传之前
  const beforeUpload = (file) => {
    console.log(file);
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      notification.warning({
        message: "上传文件只能是 JPG 或 PNG 格式!",
      });
      return Upload.LIST_IGNORE;
    }
    const name = file.name.substr(0, file.name.lastIndexOf(".")); //获取文件名
    form.setFieldsValue({
      name
    });
    return false;
  };
  useEffect(() => {
    getBannerList();
  }, [queryParams]);
  const columns = [
    {
      title: "图片名称",
      dataIndex: "name",
    },
    {
      title: "创建日期",
      dataIndex: "created",
      render: (text) => <span>{dateFormat(text)}</span>,
    },
    {
        title:'图片',
        dataIndex:'path',
        render:(path)=>(<Image
        width={40}
        height={40}
        src={path||'error'}
      />)
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="温馨提示：删除后不可恢复"
            description="你确定删除这个图片吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        title={() => (
          <Button type="primary" onClick={() => showModal()}>
            新增图片
          </Button>
        )}
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
        title="新增"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        maskClosable={false}
        style={{
          width: "800px",
        }}
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
          
          <Form.Item label="上传图片">
            <Form.Item
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: "请选择图片上传",
                },
              ]}
              noStyle
            >
              <Upload.Dragger
                name="files"
                action=""
                listType="picture"
                accept=".png, .jpg, .jpeg"
                defaultFileList={[...fileList]}
                maxCount={1}
                beforeUpload={beforeUpload}
                title="请选择.png, .jpg, .jpeg图片上传"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file(.png, .jpg, .jpeg) to this area to upload
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="图片名称"
            name="name"
            rules={[
              {
                required: true,
                message: "请输入图片名称",
              },
            ]}
          >
            <Input placeholder="请输入图片名称" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
