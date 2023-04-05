import React from 'react';
import PropTypes from 'prop-types';

import { LOCAL_STORAGE_KEY } from '../DownloadScreenshot/constants';

export default class DownloadScreenshotCmd extends React.PureComponent {
  static propsType = {
    download: PropTypes.func.isRequired,
  };

  render() {
    return null;
  }

  componentDidMount() {
    const state = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    if (state) {
      this.props.download(state);
    }
  }
}
