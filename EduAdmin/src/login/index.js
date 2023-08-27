import "./login.css";
import { Form, Input,Button,notification } from "antd";
import {useNavigate} from 'react-router-dom'
import {userLoginAPI} from '../api/api'
import md5 from 'md5';
import { setToken } from "../utils/auth";
import { setType } from "../utils/userType";
import { setUserInfo } from "../utils/userInfo";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const rules = [
  {
    required: true,
    message: "请输入用户名",
  },
];

export default function Login() {
  const navigate = useNavigate();
  
  //定义表单数据
  const [form] = Form.useForm();
  //设置表单数据form.setFeildsValue({k:v})
  //登录
  const login = ()=>{
   form.validateFields().then(async value=>{
      value.password = md5(value.password);
      let res = await userLoginAPI(value);
      // console.log('login',res);
      const {code,data,msg} = res.data;
      if(code===20000){
        notification.success({
          message: '登录成功',
        });
        setToken(data.token);
        setType(data.user.type);
        setUserInfo(JSON.stringify({...data.role,...data.user}));
        navigate('/home');
      }else{
        console.log(msg);
      }
   }).catch(err=>{
    console.log(err)
   })
  }
  return (
    <div className="login">
      <div className="login-content">
        <div className="login-form login-item">
          <p className="login-title">高校教务管理系统</p>
          <Form
            form={form}
            name="basic"
            {...layout}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              account: "admin",
              password: "admin@123",
            }}
          >
            <Form.Item label="用户名" name="account" rules={rules}>
              <Input placeholder="请输入用户名" allowClear />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入密码",
                },
                {
                  min: 3,
                  max: 18,
                  message: "密码长度在3-18之间",
                },
              ]}
            >
              <Input.Password placeholder="请输入密码" allowClear />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit" onClick={login}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
