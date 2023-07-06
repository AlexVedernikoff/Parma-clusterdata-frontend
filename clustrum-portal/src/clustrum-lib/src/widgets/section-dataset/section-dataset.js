import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Dropdown, Popup, Menu } from 'lego-on-react';
import { createStructuredSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { NavigationMinimal } from '@kamatech-data-ui/clustrum';
import { Loader } from '@kamatech-data-ui/common/src';
import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';
import { DownOutlined } from '@ant-design/icons';
import iconDataset from 'icons/dataset.svg';

import {
  fetchDataset,
  toggleNavigation,
  applyTextFilter,
  setSearchPhrase,
  toggleFullscreen,
  updateDatasetByValidation,
} from '../../../../actions';
import {
  selectIsNavigationVisible,
  selectFilteredDimensions,
  selectFilteredMeasures,
  selectDefaultPath,
  selectSearchPhrase,
} from '../../../../reducers/settings';
import {
  selectDataset,
  selectUpdates,
  selectMeasures,
  selectDimensions,
  selectIsDatasetLoading,
  selectIsDatasetLoaded,
  selectDatasetError,
  selectFields,
  selectAceModeUrl,
} from '../../../../reducers/dataset';
import { SectionDatasetItem, SectionDatasetError, Sections } from './ui';

class SectionDataset extends Component {
  static propTypes = {
    sdk: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isFieldEditorVisible: false,
      editingField: null,
    };

    this.onChangeSearchInputField = this.onChangeSearchInputField.bind(this);
    this.openFieldEditor = this.openFieldEditor.bind(this);
    this.onButtonDatasetTryAgainClick = this.onButtonDatasetTryAgainClick.bind(this);
    this.onButtonDatasetRequestRightsClick = this.onButtonDatasetRequestRightsClick.bind(
      this,
    );
    this.onNavigationClose = this.onNavigationClose.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  setNavigationButtonRef = ref => {
    this.setState({
      navigationButtonRef: ref,
    });
  };

  onNavigationClick = data => {
    const { fetchDataset, toggleNavigation, sdk } = this.props;

    fetchDataset({
      datasetId: data.entryId,
      sdk,
    });

    toggleNavigation();
  };

  onOpenDatasetClick = () => {
    const { dataset } = this.props;

    window.open(`${DL.endpoints.dataset}/${dataset.id}`);
  };

  onButtonDatasetTryAgainClick = () => {
    const { fetchDataset, dataset, sdk } = this.props;

    fetchDataset({
      datasetId: dataset.id,
      sdk,
    });
  };

  onButtonDatasetRequestRightsClick = () => {
    const { dataset, entryDialoguesRef } = this.props;

    entryDialoguesRef.current.openDialog({
      dialog: 'unlock',
      dialogProps: {
        entry: {
          ...dataset,
          entryId: dataset.id,
        },
      },
    });
  };

  onNavigationClose = event => {
    const { toggleNavigation } = this.props;

    if (
      (this.state.navigationButtonRef &&
        !this.state.navigationButtonRef.contains(event.target)) ||
      (event instanceof KeyboardEvent && event.code === 'Escape')
    ) {
      toggleNavigation();
    }
  };

  openFieldEditor = () => {
    this.setState({
      isFieldEditorVisible: true,
      editingField: this.state.editingField,
    });
  };

  onChangeSearchInputField(field) {
    const { applyTextFilter, setSearchPhrase, measures, dimensions } = this.props;

    return value => {
      this.setState(
        {
          [field]: value,
        },
        () => {
          if (this.timeoutAfterInputSearchText) {
            clearTimeout(this.timeoutAfterInputSearchText);
          }

          const searchPhrase = value.toLowerCase();

          setSearchPhrase({
            searchPhrase,
          });

          this.timeoutAfterInputSearchText = setTimeout(() => {
            applyTextFilter({
              searchPhrase,
              measures,
              dimensions,
            });
          }, 300);
        },
      );
    };
  }

  renderDatasetItem = props => {
    return (
      <SectionDatasetItem
        {...props}
        sdk={this.props.sdk}
        dataset={this.props.dataset}
        updates={this.props.updates}
        setState={this.setState}
        updateDatasetByValidation={this.props.updateDatasetByValidation}
      />
    );
  };

  renderSectionsOrBlank = () => {
    const { isDatasetLoading, isDatasetLoaded, datasetError } = this.props;

    if (isDatasetLoading) {
      return <Loader size={'l'} />;
    }

    if (datasetError) {
      return (
        <SectionDatasetError
          datasetError={datasetError}
          onButtonDatasetRequestRightsClick={this.onButtonDatasetRequestRightsClick}
          onButtonDatasetTryAgainClick={this.onButtonDatasetTryAgainClick}
        />
      );
    }

    return isDatasetLoaded ? (
      <Sections
        {...this.props}
        onChangeSearchInputField={this.onChangeSearchInputField}
        onButtonAddParamClick={this.openFieldEditor}
        renderDatasetItem={this.renderDatasetItem}
      />
    ) : (
      <div className="dataset-blank">Для начала работы выберите набор данных</div>
    );
  };

  render() {
    const {
      sdk,
      dataset,
      isNavigationVisible,
      toggleNavigation,
      defaultPath,
    } = this.props;

    return (
      <div className="container datasets-container">
        <div className="actions-container datasets-actions-container">
          <div className="icon">
            <Icon data={iconDataset} width="24" />
          </div>
          <div className="dataset-custom-button" ref={this.setNavigationButtonRef}>
            <Button
              cls="select-dataset-btn"
              theme="cancel"
              view="default"
              tone="default"
              size="m"
              onClick={toggleNavigation}
            >
              {dataset.realName || 'Выберите набор данных'}
            </Button>
            {dataset.realName ? (
              <Dropdown
                cls="dataset-more-btn"
                view="default"
                tone="default"
                theme="flat"
                size="n"
                switcher={
                  <Button size="s" theme="light" type="default" view="default">
                    <DownOutlined width="24" height="24" />
                  </Button>
                }
                popup={
                  <Popup hasTail hiding autoclosable onOutsideClick={() => {}}>
                    <Menu
                      theme="normal"
                      view="default"
                      tone="default"
                      size="s"
                      type="navigation"
                    >
                      <Menu.Item
                        type="option"
                        val="access"
                        onClick={this.onOpenDatasetClick}
                      >
                        Перейти к датасету
                      </Menu.Item>
                    </Menu>
                  </Popup>
                }
                hasTail
              />
            ) : null}
          </div>
          {defaultPath ? (
            <NavigationMinimal
              anchor={this.state.navigationButtonRef}
              scope="dataset"
              sdk={sdk}
              hasTail={true}
              onClose={this.onNavigationClose}
              onEntryClick={this.onNavigationClick}
              visible={isNavigationVisible}
              popupDirections={['right-bottom', 'bottom-left']}
              configMenuEditEntry={null}
              startFrom={defaultPath}
            />
          ) : null}
        </div>
        {this.renderSectionsOrBlank()}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isDatasetLoading: selectIsDatasetLoading,
  isDatasetLoaded: selectIsDatasetLoaded,
  isNavigationVisible: selectIsNavigationVisible,
  filteredDimensions: selectFilteredDimensions,
  filteredMeasures: selectFilteredMeasures,
  fields: selectFields,
  dataset: selectDataset,
  updates: selectUpdates,
  datasetError: selectDatasetError,
  measures: selectMeasures,
  dimensions: selectDimensions,
  defaultPath: selectDefaultPath,
  searchPhrase: selectSearchPhrase,
  aceModeUrl: selectAceModeUrl,
});

const mapDispatchToProps = {
  fetchDataset,
  toggleNavigation,
  applyTextFilter,
  setSearchPhrase,
  toggleFullscreen,
  updateDatasetByValidation,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionDataset);
