import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import NavigationInput from '../../../../components/NavigationInput/NavigationInput';
import Defaults from './Defaults/Defaults';

// import './External.scss';
import {ENTRY_TYPE} from '../../../../constants/constants';

const b = block('control-external');

function External({config: {entryId}, defaults, onEntrySelect, onChange}) {
    return (
        <React.Fragment>
            <NavigationInput
                size="s"
                entryId={entryId}
                onChange={onEntrySelect}
                className={b('navigation-input')}
                includeClickableType={ENTRY_TYPE.CONTROL_NODE}
            />
            <Defaults
                defaults={defaults}
                onChange={defaults => onChange({defaults})}
            />
        </React.Fragment>
    );
}

External.propTypes = {
    config: PropTypes.shape({entryId: PropTypes.string}).isRequired,
    defaults: PropTypes.object.isRequired,
    onEntrySelect: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

export default External;
