import { Pagination } from "antd";

export default function MyPagination({defaultCurrent,defaultPageSize,total,onChange}) {
   
    //每页条数
    const onShowSizeChange = (current, pageSize) => {
        // console.log(current, pageSize);
    };
    return (
        <Pagination
            onChange={onChange}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            defaultCurrent={defaultCurrent}
            defaultPageSize={defaultPageSize}
            current={defaultCurrent}
            total={total}
            showTotal={(total) => `共 ${total} 条`}
            showQuickJumper
        />)
}