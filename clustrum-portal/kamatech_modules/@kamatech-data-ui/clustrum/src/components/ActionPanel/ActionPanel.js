import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import EntryPanel from './components/EntryPanel/EntryPanel';

// import './ActionPanel.scss';

const b = block('action-panel');

class ActionPanel extends React.Component {
  static propTypes = {
    entryId: PropTypes.string,
    entry: PropTypes.object,
    sdk: PropTypes.object.isRequired,
    additionalEntryItems: PropTypes.array,
    rightItems: PropTypes.array,
    children: PropTypes.array,
    openCreationWidgetPage: PropTypes.func,
    className: PropTypes.string,
    isBuild: PropTypes.bool,
  };

  static EntryPanel = EntryPanel;

  state = {
    entry: null,
  };

  async componentDidMount() {
    const { sdk, entryId, entry } = this.props;

    let resultEntry = null;
    if (entryId) {
      resultEntry = await sdk.getEntry({ entryId });
    } else if (entry) {
      resultEntry = entry;
    }

    this.setState({
      entry: resultEntry,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entry && nextProps.entry !== this.state.entry) {
      this.setState({
        entry: nextProps.entry,
      });
    }
  }

  render() {
    const {
      children,
      sdk,
      additionalEntryItems,
      rightItems,
      className: mix,
      isBuild,
    } = this.props;

    const { entry } = this.state;

    const className = b(false, mix);

    if (children) {
      return <div className={className}>{children}</div>;
    } else {
      if (entry) {
        return (
          <div className={className}>
            <EntryPanel
              sdk={sdk}
              entry={entry}
              additionalEntryItems={additionalEntryItems}
              rightItems={rightItems}
              isBuild={isBuild}
            />
          </div>
        );
      } else {
        return (
          <div className={className}>
            <div className={'dl-entry-panel'}></div>
            {rightItems.length && rightItems.map(RightItems => RightItems)}
          </div>
        );
      }
    }
  }
}

export default ActionPanel;
