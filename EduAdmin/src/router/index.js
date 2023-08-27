import { BrowserRouter, Routes, Route, Link, NavLink,Navigate } from "react-router-dom";
import {routes} from './config'
import { getToken } from "../utils/auth";

function createRouter(routes){
 return routes.map((route,index)=>(
  route.path?
    <Route path={route.path} key={route.path} element={<Auth {...route}>{route.element}</Auth>}>
      {route.children && createRouter(route.children)}
    </Route>
    :
    <Route path={route.from} key={index} element={<Auth  {...route}><Navigate to={route.to}/></Auth>}>
    </Route>

  ))
}

function Auth(props) {
  if(props.path&&props.path==='/login') return props.children;
  const token = getToken();
  if (token) {
    return props.children;
  }
  return <Navigate to="/login" />;
}

export const RouterConfig = () => {
  return (
    <BrowserRouter>
      <Routes>
        {createRouter(routes)}
      </Routes>
    </BrowserRouter>
  );
};
