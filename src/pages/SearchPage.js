import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import SearchForm from '../components/SearchForm';
import { apiSearchItems } from "../services/api";
import ItemWrap from "../components/ItemWrap"
import { getStorageRoomInfo } from '../services/storageRoomInfoService';
import { logout } from "../services/logout";

import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { BarLoader } from 'react-spinners';
import Swal from "sweetalert2";
import messagesObj from "../schemas/messages";

const SearchPage = () => {

    const [searchParams] = useSearchParams();
    const [tagList, setTagList] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startIndex, setStartIndex] = useState(0);

    const navigate = useNavigate();

    const { t } = useTranslation('searchPage'); // Load translations from the 'searchPage' namespace
    const { storageRoomId } = useParams(); // Retrieves the storageRoomId from the URL

    useEffect(() => {
        getStorageRoomData();
        const query = searchParams.get('q');
        const tagList = searchParams.getAll('tag');
        const isLent = searchParams.get('lent');

        if (query || query === '' || tagList.length > 0) {
            setIsLoading(true);
            handleSearch(query, tagList, isLent);
        }
        
    }, [searchParams]);

    const getStorageRoomData = async () => {
        let storageRoomInfo = await getStorageRoomInfo(storageRoomId);
        setTagList(storageRoomInfo.config.tagsList);
    }

    
    const handleSearch = async (query, tagList, isLent) => {
        try {
            
            let args = {
                q: query,
                tag: tagList
            }

            if(isLent != undefined){
                args = {...args, lent: isLent}
            }
  
            let urlArgs = new URLSearchParams(args)  // Get query and tags from url to search

            const data = await apiSearchItems(storageRoomId, urlArgs.toString());

            setIsLoading(false)
            setResults(data);
            setError(null);
            setIsSearch(true);
            setTotalPages(Math.ceil(data.length / itemsPerPage));

        } catch (err) {
            console.log(err)
            if (err.response.status === 401) {
                Swal.fire(messagesObj[t('locale')].sessionError)
                await logout();
                navigate('/login')
            } else if ( err.response.status === 403) {  // Access denied
                Swal.fire(messagesObj[t('locale')].accessDeniedError)
                navigate('/home')
            }
            
            setError('An error occurred while fetching data.');
            console.log(err)
            setResults([]);
        }
    };

    const increasePage = () =>{
        setCurrentPage(currentPage + 1);
        setStartIndex(currentPage * itemsPerPage) // +1 -1
    }

    const decreasePage = () =>{
        setCurrentPage(currentPage - 1);
        setStartIndex((currentPage - 2) * itemsPerPage) // -1 -1
    }


    return (
        <>
        <div id="search-page" className="center">
            
            <section className="content">
                <h1>{t('title')}</h1>
                <SearchForm tagList={tagList}/>
                
                {isLoading && (
                    <div className="loader-clip-container">
                        <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                    </div>
                )}
                
                {error && <p>{error}</p>}

                <div className='list-items-container'>
                
                    
                    {(results != null && results.length == 0 && isSearch) ? t('noItemsFound') : 
                    (
                        <>
                        {isSearch && (
                            <h3 className="num-items-title">{results.length} {t('items')}</h3>
                        )}
                        
                        <div className="list-items-container-content">
                            {results.slice(startIndex, startIndex + itemsPerPage - 1).map(result => (
                                <ItemWrap key={result.itemId} item={result}/>
                            ))}
                        </div>
                        </>
                    )}

                    {(results && results.length > itemsPerPage) && 
                        
                        <div className="paginating-container">
                            <button className="custom-button-icon" onClick={decreasePage} disabled={currentPage == 1}>
                                <span className="material-symbols-outlined">
                                    arrow_back
                                </span>
                            </button>
                            <p>{`${currentPage} / ${totalPages}`}</p>
                            <button className="custom-button-icon" onClick={increasePage} disabled={currentPage == totalPages}>
                                <span className="material-symbols-outlined">
                                    arrow_forward
                                </span>
                            </button>
                        </div>
                    }                             
                
                </div>
            </section>

        </div>
        </>
    )
}

export default SearchPage;