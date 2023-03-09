import axios from 'axios';

export default axios.create({
    withCredentials: true,
    // иначе /api/run может падать с ошибкой:
    // Request header field X-XSRF-TOKEN is not allowed by Access-Control-Allow-Headers in preflight response.
    xsrfCookieName: ''
});
