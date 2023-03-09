import axiosInstance from '../axios/axios';
import settings from '../settings/settings';

const API = '/_api/comments';

function create(data) {
    return axiosInstance({
        method: 'post',
        url: `${settings.chartsEndpoint}${API}`,
        data: data
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error(error);
            throw error;
        });
}

function updateById(data) {
    return this.create(data);
}

function removeById(data) {
    return axiosInstance({
        method: 'post',
        url: `${settings.chartsEndpoint}${API}`,
        data: data
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error(error);
            throw error;
        });
}

export default {
    create,
    updateById,
    removeById
};
