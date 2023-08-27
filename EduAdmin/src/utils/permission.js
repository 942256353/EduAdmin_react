import { getType } from "./userType";
import { deepCloneObj } from "./function";

export default function permission(menus){
    console.log(menus);
    let data = deepCloneObj(menus);
    console.log('2',data);
    let type = getType();
    if(type=='2'){//老师权限
        return data.filter(v=>v.name!=='system')
    }else if(type=='3'){//学生权限
        return data.filter(v=>v.name!=='system').filter(v=>{
            if(v.name==='teacher'){
                v.children = v.children.filter(v=>v.name!=='coursesTaught')
            }else if(v.name==='information'){
                v.children = v.children.filter(v=>v.name!=='dataUpload')
            }
            return v;
        })
    }else{//管理员权限
        return data;
    }
}

export function getPermission(){
    let type = getType();
    return !(type=='3');
}