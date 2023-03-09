import PropTypes from 'prop-types';

import uuid from 'uuid/v1';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    Button,
    Dropdown,
    Popup,
    Menu
} from 'lego-on-react';

import {NavigationMinimal} from '@parma-data-ui/clusterdata';

import FieldEditor from '@parma-data-ui/clusterdata/src/components/FieldEditor/FieldEditor';

import Icon from '@parma-data-ui/common/src/components/Icon/Icon';

import iconCastBoolean from 'icons/cast-boolean.svg';
import iconCastDate from 'icons/cast-date.svg';
import iconCastGeo from 'icons/cast-geo.svg';
import iconCastNumber from 'icons/cast-number.svg';
import iconCastString from 'icons/cast-string.svg';
import iconDataset from 'icons/dataset.svg';
import iconPlus from 'icons/plus.svg';
import iconMore from 'icons/more.svg';

import {
    fetchDataset,
    toggleNavigation,
    applyTextFilter,
    setSearchPhrase,
    toggleFullscreen,
    updateDatasetByValidation
} from '../../../actions';

import {
    DATASET_ERRORS,
    ITEM_TYPES
} from '../../../constants';

import DNDContainer from '../../../components/DND/DNDContainer';
import SearchInput from '../../../components/SearchInput/SearchInput';

import {Loader} from '@parma-data-ui/common/src';

import {
    selectIsNavigationVisible,
    selectFilteredDimensions,
    selectFilteredMeasures,
    selectDefaultPath,
    selectSearchPhrase
} from '../../../reducers/settings';

import {
    selectDataset,
    selectUpdates,
    selectMeasures,
    selectDimensions,
    selectIsDatasetLoading,
    selectIsDatasetLoaded,
    selectDatasetError,
    selectFields,
    selectAceModeUrl
} from '../../../reducers/dataset';

import {createStructuredSelector} from 'reselect';

import isEqual from "lodash/isEqual";

import {i18n, CalcModes} from '@parma-data-ui/clusterdata';

// import './SectionDataset.scss';

function addIgnoreDrag(element) {
    element.className += ' ignore-drag';
}

function removeIgnoreDrag(element) {
    element.className = element.className.replace(' ignore-drag', '');
}

class SectionDataset extends Component {
    static propTypes = {
        sdk: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            isFieldEditorVisible: false,
            editingField: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
    }

    setNavigationButtonRef = (ref) => {
        this.setState({
            navigationButtonRef: ref
        });
    };

    onNavigationClick = (data) => {
        const {fetchDataset, toggleNavigation, sdk} = this.props;

        fetchDataset({
            datasetId: data.entryId,
            sdk
        });

        toggleNavigation();
    };

    onButtonAddParamClick = () => {
        this.openFieldEditor();
    };

    onOpenDatasetClick = () => {
        const {dataset} = this.props;

        window.open(`${DL.endpoints.dataset}/${dataset.id}`);
    };

    onButtonDatasetTryAgainClick = () => {
        const {fetchDataset, dataset, sdk} = this.props;

        fetchDataset({
            datasetId: dataset.id,
            sdk
        });
    };

    onButtonDatasetRequestRightsClick = () => {
        const {dataset, entryDialoguesRef} = this.props;

        entryDialoguesRef.current.openDialog({
            dialog: 'unlock',
            dialogProps: {
                entry: {
                    ...dataset,
                    entryId: dataset.id
                }
            }
        });
    };

    onNavigationClose = (event) => {
        const {toggleNavigation} = this.props;

        if ((this.state.navigationButtonRef && !this.state.navigationButtonRef.contains(event.target)) ||
            (event instanceof KeyboardEvent && event.code === 'Escape')
        ) {
            toggleNavigation();
        }
    };

    openFieldEditor = () => {
        this.setState({
            isFieldEditorVisible: true,
            editingField: this.state.editingField
        });
    };

    closeFieldEditor = () => {
        this.setState({
            isFieldEditorVisible: false,
            editingField: null
        });
    };

    modifyField = ({result_schema: resultSchema, field}) => {
        const {
            updateDatasetByValidation,
            sdk
        } = this.props;

        updateDatasetByValidation({
            fields: resultSchema,
            updates: [{
                action: 'update',
                field
            }],
            sdk
        });

        this.closeFieldEditor();
    };

    removeField = ({field}) => {
        const {
            updateDatasetByValidation,
            sdk,
            dataset: {
                result_schema: resultSchema
            }
        } = this.props;

        updateDatasetByValidation({
            fields: resultSchema,
            updates: [{
                action: 'delete',
                field
            }],
            sdk
        });
    };

    onClickEditDatasetItem = (item) => {
        if (!item.local)
            return;

        this.setState({
            isFieldEditorVisible: true,
            editingField: item
        });
    };

