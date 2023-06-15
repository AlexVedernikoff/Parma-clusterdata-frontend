export class RegisterManager {
  constructor() {
    this._items = {};
    this._defaultLayout = { x: 0, y: Infinity, w: Infinity, h: 4, minW: 4, minH: 2 };
    this._gridLayout = {
      rowHeight: 18,
      cols: 36,
      margin: [2, 2],
      containerPadding: [0, 0],
    };
    this._settings = {
      theme: 'default',
    };
  }

  addItem(plugin) {
    const { type, defaultLayout = {}, ...item } = plugin;
    if (type in this._items) {
      throw new Error(`DashKit.registerPlugins: type ${type} уже был зарегистрирован`);
    }
    if (typeof plugin.renderer !== 'function') {
      throw new Error('DashKit.registerPlugins: renderer должна быть функцией');
    }
    this._items[type] = {
      ...item,
      defaultLayout: { ...this._defaultLayout, ...defaultLayout },
    };
  }

  setSettings(settings = {}) {
    Object.assign(this._settings, settings);
    if (settings.gridLayout) {
      this._gridLayout = { ...this._gridLayout, ...settings.gridLayout };
    }
  }

  get settings() {
    return this._settings;
  }

  get gridLayout() {
    return this._gridLayout;
  }

  getItem(type) {
    return this._items[type];
  }

  check(type) {
    return type in this._items;
  }
}
