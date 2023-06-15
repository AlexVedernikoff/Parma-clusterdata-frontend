import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import Loader from '../Loader/Loader';
import { NOTIFICATIONS, ERROR_TEXT } from './locale/constants';
import {
  ERROR,
  MODE_FULL,
  MODE_MINIMAL,
  NAVIGATION_ROOT,
  ORDER,
  OWNERSHIP,
} from './constants';
import EntryContextMenu from './EntryContextMenu/EntryContextMenu';
import { normalizeDestination } from './util';
import iconFolder from '../../../../clustrum/src/icons/files-folder';
import iconDataset from '../../../../clustrum/src/icons/files-dataset.svg';
import iconDashboard from '../../../../clustrum/src/icons/files-dashboard.svg';
import iconWidget from '../../../../clustrum/src/icons/files-widget.svg';
import iconConnection from '../../../../clustrum/src/icons/files-misc.svg';
import iconFavoriteFilled from '../../assets/icons/favorite-filled.svg';
import iconFavoriteEmpty from '../../assets/icons/favorite-empty.svg';
import iconDots from '../../assets/icons/dots.svg';
import iconFolderInline from '../../assets/icons/folder-inline.svg';
import { KamatechTableView } from '@kamatech-ui';
import { ScopeType } from '@kamatech-ui/enums';
import { Header } from '../../../../../../src/entities/header';
import { Button, Dropdown, Input, Space } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { formatPath, navigationItems } from './utils/header-navigation-utils';

const b = cn('yc-navigation');

