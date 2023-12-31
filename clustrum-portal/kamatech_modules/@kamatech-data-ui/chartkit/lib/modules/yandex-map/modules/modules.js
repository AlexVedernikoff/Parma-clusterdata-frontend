// *********************************************************************************************************************
// https://github.com/yandex-shri-fx-team/ymaps-gridmap/blob/7868d61b038242019e6c0afeff3e59ce9d0595af/umd/gridmap.min.js
// *********************************************************************************************************************
// при обновлении Polygonmap отдельно проверить, что работает values вместо points, т.к. используем приватные методы
// 249:33 pointsWeightMaximum = pointsWeight / pointsCount; -> pointsWeightMaximum = pointsWeight;

function defineGridmapAndPolygonmap(ymaps) {
  /* eslint-disable */
  !(function(t) {
    var e = {};
    function n(r) {
      if (e[r]) return e[r].exports;
      var i = (e[r] = { i: r, l: !1, exports: {} });
      return t[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
    }
    (n.m = t),
      (n.c = e),
      (n.d = function(t, e, r) {
        n.o(t, e) ||
          Object.defineProperty(t, e, { configurable: !1, enumerable: !0, get: r });
      }),
      (n.r = function(t) {
        Object.defineProperty(t, '__esModule', { value: !0 });
      }),
      (n.n = function(t) {
        var e =
          t && t.__esModule
            ? function() {
                return t.default;
              }
            : function() {
                return t;
              };
        return n.d(e, 'a', e), e;
      }),
      (n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (n.p = ''),
      n((n.s = 71));
  })([
    function(t, e, n) {
      var r = n(21);
      t.exports = function(t, e) {
        var n = t.__data__;
        return r(e) ? n['string' == typeof e ? 'string' : 'hash'] : n.map;
      };
    },
    function(t, e, n) {
      var r = n(27);
      t.exports = function(t, e) {
        for (var n = t.length; n--; ) if (r(t[n][0], e)) return n;
        return -1;
      };
    },
    function(t, e, n) {
      var r = n(9)(Object, 'create');
      t.exports = r;
    },
    function(t, e, n) {
      t.exports = function(t, e) {
        for (
          var n = e[0], i = e[1], o = t.length, s = 1, a = o, d = 0, u = o - 1;
          d < a;
          u = d++
        ) {
          var c = t[d],
            g = t[u],
            l = c[1],
            p = g[1];
          if (p < l) {
            if (p < i && i < l) {
              var f = r(c, g, e);
              if (0 === f) return 0;
              s ^= (0 < f) | 0;
            } else if (i === l) {
              var b = t[(d + 1) % o],
                h = b[1];
              if (l < h) {
                var f = r(c, g, e);
                if (0 === f) return 0;
                s ^= (0 < f) | 0;
              }
            }
          } else if (l < p) {
            if (l < i && i < p) {
              var f = r(c, g, e);
              if (0 === f) return 0;
              s ^= (f < 0) | 0;
            } else if (i === l) {
              var b = t[(d + 1) % o],
                h = b[1];
              if (h < l) {
                var f = r(c, g, e);
                if (0 === f) return 0;
                s ^= (f < 0) | 0;
              }
            }
          } else if (i === l) {
            var x = Math.min(c[0], g[0]),
              v = Math.max(c[0], g[0]);
            if (0 === d) {
              for (; u > 0; ) {
                var y = (u + o - 1) % o,
                  m = t[y];
                if (m[1] !== i) break;
                var _ = m[0];
                (x = Math.min(x, _)), (v = Math.max(v, _)), (u = y);
              }
              if (0 === u) return x <= n && n <= v ? 0 : 1;
              a = u + 1;
            }
            for (var j = t[(u + o - 1) % o][1]; d + 1 < a; ) {
              var m = t[d + 1];
              if (m[1] !== i) break;
              var _ = m[0];
              (x = Math.min(x, _)), (v = Math.max(v, _)), (d += 1);
            }
            if (x <= n && n <= v) return 0;
            var w = t[(d + 1) % o][1];
            n < x && j < i != w < i && (s ^= 1);
          }
        }
        return 2 * s - 1;
      };
      var r = n(70);
    },
    function(t, e, n) {
      var r = n(52),
        i = 'object' == typeof self && self && self.Object === Object && self,
        o = r || i || Function('return this')();
      t.exports = o;
    },
    function(t, e, n) {
      var r = n(4).Symbol;
      t.exports = r;
    },
    function(t, e, n) {
      var r = n(10),
        i = n(48),
        o = '[object Symbol]';
      t.exports = function(t) {
        return 'symbol' == typeof t || (i(t) && r(t) == o);
      };
    },
    function(t, e) {
      var n = Array.isArray;
      t.exports = n;
    },
    function(t, e) {
      t.exports = function(t) {
        var e = typeof t;
        return null != t && ('object' == e || 'function' == e);
      };
    },
    function(t, e, n) {
      var r = n(40),
        i = n(35);
      t.exports = function(t, e) {
        var n = i(t, e);
        return r(n) ? n : void 0;
      };
    },
    function(t, e, n) {
      var r = n(5),
        i = n(50),
        o = n(49),
        s = '[object Null]',
        a = '[object Undefined]',
        d = r ? r.toStringTag : void 0;
      t.exports = function(t) {
        return null == t ? (void 0 === t ? a : s) : d && d in Object(t) ? i(t) : o(t);
      };
    },
    function(t, e, n) {
      'use strict';
      t.exports = function(t, e, n) {
        var i = t * e,
          o = r * t,
          s = o - (o - t),
          a = t - s,
          d = r * e,
          u = d - (d - e),
          c = e - u,
          g = a * c - (i - s * u - a * u - s * c);
        if (n) return (n[0] = g), (n[1] = i), n;
        return [g, i];
      };
      var r = +(Math.pow(2, 27) + 1);
    },
    function(t, e, n) {
      'use strict';
      var r = n(65),
        i = n(64);
      function o(t) {
        return [t[0] / 255, t[1] / 255, t[2] / 255, t[3]];
      }
      function s(t) {
        for (var e, n = '#', r = 0; r < 3; ++r)
          n += ('00' + (e = (e = t[r]).toString(16))).substr(e.length);
        return n;
      }
      function a(t) {
        return 'rgba(' + t.join(',') + ')';
      }
      t.exports = function(t) {
        var e, n, d, u, c, g, l, p, f, b;
        t || (t = {});
        (p = (t.nshades || 72) - 1),
          (l = t.format || 'hex'),
          (g = t.colormap) || (g = 'jet');
        if ('string' == typeof g) {
          if (((g = g.toLowerCase()), !r[g]))
            throw Error(g + ' not a supported colorscale');
          c = r[g];
        } else {
          if (!Array.isArray(g)) throw Error('unsupported colormap option', g);
          c = g.slice();
        }
        if (c.length > p)
          throw new Error(g + ' map requires nshades to be at least size ' + c.length);
        f = Array.isArray(t.alpha)
          ? 2 !== t.alpha.length
            ? [1, 1]
            : t.alpha.slice()
          : 'number' == typeof t.alpha
          ? [t.alpha, t.alpha]
          : [1, 1];
        (e = c.map(function(t) {
          return Math.round(t.index * p);
        })),
          (f[0] = Math.min(Math.max(f[0], 0), 1)),
          (f[1] = Math.min(Math.max(f[1], 0), 1));
        var h = c.map(function(t, e) {
            var n = c[e].index,
              r = c[e].rgb.slice();
            return 4 === r.length && r[3] >= 0 && r[3] <= 1
              ? r
              : ((r[3] = f[0] + (f[1] - f[0]) * n), r);
          }),
          x = [];
        for (b = 0; b < e.length - 1; ++b) {
          (u = e[b + 1] - e[b]), (n = h[b]), (d = h[b + 1]);
          for (var v = 0; v < u; v++) {
            var y = v / u;
            x.push([
              Math.round(i(n[0], d[0], y)),
              Math.round(i(n[1], d[1], y)),
              Math.round(i(n[2], d[2], y)),
              i(n[3], d[3], y),
            ]);
          }
        }
        x.push(c[c.length - 1].rgb.concat(f[1])),
          'hex' === l
            ? (x = x.map(s))
            : 'rgbaString' === l
            ? (x = x.map(a))
            : 'float' === l && (x = x.map(o));
        return x;
      };
    },
    function(t, e, n) {
      'use strict';
      n.r(e);
      var r = (t, e, n = {}) => {
        let { type: r, coordinates: i } = t.geometry;
        return (
          'MultiPolygon' === t.geometry.type &&
            ((r = 'Polygon'),
            (i = t.geometry.coordinates.reduce((t, e) => t.concat(e), []))),
          Object.assign({}, n, t, {
            geometry: { type: r, coordinates: i, fillRule: 'evenOdd' },
          })
        );
      };
      var i = function(t) {
        const { pointsCount: e, pointsWeight: n } = t.properties;
        let r;
        if (0 === e) r = this.options.get('fillColorEmptyPolygon');
        else {
          const t = 'weight' === this.options.get('fillBy') ? n : e;
          r = this.colorize.getColor(t);
        }
        return (
          (t.options = {
            fillColor: r,
            fillOpacity: this.options.get('fillOpacity'),
            strokeWidth: this.options.get('strokeWidth'),
            strokeColor: this.options.get('strokeColor'),
          }),
          t
        );
      };
      var o = function(t) {
        return t.properties.pointsCount > 0;
      };
      var s = function(t) {
        const e = t.get('objectId');
        this._prevObjectId !== e &&
          this.objectManager.objects.setObjectOptions(e, {
            fillOpacity: this.options.get('fillOpacityHover'),
            strokeWidth: this.options.get('strokeWidthHover'),
          });
      };
      var a = function(t) {
        const e = t.get('objectId');
        this._prevObjectId !== e &&
          this.objectManager.objects.setObjectOptions(e, {
            fillOpacity: this.options.get('fillOpacity'),
            strokeWidth: this.options.get('strokeWidth'),
          });
      };
      var d = t =>
        `<div>\n            <h3>Данные об объекте</h3>\n            <div>Количество точек: ${t.properties.pointsCount}</div>\n    </div>`;
      var u = function(t) {
          const e = t.get('objectId'),
            n = this.objectManager.objects.getById(e),
            r = this.options.get('balloonContent');
          this.balloon.setData({ content: r(n) }),
            this.balloon.open(t.get('coords')),
            this._prevObjectId &&
              this.objectManager.objects.setObjectOptions(this._prevObjectId, {
                fillOpacity: this.options.get('fillOpacity'),
                strokeWidth: this.options.get('strokeWidth'),
              }),
            this.objectManager.objects.setObjectOptions(e, {
              fillOpacity: this.options.get('fillOpacityActive'),
              strokeWidth: this.options.get('strokeWidthActive'),
            }),
            (this._prevObjectId = e),
            this.balloon.events.add('close', () => {
              this.objectManager.objects.setObjectOptions(this._prevObjectId, {
                fillOpacity: this.options.get('fillOpacity'),
                strokeWidth: this.options.get('strokeWidth'),
              }),
                (this._prevObjectId = null);
            });
        },
        c = n(3),
        g = n.n(c);
      var l = (t, e) => {
          const n = e.coordinates,
            r = t.coordinates,
            i = r[0];
          let o = 1 !== g()(i, n);
          if (o)
            for (let t = 1; t < r.length && o; t++) {
              const e = r[t],
                i = 1 !== g()(e, n);
              i && (o = !i);
            }
          else
            for (let t = 1; t < r.length && !o; t++) {
              const e = r[t],
                i = 1 !== g()(e, n);
              i && (o = i);
            }
          return o;
        },
        p = n(12),
        f = n.n(p);
      var b = class {
        constructor(t, e) {
          if ('number' != typeof t) throw new Error('Wrong "maxPointsCount" value');
          if (
            ((this._maxPointsCount = t),
            'object' == typeof e.colorRanges
              ? ((this._ranges = e.colorRanges),
                (this._rangesCount = this._ranges.length))
              : ((this._rangesCount = e.colorRanges),
                (this._ranges = this._createRangesArray())),
            (this._colors =
              'object' == typeof e.colorScheme
                ? e.colorScheme
                : f()({ colormap: e.colorScheme, nshades: this._rangesCount })),
            this._colors.length !== this._rangesCount)
          )
            throw new Error(
              'The length of the colorScheme array and ranges must be equal',
            );
        }
        _createRangesArray() {
          const t = [];
          for (let e = 1; e < this._rangesCount; e++)
            t.push(e * Math.floor(this._maxPointsCount / this._rangesCount, 10));
          return t.push(this._maxPointsCount + 1), t.reverse();
        }
        getColorMap() {
          return this._colors;
        }
        getColorRanges() {
          return this._ranges;
        }
        getColor(t = 0) {
          let e = this._colors[this._rangesCount - 1];
          for (let n = 0; n < this._rangesCount; n++)
            if (t <= this._ranges[n] && t > this._ranges[n + 1]) {
              e = this._colors[n];
              break;
            }
          return e;
        }
      };
      n(63);
      var h = {
        init: t => {
          if (!t.options.get('showLegend')) return;
          const e = t.options.get('legendTemplate'),
            n = t.getMap(),
            r = t.colorize.getColorMap(),
            i = t.colorize.getColorRanges(),
            o = r.map((e, n) => ({
              name: e,
              value: i[n],
              opacity: t.options.get('colorOpacity'),
            })),
            s = function(t) {
              s.superclass.constructor.call(this, t);
            };
          ymaps.util.augment(s, ymaps.collection.Item, {
            onAddToMap(e) {
              s.superclass.onAddToMap.call(this, e),
                this.getParent()
                  .getChildElement(this)
                  .then(this._onGetChildElement, this),
                (t._legendControl = this);
            },
            _onGetChildElement(t) {
              const n = document.createElement('div');
              (n.className = 'ymaps-color-legend'),
                (n.innerHTML = e(o.reverse())),
                t.appendChild(n);
            },
          });
          const a = new s();
          n.controls.add(a, { float: 'none', position: t.options.get('legendPosition') });
        },
        defaultTemplate: t =>
          `\n        <div class="legend">\n            ${t
            .map(
              (e, n) =>
                `\n                <div class="legend__row">\n                    <span class="legend__value">\n                        ${
                  t[n - 1] ? `${t[n - 1].value + 1} - ${e.value}` : `1 - ${e.value}`
                }\n                    </span>\n                    <span class="legend__color" style="background: ${
                  e.name
                }; opacity: ${e.opacity}"></span>\n                </div>\n            `,
            )
            .join('\n')}\n        </div>\n    `,
      };
      ymaps.modules.define(
        'Polygonmap',
        ['meta', 'option.Manager', 'ObjectManager'],
        (t, e, n, c) => {
          t(
            class {
              constructor(t, e) {
                const r = new n({
                  mapper: i,
                  fillBy: 'points',
                  fillByWeightProp: 'weight',
                  fillByWeightType: 'middle',
                  colorRanges: 4,
                  colorScheme: ['#e66a54', '#ce4356', '#ab2960', '#571756'],
                  fillOpacity: 0.8,
                  fillColorEmptyPolygon: '#f4f6f8',
                  strokeColor: '#fff',
                  strokeWidth: 1,
                  showLegend: !0,
                  legendTemplate: h.defaultTemplate,
                  legendPosition: { top: 10, right: 10 },
                  filter: void 0,
                  filterEmptyPolygons: !1,
                  onMouseEnter: s,
                  onMouseLeave: a,
                  onClick: u,
                  balloonContent: d,
                  fillOpacityHover: 0.9,
                  strokeWidthHover: 2,
                  fillOpacityActive: 0.9,
                  strokeWidthActive: 2,
                  interactivity: !0,
                });
                this._initOptions(e, r), this.setData(t);
              }
              getData() {
                return this._data || null;
              }
              setData(t) {
                return (
                  (this._data = t),
                  t &&
                    ((this._data = {
                      points: { type: 'FeatureCollection', features: [] },
                      polygons: { type: 'FeatureCollection', features: [] },
                    }),
                    this._prepare(t),
                    this._initObjectManager()),
                  this
                );
              }
              getMap() {
                return this._map;
              }
              setMap(t) {
                return (
                  this._map !== t && ((this._map = t), t && this._data && this._render()),
                  this
                );
              }
              destroy() {
                this.setData(null),
                  this.objectManager.removeAll(),
                  this._legendControl.setParent(null),
                  this.balloon.close(),
                  this.setMap(null);
              }
              _prepare(t) {
                const n = t.polygons.features,
                  i = this.options.get('fillBy'),
                  o = this.options.get('fillByWeightType'),
                  s = this.options.get('fillByWeightProp');
                let a = t.points.features,
                  d = 0,
                  u = 0,
                  c = 0;
                if (
                  'FeatureCollection' === t.polygons.type &&
                  'FeatureCollection' === t.points.type
                )
                  for (let t = 0; t < n.length; t++) {
                    const g = [],
                      p = r(n[t], e, { id: t });
                    let f = 0,
                      b = 0;
                    for (let n = 0; n < a.length; n++) {
                      let i;
                      0 === t
                        ? ((i = r(a[n], e, { id: n })),
                          this._data.points.features.push(i))
                        : (i = a[n]),
                        l(p.geometry, i.geometry)
                          ? (f++, (b += i.properties[s]))
                          : g.push(i);
                    }
                    (a = g),
                      f < d && (d = f),
                      f > u && (u = f),
                      (p.properties = p.properties || {}),
                      (p.properties.pointsCount = f),
                      'weight' === i &&
                        ('middle' === o
                          ? (b = 0 === b && 0 === f ? 0 : b / f) > c && (c = b)
                          : b > c && (c = b),
                        (p.properties.pointsWeight = b)),
                      this._data.polygons.features.push(p);
                  }
                (this.pointsCountMinimum = d),
                  (this.pointsCountMaximum = u),
                  'weight' === i && (this.pointsWeightMaximum = c);
              }
              _render() {
                this.options.get('interactivity') && this._initInteractivity(),
                  this._map.geoObjects.add(this.objectManager),
                  h.init(this);
              }
              _initOptions(t, e) {
                this.options = new n(t, e);
                const r = this.options.get('mapper'),
                  i = this.options.get('filterEmptyPolygons'),
                  s = this.options.get('onMouseEnter'),
                  a = this.options.get('onMouseLeave'),
                  d = this.options.get('onClick');
                this.options.set('mapper', r.bind(this)),
                  i && this.options.set('filter', o.bind(this)),
                  this.options.set('onMouseEnter', s.bind(this)),
                  this.options.set('onMouseLeave', a.bind(this)),
                  this.options.set('onClick', d.bind(this));
              }
              _initObjectManager() {
                const t = this.options.get('mapper'),
                  e = this.options.get('filter'),
                  n = 'weight' === this.options.get('fillBy');
                if (
                  ((this.colorize = new b(
                    n ? this.pointsWeightMaximum : this.pointsCountMaximum,
                    {
                      colorScheme: this.options.get('colorScheme'),
                      colorRanges: this.options.get('colorRanges'),
                    },
                  )),
                  t && e)
                ) {
                  const n = (n, r) => (e(r) && n.push(t(r)), n);
                  this._data.polygons.features = this._data.polygons.features.reduce(
                    n,
                    [],
                  );
                } else
                  t && !e
                    ? (this._data.polygons.features = this._data.polygons.features.map(t))
                    : !t &&
                      e &&
                      (this._data.polygons.features = this._data.polygons.features.filter(
                        e,
                      ));
                (this.objectManager = new c()),
                  this.objectManager.add(this._data.polygons);
              }
              _initInteractivity() {
                (this._prevObjectId = null),
                  (this.balloon = new ymaps.Balloon(this._map));
                const t = this.options.get('onMouseEnter'),
                  e = this.options.get('onMouseLeave'),
                  n = this.options.get('onClick');
                this.objectManager.events.add('mouseenter', t),
                  this.objectManager.events.add('mouseleave', e),
                  this.balloon.options.setParent(this._map.options),
                  this.objectManager.events.add('click', n);
              }
            },
          );
        },
      );
    },
    function(t, e, n) {
      var r = n(6),
        i = 1 / 0;
      t.exports = function(t) {
        if ('string' == typeof t || r(t)) return t;
        var e = t + '';
        return '0' == e && 1 / t == -i ? '-0' : e;
      };
    },
    function(t, e) {
      t.exports = function(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length, i = Array(r); ++n < r; )
          i[n] = e(t[n], n, t);
        return i;
      };
    },
    function(t, e, n) {
      var r = n(5),
        i = n(15),
        o = n(7),
        s = n(6),
        a = 1 / 0,
        d = r ? r.prototype : void 0,
        u = d ? d.toString : void 0;
      t.exports = function t(e) {
        if ('string' == typeof e) return e;
        if (o(e)) return i(e, t) + '';
        if (s(e)) return u ? u.call(e) : '';
        var n = e + '';
        return '0' == n && 1 / e == -a ? '-0' : n;
      };
    },
    function(t, e, n) {
      var r = n(16);
      t.exports = function(t) {
        return null == t ? '' : r(t);
      };
    },
    function(t, e, n) {
      var r = n(0);
      t.exports = function(t, e) {
        var n = r(this, t),
          i = n.size;
        return n.set(t, e), (this.size += n.size == i ? 0 : 1), this;
      };
    },
    function(t, e, n) {
      var r = n(0);
      t.exports = function(t) {
        return r(this, t).has(t);
      };
    },
    function(t, e, n) {
      var r = n(0);
      t.exports = function(t) {
        return r(this, t).get(t);
      };
    },
    function(t, e) {
      t.exports = function(t) {
        var e = typeof t;
        return 'string' == e || 'number' == e || 'symbol' == e || 'boolean' == e
          ? '__proto__' !== t
          : null === t;
      };
    },
    function(t, e, n) {
      var r = n(0);
      t.exports = function(t) {
        var e = r(this, t).delete(t);
        return (this.size -= e ? 1 : 0), e;
      };
    },
    function(t, e, n) {
      var r = n(9)(n(4), 'Map');
      t.exports = r;
    },
    function(t, e, n) {
      var r = n(1);
      t.exports = function(t, e) {
        var n = this.__data__,
          i = r(n, t);
        return i < 0 ? (++this.size, n.push([t, e])) : (n[i][1] = e), this;
      };
    },
    function(t, e, n) {
      var r = n(1);
      t.exports = function(t) {
        return r(this.__data__, t) > -1;
      };
    },
    function(t, e, n) {
      var r = n(1);
      t.exports = function(t) {
        var e = this.__data__,
          n = r(e, t);
        return n < 0 ? void 0 : e[n][1];
      };
    },
    function(t, e) {
      t.exports = function(t, e) {
        return t === e || (t != t && e != e);
      };
    },
    function(t, e, n) {
      var r = n(1),
        i = Array.prototype.splice;
      t.exports = function(t) {
        var e = this.__data__,
          n = r(e, t);
        return !(
          n < 0 || (n == e.length - 1 ? e.pop() : i.call(e, n, 1), --this.size, 0)
        );
      };
    },
    function(t, e) {
      t.exports = function() {
        (this.__data__ = []), (this.size = 0);
      };
    },
    function(t, e, n) {
      var r = n(29),
        i = n(28),
        o = n(26),
        s = n(25),
        a = n(24);
      function d(t) {
        var e = -1,
          n = null == t ? 0 : t.length;
        for (this.clear(); ++e < n; ) {
          var r = t[e];
          this.set(r[0], r[1]);
        }
      }
      (d.prototype.clear = r),
        (d.prototype.delete = i),
        (d.prototype.get = o),
        (d.prototype.has = s),
        (d.prototype.set = a),
        (t.exports = d);
    },
    function(t, e, n) {
      var r = n(2),
        i = '__lodash_hash_undefined__';
      t.exports = function(t, e) {
        var n = this.__data__;
        return (
          (this.size += this.has(t) ? 0 : 1), (n[t] = r && void 0 === e ? i : e), this
        );
      };
    },
    function(t, e, n) {
      var r = n(2),
        i = Object.prototype.hasOwnProperty;
      t.exports = function(t) {
        var e = this.__data__;
        return r ? void 0 !== e[t] : i.call(e, t);
      };
    },
    function(t, e, n) {
      var r = n(2),
        i = '__lodash_hash_undefined__',
        o = Object.prototype.hasOwnProperty;
      t.exports = function(t) {
        var e = this.__data__;
        if (r) {
          var n = e[t];
          return n === i ? void 0 : n;
        }
        return o.call(e, t) ? e[t] : void 0;
      };
    },
    function(t, e) {
      t.exports = function(t) {
        var e = this.has(t) && delete this.__data__[t];
        return (this.size -= e ? 1 : 0), e;
      };
    },
    function(t, e) {
      t.exports = function(t, e) {
        return null == t ? void 0 : t[e];
      };
    },
    function(t, e) {
      var n = Function.prototype.toString;
      t.exports = function(t) {
        if (null != t) {
          try {
            return n.call(t);
          } catch (t) {}
          try {
            return t + '';
          } catch (t) {}
        }
        return '';
      };
    },
    function(t, e, n) {
      var r = n(4)['__core-js_shared__'];
      t.exports = r;
    },
    function(t, e, n) {
      var r,
        i = n(37),
        o = (r = /[^.]+$/.exec((i && i.keys && i.keys.IE_PROTO) || ''))
          ? 'Symbol(src)_1.' + r
          : '';
      t.exports = function(t) {
        return !!o && o in t;
      };
    },
    function(t, e, n) {
      var r = n(10),
        i = n(8),
        o = '[object AsyncFunction]',
        s = '[object Function]',
        a = '[object GeneratorFunction]',
        d = '[object Proxy]';
      t.exports = function(t) {
        if (!i(t)) return !1;
        var e = r(t);
        return e == s || e == a || e == o || e == d;
      };
    },
    function(t, e, n) {
      var r = n(39),
        i = n(38),
        o = n(8),
        s = n(36),
        a = /^\[object .+?Constructor\]$/,
        d = Function.prototype,
        u = Object.prototype,
        c = d.toString,
        g = u.hasOwnProperty,
        l = RegExp(
          '^' +
            c
              .call(g)
              .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
              .replace(
                /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                '$1.*?',
              ) +
            '$',
        );
      t.exports = function(t) {
        return !(!o(t) || i(t)) && (r(t) ? l : a).test(s(t));
      };
    },
    function(t, e, n) {
      var r = n(2);
      t.exports = function() {
        (this.__data__ = r ? r(null) : {}), (this.size = 0);
      };
    },
    function(t, e, n) {
      var r = n(41),
        i = n(34),
        o = n(33),
        s = n(32),
        a = n(31);
      function d(t) {
        var e = -1,
          n = null == t ? 0 : t.length;
        for (this.clear(); ++e < n; ) {
          var r = t[e];
          this.set(r[0], r[1]);
        }
      }
      (d.prototype.clear = r),
        (d.prototype.delete = i),
        (d.prototype.get = o),
        (d.prototype.has = s),
        (d.prototype.set = a),
        (t.exports = d);
    },
    function(t, e, n) {
      var r = n(42),
        i = n(30),
        o = n(23);
      t.exports = function() {
        (this.size = 0),
          (this.__data__ = { hash: new r(), map: new (o || i)(), string: new r() });
      };
    },
    function(t, e, n) {
      var r = n(43),
        i = n(22),
        o = n(20),
        s = n(19),
        a = n(18);
      function d(t) {
        var e = -1,
          n = null == t ? 0 : t.length;
        for (this.clear(); ++e < n; ) {
          var r = t[e];
          this.set(r[0], r[1]);
        }
      }
      (d.prototype.clear = r),
        (d.prototype.delete = i),
        (d.prototype.get = o),
        (d.prototype.has = s),
        (d.prototype.set = a),
        (t.exports = d);
    },
    function(t, e, n) {
      var r = n(44),
        i = 'Expected a function';
      function o(t, e) {
        if ('function' != typeof t || (null != e && 'function' != typeof e))
          throw new TypeError(i);
        var n = function() {
          var r = arguments,
            i = e ? e.apply(this, r) : r[0],
            o = n.cache;
          if (o.has(i)) return o.get(i);
          var s = t.apply(this, r);
          return (n.cache = o.set(i, s) || o), s;
        };
        return (n.cache = new (o.Cache || r)()), n;
      }
      (o.Cache = r), (t.exports = o);
    },
    function(t, e, n) {
      var r = n(45),
        i = 500;
      t.exports = function(t) {
        var e = r(t, function(t) {
            return n.size === i && n.clear(), t;
          }),
          n = e.cache;
        return e;
      };
    },
    function(t, e, n) {
      var r = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        i = /\\(\\)?/g,
        o = n(46)(function(t) {
          var e = [];
          return (
            46 === t.charCodeAt(0) && e.push(''),
            t.replace(r, function(t, n, r, o) {
              e.push(r ? o.replace(i, '$1') : n || t);
            }),
            e
          );
        });
      t.exports = o;
    },
    function(t, e) {
      t.exports = function(t) {
        return null != t && 'object' == typeof t;
      };
    },
    function(t, e) {
      var n = Object.prototype.toString;
      t.exports = function(t) {
        return n.call(t);
      };
    },
    function(t, e, n) {
      var r = n(5),
        i = Object.prototype,
        o = i.hasOwnProperty,
        s = i.toString,
        a = r ? r.toStringTag : void 0;
      t.exports = function(t) {
        var e = o.call(t, a),
          n = t[a];
        try {
          t[a] = void 0;
          var r = !0;
        } catch (t) {}
        var i = s.call(t);
        return r && (e ? (t[a] = n) : delete t[a]), i;
      };
    },
    function(t, e) {
      var n;
      n = (function() {
        return this;
      })();
      try {
        n = n || Function('return this')() || (0, eval)('this');
      } catch (t) {
        'object' == typeof window && (n = window);
      }
      t.exports = n;
    },
    function(t, e, n) {
      (function(e) {
        var n = 'object' == typeof e && e && e.Object === Object && e;
        t.exports = n;
      }.call(this, n(51)));
    },
    function(t, e, n) {
      var r = n(7),
        i = n(6),
        o = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        s = /^\w*$/;
      t.exports = function(t, e) {
        if (r(t)) return !1;
        var n = typeof t;
        return (
          !('number' != n && 'symbol' != n && 'boolean' != n && null != t && !i(t)) ||
          s.test(t) ||
          !o.test(t) ||
          (null != e && t in Object(e))
        );
      };
    },
    function(t, e, n) {
      var r = n(7),
        i = n(53),
        o = n(47),
        s = n(17);
      t.exports = function(t, e) {
        return r(t) ? t : i(t, e) ? [t] : o(s(t));
      };
    },
    function(t, e, n) {
      var r = n(54),
        i = n(14);
      t.exports = function(t, e) {
        for (var n = 0, o = (e = r(e, t)).length; null != t && n < o; ) t = t[i(e[n++])];
        return n && n == o ? t : void 0;
      };
    },
    function(t, e, n) {
      var r = n(55);
      t.exports = function(t, e, n) {
        var i = null == t ? void 0 : r(t, e);
        return void 0 === i ? n : i;
      };
    },
    function(t, e, n) {
      'use strict';
      (e.__esModule = !0),
        (e.default = function(t, e, n, r, i, o, s) {
          for (
            var a = o / n,
              d = s / n,
              u = { type: 'FeatureCollection', features: [] },
              c = 0,
              g = 0;
            g < d;
            g++
          )
            for (var l = 0; l < a; l++) {
              var p = r + l * n,
                f = i + g * n,
                b = p + n,
                h = f + n,
                x = [
                  [p, f],
                  [b, f],
                  [b, h],
                  [p, h],
                ],
                v = x.map(function(n) {
                  return t.fromGlobalPixels(n, e);
                });
              u.features.push({
                type: 'Feature',
                id: 'sqr' + c++,
                geometry: { type: 'Polygon', coordinates: [v] },
                properties: {},
              });
            }
          return u;
        });
    },
    function(t, e, n) {
      'use strict';
      function r(t) {
        return Math.sin((Math.PI * t) / 180);
      }
      function i(t) {
        return Math.cos((Math.PI * t) / 180);
      }
      (e.__esModule = !0),
        (e.sin = r),
        (e.cos = i),
        (e.default = function(t, e, n, o, s, a, d) {
          for (
            var u = 1.5 * n,
              c = 1.5 * n,
              g = Math.floor((a + n / 2) / u) + 1,
              l = Math.floor(d / c),
              p = { type: 'FeatureCollection', features: [] },
              f = 0,
              b = 0;
            b < g;
            b++
          )
            for (var h = 0; h < l; h++) {
              var x = b % 2 == 0 ? 0 : -1 * r(60),
                v = 1.5 * b,
                y = h * (2 * r(60)) + x,
                m = [
                  [i(0) + v, r(0) + y],
                  [i(60) + v, r(60) + y],
                  [i(120) + v, r(120) + y],
                  [i(180) + v, r(180) + y],
                  [i(240) + v, r(240) + y],
                  [i(300) + v, r(300) + y],
                  [i(0) + v, r(0) + y],
                ],
                _ = m.map(function(r) {
                  var i = r[0],
                    a = r[1];
                  return t.fromGlobalPixels([o + i * n, s + a * n], e);
                });
              p.features.push({
                type: 'Feature',
                id: 'hxg' + f++,
                geometry: { type: 'Polygon', coordinates: [_] },
                properties: {},
              });
            }
          return p;
        });
    },
    function(t, e) {
      t.exports = function(t) {
        var e = 'undefined' != typeof window && window.location;
        if (!e) throw new Error('fixUrls requires window.location');
        if (!t || 'string' != typeof t) return t;
        var n = e.protocol + '//' + e.host,
          r = n + e.pathname.replace(/\/[^\/]*$/, '/');
        return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(
          t,
          e,
        ) {
          var i,
            o = e
              .trim()
              .replace(/^"(.*)"$/, function(t, e) {
                return e;
              })
              .replace(/^'(.*)'$/, function(t, e) {
                return e;
              });
          return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o)
            ? t
            : ((i =
                0 === o.indexOf('//')
                  ? o
                  : 0 === o.indexOf('/')
                  ? n + o
                  : r + o.replace(/^\.\//, '')),
              'url(' + JSON.stringify(i) + ')');
        });
      };
    },
    function(t, e, n) {
      var r,
        i,
        o = {},
        s =
          ((r = function() {
            return window && document && document.all && !window.atob;
          }),
          function() {
            return void 0 === i && (i = r.apply(this, arguments)), i;
          }),
        a = (function(t) {
          var e = {};
          return function(t) {
            if ('function' == typeof t) return t();
            if (void 0 === e[t]) {
              var n = function(t) {
                return document.querySelector(t);
              }.call(this, t);
              if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement)
                try {
                  n = n.contentDocument.head;
                } catch (t) {
                  n = null;
                }
              e[t] = n;
            }
            return e[t];
          };
        })(),
        d = null,
        u = 0,
        c = [],
        g = n(59);
      function l(t, e) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n],
            i = o[r.id];
          if (i) {
            i.refs++;
            for (var s = 0; s < i.parts.length; s++) i.parts[s](r.parts[s]);
            for (; s < r.parts.length; s++) i.parts.push(v(r.parts[s], e));
          } else {
            var a = [];
            for (s = 0; s < r.parts.length; s++) a.push(v(r.parts[s], e));
            o[r.id] = { id: r.id, refs: 1, parts: a };
          }
        }
      }
      function p(t, e) {
        for (var n = [], r = {}, i = 0; i < t.length; i++) {
          var o = t[i],
            s = e.base ? o[0] + e.base : o[0],
            a = { css: o[1], media: o[2], sourceMap: o[3] };
          r[s] ? r[s].parts.push(a) : n.push((r[s] = { id: s, parts: [a] }));
        }
        return n;
      }
      function f(t, e) {
        var n = a(t.insertInto);
        if (!n)
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.",
          );
        var r = c[c.length - 1];
        if ('top' === t.insertAt)
          r
            ? r.nextSibling
              ? n.insertBefore(e, r.nextSibling)
              : n.appendChild(e)
            : n.insertBefore(e, n.firstChild),
            c.push(e);
        else if ('bottom' === t.insertAt) n.appendChild(e);
        else {
          if ('object' != typeof t.insertAt || !t.insertAt.before)
            throw new Error(
              "[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n",
            );
          var i = a(t.insertInto + ' ' + t.insertAt.before);
          n.insertBefore(e, i);
        }
      }
      function b(t) {
        if (null === t.parentNode) return !1;
        t.parentNode.removeChild(t);
        var e = c.indexOf(t);
        e >= 0 && c.splice(e, 1);
      }
      function h(t) {
        var e = document.createElement('style');
        return (
          void 0 === t.attrs.type && (t.attrs.type = 'text/css'),
          x(e, t.attrs),
          f(t, e),
          e
        );
      }
      function x(t, e) {
        Object.keys(e).forEach(function(n) {
          t.setAttribute(n, e[n]);
        });
      }
      function v(t, e) {
        var n, r, i, o;
        if (e.transform && t.css) {
          if (!(o = e.transform(t.css))) return function() {};
          t.css = o;
        }
        if (e.singleton) {
          var s = u++;
          (n = d || (d = h(e))),
            (r = _.bind(null, n, s, !1)),
            (i = _.bind(null, n, s, !0));
        } else
          t.sourceMap &&
          'function' == typeof URL &&
          'function' == typeof URL.createObjectURL &&
          'function' == typeof URL.revokeObjectURL &&
          'function' == typeof Blob &&
          'function' == typeof btoa
            ? ((n = (function(t) {
                var e = document.createElement('link');
                return (
                  void 0 === t.attrs.type && (t.attrs.type = 'text/css'),
                  (t.attrs.rel = 'stylesheet'),
                  x(e, t.attrs),
                  f(t, e),
                  e
                );
              })(e)),
              (r = function(t, e, n) {
                var r = n.css,
                  i = n.sourceMap,
                  o = void 0 === e.convertToAbsoluteUrls && i;
                (e.convertToAbsoluteUrls || o) && (r = g(r));
                i &&
                  (r +=
                    '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(i)))) +
                    ' */');
                var s = new Blob([r], { type: 'text/css' }),
                  a = t.href;
                (t.href = URL.createObjectURL(s)), a && URL.revokeObjectURL(a);
              }.bind(null, n, e)),
              (i = function() {
                b(n), n.href && URL.revokeObjectURL(n.href);
              }))
            : ((n = h(e)),
              (r = function(t, e) {
                var n = e.css,
                  r = e.media;
                r && t.setAttribute('media', r);
                if (t.styleSheet) t.styleSheet.cssText = n;
                else {
                  for (; t.firstChild; ) t.removeChild(t.firstChild);
                  t.appendChild(document.createTextNode(n));
                }
              }.bind(null, n)),
              (i = function() {
                b(n);
              }));
        return (
          r(t),
          function(e) {
            if (e) {
              if (e.css === t.css && e.media === t.media && e.sourceMap === t.sourceMap)
                return;
              r((t = e));
            } else i();
          }
        );
      }
      t.exports = function(t, e) {
        if ('undefined' != typeof DEBUG && DEBUG && 'object' != typeof document)
          throw new Error('The style-loader cannot be used in a non-browser environment');
        ((e = e || {}).attrs = 'object' == typeof e.attrs ? e.attrs : {}),
          e.singleton || 'boolean' == typeof e.singleton || (e.singleton = s()),
          e.insertInto || (e.insertInto = 'head'),
          e.insertAt || (e.insertAt = 'bottom');
        var n = p(t, e);
        return (
          l(n, e),
          function(t) {
            for (var r = [], i = 0; i < n.length; i++) {
              var s = n[i];
              (a = o[s.id]).refs--, r.push(a);
            }
            t && l(p(t, e), e);
            for (i = 0; i < r.length; i++) {
              var a;
              if (0 === (a = r[i]).refs) {
                for (var d = 0; d < a.parts.length; d++) a.parts[d]();
                delete o[a.id];
              }
            }
          }
        );
      };
      var y,
        m =
          ((y = []),
          function(t, e) {
            return (y[t] = e), y.filter(Boolean).join('\n');
          });
      function _(t, e, n, r) {
        var i = n ? '' : r.css;
        if (t.styleSheet) t.styleSheet.cssText = m(e, i);
        else {
          var o = document.createTextNode(i),
            s = t.childNodes;
          s[e] && t.removeChild(s[e]),
            s.length ? t.insertBefore(o, s[e]) : t.appendChild(o);
        }
      }
    },
    function(t, e) {
      t.exports = function(t) {
        var e = [];
        return (
          (e.toString = function() {
            return this.map(function(e) {
              var n = (function(t, e) {
                var n = t[1] || '',
                  r = t[3];
                if (!r) return n;
                if (e && 'function' == typeof btoa) {
                  var i =
                      ((s = r),
                      '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
                        btoa(unescape(encodeURIComponent(JSON.stringify(s)))) +
                        ' */'),
                    o = r.sources.map(function(t) {
                      return '/*# sourceURL=' + r.sourceRoot + t + ' */';
                    });
                  return [n]
                    .concat(o)
                    .concat([i])
                    .join('\n');
                }
                var s;
                return [n].join('\n');
              })(e, t);
              return e[2] ? '@media ' + e[2] + '{' + n + '}' : n;
            }).join('');
          }),
          (e.i = function(t, n) {
            'string' == typeof t && (t = [[null, t, '']]);
            for (var r = {}, i = 0; i < this.length; i++) {
              var o = this[i][0];
              'number' == typeof o && (r[o] = !0);
            }
            for (i = 0; i < t.length; i++) {
              var s = t[i];
              ('number' == typeof s[0] && r[s[0]]) ||
                (n && !s[2] ? (s[2] = n) : n && (s[2] = '(' + s[2] + ') and (' + n + ')'),
                e.push(s));
            }
          }),
          e
        );
      };
    },
    function(t, e, n) {
      (t.exports = n(61)(!1)).push([
        t.i,
        '.legend {\n    background: #fff;\n    border-radius: 4px;\n    padding: 5px;\n}\n\n.legend__row {\n    text-align: right !important;\n}\n\n.legend__color,\n.legend__value {\n    display: inline-block;\n    vertical-align: middle\n}\n\n.legend__color {\n    width: 20px;\n    height: 20px;\n    margin-left: 10px;\n}\n\n.legend__value {\n    font-size: 12px;\n    white-space: nowrap;\n}',
        '',
      ]);
    },
    function(t, e, n) {
      var r = n(62);
      'string' == typeof r && (r = [[t.i, r, '']]);
      var i = { hmr: !0, transform: void 0, insertInto: void 0 };
      n(60)(r, i);
      r.locals && (t.exports = r.locals);
    },
    function(t, e) {
      t.exports = function(t, e, n) {
        return t * (1 - n) + e * n;
      };
    },
    function(t, e) {
      t.exports = {
        jet: [
          { index: 0, rgb: [0, 0, 131] },
          { index: 0.125, rgb: [0, 60, 170] },
          { index: 0.375, rgb: [5, 255, 255] },
          { index: 0.625, rgb: [255, 255, 0] },
          { index: 0.875, rgb: [250, 0, 0] },
          { index: 1, rgb: [128, 0, 0] },
        ],
        hsv: [
          { index: 0, rgb: [255, 0, 0] },
          { index: 0.169, rgb: [253, 255, 2] },
          { index: 0.173, rgb: [247, 255, 2] },
          { index: 0.337, rgb: [0, 252, 4] },
          { index: 0.341, rgb: [0, 252, 10] },
          { index: 0.506, rgb: [1, 249, 255] },
          { index: 0.671, rgb: [2, 0, 253] },
          { index: 0.675, rgb: [8, 0, 253] },
          { index: 0.839, rgb: [255, 0, 251] },
          { index: 0.843, rgb: [255, 0, 245] },
          { index: 1, rgb: [255, 0, 6] },
        ],
        hot: [
          { index: 0, rgb: [0, 0, 0] },
          { index: 0.3, rgb: [230, 0, 0] },
          { index: 0.6, rgb: [255, 210, 0] },
          { index: 1, rgb: [255, 255, 255] },
        ],
        cool: [
          { index: 0, rgb: [0, 255, 255] },
          { index: 1, rgb: [255, 0, 255] },
        ],
        spring: [
          { index: 0, rgb: [255, 0, 255] },
          { index: 1, rgb: [255, 255, 0] },
        ],
        summer: [
          { index: 0, rgb: [0, 128, 102] },
          { index: 1, rgb: [255, 255, 102] },
        ],
        autumn: [
          { index: 0, rgb: [255, 0, 0] },
          { index: 1, rgb: [255, 255, 0] },
        ],
        winter: [
          { index: 0, rgb: [0, 0, 255] },
          { index: 1, rgb: [0, 255, 128] },
        ],
        bone: [
          { index: 0, rgb: [0, 0, 0] },
          { index: 0.376, rgb: [84, 84, 116] },
          { index: 0.753, rgb: [169, 200, 200] },
          { index: 1, rgb: [255, 255, 255] },
        ],
        copper: [
          { index: 0, rgb: [0, 0, 0] },
          { index: 0.804, rgb: [255, 160, 102] },
          { index: 1, rgb: [255, 199, 127] },
        ],
        greys: [
          { index: 0, rgb: [0, 0, 0] },
          { index: 1, rgb: [255, 255, 255] },
        ],
        yignbu: [
          { index: 0, rgb: [8, 29, 88] },
          { index: 0.125, rgb: [37, 52, 148] },
          { index: 0.25, rgb: [34, 94, 168] },
          { index: 0.375, rgb: [29, 145, 192] },
          { index: 0.5, rgb: [65, 182, 196] },
          { index: 0.625, rgb: [127, 205, 187] },
          { index: 0.75, rgb: [199, 233, 180] },
          { index: 0.875, rgb: [237, 248, 217] },
          { index: 1, rgb: [255, 255, 217] },
        ],
        greens: [
          { index: 0, rgb: [0, 68, 27] },
          { index: 0.125, rgb: [0, 109, 44] },
          { index: 0.25, rgb: [35, 139, 69] },
          { index: 0.375, rgb: [65, 171, 93] },
          { index: 0.5, rgb: [116, 196, 118] },
          { index: 0.625, rgb: [161, 217, 155] },
          { index: 0.75, rgb: [199, 233, 192] },
          { index: 0.875, rgb: [229, 245, 224] },
          { index: 1, rgb: [247, 252, 245] },
        ],
        yiorrd: [
          { index: 0, rgb: [128, 0, 38] },
          { index: 0.125, rgb: [189, 0, 38] },
          { index: 0.25, rgb: [227, 26, 28] },
          { index: 0.375, rgb: [252, 78, 42] },
          { index: 0.5, rgb: [253, 141, 60] },
          { index: 0.625, rgb: [254, 178, 76] },
          { index: 0.75, rgb: [254, 217, 118] },
          { index: 0.875, rgb: [255, 237, 160] },
          { index: 1, rgb: [255, 255, 204] },
        ],
        bluered: [
          { index: 0, rgb: [0, 0, 255] },
          { index: 1, rgb: [255, 0, 0] },
        ],
        rdbu: [
          { index: 0, rgb: [5, 10, 172] },
          { index: 0.35, rgb: [106, 137, 247] },
          { index: 0.5, rgb: [190, 190, 190] },
          { index: 0.6, rgb: [220, 170, 132] },
          { index: 0.7, rgb: [230, 145, 90] },
          { index: 1, rgb: [178, 10, 28] },
        ],
        picnic: [
          { index: 0, rgb: [0, 0, 255] },
          { index: 0.1, rgb: [51, 153, 255] },
          { index: 0.2, rgb: [102, 204, 255] },
          { index: 0.3, rgb: [153, 204, 255] },
          { index: 0.4, rgb: [204, 204, 255] },
          { index: 0.5, rgb: [255, 255, 255] },
          { index: 0.6, rgb: [255, 204, 255] },
          { index: 0.7, rgb: [255, 153, 255] },
          { index: 0.8, rgb: [255, 102, 204] },
          { index: 0.9, rgb: [255, 102, 102] },
          { index: 1, rgb: [255, 0, 0] },
        ],
        rainbow: [
          { index: 0, rgb: [150, 0, 90] },
          { index: 0.125, rgb: [0, 0, 200] },
          { index: 0.25, rgb: [0, 25, 255] },
          { index: 0.375, rgb: [0, 152, 255] },
          { index: 0.5, rgb: [44, 255, 150] },
          { index: 0.625, rgb: [151, 255, 0] },
          { index: 0.75, rgb: [255, 234, 0] },
          { index: 0.875, rgb: [255, 111, 0] },
          { index: 1, rgb: [255, 0, 0] },
        ],
        portland: [
          { index: 0, rgb: [12, 51, 131] },
          { index: 0.25, rgb: [10, 136, 186] },
          { index: 0.5, rgb: [242, 211, 56] },
          { index: 0.75, rgb: [242, 143, 56] },
          { index: 1, rgb: [217, 30, 30] },
        ],
        blackbody: [
          { index: 0, rgb: [0, 0, 0] },
          { index: 0.2, rgb: [230, 0, 0] },
          { index: 0.4, rgb: [230, 210, 0] },
          { index: 0.7, rgb: [255, 255, 255] },
          { index: 1, rgb: [160, 200, 255] },
        ],
        earth: [
          { index: 0, rgb: [0, 0, 130] },
          { index: 0.1, rgb: [0, 180, 180] },
          { index: 0.2, rgb: [40, 210, 40] },
          { index: 0.4, rgb: [230, 230, 50] },
          { index: 0.6, rgb: [120, 70, 20] },
          { index: 1, rgb: [255, 255, 255] },
        ],
        electric: [
          { index: 0, rgb: [0, 0, 0] },
          { index: 0.15, rgb: [30, 0, 100] },
          { index: 0.4, rgb: [120, 0, 100] },
          { index: 0.6, rgb: [160, 90, 0] },
          { index: 0.8, rgb: [230, 200, 0] },
          { index: 1, rgb: [255, 250, 220] },
        ],
        alpha: [
          { index: 0, rgb: [255, 255, 255, 0] },
          { index: 1, rgb: [255, 255, 255, 1] },
        ],
        viridis: [
          { index: 0, rgb: [68, 1, 84] },
          { index: 0.13, rgb: [71, 44, 122] },
          { index: 0.25, rgb: [59, 81, 139] },
          { index: 0.38, rgb: [44, 113, 142] },
          { index: 0.5, rgb: [33, 144, 141] },
          { index: 0.63, rgb: [39, 173, 129] },
          { index: 0.75, rgb: [92, 200, 99] },
          { index: 0.88, rgb: [170, 220, 50] },
          { index: 1, rgb: [253, 231, 37] },
        ],
        inferno: [
          { index: 0, rgb: [0, 0, 4] },
          { index: 0.13, rgb: [31, 12, 72] },
          { index: 0.25, rgb: [85, 15, 109] },
          { index: 0.38, rgb: [136, 34, 106] },
          { index: 0.5, rgb: [186, 54, 85] },
          { index: 0.63, rgb: [227, 89, 51] },
          { index: 0.75, rgb: [249, 140, 10] },
          { index: 0.88, rgb: [249, 201, 50] },
          { index: 1, rgb: [252, 255, 164] },
        ],
        magma: [
          { index: 0, rgb: [0, 0, 4] },
          { index: 0.13, rgb: [28, 16, 68] },
          { index: 0.25, rgb: [79, 18, 123] },
          { index: 0.38, rgb: [129, 37, 129] },
          { index: 0.5, rgb: [181, 54, 122] },
          { index: 0.63, rgb: [229, 80, 100] },
          { index: 0.75, rgb: [251, 135, 97] },
          { index: 0.88, rgb: [254, 194, 135] },
          { index: 1, rgb: [252, 253, 191] },
        ],
        plasma: [
          { index: 0, rgb: [13, 8, 135] },
          { index: 0.13, rgb: [75, 3, 161] },
          { index: 0.25, rgb: [125, 3, 168] },
          { index: 0.38, rgb: [168, 34, 150] },
          { index: 0.5, rgb: [203, 70, 121] },
          { index: 0.63, rgb: [229, 107, 93] },
          { index: 0.75, rgb: [248, 148, 65] },
          { index: 0.88, rgb: [253, 195, 40] },
          { index: 1, rgb: [240, 249, 33] },
        ],
        warm: [
          { index: 0, rgb: [125, 0, 179] },
          { index: 0.13, rgb: [172, 0, 187] },
          { index: 0.25, rgb: [219, 0, 170] },
          { index: 0.38, rgb: [255, 0, 130] },
          { index: 0.5, rgb: [255, 63, 74] },
          { index: 0.63, rgb: [255, 123, 0] },
          { index: 0.75, rgb: [234, 176, 0] },
          { index: 0.88, rgb: [190, 228, 0] },
          { index: 1, rgb: [147, 255, 0] },
        ],
        cool: [
          { index: 0, rgb: [125, 0, 179] },
          { index: 0.13, rgb: [116, 0, 218] },
          { index: 0.25, rgb: [98, 74, 237] },
          { index: 0.38, rgb: [68, 146, 231] },
          { index: 0.5, rgb: [0, 204, 197] },
          { index: 0.63, rgb: [0, 247, 146] },
          { index: 0.75, rgb: [0, 255, 88] },
          { index: 0.88, rgb: [40, 255, 8] },
          { index: 1, rgb: [147, 255, 0] },
        ],
        'rainbow-soft': [
          { index: 0, rgb: [125, 0, 179] },
          { index: 0.1, rgb: [199, 0, 180] },
          { index: 0.2, rgb: [255, 0, 121] },
          { index: 0.3, rgb: [255, 108, 0] },
          { index: 0.4, rgb: [222, 194, 0] },
          { index: 0.5, rgb: [150, 255, 0] },
          { index: 0.6, rgb: [0, 255, 55] },
          { index: 0.7, rgb: [0, 246, 150] },
          { index: 0.8, rgb: [50, 167, 222] },
          { index: 0.9, rgb: [103, 51, 235] },
          { index: 1, rgb: [124, 0, 186] },
        ],
        bathymetry: [
          { index: 0, rgb: [40, 26, 44] },
          { index: 0.13, rgb: [59, 49, 90] },
          { index: 0.25, rgb: [64, 76, 139] },
          { index: 0.38, rgb: [63, 110, 151] },
          { index: 0.5, rgb: [72, 142, 158] },
          { index: 0.63, rgb: [85, 174, 163] },
          { index: 0.75, rgb: [120, 206, 163] },
          { index: 0.88, rgb: [187, 230, 172] },
          { index: 1, rgb: [253, 254, 204] },
        ],
        cdom: [
          { index: 0, rgb: [47, 15, 62] },
          { index: 0.13, rgb: [87, 23, 86] },
          { index: 0.25, rgb: [130, 28, 99] },
          { index: 0.38, rgb: [171, 41, 96] },
          { index: 0.5, rgb: [206, 67, 86] },
          { index: 0.63, rgb: [230, 106, 84] },
          { index: 0.75, rgb: [242, 149, 103] },
          { index: 0.88, rgb: [249, 193, 135] },
          { index: 1, rgb: [254, 237, 176] },
        ],
        chlorophyll: [
          { index: 0, rgb: [18, 36, 20] },
          { index: 0.13, rgb: [25, 63, 41] },
          { index: 0.25, rgb: [24, 91, 59] },
          { index: 0.38, rgb: [13, 119, 72] },
          { index: 0.5, rgb: [18, 148, 80] },
          { index: 0.63, rgb: [80, 173, 89] },
          { index: 0.75, rgb: [132, 196, 122] },
          { index: 0.88, rgb: [175, 221, 162] },
          { index: 1, rgb: [215, 249, 208] },
        ],
        density: [
          { index: 0, rgb: [54, 14, 36] },
          { index: 0.13, rgb: [89, 23, 80] },
          { index: 0.25, rgb: [110, 45, 132] },
          { index: 0.38, rgb: [120, 77, 178] },
          { index: 0.5, rgb: [120, 113, 213] },
          { index: 0.63, rgb: [115, 151, 228] },
          { index: 0.75, rgb: [134, 185, 227] },
          { index: 0.88, rgb: [177, 214, 227] },
          { index: 1, rgb: [230, 241, 241] },
        ],
        'freesurface-blue': [
          { index: 0, rgb: [30, 4, 110] },
          { index: 0.13, rgb: [47, 14, 176] },
          { index: 0.25, rgb: [41, 45, 236] },
          { index: 0.38, rgb: [25, 99, 212] },
          { index: 0.5, rgb: [68, 131, 200] },
          { index: 0.63, rgb: [114, 156, 197] },
          { index: 0.75, rgb: [157, 181, 203] },
          { index: 0.88, rgb: [200, 208, 216] },
          { index: 1, rgb: [241, 237, 236] },
        ],
        'freesurface-red': [
          { index: 0, rgb: [60, 9, 18] },
          { index: 0.13, rgb: [100, 17, 27] },
          { index: 0.25, rgb: [142, 20, 29] },
          { index: 0.38, rgb: [177, 43, 27] },
          { index: 0.5, rgb: [192, 87, 63] },
          { index: 0.63, rgb: [205, 125, 105] },
          { index: 0.75, rgb: [216, 162, 148] },
          { index: 0.88, rgb: [227, 199, 193] },
          { index: 1, rgb: [241, 237, 236] },
        ],
        oxygen: [
          { index: 0, rgb: [64, 5, 5] },
          { index: 0.13, rgb: [106, 6, 15] },
          { index: 0.25, rgb: [144, 26, 7] },
          { index: 0.38, rgb: [168, 64, 3] },
          { index: 0.5, rgb: [188, 100, 4] },
          { index: 0.63, rgb: [206, 136, 11] },
          { index: 0.75, rgb: [220, 174, 25] },
          { index: 0.88, rgb: [231, 215, 44] },
          { index: 1, rgb: [248, 254, 105] },
        ],
        par: [
          { index: 0, rgb: [51, 20, 24] },
          { index: 0.13, rgb: [90, 32, 35] },
          { index: 0.25, rgb: [129, 44, 34] },
          { index: 0.38, rgb: [159, 68, 25] },
          { index: 0.5, rgb: [182, 99, 19] },
          { index: 0.63, rgb: [199, 134, 22] },
          { index: 0.75, rgb: [212, 171, 35] },
          { index: 0.88, rgb: [221, 210, 54] },
          { index: 1, rgb: [225, 253, 75] },
        ],
        phase: [
          { index: 0, rgb: [145, 105, 18] },
          { index: 0.13, rgb: [184, 71, 38] },
          { index: 0.25, rgb: [186, 58, 115] },
          { index: 0.38, rgb: [160, 71, 185] },
          { index: 0.5, rgb: [110, 97, 218] },
          { index: 0.63, rgb: [50, 123, 164] },
          { index: 0.75, rgb: [31, 131, 110] },
          { index: 0.88, rgb: [77, 129, 34] },
          { index: 1, rgb: [145, 105, 18] },
        ],
        salinity: [
          { index: 0, rgb: [42, 24, 108] },
          { index: 0.13, rgb: [33, 50, 162] },
          { index: 0.25, rgb: [15, 90, 145] },
          { index: 0.38, rgb: [40, 118, 137] },
          { index: 0.5, rgb: [59, 146, 135] },
          { index: 0.63, rgb: [79, 175, 126] },
          { index: 0.75, rgb: [120, 203, 104] },
          { index: 0.88, rgb: [193, 221, 100] },
          { index: 1, rgb: [253, 239, 154] },
        ],
        temperature: [
          { index: 0, rgb: [4, 35, 51] },
          { index: 0.13, rgb: [23, 51, 122] },
          { index: 0.25, rgb: [85, 59, 157] },
          { index: 0.38, rgb: [129, 79, 143] },
          { index: 0.5, rgb: [175, 95, 130] },
          { index: 0.63, rgb: [222, 112, 101] },
          { index: 0.75, rgb: [249, 146, 66] },
          { index: 0.88, rgb: [249, 196, 65] },
          { index: 1, rgb: [232, 250, 91] },
        ],
        turbidity: [
          { index: 0, rgb: [34, 31, 27] },
          { index: 0.13, rgb: [65, 50, 41] },
          { index: 0.25, rgb: [98, 69, 52] },
          { index: 0.38, rgb: [131, 89, 57] },
          { index: 0.5, rgb: [161, 112, 59] },
          { index: 0.63, rgb: [185, 140, 66] },
          { index: 0.75, rgb: [202, 174, 88] },
          { index: 0.88, rgb: [216, 209, 126] },
          { index: 1, rgb: [233, 246, 171] },
        ],
        'velocity-blue': [
          { index: 0, rgb: [17, 32, 64] },
          { index: 0.13, rgb: [35, 52, 116] },
          { index: 0.25, rgb: [29, 81, 156] },
          { index: 0.38, rgb: [31, 113, 162] },
          { index: 0.5, rgb: [50, 144, 169] },
          { index: 0.63, rgb: [87, 173, 176] },
          { index: 0.75, rgb: [149, 196, 189] },
          { index: 0.88, rgb: [203, 221, 211] },
          { index: 1, rgb: [254, 251, 230] },
        ],
        'velocity-green': [
          { index: 0, rgb: [23, 35, 19] },
          { index: 0.13, rgb: [24, 64, 38] },
          { index: 0.25, rgb: [11, 95, 45] },
          { index: 0.38, rgb: [39, 123, 35] },
          { index: 0.5, rgb: [95, 146, 12] },
          { index: 0.63, rgb: [152, 165, 18] },
          { index: 0.75, rgb: [201, 186, 69] },
          { index: 0.88, rgb: [233, 216, 137] },
          { index: 1, rgb: [255, 253, 205] },
        ],
        cubehelix: [
          { index: 0, rgb: [0, 0, 0] },
          { index: 0.07, rgb: [22, 5, 59] },
          { index: 0.13, rgb: [60, 4, 105] },
          { index: 0.2, rgb: [109, 1, 135] },
          { index: 0.27, rgb: [161, 0, 147] },
          { index: 0.33, rgb: [210, 2, 142] },
          { index: 0.4, rgb: [251, 11, 123] },
          { index: 0.47, rgb: [255, 29, 97] },
          { index: 0.53, rgb: [255, 54, 69] },
          { index: 0.6, rgb: [255, 85, 46] },
          { index: 0.67, rgb: [255, 120, 34] },
          { index: 0.73, rgb: [255, 157, 37] },
          { index: 0.8, rgb: [241, 191, 57] },
          { index: 0.87, rgb: [224, 220, 93] },
          { index: 0.93, rgb: [218, 241, 142] },
          { index: 1, rgb: [227, 253, 198] },
        ],
      };
    },
    function(t, e, n) {
      'use strict';
      t.exports = function(t, e) {
        var n = 0 | t.length,
          r = 0 | e.length;
        if (1 === n && 1 === r)
          return (function(t, e) {
            var n = t + e,
              r = n - t,
              i = t - (n - r) + (e - r);
            if (i) return [i, n];
            return [n];
          })(t[0], -e[0]);
        var i,
          o,
          s = new Array(n + r),
          a = 0,
          d = 0,
          u = 0,
          c = Math.abs,
          g = t[d],
          l = c(g),
          p = -e[u],
          f = c(p);
        l < f
          ? ((o = g), (d += 1) < n && ((g = t[d]), (l = c(g))))
          : ((o = p), (u += 1) < r && ((p = -e[u]), (f = c(p))));
        (d < n && l < f) || u >= r
          ? ((i = g), (d += 1) < n && ((g = t[d]), (l = c(g))))
          : ((i = p), (u += 1) < r && ((p = -e[u]), (f = c(p))));
        var b,
          h,
          x = i + o,
          v = x - i,
          y = o - v,
          m = y,
          _ = x;
        for (; d < n && u < r; )
          l < f
            ? ((i = g), (d += 1) < n && ((g = t[d]), (l = c(g))))
            : ((i = p), (u += 1) < r && ((p = -e[u]), (f = c(p)))),
            (y = (o = m) - (v = (x = i + o) - i)) && (s[a++] = y),
            (m = _ - ((b = _ + x) - (h = b - _)) + (x - h)),
            (_ = b);
        for (; d < n; )
          (y = (o = m) - (v = (x = (i = g) + o) - i)) && (s[a++] = y),
            (m = _ - ((b = _ + x) - (h = b - _)) + (x - h)),
            (_ = b),
            (d += 1) < n && (g = t[d]);
        for (; u < r; )
          (y = (o = m) - (v = (x = (i = p) + o) - i)) && (s[a++] = y),
            (m = _ - ((b = _ + x) - (h = b - _)) + (x - h)),
            (_ = b),
            (u += 1) < r && (p = -e[u]);
        m && (s[a++] = m);
        _ && (s[a++] = _);
        a || (s[a++] = 0);
        return (s.length = a), s;
      };
    },
    function(t, e, n) {
      'use strict';
      t.exports = function(t, e, n) {
        var r = t + e,
          i = r - t,
          o = e - i,
          s = t - (r - i);
        if (n) return (n[0] = s + o), (n[1] = r), n;
        return [s + o, r];
      };
    },
    function(t, e, n) {
      'use strict';
      var r = n(11),
        i = n(67);
      t.exports = function(t, e) {
        var n = t.length;
        if (1 === n) {
          var o = r(t[0], e);
          return o[0] ? o : [o[1]];
        }
        var s = new Array(2 * n),
          a = [0.1, 0.1],
          d = [0.1, 0.1],
          u = 0;
        r(t[0], e, a), a[0] && (s[u++] = a[0]);
        for (var c = 1; c < n; ++c) {
          r(t[c], e, d);
          var g = a[1];
          i(g, d[0], a), a[0] && (s[u++] = a[0]);
          var l = d[1],
            p = a[1],
            f = l + p,
            b = f - l,
            h = p - b;
          (a[1] = f), h && (s[u++] = h);
        }
        a[1] && (s[u++] = a[1]);
        0 === u && (s[u++] = 0);
        return (s.length = u), s;
      };
    },
    function(t, e, n) {
      'use strict';
      t.exports = function(t, e) {
        var n = 0 | t.length,
          r = 0 | e.length;
        if (1 === n && 1 === r)
          return (function(t, e) {
            var n = t + e,
              r = n - t,
              i = t - (n - r) + (e - r);
            if (i) return [i, n];
            return [n];
          })(t[0], e[0]);
        var i,
          o,
          s = new Array(n + r),
          a = 0,
          d = 0,
          u = 0,
          c = Math.abs,
          g = t[d],
          l = c(g),
          p = e[u],
          f = c(p);
        l < f
          ? ((o = g), (d += 1) < n && ((g = t[d]), (l = c(g))))
          : ((o = p), (u += 1) < r && ((p = e[u]), (f = c(p))));
        (d < n && l < f) || u >= r
          ? ((i = g), (d += 1) < n && ((g = t[d]), (l = c(g))))
          : ((i = p), (u += 1) < r && ((p = e[u]), (f = c(p))));
        var b,
          h,
          x = i + o,
          v = x - i,
          y = o - v,
          m = y,
          _ = x;
        for (; d < n && u < r; )
          l < f
            ? ((i = g), (d += 1) < n && ((g = t[d]), (l = c(g))))
            : ((i = p), (u += 1) < r && ((p = e[u]), (f = c(p)))),
            (y = (o = m) - (v = (x = i + o) - i)) && (s[a++] = y),
            (m = _ - ((b = _ + x) - (h = b - _)) + (x - h)),
            (_ = b);
        for (; d < n; )
          (y = (o = m) - (v = (x = (i = g) + o) - i)) && (s[a++] = y),
            (m = _ - ((b = _ + x) - (h = b - _)) + (x - h)),
            (_ = b),
            (d += 1) < n && (g = t[d]);
        for (; u < r; )
          (y = (o = m) - (v = (x = (i = p) + o) - i)) && (s[a++] = y),
            (m = _ - ((b = _ + x) - (h = b - _)) + (x - h)),
            (_ = b),
            (u += 1) < r && (p = e[u]);
        m && (s[a++] = m);
        _ && (s[a++] = _);
        a || (s[a++] = 0);
        return (s.length = a), s;
      };
    },
    function(t, e, n) {
      'use strict';
      var r = n(11),
        i = n(69),
        o = n(68),
        s = n(66),
        a = 5;
      function d(t, e) {
        for (var n = new Array(t.length - 1), r = 1; r < t.length; ++r)
          for (
            var i = (n[r - 1] = new Array(t.length - 1)), o = 0, s = 0;
            o < t.length;
            ++o
          )
            o !== e && (i[s++] = t[r][o]);
        return n;
      }
      function u(t) {
        if (1 === t.length) return t[0];
        if (2 === t.length) return ['sum(', t[0], ',', t[1], ')'].join('');
        var e = t.length >> 1;
        return ['sum(', u(t.slice(0, e)), ',', u(t.slice(e)), ')'].join('');
      }
      function c(t) {
        if (2 === t.length)
          return [
            [
              'sum(prod(',
              t[0][0],
              ',',
              t[1][1],
              '),prod(-',
              t[0][1],
              ',',
              t[1][0],
              '))',
            ].join(''),
          ];
        for (var e = [], n = 0; n < t.length; ++n)
          e.push(
            [
              'scale(',
              u(c(d(t, n))),
              ',',
              ((r = n), 1 & r ? '-' : ''),
              t[0][n],
              ')',
            ].join(''),
          );
        return e;
        var r;
      }
      function g(t) {
        for (
          var e = [],
            n = [],
            a = (function(t) {
              for (var e = new Array(t), n = 0; n < t; ++n) {
                e[n] = new Array(t);
                for (var r = 0; r < t; ++r)
                  e[n][r] = ['m', r, '[', t - n - 1, ']'].join('');
              }
              return e;
            })(t),
            g = [],
            l = 0;
          l < t;
          ++l
        )
          0 == (1 & l) ? e.push.apply(e, c(d(a, l))) : n.push.apply(n, c(d(a, l))),
            g.push('m' + l);
        var p = u(e),
          f = u(n),
          b = 'orientation' + t + 'Exact',
          h = [
            'function ',
            b,
            '(',
            g.join(),
            '){var p=',
            p,
            ',n=',
            f,
            ',d=sub(p,n);return d[d.length-1];};return ',
            b,
          ].join('');
        return new Function('sum', 'prod', 'scale', 'sub', h)(i, r, o, s);
      }
      var l = g(3),
        p = g(4),
        f = [
          function() {
            return 0;
          },
          function() {
            return 0;
          },
          function(t, e) {
            return e[0] - t[0];
          },
          function(t, e, n) {
            var r,
              i = (t[1] - n[1]) * (e[0] - n[0]),
              o = (t[0] - n[0]) * (e[1] - n[1]),
              s = i - o;
            if (i > 0) {
              if (o <= 0) return s;
              r = i + o;
            } else {
              if (!(i < 0)) return s;
              if (o >= 0) return s;
              r = -(i + o);
            }
            var a = 3.3306690738754716e-16 * r;
            return s >= a || s <= -a ? s : l(t, e, n);
          },
          function(t, e, n, r) {
            var i = t[0] - r[0],
              o = e[0] - r[0],
              s = n[0] - r[0],
              a = t[1] - r[1],
              d = e[1] - r[1],
              u = n[1] - r[1],
              c = t[2] - r[2],
              g = e[2] - r[2],
              l = n[2] - r[2],
              f = o * u,
              b = s * d,
              h = s * a,
              x = i * u,
              v = i * d,
              y = o * a,
              m = c * (f - b) + g * (h - x) + l * (v - y),
              _ =
                7.771561172376103e-16 *
                ((Math.abs(f) + Math.abs(b)) * Math.abs(c) +
                  (Math.abs(h) + Math.abs(x)) * Math.abs(g) +
                  (Math.abs(v) + Math.abs(y)) * Math.abs(l));
            return m > _ || -m > _ ? m : p(t, e, n, r);
          },
        ];
      !(function() {
        for (; f.length <= a; ) f.push(g(f.length));
        for (var e = [], n = ['slow'], r = 0; r <= a; ++r)
          e.push('a' + r), n.push('o' + r);
        var i = [
          'function getOrientation(',
          e.join(),
          '){switch(arguments.length){case 0:case 1:return 0;',
        ];
        for (r = 2; r <= a; ++r)
          i.push('case ', r, ':return o', r, '(', e.slice(0, r).join(), ');');
        i.push(
          '}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation',
        ),
          n.push(i.join(''));
        var o = Function.apply(void 0, n);
        for (
          t.exports = o.apply(
            void 0,
            [
              function(t) {
                var e = f[t.length];
                return e || (e = f[t.length] = g(t.length)), e.apply(void 0, t);
              },
            ].concat(f),
          ),
            r = 0;
          r <= a;
          ++r
        )
          t.exports[r] = f[r];
      })();
    },
    function(t, e, n) {
      'use strict';
      n(13);
      var r = s(n(58)),
        i = s(n(57)),
        o = s(n(56));
      function s(t) {
        return t && t.__esModule ? t : { default: t };
      }
      ymaps.modules.define('Gridmap', ['Polygonmap', 'util.bounds'], function(t, e, n) {
        function s(t, e) {
          var n = (0, o.default)(t, e);
          if (!n) throw new Error('options.' + e + ' is required parameter');
          return n;
        }
        t(
          (function() {
            function t(e, n) {
              !(function(t, e) {
                if (!(t instanceof e))
                  throw new TypeError('Cannot call a class as a function');
              })(this, t),
                (this._data = e),
                (this.options = n);
            }
            return (
              (t.prototype.setMap = function(t) {
                return (
                  this._map !== t && ((this._map = t), t && this._data && this._render()),
                  this
                );
              }),
              (t.prototype.getMap = function() {
                return this._map;
              }),
              (t.prototype._render = function() {
                var t = this._data,
                  a = s(this.options, 'zoom'),
                  d = this._map.options.get('projection'),
                  u = void 0,
                  c = void 0;
                if ((0, o.default)(this.options, 'grid.bounds'))
                  (u = s(this.options, 'grid.bounds.leftBottom')),
                    (c = s(this.options, 'grid.bounds.rightTop'));
                else {
                  var g = t.features.map(function(t) {
                      return t.geometry.coordinates;
                    }),
                    l = n.fromPoints(g, d);
                  (u = l[0]), (c = l[1]);
                }
                var p = d.toGlobalPixels(u, a),
                  f = p[0],
                  b = p[1],
                  h = d.toGlobalPixels(c, a),
                  x = h[0],
                  v = h[1],
                  y = x - f,
                  m = b - v,
                  _ = s(this.options, 'grid.type'),
                  j = void 0;
                switch (_) {
                  case 'hexagon':
                    var w = s(this.options, 'grid.params.bigRadius');
                    j = (0, r.default)(d, a, w, f, v, y, m);
                    break;
                  case 'square':
                    var M = s(this.options, 'grid.params.sideLength');
                    j = (0, i.default)(d, a, M, f, v, y, m);
                    break;
                  default:
                    throw new Error("Unsupported grid's type " + _);
                }
                new e({ polygons: j, points: t }, this.options).setMap(this._map);
              }),
              t
            );
          })(),
        );
      });
    },
  ]);
  /* eslint-enable */
}

// ************************************************************************************************************
// https://github.com/yandex/mapsapi-heatmap/blob/84946349b7b54bf20ea630e7077da09ee7c85dfb/build/heatmap.min.js
// ************************************************************************************************************

function defineHeatmap(ymaps) {
  /* eslint-disable */
  ymaps.modules.define(
    'Heatmap',
    [
      'option.Manager',
      'Monitor',
      'Layer',
      'heatmap.component.dataConverter',
      'heatmap.component.TileUrlsGenerator',
    ],
    function(a, b, c, d, e, f) {
      var g = function(a, c) {
        (this._unprocessedPoints = []), a && this.setData(a), (this.options = new b(c));
      };
      (g.prototype.getData = function() {
        return this._data || null;
      }),
        (g.prototype.setData = function(a) {
          this._data = a;
          var b = e.convert(a);
          return (
            this._tileUrlsGenerator
              ? (this._tileUrlsGenerator.setPoints(b), this._refresh())
              : (this._unprocessedPoints = b),
            this
          );
        }),
        (g.prototype.getMap = function() {
          return this._map;
        }),
        (g.prototype.setMap = function(a) {
          return (
            this._map != a &&
              (this._layer &&
                (this._map.layers.remove(this._layer), this._destroyLayer()),
              (this._map = a),
              a && (this._setupLayer(), this._map.layers.add(this._layer))),
            this
          );
        }),
        (g.prototype.destroy = function() {
          (this._data = null), this.setMap(null);
        }),
        (g.prototype._refresh = function() {
          return this._layer && this._layer.update(), this;
        }),
        (g.prototype._setupLayer = function() {
          this._setupTileUrlsGenerator();
          var a = this._tileUrlsGenerator.getTileUrl.bind(this._tileUrlsGenerator);
          return (
            (this._layer = new d(a, { tileTransparent: !0 })),
            this._setupOptionMonitor(),
            this._layer
          );
        }),
        (g.prototype._destroyLayer = function() {
          this._destroyTileUrlsGenerator(),
            this._destroyOptionMonitor(),
            (this._layer = null);
        }),
        (g.prototype._setupTileUrlsGenerator = function() {
          return (
            (this._tileUrlsGenerator = new f(
              this._map.options.get('projection'),
              this._unprocessedPoints,
            )),
            (this._unprocessedPoints = null),
            this._tileUrlsGenerator.options.setParent(this.options),
            this._tileUrlsGenerator
          );
        }),
        (g.prototype._destroyTileUrlsGenerator = function() {
          (this._unprocessedPoints = this._tileUrlsGenerator.getPoints()),
            this._tileUrlsGenerator.destroy(),
            (this._tileUrlsGenerator = null);
        }),
        (g.prototype._setupOptionMonitor = function() {
          return (
            (this._optionMonitor = new c(this.options)),
            this._optionMonitor.add(
              ['radius', 'dissipating', 'opacity', 'intensityOfMidpoint', 'gradient'],
              this._refresh,
              this,
            )
          );
        }),
        (g.prototype._destroyOptionMonitor = function() {
          this._optionMonitor.removeAll(), (this._optionMonitor = {});
        }),
        a(g);
    },
  ),
    ymaps.modules.define('heatmap.component.dataConverter', [], function(a) {
      var b = {};
      (b.convert = function(a) {
        var b = [];
        if (
          ('string' == typeof object && (a = JSON.parse(a)),
          this._isJsonFeatureCollection(a))
        )
          for (var c = 0, d = a.features.length; d > c; c++)
            b = b.concat(this.convert(a.features[c]));
        else if (this._isCoordinates(a)) b.push(this._convertCoordinatesToPoint(a));
        else
          for (var e, f = [].concat(a), c = 0, d = f.length; d > c; c++)
            if (((e = f[c]), this._isCoordinates(e)))
              b.push(this._convertCoordinatesToPoint(e));
            else if (this._isJsonGeometry(e) && 'Point' == e.type)
              b.push(this._convertCoordinatesToPoint(e.coordinates));
            else if (this._isJsonFeature(e) && 'Point' == e.geometry.type)
              b.push(this._convertJsonFeatureToPoint(e));
            else if (this._isGeoObject(e) && 'Point' == e.geometry.getType())
              b.push(this._convertGeoObjectToPoint(e));
            else if (this._isCollection(e))
              for (var g, h = e.getIterator(); (g = h.getNext()) != h.STOP_ITERATION; )
                b = b.concat(this.convert(g));
        return b;
      }),
        (b._isJsonFeature = function(a) {
          return 'Feature' == a.type;
        }),
        (b._convertJsonFeatureToPoint = function(a) {
          var b = 1;
          return (
            a.properties && a.properties.weight && (b = a.properties.weight),
            { coordinates: a.geometry.coordinates, weight: b }
          );
        }),
        (b._isJsonFeatureCollection = function(a) {
          return 'FeatureCollection' == a.type;
        }),
        (b._isCoordinates = function(a) {
          return (
            '[object Array]' == Object.prototype.toString.call(a) &&
            'number' == typeof a[0] &&
            'number' == typeof a[1]
          );
        }),
        (b._convertCoordinatesToPoint = function(a) {
          return { coordinates: a, weight: 1 };
        }),
        (b._isJsonGeometry = function(a) {
          return Boolean(a.type && a.coordinates);
        }),
        (b._isGeoObject = function(a) {
          return Boolean(a.geometry && a.getOverlay);
        }),
        (b._convertGeoObjectToPoint = function(a) {
          return {
            coordinates: a.geometry.getCoordinates(),
            weight: a.properties.get('weight') || 1,
          };
        }),
        (b._isCollection = function(a) {
          return Boolean(a.getIterator);
        }),
        a(b);
    }),
    ymaps.modules.define(
      'heatmap.component.TileUrlsGenerator',
      ['option.Manager', 'heatmap.component.Canvas'],
      function(a, b, c) {
        function d(a) {
          return Math.pow(a / 10, 1.1);
        }
        function e(a) {
          var b = a.sort(f),
            c = b.length / 2;
          return c !== Math.floor(c) ? b[Math.floor(c)] : (b[c - 1] + b[c]) / 2;
        }
        function f(a, b) {
          return a - b;
        }
        var g = [256, 256],
          h = function(a, d) {
            (this._projection = a),
              (this._canvas = new c(g)),
              (this.options = new b({})),
              this._canvas.options.setParent(this.options),
              this.setPoints(d || []);
          };
        (h.prototype.setPoints = function(a) {
          this._points = [];
          for (var b = [], c = 0, d = a.length; d > c; c++)
            this._points.push({
              coordinates: this._projection.toGlobalPixels(a[c].coordinates, 0),
              weight: a[c].weight,
            }),
              b.push(a[c].weight);
          return this._canvas.options.set('medianaOfWeights', e(b)), this;
        }),
          (h.prototype.getPoints = function() {
            for (var a = [], b = 0, c = this._points.length; c > b; b++)
              a.push({
                coordinates: this._projection.fromGlobalPixels(
                  this._points[b].coordinates,
                  0,
                ),
                weight: this._points[b].weight,
              });
            return a;
          }),
          (h.prototype.getTileUrl = function(a, b) {
            var c = this._canvas.options.get('radiusFactor');
            if (this.options.get('dissipating')) {
              var e = d(b);
              c != e && this._canvas.options.set('radiusFactor', e);
            } else c && this._canvas.options.unset('radiusFactor');
            for (
              var f,
                h = Math.pow(2, b),
                i = [
                  [(a[0] * g[0]) / h, (a[1] * g[1]) / h],
                  [((a[0] + 1) * g[0]) / h, ((a[1] + 1) * g[1]) / h],
                ],
                j = this._canvas.getBrushRadius() / h,
                k = [],
                l = 0,
                m = this._points.length;
              m > l;
              l++
            )
              (f = this._points[l].coordinates),
                this._contains(i, f, j) &&
                  k.push({
                    coordinates: [(f[0] - i[0][0]) * h, (f[1] - i[0][1]) * h],
                    weight: this._points[l].weight,
                  });
            return this._canvas.generateDataURLHeatmap(k);
          }),
          (h.prototype.destroy = function() {
            this._canvas.destroy(), (this._canvas = null), (this._projection = null);
          }),
          (h.prototype._contains = function(a, b, c) {
            return (
              b[0] >= a[0][0] - c &&
              b[0] <= a[1][0] + c &&
              b[1] >= a[0][1] - c &&
              b[1] <= a[1][1] + c
            );
          }),
          a(h);
      },
    ),
    ymaps.modules.define(
      'heatmap.component.Canvas',
      ['option.Manager', 'Monitor'],
      function(a, b, c) {
        var d = {
            radius: 10,
            radiusFactor: 1,
            opacity: 0.8,
            intensityOfMidpoint: 0.2,
            medianaOfWeights: 1,
            gradient: {
              0.1: 'rgba(128, 255, 0, 0.7)',
              0.2: 'rgba(255, 255, 0, 0.8)',
              0.7: 'rgba(234, 72, 58, 0.9)',
              1: 'rgba(162, 36, 25, 1)',
            },
          },
          e =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAABFUlEQVR4nO3BMQEAAADCoPVP7WsIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAMBPAABPO1TCQAAAABJRU5ErkJggg==',
          f = function(a) {
            (this._canvas = document.createElement('canvas')),
              (this._canvas.width = a[0]),
              (this._canvas.height = a[1]),
              (this._context = this._canvas.getContext('2d')),
              (this.options = new b({})),
              this._setupDrawTools(),
              this._setupOptionMonitor();
          };
        (f.prototype.getBrushRadius = function() {
          return (
            this.options.get('radius', d.radius) *
            this.options.get('radiusFactor', d.radiusFactor)
          );
        }),
          (f.prototype.generateDataURLHeatmap = function(a) {
            return a && a.length > 0
              ? (this._drawHeatmap(a), this._canvas.toDataURL())
              : e;
          }),
          (f.prototype.destroy = function() {
            this._destroyOptionMonitor(), this._destroyDrawTools();
          }),
          (f.prototype._setupOptionMonitor = function() {
            return (
              (this._optionMonitor = new c(this.options)),
              this._optionMonitor.add(
                ['radius', 'radiusFactor', 'gradient'],
                this._setupDrawTools,
                this,
              )
            );
          }),
          (f.prototype._destroyOptionMonitor = function() {
            this._optionMonitor.removeAll(), (this._optionMonitor = {});
          }),
          (f.prototype._setupDrawTools = function() {
            return (
              (this._brush = this._createBrush()),
              (this._gradient = this._createGradient()),
              this
            );
          }),
          (f.prototype._destroyDrawTools = function() {
            (this._brush = null), (this._gradient = null);
          }),
          (f.prototype._createBrush = function() {
            var a = document.createElement('canvas'),
              b = a.getContext('2d'),
              c = this.getBrushRadius(),
              d = b.createRadialGradient(c, c, 0, c, c, c);
            return (
              (a.width = 2 * c),
              (a.height = 2 * c),
              d.addColorStop(0, 'rgba(0,0,0,1)'),
              d.addColorStop(1, 'rgba(0,0,0,0)'),
              (b.fillStyle = d),
              b.fillRect(0, 0, 2 * c, 2 * c),
              a
            );
          }),
          (f.prototype._createGradient = function() {
            var a = document.createElement('canvas'),
              b = a.getContext('2d'),
              c = b.createLinearGradient(0, 0, 0, 256);
            (a.width = 1), (a.height = 256);
            var e = this.options.get('gradient', d.gradient);
            for (var f in e) e.hasOwnProperty(f) && c.addColorStop(f, e[f]);
            return (
              (b.fillStyle = c),
              b.fillRect(0, 0, 1, 256),
              b.getImageData(0, 0, 1, 256).data
            );
          }),
          (f.prototype._drawHeatmap = function(a) {
            var b = this._context,
              c = this.getBrushRadius(),
              e = this.options.get('intensityOfMidpoint', d.intensityOfMidpoint),
              f = this.options.get('medianaOfWeights', d.medianaOfWeights),
              g = e / f;
            b.clearRect(0, 0, this._canvas.width, this._canvas.height);
            for (var h = 0, i = a.length; i > h; h++)
              (b.globalAlpha = Math.min(a[h].weight * g, 1)),
                b.drawImage(
                  this._brush,
                  a[h].coordinates[0] - c,
                  a[h].coordinates[1] - c,
                );
            var j = b.getImageData(0, 0, this._canvas.width, this._canvas.height);
            return this._colorize(j.data), b.putImageData(j, 0, 0), this;
          }),
          (f.prototype._colorize = function(a) {
            for (
              var b, c = this.options.get('opacity', d.opacity), e = 3, f = a.length;
              f > e;
              e += 4
            )
              a[e] &&
                ((b = 4 * a[e]),
                (a[e - 3] = this._gradient[b]),
                (a[e - 2] = this._gradient[b + 1]),
                (a[e - 1] = this._gradient[b + 2]),
                (a[e] = c * (this._gradient[b + 3] || 255)));
          }),
          a(f);
      },
    );
  /* eslint-enable */
}

function defineModules(ymaps) {
  defineGridmapAndPolygonmap(ymaps);
  defineHeatmap(ymaps);
}

export default defineModules;