    onClickDuplicateDatasetItem = (item) => {
        const {
            updateDatasetByValidation,
            sdk,
            dataset,
            updates
        } = this.props;

        const {result_schema: resultSchema} = dataset;

        const guid = uuid();

        let {
            calc_mode: calcMode,
            title
        } = item;

        const fieldNext = {
            ...item,
            guid
        };

        if (calcMode === CalcModes.Formula) {
            delete fieldNext.cast;
        }

        resultSchema.concat(updates).forEach((row) => {
            let {
                title: currentTitle
            } = row;

            if (typeof currentTitle === 'undefined') {
               currentTitle = row.field.title;
            }

            if (title === currentTitle) {
                const match = title.match(/\((\d+)\)$/);

                if (match) {
                    const i = Number(match[1]);

                    title = title.replace(/\((\d+)\)$/, `(${i+1})`);
                } else {
                    title = `${title} (1)`;
                }
            }
        });

        fieldNext.title = title;

        updateDatasetByValidation({
            fields: [...resultSchema],
            updates: [{
                action: 'add',
                field: fieldNext
            }],
            sdk
        });
    };

    onClickRemoveDatasetItem = (item) => {
        if (!item.local)
            return;

        this.removeField({field: item});
    };

    createField = ({result_schema: resultSchema, field}) => {
        const {
            updateDatasetByValidation,
            sdk
        } = this.props;

        const {
            guid,
            calc_mode: calcMode
        } = field;

        const fieldNext = {
            ...field
        };

        if (calcMode === CalcModes.Formula) {
            delete fieldNext.cast;
        }

        const fieldsNext = resultSchema.map((row) => {
            const {
                guid: guidCurrent
            } = row;

            if (guidCurrent === guid) {
                delete row.cast;
            }

            return row;
        });

        updateDatasetByValidation({
            fields: fieldsNext,
            updates: [{
                action: 'add',
                field: fieldNext
            }],
            sdk
        });

        this.closeFieldEditor();
    };

    onChangeSearchInputField(field) {
        const {applyTextFilter, setSearchPhrase, measures, dimensions} = this.props;

        return (value) => {
            this.setState({
                [field]: value
            }, () => {
                if (this.timeoutAfterInputSearchText) {
                    clearTimeout(this.timeoutAfterInputSearchText);
                }

                const searchPhrase = value.toLowerCase();

                setSearchPhrase({
                    searchPhrase
                });

                this.timeoutAfterInputSearchText = setTimeout(() => {
                    applyTextFilter({
                        searchPhrase,
                        measures,
                        dimensions
                    });
                }, 300);
            });
        };
    }

    renderDatasetItem = (props) => {
        const {item, className, isDragging} = props;

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
                castIconData = iconCastNumber;
                break;

            case 'datetime':
            case 'date':
                castIconData = iconCastDate;
                break;

            case 'geo':
                castIconData = iconCastGeo;
                break;

            case 'boolean':
                castIconData = iconCastBoolean;
                break;

            case 'string':
            default:
                castIconData = iconCastString;
        }

