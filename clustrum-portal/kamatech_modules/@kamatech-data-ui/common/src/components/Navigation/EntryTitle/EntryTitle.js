import React from 'react';
import PropTypes from 'prop-types';
import EntryIcon from '../EntryIcon/EntryIcon';
import block from 'bem-cn-lite';
// import './EntryTitle.scss';

const b = block('yc-entry-title');

const getEntryName = ({ key }) => {
  if (!key) {
    return '';
  }
  const parts = key.split('/');
  const len = parts.length;
  return parts[key.slice(-1) === '/' ? len - 2 : len - 1];
};

const sizeIconByTheme = theme => {
  switch (theme) {
    case 'title':
    case 'header':
      return '24';
    case 'inline':
      return '22';
    default:
      return '24';
  }
};

const iconSwitcher = (entry, theme) => {
  const iconSize = sizeIconByTheme(theme);
  return <EntryIcon entry={entry} width={iconSize} height={iconSize} />;
};

const EntryTitle = props => {
  const { entry, theme } = props;
  const entryName = getEntryName(entry);
  const isClicked = typeof props.onClick === 'function';
  return (
    <div
      className={b({ pointer: isClicked, theme })}
      onClick={isClicked ? props.onClick : undefined}
    >
      {props.hasIcon && <div className={b('icon')}>{iconSwitcher(entry, theme)}</div>}
      <div className={b('text')}>{entryName}</div>
    </div>
  );
};

EntryTitle.propTypes = {
  entry: PropTypes.shape({
    key: PropTypes.string,
    scope: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  theme: PropTypes.oneOf(['header', 'inline', 'title']),
  onClick: PropTypes.func,
  hasIcon: PropTypes.bool,
};

EntryTitle.defaultProps = {
  hasIcon: true,
  theme: 'title',
};

export default EntryTitle;
