import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'lego-on-react';
import { Icon } from '@kamatech-data-ui/common/src';
import { ITEM_TYPE } from '../../modules/constants/constants';
import { getCurrentPageTabs } from '../../store/selectors/dash';
import { setPageTab, toggleTableOfContent } from '../../store/actions/dash';
import iconPreviewClose from '@kamatech-data-ui/clustrum/src/icons/preview-close.svg';
import iconArrowSidebar from '@kamatech-data-ui/clustrum/src/icons/arrow-sidebar.svg';
import { i18n } from '@kamatech-data-ui/clustrum';
import { appendSearchParams } from '../../helpers/QueryParams';

const b = block('table-of-content');

class TableOfContent extends React.PureComponent {
  static scrollIntoView(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  }

  static propTypes = {
    opened: PropTypes.bool.isRequired,
    tabs: PropTypes.array.isRequired,
    tabId: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    setPageTab: PropTypes.func.isRequired,
    toggleTableOfContent: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { hash } = this.props.location;
    if (hash) {
      TableOfContent.scrollIntoView(hash.replace('#', ''));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.opened !== prevProps.opened) {
      // чтобы пересчитался ReactGridLayout
      const customEvent = new CustomEvent('resize');
      customEvent.initEvent('resize');
      // ресайз после открытия/закрытия оглавления
      setTimeout(() => window.dispatchEvent(customEvent), 200);
    }
  }

  render() {
    const tabs = this.props.tabs.reduce((result, { id, title, items }) => {
      result.push({
        id,
        title,
        items: items
          .filter(({ type, data }) => type === ITEM_TYPE.TITLE && data.showInTOC)
          .map(({ id, data: { text: title } }) => ({ id, title })),
      });
      return result;
    }, []);

    if (tabs.length === 1 && !tabs[0].items.length) {
      return null;
    }

    const { opened, toggleTableOfContent } = this.props;

    return (
      <React.Fragment>
        <Button
          view="classic"
          theme="raised"
          pin="circle-circle"
          size="m"
          title={i18n('dash.table-of-content.view', 'context_table-of-content')}
          cls={b('toggle', { opened })}
          onClick={() => toggleTableOfContent(!opened)}
        >
          <Icon className={b('arrow', { opened })} data={iconArrowSidebar} width="16" height="16" />
        </Button>
        <div className={b()}>
          {/*<div className={b('hidebar')}>*/}
          <div className={b('sidebar', { opened })}>
            <div className={b('header')}>
              <span className={b('header-title')}>{i18n('dash.table-of-content.view', 'label_table-of-content')}</span>
              <Icon
                className={b('header-close')}
                data={iconPreviewClose}
                width="20"
                onClick={() => toggleTableOfContent(false)}
              />
            </div>
            {tabs.map(tab => (
              <div className={b('tabs')} key={tab.id}>
                <Link
                  to={{
                    ...this.props.location,
                    search: appendSearchParams(this.props.location.search, { tab: tab.id }),
                  }}
                  className={b('title', { selected: tab.id === this.props.tabId })}
                  onClick={() => this.props.setPageTab(tab.id)}
                >
                  {tab.title}
                </Link>
                <div className={b('items')}>
                  {tab.items.map(item => (
                    <Link
                      to={{
                        ...this.props.location,
                        search: appendSearchParams(this.props.location.search, { tab: tab.id }),
                        hash: `#${encodeURIComponent(item.title)}`,
                      }}
                      className={b('title', { item: true })}
                      onClick={() => {
                        const title = encodeURIComponent(item.title);
                        const tabId = tab.id;
                        if (tabId === this.props.tabId) {
                          TableOfContent.scrollIntoView(title);
                        } else {
                          this.props.setPageTab(tabId);
                          setTimeout(() => TableOfContent.scrollIntoView(title), 0);
                        }
                      }}
                      key={item.id}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/*</div>*/}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  opened: state.dash.showTableOfContent,
  tabs: getCurrentPageTabs(state),
  tabId: state.dash.tabId,
  location: state.router.location,
});

const mapDispatchToProps = {
  setPageTab,
  // это понадобилось в частности для того, чтобы фон был на всю высоту контента дашборда,
  // а не только на высоту контента оглавления
  toggleTableOfContent,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(TableOfContent);
