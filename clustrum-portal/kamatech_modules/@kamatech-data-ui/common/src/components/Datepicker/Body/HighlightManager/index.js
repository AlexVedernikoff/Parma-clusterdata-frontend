import block from 'bem-cn-lite';
import constants from '../../constants';
import dateHelpers from '../../utils/date';

const b = block(constants.cNameBody);

export default class HighlightManager {
  static typesPriority = {
    day: 1,
    week: 2,
    month: 3,
    quarter: 4,
    year: 5,
  };

  constructor(type, start, end) {
    this._type = type;
    this._start = start;
    this._end = end;
    this._startHover = undefined;
    this._endHover = undefined;
  }

  mouseOverMark(content, startHover, endHover) {
    this._unhighlightRange(content);

    const unmarkStartNode = this._findItemToMark(content, 'day', this._startHover);
    const unmarkStartNodeNew = this._findItemToMark(content, 'day', startHover);
    const unmarkEndNode = this._findItemToMark(content, 'day', this._endHover);
    const unmarkEndNodeNew = this._findItemToMark(content, 'day', endHover);

    if (unmarkStartNode === unmarkStartNodeNew && unmarkStartNode === unmarkEndNodeNew) {
      this._unmarkItem(unmarkEndNode);
      unmarkStartNode.classList.remove('marked-first');
      return;
    }

    if (unmarkStartNodeNew === unmarkEndNode && unmarkStartNodeNew === unmarkEndNodeNew) {
      this._unmarkItem(unmarkStartNode);
      unmarkStartNode.classList.remove('marked-first');
      return;
    }

    if (unmarkStartNode !== unmarkStartNodeNew) {
      this._unmarkItem(unmarkStartNode);
    }

    this._unmarkItem(unmarkEndNode);

    this._startHover = startHover;
    this._endHover = endHover;

    const markStartNode = this._findItemToMark(content, 'day', startHover);
    const markEndNode = this._findItemToMark(content, 'day', endHover);

    if (this._startHover && this._endHover) {
      if (markEndNode && !markEndNode.classList.contains('marked')) {
        this._markItem(markEndNode);
      }

      if (markStartNode && !markStartNode.classList.contains('marked')) {
        this._markItem(markStartNode);
      }

      this._markFirstItem(markStartNode);

      this._highlightRange(content, 'day', startHover, endHover);
    }
  }

  mouseOverUnmark(content) {
    if (this._start && this._end) {
      return;
    }

    this._unhighlightRange(content);

    const startHoveredNode = this._findItemToMark(content, 'day', this._startHover);
    const endHoveredNode = this._findItemToMark(content, 'day', this._endHover);
    const startNode = this._findItemToMark(content, 'day', this._start);

    this._unmarkItem(startHoveredNode);
    this._unmarkItem(endHoveredNode);

    this._markItem(startNode);
  }

  mark(content, type, start, end) {
    if (this._start) {
      const unmarkNode = this._findItemToMark(content, type, this._start);
      this._unmarkItem(unmarkNode);
    }

    if (this._end) {
      const unmarkNode = this._findItemToMark(content, type, this._end);
      this._unmarkItem(unmarkNode);
    }

    this._unhighlightRange(content);

    const priority = HighlightManager.typesPriority;
    const isSameType = this.type() === type;
    // при уменьшении масштаба красим ранее выделенный диапазон дат (исключая тип week)
    const isLessPriorityOrNotWeek = priority[this.type()] > priority[type] && type !== 'week';

    this._start = start;
    this._end = end;

    const markStartNode = this._findItemToMark(content, type, start);
    const markEndNode = this._findItemToMark(content, type, end);

    const isSameNodes = markStartNode === markEndNode;

    if (
      (isSameType || isLessPriorityOrNotWeek) &&
      (isSameNodes || (markStartNode && !markStartNode.classList.contains('marked')))
    ) {
      this._markItem(markStartNode);
    }

    if (this._start && this._end && (isSameType || isLessPriorityOrNotWeek)) {
      if (isSameNodes || (markEndNode && !markEndNode.classList.contains('marked'))) {
        this._markItem(markEndNode);
      }

      this._markFirstItem(markStartNode);
      this._highlightRange(content, type, this._start, this._end);
    }
  }

