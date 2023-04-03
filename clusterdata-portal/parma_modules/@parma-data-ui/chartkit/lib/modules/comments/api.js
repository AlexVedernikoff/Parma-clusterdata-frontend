import axiosInstance from '../axios/axios';
import settings from '../settings/settings';

const API = '/api/v1/comments';

function create(data) {
  return axiosInstance({
    method: 'post',
    url: `${settings.chartsEndpoint}${API}`,
    data,
  })
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
}

function updateById({ id, ...rest }) {
  return axiosInstance({
    method: 'post',
    url: `${settings.chartsEndpoint}${API}/${id}`,
    data: rest,
  })
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
}

function removeById(id) {
  return axiosInstance({
    method: 'delete',
    url: `${settings.chartsEndpoint}${API}/${id}`,
  })
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export default {
  create,
  updateById,
  removeById,
};
