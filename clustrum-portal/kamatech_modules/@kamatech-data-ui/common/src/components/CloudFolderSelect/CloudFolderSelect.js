import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { TextInput, Popup } from 'lego-on-react';

import ScrollableListWithSticky from '../ScrollableListWithSticky/ScrollableListWithSticky';
import Icon from '../Icon/Icon';
import FolderIcon from './FolderIcon/FolderIcon';
import RoundIcon from './RoundIcon/RoundIcon';
import ArrowToggle from './ArrowToggle/ArrowToggle';
import iconCloud from '../../assets/icons/cloud.svg';
import iconLoupe from '../../assets/icons/loupe.svg';
import Loader from '../Loader/Loader';
import memoize from 'lodash/memoize';

// import './CloudFolderSelect.scss';

const b = block('yc-cloud-folder-select');

class CloudFolderSelect extends React.Component {
  static propTypes = {
    cloudTree: PropTypes.array,
    cloudTreeLoading: PropTypes.bool,
    currentCloudId: PropTypes.string.isRequired,
    currentFolderId: PropTypes.string,
    handleCloudClick: PropTypes.func.isRequired,
    handleFolderClick: PropTypes.func.isRequired,
    onOpen: PropTypes.func,
    textFilterQueryPlaceholder: PropTypes.string,
    textEmptyListMessage: PropTypes.string,
  };

  static defaultProps = {
    cloudTree: [],
  };

  state = {
    currentFolderId: this.props.currentFolderId,
    popupVisible: false,
    filterQuery: '',
  };

  static getDerivedStateFromProps(props, state) {
    if (state.currentFolderId !== props.currentFolderId) {
      return {
        currentFolderId: props.currentFolderId,
        filterQuery: '',
      };
    }
    return {};
  }

  componentDidUpdate(prevProps, prevState) {
    const popupDomElem = this.popupRef.current.containerRef.current;
    const isOpenPopup =
      this.state.popupVisible && prevState.popupVisible !== this.state.popupVisible && popupDomElem !== null;

    if (isOpenPopup) {
      popupDomElem.removeEventListener('animationend', this.onPopupAnimationEnd);
      popupDomElem.addEventListener('animationend', this.onPopupAnimationEnd, { once: true });
    }

    requestAnimationFrame(this.updatePopupLayout);
  }

  containerRef = React.createRef();

  popupRef = React.createRef();

  textInputRef = React.createRef();

