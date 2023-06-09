import PropTypes from 'prop-types';

import uuid from 'uuid/v1';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Dropdown, Popup, Menu } from 'lego-on-react';

import { NavigationMinimal } from '@kamatech-data-ui/clustrum';

import FieldEditor from '@kamatech-data-ui/clustrum/src/components/FieldEditor/FieldEditor';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';

import {
  FontSizeOutlined,
  EllipsisOutlined,
  HolderOutlined,
  CalendarOutlined,
  NumberOutlined,
  DownOutlined,
} from '@ant-design/icons';
import iconCastBoolean from 'icons/cast-boolean.svg';
import iconCastGeo from 'icons/cast-geo.svg';
import iconDataset from 'icons/dataset.svg';
import iconPlus from 'icons/plus.svg';

import {
  fetchDataset,
  toggleNavigation,
  applyTextFilter,
  setSearchPhrase,
  toggleFullscreen,
  updateDatasetByValidation,
} from '../../../../../actions';

import { DATASET_ERRORS, ITEM_TYPES } from '../../../../../constants';

import { DndContainer } from '../../../shared/ui/drag-n-drop/dnd-container';
import SearchInput from '../components/SearchInput/SearchInput';

import { Loader } from '@kamatech-data-ui/common/src';

import {
  selectIsNavigationVisible,
  selectFilteredDimensions,
  selectFilteredMeasures,
  selectDefaultPath,
  selectSearchPhrase,
} from '../../../../../reducers/settings';

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
} from '../../../../../reducers/dataset';

import { createStructuredSelector } from 'reselect';

import isEqual from 'lodash/isEqual';

import { CalcModes } from '@kamatech-data-ui/clustrum';

// import './SectionDataset.scss';

function addIgnoreDrag(element) {
  element.className += ' ignore-drag';
}

