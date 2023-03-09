'use strict';

const axios = require('axios');
const {
    TIMEOUT_60_SEC,
    TIMEOUT_300_SEC
} = require('../../constants');

const defaultTransformResponse = axios.defaults.transformResponse[0];

const BI_API_SCHEMA = {
    getOptions: (headers, utils) => ({
        method: 'get',
        url: `${utils.config.endpoints.biConverter}/api/v1/parsing_options/`,
        headers
    }),
    getPreview: (headers, utils, {connectionId, previewLines, delimiter, encoding, hasHeader}) => ({
        method: 'get',
        url: `${utils.config.endpoints.biConverter}/api/v1/preview/${connectionId}`,
        headers,
        query: {
            preview_lines: previewLines,
            delimiter,
            encoding,
            has_header: hasHeader
        }
    }),
    saveConnection: (headers, utils, {connectionId, name, dirPath, delimiter, encoding, hasHeader}) => ({
        method: 'post',
        url: `${utils.config.endpoints.biConverter}/api/v1/save_connection/${connectionId}`,
        headers,
        query: {
            name,
            delimiter,
            encoding,
            dir_path: dirPath,
            has_header: hasHeader
        },
        timeout: TIMEOUT_300_SEC
    }),

    getFieldTypes: (headers, utils) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/info/field_types`,
        headers
    }),
    getInfoStore: (headers, utils) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/info/store`,
        headers
    }),

    getDataSets: (headers, utils) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/datasets`,
        headers
    }),
    getDataSetById: (headers, utils, {dataSetId}) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}`,
        headers
    }),
    getDataSetFieldsById: (headers, utils, {dataSetId}) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/fields`,
        headers
    }),
    getDataSetByVersion: (headers, utils, {dataSetId, version}) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/versions/${version}`,
        headers
    }),
    getDataSetStatus: (headers, utils, {dataSetId}) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/status`,
        headers
    }),
    getMaterializationStatus: (headers, utils, {datasetId}) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${datasetId}/materialization/status`,
        headers
    }),
    getVerificationStatus: 'getVerificationStatus',
    deleteVerification: 'deleteVerification',
    createDataSet: (headers, utils, {
        connectionId,
        counterSource,
        metricaNamespace,
        name,
        dirPath,
        ytUrl,
        pubOperationId,
        createFrom,
        dbName,
        tableName
    }) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets`,
        headers,
        body: {
            connection_id: connectionId,
            counter_source: counterSource,
            metrica_namespace: metricaNamespace,
            name,
            yt_url: ytUrl,
            pub_operation_id: pubOperationId,
            create_from: createFrom,
            db_name: dbName,
            dir_path: dirPath,
            table_name: tableName
        }
    }),
    syncDataSet: (headers, utils, {dataSetId}) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}`,
        headers,
        body: {
            dataSetId: dataSetId,
            rls
        }
    }),
    updateDataSet: (headers, utils, {dataSetId, version, resultSchema, rls}) => ({
        method: 'put',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/versions/${version}`,
        headers,
        body: {
            result_schema: resultSchema,
            rls
        }
    }),
    validateDataSet: (headers, utils, {dataSetId, version, resultSchema, updates}) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/versions/${version}/validators/schema`,
        headers,
        body: {
            result_schema: resultSchema,
            updates
        }
    }),
    validateDataSetField: (headers, utils, {dataSetId, version, field}) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/versions/${version}/field_validator`,
        headers,
        body: {
            field
        }
    }),
    previewDataSet: (headers, utils, {dataSetId, version, resultSchema, limit}) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/versions/${version}/preview`,
        headers,
        body: {
            limit,
            result_schema: resultSchema
        }
    }),
    history: (headers, utils, {datasetId, version, limit}) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${datasetId}/versions/${version}/history`,
        headers,
        body: {
            limit,
        }
    }),
    generatePreview: (headers, utils, {dataSetId}) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/materializer/datasets/${dataSetId}/preview`,
        headers
    }),
    materializeDataSet: (headers, utils, {dataSetId}) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/materializer`,
        headers,
        timeout: TIMEOUT_60_SEC
    }),
    verifyDataset: 'verify',
    setDirectMaterialization: (headers, utils, {dataSetId}) => ({
        method: 'delete',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/materializer`,
        headers
    }),
    deleteMaterialization: async (headers, utils, {datasetId}) => ({
        method: 'delete',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${datasetId}/materializer`,
        headers,
        timeout: TIMEOUT_60_SEC
    }),
    deleteDataSet: (headers, utils, {dataSetId}) => ({
        method: 'delete',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}`,
        headers
    }),
    modifyDatasetSource: (headers, utils, {datasetId, tableName, dbName, connectionId}) => ({
        method: 'put',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${datasetId}/source`,
        headers,
        body: {
            table_name: tableName,
            db_name: dbName,
            connection_id: connectionId
        }
    }),
    getResultBySQL: (headers, utils, {
        dataSetId,
        version,
        where,
        limit,
        groupBy,
        orderBy,
        offset,
        columns,
        customWhere,
        resultSchema,
        updates
    }) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/versions/${version}/result`,
        headers,
        body: {
            where,
            limit,
            group_by: groupBy,
            order_by: orderBy,
            offset,
            columns,
            customWhere,
            result_schema: resultSchema,
            updates
        }
    }),
    getDistincts: (headers, utils, {
        dataSetId,
        version,
        fieldGuid,
        where,
        updates
    }) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/widgets/${entryId}`,
        headers,
        body: {
            field_guid: fieldGuid,
            where,
            updates
        }
    }),
    getTemplateFormatActionType: (headers) => ({
        method: 'post',
        url: `${utils.config.endpoints.charts}/api/getTemplateFormatActionType`,
        headers,
        body: {}
    }),
    getSchedulerSettings: (headers, utils, {entryId}) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/schedulers/${entryId}/settings`,
        headers
    }),
    modifySchedulerSettings: (headers, utils, materializationCron) => ({
        method: 'put',
        url: `${utils.config.endpoints.bi}/api/v1/schedulers/${entryId}/settings`,
        headers,
        body: {
            materializationCron: materializationCron
        }
    }),

    getFormulaSuggest: (headers, utils, {dataSetId, version, fieldNames, formula, posRow, posColumn}) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/versions/${version}/suggest/formula`,
        headers,
        body: {
            field_names: fieldNames,
            formula,
            pos_row: posRow,
            pos_column: posColumn
        }
    }),
    validateFormula: (headers, utils, {dataSetId, version, resultSchema, field}) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/datasets/${dataSetId}/versions/${version}/validators/field`,
        headers,
        body: {
            result_schema: resultSchema,
            field
        }
    }),

    getConnections: (headers, utils) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/connections`,
        headers,
        transformResponse: [
            defaultTransformResponse,
            (data) => {
                const {connections = []} = data;

                return {
                    connections: connections.filter(({type}) => type !== 'yt')
                };
            }
        ]
    }),
    getConnection: (headers, utils, {connectionId}) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/connections/${connectionId}`,
        headers
    }),
    getConnectionStructure: (headers, utils, {connectionId, infoType, dbName}) => ({
        method: 'get',
        url: `${utils.config.endpoints.bi}/api/v1/connections/${connectionId}/info/${infoType}`,
        headers,
        query: {
            db_name: dbName
        }
    }),
    createConnection: (headers, utils, {
        type,
        name,
        dirPath,
        dbName,
        dbConnectMethod,
        password,
        host,
        port,
        token,
        cluster,
        counter,
        counterSource,
        alias,
        username,
        permissionsMode,
        initialPermissions,
        materializationStartDate,
        matSchedConfig
    }) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/connections`,
        headers,
        body: {
            type,
            name,
            dir_path: dirPath,
            db_name: dbName,
            db_connect_method: dbConnectMethod,
            password,
            host,
            port,
            token,
            cluster,
            alias,
            username,
            permissions_mode: permissionsMode,
            initial_permissions: initialPermissions,
            counter_id: counter,
            counter_source: counterSource,
            mat_start_date: materializationStartDate,
            mat_sched_config: matSchedConfig
        }
    }),
    verifyConnectionParams: (headers, utils, {
        type,
        name,
        dbName,
        password,
        host,
        port,
        token,
        cluster,
        alias,
        username,
        permissionsMode,
        initialPermissions,
        counter,
        counterSource
    }) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/connections/test_connection_params`,
        headers,
        body: {
            type,
            name,
            db_name: dbName,
            password,
            host,
            port,
            token,
            cluster,
            alias,
            username,
            permissions_mode: permissionsMode,
            initial_permissions: initialPermissions,
            counter_id: counter,
            cluster_name: cluster,
            counter_source: counterSource
        }
    }),
    verifyConnection: (headers, utils, {
        connectionId,
        type,
        name,
        dbName,
        password,
        host,
        port,
        token,
        username,
        alias,
        cluster,
        counter,
        counterSource
    }) => ({
        method: 'post',
        url: `${utils.config.endpoints.bi}/api/v1/connections/test_connection/${connectionId}`,
        headers,
        body: {
            type,
            name,
            dbName,
            password,
            host,
            port,
            token,
            username,
            alias,
            cluster,
            counter_id: counter,
            cluster_name: cluster,
            counter_source: counterSource
        }
    }),
    updateConnection: (headers, utils, {
        connectionId,
        name,
        dbName,
        dbConnectMethod,
        password,
        host,
        port,
        token,
        username,
        alias,
        cluster,
        counter,
        counterSource,
        materializationStartDate,
        matSchedConfig,
        modifyFlag,
        maxPoolSize
    }) => ({
        method: 'put',
        url: `${utils.config.endpoints.bi}/api/v1/connections/${connectionId}`,
        headers,
        body: {
            name,
            db_name: dbName,
            db_connect_method: dbConnectMethod,
            host,
            port,
            cluster_name: cluster,
            counter_id: counter,
            counter_source: counterSource,
            mat_start_date: materializationStartDate,
            mat_sched_config: matSchedConfig,
            token,
            username,
            alias,
            cluster,
            password,
            modifyFlag,
            maxPoolSize
        }
    }),
    deleteConnection: (headers, utils, {connectionId}) => ({
        method: 'delete',
        url: `${utils.config.endpoints.bi}/api/v1/connections/${connectionId}`,
        headers
    })
};


module.exports = BI_API_SCHEMA;
