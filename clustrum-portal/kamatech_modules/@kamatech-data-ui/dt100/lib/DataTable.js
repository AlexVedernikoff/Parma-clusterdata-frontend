import React from 'react';
import PropTypes from 'prop-types';
import ReactList from 'react-list';
import cn from 'bem-cn-lite';
import { positionStickySupported } from './featureSupport';
import { getSortOrder, getIndexedData, getSortedData } from './util';
import { ASCENDING, DESCENDING, LEFT, RIGHT, CENTER, FIXED, MOVING, INDEX_COLUMN } from './constants';
import { SIGNAL } from '@kamatech-data-ui/types/signal-types';
import { SignalContext } from '@kamatech-data-ui/context/SignalContext';
import { ORDER } from '../../common/src/components/Navigation/constants';
import { TableTheme } from './TableTheme';

const b = cn('data-table');

const ICON_ASC = (
  <svg className={b('icon')} viewBox="0 0 10 6" width="10" height="6">
    <path fill="currentColor" d="M0 5h10l-5 -5z" />
  </svg>
);

const ICON_DESC = (
  <svg className={b('icon')} viewBox="0 0 10 6" width="10" height="6">
    <path fill="currentColor" d="M0 1h10l-5 5z" />
  </svg>
);

const ICONS = {
  ICON_ASC,
  ICON_DESC,
};

function getSortIcon(order) {
  switch (order) {
    case ASCENDING:
      return ICONS.ICON_ASC;
    case DESCENDING:
      return ICONS.ICON_DESC;
    default:
      return false;
  }
}

const ColumnSortIcon = ({ sortOrder, sortIndex, sortable, defaultOrder }) => {
  if (sortable) {
    return (
      <span
        className={b('sort-icon', {
          shadow: !sortOrder,
          asc: sortOrder === ASCENDING,
          desc: sortOrder === DESCENDING,
        })}
        data-index={sortIndex}
      >
        {getSortIcon(sortOrder || defaultOrder)}
      </span>
    );
  } else {
    return false;
  }
};

ColumnSortIcon.propTypes = {
  sortOrder: PropTypes.oneOf([ASCENDING, DESCENDING]),
  sortable: PropTypes.bool,
  defaultOrder: PropTypes.oneOf([ASCENDING, DESCENDING]),
};

class TableRow extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    columns: PropTypes.array,
    row: PropTypes.object,
    index: PropTypes.number,
    odd: PropTypes.bool,
    footer: PropTypes.bool,
    onClick: PropTypes.func,
    selectedRow: PropTypes.object,
  };
  static defaultProps = {
    footer: false,
  };
  onClick = event => {
    if (this.props.onClick) {
      const { row, index } = this.props;
      this.props.onClick(row, index, event);
    }
  };

  checkRowSelection = (selectedRow, row) => {
    if (selectedRow) {
      for (let r in row) {
        if (selectedRow[row[r].resultShemaId] === row[r].value && row[r].isGroupField) return true;
      }
    }
    return false;
  };

  checkValueSelection = (selectedRow, value) => {
    return selectedRow && selectedRow[value.resultShemaId] === value.value;
  };

  render() {
    const { className, columns, row, index, odd, footer, selectedRow } = this.props;
    const isRowSelected = this.checkRowSelection(selectedRow, row);
    const classNameRow = b('row', { odd, footer }, className) + (isRowSelected ? ' selected' : '');

    return (
      <tr className={classNameRow} onClick={this.onClick}>
        {columns.map((column, columnIndex) => {
          const value = column._getValue(row);
          const isValueSelected = this.checkValueSelection(selectedRow, value);
          const classNameValue = column._className + (isValueSelected ? ' selected' : '');

          return (
            <td
              key={columnIndex}
              className={classNameValue}
              title={column._getTitle(row)}
              style={column.customStyle({ row, index, name: column.name, header: false, footer })}
              onClick={column._getOnClick({ row, index, footer })}
            >
              {footer ? (
                <div className={b('footer')}>{column._renderValue({ value, row, index, footer })}</div>
              ) : (
                column._renderValue({ value, row, index, footer })
              )}
            </td>
          );
        })}
      </tr>
    );
  }
}

class TableHead extends React.Component {
  static propTypes = {
    headColumns: PropTypes.array.isRequired,
    dataColumns: PropTypes.array.isRequired,
    displayIndices: PropTypes.bool.isRequired,
    onSort: PropTypes.func,
    onColumnsUpdated: PropTypes.func,
  };
  static defaultProps = {};
  componentDidMount() {
    this._calculateColumnsWidth();
  }

