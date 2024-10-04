// src/services/api.js
import axios from 'axios';
import userPool from '../services/cognitoConfig'; // Your Cognito configuration
import {jwtDecode} from "jwt-decode";

// const API_BASE_URL = 'http://127.0.0.1:8000/api';
const API_BASE_URL = 'http://192.168.1.46:8000/api';
export default API_BASE_URL;

// Crear una instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Tiempo de espera de 10 segundos
    headers: {
      'Content-Type': 'application/json',
    },
  });


// GET items by name and filters
export const apiSearchItems = async (args) => {
    try {
      const response = await api.get(`/search?${args}`);
      return response.data;
    } catch (error) {
      throw error;
    }
};

// GET item by Id
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

// GET storge room config
export const apiGetStorageRoomInfo = async (storageRoomId) => {
    try {

        let token = sessionStorage.getItem('accessToken');
        let userInfo = await api.get(`/user`,{
            headers: {
            'Authorization': `Bearer ${token}`,  // Add token to Authorization header
          },
        });
        const response = await api.get(`/storage-room/${userInfo.data.storageRoomId}`);
        return response.data;
    } catch (error) {
        console.log(error)
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
        const response = await api.post(`/item`, item)
        return response.data
    } catch (error) {
        throw error;
    }
};


// PUT edit item
export const apiEditItem = async (item, itemId) => {
    try {
        const response = await api.put(`/item/${itemId}`, item)
        return response.data
    } catch (error) {
        throw error;
    }
};


//PUT edit item when is not lent anymore
export const apiReturnLent = async(item, itemId, returnedDate) => {
    try {
        const entry = `${item.isLent}/${returnedDate}`;
        if (item.lentHistory){
            item.lentHistory.push(entry);
        } else {
            item = {...item, lentHistory: [entry]}  // if it is the first entry
        }
        item.isLent = null;
        console.log(item)
        const response = await api.put(`/item/${itemId}`, item)
        return response.data
    } catch (error) {
        throw error;
    }
}


// DELETE delete item
export const apiDeleteItem = async (itemId) => {
    try {
        const response = await api.delete(`/item/${itemId}`)
        return response
    } catch (error) {
        throw error;
    }
};


