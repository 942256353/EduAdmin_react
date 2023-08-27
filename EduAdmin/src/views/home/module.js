import {useNavigate} from "react-router-dom";

export default function Module({moduleData}){
    const navigate = useNavigate();

    return (
        <div className ="module-box">
            {
                moduleData.map(v=>
                    <div className="box" key={v.id} onClick={()=>navigate(v.url)}>
                        <div className="list-box">
                            <i>{v.icon}</i>
                            <p>{v.name}</p>
                        </div>
                    </div>)
            }
        </div>
    )
}