import Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';

exporting(Highcharts);
exportData(Highcharts);

const LOCAL_STORAGE_KEY = 'charts-export-state';

function getStorageState() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
}

function setStorageState(state) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export { getStorageState, setStorageState };
