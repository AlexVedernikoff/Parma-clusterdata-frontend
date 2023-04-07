import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button, Link, Tooltip } from 'lego-on-react';
import { Icon } from '@kamatech-data-ui/common/src';
import iconBrandedQuestion from '@kamatech-data-ui/clustrum/src/icons/branded-question.svg';

// import './HelpButton.scss';

const b = block('dl-connector-help');

class HelpButton extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  };

  state = {
    visible: false,
  };

  _btnRef = React.createRef();

  _toggleTooltip = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  render() {
    const { title, url } = this.props;
    const { visible } = this.state;

    return (
      <div className={b()}>
        <Button
          ref={this._btnRef}
          cls={b('btn')}
          theme="flat"
          size="m"
          view="default"
          tone="default"
          title={title}
          onClick={this._toggleTooltip}
        >
          <Icon className={b('icon')} data={iconBrandedQuestion} width="18" />
        </Button>
        <Tooltip
          visible={visible}
          anchor={this._btnRef.current}
          theme="white"
          view="classic"
          tone="default"
          to="right"
          size="s"
          tail={true}
          onOutsideClick={this._toggleTooltip}
        >
          <Link theme="normal" target="_blank" url={url}>
            {url}
          </Link>
        </Tooltip>
      </div>
    );
  }
}

export default HelpButton;
