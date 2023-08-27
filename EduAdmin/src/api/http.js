import axios from ".";

const http ={
    get:(url,params)=>axios.get(url,{params}),
    post:(url,params)=>axios.post(url,params),
    // put:()=>axios.put(),
    delete:(url,params)=>axios.delete(url,params),
    upload:(url,file)=>axios.post(url,file,{headers:{"Content-Type":"mutipart/form-data"}}),
    // download:(url,params)=>axios.get(url,{params,responseType:'blob'})
}

export default http;