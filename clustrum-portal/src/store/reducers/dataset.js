import React from 'react';
import Utils from '../../helpers/utils';
import _debounce from 'lodash/debounce';
import _isEqual from 'lodash/isEqual';
import { DatasetSDK } from '@kamatech-data-ui/clustrum';

import DatasetFieldErrors from '../../components/DatasetFieldErrors/DatasetFieldErrors';

import {
  FETCH_DATASET,
  INITIAL_FETCH_DATASET,
  SAVE_DATASET,
  SYNC_DATASET,
  VALIDATE_DATASET,
  FETCH_PREVIEW_DATASET,
  TOGGLE_PREVIEW,
  TOGGLE_VISIBILITY_PREVIEW,
  CHANGE_AMOUNT_PREVIEW_ROWS,
  FETCH_FIELD_TYPES,
  SET_IS_DATASET_CHANGED_FLAG,
  ADD_FIELD,
  DUPLICATE_FIELD,
  DELETE_FIELD,
  UPDATE_FIELD,
  SKIP_APPLY_VALIDATION,
  UPDATE_RLS,
  SYNC_DATASET_WIDTH_SOURCE,
  FETCH_HISTORY_DATASET,
  TOGGLE_VISIBILITY_HISTORY,
  TOGGLE_HISTORY,
  CHANGE_AMOUNT_HISTORY_ROWS,
} from '../../actions/dataset';
import { CalcModes } from '../../../kamatech_modules/@kamatech-data-ui/clustrum';
import { NotificationType } from '@clustrum-lib/shared/lib/notification';

function getMessageText() {
  return {
    CREATE_DATASET_MSGS: {
      NOTIFICATION_SUCCESS: 'Набор данных создан',
      NOTIFICATION_FAILURE: 'Ошибка: не удалось создать датасет',
    },
    FIELD_DUPLICATED_MSGS: {
      NOTIFICATION_SUCCESS: 'Поле продублировано',
      NOTIFICATION_FAILURE: '',
    },
    FIELD_REMOVE_MSGS: {
      NOTIFICATION_SUCCESS: 'Поле удалено',
      NOTIFICATION_FAILURE: '',
    },
    DATASET_SAVE_MSGS: {
      NOTIFICATION_SUCCESS: 'Набор данных сохранен',
      NOTIFICATION_FAILURE: 'Ошибка: не удалось сохранить датасет',
    },
    DATASET_SYNC_MSGS: {
      NOTIFICATION_SUCCESS: 'Набор данных синхронизирован',
      NOTIFICATION_FAILURE: 'Ошибка: не удалось синхронизировать датасет',
    },
    DATASET_FETCH_PREVIEW_MSGS: {
      NOTIFICATION_SUCCESS: '',
      NOTIFICATION_FAILURE: 'Ошибка: не удалось загрузить данные для предпросмотра',
    },
    DATASET_VALIDATION_MSGS: {
      NOTIFICATION_SUCCESS: '',
      NOTIFICATION_FAILURE: 'Ошибка: датасет не прошел валидацию',
    },
    FETCH_TYPES_MSGS: {
      NOTIFICATION_SUCCESS: '',
      NOTIFICATION_FAILURE: 'Ошибка: не удалось загрузить типы данных',
    },
    DATASET_FETCH_HISTORY_MSGS: {
      NOTIFICATION_SUCCESS: '',
      NOTIFICATION_FAILURE: 'Ошибка: не удалось загрузить данные о версионности',
    },
  };
}

function getToastTitle(type, actionTypeNotification) {
  switch (actionTypeNotification) {
    case 'create': {
      return getMessageText().CREATE_DATASET_MSGS[type];
    }

    case 'duplicate': {
      return getMessageText().FIELD_DUPLICATED_MSGS[type];
    }

    case 'remove': {
      return getMessageText().FIELD_REMOVE_MSGS[type];
    }

    case 'save': {
      return getMessageText().DATASET_SAVE_MSGS[type];
    }

    case 'sync': {
      return getMessageText().DATASET_SYNC_MSGS[type];
    }

    case 'preview': {
      return getMessageText().DATASET_FETCH_PREVIEW_MSGS[type];
    }

    case 'validate': {
      return getMessageText().DATASET_VALIDATION_MSGS[type];
    }

    case 'types': {
      return getMessageText().FETCH_TYPES_MSGS[type];
    }

    case 'history': {
      return getMessageText().DATASET_FETCH_HISTORY_MSGS[type];
    }
  }
}

