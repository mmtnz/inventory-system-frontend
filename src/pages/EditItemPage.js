import React, { useEffect, useState } from 'react';
import EditItemForm from '../components/NewItemForm';

const EditItemPage = () => {

    return(
        <div className='center'>
            <section className='content'>
                <h1>Editar elemento</h1>
                <EditItemForm/>
            </section>
        </div>
    )
};
export default EditItemPage;