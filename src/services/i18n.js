import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

import esHomePage from '../locales/es/homePage.json'
import esItem from '../locales/es/item.json'
import esSearchPage from '../locales/es/searchPage.json'
import esItemForm from '../locales/es/itemForm.json'
import esLogin from '../locales/es/login.json'
import esItemWrap from '../locales/es/itemWrap.json'

import enHomePage from '../locales/en/homePage.json'
import enItem from '../locales/en/item.json'
import enSearchPage from '../locales/en/searchPage.json'
import enItemForm from '../locales/en/itemForm.json'
import enLogin from '../locales/en/login.json'
import enItemWrap from '../locales/en/itemWrap.json'

// Initialize i18n
i18n
    .use(LanguageDetector) // Use the browser language detector    
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                homePage: enHomePage,
                item: enItem,
                searchPage: enSearchPage,
                itemForm: enItemForm,
                login: enLogin,
                itemWrap: enItemWrap
            },
            es: {
                homePage: esHomePage,
                item: esItem,
                searchPage: esSearchPage,
                itemForm: esItemForm,
                login: esLogin,
                itemWrap: esItemWrap
            },
        },
        lng: 'en', // Default language
        ns: ['homePage'],       // Default namespaces to load
        defaultNS: 'homePage',  // Default namespace for translations
        fallbackLng: 'en', // Fallback language if translation is missing
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
