const LOCAL_STORAGE_KEY = 'charts-screenshot-state';

const SIZES = [
    {
        key: 'size-standard',
        width: 800,
        height: 600
    },
    {
        key: 'size-widescreen',
        width: 1600,
        height: 720
    }
];

const PARAMETERS = [
    {
        key: 'parameter-no-controls',
        name: '_no_controls',
        val: true
    }
];

export {SIZES, PARAMETERS, LOCAL_STORAGE_KEY};
