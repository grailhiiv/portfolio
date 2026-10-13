(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  98879,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return s;
        },
      }));
    var i = e.r(71645),
      n = "u" < typeof window,
      a = n ? function () {} : i.useLayoutEffect,
      o = n ? function () {} : i.useEffect;
    function s(e) {
      var t,
        r = e.headManager,
        s = e.reduceComponentsToState;
      function l() {
        if (r && r.mountedInstances) {
          var e = i.Children.toArray(
            Array.from(r.mountedInstances).filter(Boolean),
          );
          r.updateHead(s(e));
        }
      }
      return (
        n &&
          (null == r || null == (t = r.mountedInstances) || t.add(e.children),
          l()),
        a(function () {
          var t;
          return (
            null == r || null == (t = r.mountedInstances) || t.add(e.children),
            function () {
              var t;
              null == r ||
                null == (t = r.mountedInstances) ||
                t.delete(e.children);
            }
          );
        }),
        a(function () {
          return (
            r && (r._pendingUpdate = l),
            function () {
              r && (r._pendingUpdate = l);
            }
          );
        }),
        o(function () {
          return (
            r &&
              r._pendingUpdate &&
              (r._pendingUpdate(), (r._pendingUpdate = null)),
            function () {
              r &&
                r._pendingUpdate &&
                (r._pendingUpdate(), (r._pendingUpdate = null));
            }
          );
        }),
        null
      );
    }
  },
  25633,
  (e, t, r) => {
    "use strict";
    var i = e.r(68996);
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      default: function () {
        return g;
      },
      defaultHead: function () {
        return f;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    var o = e.r(55682),
      s = e.r(90809),
      l = e.r(43476),
      c = s._(e.r(71645)),
      u = o._(e.r(98879)),
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
    var m = ["name", "httpEquiv", "charSet", "itemProp"];
    function h(e) {
      var t, r, i, n;
      return e
        .reduce(p, [])
        .reverse()
        .concat(f().reverse())
        .filter(
          ((t = new Set()),
          (r = new Set()),
          (i = new Set()),
          (n = {}),
          function (e) {
            var a = !0,
              o = !1;
            if (e.key && "number" != typeof e.key && e.key.indexOf("$") > 0) {
              o = !0;
              var s = e.key.slice(e.key.indexOf("$") + 1);
              t.has(s) ? (a = !1) : t.add(s);
            }
            switch (e.type) {
              case "title":
              case "base":
                r.has(e.type) ? (a = !1) : r.add(e.type);
                break;
              case "meta":
                for (var l = 0, c = m.length; l < c; l++) {
                  var u = m[l];
                  if (e.props.hasOwnProperty(u))
                    if ("charSet" === u) i.has(u) ? (a = !1) : i.add(u);
                    else {
                      var d = e.props[u],
                        f = n[u] || new Set();
                      ("name" !== u || !o) && f.has(d)
                        ? (a = !1)
                        : (f.add(d), (n[u] = f));
                    }
                }
            }
            return a;
          }),
        )
        .reverse()
        .map(function (e, t) {
          var r = e.key || t;
          return c.default.cloneElement(e, { key: r });
        });
    }
    var g = function (e) {
      var t = e.children,
        r = (0, c.useContext)(d.HeadManagerContext);
      return (0, l.jsx)(u.default, {
        reduceComponentsToState: h,
        headManager: r,
        children: t,
      });
    };
    ("function" == typeof r.default ||
      ("object" === i._(r.default) && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  88143,
  (e, t, r) => {
    "use strict";
    function i(e) {
      var t = e.widthInt,
        r = e.heightInt,
        i = e.blurWidth,
        n = e.blurHeight,
        a = e.blurDataURL,
        o = e.objectFit,
        s = i ? 40 * i : t,
        l = n ? 40 * n : r,
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
            : "contain" === o
              ? "xMidYMid"
              : "cover" === o
                ? "xMidYMid slice"
                : "none",
          "' style='filter: url(%23b);' href='",
        )
        .concat(a, "'/%3E%3C/svg%3E");
    }
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "getImageBlurSvg", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
  },
  87690,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var i = {
      VALID_LOADERS: function () {
        return a;
      },
      imageConfigDefault: function () {
        return o;
      },
    };
    for (var n in i) Object.defineProperty(r, n, { enumerable: !0, get: i[n] });
    var a = ["default", "imgix", "cloudinary", "akamai", "custom"],
      o = {
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
  (e, t, r) => {
    "use strict";
    var i = e.r(44086),
      n = e.r(4571),
      a = e.r(95692),
      o = e.r(91470),
      s = e.r(98544),
      l = e.r(21991),
      c = e.r(68996);
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "getImgProps", {
        enumerable: !0,
        get: function () {
          return g;
        },
      }),
      e.r(33525));
    var u = e.r(43369),
      d = e.r(88143),
      f = e.r(87690),
      p = ["-moz-initial", "fill", "none", "scale-down", void 0];
    function m(e) {
      return void 0 !== e.default;
    }
    function h(e) {
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
    function g(e, t) {
      var r,
        g,
        v,
        y = s._([e, t]),
        b = y[0],
        _ = y.slice(1),
        x = b.src,
        w = b.sizes,
        j = b.unoptimized,
        S = void 0 !== j && j,
        P = b.priority,
        C = void 0 !== P && P,
        z = b.preload,
        O = void 0 !== z && z,
        R = b.loading,
        E = b.className,
        I = b.quality,
        N = b.width,
        L = b.height,
        M = b.fill,
        k = void 0 !== M && M,
        T = b.style,
        D = b.overrideSrc,
        A = (b.onLoad, b.onLoadingComplete, b.placeholder),
        q = void 0 === A ? "empty" : A,
        F = b.blurDataURL,
        U = b.fetchPriority,
        B = b.decoding,
        W = b.layout,
        G = b.objectFit,
        H = b.objectPosition,
        V =
          (b.lazyBoundary,
          b.lazyRoot,
          a._(b, [
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
        X = o._(_, 1)[0],
        Y = X.imgConf,
        $ = X.showAltText,
        J = X.blurComplete,
        K = X.defaultLoader,
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
          er = Q.deviceSizes.sort(function (e, t) {
            return e - t;
          }),
          ei =
            null == (ee = Q.qualities)
              ? void 0
              : ee.sort(function (e, t) {
                  return e - t;
                });
        Z = n._(i._({}, Q), { allSizes: et, deviceSizes: er, qualities: ei });
      }
      if (void 0 === K)
        throw Object.defineProperty(
          Error(
            "images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E163", enumerable: !1, configurable: !0 },
        );
      var en = V.loader || K;
      (delete V.loader, delete V.srcSet);
      var ea = "__next_img_default" in en;
      if (ea) {
        if ("custom" === Z.loader)
          throw Object.defineProperty(
            Error(
              'Image with src "'.concat(x, '" is missing "loader" prop.') +
                "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader",
            ),
            "__NEXT_ERROR_CODE",
            { value: "E252", enumerable: !1, configurable: !0 },
          );
      } else {
        var eo = en;
        en = function (e) {
          return (e.config, eo(a._(e, ["config"])));
        };
      }
      if (W) {
        "fill" === W && (k = !0);
        var es = {
          intrinsic: { maxWidth: "100%", height: "auto" },
          responsive: { width: "100%", height: "auto" },
        }[W];
        es && (T = i._({}, T, es));
        var el = { responsive: "100vw", fill: "100vw" }[W];
        el && !w && (w = el);
      }
      var ec = "",
        eu = h(N),
        ed = h(L);
      if (
        (r = x) &&
        (void 0 === r ? "undefined" : c._(r)) === "object" &&
        (m(r) || void 0 !== r.src)
      ) {
        var ef = m(x) ? x.default : x;
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
          ((g = ef.blurWidth),
          (v = ef.blurHeight),
          (F = F || ef.blurDataURL),
          (ec = ef.src),
          !k)
        )
          if (eu || ed) {
            if (eu && !ed) {
              var ep = eu / ef.width;
              ed = Math.round(ef.height * ep);
            } else if (!eu && ed) {
              var em = ed / ef.height;
              eu = Math.round(ef.width * em);
            }
          } else ((eu = ef.width), (ed = ef.height));
      }
      var eh = !C && !O && ("lazy" === R || void 0 === R);
      ((!(x = "string" == typeof x ? x : ec) ||
        x.startsWith("data:") ||
        x.startsWith("blob:")) &&
        ((S = !0), (eh = !1)),
        Z.unoptimized && (S = !0),
        ea &&
          !Z.dangerouslyAllowSVG &&
          x.split("?", 1)[0].endsWith(".svg") &&
          (S = !0));
      var eg = h(I),
        ev = Object.assign(
          k
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
          T,
        ),
        ey =
          J || "empty" === q
            ? null
            : "blur" === q
              ? 'url("data:image/svg+xml;charset=utf-8,'.concat(
                  (0, d.getImageBlurSvg)({
                    widthInt: eu,
                    heightInt: ed,
                    blurWidth: g,
                    blurHeight: v,
                    blurDataURL: F || "",
                    objectFit: ev.objectFit,
                  }),
                  '")',
                )
              : 'url("'.concat(q, '")'),
        eb = p.includes(ev.objectFit)
          ? "fill" === ev.objectFit
            ? "100% 100%"
            : "cover"
          : ev.objectFit,
        e_ = ey
          ? {
              backgroundSize: eb,
              backgroundPosition: ev.objectPosition || "50% 50%",
              backgroundRepeat: "no-repeat",
              backgroundImage: ey,
            }
          : {},
        ex = (function (e) {
          var t = e.config,
            r = e.src,
            i = e.unoptimized,
            n = e.width,
            a = e.quality,
            o = e.sizes,
            s = e.loader;
          if (i) {
            if (r.startsWith("/") && !r.startsWith("//")) {
              var c = (0, u.getDeploymentId)();
              if (c) {
                var d = r.indexOf("?");
                if (-1 !== d) {
                  var f = new URLSearchParams(r.slice(d + 1));
                  f.get("dpl") ||
                    (f.append("dpl", c),
                    (r = r.slice(0, d) + "?" + f.toString()));
                } else r += "?dpl=".concat(c);
              }
            }
            return { src: r, srcSet: void 0, sizes: void 0 };
          }
          var p = (function (e, t, r) {
              var i = e.deviceSizes,
                n = e.allSizes;
              if (r) {
                for (var a = /(^|\s)(1?\d?\d)vw/g, o = []; (s = a.exec(r));)
                  o.push(parseInt(s[2]));
                if (o.length) {
                  var s,
                    c,
                    u = 0.01 * (c = Math).min.apply(c, l._(o));
                  return {
                    widths: n.filter(function (e) {
                      return e >= i[0] * u;
                    }),
                    kind: "w",
                  };
                }
                return { widths: n, kind: "w" };
              }
              return "number" != typeof t
                ? { widths: i, kind: "w" }
                : {
                    widths: l._(
                      new Set(
                        [t, 2 * t].map(function (e) {
                          return (
                            n.find(function (t) {
                              return t >= e;
                            }) || n[n.length - 1]
                          );
                        }),
                      ),
                    ),
                    kind: "x",
                  };
            })(t, n, o),
            m = p.widths,
            h = p.kind,
            g = m.length - 1;
          return {
            sizes: o || "w" !== h ? o : "100vw",
            srcSet: m
              .map(function (e, i) {
                return ""
                  .concat(s({ config: t, src: r, quality: a, width: e }), " ")
                  .concat("w" === h ? e : i + 1)
                  .concat(h);
              })
              .join(", "),
            src: s({ config: t, src: r, quality: a, width: m[g] }),
          };
        })({
          config: Z,
          src: x,
          unoptimized: S,
          width: eu,
          quality: eg,
          sizes: w,
          loader: en,
        }),
        ew = eh ? "lazy" : R;
      return {
        props: n._(i._({}, V), {
          loading: ew,
          fetchPriority: U,
          width: eu,
          height: ed,
          decoding: void 0 === B ? "async" : B,
          className: E,
          style: i._({}, ev, e_),
          sizes: ex.sizes,
          srcSet: ex.srcSet,
          src: D || ex.src,
        }),
        meta: { unoptimized: S, preload: O || C, placeholder: q, fill: k },
      };
    }
  },
  18556,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "ImageConfigContext", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    var i = e.r(55682)._(e.r(71645)),
      n = e.r(87690),
      a = i.default.createContext(n.imageConfigDefault);
  },
  65856,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "RouterContext", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    var i = e.r(55682)._(e.r(71645)).default.createContext(null);
  },
  70965,
  (e, t, r) => {
    "use strict";
    function i(e, t) {
      var r,
        i = e || 75;
      return (null == t || null == (r = t.qualities) ? void 0 : r.length)
        ? t.qualities.reduce(function (e, t) {
            return Math.abs(t - i) < Math.abs(e - i) ? t : e;
          }, t.qualities[0])
        : i;
    }
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "findClosestQuality", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
  },
  1948,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    var i = e.r(70965),
      n = e.r(43369);
    function a(e) {
      var t,
        r = e.config,
        a = e.src,
        o = e.width,
        s = e.quality,
        l = (0, n.getDeploymentId)();
      if (a.startsWith("/") && !a.startsWith("//")) {
        var c = a.indexOf("?");
        if (-1 !== c) {
          var u = new URLSearchParams(a.slice(c + 1)),
            d = u.get("dpl");
          if (d) {
            ((l = d), u.delete("dpl"));
            var f = u.toString();
            a = a.slice(0, c) + (f ? "?" + f : "");
          }
        }
      }
      if (
        a.startsWith("/") &&
        a.includes("?") &&
        (null == (t = r.localPatterns) ? void 0 : t.length) === 1 &&
        "**" === r.localPatterns[0].pathname &&
        "" === r.localPatterns[0].search
      )
        throw Object.defineProperty(
          Error(
            'Image with src "'.concat(
              a,
              '" is using a query string which is not configured in images.localPatterns.',
            ) +
              "\nRead more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E871", enumerable: !1, configurable: !0 },
        );
      var p = (0, i.findClosestQuality)(s, r);
      return ""
        .concat(r.path, "?url=")
        .concat(encodeURIComponent(a), "&w=")
        .concat(o, "&q=")
        .concat(p)
        .concat(a.startsWith("/") && l ? "&dpl=".concat(l) : "");
    }
    a.__next_img_default = !0;
    var o = a;
  },
  85437,
  (e, t, r) => {
    "use strict";
    var i = e.r(44086),
      n = e.r(4571),
      a = e.r(95692),
      o = e.r(91470),
      s = e.r(98544),
      l = e.r(21991),
      c = e.r(68996);
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "Image", {
        enumerable: !0,
        get: function () {
          return z;
        },
      }));
    var u = e.r(55682),
      d = e.r(90809),
      f = e.r(43476),
      p = d._(e.r(71645)),
      m = u._(e.r(74080)),
      h = u._(e.r(25633)),
      g = e.r(8927),
      v = e.r(87690),
      y = e.r(18556);
    e.r(33525);
    var b = e.r(65856),
      _ = u._(e.r(1948)),
      x = e.r(18581),
      w = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        qualities: [75, 90],
        path: "/_next/image",
        loader: "default",
        dangerouslyAllowSVG: !1,
        unoptimized: !1,
      };
    function j(e, t, r, a, o, s, l) {
      var c = null == e ? void 0 : e.src;
      e &&
        e["data-loaded-src"] !== c &&
        ((e["data-loaded-src"] = c),
        ("decode" in e ? e.decode() : Promise.resolve())
          .catch(function () {})
          .then(function () {
            if (e.parentElement && e.isConnected) {
              if (("empty" !== t && o(!0), null == r ? void 0 : r.current)) {
                var s = new Event("load");
                Object.defineProperty(s, "target", { writable: !1, value: e });
                var l = !1,
                  c = !1;
                r.current(
                  n._(i._({}, s), {
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
              (null == a ? void 0 : a.current) && a.current(e);
            }
          }));
    }
    function S(e) {
      return p.use ? { fetchPriority: e } : { fetchpriority: e };
    }
    "u" < typeof window && (globalThis.__NEXT_IMAGE_IMPORTED = !0);
    var P = (0, p.forwardRef)(function (e, t) {
      var r = s._([e, t]),
        l = r[0],
        c = r.slice(1),
        u = l.src,
        d = l.srcSet,
        m = l.sizes,
        h = l.height,
        g = l.width,
        v = l.decoding,
        y = l.className,
        b = l.style,
        _ = l.fetchPriority,
        w = l.placeholder,
        P = l.loading,
        C = l.unoptimized,
        z = l.fill,
        O = l.onLoadRef,
        R = l.onLoadingCompleteRef,
        E = l.setBlurComplete,
        I = l.setShowAltText,
        N = l.sizesInput,
        L = (l.onLoad, l.onError),
        M = a._(l, [
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
        k = o._(c, 1)[0],
        T = (0, p.useCallback)(
          function (e) {
            e && (L && (e.src = e.src), e.complete && j(e, w, O, R, E, C, N));
          },
          [u, w, O, R, E, L, C, N],
        ),
        D = (0, x.useMergedRef)(k, T);
      return (0, f.jsx)(
        "img",
        n._(i._({}, M, S(_)), {
          loading: P,
          width: g,
          height: h,
          decoding: v,
          "data-nimg": z ? "fill" : "1",
          className: y,
          style: b,
          sizes: m,
          srcSet: d,
          src: u,
          ref: D,
          onLoad: function (e) {
            j(e.currentTarget, w, O, R, E, C, N);
          },
          onError: function (e) {
            (I(!0), "empty" !== w && E(!0), L && L(e));
          },
        }),
      );
    });
    function C(e) {
      var t = e.isAppRouter,
        r = e.imgAttributes,
        n = i._(
          {
            as: "image",
            imageSrcSet: r.srcSet,
            imageSizes: r.sizes,
            crossOrigin: r.crossOrigin,
            referrerPolicy: r.referrerPolicy,
          },
          S(r.fetchPriority),
        );
      return t && m.default.preload
        ? (m.default.preload(r.src, n), null)
        : (0, f.jsx)(h.default, {
            children: (0, f.jsx)(
              "link",
              i._({ rel: "preload", href: r.srcSet ? void 0 : r.src }, n),
              "__nimg-" + r.src + r.srcSet + r.sizes,
            ),
          });
    }
    var z = (0, p.forwardRef)(function (e, t) {
      var r = (0, p.useContext)(b.RouterContext),
        a = (0, p.useContext)(y.ImageConfigContext),
        s = (0, p.useMemo)(
          function () {
            var e,
              t = w || a || v.imageConfigDefault,
              r = l
                ._(t.deviceSizes)
                .concat(l._(t.imageSizes))
                .sort(function (e, t) {
                  return e - t;
                }),
              o = t.deviceSizes.sort(function (e, t) {
                return e - t;
              }),
              s =
                null == (e = t.qualities)
                  ? void 0
                  : e.sort(function (e, t) {
                      return e - t;
                    });
            return n._(i._({}, t), {
              allSizes: r,
              deviceSizes: o,
              qualities: s,
              localPatterns:
                "u" < typeof window
                  ? null == a
                    ? void 0
                    : a.localPatterns
                  : t.localPatterns,
            });
          },
          [a],
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
      var m = (0, p.useRef)(u);
      (0, p.useEffect)(
        function () {
          m.current = u;
        },
        [u],
      );
      var h = o._((0, p.useState)(!1), 2),
        x = h[0],
        j = h[1],
        S = o._((0, p.useState)(!1), 2),
        z = S[0],
        O = S[1],
        R = (0, g.getImgProps)(e, {
          defaultLoader: _.default,
          imgConf: s,
          blurComplete: x,
          showAltText: z,
        }),
        E = R.props,
        I = R.meta;
      return (0, f.jsxs)(f.Fragment, {
        children: [
          (0, f.jsx)(
            P,
            n._(i._({}, E), {
              unoptimized: I.unoptimized,
              placeholder: I.placeholder,
              fill: I.fill,
              onLoadRef: d,
              onLoadingCompleteRef: m,
              setBlurComplete: j,
              setShowAltText: O,
              sizesInput: e.sizes,
              ref: t,
            }),
          ),
          I.preload
            ? (0, f.jsx)(C, { isAppRouter: !r, imgAttributes: E })
            : null,
        ],
      });
    });
    ("function" == typeof r.default ||
      ("object" === c._(r.default) && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  90163,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(46932),
      i = [0.25, 0.1, 0.25, 1],
      n = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
      a = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: i } },
      };
    e.s([
      "FadeIn",
      0,
      function (e) {
        var n = e.children,
          a = e.delay,
          o = e.className;
        return (0, t.jsx)(r.motion.div, {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: void 0 === a ? 0 : a, ease: i },
          className: o,
          children: n,
        });
      },
      "FadeInView",
      0,
      function (e) {
        var n = e.children,
          a = e.delay,
          o = e.className;
        return (0, t.jsx)(r.motion.div, {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: !0, margin: "-40px" },
          transition: { duration: 0.6, delay: void 0 === a ? 0 : a, ease: i },
          className: o,
          children: n,
        });
      },
      "StaggerContainer",
      0,
      function (e) {
        var i = e.children,
          a = e.className;
        return (0, t.jsx)(r.motion.div, {
          variants: n,
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: !0, margin: "-40px" },
          className: a,
          children: i,
        });
      },
      "StaggerItem",
      0,
      function (e) {
        var i = e.children,
          n = e.className;
        return (0, t.jsx)(r.motion.div, {
          variants: a,
          className: n,
          children: i,
        });
      },
    ]);
  },
  94909,
  (e, t, r) => {
    "use strict";
    var i = e.r(91470);
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      default: function () {
        return d;
      },
      getImageProps: function () {
        return u;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    var o = e.r(55682),
      s = e.r(8927),
      l = e.r(85437),
      c = o._(e.r(1948));
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
        r = !0,
        n = !1,
        a = void 0;
      try {
        for (
          var o, l = Object.entries(t)[Symbol.iterator]();
          !(r = (o = l.next()).done);
          r = !0
        ) {
          var u = i._(o.value, 2),
            d = u[0],
            f = u[1];
          void 0 === f && delete t[d];
        }
      } catch (e) {
        ((n = !0), (a = e));
      } finally {
        try {
          r || null == l.return || l.return();
        } finally {
          if (n) throw a;
        }
      }
      return { props: t };
    }
    var d = l.Image;
  },
  57688,
  (e, t, r) => {
    t.exports = e.r(94909);
  },
  49729,
  (e) => {
    "use strict";
    var t = e.i(20786),
      r = e.i(92808),
      i = e.i(33027),
      n = e.i(51682),
      a = e.i(43476),
      o = e.i(71645),
      s = e.i(57688);
    e.s([
      "ImageWithSkeleton",
      0,
      function (e) {
        var l = e.onLoad,
          c = e.quality,
          u = (0, i._)(e, ["onLoad", "quality"]),
          d = (0, n._)((0, o.useState)(!1), 2),
          f = d[0],
          p = d[1],
          m = (0, n._)((0, o.useState)(!1), 2),
          h = m[0],
          g = m[1],
          v = (0, o.useRef)(!1);
        return (
          (0, o.useEffect)(function () {
            var e = setTimeout(function () {
              v.current || g(!0);
            }, 50);
            return function () {
              return clearTimeout(e);
            };
          }, []),
          (0, a.jsxs)(a.Fragment, {
            children: [
              h &&
                (0, a.jsx)("div", {
                  "aria-hidden": "true",
                  className:
                    "absolute inset-0 image-skeleton transition-opacity duration-300 ".concat(
                      f ? "opacity-0 pointer-events-none" : "opacity-100",
                    ),
                }),
              (0, a.jsx)(
                s.default,
                (0, r._)((0, t._)({}, u), {
                  quality: void 0 === c ? 90 : c,
                  onLoad: function (e) {
                    ((v.current = !0), p(!0), null == l || l(e));
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
      r = e.i(46932),
      i = {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.018, delayChildren: 0.05 },
        },
      },
      n = {
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
        var a = e.segments,
          o = e.className,
          s = (function (e) {
            var t = [],
              r = [],
              i = !0,
              n = !1,
              a = void 0;
            try {
              for (
                var o, s = e[Symbol.iterator]();
                !(i = (o = s.next()).done);
                i = !0
              ) {
                var l = o.value;
                " " === l.c
                  ? r.length
                    ? (t.push({ chars: r, space: !0 }), (r = []))
                    : t.push({ chars: [], space: !0 })
                  : r.push(l);
              }
            } catch (e) {
              ((n = !0), (a = e));
            } finally {
              try {
                i || null == s.return || s.return();
              } finally {
                if (n) throw a;
              }
            }
            return (r.length && t.push({ chars: r, space: !1 }), t);
          })(
            a.flatMap(function (e) {
              return e.text.split("").map(function (t) {
                var r;
                return { c: t, className: null != (r = e.className) ? r : "" };
              });
            }),
          );
        return (0, t.jsx)(r.motion.h1, {
          className: o,
          variants: i,
          initial: "hidden",
          animate: "visible",
          children: s.map(function (e, i) {
            return (0, t.jsxs)(
              "span",
              {
                style: { display: "inline-block", whiteSpace: "nowrap" },
                children: [
                  e.chars.map(function (e, i) {
                    return (0, t.jsx)(
                      r.motion.span,
                      {
                        variants: n,
                        className: e.className,
                        style: { display: "inline-block" },
                        children: e.c,
                      },
                      i,
                    );
                  }),
                  e.space &&
                    (0, t.jsx)("span", {
                      style: { display: "inline-block" },
                      children: " ",
                    }),
                ],
              },
              i,
            );
          }),
        });
      },
    ]);
  },
  34371,
  (e) => {
    "use strict";
    var t = e.i(40316),
      r = e.i(43476),
      i = e.i(46932),
      n = e.i(59529),
      a = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } },
      },
      o = {
        hidden: { y: 18, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
      };
    e.s([
      "CaseStudyHero",
      0,
      function (e) {
        var s = e.title,
          l = e.year,
          c = e.role,
          u = e.type,
          d = e.link,
          f = [
            { label: "Year", value: l },
            { label: "Role", value: c },
            { label: "Type", value: u },
          ].concat(
            (0, t._)(
              d ? [{ label: "Link", value: d.label, href: d.href }] : [],
            ),
          );
        return (0, r.jsx)("section", {
          className: "px-4 pt-10 md:pt-14 pb-10 md:pb-14",
          children: (0, r.jsxs)("div", {
            className:
              "max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-8",
            children: [
              (0, r.jsx)("div", { className: "hidden md:block" }),
              (0, r.jsxs)("div", {
                children: [
                  (0, r.jsx)(n.default, {
                    segments: [{ text: s }],
                    className:
                      "text-2xl leading-[1.05] tracking-[-2.56px] text-[#111111] mb-8",
                  }),
                  (0, r.jsx)(i.motion.div, {
                    className: "flex flex-wrap gap-x-8 gap-y-5",
                    variants: a,
                    initial: "hidden",
                    animate: "visible",
                    children: f.map(function (e) {
                      return (0, r.jsxs)(
                        i.motion.div,
                        {
                          variants: o,
                          children: [
                            (0, r.jsx)("p", {
                              className: "text-xs text-gray-400 mb-1",
                              children: e.label,
                            }),
                            e.href
                              ? (0, r.jsx)("a", {
                                  href: e.href,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  className:
                                    "text-sm text-[#111111] underline underline-offset-4 hover:text-gray-500 transition-colors",
                                  children: e.value,
                                })
                              : (0, r.jsx)("p", {
                                  className: "text-sm text-[#111111]",
                                  children: e.value,
                                }),
                          ],
                        },
                        e.label,
                      );
                    }),
                  }),
                ],
              }),
            ],
          }),
        });
      },
    ]);
  },
]);
