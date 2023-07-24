import React from 'react';
import { Button } from 'lego-on-react';
import SearchInput from '@lib-modules/legacy-wizard/components/SearchInput/SearchInput';
import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';
import iconPlus from 'icons/plus.svg';
import { SectionDatasetGroup } from '../section-dataset-group';

export function SectionDatasetMain(props) {
  const {
    filteredMeasures,
    filteredDimensions,
    searchPhrase,
    dimensions,
    measures,
    onChangeSearchInputField,
    onButtonAddParamClick,
    renderDatasetItem,
  } = props;

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
            onChange={onChangeSearchInputField('searchPhrase')}
          />
          <Button
            cls={'add-param-btn'}
            theme="cancel"
            view="default"
            tone="default"
            size="s"
            onClick={onButtonAddParamClick}
          >
            <Icon data={iconPlus} width="16" />
          </Button>
        </div>
      </div>
      <SectionDatasetGroup
        title="Измерения"
        datasetNames={datasetNames}
        indicators={dimensions}
        filteredIndicators={filteredDimensions}
        renderDatasetItem={renderDatasetItem}
      />
      <SectionDatasetGroup
        title="Показатели"
        datasetNames={datasetNames}
        indicators={measures}
        filteredIndicators={filteredMeasures}
        renderDatasetItem={renderDatasetItem}
      />
    </div>
  );
}
