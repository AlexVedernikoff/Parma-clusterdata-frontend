import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import { KamatechRow } from './KamatechRow/KamatechRow';
import { KamatechTableViewInterface } from './KamatechTableView.interface';
import { KamatechRowModel } from './KamatechRow/KamatechRow.model';

const blockName = 'kamatech-table-view';

type KamatechTableViewState = {
  entries: any[];
  currentEntryContext: object;
};

export class KamatechTableView extends React.Component<
  KamatechTableViewInterface,
  KamatechTableViewState
> {
  constructor(props: KamatechTableViewInterface) {
    super(props);
    this.state = {
      entries: this.props.entries,
      currentEntryContext: this.props.currentEntryContext,
    };
    this.onScroll = this.onScroll.bind(this);
    this.getRowHeight = this.getRowHeight.bind(this);
  }

  onScroll = (): void => {
    if (this.props.currentEntryContext) {
      this.props.onCloseEntryContextMenu();
    }
  };

  getRowHeight = (): number => {
    return this.props.rowHeight;
  };

  rowRenderer = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }): JSX.Element => {
    const { entries } = this.state;
    const entry = entries[index];
    const iconEntryData = this.props.iconEntry(entry.scope);

    const model = new KamatechRowModel(this.props);

    return (
      <div style={style}>
        <KamatechRow
          {...this.props}
          entry={entry}
          isActive={model.isEntryActive(entry.scope, this.props.clickableScope)}
          iconEntry={iconEntryData}
        />
      </div>
    );
  };

  componentDidUpdate(prevProps: KamatechTableViewInterface): void {
    if (this.props.entries !== prevProps.entries) {
      this.setState(state => {
        return { entries: this.props.entries };
      });
    }
  }

  render(): JSX.Element {
    return (
      <div className={blockName}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              className={`${blockName}__list`}
              height={height}
              itemCount={this.state.entries.length}
              itemSize={this.getRowHeight}
              itemData={this.state.entries}
              width={width}
              onScroll={this.onScroll}
            >
              {this.rowRenderer}
            </List>
          )}
        </AutoSizer>
      </div>
    );
  }
}