export function togglePreview({ view }) {
  return dispatch => {
    dispatch({
      type: TOGGLE_PREVIEW,
      payload: {
        view,
      },
    });
  };
}

export function toggleHistory({ view }) {
  return dispatch => {
    dispatch({
      type: TOGGLE_HISTORY,
      payload: {
        view,
      },
    });
  };
}

export function toggleVisibilityPreview({ isVisible } = {}) {
  return dispatch => {
    dispatch({
      type: TOGGLE_VISIBILITY_PREVIEW,
      payload: {
        isVisible,
      },
    });
  };
}

export function toggleVisibilityHistory({ isVisible } = {}) {
  return dispatch => {
    dispatch({
      type: TOGGLE_VISIBILITY_HISTORY,
      payload: {
        isVisible,
      },
    });
  };
}

export function duplicateField(field) {
  return dispatch => {
    dispatch({
      type: DUPLICATE_FIELD,
      payload: {
        field,
      },
    });
  };
}
export function deleteField(field) {
  return dispatch => {
    dispatch({
      type: DELETE_FIELD,
      payload: {
        field,
      },
    });
  };
}
export function addField(field) {
  return dispatch => {
    dispatch({
      type: ADD_FIELD,
      payload: {
        field,
      },
    });
  };
}
export function updateField(field) {
  return dispatch => {
    dispatch({
      type: UPDATE_FIELD,
      payload: {
        field,
      },
    });
  };
}
export function updateRLS(rls) {
  return dispatch => {
    dispatch({
      type: UPDATE_RLS,
      payload: {
        rls,
      },
    });
  };
}

function checkFetchingPreview({ updatePreview, updates }) {
  return (
    !updatePreview &&
    updates &&
    updates.length &&
    !updates.every(update => {
      const { field: { description, title } = {} } = update;

      if (description || title) {
        return true;
      }

      return false;
    })
  );
}

export function updateDatasetByValidation({
  actionTypeNotification,
  updatePreview = false,
  validateEnabled = true,
  datasetErrorDialogRef,
  openNotification,
} = {}) {
  return async (dispatch, getState) => {
    let fetchingPreviewEnabled;

    if (validateEnabled) {
      const updates = await dispatch(validateDataset({ openNotification }));

      fetchingPreviewEnabled = checkFetchingPreview({ updatePreview, updates });
    }

    const {
      dataset: {
        id: datasetId,
        preview: { amountPreviewRows } = {},
        history: { amountPreviewRows: amountHistoryRows } = {},
        validation: { field_errors: fieldErrors = [] } = {},
        preview_enabled: previewEnabled,
        resultSchema,
      } = {},
    } = getState();

    if (previewEnabled && (fetchingPreviewEnabled || updatePreview)) {
      if (fieldErrors.length) {
        dispatch(setEmptyPreview());
      } else {
        dispatch(
          fetchPreviewDataset({
            datasetId,
            resultSchema,
            limit: amountPreviewRows,
            datasetErrorDialogRef,
            openNotification,
          }),
        );
      }
    }

    if (actionTypeNotification) {
      openNotification({
        key: 'success_update_dataset',
        title: getToastTitle('NOTIFICATION_SUCCESS', actionTypeNotification),
        type: NotificationType.Success,
      });
    }
  };
}

export function changeAmountPreviewRows({ amountPreviewRows, openNotification }) {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_AMOUNT_PREVIEW_ROWS,
      payload: {
        amountPreviewRows,
      },
    });

    const {
      dataset: { id: datasetId, resultSchema },
    } = getState();

    dispatch(
      fetchPreviewDataset({
        datasetId,
        resultSchema,
        limit: amountPreviewRows,
        openNotification,
      }),
    );
  };
}

export function setDocumentTitle() {
  return async (dispatch, getState) => {
    const { dataset: { key } = {} } = getState();

    document.title = `${Utils.getNameByKey({ key })}`;
  };
}

