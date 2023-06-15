import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button } from 'lego-on-react';
import Tabs from './Tabs';
import Presets from './Presets';
import YearSwitcher from './YearSwitcher';
import Content from './Content';
import ContentManager from './ContentManager';
import HighlightManager from './HighlightManager';
import constants from '../constants';
import locales from '../locales';
import utils from '../utils';
import dateHelpers from '../utils/date';
import presetHandlers from './presetHandlers';

// import './index.scss';

const b = block(constants.cNameBody);

export default class Body extends React.PureComponent {
  static propTypes = {
    range: PropTypes.array,
    lang: PropTypes.string,
    scale: PropTypes.string,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    addDateToRange: PropTypes.func,
    onSubmit: PropTypes.func,
    showApply: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const { lang, minDate, maxDate, range, scale } = this.props;

    const endDate = dateHelpers.getEndDate(range);
    let startDate = dateHelpers.getStartDate(range);

    this.initialDate = this.getInitialDate(startDate);

    if (!startDate) {
      startDate = new Date();
    }

    // управлятор контентом
    this.cManager = new ContentManager(this.initialDate, minDate, maxDate, lang);
    // управлятор окрашиванием дат
    this.hManager = new HighlightManager(scale || 'day', startDate, endDate);
    // вынес за state, потому что значение не связано с ним напрямую
    this.switcherMonth = startDate.getMonth();

    this.ref = React.createRef();
    this.contentRef = React.createRef();

    this.state = {
      startDate,
      endDate,
      type: scale || 'day',
      displayContent: this.cManager.content[scale || 'day'],
      switcherYear: startDate.getFullYear(),
      popupDirection: '',
      getTypeFromState: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const type = state.getTypeFromState ? state.type : props.scale || 'day';

    return {
      type,
      startDate: dateHelpers.getStartDate(props.range),
      endDate: dateHelpers.getEndDate(props.range),
      getTypeFromState: !props.scale,
    };
  }

  componentDidMount() {
    const content = this.contentRef.current.scrollContentRef.current;
    this.hManager.mark(
      content,
      this.state.type,
      this.state.startDate,
      this.state.endDate,
    );
  }

  componentDidUpdate(prevProps) {
    if (!this.contentRef.current) {
      return;
    }

    const { minDate, maxDate } = this.props;
    const { startDate, endDate, type } = this.state;
    const prevMinDate = prevProps.minDate;
    const prevMaxDate = prevProps.maxDate;

    const addMinDate = !this.cManager._minDate && prevMinDate;
    const addMaxDate = !this.cManager._maxDate && prevMaxDate;
    const changeMinDate = prevMinDate && prevMinDate.getTime() !== minDate.getTime();
    const changeMaxDate = prevMaxDate && prevMaxDate.getTime() !== maxDate.getTime();

    if (addMinDate || addMaxDate || changeMinDate || changeMaxDate) {
      this.cManager.setMinDate(minDate);
      this.cManager.setMaxDate(maxDate);
      this.cManager.changeContent(startDate, type);

      this.setState({
        displayContent: this.cManager.content[type],
      });
    }

    if (prevProps.scale !== this.props.scale) {
      this.setState({
        displayContent: this.cManager.content[type],
      });
    }

    const content = this.contentRef.current.scrollContentRef.current;

    this.hManager.mark(content, type, startDate, endDate);
  }

  getInitialDate(startDate) {
    const { maxDate } = this.props;

    if (startDate) {
      return startDate;
    }

    const currentDate = new Date();

    if (maxDate && maxDate < currentDate) {
      return maxDate;
    }

    return currentDate;
  }

  // добавляем контент при скролле
  addContent = (type, position) => {
    const exactType = type === 'week' ? 'day' : type;

    this.cManager.changeContentOnScroll(exactType, position);

    this.setState({
      displayContent: this.cManager.content[exactType],
    });
  };

  changeHlManagerDateType = () => {
    if (this.state.type !== this.hManager.type()) {
      this.hManager.type(this.state.type);
    }
  };

  changeType = tabType => {
    const { type } = this.state;

    // контент для типа 'day' и 'week' одинаковый
    if (
      (type === 'day' || type === 'week') &&
      (tabType === 'day' || tabType === 'week')
    ) {
      this.setState({ type: tabType });
    } else {
      this.setState({
        type: tabType,
        displayContent: this.cManager.content[tabType === 'week' ? 'day' : tabType],
      });
    }
  };

  onTabClick = e => {
    const tabType = e.target.dataset.type;
    const { type } = this.state;

    if (!tabType || tabType === type) {
      return;
    }

    this.changeType(tabType);
  };

  onPresetClick = e => {
    const presetType = e.target.dataset.type;

    if (!presetType) {
      return;
    }

    const { type } = this.state;
    let { switcherYear } = this.state;

    const interval = Number(e.target.dataset.interval);
    const handler = `get${utils.capitalize(presetType)}Interval`;
    let date = presetHandlers[handler](new Date(), interval);

    this.props.addDateToRange(date, type, true);

    this.changeHlManagerDateType();

    if (Array.isArray(date)) {
      date = date[0];
    }

    if (!this.contentRef.current.scrollToDate(date)) {
      this.cManager.changeContent(date, type);

      if (type === 'day' || type === 'week') {
        switcherYear = date.getFullYear();
      }

      this.setState(
        {
          switcherYear,
          displayContent: this.cManager.content[this.state.type],
        },
        () => this.contentRef.current.scrollToDate(date),
      );
    }
  };

  setSwitcherData = data => {
    if (!data) {
      return;
    }

    const { year, month } = data;

    this.switcherMonth = month;

    if (this.state.switcherYear !== year) {
      this.setState({ switcherYear: Number(year) });
    }
  };

  onSwitcherClick = e => {
    const dir = e.target.dataset.dir || e.target.parentNode.dataset.dir;

    if (!dir) {
      return;
    }

    const date = new Date(this.state.switcherYear, this.switcherMonth);
    const yearOffset = dir === 'next' ? 1 : -1;

    date.setFullYear(date.getFullYear() + yearOffset);

    this.cManager.changeContent(date, 'day');

    this.setState(
      {
        switcherYear: date.getFullYear(),
        displayContent: this.cManager.content['day'],
      },
      () => this.contentRef.current.scrollToDate(date),
    );
  };

  onContentClick = e => {
    const { type } = this.state;
    const node = dateHelpers.getItemNode(e.target, type);

    if (!node) {
      return;
    }

    if (type === 'day') {
      this.props.addDateToRange(dateHelpers.getDateFromNode(node, type), type);
    } else {
      this.props.addDateToRange(dateHelpers.getDatesRangeFromNode(node, type), type);
    }

    this.changeHlManagerDateType();
  };

  onDayMouseLeave = () => {
    const { scale } = this.props;

    if (scale) {
      return;
    }

    const content = this.contentRef.current.scrollContentRef.current;

    this.hManager.mouseOverUnmark(content);
  };

  onDayMouseOver = e => {
    const { scale } = this.props;
    const { type, startDate } = this.state;

    const node = e.target;
    const mainCl = b('month-day_filled');

    if (!startDate || this.state.endDate || scale || !node.classList.contains(mainCl)) {
      return;
    }

    const content = this.contentRef.current.scrollContentRef.current;

    let firstDate = new Date(startDate);
    let secondDate = dateHelpers.getDateFromNode(node, type);

    if (firstDate > secondDate) {
      [firstDate, secondDate] = [secondDate, firstDate];
    }

    this.hManager.mouseOverMark(content, firstDate, secondDate);
  };

  onWeekMouseLeave = () => {
    if (this.hoverList) {
      this.hoverList.forEach(node => node.classList.remove('yc-datepicker-week-hover'));
    }
  };

  onWeekMouseOver = e => {
    const node = e.target;
    const mainCl = b('month-day_filled');

    if (this.hoverList) {
      this.hoverList.forEach(node => node.classList.remove('yc-datepicker-week-hover'));
    }

    if (!node.classList.contains(mainCl)) {
      return;
    }

    this.hoverList = dateHelpers.getWeekDays(node);

    this.hoverList.forEach(node => {
      if (!node.classList.contains('highlight')) {
        node.classList.add('yc-datepicker-week-hover');
      }
    });
  };

  isSubmitBtnDisabled() {
    const { range, scale } = this.props;

    if (scale) {
      return !range[0];
    }

    return !range[0] || !range[1];
  }

  renderYearSwitcher() {
    const { type, switcherYear } = this.state;

    if (!(type === 'day' || type === 'week')) {
      return null;
    }

    return <YearSwitcher onSwitcherClick={this.onSwitcherClick} year={switcherYear} />;
  }

  render() {
    const { lang, scale, onSubmit, showApply } = this.props;

    const { type, displayContent } = this.state;

    let mouseEvents;

    if (type === 'day') {
      mouseEvents = [this.onDayMouseOver, this.onDayMouseLeave];
    }

    if (type === 'week') {
      mouseEvents = [this.onWeekMouseOver, this.onWeekMouseLeave];
    }

    return (
      <div ref={this.ref} className={b()}>
        <div className={b('controls')}>
          {scale ? null : (
            <Tabs activeTab={type} lang={lang} onTabClick={this.onTabClick} />
          )}
          {scale ? null : (
            <Presets type={type} lang={lang} onPresetClick={this.onPresetClick} />
          )}
          {this.renderYearSwitcher()}
        </div>

        <Content
          ref={this.contentRef}
          type={type}
          date={this.initialDate}
          content={displayContent}
          onContentClick={this.onContentClick}
          addContent={this.addContent}
          mouseEvents={mouseEvents}
          setSwitcherData={this.setSwitcherData}
          scale={scale}
          showApply={showApply}
        />

        {showApply && (
          <div className={b('action')}>
            <Button
              style={{ width: '100%' }}
              theme="action"
              size="n"
              view="default"
              tone="default"
              onClick={onSubmit}
              disabled={this.isSubmitBtnDisabled()}
            >
              {locales[lang].submit}
            </Button>
          </div>
        )}
      </div>
    );
  }
}
