window.OnlineWebFonts_Animations =
  window.OnlineWebFonts_Animations ||
  function (t) {
    return "object" != typeof t
      ? this
      : {
          Config: {},
          Index: {
            Key: "www.onlinewebfonts.com",
            Id: null,
            Data: {
              Config: {
                Width: 3,
                Opacity: 1,
                StrokeDot: !0,
                Sequential: !0,
                Display: !0,
                Reverse: !1,
                Color: "#000000",
                Animate: "Linear",
              },
            },
            Svg: {},
            Path: [],
            Div: null,
            An: null,
            Dom: null,
            Pause: !1,
            Complete: null,
            Status: null,
          },
          Run: function (t) {
            this.Config = this.Index;
            var n = this.Config,
              e = n.Data;
            for (var i in e.Config)
              null != t.Data.Config[i] && (e.Config[i] = t.Data.Config[i]);
            return (
              (n.Id = t.Id),
              (n.Data.Line = t.Data.Line),
              (n.Data.Box = t.Data.Box),
              "function" == typeof t.Complete && (n.Complete = t.Complete),
              "function" == typeof t.Status && (n.Status = t.Status),
              this.Append().PathAppend(),
              this
            );
          },
          Play: function () {
            var t = this;
            return (
              t.Stop(),
              (t.Config.An = requestAnimationFrame(function (n) {
                t.Update(n);
              })),
              this
            );
          },
          Pause: function () {
            return (
              this.Config.Pause ||
                ((this.Config.Pause = !0),
                cancelAnimationFrame(this.Config.An)),
              this
            );
          },
          Resume: function () {
            var t = this;
            return (
              t.Config.Pause &&
                ((t.Config.Pause = !1),
                requestAnimationFrame(function (n) {
                  t.ResumeUpdate(n);
                })),
              this
            );
          },
          Stop: function () {
            return (
              (this.Config.Div.innerHTML = ""),
              this.Append().PathAppend(),
              cancelAnimationFrame(this.Config.An),
              this
            );
          },
          ResumeUpdate: function (t) {
            var n = this,
              e = n.Config.Svg.Time.Data;
            (e.Start = t - e.Elapsed),
              requestAnimationFrame(function (t) {
                n.Update(t);
              });
          },
          Update: function (t) {
            var n = this,
              e = n.Config,
              i = e.Data,
              r = e.Svg.Time.Data;
            if (
              (0 == r.Start && (r.Start = t),
              (r.Elapsed = t - r.Start),
              (r.Progress = n.Progress(
                r.Total,
                r.Start,
                r.Elapsed,
                i.Config.Animate
              )),
              n.UpdatePath(),
              r.Progress < 1)
            ) {
              if (null !== e.Status) {
                var a = Math.round(100 * r.Progress);
                e.Status(99 == a ? 100 : a, e.Id);
              }
              n.Config.An = requestAnimationFrame(function (t) {
                n.Update(t);
              });
            } else null !== e.Complete && e.Complete();
          },
          UpdatePath: function () {
            for (
              var t = this.Config.Svg.Time.Path, n = 0;
              n < this.Config.Dom.length;
              n++
            ) {
              var e = this.PathElapsed(n);
              (t[n].Progress = this.Progress(
                1,
                0,
                e,
                this.Config.Data.Config.Animate
              )),
                this.SetLine(n);
            }
          },
          SetLine: function (t) {
            var n = this.Config.Svg,
              e = n.Time.Path,
              i = this.Config.Dom,
              r = e[t].Progress * n.Path.Length[t];
            if (this.Config.Data.Config.Reverse) var a = -n.Path.Length[t] + r;
            else a = n.Path.Length[t] - r;
            i[t].style.strokeDashoffset = a;
          },
          PathElapsed: function (t) {
            var n,
              e = this.Config.Svg.Time,
              i = e.Path[t];
            return (
              e.Data.Progress > i.StartPro &&
              e.Data.Progress < i.StartPro + i.Duration
                ? (n = (e.Data.Progress - i.StartPro) / i.Duration)
                : e.Data.Progress >= i.StartPro + i.Duration
                ? (n = 1)
                : e.Data.Progress <= i.StartPro && (n = 0),
              n
            );
          },
          Progress: function (t, n, e, i) {
            var r;
            return (
              e > 0 && e < t
                ? (r = i ? this.Ease[i](e, 0, 1, t) : e / t)
                : e >= t
                ? (r = 1)
                : e <= n && (r = 0),
              r
            );
          },
          PathAppend: function () {
            var t = this.Config,
              n = t.Data,
              e = t.Svg.Time;
            e.Path = [];
            var i = n.Config.Reverse ? e.Data.Total : 0;
            for (var r in n.Line) {
              var a = parseInt(n.Line[r].Duration),
                o = a / e.Data.Total;
              n.Config.Reverse
                ? (i -= a)
                : (i = n.Config.Sequential ? e.Data.Delay : 0);
              var u = i / e.Data.Total;
              (e.Data.Delay += a),
                (e.Path[r] = { Start: i, Duration: o, StartPro: u });
            }
          },
          Append: function () {
            var t = this.Config,
              n = t.Data,
              e = t.Svg,
              i = this.SVGElement();
            (e.Path = {}),
              (e.Time = {}),
              (e.Time.Data = {
                Start: 0,
                Elapsed: 0,
                Total: 0,
                Duration: 0,
                Progress: 0,
                Delay: 0,
              }),
              (e.Path.Length = []);
            var r = 0;
            for (var a in n.Line) {
              var o = {
                  "fill-opacity": "0",
                  "stroke-linecap": n.Config.StrokeDot ? "round" : "butt",
                  "stroke-linejoin": "round",
                  stroke: n.Line[a].Color ? n.Line[a].Color : n.Config.Color,
                  "stroke-opacity": n.Config.StrokeDot ? n.Config.Opacity : "0",
                  "stroke-width": n.Line[a].Width
                    ? n.Line[a].Width
                    : n.Config.Width,
                  d: n.Line[a].Path,
                },
                u = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "path"
                );
              for (var s in o) u.setAttribute(s, o[s]);
              var f = Math.ceil(u.getTotalLength());
              (e.Path.Length[a] = f),
                u.setAttribute(
                  "style",
                  "stroke-dasharray:" +
                    f +
                    "," +
                    f +
                    ";stroke-dashoffset:" +
                    (n.Config.Display ? "0" : f) +
                    ";"
                ),
                i.appendChild(u),
                t.Path.push(u),
                0 == n.Line[a].Duration &&
                  (n.Line[a].Duration = this.GetPathDuration(n.Line[a].Path)),
                n.Config.Sequential
                  ? (r += parseInt(n.Line[a].Duration))
                  : parseInt(n.Line[a].Duration) > r &&
                    (r = parseInt(n.Line[a].Duration));
            }
            return (
              (e.Time.Data.Total = r),
              (t.Div = document.querySelector(t.Id)),
              t.Div.appendChild(i),
              (t.Dom = t.Div.children[0].childNodes),
              this
            );
          },
          GetPathDuration: function (t) {
            var n = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            return n.setAttribute("d", t), Math.ceil(n.getTotalLength());
          },
          SVGElement: function (t) {
            var n = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            n.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            var e = this.Config.Data.Box.Width,
              i = this.Config.Data.Box.Height;
            return n.setAttribute("viewBox", "0 0 " + e + " " + i), n;
          },
          Ease: {
            Linear: function (t, n, e, i) {
              return (e * t) / i + n;
            },
            InQuad: function (t, n, e, i) {
              return e * (t /= i) * t + n;
            },
            OutQuad: function (t, n, e, i) {
              return -e * (t /= i) * (t - 2) + n;
            },
            InOutQuad: function (t, n, e, i) {
              return (t /= i / 2) < 1
                ? (e / 2) * t * t + n
                : (-e / 2) * (--t * (t - 2) - 1) + n;
            },
            InCubic: function (t, n, e, i) {
              return e * (t /= i) * t * t + n;
            },
            OutCubic: function (t, n, e, i) {
              return e * ((t = t / i - 1) * t * t + 1) + n;
            },
            InOutCubic: function (t, n, e, i) {
              return (t /= i / 2) < 1
                ? (e / 2) * t * t * t + n
                : (e / 2) * ((t -= 2) * t * t + 2) + n;
            },
            InQuart: function (t, n, e, i) {
              return e * (t /= i) * t * t * t + n;
            },
            OutQuart: function (t, n, e, i) {
              return -e * ((t = t / i - 1) * t * t * t - 1) + n;
            },
            InOutQuart: function (t, n, e, i) {
              return (t /= i / 2) < 1
                ? (e / 2) * t * t * t * t + n
                : (-e / 2) * ((t -= 2) * t * t * t - 2) + n;
            },
            InQuint: function (t, n, e, i) {
              return e * (t /= i) * t * t * t * t + n;
            },
            OutQuint: function (t, n, e, i) {
              return e * ((t = t / i - 1) * t * t * t * t + 1) + n;
            },
            InOutQuint: function (t, n, e, i) {
              return (t /= i / 2) < 1
                ? (e / 2) * t * t * t * t * t + n
                : (e / 2) * ((t -= 2) * t * t * t * t + 2) + n;
            },
            InSine: function (t, n, e, i) {
              return -e * Math.cos((t / i) * (Math.PI / 2)) + e + n;
            },
            OutSine: function (t, n, e, i) {
              return e * Math.sin((t / i) * (Math.PI / 2)) + n;
            },
            InOutSine: function (t, n, e, i) {
              return (-e / 2) * (Math.cos((Math.PI * t) / i) - 1) + n;
            },
            InExpo: function (t, n, e, i) {
              return 0 == t ? n : e * Math.pow(2, 10 * (t / i - 1)) + n;
            },
            OutExpo: function (t, n, e, i) {
              return t == i ? n + e : e * (1 - Math.pow(2, (-10 * t) / i)) + n;
            },
            InOutExpo: function (t, n, e, i) {
              return 0 == t
                ? n
                : t == i
                ? n + e
                : (t /= i / 2) < 1
                ? (e / 2) * Math.pow(2, 10 * (t - 1)) + n
                : (e / 2) * (2 - Math.pow(2, -10 * --t)) + n;
            },
            InCirc: function (t, n, e, i) {
              return -e * (Math.sqrt(1 - (t /= i) * t) - 1) + n;
            },
            OutCirc: function (t, n, e, i) {
              return e * Math.sqrt(1 - (t = t / i - 1) * t) + n;
            },
            InOutCirc: function (t, n, e, i) {
              return (t /= i / 2) < 1
                ? (-e / 2) * (Math.sqrt(1 - t * t) - 1) + n
                : (e / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + n;
            },
            InElastic: function (t, n, e, i) {
              var r = 1.70158,
                a = 0,
                o = e;
              if (0 == t) return n;
              if (1 == (t /= i)) return n + e;
              if ((a || (a = 0.3 * i), o < Math.abs(e))) {
                o = e;
                r = a / 4;
              } else r = (a / (2 * Math.PI)) * Math.asin(e / o);
              return (
                -o *
                  Math.pow(2, 10 * (t -= 1)) *
                  Math.sin(((t * i - r) * (2 * Math.PI)) / a) +
                n
              );
            },
            OutElastic: function (t, n, e, i) {
              var r = 1.70158,
                a = 0,
                o = e;
              if (0 == t) return n;
              if (1 == (t /= i)) return n + e;
              if ((a || (a = 0.3 * i), o < Math.abs(e))) {
                o = e;
                r = a / 4;
              } else r = (a / (2 * Math.PI)) * Math.asin(e / o);
              return (
                o *
                  Math.pow(2, -10 * t) *
                  Math.sin(((t * i - r) * (2 * Math.PI)) / a) +
                e +
                n
              );
            },
            InOutElastic: function (t, n, e, i) {
              var r = 1.70158,
                a = 0,
                o = e;
              if (0 == t) return n;
              if (2 == (t /= i / 2)) return n + e;
              if ((a || (a = i * (0.3 * 1.5)), o < Math.abs(e))) {
                o = e;
                r = a / 4;
              } else r = (a / (2 * Math.PI)) * Math.asin(e / o);
              return t < 1
                ? o *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin(((t * i - r) * (2 * Math.PI)) / a) *
                    -0.5 +
                    n
                : o *
                    Math.pow(2, -10 * (t -= 1)) *
                    Math.sin(((t * i - r) * (2 * Math.PI)) / a) *
                    0.5 +
                    e +
                    n;
            },
            InBack: function (t, n, e, i, r) {
              return (
                null == r && (r = 1.70158),
                e * (t /= i) * t * ((r + 1) * t - r) + n
              );
            },
            OutBack: function (t, n, e, i, r) {
              return (
                null == r && (r = 1.70158),
                e * ((t = t / i - 1) * t * ((r + 1) * t + r) + 1) + n
              );
            },
            InOutBack: function (t, n, e, i, r) {
              return (
                null == r && (r = 1.70158),
                (t /= i / 2) < 1
                  ? (e / 2) * (t * t * ((1 + (r *= 1.525)) * t - r)) + n
                  : (e / 2) *
                      ((t -= 2) * t * ((1 + (r *= 1.525)) * t + r) + 2) +
                    n
              );
            },
            InBounce: function (t, n, e, i) {
              return e - this.OutBounce(i - t, 0, e, i) + n;
            },
            OutBounce: function (t, n, e, i) {
              return (t /= i) < 1 / 2.75
                ? e * (7.5625 * t * t) + n
                : t < 2 / 2.75
                ? e * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + n
                : t < 2.5 / 2.75
                ? e * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + n
                : e * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + n;
            },
            InOutBounce: function (t, n, e, i) {
              return t < i / 2
                ? 0.5 * this.InBounce(2 * t, 0, e, i) + n
                : 0.5 * this.OutBounce(2 * t - i, 0, e, i) + 0.5 * e + n;
            },
          },
        }.Run(t);
  };
