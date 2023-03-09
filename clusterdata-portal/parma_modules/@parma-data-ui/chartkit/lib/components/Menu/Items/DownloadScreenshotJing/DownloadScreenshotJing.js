import React from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../../../modules/axios/axios';

import ButtonSpinInput from '../ButtonSpinInput/ButtonSpinInput';

const QUERY_JING = '&__scr_jing=1';

export default function DownloadScreenshotJing(props) {
    const _onClick = () => {
        return new Promise((resolve) =>
            axiosInstance.get(props.screenshotUrl + QUERY_JING).then((response) => resolve(response.data))
        );
    };

    return (
        <ButtonSpinInput
            text={props.text}
            popup={{to: 'top'}}
            button={{theme: 'action', size: 'm'}}
            onClick={_onClick}
        />
    );
}
DownloadScreenshotJing.propTypes = {
    text: PropTypes.string.isRequired,
    screenshotUrl: PropTypes.string.isRequired
};
