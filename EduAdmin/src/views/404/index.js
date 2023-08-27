// const timgUrl = require('../../assets/img/timg.gif')
const timgUrl = 'http://43.138.152.177:7003/static/img/timg.gif'
export default function NotFound(){
    return (
        <div style={{width:"100%",height:"100%"}}> <img src={timgUrl}  style={{width:"100%",maxHeight:"99vh",objectFit:'cover'}}></img> </div>
    )                                           
}