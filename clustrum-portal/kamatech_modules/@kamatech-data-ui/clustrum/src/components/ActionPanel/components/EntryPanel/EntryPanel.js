import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button } from 'antd';

import NavigationModal from 'components/Navigation/NavigationModal';
import Utils from 'utils';
import ActionPanelHelpers from '../../ActionPanelHelpers';
import EntryContextMenu from '../../../EntryContextMenu/EntryContextMenu';
import { Header } from '../../../../../../../../src/entities/header/ui/header';
import { FolderOutlined, MoreOutlined, StarTwoTone } from '@ant-design/icons';
import {
  formatPath,
  navigationItems,
} from '../../../../../../common/src/components/Navigation/adapters/header-navigation-adapter';

const b = block('dl-entry-panel');

class EntryPanel extends React.Component {
  static defaultProps = {
    additionalEntryItems: [],
  };

  static propTypes = {
    additionalEntryItems: PropTypes.array,
    entry: PropTypes.shape({
      entryId: PropTypes.string,
      entryName: PropTypes.string,
      key: PropTypes.string,
    }),
    sdk: PropTypes.object,
    onCopyLinkBtn: PropTypes.func,
    onShareBtn: PropTypes.func,
    onCreateAction: PropTypes.func,
    onCloseNavigation: PropTypes.func,
    rightItems: PropTypes.array,
  };

  state = {
    visibleEntryContextMenu: false,
    isNavigationVisible: false,
    entry: null,
  };

  static getDerivedStateFromProps(props, state) {
    const { entry: entryState } = state;
    const { entry: entryProps } = props;

    if (entryState) {
      if (entryProps && (entryState.entryId !== entryProps.entryId || entryState.key !== entryProps.key)) {
        return {
          entry: {
            ...entryProps,
          },
        };
      }

      if (!entryState.fake) {
        return null;
      }
    }

    return {
      entry: {
        ...entryProps,
      },
    };
  }

  toggleFavorite = () => {
    const { sdk } = this.props;
    const { entry: { entryId, isFavorite } = {} } = this.state;

    try {
      if (isFavorite) {
        sdk.deleteFavorite({ entryId });
      } else {
        sdk.addFavorite({ entryId });
      }

      this.setState({
        entry: {
          ...this.state.entry,
          isFavorite: !isFavorite,
        },
      });
    } catch (error) {
      this.setState({
        error,
      });
    }
  };

  get defaultPath() {
    return Utils.getPathBefore({ path: this.state.entry.key });
  }

  onCreateAction = data => {
    const { onCreateAction } = this.props;

    onCreateAction(data);
  };

  onCloseNavigation = () => {
    this.setState({
      isNavigationVisible: false,
    });
  };

  openNavigation = () => {
    this.setState({
      isNavigationVisible: true,
    });
  };

  setInnerRefBtnEntryContextMenu = ref => {
    this.btnEntryContextMenuRef = ref;
  };

  onCloseEntryContextMenu = () => this.setState({ visibleEntryContextMenu: false });

  toggleEntryContextMenu = () => this.setState({ visibleEntryContextMenu: !this.state.visibleEntryContextMenu });

  render() {
    const { sdk, additionalEntryItems } = this.props;
    const { entry: { key, isFavorite } = {}, entry, isNavigationVisible } = this.state;

    const entryName = ActionPanelHelpers.getNameByKey({ key });

    let disabled = false;
    if (entry.fake) {
      disabled = true;
    }

    const standardBtn = [
      <Button
        disabled={disabled}
        title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        icon={isFavorite ? <StarTwoTone twoToneColor="#FFD700" /> : <StarTwoTone />}
        onClick={this.toggleFavorite}
      ></Button>,
      <Button
        disabled={disabled}
        onClick={this.toggleEntryContextMenu}
        icon={<MoreOutlined style={{ color: '#1890ff' }} />}
        ref={this.setInnerRefBtnEntryContextMenu}
      />,
      <EntryContextMenu
        onClose={this.onCloseEntryContextMenu}
        anchor={this.btnEntryContextMenuRef}
        visible={this.state.visibleEntryContextMenu}
        entry={entry}
        sdk={sdk}
      />,
      <Button
        title="Открыть навигацию"
        icon={<FolderOutlined style={{ color: '#1890ff' }} />}
        onClick={this.openNavigation}
      />,
      <NavigationModal
        sdk={sdk}
        startFrom={this.defaultPath}
        onCreateAction={this.onCreateAction}
        highlightEntry={entry}
        onClose={this.onCloseNavigation}
        visible={isNavigationVisible}
        currentPageEntry={entry}
      />,
    ];
    const actionBtn = [...standardBtn, additionalEntryItems];

    return (
      <div className={b()}>
        <Header
          leftSideContent={actionBtn}
          rightSideContent={this.props.rightItems}
          path={navigationItems(entry.scope, entry.key)}
          title={formatPath(entry.key === '' ? entry.scope : entry.key)}
        />
      </div>
    );
  }
}

export default EntryPanel;
