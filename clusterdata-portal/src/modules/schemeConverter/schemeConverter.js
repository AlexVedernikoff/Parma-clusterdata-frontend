import {ITEM_TYPE} from '../constants/constants';
import sdk from '../sdk/sdk';

const CURRENT_SCHEME_VERSION = 6;

class SchemeConverter {
    static isUpdateNeeded(data) {
        return data.schemeVersion < CURRENT_SCHEME_VERSION;
    }

    static update(data) {
        if (data.schemeVersion < CURRENT_SCHEME_VERSION) {
            return SchemeConverter.upTo6(data);
        }
        return data;
    }

    static async upTo3(data) {
        const {salt, pages, counter, schemeVersion, settings} = data;

        if (schemeVersion >= 3) {
            return data;
        }

        const savedResponses = {};
        const [page] = pages;
        const {id: pageId, tabs} = page;

        const convertedTabs = await Promise.all(
            tabs.map(async tab => {
                const {id: tabId, items, title, layout, ignores = []} = tab;
                return {
                    id: tabId,
                    items: await Promise.all(
                        items.map(async ({id, data: itemData, tabs, type, defaults, namespace = 'default'}) => {
                            const data = itemData || tabs;
                            if (type === ITEM_TYPE.CONTROL && !defaults) {
                                const defaultValue = data.control.defaultValue || '';

                                if (data.dataset) {
                                    const {id: datasetId, fieldName} = data.dataset;

                                    try {
                                        const {fields} = savedResponses[datasetId]
                                            || await sdk.bi.getDataSetFieldsById({dataSetId: datasetId});
                                        savedResponses[datasetId] = {fields};

                                        const field = fields.find(({title}) => title === fieldName);

                                        if (field) {
                                            data.dataset.fieldId = field.guid;
                                            delete data.dataset.fieldName;
                                            delete data.dataset.name;
                                            defaults = {[field.guid]: defaultValue};
                                        } else {
                                            defaults = {[fieldName]: defaultValue};
                                        }
                                    } catch (error) {
                                        console.error('DATASET_FIELDS', id, error);
                                        defaults = {[fieldName]: defaultValue};
                                    }
                                } else {
                                    const connection = tab.connections.find(({fromId}) => fromId === id);

                                    if (connection) {
                                        data.control.fieldName = connection.param;
                                        defaults = {[connection.param]: defaultValue};
                                    } else {
                                        defaults = {};
                                    }
                                }
                            } else if (!defaults) {
                                defaults = {};
                            }
                            return {id, data, type, defaults, namespace};
                        })
                    ),
                    title,
                    layout,
                    ignores
                };
            })
        );

        return {
            salt,
            counter,
            schemeVersion: 3,
            pages: [{id: pageId, tabs: convertedTabs}],
            settings
        };
    }

    // добавляем поле aliases для каждого таба
    static async upTo4(originalData) {
        const data = await SchemeConverter.upTo3(originalData);

        const {salt, pages, counter, settings} = data;
        const [page] = pages;
        const {id: pageId, tabs} = page;

        const convertedTabs = tabs.map(tab => ({...tab, aliases: {}}));

        return {
            salt,
            counter,
            schemeVersion: 4,
            pages: [{id: pageId, tabs: convertedTabs}],
            settings
        };
    }

    // игноры WIDGET-элементов переводим в игноры для табов WIDGET-элеметов
    static async upTo6(originalData) {
        const data = await SchemeConverter.upTo4(originalData);

        const {salt, pages, counter, schemeVersion, settings} = data;

        if (schemeVersion >= 6) {
            return data;
        }

        const [page] = pages;
        const {id: pageId, tabs} = page;

        const convertedTabs = tabs.map(({ignores, ...tab}) => ({
            ...tab,
            ignores: ignores.reduce((result, {who, whom}) => {
                tab.items
                    .filter(({id, type}) => id === who && type === ITEM_TYPE.WIDGET)
                    .forEach(({data}) => data.forEach(({id}) => { result.push({who: id, whom}); }));
                return result;
            }, [])
        }));

        return {
            salt,
            counter,
            schemeVersion: 6,
            pages: [{id: pageId, tabs: convertedTabs}],
            settings
        };
    }
}

export default SchemeConverter;
