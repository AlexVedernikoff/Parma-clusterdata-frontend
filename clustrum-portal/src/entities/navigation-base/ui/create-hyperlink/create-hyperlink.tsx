import React from 'react';
import { NavigationScope } from '@clustrum-lib/shared/types';
import { generatePath } from 'react-router';
import { useUnit } from 'effector-react';
import { $place } from '@entities/navigation-base/model/navigation-base';
import {
  MAP_NAVIGATION_SCOPE_TO_PATH,
  MAP_PLACE_TO_PATH_IN_FOLDER,
} from '@entities/navigation-base/lib/constants';
import { Space } from 'antd';
import { getIconByScope } from '@entities/navigation-base/lib/utils';
import { CreateHyperlinkProps } from './types';
import Link from 'antd/es/typography/Link';

export function Hyperlink(props: CreateHyperlinkProps): JSX.Element {
  const { record, name } = props;
  const [place] = useUnit([$place]);

  const pattern =
    record.scope === NavigationScope.Folder
      ? MAP_PLACE_TO_PATH_IN_FOLDER[place]
      : MAP_NAVIGATION_SCOPE_TO_PATH[record.scope];
  const path = generatePath(pattern, { id: record.entryId });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => e.preventDefault();

  return (
    <Link href={path} onClick={handleClick} style={{ all: 'unset' }}>
      <Space size="middle">
        {getIconByScope(record.scope)}
        {name}
      </Space>
    </Link>
  );
}