export function initialFetchDataset({
  datasetId,
  datasetErrorDialogRef,
  openNotification,
}) {
  return async (dispatch, getState, { sdk }) => {
    try {
      dispatch({
        type: INITIAL_FETCH_DATASET.REQUEST,
        payload: {},
      });

      const data = await Promise.all([
        dispatch(fetchFieldTypes(openNotification)),
        sdk.bi.getDataSetByVersion({ dataSetId: datasetId, version: 'draft' }),
      ]);

      const dataset = data[1];
      const { preview_enabled: previewEnabled } = dataset;

      if (!previewEnabled) {
        dispatch(
          toggleVisibilityPreview({
            isVisible: false,
          }),
        );
      }

      dispatch({
        type: INITIAL_FETCH_DATASET.SUCCESS,
        payload: {
          dataset,
        },
      });

      dispatch(setDocumentTitle());

      dispatch(validateDataset({ initial: true, openNotification }));

      const {
        dataset: {
          preview: { amountPreviewRows } = {},
          history: { amountPreviewRows: amountHistoryRows } = {},
          resultSchema,
        } = {},
      } = getState();

      if (previewEnabled) {
        dispatch(
          fetchPreviewDataset({
            datasetId,
            resultSchema,
            limit: amountPreviewRows,
            datasetErrorDialogRef,
            openNotification,
          }),
        );
      }

      dispatch(
        fetchHistoryDataset({
          datasetId,
          limit: amountHistoryRows,
          openNotification,
        }),
      );
    } catch (error) {
      dispatch({
        type: INITIAL_FETCH_DATASET.FAILURE,
        payload: {
          error,
        },
      });
    }
  };
}

export function fetchDataset({ datasetId }) {
  return async (dispatch, getState, { sdk }) => {
    try {
      dispatch({
        type: FETCH_DATASET.REQUEST,
        payload: {},
      });

      const dataset = await sdk.bi.getDataSetByVersion({
        dataSetId: datasetId,
        version: 'draft',
      });

      dispatch({
        type: FETCH_DATASET.SUCCESS,
        payload: {
          dataset,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_DATASET.FAILURE,
        payload: {
          error,
        },
      });
    }
  };
}

function setEmptyPreview() {
  return dispatch => {
    dispatch({
      type: FETCH_PREVIEW_DATASET.SUCCESS,
      payload: {
        previewData: [],
      },
    });
  };
}

const dispatchFetchPreviewDataset = async (
  { datasetId, resultSchema, version, limit, datasetErrorDialogRef, openNotification },
  dispatch,
  getState,
  { sdk },
) => {
  try {
    dispatch({
      type: FETCH_PREVIEW_DATASET.REQUEST,
      payload: {},
    });

    const resultSchemasWithSource = resultSchema.filter(
      rs =>
        rs.source !== '' &&
        rs.formula === '' &&
        (rs.calc_mode === CalcModes.Direct || rs.calc_mode === CalcModes.Spel) &&
        (rs.spel === '' ||
          rs.spel.substring(rs.spel.indexOf('[') + 1, rs.spel.lastIndexOf(']')) ===
            rs.source),
    );

    const previewDataset = await sdk.bi.previewDataSet(
      {
        dataSetId: datasetId,
        version,
        resultSchema: resultSchemasWithSource,
        limit,
      },
      { cancelable: true },
    );

    dispatch({
      type: FETCH_PREVIEW_DATASET.SUCCESS,
      payload: {
        previewData: previewDataset.result,
      },
    });
  } catch (error) {
    if (!sdk.isCancel(error)) {
      const actions = [];

      dispatch({
        type: FETCH_PREVIEW_DATASET.FAILURE,
        payload: {
          error,
        },
      });

      if (datasetErrorDialogRef) {
        actions.push({
          isForceCloseAfterClick: true,
          label: 'Подробнее',
          onClick: datasetErrorDialogRef.current && datasetErrorDialogRef.current.open,
        });
      }
      openNotification({
        key: 'error_fetch_dataset',
        title: getToastTitle('NOTIFICATION_FAILURE', 'preview'),
        type: NotificationType.Error,
        duration: 60,
        actions,
      });
    }
  }
};

const debouncedFetchPreviewDataset = _debounce(dispatchFetchPreviewDataset, 3000);

export function fetchPreviewDataset({
  datasetId,
  resultSchema,
  version = 'draft',
  limit = 100,
  debounceEnabled = false,
  datasetErrorDialogRef,
  openNotification,
}) {
  return debounceEnabled
    ? debouncedFetchPreviewDataset.bind(this, {
        datasetId,
        resultSchema,
        version,
        limit,
        datasetErrorDialogRef,
        openNotification,
      })
    : dispatchFetchPreviewDataset.bind(this, {
        datasetId,
        resultSchema,
        version,
        limit,
        datasetErrorDialogRef,
        openNotification,
      });
}

const dispatchFetchHistoryDataset = async (
  { datasetId, limit, datasetErrorDialogRef, openNotification },
  dispatch,
  getState,
  { sdk },
) => {
  try {
    dispatch({
      type: FETCH_HISTORY_DATASET.REQUEST,
      payload: {},
    });

    const history = await sdk.bi.history(
      {
        datasetId: datasetId,
        limit: limit,
      },
      { cancelable: true },
    );

    dispatch({
      type: FETCH_HISTORY_DATASET.SUCCESS,
      payload: {
        historyData: history.resultSchemaHistory,
      },
    });
  } catch (error) {
    if (!sdk.isCancel(error)) {
      const actions = [];

      dispatch({
        type: FETCH_HISTORY_DATASET.FAILURE,
        payload: {
          error,
        },
      });

      if (datasetErrorDialogRef) {
        actions.push({
          isForceCloseAfterClick: true,
          label: 'Подробнее',
          onClick: datasetErrorDialogRef.current && datasetErrorDialogRef.current.open,
        });
      }

      openNotification({
        key: 'error_fetch_history_dataset',
        title: getToastTitle('NOTIFICATION_FAILURE', 'history'),
        type: NotificationType.Error,
        timeout: 6,
        actions,
      });
    }
  }
};

const debouncedFetchHistoryDataset = _debounce(dispatchFetchHistoryDataset, 3000);

export function fetchHistoryDataset({
  datasetId,
  limit,
  debounceEnabled = false,
  openNotification,
}) {
  return debounceEnabled
    ? debouncedFetchHistoryDataset.bind(this, {
        datasetId,
        limit,
        openNotification,
      })
    : dispatchFetchHistoryDataset.bind(this, {
        datasetId,
        limit,
        openNotification,
      });
}

export function changeAmountHistoryRows({ amountPreviewRows }) {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_AMOUNT_HISTORY_ROWS,
      payload: {
        amountPreviewRows,
      },
    });

    const {
      dataset: { id: datasetId },
    } = getState();

    dispatch(
      fetchHistoryDataset({
        datasetId,
        limit: amountPreviewRows,
      }),
    );
  };
}

