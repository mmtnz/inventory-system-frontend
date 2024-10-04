// storageRoomInfoService.js
import { apiGetStorageRoomInfo } from "./api";
import userPool from '../services/cognitoConfig'; // Your Cognito configuration



// export const getStorageRoomInfo = async (storageRoomId) => {
export const getStorageRoomInfo = async () => {
    // Check if storageRoom info is already in sessionStorage
    const storedData = sessionStorage.getItem('storageRoom');
    
    if (storedData && storedData != undefined) {
      // Parse and return the data from sessionStorage
      return JSON.parse(storedData);
    }
  
    // // If not in sessionStorage, fetch it from the API
    // const cognitoUser = userPool.getCurrentUser();
    // cognitoUser.
    const storageRoom = await apiGetStorageRoomInfo();  // Assume this is your API call
    // const storageRoom = response.data;
    // console.log(response)
    console.log(storageRoom)
  
    // Store the fetched data in sessionStorage for future use
    sessionStorage.setItem('storageRoom', JSON.stringify(storageRoom));
  
    return storageRoom;
  };
  
  // Clear session storage (optional, e.g., on logout or refresh)
  export const clearStorageRoomInfo = () => {
    sessionStorage.removeItem('storageRoom');
  };
  