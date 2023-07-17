/* eslint-disable max-lines-per-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, import/no-default-export */
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown } from 'antd';
import { createStructuredSelector } from 'reselect';

// TODO: убрать зависимость после её переписывания
// eslint-disable-next-line
// @ts-ignore
import { NavigationMinimal } from '@kamatech-data-ui/clustrum';
import { DownOutlined, DatabaseOutlined } from '@ant-design/icons';

import {
  fetchDataset,
  toggleNavigation,
  applyTextFilter,
  setSearchPhrase,
  updateDatasetByValidation,
} from '../../../../actions';
import {
  selectIsNavigationVisible,
  selectFilteredDimensions,
  selectFilteredMeasures,
  selectDefaultPath,
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
} from '../../../../reducers/dataset';
import { SectionDatasetItem } from './ui/section-dataset-item';
import styles from './section-dataset.module.css';
import { SectionDatasetProps, SectionDatasetState, SectionDatasetActions } from './types';
import { SectionDatasetMain } from './ui/section-dataset-main';
import { DndItemProps } from '@lib-shared/ui/drag-n-drop/types';
import { useDebounce } from '@lib-shared/lib/hooks';

function SectionDataset(props: SectionDatasetProps): ReactElement {
  const {
    dataset,
    fetchDataset,
    toggleNavigation,
    sdk,
    entryDialoguesRef,
    applyTextFilter,
    setSearchPhrase,
    measures,
    dimensions,
    updates,
    isNavigationVisible,
    defaultPath,
    filteredDimensions,
    filteredMeasures,
    isDatasetLoaded,
    isDatasetLoading,
    datasetError,
    updateDatasetByValidation,
  } = props;

  const [isFieldEditorVisible, setIsFieldEditorVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const navigationButtonRef = useRef<HTMLDivElement | null>(null);

  const debouncedValue = useDebounce(searchValue, 300);
  useEffect(() => {
    const searchPhrase = debouncedValue.toLowerCase();
    setSearchPhrase({
      searchPhrase,
    });
    applyTextFilter({
      searchPhrase,
      measures,
      dimensions,
    });
  }, [debouncedValue, dimensions, measures, applyTextFilter, setSearchPhrase]);

  const onNavigationClick = (data: any): void => {
    fetchDataset({
      datasetId: data.entryId,
      sdk,
    });

    toggleNavigation();
  };

  const onOpenDatasetClick = (): void => {
    window.open(`/datasets/${dataset.id}`);
  };

  const onButtonDatasetTryAgainClick = (): void => {
    fetchDataset({
      datasetId: dataset.id,
      sdk,
    });
  };

  const onButtonDatasetRequestRightsClick = (): void => {
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

  const onNavigationClose = (event: any): void => {
    if (
      (navigationButtonRef?.current &&
        !navigationButtonRef.current.contains(event.target)) ||
      (event instanceof KeyboardEvent && event.code === 'Escape')
    ) {
      toggleNavigation();
    }
  };

  const onOpenFieldEditor = (isOpening: boolean, field: any): void => {
    setIsFieldEditorVisible(isOpening);
    setEditingField(field);
  };

  const onChangeSearchField = (value: string): void => setSearchValue(value);

  const renderDatasetItem = (datasetItemProps: DndItemProps): any => (
    <SectionDatasetItem
      {...datasetItemProps}
      sdk={sdk}
      dataset={dataset}
      updates={updates}
      setState={onOpenFieldEditor}
      updateDatasetByValidation={updateDatasetByValidation}
    />
  );

  const goToDatasetDropdownItem = [
    {
      key: 'goTo',
      label: <div onClick={onOpenDatasetClick}>Перейти к датасету</div>,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.action_container}>
        <div className={styles.dataset_selector} ref={navigationButtonRef}>
          <Button
            type="link"
            className={styles.dataset_selector__button}
            onClick={toggleNavigation}
          >
            <DatabaseOutlined width="24" />
            <span>{dataset.realName || 'Выберите набор данных'}</span>
          </Button>
          {dataset.realName && (
            <Dropdown
              className="dataset-more-btn"
              menu={{ items: goToDatasetDropdownItem }}
              trigger={['click']}
            >
              <DownOutlined style={{ width: 12 }} />
            </Dropdown>
          )}
        </div>
        {defaultPath && (
          <NavigationMinimal
            hasTail
            anchor={navigationButtonRef.current}
            scope="dataset"
            sdk={sdk}
            onClose={onNavigationClose}
            onEntryClick={onNavigationClick}
            visible={isNavigationVisible}
            popupDirections={['right-bottom', 'bottom-left']}
            configMenuEditEntry={null}
            startFrom={defaultPath}
          />
        )}
      </div>
      <SectionDatasetMain
        filteredMeasures={filteredMeasures}
        filteredDimensions={filteredDimensions}
        searchPhrase={searchValue}
        dimensions={dimensions}
        measures={measures}
        isDatasetLoading={isDatasetLoading}
        isDatasetLoaded={isDatasetLoaded}
        datasetError={datasetError}
        onRequestDatasetRights={onButtonDatasetRequestRightsClick}
        onLoadDatasetAgain={onButtonDatasetTryAgainClick}
        onChangeSearchInputField={onChangeSearchField}
        renderDatasetItem={renderDatasetItem}
      />
    </div>
  );
}

const mapStateToProps = createStructuredSelector<any, SectionDatasetState>({
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
});

const mapDispatchToProps: SectionDatasetActions = {
  fetchDataset,
  toggleNavigation,
  applyTextFilter,
  setSearchPhrase,
  updateDatasetByValidation,
};

// TODO изменить на именнованный импорт после переписывания на effector
export default connect(mapStateToProps, mapDispatchToProps)(SectionDataset);
