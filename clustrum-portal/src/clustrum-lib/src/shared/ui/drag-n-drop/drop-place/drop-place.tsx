import React from 'react';
import { DropPlaceProps } from '../types';

import styles from './drop-place.module.css';

export function DropPlace(props: DropPlaceProps): JSX.Element {
  const {
    isDraggedItemHasData,
    isOver,
    canDrop,
    itemSize,
    itemsCount,
    capacity,
    dropPlace,
  } = props;

  const hasDropPlace = dropPlace !== null;

  const checkDropPlace = (): boolean => {
    if (!isDraggedItemHasData) {
      return false;
    }

    const isDropBlocked = (capacity && capacity <= itemsCount) || !canDrop;

    if (isDropBlocked) {
      return false;
    }

    const isOverEmptyContainer = isOver && itemsCount === 0;

    if (isOverEmptyContainer) {
      return true;
    }

    if (!isOver) {
      return false;
    }

    return hasDropPlace;
  };

  const isDropPlaceValid = checkDropPlace();

  if (!isDropPlaceValid) {
    return <></>;
  }

  const { height, margin } = itemSize;

  const top = hasDropPlace ? dropPlace * (height + margin) + margin / 2 : -margin;

  return (
    <div
      className={styles['drop-place']}
      style={{
        top: top,
      }}
    ></div>
  );
}
