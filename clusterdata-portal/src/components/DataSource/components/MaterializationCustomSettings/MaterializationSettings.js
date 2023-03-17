import React from 'react';
import block from 'bem-cn-lite';
import { RadioBox } from '../../../../../parma_modules/lego-on-react';
import { i18n } from '../../../../../parma_modules/@parma-data-ui/clusterdata';
import MaterializationCustomSettings from './MaterializationCustomSettings';

const DATASET_MATERIALIZED_MODES = {
  DEFAULT: 'default',
  CUSTOM: 'custom',
};

const customSettingsBlock = block('materialization-custom-settings');
const datasourceBlock = block('data-source');

function MaterializationSettings(props) {
  const { materializationCustomSettings, changeMaterializationCustomSettings, onEntryClick, sdk } = props;

  const handleChange = e => {
    materializationCustomSettings[e.target.name] = e.target.value;

    changeMaterializationCustomSettings(materializationCustomSettings);
  };

  return (
    <div className={datasourceBlock('section')}>
      <div className={datasourceBlock('caption', datasourceBlock('margin', { bottom: 5 }))}>
        <span>{i18n('dataset.materialization.modify', 'section_materialization_settings')}</span>
      </div>
      <div className={customSettingsBlock()}>
        <RadioBox
          disabled={false}
          cls={customSettingsBlock('settings_items')}
          view="default"
          theme="normal"
          size="m"
          name="modeType"
          value={materializationCustomSettings.modeType}
          onChange={handleChange}
        >
          <RadioBox.Radio value={DATASET_MATERIALIZED_MODES.DEFAULT}>
            {i18n('dataset.materialization.modify', 'value_custom_settings_default')}
          </RadioBox.Radio>
          <RadioBox.Radio value={DATASET_MATERIALIZED_MODES.CUSTOM}>
            {i18n('dataset.materialization.modify', 'value_custom_settings_custom')}
          </RadioBox.Radio>
        </RadioBox>

        {materializationCustomSettings.modeType === DATASET_MATERIALIZED_MODES.CUSTOM && (
          <MaterializationCustomSettings
            changeMaterializationCustomSettings={changeMaterializationCustomSettings}
            materializationCustomSettings={materializationCustomSettings}
            onEntryClick={onEntryClick}
            sdk={sdk}
          />
        )}
      </div>
    </div>
  );
}

MaterializationSettings.DATASET_MATERIALIZED_MODES = DATASET_MATERIALIZED_MODES;

export default MaterializationSettings;