function prepareUpdates(updates) {
  return updates.map(update => {
    const { field: { autoaggregated } = {}, field } = update;

    if (autoaggregated === null) {
      delete field.autoaggregated;
    }

    return update;
  });
}

export function validateDataset({
  isProcessingDatasetOnRequest = false,
  initial = false,
  openNotification,
} = {}) {
  return async (dispatch, getState, { sdk }) => {
    try {
      dispatch({
        type: VALIDATE_DATASET.REQUEST,
        payload: {
          isProcessingDataset: isProcessingDatasetOnRequest,
        },
      });

      const {
        dataset: { id: datasetId, updates, initialResultSchema } = {},
      } = getState();

      const validation = await sdk.bi.validateDataSet(
        {
          dataSetId: datasetId,
          version: 'draft',
          updates: prepareUpdates(updates),
        },
        { cancelable: true },
      );

      const { dataset: { updates: currentUpdates } = {} } = getState();

      const isNothingChanged = currentUpdates.length === updates.length;

      if (isNothingChanged) {
        if (!initial) {
          dispatch({
            type: VALIDATE_DATASET.SUCCESS,
            payload: {
              validation,
            },
          });
        }
      } else {
        dispatch({ type: SKIP_APPLY_VALIDATION });
      }

      return updates;
    } catch ({ response }) {
      if (!sdk.isCancel()) {
        const {
          data: {
            data: {
              dataset_errors: datasetErrors = [],
              field_errors: fieldErrors = [],
            } = {},
            data: validation,
            error: { messageError: messageError = '' } = {},
          } = {},
        } = response;

        dispatch({
          type: VALIDATE_DATASET.FAILURE,
          payload: {
            validation,
            response,
          },
        });

        openNotification({
          key: 'error_dataset_validation',
          title: getToastTitle('NOTIFICATION_FAILURE', 'validate'),
          type: NotificationType.Error,
          duration: 30,
          description: fieldErrors.length ? (
            <DatasetFieldErrors fieldErrors={fieldErrors} />
          ) : (
            <>
              <span>{datasetErrors.join('; ')}</span>
              <code>{messageError}</code>
            </>
          ),
        });
      }
    }
  };
}

