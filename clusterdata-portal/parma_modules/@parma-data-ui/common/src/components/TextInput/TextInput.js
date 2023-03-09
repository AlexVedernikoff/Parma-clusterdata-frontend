import React from 'react';
import PropTypes from 'prop-types';
import {TextInput} from 'lego-on-react';
import FieldWrapper from '../FieldWrapper/FieldWrapper';


const YCTextInput = React.forwardRef(({error, ...legoProps}, ref) => (
    <FieldWrapper error={error}>
        <TextInput ref={ref} {...legoProps}/>
    </FieldWrapper>
));

YCTextInput.propTypes = {
    ...TextInput.propTypes,
    error: PropTypes.string
};

export default YCTextInput;