  type(val) {
    if (!val) {
      return this._type;
    }

    this._type = val;

    return undefined;
  }

  _findItemToMark(content, type, date) {
    if (!content || !date) {
      return undefined;
    }

    const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];

    const selectors = {
      day: (year, month, day) => {
        return `[data-year="${year}"][data-month="${month}"] [data-day="${day}"]`;
      },
      week: (year, month, day) => {
        return `[data-year="${year}"][data-month="${month}"] [data-day="${day}"]`;
      },
      month: (year, month) => {
        return `[data-year="${year}"][data-month="${month}"]`;
      },
      quarter: year => {
        const q = Math.floor((date.getMonth() + 3) / 3);
        return `[data-year="${year}"] [data-quarter="${q}"]`;
      },
      year: year => {
        return `[data-year="${year}"]`;
      },
    };

    return content.querySelector(selectors[type](year, month, day));
  }

  _markItem(node) {
    if (node) {
      if (node.classList.contains('marked')) {
        node.classList.add('marked-twice');
      } else {
        node.classList.add('marked');
      }
    }
  }

  _markFirstItem(node) {
    if (node && !node.classList.contains('marked-twice')) {
      node.classList.add('marked-first');
    }
  }

  _unmarkItem(node) {
    if (node) {
      node.classList.remove('marked', 'marked-first', 'marked-twice');
    }
  }

  _highlightRange(content, type, startDate, endDate) {
    if (!startDate || !endDate) {
      return;
    }

    const startNode = this._findItemToMark(content, type, startDate);
    const endNode = this._findItemToMark(content, type, endDate);

    const selectors = {
      day: 'month-day_filled',
      week: 'month-day_filled',
      month: 'sketch-month-wrap_m',
      quarter: 'chunk-quarter-item',
      year: 'chunk-year',
    };

    if (!endNode && !startNode) {
      // в случае если нет опорных дат
      const list = content.querySelectorAll(`.${b(selectors[type])}`);
      const firstDate = dateHelpers.getDateFromNode(list[0], type);
      const lastDate = dateHelpers.getDateFromNode(list[list.length - 1], type);

      if (firstDate.getTime() > endDate.getTime() || lastDate.getTime() < startDate.getTime()) {
        // если вышли за пределы диапазона - ничего не делаем
        return;
      }

      if (list.length) {
        // если в диапазоне - красим все
        list.forEach(node => node.classList.add('highlight'));
      }

      return;
    }

    let next;

    if (startNode) {
      const nextSibling = startNode.nextElementSibling;
      const nextParentSibling = startNode.parentElement.nextElementSibling;

      if (nextSibling) {
        next = nextSibling;
      } else if (nextParentSibling) {
        next = startNode.parentElement.nextElementSibling.querySelector(`.${b(selectors[type])}`);
      } else {
        return;
      }
    } else {
      next = content.querySelector(`.${b(selectors[type])}`);
    }

    if (startNode === endNode) {
      return;
    }

    while (next) {
      next.classList.add('highlight');

      if (next.classList.contains('marked')) {
        next = null;
        break;
      }

      if (!next.nextElementSibling && next.parentElement.nextElementSibling) {
        next = next.parentElement.nextElementSibling.querySelector(`.${b(selectors[type])}`);

        continue;
      }

      next = next.nextElementSibling;
    }
  }

  _unhighlightRange(content) {
    if (!content) {
      return;
    }

    const list = content.querySelectorAll('.highlight');

    if (list.length) {
      list.forEach(node => node.classList.remove('highlight'));
    }
  }
}
