import React from 'react';
import ReactDOM from 'react-dom';

import Widget from '@kamatech-data-ui/chartkit/lib/components/Widget/Widget';
import ChartsModule from '@kamatech-data-ui/chartkit/lib/modules/charts/charts';

(async function() {
  async function render() {
    const loadedData = await ChartsModule.getData({
      id: 'd9145853-9e90-4a94-8f75-9bca7c3439d3',
      source: '/',
      params: {},
    });

    ReactDOM.render(
      <Widget data={loadedData} onLoad={() => {}} onChange={() => {}} onError={() => {}} />,
      document.getElementById('root'),
    );
  }

  await render();
})();
