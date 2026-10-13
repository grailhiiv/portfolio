(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  62438,
  (t) => {
    "use strict";
    var n = t.i(51682),
      e = t.i(43476),
      r = t.i(71645),
      i = t.i(46932),
      o = t.i(86427),
      a = t.i(37806),
      u = t.i(47414);
    function s(t) {
      var e = (0, u.useConstant)(function () {
        return (0, o.motionValue)(t);
      });
      if ((0, r.useContext)(a.MotionConfigContext).isStatic) {
        var i = (0, n._)((0, r.useState)(t), 2)[1];
        (0, r.useEffect)(function () {
          return e.on("change", i);
        }, []);
      }
      return e;
    }
    var c = t.i(20786),
      f = t.i(92808),
      l = t.i(83352),
      v = t.i(83411),
      d = t.i(87022);
    function m(t) {
      return "number" == typeof t ? t : parseFloat(t);
    }
    var y = t.i(44230),
      p = t.i(74008);
    function g(t, n) {
      var e = s(n()),
        r = function () {
          return e.set(n());
        };
      return (
        r(),
        (0, p.useIsomorphicLayoutEffect)(function () {
          var n = function () {
              return d.frame.preRender(r, !1, !0);
            },
            e = t.map(function (t) {
              return t.on("change", n);
            });
          return function () {
            (e.forEach(function (t) {
              return t();
            }),
              (0, d.cancelFrame)(r));
          };
        }),
        e
      );
    }
    function h(t, n) {
      var e = (0, u.useConstant)(function () {
        return [];
      });
      return g(t, function () {
        e.length = 0;
        for (var r = t.length, i = 0; i < r; i++) e[i] = t[i].get();
        return n(e);
      });
    }
    function x(t) {
      var e =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return (function (t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = (0, r.useContext)(a.MotionConfigContext).isStatic,
          p = function () {
            return (0, v.isMotionValue)(t) ? t.get() : t;
          };
        if (i)
          return (function t(e, r, i, a) {
            if ("function" == typeof e) {
              var s;
              return (
                (o.collectMotionValues.current = []),
                e(),
                (s = g(o.collectMotionValues.current, e)),
                (o.collectMotionValues.current = void 0),
                s
              );
            }
            if (void 0 !== i && !Array.isArray(i) && "function" != typeof r)
              return (function (n, e, r, i) {
                var o = (0, u.useConstant)(function () {
                    return Object.keys(r);
                  }),
                  a = (0, u.useConstant)(function () {
                    return {};
                  }),
                  s = !0,
                  c = !1,
                  f = void 0;
                try {
                  for (
                    var l, v = o[Symbol.iterator]();
                    !(s = (l = v.next()).done);
                    s = !0
                  ) {
                    var d = l.value;
                    a[d] = t(n, e, r[d], i);
                  }
                } catch (t) {
                  ((c = !0), (f = t));
                } finally {
                  try {
                    s || null == v.return || v.return();
                  } finally {
                    if (c) throw f;
                  }
                }
                return a;
              })(e, r, i, a);
            var l =
                "function" == typeof r
                  ? r
                  : (function () {
                      for (
                        var t = arguments.length, n = Array(t), e = 0;
                        e < t;
                        e++
                      )
                        n[e] = arguments[e];
                      var r = !Array.isArray(n[0]),
                        i = r ? 0 : -1,
                        o = n[0 + i],
                        a = n[1 + i],
                        u = n[2 + i],
                        s = n[3 + i],
                        c = (0, y.interpolate)(a, u, s);
                      return r ? c(o) : c;
                    })(r, i, a),
              v = Array.isArray(e)
                ? h(e, l)
                : h([e], function (t) {
                    return l((0, n._)(t, 1)[0]);
                  }),
              d = Array.isArray(e) ? void 0 : e.accelerate;
            return (
              d &&
                !d.isTransformed &&
                "function" != typeof r &&
                Array.isArray(i) &&
                (null == a ? void 0 : a.clamp) !== !1 &&
                (v.accelerate = (0, c._)(
                  (0, f._)((0, c._)({}, d), {
                    times: r,
                    keyframes: i,
                    isTransformed: !0,
                  }),
                  (null == a ? void 0 : a.ease) ? { ease: a.ease } : {},
                )),
              v
            );
          })(p);
        var x = s(p());
        return (
          (0, r.useInsertionEffect)(
            function () {
              return (function (t, n) {
                var e,
                  r =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : {},
                  i = t.get(),
                  o = null,
                  a = i,
                  u = "string" == typeof i ? i.replace(/[\d.-]/g, "") : void 0,
                  s = function () {
                    (o && (o.stop(), (o = null)), (t.animation = void 0));
                  },
                  y = function () {
                    var n = m(t.get()),
                      i = m(a);
                    if (n === i) return void s();
                    var u = o ? o.getGeneratorVelocity() : t.getVelocity();
                    (s(),
                      (o = new l.JSAnimation(
                        (0, f._)(
                          (0, c._)(
                            {
                              keyframes: [n, i],
                              velocity: u,
                              type: "spring",
                              restDelta: 0.001,
                              restSpeed: 0.01,
                            },
                            r,
                          ),
                          { onUpdate: e },
                        ),
                      )));
                  },
                  p = function () {
                    var n;
                    (y(),
                      (t.animation = null != o ? o : void 0),
                      null == (n = t.events.animationStart) || n.notify(),
                      null == o ||
                        o.then(function () {
                          var n;
                          ((t.animation = void 0),
                            null == (n = t.events.animationComplete) ||
                              n.notify());
                        }));
                  };
                if (
                  (t.attach(function (t, n) {
                    ((a = t),
                      (e = function (t) {
                        var e, r;
                        return n(((e = t), (r = u) ? e + r : e));
                      }),
                      d.frame.postRender(p));
                  }, s),
                  (0, v.isMotionValue)(n))
                ) {
                  var g = !0 === r.skipInitialAnimation,
                    h = n.on("change", function (n) {
                      var e, r, i, o;
                      g
                        ? ((g = !1), t.jump(((e = n), (r = u) ? e + r : e), !1))
                        : t.set(((i = n), (o = u) ? i + o : i));
                    }),
                    x = t.on("destroy", h);
                  return function () {
                    (h(), x());
                  };
                }
                return s;
              })(x, t, e);
            },
            [x, JSON.stringify(e)],
          ),
          x
        );
      })(t, (0, c._)({ type: "spring" }, e));
    }
    t.s(
      [
        "default",
        0,
        function () {
          var t = s(-200),
            o = s(-200),
            a = x(t, { stiffness: 120, damping: 18, mass: 1 }),
            u = x(o, { stiffness: 120, damping: 18, mass: 1 }),
            c = (0, n._)((0, r.useState)(!1), 2),
            f = c[0],
            l = c[1],
            v = (0, n._)((0, r.useState)(!1), 2),
            d = v[0],
            m = v[1],
            y = (0, n._)((0, r.useState)(!1), 2),
            p = y[0],
            g = y[1];
          return ((0, r.useEffect)(function () {
            g(window.matchMedia("(pointer: coarse)").matches);
          }, []),
          (0, r.useEffect)(function () {
            var t = function (t) {
              t.target.closest("img") && t.preventDefault();
            };
            return (
              document.addEventListener("contextmenu", t),
              function () {
                return document.removeEventListener("contextmenu", t);
              }
            );
          }, []),
          (0, r.useEffect)(
            function () {
              var n = function (n) {
                  (t.set(n.clientX),
                    o.set(n.clientY),
                    m(!0),
                    l(
                      !!n.target.closest(
                        'a, button, [role="button"], label, select, input',
                      ),
                    ));
                },
                e = function () {
                  return m(!1);
                };
              return (
                window.addEventListener("mousemove", n),
                document.documentElement.addEventListener("mouseleave", e),
                function () {
                  (window.removeEventListener("mousemove", n),
                    document.documentElement.removeEventListener(
                      "mouseleave",
                      e,
                    ));
                }
              );
            },
            [t, o],
          ),
          p)
            ? null
            : (0, e.jsxs)("div", {
                className: "fixed inset-0 pointer-events-none z-[9999]",
                style: { mixBlendMode: "exclusion" },
                children: [
                  (0, e.jsx)(i.motion.div, {
                    style: {
                      x: a,
                      y: u,
                      translateX: "-50%",
                      translateY: "-50%",
                    },
                    animate: { width: 40, height: 40, opacity: 0.25 * !!d },
                    transition: { duration: 0.2 },
                    className:
                      "fixed top-0 left-0 rounded-full bg-white pointer-events-none",
                  }),
                  (0, e.jsx)(i.motion.div, {
                    style: {
                      x: t,
                      y: o,
                      translateX: "-50%",
                      translateY: "-50%",
                    },
                    animate: {
                      width: f ? 44 : 16,
                      height: f ? 44 : 16,
                      opacity: +!!d,
                    },
                    transition: { duration: 0.18, ease: "easeOut" },
                    className:
                      "fixed top-0 left-0 rounded-full bg-white pointer-events-none",
                  }),
                ],
              });
        },
      ],
      62438,
    );
  },
  72363,
  (t) => {
    t.n(t.i(62438));
  },
]);
