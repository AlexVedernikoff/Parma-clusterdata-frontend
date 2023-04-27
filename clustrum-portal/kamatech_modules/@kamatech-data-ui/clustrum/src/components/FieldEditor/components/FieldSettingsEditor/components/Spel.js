import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { TextInput } from '@kamatech-data-ui/common/src';
import AceEditor from '../../../../AceEditor/AceEditor';

const b = block('field-settings-spel');

export const Spel = ({ spel, source, modifyField, aceModeUrl, modePath }) => {
  return (
    <React.Fragment>
      <div className={b('container')}>
        <div className={b('label')}>
          <span>Поле материализации</span>
        </div>
        <TextInput
          autoFocus={true}
          cls={b('inp-title')}
          theme="normal"
          size="s"
          view="default"
          tone="default"
          text={source}
          onChange={source => modifyField({ source })}
        />
      </div>
      <div className={b('container')}>
        <div className={b('title')}>Формула EL</div>
        <div className={b('editor')}>
          <AceEditor
            onChange={spel => modifyField({ spel })}
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
  modePath: PropTypes.string,
};
