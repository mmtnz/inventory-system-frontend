import React, { useEffect, useState } from 'react';
import Item from '../components/Item';


const ItemPage = () => {
  return(
    <div className='center'>
      <section className='content'>
        <Item/>                                    
      </section>
    </div>  
  );  
};
export default ItemPage;