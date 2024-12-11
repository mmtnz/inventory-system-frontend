import React from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { logout } from "./logout";
import Swal from 'sweetalert2';
import {messagesObj} from '../schemas/messages';


// To handle error depending on http error code
const handleError = async (err, locale, navigate) => {
    console.log(err)
    console.log(err.response.status)
    if (err.code === 'ERR_NETWORK') {
        Swal.fire(messagesObj[locale].networkError);
        navigate('/login')
    } else if (err.response.status === 401) {
        Swal.fire(messagesObj[locale].sessionError)
        await logout();
        navigate('/login')
    } else if ( err.response.status === 403) {  // Access denied
        Swal.fire(messagesObj[locale].accessDeniedError)
        navigate('/home')
    } else if (err.response.status === 404 ) { // Item not found
        Swal.fire(messagesObj[locale].itemNotFoundError)
        navigate('/home')
    } else if (err.response.status === 500) {
        Swal.fire(messagesObj[locale].unexpectedError)
        await logout();
        navigate('/login')
    }
}
export default handleError;