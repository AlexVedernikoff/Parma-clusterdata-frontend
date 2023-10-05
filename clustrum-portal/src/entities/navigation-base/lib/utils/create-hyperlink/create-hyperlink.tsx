import React from 'react';
import { NavigationScope } from '@clustrum-lib/shared/types';
import { generatePath } from 'react-router';
import { useUnit } from 'effector-react';
import { $place } from '../../../model/navigation-base';
import {
  MAP_NAVIGATION_SCOPE_TO_PATH,
  MAP_PLACE_TO_PATH_IN_FOLDER,
} from '../../constants';
import { Space } from 'antd';
import { getIconByScope } from '..';
import { CreateHyperlinkProps } from './types';

export function CreateHyperlink(props: CreateHyperlinkProps): JSX.Element {
  const { record, name } = props;
  const [place] = useUnit([$place]);
  const path =
    record.scope === NavigationScope.Folder
      ? generatePath(MAP_PLACE_TO_PATH_IN_FOLDER[place], {
          id: record.entryId,
        })
      : generatePath(MAP_NAVIGATION_SCOPE_TO_PATH[record.scope], {
          id: record.entryId,
        });
  return (
    <a href={path} onClick={(e): void => e.preventDefault()} style={{ all: 'unset' }}>
      <Space size="middle">
        {getIconByScope(record.scope)}
        {name}
      </Space>
    </a>
  );
}