export function syncDataSet({ datasetErrorDialogRef, openNotification }) {
  return async (dispatch, getState, { sdk }) => {
    try {
      dispatch({
        type: SYNC_DATASET.REQUEST,
        payload: {},
      });

      const { dataset: { id: datasetId } = {} } = getState();

      const dataset = await sdk.bi.syncDataSet({
        dataSetId: datasetId,
      });

      const { preview_enabled: previewEnabled } = dataset;

      if (!previewEnabled) {
        dispatch(
          toggleVisibilityPreview({
            isVisible: false,
          }),
        );
      }

      dispatch({
        type: SYNC_DATASET.SUCCESS,
        payload: {
          dataset,
        },
      });

      dispatch(setDocumentTitle());

      dispatch(validateDataset({ initial: true, openNotification }));

      const {
        dataset: {
          preview: { amountPreviewRows } = {},
          history: { amountPreviewRows: amountHistoryRows } = {},
          resultSchema,
        } = {},
      } = getState();

      if (previewEnabled) {
        dispatch(
          fetchPreviewDataset({
            datasetId,
            resultSchema,
            limit: amountPreviewRows,
            datasetErrorDialogRef,
            openNotification,
          }),
        );
      }

      dispatch(
        fetchHistoryDataset({
          datasetId,
          limit: amountHistoryRows,
          openNotification,
        }),
      );

      //dispatch(initialFetchDataset({datasetId: datasetId, datasetErrorDialogRef: datasetErrorDialogRef}));

      // dispatch({
      //     type: SYNC_DATASET.SUCCESS,
      //     payload: {dataSetId: datasetId, datasetErrorDialogRef: datasetErrorDialogRef}
      // });
      openNotification({
        key: 'success_sync_dataset',
        title: getToastTitle('NOTIFICATION_SUCCESS', 'sync'),
        type: NotificationType.Success,
      });
    } catch (error) {
      dispatch({
        type: SYNC_DATASET.FAILURE,
        payload: {
          error,
        },
      });
      const actions = [];

      if (datasetErrorDialogRef) {
        actions.push({
          isForceCloseAfterClick: true,
          label: 'Подробнее',
          onClick: datasetErrorDialogRef.current.open,
        });
      }

      openNotification({
        key: 'error_sync_dataset',
        title: getToastTitle('NOTIFICATION_FAILURE', 'sync'),
        type: NotificationType.Error,
        duration: 30,
        actions,
      });
    }
  };
}

export function saveDataset({ datasetErrorDialogRef, openNotification }) {
  return async (dispatch, getState, { sdk }) => {
    try {
      dispatch({
        type: SAVE_DATASET.REQUEST,
        payload: {},
      });

      const { dataset: { id: datasetId, resultSchema, rls } = {} } = getState();

      await sdk.bi.updateDataSet({
        dataSetId: datasetId,
        version: 'draft',
        resultSchema,
        rls,
      });

      dispatch({
        type: SAVE_DATASET.SUCCESS,
        payload: {},
      });

      openNotification({
        key: 'success_save_dataset',
        title: getToastTitle('NOTIFICATION_SUCCESS', 'save'),
        type: NotificationType.Success,
      });
    } catch (error) {
      dispatch({
        type: SAVE_DATASET.FAILURE,
        payload: {
          error,
        },
      });
      const actions = [];

      if (datasetErrorDialogRef) {
        actions.push({
          isForceCloseAfterClick: true,
          label: 'Подробнее',
          onClick: datasetErrorDialogRef.current.open,
        });
      }

      openNotification({
        key: 'error_save_dataset',
        title: getToastTitle('NOTIFICATION_FAILURE', 'save'),
        type: NotificationType.Error,
        duration: 30,
        actions,
      });
    }
  };
}

export function fetchFieldTypes({ openNotification }) {
  return async (dispatch, getState, { sdk }) => {
    let types;

    try {
      dispatch({
        type: FETCH_FIELD_TYPES.REQUEST,
        payload: {},
      });

      const response = await sdk.bi.getFieldTypes();

      types = response.types.sort(Utils.sortObjectBy('name')).map(type => {
        const { aggregations } = type;

        return {
          ...type,
          aggregations: aggregations.sort((current, next) => {
            if (next === 'none') {
              return 1;
            } else {
              return Utils.sortStrings(current, next);
            }
          }),
        };
      });

      dispatch({
        type: FETCH_FIELD_TYPES.SUCCESS,
        payload: {
          types,
        },
      });

      return types;
    } catch (error) {
      dispatch({
        type: FETCH_FIELD_TYPES.FAILURE,
        payload: {
          error,
        },
      });
    }
    openNotification({
      key: 'error_fetch_types',
      title: getToastTitle('NOTIFICATION_FAILURE', 'types'),
      type: NotificationType.Error,
    });

    return types;
  };
}