  componentDidUpdate() {
    this._calculateColumnsWidth();
  }
  renderedColumns = [];
  _getColumnRef = index => {
    return node => {
      this.renderedColumns[index] = node;
    };
  };
  _calculateColumnsWidth() {
    const { onColumnsUpdated } = this.props;
    const widths = this.renderedColumns.map(col => col && col.getBoundingClientRect().width);
    if (typeof onColumnsUpdated === 'function') {
      onColumnsUpdated(widths);
    }
  }
  onSort(column, multisort) {
    const { onSort } = this.props;
    if (typeof onSort === 'function') {
      onSort(column, multisort);
    }
  }
  _getonOrderByClickInWizard(column) {
    const { sortable = false, name } = column;
    if (name === INDEX_COLUMN) {
      return () => {
        this.onSort();
      };
    }
    return sortable
      ? event => {
        this.onSort(column, event.ctrlKey);
      }
      : undefined;
  }
  renderHeadCell = headCell => {
    const { column, rowSpan, colSpan } = headCell;
    const { sortable = false, header = column.name, className, index, columnIndex, align } = column;

    const { headerTitle = (typeof header === 'string' && header) || undefined } = column;

    return (
      <th
        ref={column.dataColumn && this._getColumnRef(columnIndex)}
        className={b('th', { sortable, align }, className)}
        key={column.name}
        title={headerTitle}
        data-index={index}
        colSpan={colSpan}
        rowSpan={rowSpan}
        style={column.customStyle && column.customStyle({ header: true, name: column.name })}
        onClick={this._getonOrderByClickInWizard(column)}
      >
        <div
          className={b('head-cell')}
          title={header && header.props && header.props.children ? header.props.children : ''}
        >
          {header}
          {<ColumnSortIcon {...column} />}
        </div>
      </th>
    );
  };
  renderHeadLevel = (row, rowIndex) => {
    return (
      <tr key={rowIndex} className={b('head-row')}>
        {row.map(this.renderHeadCell)}
      </tr>
    );
  };
  render() {
    const { headColumns, dataColumns } = this.props;
    this.renderedColumns.length = dataColumns.length;
    return <thead className={b('head')}>{headColumns.map(this.renderHeadLevel)}</thead>;
  }
}

class TableFooter extends React.Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    rowClassName: PropTypes.func,
  };

  static defaultProps = {
    columns: [],
    data: [],
  };

  renderFootLevel = (row, index) => {
    const { columns, rowClassName } = this.props;

    const className = typeof rowClassName === 'function' ? rowClassName(row) : '';
    const footerColumns = this._getColumnsWithoutOnClick(columns);

    return <TableRow key={index} className={className} row={row} index={index} footer={true} columns={footerColumns} />;
  };

  _getColumnsWithoutOnClick(columns) {
    const columnsWithoutOnClick = columns.map(column => ({ ...column }));

    columnsWithoutOnClick.forEach(column => {
      column._getOnClick = () => undefined;
    });

    return columnsWithoutOnClick;
  }

  render() {
    const { data } = this.props;

    // tfoot - строка итогов внизу
    // thead - строка итогов вверху
    return Boolean(data.length) && <thead className={b('foot')}>{data.map(this.renderFootLevel)}</thead>;
  }
}

class StickyHead extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf([FIXED, MOVING]),
    top: PropTypes.number,
  };
  static defaultProps = {
    top: 0,
  };
  state = {};
  _nodeRef = node => {
    this._node = node;
  };
  setScrollLeft(scrollLeft) {
    requestAnimationFrame(() => {
      if (this._node) {
        this._node.scrollLeft = scrollLeft;
      }
    });
  }
  setRightPosition(value) {
    if (this.state.right !== value && !this.props.top) {
      this.setState({ right: value });
    }
  }
  renderHeader(props) {
    const { widths = [] } = this.state;
    const totalWidth = widths.reduce((sum, val) => sum + val, 0);
    return (
      <div className={b('table-wrapper', { sticky: true })}>
        <table className={b('table', { sticky: true })} style={{ width: totalWidth || 'auto' }}>
          <colgroup>
            {widths.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <TableHead columnsLength={props.dataColumns.length} {...props} />
        </table>
      </div>
    );
  }
  render() {
    const { mode, top, ...props } = this.props;
    if (mode === MOVING) {
      return (
        <div className={b('sticky', { moving: true })} style={{ top }}>
          {this.renderHeader(props)}
        </div>
      );
    } else {
      const { widths = [], right = 0 } = this.state;
      const totalWidth = widths.reduce((sum, val) => sum + val, 0);
      return (
        <div
          ref={this._nodeRef}
          className={b('sticky', { fixed: true })}
          style={{ right: right, display: totalWidth ? undefined : 'none' }}
        >
          {this.renderHeader(props)}
        </div>
      );
    }
  }
}

