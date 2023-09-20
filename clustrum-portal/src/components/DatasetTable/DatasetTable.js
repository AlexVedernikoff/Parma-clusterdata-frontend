import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import DataTable from '@kamatech-data-ui/dt100/lib';
import { Button, CheckBox, TextInput } from 'lego-on-react';
import { Icon } from '@kamatech-data-ui/common/src';
import { CalcModes } from '@kamatech-data-ui/clustrum';

import TypeSelect from '../../components/TypeSelect/TypeSelect';
import AggregationSelect from '../../components/AggregationSelect/AggregationSelect';
import FieldActionsPopup from '../../components/FieldActionsPopup/FieldActionsPopup';
import { getAggregationLabel, getFieldTypeLabel } from '../../constants';

// import './DatasetTable.scss';

import iconEyeCross from '@kamatech-data-ui/clustrum/src/icons/eye-cross.svg';
import indexIcon from '@kamatech-data-ui/clustrum/src/icons/index.svg';
import arrayIcon from '@kamatech-data-ui/clustrum/src/icons/array.svg';
import iconVersion from '@kamatech-data-ui/clustrum/src/icons/version.svg';
import iconFormula2 from '@kamatech-data-ui/clustrum/src/icons/formula2.svg';
import iconTableCount from '@kamatech-data-ui/clustrum/src/icons/table-count.svg';
import iconAsc from '@kamatech-data-ui/clustrum/src/icons/sort-arrow.svg';
import iconLinkedDataset from '@kamatech-data-ui/clustrum/src/icons/linked-dataset.svg';
import iconVerificationRules from '@kamatech-data-ui/clustrum/src/icons/verification-rules.svg';

const b = block('dataset-table');
const rowClass = block('dataset-table')('row');

DataTable.setCustomIcons({
  ICON_ASC: <Icon className={b('sort-icon')} data={iconAsc} />,
  ICON_DESC: <Icon className={b('sort-icon', { rotated: true })} data={iconAsc} />,
});

function CustomTextInput(props) {
  const { cls, tabIndex, text, onFocus, onBlur } = props;
  const [localText, setLocalText] = useState(text);

  useEffect(() => setLocalText(text), [text]);

  return (
    <TextInput
      tabIndex={tabIndex}
      cls={cls}
      theme="normal"
      size="s"
      view="default"
      tone="default"
      text={localText}
      onFocus={onFocus}
      onBlur={text !== localText ? onBlur : null}
      onChange={textNext => setLocalText(textNext)}
    />
  );
}

class DatasetTable extends React.Component {
  static defaultProps = {};

  static propTypes = {
    displayHiddenFields: PropTypes.bool.isRequired,
    datasetId: PropTypes.string.isRequired,
    validation: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired,
    toggleFilterFieldsByHidden: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
    onClickRow: PropTypes.func.isRequired,
    duplicateField: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    openRLSDialog: PropTypes.func.isRequired,
  };

  state = {
    currentFieldWithOpenedPopup: null,
  };

  componentDidMount() {
    this.attachDatasetTableClickListener();
    this.attachClickDocumentListener();
  }

  componentWillUnmount() {
    this.detachDatasetTableClickListener();
    this.detachClickDocumentListener();
  }

  _datasetTableRef = React.createRef();
  _currentFocusedRow = null;

  get datasetTableRef() {
    let datasetTableRef = null;

    if (this._datasetTableRef) {
      datasetTableRef = this._datasetTableRef.current;
    }

    return datasetTableRef;
  }

  attachDatasetTableClickListener = () => {
    if (this.datasetTableRef) {
      this.datasetTableRef.addEventListener('click', this.onClickDatasetTable);
    }
  };

  attachClickDocumentListener = () => {
    document.addEventListener('click', this.onClickDocument);
  };

  detachDatasetTableClickListener = () => {
    if (this.datasetTableRef) {
      this.datasetTableRef.removeEventListener('click', this.onClickDatasetTable);
    }
  };

  detachClickDocumentListener = () => {
    if (this.datasetTableRef) {
      this.datasetTableRef.removeEventListener('click', this.onClickDocument);
    }
  };

  onClickDatasetTable = e => {
    window.requestAnimationFrame(() => {
      this.activateDatasetRow(e);
    });
  };

  onClickDocument = () => {
    window.requestAnimationFrame(() => this.deactivateDatasetRows());
  };