function mergeValidatedFields(validatedFields, fields) {
  const validatedFieldsMap = validatedFields.reduce((resultSchemaMap, field) => {
    const { guid } = field;

    resultSchemaMap[guid] = field;

    return resultSchemaMap;
  }, {});

  return fields.map(currentField => {
    const { guid } = currentField;

    const validatedField = validatedFieldsMap[guid];

    if (_isEqual(currentField, validatedField)) {
      return currentField;
    } else {
      return validatedField;
    }
  });
}

const initialState = {
  isLoading: true,
  isLoadingDatasetTable: false,
  isDatasetChanged: false,
  isProcessingDataset: false,
  preview: {
    readyPreview: 'loading',
    isVisible: true,
    isLoading: true,
    amountPreviewRows: 10,
    view: 'bottom',
    data: [],
    error: null,
  },
  history: {
    readyPreview: 'loading',
    isVisible: false,
    isLoading: true,
    amountPreviewRows: 10,
    view: 'bottom',
    data: [],
    error: null,
  },
  validation: {
    isProcessingValidation: false,
    field_errors: [],
    error: null,
  },
  savingDataset: {
    disabled: false,
    isProcessingSavingDataset: false,
    error: null,
  },
  types: {
    data: [],
    error: null,
  },
  error: null,
  updates: [],
  initialResultSchema: [],
  resultSchema: [],
};

