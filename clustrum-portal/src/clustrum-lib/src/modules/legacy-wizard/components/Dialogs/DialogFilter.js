import React, { PureComponent } from 'react';
import block from 'bem-cn-lite';

import { Select, TextInput, Button } from 'lego-on-react';

import { Loader } from '@kamatech-data-ui/common/src';

import Datepicker from '@kamatech-data-ui/common/src/components/Datepicker';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';
import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';

import SearchInput from '../SearchInput/SearchInput';

import iconPlus from 'icons/plus.svg';
import iconCross from 'icons/cross.svg';

import {
  DIMENSION_NUMBER_OPERATIONS,
  MEASURE_NUMBER_OPERATIONS,
  STRING_OPERATIONS,
  BOOLEAN_OPERATIONS,
  DATE_OPERATIONS,
} from '../../../../../../constants';

import { getIconForCast } from '../../../../../../utils/helpers';

const b = block('dialog-filter');

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const VALUES_LOAD_LIMIT = 1000;

class DialogFilter extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      callback: null,
      item: null,
      operation: null,
      visible: false,
      value: [],
    };
  }

  onClose = () => {
    const { callback } = this.state;

    this.setState({
      visible: false,
    });

    if (callback) {
      callback(null);
    }
  };

  onCancel = () => {
    const { callback } = this.state;

    this.setState({
      visible: false,
    });

    if (callback) {
      callback(null);
    }
  };

  onApply = () => {
    const { item, callback } = this.state;

    this.setState({
      visible: false,
    });

    item.filter = {
      value: this.state.value.map(value => value),
      operation: this.state.operation,
    };

    if (callback) {
      callback(item);
    }
  };

  componentWillReceiveProps(nextProps) {
    const { item, dataset, updates, callback } = nextProps;
    if (
      !item ||
      (nextProps.item === this.state.item && callback === this.state.callback)
    ) {
      return;
    }

    // Произведем инициализацию диалога
    const { sdk } = this.props;
    const { filter } = item;

    const isDate = item.cast === 'date' || item.cast === 'datetime';
    const isNumber =
      item.cast === 'integer' ||
      item.cast === 'uinteger' ||
      item.cast === 'float' ||
      item.cast === 'double' ||
      item.cast === 'long';
    const isBoolean = item.cast === 'boolean';
    const isString = item.cast === 'string';

    let availableOperations;
    switch (true) {
      case isNumber:
        if (item.type === 'DIMENSION') {
          availableOperations = DIMENSION_NUMBER_OPERATIONS;
        } else if (item.type === 'MEASURE') {
          availableOperations = MEASURE_NUMBER_OPERATIONS;
        }
        break;

      case isString:
        availableOperations = STRING_OPERATIONS;
        break;

      case isDate:
        availableOperations = DATE_OPERATIONS;
        break;

      case isBoolean:
        availableOperations = BOOLEAN_OPERATIONS;
        break;
    }

    let operation = filter
      ? availableOperations.find(operation => {
          return operation.code === filter.operation.code;
        })
      : availableOperations[0];

    // Fallback если не найден фильтр по соответсвующему code
    if (!operation) {
      operation = availableOperations[0];
    }

    if (item.type === 'DIMENSION' || isDate) {
      let setValue = operation.selectable ? [] : [''];

      if (filter) {
        if (filter.operation.noOperands) {
          setValue = [];
        } else {
          setValue = [...filter.value];
        }
      }

      this.setState({
        updates,
        item,
        callback,
        operation,
        value: setValue,
        dimensions: null,
        dateInputType: 'point',
        leftSearchPhrase: '',
        rightSearchPhrase: '',
        leftFilteredDimensions: null,
        rightFilteredDimensions: null,
        visible: true,
        error: null,
        minDate: null,
        maxDate: null,
        availableOperations,
        isDate,
        isNumber,
        isBoolean,
        isString,
      });

      // В случае, если фильтруем по измерению, необходимо выгрузить все возможные его значения,
      // чтобы показать их в селекте.
      // Если у поля тип "дата" - то лучше не выгружать возможные значения - дат может быть очень много!
      if (isDate) {
        const minRequestParams = {
          dataSetId: item.datasetId,
          version: 'draft',
          columns: [item.guid],
          orderBy: [
            {
              column: item.guid,
              direction: 'ASC',
            },
          ],
          limit: 1,
        };

        if (item.local) {
          minRequestParams.resultSchema = dataset.result_schema;
        }

        sdk.bi
          .getResultBySQL(minRequestParams)
          .then(data => {
            // Если закрыли не дожидаясь загрузки - игнорируем проставление данных
            if (this.state.visible) {
              const minDate = data.result.data.Data[0][0];

              this.setState({
                minDate,
              });
            }
          })
          .catch(error => {
            this.setState({
              error,
            });
          });

        const maxRequestParams = {
          dataSetId: item.datasetId,
          version: 'draft',
          columns: [item.guid],
          orderBy: [
            {
              column: item.guid,
              direction: 'DESC',
            },
          ],
          limit: 1,
        };

        if (item.local) {
          maxRequestParams.resultSchema = dataset.result_schema;
        }

        sdk.bi
          .getResultBySQL(maxRequestParams)
          .then(data => {
            // Если закрыли не дожидаясь загрузки - игнорируем проставление данных
            if (this.state.visible) {
              const maxDate = data.result.data.Data[0][0];

              this.setState({
                maxDate,
              });
            }
          })
          .catch(error => {
            this.setState({
              error,
            });
          });
      } else {
        // В случае если работаем с другими полями - выгружаем все возможные значения
        if (operation.selectable) {
          const requestParams = {
            dataSetId: item.datasetId,
            version: 'draft',
            fieldGuid: item.guid,
          };

          if (item.local) {
            requestParams.updates = updates;
          }

          sdk.bi
            .getDistincts(requestParams)
            .then(data => {
              // Если закрыли не дожидаясь загрузки - игнорируем проставление данных
              if (this.state.visible) {
                const { value } = this.state;

                const dimensions = data.result.data.Data.map(row => row[0])
                  .filter(dimension => {
                    return value.indexOf(dimension) === -1;
                  })
                  .sort(collator.compare);

                this.setState({
                  dimensions,
                  value,
                });
              }
            })
            .catch(error => {
              this.setState({
                error,
              });
            });
        }
      }
    } else if (item.type === 'MEASURE') {
      let setValue = [''];

      if (filter) {
        if (filter.operation.noOperands) {
          setValue = [];
        } else {
          setValue = [...filter.value];
        }
      }

      this.setState({
        updates,
        item,
        callback,
        operation,
        value: setValue,
        visible: true,
        error: null,
        availableOperations,
        isDate,
        isNumber,
        isBoolean,
        isString,
      });
    }
  }

  onTextInputChange(value, i) {
    // eslint-disable-next-line
    this.state.value[i] = value;

    this.setState({
      value: [...this.state.value],
    });
  }

  onSelectChange(newValue) {
    const { sdk } = this.props;
    let { value, dimensions, item, updates } = this.state;

    const operation = newValue[0];

    if (operation.selectable) {
      if (!dimensions) {
        const requestParams = {
          dataSetId: item.datasetId,
          version: 'draft',
          fieldGuid: item.guid,
        };

        if (item.local) {
          requestParams.updates = updates;
        }

        sdk.bi
          .getDistincts(requestParams)
          .then(data => {
            // Если закрыли не дожидаясь загрузки - игнорируем проставление данных
            if (this.state.visible) {
              const { value } = this.state;

              const dimensions = data.result.data.Data.map(row => row[0])
                .filter(dimension => {
                  return value.indexOf(dimension) === -1;
                })
                .sort(collator.compare);

              this.setState({
                dimensions,
                value,
              });
            }
          })
          .catch(error => {
            this.setState({
              error,
            });
          });
      }

      value = [];
    } else {
      if (operation.noOperands) {
        value = [];
      } else {
        value = value && value.length ? value.slice(0, 1) : [''];
      }
    }

    this.setState({
      operation,
      value,
    });
  }

  onFilterInputChange(field) {
    return value => {
      const fixedValue = value;

      this.setState(
        {
          [field]: fixedValue,
        },
        () => {
          if (this.timeoutAfterInputSearchText) {
            clearTimeout(this.timeoutAfterInputSearchText);
          }

          this.timeoutAfterInputSearchText = setTimeout(() => {
            this.applySearchPhrase(field, fixedValue);
          }, 300);
        },
      );
    };
  }

  applySearchPhrase(field, fixedValue) {
    this.setState({
      [field]: fixedValue,
    });

    const { dimensions, value, item, updates, isString } = this.state;

    const { sdk } = this.props;

    let propToSet;
    let arrayToSearch;
    let otherArray;
    if (field === 'leftSearchPhrase') {
      propToSet = 'leftFilteredDimensions';
      arrayToSearch = dimensions;
      otherArray = value;
    } else {
      propToSet = 'rightFilteredDimensions';
      arrayToSearch = value;
      otherArray = dimensions;
    }

    if (fixedValue) {
      if (dimensions.length >= VALUES_LOAD_LIMIT) {
        const requestParams = {
          dataSetId: item.datasetId,
          version: 'draft',
          fieldGuid: item.guid,
          where: [
            {
              values: [fixedValue],
              operation: isString ? 'CONTAINS' : 'EQ',
              column: item.guid,
            },
          ],
        };

        if (item.local) {
          requestParams.updates = updates;
        }

        sdk.bi
          .getDistincts(requestParams)
          .then(data => {
            // Если закрыли не дожидаясь загрузки - игнорируем проставление данных
            if (this.state.visible) {
              const { value } = this.state;

              const dimensions = data.result.data.Data.map(row => row[0])
                .filter(dimension => {
                  return value.indexOf(dimension) === -1;
                })
                .sort(collator.compare);

              this.setState({
                [propToSet]: dimensions,
              });
            }
          })
          .catch(error => {
            this.setState({
              error,
            });
          });
      } else {
        this.setState({
          [propToSet]: arrayToSearch.filter(item => {
            return item.indexOf(fixedValue) !== -1 && otherArray.indexOf(item) === -1;
          }),
        });
      }
    } else {
      this.setState({
        [propToSet]: null,
      });
    }
  }

  renderManualInput() {
    const { state } = this;

    const { operation } = state;

    return (
      <div>
        {this.state.value.map((value, i) => {
          return (
            <div className={b('row value-row')} key={`measure-row-${i}`}>
              <div className={b('label')}>
                <span>{`Значение${operation.manyOperands ? ' ' + (i + 1) : ''}`}</span>
              </div>
              <div className={b('value custom-text-input')}>
                <TextInput
                  theme="normal"
                  size="s"
                  view="default"
                  tone="default"
                  hasClear={false}
                  pin="round-round"
                  text={value}
                  onChange={newValue => this.onTextInputChange(newValue, i)}
                />
              </div>
              {operation && operation.manyOperands && state.value.length > 1 ? (
                <span
                  className={'remove-value-icon'}
                  onClick={() => {
                    const { value } = this.state;

                    value.splice(i, 1);

                    this.setState({
                      value: [...value],
                    });
                  }}
                >
                  <Icon data={iconCross} width="16" />
                </span>
              ) : null}
            </div>
          );
        })}
        {operation && operation.manyOperands ? (
          <Button
            cls={b('btn-add-row')}
            theme="flat"
            size="n"
            view="default"
            tone="default"
            iconLeft={<Icon data={iconPlus} width="16" />}
            onClick={() => {
              const { value } = this.state;

              value.push('');

              this.setState({
                value: [...value],
              });
            }}
          >
            Добавить значение
          </Button>
        ) : null}
      </div>
    );
  }

  renderManualCalendarInput() {
    const { state } = this;
    const withTime = state.item.cast === 'datetime';

    if (state.minDate && state.maxDate) {
      let minDate;
      let maxDate;

      try {
        minDate = new Date(state.minDate).toISOString();
        maxDate = new Date(state.maxDate).toISOString();
      } catch (e) {
        minDate = null;
        maxDate = null;
      }

      return (
        <div className="calendar-input">
          <div className={b('label')}>
            <span>Значение</span>
          </div>
          <Datepicker
            locale="ru"
            scale={state.operation.oneDay ? 'day' : undefined}
            emptyValueText="-"
            allowTime={withTime}
            timePrecision={'sec'}
            fromDate={state.value[0]}
            toDate={state.value[1]}
            minDate={minDate}
            maxDate={maxDate}
            callback={({ from, to }) => {
              let formattedFrom = withTime
                ? from.slice(0, 19).replace('T', ' ')
                : from.slice(0, 10);
              let formattedTo;

              if (to) {
                formattedTo = withTime
                  ? to.slice(0, 19).replace('T', ' ')
                  : to.slice(0, 10);

                this.setState({
                  value: [formattedFrom, formattedTo],
                });
              } else {
                this.setState({
                  value: [formattedFrom],
                });
              }
            }}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Loader size={'l'} />
        </div>
      );
    }
  }

  renderSelectableInput() {
    const { state } = this;

    const {
      dimensions,
      leftSearchPhrase,
      rightSearchPhrase,
      leftFilteredDimensions,
      rightFilteredDimensions,
      value,
    } = state;

    return (
      <div>
        <div className="left-column">
          <span className="column-title">Доступны</span>
          <span
            className={`column-action${dimensions && dimensions.length ? ' active' : ''}`}
            onClick={() => {
              this.setState({
                dimensions: [],
                value: [...value].concat(dimensions).sort(collator.compare),
              });
            }}
          >
            Выбрать все
          </span>
          <SearchInput
            className="find-field-inp"
            hasClear={true}
            borderDisabled={true}
            text={state.leftSearchPhrase}
            placeholder="Поиск"
            size="s"
            onChange={this.onFilterInputChange('leftSearchPhrase')}
          />
          <div className={'options-list'}>
            {dimensions ? (
              (leftFilteredDimensions || dimensions).map((dimension, i) => {
                return (
                  <div
                    className="dimension-option"
                    key={`dimension-option-${i}`}
                    title={dimension}
                    onClick={() => {
                      value.push(dimension);
                      dimensions.splice(dimensions.indexOf(dimension), 1);

                      if (leftFilteredDimensions) {
                        leftFilteredDimensions.splice(
                          leftFilteredDimensions.indexOf(dimension),
                          1,
                        );

                        this.setState({
                          leftFilteredDimensions: [...leftFilteredDimensions],
                        });
                      }

                      if (
                        rightSearchPhrase &&
                        dimension.indexOf(rightSearchPhrase) > -1
                      ) {
                        rightFilteredDimensions.push(dimension);

                        this.setState({
                          rightFilteredDimensions: [...rightFilteredDimensions].sort(
                            collator.compare,
                          ),
                        });
                      }

                      this.setState({
                        dimensions: [...dimensions],
                        value: [...value].sort(collator.compare),
                      });
                    }}
                  >
                    <span className="dimension-value">{dimension}</span>
                    <span className="dimension-select">Выбрать</span>
                  </div>
                );
              })
            ) : (
              <div>
                <Loader size={'l'} />
              </div>
            )}
          </div>
          {dimensions &&
            !leftFilteredDimensions &&
            dimensions.length >= VALUES_LOAD_LIMIT && (
              <span className="limit-message">
                Значений больше 1000, ограничьте значения
              </span>
            )}
        </div>
        <div className={'right-column'}>
          <span className={'column-title'}>Выбраны</span>
          <span
            className={`column-action${
              state.value && state.value.length ? ' active' : ''
            }`}
            onClick={() => {
              this.setState({
                dimensions: [...dimensions].concat(value).sort(collator.compare),
                value: [],
              });
            }}
          >
            Очистить
          </span>
          <SearchInput
            className="find-field-inp"
            hasClear={true}
            borderDisabled={true}
            text={state.rightSearchPhrase}
            placeholder="Поиск"
            size="s"
            onChange={this.onFilterInputChange('rightSearchPhrase')}
          />
          <div className={'options-list'}>
            {(rightFilteredDimensions ? rightFilteredDimensions : value ? value : []).map(
              (dimension, i) => {
                return (
                  <div
                    className="dimension-option"
                    key={`dimension-selected-option-${i}`}
                    title={dimension}
                    onClick={() => {
                      dimensions.push(dimension);
                      value.splice(i, 1);

                      if (rightFilteredDimensions) {
                        rightFilteredDimensions.splice(
                          rightFilteredDimensions.indexOf(dimension),
                          1,
                        );

                        this.setState({
                          rightFilteredDimensions: [...rightFilteredDimensions],
                        });
                      }

                      if (leftSearchPhrase && dimension.indexOf(leftSearchPhrase) > -1) {
                        leftFilteredDimensions.push(dimension);

                        this.setState({
                          leftFilteredDimensions: [...leftFilteredDimensions].sort(
                            collator.compare,
                          ),
                        });
                      }

                      this.setState({
                        dimensions: [...dimensions].sort(collator.compare),
                        value: [...value],
                      });
                    }}
                  >
                    <span className="dimension-value">{dimension}</span>
                    <span className="dimension-select">Удалить</span>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    );
  }

  renderModalBody() {
    const { props, state } = this;
    const { item } = props;

    const isDate = item.cast === 'date' || item.cast === 'datetime';
    const { operation, availableOperations } = state;

    const { selectable } = operation;

    if (state.error) {
      return (
        <div>
          <div className="error-text">
            Ошибка: не удалось загрузить значения для фильтра
          </div>
        </div>
      );
    }

    const labelOperations = {
      'label_operation-contains': 'Содержит',
      'label_operation-endswith': 'Заканчивается на',
      'label_operation-equals': 'Равно',
      'label_operation-gt': 'Больше',
      'label_operation-gte': 'Больше или равно',
      'label_operation-in': 'Принадлежит множеству',
      'label_operation-date-in': 'Принадлежит диапазону',
      'label_operation-is-not-null': 'Не пусто и определено',
      'label_operation-is-null': 'Пусто или не определено',
      'label_operation-lt': 'Меньше',
      'label_operation-lte': 'Меньше или равно',
      'label_operation-nequals': 'Не равно',
      'label_operation-nin': 'Не принадлежит множеству',
      'label_operation-startswith': 'Начинается на',
    };

    return (
      <div>
        <div className={b('row')}>
          <span className={b('label')}>Операция</span>
          <Select
            theme="pseudo"
            size="s"
            view="default"
            tone="default"
            type="radio"
            placeholder="size s"
            width="min"
            val={operation}
            onChange={newValue => this.onSelectChange(newValue)}
          >
            {availableOperations.map((operation, i) => {
              return (
                <Select.Item key={`operation-${i}`} val={operation}>
                  {labelOperations[operation.title]
                    ? labelOperations[operation.title]
                    : ''}
                </Select.Item>
              );
            })}
          </Select>
        </div>
        <div className={b('divider')} />
        <div className={b('input-section')}>
          {isDate
            ? !operation.noOperands && this.renderManualCalendarInput()
            : selectable
            ? this.renderSelectableInput()
            : this.renderManualInput()}
        </div>
        <div className={b('divider')} />
      </div>
    );
  }

  render() {
    const { item } = this.props;
    const { value, operation } = this.state;

    if (item) {
      const { cast } = item;
      const itemType = item.type.toLowerCase();
      const isDate = cast === 'date' || cast === 'datetime';
      const castIconData = getIconForCast(cast);

      // По умолчанию все валидно
      let valid = true;

      // Кроме дат
      if (isDate) {
        // Дата валидна только тогда, если указана хотя бы одна полноценная дата
        valid = (value.length && value[0].length) || operation.noOperands;
      }

      return (
        <Dialog visible={this.state.visible} onClose={this.onClose}>
          <div
            className={`dialog-filter dialog-filter-${itemType}${
              isDate ? ' dialog-filter-date' : ''
            }`}
          >
            <Dialog.Header
              caption={item.title}
              insertBefore={<Icon data={castIconData} width="16" />}
            />
            <Dialog.Body>{this.renderModalBody()}</Dialog.Body>
            <Dialog.Footer
              preset="default"
              onClickButtonCancel={this.onCancel}
              onClickButtonApply={this.onApply}
              propsButtonApply={{
                disabled: !valid,
              }}
              textButtonApply="Применить фильтр"
              textButtonCancel="Отменить"
              listenKeyEnter
              hr={false}
            />
          </div>
        </Dialog>
      );
    } else {
      return null;
    }
  }
}

export default DialogFilter;