  getVisiblePopups = () => {
    const popups = this.getDatasetPopups();

    return popups.filter(popup => popup.classList.contains('popup2_visible_yes'));
  };

  getDatasetPopups = (names = ['yc-select-popup', 'field-actions-popup__popup']) => {
    return names.reduce(
      (popups, name) => [...popups, ...Array.from(document.getElementsByClassName(name))],
      [],
    );
  };

  activateRow = rowNode => {
    rowNode.classList.add(b('active-row'));
  };

  deactivateRow = rowNode => {
    rowNode.classList.remove(b('active-row'));
  };

  getDatasetRows = () => {
    return Array.from(document.getElementsByTagName('tr'));
  };

  getClosestParentRow = e => {
    return e.target.closest('tr');
  };

  onFocusTextInput = e => {
    const tableRow = this.getClosestParentRow(e);

    if (tableRow !== this._currentFocusedRow) {
      this.deactivateRows();
    }

    this._currentFocusedRow = tableRow;

    setTimeout(() => this.activateRow(tableRow), 100);
  };

  activateDatasetRow = e => {
    this.deactivateRows();

    const parentNode = e.target.parentNode;
    const isClickedDropdown =
      parentNode.classList.contains('yc-select-control') ||
      parentNode.classList.contains('field-actions-popup__control');

    if (isClickedDropdown) {
      const visiblePopups = this.getVisiblePopups();

      if (visiblePopups.length) {
        const tableRow = this.getClosestParentRow(e);

        this.activateRow(tableRow);
      }
    }
  };

  deactivateRows = () => {
    const tableRows = this.getDatasetRows();

    tableRows.map(this.deactivateRow);
  };

  deactivateDatasetRows = popups => {
    const visiblePopups = popups || this.getVisiblePopups();

    if (!visiblePopups.length) {
      this.deactivateRows();
    }
  };

  toggleHidden = ({ row }) => {
    const { updateField } = this.props;
    const { guid, hidden } = row;

    updateField({
      field: {
        guid,
        hidden: !hidden,
      },
      validateEnabled: false,
      updatePreview: true,
    });
  };

  toggleHasIndex = ({ row }) => {
    const { updateField } = this.props;
    const { guid, hasIndex } = row;

    updateField({
      field: {
        guid,
        hasIndex: !hasIndex,
      },
      validateEnabled: false,
      updatePreview: true,
    });
  };

  toggleHasArray = ({ row }) => {
    const { updateField } = this.props;
    const { guid, hasArray } = row;

    updateField({
      field: {
        guid,
        hasArray: !hasArray,
      },
      validateEnabled: false,
      updatePreview: true,
    });
  };

  toggleHasVersion = ({ row }) => {
    const { updateField } = this.props;
    const { guid, hasVersion } = row;

    updateField({
      field: {
        guid,
        hasVersion: !hasVersion,
      },
      validateEnabled: true,
      updatePreview: true,
    });
  };

  changeTitle = ({ row, title }) => {
    const { updateField } = this.props;
    const { guid } = row;

    updateField({
      field: {
        guid,
        title,
      },
      debounce: true,
    });
  };

  changeDescription = ({ row, description }) => {
    const { updateField } = this.props;
    const { guid } = row;

    updateField({
      field: {
        guid,
        description,
      },
      validateEnabled: false,
    });
  };

  getAggregationSwitchTo = (currentAggregation, selectedCast) => {
    const { types = [] } = this.props;

    const { aggregations: availableAggregations = [] } = types.find(
      ({ name }) => name === selectedCast,
    );

    const isCurrentAggregationAvailableForCast = availableAggregations.includes(
      currentAggregation,
    );

    return isCurrentAggregationAvailableForCast ? currentAggregation : 'none';
  };

  onSelectType = ({ row, newSelectedValue: cast }) => {
    const { updateField } = this.props;
    const { guid, aggregation } = row;

    const aggregationNext = this.getAggregationSwitchTo(aggregation, cast);

    updateField({
      field: {
        guid,
        cast,
        aggregation: aggregationNext,
      },
      debounce: true,
    });
  };

  onSelectAggregation = ({ row, newSelectedValue: aggregation }) => {
    const { updateField } = this.props;
    const { guid } = row;

    updateField({
      field: {
        guid,
        aggregation,
      },
      debounce: true,
    });
  };

