/* global $ */

import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import stringify from 'qs/lib/stringify';

import axiosInstance from '../../../modules/axios/axios';
import settings from '../../../modules/settings/settings';

const b = block('chartkit-wiki-text');

class WikiText extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      data: PropTypes.shape({
        content: PropTypes.string,
      }),
      config: PropTypes.shape({
        style: PropTypes.object,
      }),
    }).isRequired,
    onLoad: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  state = {
    html: '',
  };

  async componentDidMount() {
    const { content } = this.props.data.data;

    try {
      const { data: html } = await axiosInstance({
        url: `${settings.chartsEndpoint}/_wiki_formatter/v5/html`,
        method: 'post',
        data: stringify({
          cfg: 'external',
          text: content,
        }),
      });
      this.setState({ html });
    } catch (error) {
      console.error('POST_WIKI_FORMATTER', error);
      this.props.onError({ error });
    }
  }

  componentDidUpdate() {
    const node = this.blockRef.current;

    const wikiDoc = node.querySelector('.wiki-doc');

    if ((window.BEMHTML || window.WF_BEMHTML) && wikiDoc) {
      $('.wiki-doc', node).bem('wiki-doc');
    }

    this.props.onLoad();
  }

  blockRef = React.createRef();

  render() {
    const {
      config: { style },
    } = this.props.data;
    return (
      <div className={b()} style={style} ref={this.blockRef} dangerouslySetInnerHTML={{ __html: this.state.html }} />
    );
  }
}

export default WikiText;
