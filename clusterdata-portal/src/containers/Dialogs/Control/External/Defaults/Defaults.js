import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button, TextInput } from 'lego-on-react';
import { Icon } from '@parma-data-ui/common/src';
import { i18n } from '@parma-data-ui/clusterdata-i18n';

import ButtonIcon from '../../../../../components/ButtonIcon/ButtonIcon';
import WrappedButton from '../../Switchers/Button';
import SubDialog from '../../Dialog/Dialog';

import { unwrapFromArray, wrapToArray } from '../../../../../helpers/utils-dash';

import iconPlus from '@parma-data-ui/clusterdata/src/icons/plus.svg';
import iconPreviewClose from '@parma-data-ui/clusterdata/src/icons/preview-close.svg';

// import './Defaults.scss';

const b = block('control-external-defaults');

const Input = ({ text, onChange }) => (
  <TextInput theme="normal" view="default" tone="default" size="s" text={text} onChange={onChange} />
);

const Remove = ({ onClick }) => (
  <Icon width="18" height="18" className={b('icon')} onClick={onClick} data={iconPreviewClose} />
);

const AddButton = ({ text, onClick }) => (
  <Button
    theme="flat"
    view="default"
    tone="default"
    size="s"
    iconLeft={
      <ButtonIcon>
        <Icon data={iconPlus} width="16" />
      </ButtonIcon>
    }
    text={text}
    onClick={onClick}
  />
);

const EMPTY_ENTRY = ['', ['']];

const makeEntries = obj => {
  const entries = Object.entries(obj).map(([key, value]) => [key, wrapToArray(value)]);
  return entries.length ? entries : [EMPTY_ENTRY];
};

const makeObject = entries =>
  entries.reduce((result, [key, value]) => (key ? { ...result, [key]: unwrapFromArray(value) } : result), {});

function Defaults({ defaults, onChange }) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [entries, setEntries] = React.useState(makeEntries(defaults));

  return (
    <React.Fragment>
      <WrappedButton
        title={i18n('dash.control-dialog.edit', 'label_params')}
        text={i18n('dash.control-dialog.edit', 'button_setup')}
        disabled={false}
        onClick={() => setShowDialog(!showDialog)}
      />
      <SubDialog
        caption={i18n('dash.control-dialog.edit', 'label_params')}
        visible={showDialog}
        onApply={() => {
          const newDefaults = makeObject(entries);
          onChange(newDefaults);
          setEntries(makeEntries(newDefaults));
          setShowDialog(!showDialog);
        }}
        onClose={() => setShowDialog(false)}
      >
        <div className={b()}>
          {entries.map(([key, values], keyIndex) => (
            <div className={b('param')} key={'param' + keyIndex}>
              <div className={b('column')}>
                <div className={b('input')}>
                  <Input
                    text={key}
                    onChange={text =>
                      setEntries(entries.map((pair, index) => (keyIndex === index ? [text, pair[1]] : pair)))
                    }
                  />
                  {entries.length > 1 && (
                    <Remove onClick={() => setEntries(entries.filter((pair, index) => keyIndex !== index))} />
                  )}
                </div>
                {keyIndex === entries.length - 1 && (
                  <AddButton
                    text={i18n('dash.control-dialog.edit', 'button_add-key')}
                    onClick={() => setEntries([...entries, EMPTY_ENTRY])}
                  />
                )}
              </div>
              <div className={b('column')}>
                {values.map((value, valueIndex) => (
                  <div className={b('input')} key={'value' + valueIndex}>
                    <Input
                      text={value}
                      onChange={text =>
                        setEntries(
                          entries.map((pair, index) =>
                            keyIndex === index
                              ? [pair[0], pair[1].map((value, index) => (index === valueIndex ? text : value))]
                              : pair,
                          ),
                        )
                      }
                    />
                    {values.length > 1 && (
                      <Remove
                        onClick={() =>
                          setEntries(
                            entries.map((pair, index) =>
                              index === keyIndex
                                ? [pair[0], pair[1].filter((value, index) => index !== valueIndex)]
                                : pair,
                            ),
                          )
                        }
                      />
                    )}
                  </div>
                ))}
                <AddButton
                  text={i18n('dash.control-dialog.edit', 'button_add-value')}
                  onClick={() =>
                    setEntries(entries.map((pair, index) => (index === keyIndex ? [pair[0], [...pair[1], '']] : pair)))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </SubDialog>
    </React.Fragment>
  );
}

Defaults.propTypes = {
  defaults: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default Defaults;
