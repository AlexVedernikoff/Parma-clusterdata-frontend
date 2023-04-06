import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button, RadioButton, TextInput } from 'lego-on-react';
import { i18n } from '@kamatech-data-ui/clustrum-i18n';

// import './DatasetPanel.scss';
import Utils from '../../helpers/utils';
import { TAB_DATA, TAB_DATASET, DATASET_TABS } from '../../constants';
import { Icon } from '@kamatech-data-ui/common/src';
import iconPlus from '@kamatech-data-ui/clustrum/src/icons/plus.svg';

const b = block('dataset-panel');

class DatasetPanel extends React.Component {
  static propTypes = {
    tab: PropTypes.oneOf(DATASET_TABS),
    switchTab: PropTypes.func.isRequired,
  };

  render() {
    const {
      switchTab,
      tab,
      previewEnabled,
      openFieldEditor,
      toggleVisibilityPreview,
      toggleVisibilityHistory,
      syncDataSet,
      searchKeyword,
      changeSearchKeyword,
    } = this.props;

    const multisourcesEnabled = Utils.isEnabledFeature('multisources');

    return (
      <div className={b()}>
        {multisourcesEnabled && (
          <RadioButton
            cls={b('tabs')}
            theme='normal'
            size='s'
            view='default'
            tone='default'
            value={tab}
            onChange={e => switchTab(e.target.value)}
          >
            <RadioButton.Radio value={TAB_DATASET}>
              {i18n('dataset.dataset-editor.modify', 'value_dataset')}
            </RadioButton.Radio>
            <RadioButton.Radio value={TAB_DATA}>
              {i18n('dataset.dataset-editor.modify', 'value_data')}
            </RadioButton.Radio>
          </RadioButton>
        )}
        {tab === TAB_DATASET && (
          <React.Fragment>
            <Button
              cls={b('sync-btn')}
              theme='flat'
              size='n'
              view='default'
              tone='default'
              text={i18n('dataset.dataset-editor.modify', 'button_sync')}
              onClick={syncDataSet}
            />
            <Button
              disabled={!previewEnabled}
              cls={b('preview-btn')}
              theme='flat'
              size='n'
              view='default'
              tone='default'
              text={i18n('dataset.dataset-editor.modify', 'button_preview')}
              onClick={toggleVisibilityPreview}
            />
            <Button
              cls={b('history-btn')}
              theme='flat'
              size='n'
              view='default'
              tone='default'
              text={i18n('dataset.dataset-editor.modify', 'button_history')}
              onClick={toggleVisibilityHistory}
            />
            <Button
              cls={b('add-field-btn')}
              theme='flat'
              size='n'
              view='default'
              tone='default'
              iconLeft={<Icon className={b('add-field-btn-ic')} data={iconPlus} width='18' />}
              text={i18n('dataset.dataset-editor.modify', 'button_add-field')}
              onClick={openFieldEditor}
            />
            <TextInput
              cls={b('find-field')}
              theme='normal'
              size='s'
              view='default'
              tone='default'
              text={searchKeyword}
              onChange={changeSearchKeyword}
              placeholder={i18n('dataset.dataset-editor.modify', 'field_find-field')}
              hasClear
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default DatasetPanel;
