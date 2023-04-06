import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  closeExpandedFilter,
  openItemDialog,
  resetAllFilters,
  setCurrentTabData,
  setHashState,
  toggleWidgetVisibility,
} from '../../store/actions/dash';
import { Button } from 'lego-on-react';
import { i18n } from '@kamatech-data-ui/clusterdata';
import DashKit from '../../components/DashKit/DashKit';
import { getCurrentTab, getHashState } from '../../store/selectors/dash';
import SideSlidingPanel from '../../components/SideSlidingPanel/SideSlidingPanel';
import block from 'bem-cn-lite';
import { MODE } from '../../modules/constants/constants';
import { LAYOUT_ID } from '../../constants/constants';
import cloneDeep from 'lodash-es/cloneDeep';
import { getLayoutId } from '../../utils/helpers';

const b = block('expanded-filter');

function ExpandedFilter({
  isExpandedFilterOpen = false,
  closeExpandedFilter,
  tabData,
  setCurrentTabData,
  setHashState,
  openItemDialog,
  hashState,
  mode,
  toggleWidgetVisibilityAction,
}) {
  const clearExpandedFilter = () => {
    const isItemsFiltered = Object.keys(hashState).length > 0;

    if (!isItemsFiltered) {
      return;
    }

    resetSidebarFilters();
  };

  const resetSidebarFilters = () => {
    if (tabData[LAYOUT_ID.SIDEBAR].length === 0) return;

    const hashStateCopy = cloneDeep(hashState);

    // формируем массив id лэйаутов расширенного фильтра
    const sidebarLayoutIds = tabData[LAYOUT_ID.SIDEBAR].map(layout => layout.i);

    // находим items, относящиеся к расширенному фильтру
    // и формируем массив fieldId элементов расширенного фильтра
    const sidebarItemsFieldIds = sidebarLayoutIds
      .map(layoutId => tabData.items.find(item => item.id === layoutId))
      .map(item => item.data.dataset.fieldId);

    // проходимся по всему hashState
    // и удаляем объекты,
    // относящиеся к фильтрам бокового меню
    for (let key in hashStateCopy) {
      sidebarItemsFieldIds.forEach(fieldId => {
        if (fieldId in hashStateCopy[key].params) {
          delete hashStateCopy[key].params[fieldId];
        }
      });
    }

    // сеттим hashState
    setHashState(hashStateCopy);
  };

  const onChange = data => {
    const { config, itemsStateAndParams } = data;
    if (config) {
      setCurrentTabData(config);
    }
    if (hashState !== itemsStateAndParams && itemsStateAndParams && Object.keys(itemsStateAndParams).length) {
      setHashState(itemsStateAndParams);
    }
  };

  const toggleWidgetVisibility = itemId => {
    const layoutId = getLayoutId(itemId, tabData);

    toggleWidgetVisibilityAction(itemId, layoutId);
  };

  const footerContent = (
    <Button
      cls={b('clear-filters')}
      theme="normal"
      view="default"
      tone="default"
      size="n"
      onClick={clearExpandedFilter}
    >
      {i18n('dash.expanded-filter.view', 'button_clear')}
    </Button>
  );

  return (
    <SideSlidingPanel
      isOpen={isExpandedFilterOpen}
      title={'Фильтры'}
      footerContent={footerContent}
      onCloseAction={closeExpandedFilter}
    >
      <div className={b()}>
        {tabData && (
          <DashKit
            config={tabData}
            settings={{}}
            itemsStateAndParams={hashState}
            onChange={onChange}
            onItemEdit={openItemDialog}
            onToggleWidgetVisibility={toggleWidgetVisibility}
            layoutId={LAYOUT_ID.SIDEBAR}
            editMode={mode === MODE.EDIT}
          />
        )}
      </div>
    </SideSlidingPanel>
  );
}

ExpandedFilter.propTypes = {
  isExpandedFilterOpen: PropTypes.bool.isRequired,
  closeExpandedFilter: PropTypes.func.isRequired,
  tabData: PropTypes.object,
  sidebarTabData: PropTypes.object,
};

const mapStateToProps = state => ({
  tabData: getCurrentTab(state),
  isExpandedFilterOpen: state.dash.isExpandedFilterOpen,
  hashState: getHashState(state),
  mode: state.dash.mode,
});

const mapDispatchToProps = {
  closeExpandedFilter,
  setCurrentTabData,
  setHashState,
  resetAllFilters,
  openItemDialog,
  toggleWidgetVisibilityAction: toggleWidgetVisibility,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedFilter);