  openFieldEditor = ({ field, isVerification }) => {
    const { datasetId, onClickRow } = this.props;
    onClickRow({ datasetId, field, isVerification });
  };

  onRowClick = (row, index, e) => {
    const tagName = e.target.tagName;
    const allowedTagsOpenFieldEditor = ['TD'];

    const isAllowedOpenFieldEditor = allowedTagsOpenFieldEditor.includes(tagName);

    if (isAllowedOpenFieldEditor) {
      this.openFieldEditor({
        field: row,
      });
    }
  };

  onClickMoreRowAction = ({ action, field }) => {
    const { duplicateField, removeField, openRLSDialog } = this.props;

    switch (action) {
      case 'duplicate': {
        duplicateField({ field });
        break;
      }
      case 'edit': {
        this.openFieldEditor({ field });
        break;
      }
      case 'remove': {
        removeField({ field });
        break;
      }
      case 'rls': {
        openRLSDialog({ field });
        break;
      }
    }
  };

  isFormulaField = calcMode => calcMode === CalcModes.Formula;

  hasLinkedDataset = linkedDataset => linkedDataset && linkedDataset.length > 0;

  hasVerificationRules = verificationRules => verificationRules !== '';

  sortTitleColumn = (rowCurrent, rowNext) => {
    console.log('379 sortTitleColumn = (rowCurrent, rowNext)');
    console.log('rowCurrent = ', rowCurrent);
    const { row: { title: titleCurrent } = {} } = rowCurrent;
    const { row: { title: titleNext } = {} } = rowNext;

    return titleCurrent.localeCompare(titleNext, undefined, { numeric: true });
  };

  sortCastColumn = (rowCurrent, rowNext) => {
    console.log('sortCastColumn = (rowCurrent, rowNext)');
    const { row: { cast: castCurrent } = {} } = rowCurrent;
    const { row: { cast: castNext } = {} } = rowNext;

    const castCurrentLocale = getFieldTypeLabel(castCurrent);
    const castNextLocale = getFieldTypeLabel(castNext);

    // console.log('castCurrentLocale = ', castCurrentLocale);

    return castCurrentLocale.localeCompare(castNextLocale, undefined, { numeric: true });
  };

  sortAggregationColumn = (rowCurrent, rowNext) => {
    const { row: { aggregation: aggregationCurrent } = {} } = rowCurrent;
    const { row: { aggregation: aggregationNext } = {} } = rowNext;

    const aggregationCurrentLocale = getAggregationLabel(aggregationCurrent);
    const aggregationNextLocale = getAggregationLabel(aggregationNext);

    return aggregationCurrentLocale.localeCompare(aggregationNextLocale, undefined, {
      numeric: true,
    });
  };

  sortDescriptionColumn = (rowCurrent, rowNext) => {
    const { row: { description: descriptionCurrent } = {} } = rowCurrent;
    const { row: { description: descriptionNext } = {} } = rowNext;

    return descriptionCurrent.localeCompare(descriptionNext, undefined, {
      numeric: true,
    });
  };

  IndexColumn = {
    name: 'index',
    className: b('column'),
    align: DataTable.CENTER,
    width: '50px',
    sortable: false,
    header: (
      <Icon className={b('header-icon-table-count')} data={iconTableCount} width="10" />
    ),
    render: ({ index }) => index + 1,
  };

  TitleColumn = {
    name: 'title',
    className: b('column'),
    width: '20%',
    sortable: true,
    sortAscending: this.sortTitleColumn,
    header: <div className={b('header')}>Имя</div>,
    render: ({ value, index, row }) => {
      const { valid } = row;
      const maxTabIndex = (index + 1) * 4;
      const tabIndex = maxTabIndex - 3;

      return (
        <CustomTextInput
          cls={b('inp-title', { error: !valid })}
          key={index}
          tabIndex={tabIndex}
          text={value}
          onFocus={this.onFocusTextInput}
          onBlur={e =>
            this.changeTitle({
              row,
              title: e.target.value,
            })
          }
        />
      );
    },
  };

  LinkedDatasetColumn = {
    name: 'linkedDataset',
    className: b('column'),
    width: '70px',
    align: DataTable.LEFT,
    sortable: true,
    header: (
      <Icon
        className={b('header-icon')}
        data={iconLinkedDataset}
        width="18"
        height="18"
      />
    ),
    render: ({ index, row }) => {
      const { linkedDataset } = row;

      return this.hasLinkedDataset(linkedDataset) ? (
        <Button
          key={index}
          cls={b('btn-linked')}
          theme="flat"
          size="m"
          view="default"
          tone="default"
          title="Имеет связь"
          onClick={() => this.openFieldEditor({ field: row })}
        >
          <Icon className={b('linked')} data={iconLinkedDataset} width="18" height="18" />
        </Button>
      ) : null;
    },
  };