  onPopupAnimationEnd = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
    }
  };
  prepareCloudList = memoize(cloudTree => {
    const areCloudsInactive = !this.props.handleCloudClick;

    return cloudTree.reduce((list, cloud) => {
      const cloudItem = {
        type: 'cloud',
        name: cloud.name || cloud.id,
        search: String(cloud.name || cloud.id || '').toLowerCase(),
        cloudId: cloud.id,
        sticky: true,
        inactive: areCloudsInactive,
      };
      return [
        ...list,
        cloudItem,
        ...cloud.folders.map(folder => ({
          type: 'folder',
          name: folder.name || folder.id,
          search: String(folder.name || folder.id || '').toLowerCase(),
          cloudId: folder.cloudId,
          folderId: folder.id,
          stickyItem: cloudItem,
        })),
      ];
    }, []);
  });

  get preparedCloudList() {
    return this.prepareCloudList(this.props.cloudTree);
  }

  get currentIndex() {
    const { currentCloudId } = this.props;
    const { currentFolderId } = this.state;
    return this.preparedCloudList.findIndex(
      ({ cloudId, folderId }) => cloudId === currentCloudId && folderId === currentFolderId,
    );
  }

  get filteredCloudTree() {
    const list = this.preparedCloudList;
    const { filterQuery } = this.state;
    if (!filterQuery) {
      return list;
    }

    const filter = filterQuery.toLowerCase();
    const matchedClouds = new Set();
    const matchedFolderClouds = new Set();
    list.forEach(item => {
      if (item.search.includes(filter)) {
        if (item.type === 'cloud') {
          matchedClouds.add(item.cloudId);
        } else {
          matchedFolderClouds.add(item.cloudId);
        }
      }
    });

    return list.filter(
      item =>
        matchedClouds.has(item.cloudId) ||
        (item.type === 'cloud' && matchedFolderClouds.has(item.cloudId)) ||
        item.search.includes(filter),
    );
  }

  get currentCloudItem() {
    return this.preparedCloudList.find(({ cloudId }) => cloudId === this.props.currentCloudId) || {};
  }

  get currentFolderItem() {
    const { currentCloudId } = this.props;
    const { currentFolderId } = this.state;

    if (currentCloudId === undefined || currentFolderId === undefined) {
      return undefined;
    }

    return (
      this.preparedCloudList.find(
        ({ cloudId, folderId }) => cloudId === currentCloudId && folderId === currentFolderId,
      ) || {}
    );
  }

  getActiveIndex = () => {
    if (this.state.filterQuery === '') {
      return this.currentIndex;
    } else {
      return 0;
    }
  };

  setPopupVisible = visible => this.setState({ popupVisible: visible });

  togglePopup = () => {
    this.setPopupVisible(!this.state.popupVisible);
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  };

  closePopup = () => this.setPopupVisible(false);

  updatePopupLayout = () => {
    if (this.popupRef.current) {
      this.popupRef.current.forceUpdate();
    }
  };

  handleFilterQueryChange = filterQuery => this.setState({ filterQuery });

  handleListItemClick = ({ type, cloudId, folderId }) => {
    switch (type) {
      case 'cloud': {
        this.props.handleCloudClick(cloudId, folderId);
        break;
      }
      case 'folder': {
        this.props.handleFolderClick(cloudId, folderId);
        break;
      }
      default: {
        console.error(`Unknown type: ${type}`);
      }
    }
    this.closePopup();
  };

  isCurrentFolder = ({ type, folderId }) => type === 'folder' && folderId === this.state.currentFolderId;

  isCurrentCloud = ({ type, cloudId }) =>
    !this.state.currentFolderId && type === 'cloud' && cloudId === this.props.currentCloudId;

  renderIcon = ({ type, name }, size = 16) => {
    const className = b(`${type}-icon`);
    switch (type) {
      case 'cloud': {
        return (
          <RoundIcon className={className}>
            <Icon data={iconCloud} width={size} height={size} />
          </RoundIcon>
        );
      }
      case 'folder': {
        return (
          <div className={className}>
            <FolderIcon title={name} />
          </div>
        );
      }
    }
    return null;
  };

  renderCurrentCloudFolder = () => {
    const { currentCloudId: cloudId } = this.props;
    const { currentFolderId: folderId } = this.state;
    const { name: cloudName } = this.currentCloudItem;
    const { name: folderName } = this.currentFolderItem || {};
    const item = {
      cloudId,
      folderId,
      folderName: folderName || folderId,
      cloudName: cloudName || cloudId,
    };

    return (
      <React.Fragment>
        {item.folderId === undefined ? (
          this.renderIcon({ type: 'cloud' })
        ) : (
          <div className={b('complex-icon')}>
            {this.renderIcon({ type: 'folder', name: item.folderName })}
            {this.renderIcon({ type: 'cloud' }, 8)}
          </div>
        )}
        <div>
          {item.folderName !== undefined && <div>{item.folderName}</div>}
          <div className={b('current-cloud-name', { root: !item.folderName })}>{item.cloudName}</div>
        </div>
      </React.Fragment>
    );
  };

  renderItem = item => (
    <div
      className={b('popup-item', {
        current: this.isCurrentFolder(item) || this.isCurrentCloud(item),
        type: item.type,
      })}
    >
      {this.renderIcon(item)}
      <div className={b('popup-name', { type: item.type })}>{item.name}</div>
    </div>
  );

  renderList() {
    const data = this.filteredCloudTree;
    if (!this.state.popupVisible) {
      return false;
    }
    return data.length === 0 ? (
      <div className={b('popup-empty')}>
        <div className={b('popup-empty-icon')}>
          <Icon data={iconLoupe} width={34} height={34} />
        </div>
        <span className={b('popup-empty-text')}>{this.props.textEmptyListMessage}</span>
      </div>
    ) : (
      <ScrollableListWithSticky
        data={data}
        itemHeight={40}
        renderItem={this.renderItem}
        onItemClick={this.handleListItemClick}
        visible={this.state.popupVisible}
        currentIndex={this.getActiveIndex(data)}
      />
    );
  }

  renderContent() {
    const { cloudTreeLoading } = this.props;
    if (cloudTreeLoading) {
      return (
        <div className={b('loader')}>
          <Loader size="m" />
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className={b('popup-filter')}>
          <TextInput
            placeholder={this.props.textFilterQueryPlaceholder}
            view="default"
            tone="default"
            theme="normal"
            size="s"
            hasClear
            text={this.state.filterQuery}
            type="text"
            onChange={this.handleFilterQueryChange}
            ref={this.textInputRef}
          />
        </div>
        {this.renderList()}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className={b()} ref={this.containerRef}>
        <div className={b('current')} onClick={this.togglePopup}>
          {this.renderCurrentCloudFolder()}
          <ArrowToggle
            key="folders-select-arrow"
            direction={this.state.popupVisible ? 'top' : 'bottom'}
            className={b('arrow')}
          />
        </div>
        <Popup
          key="cloud-folder-select-popup"
          theme="normal"
          visible={this.state.popupVisible}
          anchor={this.containerRef.current}
          directions={['bottom-left', 'bottom-right', 'top-left', 'top-right']}
          onClose={this.closePopup}
          autoclosable
          ref={this.popupRef}
        >
          <div className={b('popup')}>{this.renderContent()}</div>
        </Popup>
      </div>
    );
  }
}

export default CloudFolderSelect;
