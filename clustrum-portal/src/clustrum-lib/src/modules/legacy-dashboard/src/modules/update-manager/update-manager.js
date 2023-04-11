import update, { extend } from 'immutability-helper';
import Hashids from 'hashids';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { matchParamsWithAliases } from '../utils';
import { getLayoutId } from 'clustrum-lib/utils/helpers';

extend('$auto', (value, object) => {
  return object ? update(object, value) : update({}, value);
});

const defaultNamespace = 'default';

/**
 * todo этот хелпер появился из-за того что плохо организовали редакс (из-за этого также появляется дополнительный стейт в withContext)
 * было бы лучше если были бы отдельные акшны и селекторы которые отвечают за что-то одно (не пытаться складировать всю логику в одно место)
 */
export class UpdateManager {
  static addItem = ({ item, namespace = defaultNamespace, defaultLayout, config, layoutId }) => {
    const layoutY = Math.max(0, ...config[layoutId].map(({ h, y }) => h + y));
    const saveDefaultLayout = pick(defaultLayout, ['h', 'w', 'x', 'y']);

    const hashids = new Hashids(config.salt);
    let counter = config.counter;

    const resultData = Array.isArray(item.data)
      ? item.data.map(tab => (tab.id ? tab : { ...tab, id: hashids.encode(++counter) }))
      : item.data;

    const newItem = { ...item, id: hashids.encode(++counter), data: resultData, namespace };

    return update(config, {
      items: { $push: [newItem] },
      [layoutId]: { $push: [{ ...saveDefaultLayout, y: layoutY, i: newItem.id }] },
      counter: { $set: counter },
    });
  };

  static editItem = ({ item, namespace = defaultNamespace, config, defaultLayout, layoutId }) => {
    const hashids = new Hashids(config.salt);
    let counter = config.counter;
    const targetLayoutId = layoutId;

    const itemIndex = config.items.findIndex(({ id }) => item.id === id);

    const resultData = Array.isArray(item.data)
      ? item.data.map(tab => (tab.id ? tab : { ...tab, id: hashids.encode(++counter) }))
      : item.data;

    // если targetLayoutId не содержит layout, относящийся к текущему item,
    // значит необходимо перенести layout этого item в targetLayoutId
    const needToMoveItem = config[targetLayoutId].find(layout => layout.i === item.id) === undefined;

    if (needToMoveItem) {
      // получаем layoutId, из которого нужно удалить layout,
      // и индекс layout для удаления
      const sourceLayoutId = getLayoutId(item.id, config);
      const layoutPositionIndex = config[sourceLayoutId].findIndex(layout => layout.i === item.id);

      const layoutToMove = config[sourceLayoutId][layoutPositionIndex];
      const layoutY = Math.max(0, ...config[targetLayoutId].map(({ h, y }) => h + y));

      return update(config, {
        items: { [itemIndex]: { $set: { ...item, data: resultData, namespace } } },
        counter: { $set: counter },
        [targetLayoutId]: { $push: [{ ...layoutToMove, ...defaultLayout, x: 0, y: layoutY }] },
        [sourceLayoutId]: { $splice: [[layoutPositionIndex, 1]] },
      });
    }

    return update(config, {
      items: { [itemIndex]: { $set: { ...item, data: resultData, namespace } } },
      counter: { $set: counter },
    });
  };

  static removeItem = ({ id, config, itemsStateAndParams = {}, layoutId }) => {
    const itemIndex = config.items.findIndex(item => item.id === id);
    const removeItem = config.items[itemIndex];
    const itemLayoutIndex = config[layoutId].findIndex(layout => layout.i === removeItem.id);
    const { defaults = {} } = removeItem;
    const itemParamsKeys = Object.keys(defaults);
    const getParams = (excludeId, items) => {
      return Object.keys(
        items.reduce((acc, item) => {
          if (item.id !== excludeId) {
            Object.assign(acc, item.defaults);
          }
          return acc;
        }, {}),
      );
    };
    const allParamsKeys = getParams(id, config.items);
    const allNamespaceParamsKeys = getParams(
      id,
      config.items.filter(item => item.namespace === removeItem.namespace),
    );
    const uniqParamsKeys = itemParamsKeys.filter(key => !allParamsKeys.includes(key));
    const uniqNamespaceParamsKeys = itemParamsKeys.filter(key => !allNamespaceParamsKeys.includes(key));
    const withoutUniqItemsParams = Object.keys(itemsStateAndParams)
      .filter(key => key !== id)
      .reduce((acc, key) => {
        const { params } = itemsStateAndParams[key];
        // в state из урла могут быть элементы, которых нет в config.items
        const item = config.items.find(item => item.id === key);
        if (params && item) {
          const { namespace } = item;
          const currentUniqParamsKeys = namespace === removeItem.namespace ? uniqNamespaceParamsKeys : uniqParamsKeys;
          const resultParams = omit(params, currentUniqParamsKeys);
          if (Object.keys(params).length !== Object.keys(resultParams).length) {
            acc[key] = {
              params: {
                $set: resultParams,
              },
            };
          }
        }
        return acc;
      }, {});
    const newItemsStateAndParams = update(itemsStateAndParams, {
      $unset: [id],
      ...withoutUniqItemsParams,
    });
    const ignores = config.ignores.filter(({ who, whom }) => id !== who && id !== whom);
    const newConfig = update(config, {
      items: {
        $splice: [[itemIndex, 1]],
      },
      [layoutId]: {
        $splice: [[itemLayoutIndex, 1]],
      },
      ignores: {
        $set: ignores,
      },
    });
    return {
      config: newConfig,
      itemsStateAndParams: newItemsStateAndParams,
    };
  };

