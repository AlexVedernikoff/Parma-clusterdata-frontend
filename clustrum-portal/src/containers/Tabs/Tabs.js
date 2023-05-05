import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getCurrentPageTabs } from '../../store/selectors/dash';
import { setPageTab } from '../../store/actions/dash';
import { Tabs as AntdTabs } from 'antd';

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
  const [state, dispatch] = useReducer(tabsReducer, {
    visibleTabs: props.tabs,
    hiddenTabs: [],
    oldTabsWrapWidth: null,
  });

  const tabs = state?.visibleTabs?.map(({ id, title }) => ({ key: id, label: title }));

  return <AntdTabs items={tabs} onChange={props.setPageTab} />;
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
