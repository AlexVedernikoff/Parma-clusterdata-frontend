import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
// import './Text.scss';
import Loader from '@parma-data-ui/react-components/src/components/Loader';
import { Button } from 'lego-on-react';
import { LOAD_STATUS } from '../../constants/common';

const b = block('dashkit-plugin-text');

// стили для markdown нужно подключать отдельно
// можно подключить из @parma-data-ui/clusterdata/src/styles/yfm.scss
// в дальнейшем будут в @parma-data-ui/common

class PluginText extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    const {
      data: { text },
    } = props;
    const needUpdate = text !== state.text;
    return {
      text,
      needUpdate,
    };
  }

  state = {
    htmlText: '',
    status: this.withMarkdown ? LOAD_STATUS.PENDING : LOAD_STATUS.SUCCESS,
  };

  componentDidMount() {
    this.getMarkdown();
  }

  componentDidUpdate() {
    if (this.state.needUpdate) {
      this.getMarkdown();
    }
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  reload() {
    this.getMarkdown();
  }

  async getMarkdown() {
    if (!this.withMarkdown) {
      return;
    }
    this.setState({ status: LOAD_STATUS.PENDING });
    try {
      let htmlText = '';
      if (this.state.text && this.state.text.trim()) {
        const loadedData = await this.props.apiHandler({ text: this.state.text });
        htmlText = loadedData.result;
      }
      if (this._isUnmounted) {
        return;
      }
      this.setState({
        htmlText,
        status: LOAD_STATUS.SUCCESS,
      });
    } catch (e) {
      if (this._isUnmounted) {
        return;
      }
      this.setState({ status: LOAD_STATUS.FAIL });
    }
  }

  onRetryClick = () => {
    this.getMarkdown();
  };

  get withMarkdown() {
    return typeof this.props.apiHandler === 'function';
  }

  renderLoader() {
    return (
      <div className={b({ loading: true })}>
        <div className={b('loader')}>
          <div className={b('loader-view')}>
            <Loader size="m" />
          </div>
          {/*<span className={b('loader-text')}>Загрузка...</span>*/}
        </div>
      </div>
    );
  }

  renderError() {
    return (
      <div className={b({ error: true })}>
        <div className={b('error')}>Ошибка преобразования в markdown</div>
        <br />
        <Button theme="action" view="default" tone="default" size="m" onClick={this.onRetryClick}>
          Повторить
        </Button>
        <br />
      </div>
    );
  }

  renderText() {
    return (
      <div className={b({ withMarkdown: this.withMarkdown })}>
        {this.withMarkdown ? (
          <div
            className="yfm" // className из стилей для markdown
            dangerouslySetInnerHTML={{ __html: this.state.htmlText }}
          />
        ) : (
          this.state.text
        )}
      </div>
    );
  }

  render() {
    switch (this.state.status) {
      case LOAD_STATUS.SUCCESS:
        return this.renderText();
      case LOAD_STATUS.PENDING:
        return this.renderLoader();
      default:
        return this.renderError();
    }
  }
}

PluginText.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string,
  }),
  apiHandler: PropTypes.func,
};

const plugin = {
  type: 'text',
  defaultLayout: { w: 12, h: 6 },
  setSettings(settings) {
    const { apiHandler } = settings;
    plugin._apiHandler = apiHandler;
    return plugin;
  },
  renderer(props, forwardedRef) {
    return <PluginText {...props} apiHandler={plugin._apiHandler} ref={forwardedRef} />;
  },
};

export default plugin;
