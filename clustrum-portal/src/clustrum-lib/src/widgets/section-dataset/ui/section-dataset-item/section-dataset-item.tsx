/* eslint-disable @typescript-eslint/no-explicit-any, max-lines-per-function */
import React, { ReactElement } from 'react';
// eslint-disable-next-line
// @ts-ignore
import uuid from 'uuid/v1';
import { EllipsisOutlined, HolderOutlined } from '@ant-design/icons';
// TODO: убрать зависимость после её переписывания
// eslint-disable-next-line
// @ts-ignore
import { CalcModes } from '@kamatech-data-ui/clustrum';
import { CastIconsFactory } from '@lib-shared/ui/cast-icons-factory';
import { Dropdown, MenuProps } from 'antd';
import { SectionDatasetItemProps } from '../../types';
import styles from './section-dataset-item.module.css';
import classNames from 'classnames';

function addIgnoreDrag(element: any): void {
  element.className += ' ignore-drag';
}

function removeIgnoreDrag(element: any): void {
  element.className = element.className.replace(' ignore-drag', '');
}

// TODO уменьшить количество строк в компоненте (#679656)
export function SectionDatasetItem(props: SectionDatasetItemProps): ReactElement {
  const { item, className, isDragging, updateDatasetByValidation, setState } = props;

  const removeField = ({ field }: any): void => {
    const {
      sdk,
      dataset: { result_schema: resultSchema },
    } = props;

    updateDatasetByValidation({
      fields: resultSchema,
      updates: [
        {
          action: 'delete',
          field,
        },
      ],
      sdk,
    });
  };

  const onClickRemoveDatasetItem = (item: any): void => {
    if (!item.local) {
      return;
    }

    removeField({ field: item });
  };

  const onClickDuplicateDatasetItem = (item: any): void => {
    const { sdk, dataset, updates } = props;
    const { schema: resultSchema } = dataset;
    const guid = uuid();
    let { title } = item;
    const { calc_mode: calcMode } = item;

    const fieldNext = {
      ...item,
      guid,
    };

    if (calcMode === CalcModes.Formula) {
      delete fieldNext.cast;
    }

    resultSchema.concat(updates).forEach((row: any) => {
      let { title: currentTitle } = row;

      if (typeof currentTitle === 'undefined') {
        currentTitle = row.field.title;
      }

      if (title !== currentTitle) {
        return;
      }

      const match = title.match(/\((\d+)\)$/);

      if (match) {
        const i = Number(match[1]);
        title = title.replace(/\((\d+)\)$/, `(${i + 1})`);
      } else {
        title = `${title} (1)`;
      }
    });

    fieldNext.title = title;

    updateDatasetByValidation({
      fields: [...resultSchema],
      updates: [
        {
          action: 'add',
          field: fieldNext,
        },
      ],
      sdk,
    });
  };

  const onClickEditDatasetItem = (item: any): void => {
    if (!item.local) {
      return;
    }

    setState(true, item);
  };

  const items: MenuProps['items'] = item.local
    ? [
        {
          key: 'delete',
          label: (
            <div
              onClick={(): void => {
                onClickRemoveDatasetItem(item);
              }}
            >
              Удалить
            </div>
          ),
        },
        {
          key: 'edit',
          label: (
            <div
              onClick={(): void => {
                onClickEditDatasetItem(item);
              }}
            >
              Редактировать
            </div>
          ),
        },
      ]
    : [
        {
          key: 'dublicate',
          label: (
            <div
              onClick={(): void => {
                onClickDuplicateDatasetItem(item);
              }}
            >
              Дублировать
            </div>
          ),
        },
      ];

  return (
    <div
      className={classNames(
        styles.item,
        className,
        item.className,
        isDragging && 'is-dragging',
        item.local && 'local-item',
      )}
      title={item.title}
    >
      <HolderOutlined className={styles.holder} />
      <CastIconsFactory
        iconType={item.cast}
        className={item.className?.includes('measure') && styles.measure_icon}
      />

      <div className={styles.title} title={item.title}>
        {item.title}
      </div>
      <div
        className={styles.more_icon}
        onMouseEnter={(e): void => {
          addIgnoreDrag(e.currentTarget.parentElement);
        }}
        onMouseLeave={(e): void => {
          removeIgnoreDrag(e.currentTarget.parentElement);
        }}
      >
        <Dropdown menu={{ items }} trigger={['click']}>
          <EllipsisOutlined width="24" height="24" />
        </Dropdown>
      </div>
    </div>
  );
}
