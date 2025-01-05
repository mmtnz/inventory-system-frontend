import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const SearchForm = ({tagList}) => {

    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    
    const [searchParams] = useSearchParams();
    const { storageRoomId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation('searchPage'); // Load translations from the 'searchPage' namespace

    const options = [
        {"label": t('all'), "value": "all"},
        {"label": t('lent'), "value": "lent"},
        {"label": t('notLent'), "value": "notLent"}
    ];
    const [selectedLent, setSelectedLent] = useState(options[0]);

    useEffect(() => {

        const urlQuery = searchParams.get('q')
        if (urlQuery) {setQuery(urlQuery);}

        const urlTagList = searchParams.getAll('tag');
        setSelectedTags(tagList.filter(option => urlTagList.includes(option.value)));
        
    }, [searchParams, tagList]);

    
    const handleSubmit = (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        params.append('q', query);

        if (selectedTags && selectedTags.length > 0) {
            selectedTags.forEach(tag => params.append('tag', tag.value));
        }

        // To add param only if the filter is needed
        if (selectedLent.value !== "all"){
            params.append('lent', selectedLent.value === "lent");
        }
        navigate(`/storageRoom/${storageRoomId}/search?${params.toString()}`);        
    };

    //To update tags
    const onChangeTags = (choice) => {
        setSelectedTags(choice)
    }

    return(
        <form onSubmit={handleSubmit} className='custom-form'>
            <div className='formGroup'>
                <label htmlFor="name">{t('name')}</label>
                <input
                    type="text"
                    name="name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            
            {(tagList && tagList.length > 0) && (
                <div className='formGroup'>
                    <label htmlFor="tags">{t('tags')}</label>
                    <Select
                        isMulti
                        value={selectedTags}
                        name={t('tags')}
                        options={tagList}
                        onChange={onChangeTags}
                        placeholder={t('select')}
                        />
                </div>
            )}

            <div className='formGroup'>
                <label htmlFor="lentSelect">{t('lentLabel')}</label>
                <Select
                    name="lentSelect"
                    options={options}
                    placeholder={t('select')}
                    value={selectedLent}
                    onChange={setSelectedLent}  
                    classNamePrefix="react-select" // Apply custom prefix
                />
            </div>
            
            <div className='button-container'>
                <button
                    className="custom-button"
                    type="submit"
                >
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                        search
                    </span>
                    {t('searchButton')}
                </button>
            </div>
        </form>
    );
};
export default SearchForm;