window.OnlineWebFonts_Com =
  window.OnlineWebFonts_Com ||
  function (t) {
    return new OnlineWebFonts_Animations(t);
  };
if (typeof Object.assign != "function") {
  Object.assign = function (e) {
    e = Object(e);
    for (var i = 1; i < arguments.length; i++) {
      var s = arguments[i];
      if (s != null) {
        for (var k in s) {
          if (Object.prototype.hasOwnProperty.call(s, k)) {
            e[k] = s[k];
          }
        }
      }
    }
    return e;
  };
}
window.__Animations = Object.assign(window.__Animations || {}, {
  405942: {
    Line: [
      {
        Duration: "1437",
        Width: "3",
        Color: "#e5e2e2",
        Path: "M128,10C62.8,10,10,62.8,10,128c0,65.2,52.8,118,118,118c65.2,0,118-52.8,118-118C246,62.8,193.2,10,128,10z M128,238.6c-61.1,0-110.6-49.5-110.6-110.6C17.4,66.9,66.9,17.4,128,17.4c61.1,0,110.6,49.5,110.6,110.6C238.6,189.1,189.1,238.6,128,238.6z",
      },
      {
        Duration: "750",
        Width: "3",
        Color: "#ff0707",
        Path: "M153.8,129.9c9-7.4,14.7-18.7,14.7-31.3c0-22.4-18.2-40.6-40.6-40.6c-22.4,0-40.6,18.2-40.6,40.6c0,12.6,5.7,23.8,14.7,31.3c-21.7,9.8-36.9,31.7-36.9,57.1c0,2,1.7,3.7,3.7,3.7s3.7-1.6,3.7-3.7c0-24.2,15.5-44.6,37.1-52.2c5.5,2.8,11.7,4.4,18.3,4.4s12.8-1.6,18.3-4.4c21.6,7.6,37.1,28,37.1,52.2c0,2,1.6,3.7,3.7,3.7s3.7-1.6,3.7-3.7C190.7,161.5,175.6,139.7,153.8,129.9z M94.8,98.6c0-18.3,14.9-33.2,33.2-33.2s33.2,14.9,33.2,33.2c0,17.8-14,32.3-31.6,33.1c-0.5,0-1.1-0.1-1.6-0.1s-1.1,0-1.6,0.1C108.8,130.8,94.8,116.4,94.8,98.6z",
      },
    ],
    Box: { Width: "256", Height: "256" },
    Config: {
      Width: "3",
      Opacity: "1",
      Sequential: false,
      Animate: "Linear",
      Color: "#000000",
      Reverse: false,
    },
  },
});
