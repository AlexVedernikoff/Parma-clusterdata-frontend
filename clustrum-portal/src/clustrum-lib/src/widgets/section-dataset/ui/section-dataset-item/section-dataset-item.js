import React from 'react';
import uuid from 'uuid/v1';
import { EllipsisOutlined, HolderOutlined } from '@ant-design/icons';
import { CastIconsFactory } from '@lib-shared/ui/cast-icons-factory';
import { Button, Dropdown, Popup, Menu } from 'lego-on-react';
import { CalcModes } from '@kamatech-data-ui/clustrum';

function addIgnoreDrag(element) {
  element.className += ' ignore-drag';
}

function removeIgnoreDrag(element) {
  element.className = element.className.replace(' ignore-drag', '');
}

export function SectionDatasetItem(props) {
  const { item, className, isDragging, updateDatasetByValidation, setState } = props;

  let resultClassName = '';

  resultClassName += className || '';
  resultClassName += item.className ? ` ${item.className}` : '';
  resultClassName += isDragging ? ' is-dragging' : '';
  resultClassName += item.local ? ' local-item' : '';

  const removeField = ({ field }) => {
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

  const onClickRemoveDatasetItem = item => {
    if (!item.local) return;

    removeField({ field: item });
  };

  const onClickDuplicateDatasetItem = item => {
    const { sdk, dataset, updates } = props;
    const { result_schema: resultSchema } = dataset;
    const guid = uuid();
    let { calc_mode: calcMode, title } = item;

    const fieldNext = {
      ...item,
      guid,
    };

    if (calcMode === CalcModes.Formula) {
      delete fieldNext.cast;
    }

    resultSchema.concat(updates).forEach(row => {
      let { title: currentTitle } = row;

      if (typeof currentTitle === 'undefined') {
        currentTitle = row.field.title;
      }

      if (title === currentTitle) {
        const match = title.match(/\((\d+)\)$/);

        if (match) {
          const i = Number(match[1]);

          title = title.replace(/\((\d+)\)$/, `(${i + 1})`);
        } else {
          title = `${title} (1)`;
        }
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

  const onClickEditDatasetItem = item => {
    if (!item.local) return;

    setState({
      isFieldEditorVisible: true,
      editingField: item,
    });
  };

  return (
    <div className={resultClassName} title={item.title}>
      <HolderOutlined className="item-holder" />
      <CastIconsFactory iconType={item.cast} />

      <div className="item-title" title={item.title}>
        {item.title}
      </div>
      <div
        className="item-right-icon item-more-icon"
        onMouseEnter={e => {
          addIgnoreDrag(e.currentTarget.parentElement);
        }}
        onMouseLeave={e => {
          removeIgnoreDrag(e.currentTarget.parentElement);
        }}
      >
        <Dropdown
          cls="dataset-item-more-btn"
          view="default"
          tone="default"
          theme="flat"
          size="n"
          switcher={
            <Button size="xs" theme="flat" type="default" view="default" width="max">
              <EllipsisOutlined width="24" height="24" />
            </Button>
          }
          popup={
            <Popup hasTail hiding autoclosable onOutsideClick={() => {}}>
              {item.local ? (
                <Menu
                  theme="normal"
                  view="default"
                  tone="default"
                  size="s"
                  type="navigation"
                >
                  <Menu.Item
                    type="option"
                    val="access"
                    onClick={() => {
                      onClickRemoveDatasetItem(item);
                    }}
                  >
                    Удалить
                  </Menu.Item>
                  <Menu.Item
                    type="option"
                    val="access"
                    onClick={() => {
                      onClickEditDatasetItem(item);
                    }}
                  >
                    Редактировать
                  </Menu.Item>
                </Menu>
              ) : (
                <Menu
                  theme="normal"
                  view="default"
                  tone="default"
                  size="s"
                  type="navigation"
                >
                  <Menu.Item
                    type="option"
                    val="access"
                    onClick={() => {
                      onClickDuplicateDatasetItem(item);
                    }}
                  >
                    Дублировать
                  </Menu.Item>
                </Menu>
              )}
            </Popup>
          }
          hasTail
        />
      </div>
    </div>
  );
}
