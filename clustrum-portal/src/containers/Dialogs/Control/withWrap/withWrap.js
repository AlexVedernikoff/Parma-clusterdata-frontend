import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './withWrap.scss';

const b = block('control-switch');

function withWrap(WrappedComponent) {
  function WithWrap(props) {
    const {
      title,
      parentBlock = blockName => {
        return blockName;
      },
      ...restProps
    } = props;
    return (
      <div className={parentBlock(b())}>
        <div className={b('title')}>{title}</div>
        <div className={b('element')}>
          <WrappedComponent {...restProps} />
        </div>
      </div>
    );
  }

  WithWrap.propTypes = { title: PropTypes.string };

  return WithWrap;
}

export default withWrap;
