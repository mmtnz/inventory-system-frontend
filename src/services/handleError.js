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
        Swal.fire(messagesObj[locale].networkError)
            .then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                    navigate('/login')
                }
            });
    } else if (err.response.status === 401) {
        await logout();
        Swal.fire(messagesObj[locale].sessionError)
            .then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                    navigate('/login')
                }
            });
        navigate('/login')
    } else if ( err.response.status === 403) {  // Access denied
        Swal.fire(messagesObj[locale].accessDeniedError)
            .then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                    navigate('/home')
                }
            });
    } else if (err.response.status === 404 ) { // Item not found
        Swal.fire(messagesObj[locale].itemNotFoundError)
            .then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                    navigate('/home')
                }
            });
    } else if (err.response.status === 500) {
        Swal.fire(messagesObj[locale].unexpectedError)
            .then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                    navigate('/login')
                }
            });
        await logout();
    }
}
export default handleError;