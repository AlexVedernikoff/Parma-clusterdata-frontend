import React from 'react';
import PropTypes from 'prop-types';
import {TextArea} from 'lego-on-react';
import FieldWrapper from '../FieldWrapper/FieldWrapper';


export default function YCTextArea({error, ...legoProps}) {
    return (
        <FieldWrapper error={error}>
            <TextArea {...legoProps}/>
        </FieldWrapper>
    );
}

YCTextArea.propTypes = {
    ...YCTextArea.propTypes,
    error: PropTypes.string
};