  static updateLayout = ({ layout, config, layoutId }) => {
    return update(config, {
      [layoutId]: {
        $set: layout.map(({ x, y, w, h, i, isHidden }) => ({ x, y, w, h, i, isHidden })),
      },
    });
  };

  static changeStateAndParams = ({ id: initiatorId, config, stateAndParams, itemsStateAndParams }) => {
    const updatedIds = UpdateManager.#getUpdatedIds(initiatorId, config);

    return UpdateManager.#filterUpdatedItemParams(
      UpdateManager.#updateItems(stateAndParams, config, initiatorId, itemsStateAndParams, updatedIds),
      stateAndParams.paramsForRemoving,
      updatedIds,
    );
  };

  static #filterUpdatedItemParams = (updatedItems, paramsForRemoving, updatedIds) => {
    if (updatedItems && paramsForRemoving && Array.isArray(paramsForRemoving) && paramsForRemoving.length > 0) {
      return UpdateManager.#removeUpdatedItemParams(updatedItems, paramsForRemoving, updatedIds);
    }

    return updatedItems;
  };

  static #removeUpdatedItemParams = (updatedItems, paramsForRemoving, updatedIds) => {
    const updatedItemsAfterRemoving = {};
    const updatedIdsSet = new Set(updatedIds);

    for (const itemId in updatedItems) {
      const item = updatedItems[itemId];

      if (!item.params) {
        updatedItemsAfterRemoving[itemId] = { ...item };

        continue;
      }

      updatedItemsAfterRemoving[itemId] = update(item, { $merge: { params: { ...item.params } } });

      if (!updatedIdsSet.has(itemId)) {
        continue;
      }

      paramsForRemoving.forEach(paramId => delete updatedItemsAfterRemoving[itemId].params[paramId]);
    }

    return updatedItemsAfterRemoving;
  };

  static #getUpdatedIds = (initiatorId, config) => {
    const { items } = config;
    const initiatorItem = items.find(({ id }) => id === initiatorId);

    let ignoresInitiatorIds = config.ignores.filter(({ whom }) => whom === initiatorId).map(({ who }) => who);

    if (initiatorItem.type === 'widget') {
      ignoresInitiatorIds = [initiatorId];
    }

    return items
      .filter(
        item =>
          item.namespace === initiatorItem.namespace &&
          !ignoresInitiatorIds.includes(item.id) &&
          (!Array.isArray(item.data) || item.data.every(({ id }) => !ignoresInitiatorIds.includes(id))),
      )
      .map(({ id }) => id);
  };

  static #updateItems = (stateAndParams, config, initiatorId, itemsStateAndParams, updatedIds) => {
    const hasState = 'state' in stateAndParams;
    const { aliases, items } = config;
    const initiatorItem = items.find(({ id }) => id === initiatorId);

    if ('params' in stateAndParams) {
      const updatedParams =
        initiatorItem.type === 'widget'
          ? stateAndParams.params
          : pick(stateAndParams.params, Object.keys(initiatorItem.defaults));

      if (Object.keys(updatedParams).length !== Object.keys(stateAndParams.params).length) {
        console.warn('Параметры, которых нет в defaults, будут проигнорированы!');
      }

      const updatedParamsWithAliases = matchParamsWithAliases({
        aliases,
        namespace: initiatorItem.namespace,
        params: updatedParams,
        initiatorItem,
      });

      return update(
        itemsStateAndParams,
        updatedIds.reduce((acc, currentId) => {
          acc[currentId] = {
            $auto: {
              params: {
                [itemsStateAndParams[currentId] && itemsStateAndParams[currentId].params
                  ? '$merge'
                  : '$set']: updatedParamsWithAliases,
              },
              ...(hasState && currentId === initiatorId ? { state: { $set: stateAndParams.state } } : {}),
              paginateInfo: { $set: { page: 0, pageSize: 150 } },
            },
          };
          return acc;
        }, {}),
      );
    }

    if (hasState) {
      return update(itemsStateAndParams, {
        [initiatorId]: {
          $auto: {
            state: { $set: stateAndParams.state },
          },
        },
      });
    }

    if ('page' in stateAndParams) {
      return update(itemsStateAndParams, {
        [initiatorId]: {
          $auto: {
            paginateInfo: {
              $set: {
                page: stateAndParams.page,
                pageSize: stateAndParams.pageSize,
              },
            },
          },
        },
      });
    }

    if ('direction' in stateAndParams) {
      return update(itemsStateAndParams, {
        [initiatorId]: {
          $auto: {
            orderBy: {
              $set: {
                direction: stateAndParams.direction,
                field: stateAndParams.field,
              },
            },
          },
        },
      });
    }

    return { ...itemsStateAndParams };
  };
}
