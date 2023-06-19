import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';

import DataTypeIconSelector from '../../../DataTypeIconSelector/DataTypeIconSelector';

// import './AccessibleFields.scss';
import iconFormula2 from 'icons/formula2.svg';

const b = block('accessible-fields');

function AccessibleFields(props) {
  const { fields, onClick } = props;

  return (
    <div className={b()}>
      {fields.map((field, index) => {
        const { title, cast, calc_mode: calMode, type } = field;

        const isFormula = calMode === 'formula';

        return (
          <div
            className={b('row')}
            key={`accessible-fields-${index}`}
            onClick={() => onClick({ title })}
          >
            <div className={b('data-type', { [type.toLowerCase()]: true })}>
              <DataTypeIconSelector type={cast} />
            </div>
            <div className={b('title')}>
              <span>{title}</span>
            </div>
            {isFormula && (
              <Icon className={b('formula')} data={iconFormula2} width="24" height="24" />
            )}
          </div>
        );
      })}
    </div>
  );
}

AccessibleFields.propTypes = {
  fields: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AccessibleFields;
