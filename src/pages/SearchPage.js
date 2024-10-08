import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchForm from '../components/SearchForm';
import { apiSearchItems } from "../services/api";
import ItemWrap from "../components/ItemWrap"
import { getStorageRoomInfo } from '../services/storageRoomInfoService';

import { useTranslation } from 'react-i18next';

const SearchPage = () => {

    const [searchParams] = useSearchParams();
    const [tagList, setTagList] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startIndex, setStartIndex] = useState(0);

    const { t } = useTranslation('searchPage'); // Load translations from the 'searchPage' namespace

    useEffect(() => {
        // getTagsList();
        getStorageRoomData();
        const query = searchParams.get('q');
        const tagList = searchParams.getAll('tag');
        const isLent = searchParams.get('lent');

        if (query || query === '' || tagList.length > 0) {
            handleSearch(query, tagList, isLent);
        }
        
    }, [searchParams]);

    const getStorageRoomData = async () => {
        let storageRoomInfo = await getStorageRoomInfo();
        console.log(storageRoomInfo)
        setTagList(storageRoomInfo.config.tagsList);
    }

    
    const handleSearch = async (query, tagList, isLent) => {
        try {
            
            let args = {
                q: query,
                tag: tagList
            }

            console.log(`isLent: ${isLent}`)
            // console
            if(isLent != undefined){
                args = {...args, lent: isLent}
            }
  
            let urlArgs = new URLSearchParams(args)  // Get query and tags from url to search

            const data = await apiSearchItems(urlArgs.toString());
            setResults(data);
            setError(null);
            setIsSearch(true);
            setTotalPages(Math.ceil(data.length / itemsPerPage));

        } catch (err) {
            setError('An error occurred while fetching data.');
            console.log(err)
            setResults([]);
        }
    };

    // const getTagsList = async () => {
    //     let response = await apiGetTagsList();
    //     setTagList(response);
    // }

    const increasePage = () =>{
        setCurrentPage(currentPage + 1);
        setStartIndex(currentPage * itemsPerPage) // +1 -1
    }

    const decreasePage = () =>{
        setCurrentPage(currentPage - 1);
        setStartIndex((currentPage - 2) * itemsPerPage) // -1 -1
    }


    return (
        <div id="search-page" className="center">
            <section className="content">
                <h1>{t('title')}</h1>
                <SearchForm tagList={tagList}/>
                
                {error && <p>{error}</p>}

                <div className='list-items-container'>
                
                    
                    {(results != null && results.length == 0 && isSearch) ? 'no hay elementos' : 
                    (
                        <div className="aux">
                            {results.slice(startIndex, startIndex + itemsPerPage - 1).map(result => (
                                <ItemWrap key={result.itemId} item={result}/>
                            ))}
                        </div>
                    )}

                    {(results && results.length > itemsPerPage) && 
                        
                        <div className="paginating-container">
                            <button onClick={decreasePage} disabled={currentPage == 1}>{'<'}</button>
                            <p>{`${currentPage} / ${totalPages}`}</p>
                            <button onClick={increasePage} disabled={currentPage == totalPages}>{'>'}</button>
                        </div>
                    }                             
                
                </div>
            </section>

        </div>
    )
}

export default SearchPage;