export function dataset(state = initialState, action) {
  switch (action.type) {
    case INITIAL_FETCH_DATASET.REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case INITIAL_FETCH_DATASET.SUCCESS: {
      const {
        dataset: { result_schema: resultSchema, ...restDatasetParams } = {},
      } = action.payload;

      return {
        ...state,
        ...restDatasetParams,
        initialResultSchema: resultSchema,
        resultSchema,
        isLoading: false,
        isDatasetChanged: false,
        preview: {
          ...state.preview,
        },
      };
    }
    case INITIAL_FETCH_DATASET.FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoading: false,
        error,
      };
    }
    case SYNC_DATASET.REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case SYNC_DATASET.FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoading: false,
        error,
      };
    }
    case SYNC_DATASET.SUCCESS: {
      const {
        dataset: { result_schema: resultSchema, ...restDatasetParams } = {},
      } = action.payload;

      return {
        ...state,
        ...restDatasetParams,
        initialResultSchema: resultSchema,
        resultSchema,
        isLoading: false,
        isDatasetChanged: false,
        preview: {
          ...state.preview,
        },
      };
    }
    case FETCH_DATASET.REQUEST: {
      return {
        ...state,
        isLoadingDatasetTable: true,
        error: null,
      };
    }
    case FETCH_DATASET.SUCCESS: {
      const { dataset } = action.payload;

      return {
        ...state,
        ...dataset,
        isLoadingDatasetTable: false,
        isDatasetChanged: false,
      };
    }
    case FETCH_DATASET.FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoadingDatasetTable: false,
        error,
      };
    }
    case FETCH_PREVIEW_DATASET.REQUEST: {
      return {
        ...state,
        preview: {
          ...state.preview,
          isLoading: true,
          readyPreview: 'loading',
          error: null,
        },
      };
    }
    case FETCH_PREVIEW_DATASET.SUCCESS: {
      const { previewData } = action.payload;

      return {
        ...state,
        preview: {
          ...state.preview,
          isLoading: false,
          readyPreview: null,
          data: previewData,
        },
      };
    }
    case FETCH_PREVIEW_DATASET.FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        preview: {
          ...state.preview,
          isLoading: false,
          readyPreview: 'failed',
          error,
        },
      };
    }
    case TOGGLE_PREVIEW: {
      const { view } = action.payload;

      return {
        ...state,
        preview: {
          ...state.preview,
          view,
        },
      };
    }
    case TOGGLE_VISIBILITY_PREVIEW: {
      const { isVisible } = action.payload;

      if (typeof isVisible === 'undefined') {
        return {
          ...state,
          preview: {
            ...state.preview,
            isVisible: !state.preview.isVisible,
          },
        };
      } else {
        return {
          ...state,
          preview: {
            ...state.preview,
            isVisible,
          },
        };
      }
    }
    case FETCH_HISTORY_DATASET.REQUEST: {
      return {
        ...state,
        history: {
          ...state.history,
          isLoading: true,
          readyPreview: 'loading',
          error: null,
        },
      };
    }
    case FETCH_HISTORY_DATASET.SUCCESS: {
      const { historyData } = action.payload;

      return {
        ...state,
        history: {
          ...state.history,
          isLoading: false,
          readyPreview: null,
          data: historyData,
        },
      };
    }
    case FETCH_HISTORY_DATASET.FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        history: {
          ...state.history,
          isLoading: false,
          readyPreview: 'failed',
          error,
        },
      };
    }
    case TOGGLE_HISTORY: {
      const { view } = action.payload;

      return {
        ...state,
        history: {
          ...state.history,
          view,
        },
      };
    }
    case TOGGLE_VISIBILITY_HISTORY: {
      const { isVisible } = action.payload;

      if (typeof isVisible === 'undefined') {
        return {
          ...state,
          history: {
            ...state.history,
            isVisible: !state.history.isVisible,
          },
        };
      } else {
        return {
          ...state,
          history: {
            ...state.history,
            isVisible,
          },
        };
      }
    }
    case DUPLICATE_FIELD: {
      const { field } = action.payload;
      const { updates, resultSchema } = state;

      const { fieldNext, fieldsNext } = DatasetSDK.duplicateField({
        field,
        fields: resultSchema,
      });
      const { guid: newFieldGuid } = fieldNext;

      const orderIndex = fieldsNext.findIndex(({ guid }) => guid === newFieldGuid);

      const resultSchemaNext = fieldsNext;
      const update = {
        action: 'add',
        order_index: orderIndex,
        field: fieldNext,
      };

      return {
        ...state,
        resultSchema: resultSchemaNext,
        updates: [...updates, update],
      };
    }
    case DELETE_FIELD: {
      const { field: { guid } = {} } = action.payload;
      const { resultSchema, updates } = state;

      const resultSchemaNext = resultSchema.filter(
        ({ guid: currentGuid }) => currentGuid !== guid,
      );
      const update = {
        action: 'delete',
        field: {
          guid,
        },
      };

      return {
        ...state,
        resultSchema: resultSchemaNext,
        updates: [...updates, update],
      };
    }
    case ADD_FIELD: {
      const { field } = action.payload;
      const { resultSchema, updates } = state;

      const fieldNext = {
        valid: true,
        ...field,
      };

      const resultSchemaNext = [fieldNext, ...resultSchema];
      const update = {
        action: 'add',
        order_index: 0,
        field: fieldNext,
      };

      return {
        ...state,
        resultSchema: resultSchemaNext,
        updates: [...updates, update],
      };
    }
    case UPDATE_FIELD: {
      const { field } = action.payload;
      const { resultSchema, updates } = state;
      const { guid } = field;

      const update = {
        action: 'update',
        field: field,
      };

      const resultSchemaNext = resultSchema.map(currentField => {
        const { guid: currentGuid } = currentField;

        if (currentGuid === guid) {
          return {
            ...currentField,
            ...field,
          };
        }

        return currentField;
      });

      return {
        ...state,
        resultSchema: resultSchemaNext,
        updates: [...updates, update],
      };
    }
    case UPDATE_RLS: {
      const { rls } = action.payload;

      return {
        ...state,
        rls: {
          ...state.rls,
          ...rls,
        },
      };
    }
    case VALIDATE_DATASET.REQUEST: {
      const { isProcessingDataset } = action.payload;

      if (isProcessingDataset) {
        return {
          ...state,
          isProcessingDataset,
          validation: {
            ...state.validation,
            isProcessingValidation: true,
            error: null,
          },
          savingDataset: {
            ...state.savingDataset,
            disabled: true,
          },
        };
      }

      return state;
    }
    case SKIP_APPLY_VALIDATION: {
      return state;
    }
    case VALIDATE_DATASET.SUCCESS: {
      const {
        validation: { result_schema: validatedResultSchema, ...restValidation },
      } = action.payload;
      const { resultSchema, updates } = state;

      const resultSchemaNext = mergeValidatedFields(validatedResultSchema, resultSchema);

      return {
        ...state,
        isProcessingDataset: false,
        validation: {
          ...state.validation,
          isProcessingValidation: false,
          ...restValidation,
        },
        initialResultSchema: resultSchemaNext,
        resultSchema: resultSchemaNext,
        updates,
        unvalidatedFields: [],
        savingDataset: {
          ...state.savingDataset,
          disabled: false,
        },
      };
    }
    case VALIDATE_DATASET.FAILURE: {
      const {
        validation: {
          field_errors: fieldErrors = [],
          result_schema: validatedResultSchema = [],
          ...restValidationParams
        } = {},
      } = action.payload;
      const { resultSchema, updates } = state;
      let resultSchemaNext;

      if (validatedResultSchema.length) {
        const fieldErrorsGuids = fieldErrors.map(({ guid }) => guid);

        const validatedResultSchemaNext = validatedResultSchema.map(currentField => {
          const { guid } = currentField;

          if (fieldErrorsGuids.includes(guid)) {
            return {
              ...currentField,
              valid: false,
            };
          }

          return currentField;
        });

        resultSchemaNext = mergeValidatedFields(validatedResultSchemaNext, resultSchema);
      } else {
        resultSchemaNext = resultSchema;
      }

      return {
        ...state,
        isProcessingDataset: false,
        validation: {
          ...state.validation,
          isProcessingValidation: false,
          fieldErrors,
          ...restValidationParams,
        },
        updates,
        initialResultSchema: resultSchemaNext,
        resultSchema: resultSchemaNext,
        savingDataset: {
          ...state.savingDataset,
          disabled: false,
        },
      };
    }
    case SAVE_DATASET.REQUEST: {
      return {
        ...state,
        savingDataset: {
          ...state.savingDataset,
          isProcessingSavingDataset: true,
          error: null,
        },
      };
    }
    case SAVE_DATASET.SUCCESS: {
      return {
        ...state,
        savingDataset: {
          ...state.savingDataset,
          isProcessingSavingDataset: false,
          error: {},
        },
        updates: [],
      };
    }
    case SAVE_DATASET.FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        savingDataset: {
          ...state.savingDataset,
          isProcessingSavingDataset: false,
          error,
        },
      };
    }
    case CHANGE_AMOUNT_PREVIEW_ROWS: {
      const { amountPreviewRows } = action.payload;

      return {
        ...state,
        preview: {
          ...state.preview,
          amountPreviewRows,
        },
      };
    }
    case FETCH_FIELD_TYPES.SUCCESS: {
      const { types } = action.payload;

      return {
        ...state,
        types: {
          ...state.types,
          data: types,
        },
      };
    }
    case SET_IS_DATASET_CHANGED_FLAG: {
      const { isDatasetChanged } = action.payload;

      return {
        ...state,
        isDatasetChanged,
      };
    }
    default:
      return state;
  }
}

