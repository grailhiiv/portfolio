(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  33525,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "warnOnce", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    var n = function (e) {};
  },
  98544,
  (e, t, r) => {
    "use strict";
    var n = e.r(82554),
      a = e.r(33006),
      o = e.r(95565),
      i = e.r(85302);
    r._ = function (e) {
      return n._(e) || a._(e) || i._(e) || o._();
    };
  },
  98183,
  (e, t, r) => {
    "use strict";
    var n = e.r(91470);
    Object.defineProperty(r, "__esModule", { value: !0 });
    var a = {
      assign: function () {
        return l;
      },
      searchParamsToUrlQuery: function () {
        return i;
      },
      urlQueryToSearchParams: function () {
        return c;
      },
    };
    for (var o in a) Object.defineProperty(r, o, { enumerable: !0, get: a[o] });
    function i(e) {
      var t = {},
        r = !0,
        a = !1,
        o = void 0;
      try {
        for (
          var i, u = e.entries()[Symbol.iterator]();
          !(r = (i = u.next()).done);
          r = !0
        ) {
          var c = n._(i.value, 2),
            l = c[0],
            s = c[1],
            f = t[l];
          void 0 === f
            ? (t[l] = s)
            : Array.isArray(f)
              ? f.push(s)
              : (t[l] = [f, s]);
        }
      } catch (e) {
        ((a = !0), (o = e));
      } finally {
        try {
          r || null == u.return || u.return();
        } finally {
          if (a) throw o;
        }
      }
      return t;
    }
    function u(e) {
      return "string" == typeof e
        ? e
        : ("number" != typeof e || isNaN(e)) && "boolean" != typeof e
          ? ""
          : String(e);
    }
    function c(e) {
      var t = new URLSearchParams(),
        r = !0,
        a = !1,
        o = void 0;
      try {
        for (
          var i, c = Object.entries(e)[Symbol.iterator]();
          !(r = (i = c.next()).done);
          r = !0
        ) {
          var l = n._(i.value, 2),
            s = l[0],
            f = l[1];
          if (Array.isArray(f)) {
            var d = !0,
              v = !1,
              p = void 0;
            try {
              for (
                var h, y = f[Symbol.iterator]();
                !(d = (h = y.next()).done);
                d = !0
              ) {
                var m = h.value;
                t.append(s, u(m));
              }
            } catch (e) {
              ((v = !0), (p = e));
            } finally {
              try {
                d || null == y.return || y.return();
              } finally {
                if (v) throw p;
              }
            }
          } else t.set(s, u(f));
        }
      } catch (e) {
        ((a = !0), (o = e));
      } finally {
        try {
          r || null == c.return || c.return();
        } finally {
          if (a) throw o;
        }
      }
      return t;
    }
    function l(e) {
      for (
        var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), a = 1;
        a < t;
        a++
      )
        r[a - 1] = arguments[a];
      var o = !0,
        i = !1,
        u = void 0;
      try {
        for (
          var c, l = r[Symbol.iterator]();
          !(o = (c = l.next()).done);
          o = !0
        ) {
          var s = c.value,
            f = !0,
            d = !1,
            v = void 0;
          try {
            for (
              var p, h = s.keys()[Symbol.iterator]();
              !(f = (p = h.next()).done);
              f = !0
            ) {
              var y = p.value;
              e.delete(y);
            }
          } catch (e) {
            ((d = !0), (v = e));
          } finally {
            try {
              f || null == h.return || h.return();
            } finally {
              if (d) throw v;
            }
          }
          var m = !0,
            b = !1,
            g = void 0;
          try {
            for (
              var _, w = s.entries()[Symbol.iterator]();
              !(m = (_ = w.next()).done);
              m = !0
            ) {
              var E = n._(_.value, 2),
                S = E[0],
                P = E[1];
              e.append(S, P);
            }
          } catch (e) {
            ((b = !0), (g = e));
          } finally {
            try {
              m || null == w.return || w.return();
            } finally {
              if (b) throw g;
            }
          }
        }
      } catch (e) {
        ((i = !0), (u = e));
      } finally {
        try {
          o || null == l.return || l.return();
        } finally {
          if (i) throw u;
        }
      }
      return e;
    }
  },
  18967,
  (e, t, r) => {
    "use strict";
    var n = e.r(86172),
      a = e.r(7655),
      o = e.r(95075),
      i = e.r(87502),
      u = e.r(21991),
      c = e.r(2623),
      l = e.r(21280);
    Object.defineProperty(r, "__esModule", { value: !0 });
    var s = {
      DecodeError: function () {
        return S;
      },
      MiddlewareNotFoundError: function () {
        return x;
      },
      MissingStaticPage: function () {
        return O;
      },
      NormalizeError: function () {
        return P;
      },
      PageNotFoundError: function () {
        return j;
      },
      SP: function () {
        return w;
      },
      ST: function () {
        return E;
      },
      WEB_VITALS: function () {
        return d;
      },
      execOnce: function () {
        return v;
      },
      getDisplayName: function () {
        return b;
      },
      getLocationOrigin: function () {
        return y;
      },
      getURL: function () {
        return m;
      },
      isAbsoluteUrl: function () {
        return h;
      },
      isResSent: function () {
        return g;
      },
      loadGetInitialProps: function () {
        return function e(t, r) {
          return n._(function () {
            var n, a, o;
            return l._(this, function (i) {
              switch (i.label) {
                case 0:
                  if (((n = r.res || (r.ctx && r.ctx.res)), t.getInitialProps))
                    return [3, 3];
                  if (!(r.ctx && r.Component)) return [3, 2];
                  return ((a = {}), [4, e(r.Component, r.ctx)]);
                case 1:
                  return [2, ((a.pageProps = i.sent()), a)];
                case 2:
                  return [2, {}];
                case 3:
                  return [4, t.getInitialProps(r)];
                case 4:
                  if (((o = i.sent()), n && g(n))) return [2, o];
                  if (!o)
                    throw Object.defineProperty(
                      Error(
                        '"'
                          .concat(
                            b(t),
                            '.getInitialProps()" should resolve to an object. But found "',
                          )
                          .concat(o, '" instead.'),
                      ),
                      "__NEXT_ERROR_CODE",
                      { value: "E1025", enumerable: !1, configurable: !0 },
                    );
                  return [2, o];
              }
            });
          })();
        };
      },
      normalizeRepeatedSlashes: function () {
        return _;
      },
      stringifyError: function () {
        return A;
      },
    };
    for (var f in s) Object.defineProperty(r, f, { enumerable: !0, get: s[f] });
    var d = ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"];
    function v(e) {
      var t,
        r = !1;
      return function () {
        for (var n = arguments.length, a = Array(n), o = 0; o < n; o++)
          a[o] = arguments[o];
        return (r || ((r = !0), (t = e.apply(void 0, u._(a)))), t);
      };
    }
    var p = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/,
      h = function (e) {
        return p.test(e);
      };
    function y() {
      var e = window.location,
        t = e.protocol,
        r = e.hostname,
        n = e.port;
      return ""
        .concat(t, "//")
        .concat(r)
        .concat(n ? ":" + n : "");
    }
    function m() {
      var e = window.location.href,
        t = y();
      return e.substring(t.length);
    }
    function b(e) {
      return "string" == typeof e ? e : e.displayName || e.name || "Unknown";
    }
    function g(e) {
      return e.finished || e.headersSent;
    }
    function _(e) {
      var t = e.split("?");
      return (
        t[0].replace(/\\/g, "/").replace(/\/\/+/g, "/") +
        (t[1] ? "?".concat(t.slice(1).join("?")) : "")
      );
    }
    var w = "u" > typeof performance,
      E =
        w &&
        ["mark", "measure", "getEntriesByName"].every(function (e) {
          return "function" == typeof performance[e];
        }),
      S = (function (e) {
        function t() {
          return (o._(this, t), a._(this, t, arguments));
        }
        return (i._(t, e), t);
      })(c._(Error)),
      P = (function (e) {
        function t() {
          return (o._(this, t), a._(this, t, arguments));
        }
        return (i._(t, e), t);
      })(c._(Error)),
      j = (function (e) {
        function t(e) {
          var r;
          return (
            o._(this, t),
            ((r = a._(this, t)).code = "ENOENT"),
            (r.name = "PageNotFoundError"),
            (r.message = "Cannot find module for page: ".concat(e)),
            r
          );
        }
        return (i._(t, e), t);
      })(c._(Error)),
      O = (function (e) {
        function t(e, r) {
          var n;
          return (
            o._(this, t),
            ((n = a._(this, t)).message =
              "Failed to load static file for page: ".concat(e, " ").concat(r)),
            n
          );
        }
        return (i._(t, e), t);
      })(c._(Error)),
      x = (function (e) {
        function t() {
          var e;
          return (
            o._(this, t),
            ((e = a._(this, t)).code = "ENOENT"),
            (e.message = "Cannot find the middleware module"),
            e
          );
        }
        return (i._(t, e), t);
      })(c._(Error));
    function A(e) {
      return JSON.stringify({ message: e.message, stack: e.stack });
    }
  },
  49152,
  (e, t, r) => {
    "use strict";
    r._ = function (e, t) {
      if (null == e) return {};
      var r,
        n,
        a = {},
        o = Object.keys(e);
      for (n = 0; n < o.length; n++)
        ((r = o[n]), t.indexOf(r) >= 0 || (a[r] = e[r]));
      return a;
    };
  },
  95692,
  (e, t, r) => {
    "use strict";
    var n = e.r(49152);
    r._ = function (e, t) {
      if (null == e) return {};
      var r,
        a,
        o = n._(e, t);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        for (a = 0; a < i.length; a++)
          ((r = i[a]),
            !(t.indexOf(r) >= 0) &&
              Object.prototype.propertyIsEnumerable.call(e, r) &&
              (o[r] = e[r]));
      }
      return o;
    };
  },
  18581,
  (e, t, r) => {
    "use strict";
    var n = e.r(68996);
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "useMergedRef", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    var a = e.r(71645);
    function o(e, t) {
      var r = (0, a.useRef)(null),
        n = (0, a.useRef)(null);
      return (0, a.useCallback)(
        function (a) {
          if (null === a) {
            var o = r.current;
            o && ((r.current = null), o());
            var u = n.current;
            u && ((n.current = null), u());
          } else (e && (r.current = i(e, a)), t && (n.current = i(t, a)));
        },
        [e, t],
      );
    }
    function i(e, t) {
      if ("function" != typeof e)
        return (
          (e.current = t),
          function () {
            e.current = null;
          }
        );
      var r = e(t);
      return "function" == typeof r
        ? r
        : function () {
            return e(null);
          };
    }
    ("function" == typeof r.default ||
      ("object" === n._(r.default) && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  95057,
  (e, t, r) => {
    "use strict";
    var n = e.r(68996);
    Object.defineProperty(r, "__esModule", { value: !0 });
    var a = {
      formatUrl: function () {
        return c;
      },
      formatWithValidation: function () {
        return s;
      },
      urlObjectKeys: function () {
        return l;
      },
    };
    for (var o in a) Object.defineProperty(r, o, { enumerable: !0, get: a[o] });
    var i = e.r(90809)._(e.r(98183)),
      u = /https?|ftp|gopher|file/;
    function c(e) {
      var t = e.auth,
        r = e.hostname,
        a = e.protocol || "",
        o = e.pathname || "",
        c = e.hash || "",
        l = e.query || "",
        s = !1;
      ((t = t ? encodeURIComponent(t).replace(/%3A/i, ":") + "@" : ""),
        e.host
          ? (s = t + e.host)
          : r &&
            ((s = t + (~r.indexOf(":") ? "[".concat(r, "]") : r)),
            e.port && (s += ":" + e.port)),
        l &&
          (void 0 === l ? "undefined" : n._(l)) === "object" &&
          (l = String(i.urlQueryToSearchParams(l))));
      var f = e.search || (l && "?".concat(l)) || "";
      return (
        a && !a.endsWith(":") && (a += ":"),
        e.slashes || ((!a || u.test(a)) && !1 !== s)
          ? ((s = "//" + (s || "")), o && "/" !== o[0] && (o = "/" + o))
          : s || (s = ""),
        c && "#" !== c[0] && (c = "#" + c),
        f && "?" !== f[0] && (f = "?" + f),
        (o = o.replace(/[?#]/g, encodeURIComponent)),
        (f = f.replace("#", "%23")),
        "".concat(a).concat(s).concat(o).concat(f).concat(c)
      );
    }
    var l = [
      "auth",
      "hash",
      "host",
      "hostname",
      "href",
      "path",
      "pathname",
      "port",
      "protocol",
      "query",
      "search",
      "slashes",
    ];
    function s(e) {
      return c(e);
    }
  },
  73668,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "isLocalURL", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    var n = e.r(18967),
      a = e.r(52817);
    function o(e) {
      if (!(0, n.isAbsoluteUrl)(e)) return !0;
      try {
        var t = (0, n.getLocationOrigin)(),
          r = new URL(e, t);
        return r.origin === t && (0, a.hasBasePath)(r.pathname);
      } catch (e) {
        return !1;
      }
    }
  },
  84508,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "errorOnce", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    var n = function (e) {};
  },
  22016,
  (e, t, r) => {
    "use strict";
    var n = e.r(44086),
      a = e.r(4571),
      o = e.r(95692),
      i = e.r(91470),
      u = e.r(68996);
    Object.defineProperty(r, "__esModule", { value: !0 });
    var c = {
      default: function () {
        return E;
      },
      useLinkStatus: function () {
        return P;
      },
    };
    for (var l in c) Object.defineProperty(r, l, { enumerable: !0, get: c[l] });
    var s = e.r(90809),
      f = e.r(43476),
      d = s._(e.r(71645)),
      v = e.r(95057),
      p = e.r(8372),
      h = e.r(18581),
      y = e.r(18967),
      m = e.r(5550);
    e.r(33525);
    var b = e.r(88540),
      g = e.r(91949),
      _ = e.r(73668),
      w = e.r(9396);
    function E(t) {
      var r,
        c,
        l,
        s,
        E,
        P = i._((0, d.useOptimistic)(g.IDLE_LINK_STATUS), 2),
        j = P[0],
        O = P[1],
        x = (0, d.useRef)(null),
        A = t.href,
        C = t.as,
        I = t.children,
        T = t.prefetch,
        R = void 0 === T ? null : T,
        k = t.passHref,
        L = t.replace,
        M = (t.shallow, t.scroll),
        N = t.onClick,
        B = t.onMouseEnter,
        U = t.onTouchStart,
        q = t.legacyBehavior,
        F = void 0 !== q && q,
        D = t.onNavigate,
        H = t.transitionTypes,
        V = t.ref,
        W = t.unstable_dynamicOnHover,
        z = o._(t, [
          "href",
          "as",
          "children",
          "prefetch",
          "passHref",
          "replace",
          "shallow",
          "scroll",
          "onClick",
          "onMouseEnter",
          "onTouchStart",
          "legacyBehavior",
          "onNavigate",
          "transitionTypes",
          "ref",
          "unstable_dynamicOnHover",
        ]);
      ((l = I),
        F &&
          ("string" == typeof l || "number" == typeof l) &&
          (l = (0, f.jsx)("a", { children: l })));
      var J = d.default.useContext(p.AppRouterContext),
        K = !1 !== R,
        Y =
          !1 !== R
            ? null === (r = R) || "auto" === r
              ? w.FetchStrategy.PPR
              : w.FetchStrategy.Full
            : w.FetchStrategy.PPR,
        $ = "string" == typeof (c = C || A) ? c : (0, v.formatUrl)(c);
      if (F) {
        if ((null == l ? void 0 : l.$$typeof) === Symbol.for("react.lazy"))
          throw Object.defineProperty(
            Error(
              "`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag.",
            ),
            "__NEXT_ERROR_CODE",
            { value: "E863", enumerable: !1, configurable: !0 },
          );
        s = d.default.Children.only(l);
      }
      var X = F
          ? s && (void 0 === s ? "undefined" : u._(s)) === "object" && s.ref
          : V,
        G = d.default.useCallback(
          function (e) {
            return (
              null !== J &&
                (x.current = (0, g.mountLinkInstance)(e, $, J, Y, K, O)),
              function () {
                (x.current &&
                  ((0, g.unmountLinkForCurrentNavigation)(x.current),
                  (x.current = null)),
                  (0, g.unmountPrefetchableInstance)(e));
              }
            );
          },
          [K, $, J, Y, O],
        ),
        Q = {
          ref: (0, h.useMergedRef)(G, X),
          onClick: function (t) {
            (F || "function" != typeof N || N(t),
              F &&
                s.props &&
                "function" == typeof s.props.onClick &&
                s.props.onClick(t),
              !J ||
                t.defaultPrevented ||
                (function (t, r, n, a, o, i, u) {
                  if (
                    "u" > typeof window &&
                    !(
                      ("A" === t.currentTarget.nodeName.toUpperCase() &&
                        (((c = t.currentTarget.getAttribute("target")) &&
                          "_self" !== c) ||
                          t.metaKey ||
                          t.ctrlKey ||
                          t.shiftKey ||
                          t.altKey ||
                          (t.nativeEvent && 2 === t.nativeEvent.which))) ||
                      t.currentTarget.hasAttribute("download")
                    )
                  ) {
                    if (!(0, _.isLocalURL)(r)) {
                      a && (t.preventDefault(), location.replace(r));
                      return;
                    }
                    if ((t.preventDefault(), i)) {
                      var c,
                        l = !1;
                      if (
                        (i({
                          preventDefault: function () {
                            l = !0;
                          },
                        }),
                        l)
                      )
                        return;
                    }
                    var s = e.r(99781).dispatchNavigateAction;
                    d.default.startTransition(function () {
                      s(
                        r,
                        a ? "replace" : "push",
                        !1 === o
                          ? b.ScrollBehavior.NoScroll
                          : b.ScrollBehavior.Default,
                        n.current,
                        u,
                      );
                    });
                  }
                })(t, $, x, L, M, D, H));
          },
          onMouseEnter: function (e) {
            (F || "function" != typeof B || B(e),
              F &&
                s.props &&
                "function" == typeof s.props.onMouseEnter &&
                s.props.onMouseEnter(e),
              !J ||
                (K && (0, g.onNavigationIntent)(e.currentTarget, !0 === W)));
          },
          onTouchStart: function (e) {
            (F || "function" != typeof U || U(e),
              F &&
                s.props &&
                "function" == typeof s.props.onTouchStart &&
                s.props.onTouchStart(e),
              !J ||
                (K && (0, g.onNavigationIntent)(e.currentTarget, !0 === W)));
          },
        };
      return (
        (0, y.isAbsoluteUrl)($)
          ? (Q.href = $)
          : (F && !k && ("a" !== s.type || "href" in s.props)) ||
            (Q.href = (0, m.addBasePath)($)),
        (E = F
          ? d.default.cloneElement(s, Q)
          : (0, f.jsx)("a", a._(n._({}, z, Q), { children: l }))),
        (0, f.jsx)(S.Provider, { value: j, children: E })
      );
    }
    e.r(84508);
    var S = (0, d.createContext)(g.IDLE_LINK_STATUS),
      P = function () {
        return (0, d.useContext)(S);
      };
    ("function" == typeof r.default ||
      ("object" === u._(r.default) && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  67585,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "BailoutToCSR", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    var n = e.r(32061);
    function a(e) {
      var t = e.reason,
        r = e.children;
      if ("u" < typeof window)
        throw Object.defineProperty(
          new n.BailoutToCSRError(t),
          "__NEXT_ERROR_CODE",
          { value: "E394", enumerable: !1, configurable: !0 },
        );
      return r;
    }
  },
  9885,
  (e, t, r) => {
    "use strict";
    function n(e) {
      return e
        .split("/")
        .map(function (e) {
          return encodeURIComponent(e);
        })
        .join("/");
    }
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "encodeURIPath", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
  },
  52157,
  (e, t, r) => {
    "use strict";
    var n = e.r(21991);
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "PreloadChunks", {
        enumerable: !0,
        get: function () {
          return l;
        },
      }));
    var a = e.r(43476),
      o = e.r(74080),
      i = e.r(63599),
      u = e.r(9885),
      c = e.r(43369);
    function l(e) {
      var t = e.moduleIds;
      if ("u" > typeof window) return null;
      var r = i.workAsyncStorage.getStore();
      if (void 0 === r) return null;
      var l = [];
      if (r.reactLoadableManifest && t) {
        var s = r.reactLoadableManifest,
          f = !0,
          d = !1,
          v = void 0;
        try {
          for (
            var p, h = t[Symbol.iterator]();
            !(f = (p = h.next()).done);
            f = !0
          ) {
            var y = p.value;
            if (s[y]) {
              var m = s[y].files;
              l.push.apply(l, n._(m));
            }
          }
        } catch (e) {
          ((d = !0), (v = e));
        } finally {
          try {
            f || null == h.return || h.return();
          } finally {
            if (d) throw v;
          }
        }
      }
      if (0 === l.length) return null;
      var b = (0, c.getAssetTokenQuery)();
      return (0, a.jsx)(a.Fragment, {
        children: l.map(function (e) {
          var t = ""
            .concat(r.assetPrefix, "/_next/")
            .concat((0, u.encodeURIPath)(e))
            .concat(b);
          return e.endsWith(".css")
            ? (0, a.jsx)(
                "link",
                {
                  precedence: "dynamic",
                  href: t,
                  rel: "stylesheet",
                  as: "style",
                  nonce: r.nonce,
                },
                e,
              )
            : ((0, o.preload)(t, {
                as: "script",
                fetchPriority: "low",
                nonce: r.nonce,
              }),
              null);
        }),
      });
    }
  },
  69093,
  (e, t, r) => {
    "use strict";
    var n = e.r(44086),
      a = e.r(4571);
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return f;
        },
      }));
    var o = e.r(43476),
      i = e.r(71645),
      u = e.r(67585),
      c = e.r(52157);
    function l(e) {
      return { default: e && "default" in e ? e.default : e };
    }
    var s = {
        loader: function () {
          return Promise.resolve(
            l(function () {
              return null;
            }),
          );
        },
        loading: null,
        ssr: !0,
      },
      f = function (e) {
        var t = n._({}, s, e),
          r = (0, i.lazy)(function () {
            return t.loader().then(l);
          }),
          f = t.loading;
        function d(e) {
          var l = f
              ? (0, o.jsx)(f, { isLoading: !0, pastDelay: !0, error: null })
              : null,
            s = !t.ssr || !!t.loading,
            d = s ? i.Suspense : i.Fragment,
            v = t.ssr
              ? (0, o.jsxs)(o.Fragment, {
                  children: [
                    "u" < typeof window
                      ? (0, o.jsx)(c.PreloadChunks, { moduleIds: t.modules })
                      : null,
                    (0, o.jsx)(r, n._({}, e)),
                  ],
                })
              : (0, o.jsx)(u.BailoutToCSR, {
                  reason: "next/dynamic",
                  children: (0, o.jsx)(r, n._({}, e)),
                });
          return (0, o.jsx)(
            d,
            a._(n._({}, s ? { fallback: l } : {}), { children: v }),
          );
        }
        return ((d.displayName = "LoadableComponent"), d);
      };
  },
  70703,
  (e, t, r) => {
    "use strict";
    var n = e.r(44086),
      a = e.r(4571),
      o = e.r(68996);
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return u;
        },
      }));
    var i = e.r(55682)._(e.r(69093));
    function u(e, t) {
      var r,
        o = {};
      "function" == typeof e && (o.loader = e);
      var u = n._({}, o, t);
      return (0, i.default)(
        a._(n._({}, u), {
          modules: null == (r = u.loadableGenerated) ? void 0 : r.modules,
        }),
      );
    }
    ("function" == typeof r.default ||
      ("object" === o._(r.default) && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  8341,
  (e, t, r) => {
    "use strict";
    var n = e.r(68996);
    Object.defineProperty(r, "__esModule", { value: !0 });
    var a = {
      cancelIdleCallback: function () {
        return u;
      },
      requestIdleCallback: function () {
        return i;
      },
    };
    for (var o in a) Object.defineProperty(r, o, { enumerable: !0, get: a[o] });
    var i =
        ("u" > typeof self &&
          self.requestIdleCallback &&
          self.requestIdleCallback.bind(window)) ||
        function (e) {
          var t = Date.now();
          return self.setTimeout(function () {
            e({
              didTimeout: !1,
              timeRemaining: function () {
                return Math.max(0, 50 - (Date.now() - t));
              },
            });
          }, 1);
        },
      u =
        ("u" > typeof self &&
          self.cancelIdleCallback &&
          self.cancelIdleCallback.bind(window)) ||
        function (e) {
          return clearTimeout(e);
        };
    ("function" == typeof r.default ||
      ("object" === n._(r.default) && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  19083,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      ESCAPE_REGEX: function () {
        return i;
      },
      htmlEscapeAttributeString: function () {
        return s;
      },
      htmlEscapeJsonString: function () {
        return l;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    var o = {
        "&": "\\u0026",
        ">": "\\u003e",
        "<": "\\u003c",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029",
      },
      i = /[&><\u2028\u2029]/g,
      u = {
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;",
        "<": "&lt;",
        ">": "&gt;",
      },
      c = /[&"'<>]/g;
    function l(e) {
      return e.replace(i, function (e) {
        return o[e];
      });
    }
    function s(e) {
      return e.replace(c, function (e) {
        return u[e];
      });
    }
  },
  79520,
  (e, t, r) => {
    "use strict";
    var n = e.r(44086),
      a = e.r(4571),
      o = e.r(95692),
      i = e.r(21991),
      u = e.r(68996);
    Object.defineProperty(r, "__esModule", { value: !0 });
    var c = {
      default: function () {
        return O;
      },
      handleClientScriptLoad: function () {
        return S;
      },
      initScriptLoader: function () {
        return P;
      },
    };
    for (var l in c) Object.defineProperty(r, l, { enumerable: !0, get: c[l] });
    var s = e.r(55682),
      f = e.r(90809),
      d = e.r(43476),
      v = s._(e.r(74080)),
      p = f._(e.r(71645)),
      h = e.r(42732),
      y = e.r(22737),
      m = e.r(8341),
      b = e.r(19083),
      g = new Map(),
      _ = new Set(),
      w = function (e) {
        if (v.default.preinit)
          return void e.forEach(function (e) {
            v.default.preinit(e, { as: "style" });
          });
        if ("u" > typeof window) {
          var t = document.head;
          e.forEach(function (e) {
            var r = document.createElement("link");
            ((r.type = "text/css"),
              (r.rel = "stylesheet"),
              (r.href = e),
              t.appendChild(r));
          });
        }
      },
      E = function (e) {
        var t = e.src,
          r = e.id,
          n = e.onLoad,
          a = void 0 === n ? function () {} : n,
          o = e.onReady,
          i = void 0 === o ? null : o,
          u = e.dangerouslySetInnerHTML,
          c = e.children,
          l = void 0 === c ? "" : c,
          s = e.strategy,
          f = void 0 === s ? "afterInteractive" : s,
          d = e.onError,
          v = e.stylesheets,
          p = r || t;
        if (!(p && _.has(p))) {
          if (g.has(t)) {
            (_.add(p), g.get(t).then(a, d));
            return;
          }
          var h = function () {
              (i && i(), _.add(p));
            },
            m = document.createElement("script"),
            b = new Promise(function (e, t) {
              (m.addEventListener("load", function (t) {
                (e(), a && a.call(this, t), h());
              }),
                m.addEventListener("error", function (e) {
                  t(e);
                }));
            }).catch(function (e) {
              d && d(e);
            });
          (u
            ? ((m.innerHTML = u.__html || ""), h())
            : l
              ? ((m.textContent =
                  "string" == typeof l
                    ? l
                    : Array.isArray(l)
                      ? l.join("")
                      : ""),
                h())
              : t && ((m.src = t), g.set(t, b)),
            (0, y.setAttributesFromProps)(m, e),
            "worker" === f && m.setAttribute("type", "text/partytown"),
            m.setAttribute("data-nscript", f),
            v && w(v),
            document.body.appendChild(m));
        }
      };
    function S(e) {
      var t = e.strategy;
      "lazyOnload" === (void 0 === t ? "afterInteractive" : t)
        ? window.addEventListener("load", function () {
            (0, m.requestIdleCallback)(function () {
              return E(e);
            });
          })
        : E(e);
    }
    function P(e) {
      (e.forEach(S),
        i
          ._(document.querySelectorAll('[data-nscript="beforeInteractive"]'))
          .concat(
            i._(document.querySelectorAll('[data-nscript="beforePageRender"]')),
          )
          .forEach(function (e) {
            var t = e.id || e.getAttribute("src");
            _.add(t);
          }));
    }
    function j(e) {
      var t = e.id,
        r = e.src,
        i = void 0 === r ? "" : r,
        u = e.onLoad,
        c = e.onReady,
        l = void 0 === c ? null : c,
        s = e.strategy,
        f = void 0 === s ? "afterInteractive" : s,
        y = e.onError,
        g = e.stylesheets,
        w = o._(e, [
          "id",
          "src",
          "onLoad",
          "onReady",
          "strategy",
          "onError",
          "stylesheets",
        ]),
        S = (0, p.useContext)(h.HeadManagerContext),
        P = S.updateScripts,
        j = S.scripts,
        O = S.getIsSsr,
        x = S.appDir,
        A = S.nonce;
      A = w.nonce || A;
      var C = (0, p.useRef)(!1);
      (0, p.useEffect)(
        function () {
          var e = t || i;
          C.current || (l && e && _.has(e) && l(), (C.current = !0));
        },
        [l, t, i],
      );
      var I = (0, p.useRef)(!1);
      if (
        ((0, p.useEffect)(
          function () {
            if (!I.current) {
              if ("afterInteractive" === f) E(e);
              else
                "lazyOnload" === f &&
                  ("complete" === document.readyState
                    ? (0, m.requestIdleCallback)(function () {
                        return E(e);
                      })
                    : window.addEventListener("load", function () {
                        (0, m.requestIdleCallback)(function () {
                          return E(e);
                        });
                      }));
              I.current = !0;
            }
          },
          [e, f],
        ),
        ("beforeInteractive" === f || "worker" === f) &&
          (P
            ? ((j[f] = (j[f] || []).concat([
                a._(
                  n._(
                    {
                      id: t,
                      src: i,
                      onLoad: void 0 === u ? function () {} : u,
                      onReady: l,
                      onError: y,
                    },
                    w,
                  ),
                  { nonce: A },
                ),
              ])),
              P(j))
            : O && O()
              ? _.add(t || i)
              : O && !O() && E(a._(n._({}, e), { nonce: A }))),
        x)
      ) {
        if (
          (g &&
            g.forEach(function (e) {
              v.default.preinit(e, { as: "style" });
            }),
          "beforeInteractive" === f)
        )
          if (!i)
            return (
              w.dangerouslySetInnerHTML &&
                ((w.children = w.dangerouslySetInnerHTML.__html),
                delete w.dangerouslySetInnerHTML),
              (0, d.jsx)("script", {
                nonce: A,
                dangerouslySetInnerHTML: {
                  __html: "(self.__next_s=self.__next_s||[]).push(".concat(
                    (0, b.htmlEscapeJsonString)(
                      JSON.stringify([0, a._(n._({}, w), { id: t })]),
                    ),
                    ")",
                  ),
                },
              })
            );
          else
            return (
              v.default.preload(
                i,
                w.integrity
                  ? {
                      as: "script",
                      integrity: w.integrity,
                      nonce: A,
                      crossOrigin: w.crossOrigin,
                    }
                  : { as: "script", nonce: A, crossOrigin: w.crossOrigin },
              ),
              (0, d.jsx)("script", {
                nonce: A,
                dangerouslySetInnerHTML: {
                  __html: "(self.__next_s=self.__next_s||[]).push(".concat(
                    (0, b.htmlEscapeJsonString)(
                      JSON.stringify([i, a._(n._({}, w), { id: t })]),
                    ),
                    ")",
                  ),
                },
              })
            );
        "afterInteractive" === f &&
          i &&
          v.default.preload(
            i,
            w.integrity
              ? {
                  as: "script",
                  integrity: w.integrity,
                  nonce: A,
                  crossOrigin: w.crossOrigin,
                }
              : { as: "script", nonce: A, crossOrigin: w.crossOrigin },
          );
      }
      return null;
    }
    Object.defineProperty(j, "__nextScript", { value: !0 });
    var O = j;
    ("function" == typeof r.default ||
      ("object" === u._(r.default) && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  18566,
  (e, t, r) => {
    t.exports = e.r(76562);
  },
  84834,
  (e) => {
    "use strict";
    var t = e.i(51682),
      r = e.i(43476),
      n = e.i(22016),
      a = e.i(18566),
      o = e.i(71645),
      i = e.i(46932),
      u = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/work", label: "Work" },
        { href: "#contact", label: "Contact" },
      ];
    e.s([
      "default",
      0,
      function () {
        var e = (0, a.usePathname)(),
          c = (0, t._)((0, o.useState)(""), 2),
          l = c[0],
          s = c[1],
          f = (0, t._)((0, o.useState)(""), 2),
          d = f[0],
          v = f[1],
          p = (0, t._)((0, o.useState)(!1), 2),
          h = p[0],
          y = p[1],
          m = (0, o.useRef)(0);
        ((0, o.useEffect)(function () {
          var e = function () {
            var e = new Date();
            (s(
              e.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Rome",
              }),
            ),
              v(
                e.toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "short",
                  timeZone: "Europe/Rome",
                }),
              ));
          };
          e();
          var t = setInterval(e, 3e4);
          return function () {
            return clearInterval(t);
          };
        }, []),
          (0, o.useEffect)(function () {
            var e = function () {
              var e = window.scrollY;
              (e < 80 ? y(!1) : e < m.current ? y(!0) : e > m.current && y(!1),
                (m.current = e));
            };
            return (
              window.addEventListener("scroll", e, { passive: !0 }),
              function () {
                return window.removeEventListener("scroll", e);
              }
            );
          }, []));
        var b = function (e, t) {
            if (t.startsWith("#")) {
              var r = document.querySelector(t);
              if (r) {
                e.preventDefault();
                var n = r.getBoundingClientRect().top + window.scrollY;
                if (
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches
                )
                  return void window.scrollTo(0, n);
                var a = window.scrollY,
                  o = n - a,
                  i = null,
                  u = function (e) {
                    null === i && (i = e);
                    var t = Math.min((e - i) / 900, 1);
                    (window.scrollTo(0, a + o * (1 - Math.pow(1 - t, 3))),
                      t < 1 && requestAnimationFrame(u));
                  };
                requestAnimationFrame(u);
              }
            }
          },
          g = (0, r.jsx)("nav", {
            "aria-label": "Main navigation",
            className: "flex gap-4 md:gap-5 shrink-0",
            children: u.map(function (t) {
              var a = t.href,
                o = t.label;
              return (0, r.jsx)(
                n.default,
                {
                  href: a,
                  onClick: function (e) {
                    return b(e, a);
                  },
                  className: "transition-colors text-sm md:text-md ".concat(
                    e === a
                      ? "text-[#111111]"
                      : "text-gray-400 hover:text-[#111111]",
                  ),
                  children: o,
                },
                a,
              );
            }),
          });
        return (0, r.jsxs)(r.Fragment, {
          children: [
            (0, r.jsx)("header", {
              className: "px-4 py-4 border-b border-gray-100",
              children: (0, r.jsxs)("div", {
                className:
                  "max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start md:items-end justify-between gap-4",
                children: [
                  (0, r.jsxs)("div", {
                    className: "flex flex-col",
                    children: [
                      (0, r.jsx)("p", {
                        className: "text-md font-medium leading-none",
                        children: "Design by Art.",
                      }),
                      (0, r.jsxs)("p", {
                        className: "block text-sm text-gray-400 mt-1",
                        children: [d, " — ", l, " Catania, IT"],
                      }),
                    ],
                  }),
                  (0, r.jsx)("div", {
                    className: "md:justify-end flex",
                    children: g,
                  }),
                ],
              }),
            }),
            (0, r.jsx)(i.motion.header, {
              initial: { y: "-100%" },
              animate: { y: h ? 0 : "-100%" },
              transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
              className:
                "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-4",
              children: (0, r.jsxs)("div", {
                className:
                  "max-w-5xl mx-auto flex-col md:flex-row flex md:items-center gap-2 justify-between",
                children: [
                  (0, r.jsx)("p", {
                    className: "text-md font-medium",
                    children: "Design by Art.",
                  }),
                  g,
                ],
              }),
            }),
          ],
        });
      },
    ]);
  },
  69355,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = (0, e.i(70703).default)(
        function () {
          return e.A(93196);
        },
        { loadableGenerated: { modules: [72363] }, ssr: !1 },
      );
    e.s([
      "default",
      0,
      function () {
        return (0, t.jsx)(r, {});
      },
    ]);
  },
  57215,
  (e) => {
    "use strict";
    var t = e.i(47167),
      r = e.i(20786),
      n = e.i(92808),
      a = e.i(51682),
      o = e.i(71645),
      i = e.i(18566),
      u = function () {
        window.si ||
          (window.si = function () {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++)
              t[r] = arguments[r];
            ((window.siq = window.siq || []), window.siq.push(t));
          });
      };
    function c() {
      return (
        "development" ===
        (function () {
          return "production";
        })()
      );
    }
    function l(e) {
      return new RegExp(
        "/".concat(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "(?=[/?#]|$)"),
      );
    }
    function s(e) {
      return e.startsWith("http://") ||
        e.startsWith("https://") ||
        e.startsWith("/")
        ? e
        : "/".concat(e);
    }
    function f(e) {
      (0, o.useEffect)(
        function () {
          var t;
          e.beforeSend &&
            (null == (t = window.si) ||
              t.call(window, "beforeSend", e.beforeSend));
        },
        [e.beforeSend],
      );
      var n = (0, o.useRef)(null);
      return (
        (0, o.useEffect)(
          function () {
            if (!n.current) {
              var o,
                i,
                l,
                f = (function () {
                  var e =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                    t = arguments.length > 1 ? arguments[1] : void 0;
                  if (!("u" > typeof window) || null === e.route) return null;
                  u();
                  var n = (function (e, t) {
                      var n,
                        a,
                        o = e;
                      if (t)
                        try {
                          o = (0, r._)(
                            {},
                            null == (a = JSON.parse(t))
                              ? void 0
                              : a.speedInsights,
                            e,
                          );
                        } catch (e) {}
                      var i = {
                        sdkn:
                          "@vercel/speed-insights" +
                          (o.framework ? "/".concat(o.framework) : ""),
                        sdkv: "2.0.0",
                      };
                      return (
                        o.sampleRate &&
                          (i.sampleRate = o.sampleRate.toString()),
                        o.route && (i.route = o.route),
                        c() && !1 === o.debug && (i.debug = "false"),
                        o.dsn && (i.dsn = o.dsn),
                        o.endpoint
                          ? (i.endpoint = s(o.endpoint))
                          : o.basePath &&
                            (i.endpoint = s(
                              "".concat(o.basePath, "/speed-insights/vitals"),
                            )),
                        {
                          src: (n = o).scriptSrc
                            ? s(n.scriptSrc)
                            : c()
                              ? "https://va.vercel-scripts.com/v1/speed-insights/script.debug.js"
                              : n.dsn
                                ? "https://va.vercel-scripts.com/v1/speed-insights/script.js"
                                : n.basePath
                                  ? s(
                                      "".concat(
                                        n.basePath,
                                        "/speed-insights/script.js",
                                      ),
                                    )
                                  : "/_vercel/speed-insights/script.js",
                          beforeSend: o.beforeSend,
                          dataset: i,
                        }
                      );
                    })(e, t),
                    o = n.beforeSend,
                    i = n.src,
                    l = n.dataset;
                  if (
                    document.head.querySelector('script[src*="'.concat(i, '"]'))
                  )
                    return null;
                  o &&
                    (null == (h = window.si) ||
                      h.call(window, "beforeSend", o));
                  var f = document.createElement("script");
                  ((f.src = i), (f.defer = !0));
                  var d = !0,
                    v = !1,
                    p = void 0;
                  try {
                    for (
                      var h, y, m = Object.entries(l)[Symbol.iterator]();
                      !(d = (y = m.next()).done);
                      d = !0
                    ) {
                      var b = (0, a._)(y.value, 2),
                        g = b[0],
                        _ = b[1];
                      f.dataset[g] = _;
                    }
                  } catch (e) {
                    ((v = !0), (p = e));
                  } finally {
                    try {
                      d || null == m.return || m.return();
                    } finally {
                      if (v) throw p;
                    }
                  }
                  return (
                    (f.onerror = function () {
                      console.log(
                        "[Vercel Speed Insights] Failed to load script from ".concat(
                          i,
                          ". Please check if any content blockers are enabled and try again.",
                        ),
                      );
                    }),
                    document.head.appendChild(f),
                    {
                      setRoute: function (e) {
                        f.dataset.route = null != e ? e : void 0;
                      },
                    }
                  );
                })(
                  (0, r._)(
                    {
                      framework: null != (o = e.framework) ? o : "react",
                      basePath:
                        null != (i = e.basePath)
                          ? i
                          : (function () {
                              if (
                                void 0 !== t.default &&
                                void 0 !== t.default.env
                              )
                                return t.default.env
                                  .REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
                            })(),
                    },
                    e,
                  ),
                  null != (l = e.configString)
                    ? l
                    : (function () {
                        if (void 0 !== t.default && void 0 !== t.default.env)
                          return t.default.env
                            .REACT_APP_VERCEL_OBSERVABILITY_CLIENT_CONFIG;
                      })(),
                );
              f && (n.current = f.setRoute);
            }
          },
          [e],
        ),
        (0, o.useEffect)(
          function () {
            n.current && e.route && n.current(e.route);
          },
          [e.route],
        ),
        null
      );
    }
    var d = function () {
      var e = (0, i.useParams)(),
        t = (0, i.useSearchParams)() || new URLSearchParams(),
        r = (0, i.usePathname)();
      return e
        ? (function (e, t) {
            if (!e || !t) return e;
            var r = e;
            try {
              var n = Object.entries(t),
                o = !0,
                i = !1,
                u = void 0;
              try {
                for (
                  var c, s = n[Symbol.iterator]();
                  !(o = (c = s.next()).done);
                  o = !0
                ) {
                  var f = (0, a._)(c.value, 2),
                    d = f[0],
                    v = f[1];
                  if (!Array.isArray(v)) {
                    var p = l(v);
                    p.test(r) && (r = r.replace(p, "/[".concat(d, "]")));
                  }
                }
              } catch (e) {
                ((i = !0), (u = e));
              } finally {
                try {
                  o || null == s.return || s.return();
                } finally {
                  if (i) throw u;
                }
              }
              var h = !0,
                y = !1,
                m = void 0;
              try {
                for (
                  var b, g = n[Symbol.iterator]();
                  !(h = (b = g.next()).done);
                  h = !0
                ) {
                  var _ = (0, a._)(b.value, 2),
                    w = _[0],
                    E = _[1];
                  if (Array.isArray(E)) {
                    var S = l(E.join("/"));
                    S.test(r) && (r = r.replace(S, "/[...".concat(w, "]")));
                  }
                }
              } catch (e) {
                ((y = !0), (m = e));
              } finally {
                try {
                  h || null == g.return || g.return();
                } finally {
                  if (y) throw m;
                }
              }
              return r;
            } catch (t) {
              return e;
            }
          })(r, Object.keys(e).length ? e : Object.fromEntries(t.entries()))
        : null;
    };
    function v(e) {
      var a = d();
      return o.default.createElement(
        f,
        (0, n._)((0, r._)({ route: a }, e), {
          framework: "next",
          basePath: (function () {
            if (void 0 !== t.default && void 0 !== t.default.env)
              return t.default.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH;
          })(),
          configString: (function () {
            if (void 0 !== t.default && void 0 !== t.default.env)
              return '{"analytics":{"scriptSrc":"ab284ee2896196d4/script.js","viewEndpoint":"ab284ee2896196d4/view","eventEndpoint":"ab284ee2896196d4/event","sessionEndpoint":"ab284ee2896196d4/session"},"speedInsights":{"scriptSrc":"127040c23a89d30f/script.js","endpoint":"127040c23a89d30f/vitals"}}';
          })(),
        }),
      );
    }
    e.s([
      "SpeedInsights",
      0,
      function (e) {
        return o.default.createElement(
          o.Suspense,
          { fallback: null },
          o.default.createElement(v, (0, r._)({}, e)),
        );
      },
    ]);
  },
  2355,
  (e) => {
    "use strict";
    var t = e.i(47167),
      r = e.i(20786),
      n = e.i(92808),
      a = e.i(51682),
      o = e.i(71645),
      i = e.i(18566),
      u = function () {
        window.va ||
          (window.va = function () {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++)
              t[r] = arguments[r];
            (window.vaq || (window.vaq = []), window.vaq.push(t));
          });
      };
    function c() {
      return "u" > typeof window;
    }
    function l() {
      return "production";
    }
    function s() {
      return "development" === ((c() ? window.vam : l()) || "production");
    }
    function f(e) {
      return new RegExp(
        "/".concat(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "(?=[/?#]|$)"),
      );
    }
    function d(e) {
      return e.startsWith("http://") ||
        e.startsWith("https://") ||
        e.startsWith("/")
        ? e
        : "/".concat(e);
    }
    function v(e) {
      return (
        (0, o.useEffect)(
          function () {
            var t;
            e.beforeSend &&
              (null == (t = window.va) ||
                t.call(window, "beforeSend", e.beforeSend));
          },
          [e.beforeSend],
        ),
        (0, o.useEffect)(function () {
          var n, o;
          !(function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : { debug: !0 },
              t = arguments.length > 1 ? arguments[1] : void 0;
            if (c()) {
              var n = (function (e, t) {
                  var n,
                    a,
                    o = e;
                  if (t)
                    try {
                      o = (0, r._)(
                        {},
                        null == (a = JSON.parse(t)) ? void 0 : a.analytics,
                        e,
                      );
                    } catch (e) {}
                  !(function () {
                    var e =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : "auto";
                    if ("auto" === e) {
                      window.vam = l();
                      return;
                    }
                    window.vam = e;
                  })(o.mode);
                  var i = {
                    sdkn:
                      "@vercel/analytics" +
                      (o.framework ? "/".concat(o.framework) : ""),
                    sdkv: "2.0.1",
                  };
                  return (
                    o.disableAutoTrack && (i.disableAutoTrack = "1"),
                    o.viewEndpoint && (i.viewEndpoint = d(o.viewEndpoint)),
                    o.eventEndpoint && (i.eventEndpoint = d(o.eventEndpoint)),
                    o.sessionEndpoint &&
                      (i.sessionEndpoint = d(o.sessionEndpoint)),
                    s() && !1 === o.debug && (i.debug = "false"),
                    o.dsn && (i.dsn = o.dsn),
                    o.endpoint
                      ? (i.endpoint = o.endpoint)
                      : o.basePath &&
                        (i.endpoint = d("".concat(o.basePath, "/insights"))),
                    {
                      beforeSend: o.beforeSend,
                      src: (n = o).scriptSrc
                        ? d(n.scriptSrc)
                        : s()
                          ? "https://va.vercel-scripts.com/v1/script.debug.js"
                          : n.basePath
                            ? d("".concat(n.basePath, "/insights/script.js"))
                            : "/_vercel/insights/script.js",
                      dataset: i,
                    }
                  );
                })(e, t),
                o = n.beforeSend,
                i = n.src,
                f = n.dataset;
              if (
                (u(),
                o &&
                  (null == (m = window.va) || m.call(window, "beforeSend", o)),
                !document.head.querySelector('script[src*="'.concat(i, '"]')))
              ) {
                var v = document.createElement("script");
                v.src = i;
                var p = !0,
                  h = !1,
                  y = void 0;
                try {
                  for (
                    var m, b, g = Object.entries(f)[Symbol.iterator]();
                    !(p = (b = g.next()).done);
                    p = !0
                  ) {
                    var _ = (0, a._)(b.value, 2),
                      w = _[0],
                      E = _[1];
                    v.dataset[w] = E;
                  }
                } catch (e) {
                  ((h = !0), (y = e));
                } finally {
                  try {
                    p || null == g.return || g.return();
                  } finally {
                    if (h) throw y;
                  }
                }
                ((v.defer = !0),
                  (v.onerror = function () {
                    var e = s()
                      ? "Please check if any ad blockers are enabled and try again."
                      : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
                    console.log(
                      "[Vercel Web Analytics] Failed to load script from "
                        .concat(i, ". ")
                        .concat(e),
                    );
                  }),
                  document.head.appendChild(v));
              }
            }
          })(
            (0, r._)(
              {
                framework: e.framework || "react",
                basePath:
                  null != (n = e.basePath)
                    ? n
                    : (function () {
                        if (void 0 !== t.default && void 0 !== t.default.env)
                          return t.default.env
                            .REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
                      })(),
              },
              void 0 !== e.route && { disableAutoTrack: !0 },
              e,
            ),
            null != (o = e.configString)
              ? o
              : (function () {
                  if (void 0 !== t.default && void 0 !== t.default.env)
                    return t.default.env
                      .REACT_APP_VERCEL_OBSERVABILITY_CLIENT_CONFIG;
                })(),
          );
        }, []),
        (0, o.useEffect)(
          function () {
            var t, r, n, a;
            e.route &&
              e.path &&
              ((n = (t = { route: e.route, path: e.path }).route),
              (a = t.path),
              null == (r = window.va) ||
                r.call(window, "pageview", { route: n, path: a }));
          },
          [e.route, e.path],
        ),
        null
      );
    }
    var p = function () {
      var e = (0, i.useParams)(),
        t = (0, i.useSearchParams)(),
        r = (0, i.usePathname)();
      return e
        ? {
            route: (function (e, t) {
              if (!e || !t) return e;
              var r = e;
              try {
                var n = Object.entries(t),
                  o = !0,
                  i = !1,
                  u = void 0;
                try {
                  for (
                    var c, l = n[Symbol.iterator]();
                    !(o = (c = l.next()).done);
                    o = !0
                  ) {
                    var s = (0, a._)(c.value, 2),
                      d = s[0],
                      v = s[1];
                    if (!Array.isArray(v)) {
                      var p = f(v);
                      p.test(r) && (r = r.replace(p, "/[".concat(d, "]")));
                    }
                  }
                } catch (e) {
                  ((i = !0), (u = e));
                } finally {
                  try {
                    o || null == l.return || l.return();
                  } finally {
                    if (i) throw u;
                  }
                }
                var h = !0,
                  y = !1,
                  m = void 0;
                try {
                  for (
                    var b, g = n[Symbol.iterator]();
                    !(h = (b = g.next()).done);
                    h = !0
                  ) {
                    var _ = (0, a._)(b.value, 2),
                      w = _[0],
                      E = _[1];
                    if (Array.isArray(E)) {
                      var S = f(E.join("/"));
                      S.test(r) && (r = r.replace(S, "/[...".concat(w, "]")));
                    }
                  }
                } catch (e) {
                  ((y = !0), (m = e));
                } finally {
                  try {
                    h || null == g.return || g.return();
                  } finally {
                    if (y) throw m;
                  }
                }
                return r;
              } catch (t) {
                return e;
              }
            })(r, Object.keys(e).length ? e : Object.fromEntries(t.entries())),
            path: r,
          }
        : { route: null, path: r };
    };
    function h(e) {
      var a = p(),
        i = a.route,
        u = a.path;
      return o.default.createElement(
        v,
        (0, n._)((0, r._)({ path: u, route: i }, e), {
          basePath: (function () {
            if (void 0 !== t.default && void 0 !== t.default.env)
              return t.default.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH;
          })(),
          configString: (function () {
            if (void 0 !== t.default && void 0 !== t.default.env)
              return '{"analytics":{"scriptSrc":"ab284ee2896196d4/script.js","viewEndpoint":"ab284ee2896196d4/view","eventEndpoint":"ab284ee2896196d4/event","sessionEndpoint":"ab284ee2896196d4/session"},"speedInsights":{"scriptSrc":"127040c23a89d30f/script.js","endpoint":"127040c23a89d30f/vitals"}}';
          })(),
          framework: "next",
        }),
      );
    }
    e.s([
      "Analytics",
      0,
      function (e) {
        return o.default.createElement(
          o.Suspense,
          { fallback: null },
          o.default.createElement(h, (0, r._)({}, e)),
        );
      },
    ]);
  },
  93196,
  (e) => {
    e.v((t) =>
      Promise.all(["static/chunks/12w~so1ly9wxf.js"].map((t) => e.l(t))).then(
        () => t(72363),
      ),
    );
  },
]);
