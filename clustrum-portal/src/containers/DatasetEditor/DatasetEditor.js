import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import _debounce from 'lodash/debounce';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import FieldEditor from '@kamatech-data-ui/clustrum/src/components/FieldEditor/FieldEditor';
import DatasetTable from '../../components/DatasetTable/DatasetTable';
import RLSDialog from '../../components/RLSDialog/RLSDialog';
import Utils from '../../helpers/utils';
import {
  updateDatasetByValidation,
  datasetFieldsSelector,
  typesSelector,
  sourcesSelector,
  datasetValidationSelector,
  aceModeUrlSelector,
  addField,
  duplicateField,
  deleteField,
  updateField,
  previewEnabledSelector,
  rlsSelector,
  updateRLS,
} from '../../store/reducers/dataset';
import { load as loadDash, openDialog } from 'store/actions/dash';
import { canEdit, getEntryTitle, isDraft, isEditMode } from 'store/selectors/dash';

// import './DatasetEditor.scss';

const b = block('dataset-editor');

class DatasetEditor extends React.Component {
  static defaultProps = {};

  static propTypes = {
    datasetId: PropTypes.string.isRequired,
    aceModeUrl: PropTypes.string.isRequired,
    sdk: PropTypes.object.isRequired,
    datasetErrorDialogRef: PropTypes.object.isRequired,
    rls: PropTypes.object.isRequired,
    validation: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired,
    sources: PropTypes.array.isRequired,
    loadDash: PropTypes.func.isRequired,
    updateRLS: PropTypes.func.isRequired,
    searchKeyword: PropTypes.string,
  };

  static getDerivedStateFromProps(props, state) {
    const { isDisplayHiddenFields } = state;
    const { searchKeyword, fields } = props;

    const filteredFields = DatasetEditor.filterFields({
      searchKeyword,
      isDisplayHiddenFields,
      fields,
    });

    return {
      fields: filteredFields,
    };
  }

  static filterFields = ({ searchKeyword, isDisplayHiddenFields, fields = [] }) => {
    let filteredFields = Utils.findFields({
      fields: fields,
      keyword: searchKeyword,
    });

    if (!isDisplayHiddenFields) {
      filteredFields = Utils.filterFieldsBy({
        by: 'hidden',
        fields: filteredFields,
      });
    }
    return filteredFields;
  };

  state = {
    isFieldEditorVisible: false,
    isDisplayHiddenFields: true,
    searchKeyword: '',
    field: null,
    fields: [],
    updates: [],
    visibleRLSDialog: false,
    currentRLSField: '',
  };

  toggleFilterFieldsByHidden = () => {
    this.setState({
      isDisplayHiddenFields: !this.state.isDisplayHiddenFields,
    });
  };

  openFieldEditor = ({ field } = {}) => {
    this.setState({
      isFieldEditorVisible: true,
      field,
    });
  };

  closeFieldEditor = () => {
    this.setState({
      isFieldEditorVisible: false,
    });
  };

  debouncedUpdate2000 = _debounce(this.props.updateDatasetByValidation, 2000);

  modifyFields = ({ actionType, field, debounce = false, updatePreview = false, validateEnabled = true }) => {
    const {
      updateDatasetByValidation,
      addField,
      duplicateField,
      deleteField,
      updateField,
      datasetErrorDialogRef,
    } = this.props;
    const { guid } = field;

    if (guid) {
      switch (actionType) {
        case 'duplicate': {
          duplicateField(field);

          this.debouncedUpdate2000({
            updatePreview,
            validateEnabled,
            datasetErrorDialogRef,
          });

          break;
        }
        case 'delete': {
          deleteField(field);

          this.debouncedUpdate2000({
            updatePreview,
            validateEnabled,
            datasetErrorDialogRef,
          });

          break;
        }
        case 'add': {
          addField(field);

          updateDatasetByValidation({
            updatePreview,
            validateEnabled,
            datasetErrorDialogRef,
          });

          break;
        }
        case 'update': {
          updateField(field);

          if (debounce) {
            this.debouncedUpdate2000({
              updatePreview,
              validateEnabled,
              datasetErrorDialogRef,
            });
          } else {
            updateDatasetByValidation({
              updatePreview,
              validateEnabled,
              datasetErrorDialogRef,
            });
          }

          break;
        }
      }
    }
  };

  updateField = data => {
    this.modifyFields({
      ...data,
      actionType: 'update',
    });
  };

  addField = data => {
    this.modifyFields({
      ...data,
      actionType: 'add',
    });
  };

  duplicateField = data => {
    this.modifyFields({
      ...data,
      actionType: 'duplicate',
      updatePreview: true,
    });
  };

  removeField = data => {
    this.modifyFields({
      ...data,
      actionType: 'delete',
      updatePreview: true,
    });
  };

  modifyField = ({ field }) => {
    this.updateField({
      field,
      updatePreview: true,
    });

    this.closeFieldEditor();
  };

  createField = ({ field }) => {
    this.addField({
      field,
      updatePreview: true,
    });

    this.closeFieldEditor();
  };

  openRLSDialog = ({ field }) => {
    const { rls } = this.props;
    const { guid } = field;

    if (rls && guid) {
      const rlsField = rls[guid] || '';

      this.setState({
        visibleRLSDialog: true,
        currentRLSField: rlsField,
        field,
      });
    }
  };

  closeRLSDialog = () => {
    this.setState({
      visibleRLSDialog: false,
      currentRLSField: '',
      field: null,
    });
  };

  render() {
    const { sdk, datasetId, types, sources, validation, aceModeUrl, fields: fieldsStore, updateRLS } = this.props;
    const {
      isFieldEditorVisible,
      isDisplayHiddenFields,
      field,
      fields,
      visibleRLSDialog,
      currentRLSField,
    } = this.state;
    let modePath;

    if (Utils.isInternal()) {
      modePath = '/build/static/ace/';
    }

    return (
      <div className={b()}>
        <DatasetTable
          datasetId={datasetId}
          validation={validation}
          fields={fields}
          types={types}
          displayHiddenFields={isDisplayHiddenFields}
          toggleFilterFieldsByHidden={this.toggleFilterFieldsByHidden}
          onClickRow={this.openFieldEditor}
          updateField={this.updateField}
          duplicateField={this.duplicateField}
          removeField={this.removeField}
          openRLSDialog={this.openRLSDialog}
        />
        <FieldEditor
          sdk={sdk}
          datasetId={datasetId}
          aceModeUrl={aceModeUrl}
          modePath={modePath}
          visible={isFieldEditorVisible}
          field={field}
          fields={fieldsStore}
          types={types}
          sources={sources}
          onClose={this.closeFieldEditor}
          onSave={this.modifyField}
          onCreate={this.createField}
        />
        <RLSDialog
          visible={visibleRLSDialog}
          rlsField={currentRLSField}
          field={field}
          onClose={this.closeRLSDialog}
          onSave={updateRLS}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  fields: datasetFieldsSelector,
  types: typesSelector,
  sources: sourcesSelector,
  validation: datasetValidationSelector,
  aceModeUrl: aceModeUrlSelector,
  previewEnabled: previewEnabledSelector,
  rls: rlsSelector,
});
const mapDispatchToProps = {
  updateDatasetByValidation,
  addField,
  duplicateField,
  deleteField,
  updateField,
  loadDash,
  openDialog,
  updateRLS,
};

export default compose(connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }))(DatasetEditor);
