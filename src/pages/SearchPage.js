import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import AuthContext from '../services/AuthContext';
import SearchForm from '../components/SearchForm';
import { apiSearchItems, apiGetStorageRoomsList } from "../services/api";
import ItemWrap from "../components/ItemWrap"
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import handleError from "../services/handleError";

const SearchPage = () => {

    const [searchParams] = useSearchParams();
    const [tagList, setTagList] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [numItems, setNumItems] = useState(0)
    const [queryParams, setQueryParams] = useState('');
 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 5;

    const navigate = useNavigate();

    const [permissionType, setPermissionType] = useState(null);
    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);
    const { t } = useTranslation('searchPage'); // Load translations from the 'searchPage' namespace
    const { storageRoomId } = useParams(); // Retrieves the storageRoomId from the URL

    useEffect(() => {
        if (!storageRoomsList || !storageRoomsAccessList){
            getStorageRoomData();
        } else {
            const storageRoom = storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            setPermissionType(storageRoomsAccessList.find(storRoom => storRoom.storageRoomId === storageRoomId).permissionType);
            setTagList(storageRoom.config.tagsList); // in getStorageRoomData is also done
        }
        

    }, [])
    
    useEffect(() => {
        // getStorageRoomData();
        const query = searchParams.get('q');
        const tagList = searchParams.getAll('tag');
        const isLent = searchParams.get('lent');

        if (query || query === '' || tagList.length > 0) {
            setIsLoading(true);
            let urlArgs = getSearchArgs(query, tagList, isLent)
            setQueryParams(urlArgs)
            handleSearch(urlArgs);
        }
        
    }, [searchParams]);

    const getStorageRoomData = async () => {
        try {
            const response = await apiGetStorageRoomsList();
            setStorageRoomsList(response.storageRoomsList);
            setStorageRoomsAccessList(response.storageRoomsAccessList);
            const storageRoom = response.storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            const storRoomPermission = response.storageRoomsAccessList?.find(storRoom => storRoom.storageRoomId === storageRoomId)
            
            if (!storageRoom || !storRoomPermission){
                await handleError({response: {status: 403}}, t('locale'), navigate);
            }
            setPermissionType(storRoomPermission.permissionType);
            setTagList(storageRoom?.config?.tagsList);
            setIsLoading(false);
        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }

    // Get query args so add to API call
    const getSearchArgs = (query, tagList, isLent) =>{
        let args = {
            q: query,
            tag: tagList
        }

        if(isLent !== undefined){
            args = {...args, lent: isLent}
        }
        let urlArgs = new URLSearchParams(args)
        return urlArgs.toString()
    }

    
    const handleSearch = async (urlArgs) => {
        try {
            // let urlArgs = new URLSearchParams(queryParams)  // Get query and tags from url to search
            const [data, totalCount] = await apiSearchItems(storageRoomId, urlArgs);
            setNumItems(totalCount);

            setIsLoading(false)
            setResults(data);
            setIsSearch(true);
            // setTotalPages(Math.ceil(data.length / itemsPerPage));
            setTotalPages(Math.ceil(totalCount / itemsPerPage));

        } catch (err) {
            console.log(err);
            await handleError(err, t('locale'), navigate);
        }
    };

    const loadMoreItems = async (auxResults) => {
        setIsLoading(true);
        // console.log(results)
        auxResults??=results; // Update if aux results is null
        try {

            let lastEvaluatedItem = auxResults.at(-1); // Last item loadedd from backend
            let lastEvaluatedKey = {
                storageRoomId: lastEvaluatedItem.storageRoomId,
                itemId: lastEvaluatedItem.itemId
            };
            let urlArgsWithKey = `${queryParams}&lastEvaluatedKey=${encodeURIComponent(JSON.stringify(lastEvaluatedKey))}`;
            const [data, ] = await apiSearchItems(storageRoomId, urlArgsWithKey);
            setResults([...auxResults, ...data]);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            await handleError(err, t('locale'), navigate);
        }
    }

    // Remove deleted item
    const removeItemFromList = (itemId) => {
        const auxResult = results.filter(item => item.itemId !== itemId);
        setResults(auxResult);
        setNumItems(numItems - 1);
        
        //if there are no more items in that page, decrease one
        if (currentPage > 0 && auxResult.slice(startIndex, startIndex + itemsPerPage).length === 0){
            decreasePage();
        }

        // Load more items to have 5 by page
        if (auxResult.length !== numItems - 1) { // If there are more items
            loadMoreItems(auxResult);
        }

        setTotalPages(Math.ceil((numItems - 1) / itemsPerPage));
    }

    // Display increase page
    const increasePage = () =>{
        setCurrentPage(currentPage + 1);
        setStartIndex(currentPage * itemsPerPage) // +1 -1

        // Load more items if needed
        if ( currentPage * itemsPerPage >= results.length) {
            loadMoreItems();
        }
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
                    {(results !== null && results.length === 0 && isSearch) ? (
                        <h3 className="num-items-title">{t('noItemsFound')}</h3>
                    ) : 
                    (
                        <>
                        {isSearch && (
                            <h3 className="num-items-title">{numItems} {t('items')}</h3>
                        )}
                        
                        <div className="list-items-container-content">
                            {results.slice(startIndex, startIndex + itemsPerPage).map(result => (
                                <ItemWrap
                                    key={result.itemId}
                                    itemArg={result}
                                    removeItemFromList={removeItemFromList}
                                    permissionType={permissionType}
                                />
                            ))}
                        </div>
                        </>
                    )}

                    {/* PAGINATION DISPLAY */}
                    {(results && numItems > itemsPerPage) && 
                        
                        <div className="paginating-container">
                            <button className="custom-button-icon" onClick={decreasePage} disabled={currentPage === 1}>
                                <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                                    arrow_back
                                </span>
                            </button>
                            <p>{`${currentPage} / ${totalPages}`}</p>
                            <button className="custom-button-icon" onClick={increasePage} disabled={currentPage === totalPages}>
                                <span className="material-symbols-outlined" translate="no" aria-hidden="true">
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