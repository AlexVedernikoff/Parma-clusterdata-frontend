import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import Error from '../Error/Error';
import TableOfContent from '../TableOfContent/TableOfContent';
import Tabs from '../Tabs/Tabs';
import DashKit from '../../components/DashKit/DashKit';
import createWidgetMenu from './utils/createWidgetMenu';
import { MODE } from '../../modules/constants/constants';
import {
  getEntryId,
  getCurrentTab,
  getSettings,
  getWidgetForReloadUUID,
  getHashState,
} from '../../store/selectors/dash';
import {
  openItemDialog,
  setCurrentTabData,
  setHashState,
  setMode,
  setErrorMode,
  setDashKitRef,
  setWidgetEditorUUID,
  setWidgetForReloadUUID,
  toggleWidgetVisibility,
} from '../../store/actions/dash';
import { LAYOUT_ID } from '../../constants/constants';
import { getLayoutId } from '../../clustrum-lib/src/utils/helpers';
import { exportWidget } from './model/exportWidget';

const b = block('dash-body');

class Body extends React.PureComponent {
  static propTypes = {
    entryId: PropTypes.string,
    mode: PropTypes.string.isRequired,
    showTableOfContent: PropTypes.bool.isRequired,
    tabData: PropTypes.object,
    settings: PropTypes.object,
    hashState: PropTypes.object,
    dashKitRef: PropTypes.object,
    setMode: PropTypes.func.isRequired,
    setErrorMode: PropTypes.func.isRequired,
    setCurrentTabData: PropTypes.func.isRequired,
    openItemDialog: PropTypes.func.isRequired,
    setHashState: PropTypes.func.isRequired,
    setDashKitRef: PropTypes.func.isRequired,
    setWidgetEditorUUID: PropTypes.func.isRequired,
    widgetForReloadUUID: PropTypes.string.isRequired,
    setWidgetForReloadUUID: PropTypes.func.isRequired,
    toggleWidgetVisibility: PropTypes.func.isRequired,
    // router
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidCatch() {
    this.props.setErrorMode();
  }

  componentDidUpdate() {
    if (this.dashKitRef !== this.props.dashKitRef) {
      this.props.setDashKitRef(this.dashKitRef);
    }
  }

  dashKitRef = React.createRef();

  onChange = data => {
    const { config, itemsStateAndParams } = data;
    if (config) {
      this.props.setCurrentTabData(config);
    }
    if (
      this.props.hashState !== itemsStateAndParams &&
      itemsStateAndParams &&
      Object.keys(itemsStateAndParams).length
    ) {
      this.onStateChange(itemsStateAndParams);
    }
  };

  onStateChange = hashState => {
    this.props.setHashState(hashState);
  };

  #exportWidget = (id, name, tabItemIds, options) => {
    const { tabData } = this.props;

    exportWidget(id, name, tabData.title, tabItemIds, options);
  };

  toggleWidgetVisibility = itemId => {
    const layoutId = getLayoutId(itemId, this.props.tabData);

    this.props.toggleWidgetVisibility(itemId, layoutId);
  };

  widgetMenu = createWidgetMenu(widgetEditorUUID => this.props.setWidgetEditorUUID(widgetEditorUUID));

  renderBody() {
    const {
      mode,
      showTableOfContent,
      tabData,
      hashState,
      openItemDialog,
      settings,
      widgetForReloadUUID,
      setWidgetForReloadUUID,
    } = this.props;

    switch (mode) {
      case MODE.LOADING:
        return <Loader size="l" />;
      case MODE.UPDATING:
        return <Loader size="l" />;
      case MODE.ERROR:
        return <Error />;
    }

    return (
      <React.Fragment>
        <TableOfContent />
        <div className={b('content', { 'table-of-content': showTableOfContent })}>
          <Tabs />
          <DashKit
            config={tabData}
            editMode={mode === MODE.EDIT}
            itemsStateAndParams={hashState}
            onItemEdit={openItemDialog}
            onChange={this.onChange}
            widgetMenu={this.widgetMenu}
            widgetForReloadUUID={widgetForReloadUUID}
            setWidgetForReloadUUID={setWidgetForReloadUUID}
            onToggleWidgetVisibility={this.toggleWidgetVisibility}
            settings={settings}
            ref={this.dashKitRef}
            layoutId={LAYOUT_ID.DASHBOARD}
            exportWidget={this.#exportWidget}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    return <div className={b()}>{this.renderBody()}</div>;
  }
}

const mapStateToProps = state => ({
  entryId: getEntryId(state),
  mode: state.dash.mode,
  showTableOfContent: state.dash.showTableOfContent,
  hashState: getHashState(state),
  settings: getSettings(state),
  tabData: getCurrentTab(state),
  dashKitRef: state.dash.dashKitRef,
  widgetForReloadUUID: getWidgetForReloadUUID(state),
});

const mapDispatchToProps = {
  setMode,
  setErrorMode,
  setCurrentTabData,
  openItemDialog,
  setHashState,
  setDashKitRef,
  setWidgetEditorUUID,
  setWidgetForReloadUUID,
  toggleWidgetVisibility,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Body);
