import Highcharts from 'highcharts';

import boost from 'highcharts/modules/boost';

function boostHighcharts() {
    // "Boost should be the last module included"
    boost(Highcharts);
}

export default boostHighcharts;
