import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown } from 'antd';
import { createStructuredSelector } from 'reselect';

// TODO: поменять импорт после переписывания компонента
// eslint-disable-next-line
// @ts-ignore
import { NavigationMinimal } from '@kamatech-data-ui/clustrum';
import { DownOutlined, DatabaseOutlined } from '@ant-design/icons';

import {
  fetchDataset,
  toggleNavigation,
  applyTextFilter,
  setSearchPhrase,
} from '../../../../actions';
import {
  selectIsNavigationVisible,
  selectFilteredDimensions,
  selectFilteredMeasures,
  selectDefaultPath,
} from '../../../../reducers/settings';
import {
  selectDataset,
  selectMeasures,
  selectDimensions,
  selectIsDatasetLoading,
  selectIsDatasetLoaded,
  selectDatasetError,
} from '../../../../reducers/dataset';
import {
  SectionDatasetProps,
  SectionDatasetState,
  SectionDatasetActions,
  NavigationEntryData,
} from './types';
import { SectionDatasetMain } from './ui/section-dataset-main';
import { useDebounce } from '@lib-shared/lib/hooks';
import styles from './section-dataset.module.css';

function SectionDataset(props: SectionDatasetProps): ReactElement {
  const {
    dataset,
    sdk,
    entryDialoguesRef,
    measures,
    dimensions,
    isNavigationVisible,
    defaultPath,
    filteredDimensions,
    filteredMeasures,
    isDatasetLoaded,
    isDatasetLoading,
    datasetError,
    fetchDataset,
    toggleNavigation,
    applyTextFilter,
    setSearchPhrase,
  } = props;

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

  const onChangeSearchField = (value: string): void => setSearchValue(value);

  const onNavigationClick = ({ entryId }: NavigationEntryData): void => {
    fetchDataset({
      datasetId: entryId,
      sdk,
    });
    toggleNavigation();
  };

  const onNavigationClose = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    const isOutsideNavigationClick =
      navigationButtonRef?.current &&
      !navigationButtonRef.current.contains(event.target as Node);
    const isEscKeyPressed = event instanceof KeyboardEvent && event.code === 'Escape';
    if (isOutsideNavigationClick || isEscKeyPressed) {
      toggleNavigation();
    }
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

  const onOpenDatasetClick = (): void => {
    window.open(`/datasets/${dataset.id}`);
  };

  const openDatasetDropdownItem = [
    {
      key: 'openDataset',
      label: <div onClick={onOpenDatasetClick}>Перейти к датасету</div>,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles['action-container']}>
        <div className={styles['dataset-selector']} ref={navigationButtonRef}>
          <Button
            type="link"
            className={styles['dataset-selector__button']}
            onClick={toggleNavigation}
          >
            <DatabaseOutlined width="24" />
            <span>{dataset.realName || 'Выберите набор данных'}</span>
          </Button>
          {dataset.realName && (
            <Dropdown
              className="dataset-more-btn"
              menu={{ items: openDatasetDropdownItem }}
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
      />
    </div>
  );
}

// TODO будет изменено при переходе на effector, поэтому тип unknown
const mapStateToProps = createStructuredSelector<unknown, SectionDatasetState>({
  isDatasetLoading: selectIsDatasetLoading,
  isDatasetLoaded: selectIsDatasetLoaded,
  isNavigationVisible: selectIsNavigationVisible,
  dataset: selectDataset,
  datasetError: selectDatasetError,
  measures: selectMeasures,
  dimensions: selectDimensions,
  filteredDimensions: selectFilteredDimensions,
  filteredMeasures: selectFilteredMeasures,
  defaultPath: selectDefaultPath,
});

const mapDispatchToProps: SectionDatasetActions = {
  fetchDataset,
  toggleNavigation,
  applyTextFilter,
  setSearchPhrase,
};

export const SectionDatasetComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SectionDataset);
