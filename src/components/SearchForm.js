import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import { apiGetTagsList } from '../services/api';


const SearchForm = () => {

    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        getTagsList();
        const urlQuery = searchParams.get('q')
        if (urlQuery) {setQuery(urlQuery);} 
        const urlTagList = searchParams.getAll('tag');
        const defaultValues = tagList.filter(option => urlTagList.includes(option.value));
        if (selectedTags) {setSelectedTags(defaultValues)};
        
    }, []);

    const getTagsList = async () => {
        let response = await apiGetTagsList();
        setTagList(response);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        params.append('q', query);

        if (selectedTags && selectedTags.length > 0) {
            selectedTags.forEach(tag => params.append('tag', tag.value));
        }
        navigate(`/search?${params.toString()}`);        
    };

    //To update tags
    const onChangeTags = (choice) => {
        setSelectedTags(choice)
    }

    return(
        <form onSubmit={handleSubmit} className='search-form'>
            <div className='formGroup'>
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Buscar'
                />
            </div>
            
            <div className='formGroup'>
                <label htmlFor="tags">Tags</label>
                <Select
                    isMulti
                    // value={selectedTags}
                    name="tags"
                    options={tagList}
                    onChange={onChangeTags}
                    placeholder="Seleccionar filtro" 
                />
            </div>
           
            <button
                className="search-button"
                type="submit"
            >
                Buscar
            </button>
        </form>
    );
};
export default SearchForm;