function removeIgnoreDrag(element) {
  element.className = element.className.replace(' ignore-drag', '');
}

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

  onButtonAddParamClick = () => {
    this.openFieldEditor();
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

  closeFieldEditor = () => {
    this.setState({
      isFieldEditorVisible: false,
      editingField: null,
    });
  };

  modifyField = ({ result_schema: resultSchema, field }) => {
    const { updateDatasetByValidation, sdk } = this.props;

    updateDatasetByValidation({
      fields: resultSchema,
      updates: [
        {
          action: 'update',
          field,
        },
      ],
      sdk,
    });

    this.closeFieldEditor();
  };

  removeField = ({ field }) => {
    const {
      updateDatasetByValidation,
      sdk,
      dataset: { result_schema: resultSchema },
    } = this.props;

    updateDatasetByValidation({
      fields: resultSchema,
      updates: [
        {
          action: 'delete',
          field,
        },
      ],
      sdk,
    });
  };

  onClickEditDatasetItem = item => {
    if (!item.local) return;

    this.setState({
      isFieldEditorVisible: true,
      editingField: item,
    });
  };

  onClickDuplicateDatasetItem = item => {
    const { updateDatasetByValidation, sdk, dataset, updates } = this.props;

    const { result_schema: resultSchema } = dataset;

    const guid = uuid();

    let { calc_mode: calcMode, title } = item;

    const fieldNext = {
      ...item,
      guid,
    };

    if (calcMode === CalcModes.Formula) {
      delete fieldNext.cast;
    }

    resultSchema.concat(updates).forEach(row => {
      let { title: currentTitle } = row;

      if (typeof currentTitle === 'undefined') {
        currentTitle = row.field.title;
      }

      if (title === currentTitle) {
        const match = title.match(/\((\d+)\)$/);

        if (match) {
          const i = Number(match[1]);

          title = title.replace(/\((\d+)\)$/, `(${i + 1})`);
        } else {
          title = `${title} (1)`;
        }
      }
    });

    fieldNext.title = title;

    updateDatasetByValidation({
      fields: [...resultSchema],
      updates: [
        {
          action: 'add',
          field: fieldNext,
        },
      ],
      sdk,
    });
  };

  onClickRemoveDatasetItem = item => {
    if (!item.local) return;

    this.removeField({ field: item });
  };

  createField = ({ result_schema: resultSchema, field }) => {
    const { updateDatasetByValidation, sdk } = this.props;

    const { guid, calc_mode: calcMode } = field;

    const fieldNext = {
      ...field,
    };

    if (calcMode === CalcModes.Formula) {
      delete fieldNext.cast;
    }

    const fieldsNext = resultSchema.map(row => {
      const { guid: guidCurrent } = row;

      if (guidCurrent === guid) {
        delete row.cast;
      }

      return row;
    });

    updateDatasetByValidation({
      fields: fieldsNext,
      updates: [
        {
          action: 'add',
          field: fieldNext,
        },
      ],
      sdk,
    });

    this.closeFieldEditor();
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
    const { item, className, isDragging } = props;

    let resultClassName = '';

    resultClassName += className || '';
    resultClassName += item.className ? ` ${item.className}` : '';
    resultClassName += isDragging ? ' is-dragging' : '';
    resultClassName += item.local ? ' local-item' : '';

    let castIconData;
    switch (item.cast) {
      case 'integer':
      case 'uinteger':
      case 'float':
      case 'double':
      case 'long':
        castIconData = <NumberOutlined width="16" />;
        break;

      case 'datetime':
      case 'date':
        castIconData = <CalendarOutlined width="16" />;
        break;

      case 'geo':
        castIconData = iconCastGeo;
        break;

      case 'boolean':
        castIconData = iconCastBoolean;
        break;

      case 'string':
      default:
        castIconData = <FontSizeOutlined width="16" />;
    }

    return (
      <div className={resultClassName} title={item.title}>
        <HolderOutlined className="item-holder" />

        {/* Не нашел подходящих иконок, поэтому пришлось оставить так */}
        {!!castIconData.type ? (
          <div className="item-icon">{castIconData}</div>
        ) : (
          <Icon className="item-icon" data={castIconData} width="16" />
        )}

        <div className="item-title" title={item.title}>
          {item.title}
        </div>
        <div
          className="item-right-icon item-more-icon"
          onMouseEnter={e => {
            addIgnoreDrag(e.currentTarget.parentElement);
          }}
          onMouseLeave={e => {
            removeIgnoreDrag(e.currentTarget.parentElement);
          }}
        >
          <Dropdown
            cls="dataset-item-more-btn"
            view="default"
            tone="default"
            theme="flat"
            size="n"
            switcher={
              <Button size="xs" theme="flat" type="default" view="default" width="max">
                <EllipsisOutlined width="24" height="24" />
              </Button>
            }
            popup={
              <Popup hasTail hiding autoclosable onOutsideClick={() => {}}>
                {item.local ? (
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
                      onClick={() => {
                        this.onClickRemoveDatasetItem(item);
                      }}
                    >
                      Удалить
                    </Menu.Item>
                    <Menu.Item
                      type="option"
                      val="access"
                      onClick={() => {
                        this.onClickEditDatasetItem(item);
                      }}
                    >
                      Редактировать
                    </Menu.Item>
                  </Menu>
                ) : (
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
                      onClick={() => {
                        this.onClickDuplicateDatasetItem(item);
                      }}
                    >
                      Дублировать
                    </Menu.Item>
                  </Menu>
                )}
              </Popup>
            }
            hasTail
          />
        </div>
      </div>
    );
  };

  renderSections = () => {
    const {
      filteredMeasures,
      filteredDimensions,
      searchPhrase,
      dimensions,
      measures,
      dataset,
      fields,
      aceModeUrl,
      sdk,
    } = this.props;

    dimensions.sort((a, b) => a.datasetName.localeCompare(b.datasetName));

    const datasetNames = [...new Set(dimensions.map(d => d.datasetName))];

    return (
      <div className="dataset-wrapper">
        <div className="subcontainer actions-subcontainer">
          <div className="subheader actions-subheader">
            <SearchInput
              className="find-field-inp"
              hasClear={true}
              borderDisabled={true}
              text={searchPhrase}
              placeholder="Поиск"
              size="s"
              onChange={this.onChangeSearchInputField('searchPhrase')}
            />
            <Button
              cls={'add-param-btn'}
              theme="cancel"
              view="default"
              tone="default"
              size="s"
              onClick={this.onButtonAddParamClick}
            >
              <Icon data={iconPlus} width="16" />
            </Button>
          </div>
        </div>
        <div className="subcontainer dimensions-subcontainer">
          <div className="subheader dimensions-subheader">
            <span>Измерения</span>
          </div>
          {datasetNames.map(value => {
            {
              let items = dimensions.filter(d => d.datasetName === value);
              if (
                items.length > 0 ||
                (filteredDimensions &&
                  filteredDimensions.filter(d => d.datasetName === value).length > 0)
              ) {
                return (
                  <DndContainer
                    id="dimensions-container"
                    noRemove={true}
                    title={value}
                    items={
                      (filteredDimensions &&
                        filteredDimensions.length &&
                        filteredDimensions.filter(d => d.datasetName === value)) ||
                      items
                    }
                    allowedTypes={ITEM_TYPES.DIMENSIONS}
                    wrapTo={this.renderDatasetItem}
                  />
                );
              }
            }
          })}
        </div>
        <div className="subcontainer measures-subcontainer">
          <div className="subheader measures-subheader">
            <span>Показатели</span>
          </div>
          {datasetNames.map(value => {
            {
              let items = measures.filter(d => d.datasetName === value);
              if (
                items.length > 0 ||
                (filteredMeasures &&
                  filteredMeasures.filter(d => d.datasetName === value).length > 0)
              ) {
                return (
                  <DndContainer
                    id="measures-container"
                    noRemove={true}
                    title={value}
                    allowedTypes={ITEM_TYPES.MEASURES}
                    items={
                      (filteredMeasures &&
                        filteredMeasures.length &&
                        filteredMeasures.filter(d => d.datasetName === value)) ||
                      items
                    }
                    wrapTo={this.renderDatasetItem}
                  />
                );
              }
            }
          })}
        </div>
      </div>
    );
  };

  renderBlank() {
    return <div className="dataset-blank">Для начала работы выберите датасет</div>;
  }

  renderSectionsOrBlank = () => {
    const { isDatasetLoading, isDatasetLoaded, datasetError } = this.props;

    if (isDatasetLoading) {
      return <Loader size={'l'} />;
    }

    if (datasetError) {
      let datasetErrorText;
      if (datasetError.response) {
        datasetErrorText =
          DATASET_ERRORS[datasetError.response.status] || DATASET_ERRORS.UNKNOWN;
      } else {
        datasetErrorText = DATASET_ERRORS.UNKNOWN;
      }

      return (
        <div className="error">
          {datasetErrorText}
          {datasetErrorText === DATASET_ERRORS[403] ? (
            <div>
              <Button
                text="Запросить права"
                onClick={this.onButtonDatasetRequestRightsClick}
                theme="action"
                tone="default"
                view="default"
                size="s"
              />
            </div>
          ) : datasetErrorText === DATASET_ERRORS[404] ? (
            <div></div>
          ) : (
            <div>
              <Button
                text="Повторить"
                cls="btn-retry"
                onClick={this.onButtonDatasetTryAgainClick}
                theme="action"
                tone="default"
                view="default"
                size="s"
              />
            </div>
          )}
        </div>
      );
    }

    return isDatasetLoaded ? this.renderSections() : this.renderBlank();
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
              {dataset.realName || 'Выберите датасет'}
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
