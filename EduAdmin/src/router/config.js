import Login from "../login";
import Layout from "../layout";
import NotFound from "../views/404";
import Common from './common'
import permission from "../utils/permission";

const setRouteData = data=>{
    return data.map(item=>({
        path:item.url,
        name:item.name,
        element:item.element,
        meta:{title:item.title},
        children:item.children?setRouteData(item.children):null
    }))
}

export const routes = [
    {
        from:'*',
        to:'/404'
    },
    {
        from:'/',
        to:'/home/index'
    },
    {
        from:'/home',
        to:'/home/index',
    },
    {
        path:'/404',
        name:'404',
        element:<NotFound/>
    },
    {
        path:'/login',
        name:'login',
        element:<Login/>
    },
    {
        path:'/home',
        name:'home',
        element:<Layout/>,
        children:setRouteData(permission(Common))
    }
]