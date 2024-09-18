import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchForm from '../components/SearchForm';
import { apiSearchItems } from "../services/api";
import ItemWrap from "../components/ItemWrap"
import {apiGetTagsList} from "../services/api";
import DisplayPages from "../components/DisplayPages";
import ReactPaginate from "react-paginate";

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

    useEffect(() => {
        getTagsList();
        const query = searchParams.get('q');
        const tagList = searchParams.getAll('tag');

        if (query || query === '' || tagList.length > 0) {
            handleSearch(query, tagList);
        }
        
    }, [searchParams]);
    
    const handleSearch = async (query, tagList) => {
        try {
            let args = {
                q: query,
                tag: tagList
            }
            console.log('entro')
            let urlArgs = new URLSearchParams(args)
            console.log(urlArgs.toString())

            const data = await apiSearchItems(urlArgs.toString());
            setResults(data);
            setError(null);
            setIsSearch(true);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            // setTotalPages(15);

        } catch (err) {
            setError('An error occurred while fetching data.');
            console.log(err)
            setResults([]);
        }
    };

    const getTagsList = async () => {
        let response = await apiGetTagsList();
        setTagList(response);
    }

    // const changePage = (index) => {
    //     setCurrentPage(index + 1);
    //     setStartIndex(index * itemsPerPage) // +1 -1
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
                <h1>Buscar</h1>
                <SearchForm tagList={tagList}/>
                
                {error && <p>{error}</p>}

                <div className='list-items-container'>
                
                    
                    {(results != null && results.length == 0 && isSearch) ? 'no hay elementos' : 
                    (
                        <div className="aux">
                            {results.slice(startIndex, startIndex + itemsPerPage - 1).map(result => (
                                <ItemWrap key={result.id} item={result}/>
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