  FormulaColumn = {
    name: 'formula',
    className: b('column'),
    width: '250px',
    align: DataTable.LEFT,
    sortable: true,
    header: <div className={b('header')}>Источник поля</div>,
    render: ({ index, row }) => {
      const { calc_mode: calcMode, source: source } = row;

      return this.isFormulaField(calcMode) ? (
        <Button
          key={index}
          cls={b('btn-formula')}
          theme="flat"
          size="m"
          view="default"
          tone="default"
          title="Редактировать"
          onClick={() => this.openFieldEditor({ field: row })}
        >
          <Icon className={b('formula')} data={iconFormula2} width="28" height="28" />
        </Button>
      ) : (
        <Button
          key={index}
          cls={b('btn-source')}
          theme="flat"
          size="m"
          view="default"
          tone="default"
          title="Редактировать"
          onClick={() => this.openFieldEditor({ field: row })}
          text={source}
        ></Button>
      );
    },
  };

  HiddenColumn = {
    name: 'hidden',
    className: b('column'),
    width: '70px',
    align: DataTable.CENTER,
    sortable: true,
    header: <Icon className={b('header-icon')} data={iconEyeCross} width="24" />,
    render: ({ value, index, row }) => {
      return (
        <Button
          key={index}
          cls={b('btn-hidden')}
          theme="light"
          size="n"
          view="default"
          tone="default"
          title={value ? 'Скрыть поле' : 'Показать поле'}
          onClick={() => this.toggleHidden({ row })}
        >
          <Icon
            className={b('hidden', { hidden: value })}
            data={iconEyeCross}
            width="24"
            height="28"
          />
        </Button>
      );
    },
  };

  HasVerificationRulesColumn = {
    name: 'verification_rules',
    className: b('column'),
    width: '70px',
    align: DataTable.LEFT,
    sortable: true,
    header: <Icon className={b('header-icon')} data={iconVerificationRules} width="24" />,
    render: ({ index, row }) => {
      const { verification_rules: verificationRules } = row;

      return this.hasVerificationRules(verificationRules) ? (
        <Button
          key={index}
          cls={b('btn-with-no-toggle')}
          theme="flat"
          size="n"
          view="default"
          tone="default"
          title="Имеются правила верификации и/или сопоставления"
          onClick={() => this.openFieldEditor({ field: row, isVerification: true })}
        >
          <Icon
            className={b('verification_rules')}
            data={iconVerificationRules}
            width="24"
            height="28"
          />
        </Button>
      ) : null;
    },
  };

  HasIndexColumn = {
    name: 'hasIndex',
    className: b('column'),
    width: '70px',
    align: DataTable.CENTER,
    sortable: true,
    header: <Icon className={b('header-icon')} data={indexIcon} width="24" />,
    render: ({ value, index, row }) => {
      return (
        <Button
          key={index}
          cls={b('btn-hidden')}
          theme="light"
          size="n"
          view="default"
          tone="default"
          title={value ? 'Имеется индекс' : 'Отсутствует индекс'}
          onClick={() => this.toggleHasIndex({ row })}
        >
          <Icon
            className={b('hidden', { hidden: value })}
            data={indexIcon}
            width="24"
            height="28"
          />
        </Button>
      );
    },
  };

  CastColumn = {
    name: 'cast',
    className: b('column', b('column-cast')),
    width: '175px',
    sortable: true,
    sortAscending: this.sortCastColumn,
    header: <div className={b('header-cast')}>Тип</div>,
    render: ({ value, index, row }) => {
      const { types } = this.props;
      const maxTabIndex = (index + 1) * 4;
      const tabIndex = maxTabIndex - 2;

      return (
        <TypeSelect
          key={index}
          field={row}
          tabIndex={tabIndex}
          selectedType={value}
          types={types}
          onSelect={this.onSelectType}
        />
      );
    },
  };

