import ChartsModule from "@parma-data-ui/chartkit/lib/modules/charts/charts";
import * as Highcharts from 'highcharts';

(async function () {
    async function render() {
        const loadedData = await ChartsModule.getData({
            id: "a41e5303-a4d2-42e8-a719-4652f80c1131",
            source: "/",
            params: {},
        });

        let hcConfig = loadedData.libraryConfig;

        hcConfig.xAxis.categories = loadedData.data.categories;
        hcConfig.series = loadedData.data.graphs;

        Highcharts.chart('container', hcConfig)
    }

    await render();
})();