class NavigationEntries extends React.Component {
  static propTypes = {
    sdk: PropTypes.object,
    scope: PropTypes.string,
    path: PropTypes.string,
    place: PropTypes.string,
    mode: PropTypes.string,

    searchPlaceholder: PropTypes.string,
    clickableScope: PropTypes.string,
    inactiveEntryKey: PropTypes.string,
    currentPageEntry: PropTypes.object,
    checkEntryActivity: PropTypes.func,

    showHidden: PropTypes.bool,

    linkWrapper: PropTypes.func,
    onNotify: PropTypes.func,
    onEntryClick: PropTypes.func,
    onEntryParentClick: PropTypes.func,
    onChangeFavorite: PropTypes.func,

    getContextMenuItems: PropTypes.func,
    onContextMenuClick: PropTypes.func,
    focusSearchInput: PropTypes.func,
    clearSearchInput: PropTypes.func,

    userLogin: PropTypes.string,
    getPlaceParameters: PropTypes.func.isRequired,
    modalView: PropTypes.bool,
  };
  static defaultProps = {
    mode: MODE_FULL,
    place: NAVIGATION_ROOT,
    searchPlaceholder: 'Фильтр по имени',
    modalView: false,
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    const { sdk, scope, path, place } = nextProps;
    const needUpdate = !(
      sdk === prevState.sdk &&
      scope === prevState.scope &&
      path === prevState.path &&
      place === prevState.place
    );
    let { searchValue, hasNextPage, page, orderBy, ownership } = prevState;
    if (needUpdate) {
      searchValue = '';
      hasNextPage = false;
      page = null;
      orderBy = ORDER.DESC;
      ownership = OWNERSHIP.ALL;
    }
    return {
      sdk,
      scope,
      path,
      place,
      needUpdate,
      searchValue,
      hasNextPage,
      page,
      orderBy,
      ownership,
    };
  }
  state = {
    searchValue: '',
    hasNextPage: false,
    orderBy: ORDER.DESC,
    ownership: OWNERSHIP.ALL,
    page: null,
    entries: [],
    filteredEntries: [],
  };
  componentDidMount() {
    this._isMounted = true;
    this.getListDirectory();
  }
  componentDidUpdate() {
    if (this.state.needUpdate) {
      if (this.props.clearSearchInput) {
        this.props.clearSearchInput();
      }

      this.getListDirectory();
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  refSearchInput = React.createRef();
  getFilteredEntries(entries = [], searchValue) {
    const { showHidden } = this.props;
    return entries.filter(entry => {
      const showEntry = !entry.hidden || showHidden;
      return showEntry && entry.name.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  notify({ type, message = '' }) {
    if (this.props.onNotify) {
      this.props.onNotify({
        type,
        message,
        from: 'navigation',
      });
    }
  }
  refresh() {
    this.setState(
      {
        searchValue: '',
        hasNextPage: false,
        page: null,
        orderBy: ORDER.DESC,
        ownership: OWNERSHIP.ALL,
      },
      () => {
        this.getListDirectory();
      },
    );
  }
  onLoadMore = () => {
    this.getListDirectory();
  };
  changeFavorite(entryId, isFavorite) {
    const { entries: stateEntries } = this.state;
    const entryIndex = stateEntries.findIndex(entry => entry.entryId === entryId);
    if (entryIndex !== -1) {
      const entries = [
        ...stateEntries.slice(0, entryIndex),
        { ...stateEntries[entryIndex], isFavorite },
        ...stateEntries.slice(entryIndex + 1),
      ];
      const filteredEntries = this.getFilteredEntries(entries, this.state.searchValue);
      this.setState({ entries, filteredEntries });
    }
  }
  requestList() {
    const { sdk, scope, path = '', place, getPlaceParameters } = this.props;
    const { page: currentPage } = this.state;
    let page = currentPage;
    const placeParameters = getPlaceParameters(place);
    if (placeParameters.pagination) {
      page = currentPage === null ? 0 : currentPage + 1;
      this.setState({ page });
    }
    return sdk.getNavigationList({
      place,
      placeParameters,
      scope,
      path: normalizeDestination(path),
      orderBy: this.state.orderBy,
      createdBy:
        this.state.ownership === OWNERSHIP.ONLY_MINE ? this.props.userLogin : undefined,
      pageSize: placeParameters.pageSize || 100,
      page,
    });
  }
  async getListDirectory() {
    const { path, place, sdk } = this.props;
    this.setState({
      showError: false,
      loading: true,
    });

    try {
      const { hasNextPage, entries: requestEntries } = await this.requestList();
      const entries = this.state.hasNextPage
        ? [...this.state.entries, ...requestEntries]
        : requestEntries;
      const filteredEntries = this.getFilteredEntries(entries, this.state.searchValue);
      if (path === this.props.path && place === this.props.place && this._isMounted) {
        this.setState({
          loading: false,
          entries,
          filteredEntries,
          hasNextPage,
          place,
        });
      }
      if (this.refSearchInput.current) {
        this.refSearchInput.current.focus();
      }
      if (this.props.focusSearchInput) {
        this.props.focusSearchInput();
      }
    } catch (error) {
      if (sdk.isCancel(error)) {
        return;
      } else {
        console.error(error);
      }
      if (this._isMounted) {
        this.notify({ type: ERROR, message: NOTIFICATIONS.SOMETHING_WENT_WRONG });
        this.setState({
          loading: false,
          showError: true,
        });
      }
    }
  }
  onChangeFavorite = async entry => {
    const { sdk, path } = this.props;
    const { entryId, isFavorite } = entry;
    this.changeFavorite(entryId, !isFavorite);
    try {
      if (isFavorite) {
        await sdk.deleteFavorite({ entryId });
      } else {
        await sdk.addFavorite({ entryId });
      }
      if (this.props.onChangeFavorite) {
        this.props.onChangeFavorite({ entryId, isFavorite: !isFavorite });
      }
    } catch (error) {
      if (path === this.props.path) {
        // rollback
        this.changeFavorite(entryId, isFavorite);
        const message = isFavorite
          ? NOTIFICATIONS.FAILED_DELETE_FAVORITE
          : NOTIFICATIONS.FAILED_ADD_FAVORITE;
        this.notify({ type: ERROR, message });
      }
    }
  };
  onEntryContextClick = ({ entry, buttonRef }) => {
    const isVisible =
      !this.state.currentEntryContext ||
      this.state.currentEntryContext.entryId !== entry.entryId;

    this.setState({
      currentEntryContextButton: isVisible ? buttonRef : null,
      currentEntryContext: isVisible ? entry : null,
      visibleEntryContext: isVisible,
    });
  };
  onRetryClick = () => {
    this.refresh();
  };
  onCloseEntryContextMenu = event => {
    if (
      (this.state.currentEntryContextButton &&
        !this.state.currentEntryContextButton.contains(event.target)) ||
      (event instanceof KeyboardEvent && event.key === 'Escape')
    ) {
      this.closeEntryContextMenu();
    }
  };
  closeEntryContextMenu = () => {
    this.setState({
      currentEntryContextButton: null,
      currentEntryContext: null,
      visibleEntryContext: false,
    });
  };
  onChangeFilter = searchValue => {
    const filteredEntries = this.getFilteredEntries(this.state.entries, searchValue);
    this.setState({
      searchValue,
      filteredEntries,
    });
  };
  onChangeOrderBy = orderBy => {
    this.setState(
      {
        orderBy,
        hasNextPage: false,
        page: null,
      },
      () => {
        this.getListDirectory();
      },
    );
  };
  onChangeOwnership = e => {
    this.setState(
      {
        ownership: e.target.value,
        hasNextPage: false,
        page: null,
      },
      this.getListDirectory,
    );
  };

  getEntryIconData = scope => {
    switch (scope) {
      case ScopeType.connection:
        return iconConnection;
      case ScopeType.dash:
        return iconDashboard;
      case ScopeType.widget:
        return iconWidget;
      case ScopeType.folder:
        return iconFolder;
      case ScopeType.dataset:
        return iconDataset;
    }
  };

  renderError() {
    return (
      <div className={b('error')}>
        <div className={b('error-message')}>{ERROR_TEXT.CANT_LOAD_NAVIGATION}</div>
        <Button
          theme="action"
          view="default"
          tone="default"
          size="l"
          onClick={this.onRetryClick}
        >
          {ERROR_TEXT.RETRY}
        </Button>
      </div>
    );
  }
  renderEntriesHeader() {
    const { mode, onCreateMenuClick, createMenuItems, modalView } = this.props;
    const { place, path } = this.state;
    const { filters } = this.props.getPlaceParameters(place);
    const isMinimalMode = mode === MODE_MINIMAL;

    if (!filters && isMinimalMode) {
      return null;
    }

    const handleChange = event => {
      this.onChangeFilter(event.target.value);
    };
    const createItemMenu = createMenuItems?.map(({ text, value, index }) => {
      return {
        label: <a onClick={() => onCreateMenuClick(value)}>{text}</a>,
        key: index,
      };
    });

    const inputSearch = (
      <Input
        className="ant-d-input-search"
        placeholder="Найти"
        prefix={<SearchOutlined />}
        onChange={handleChange}
        ref={this.refSearchInput}
        value={this.state.searchValue}
      />
    );

    const createButton = (
      <Dropdown menu={{ items: createItemMenu }} trigger={['click']}>
        <Button type="primary">
          <Space>
            Создать
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    );

    return (
      <div className={b('entries-header')}>
        {modalView ? (
          <Header
            leftSideContent={inputSearch}
            rightSideContent={createButton}
            path={navigationItems(place, path)}
          />
        ) : (
          <Header
            rightSideContent={
              <>
                {inputSearch}
                {createButton}
              </>
            }
            path={navigationItems(place, path)}
            title={formatPath(path === '' ? place : path)}
          />
        )}
        <div className={b('custom')}>{this.props.children}</div>
      </div>
    );
  }
  renderLoader() {
    return (
      <div className={b('spinner')}>
        <Loader size="l" />
      </div>
    );
  }
  renderContextMenu() {
    return (
      this.state.currentEntryContextButton && (
        <EntryContextMenu
          visible={true}
          entry={this.state.currentEntryContext}
          anchor={this.state.currentEntryContextButton}
          items={this.props.getContextMenuItems({
            entry: this.state.currentEntryContext,
          })}
          onMenuClick={this.props.onContextMenuClick}
          onClose={this.onCloseEntryContextMenu}
        />
      )
    );
  }
  renderView() {
    const { place, entries, filteredEntries, currentEntryContext } = this.state;

    const filteredEntriesEmpty = filteredEntries.length === 0;
    const entriesEmpty = entries.length === 0;
    const showEmpty = filteredEntriesEmpty || entriesEmpty;
    const emptyText = entriesEmpty ? 'Пустая папка' : 'Ничего не найдено';

    if (showEmpty) {
      return <div className={b('empty-entries')}>{emptyText}</div>;
    }

    const { displayParentFolder } = this.props.getPlaceParameters(place);

    return (
      <React.Fragment>
        <div className={b('table-view')}>
          <KamatechTableView
            linkWrapper={this.props.linkWrapper}
            mode={this.props.mode}
            clickableScope={this.props.clickableScope}
            currentPageEntry={this.props.currentPageEntry}
            entries={filteredEntries}
            currentEntryContext={currentEntryContext}
            displayParentFolder={displayParentFolder}
            onChangeFavorite={this.onChangeFavorite}
            onEntryContextClick={this.onEntryContextClick}
            onCloseEntryContextMenu={this.closeEntryContextMenu}
            onEntryParentClick={this.props.onEntryParentClick}
            onEntryClick={this.props.onEntryClick}
            iconEntry={this.getEntryIconData}
            iconFavoriteFilled={iconFavoriteFilled}
            iconFavoriteEmpty={iconFavoriteEmpty}
            iconDots={iconDots}
            iconFolderInline={iconFolderInline}
            rowHeight={40}
          />
        </div>
      </React.Fragment>
    );
  }
  render() {
    const { loading, showError, hasNextPage } = this.state;
    if (showError) {
      return this.renderError();
    }

    return (
      <div className={b('entries')}>
        {this.renderEntriesHeader()}
        <div className={b('view')}>
          {loading && !hasNextPage ? this.renderLoader() : this.renderView()}
          {this.renderContextMenu()}
        </div>
      </div>
    );
  }
}

export default NavigationEntries;
