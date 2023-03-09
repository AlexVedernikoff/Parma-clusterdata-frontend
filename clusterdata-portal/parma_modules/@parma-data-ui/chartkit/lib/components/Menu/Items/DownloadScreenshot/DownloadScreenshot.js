import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import settings from '../../../../modules/settings/settings';

import URI from '../../../../modules/uri/uri';
import DownloadScreenshotCmd from '../DownloadScreenshotCmd/DownloadScreenshotCmd';
import DownloadScreenshotModal from '../DownloadScreenshotModal/DownloadScreenshotModal';
import {SIZES, PARAMETERS} from './constants';

const QUERY_DOWNLOAD = '&__scr_download=1';
const DATE_FORMAT = 'YYYY-MM-DD_HH-mm-ss';

const API = '/api/scr/v1/screenshots';

const getFilename = (filename) => `${filename}_${moment().format(DATE_FORMAT)}`;

export default function DownloadScreenshot(props) {
    const getScreenshotUrl = function (state) {
        const path = `${settings.chartsEndpoint}${API}${props.path}`;
        const url = new URI(path);

        PARAMETERS.forEach((parameter) => url.setParam(parameter.name, state[parameter.name]));

        if (state.sizeIndex < SIZES.length) {
            url.setParam('__scr_width', SIZES[state.sizeIndex].width);
            url.setParam('__scr_height', SIZES[state.sizeIndex].height);
        } else {
            url.setParam('__scr_width', state.width);
            url.setParam('__scr_height', state.height);
        }

        url.setParam('__scr_filename', getFilename(props.filename));
        url.setParam('_embedded', 1);

        if (props.highstockStart && props.highstockEnd) {
            url.setParam('_highstock_start', props.highstockStart);
            url.setParam('_highstock_end', props.highstockEnd);
        }

        return url.toString();
    };

    const download = (state) => window.open(getScreenshotUrl(state) + QUERY_DOWNLOAD);

    return props.initDownload ?
        <DownloadScreenshotCmd download={download}/> :
        <DownloadScreenshotModal
            element={props.element}
            download={download}
            getScreenshotUrl={getScreenshotUrl}
        />;
}
DownloadScreenshot.propTypes = {
    element: PropTypes.object.isRequired, // DOM-элемент, на который был mountComponent,
    path: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    initDownload: PropTypes.bool.isRequired,
    highstockStart: PropTypes.number,
    highstockEnd: PropTypes.number
};
