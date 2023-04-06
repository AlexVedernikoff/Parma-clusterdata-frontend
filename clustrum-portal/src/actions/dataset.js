import { createActionTypes } from '../store/utils/api';

export const FETCH_DATASET = createActionTypes('DATASET', 'FETCH');
export const INITIAL_FETCH_DATASET = createActionTypes('DATASET', 'INITIAL_FETCH');
export const SAVE_DATASET = createActionTypes('DATASET', 'SAVE');
export const SYNC_DATASET = createActionTypes('DATASET', 'SYNC');
export const VALIDATE_DATASET = createActionTypes('DATASET', 'VALIDATE');
export const FETCH_PREVIEW_DATASET = createActionTypes('PREVIEW_DATASET', 'FETCH');
export const FETCH_HISTORY_DATASET = createActionTypes('HISTORY_DATASET', 'FETCH');
export const FETCH_FIELD_TYPES = createActionTypes('FIELD_TYPES', 'FETCH');

export const TOGGLE_PREVIEW = 'TOGGLE_PREVIEW';
export const TOGGLE_HISTORY = 'TOGGLE_HISTORY';
export const TOGGLE_VISIBILITY_PREVIEW = 'TOGGLE_VISIBILITY_PREVIEW';
export const TOGGLE_VISIBILITY_HISTORY = 'TOGGLE_VISIBILITY_HISTORY';
export const SYNC_DATASET_WIDTH_SOURCE = 'SYNC_DATASET_WIDTH_SOURCE';
export const CHANGE_AMOUNT_PREVIEW_ROWS = 'CHANGE_AMOUNT_PREVIEW_ROWS';
export const CHANGE_AMOUNT_HISTORY_ROWS = 'CHANGE_AMOUNT_HISTORY_ROWS';

export const ADD_FIELD = 'ADD_FIELD';
export const SKIP_APPLY_VALIDATION = 'SKIP_APPLY_VALIDATION';
export const DUPLICATE_FIELD = 'DUPLICATE_FIELD';
export const DELETE_FIELD = 'DELETE_FIELD';
export const UPDATE_FIELD = 'UPDATE_FIELD';
export const UPDATE_RLS = 'UPDATE_RLS';

export const SET_IS_DATASET_CHANGED_FLAG = 'SET_IS_DATASET_CHANGED_FLAG';
