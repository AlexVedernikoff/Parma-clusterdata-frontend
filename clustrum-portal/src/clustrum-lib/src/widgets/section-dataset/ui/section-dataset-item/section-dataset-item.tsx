import React, { ReactElement } from 'react';
import classNames from 'classnames';
import { EllipsisOutlined, HolderOutlined } from '@ant-design/icons';
import { CastIconsFactory } from '@lib-shared/ui/cast-icons-factory';
import { CastIconType } from '@lib-shared/ui/cast-icons-factory/types';
import { SectionDatasetItemProps } from '../../types';
import styles from './section-dataset-item.module.css';

const addIgnoreDrag = (element: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
  if (element?.currentTarget?.parentElement) {
    element.currentTarget.parentElement.className += ' ignore-drag';
  }
};

const removeIgnoreDrag = (
  element: React.MouseEvent<HTMLDivElement, MouseEvent>,
): void => {
  if (element?.currentTarget?.parentElement) {
    element.currentTarget.parentElement.className = element.currentTarget.parentElement.className.replace(
      ' ignore-drag',
      '',
    );
  }
};

export function SectionDatasetItem(props: SectionDatasetItemProps): ReactElement {
  const { item, className } = props;
  const castIconClassName = item.className?.includes('measure')
    ? styles.measure_icon
    : undefined;

  return (
    <div
      className={classNames(styles.item, className, item.className)}
      title={item.title}
    >
      <HolderOutlined className={styles.holder} />
      <CastIconsFactory
        iconType={item.cast as CastIconType}
        className={castIconClassName}
      />

      <div className={styles.title} title={item.title}>
        {item.title}
      </div>
      <div
        className={styles.more_icon}
        onMouseEnter={addIgnoreDrag}
        onMouseLeave={removeIgnoreDrag}
      >
        <EllipsisOutlined width="24" height="24" />
      </div>
    </div>
  );
}
