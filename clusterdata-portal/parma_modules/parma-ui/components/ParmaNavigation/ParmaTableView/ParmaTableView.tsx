import * as React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { ParmaRow } from './ParmaRow/ParmaRow'
import { ParmaTableViewInterface } from './ParmaTableView.interface'
import { ParmaRowModel } from "./ParmaRow/ParmaRow.model";

const blockName = 'parma-table-view'

type ParmaTableViewState = {
  entries: any[], 
  currentEntryContext: object
}

export class ParmaTableView extends React.Component<ParmaTableViewInterface, ParmaTableViewState> {
  constructor(props: ParmaTableViewInterface) {
    super(props)
    this.state = {
      entries: this.props.entries,
      currentEntryContext: this.props.currentEntryContext,
    }
    this.onScroll = this.onScroll.bind(this)
    this.getRowHeight = this.getRowHeight.bind(this)
  }
  
  onScroll = () => {
    if (this.props.currentEntryContext) {
      this.props.onCloseEntryContextMenu()
    }
  }
  
  getRowHeight = () => {
    return this.props.rowHeight
  }

  rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const { entries } = this.state
    const entry = entries[index]
    const iconEntryData = this.props.iconEntry(entry.scope)

    const model = new ParmaRowModel(this.props)

    return (
      <div style={style}>
        <ParmaRow
          {...this.props}
          entry={entry}
          isActive={model.isEntryActive(entry.scope, this.props.clickableScope)}
          iconEntry={iconEntryData}
        />
      </div>
    )
  }

  componentDidUpdate(prevProps: ParmaTableViewInterface) {
    if (this.props.entries !== prevProps.entries) {
      this.setState(state => {
        return { entries: this.props.entries }
      })
    }
  }

  render() {
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
    )
  }
}
