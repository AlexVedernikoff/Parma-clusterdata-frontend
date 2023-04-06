import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import CloudFolderSelect from '@kamatech-data-ui/common/src/components/CloudFolderSelect/CloudFolderSelect';
import noop from 'lodash/noop';
import Utils from '../../../utils';
// import './CloudFolderSelect.scss';
import { I18n } from '../../../utils/i18n';
const i18n = I18n.keyset('component.cloud-folder-select.status');

const CURRENT_FOLDER_COOKIE_NAME = 'dl_current_cloud_folder_id';
const STORE_KEY = 'dl_current_cloud';
const b = block('dl-cloud-folder-select');

const STATUS = {
  INIT: 'init',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAIL: 'fail',
  NOT_FOUND_AVAILABLE_FOLDERS: 'not-found-available-folders',
};

class CloudFolderSelectClusterData extends React.PureComponent {
  static propTypes = {
    sdk: PropTypes.object,
    onNotify: PropTypes.func,
  };

  static defaultProps = {
    onNotify: noop,
  };

  state = {
    cloudTree: [],
    cloudTreeLoading: true,
  };

  componentDidMount() {
    this.getCurrentCloud();
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  getCurrentCloud() {
    const { currentCloudFolderId } = window.DL;
    const cachedCloud = Utils.restore(STORE_KEY);
    if (currentCloudFolderId && cachedCloud && cachedCloud.folders[0].id === currentCloudFolderId) {
      this.setState({
        status: STATUS.INIT,
        cloudTree: [cachedCloud],
        cloudId: cachedCloud.name, // name вместо id, чтобы при ошибке с загрузкой показывать name, а не id
        folderId: cachedCloud.folders[0].name, // аналогично выше строчкой
      });
    } else {
      this.setState({
        cloudId: i18n('label_loading'),
      });
      this.getAvailableCloudFolders();
    }
  }

  async getAvailableCloudFolders() {
    try {
      this.setState({
        status: STATUS.LOADING,
        cloudTreeLoading: true,
      });
      const { currentCloudFolderId } = window.DL;
      const availableCloudFolders = await this.props.sdk.getAvailableCloudFolders();
      if (this._isUnmounted) {
        return;
      }
      if (availableCloudFolders.length === 0) {
        this.setState(
          {
            status: STATUS.NOT_FOUND_AVAILABLE_FOLDERS,
            cloudTreeLoading: false,
          },
          () => {
            this.props.onNotify('empty');
          },
        );
        return;
      }
      const cloud = this.findCloudByFolderId(availableCloudFolders, currentCloudFolderId);
      const folderId = this.state.folderId || currentCloudFolderId;
      const cloudId = cloud ? cloud.id : this.state.cloudId;
      this.setState(
        {
          status: STATUS.SUCCESS,
          cloudTree: availableCloudFolders,
          cloudId: folderId ? cloudId : i18n('label_placeholder-none'),
          folderId,
          cloudTreeLoading: false,
        },
        () => {
          if (cloud) {
            this.storeCloud(currentCloudFolderId);
          }
        },
      );
    } catch (error) {
      if (this._isUnmounted) {
        return;
      }
      this.setState({
        status: STATUS.FAIL,
        cloudTree: [],
        cloudTreeLoading: false,
        cloudId: i18n('label_error'),
      });
    }
  }

  findCloudByFolderId(cloudTree, folderId) {
    return cloudTree.find(({ folders = {} }) => folders.some(({ id }) => id === folderId));
  }

  storeCloud(folderId = this.state.folderId) {
    const { cloudTree } = this.state;
    const cloud = this.findCloudByFolderId(cloudTree, folderId);
    if (!cloud) {
      return;
    }
    const cachedCloud = {
      ...cloud,
      folders: cloud.folders.filter(({ id }) => id === folderId),
    };
    Utils.store(STORE_KEY, cachedCloud);
  }

  handleClick = (cloudId, folderId) => {
    if (folderId !== this.state.folderId) {
      this.storeCloud(folderId);
      Utils.setCookie({
        name: CURRENT_FOLDER_COOKIE_NAME,
        value: folderId,
      });
      window.setTimeout(() => {
        window.location.assign('/');
      }, 50);
    }
    this.setState({ cloudId, folderId });
  };

  handleOpen = () => {
    switch (this.state.status) {
      case STATUS.INIT:
      case STATUS.FAIL:
        this.getAvailableCloudFolders();
    }
  };

  render() {
    if (!this.state.status) {
      return null;
    }
    if (this.state.status === STATUS.NOT_FOUND_AVAILABLE_FOLDERS) {
      return <div className={b('error-not-active-folders')}>{i18n('label_not-active-folders')}</div>;
    }
    return (
      <CloudFolderSelect
        cloudTree={this.state.cloudTree}
        currentCloudId={this.state.cloudId}
        cloudTreeLoading={this.state.cloudTreeLoading}
        currentFolderId={this.state.folderId}
        handleFolderClick={this.handleClick}
        handleCloudClick={noop}
        onOpen={this.handleOpen}
        textEmptyListMessage={
          this.state.cloudTree.length === 0 ? i18n('label_not-active-folders') : i18n('label_not-found')
        }
      />
    );
  }
}

export default CloudFolderSelectClusterData;
