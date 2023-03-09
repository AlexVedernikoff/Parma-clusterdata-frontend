const express = require('express');
const url = require('url');
const ejs = require('ejs');
const { PORTAL_PATH, PORTAL_ASSETS_PATH } = require('./context-path');
const dotenv = require('dotenv').config();

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 8090;

const DIST_DIR = './';
const ROOT_OPTIONS = { root: DIST_DIR };
const RENDER_OPTIONS = {
  dotenv: JSON.stringify(dotenv.parsed),
};

const compressedAssetsExtensions = ['js', 'tsx', 'css', 'html'];

app.use('/', router);
app.set('view engine', 'ejs');

const navigationRouteHandler = (req, res) => {
  res.render('navigation.ejs', RENDER_OPTIONS);
};
router.get('/navigation/', navigationRouteHandler);
router.get('/navigation/:id', navigationRouteHandler);
router.get('/favorites/', navigationRouteHandler);
router.get('/favorites/:id', navigationRouteHandler);
router.get('/connections/', navigationRouteHandler);
router.get('/datasets/', navigationRouteHandler);
router.get('/widgets/', navigationRouteHandler);
router.get('/dashboards/', navigationRouteHandler);
router.get('/*_in_folder/*', navigationRouteHandler);

router.get('/datasets/:id', (req, res) => {
  res.render('datasets.ejs', RENDER_OPTIONS);
});

router.get('/connections/new', (req, res) => {
  res.render('connections/new.ejs', RENDER_OPTIONS);
});

router.get('/connections/:id', (req, res) => {
  res.render('connections/new.ejs', RENDER_OPTIONS);
});

router.get('/wizard/', (req, res) => {
  res.render('wizard.ejs', RENDER_OPTIONS);
});

router.get('/wizard/:id', (req, res) => {
  res.render('wizard.ejs', RENDER_OPTIONS);
});

router.get('/dashboards/:id', (req, res) => {
  res.render('dashboards.ejs', RENDER_OPTIONS);
});

const dashboardSimpleHandler = (req, res) => {
  res.render('dashboards_simple.ejs', {
    dotenv: JSON.stringify(dotenv.parsed),
    hideEdit: req.query['hide-edit'],
    hideSubHeader: req.query['hide-header-btns'],
    hideTabs: req.query['hide-tabs'],
    enableCaching: req.query['enable-caching'],
    cacheMode: req.query['cache-mode'],
    exportMode: req.query['export-mode'],
  });
};
router.get(`/dashboards_simple/:id`, dashboardSimpleHandler);
/* Router for iframe usage */
router.get(`${PORTAL_PATH}/dashboards_simple/:id`, dashboardSimpleHandler);

router.get('/', (req, res) => {
  res.render('navigation.ejs', RENDER_OPTIONS);
});
router.get('/*', (req, res) => {
  const path = req.path.replace(PORTAL_ASSETS_PATH, '');

  if (compressedAssetsExtensions.includes(path.split('.').pop())) {
    res.set('Content-Encoding', 'gzip');
    res.sendFile(`${path}.gz`, ROOT_OPTIONS);
    return;
  }

  res.sendFile(path, ROOT_OPTIONS);
});

app.listen(PORT, () => {
  console.info(`App listening to http://127.0.0.1:${PORT}`);
  console.info('Press Ctrl+C to quit');
});
