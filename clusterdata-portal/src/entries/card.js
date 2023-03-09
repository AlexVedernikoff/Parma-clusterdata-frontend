import React from 'react';
import ReactDOM from 'react-dom';

import Widget from "@parma-data-ui/chartkit/lib/components/Widget/Widget";
import ChartsModule from "@parma-data-ui/chartkit/lib/modules/charts/charts";

(async function () {
    async function render() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const entries = urlParams.entries();

        let id='';
        let params={};

        for(const entry of entries) {
            if (entry[0]==='id'){
                id=entry[0]
            }
            else {
                params[entry[0]]=entry[1];
            }
        }

        const loadedData = await ChartsModule.getData({
            id: urlParams.get('id'),
            source: "/",
            params,
        });

        ReactDOM.render((
            <Widget data={loadedData} onLoad={() => {}} onChange={() => {}} onError={() => {}} />
        ), document.getElementsByClassName('app__main')[0]);
    }

    await render();
})();
