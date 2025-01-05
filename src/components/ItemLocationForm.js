import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

const ItemLocationForm = ({ locationObj, location, setLocation, validator }) => {

    const [locations, setLocations] = useState([null]);
    const { t } = useTranslation('itemForm');
    
    useEffect(() => {
        if (location) {
            initializeLocations(location);
        }
    }, [locationObj]);
    
    const getSelectLabels = (childrenList) => {
        return childrenList?.map((child) => ({ label: child.name, value: child.name }));
    };
    
    const handleChange = (level, event) => {
        const selectedLocation =
            level === 0
                ? locationObj.children.find((child) => child.name === event.label)
                : locations[level - 1]?.children.find((child) => child.name === event.label);

        const updatedLocations = [...locations];
        updatedLocations[level] = selectedLocation;

        // Clear deeper levels
        for (let i = level + 1; i < updatedLocations.length; i++) {
            updatedLocations[i] = null;
        }

        // Add a new level if there are children
        if (selectedLocation?.children.length > 0) {
            updatedLocations[level + 1] = null;
        }

        setLocations(updatedLocations);
        setLocation(updatedLocations
                    .filter((location) => location)
                    .map((location) => location.name)
                    .join('/')
        );
    };

    
    const initializeLocations = (locationPath) => {
        const locationNames = locationPath.split('/').filter(Boolean);
        const initializedLocations = [];
        let currentLevel = locationObj;
        
        for (const name of locationNames) {
            const matchingChild = currentLevel?.children.find((child) => child.name === name);
            // console.log(matchingChild)
            if (matchingChild) {
                initializedLocations.push(matchingChild);
                currentLevel = matchingChild; // Move to the next level
            } else {
                break; // Stop if no match is found
            }
        }

        setLocations(initializedLocations);
    };

    return (
        <>
            {locations?.map((location, index) => {
                const options =
                    index === 0
                        ? getSelectLabels(locationObj?.children)
                        : getSelectLabels(locations[index - 1]?.children || []);
                if(options?.length > 0){

                    return (
                        <div className='width-100' key={`location-select-${index}`}>
                            <Select
                                options={options}
                                onChange={(event) => handleChange(index, event)}
                                value={location ? { label: location.name, value: location.name } : null}
                                placeholder={t('select')}
                                classNamePrefix="react-select" // Apply custom prefix
                                />
                            {validator.message(`location${index}`, location, 'required')}
                        </div>
                    );
                }
            })}
        </>
    );
};

export default ItemLocationForm;
