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
    roleListAPI
} from "../../api/api";
import { dateFormat } from "../../utils/common";
import MyPagination from "../../components/pagination";
import { InboxOutlined } from "@ant-design/icons";

export default function Role() {
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);

  const [queryParams, setQueryParams] = useState({
    pageNo: 1,
    pageSize: 10,
  });

  //显示弹窗
  const showModal = () => {
    notification.info({
      message: "功能正在开发中",
    })
  };

  //获取角色列表
  const getRoleList = async () => {
    let res = await roleListAPI(queryParams);
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
  useEffect(() => {
    getRoleList();
  }, [queryParams]);
  const columns = [
    {
      title: "角色名称",
      dataIndex: "role_name",
    },
    {
      title: "角色描述",
      dataIndex: "role_dsc",
    },
    {
      title: "创建时间",
      dataIndex: "created",
      render: (text) => dateFormat(text),
    },
    {
        title: "角色类型码",
        dataIndex: "type",
    }
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
            新增角色
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
  
    </div>
  );
}
