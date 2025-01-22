(function (t) {
  var e = {};
  function r(i) {
    if (e[i]) {
      return e[i].exports;
    }
    var o = e[i] = {
      i: i,
      l: false,
      exports: {}
    };
    t[i].call(o.exports, o, o.exports, r);
    o.l = true;
    return o.exports;
  }
  r.m = t;
  r.c = e;
  r.d = function (t, e, i) {
    if (!r.o(t, e)) {
      Object.defineProperty(t, e, {
        enumerable: true,
        get: i
      });
    }
  };
  r.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  r.t = function (t, e) {
    if (e & 1) {
      t = r(t);
    }
    if (e & 8) {
      return t;
    }
    if (e & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var i = Object.create(null);
    r.r(i);
    Object.defineProperty(i, "default", {
      enumerable: true,
      value: t
    });
    if (e & 2 && typeof t != "string") {
      for (var o in t) {
        r.d(i, o, function (e) {
          return t[e];
        }.bind(null, o));
      }
    }
    return i;
  };
  r.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    r.d(e, "a", e);
    return e;
  };
  r.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  };
  r.p = "";
  r(r.s = 0);
})([function (t, e, r) {
  var i;
  var o;
  var n;
  var a;
  i = [];
  o = true;
  n = null;
  (a = function (t) {
    this.vue = t.vue || null;
    this.mode = t.mode || "production";
    this.time = t.time || 3;
    this.num = t.num || 5;
    this.jsErrorInfo = {};
    this.count = 0;
    this.cdn = "https://static.mobilelegends.com/resource/report/public/";
    this.url = "https://api.mobilelegends.com/r";
    this.ipUrl = "https://api.mobilelegends.com/base/ip";
    this.pako = null;
    this.platform = "";
    this.version = "";
    this.brand = "";
    this.engine = "";
    this.supporter = "";
    this.supporterVs = "";
    this.errData = {
      error: {
        act_type: t.activity,
        proj: t.project || "mlbb"
      },
      url: window.location.href.split("?")[0],
      params: window.location.href.split("?")[1] || "",
      type: "error",
      fp: window.localStorage.getItem("__murmur__") || ""
    };
    if (!t.activity) {
      throw Error("activity must be exist");
    }
    this.visitData = {
      fp: window.localStorage.getItem("__murmur__") || "",
      type: "event",
      ffp: "",
      fzoneid: "",
      froleid: "",
      data: {
        act_type: t.activity,
        proj: t.project || "mlbb"
      }
    };
    this.murmur = "";
    this.init();
  }).prototype = {
    constructor: a,
    init: function () {
      this.listenError();
      this.beforeClose();
    },
    listenError: function () {
      var t = this;
      if (window.Vue && Vue.config) {
        Vue.config.errorHandler = function (e, r, i) {
          if (t.errData.error.stack) {
            if (t.count < 30) {
              t.errData.error.stack += "\n" + t.ClearBr(e.stack);
            }
          } else {
            t.errData.error.stack = t.ClearBr(e.stack);
          }
          t.sendData();
          console.error(e);
        };
      } else {
        window.onunhandledrejection = function (e) {
          t.errData.error.message = e.reason;
          t.sendData();
          return true;
        };
        window.onerror = function (e, r, i, o, n) {
          t.jsErrorInfo = {
            errorMessage: e,
            scriptURI: r,
            lineNo: i,
            columnNo: o,
            error: n
          };
          t.errData.error.message = e;
          t.errData.error.location = `${r}:${i}:${o}`;
          if (t.errData.error.stack) {
            var a = new RegExp("\n", "g");
            var s = t.errData.error.stack.match(a);
            t.count = s ? s.length : 0;
            if (t.count < 30) {
              t.errData.error.stack += n && "\n" + t.ClearBr(n.stack);
            }
          } else {
            t.errData.error.stack = n && t.ClearBr(n.stack);
          }
          t.sendData();
        };
        this.interceptConsoleError();
      }
    },
    isObject: function (t) {
      return Object.prototype.toString.call(t) === "[object Object]";
    },
    interceptConsoleError: function () {
      var t = this;
      var e = console.error;
      console.error = function (r) {
        t.errData.error.message = (t.isObject(r) ? r.message : r) || "Unknown Error";
        t.errData.error.location = "";
        if (t.isObject(r)) {
          t.errData.error.stack = r.stack ? t.ClearBr(r.stack) : "";
        }
        t.sendData();
        e(r);
      };
    },
    ClearBr: function (t) {
      return t = (t = t.replace(/<\/?.+?>/g, "")).replace(/[\r\n]/g, "");
    },
    getCookie: function (t) {
      if (document.cookie.length > 0) {
        var e = document.cookie.indexOf(t + "=");
        if (e !== -1) {
          e += t.length + 1;
          var r = document.cookie.indexOf(";", e);
          if (r === -1) {
            r = document.cookie.length;
          }
          return unescape(document.cookie.substring(e, r));
        }
      }
      return null;
    },
    fingerHash: function (t, e) {
      if (window.localStorage.getItem("__murmur__")) {
        var r = window.localStorage.getItem("__murmur__");
        this.errData.fp = r;
        this.visitData.fp = r;
        e();
      } else {
        var i = this;
        if (this.murmur) {
          this.errData.fp = this.murmur;
          this.visitData.fp = this.murmur;
          e();
          return false;
        }
        Fingerprint2.get(t, function (t) {
          i.murmur = Fingerprint2.x64hash128(t.map(function (t) {
            return t.value;
          }).join(), 31);
          i.errData.fp = i.murmur;
          i.visitData.fp = i.murmur;
          if (i.murmur) {
            window.localStorage.setItem("__murmur__", i.murmur);
          }
          e();
        });
      }
    },
    OSnow: function () {
      var t = navigator.userAgent.toLowerCase();
      var e = /macintosh|mac os x/i.test(navigator.userAgent);
      if (t.indexOf("win32") >= 0 || t.indexOf("wow32") >= 0) {
        return "win32";
      } else if (t.indexOf("win64") >= 0 || t.indexOf("wow64") >= 0) {
        return "win64";
      } else if (e) {
        return "mac";
      } else {
        return undefined;
      }
    },
    judgeClient: function () {
      try {
        var t = navigator.userAgent;
        var e = t.indexOf("Android") > -1 || t.indexOf("Adr") > -1;
        var r = !!t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (e) {
          return "Android";
        } else if (r) {
          return "IOS";
        } else {
          return this.OSnow();
        }
      } catch (t) {
        return "Android";
      }
    },
    getPcVersion: function () {
      return "";
    },
    getAndroidVersion: function () {
      try {
        var t = navigator.userAgent.toLowerCase();
        var e = "";
        if (t.indexOf("android") > 0) {
          e = (t.match(/android [\d._]+/gi) + "").replace(/[^0-9|_.]/gi, "").replace(/_/gi, ".");
        }
        return e;
      } catch (t) {
        return "";
      }
    },
    getIosVersion: function () {
      try {
        var t = navigator.userAgent.toLowerCase();
        var e = "";
        if (t.indexOf("like mac os x") > 0) {
          e = (t.match(/os [\d._]+/gi) + "").replace(/[^0-9|_.]/gi, "").replace(/_/gi, ".");
        }
        return e;
      } catch (t) {
        return "";
      }
    },
    getBrand: function (t) {
      var e = t.match(/iphone/i) == "iphone";
      var r = t.match(/huawei/i) == "huawei";
      var i = t.match(/honor/i) == "honor";
      var o = t.match(/oppo/i) == "oppo";
      var n = t.match(/pacm00/i) == "pacm00";
      var a = t.match(/vivo/i) == "vivo";
      var s = t.match(/mi\s/i) == "mi ";
      var c = t.match(/mix\s/i) == "mix ";
      var u = t.match(/redmi/i) == "redmi";
      var p = t.match(/sm-/i) == "sm-";
      var h = t.match(/pixel/i) == "pixel";
      if (e) {
        return "iphone";
      } else if (r || i) {
        return "huawei";
      } else if (o || n) {
        return "oppo";
      } else if (a) {
        return "vivo";
      } else if (s || u || c) {
        return "xiaomi";
      } else if (p) {
        return "samsung";
      } else if (h) {
        return "pixel";
      } else {
        return "other";
      }
    },
    intervalLog: function () {
      if (n) {
        clearInterval(n);
      }
      n = null;
      var t = Number(this.time) ? Number(this.time) : 2;
      var e = this;
      n = setInterval(function () {
        if (i.length > 0) {
          e.addLog();
        }
      }, t <= 3 ? 3000 : t * 1000);
    },
    beforeClose: function () {
      var t = this;
      window.onbeforeunload = function () {
        if (i && i.length > 0) {
          t.addLog();
        }
      };
    },
    getBroswer: function () {
      var t = navigator.userAgent.toLowerCase();
      function e(e) {
        return e.test(t);
      }
      function r(e) {
        return (t.match(e) || "").toString().replace(/[^0-9|_.]/g, "").replace(/_/g, ".");
      }
      if (e(/applewebkit/g)) {
        this.engine = "webkit";
        if (e(/edge/g)) {
          this.supporter = "edge";
          this.supporterVs = r(/edge\/[\d._]+/g);
        } else if (e(/opr/g)) {
          this.supporter = "opera";
          this.supporterVs = r(/opr\/[\d._]+/g);
        } else if (e(/chrome/g)) {
          this.supporter = "chrome";
          this.supporterVs = r(/chrome\/[\d._]+/g);
        } else if (e(/safari/g)) {
          this.supporter = "safari";
          this.supporterVs = r(/version\/[\d._]+/g);
        }
      } else if (e(/gecko/g) && e(/firefox/g)) {
        this.engine = "gecko";
        this.supporter = "firefox";
        this.supporterVs = r(/firefox\/[\d._]+/g);
      } else if (e(/presto/g)) {
        this.engine = "presto";
        this.supporter = "opera";
        this.supporterVs = r(/opr\/[\d._]+/g);
        this.engine = "trident";
        this.supporter = "iexplore";
        this.supporterVs = r(/(msie [\d._]+)|(rv:[\d._]+)/g);
      } else {
        this.engine = "other";
        this.supporter = "other";
        this.supporterVs = "other";
      }
    },
    beforeVistLog: function (t, e, r) {
      if (this.getCookie("userGroup")) {
        this.visitData.zoneid = this.getCookie("userGroup");
      }
      if (this.getCookie("userId")) {
        this.visitData.roleid = this.getCookie("userId");
      }
      if (Object.prototype.toString.call(e) == "[object Object]") {
        this.visitData.ffp = e.ffp || "";
        this.visitData.fzoneid = e.fzoneid || "";
        this.visitData.froleid = e.froleid || "";
        this.visitData.roleid = e.roleid ? e.roleid : this.visitData.roleid;
        this.visitData.zoneid = e.zoneid ? e.zoneid : this.visitData.zoneid;
      }
      for (var i in this.visitData.data) {
        if (i != "act_type" && i != "proj") {
          delete this.visitData.data[i];
        }
      }
      if (!this.platform || !this.version) {
        var o = {
          Android: this.getAndroidVersion,
          IOS: this.getIosVersion,
          PC: this.getPcVersion,
          win32: this.getPcVersion,
          win64: this.getPcVersion,
          mac: this.getPcVersion
        };
        this.platform = this.judgeClient();
        this.version = o[this.platform]();
      }
      this.brand ||= this.getBrand(navigator.userAgent.toLowerCase());
      if (!this.engine || !this.supporter || !!this.supporterVs) {
        this.getBroswer();
      }
      if (this.brand == "other" && this.platform == "IOS") {
        this.brand = "iphone";
      }
      t.os_platform = this.platform;
      t.os_version = this.version;
      t.phone_brand = this.brand;
      t.browser_brand = this.supporter;
      t.browser_version = this.supporterVs;
      t.browser_engine = this.engine;
      t.ga = this.getCookie("_ga") || "";
      for (var n in t) {
        this.visitData.data[n] = t[n];
      }
    },
    addLog: function (t) {
      var e = this;
      if (t) {
        r = [JSON.parse(JSON.stringify(this.visitData))];
      } else {
        var r = JSON.parse(JSON.stringify(i));
        i = [];
      }
      this.loadResource(function () {
        if (navigator.sendBeacon) {
          var t = new URLSearchParams();
          t.set("v3", JSON.stringify(r));
          var i = new Blob([t], {
            type: "application/x-www-form-urlencoded"
          });
          navigator.sendBeacon(e.url, i);
        } else {
          e.ajax_({
            url: e.url,
            type: "POST",
            async: false,
            data: {
              v3: JSON.stringify(r)
            }
          });
        }
      });
    },
    visitLog: function (t, e, r) {
      this.beforeVistLog(t, e, r);
      if (o) {
        o = false;
        this.addLog(true);
      } else {
        if (r === true) {
          this.addLog(true);
          return false;
        }
        i.push(JSON.parse(JSON.stringify(this.visitData)));
        this.intervalLog();
        console.warn(i);
        if (i.length >= this.num) {
          this.addLog();
        }
      }
    },
    sendData: function () {
      if (this.getCookie("userId")) {
        this.errData.roleid = this.getCookie("userId");
      }
      if (this.getCookie("userGroup")) {
        this.errData.zoneid = this.getCookie("userGroup");
      }
      var t = [JSON.parse(JSON.stringify(this.errData))];
      var e = this;
      this.loadResource(function () {
        if (navigator.sendBeacon) {
          var r = new URLSearchParams();
          r.set("v3", JSON.stringify(t));
          var i = new Blob([r], {
            type: "application/x-www-form-urlencoded"
          });
          navigator.sendBeacon(e.url, i);
        } else {
          this.ajax_({
            url: e.url,
            type: "POST",
            async: false,
            data: {
              v3: JSON.stringify(t)
            }
          });
        }
      });
    },
    loadJS: function (t, e) {
      var r = document.createElement("script");
      var i = e || function () {};
      r.type = "text/javascript";
      if (r.readyState) {
        r.onreadystatechange = function () {
          if (r.readyState == "loaded" || r.readyState == "complete") {
            r.onreadystatechange = null;
            i();
          }
        };
      } else {
        r.onload = function () {
          i();
        };
      }
      r.src = t;
      document.getElementsByTagName("head")[0].appendChild(r);
    },
    getParams: function (t) {
      var e = [];
      for (var r in t) {
        e.push(encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
      }
      e.push(("randomNumber=" + Math.random()).replace("."));
      return e.join("&");
    },
    ajax_: function (t) {
      (t = t || {}).type = (t.type || "GET").toUpperCase();
      t.dataType = t.dataType || "json";
      t.async = t.async || true;
      var e;
      var r = this.getParams(t.data);
      (e = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")).onreadystatechange = function () {
        if (e.readyState == 4) {
          var r = e.status;
          if (r >= 200 && r < 300) {
            if (t.success) {
              t.success(e.responseText, e.responseXML);
            }
          } else if (t.fail) {
            t.fail(r);
          }
        }
      };
      if (t.type == "GET") {
        e.open("GET", t.url + "?" + r, t.async);
        e.send(null);
      } else if (t.type == "POST") {
        e.open("POST", t.url, t.async);
        e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        e.send(r);
      }
    },
    loadResource_: function (t, e) {
      var r = {
        extraComponents: [{
          key: "ip",
          getData: function (e, r) {
            e(t);
          }
        }]
      };
      var i = this;
      if (window.localStorage.getItem("__murmur__")) {
        e();
        return false;
      } else if (window.Fingerprint2) {
        i.fingerHash(r, e);
        return false;
      } else {
        this.loadJS(i.cdn + "fingerprint2.min.js", function () {
          i.fingerHash(r, function () {
            e();
          });
        });
        return;
      }
    },
    loadResource: function (t) {
      window.localStorage.getItem("mt_ip");
      this.loadResource_("", t);
    }
  };
  window.Mlog = a;
}]);