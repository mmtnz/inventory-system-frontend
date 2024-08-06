// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
export default API_BASE_URL;

// Crear una instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Tiempo de espera de 10 segundos
    headers: {
      'Content-Type': 'application/json',
    },
  });


// GET Functión to find items by name
export const apiSearchItems = async (query) => {
    try {
      const response = await api.get(`/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
};

// GET Finf item by Id
export const apiGetItem = async (itemId) => {
    try {
        const response = await api.get(`/item/${itemId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// GET tag list
export const apiGetTagsList = async () => {
    try {
        const response = await api.get('/tags-list');
        return response.data;
    } catch (error) {
        throw error;
    }
}

// GET location obj
export const apiGetTLoationsObj = async () => {
    try {
        const response = await api.get('/location-obj');
        return response.data;
    } catch (error) {
        throw error;
    }
}

// POST upload image
export const apiUploadImage = async (itemFile, itemId) => {
    
    const formData = new FormData();
    formData.append(
        'file0',
        itemFile,
        itemFile.name
    );

    try {
        const response = await api.post(
            `/upload-image/${itemId}`,
            formData,
            {
                headers: {'Content-Type': 'multipart/form-data'},
            }
        );
        return response
    } catch (error) {
        throw error;
    }
};

// POST save new item
export const apiSaveItem = async (item) => {
    try {
        const response = await api.post(`/save`, item)
        return response.data
    } catch (error) {
        throw error;
    }
};



