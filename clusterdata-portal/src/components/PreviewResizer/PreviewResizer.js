import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import _debounce from 'lodash/debounce';

import { DATASET_TABS, TAB_DATASET } from '../../constants';
import { ResizerType } from '../../constants/ResizerType';

// import './PreviewResizer.scss';

const b = block('preview-resizer');

class PreviewResizer extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    children: PropTypes.object.isRequired,
    view: PropTypes.string,
    tab: PropTypes.oneOf(DATASET_TABS),
    className: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.makeInitialActions();
  }

  componentDidUpdate(prevProps) {
    const { view: viewPrev, isVisible: isVisiblePrev, tab: tabPrev } = prevProps;
    const { view, isVisible, tab } = this.props;

    if (tabPrev !== tab && tab === TAB_DATASET) {
      this.makeInitialActions();
    }
    if (view !== viewPrev) {
      this.setPreviewSize();
      this.setDatasetBottomOffset();
    }
    if (isVisiblePrev !== isVisible) {
      this.setPreviewVisibility();
      this.setDatasetBottomOffset();
    }
  }

  FULL_VIEW = 'full';
  RIGHT_VIEW = 'right';
  BOTTOM_VIEW = 'bottom';

  headerHeight = 70;
  headerPreviewHeight = 48;
  actionPanelHeight = 56;
  datasetActionPanelHeight = 56;
  minWidth = 485;
  PREVIEW_HEIGHT_LS = 'previewHeight';
  PREVIEW_WIDTH_LS = 'previewWidth';
  VIEW_LS = 'viewLast';

  allResizers = () => [ResizerType.PREVIEW, ResizerType.HISTORY].map(name => document.querySelector(`.${b(name)}`));

  makeInitialActions = () => {
    const { isVisible, className } = this.props;

    this.makeResizablePreview(b(className));
    this.setPreviewSize();

    this.resizableElement.style.display = 'none';

    this.datasetTableDomRef = document.getElementsByClassName('dataset-table')[0];

    if (isVisible) {
      this.setPreviewVisibility();
      this.setDatasetBottomOffset();
    }
  };

  setPreviewSize = () => {
    const { view } = this.props;

    switch (view) {
      case this.BOTTOM_VIEW: {
        this.resizableElement.style.height = `${200}px`;
        this.resizableElement.style.width = `${100}%`;
        break;
      }
      case this.RIGHT_VIEW: {
        const heightPage = window.innerHeight;
        const heigth = heightPage - this.headerHeight - this.actionPanelHeight - this.datasetActionPanelHeight;

        this.resizableElement.style.height = `${heigth}px`;
        this.resizableElement.style.width = `${this.minWidth}px`;
        break;
      }
      case this.FULL_VIEW: {
        const heightPage = window.innerHeight;
        const heigth = heightPage - this.headerHeight;

        this.resizableElement.style.height = `${heigth}px`;
        this.resizableElement.style.width = `${100}%`;
        break;
      }
    }

    this.setViewLS(view);
  };

  setPreviewVisibility = () => {
    const { isVisible } = this.props;

    if (isVisible) {
      this.resizableElement.style.display = 'block';
    } else {
      this.resizableElement.style.display = 'none';
    }
  };

  makeResizablePreview = className => {
    this.resizableElement = document.querySelector(`.${className}`);
    this.tableDataset = document.querySelector('.dataset-table');

    const resizers = document.querySelectorAll(`.${className} .${b('resizer')}`);

    resizers.forEach(resizer => {
      resizer.addEventListener('mousedown', this.setResizer);
    });

    window.addEventListener('resize', this.correctPreviewSize);
  };

  setResizer = e => {
    e.preventDefault();

    this.currentResizer = e.currentTarget;

    window.addEventListener('mousemove', this.runResizer);
    window.addEventListener('mouseup', this.stopResizer);
  };

  runResizer = e => {
    this.datasetTableDomRef.classList.add('disable-hover');

    if (this.currentResizer.classList.contains(b('resizer-top'))) {
      this.verticalResize(e);
    }

    if (this.currentResizer.classList.contains(b('resizer-left'))) {
      this.horizontalResize(e);
    }
  };

  verticalResize = e => {
    const { bottom } = this.resizableElement.getBoundingClientRect();
    const pageY = e.pageY;

    const heightCalculated = bottom - pageY;
    let heightNext;

    if (pageY > this.headerHeight) {
      if (heightCalculated > this.headerPreviewHeight) {
        heightNext = heightCalculated;
        this.resizableElement.style.height = `${heightNext}px`;
      } else {
        heightNext = this.headerPreviewHeight;
        this.resizableElement.style.height = `${heightNext}px`;
      }
    } else {
      heightNext = bottom - this.headerHeight;
      this.resizableElement.style.height = `${heightNext}px`;
    }

    this.debouncedSetPreviewHeightLS(heightNext);
  };

  horizontalResize = e => {
    const { right } = this.resizableElement.getBoundingClientRect();
    const pageX = e.pageX;
    const maxWidth = window.innerWidth;

    const widthCalculated = right - pageX;
    let widthNext;

    if (widthCalculated < maxWidth) {
      if (widthCalculated > this.minWidth) {
        widthNext = widthCalculated;
        this.resizableElement.style.width = `${widthNext}px`;
      } else {
        widthNext = this.minWidth;
        this.resizableElement.style.width = `${widthNext}px`;
      }
    } else {
      widthNext = maxWidth;
      this.resizableElement.style.width = `${widthNext}px`;
    }

    this.debouncedSetPreviewWidthLS(widthNext);
  };

  setPreviewHeightLS = heightNext => {
    localStorage.setItem(this.PREVIEW_HEIGHT_LS, heightNext);
  };

  setPreviewWidthLS = widthNext => {
    localStorage.setItem(this.PREVIEW_WIDTH_LS, widthNext);
  };

  setViewLS = view => {
    localStorage.setItem(this.VIEW_LS, view);
  };

  debouncedSetPreviewHeightLS = _debounce(this.setPreviewHeightLS, 1000);
  debouncedSetPreviewWidthLS = _debounce(this.setPreviewWidthLS, 1000);

  stopResizer = () => {
    window.removeEventListener('mousemove', this.runResizer);
    this.datasetTableDomRef.classList.remove('disable-hover');

    this.setDatasetBottomOffset();
  };

  setDatasetBottomOffset = () => {
    const { view } = this.props;

    if (view === this.RIGHT_VIEW) {
      this.tableDataset.style.marginBottom = '0px';
    } else {
      const previewHeight = Math.max(...this.allResizers().map(element => element.getBoundingClientRect().height));
      const { height: tableDatasetHeight } = this.tableDataset.getBoundingClientRect();

      const datasetHeight = tableDatasetHeight + parseInt(this.tableDataset.style.marginBottom || 0, 10);

      if (datasetHeight - previewHeight >= 0) {
        this.tableDataset.style.marginBottom = `${previewHeight}px`;
      }
    }
  };

  correctPreviewSize = e => {
    const { view } = this.props;
    const { innerWidth, innerHeight } = e.currentTarget;
    const { height, width } = this.resizableElement.getBoundingClientRect();

    switch (view) {
      case this.FULL_VIEW: {
        this.resizableElement.style.height = `${innerHeight - this.headerHeight}px`;
        break;
      }
      case this.RIGHT_VIEW: {
        if (innerWidth < width) {
          this.resizableElement.style.width = `${innerWidth}px`;
        }

        this.resizableElement.style.height = `${innerHeight -
          this.headerHeight -
          this.actionPanelHeight -
          this.datasetActionPanelHeight}px`;
        break;
      }
      default: {
        if (innerWidth < width) {
          this.resizableElement.style.width = `${innerWidth}px`;
        }
        if (innerHeight - this.headerHeight < height) {
          this.resizableElement.style.height = `${innerHeight - this.headerHeight}px`;
        }
      }
    }
  };

  render() {
    const { children, view, className } = this.props;

    const isVisibleVerticalResizer = [this.BOTTOM_VIEW].includes(view);
    const isVisibleHorizontalResizer = [this.RIGHT_VIEW].includes(view);

    return (
      <div className={b(className)}>
        <div className={b('resizer', b('resizer-top', { visible: isVisibleVerticalResizer }))}>
          <div className={b('resizer-anchor-horizontal')} />
        </div>
        <div className={b('resizer', b('resizer-left', { visible: isVisibleHorizontalResizer }))}>
          <div className={b('resizer-anchor-vertical')} />
        </div>
        {children}
      </div>
    );
  }
}

export default PreviewResizer;
