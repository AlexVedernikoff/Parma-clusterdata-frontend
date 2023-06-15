/* eslint-disable camelcase */

import axiosInstance from '../axios/axios';
import settings from '../settings/settings';

import moment from 'moment/moment';
import { TYPES as COMMENT_TYPES } from '../../components/Menu/Items/CommentsModal/Form/commentsTypes';
import Api from './api';
import ApiStat from './api-stat';

const DEFAULT_COLOR = '#ffcc00';

// TODO: убрать отстой с пробрасыванием seriesIds

function fromStatComment(
  { id, path, user, date, subject, fields, meta_data },
  seriesIds,
) {
  const { point_color, color, visible, ...restMeta } = JSON.parse(meta_data);
  const matchedIds = fields.filter(field => seriesIds.includes(field));
  return {
    id,
    feed: path,
    creatorLogin: user,
    date: moment.utc(date).format(),
    type: matchedIds.length ? COMMENT_TYPES.DOT_XY : COMMENT_TYPES.BAND_X,
    text: subject,
    meta: {
      color: matchedIds.length ? point_color : color || DEFAULT_COLOR,
      graphId: matchedIds.length ? matchedIds[0] : undefined,
      visible: Boolean(visible),
      ...restMeta,
    },
    isStat: true,
  };
}

function toStatComment({
  id,
  feed,
  date,
  text,
  meta: { color, graphId, visible, ...restMeta },
}) {
  const dateMs = moment(date).valueOf();
  const metaData = {
    position: '1',
    [graphId ? 'point_color' : 'color']: color,
    visible: Number(visible),
    ...restMeta,
  };
  return {
    id,
    path: feed,
    field_name: graphId ? [graphId] : [], // [] -> [date_fname]
    meta_data: JSON.stringify(metaData),
    subject: text,
    date: moment.utc(date).format('YYYY-MM-DDTHH:mm:ss'),
    timestamp_ms: dateMs,
  };
}

function prepareComments(comments, seriesIds) {
  return comments.map(comment => {
    return comment.path ? fromStatComment(comment, seriesIds) : comment;
  });
}

// TODO: выводить логи
async function readComments(data, seriesIds) {
  try {
    const {
      data: { comments, logs },
    } = await axiosInstance({
      method: 'post',
      url: `${settings.chartsEndpoint}/api/private/comments/read`,
      data,
    });
    return prepareComments(comments, seriesIds);
  } catch (error) {
    console.error(error);
  }
}

function createComment({ isStat, id, ...comment }) {
  return Api.create(comment);
}

// TODO: не передавать seriesIds параметром
async function updateComment({ isStat, ...comment }, seriesIds) {
  if (isStat) {
    const [updated] = await ApiStat.updateById(toStatComment(comment));
    return fromStatComment(updated, seriesIds);
  }
  return Api.updateById(comment);
}

function removeComment(commentid, path, isStat) {
  return isStat
    ? ApiStat.removeById({ path, commentid, _method: 'DELETE' })
    : Api.removeById(commentid);
}

export {
  DEFAULT_COLOR,
  prepareComments,
  createComment,
  readComments,
  updateComment,
  removeComment,
};
