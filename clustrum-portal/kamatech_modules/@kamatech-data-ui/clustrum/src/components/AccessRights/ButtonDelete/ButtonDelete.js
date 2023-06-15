import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';
import iconClose from '@kamatech-data-ui/common/src/assets/icons/preview-close.svg';
import { Button } from 'lego-on-react';
// import './ButtonDelete.scss';

const b = block('dl-ar-btn-delete');

const ButtonDelete = ({ className, ...btnProps }) => (
  <Button
    theme="light"
    size="s"
    view="default"
    tone="default"
    cls={b(false, className)}
    {...btnProps}
  >
    <Icon data={iconClose} width="24" height="24" />
  </Button>
);

ButtonDelete.propTypes = {
  className: PropTypes.string,
};

export default ButtonDelete;
