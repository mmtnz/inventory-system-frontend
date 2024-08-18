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
            <section className="content">
                <div className = "item">
                    <h1>{item.name}</h1>

                    <div className="item-image">
                        {item.image !== null && item.image !== ""? (
                            <img
                                src={`${url}/image/${item.image}`}
                                alt={item.name}
                                className="image-item"
                            />
                        ):(
                            <img src={defaultImage} className="image-item"/>
                        )}
                    </div>

                    <div className="item-data">
                        <div className="item-data-group">
                            <label>Nombre:</label>
                            <p>{item.name}</p>
                        </div>

                        <div className="item-data-group">
                            <label>Tags:</label>
                            {(item.tagsList && item.tagsList.length > 0) && 
                                <div className="tags-container">
                                    {item.tagsList.map((tag, index) => (
                                        <div className="tag-item" key={index}>
                                            <span className='tag'>{tag}</span>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>

                        <div className="item-data-group">
                            <label>Ubicación:</label>
                            <p>{item.location}</p>
                        </div>
                        
                        <div className="item-data-group">
                            <label>Descripcion:</label>
                            <p>{item.description}</p>
                        </div>

                    </div>


                </div>
            </section>
        </div>
    );
};
export default Item;