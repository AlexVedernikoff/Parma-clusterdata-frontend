import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button } from 'lego-on-react';

import Icon from '@parma-data-ui/common/src/components/Icon/Icon';
import NavigationModal from 'components/Navigation/NavigationModal';
import Utils from 'utils';
import ActionPanelHelpers from '../../ActionPanelHelpers';
import EntryContextMenu from '../../../EntryContextMenu/EntryContextMenu';

// import './EntryPanel.scss';

import iconBrowse from 'icons/browse.svg';
import iconConnected from 'icons/connected.svg';
import iconMore from 'icons/more.svg';
import iconShare from 'icons/share.svg';
import iconStarActive from 'icons/star-active.svg';
import iconStarInactive from 'icons/star-inactive.svg';

import { I18n } from 'utils/i18n';
const i18n = I18n.keyset('component.action-panel.view');

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
    const { sdk, onCopyLinkBtn, onShareBtn, additionalEntryItems } = this.props;
    const { entry: { entryId, key, description, isFavorite } = {}, entry, isNavigationVisible } = this.state;

    const entryName = ActionPanelHelpers.getNameByKey({ key });

    let disabled = false;
    if (entry.fake) {
      disabled = true;
    }

    return (
      <div className={b()}>
        <div className={b('entry-title')}>
          <span data-id={entryId} className={b('entry-title-text')}>
            {entryName}
          </span>
          <span className={b('entry-title-description')}>{description}</span>
        </div>
        <div className={b('entry-actions')}>
          <Button
            disabled={disabled}
            cls={b('action-btn')}
            theme="flat"
            size="n"
            view="default"
            tone="default"
            title={isFavorite ? i18n('button_remove-favorite') : i18n('button_add-favorite')}
            icon={
              isFavorite ? (
                <Icon data={iconStarActive} width="22" height="22" />
              ) : (
                <Icon data={iconStarInactive} width="22" height="22" />
              )
            }
            onClick={this.toggleFavorite}
          />
          <Button
            disabled={disabled}
            cls={b('action-btn', b('more-dropdown'))}
            size="n"
            theme="flat"
            type="default"
            view="default"
            tone="default"
            onClick={this.toggleEntryContextMenu}
            icon={<Icon className={b('more')} data={iconMore} width="22" height="22" />}
            innerRef={this.setInnerRefBtnEntryContextMenu}
          />
          <EntryContextMenu
            onClose={this.onCloseEntryContextMenu}
            anchor={this.btnEntryContextMenuRef}
            visible={this.state.visibleEntryContextMenu}
            entry={entry}
            sdk={sdk}
          />
          <Button
            cls={b('action-btn')}
            theme="flat"
            size="n"
            view="default"
            tone="default"
            title={i18n('button_open-navigation')}
            onClick={this.openNavigation}
          >
            <Icon data={iconBrowse} width="22" height="22" />
          </Button>
          {onCopyLinkBtn && (
            <Button disabled={disabled} cls={b('action-btn')} theme="flat" size="n" view="default" tone="default">
              <Icon data={iconConnected} width="22" height="22" />
            </Button>
          )}
          {onShareBtn && (
            <Button disabled={disabled} cls={b('action-btn')} theme="flat" size="n" view="default" tone="default">
              <Icon data={iconShare} width="22" height="22" />
            </Button>
          )}
          {additionalEntryItems.length ? additionalEntryItems.map(EntryItem => EntryItem) : null}
        </div>
        <NavigationModal
          sdk={sdk}
          startFrom={this.defaultPath}
          onCreateAction={this.onCreateAction}
          highlightEntry={entry}
          onClose={this.onCloseNavigation}
          visible={isNavigationVisible}
          currentPageEntry={entry}
        />
      </div>
    );
  }
}

export default EntryPanel;
