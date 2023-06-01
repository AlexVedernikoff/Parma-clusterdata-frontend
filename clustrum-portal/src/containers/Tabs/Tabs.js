import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getCurrentPageTabs } from '../../store/selectors/dash';
import { setPageTab } from '../../store/actions/dash';
import { Tabs as AntdTabs } from 'antd';

function Tabs({ tabs, setPageTab }) {
  const antdTabs = tabs.map(({ id, title }) => ({ key: id, label: title }));
  return <AntdTabs items={antdTabs} onChange={setPageTab} />;
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
