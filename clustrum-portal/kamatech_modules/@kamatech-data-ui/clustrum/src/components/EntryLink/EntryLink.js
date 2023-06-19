import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import EntryIcon from '../EntryIcon/EntryIcon';

// import './EntryLink.scss';

const b = block('yc-entry-link');

const getEntryName = ({ key }) => {
  if (!key) {
    return '';
  }
  const parts = key.split('/');
  const len = parts.length;
  return parts[key.slice(-1) === '/' ? len - 2 : len - 1];
};

const sizeIconBySize = size => {
  switch (size) {
    case 's':
      return '16';
    default:
      return '24';
  }
};

function Icon({ entry, size }) {
  const iconSize = sizeIconBySize(size);
  return (
    <div className={b('icon')}>
      <EntryIcon entry={entry} width={iconSize} height={iconSize} />
    </div>
  );
}

class EntryLink extends React.PureComponent {
  static propTypes = {
    entry: PropTypes.shape({
      key: PropTypes.string,
      scope: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
    size: PropTypes.oneOf(['s']),
    onClick: PropTypes.func,
    hasIcon: PropTypes.bool,
    entryId: PropTypes.string,
    sdk: PropTypes.shape({
      getEntryMeta: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    hasIcon: true,
    theme: 'title',
  };

  state = {
    entry: this.props.entry,
  };

  async componentDidMount() {
    const { entryId, sdk } = this.props;

    if (entryId && sdk) {
      try {
        const entry = await sdk.getEntryMeta({ entryId });
        this.setState({ entry });
      } catch (error) {
        console.error('ENTRY_TITLE_GET_ENTRY_META', error);
      }
    }
  }

  render() {
    const { entry } = this.state;
    if (entry) {
      const { size, onClick, hasIcon } = this.props;
      const entryName = getEntryName(entry);
      const isClickable = typeof onClick === 'function';
      return (
        <div
          className={b({ pointer: isClickable, size })}
          onClick={isClickable ? onClick : undefined}
        >
          {hasIcon && <Icon entry={entry} size={size} />}
          <div className={b('text')}>{entryName}</div>
        </div>
      );
    }

    return null;
  }
}

export default EntryLink;
