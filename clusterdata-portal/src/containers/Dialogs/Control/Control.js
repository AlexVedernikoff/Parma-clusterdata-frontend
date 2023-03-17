import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';

import { CheckBox as LegoCheckBox, TextInput as LegoTextInput } from 'lego-on-react';
import { Dialog } from '@parma-data-ui/common/src';
import { i18n } from '@parma-data-ui/clusterdata';

import Dataset from './Switchers/Dataset';
import DatasetField from './Switchers/DatasetField/DatasetField';
import ElementType from './Switchers/ElementType';
import TextInput from './Switchers/TextInput';
import Input from './Input/Input';
import Select from './Select/Select';
import Date from './Date/Date';
import External from './External/External';
import SourceType from './Switchers/SourceType/SourceType';

import { ELEMENT_TYPE } from './constants';
import { CONTROL_SOURCE_TYPE, LAYOUT_ID } from '../../../constants/constants';
import { DIALOG_TYPE, IS_INTERNAL } from '../../../modules/constants/constants';
import {
  getOpenedItemAvailableItems,
  getOpenedItemData,
  getOpenedItemDefaults,
  isDialogVisible,
} from '../../../store/selectors/dash';
import { closeDialog, openExpandedFilter, setItemData } from '../../../store/actions/dash';

// import './Control.scss';

const b = block('dialog-control');

