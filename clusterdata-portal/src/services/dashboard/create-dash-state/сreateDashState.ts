import {SDK} from '../../../modules/sdk';
import {getHashState} from "../../../store/selectors/dash";
import {store} from "../../../store";
import {isEmpty} from "lodash";
import {HashState} from "./types/HashState";

export const createDashState = async (entryId: string, tabItemIds: string[]): Promise<{ uuid: string }> => {
    const emptyResponse = Promise.resolve({ uuid: '' });

    const hashState = hashStateByTab(tabItemIds, getHashState(store.getState()));
    const isHashStateEmpty = isEmpty(hashState);

    if (isHashStateEmpty) {
        return emptyResponse;
    }

    try {
        const response = await SDK.createDashState({
            entryId: entryId,
            data: {
                params: hashState,
            }
        });

        if (response?.uuid) {
            return response;
        } else {
            console.error('/createDashState не вернул state uuid!');
        }
    } catch (error) {
        console.error(error);
    }

    return emptyResponse;
};

const hashStateByTab = (tabItemIds: string[], hashState: HashState): HashState => {
    const filteredHashState: HashState = {};

    for (const widgetId in hashState) {
        if (tabItemIds.includes(widgetId)) {
            filteredHashState[widgetId] = hashState[widgetId];
        }
    }

    return filteredHashState;
};