        return (
            <div className={resultClassName} title={item.title}>
                <div
                    className="item-icon"
                >
                    <Icon
                        data={castIconData}
                        width="16"
                    />
                </div>
                <div className="item-title" title={item.title}>
                    {item.title}
                </div>
                <div
                    className="item-right-icon item-more-icon"
                    onMouseEnter={(e) => {
                        addIgnoreDrag(e.currentTarget.parentElement);
                    }}
                    onMouseLeave={(e) => {
                        removeIgnoreDrag(e.currentTarget.parentElement);
                    }}
                >
                    <Dropdown
                        cls="dataset-item-more-btn"
                        view="default"
                        tone="default"
                        theme="flat"
                        size="n"
                        switcher={(
                            <Button
                                size="xs"
                                theme="flat"
                                type="default"
                                view="default"
                                width="max"
                            >
                                <Icon
                                    data={iconMore}
                                    width="20"
                                    height="20"
                                />
                            </Button>
                        )}
                        popup={(
                            <Popup
                                hasTail
                                hiding
                                autoclosable
                                onOutsideClick={() => {}}
                            >
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
                                          {i18n('wizard', 'button_remove')}
                                      </Menu.Item>
                                      <Menu.Item
                                          type="option"
                                          val="access"
                                          onClick={() => {
                                              this.onClickEditDatasetItem(item);
                                          }}
                                      >
                                          {i18n('wizard', 'button_edit')}
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
                                            {i18n('wizard', 'button_duplicate')}
                                        </Menu.Item>
                                    </Menu>
                                )}
                            </Popup>
                        )}
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
            sdk
        } = this.props;

        dimensions.sort((a, b) => a.datasetName.localeCompare(b.datasetName));

        const datasetNames=[...new Set(dimensions.map(d=>d.datasetName))];

        return (
            <div className="dataset-wrapper">
                <div className="subcontainer actions-subcontainer">
                    <div className="subheader actions-subheader">
                        <SearchInput
                            className="find-field-inp"
                            hasClear={true}
                            borderDisabled={true}
                            text={searchPhrase}
                            placeholder={i18n('wizard', 'field_search')}
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
                            <Icon
                                data={iconPlus}
                                width="16"
                            />
                        </Button>
                    </div>
                </div>
                <div className="subcontainer dimensions-subcontainer">
                    <div className="subheader dimensions-subheader">
                        <span>{i18n('wizard', 'section_dimensions')}</span>
                    </div>
                    {datasetNames.map(value => {
                        {
                           let items = dimensions.filter(d=>d.datasetName===value);
                           if (items.length>0 || (filteredDimensions &&filteredDimensions.filter(d=>d.datasetName===value).length>0)){
                           return <DNDContainer
                                id="dimensions-container"
                                noRemove={true}
                                title={value}
                                items={(filteredDimensions && filteredDimensions.length && filteredDimensions.filter(d=>d.datasetName===value)) || items}
                                allowedTypes={ITEM_TYPES.DIMENSIONS}
                                wrapTo={this.renderDatasetItem}
                            />
                           }
                        }
                    })}
                </div>
                <div className="subcontainer measures-subcontainer">
                    <div className="subheader measures-subheader">
                        <span>{i18n('wizard', 'section_measures')}</span>
                    </div>
                    {datasetNames.map(value => {
                        {
                            let items = measures.filter(d=>d.datasetName===value);
                            if (items.length>0 || (filteredMeasures && filteredMeasures.filter(d=>d.datasetName===value).length>0)) {
                                return <DNDContainer
                                    id="measures-container"
                                    noRemove={true}
                                    title={value}
                                    allowedTypes={ITEM_TYPES.MEASURES}
                                    items={(filteredMeasures && filteredMeasures.length && filteredMeasures.filter(d => d.datasetName === value)) || items}
                                    wrapTo={this.renderDatasetItem}
                                />
                            }
                        }
                    })}
                </div>

            </div>
        );
    };

    renderBlank() {
        return (
            <div className="dataset-blank">{i18n('wizard', 'label_dataset-blank')}</div>
        );
    }

    renderSectionsOrBlank = () => {
        const {
            isDatasetLoading,
            isDatasetLoaded,
            datasetError
        } = this.props;

        if (isDatasetLoading) {
            return (
                <Loader size={'l'}/>
            );
        }

        if (datasetError) {
            let datasetErrorText;
            if (datasetError.response) {
                datasetErrorText = DATASET_ERRORS[datasetError.response.status] || DATASET_ERRORS.UNKNOWN;
            } else {
                datasetErrorText = DATASET_ERRORS.UNKNOWN;
            }

            return (
                <div className="error">
                    {i18n('wizard', datasetErrorText)}
                    {
                        (datasetErrorText === DATASET_ERRORS[403]) ? (
                            <div>
                                <Button
                                    text={i18n('wizard', 'button_access-rights')}
                                    onClick={this.onButtonDatasetRequestRightsClick}
                                    theme="action"
                                    tone="default"
                                    view="default"
                                    size="s"
                                />
                            </div>
                        ) : (datasetErrorText === DATASET_ERRORS[404]) ? (
                            <div></div>
                        ) : (
                            <div>
                                <Button
                                    text={i18n('wizard', 'button_retry')}
                                    cls="btn-retry"
                                    onClick={this.onButtonDatasetTryAgainClick}
                                    theme="action"
                                    tone="default"
                                    view="default"
                                    size="s"
                                />
                            </div>
                        )
                    }
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
            defaultPath
        } = this.props;

        return (
            <div className="container datasets-container">
                <div className="actions-container datasets-actions-container">
                    <div className="icon">
                        <Icon
                            data={iconDataset}
                            width="24"
                        />
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
                            {dataset.realName || i18n('wizard', 'button_choose-dataset')}
                        </Button>
                        {dataset.realName? (
                            <Dropdown
                                cls="dataset-more-btn"
                                view="default"
                                tone="default"
                                theme="flat"
                                size="n"
                                switcher={(
                                    <Button
                                        size="s"
                                        theme="flat"
                                        type="default"
                                        view="default"
                                        width="max"
                                    >
                                        <Icon
                                            data={iconMore}
                                            width="22"
                                            height="22"
                                        />
                                    </Button>
                                )}
                                popup={(
                                    <Popup
                                        hasTail
                                        hiding
                                        autoclosable
                                        onOutsideClick={() => {}}
                                    >
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
                                                {i18n('wizard', 'button_to-dataset')}
                                            </Menu.Item>
                                        </Menu>
                                    </Popup>
                                )}
                                hasTail
                            />
                        ) : null}
                    </div>
                    {defaultPath ? (
                        <NavigationMinimal
                            anchor={this.state.navigationButtonRef}
                            scope='dataset'
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
    aceModeUrl: selectAceModeUrl
});

const mapDispatchToProps = {
    fetchDataset,
    toggleNavigation,
    applyTextFilter,
    setSearchPhrase,
    toggleFullscreen,
    updateDatasetByValidation
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionDataset);
