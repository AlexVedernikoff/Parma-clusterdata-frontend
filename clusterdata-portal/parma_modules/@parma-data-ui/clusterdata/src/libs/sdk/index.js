import axios from '../axios/axios';
import {
    CancelToken,
    isCancel
} from 'axios';
import {schema} from '@parma-data-ui/clusterdata-core-plugins/components/schema';
import Utils from '../../utils';
import {
    COOKIE_TOGGLE_SWITCH_MODE_NAME,
    ENABLE
} from '../../constants/common';

export default class SDK {
    constructor(config) {
        if (!config) {
            throw new Error('SDK needs a config');
        }

        this.config = config;
        this._cancelableRequests = {};

        this.init();
    }

    createCancelSource() {
        return CancelToken.source();
    }

    isCancel(error) {
        return isCancel(error);
    }

    getAuthHeaders() {
        const {
            DL: {
                displaySuperuserSwitch
            } = {}
        } = window;
        const {config} = this;
        const headers = {};

        if (config.currentCloudFolderId) {
            headers['x-yacloud-folderid'] = config.currentCloudFolderId;
        }

        if (displaySuperuserSwitch) {
            const superuserModeEnabled = Utils.getCookie(COOKIE_TOGGLE_SWITCH_MODE_NAME) === ENABLE;

            headers['x-dl-allow-superuser'] = superuserModeEnabled;
            headers['x-dl-sudo'] = superuserModeEnabled;
        }

        return headers;
    }

    init() {
        this.initGatewayRequest(this, schema);
    }

    getGatewayRequestConfig(method, data) {
        return {
            method: 'post',
            url: `${this.config.endpoints.gateway}/${method}`,
            data,
            headers: this.getAuthHeaders()
        };
    }

    getRequestConfig(method, data) {
        return this.getGatewayRequestConfig(method, data);
    }

    getRequestCallback = (method) => (data, options) => {
        const requestConfig = this.getRequestConfig(method, data);

        return this.sendRequest({requestConfig, method, data, options});
    };

    initGatewayRequest(parent, initialSchema) {
        Object.entries(initialSchema).forEach(([method, value]) => {
            switch (typeof value) {
                case 'function':
                    if (!parent[method]) {
                        parent[method] = this.getRequestCallback(method);
                    }

                    break;
                case 'string':
                    if (!parent[method]) {
                        parent[method] = this.getRequestCallback(value);
                    }

                    break;
                case 'object':
                    parent[method] = {};

                    this.initGatewayRequest(parent[method], value);
                    
                    break;
            }
        });
    }

    makeRequestCancelable({method = 'custom', requestConfig}) {
        const currentCancelableRequest = this._cancelableRequests[method];

        if (currentCancelableRequest) {
            currentCancelableRequest.cancel(`${method} was cancelled`);
        }

        const cancellation = this.createCancelSource();
        this._cancelableRequests[method] = cancellation;

        requestConfig.cancelToken = cancellation.token;
    }

    passTimezoneOffsetHeader(requestConfig) {
        requestConfig.headers['x-timezone-offset'] = new Date().getTimezoneOffset();
    }

    sendRequest({requestConfig, method, options = {}}) {
        const {
            cancelable,
            passTimezoneOffset = true
        } = options;

        if (cancelable) {
            this.makeRequestCancelable({method, requestConfig});
        }

        if (passTimezoneOffset) {
            this.passTimezoneOffsetHeader(requestConfig);
        }

        return axios(requestConfig)
            .then((response) => response.data);
    }

    sendFileInConnectionUploader({formData}, options) {
        const requestConfig = {
            method: 'post',
            url: `${this.config.endpoints.uploader}/api/v1/upload/`,
            headers: {
                ...this.getAuthHeaders(),
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        };

        return this.sendRequest({requestConfig, options});
    }

    getNavigationList(data, options) {
        return this.getRequestCallback('getNavigationList')(data, {
            cancelable: true,
            ...options
        });
    }

    getAvailableCloudFolders(data, options) {
        return this.getRequestCallback('getAvailableCloudFolders')(data, options);
    }

    getEntriesDatasetsFields({entriesIds, datasetsIds}, options) {
        return this.getRequestCallback('getEntriesDatasetsFields')({
            entriesIds,
            datasetsIds
        }, options);
    }
}
