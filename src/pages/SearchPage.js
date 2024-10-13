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
    const [isLoading, setIsLoading] = useState(false);
 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 6;

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
            let args = getSearchArgs(query, tagList, isLent)
            handleSearch(args);
        }
        
    }, [searchParams]);


    // Get storage room info
    const getStorageRoomData = async () => {
        
        try {
            let storageRoomInfo = await getStorageRoomInfo(storageRoomId);
            setTagList(storageRoomInfo.config.tagsList);
        } catch (err) {
            await handleError(err);
        }
    }

    // Get query args so add to API call
    const getSearchArgs = (query, tagList, isLent) =>{
        let args = {
            q: query,
            tag: tagList
        }

        if(isLent != undefined){
            args = {...args, lent: isLent}
        }
        return args
    }

    
    const handleSearch = async (args) => {
        try {

            let urlArgs = new URLSearchParams(args)  // Get query and tags from url to search
            const data = await apiSearchItems(storageRoomId, urlArgs.toString());

            setIsLoading(false)
            setResults(data);
            setIsSearch(true);
            setTotalPages(Math.ceil(data.length / itemsPerPage));

        } catch (err) {
            console.log(err);
            await handleError(err);
        }
    };

    // To handle error depending on http error code
    const handleError = async (err) => {
        if (err.code === 'ERR_NETWORK') {
            Swal.fire(messagesObj[t('locale')].networkError);
            navigate('/login')
        } else if (err.response.status === 401) {
            Swal.fire(messagesObj[t('locale')].sessionError)
            await logout();
            navigate('/login')
        } else if ( err.response.status === 403) {  // Access denied
            Swal.fire(messagesObj[t('locale')].accessDeniedError)
            navigate('/home')
        } else if (err.response.status === 404 ) { // Item not found
            Swal.fire(messagesObj[t('locale')].itemNotFoundError)
            navigate('/home')
        }
    }


    // Display increase page
    const increasePage = () =>{
        setCurrentPage(currentPage + 1);
        setStartIndex(currentPage * itemsPerPage) // +1 -1
    }

    // Display decrease page
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
                
                <div className='list-items-container'>
                    
                    {/* RESULTS */}
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

                    {/* PAGINATION DISPLAY */}
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