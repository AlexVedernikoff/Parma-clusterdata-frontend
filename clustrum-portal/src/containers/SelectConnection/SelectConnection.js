import React, { useState, useRef } from 'react';
import { Button, Popup } from 'lego-on-react';
import { I18n, NavigationMinimal } from '@kamatech-data-ui/clustrum';

import { PLACE, QUICK_ITEMS } from '@kamatech-data-ui/clustrum/src/components/Navigation/constants';
import PropTypes from 'prop-types';

const i18n = I18n.keyset('dataset.dataset-creation.create');
const POPUP_DIRECTIONS = Popup.defaultProps.directions;

function SelectConnection(props) {
  const { sdk, connectionId } = props;
  const [isNavVisible, setNavVisibility] = useState(false);
  const connectionBtnRef = useRef(React.createRef());

  function onEntryClick(entry) {
    const { onEntryClick } = props;

    onEntryClick(entry, () => setNavVisibility(false));
  }

  return (
    <React.Fragment>
      <Button
        ref={connectionBtnRef}
        theme="normal"
        size="s"
        view="default"
        tone="default"
        text={connectionId ? i18n('button_change-connection') : i18n('button_select-connection')}
        onClick={() => setNavVisibility(!isNavVisible)}
      />
      <NavigationMinimal
        sdk={sdk}
        anchor={connectionBtnRef.current && connectionBtnRef.current.control}
        visible={isNavVisible}
        onClose={() => setNavVisibility(false)}
        onEntryClick={onEntryClick}
        popupDirections={POPUP_DIRECTIONS}
        clickableScope="connection"
        startFrom={'connections'}
        placeSelectParameters={{
          items: [PLACE.ORIGIN_ROOT, PLACE.FAVORITES, PLACE.CONNECTIONS],
          quickItems: [QUICK_ITEMS.USER_FOLDER],
        }}
        hasTail
        showHidden
      />
    </React.Fragment>
  );
}

SelectConnection.propTypes = {
  sdk: PropTypes.object.isRequired,
  onEntryClick: PropTypes.func.isRequired,
  connectionId: PropTypes.string,
};

export default SelectConnection;
