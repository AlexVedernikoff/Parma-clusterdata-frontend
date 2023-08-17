import React, { ReactElement } from 'react';
import classNames from 'classnames';
import { EllipsisOutlined, HolderOutlined } from '@ant-design/icons';
import { CastIconsFactory } from '@lib-shared/ui/cast-icons-factory';
import { CastIconType } from '@lib-shared/ui/cast-icons-factory/types';
import { SectionDatasetItemProps } from '../../types';
import styles from './section-dataset-item.module.css';

const addIgnoreDrag = (element: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
  element?.currentTarget?.parentElement?.classList.add(styles['ignore-drag']);
};

const removeIgnoreDrag = (
  element: React.MouseEvent<HTMLDivElement, MouseEvent>,
): void => {
  element?.currentTarget?.parentElement?.classList.remove(styles['ignore-drag']);
};

export function SectionDatasetItem(props: SectionDatasetItemProps): ReactElement {
  const { itemData, className } = props;
  const castIconClassName = itemData.className?.includes('measure')
    ? styles['measure-icon']
    : undefined;

  return (
    <div
      className={classNames(styles.item, className, itemData.className)}
      title={itemData.title}
    >
      <HolderOutlined className={styles.holder} />
      <CastIconsFactory
        iconType={itemData.cast as CastIconType}
        className={castIconClassName}
      />

      <div className={styles.title} title={itemData.title}>
        {itemData.title}
      </div>
      <div
        className={styles['more-icon']}
        onMouseEnter={addIgnoreDrag}
        onMouseLeave={removeIgnoreDrag}
      >
        <EllipsisOutlined />
      </div>
    </div>
  );
}