class Table extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    settings: PropTypes.object,
    refs: PropTypes.object,
    data: PropTypes.array,
    footerData: PropTypes.array,
    columns: PropTypes.object,
    emptyDataMessage: PropTypes.string,
    onRowClick: PropTypes.func,
    rowClassName: PropTypes.func,
    startIndex: PropTypes.number,
    onSort: PropTypes.func,
    renderEmptyRow: PropTypes.func,
    selectedRow: PropTypes.object,
  };

  componentDidMount() {
    const { stickyHead, syncHeadOnResize } = this.props.settings;

    this._updateBoxConstraints();
    if (stickyHead && syncHeadOnResize && !this._onWindowResize) {
      this._onWindowResize = () => {
        this.syncHeadWidths();
      };
      window.addEventListener('resize', this._onWindowResize);
    }
  }

  componentDidUpdate() {
    this._updateBoxConstraints();
  }

  componentWillUnmount() {
    if (this._onWindowResize) {
      window.removeEventListener('resize', this._onWindowResize);
      delete this._onWindowResize;
    }
  }

  _refBody = node => {
    this._body = node;
  };
  _refBox = node => {
    this._box = node;
  };
  _refHead = node => {
    this._head = node;
  };
  _refStickyHead = node => {
    this._stickyHead = node;
  };

  _onBoxScroll = () => {
    if (this._box && this._stickyHead) {
      this._updateBoxConstraints();
    }
  };
  _updateBoxConstraints() {
    if (this._box && this._stickyHead) {
      const scrollWidth = this._box.offsetWidth - this._box.clientWidth;
      this._stickyHead.setRightPosition(scrollWidth);
      this._stickyHead.setScrollLeft(this._box.scrollLeft);
    }
  }

  _onColumnsUpdated = widths => {
    if (this._stickyHead) {
      this._stickyHead.setState({ widths });
    }
  };

  syncHeadWidths() {
    if (this._head) {
      this._head._calculateColumnsWidth();
    }
  }

  _getEmptyRow() {
    const {
      columns: { dataColumns },
      emptyDataMessage,
      renderEmptyRow,
    } = this.props;
    if (typeof renderEmptyRow === 'function') {
      return renderEmptyRow(dataColumns);
    } else {
      return (
        <tr className={b('row')}>
          <td className={b('td', b('no-data'))} colSpan={dataColumns.length}>
            {emptyDataMessage}
          </td>
        </tr>
      );
    }
  }

  renderHead() {
    const { columns, onSort } = this.props;
    const { displayIndices } = this.props.settings;
    return (
      <TableHead
        ref={this._refHead}
        {...columns}
        displayIndices={displayIndices}
        onSort={onSort}
        onColumnsUpdated={this._onColumnsUpdated}
      />
    );
  }
  renderStickyHead() {
    const { columns, onSort } = this.props;
    const { displayIndices, stickyTop, stickyHead } = this.props.settings;
    const top =
      stickyTop === 'auto' && this._body && this._body.parentNode
        ? this._body.parentNode.offsetTop
        : Number(stickyTop) || 0;
    return (
      <StickyHead
        mode={stickyHead}
        top={top}
        ref={this._refStickyHead}
        {...columns}
        displayIndices={displayIndices}
        onSort={onSort}
      />
    );
  }
  renderRow = vIndex => {
    const {
      data,
      columns: { dataColumns },
      rowClassName,
      onRowClick,
      selectedRow,
    } = this.props;
    const { row, index } = data[vIndex];
    const className = typeof rowClassName === 'function' ? rowClassName(row) : '';
    return (
      <TableRow
        key={index}
        className={className}
        onClick={onRowClick}
        row={row}
        index={index}
        odd={vIndex % 2 === 0}
        columns={dataColumns}
        selectedRow={selectedRow}
      />
    );
  };
  renderTable = (items, ref) => {
    const {
      footerData,
      columns: { dataColumns },
      rowClassName,
    } = this.props;

    return (
      <div className={b('table-wrapper')}>
        <table className={b('table')}>
          <colgroup>
            {dataColumns.map(({ width }, index) => {
              return <col key={index} width={width} />;
            })}
          </colgroup>
          {this.renderHead()}
          {Boolean(footerData) && <TableFooter columns={dataColumns} data={footerData} rowClassName={rowClassName} />}
          <tbody ref={ref}>{items.length ? items : this._getEmptyRow()}</tbody>
        </table>
      </div>
    );
  };
  renderTableDynamic() {
    const {
      data,
      settings: { dynamicRenderType = 'uniform', dynamicRenderUseStaticSize, dynamicRenderThreshold } = {},
    } = this.props;

    return (
      <ReactList
        type={dynamicRenderType}
        useStaticSize={dynamicRenderUseStaticSize}
        threshold={dynamicRenderThreshold}
        length={data.length}
        itemRenderer={this.renderRow}
        itemsRenderer={this.renderTable}
      />
    );
  }
  renderTableSimple() {
    const { data } = this.props;
    const rows = data.map((row, index) => this.renderRow(index, index));
    return this.renderTable(rows);
  }
  render() {
    const { className } = this.props;
    const { stickyHead, dynamicRender } = this.props.settings;
    return (
      <div className={className} ref={this._refBody}>
        {stickyHead && this.renderStickyHead()}
        <div ref={this._refBox} className={b('box', { sticky: stickyHead })} onScroll={this._onBoxScroll}>
          {dynamicRender ? this.renderTableDynamic() : this.renderTableSimple()}
        </div>
      </div>
    );
  }
}

