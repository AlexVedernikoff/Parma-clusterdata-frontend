import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './Caption.scss';

const b = block('dl-connector-field-caption');

class Caption extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    fixedWidth: PropTypes.bool,
    section: PropTypes.bool,
    comment: PropTypes.bool,
  };

  static defaultProps = {
    fixedWidth: true,
  };

  render() {
    const { text, fixedWidth, section, comment } = this.props;

    const mods = {
      comment: comment,
      section: section,
      fixed: fixedWidth,
    };

    return (
      <div className={b(mods)}>
        <span>{text}</span>
      </div>
    );
  }
}

export default Caption;
