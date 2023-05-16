import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button } from 'lego-on-react';
import { Icon } from '@kamatech-data-ui/common/src';

import ButtonIcon from '../ButtonIcon/ButtonIcon';
import DropdownNavigation from '../../containers/DropdownNavigation/DropdownNavigation';
import InputLink from './InputLink/InputLink';

import { ENTRY_SCOPE, ENTRY_TYPE } from '../../constants/constants';

import iconLink from '@kamatech-data-ui/clustrum/src/icons/link.svg';

// import './NavigationInput.scss';

const b = block('navigation-input');

class NavigationInput extends React.PureComponent {
  static propTypes = {
    entryId: PropTypes.string,
    size: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    includeClickableType: PropTypes.oneOf(Object.values(ENTRY_TYPE)),
    excludeClickableType: PropTypes.oneOf(Object.values(ENTRY_TYPE)),
  };

  static defaultProps = {
    size: 'n',
    className: '',
  };

  static getDerivedStateFromProps({ entryId }, { prevEntryId }) {
    return entryId === prevEntryId
      ? null
      : {
          prevEntryId: entryId,
          showInput: false,
        };
  }

  state = {};

  onChange = ({ entry, params }) => {
    const { entryId, key } = entry;
    this.props.onChange({ entryId, name: Utils.getEntryNameFromKey(key), params });
  };

  render() {
    const { entryId, size, className } = this.props;
    const { showInput } = this.state;

    if (showInput) {
      return (
        <div className={b(false, className)}>
          <InputLink
            size={size}
            onApply={({ entry, params }) => {
              this.onChange({ entry, params });
              this.setState({ showInput: false });
            }}
            onCancel={() => this.setState({ showInput: false })}
          />
        </div>
      );
    }

    return (
      <div className={b({ navigation: !showInput }, className)}>
        <DropdownNavigation
          size={size}
          entryId={entryId}
          clickableScope={ENTRY_SCOPE.WIDGET}
          onClick={this.onChange}
          includeClickableType={this.props.includeClickableType}
          excludeClickableType={this.props.excludeClickableType}
        />
        <Button
          theme="flat"
          view="default"
          tone="default"
          size={size}
          onClick={() => this.setState({ showInput: !showInput })}
        >
          <ButtonIcon>
            <Icon data={iconLink} width="16" />
          </ButtonIcon>
          Указать ссылку
        </Button>
      </div>
    );
  }
}

export default NavigationInput;