const MemoizedCell = React.memo(props => {
  // eslint-disable-line react/display-name
  const { column, value, row, index, footer } = props; // eslint-disable-line react/prop-types

  return column.render({ value, row, index, footer });
});

class DataTableView extends React.Component {
  constructor(props) {
    super(props);
    this._resetSort = this._resetSort.bind(this);
  }

  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    footerData: PropTypes.array,
    startIndex: PropTypes.number,
    emptyDataMessage: PropTypes.string,
    renderEmptyRow: PropTypes.func,
    rowClassName: PropTypes.func,
    initialSortOrder: PropTypes.shape({
      columnId: PropTypes.string,
      order: PropTypes.oneOf([ASCENDING, DESCENDING]),
    }),
    settings: PropTypes.shape({
      displayIndices: PropTypes.bool,
      stickyHead: PropTypes.oneOf([false, FIXED, MOVING]),
      stickyTop: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
      sortable: PropTypes.bool,
      highlightRows: PropTypes.bool,
      stripedRows: PropTypes.bool,
      headerMod: PropTypes.oneOf(['multiline', 'pre']),
      defaultOrder: PropTypes.oneOf([ASCENDING, DESCENDING]),
      syncHeadOnResize: PropTypes.bool,
    }),
    theme: PropTypes.string,
    selectedRow: PropTypes.object,
    orderBy: PropTypes.object,
    onStateAndParamsChange: PropTypes.func,
    onOrderByClickInWizard: PropTypes.func,
  };
  static defaultProps = {
    startIndex: 0,
    emptyDataMessage: 'No data',
    settings: {
      displayIndices: true,
      stickyHead: false,
      sortable: true,
      defaultOrder: ASCENDING,
    },
    initialSortOrder: {},
    initialSortColumns: [],
    theme: 'internal',
  };

  static contextType = SignalContext;

  static getSortedData(data, dataColumns, columnOrder = {}) {
    const { columnId, order } = columnOrder;
    const column = dataColumns.find(item => item.name === columnId);
    const indexedData = data.map((row, index) => ({ row, index }));
    if (column) {
      const compareValue = order;
      if (typeof column.sortAscending === 'function') {
        indexedData.sort(column.sortAscending);
        if (order === DESCENDING) {
          indexedData.reverse();
        }
      } else {
        indexedData.sort((row1, row2) => {
          const value1 = column._getSortValue(row1.row);
          const value2 = column._getSortValue(row2.row);
          if (value1 < value2) {
            return -compareValue;
          }
          if (value1 > value2) {
            return compareValue;
          }
          /* eslint-disable no-eq-null, eqeqeq */
          // Comparison with null made here intentionally
          // to exclude multiple comparison with undefined and null
          if (value1 == null && value2 != null) {
            return 1;
          }
          if (value2 == null && value1 != null) {
            return -1;
          }
          /* eslint-enable no-eq-null, eqeqeq */
          return (row1.index - row2.index) * compareValue;
        });
      }
    }

    return indexedData;
  }

  static getStickyHead({ stickyHead = false }) {
    if (stickyHead === MOVING && !positionStickySupported) {
      console.warn('Your browser does not support position: sticky, moving sticky headers will be disabled.');
      return false;
    }
    return stickyHead;
  }

  static calculateSettings(nextSettings) {
    return {
      ...DataTableView.defaultProps.settings,
      ...nextSettings,
      stickyHead: DataTableView.getStickyHead(nextSettings),
    };
  }

  static getIndexColumn({ startIndex, data }) {
    const lastIndex = startIndex + data.length + 1;

    return {
      name: INDEX_COLUMN,
      header: '#',
      className: b('index'),
      render: ({ row, index, footer }) => {
        return footer ? row.footerIndex || startIndex + index : startIndex + index;
      },
      sortable: false,
      width: 20 + Math.ceil(Math.log10(lastIndex)) * 10,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const settings = DataTableView.calculateSettings(nextProps.settings);
    return {
      settings,
      indexColumn: Boolean(settings.displayIndices) && DataTableView.getIndexColumn(nextProps),
    };
  }

  state = {
    sortOrder: this.props.initialSortOrder,
    sortColumns: this.props.initialSortColumns,
  };

  componentDidMount() {
    this.context.subscribe(SIGNAL.RESET_FILTERS, this._resetSort);
  }

  componentWillUnmount() {
    this.context.unSubscribe(SIGNAL.RESET_FILTERS, this._resetSort);
  }

  _resetSort() {
    this.setState({ sortOrder: {}, sortColumns: [] });
  }

  _tableRef = node => {
    this.table = node;
  };

  renderMemoizedCell = ({ column, value, row, index, footer }) => {
    return (
      <MemoizedCell
        {...{
          column,
          value,
          row,
          index,
          footer,
        }}
      />
    );
  };

  getColumn = (column, columnIndex) => {
    const { settings } = this.state;
    const { defaultOrder } = settings;
    const { sortOrder = {}, sortColumns, indexColumn } = this.state;
    const indexAdjustment = Number(Boolean(indexColumn));

    const isSortEnabled = this.isSortEnabled();

    const { name, accessor = column.name, align, sortable = settings.sortable } = column;
    const _className = b('td', { align }, column.className);

    const _getValue =
      typeof accessor === 'function'
        ? row => accessor(row)
        : row => {
          return row.hasOwnProperty(accessor) ? row[accessor] : undefined;
        };

    const _getTitle =
      typeof column.title === 'function'
        ? row => column.title(row)
        : () => (typeof column.title === 'string' && column.title) || undefined;

    const _getSortValue = typeof column.sortAccessor === 'function' ? row => column.sortAccessor(row) : _getValue;

    const _renderValue =
      typeof column.render === 'function'
        ? ({ value, row, index, footer }) => this.renderMemoizedCell({ column, value, row, index, footer })
        : ({ value }) => value.value;

    const customStyle = typeof column.customStyle === 'function' ? column.customStyle : () => undefined;

    const _getOnClick =
      typeof column.onClick === 'function' ? row => event => column.onClick(row, column, event) : () => undefined;

    return {
      index: columnIndex - indexAdjustment,
      columnIndex,
      dataColumn: true,
      defaultOrder,
      ...column,
      sortable: sortable && isSortEnabled,
      _className,
      _getValue,
      _getTitle,
      _getSortValue,
      _renderValue,
      _getOnClick,
      customStyle,
      sortOrder: sortOrder[name] || undefined,
      sortIndex: sortColumns.length > 1 ? sortColumns.indexOf(name) + 1 : undefined,
    };
  };

  getComplexColumns(columns) {
    const headColumns = [];
    const dataColumns = [];
    const headCells = [];

    const { indexColumn } = this.state;
    const allColumns = indexColumn ? [indexColumn, ...columns] : columns;

    const processLevel = (list, level) => {
      if (!headColumns[level]) {
        headColumns[level] = [];
      }
      const items = headColumns[level];
      return list.reduce((subCount, item) => {
        let colSpan = 1;
        let itemLevel = -1;
        let column = item;
        if (Array.isArray(item.sub)) {
          colSpan = processLevel(item.sub, level + 1);
        } else {
          column = this.getColumn(item, dataColumns.length);
          dataColumns.push(column);
          itemLevel = level;
        }
        const headCell = { column, itemLevel, colSpan };
        headCells.push(headCell);
        items.push(headCell);
        return colSpan + subCount;
      }, 0);
    };

    processLevel(allColumns, 0);
    headCells.forEach(cell => {
      cell.rowSpan = cell.itemLevel < 0 ? 1 : headColumns.length - cell.itemLevel;
    });

    return { headColumns, dataColumns };
  }

  isSortEnabled = () => {
    const { data } = this.props;
    return Array.isArray(data) && data.length > 1;
  };

  onSort = (column, multisort) => {
    const { onStateAndParamsChange: onOrderByClickInDash, onOrderByClickInWizard } = this.props;

    if (column) {
      const { sortOrder, sortColumns } = getSortOrder(column, this.state, multisort, this.props.settings);
      const sortingDirection = this.sortingDirection(sortOrder, sortColumns);

      if (onOrderByClickInDash) {
        onOrderByClickInDash({ direction: sortingDirection, field: column.resultSchemaId });
      } else if (onOrderByClickInWizard) {
        onOrderByClickInWizard(sortingDirection, column.resultSchemaId);
      }

      this.setState({ sortOrder, sortColumns });

      return;
    }

    if (onOrderByClickInDash) {
      onOrderByClickInDash({});
    } else if (onOrderByClickInWizard) {
      onOrderByClickInWizard();
    }

    this.setState({ sortOrder: {}, sortColumns: [] });
  };

  sortingDirection(sortOrder, sortColumns) {
    const direction = sortOrder[sortColumns[0]];

    if (direction === ASCENDING) {
      return ORDER.ASC;
    }

    if (direction === DESCENDING) {
      return ORDER.DESC;
    }

    return null;
  }

  resize() {
    if (this.table) {
      this.table.syncHeadWidths();
    }
  }

  _dataForTableByTableTheme(tableTheme, data, dataColumns, sortParams) {
    switch (tableTheme) {
      case TableTheme.CHARTKIT:
        return getIndexedData(data);
      default:
        return getSortedData(data, dataColumns.dataColumns, sortParams);
    }
  }

  render() {
    const {
      data,
      footerData,
      columns,
      startIndex,
      emptyDataMessage,
      rowClassName,
      onRowClick,
      theme,
      renderEmptyRow,
      selectedRow,
    } = this.props;
    const { settings, sortOrder, sortColumns } = this.state;
    const { highlightRows = false, stripedRows = false, headerMod = false } = settings;
    const tableClassName = b({
      'highlight-rows': highlightRows,
      'striped-rows': stripedRows,
      header: headerMod,
      theme: theme,
    });

    const dataColumns = this.getComplexColumns(columns);
    return (
      <Table
        ref={this._tableRef}
        className={tableClassName}
        settings={settings}
        startIndex={startIndex}
        columns={dataColumns}
        emptyDataMessage={emptyDataMessage}
        renderEmptyRow={renderEmptyRow}
        rowClassName={rowClassName}
        onRowClick={onRowClick}
        data={this._dataForTableByTableTheme(theme, data, dataColumns, { sortOrder, sortColumns })}
        footerData={footerData}
        onSort={this.onSort}
        selectedRow={selectedRow}
      />
    );
  }
}

