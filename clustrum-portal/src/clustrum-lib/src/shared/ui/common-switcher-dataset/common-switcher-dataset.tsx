import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
// TODO будет поправлено после задачи с рефакторингом NavigationMinimal
import { NavigationMinimal, EntryTitle } from '@kamatech-data-ui/clustrum';
import { EntryScope } from '@lib-shared/types';
import { getNavigationPathFromKey, getPersonalFolderPath } from '@lib-shared/lib/utils';
// TODO будет поправлено после задачи с рефакторингом NavigationMinimal
// eslint-disable-next-line no-restricted-imports
import { SDK } from '../../../../../modules/sdk';
import { changeNavigationPath } from '../../../../../store/actions/dash';
import { CommonSwitcherDatasetProps, EntryProps, DashStore } from './types';
import styles from './common-switcher-dataset.module.css';

export function CommonSwitcherDataset(props: CommonSwitcherDatasetProps): JSX.Element {
  const { title, entryMeta } = props;

  const dispatch = useDispatch();

  const buttonRef = useRef<null | HTMLButtonElement>(null);
  const [entry, setEntry] = useState<null | EntryProps>(entryMeta);
  const [showNavigation, setShowNavigation] = useState<boolean>(false);
  const navigationPathState = useSelector(
    (state: DashStore) => state.dash.navigationPath,
  );

  useEffect(() => {
    setEntry(entryMeta);
  }, [entryMeta]);

  const handleEntryClick = (entry: EntryProps): void => {
    const { onClick } = props;
    onClick(entry.entryId);
    dispatch(changeNavigationPath(getNavigationPathFromKey(entry.key)));
    setEntry(entry);
    setShowNavigation(false);
  };

  const navigationPath = entry
    ? getNavigationPathFromKey(entry.key)
    : navigationPathState || getPersonalFolderPath();

  const popupDirections = [
    'right-top',
    'right-center',
    'right-bottom',
    'left-top',
    'left-center',
    'left-bottom',
    'bottom-center',
    'bottom-left',
    'bottom-right',
    'top-center',
    'top-left',
    'top-right',
  ];

  const buttonText = entry ? <EntryTitle entry={entry} theme="inline" /> : 'Выбрать';

  return (
    <div className={styles['common-switcher-dataset']}>
      <div className={styles['common-switcher-dataset__title']}>{title}</div>
      <Button onClick={(): void => setShowNavigation(!showNavigation)} ref={buttonRef}>
        {buttonText}
      </Button>
      <NavigationMinimal
        sdk={SDK}
        startFrom={navigationPath}
        hasTail
        anchor={buttonRef.current}
        onClose={(): void => setShowNavigation(false)}
        visible={showNavigation}
        popupDirections={popupDirections}
        clickableScope={EntryScope.Dataset}
        onEntryClick={handleEntryClick}
      />
    </div>
  );
}
