import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { CommonSwitcherDataset } from '@clustrum-lib/shared/ui/common-switcher-dataset';
import { CommonSwitcherDatasetModel } from '../model/common-switcher-dataset/common-switcher-dataset-model';
import { CommonSwitcherDatasetContainerProps, EntryProps } from '../types';
import styles from './common-switcher-dataset-container.module.css';

export function CommonSwitcherDatasetContainer(
  props: CommonSwitcherDatasetContainerProps,
): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [entryMeta, setEntryMeta] = useState<null | EntryProps>(null);

  const { entryId, title, onClick } = props;

  useEffect(() => {
    update();
  }, []);

  const update = async (): Promise<void> => {
    setIsLoading(true);

    const res = await CommonSwitcherDatasetModel(entryId);
    setEntryMeta(res);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className={styles['common-switcher-dataset-container__loader']}>
        <Spin />
      </div>
    );
  }

  return (
    <CommonSwitcherDataset
      title={title}
      entryMeta={entryMeta}
      entryId={entryId}
      onClick={onClick}
    />
  );
}
