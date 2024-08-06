import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchForm from '../components/SearchForm';
import { apiSearchItems } from "../services/api";
import ItemWrap from "../components/ItemWrap"
import API_BASE_URL from "../services/api";

const SearchPage = () => {

    const url = API_BASE_URL;
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const query = searchParams.get('q');
        const tagList = searchParams.getAll('tag');
        handleSearch(query, tagList);
    }, [searchParams]);
    
    const handleSearch = async (query, tagList) => {
        try {
            const data = await apiSearchItems(query, tagList);
            console.log(data)
            setResults(data);
            setError(null);
        } catch (err) {
            setError('An error occurred while fetching data.');
            setResults([]);
        }
    };


    return (
        <div id="search-page">
            <h1>Buscar</h1>
            <SearchForm/>
            {error && <p>{error}</p>}
            {/* {results != null && results.length == 0 && 'no hay'} */}
            <div className='center'>
                <div id="content">
                    {/* {results} */}
                    {/* /<Articles searched={searched} /> */}
                </div>
                {(results != null && results.length == 0) ? 'no hay elementos' : 
                (
                    <ul>
                        {results.map(result=> (
                        <ItemWrap key={result.id} item={result}/>
                        ))}
                    </ul>
                )}

                {/* <Sidebar /> */}
            </div>

        </div>
    )
}

export default SearchPage;