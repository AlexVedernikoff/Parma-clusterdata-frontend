import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {TextInput} from '@parma-data-ui/common/src';
import AceEditor from '../../../../AceEditor/AceEditor';
import {I18n} from 'utils/i18n';

const i18n = I18n.keyset('component.field-editor.view');
const b = block('field-settings-spel');

export const Spel = ({spel, source, modifyField, aceModeUrl, modePath}) => {
    return(
        <React.Fragment>
            <div className={b('container')}>
                <div className={b('label')}>
                    <span>{i18n('field_materialization-field')}</span>
                </div>
                <TextInput
                    autoFocus={true}
                    cls={b('inp-title')}
                    theme="normal"
                    size="s"
                    view="default"
                    tone="default"
                    text={source}
                    onChange={(source) => modifyField({source})}
                />
            </div>
            <div className={b('container')}>
                <div className={b('title')}>{i18n('spel_expression')}</div>
                <div className={b('editor')}>
                    <AceEditor
                        onChange={(spel) => modifyField({spel})}
                        formula={spel !== undefined ? spel : ''}
                        annotations={[]}
                        aceModeUrl={aceModeUrl}
                        modePath={modePath}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

Spel.propTypes = {
    spel: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    modifyField: PropTypes.func.isRequired,
    aceModeUrl: PropTypes.string,
    modePath: PropTypes.string
};
