import { useParams } from "react-router-dom";
import API_BASE_URL, { apiGetItem } from "../services/api";
import { useEffect, useState } from "react";
import defaultImage from "../assets/images/default.png"


const Item = () => {
    
    let id = useParams().id;
    let url = API_BASE_URL;
    const [item, setItem] = useState({});
    const [status, setStatus] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        loadItem();
        // axios.get(`${url}/item/${id}`)
        //     .then(res => {
        //         if(res.data){
        //             setItem(res.data);
        //             setStatus("sucess");
        //             console.log(res.data);
        //         }
        //         else{
        //             console.log('error')
        //             console.log(res)
        //         }
        //     })
    }, [])

    const loadItem = async () => {
        try {
            const data = await apiGetItem(id);
            setItem(data);
            setError(null);
        } catch (err) {
            setItem({})
            console.log(err)
            setError('Error cargando elemento')
        }
        
    }

    if (error) {
        return(
            <div>{error}</div>
        )
    }

    return (
        <div id="item">
            <section id="content">
                <div className = "item">
                    <h1>{item.name}</h1>
                    <div>
                        {item.image !== null ? (
                            <img
                                src={`${url}/image/${item.image}`}
                                alt={item.name}
                                className="image-item"
                            />
                        ):(
                            <img src={defaultImage} className="image-item"/>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
export default Item;