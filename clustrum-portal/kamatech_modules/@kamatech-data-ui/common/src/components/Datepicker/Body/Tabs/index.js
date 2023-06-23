import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import constants from '../../constants';
import locales from '../../locales';

// import './index.scss';

const b = block(constants.cNameBody);
const TAB_TYPES = ['day', 'week', 'month', 'quarter', 'year'];

const getTabsList = (activeTab, lang) => {
  return TAB_TYPES.map(type => {
    return (
      <Tab
        key={`tab-${type}`}
        content={locales[lang].tab[type]}
        isActive={type === activeTab}
        type={type}
      />
    );
  });
};

const Tab = props => {
  const { content, type, isActive } = props;

  return (
    <div className={b('tabs-item', { active: isActive })} data-type={type}>
      {content}
    </div>
  );
};

export default function Tabs(props) {
  const { activeTab, lang, onTabClick } = props;

  return (
    <div className={b('tabs')} onClick={onTabClick}>
      {getTabsList(activeTab, lang)}
    </div>
  );
}

Tabs.propTypes = {
  activeTab: PropTypes.string,
  lang: PropTypes.string,
  onTabClick: PropTypes.func,
};

Tab.propTypes = {
  content: PropTypes.string,
  type: PropTypes.string,
  isActive: PropTypes.bool,
};
