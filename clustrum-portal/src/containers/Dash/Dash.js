import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Header from '../Header/Header';
import Body from '../Body/Body';
import Dialogs from '../Dialogs/Dialogs';

import PageHead from '../../components/PageHeader/PageHeader';

import { load as loadDash, setErrorMode } from '../../store/actions/dash';
import {
  isDraft,
  getEntryTitle,
  canEdit,
  isEditMode,
  getWidgetEditorUUID,
} from '../../store/selectors/dash';
import { setWidgetEditorUUID, setWidgetForReloadUUID } from '../../store/actions/dash';

import { SDK } from '@kamatech-data-ui/clustrum';
import { Wizard } from '@clustrum-lib-legacy';
import SideSlidingPanel from '../../components/SideSlidingPanel/SideSlidingPanel';
import ExpandedFilter from '../ExpandedFilter/ExpandedFilter';

import { resetWizard } from '../../actions';
import { WizardSavingStatus } from './WizardSavingStatus';
import { exportWidget } from '../../services/dashboard/export/export-widget';

const sdk = new SDK({
  endpoints: window.DL.endpoints,
  currentCloudFolderId: window.DL.currentCloudFolderId,
  currentCloudId: window.DL.currentCloudId,
});

const WIDGET_EDITOR_WIDTH_MOD = '80';

class Dash extends React.PureComponent {
  static propTypes = {
    isDraft: PropTypes.bool.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    canEdit: PropTypes.bool.isRequired,
    title: PropTypes.string,
    widgetEditorUUID: PropTypes.string.isRequired,
    loadDash: PropTypes.func.isRequired,
    setErrorMode: PropTypes.func.isRequired,
    setWidgetEditorUUID: PropTypes.func.isRequired,
    setWidgetForReloadUUID: PropTypes.func.isRequired,
    defaultEntryId: PropTypes.string,
    isBuild: PropTypes.bool,
    hasRightSideContent: PropTypes.bool,
  };

  componentDidMount() {
    const { defaultEntryId, loadDash } = this.props;
    loadDash(defaultEntryId);
    window.addEventListener('beforeunload', this.unloadConfirmation);
  }

  componentDidCatch(error) {
    this.props.setErrorMode();
    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.unloadConfirmation);
  }

  unloadConfirmation = event => {
    const message = 'На странице есть несохраненные изменения. Вы уверены?';
    if (this.props.isEditMode && this.props.isDraft && this.props.canEdit) {
      (event || window.event).returnValue = message;
      return message;
    }
    return null;
  };

  _wizardSavingStatus = WizardSavingStatus.SAVED;

  _handleExport(id, name, options) {
    exportWidget({ id, name }, undefined, options);
  }

  _handleSavingStart = () => {
    this._wizardSavingStatus = WizardSavingStatus.SAVING;
  };

  _handleSavingEnd = (response, error) => {
    this._wizardSavingStatus = error
      ? WizardSavingStatus.ERROR
      : WizardSavingStatus.SAVED;

    this.closeWidgetEditor();
  };

  closeWidgetEditor = () => {
    const {
      setWidgetEditorUUID,
      setWidgetForReloadUUID,
      widgetEditorUUID,
      resetWizard,
    } = this.props;

    if (this._wizardSavingStatus === WizardSavingStatus.SAVING) {
      return;
    }

    if (this._wizardSavingStatus === WizardSavingStatus.SAVED) {
      setWidgetForReloadUUID(widgetEditorUUID);
    }

    setWidgetEditorUUID('');
    resetWizard();
  };

  render() {
    const { widgetEditorUUID, title, isBuild, hasRightSideContent } = this.props;

    return (
      <React.Fragment>
        <PageHead title={title} />
        <Header isBuild={isBuild} hasRightSideContent={hasRightSideContent} />
        <Body isBuild={isBuild} />
        <Dialogs />
        <SideSlidingPanel
          title="Режим редактирования элемента"
          isOpen={!!widgetEditorUUID}
          onCloseAction={this.closeWidgetEditor}
          styleMods={{ width: WIDGET_EDITOR_WIDTH_MOD }}
        >
          {widgetEditorUUID && (
            <Wizard
              sdk={sdk}
              entryId={widgetEditorUUID}
              onSavingStart={this._handleSavingStart}
              onSavingEnd={this._handleSavingEnd}
              onExport={this._handleExport}
            />
          )}
        </SideSlidingPanel>
        <ExpandedFilter />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isDraft: isDraft(state),
  isEditMode: isEditMode(state),
  canEdit: canEdit(state),
  title: getEntryTitle(state),
  widgetEditorUUID: getWidgetEditorUUID(state),
});

const mapDispatchToProps = {
  loadDash,
  setErrorMode,
  setWidgetEditorUUID,
  setWidgetForReloadUUID,
  resetWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dash);
