import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './locales/en.js'
import zhHans from './locales/zh-Hans.js'
Vue.use(VueI18n);


const messages = {
    en,
    zhHans
};

// Create VueI18n instance with options
export const i18n = new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en',
    messages, // set locale messages
});

export default i18n;