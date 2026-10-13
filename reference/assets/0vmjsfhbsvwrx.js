(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  98879,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "default", {
        enumerable: !0,
        get: function () {
          return s;
        },
      }));
    var r = e.r(71645),
      i = "u" < typeof window,
      o = i ? function () {} : r.useLayoutEffect,
      a = i ? function () {} : r.useEffect;
    function s(e) {
      var t,
        n = e.headManager,
        s = e.reduceComponentsToState;
      function l() {
        if (n && n.mountedInstances) {
          var e = r.Children.toArray(
            Array.from(n.mountedInstances).filter(Boolean),
          );
          n.updateHead(s(e));
        }
      }
      return (
        i &&
          (null == n || null == (t = n.mountedInstances) || t.add(e.children),
          l()),
        o(function () {
          var t;
          return (
            null == n || null == (t = n.mountedInstances) || t.add(e.children),
            function () {
              var t;
              null == n ||
                null == (t = n.mountedInstances) ||
                t.delete(e.children);
            }
          );
        }),
        o(function () {
          return (
            n && (n._pendingUpdate = l),
            function () {
              n && (n._pendingUpdate = l);
            }
          );
        }),
        a(function () {
          return (
            n &&
              n._pendingUpdate &&
              (n._pendingUpdate(), (n._pendingUpdate = null)),
            function () {
              n &&
                n._pendingUpdate &&
                (n._pendingUpdate(), (n._pendingUpdate = null));
            }
          );
        }),
        null
      );
    }
  },
  25633,
  (e, t, n) => {
    "use strict";
    var r = e.r(68996);
    Object.defineProperty(n, "__esModule", { value: !0 });
    var i = {
      default: function () {
        return v;
      },
      defaultHead: function () {
        return f;
      },
    };
    for (var o in i) Object.defineProperty(n, o, { enumerable: !0, get: i[o] });
    var a = e.r(55682),
      s = e.r(90809),
      l = e.r(43476),
      c = s._(e.r(71645)),
      u = a._(e.r(98879)),
      d = e.r(42732);
    function f() {
      return [
        (0, l.jsx)("meta", { charSet: "utf-8" }, "charset"),
        (0, l.jsx)(
          "meta",
          { name: "viewport", content: "width=device-width" },
          "viewport",
        ),
      ];
    }
    function p(e, t) {
      return "string" == typeof t || "number" == typeof t
        ? e
        : t.type === c.default.Fragment
          ? e.concat(
              c.default.Children.toArray(t.props.children).reduce(function (
                e,
                t,
              ) {
                return "string" == typeof t || "number" == typeof t
                  ? e
                  : e.concat(t);
              }, []),
            )
          : e.concat(t);
    }
    e.r(33525);
    var h = ["name", "httpEquiv", "charSet", "itemProp"];
    function m(e) {
      var t, n, r, i;
      return e
        .reduce(p, [])
        .reverse()
        .concat(f().reverse())
        .filter(
          ((t = new Set()),
          (n = new Set()),
          (r = new Set()),
          (i = {}),
          function (e) {
            var o = !0,
              a = !1;
            if (e.key && "number" != typeof e.key && e.key.indexOf("$") > 0) {
              a = !0;
              var s = e.key.slice(e.key.indexOf("$") + 1);
              t.has(s) ? (o = !1) : t.add(s);
            }
            switch (e.type) {
              case "title":
              case "base":
                n.has(e.type) ? (o = !1) : n.add(e.type);
                break;
              case "meta":
                for (var l = 0, c = h.length; l < c; l++) {
                  var u = h[l];
                  if (e.props.hasOwnProperty(u))
                    if ("charSet" === u) r.has(u) ? (o = !1) : r.add(u);
                    else {
                      var d = e.props[u],
                        f = i[u] || new Set();
                      ("name" !== u || !a) && f.has(d)
                        ? (o = !1)
                        : (f.add(d), (i[u] = f));
                    }
                }
            }
            return o;
          }),
        )
        .reverse()
        .map(function (e, t) {
          var n = e.key || t;
          return c.default.cloneElement(e, { key: n });
        });
    }
    var v = function (e) {
      var t = e.children,
        n = (0, c.useContext)(d.HeadManagerContext);
      return (0, l.jsx)(u.default, {
        reduceComponentsToState: m,
        headManager: n,
        children: t,
      });
    };
    ("function" == typeof n.default ||
      ("object" === r._(n.default) && null !== n.default)) &&
      void 0 === n.default.__esModule &&
      (Object.defineProperty(n.default, "__esModule", { value: !0 }),
      Object.assign(n.default, n),
      (t.exports = n.default));
  },
  88143,
  (e, t, n) => {
    "use strict";
    function r(e) {
      var t = e.widthInt,
        n = e.heightInt,
        r = e.blurWidth,
        i = e.blurHeight,
        o = e.blurDataURL,
        a = e.objectFit,
        s = r ? 40 * r : t,
        l = i ? 40 * i : n,
        c = s && l ? "viewBox='0 0 ".concat(s, " ").concat(l, "'") : "";
      return "%3Csvg xmlns='http://www.w3.org/2000/svg' "
        .concat(
          c,
          "%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='",
        )
        .concat(
          20,
          "'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='",
        )
        .concat(
          20,
          "'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='",
        )
        .concat(
          c
            ? "none"
            : "contain" === a
              ? "xMidYMid"
              : "cover" === a
                ? "xMidYMid slice"
                : "none",
          "' style='filter: url(%23b);' href='",
        )
        .concat(o, "'/%3E%3C/svg%3E");
    }
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "getImageBlurSvg", {
        enumerable: !0,
        get: function () {
          return r;
        },
      }));
  },
  87690,
  (e, t, n) => {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 });
    var r = {
      VALID_LOADERS: function () {
        return o;
      },
      imageConfigDefault: function () {
        return a;
      },
    };
    for (var i in r) Object.defineProperty(n, i, { enumerable: !0, get: r[i] });
    var o = ["default", "imgix", "cloudinary", "akamai", "custom"],
      a = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        path: "/_next/image",
        loader: "default",
        loaderFile: "",
        domains: [],
        disableStaticImages: !1,
        minimumCacheTTL: 14400,
        formats: ["image/webp"],
        maximumDiskCacheSize: void 0,
        maximumRedirects: 3,
        maximumResponseBody: 5e7,
        dangerouslyAllowLocalIP: !1,
        dangerouslyAllowSVG: !1,
        contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
        contentDispositionType: "attachment",
        localPatterns: void 0,
        remotePatterns: [],
        qualities: [75],
        unoptimized: !1,
        customCacheHandler: !1,
      };
  },
  8927,
  (e, t, n) => {
    "use strict";
    var r = e.r(44086),
      i = e.r(4571),
      o = e.r(95692),
      a = e.r(91470),
      s = e.r(98544),
      l = e.r(21991),
      c = e.r(68996);
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "getImgProps", {
        enumerable: !0,
        get: function () {
          return v;
        },
      }),
      e.r(33525));
    var u = e.r(43369),
      d = e.r(88143),
      f = e.r(87690),
      p = ["-moz-initial", "fill", "none", "scale-down", void 0];
    function h(e) {
      return void 0 !== e.default;
    }
    function m(e) {
      return void 0 === e
        ? e
        : "number" == typeof e
          ? Number.isFinite(e)
            ? e
            : NaN
          : "string" == typeof e && /^[0-9]+$/.test(e)
            ? parseInt(e, 10)
            : NaN;
    }
    function v(e, t) {
      var n,
        v,
        g,
        y = s._([e, t]),
        b = y[0],
        x = y.slice(1),
        w = b.src,
        _ = b.sizes,
        j = b.unoptimized,
        C = void 0 !== j && j,
        P = b.priority,
        S = void 0 !== P && P,
        E = b.preload,
        z = void 0 !== E && E,
        R = b.loading,
        k = b.className,
        O = b.quality,
        L = b.width,
        I = b.height,
        N = b.fill,
        M = void 0 !== N && N,
        A = b.style,
        T = b.overrideSrc,
        D = (b.onLoad, b.onLoadingComplete, b.placeholder),
        q = void 0 === D ? "empty" : D,
        F = b.blurDataURL,
        U = b.fetchPriority,
        W = b.decoding,
        B = b.layout,
        G = b.objectFit,
        H = b.objectPosition,
        X =
          (b.lazyBoundary,
          b.lazyRoot,
          o._(b, [
            "src",
            "sizes",
            "unoptimized",
            "priority",
            "preload",
            "loading",
            "className",
            "quality",
            "width",
            "height",
            "fill",
            "style",
            "overrideSrc",
            "onLoad",
            "onLoadingComplete",
            "placeholder",
            "blurDataURL",
            "fetchPriority",
            "decoding",
            "layout",
            "objectFit",
            "objectPosition",
            "lazyBoundary",
            "lazyRoot",
          ])),
        V = a._(x, 1)[0],
        Y = V.imgConf,
        $ = V.showAltText,
        J = V.blurComplete,
        K = V.defaultLoader,
        Q = Y || f.imageConfigDefault;
      if ("allSizes" in Q) Z = Q;
      else {
        var Z,
          ee,
          et = l
            ._(Q.deviceSizes)
            .concat(l._(Q.imageSizes))
            .sort(function (e, t) {
              return e - t;
            }),
          en = Q.deviceSizes.sort(function (e, t) {
            return e - t;
          }),
          er =
            null == (ee = Q.qualities)
              ? void 0
              : ee.sort(function (e, t) {
                  return e - t;
                });
        Z = i._(r._({}, Q), { allSizes: et, deviceSizes: en, qualities: er });
      }
      if (void 0 === K)
        throw Object.defineProperty(
          Error(
            "images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E163", enumerable: !1, configurable: !0 },
        );
      var ei = X.loader || K;
      (delete X.loader, delete X.srcSet);
      var eo = "__next_img_default" in ei;
      if (eo) {
        if ("custom" === Z.loader)
          throw Object.defineProperty(
            Error(
              'Image with src "'.concat(w, '" is missing "loader" prop.') +
                "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader",
            ),
            "__NEXT_ERROR_CODE",
            { value: "E252", enumerable: !1, configurable: !0 },
          );
      } else {
        var ea = ei;
        ei = function (e) {
          return (e.config, ea(o._(e, ["config"])));
        };
      }
      if (B) {
        "fill" === B && (M = !0);
        var es = {
          intrinsic: { maxWidth: "100%", height: "auto" },
          responsive: { width: "100%", height: "auto" },
        }[B];
        es && (A = r._({}, A, es));
        var el = { responsive: "100vw", fill: "100vw" }[B];
        el && !_ && (_ = el);
      }
      var ec = "",
        eu = m(L),
        ed = m(I);
      if (
        (n = w) &&
        (void 0 === n ? "undefined" : c._(n)) === "object" &&
        (h(n) || void 0 !== n.src)
      ) {
        var ef = h(w) ? w.default : w;
        if (!ef.src)
          throw Object.defineProperty(
            Error(
              "An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(
                JSON.stringify(ef),
              ),
            ),
            "__NEXT_ERROR_CODE",
            { value: "E460", enumerable: !1, configurable: !0 },
          );
        if (!ef.height || !ef.width)
          throw Object.defineProperty(
            Error(
              "An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(
                JSON.stringify(ef),
              ),
            ),
            "__NEXT_ERROR_CODE",
            { value: "E48", enumerable: !1, configurable: !0 },
          );
        if (
          ((v = ef.blurWidth),
          (g = ef.blurHeight),
          (F = F || ef.blurDataURL),
          (ec = ef.src),
          !M)
        )
          if (eu || ed) {
            if (eu && !ed) {
              var ep = eu / ef.width;
              ed = Math.round(ef.height * ep);
            } else if (!eu && ed) {
              var eh = ed / ef.height;
              eu = Math.round(ef.width * eh);
            }
          } else ((eu = ef.width), (ed = ef.height));
      }
      var em = !S && !z && ("lazy" === R || void 0 === R);
      ((!(w = "string" == typeof w ? w : ec) ||
        w.startsWith("data:") ||
        w.startsWith("blob:")) &&
        ((C = !0), (em = !1)),
        Z.unoptimized && (C = !0),
        eo &&
          !Z.dangerouslyAllowSVG &&
          w.split("?", 1)[0].endsWith(".svg") &&
          (C = !0));
      var ev = m(O),
        eg = Object.assign(
          M
            ? {
                position: "absolute",
                height: "100%",
                width: "100%",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                objectFit: G,
                objectPosition: H,
              }
            : {},
          $ ? {} : { color: "transparent" },
          A,
        ),
        ey =
          J || "empty" === q
            ? null
            : "blur" === q
              ? 'url("data:image/svg+xml;charset=utf-8,'.concat(
                  (0, d.getImageBlurSvg)({
                    widthInt: eu,
                    heightInt: ed,
                    blurWidth: v,
                    blurHeight: g,
                    blurDataURL: F || "",
                    objectFit: eg.objectFit,
                  }),
                  '")',
                )
              : 'url("'.concat(q, '")'),
        eb = p.includes(eg.objectFit)
          ? "fill" === eg.objectFit
            ? "100% 100%"
            : "cover"
          : eg.objectFit,
        ex = ey
          ? {
              backgroundSize: eb,
              backgroundPosition: eg.objectPosition || "50% 50%",
              backgroundRepeat: "no-repeat",
              backgroundImage: ey,
            }
          : {},
        ew = (function (e) {
          var t = e.config,
            n = e.src,
            r = e.unoptimized,
            i = e.width,
            o = e.quality,
            a = e.sizes,
            s = e.loader;
          if (r) {
            if (n.startsWith("/") && !n.startsWith("//")) {
              var c = (0, u.getDeploymentId)();
              if (c) {
                var d = n.indexOf("?");
                if (-1 !== d) {
                  var f = new URLSearchParams(n.slice(d + 1));
                  f.get("dpl") ||
                    (f.append("dpl", c),
                    (n = n.slice(0, d) + "?" + f.toString()));
                } else n += "?dpl=".concat(c);
              }
            }
            return { src: n, srcSet: void 0, sizes: void 0 };
          }
          var p = (function (e, t, n) {
              var r = e.deviceSizes,
                i = e.allSizes;
              if (n) {
                for (var o = /(^|\s)(1?\d?\d)vw/g, a = []; (s = o.exec(n));)
                  a.push(parseInt(s[2]));
                if (a.length) {
                  var s,
                    c,
                    u = 0.01 * (c = Math).min.apply(c, l._(a));
                  return {
                    widths: i.filter(function (e) {
                      return e >= r[0] * u;
                    }),
                    kind: "w",
                  };
                }
                return { widths: i, kind: "w" };
              }
              return "number" != typeof t
                ? { widths: r, kind: "w" }
                : {
                    widths: l._(
                      new Set(
                        [t, 2 * t].map(function (e) {
                          return (
                            i.find(function (t) {
                              return t >= e;
                            }) || i[i.length - 1]
                          );
                        }),
                      ),
                    ),
                    kind: "x",
                  };
            })(t, i, a),
            h = p.widths,
            m = p.kind,
            v = h.length - 1;
          return {
            sizes: a || "w" !== m ? a : "100vw",
            srcSet: h
              .map(function (e, r) {
                return ""
                  .concat(s({ config: t, src: n, quality: o, width: e }), " ")
                  .concat("w" === m ? e : r + 1)
                  .concat(m);
              })
              .join(", "),
            src: s({ config: t, src: n, quality: o, width: h[v] }),
          };
        })({
          config: Z,
          src: w,
          unoptimized: C,
          width: eu,
          quality: ev,
          sizes: _,
          loader: ei,
        }),
        e_ = em ? "lazy" : R;
      return {
        props: i._(r._({}, X), {
          loading: e_,
          fetchPriority: U,
          width: eu,
          height: ed,
          decoding: void 0 === W ? "async" : W,
          className: k,
          style: r._({}, eg, ex),
          sizes: ew.sizes,
          srcSet: ew.srcSet,
          src: T || ew.src,
        }),
        meta: { unoptimized: C, preload: z || S, placeholder: q, fill: M },
      };
    }
  },
  18556,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "ImageConfigContext", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    var r = e.r(55682)._(e.r(71645)),
      i = e.r(87690),
      o = r.default.createContext(i.imageConfigDefault);
  },
  65856,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "RouterContext", {
        enumerable: !0,
        get: function () {
          return r;
        },
      }));
    var r = e.r(55682)._(e.r(71645)).default.createContext(null);
  },
  70965,
  (e, t, n) => {
    "use strict";
    function r(e, t) {
      var n,
        r = e || 75;
      return (null == t || null == (n = t.qualities) ? void 0 : n.length)
        ? t.qualities.reduce(function (e, t) {
            return Math.abs(t - r) < Math.abs(e - r) ? t : e;
          }, t.qualities[0])
        : r;
    }
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "findClosestQuality", {
        enumerable: !0,
        get: function () {
          return r;
        },
      }));
  },
  1948,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "default", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    var r = e.r(70965),
      i = e.r(43369);
    function o(e) {
      var t,
        n = e.config,
        o = e.src,
        a = e.width,
        s = e.quality,
        l = (0, i.getDeploymentId)();
      if (o.startsWith("/") && !o.startsWith("//")) {
        var c = o.indexOf("?");
        if (-1 !== c) {
          var u = new URLSearchParams(o.slice(c + 1)),
            d = u.get("dpl");
          if (d) {
            ((l = d), u.delete("dpl"));
            var f = u.toString();
            o = o.slice(0, c) + (f ? "?" + f : "");
          }
        }
      }
      if (
        o.startsWith("/") &&
        o.includes("?") &&
        (null == (t = n.localPatterns) ? void 0 : t.length) === 1 &&
        "**" === n.localPatterns[0].pathname &&
        "" === n.localPatterns[0].search
      )
        throw Object.defineProperty(
          Error(
            'Image with src "'.concat(
              o,
              '" is using a query string which is not configured in images.localPatterns.',
            ) +
              "\nRead more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E871", enumerable: !1, configurable: !0 },
        );
      var p = (0, r.findClosestQuality)(s, n);
      return ""
        .concat(n.path, "?url=")
        .concat(encodeURIComponent(o), "&w=")
        .concat(a, "&q=")
        .concat(p)
        .concat(o.startsWith("/") && l ? "&dpl=".concat(l) : "");
    }
    o.__next_img_default = !0;
    var a = o;
  },
  85437,
  (e, t, n) => {
    "use strict";
    var r = e.r(44086),
      i = e.r(4571),
      o = e.r(95692),
      a = e.r(91470),
      s = e.r(98544),
      l = e.r(21991),
      c = e.r(68996);
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "Image", {
        enumerable: !0,
        get: function () {
          return E;
        },
      }));
    var u = e.r(55682),
      d = e.r(90809),
      f = e.r(43476),
      p = d._(e.r(71645)),
      h = u._(e.r(74080)),
      m = u._(e.r(25633)),
      v = e.r(8927),
      g = e.r(87690),
      y = e.r(18556);
    e.r(33525);
    var b = e.r(65856),
      x = u._(e.r(1948)),
      w = e.r(18581),
      _ = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        qualities: [75, 90],
        path: "/_next/image",
        loader: "default",
        dangerouslyAllowSVG: !1,
        unoptimized: !1,
      };
    function j(e, t, n, o, a, s, l) {
      var c = null == e ? void 0 : e.src;
      e &&
        e["data-loaded-src"] !== c &&
        ((e["data-loaded-src"] = c),
        ("decode" in e ? e.decode() : Promise.resolve())
          .catch(function () {})
          .then(function () {
            if (e.parentElement && e.isConnected) {
              if (("empty" !== t && a(!0), null == n ? void 0 : n.current)) {
                var s = new Event("load");
                Object.defineProperty(s, "target", { writable: !1, value: e });
                var l = !1,
                  c = !1;
                n.current(
                  i._(r._({}, s), {
                    nativeEvent: s,
                    currentTarget: e,
                    target: e,
                    isDefaultPrevented: function () {
                      return l;
                    },
                    isPropagationStopped: function () {
                      return c;
                    },
                    persist: function () {},
                    preventDefault: function () {
                      ((l = !0), s.preventDefault());
                    },
                    stopPropagation: function () {
                      ((c = !0), s.stopPropagation());
                    },
                  }),
                );
              }
              (null == o ? void 0 : o.current) && o.current(e);
            }
          }));
    }
    function C(e) {
      return p.use ? { fetchPriority: e } : { fetchpriority: e };
    }
    "u" < typeof window && (globalThis.__NEXT_IMAGE_IMPORTED = !0);
    var P = (0, p.forwardRef)(function (e, t) {
      var n = s._([e, t]),
        l = n[0],
        c = n.slice(1),
        u = l.src,
        d = l.srcSet,
        h = l.sizes,
        m = l.height,
        v = l.width,
        g = l.decoding,
        y = l.className,
        b = l.style,
        x = l.fetchPriority,
        _ = l.placeholder,
        P = l.loading,
        S = l.unoptimized,
        E = l.fill,
        z = l.onLoadRef,
        R = l.onLoadingCompleteRef,
        k = l.setBlurComplete,
        O = l.setShowAltText,
        L = l.sizesInput,
        I = (l.onLoad, l.onError),
        N = o._(l, [
          "src",
          "srcSet",
          "sizes",
          "height",
          "width",
          "decoding",
          "className",
          "style",
          "fetchPriority",
          "placeholder",
          "loading",
          "unoptimized",
          "fill",
          "onLoadRef",
          "onLoadingCompleteRef",
          "setBlurComplete",
          "setShowAltText",
          "sizesInput",
          "onLoad",
          "onError",
        ]),
        M = a._(c, 1)[0],
        A = (0, p.useCallback)(
          function (e) {
            e && (I && (e.src = e.src), e.complete && j(e, _, z, R, k, S, L));
          },
          [u, _, z, R, k, I, S, L],
        ),
        T = (0, w.useMergedRef)(M, A);
      return (0, f.jsx)(
        "img",
        i._(r._({}, N, C(x)), {
          loading: P,
          width: v,
          height: m,
          decoding: g,
          "data-nimg": E ? "fill" : "1",
          className: y,
          style: b,
          sizes: h,
          srcSet: d,
          src: u,
          ref: T,
          onLoad: function (e) {
            j(e.currentTarget, _, z, R, k, S, L);
          },
          onError: function (e) {
            (O(!0), "empty" !== _ && k(!0), I && I(e));
          },
        }),
      );
    });
    function S(e) {
      var t = e.isAppRouter,
        n = e.imgAttributes,
        i = r._(
          {
            as: "image",
            imageSrcSet: n.srcSet,
            imageSizes: n.sizes,
            crossOrigin: n.crossOrigin,
            referrerPolicy: n.referrerPolicy,
          },
          C(n.fetchPriority),
        );
      return t && h.default.preload
        ? (h.default.preload(n.src, i), null)
        : (0, f.jsx)(m.default, {
            children: (0, f.jsx)(
              "link",
              r._({ rel: "preload", href: n.srcSet ? void 0 : n.src }, i),
              "__nimg-" + n.src + n.srcSet + n.sizes,
            ),
          });
    }
    var E = (0, p.forwardRef)(function (e, t) {
      var n = (0, p.useContext)(b.RouterContext),
        o = (0, p.useContext)(y.ImageConfigContext),
        s = (0, p.useMemo)(
          function () {
            var e,
              t = _ || o || g.imageConfigDefault,
              n = l
                ._(t.deviceSizes)
                .concat(l._(t.imageSizes))
                .sort(function (e, t) {
                  return e - t;
                }),
              a = t.deviceSizes.sort(function (e, t) {
                return e - t;
              }),
              s =
                null == (e = t.qualities)
                  ? void 0
                  : e.sort(function (e, t) {
                      return e - t;
                    });
            return i._(r._({}, t), {
              allSizes: n,
              deviceSizes: a,
              qualities: s,
              localPatterns:
                "u" < typeof window
                  ? null == o
                    ? void 0
                    : o.localPatterns
                  : t.localPatterns,
            });
          },
          [o],
        ),
        c = e.onLoad,
        u = e.onLoadingComplete,
        d = (0, p.useRef)(c);
      (0, p.useEffect)(
        function () {
          d.current = c;
        },
        [c],
      );
      var h = (0, p.useRef)(u);
      (0, p.useEffect)(
        function () {
          h.current = u;
        },
        [u],
      );
      var m = a._((0, p.useState)(!1), 2),
        w = m[0],
        j = m[1],
        C = a._((0, p.useState)(!1), 2),
        E = C[0],
        z = C[1],
        R = (0, v.getImgProps)(e, {
          defaultLoader: x.default,
          imgConf: s,
          blurComplete: w,
          showAltText: E,
        }),
        k = R.props,
        O = R.meta;
      return (0, f.jsxs)(f.Fragment, {
        children: [
          (0, f.jsx)(
            P,
            i._(r._({}, k), {
              unoptimized: O.unoptimized,
              placeholder: O.placeholder,
              fill: O.fill,
              onLoadRef: d,
              onLoadingCompleteRef: h,
              setBlurComplete: j,
              setShowAltText: z,
              sizesInput: e.sizes,
              ref: t,
            }),
          ),
          O.preload
            ? (0, f.jsx)(S, { isAppRouter: !n, imgAttributes: k })
            : null,
        ],
      });
    });
    ("function" == typeof n.default ||
      ("object" === c._(n.default) && null !== n.default)) &&
      void 0 === n.default.__esModule &&
      (Object.defineProperty(n.default, "__esModule", { value: !0 }),
      Object.assign(n.default, n),
      (t.exports = n.default));
  },
  90163,
  (e) => {
    "use strict";
    var t = e.i(43476),
      n = e.i(46932),
      r = [0.25, 0.1, 0.25, 1],
      i = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
      o = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: r } },
      };
    e.s([
      "FadeIn",
      0,
      function (e) {
        var i = e.children,
          o = e.delay,
          a = e.className;
        return (0, t.jsx)(n.motion.div, {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: void 0 === o ? 0 : o, ease: r },
          className: a,
          children: i,
        });
      },
      "FadeInView",
      0,
      function (e) {
        var i = e.children,
          o = e.delay,
          a = e.className;
        return (0, t.jsx)(n.motion.div, {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: !0, margin: "-40px" },
          transition: { duration: 0.6, delay: void 0 === o ? 0 : o, ease: r },
          className: a,
          children: i,
        });
      },
      "StaggerContainer",
      0,
      function (e) {
        var r = e.children,
          o = e.className;
        return (0, t.jsx)(n.motion.div, {
          variants: i,
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: !0, margin: "-40px" },
          className: o,
          children: r,
        });
      },
      "StaggerItem",
      0,
      function (e) {
        var r = e.children,
          i = e.className;
        return (0, t.jsx)(n.motion.div, {
          variants: o,
          className: i,
          children: r,
        });
      },
    ]);
  },
  94909,
  (e, t, n) => {
    "use strict";
    var r = e.r(91470);
    Object.defineProperty(n, "__esModule", { value: !0 });
    var i = {
      default: function () {
        return d;
      },
      getImageProps: function () {
        return u;
      },
    };
    for (var o in i) Object.defineProperty(n, o, { enumerable: !0, get: i[o] });
    var a = e.r(55682),
      s = e.r(8927),
      l = e.r(85437),
      c = a._(e.r(1948));
    function u(e) {
      var t = (0, s.getImgProps)(e, {
          defaultLoader: c.default,
          imgConf: {
            deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
            imageSizes: [32, 48, 64, 96, 128, 256, 384],
            qualities: [75, 90],
            path: "/_next/image",
            loader: "default",
            dangerouslyAllowSVG: !1,
            unoptimized: !1,
          },
        }).props,
        n = !0,
        i = !1,
        o = void 0;
      try {
        for (
          var a, l = Object.entries(t)[Symbol.iterator]();
          !(n = (a = l.next()).done);
          n = !0
        ) {
          var u = r._(a.value, 2),
            d = u[0],
            f = u[1];
          void 0 === f && delete t[d];
        }
      } catch (e) {
        ((i = !0), (o = e));
      } finally {
        try {
          n || null == l.return || l.return();
        } finally {
          if (i) throw o;
        }
      }
      return { props: t };
    }
    var d = l.Image;
  },
  57688,
  (e, t, n) => {
    t.exports = e.r(94909);
  },
  49729,
  (e) => {
    "use strict";
    var t = e.i(20786),
      n = e.i(92808),
      r = e.i(33027),
      i = e.i(51682),
      o = e.i(43476),
      a = e.i(71645),
      s = e.i(57688);
    e.s([
      "ImageWithSkeleton",
      0,
      function (e) {
        var l = e.onLoad,
          c = e.quality,
          u = (0, r._)(e, ["onLoad", "quality"]),
          d = (0, i._)((0, a.useState)(!1), 2),
          f = d[0],
          p = d[1],
          h = (0, i._)((0, a.useState)(!1), 2),
          m = h[0],
          v = h[1],
          g = (0, a.useRef)(!1);
        return (
          (0, a.useEffect)(function () {
            var e = setTimeout(function () {
              g.current || v(!0);
            }, 50);
            return function () {
              return clearTimeout(e);
            };
          }, []),
          (0, o.jsxs)(o.Fragment, {
            children: [
              m &&
                (0, o.jsx)("div", {
                  "aria-hidden": "true",
                  className:
                    "absolute inset-0 image-skeleton transition-opacity duration-300 ".concat(
                      f ? "opacity-0 pointer-events-none" : "opacity-100",
                    ),
                }),
              (0, o.jsx)(
                s.default,
                (0, n._)((0, t._)({}, u), {
                  quality: void 0 === c ? 90 : c,
                  onLoad: function (e) {
                    ((g.current = !0), p(!0), null == l || l(e));
                  },
                }),
              ),
            ],
          })
        );
      },
    ]);
  },
  59529,
  (e) => {
    "use strict";
    var t = e.i(43476),
      n = e.i(46932),
      r = {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.018, delayChildren: 0.05 },
        },
      },
      i = {
        hidden: { y: 18, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
        },
      };
    e.s([
      "default",
      0,
      function (e) {
        var o = e.segments,
          a = e.className,
          s = (function (e) {
            var t = [],
              n = [],
              r = !0,
              i = !1,
              o = void 0;
            try {
              for (
                var a, s = e[Symbol.iterator]();
                !(r = (a = s.next()).done);
                r = !0
              ) {
                var l = a.value;
                " " === l.c
                  ? n.length
                    ? (t.push({ chars: n, space: !0 }), (n = []))
                    : t.push({ chars: [], space: !0 })
                  : n.push(l);
              }
            } catch (e) {
              ((i = !0), (o = e));
            } finally {
              try {
                r || null == s.return || s.return();
              } finally {
                if (i) throw o;
              }
            }
            return (n.length && t.push({ chars: n, space: !1 }), t);
          })(
            o.flatMap(function (e) {
              return e.text.split("").map(function (t) {
                var n;
                return { c: t, className: null != (n = e.className) ? n : "" };
              });
            }),
          );
        return (0, t.jsx)(n.motion.h1, {
          className: a,
          variants: r,
          initial: "hidden",
          animate: "visible",
          children: s.map(function (e, r) {
            return (0, t.jsxs)(
              "span",
              {
                style: { display: "inline-block", whiteSpace: "nowrap" },
                children: [
                  e.chars.map(function (e, r) {
                    return (0, t.jsx)(
                      n.motion.span,
                      {
                        variants: i,
                        className: e.className,
                        style: { display: "inline-block" },
                        children: e.c,
                      },
                      r,
                    );
                  }),
                  e.space &&
                    (0, t.jsx)("span", {
                      style: { display: "inline-block" },
                      children: " ",
                    }),
                ],
              },
              r,
            );
          }),
        });
      },
    ]);
  },
  88653,
  (e) => {
    "use strict";
    e.i(47167);
    var t = e.i(51682),
      n = e.i(40316),
      r = e.i(43476),
      i = e.i(71645),
      o = e.i(31178),
      a = e.i(47414),
      s = e.i(74008),
      l = e.i(20786),
      c = e.i(21476),
      u = e.i(38981),
      d = e.i(92955),
      f = e.i(80646),
      p = e.i(64217),
      h = e.i(72846),
      m = e.i(37806);
    function v(e, t) {
      if ("function" == typeof e) return e(t);
      null != e && (e.current = t);
    }
    function g() {
      for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
        t[n] = arguments[n];
      return function (e) {
        var n = !1,
          r = t.map(function (t) {
            var r = v(t, e);
            return (n || "function" != typeof r || (n = !0), r);
          });
        if (n)
          return function () {
            for (var e = 0; e < r.length; e++) {
              var n = r[e];
              "function" == typeof n ? n() : v(t[e], null);
            }
          };
      };
    }
    var y = (function (e) {
      function t() {
        return ((0, d._)(this, t), (0, u._)(this, t, arguments));
      }
      return (
        (0, p._)(t, e),
        (0, f._)(t, [
          {
            key: "getSnapshotBeforeUpdate",
            value: function (e) {
              var t = this.props.childRef.current;
              if (
                (0, h.isHTMLElement)(t) &&
                e.isPresent &&
                !this.props.isPresent &&
                !1 !== this.props.pop
              ) {
                var n = t.offsetParent,
                  r = ((0, h.isHTMLElement)(n) && n.offsetWidth) || 0,
                  i = ((0, h.isHTMLElement)(n) && n.offsetHeight) || 0,
                  o = getComputedStyle(t),
                  a = this.props.sizeRef.current;
                ((a.height = parseFloat(o.height)),
                  (a.width = parseFloat(o.width)),
                  (a.top = t.offsetTop),
                  (a.left = t.offsetLeft),
                  (a.right = r - a.width - a.left),
                  (a.bottom = i - a.height - a.top),
                  (a.direction = o.direction));
              }
              return null;
            },
          },
          { key: "componentDidUpdate", value: function () {} },
          {
            key: "render",
            value: function () {
              return this.props.children;
            },
          },
        ]),
        t
      );
    })(i.Component);
    function b(e) {
      var t,
        o,
        a = e.children,
        s = e.isPresent,
        l = e.anchorX,
        c = e.anchorY,
        u = e.root,
        d = e.pop,
        f = (0, i.useId)(),
        p = (0, i.useRef)(null),
        h = (0, i.useRef)({
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          direction: "ltr",
        }),
        v = (0, i.useContext)(m.MotionConfigContext).nonce,
        b = (function () {
          for (var e = arguments.length, t = Array(e), r = 0; r < e; r++)
            t[r] = arguments[r];
          return i.useCallback(g.apply(void 0, (0, n._)(t)), t);
        })(
          p,
          null != (t = null == (o = a.props) ? void 0 : o.ref)
            ? t
            : null == a
              ? void 0
              : a.ref,
        );
      return (
        (0, i.useInsertionEffect)(
          function () {
            var e = h.current,
              t = e.width,
              n = e.height,
              r = e.top,
              i = e.left,
              o = e.right,
              a = e.bottom,
              m = e.direction;
            if (!s && !1 !== d && p.current && t && n) {
              var g = "rtl" === m;
              p.current.dataset.motionPopId = f;
              var y = document.createElement("style");
              v && (y.nonce = v);
              var b = null != u ? u : document.head;
              return (
                b.appendChild(y),
                y.sheet &&
                  y.sheet.insertRule(
                    '\n          [data-motion-pop-id="'
                      .concat(
                        f,
                        '"] {\n            position: absolute !important;\n            width: ',
                      )
                      .concat(t, "px !important;\n            height: ")
                      .concat(n, "px !important;\n            ")
                      .concat(
                        "left" === l
                          ? g
                            ? "right: ".concat(o)
                            : "left: ".concat(i)
                          : g
                            ? "left: ".concat(i)
                            : "right: ".concat(o),
                        "px !important;\n            ",
                      )
                      .concat(
                        "bottom" === c
                          ? "bottom: ".concat(a)
                          : "top: ".concat(r),
                        "px !important;\n          }\n        ",
                      ),
                  ),
                function () {
                  var e;
                  (null == (e = p.current) ||
                    e.removeAttribute("data-motion-pop-id"),
                    b.contains(y) && b.removeChild(y));
                }
              );
            }
          },
          [s],
        ),
        (0, r.jsx)(y, {
          isPresent: s,
          childRef: p,
          sizeRef: h,
          pop: d,
          children: !1 === d ? a : i.cloneElement(a, { ref: b }),
        })
      );
    }
    var x = function (e) {
      var t = e.children,
        n = e.initial,
        o = e.isPresent,
        s = e.onExitComplete,
        u = e.custom,
        d = e.presenceAffectsLayout,
        f = e.mode,
        p = e.anchorX,
        h = e.anchorY,
        m = e.root,
        v = (0, a.useConstant)(w),
        g = (0, i.useId)(),
        y = !0,
        x = (0, i.useMemo)(
          function () {
            return (
              (y = !1),
              {
                id: g,
                initial: n,
                isPresent: o,
                custom: u,
                onExitComplete: function (e) {
                  v.set(e, !0);
                  var t = !0,
                    n = !1,
                    r = void 0;
                  try {
                    for (
                      var i, o = v.values()[Symbol.iterator]();
                      !(t = (i = o.next()).done);
                      t = !0
                    )
                      if (!i.value) return;
                  } catch (e) {
                    ((n = !0), (r = e));
                  } finally {
                    try {
                      t || null == o.return || o.return();
                    } finally {
                      if (n) throw r;
                    }
                  }
                  s && s();
                },
                register: function (e) {
                  return (
                    v.set(e, !1),
                    function () {
                      return v.delete(e);
                    }
                  );
                },
              }
            );
          },
          [o, v, s],
        );
      return (
        d && y && (x = (0, l._)({}, x)),
        (0, i.useMemo)(
          function () {
            v.forEach(function (e, t) {
              return v.set(t, !1);
            });
          },
          [o],
        ),
        i.useEffect(
          function () {
            o || v.size || !s || s();
          },
          [o],
        ),
        (t = (0, r.jsx)(b, {
          pop: "popLayout" === f,
          isPresent: o,
          anchorX: p,
          anchorY: h,
          root: m,
          children: t,
        })),
        (0, r.jsx)(c.PresenceContext.Provider, { value: x, children: t })
      );
    };
    function w() {
      return new Map();
    }
    var _ = e.i(64978),
      j = function (e) {
        return e.key || "";
      };
    function C(e) {
      var t = [];
      return (
        i.Children.forEach(e, function (e) {
          (0, i.isValidElement)(e) && t.push(e);
        }),
        t
      );
    }
    e.s(
      [
        "AnimatePresence",
        0,
        function (e) {
          var l = e.children,
            c = e.custom,
            u = e.initial,
            d = void 0 === u || u,
            f = e.onExitComplete,
            p = e.presenceAffectsLayout,
            h = void 0 === p || p,
            m = e.mode,
            v = void 0 === m ? "sync" : m,
            g = e.propagate,
            y = void 0 !== g && g,
            b = e.anchorX,
            w = void 0 === b ? "left" : b,
            P = e.anchorY,
            S = void 0 === P ? "top" : P,
            E = e.root,
            z = (0, t._)((0, _.usePresence)(y), 2),
            R = z[0],
            k = z[1],
            O = (0, i.useMemo)(
              function () {
                return C(l);
              },
              [l],
            ),
            L = y && !R ? [] : O.map(j),
            I = (0, i.useRef)(!0),
            N = (0, i.useRef)(O),
            M = (0, a.useConstant)(function () {
              return new Map();
            }),
            A = (0, i.useRef)(new Set()),
            T = (0, t._)((0, i.useState)(O), 2),
            D = T[0],
            q = T[1],
            F = (0, t._)((0, i.useState)(O), 2),
            U = F[0],
            W = F[1];
          (0, s.useIsomorphicLayoutEffect)(
            function () {
              ((I.current = !1), (N.current = O));
              for (var e = 0; e < U.length; e++) {
                var t = j(U[e]);
                L.includes(t)
                  ? (M.delete(t), A.current.delete(t))
                  : !0 !== M.get(t) && M.set(t, !1);
              }
            },
            [U, L.length, L.join("-")],
          );
          var B = [];
          if (O !== D) {
            for (var G = (0, n._)(O), H = 0; H < U.length; H++) {
              var X = U[H],
                V = j(X);
              L.includes(V) || (G.splice(H, 0, X), B.push(X));
            }
            return ("wait" === v && B.length && (G = B), W(C(G)), q(O), null);
          }
          var Y = (0, i.useContext)(o.LayoutGroupContext).forceRender;
          return (0, r.jsx)(r.Fragment, {
            children: U.map(function (e) {
              var t = j(e),
                n = (!y || !!R) && (O === U || L.includes(t));
              return (0, r.jsx)(
                x,
                {
                  isPresent: n,
                  initial: (!I.current || !!d) && void 0,
                  custom: c,
                  presenceAffectsLayout: h,
                  mode: v,
                  root: E,
                  onExitComplete: n
                    ? void 0
                    : function () {
                        if (!A.current.has(t) && M.has(t)) {
                          (A.current.add(t), M.set(t, !0));
                          var e = !0;
                          (M.forEach(function (t) {
                            t || (e = !1);
                          }),
                            e &&
                              (null == Y || Y(),
                              W(N.current),
                              y && (null == k || k()),
                              f && f()));
                        }
                      },
                  anchorX: w,
                  anchorY: S,
                  children: e,
                },
                t,
              );
            }),
          });
        },
      ],
      88653,
    );
  },
  97236,
  (e) => {
    "use strict";
    var t = e.i(43476),
      n = (0, e.i(70703).default)(
        function () {
          return e.A(33543);
        },
        { loadableGenerated: { modules: [70905] }, ssr: !1 },
      );
    e.s([
      "default",
      0,
      function (e) {
        var r = e.animationData,
          i = e.className;
        return (0, t.jsx)(n, {
          animationData: r,
          loop: !0,
          autoplay: !0,
          className: void 0 === i ? "w-10 h-10" : i,
        });
      },
    ]);
  },
  60297,
  (e) => {
    "use strict";
    var t = e.i(51682),
      n = e.i(43476),
      r = e.i(71645),
      i = e.i(57688),
      o = e.i(49729),
      a = e.i(46932),
      s = e.i(88653),
      l = [
        { src: "/images/napoli3.webp", alt: "Exploration" },
        { src: "/images/napoli2.webp", alt: "Exploration" },
        { src: "/images/fantacalcio2.webp", alt: "Exploration" },
        { src: "/images/fantacalcio3.webp", alt: "Exploration" },
      ];
    e.s([
      "default",
      0,
      function () {
        var e = (0, t._)((0, r.useState)(null), 2),
          c = e[0],
          u = e[1],
          d = (0, r.useCallback)(function () {
            return u(null);
          }, []),
          f = (0, r.useCallback)(function () {
            return u(function (e) {
              return null !== e ? (e - 1 + l.length) % l.length : null;
            });
          }, []),
          p = (0, r.useCallback)(function () {
            return u(function (e) {
              return null !== e ? (e + 1) % l.length : null;
            });
          }, []);
        (0, r.useEffect)(
          function () {
            if (null !== c) {
              document.body.style.overflow = "hidden";
              var e = function (e) {
                ("Escape" === e.key && d(),
                  "ArrowLeft" === e.key && f(),
                  "ArrowRight" === e.key && p());
              };
              return (
                document.addEventListener("keydown", e),
                function () {
                  ((document.body.style.overflow = ""),
                    document.removeEventListener("keydown", e));
                }
              );
            }
          },
          [c, d, f, p],
        );
        var h = null !== c ? l[c] : null;
        return (0, n.jsxs)(n.Fragment, {
          children: [
            (0, n.jsx)("div", {
              className:
                "aspect-[3/4] overflow-hidden rounded-lg mb-3 grid grid-cols-2 gap-1",
              children: l.map(function (e, t) {
                return (0, n.jsx)(
                  "button",
                  {
                    onClick: function () {
                      return u(t);
                    },
                    className:
                      "relative overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] cursor-pointer group",
                    children: (0, n.jsx)(o.ImageWithSkeleton, {
                      src: e.src,
                      alt: e.alt,
                      fill: !0,
                      sizes: "(min-width: 1024px) 165px, 17vw",
                      className:
                        "object-cover transition-transform duration-500 group-hover:scale-[1.02]",
                    }),
                  },
                  e.src,
                );
              }),
            }),
            (0, n.jsx)(s.AnimatePresence, {
              children:
                h &&
                (0, n.jsxs)(
                  a.motion.div,
                  {
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-label": "Image viewer",
                    className:
                      "fixed inset-0 z-[999] flex items-center justify-center",
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 0.2 },
                    onClick: d,
                    children: [
                      (0, n.jsx)("div", {
                        className: "absolute inset-0 bg-black/90",
                      }),
                      (0, n.jsx)(a.motion.button, {
                        onClick: d,
                        "aria-label": "Close",
                        className:
                          "absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors",
                        initial: { opacity: 0, scale: 0.75 },
                        animate: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.75 },
                        transition: { duration: 0.2, delay: 0.05 },
                        children: (0, n.jsxs)("svg", {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 16 16",
                          fill: "none",
                          children: [
                            (0, n.jsx)("line", {
                              x1: "1",
                              y1: "1",
                              x2: "15",
                              y2: "15",
                              stroke: "white",
                              strokeWidth: "1.8",
                              strokeLinecap: "round",
                            }),
                            (0, n.jsx)("line", {
                              x1: "15",
                              y1: "1",
                              x2: "1",
                              y2: "15",
                              stroke: "white",
                              strokeWidth: "1.8",
                              strokeLinecap: "round",
                            }),
                          ],
                        }),
                      }),
                      (0, n.jsx)("button", {
                        onClick: function (e) {
                          (e.stopPropagation(), f());
                        },
                        "aria-label": "Previous",
                        className:
                          "absolute left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors",
                        children: (0, n.jsx)("svg", {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 16 16",
                          fill: "none",
                          children: (0, n.jsx)("polyline", {
                            points: "10,2 4,8 10,14",
                            stroke: "white",
                            strokeWidth: "1.8",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                          }),
                        }),
                      }),
                      (0, n.jsx)("button", {
                        onClick: function (e) {
                          (e.stopPropagation(), p());
                        },
                        "aria-label": "Next",
                        className:
                          "absolute right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors",
                        children: (0, n.jsx)("svg", {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 16 16",
                          fill: "none",
                          children: (0, n.jsx)("polyline", {
                            points: "6,2 12,8 6,14",
                            stroke: "white",
                            strokeWidth: "1.8",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                          }),
                        }),
                      }),
                      (0, n.jsx)(s.AnimatePresence, {
                        mode: "wait",
                        children: (0, n.jsx)(
                          a.motion.div,
                          {
                            className:
                              "relative z-10 w-full h-full mx-16 my-14 md:mx-24 md:my-16",
                            initial: { opacity: 0, x: 20 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -20 },
                            transition: { duration: 0.2, ease: "easeOut" },
                            onClick: function (e) {
                              return e.stopPropagation();
                            },
                            children: (0, n.jsx)(i.default, {
                              src: h.src,
                              alt: h.alt,
                              fill: !0,
                              sizes: "100vw",
                              className: "object-contain",
                              priority: !0,
                              quality: 90,
                            }),
                          },
                          h.src,
                        ),
                      }),
                      (0, n.jsxs)("div", {
                        className:
                          "absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-white/40 text-xs",
                        children: [(null != c ? c : 0) + 1, " / ", l.length],
                      }),
                    ],
                  },
                  "lightbox",
                ),
            }),
          ],
        });
      },
    ]);
  },
  33543,
  (e) => {
    e.v((t) =>
      Promise.all(["static/chunks/14yunjhhn59rl.js"].map((t) => e.l(t))).then(
        () => t(70905),
      ),
    );
  },
]);
