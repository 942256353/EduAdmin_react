import React, { useState, useEffect } from "react";
import { Space, Table, notification,Popconfirm } from "antd";
import { fileListAPI, fileDownloadAPI,fileDeleteAPI } from "../../api/api";
import { dateFormat } from "../../utils/common";
import MyPagination from "../../components/pagination";
import { getToken } from "../../utils/auth";
import { getPermission } from "../../utils/permission";

export default function DataUpload() {
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const permission = getPermission();
  const [queryParams, setQueryParams] = useState({
    pageNo: 1,
    pageSize: 10,
  });
  //获取文件列表
  const getCourseList = async () => {
    let res = await fileListAPI(queryParams);
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
  //文件下载
  const downloadFile = async (record) => {
    //    const xhr = new XMLHttpRequest();
    //    xhr.open('GET', record.path, true);
    //    xhr.responseType = 'blob'; // 返回类型blob
    //    xhr.send();
    //    xhr.onload = ()=>{
    //     console.log(xhr.response);
    //     const blob = new Blob([xhr.response]);
    //     const url = window.URL.createObjectURL(blob); // 创建下载的链接
    //     const a = document.createElement('a');
    //     a.href = url;
    //     const fileName = replaceFileName(record.name, record.path); // 替换文件名的一部分
    //     // a.download = record.path.split('/')[record.path.split('/').length - 1];
    //     a.download = fileName;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove();
    //     notification.success({
    //       message: '下载成功'
    //     })
    //    }

    // const response = await fetch(record.path, {
    //   headers: {
    //     token: getToken(),
    //   },
    // });
    // const data = await response.blob();
    // const _blob = new Blob([data]);
    // const url = window.URL.createObjectURL(_blob);
    // const a = document.createElement("a");
    // a.href = url;
    // const fileName = replaceFileName(record.name, record.path); // 替换文件名的一部分
    // a.download = fileName;
    // a.click();
    // notification.success({
    //   message: "下载成功",
    // });
    // a.remove();
    // window.URL.revokeObjectURL(url);

    let res = await fileDownloadAPI(record.id);
    if (res) {
      const {path}= res.data.data;
      const response = await fetch(path);
      const data = await response.blob();
      const _blob = new Blob([data]);
      const url = window.URL.createObjectURL(_blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = replaceFileName(record.name, record.path); // 替换文件名的一部分
      a.download = fileName;
      a.click();
      notification.success({
        message: "下载成功",
      });
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  };
  function replaceFileName(newName, filePath) {
    const extensionIndex = filePath.lastIndexOf("."); // 获取文件名中最后一个点的位置
    const fileName = filePath.substring(0, extensionIndex); // 提取点之前的文件名部分
    const replacedFileName = newName; // 使用 record.name 替换文件名部分
    const extension = filePath.substring(extensionIndex); // 提取文件名中的扩展名部分
    return replacedFileName + extension; // 拼接替换后的完整文件名
  }
  //文件删除
  const handleDelete = async (id) => {
    const res = await fileDeleteAPI(id);
    if (res) {
      notification.success({
        message: "删除成功"
      });
      getCourseList();
    }
  }
  useEffect(() => {
    getCourseList();
  }, [queryParams]);
  const columns = [
    {
      title: "文件名称",
      dataIndex: "name",
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
          <a onClick={() => downloadFile(record)}>下载</a>
          {permission&&<Popconfirm 
            title="温馨提示：删除后不可恢复"
            description="你确定删除这个文件吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>}
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