export default class DataTable extends React.PureComponent {
  static FIXED = FIXED;
  static MOVING = MOVING;

  static ASCENDING = ASCENDING;
  static DESCENDING = DESCENDING;

  static LEFT = LEFT;
  static CENTER = CENTER;
  static RIGHT = RIGHT;

  static setCustomIcons(customIcons) {
    ICONS.ICON_ASC = customIcons.ICON_ASC || ICON_ASC;
    ICONS.ICON_DESC = customIcons.ICON_DESC || ICON_DESC;
  }

  state = {};
  componentDidCatch(error) {
    console.error(error);
    this.setState({
      error,
    });
  }
  _tableRef = node => {
    this.table = node;
  };
  resize() {
    if (this.table) {
      this.table.resize();
    }
  }
  render() {
    const { error } = this.state;
    if (!this.props.theme) {
      console.warn("Starting from dt100@1.4.0 'theme' prop should be passed into the component");
    }
    if (error) {
      return (
        <pre className={b('error')}>
          DT100 got stuck in invalid state. Please tell developers about it.
          {'\n\n'}
          {(error.stack && String(error.stack)) || String(error)}
        </pre>
      );
    } else {
      return <DataTableView ref={this._tableRef} {...this.props} />;
    }
  }
}

DataTable.propTypes = DataTableView.propTypes;
DataTable.displayName = 'DT100';
