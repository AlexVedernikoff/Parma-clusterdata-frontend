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
import { getLayoutId } from '../../utils/helpers';
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
    isBuild: PropTypes.bool,
    onFiltersChange: PropTypes.func,
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
  sendedFilters = [];

  isNewFilterValue = filter => {
    const sendedFilter = this.sendedFilters.find(item => item.id === filter.id);
    // фильтр ещё никогда не отправлялся
    if (!sendedFilter) {
      this.sendedFilters.push(filter);
      return true;
    }
    // фильтр ранее отправлялся, но с другим значением
    if (sendedFilter.value.toString() !== filter.value.toString()) {
      sendedFilter.value = filter.value;
      return true;
    }
    return false;
  };

  isInitiallyEmpty = filter => {
    // фильтр, который изначально пустой (ещё до первой отправки)
    const isEmpty = !filter.value || filter.value.length === 0;
    const isSended = this.sendedFilters.some(item => item.id === filter.id);
    return isEmpty && !isSended;
  };

  handleFiltersChange = data => {
    const { config, itemsStateAndParams } = data;
    const { onFiltersChange } = this.props;

    if (!onFiltersChange) {
      return;
    }

    // данные приходят в странном виде - несколько одинаковых секций
    // нас устроит любая из них, поэтому берём первую из config-а
    const id = config.items[0].id;
    const filtersData = itemsStateAndParams[id].params;
    const rawFilters = Object.keys(filtersData).map(key => ({
      id: key,
      value: filtersData[key].value,
      datasetId: filtersData[key].initiatorItem.data.dataset?.id,
    }));

    const newFilters = rawFilters
      .filter(item => !this.isInitiallyEmpty(item))
      .filter(item => this.isNewFilterValue(item));
    onFiltersChange(newFilters);
  };

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
      this.handleFiltersChange(data);
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

  widgetMenu = createWidgetMenu(widgetEditorUUID =>
    this.props.setWidgetEditorUUID(widgetEditorUUID),
  );

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
      isBuild,
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
          <Tabs isBuild={isBuild} />
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
