import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

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
  getCurrentPage,
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
    onFiltersChange: PropTypes.func,
    onTabChange: PropTypes.func,
    // router
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidCatch() {
    this.props.setErrorMode();
  }

  componentDidUpdate(prevProps) {
    const { onTabChange } = this.props;

    const isTabDataChanged =
      JSON.stringify(prevProps.tabData) !== JSON.stringify(this.props.tabData);
    if (isTabDataChanged && onTabChange) {
      const { id } = this.props.tabData;
      onTabChange(id);
    }

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

  getAllFilters = () => {
    const { getCurrentPage } = this.props;
    const filters = getCurrentPage.tabs
      .flatMap(tab => tab.items)
      .filter(item => item.type === 'control');
    return filters;
  };

  needSyncFilters = (filter1, filter2) => {
    // Это один и тот же фильтр
    if (filter1.id === filter2.id) {
      return false;
    }

    // Разные датасеты и/или поля
    if (filter1.data.dataset.fieldId !== filter2.data.dataset.fieldId) {
      return false;
    }

    // Разные типы контролов (input, select, datepicker)
    if (filter1.data.control.elementType !== filter2.data.control.elementType) {
      return false;
    }

    // Разные значения свойства "мультиселект" у селектов
    if (
      filter1.data.control.elementType === 'select' &&
      filter1.data.control.multiselectable !== filter2.data.control.multiselectable
    ) {
      return false;
    }

    // Разные значения свойства "диапазон" у датапикера
    if (
      filter1.data.control.elementType === 'datepicker' &&
      filter1.data.control.isRange !== filter2.data.control.isRange
    ) {
      return false;
    }

    // Разные значения по умолчанию
    if (!isEqual(filter1.defaults, filter2.defaults)) {
      return false;
    }

    // Разные доступные значения
    if (!isEqual(filter1.availableItems, filter2.availableItems)) {
      return false;
    }

    return true;
  };

  updateFilterValue(hashState, filter, value) {
    if (filter.id in hashState) {
      hashState[filter.id].params[filter.data.dataset.fieldId].value = value;
      return;
    }

    hashState[filter.id] = {
      params: {
        [filter.data.dataset.fieldId]: {
          initiatorItem: filter,
          value,
        },
      },
    };
  }

  syncFilters = (changedFilters, hashState) => {
    const allFilters = this.getAllFilters();
    for (const changedFilter of changedFilters) {
      const changedFilterFull = allFilters.find(
        filter => filter.id === changedFilter.controlId,
      );
      for (const filter of allFilters) {
        if (this.needSyncFilters(filter, changedFilterFull)) {
          this.updateFilterValue(hashState, filter, changedFilter.value);
        }
      }
    }
    setHashState(hashState);
  };

  handleFiltersChange = data => {
    const { config, itemsStateAndParams } = data;
    const { onFiltersChange, settings } = this.props;

    const actualParams = Object.values(itemsStateAndParams).filter(value =>
      Boolean(value.params),
    );

    // данные приходят в странном виде - несколько секций с отличающимся наполнением
    // нас устроит любая из них с типом 'control', поэтому берём первую
    // обязательно из config-а, т.к. в `itemsStateAndParams` могут быть секции из других табов
    const controls = config.items.filter(item => item.type === 'control');

    if (!actualParams.length || !controls.length) {
      return;
    }

    const id = controls[0].id;
    const filtersData = itemsStateAndParams[id].params;
    const rawFilters = Object.keys(filtersData).map(key => ({
      id: key,
      value: filtersData[key].value,
      datasetId: filtersData[key].initiatorItem.data.dataset?.id,
      controlId: filtersData[key].initiatorItem.id,
    }));

    const filtersParams = rawFilters.reduce(
      (params, filter) => ((params[filter.id] = filter.value), params),
      {},
    );

    const newFilters = rawFilters
      .filter(item => !this.isInitiallyEmpty(item))
      .filter(item => this.isNewFilterValue(item));

    if (newFilters.length) {
      if (onFiltersChange) {
        onFiltersChange(newFilters, filtersParams);
      }
      if (settings.needSyncFilters) {
        this.syncFilters(newFilters, itemsStateAndParams);
      }
    }
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
  getCurrentPage: getCurrentPage(state),
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
