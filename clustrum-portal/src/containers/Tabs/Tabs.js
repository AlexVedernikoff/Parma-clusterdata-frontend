import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Tabs as AntdTabs, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { DIALOG_TYPE } from '../../modules/constants/constants';
import { getCurrentPageTabs, isEditMode } from '../../store/selectors/dash';
import { setPageTab, openDialog } from '../../store/actions/dash';

import './tabs.css';

function Tabs({ isEditMode, tabs, setPageTab, openDialog }) {
  const antdTabs = tabs.map(({ id, title }) => ({ key: id, label: title }));
  return (
    <div class="tabs-wrapper">
      <AntdTabs
        type="card"
        items={antdTabs}
        onChange={setPageTab}
        tabBarExtraContent={
          isEditMode ? (
            <Button
              icon={<SettingOutlined />}
              key="add-dashboard-tabs-button"
              onClick={() => openDialog(DIALOG_TYPE.TABS)}
            >
              Настроить отображение вкладок
            </Button>
          ) : null
        }
      />
    </div>
  );
}

Tabs.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  tabs: PropTypes.array.isRequired,
  tabId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  setPageTab: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isEditMode: isEditMode(state),
  tabs: getCurrentPageTabs(state),
  tabId: state.dash.tabId,
});

const mapDispatchToProps = {
  setPageTab,
  openDialog,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Tabs);
