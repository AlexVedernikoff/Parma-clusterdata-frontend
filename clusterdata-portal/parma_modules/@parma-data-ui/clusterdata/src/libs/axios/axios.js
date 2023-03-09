import axios from 'axios';

const options = {
    withCredentials: true,
    xsrfCookieName: '',
    headers: {}
};

const csrfMetaTag = document.querySelector('meta[name=csrf-token]');
if (csrfMetaTag) {
    options.headers['x-csrf-token'] = csrfMetaTag.content;
}


export default axios.create(options);
