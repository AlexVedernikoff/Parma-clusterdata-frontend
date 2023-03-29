import React from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../../../modules/axios/axios';

import i18nFactory from '../../../../modules/i18n/i18n';

import ButtonSpinInput from '../ButtonSpinInput/ButtonSpinInput';
import settings from '../../../../modules/settings/settings';

const i18n = i18nFactory('CodeLinkModal');
const API = '/api/tools/tiny-url-store/v1';

export default function TinyUrlButton(props) {
  const _onClick = () => {
    const url = props.url.replace(/https?:\/\/(?:(?!\/).)*/g, ''); // убираем хост

    return new Promise(resolve =>
      axiosInstance({
        url: `${settings.chartsEndpoint}${API}`,
        method: 'post',
        data: { url },
      }).then(response => resolve(response.data.url)),
    );
  };

  return <ButtonSpinInput text={i18n('get-tiny-url')} popup={{ to: 'right' }} onClick={_onClick} />;
}

TinyUrlButton.propTypes = {
  url: PropTypes.string.isRequired, // url, который нужно сократить (url будет браться без хоста)
};
