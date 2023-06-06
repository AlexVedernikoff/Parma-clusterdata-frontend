// TODO: Код не используется и должен быть удалён после того, как новый вариант компонента
// будет принят окончательно. Сейчас этот код оставлен в качестве базы знаний о прошлом

import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getCurrentPageTabs } from '../../store/selectors/dash';
import { setPageTab } from '../../store/actions/dash';
import TabsDropdown from './TabsDropdown/TabsDropdown';
import TabLink from './TabLink/TabLink';

const b = block('dash-tabs');

function tabsReducer(state, action) {
  const { visibleTabs, hiddenTabs } = state;
  switch (action.type) {
    case 'increaseTabs':
      return {
        ...state,
        visibleTabs: [...visibleTabs, hiddenTabs[0]],
        hiddenTabs: [...hiddenTabs].slice(1),
      };
    case 'decreaseTabs':
      return {
        ...state,
        visibleTabs: visibleTabs.slice(0, -1),
        hiddenTabs: [visibleTabs[visibleTabs.length - 1], ...hiddenTabs],
      };
    case 'setOldTabsWrapWidth':
      return {
        ...state,
        oldTabsWrapWidth: action.payload,
      };
    default:
      throw new Error('tabs state reducer error: do not have action');
  }
}

function Tabs(props) {
  if (window.DL.hideTabs) {
    return null;
  }

  const targetRef = useRef();

  const [tabMargin, setTabMargin] = useState(0);
  const popupBtnWidth = 30;
  const delta = 5;

  const [state, dispatch] = useReducer(tabsReducer, {
    visibleTabs: props.tabs,
    hiddenTabs: [],
    oldTabsWrapWidth: null,
  });

  const getVisibleTabElems = () => [
    ...targetRef.current.querySelectorAll('.dash-tab-link'),
  ];

  const hideShowTabsElements = () => {
    if (!targetRef.current) {
      return;
    }
    const { visibleTabs, hiddenTabs, oldTabsWrapWidth } = state;
    const tabsWrapWidth = targetRef.current.offsetWidth;
    const visibleTabElems = getVisibleTabElems();
    const getVisibleTabsWidth = () =>
      visibleTabElems.reduce((acc, cur) => acc + cur.offsetWidth + tabMargin, 0) +
      popupBtnWidth +
      delta;
    const getVisibleTabsWidthWithFirstHidden = () =>
      [...visibleTabs, hiddenTabs[0]].reduce((acc, cur) => {
        return acc + cur.htmlWidth + tabMargin;
      }, 0) +
      popupBtnWidth +
      delta;
    const isMultiLine = getVisibleTabsWidth() > tabsWrapWidth;

    if (isMultiLine) {
      while (
        (oldTabsWrapWidth ? tabsWrapWidth < oldTabsWrapWidth : true) &&
        tabsWrapWidth < getVisibleTabsWidth()
      ) {
        dispatch({ type: 'decreaseTabs' });
        visibleTabElems.pop();
      }
    }

    if (
      hiddenTabs.length &&
      tabsWrapWidth > oldTabsWrapWidth &&
      tabsWrapWidth > getVisibleTabsWidthWithFirstHidden()
    ) {
      dispatch({ type: 'increaseTabs' });
    }

    dispatch({ type: 'setOldTabsWrapWidth', payload: tabsWrapWidth });
  };

  const getMarginSum = () => {
    const tabStyles = window.getComputedStyle(
      targetRef.current.querySelector('.dash-tab-link'),
    );
    const getNumb = string => Number(string.match(/\d/g).join(''));
    let marginLeft = getNumb(tabStyles.marginLeft);
    let marginRight = getNumb(tabStyles.marginRight);
    return marginLeft + marginRight;
  };

  useLayoutEffect(() => {
    setTabMargin(getMarginSum());
    const tabElems = getVisibleTabElems();
    props.tabs.forEach((tab, index) => (tab.htmlWidth = tabElems[index].offsetWidth));
  }, []);

  useLayoutEffect(() => {
    hideShowTabsElements();
  }, [tabMargin, state.visibleTabs, state.hiddenTabs, state.oldTabsWrapWidth]);

  useEffect(() => {
    window.addEventListener('resize', hideShowTabsElements);
    return () => {
      window.removeEventListener('resize', hideShowTabsElements);
    };
  }, [tabMargin, state.visibleTabs, state.hiddenTabs, state.oldTabsWrapWidth]);

  return (
    <div className={b()} ref={targetRef}>
      {state.visibleTabs.map(({ title, id }) => (
        <TabLink {...props} key={id} title={title} id={id} />
      ))}
      {state.hiddenTabs.length > 0 && (
        <TabsDropdown {...props} menuItems={state.hiddenTabs} />
      )}
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  tabId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  setPageTab: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tabs: getCurrentPageTabs(state),
  tabId: state.dash.tabId,
});

const mapDispatchToProps = {
  setPageTab,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Tabs);
