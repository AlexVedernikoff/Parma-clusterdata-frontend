import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@parma-data-ui/common/src/components/Icon/Icon';

import iconNum from 'icons/num.svg';
import iconBool from 'icons/bool.svg';
import iconCal from 'icons/cal.svg';
import iconGeo from 'icons/geo.svg';
import iconType from 'icons/type.svg';

function DataTypeIconSelector(props) {
  const { type, width, className } = props;

  switch (type) {
    case 'float':
    case 'double':
    case 'uinteger':
    case 'long':
    case 'integer':
      return <Icon className={className} data={iconNum} width={width} height={width} />;
    case 'boolean':
      return <Icon className={className} data={iconBool} width={width} height={width} />;
    case 'date':
    case 'datetime':
    case 'timestamp':
      return <Icon className={className} data={iconCal} width={width} height={width} />;
    case 'geopoint':
      return <Icon className={className} data={iconGeo} width={width} height={width} />;
    case 'geopolygon':
      return <Icon className={className} data={iconGeo} width={width} height={width} />;
    case 'string':
      return <Icon className={className} data={iconType} width={width} height={width} />;
    default:
      return '';
  }
}

DataTypeIconSelector.propTypes = {
  type: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  className: PropTypes.string,
};

DataTypeIconSelector.defaultProps = {
  width: '14',
  className: '',
};

export default DataTypeIconSelector;
