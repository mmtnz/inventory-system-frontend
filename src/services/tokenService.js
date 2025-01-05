// Verify if the token is expired
const isTokenExpired = (token) => {
    if (token == null | token === 'undefined') {
        return true
    }
    const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode the JWT payload
    const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds
    return decodedToken.exp < currentTime;  // Check if token is expired
}


// const getAccessToken = () => {

// }


const refreshToken = () => {
    
}

export {isTokenExpired, refreshToken}