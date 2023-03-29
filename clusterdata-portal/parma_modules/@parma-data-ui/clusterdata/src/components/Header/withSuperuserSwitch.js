import React from 'react';
import PropTypes from 'prop-types';

import { ENABLE, DISABLE, COOKIE_TOGGLE_SWITCH_MODE_NAME } from '../../constants/common';
import Utils from '../../utils';
import { I18n } from '../../utils/i18n';

const i18n = I18n.keyset('clusterdata.header.view');
const NEXT_SWITCH_MODE_MAP = {
  [ENABLE]: DISABLE,
  [DISABLE]: ENABLE,
};

function getCurrentSuperuserSwitchMode({ cookieSuperuserSwitchModeName }) {
  return Utils.getCookie(cookieSuperuserSwitchModeName) || DISABLE;
}

function getToggleThemeMenuItem() {
  const cookieSuperuserSwitchModeName = COOKIE_TOGGLE_SWITCH_MODE_NAME;

  const labelEnableSuperuserMode = i18n('switch_superuser-mode-enable');
  const labelDisableSuperuserMode = i18n('switch_superuser-mode-disable');

  const LABEL_TOGGLE_BUTTON = {
    [ENABLE]: labelDisableSuperuserMode,
    [DISABLE]: labelEnableSuperuserMode,
  };

  const currentSwitchMode = getCurrentSuperuserSwitchMode({
    cookieSuperuserSwitchModeName,
  });

  return {
    text: LABEL_TOGGLE_BUTTON[currentSwitchMode],
    onClick: e => {
      const currentSwitchMode = getCurrentSuperuserSwitchMode({
        cookieSuperuserSwitchModeName,
      });
      const nextSwitchMode = NEXT_SWITCH_MODE_MAP[currentSwitchMode];

      e.currentTarget.innerText = LABEL_TOGGLE_BUTTON[nextSwitchMode];

      Utils.setCookie({
        name: cookieSuperuserSwitchModeName,
        value: nextSwitchMode,
      });

      window.location.reload();
    },
  };
}

const withSuperuserSwitch = Component => {
  function WithSuperuserSwitch(props) {
    const { actionsMenu } = props;
    let actionsMenuNext = actionsMenu;
    const { DL: { displaySuperuserSwitch } = {} } = window;

    if (displaySuperuserSwitch) {
      const toggleSuperuserSwitchModeMenuItem = getToggleThemeMenuItem();

      actionsMenuNext = [toggleSuperuserSwitchModeMenuItem, ...(actionsMenuNext || [])];
    } else {
      Utils.deleteCookie({ name: COOKIE_TOGGLE_SWITCH_MODE_NAME });
    }

    return <Component {...props} actionsMenu={actionsMenuNext} />;
  }

  WithSuperuserSwitch.propTypes = {
    displaySuperuserSwitch: PropTypes.bool,
    actionsMenu: PropTypes.array,
  };

  return WithSuperuserSwitch;
};

export default withSuperuserSwitch;
