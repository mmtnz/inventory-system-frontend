import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL, { apiDeleteItem, apiGetItem } from "../services/api";
import { useEffect, useState } from "react";
import defaultImage from "../assets/images/default.png"
import Swal from 'sweetalert2';
import messagesObj from "../schemas/messages";


const Item = ({args}) => {
    
    const tagList = args.tagList;
    const locationObj = args.locationObj;

    let id = useParams().id;
    let url = API_BASE_URL;
    const [item, setItem] = useState({});
    const [status, setStatus] = useState({});
    const [error, setError] = useState(null);

    const [place, setPlace] = useState(null);
    const [location, setLocation] = useState(null);
    const [sublocation, setSublocation] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadItem();
        // console.log(locationObj.zonesList.find(option => location.includes(option.value).label))
    }, [])

    const loadItem = async () => {
        try {
            const data = await apiGetItem(id);
            setItem(data);
            setError(null);

            let [auxPlace, auxLoc, auxSubLoc] = data.location.split('/');
            setPlace(locationObj.placesList.find(option => auxPlace.includes(option.value)));
            setLocation(locationObj.placeObj[auxPlace].zonesList.find(option => auxLoc.includes(option.value)));
            setSublocation(locationObj.placeObj[auxPlace].selfsObj[auxLoc].find(option => auxSubLoc.includes(option.value)));
        
            // setLocation(data.location.split('/')[0]);
            // setSublocation(data.location.split('/')[1]);
            setIsLoaded(true);
        } catch (err) {
            setItem({})
            console.log(err)
            setError('Error cargando elemento')
        }
    }

    const deleteItem = async () => {
        let resultApi = await apiDeleteItem(id);
        console.log(resultApi);
        if (resultApi.status == 200) {
            Swal.fire(messagesObj.deleteItemSuccess);
            navigate('/home');
            
        }
        else {
            Swal.fire(messagesObj.deleteItemError);
        }
    }

    const handleDelete = async () => {
        Swal.fire(messagesObj.deleteItemConfirmation
            ).then((result) => {
                if (result.isConfirmed) {
                    deleteItem();      
                }
            }
        )
    }

    const goToEdit = () => {
        navigate(`/edit/${id}`)
    }

    if (error) {
        return(
            <div>{error}</div>
        )
    }

    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div id="item" className="center">
            <section className="content">
                <div className = "item">
                    
                    <h1>{item.name}</h1>

                    <div className="item-image-container">
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
                            <label>Otros nombres:</label>
                            {(item.otherNamesList && item.otherNamesList.length > 0) ? 
                                (<div className="tags-container">
                                    {item.otherNamesList.map((tag, index) => (
                                        <div className="tag-item" key={index}>
                                            <span className='tag'>{tag}</span>
                                        </div>
                                    ))}
                                </div>) : (
                                    '-'
                                )
                            }
                        </div>

                        <div className="item-data-group">
                            <label>Tags:</label>
                            {(item.tagsList && item.tagsList.length > 0) ? 
                                (<div className="tags-container">
                                    {item.tagsList.map((tag, index) => (
                                        <div className="tag-item" key={index}>
                                            <span className='tag'>{tagList.find(tagValue => tag.includes(tagValue.value)).label}</span>
                                        </div>
                                    ))}
                                </div>) : (
                                    '-'
                                )
                            }
                        </div>

                        <div className="item-data-group">
                            <label>Ubicación:</label>
                            {/* <p>{item.location}</p> */}
                            <p>{`${place.value} --> ${location.value} --> ${sublocation.value}`}</p>
                            
                        </div>
                        
                        <div className="item-data-group">
                            <label>Descripcion:</label>
                            {(item.description != '') ? (
                                <p>{item.description}</p>
                            ) : (
                                '-'
                            )}
                        </div>

                        

                    </div>

                    <div className="item-button-container">
                        <button className='edit-button' onClick={goToEdit}>Editar</button>
                        <button className='delete-button' onClick={handleDelete}>Eliminar</button>
                    </div>


                </div>
            </section>
        </div>
    );
};
export default Item;