  HasArrayColumn = {
    name: 'hasArray',
    className: b('column'),
    width: '70px',
    align: DataTable.CENTER,
    sortable: true,
    header: <Icon className={b('header-icon')} data={arrayIcon} width="24" />,
    render: ({ value, index, row }) => {
      return (
        <Button
          key={index}
          cls={b('btn-hidden')}
          theme="light"
          size="n"
          view="default"
          tone="default"
          title={value ? 'Поле-массив' : 'Поле-не массив'}
          onClick={() => this.toggleHasArray({ row })}
        >
          <Icon
            className={b('hidden', { hidden: value })}
            data={arrayIcon}
            width="24"
            height="28"
          />
        </Button>
      );
    },
  };

  HasVersionColumn = {
    name: 'hasVersion',
    className: b('column'),
    width: '70px',
    align: DataTable.CENTER,
    sortable: true,
    header: <Icon className={b('header-icon')} data={iconVersion} width="24" />,
    render: ({ value, index, row }) => {
      return (
        <Button
          key={index}
          cls={b('btn-hidden')}
          theme="light"
          size="n"
          view="default"
          tone="default"
          title={
            value
              ? 'Поле используется для версионирования'
              : 'Поле не используется для версионирования'
          }
          onClick={() => this.toggleHasVersion({ row })}
        >
          <Icon
            className={b('hidden', { hidden: value })}
            data={iconVersion}
            width="24"
            height="28"
          />
        </Button>
      );
    },
  };

  AggregationColumn = {
    name: 'aggregation',
    className: b('column', b('column-aggregation')),
    width: '160px',
    sortable: true,
    sortAscending: this.sortAggregationColumn,
    header: <div className={b('header')}>Агрегация</div>,
    render: ({ value, index, row }) => {
      const { types } = this.props;
      const maxTabIndex = (index + 1) * 4;
      const tabIndex = maxTabIndex - 1;

      return (
        <AggregationSelect
          key={index}
          tabIndex={tabIndex}
          field={row}
          types={types}
          selectedAggregation={value}
          onSelect={this.onSelectAggregation}
        />
      );
    },
  };

  DescriptionColumn = {
    name: 'description',
    className: b('column'),
    width: '40%',
    sortable: true,
    sortAscending: this.sortDescriptionColumn,
    header: <div className={b('header')}>Описание</div>,
    render: ({ value, index, row }) => {
      const maxTabIndex = (index + 1) * 4;

      return (
        <CustomTextInput
          cls={b('inp-description')}
          key={index}
          tabIndex={maxTabIndex}
          text={value}
          onFocus={this.onFocusTextInput}
          onBlur={e =>
            this.changeDescription({
              row,
              description: e.target.value,
            })
          }
        />
      );
    },
  };

  MoreColumn = {
    name: 'more',
    className: b('column', b('column-more')),
    width: '70px',
    sortable: false,
    header: null,
    render: ({ row }) => (
      <FieldActionsPopup field={row} onClickItem={this.onClickMoreRowAction} />
    ),
  };

  columns = [
    this.IndexColumn,
    this.TitleColumn,
    this.LinkedDatasetColumn,
    this.FormulaColumn,
    this.HasVerificationRulesColumn,
    this.HasIndexColumn,
    this.HiddenColumn,
    this.CastColumn,
    this.HasArrayColumn,
    this.HasVersionColumn,
    this.AggregationColumn,
    this.DescriptionColumn,
    this.MoreColumn,
  ];

  render() {
    const { fields = [], displayHiddenFields, toggleFilterFieldsByHidden } = this.props;

    return (
      <div ref={this._datasetTableRef} className={b()}>
        <CheckBox
          cls={b('cb-display-hidden-fields')}
          theme="normal"
          size="n"
          view="default"
          tone="default"
          checked={displayHiddenFields}
          onChange={toggleFilterFieldsByHidden}
          text="Отображать скрытые поля"
        />
        <DataTable
          columns={this.columns}
          data={fields}
          emptyDataMessage="Нет данных"
          settings={{
            stickyHead: DataTable.MOVING,
            stickyTop: 0,
            dynamicRender: true,
            dynamicRenderThreshold: 0,
            dynamicRenderUseStaticSize: true,
            syncHeadOnResize: true,
            highlightRows: true,
            stripedRows: false,
            displayIndices: false,
          }}
          rowClassName={() => rowClass}
          onRowClick={this.onRowClick}
          theme={'dataset'}
        />
      </div>
    );
  }
}

export default DatasetTable;