export const datasetSelector = state => state.dataset;
export const datasetValidationSelector = state => state.dataset.validation;
export const datasetFieldsSelector = state => state.dataset.resultSchema;

export const datasetIdSelector = state => state.dataset.id;
export const datasetKeySelector = state => state.dataset.key;
export const datasetNameSelector = state => state.dataset.name;
export const typesSelector = state => state.dataset.types.data;
export const sourcesSelector = state => state.dataset.raw_schema;
export const rlsSelector = state => state.dataset.rls;
export const aceModeUrlSelector = state => state.dataset.ace_url;
export const previewEnabledSelector = state => state.dataset.preview_enabled;

export const datasetPreviewSelector = state => state.dataset.preview;
export const datasetHistorySelector = state => state.dataset.history;

export const datasetErrorSelector = state => state.dataset.error;
export const datasetPreviewErrorSelector = state => state.dataset.preview.error;
export const datasetSavingErrorSelector = state => state.dataset.savingDataset.error;

export const isDatasetChangedDatasetSelector = state => state.dataset.isDatasetChanged;
export const isLoadingDatasetSelector = state => state.dataset.isLoading;
export const isFavoriteDatasetSelector = state => state.dataset.is_favorite;
export const isProcessingDatasetSelector = state => state.dataset.isProcessingDataset;
export const isSavingDatasetSelector = state =>
  state.dataset.savingDataset.isProcessingSavingDataset;
export const isSavingDatasetDisabledSelector = state =>
  state.dataset.savingDataset.savingDatasetDisabled;
