import JSONfn from 'json-fn';
import omit from 'lodash/omit';

import ErrorDispatcher, {ERROR_TYPE} from '../../error-dispatcher/error-dispatcher';
import {prepareComments} from '../../comments/comments';
import {WIZARD_NODE_TYPE} from "../../../../../../../src/constants/constants";

function run({
    comments: {comments, logs} = {},
    config = '',
    data,
    extra: {
        sideHtml, // блок с html слева
        datasetId,
        datasetFields // матчинг id полей датасетов на их title
    } = {},
    highchartsConfig,
    log,
    logs_v2: logsV2,
    usedParams,
    params,
    sources,
    uiScheme,
    _confStorageConfig: {type, key, entryId}
}) {
    try {
        return {
            config: JSONfn.parse(config),
            libraryConfig: JSONfn.parse(highchartsConfig),
            widgetType: type ? type.match(/^[^_]*/)[0] : null,
            // чтобы не отображать комментарии
            isNewWizard: type && type === WIZARD_NODE_TYPE.GRAPH,
            key,
            entryId,
            uiScheme,
            data,
            sideHtml,
            datasetId,
            datasetFields,
            params: omit(params, 'name'),
            usedParams,
            sources,
            logsV2,
            comments: Array.isArray(comments) && comments.length ?
                prepareComments(comments, data.graphs.map(({id}) => id)) :
                null
        };
    } catch (error) {
        throw ErrorDispatcher.wrap({type: ERROR_TYPE.EXECUTION_ERROR, extra: {tabName: 'node', executionError: error}});
    }
}

export default run;