class Control extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.shape({
      title: PropTypes.string,
      showTitle: PropTypes.bool,
      sourceType: PropTypes.oneOf(Object.values(CONTROL_SOURCE_TYPE)).isRequired,
      dataset: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fieldId: PropTypes.string.isRequired,
      }),
      external: PropTypes.shape({
        // entryId: PropTypes.string.isRequired
        entryId: PropTypes.string,
      }),
      control: PropTypes.object.isRequired,
    }),
    defaults: PropTypes.object,
    availableItems: PropTypes.object,
    items: PropTypes.array,
    visible: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    setItemData: PropTypes.func.isRequired,
    openExpandedFilter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    defaults: {},
    availableItems: {},
    data: {},
  };

  static getDerivedStateFromProps(props, state) {
    if (props.visible === state.prevVisible) {
      if (state.sourceType !== state.prevSourceType) {
        return {
          sourceType: state.sourceType,
          prevSourceType: state.sourceType,
          dataset: {},
          external: {},
          defaults: props.defaults,
          availableItems: props.availableItems,
          control: state.sourceType === CONTROL_SOURCE_TYPE.EXTERNAL ? {} : { elementType: ELEMENT_TYPE.SELECT },
        };
      }

      return null;
    }

    return {
      prevVisible: props.visible,
      error: false,
      showAcceptableValues: false,
      title: '',
      showTitle: false,
      isExpandedFilter: props.openedLayoutId === LAYOUT_ID.SIDEBAR,
      dataset: {},
      external: {},
      defaults: props.defaults,
      availableItems: props.availableItems,
      sourceType: props.data.sourceType || CONTROL_SOURCE_TYPE.DATASET,
      prevSourceType: props.data.sourceType || CONTROL_SOURCE_TYPE.DATASET,
      control: { elementType: ELEMENT_TYPE.SELECT },
      isManualTitle: Boolean(props.id),
      ...props.data,
    };
  }

  state = {};

  get isEdit() {
    return Boolean(this.props.id);
  }

  _createEmptyValue = elementType => (elementType === ELEMENT_TYPE.SELECT ? [] : '');

  onApply = () => {
    const {
      control,
      dataset,
      external,
      defaults,
      availableItems,
      showTitle,
      sourceType,
      title,
      isExpandedFilter,
    } = this.state;
    const field = dataset.fieldId || control.fieldName;

    const selectValue = (controlValue, propsValue) =>
      controlValue === null || controlValue === undefined
        ? propsValue || this._createEmptyValue(control.elementType)
        : controlValue;

    const mergedDefaults = field ? { [field]: selectValue(control.defaultValue, defaults[field]) } : defaults;

    const mergedAvailableItems = field
      ? { [field]: selectValue(control.availableValues, availableItems[field]) }
      : availableItems;

    const layoutId = isExpandedFilter ? LAYOUT_ID.SIDEBAR : LAYOUT_ID.DASHBOARD;
    const layout = isExpandedFilter ? { w: 36 } : {};
    if ((field || external.entryId) && title) {
      this.props.setItemData({
        data: { dataset, control, external, showTitle, sourceType, title },
        defaults: mergedDefaults,
        availableItems: mergedAvailableItems,
        layoutId,
        layout,
      });
      this.props.closeDialog();
      if (isExpandedFilter) {
        this.props.openExpandedFilter();
      }
    } else {
      this.setState({ error: true });
    }
  };

  changeElementType = elementType => {
    const newState = { control: { elementType } };

    // Вызов _createEmptyValue нужно делать дважды, так как нам нужны два массива,
    // которые он может вернуть. Иначе оба поля бы ссылались на один и тот же массив.
    newState.control.defaultValue = this._createEmptyValue(elementType);
    newState.control.availableValues = this._createEmptyValue(elementType);

    this.setState(newState);
  };

  renderSourceType({ type, title }) {
    const { sourceType } = this.state;
    return (
      <React.Fragment>
        <SourceType
          type={type}
          selectedType={sourceType}
          title={title}
          onChange={sourceType => this.setState({ sourceType })}
        />
        {sourceType === type && (
          <div className={b('switchers')}>
            {this.renderCommonSwitchers()}
            {this.renderElementSwitchers()}
          </div>
        )}
      </React.Fragment>
    );
  }

  renderSourceTypeExternal() {
    if (IS_INTERNAL) {
      const type = CONTROL_SOURCE_TYPE.EXTERNAL;

      const { sourceType, title, isManualTitle, external, defaults } = this.state;

      return (
        <React.Fragment>
          <SourceType
            type={type}
            selectedType={sourceType}
            title={i18n('dash.control-dialog.edit', 'value_source-external')}
            onChange={sourceType => this.setState({ sourceType })}
          />
          {sourceType === type && (
            <div className={b('switchers')}>
              <External
                config={external}
                defaults={defaults}
                onEntrySelect={({ entryId, name }) => {
                  this.setState({ external: { entryId } });
                  if (!isManualTitle || !title) {
                    this.setState({ title: name });
                  }
                }}
                onChange={({ defaults }) => this.setState({ defaults })}
              />
            </div>
          )}
        </React.Fragment>
      );
    }

    return null;
  }

  renderCommonSwitchers() {
    const { sourceType, dataset, control, title, isManualTitle } = this.state;
    const { id, fieldId: datasetFieldId } = dataset;
    const { elementType, fieldName: controlFieldName } = control;

    return (
      <React.Fragment>
        {sourceType === CONTROL_SOURCE_TYPE.DATASET && (
          <React.Fragment>
            <Dataset
              title={i18n('dash.control-dialog.edit', 'field_dataset')}
              datasetId={id}
              onClick={id => this.setState({ dataset: { id } })}
            />
            <DatasetField
              title={i18n('dash.control-dialog.edit', 'field_field')}
              datasetId={id}
              fieldId={datasetFieldId}
              onChange={({ fieldId, fieldName }) => {
                this.setState({ dataset: { ...dataset, fieldId } });
                if (!isManualTitle || !title) {
                  this.setState({ title: fieldName });
                }
              }}
            />
          </React.Fragment>
        )}
        {sourceType !== CONTROL_SOURCE_TYPE.EXTERNAL && (
          <ElementType
            title={i18n('dash.control-dialog.edit', 'field_element-type')}
            elementType={elementType}
            onChange={this.changeElementType}
          />
        )}
        {sourceType !== CONTROL_SOURCE_TYPE.DATASET && (
          <TextInput
            title={i18n('dash.control-dialog.edit', 'field_field-name')}
            text={controlFieldName}
            onChange={fieldName => this.setState({ control: { ...control, fieldName } })}
          />
        )}
      </React.Fragment>
    );
  }

  renderElementSwitchers() {
    const { sourceType, dataset, control, defaults, availableItems } = this.state;
    const { id, fieldId } = dataset;
    const {
      elementType,
      acceptableValues,
      defaultValue,
      availableValues,
      multiselectable,
      nullable,
      isRange,
    } = control;

    const mergedDefaultValue = defaultValue || defaults[fieldId];
    const mergedAvailableValues = availableValues || availableItems[fieldId];

    if (elementType === ELEMENT_TYPE.INPUT) {
      return (
        <Input
          sourceType={sourceType}
          defaultValue={mergedDefaultValue}
          onChange={data => this.setState({ control: { ...control, ...data } })}
        />
      );
    }

    if (elementType === ELEMENT_TYPE.SELECT) {
      return (
        <Select
          sourceType={sourceType}
          datasetId={id}
          datasetField={fieldId}
          acceptableValues={acceptableValues}
          defaultValue={mergedDefaultValue}
          availableValues={mergedAvailableValues}
          multiselectable={multiselectable}
          nullable={nullable}
          onChange={data => this.setState({ control: { ...control, ...data } })}
        />
      );
    }

    if (elementType === ELEMENT_TYPE.DATE) {
      return (
        <Date
          sourceType={sourceType}
          acceptableValues={acceptableValues}
          defaultValue={mergedDefaultValue}
          isRange={isRange}
          onChange={data => this.setState({ control: { ...control, ...data } })}
        />
      );
    }

    return null;
  }

  render() {
    const { visible, closeDialog } = this.props;
    const { title, showTitle, error, isExpandedFilter } = this.state;

    // TODO: вот это место выглядит не очень хорошо, сделано для того, чтобы проще обновлялись под-диалоги
    return visible ? (
      <Dialog visible={visible} onClose={closeDialog} autoclosable={false}>
        <div className={b()}>
          <Dialog.Header caption={i18n('dash.control-dialog.edit', 'label_control')} />
          <Dialog.Body>
            <div className={b('title')}>
              <LegoTextInput
                theme="normal"
                view="default"
                tone="default"
                size="s"
                text={title}
                placeholder={i18n('dash.control-dialog.edit', 'context_title')}
                onChange={title => this.setState({ title, isManualTitle: true })}
              />
              <LegoCheckBox
                disabled={!title}
                theme="normal"
                view="default"
                tone="default"
                size="s"
                checked={showTitle}
                onChange={() => this.setState({ showTitle: !showTitle })}
              >
                {i18n('dash.control-dialog.edit', 'field_show-title')}
              </LegoCheckBox>
            </div>
            {this.renderSourceType({
              type: CONTROL_SOURCE_TYPE.DATASET,
              title: i18n('dash.control-dialog.edit', 'value_source-dataset'),
            })}
            {this.renderSourceType({
              type: CONTROL_SOURCE_TYPE.MANUAL,
              title: i18n('dash.control-dialog.edit', 'value_source-manual'),
            })}
            {this.renderSourceTypeExternal()}
            <LegoCheckBox
              theme="normal"
              view="default"
              tone="default"
              size="s"
              checked={isExpandedFilter}
              onChange={() => this.setState({ isExpandedFilter: !isExpandedFilter })}
            >
              Добавить в боковую панель
            </LegoCheckBox>
          </Dialog.Body>
          <Dialog.Footer
            onClickButtonCancel={closeDialog}
            onClickButtonApply={this.onApply}
            textButtonApply={
              this.isEdit
                ? i18n('dash.control-dialog.edit', 'button_save')
                : i18n('dash.control-dialog.edit', 'button_add')
            }
            textButtonCancel={i18n('dash.control-dialog.edit', 'button_cancel')}
            errorText={i18n('dash.control-dialog.edit', 'toast_required-fields')}
            showError={error}
            onOutsideTooltipClick={() => this.setState({ error: false })}
          />
        </div>
      </Dialog>
    ) : null;
  }
}

const mapStateToProps = state => ({
  id: state.dash.openedItemId,
  openedLayoutId: state.dash.openedLayoutId,
  data: getOpenedItemData(state),
  defaults: getOpenedItemDefaults(state),
  availableItems: getOpenedItemAvailableItems(state),
  visible: isDialogVisible(state, DIALOG_TYPE.CONTROL),
});

const mapDispatchToProps = {
  closeDialog,
  setItemData,
  openExpandedFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(Control);
