import React from 'react';
import ReactDOM from 'react-dom';

import Widget from '@parma-data-ui/chartkit/lib/components/Widget/Widget';
import ChartsModule from '@parma-data-ui/chartkit/lib/modules/charts/charts';

(async function() {
  async function render() {
    const loadedData = await ChartsModule.getData({
      id: 'b45b6b31-519e-4886-a373-2868b34c6105',
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
