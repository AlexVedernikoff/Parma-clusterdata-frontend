#! /bin/sh -eu

 

APP_JS="index.js"
APP_CONFIG="/opt/clustrum-portal/.env"
APP_CONFIG_TEMPLATE="/opt/clustrum-portal/.env.tpl"

 

configure_app() {
    if [ ! -f ${APP_CONFIG_TEMPLATE} ]; then
        echo "Application config template ${APP_CONFIG_TEMPLATE} not found, exiting."
        exit 1
    else
        envsubst < ${APP_CONFIG_TEMPLATE} > ${APP_CONFIG}
        if [ ${DEBUG} -eq 1 ]; then
            echo "=== DEBUG: ${APP_CONFIG} ======================="
            cat ${APP_CONFIG}
            echo "================================================"
        fi
    fi
}

configure_app

node ${APP_JS}
