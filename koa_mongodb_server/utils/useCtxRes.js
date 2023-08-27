/**
*| 状态码 | 描述 |
*| :----: | :----: | 
*| 20000| 请求成功 |
*| 20001| 参数错误 | 
*| 20002| token不存在或已经失效 |
*| 20003| 用户名不存在或密码错误 |
*| 20004| 需要新增的项目已经存在 |
*| 20005| 需要删除的项目不删存在 |
*/
const useCtxRes = (ctx)=>{
    return {
        _20000:(massage)=>{
            return ctx.body = {
                code: 20000,
                msg: massage+"成功",
            }
        } ,
        _20001:(massage="未知错误或者参数错误")=>  {
            return ctx.body =   {
                code: 20001, 
                msg: massage,
            }
        },
        _20002:(massage="登录密钥不存在或已失效，请重新登录")=>  {
            return ctx.body =   {
                code: 20002, 
                msg: massage,
            }
        },
        _20003:(massage="用户名不存在或密码错误")=>  {   
            return ctx.body =   {
                code: 20003, 
                msg: massage,
            }     
        },  
        _20004:(massage="需要新增的项目")=>  {
            return ctx.body =   {
                code: 20004, 
                msg: massage+'已存在，请勿重复添加',
            }
        },
        _20005:(massage="需要删除的项目")=>  {
            return ctx.body =   {
                code: 20005, 
                msg: massage+'不存在',
            }
        }
    }
}

module.exports = useCtxRes;
