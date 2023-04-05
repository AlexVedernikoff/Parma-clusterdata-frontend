import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import constants from '../../constants';
import utils from '../../utils';

// import './index.scss';

const b = block(constants.cNameBody);
const LIFTED_TITLE_CL = 'month_lifted-title';
const SCROLL_CL = 'scroll';
const TITLE_TOP_OFFSET = 40;
const LIFTED_TITLE_TOP_OFFSET = 47;
const THRESHOLD_MAP = {
  day: 300,
  week: 300,
  month: 125,
  quarter: 100,
  year: 100,
};

export default class Content extends React.PureComponent {
  static propTypes = {
    content: PropTypes.array,
    type: PropTypes.string,
    scale: PropTypes.string,
    date: PropTypes.object,
    mouseEvents: PropTypes.array,
    addContent: PropTypes.func,
    onContentClick: PropTypes.func,
    setSwitcherData: PropTypes.func,
    showApply: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.scrollContentRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      const scrollBarWidth = this.getScrollBarWidth();

      if (scrollBarWidth) {
        this.ref.current.classList.add(SCROLL_CL);
      }

      this.scrollToDate(this.props.date);

      const browser = utils.checkBrowser();

      this.isScrollOffsetNeeded = browser === 'Firefox' || browser === 'Safari';

      this.scrollContentRef.current.addEventListener('scroll', this.onScroll);
    }, 0);
  }

  componentWillUnmount() {
    this.scrollContentRef.current.removeEventListener('scroll', this.onScroll);
  }

  getScrollBarWidth() {
    const contentNode = this.scrollContentRef.current;

    return contentNode.offsetWidth - contentNode.clientWidth;
  }

  onScroll = e => {
    const { clientHeight, scrollHeight, scrollTop } = e.target;

    const threshold = THRESHOLD_MAP[this.props.type];
    const prevContent = this.props.content;

    if (this.props.type === 'day' || this.props.type === 'week') {
      this.props.setSwitcherData(this.getSwitcherData(this.props.content, scrollTop));
    }

    if (scrollTop < threshold) {
      e.target.scrollTop = threshold;
      this.props.addContent(this.props.type, 'start');
      if (this.isScrollOffsetNeeded) {
        e.target.scrollTop += this.getScrollOffset(this.getAddedNodes(prevContent));
      }

      return;
    }

    if (scrollTop + clientHeight > scrollHeight - threshold) {
      e.target.scrollTop = scrollHeight - threshold - clientHeight;
      this.props.addContent(this.props.type, 'end');
      if (this.isScrollOffsetNeeded) {
        e.target.scrollTop -= this.getScrollOffset(this.getAddedNodes(prevContent));
      }

      return;
    }
  };

  getAddedNodes(prevContent) {
    return this.props.content
      .filter(chunk => !prevContent.includes(chunk))
      .map(el => {
        const [year, month] = [...el.key.split('-')];
        return this.getDateNode(year, month);
      });
  }

  getScrollOffset(addedNodes) {
    if (this.props.type === 'day' || this.props.type === 'week') {
      return addedNodes.reduce((acc, it) => {
        const nodeStyles = window.getComputedStyle(it);
        return acc + it.offsetHeight + parseInt(nodeStyles.marginBottom, 10);
      }, 0);
    }

    return addedNodes[0].offsetHeight;
  }

  getDateNode(year, month) {
    const contentNode = this.scrollContentRef.current;

    if (this.props.type === 'day' || this.props.type === 'week') {
      return contentNode.querySelector(`[data-year="${year}"][data-month="${month}"]`);
    }

    const nodes = contentNode.querySelectorAll(`[data-year="${year}"]`);

    if (!nodes) {
      return undefined;
    }

    return nodes[0];
  }

  scrollToDate(date = new Date()) {
    const [year, month] = [date.getFullYear(), date.getMonth()];
    const contentNode = this.scrollContentRef.current;
    const node = this.getDateNode(year, month);

    if (!node) {
      return false;
    }

    let topOffset = 0;

    // когда выбраны day или week отступаем на высоту свитчера, учитывая положение заголовка месяца
    if (this.props.type === 'day' || this.props.type === 'week') {
      topOffset = node.classList.contains(b(LIFTED_TITLE_CL)) ? LIFTED_TITLE_TOP_OFFSET : TITLE_TOP_OFFSET;
    }

    contentNode.scrollTop = node.offsetTop - topOffset;

    return true;
  }

  // получаем поле dataset dom элемента месяца, который ближе всех к текущему scrollTop контента
  getSwitcherData(list, scrollTop) {
    let diff, data, prevNode;

    for (let i = 0; i < list.length; i++) {
      const [year, month] = [...list[i].key.split('-')];
      const node = this.getDateNode(year, month);
      const currentDiff = Math.abs(node.offsetTop - scrollTop);

      if (!i) {
        diff = currentDiff;
        continue;
      }

      if (diff <= currentDiff) {
        data = prevNode && prevNode.dataset;
        break;
      } else {
        diff = currentDiff;
        prevNode = node;
      }
    }

    return data;
  }

  render() {
    const { content, type, scale, showApply } = this.props;

    return (
      <div
        ref={this.ref}
        className={b('content', {
          scale: Boolean(scale),
          'without-apply': !showApply,
        })}
        onClick={this.props.onContentClick}
        onMouseOver={this.props.mouseEvents ? this.props.mouseEvents[0] : null}
        onMouseLeave={this.props.mouseEvents ? this.props.mouseEvents[1] : null}
      >
        <div className={b('content-inner', { [type]: true })} ref={this.scrollContentRef}>
          {content}
        </div>
      </div>
    );
  }
}
