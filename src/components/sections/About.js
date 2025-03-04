import React from 'react';
import MyCarousel from './MyCarousel';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from "react-markdown";

const About = () => {
    
    const { t } = useTranslation('about');
    const imagesList = t('imagesList', {returnObjects: true});

    return (
        <div className='about'>
            <div className='about-text-container'>
                <ReactMarkdown>{t('description')}</ReactMarkdown>
            </div>
            <div className='about-img-container'>
                <MyCarousel imagesList={imagesList}/>
            </div>
        </div>
    )
};
export default About;