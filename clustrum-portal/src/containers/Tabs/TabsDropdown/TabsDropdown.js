import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button, Popup, Menu } from 'lego-on-react';
import TabLink from '../TabLink/TabLink';

const b = block('dash-tabs-dropdown');

const theme = '';

function TabsDropdown({ menuItems, location, tabId, setPageTab }) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  let buttonEl = useRef(null);
  return (
    <div className={b()}>
      <Button ref={buttonEl} theme={theme} cls={b('toogle-btn')} onClick={() => setIsPopupVisible(true)}>
        <div className={b('toogle-btn-dots')}></div>
      </Button>
      {isPopupVisible && (
        <Popup
          theme={theme}
          autoclosable
          directions={['bottom-right', 'bottom-center']}
          visible={isPopupVisible}
          anchor={buttonEl.current}
          onOutsideClick={() => setIsPopupVisible(false)}
        >
          <Menu theme={theme} cls={b('menu')}>
            {menuItems.map(({ title, id }) => (
              <TabLink
                key={id}
                title={title}
                id={id}
                location={location}
                tabId={tabId}
                setPageTab={setPageTab}
                isMenuItem
              />
            ))}
          </Menu>
        </Popup>
      )}
    </div>
  );
}

TabsDropdown.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      id: PropTypes.id,
    }),
  ).isRequired,
  tabId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  setPageTab: PropTypes.func.isRequired,
};

export default TabsDropdown;
