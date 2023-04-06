import React from 'react';
import PropTypes from 'prop-types';

import Loader from '@kamatech-data-ui/react-components/src/components/Loader';
import Paranja from '../Paranja';

export default function Loading(props) {
  return (
    <Paranja visible={props.visible}>
      <Loader size={'l'} />
    </Paranja>
  );
}
Loading.propTypes = {
  visible: PropTypes.bool,
};
