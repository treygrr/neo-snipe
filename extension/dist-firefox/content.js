(() => {
  // dist-firefox/assets/messages-BTJHK7vF.js
  var t = globalThis.browser ?? globalThis.chrome;
  function a(e) {
    const n2 = t.runtime.sendMessage(e);
    return n2 && typeof n2.then == "function" ? n2 : new Promise((s) => t.runtime.sendMessage(e, s));
  }
  var c = (e) => t.runtime.getURL(e);
  async function i(e) {
    for (const n2 of [t.storage.sync, t.storage.local]) try {
      const s = await n2.get(Object.keys(e));
      if (s && Object.keys(s).length) return { ...e, ...s };
    } catch {
    }
    return { ...e };
  }
  var y = "neosnipe:lookup";
  var h = "neosnipe:trading-post";
  var r = { hoverOnly: true };
  async function p() {
    return i(r);
  }
  var f = { offline: "Could not reach Jelly Neo. Check your connection.", not_found: "No matching item on Jelly Neo.", scrape_failed: "Jelly Neo's layout changed \u2014 the parser needs updating.", no_item_id: "No Jelly Neo item id, so trading post history is unavailable.", internal: "Something went wrong looking this up.", no_permission: "Access to Jelly Neo has not been granted yet \u2014 open the extension options to allow it." };

  // dist-firefox/assets/vuetify-D4p18Vk2.js
  function Gi(e) {
    const t2 = /* @__PURE__ */ Object.create(null);
    for (const n2 of e.split(",")) t2[n2] = 1;
    return (n2) => n2 in t2;
  }
  var Ce = {};
  var Dn = [];
  var kt = () => {
  };
  var Ma = () => false;
  var Or = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
  var Dr = (e) => e.startsWith("onUpdate:");
  var Oe = Object.assign;
  var Zi = (e, t2) => {
    const n2 = e.indexOf(t2);
    n2 > -1 && e.splice(n2, 1);
  };
  var mf = Object.prototype.hasOwnProperty;
  var me = (e, t2) => mf.call(e, t2);
  var ee = Array.isArray;
  var qt = (e) => Es(e) === "[object Map]";
  var ir = (e) => Es(e) === "[object Set]";
  var No = (e) => Es(e) === "[object Date]";
  var se = (e) => typeof e == "function";
  var Le = (e) => typeof e == "string";
  var ft = (e) => typeof e == "symbol";
  var ve = (e) => e !== null && typeof e == "object";
  var Va = (e) => (ve(e) || se(e)) && se(e.then) && se(e.catch);
  var Pa = Object.prototype.toString;
  var Es = (e) => Pa.call(e);
  var gf = (e) => Es(e).slice(8, -1);
  var Ia = (e) => Es(e) === "[object Object]";
  var Hr = (e) => Le(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e;
  var rs = Gi(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
  var Fr = (e) => {
    const t2 = /* @__PURE__ */ Object.create(null);
    return (n2) => t2[n2] || (t2[n2] = e(n2));
  };
  var yf = /-\w/g;
  var je = Fr((e) => e.replace(yf, (t2) => t2.slice(1).toUpperCase()));
  var pf = /\B([A-Z])/g;
  var _n = Fr((e) => e.replace(pf, "-$1").toLowerCase());
  var jn = Fr((e) => e.charAt(0).toUpperCase() + e.slice(1));
  var Qr = Fr((e) => e ? `on${jn(e)}` : "");
  var Lt = (e, t2) => !Object.is(e, t2);
  var ei = (e, ...t2) => {
    for (let n2 = 0; n2 < e.length; n2++) e[n2](...t2);
  };
  var Oa = (e, t2, n2, s = false) => {
    Object.defineProperty(e, t2, { configurable: true, enumerable: false, writable: s, value: n2 });
  };
  var bf = (e) => {
    const t2 = parseFloat(e);
    return isNaN(t2) ? e : t2;
  };
  var wf = (e) => {
    const t2 = Le(e) ? Number(e) : NaN;
    return isNaN(t2) ? e : t2;
  };
  var Wo;
  var $r = () => Wo || (Wo = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
  function ge(e) {
    if (ee(e)) {
      const t2 = {};
      for (let n2 = 0; n2 < e.length; n2++) {
        const s = e[n2], r2 = Le(s) ? _f(s) : ge(s);
        if (r2) for (const i2 in r2) t2[i2] = r2[i2];
      }
      return t2;
    } else if (Le(e) || ve(e)) return e;
  }
  var Cf = /;(?![^(]*\))/g;
  var Sf = /:([^]+)/;
  var xf = /\/\*[^]*?\*\//g;
  function _f(e) {
    const t2 = {};
    return e.replace(xf, "").split(Cf).forEach((n2) => {
      if (n2) {
        const s = n2.split(Sf);
        s.length > 1 && (t2[s[0].trim()] = s[1].trim());
      }
    }), t2;
  }
  function ie(e) {
    let t2 = "";
    if (Le(e)) t2 = e;
    else if (ee(e)) for (let n2 = 0; n2 < e.length; n2++) {
      const s = ie(e[n2]);
      s && (t2 += s + " ");
    }
    else if (ve(e)) for (const n2 in e) e[n2] && (t2 += n2 + " ");
    return t2.trim();
  }
  var Lf = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly";
  var Af = Gi(Lf);
  function Da(e) {
    return !!e || e === "";
  }
  function kf(e, t2) {
    if (e.length !== t2.length) return false;
    let n2 = true;
    for (let s = 0; n2 && s < e.length; s++) n2 = Rr(e[s], t2[s]);
    return n2;
  }
  function zo(e, t2) {
    if (e.size !== t2.size) return false;
    const n2 = Array.from(t2), s = new Uint8Array(n2.length);
    for (const r2 of e) {
      let i2 = -1;
      for (let o = 0; o < n2.length; o++) if (!s[o] && Rr(r2, n2[o])) {
        i2 = o;
        break;
      }
      if (i2 < 0) return false;
      s[i2] = 1;
    }
    return true;
  }
  function Rr(e, t2) {
    if (e === t2) return true;
    let n2 = No(e), s = No(t2);
    if (n2 || s) return n2 && s ? e.getTime() === t2.getTime() : false;
    if (n2 = ft(e), s = ft(t2), n2 || s) return e === t2;
    if (n2 = ee(e), s = ee(t2), n2 || s) return n2 && s ? kf(e, t2) : false;
    if (n2 = ve(e), s = ve(t2), n2 || s) {
      if (!n2 || !s) return false;
      if (n2 = qt(e), s = qt(t2), n2 || s || (n2 = ir(e), s = ir(t2), n2 || s)) return n2 && s ? zo(e, t2) : false;
      const r2 = Object.keys(e).length, i2 = Object.keys(t2).length;
      if (r2 !== i2) return false;
      for (const o in e) {
        const l = e.hasOwnProperty(o), a2 = t2.hasOwnProperty(o);
        if (l && !a2 || !l && a2 || !Rr(e[o], t2[o])) return false;
      }
    }
    return String(e) === String(t2);
  }
  var Ha = (e) => !!(e && e.__v_isRef === true);
  var fs = (e) => Le(e) ? e : e == null ? "" : ee(e) || ve(e) && (e.toString === Pa || !se(e.toString)) ? Ha(e) ? fs(e.value) : JSON.stringify(e, Fa, 2) : String(e);
  var Fa = (e, t2) => Ha(t2) ? Fa(e, t2.value) : qt(t2) ? { [`Map(${t2.size})`]: [...t2.entries()].reduce((n2, [s, r2], i2) => (n2[ti(s, i2) + " =>"] = r2, n2), {}) } : ir(t2) ? { [`Set(${t2.size})`]: [...t2.values()].map((n2) => ti(n2)) } : ft(t2) ? ti(t2) : ve(t2) && !ee(t2) && !Ia(t2) ? String(t2) : t2;
  var ti = (e, t2 = "") => {
    var n2;
    return ft(e) ? `Symbol(${(n2 = e.description) != null ? n2 : t2})` : e;
  };
  var De;
  var $a = class {
    constructor(t2 = false) {
      this.detached = t2, this._active = true, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = false, this._warnOnRun = true, this.__v_skip = true, !t2 && De && (De.active ? (this.parent = De, this.index = (De.scopes || (De.scopes = [])).push(this) - 1) : (this._active = false, this._warnOnRun = false));
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = true;
        let t2, n2;
        if (this.scopes) {
          const s = this.scopes.slice();
          for (t2 = 0, n2 = s.length; t2 < n2; t2++) s[t2].pause();
        }
        for (t2 = 0, n2 = this.effects.length; t2 < n2; t2++) this.effects[t2].pause();
      }
    }
    resume() {
      if (this._active && this._isPaused) {
        this._isPaused = false;
        let t2, n2;
        if (this.scopes) {
          const r2 = this.scopes.slice();
          for (t2 = 0, n2 = r2.length; t2 < n2; t2++) r2[t2].resume();
        }
        const s = this.effects.slice();
        for (t2 = 0, n2 = s.length; t2 < n2; t2++) s[t2].resume();
      }
    }
    run(t2) {
      if (this._active) {
        const n2 = De;
        try {
          return De = this, t2();
        } finally {
          De = n2;
        }
      }
    }
    on() {
      ++this._on === 1 && (this.prevScope = De, De = this);
    }
    off() {
      if (this._on > 0 && --this._on === 0) {
        if (De === this) De = this.prevScope;
        else {
          let t2 = De;
          for (; t2; ) {
            if (t2.prevScope === this) {
              t2.prevScope = this.prevScope;
              break;
            }
            t2 = t2.prevScope;
          }
        }
        this.prevScope = void 0;
      }
    }
    stop(t2) {
      if (this._active) {
        this._active = false;
        let n2, s;
        for (n2 = 0, s = this.effects.length; n2 < s; n2++) this.effects[n2].stop();
        for (this.effects.length = 0, n2 = 0, s = this.cleanups.length; n2 < s; n2++) this.cleanups[n2]();
        if (this.cleanups.length = 0, this.scopes) {
          const r2 = this.scopes.slice();
          for (n2 = 0, s = r2.length; n2 < s; n2++) r2[n2].stop(true);
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !t2) {
          const r2 = this.parent.scopes.pop();
          r2 && r2 !== this && (this.parent.scopes[this.index] = r2, r2.index = this.index);
        }
        this.parent = void 0;
      }
    }
  };
  function ds(e) {
    return new $a(e);
  }
  function Ra() {
    return De;
  }
  function Ze(e, t2 = false) {
    De && De.cleanups.push(e);
  }
  var xe;
  var ni = /* @__PURE__ */ new WeakSet();
  var Ba = class {
    constructor(t2) {
      this.fn = t2, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, De && (De.active ? De.effects.push(this) : this.flags &= -2);
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      this.flags & 64 && (this.flags &= -65, ni.has(this) && (ni.delete(this), this.trigger()));
    }
    notify() {
      this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Wa(this);
    }
    run() {
      if (!(this.flags & 1)) return this.fn();
      this.flags |= 2, jo(this), za(this);
      const t2 = xe, n2 = ht;
      xe = this, ht = true;
      try {
        return this.fn();
      } finally {
        ja(this), xe = t2, ht = n2, this.flags &= -3;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let t2 = this.deps; t2; t2 = t2.nextDep) Ji(t2);
        this.deps = this.depsTail = void 0, jo(this), this.onStop && this.onStop(), this.flags &= -2;
      }
    }
    trigger() {
      this.flags & 64 ? ni.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
    }
    runIfDirty() {
      xi(this) && this.run();
    }
    get dirty() {
      return xi(this);
    }
  };
  var Na = 0;
  var is;
  var os;
  function Wa(e, t2 = false) {
    if (e.flags |= 8, t2) {
      e.next = os, os = e;
      return;
    }
    e.next = is, is = e;
  }
  function qi() {
    Na++;
  }
  function Xi() {
    if (--Na > 0) return;
    if (os) {
      let t2 = os;
      for (os = void 0; t2; ) {
        const n2 = t2.next;
        t2.next = void 0, t2.flags &= -9, t2 = n2;
      }
    }
    let e;
    for (; is; ) {
      let t2 = is;
      for (is = void 0; t2; ) {
        const n2 = t2.next;
        if (t2.next = void 0, t2.flags &= -9, t2.flags & 1) try {
          t2.trigger();
        } catch (s) {
          e || (e = s);
        }
        t2 = n2;
      }
    }
    if (e) throw e;
  }
  function za(e) {
    for (let t2 = e.deps; t2; t2 = t2.nextDep) t2.version = -1, t2.prevActiveLink = t2.dep.activeLink, t2.dep.activeLink = t2;
  }
  function ja(e) {
    let t2, n2 = e.depsTail, s = n2;
    for (; s; ) {
      const r2 = s.prevDep;
      s.version === -1 ? (s === n2 && (n2 = r2), Ji(s), Tf(s)) : t2 = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r2;
    }
    e.deps = t2, e.depsTail = n2;
  }
  function xi(e) {
    for (let t2 = e.deps; t2; t2 = t2.nextDep) if (t2.dep.version !== t2.version || t2.dep.computed && (Ya(t2.dep.computed) || t2.dep.version !== t2.version)) return true;
    return !!e._dirty;
  }
  function Ya(e) {
    if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === vs) || (e.globalVersion = vs, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !xi(e)))) return;
    e.flags |= 2;
    const t2 = e.dep, n2 = xe, s = ht;
    xe = e, ht = true;
    try {
      za(e);
      const r2 = e.fn(e._value);
      (t2.version === 0 || Lt(r2, e._value)) && (e.flags |= 128, e._value = r2, t2.version++);
    } catch (r2) {
      throw t2.version++, r2;
    } finally {
      xe = n2, ht = s, ja(e), e.flags &= -3;
    }
  }
  function Ji(e, t2 = false) {
    const { dep: n2, prevSub: s, nextSub: r2 } = e;
    if (s && (s.nextSub = r2, e.prevSub = void 0), r2 && (r2.prevSub = s, e.nextSub = void 0), n2.subs === e && (n2.subs = s, !s && n2.computed)) {
      n2.computed.flags &= -5;
      for (let i2 = n2.computed.deps; i2; i2 = i2.nextDep) Ji(i2, true);
    }
    !t2 && !--n2.sc && n2.map && n2.map.delete(n2.key);
  }
  function Tf(e) {
    const { prevDep: t2, nextDep: n2 } = e;
    t2 && (t2.nextDep = n2, e.prevDep = void 0), n2 && (n2.prevDep = t2, e.nextDep = void 0);
  }
  var ht = true;
  var Ua = [];
  function Ht() {
    Ua.push(ht), ht = false;
  }
  function Ft() {
    const e = Ua.pop();
    ht = e === void 0 ? true : e;
  }
  function jo(e) {
    const { cleanup: t2 } = e;
    if (e.cleanup = void 0, t2) {
      const n2 = xe;
      xe = void 0;
      try {
        t2();
      } finally {
        xe = n2;
      }
    }
  }
  var vs = 0;
  var Ef = class {
    constructor(t2, n2) {
      this.sub = t2, this.dep = n2, this.version = n2.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  };
  var Qi = class {
    constructor(t2) {
      this.computed = t2, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = true;
    }
    track(t2) {
      if (!xe || !ht || xe === this.computed) return;
      let n2 = this.activeLink;
      if (n2 === void 0 || n2.sub !== xe) n2 = this.activeLink = new Ef(xe, this), xe.deps ? (n2.prevDep = xe.depsTail, xe.depsTail.nextDep = n2, xe.depsTail = n2) : xe.deps = xe.depsTail = n2, Ka(n2);
      else if (n2.version === -1 && (n2.version = this.version, n2.nextDep)) {
        const s = n2.nextDep;
        s.prevDep = n2.prevDep, n2.prevDep && (n2.prevDep.nextDep = s), n2.prevDep = xe.depsTail, n2.nextDep = void 0, xe.depsTail.nextDep = n2, xe.depsTail = n2, xe.deps === n2 && (xe.deps = s);
      }
      return n2;
    }
    trigger(t2) {
      this.version++, vs++, this.notify(t2);
    }
    notify(t2) {
      qi();
      try {
        for (let n2 = this.subs; n2; n2 = n2.prevSub) n2.sub.notify() && n2.sub.dep.notify();
      } finally {
        Xi();
      }
    }
  };
  function Ka(e) {
    if (e.dep.sc++, e.sub.flags & 4) {
      const t2 = e.dep.computed;
      if (t2 && !e.dep.subs) {
        t2.flags |= 20;
        for (let s = t2.deps; s; s = s.nextDep) Ka(s);
      }
      const n2 = e.dep.subs;
      n2 !== e && (e.prevSub = n2, n2 && (n2.nextSub = e)), e.dep.subs = e;
    }
  }
  var or = /* @__PURE__ */ new WeakMap();
  var vn = /* @__PURE__ */ Symbol("");
  var _i = /* @__PURE__ */ Symbol("");
  var hs = /* @__PURE__ */ Symbol("");
  function Be(e, t2, n2) {
    if (ht && xe) {
      let s = or.get(e);
      s || or.set(e, s = /* @__PURE__ */ new Map());
      let r2 = s.get(n2);
      r2 || (s.set(n2, r2 = new Qi()), r2.map = s, r2.key = n2), r2.track();
    }
  }
  function Ot(e, t2, n2, s, r2, i2) {
    const o = or.get(e);
    if (!o) {
      vs++;
      return;
    }
    const l = (a2) => {
      a2 && a2.trigger();
    };
    if (qi(), t2 === "clear") o.forEach(l);
    else {
      const a2 = ee(e), c2 = a2 && Hr(n2);
      if (a2 && n2 === "length") {
        const u = Number(s);
        o.forEach((f2, d) => {
          (d === "length" || d === hs || !ft(d) && d >= u) && l(f2);
        });
      } else switch ((n2 !== void 0 || o.has(void 0)) && l(o.get(n2)), c2 && l(o.get(hs)), t2) {
        case "add":
          a2 ? c2 && l(o.get("length")) : (l(o.get(vn)), qt(e) && l(o.get(_i)));
          break;
        case "delete":
          a2 || (l(o.get(vn)), qt(e) && l(o.get(_i)));
          break;
        case "set":
          qt(e) && l(o.get(vn));
          break;
      }
    }
    Xi();
  }
  function Mf(e, t2) {
    const n2 = or.get(e);
    return n2 && n2.get(t2);
  }
  function Tn(e) {
    const t2 = ue(e);
    return t2 === e ? t2 : (Be(t2, "iterate", hs), ot(e) ? t2 : t2.map(mt));
  }
  function Br(e) {
    return Be(e = ue(e), "iterate", hs), e;
  }
  function xt(e, t2) {
    return $t(e) ? Rn(hn(e) ? mt(t2) : t2) : mt(t2);
  }
  var Vf = { __proto__: null, [Symbol.iterator]() {
    return si(this, Symbol.iterator, (e) => xt(this, e));
  }, concat(...e) {
    return Tn(this).concat(...e.map((t2) => ee(t2) ? Tn(t2) : t2));
  }, entries() {
    return si(this, "entries", (e) => (e[1] = xt(this, e[1]), e));
  }, every(e, t2) {
    return Mt(this, "every", e, t2, void 0, arguments);
  }, filter(e, t2) {
    return Mt(this, "filter", e, t2, (n2) => n2.map((s) => xt(this, s)), arguments);
  }, find(e, t2) {
    return Mt(this, "find", e, t2, (n2) => xt(this, n2), arguments);
  }, findIndex(e, t2) {
    return Mt(this, "findIndex", e, t2, void 0, arguments);
  }, findLast(e, t2) {
    return Mt(this, "findLast", e, t2, (n2) => xt(this, n2), arguments);
  }, findLastIndex(e, t2) {
    return Mt(this, "findLastIndex", e, t2, void 0, arguments);
  }, forEach(e, t2) {
    return Mt(this, "forEach", e, t2, void 0, arguments);
  }, includes(...e) {
    return ri(this, "includes", e);
  }, indexOf(...e) {
    return ri(this, "indexOf", e);
  }, join(e) {
    return Tn(this).join(e);
  }, lastIndexOf(...e) {
    return ri(this, "lastIndexOf", e);
  }, map(e, t2) {
    return Mt(this, "map", e, t2, void 0, arguments);
  }, pop() {
    return qn(this, "pop");
  }, push(...e) {
    return qn(this, "push", e);
  }, reduce(e, ...t2) {
    return Yo(this, "reduce", e, t2);
  }, reduceRight(e, ...t2) {
    return Yo(this, "reduceRight", e, t2);
  }, shift() {
    return qn(this, "shift");
  }, some(e, t2) {
    return Mt(this, "some", e, t2, void 0, arguments);
  }, splice(...e) {
    return qn(this, "splice", e);
  }, toReversed() {
    return Tn(this).toReversed();
  }, toSorted(e) {
    return Tn(this).toSorted(e);
  }, toSpliced(...e) {
    return Tn(this).toSpliced(...e);
  }, unshift(...e) {
    return qn(this, "unshift", e);
  }, values() {
    return si(this, "values", (e) => xt(this, e));
  } };
  function si(e, t2, n2) {
    const s = Br(e), r2 = s[t2]();
    return s !== e && !ot(e) && (r2._next = r2.next, r2.next = () => {
      const i2 = r2._next();
      return i2.done || (i2.value = n2(i2.value)), i2;
    }), r2;
  }
  var Pf = Array.prototype;
  function Mt(e, t2, n2, s, r2, i2) {
    const o = Br(e), l = o !== e && !ot(e), a2 = o[t2];
    if (a2 !== Pf[t2]) {
      const f2 = a2.apply(e, i2);
      return l ? mt(f2) : f2;
    }
    let c2 = n2;
    o !== e && (l ? c2 = function(f2, d) {
      return n2.call(this, xt(e, f2), d, e);
    } : n2.length > 2 && (c2 = function(f2, d) {
      return n2.call(this, f2, d, e);
    }));
    const u = a2.call(o, c2, s);
    return l && r2 ? r2(u) : u;
  }
  function Yo(e, t2, n2, s) {
    const r2 = Br(e), i2 = r2 !== e && !ot(e);
    let o = n2, l = false;
    r2 !== e && (i2 ? (l = s.length === 0, o = function(c2, u, f2) {
      return l && (l = false, c2 = xt(e, c2)), n2.call(this, c2, xt(e, u), f2, e);
    }) : n2.length > 3 && (o = function(c2, u, f2) {
      return n2.call(this, c2, u, f2, e);
    }));
    const a2 = r2[t2](o, ...s);
    return l ? xt(e, a2) : a2;
  }
  function ri(e, t2, n2) {
    const s = ue(e);
    Be(s, "iterate", hs);
    const r2 = s[t2](...n2);
    return (r2 === -1 || r2 === false) && Nr(n2[0]) ? (n2[0] = ue(n2[0]), s[t2](...n2)) : r2;
  }
  function qn(e, t2, n2 = []) {
    Ht(), qi();
    const s = ue(e)[t2].apply(e, n2);
    return Xi(), Ft(), s;
  }
  var If = Gi("__proto__,__v_isRef,__isVue");
  var Ga = new Set(Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ft));
  function Of(e) {
    ft(e) || (e = String(e));
    const t2 = ue(this);
    return Be(t2, "has", e), t2.hasOwnProperty(e);
  }
  var Za = class {
    constructor(t2 = false, n2 = false) {
      this._isReadonly = t2, this._isShallow = n2;
    }
    get(t2, n2, s) {
      if (n2 === "__v_skip") return t2.__v_skip;
      const r2 = this._isReadonly, i2 = this._isShallow;
      if (n2 === "__v_isReactive") return !r2;
      if (n2 === "__v_isReadonly") return r2;
      if (n2 === "__v_isShallow") return i2;
      if (n2 === "__v_raw") return s === (r2 ? i2 ? jf : Qa : i2 ? Ja : Xa).get(t2) || Object.getPrototypeOf(t2) === Object.getPrototypeOf(s) ? t2 : void 0;
      const o = ee(t2);
      if (!r2) {
        let a2;
        if (o && (a2 = Vf[n2])) return a2;
        if (n2 === "hasOwnProperty") return Of;
      }
      const l = Reflect.get(t2, n2, Ee(t2) ? t2 : s);
      if ((ft(n2) ? Ga.has(n2) : If(n2)) || (r2 || Be(t2, "get", n2), i2)) return l;
      if (Ee(l)) {
        const a2 = o && Hr(n2) ? l : l.value;
        return r2 && ve(a2) ? $n(a2) : a2;
      }
      return ve(l) ? r2 ? $n(l) : $e(l) : l;
    }
  };
  var qa = class extends Za {
    constructor(t2 = false) {
      super(false, t2);
    }
    set(t2, n2, s, r2) {
      let i2 = t2[n2];
      const o = ee(t2) && Hr(n2);
      if (!this._isShallow) {
        const c2 = $t(i2);
        if (!ot(s) && !$t(s) && (i2 = ue(i2), s = ue(s)), !o && Ee(i2) && !Ee(s)) return c2 || (i2.value = s), true;
      }
      const l = o ? Number(n2) < t2.length : me(t2, n2), a2 = Reflect.set(t2, n2, s, Ee(t2) ? t2 : r2);
      return t2 === ue(r2) && a2 && (l ? Lt(s, i2) && Ot(t2, "set", n2, s) : Ot(t2, "add", n2, s)), a2;
    }
    deleteProperty(t2, n2) {
      const s = me(t2, n2);
      t2[n2];
      const r2 = Reflect.deleteProperty(t2, n2);
      return r2 && s && Ot(t2, "delete", n2, void 0), r2;
    }
    has(t2, n2) {
      const s = Reflect.has(t2, n2);
      return (!ft(n2) || !Ga.has(n2)) && Be(t2, "has", n2), s;
    }
    ownKeys(t2) {
      return Be(t2, "iterate", ee(t2) ? "length" : vn), Reflect.ownKeys(t2);
    }
  };
  var Df = class extends Za {
    constructor(t2 = false) {
      super(true, t2);
    }
    set(t2, n2) {
      return true;
    }
    deleteProperty(t2, n2) {
      return true;
    }
  };
  var Hf = new qa();
  var Ff = new Df();
  var $f = new qa(true);
  var Li = (e) => e;
  var Ks = (e) => Reflect.getPrototypeOf(e);
  function Rf(e, t2, n2) {
    return function(...s) {
      const r2 = this.__v_raw, i2 = ue(r2), o = qt(i2), l = e === "entries" || e === Symbol.iterator && o, a2 = e === "keys" && o, c2 = r2[e](...s), u = n2 ? Li : t2 ? Rn : mt;
      return !t2 && Be(i2, "iterate", a2 ? _i : vn), Oe(Object.create(c2), { next() {
        const { value: f2, done: d } = c2.next();
        return d ? { value: f2, done: d } : { value: l ? [u(f2[0]), u(f2[1])] : u(f2), done: d };
      } });
    };
  }
  function Gs(e) {
    return function(...t2) {
      return e === "delete" ? false : e === "clear" ? void 0 : this;
    };
  }
  function Bf(e, t2) {
    const n2 = { get(r2) {
      const i2 = this.__v_raw, o = ue(i2), l = ue(r2);
      e || (Lt(r2, l) && Be(o, "get", r2), Be(o, "get", l));
      const { has: a2 } = Ks(o), c2 = t2 ? Li : e ? Rn : mt;
      if (a2.call(o, r2)) return c2(i2.get(r2));
      if (a2.call(o, l)) return c2(i2.get(l));
      i2 !== o && i2.get(r2);
    }, get size() {
      const r2 = this.__v_raw;
      return !e && Be(ue(r2), "iterate", vn), r2.size;
    }, has(r2) {
      const i2 = this.__v_raw, o = ue(i2), l = ue(r2);
      return e || (Lt(r2, l) && Be(o, "has", r2), Be(o, "has", l)), r2 === l ? i2.has(r2) : i2.has(r2) || i2.has(l);
    }, forEach(r2, i2) {
      const o = this, l = o.__v_raw, a2 = ue(l), c2 = t2 ? Li : e ? Rn : mt;
      return !e && Be(a2, "iterate", vn), l.forEach((u, f2) => r2.call(i2, c2(u), c2(f2), o));
    } };
    return Oe(n2, e ? { add: Gs("add"), set: Gs("set"), delete: Gs("delete"), clear: Gs("clear") } : { add(r2) {
      const i2 = ue(this), o = Ks(i2), l = ue(r2), a2 = !t2 && !ot(r2) && !$t(r2) ? l : r2;
      return o.has.call(i2, a2) || Lt(r2, a2) && o.has.call(i2, r2) || Lt(l, a2) && o.has.call(i2, l) || (i2.add(a2), Ot(i2, "add", a2, a2)), this;
    }, set(r2, i2) {
      !t2 && !ot(i2) && !$t(i2) && (i2 = ue(i2));
      const o = ue(this), { has: l, get: a2 } = Ks(o);
      let c2 = l.call(o, r2);
      c2 || (r2 = ue(r2), c2 = l.call(o, r2));
      const u = a2.call(o, r2);
      return o.set(r2, i2), c2 ? Lt(i2, u) && Ot(o, "set", r2, i2) : Ot(o, "add", r2, i2), this;
    }, delete(r2) {
      const i2 = ue(this), { has: o, get: l } = Ks(i2);
      let a2 = o.call(i2, r2);
      a2 || (r2 = ue(r2), a2 = o.call(i2, r2)), l && l.call(i2, r2);
      const c2 = i2.delete(r2);
      return a2 && Ot(i2, "delete", r2, void 0), c2;
    }, clear() {
      const r2 = ue(this), i2 = r2.size !== 0, o = r2.clear();
      return i2 && Ot(r2, "clear", void 0, void 0), o;
    } }), ["keys", "values", "entries", Symbol.iterator].forEach((r2) => {
      n2[r2] = Rf(r2, e, t2);
    }), n2;
  }
  function eo(e, t2) {
    const n2 = Bf(e, t2);
    return (s, r2, i2) => r2 === "__v_isReactive" ? !e : r2 === "__v_isReadonly" ? e : r2 === "__v_raw" ? s : Reflect.get(me(n2, r2) && r2 in s ? n2 : s, r2, i2);
  }
  var Nf = { get: eo(false, false) };
  var Wf = { get: eo(false, true) };
  var zf = { get: eo(true, false) };
  var Xa = /* @__PURE__ */ new WeakMap();
  var Ja = /* @__PURE__ */ new WeakMap();
  var Qa = /* @__PURE__ */ new WeakMap();
  var jf = /* @__PURE__ */ new WeakMap();
  function Yf(e) {
    switch (e) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function $e(e) {
    return $t(e) ? e : to(e, false, Hf, Nf, Xa);
  }
  function Uf(e) {
    return to(e, false, $f, Wf, Ja);
  }
  function $n(e) {
    return to(e, true, Ff, zf, Qa);
  }
  function to(e, t2, n2, s, r2) {
    if (!ve(e) || e.__v_raw && !(t2 && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
    const i2 = r2.get(e);
    if (i2) return i2;
    const o = Yf(gf(e));
    if (o === 0) return e;
    const l = new Proxy(e, o === 2 ? s : n2);
    return r2.set(e, l), l;
  }
  function hn(e) {
    return $t(e) ? hn(e.__v_raw) : !!(e && e.__v_isReactive);
  }
  function $t(e) {
    return !!(e && e.__v_isReadonly);
  }
  function ot(e) {
    return !!(e && e.__v_isShallow);
  }
  function Nr(e) {
    return e ? !!e.__v_raw : false;
  }
  function ue(e) {
    const t2 = e && e.__v_raw;
    return t2 ? ue(t2) : e;
  }
  function Kf(e) {
    return !me(e, "__v_skip") && Object.isExtensible(e) && Oa(e, "__v_skip", true), e;
  }
  var mt = (e) => ve(e) ? $e(e) : e;
  var Rn = (e) => ve(e) ? $n(e) : e;
  function Ee(e) {
    return e ? e.__v_isRef === true : false;
  }
  function _e(e) {
    return eu(e, false);
  }
  function le(e) {
    return eu(e, true);
  }
  function eu(e, t2) {
    return Ee(e) ? e : new Gf(e, t2);
  }
  var Gf = class {
    constructor(t2, n2) {
      this.dep = new Qi(), this.__v_isRef = true, this.__v_isShallow = false, this._rawValue = n2 ? t2 : ue(t2), this._value = n2 ? t2 : mt(t2), this.__v_isShallow = n2;
    }
    get value() {
      return this.dep.track(), this._value;
    }
    set value(t2) {
      const n2 = this._rawValue, s = this.__v_isShallow || ot(t2) || $t(t2);
      t2 = s ? t2 : ue(t2), Lt(t2, n2) && (this._rawValue = t2, this._value = s ? t2 : mt(t2), this.dep.trigger());
    }
  };
  function Zt(e) {
    return Ee(e) ? e.value : e;
  }
  function gt(e) {
    return se(e) ? e() : Zt(e);
  }
  var Zf = { get: (e, t2, n2) => t2 === "__v_raw" ? e : Zt(Reflect.get(e, t2, n2)), set: (e, t2, n2, s) => {
    const r2 = e[t2];
    return Ee(r2) && !Ee(n2) ? (r2.value = n2, true) : Reflect.set(e, t2, n2, s);
  } };
  function tu(e) {
    return hn(e) ? e : new Proxy(e, Zf);
  }
  function nu(e) {
    const t2 = ee(e) ? new Array(e.length) : {};
    for (const n2 in e) t2[n2] = su(e, n2);
    return t2;
  }
  var qf = class {
    constructor(t2, n2, s) {
      this._object = t2, this._defaultValue = s, this.__v_isRef = true, this._value = void 0, this._key = ft(n2) ? n2 : String(n2), this._raw = ue(t2);
      let r2 = true, i2 = t2;
      if (!ee(t2) || ft(this._key) || !Hr(this._key)) do
        r2 = !Nr(i2) || ot(i2);
      while (r2 && (i2 = i2.__v_raw));
      this._shallow = r2;
    }
    get value() {
      let t2 = this._object[this._key];
      return this._shallow && (t2 = Zt(t2)), this._value = t2 === void 0 ? this._defaultValue : t2;
    }
    set value(t2) {
      if (this._shallow && Ee(this._raw[this._key])) {
        const n2 = this._object[this._key];
        if (Ee(n2)) {
          n2.value = t2;
          return;
        }
      }
      this._object[this._key] = t2;
    }
    get dep() {
      return Mf(this._raw, this._key);
    }
  };
  var Xf = class {
    constructor(t2) {
      this._getter = t2, this.__v_isRef = true, this.__v_isReadonly = true, this._value = void 0;
    }
    get value() {
      return this._value = this._getter();
    }
  };
  function $(e, t2, n2) {
    return Ee(e) ? e : se(e) ? new Xf(e) : ve(e) && arguments.length > 1 ? su(e, t2, n2) : _e(e);
  }
  function su(e, t2, n2) {
    return new qf(e, t2, n2);
  }
  var Jf = class {
    constructor(t2, n2, s) {
      this.fn = t2, this.setter = n2, this._value = void 0, this.dep = new Qi(this), this.__v_isRef = true, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = vs - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n2, this.isSSR = s;
    }
    notify() {
      if (this.flags |= 16, !(this.flags & 8) && xe !== this) return Wa(this, true), true;
    }
    get value() {
      const t2 = this.dep.track();
      return Ya(this), t2 && (t2.version = this.dep.version), this._value;
    }
    set value(t2) {
      this.setter && this.setter(t2);
    }
  };
  function Qf(e, t2, n2 = false) {
    let s, r2;
    return se(e) ? s = e : (s = e.get, r2 = e.set), new Jf(s, r2, n2);
  }
  var Zs = {};
  var lr = /* @__PURE__ */ new WeakMap();
  var cn;
  function ed(e, t2 = false, n2 = cn) {
    if (n2) {
      let s = lr.get(n2);
      s || lr.set(n2, s = []), s.push(e);
    }
  }
  function td(e, t2, n2 = Ce) {
    const { immediate: s, deep: r2, once: i2, scheduler: o, augmentJob: l, call: a2 } = n2, c2 = (x) => r2 ? x : ot(x) || r2 === false || r2 === 0 ? Dt(x, 1) : Dt(x);
    let u, f2, d, h2, b = false, g = false;
    if (Ee(e) ? (f2 = () => e.value, b = ot(e)) : hn(e) ? (f2 = () => c2(e), b = true) : ee(e) ? (g = true, b = e.some((x) => hn(x) || ot(x)), f2 = () => e.map((x) => {
      if (Ee(x)) return x.value;
      if (hn(x)) return c2(x);
      if (se(x)) return a2 ? a2(x, 2) : x();
    })) : se(e) ? t2 ? f2 = a2 ? () => a2(e, 2) : e : f2 = () => {
      if (d) {
        Ht();
        try {
          d();
        } finally {
          Ft();
        }
      }
      const x = cn;
      cn = u;
      try {
        return a2 ? a2(e, 3, [h2]) : e(h2);
      } finally {
        cn = x;
      }
    } : f2 = kt, t2 && r2) {
      const x = f2, M2 = r2 === true ? 1 / 0 : r2;
      f2 = () => Dt(x(), M2);
    }
    const S = Ra(), m = () => {
      u.stop(), S && S.active && Zi(S.effects, u);
    };
    if (i2 && t2) {
      const x = t2;
      t2 = (...M2) => {
        const A2 = x(...M2);
        return m(), A2;
      };
    }
    let w = g ? new Array(e.length).fill(Zs) : Zs;
    const C2 = (x) => {
      if (!(!(u.flags & 1) || !u.dirty && !x)) if (t2) {
        const M2 = u.run();
        if (x || r2 || b || (g ? M2.some((A2, L2) => Lt(A2, w[L2])) : Lt(M2, w))) {
          d && d();
          const A2 = cn;
          cn = u;
          try {
            const L2 = [M2, w === Zs ? void 0 : g && w[0] === Zs ? [] : w, h2];
            w = M2, a2 ? a2(t2, 3, L2) : t2(...L2);
          } finally {
            cn = A2;
          }
        }
      } else u.run();
    };
    return l && l(C2), u = new Ba(f2), u.scheduler = o ? () => o(C2, false) : C2, h2 = (x) => ed(x, false, u), d = u.onStop = () => {
      const x = lr.get(u);
      if (x) {
        if (a2) a2(x, 4);
        else for (const M2 of x) M2();
        lr.delete(u);
      }
    }, t2 ? s ? C2(true) : w = u.run() : o ? o(C2.bind(null, true), true) : u.run(), m.pause = u.pause.bind(u), m.resume = u.resume.bind(u), m.stop = m, m;
  }
  function Dt(e, t2 = 1 / 0, n2) {
    if (t2 <= 0 || !ve(e) || e.__v_skip || (n2 = n2 || /* @__PURE__ */ new Map(), (n2.get(e) || 0) >= t2)) return e;
    if (n2.set(e, t2), t2--, Ee(e)) Dt(e.value, t2, n2);
    else if (ee(e)) for (let s = 0; s < e.length; s++) Dt(e[s], t2, n2);
    else if (ir(e) || qt(e)) e.forEach((s) => {
      Dt(s, t2, n2);
    });
    else if (Ia(e)) {
      for (const s in e) Dt(e[s], t2, n2);
      for (const s of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, s) && Dt(e[s], t2, n2);
    }
    return e;
  }
  function Ms(e, t2, n2, s) {
    try {
      return s ? e(...s) : e();
    } catch (r2) {
      Wr(r2, t2, n2);
    }
  }
  function dt(e, t2, n2, s) {
    if (se(e)) {
      const r2 = Ms(e, t2, n2, s);
      return r2 && Va(r2) && r2.catch((i2) => {
        Wr(i2, t2, n2);
      }), r2;
    }
    if (ee(e)) {
      const r2 = [];
      for (let i2 = 0; i2 < e.length; i2++) r2.push(dt(e[i2], t2, n2, s));
      return r2;
    }
  }
  function Wr(e, t2, n2, s = true) {
    const r2 = t2 ? t2.vnode : null, { errorHandler: i2, throwUnhandledErrorInProduction: o } = t2 && t2.appContext.config || Ce;
    if (t2) {
      let l = t2.parent;
      const a2 = t2.proxy, c2 = `https://vuejs.org/error-reference/#runtime-${n2}`;
      for (; l; ) {
        const u = l.ec;
        if (u) {
          for (let f2 = 0; f2 < u.length; f2++) if (u[f2](e, a2, c2) === false) return;
        }
        l = l.parent;
      }
      if (i2) {
        Ht(), Ms(i2, null, 10, [e, a2, c2]), Ft();
        return;
      }
    }
    nd(e, n2, r2, s, o);
  }
  function nd(e, t2, n2, s = true, r2 = false) {
    if (r2) throw e;
    console.error(e);
  }
  var Ke = [];
  var St = -1;
  var Hn = [];
  var Kt = null;
  var Pn = 0;
  var ru = Promise.resolve();
  var ar = null;
  function ct(e) {
    const t2 = ar || ru;
    return e ? t2.then(this ? e.bind(this) : e) : t2;
  }
  function sd(e) {
    let t2 = St + 1, n2 = Ke.length;
    for (; t2 < n2; ) {
      const s = t2 + n2 >>> 1, r2 = Ke[s], i2 = ms(r2);
      i2 < e || i2 === e && r2.flags & 2 ? t2 = s + 1 : n2 = s;
    }
    return t2;
  }
  function no(e) {
    if (!(e.flags & 1)) {
      const t2 = ms(e), n2 = Ke[Ke.length - 1];
      !n2 || !(e.flags & 2) && t2 >= ms(n2) ? Ke.push(e) : Ke.splice(sd(t2), 0, e), e.flags |= 1, iu();
    }
  }
  function iu() {
    ar || (ar = ru.then(lu));
  }
  function rd(e) {
    if (!ee(e)) Kt && e.id === -1 ? Kt.splice(Pn + 1, 0, e) : e.flags & 1 || (Hn.push(e), e.flags |= 1);
    else for (let t2 = 0; t2 < e.length; t2++) Hn.push(e[t2]);
    iu();
  }
  function Uo(e, t2, n2 = St + 1) {
    for (; n2 < Ke.length; n2++) {
      const s = Ke[n2];
      if (s && s.flags & 2) {
        if (e && s.id !== e.uid) continue;
        Ke.splice(n2, 1), n2--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
      }
    }
  }
  function ou(e) {
    if (Hn.length) {
      const t2 = [...new Set(Hn)].sort((n2, s) => ms(n2) - ms(s));
      if (Hn.length = 0, Kt) {
        for (let n2 = 0; n2 < t2.length; n2++) Kt.push(t2[n2]);
        return;
      }
      for (Kt = t2, Pn = 0; Pn < Kt.length; Pn++) {
        const n2 = Kt[Pn];
        n2.flags & 4 && (n2.flags &= -2), n2.flags & 8 || n2(), n2.flags &= -2;
      }
      Kt = null, Pn = 0;
    }
  }
  var ms = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
  function lu(e) {
    try {
      for (St = 0; St < Ke.length; St++) {
        const t2 = Ke[St];
        t2 && !(t2.flags & 8) && (t2.flags & 4 && (t2.flags &= -2), Ms(t2, t2.i, t2.i ? 15 : 14), t2.flags & 4 || (t2.flags &= -2));
      }
    } finally {
      for (; St < Ke.length; St++) {
        const t2 = Ke[St];
        t2 && (t2.flags &= -2);
      }
      St = -1, Ke.length = 0, ou(), ar = null, (Ke.length || Hn.length) && lu();
    }
  }
  var nt = null;
  var au = null;
  function ur(e) {
    const t2 = nt;
    return nt = e, au = e && e.type.__scopeId || null, t2;
  }
  function id(e, t2 = nt, n2) {
    if (!t2 || e._n) return e;
    const s = (...r2) => {
      s._d && vr(-1);
      const i2 = ur(t2), o = mn.length;
      let l;
      try {
        l = e(...r2);
      } finally {
        for (let a2 = mn.length; a2 > o; a2--) Bu();
        ur(i2), s._d && vr(1);
      }
      return l;
    };
    return s._n = true, s._c = true, s._d = true, s;
  }
  function Rt(e, t2) {
    if (nt === null) return e;
    const n2 = Kr(nt), s = e.dirs || (e.dirs = []);
    for (let r2 = 0; r2 < t2.length; r2++) {
      let [i2, o, l, a2 = Ce] = t2[r2];
      i2 && (se(i2) && (i2 = { mounted: i2, updated: i2 }), i2.deep && Dt(o), s.push({ dir: i2, instance: n2, value: o, oldValue: void 0, arg: l, modifiers: a2 }));
    }
    return e;
  }
  function rn(e, t2, n2, s) {
    const r2 = e.dirs, i2 = t2 && t2.dirs;
    for (let o = 0; o < r2.length; o++) {
      const l = r2[o];
      i2 && (l.oldValue = i2[o].value);
      let a2 = l.dir[s];
      a2 && (Ht(), dt(a2, n2, 8, [e.el, l, e, t2]), Ft());
    }
  }
  function Et(e, t2) {
    if (Ne) {
      let n2 = Ne.provides;
      const s = Ne.parent && Ne.parent.provides;
      s === n2 && (n2 = Ne.provides = Object.create(s)), n2[e] = t2;
    }
  }
  function Ie(e, t2, n2 = false) {
    const s = Ps();
    if (s || Fn) {
      let r2 = Fn ? Fn._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
      if (r2 && e in r2) return r2[e];
      if (arguments.length > 1) return n2 && se(t2) ? t2.call(s && s.proxy) : t2;
    }
  }
  var od = /* @__PURE__ */ Symbol.for("v-scx");
  var ld = () => Ie(od);
  function Tt(e, t2) {
    return so(e, null, t2);
  }
  function oe(e, t2, n2) {
    return so(e, t2, n2);
  }
  function so(e, t2, n2 = Ce) {
    const { immediate: s, deep: r2, flush: i2, once: o } = n2, l = Oe({}, n2), a2 = t2 && s || !t2 && i2 !== "post";
    let c2;
    if (bs) {
      if (i2 === "sync") {
        const h2 = ld();
        c2 = h2.__watcherHandles || (h2.__watcherHandles = []);
      } else if (!a2) {
        const h2 = () => {
        };
        return h2.stop = kt, h2.resume = kt, h2.pause = kt, h2;
      }
    }
    const u = Ne;
    l.call = (h2, b, g) => dt(h2, u, b, g);
    let f2 = false;
    i2 === "post" ? l.scheduler = (h2) => {
      Ue(h2, u && u.suspense);
    } : i2 !== "sync" && (f2 = true, l.scheduler = (h2, b) => {
      b ? h2() : no(h2);
    }), l.augmentJob = (h2) => {
      t2 && (h2.flags |= 4), f2 && (h2.flags |= 2, u && (h2.id = u.uid, h2.i = u));
    };
    const d = td(e, t2, l);
    return bs && (c2 ? c2.push(d) : a2 && d()), d;
  }
  function ad(e, t2, n2) {
    const s = this.proxy, r2 = Le(e) ? e.includes(".") ? uu(s, e) : () => s[e] : e.bind(s, s);
    let i2;
    se(t2) ? i2 = t2 : (i2 = t2.handler, n2 = t2);
    const o = Is(this), l = so(r2, i2.bind(s), n2);
    return o(), l;
  }
  function uu(e, t2) {
    const n2 = t2.split(".");
    return () => {
      let s = e;
      for (let r2 = 0; r2 < n2.length && s; r2++) s = s[n2[r2]];
      return s;
    };
  }
  var Yt = /* @__PURE__ */ new WeakMap();
  var cu = /* @__PURE__ */ Symbol("_vte");
  var zr = (e) => e.__isTeleport;
  var fn = (e) => e && (e.disabled || e.disabled === "");
  var ud = (e) => e && (e.defer || e.defer === "");
  var Ko = (e) => typeof SVGElement < "u" && e instanceof SVGElement;
  var Go = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement;
  var Ai = (e, t2) => {
    const n2 = e && e.to;
    return Le(n2) ? t2 ? t2(n2) : null : n2;
  };
  var cd = { name: "Teleport", __isTeleport: true, process(e, t2, n2, s, r2, i2, o, l, a2, c2) {
    const { mc: u, pc: f2, pbc: d, o: { insert: h2, querySelector: b, createText: g, createComment: S, parentNode: m } } = c2, w = fn(t2.props);
    let { dynamicChildren: C2 } = t2;
    const x = (L2, p2, T) => {
      L2.shapeFlag & 16 && u(L2.children, p2, T, r2, i2, o, l, a2);
    }, M2 = (L2 = t2) => {
      const p2 = fn(L2.props), T = L2.target = Ai(L2.props, b), H = ki(T, L2, g, h2);
      T && (o !== "svg" && Ko(T) ? o = "svg" : o !== "mathml" && Go(T) && (o = "mathml"), r2 && r2.isCE && (r2.ce._teleportTargets || (r2.ce._teleportTargets = /* @__PURE__ */ new Set())).add(T), p2 || (x(L2, T, H), ts(L2, false)));
    }, A2 = (L2) => {
      const p2 = () => {
        if (Yt.get(L2) === p2) {
          if (Yt.delete(L2), fn(L2.props)) {
            const T = m(L2.el) || n2;
            x(L2, T, L2.anchor), ts(L2, true);
          }
          M2(L2);
        }
      };
      Yt.set(L2, p2), Ue(p2, i2);
    };
    if (e == null) {
      const L2 = t2.el = g(""), p2 = t2.anchor = g("");
      if (h2(L2, n2, s), h2(p2, n2, s), ud(t2.props) || i2 && i2.pendingBranch) {
        A2(t2);
        return;
      }
      w && (x(t2, n2, p2), ts(t2, true)), M2();
    } else {
      t2.el = e.el;
      const L2 = t2.anchor = e.anchor, p2 = Yt.get(e);
      if (p2) {
        p2.flags |= 8, Yt.delete(e), A2(t2);
        return;
      }
      t2.targetStart = e.targetStart;
      const T = t2.target = e.target, H = t2.targetAnchor = e.targetAnchor, Y = fn(e.props), I2 = Y ? n2 : T, F2 = Y ? L2 : H;
      if (o === "svg" || Ko(T) ? o = "svg" : (o === "mathml" || Go(T)) && (o = "mathml"), C2 ? (d(e.dynamicChildren, C2, I2, r2, i2, o, l), ao(e, t2, true)) : a2 || f2(e, t2, I2, F2, r2, i2, o, l, false), w) Y ? t2.props && e.props && t2.props.to !== e.props.to && (t2.props.to = e.props.to) : qs(t2, n2, L2, c2, 1);
      else if ((t2.props && t2.props.to) !== (e.props && e.props.to)) {
        const z = Ai(t2.props, b);
        z && (t2.target = z, qs(t2, z, null, c2, 0));
      } else Y && qs(t2, T, H, c2, 1);
      ts(t2, w);
    }
  }, remove(e, t2, n2, { um: s, o: { remove: r2 } }, i2) {
    const { shapeFlag: o, children: l, anchor: a2, targetStart: c2, targetAnchor: u, target: f2, props: d } = e, h2 = fn(d), b = i2 || !h2, g = Yt.get(e);
    if (g && (g.flags |= 8, Yt.delete(e)), f2 && (r2(c2), r2(u)), i2 && r2(a2), !g && (h2 || f2) && o & 16) for (let S = 0; S < l.length; S++) {
      const m = l[S];
      s(m, t2, n2, b, !!m.dynamicChildren);
    }
  }, move: qs, hydrate: fd };
  function qs(e, t2, n2, { o: { insert: s }, m: r2 }, i2 = 2) {
    i2 === 0 && s(e.targetAnchor, t2, n2);
    const { el: o, anchor: l, shapeFlag: a2, children: c2, props: u } = e, f2 = i2 === 2;
    if (f2 && s(o, t2, n2), !Yt.has(e) && (!f2 || fn(u)) && a2 & 16) for (let d = 0; d < c2.length; d++) r2(c2[d], t2, n2, 2);
    f2 && s(l, t2, n2);
  }
  function fd(e, t2, n2, s, r2, i2, { o: { nextSibling: o, parentNode: l, querySelector: a2, insert: c2, createText: u } }, f2) {
    function d(S, m) {
      let w = m;
      for (; w; ) {
        if (w && w.nodeType === 8) {
          if (w.data === "teleport start anchor") t2.targetStart = w;
          else if (w.data === "teleport anchor") {
            t2.targetAnchor = w, S._lpa = t2.targetAnchor && o(t2.targetAnchor);
            break;
          }
        }
        w = o(w);
      }
    }
    function h2(S, m) {
      m.anchor = f2(o(S), m, l(S), n2, s, r2, i2);
    }
    const b = t2.target = Ai(t2.props, a2), g = fn(t2.props);
    if (b) {
      const S = b._lpa || b.firstChild;
      t2.shapeFlag & 16 && (g ? (h2(e, t2), d(b, S), t2.targetAnchor || ki(b, t2, u, c2, l(e) === b ? e : null)) : (t2.anchor = o(e), d(b, S), t2.targetAnchor || ki(b, t2, u, c2), f2(S && o(S), t2, b, n2, s, r2, i2))), ts(t2, g);
    } else g && t2.shapeFlag & 16 && (h2(e, t2), t2.targetStart = e, t2.targetAnchor = o(e));
    return t2.anchor && o(t2.anchor);
  }
  var dd = cd;
  function ts(e, t2) {
    const n2 = e.ctx;
    if (n2 && n2.ut) {
      let s, r2;
      for (t2 ? (s = e.el, r2 = e.anchor) : (s = e.targetStart, r2 = e.targetAnchor); s && s !== r2; ) s.nodeType === 1 && s.setAttribute("data-v-owner", n2.uid), s = s.nextSibling;
      n2.ut();
    }
  }
  function ki(e, t2, n2, s, r2 = null) {
    const i2 = t2.targetStart = n2(""), o = t2.targetAnchor = n2("");
    return i2[cu] = o, e && (s(i2, e, r2), s(o, e, r2)), o;
  }
  var ut = /* @__PURE__ */ Symbol("_leaveCb");
  var Xn = /* @__PURE__ */ Symbol("_enterCb");
  function fu() {
    const e = { isMounted: false, isLeaving: false, isUnmounting: false, leavingVNodes: /* @__PURE__ */ new Map() };
    return Ln(() => {
      e.isMounted = true;
    }), Jt(() => {
      e.isUnmounting = true;
    }), e;
  }
  var at = [Function, Array];
  var du = { mode: String, appear: Boolean, persisted: Boolean, onBeforeEnter: at, onEnter: at, onAfterEnter: at, onEnterCancelled: at, onBeforeLeave: at, onLeave: at, onAfterLeave: at, onLeaveCancelled: at, onBeforeAppear: at, onAppear: at, onAfterAppear: at, onAppearCancelled: at };
  var vu = (e) => {
    const t2 = e.subTree;
    return t2.component ? vu(t2.component) : t2;
  };
  var vd = { name: "BaseTransition", props: du, setup(e, { slots: t2 }) {
    const n2 = Ps(), s = fu();
    return () => {
      const r2 = t2.default && ro(t2.default(), true), i2 = r2 && r2.length ? hu(r2) : n2.subTree ? nv() : void 0;
      if (!i2) return;
      const o = ue(e), { mode: l } = o;
      if (s.isLeaving) return ii(i2);
      const a2 = cr(i2);
      if (!a2) return ii(i2);
      let c2 = gs(a2, o, s, n2, (f2) => c2 = f2);
      a2.type !== Ge && Cn(a2, c2);
      let u = n2.subTree && cr(n2.subTree);
      if (u && u.type !== Ge && !dn(u, a2) && vu(n2).type !== Ge) {
        let f2 = gs(u, o, s, n2);
        if (Cn(u, f2), l === "out-in" && a2.type !== Ge) return s.isLeaving = true, f2.afterLeave = () => {
          s.isLeaving = false, n2.job.flags & 8 || n2.update(), delete f2.afterLeave, u = void 0;
        }, ii(i2);
        l === "in-out" && a2.type !== Ge ? f2.delayLeave = (d, h2, b) => {
          const g = mu(s, u);
          g[String(u.key)] = u, d[ut] = () => {
            h2(), d[ut] = void 0, delete c2.delayedLeave, u = void 0;
          }, c2.delayedLeave = () => {
            b(), delete c2.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return i2;
    };
  } };
  function hu(e) {
    let t2 = e[0];
    if (e.length > 1) {
      for (const n2 of e) if (n2.type !== Ge) {
        t2 = n2;
        break;
      }
    }
    return t2;
  }
  var hd = vd;
  function mu(e, t2) {
    const { leavingVNodes: n2 } = e;
    let s = n2.get(t2.type);
    return s || (s = /* @__PURE__ */ Object.create(null), n2.set(t2.type, s)), s;
  }
  function gs(e, t2, n2, s, r2) {
    const { appear: i2, mode: o, persisted: l = false, onBeforeEnter: a2, onEnter: c2, onAfterEnter: u, onEnterCancelled: f2, onBeforeLeave: d, onLeave: h2, onAfterLeave: b, onLeaveCancelled: g, onBeforeAppear: S, onAppear: m, onAfterAppear: w, onAppearCancelled: C2 } = t2, x = String(e.key), M2 = mu(n2, e), A2 = (T, H) => {
      T && dt(T, s, 9, H);
    }, L2 = (T, H) => {
      const Y = H[1];
      A2(T, H), ee(T) ? T.every((I2) => I2.length <= 1) && Y() : T.length <= 1 && Y();
    }, p2 = { mode: o, persisted: l, beforeEnter(T) {
      let H = a2;
      if (!n2.isMounted) if (i2) H = S || a2;
      else return;
      T[ut] && T[ut](true);
      const Y = M2[x];
      Y && dn(e, Y) && Y.el[ut] && Y.el[ut](), A2(H, [T]);
    }, enter(T) {
      if (M2[x] === e) return;
      let H = c2, Y = u, I2 = f2;
      if (!n2.isMounted) if (i2) H = m || c2, Y = w || u, I2 = C2 || f2;
      else return;
      let F2 = false;
      T[Xn] = (G2) => {
        F2 || (F2 = true, G2 ? A2(I2, [T]) : A2(Y, [T]), p2.delayedLeave && p2.delayedLeave(), T[Xn] = void 0);
      };
      const z = T[Xn].bind(null, false);
      H ? L2(H, [T, z]) : z();
    }, leave(T, H) {
      const Y = String(e.key);
      if (T[Xn] && T[Xn](true), n2.isUnmounting) return H();
      A2(d, [T]);
      let I2 = false;
      T[ut] = (z) => {
        I2 || (I2 = true, H(), z ? A2(g, [T]) : A2(b, [T]), T[ut] = void 0, M2[Y] === e && delete M2[Y]);
      };
      const F2 = T[ut].bind(null, false);
      M2[Y] = e, h2 ? L2(h2, [T, F2]) : F2();
    }, clone(T) {
      const H = gs(T, t2, n2, s, r2);
      return r2 && r2(H), H;
    } };
    return p2;
  }
  function ii(e) {
    if (jr(e)) return e = Xt(e), e.children = null, e;
  }
  function cr(e) {
    if (!jr(e)) return zr(e.type) && e.children ? hu(e.children) : e;
    if (e.component) return e.component.subTree;
    const { shapeFlag: t2, children: n2 } = e;
    if (n2) {
      if (t2 & 16) return n2[0];
      if (t2 & 32 && se(n2.default)) return n2.default();
    }
  }
  function Cn(e, t2) {
    if (e.shapeFlag & 6 && e.component) {
      e.transition = t2;
      const n2 = e.component.subTree;
      Cn(zr(n2.type) && cr(n2) || n2, t2);
    } else e.shapeFlag & 128 ? (e.ssContent.transition = t2.clone(e.ssContent), e.ssFallback.transition = t2.clone(e.ssFallback)) : e.transition = t2;
  }
  function ro(e, t2 = false, n2) {
    let s = [], r2 = 0;
    for (let i2 = 0; i2 < e.length; i2++) {
      let o = e[i2];
      const l = n2 == null ? o.key : String(n2) + String(o.key != null ? o.key : i2);
      o.type === Me ? (o.patchFlag & 128 && r2++, s = s.concat(ro(o.children, t2, l))) : (t2 || o.type !== Ge) && s.push(l != null ? Xt(o, { key: l }) : o);
    }
    if (r2 > 1) for (let i2 = 0; i2 < s.length; i2++) s[i2].patchFlag = -2;
    return s;
  }
  function md(e, t2) {
    return se(e) ? Oe({ name: e.name }, t2, { setup: e }) : e;
  }
  function gu() {
    const e = Ps();
    return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
  }
  function yu(e) {
    e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
  }
  function Zo(e, t2) {
    let n2;
    return !!((n2 = Object.getOwnPropertyDescriptor(e, t2)) && !n2.configurable);
  }
  var fr = /* @__PURE__ */ new WeakMap();
  function ls(e, t2, n2, s, r2 = false) {
    if (ee(e)) {
      e.forEach((g, S) => ls(g, t2 && (ee(t2) ? t2[S] : t2), n2, s, r2));
      return;
    }
    if (as(s) && !r2) {
      s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && ls(e, t2, n2, s.component.subTree);
      return;
    }
    const i2 = s.shapeFlag & 4 ? Kr(s.component) : s.el, o = r2 ? null : i2, { i: l, r: a2 } = e, c2 = t2 && t2.r, u = l.refs === Ce ? l.refs = {} : l.refs, f2 = l.setupState, d = ue(f2), h2 = f2 === Ce ? Ma : (g) => Zo(u, g) ? false : me(d, g), b = (g, S) => !(S && Zo(u, S));
    if (c2 != null && c2 !== a2) {
      if (qo(t2), Le(c2)) u[c2] = null, h2(c2) && (f2[c2] = null);
      else if (Ee(c2)) {
        const g = t2;
        b(c2, g.k) && (c2.value = null), g.k && (u[g.k] = null);
      }
    }
    if (se(a2)) Ms(a2, l, 12, [o, u]);
    else {
      const g = Le(a2), S = Ee(a2);
      if (g || S) {
        const m = () => {
          if (e.f) {
            const w = g ? h2(a2) ? f2[a2] : u[a2] : b() || !e.k ? a2.value : u[e.k];
            if (r2) ee(w) && Zi(w, i2);
            else if (ee(w)) w.includes(i2) || w.push(i2);
            else if (g) u[a2] = [i2], h2(a2) && (f2[a2] = u[a2]);
            else {
              const C2 = [i2];
              b(a2, e.k) && (a2.value = C2), e.k && (u[e.k] = C2);
            }
          } else g ? (u[a2] = o, h2(a2) && (f2[a2] = o)) : S && (b(a2, e.k) && (a2.value = o), e.k && (u[e.k] = o));
        };
        if (o) {
          const w = () => {
            m(), fr.delete(e);
          };
          w.id = -1, fr.set(e, w), Ue(w, n2);
        } else qo(e), m();
      }
    }
  }
  function qo(e) {
    const t2 = fr.get(e);
    t2 && (t2.flags |= 8, fr.delete(e));
  }
  $r().requestIdleCallback;
  $r().cancelIdleCallback;
  var as = (e) => !!e.type.__asyncLoader;
  var jr = (e) => e.type.__isKeepAlive;
  function gd(e, t2) {
    bu(e, "a", t2);
  }
  function pu(e, t2) {
    bu(e, "da", t2);
  }
  function bu(e, t2, n2 = Ne) {
    const s = e.__wdc || (e.__wdc = () => {
      let r2 = n2;
      for (; r2; ) {
        if (r2.isDeactivated) return;
        r2 = r2.parent;
      }
      return e();
    });
    if (Yr(t2, s, n2), n2) {
      let r2 = n2.parent;
      for (; r2 && r2.parent; ) jr(r2.parent.vnode) && yd(s, t2, n2, r2), r2 = r2.parent;
    }
  }
  function yd(e, t2, n2, s) {
    const r2 = Yr(t2, e, s, true);
    Cu(() => {
      Zi(s[t2], r2);
    }, n2);
  }
  function Yr(e, t2, n2 = Ne, s = false) {
    if (n2) {
      const r2 = n2[e] || (n2[e] = []), i2 = t2.__weh || (t2.__weh = (...o) => {
        Ht();
        const l = Is(n2), a2 = dt(t2, n2, e, o);
        return l(), Ft(), a2;
      });
      return s ? r2.unshift(i2) : r2.push(i2), i2;
    }
  }
  var Nt = (e) => (t2, n2 = Ne) => {
    (!bs || e === "sp") && Yr(e, (...s) => t2(...s), n2);
  };
  var wu = Nt("bm");
  var Ln = Nt("m");
  var pd = Nt("bu");
  var io = Nt("u");
  var Jt = Nt("bum");
  var Cu = Nt("um");
  var bd = Nt("sp");
  var wd = Nt("rtg");
  var Cd = Nt("rtc");
  function Sd(e, t2 = Ne) {
    Yr("ec", e, t2);
  }
  var Su = "components";
  function iy(e, t2) {
    return xu(Su, e, true, t2) || e;
  }
  var xd = /* @__PURE__ */ Symbol.for("v-ndc");
  function _d(e) {
    return Le(e) && xu(Su, e, false) || e;
  }
  function xu(e, t2, n2 = true, s = false) {
    const r2 = nt || Ne;
    if (r2) {
      const i2 = r2.type;
      {
        const l = cv(i2, false);
        if (l && (l === t2 || l === je(t2) || l === jn(je(t2)))) return i2;
      }
      const o = Xo(r2[e] || i2[e], t2) || Xo(r2.appContext[e], t2);
      return !o && s ? i2 : o;
    }
  }
  function Xo(e, t2) {
    return e && (e[t2] || e[je(t2)] || e[jn(je(t2))]);
  }
  function oy(e, t2, n2, s) {
    let r2;
    const i2 = n2, o = ee(e);
    if (o || Le(e)) {
      const l = o && hn(e);
      let a2 = false, c2 = false;
      l && (a2 = !ot(e), c2 = $t(e), e = Br(e)), r2 = new Array(e.length);
      for (let u = 0, f2 = e.length; u < f2; u++) r2[u] = t2(a2 ? c2 ? Rn(mt(e[u])) : mt(e[u]) : e[u], u, void 0, i2);
    } else if (typeof e == "number") {
      r2 = new Array(e);
      for (let l = 0; l < e; l++) r2[l] = t2(l + 1, l, void 0, i2);
    } else if (ve(e)) if (e[Symbol.iterator]) r2 = Array.from(e, (l, a2) => t2(l, a2, void 0, i2));
    else {
      const l = Object.keys(e);
      r2 = new Array(l.length);
      for (let a2 = 0, c2 = l.length; a2 < c2; a2++) {
        const u = l[a2];
        r2[a2] = t2(e[u], u, a2, i2);
      }
    }
    else r2 = [];
    return r2;
  }
  var Ti = (e) => e ? zu(e) ? Kr(e) : Ti(e.parent) : null;
  var us = Oe(/* @__PURE__ */ Object.create(null), { $: (e) => e, $el: (e) => e.vnode.el, $data: (e) => e.data, $props: (e) => e.props, $attrs: (e) => e.attrs, $slots: (e) => e.slots, $refs: (e) => e.refs, $parent: (e) => Ti(e.parent), $root: (e) => Ti(e.root), $host: (e) => e.ce, $emit: (e) => e.emit, $options: (e) => Lu(e), $forceUpdate: (e) => e.f || (e.f = () => {
    no(e.update);
  }), $nextTick: (e) => e.n || (e.n = ct.bind(e.proxy)), $watch: (e) => ad.bind(e) });
  var oi = (e, t2) => e !== Ce && !e.__isScriptSetup && me(e, t2);
  var Ld = { get({ _: e }, t2) {
    if (t2 === "__v_skip") return true;
    const { ctx: n2, setupState: s, data: r2, props: i2, accessCache: o, type: l, appContext: a2 } = e;
    if (t2[0] !== "$") {
      const d = o[t2];
      if (d !== void 0) switch (d) {
        case 1:
          return s[t2];
        case 2:
          return r2[t2];
        case 4:
          return n2[t2];
        case 3:
          return i2[t2];
      }
      else {
        if (oi(s, t2)) return o[t2] = 1, s[t2];
        if (r2 !== Ce && me(r2, t2)) return o[t2] = 2, r2[t2];
        if (me(i2, t2)) return o[t2] = 3, i2[t2];
        if (n2 !== Ce && me(n2, t2)) return o[t2] = 4, n2[t2];
        Ei && (o[t2] = 0);
      }
    }
    const c2 = us[t2];
    let u, f2;
    if (c2) return t2 === "$attrs" && Be(e.attrs, "get", ""), c2(e);
    if ((u = l.__cssModules) && (u = u[t2])) return u;
    if (n2 !== Ce && me(n2, t2)) return o[t2] = 4, n2[t2];
    if (f2 = a2.config.globalProperties, me(f2, t2)) return f2[t2];
  }, set({ _: e }, t2, n2) {
    const { data: s, setupState: r2, ctx: i2 } = e;
    return oi(r2, t2) ? (r2[t2] = n2, true) : s !== Ce && me(s, t2) ? (s[t2] = n2, true) : me(e.props, t2) || t2[0] === "$" && t2.slice(1) in e ? false : (i2[t2] = n2, true);
  }, has({ _: { data: e, setupState: t2, accessCache: n2, ctx: s, appContext: r2, props: i2, type: o } }, l) {
    let a2;
    return !!(n2[l] || e !== Ce && l[0] !== "$" && me(e, l) || oi(t2, l) || me(i2, l) || me(s, l) || me(us, l) || me(r2.config.globalProperties, l) || (a2 = o.__cssModules) && a2[l]);
  }, defineProperty(e, t2, n2) {
    return n2.get != null ? e._.accessCache[t2] = 0 : me(n2, "value") && this.set(e, t2, n2.value, null), Reflect.defineProperty(e, t2, n2);
  } };
  function Jo(e) {
    return ee(e) ? e.reduce((t2, n2) => (t2[n2] = null, t2), {}) : e;
  }
  var Ei = true;
  function Ad(e) {
    const t2 = Lu(e), n2 = e.proxy, s = e.ctx;
    Ei = false, t2.beforeCreate && Qo(t2.beforeCreate, e, "bc");
    const { data: r2, computed: i2, methods: o, watch: l, provide: a2, inject: c2, created: u, beforeMount: f2, mounted: d, beforeUpdate: h2, updated: b, activated: g, deactivated: S, beforeDestroy: m, beforeUnmount: w, destroyed: C2, unmounted: x, render: M2, renderTracked: A2, renderTriggered: L2, errorCaptured: p2, serverPrefetch: T, expose: H, inheritAttrs: Y, components: I2, directives: F2, filters: z } = t2;
    if (c2 && kd(c2, s, null), o) for (const q in o) {
      const te2 = o[q];
      se(te2) && (s[q] = te2.bind(n2));
    }
    if (r2) {
      const q = r2.call(n2, n2);
      ve(q) && (e.data = $e(q));
    }
    if (Ei = true, i2) for (const q in i2) {
      const te2 = i2[q], Te = se(te2) ? te2.bind(n2, n2) : se(te2.get) ? te2.get.bind(n2, n2) : kt, de2 = !se(te2) && se(te2.set) ? te2.set.bind(n2) : kt, Ae = D({ get: Te, set: de2 });
      Object.defineProperty(s, q, { enumerable: true, configurable: true, get: () => Ae.value, set: (U2) => Ae.value = U2 });
    }
    if (l) for (const q in l) _u(l[q], s, n2, q);
    if (a2) {
      const q = se(a2) ? a2.call(n2) : a2;
      Reflect.ownKeys(q).forEach((te2) => {
        Et(te2, q[te2]);
      });
    }
    u && Qo(u, e, "c");
    function re2(q, te2) {
      ee(te2) ? te2.forEach((Te) => q(Te.bind(n2))) : te2 && q(te2.bind(n2));
    }
    if (re2(wu, f2), re2(Ln, d), re2(pd, h2), re2(io, b), re2(gd, g), re2(pu, S), re2(Sd, p2), re2(Cd, A2), re2(wd, L2), re2(Jt, w), re2(Cu, x), re2(bd, T), ee(H)) if (H.length) {
      const q = e.exposed || (e.exposed = {});
      H.forEach((te2) => {
        Object.defineProperty(q, te2, { get: () => n2[te2], set: (Te) => n2[te2] = Te, enumerable: true });
      });
    } else e.exposed || (e.exposed = {});
    M2 && e.render === kt && (e.render = M2), Y != null && (e.inheritAttrs = Y), I2 && (e.components = I2), F2 && (e.directives = F2), T && yu(e);
  }
  function kd(e, t2, n2 = kt) {
    ee(e) && (e = Mi(e));
    for (const s in e) {
      const r2 = e[s];
      let i2;
      ve(r2) ? "default" in r2 ? i2 = Ie(r2.from || s, r2.default, true) : i2 = Ie(r2.from || s) : i2 = Ie(r2), Ee(i2) ? Object.defineProperty(t2, s, { enumerable: true, configurable: true, get: () => i2.value, set: (o) => i2.value = o }) : t2[s] = i2;
    }
  }
  function Qo(e, t2, n2) {
    dt(ee(e) ? e.map((s) => s.bind(t2.proxy)) : e.bind(t2.proxy), t2, n2);
  }
  function _u(e, t2, n2, s) {
    let r2 = s.includes(".") ? uu(n2, s) : () => n2[s];
    if (Le(e)) {
      const i2 = t2[e];
      se(i2) && oe(r2, i2);
    } else if (se(e)) oe(r2, e.bind(n2));
    else if (ve(e)) if (ee(e)) e.forEach((i2) => _u(i2, t2, n2, s));
    else {
      const i2 = se(e.handler) ? e.handler.bind(n2) : t2[e.handler];
      se(i2) && oe(r2, i2, e);
    }
  }
  function Lu(e) {
    const t2 = e.type, { mixins: n2, extends: s } = t2, { mixins: r2, optionsCache: i2, config: { optionMergeStrategies: o } } = e.appContext, l = i2.get(t2);
    let a2;
    return l ? a2 = l : !r2.length && !n2 && !s ? a2 = t2 : (a2 = {}, r2.length && r2.forEach((c2) => dr(a2, c2, o, true)), dr(a2, t2, o)), ve(t2) && i2.set(t2, a2), a2;
  }
  function dr(e, t2, n2, s = false) {
    const { mixins: r2, extends: i2 } = t2;
    i2 && dr(e, i2, n2, true), r2 && r2.forEach((o) => dr(e, o, n2, true));
    for (const o in t2) if (!(s && o === "expose")) {
      const l = Td[o] || n2 && n2[o];
      e[o] = l ? l(e[o], t2[o]) : t2[o];
    }
    return e;
  }
  var Td = { data: el, props: tl, emits: tl, methods: ns, computed: ns, beforeCreate: Ye, created: Ye, beforeMount: Ye, mounted: Ye, beforeUpdate: Ye, updated: Ye, beforeDestroy: Ye, beforeUnmount: Ye, destroyed: Ye, unmounted: Ye, activated: Ye, deactivated: Ye, errorCaptured: Ye, serverPrefetch: Ye, components: ns, directives: ns, watch: Md, provide: el, inject: Ed };
  function el(e, t2) {
    return t2 ? e ? function() {
      return Oe(se(e) ? e.call(this, this) : e, se(t2) ? t2.call(this, this) : t2);
    } : t2 : e;
  }
  function Ed(e, t2) {
    return ns(Mi(e), Mi(t2));
  }
  function Mi(e) {
    if (ee(e)) {
      const t2 = {};
      for (let n2 = 0; n2 < e.length; n2++) t2[e[n2]] = e[n2];
      return t2;
    }
    return e;
  }
  function Ye(e, t2) {
    return e ? [...new Set([].concat(e, t2))] : t2;
  }
  function ns(e, t2) {
    return e ? Oe(/* @__PURE__ */ Object.create(null), e, t2) : t2;
  }
  function tl(e, t2) {
    return e ? ee(e) && ee(t2) ? [.../* @__PURE__ */ new Set([...e, ...t2])] : Oe(/* @__PURE__ */ Object.create(null), Jo(e), Jo(t2 ?? {})) : t2;
  }
  function Md(e, t2) {
    if (!e) return t2;
    if (!t2) return e;
    const n2 = Oe(/* @__PURE__ */ Object.create(null), e);
    for (const s in t2) n2[s] = Ye(e[s], t2[s]);
    return n2;
  }
  function Au() {
    return { app: null, config: { isNativeTag: Ma, performance: false, globalProperties: {}, optionMergeStrategies: {}, errorHandler: void 0, warnHandler: void 0, compilerOptions: {} }, mixins: [], components: {}, directives: {}, provides: /* @__PURE__ */ Object.create(null), optionsCache: /* @__PURE__ */ new WeakMap(), propsCache: /* @__PURE__ */ new WeakMap(), emitsCache: /* @__PURE__ */ new WeakMap() };
  }
  var Vd = 0;
  function Pd(e, t2) {
    return function(s, r2 = null) {
      se(s) || (s = Oe({}, s)), r2 != null && !ve(r2) && (r2 = null);
      const i2 = Au(), o = /* @__PURE__ */ new WeakSet(), l = [];
      let a2 = false;
      const c2 = i2.app = { _uid: Vd++, _component: s, _props: r2, _container: null, _context: i2, _instance: null, version: dv, get config() {
        return i2.config;
      }, set config(u) {
      }, use(u, ...f2) {
        return o.has(u) || (u && se(u.install) ? (o.add(u), u.install(c2, ...f2)) : se(u) && (o.add(u), u(c2, ...f2))), c2;
      }, mixin(u) {
        return i2.mixins.includes(u) || i2.mixins.push(u), c2;
      }, component(u, f2) {
        return f2 ? (i2.components[u] = f2, c2) : i2.components[u];
      }, directive(u, f2) {
        return f2 ? (i2.directives[u] = f2, c2) : i2.directives[u];
      }, mount(u, f2, d) {
        if (!a2) {
          const h2 = c2._ceVNode || k(s, r2);
          return h2.appContext = i2, d === true ? d = "svg" : d === false && (d = void 0), e(h2, u, d), a2 = true, c2._container = u, u.__vue_app__ = c2, Kr(h2.component);
        }
      }, onUnmount(u) {
        l.push(u);
      }, unmount() {
        a2 && (dt(l, c2._instance, 16), e(null, c2._container), delete c2._container.__vue_app__);
      }, provide(u, f2) {
        return i2.provides[u] = f2, c2;
      }, runWithContext(u) {
        const f2 = Fn;
        Fn = c2;
        try {
          return u();
        } finally {
          Fn = f2;
        }
      } };
      return c2;
    };
  }
  var Fn = null;
  var Id = (e, t2) => t2 === "modelValue" || t2 === "model-value" ? e.modelModifiers : e[`${t2}Modifiers`] || e[`${je(t2)}Modifiers`] || e[`${_n(t2)}Modifiers`];
  function Od(e, t2, ...n2) {
    if (e.isUnmounted) return;
    const s = e.vnode.props || Ce;
    let r2 = n2;
    const i2 = t2.startsWith("update:"), o = i2 && Id(s, t2.slice(7));
    o && (o.trim && (r2 = n2.map((u) => Le(u) ? u.trim() : u)), o.number && (r2 = r2.map(bf)));
    let l, a2 = s[l = Qr(t2)] || s[l = Qr(je(t2))];
    !a2 && i2 && (a2 = s[l = Qr(_n(t2))]), a2 && dt(a2, e, 6, r2);
    const c2 = s[l + "Once"];
    if (c2) {
      if (!e.emitted) e.emitted = {};
      else if (e.emitted[l]) return;
      e.emitted[l] = true, dt(c2, e, 6, r2);
    }
  }
  var Dd = /* @__PURE__ */ new WeakMap();
  function ku(e, t2, n2 = false) {
    const s = n2 ? Dd : t2.emitsCache, r2 = s.get(e);
    if (r2 !== void 0) return r2;
    const i2 = e.emits;
    let o = {}, l = false;
    if (!se(e)) {
      const a2 = (c2) => {
        const u = ku(c2, t2, true);
        u && (l = true, Oe(o, u));
      };
      !n2 && t2.mixins.length && t2.mixins.forEach(a2), e.extends && a2(e.extends), e.mixins && e.mixins.forEach(a2);
    }
    return !i2 && !l ? (ve(e) && s.set(e, null), null) : (ee(i2) ? i2.forEach((a2) => o[a2] = null) : Oe(o, i2), ve(e) && s.set(e, o), o);
  }
  function Ur(e, t2) {
    return !e || !Or(t2) ? false : (t2 = t2.slice(2), t2 = t2 === "Once" ? t2 : t2.replace(/Once$/, ""), me(e, t2[0].toLowerCase() + t2.slice(1)) || me(e, _n(t2)) || me(e, t2));
  }
  function nl(e) {
    const { type: t2, vnode: n2, proxy: s, withProxy: r2, propsOptions: [i2], slots: o, attrs: l, emit: a2, render: c2, renderCache: u, props: f2, data: d, setupState: h2, ctx: b, inheritAttrs: g } = e, S = ur(e);
    let m, w;
    try {
      if (n2.shapeFlag & 4) {
        const x = r2 || s, M2 = x;
        m = _t(c2.call(M2, x, u, f2, h2, d, b)), w = l;
      } else {
        const x = t2;
        m = _t(x.length > 1 ? x(f2, { attrs: l, slots: o, emit: a2 }) : x(f2, null)), w = t2.props ? l : Hd(l);
      }
    } catch (x) {
      mn.length = 0, Wr(x, e, 1), m = k(Ge);
    }
    let C2 = m;
    if (w && g !== false) {
      const x = Object.keys(w), { shapeFlag: M2 } = C2;
      x.length && M2 & 7 && (i2 && x.some(Dr) && (w = Fd(w, i2)), C2 = Xt(C2, w, false, true));
    }
    if (n2.dirs && (C2 = Xt(C2, null, false, true), C2.dirs = C2.dirs ? C2.dirs.concat(n2.dirs) : n2.dirs), n2.transition) {
      const x = zr(C2.type) && cr(C2) || C2;
      Cn(x, n2.transition);
    }
    return m = C2, ur(S), m;
  }
  var Hd = (e) => {
    let t2;
    for (const n2 in e) (n2 === "class" || n2 === "style" || Or(n2)) && ((t2 || (t2 = {}))[n2] = e[n2]);
    return t2;
  };
  var Fd = (e, t2) => {
    const n2 = {};
    for (const s in e) (!Dr(s) || !(s.slice(9) in t2)) && (n2[s] = e[s]);
    return n2;
  };
  function $d(e, t2, n2) {
    const { props: s, children: r2, component: i2 } = e, { props: o, children: l, patchFlag: a2 } = t2, c2 = i2.emitsOptions;
    if (t2.dirs || t2.transition) return true;
    if (n2 && a2 >= 0) {
      if (a2 & 1024) return true;
      if (a2 & 16) return s ? sl(s, o, c2) : !!o;
      if (a2 & 8) {
        const u = t2.dynamicProps;
        for (let f2 = 0; f2 < u.length; f2++) {
          const d = u[f2];
          if (Tu(o, s, d) && !Ur(c2, d)) return true;
        }
      }
    } else return (r2 || l) && (!l || !l.$stable) ? true : s === o ? false : s ? o ? sl(s, o, c2) : true : !!o;
    return false;
  }
  function sl(e, t2, n2) {
    const s = Object.keys(t2);
    if (s.length !== Object.keys(e).length) return true;
    for (let r2 = 0; r2 < s.length; r2++) {
      const i2 = s[r2];
      if (Tu(t2, e, i2) && !Ur(n2, i2)) return true;
    }
    return false;
  }
  function Tu(e, t2, n2) {
    const s = e[n2], r2 = t2[n2];
    return n2 === "style" && ve(s) && ve(r2) ? !Rr(s, r2) : s !== r2;
  }
  function Rd({ vnode: e, parent: t2, suspense: n2 }, s) {
    for (; t2; ) {
      const r2 = t2.subTree;
      if (r2.suspense && r2.suspense.activeBranch === e && (r2.suspense.vnode.el = r2.el = s, e = r2), r2 === e) (e = t2.vnode).el = s, t2 = t2.parent;
      else break;
    }
    n2 && n2.activeBranch === e && (n2.vnode.el = s);
  }
  var Eu = {};
  var Mu = () => Object.create(Eu);
  var Vu = (e) => Object.getPrototypeOf(e) === Eu;
  function Bd(e, t2, n2, s = false) {
    const r2 = {}, i2 = Mu();
    e.propsDefaults = /* @__PURE__ */ Object.create(null), Pu(e, t2, r2, i2);
    for (const o in e.propsOptions[0]) o in r2 || (r2[o] = void 0);
    n2 ? e.props = s ? r2 : Uf(r2) : e.type.props ? e.props = r2 : e.props = i2, e.attrs = i2;
  }
  function Nd(e, t2, n2, s) {
    const { props: r2, attrs: i2, vnode: { patchFlag: o } } = e, l = ue(r2), [a2] = e.propsOptions;
    let c2 = false;
    if ((s || o > 0) && !(o & 16)) {
      if (o & 8) {
        const u = e.vnode.dynamicProps;
        for (let f2 = 0; f2 < u.length; f2++) {
          let d = u[f2];
          if (Ur(e.emitsOptions, d)) continue;
          const h2 = t2[d];
          if (a2) if (me(i2, d)) h2 !== i2[d] && (i2[d] = h2, c2 = true);
          else {
            const b = je(d);
            r2[b] = Vi(a2, l, b, h2, e, false);
          }
          else h2 !== i2[d] && (i2[d] = h2, c2 = true);
        }
      }
    } else {
      Pu(e, t2, r2, i2) && (c2 = true);
      let u;
      for (const f2 in l) (!t2 || !me(t2, f2) && ((u = _n(f2)) === f2 || !me(t2, u))) && (a2 ? n2 && (n2[f2] !== void 0 || n2[u] !== void 0) && (r2[f2] = Vi(a2, l, f2, void 0, e, true)) : delete r2[f2]);
      if (i2 !== l) for (const f2 in i2) (!t2 || !me(t2, f2)) && (delete i2[f2], c2 = true);
    }
    c2 && Ot(e.attrs, "set", "");
  }
  function Pu(e, t2, n2, s) {
    const [r2, i2] = e.propsOptions;
    let o = false, l;
    if (t2) for (let a2 in t2) {
      if (rs(a2)) continue;
      const c2 = t2[a2];
      let u;
      r2 && me(r2, u = je(a2)) ? !i2 || !i2.includes(u) ? n2[u] = c2 : (l || (l = {}))[u] = c2 : Ur(e.emitsOptions, a2) || (!(a2 in s) || c2 !== s[a2]) && (s[a2] = c2, o = true);
    }
    if (i2) {
      const a2 = ue(n2), c2 = l || Ce;
      for (let u = 0; u < i2.length; u++) {
        const f2 = i2[u];
        n2[f2] = Vi(r2, a2, f2, c2[f2], e, !me(c2, f2));
      }
    }
    return o;
  }
  function Vi(e, t2, n2, s, r2, i2) {
    const o = e[n2];
    if (o != null) {
      const l = me(o, "default");
      if (l && s === void 0) {
        const a2 = o.default;
        if (o.type !== Function && !o.skipFactory && se(a2)) {
          const { propsDefaults: c2 } = r2;
          if (n2 in c2) s = c2[n2];
          else {
            const u = Is(r2);
            s = c2[n2] = a2.call(null, t2), u();
          }
        } else s = a2;
        r2.ce && r2.ce._setProp(n2, s);
      }
      o[0] && (i2 && !l ? s = false : o[1] && (s === "" || s === _n(n2)) && (s = true));
    }
    return s;
  }
  var Wd = /* @__PURE__ */ new WeakMap();
  function Iu(e, t2, n2 = false) {
    const s = n2 ? Wd : t2.propsCache, r2 = s.get(e);
    if (r2) return r2;
    const i2 = e.props, o = {}, l = [];
    let a2 = false;
    if (!se(e)) {
      const u = (f2) => {
        a2 = true;
        const [d, h2] = Iu(f2, t2, true);
        Oe(o, d), h2 && l.push(...h2);
      };
      !n2 && t2.mixins.length && t2.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
    }
    if (!i2 && !a2) return ve(e) && s.set(e, Dn), Dn;
    if (ee(i2)) for (let u = 0; u < i2.length; u++) {
      const f2 = je(i2[u]);
      rl(f2) && (o[f2] = Ce);
    }
    else if (i2) for (const u in i2) {
      const f2 = je(u);
      if (rl(f2)) {
        const d = i2[u], h2 = o[f2] = ee(d) || se(d) ? { type: d } : Oe({}, d), b = h2.type;
        let g = false, S = true;
        if (ee(b)) for (let m = 0; m < b.length; ++m) {
          const w = b[m], C2 = se(w) && w.name;
          if (C2 === "Boolean") {
            g = true;
            break;
          } else C2 === "String" && (S = false);
        }
        else g = se(b) && b.name === "Boolean";
        h2[0] = g, h2[1] = S, (g || me(h2, "default")) && l.push(f2);
      }
    }
    const c2 = [o, l];
    return ve(e) && s.set(e, c2), c2;
  }
  function rl(e) {
    return e[0] !== "$" && !rs(e);
  }
  var oo = (e) => e === "_" || e === "_ctx" || e === "$stable";
  var lo = (e) => ee(e) ? e.map(_t) : [_t(e)];
  var zd = (e, t2, n2) => {
    if (t2._n) return t2;
    const s = id((...r2) => lo(t2(...r2)), n2);
    return s._c = false, s;
  };
  var Ou = (e, t2, n2) => {
    const s = e._ctx;
    for (const r2 in e) {
      if (oo(r2)) continue;
      const i2 = e[r2];
      if (se(i2)) t2[r2] = zd(r2, i2, s);
      else if (i2 != null) {
        const o = lo(i2);
        t2[r2] = () => o;
      }
    }
  };
  var Du = (e, t2) => {
    const n2 = lo(t2);
    e.slots.default = () => n2;
  };
  var Hu = (e, t2, n2) => {
    for (const s in t2) (n2 || !oo(s)) && (e[s] = t2[s]);
  };
  var jd = (e, t2, n2) => {
    const s = e.slots = Mu();
    if (e.vnode.shapeFlag & 32) {
      const r2 = t2._;
      r2 ? (Hu(s, t2, n2), n2 && Oa(s, "_", r2, true)) : Ou(t2, s);
    } else t2 && Du(e, t2);
  };
  var Yd = (e, t2, n2) => {
    const { vnode: s, slots: r2 } = e;
    let i2 = true, o = Ce;
    if (s.shapeFlag & 32) {
      const l = t2._;
      l ? n2 && l === 1 ? i2 = false : Hu(r2, t2, n2) : (i2 = !t2.$stable, Ou(t2, r2)), o = t2;
    } else t2 && (Du(e, t2), o = { default: 1 });
    if (i2) for (const l in r2) !oo(l) && o[l] == null && delete r2[l];
  };
  var Ue = qd;
  function Ud(e) {
    return Kd(e);
  }
  function Kd(e, t2) {
    const n2 = $r();
    n2.__VUE__ = true;
    const { insert: s, remove: r2, patchProp: i2, createElement: o, createText: l, createComment: a2, setText: c2, setElementText: u, parentNode: f2, nextSibling: d, setScopeId: h2 = kt, insertStaticContent: b } = e, g = (v2, y2, _, O = null, P = null, E2 = null, W2 = void 0, B2 = null, R2 = !!y2.dynamicChildren) => {
      if (v2 === y2) return;
      v2 && !dn(v2, y2) && (O = ae2(v2), U2(v2, P, E2, true), v2 = null), y2.patchFlag === -2 && (R2 = false, y2.dynamicChildren = null);
      const { type: V2, ref: Q, shapeFlag: j2 } = y2;
      switch (V2) {
        case Vs:
          S(v2, y2, _, O);
          break;
        case Ge:
          m(v2, y2, _, O);
          break;
        case ai:
          v2 == null && w(y2, _, O, W2);
          break;
        case Me:
          I2(v2, y2, _, O, P, E2, W2, B2, R2);
          break;
        default:
          j2 & 1 ? M2(v2, y2, _, O, P, E2, W2, B2, R2) : j2 & 6 ? F2(v2, y2, _, O, P, E2, W2, B2, R2) : (j2 & 64 || j2 & 128) && V2.process(v2, y2, _, O, P, E2, W2, B2, R2, Gn);
      }
      Q != null && P ? ls(Q, v2 && v2.ref, E2, y2 || v2, !y2) : Q == null && v2 && v2.ref != null && ls(v2.ref, null, E2, v2, true);
    }, S = (v2, y2, _, O) => {
      if (v2 == null) s(y2.el = l(y2.children), _, O);
      else {
        const P = y2.el = v2.el;
        y2.children !== v2.children && c2(P, y2.children);
      }
    }, m = (v2, y2, _, O) => {
      v2 == null ? s(y2.el = a2(y2.children || ""), _, O) : y2.el = v2.el;
    }, w = (v2, y2, _, O) => {
      [v2.el, v2.anchor] = b(v2.children, y2, _, O, v2.el, v2.anchor);
    }, C2 = ({ el: v2, anchor: y2 }, _, O) => {
      let P;
      for (; v2 && v2 !== y2; ) P = d(v2), s(v2, _, O), v2 = P;
      s(y2, _, O);
    }, x = ({ el: v2, anchor: y2 }) => {
      let _;
      for (; v2 && v2 !== y2; ) _ = d(v2), r2(v2), v2 = _;
      r2(y2);
    }, M2 = (v2, y2, _, O, P, E2, W2, B2, R2) => {
      if (y2.type === "svg" ? W2 = "svg" : y2.type === "math" && (W2 = "mathml"), v2 == null) A2(y2, _, O, P, E2, W2, B2, R2);
      else {
        const V2 = v2.el && v2.el._isVueCE ? v2.el : null;
        try {
          V2 && V2._beginPatch(), T(v2, y2, P, E2, W2, B2, R2);
        } finally {
          V2 && V2._endPatch();
        }
      }
    }, A2 = (v2, y2, _, O, P, E2, W2, B2) => {
      let R2, V2;
      const { props: Q, shapeFlag: j2, transition: X, dirs: ne2 } = v2;
      if (R2 = v2.el = o(v2.type, E2, Q && Q.is, Q), j2 & 8 ? u(R2, v2.children) : j2 & 16 && p2(v2.children, R2, null, O, P, li(v2, E2), W2, B2), ne2 && rn(v2, null, O, "created"), L2(R2, v2, v2.scopeId, W2, O), Q) {
        for (const we in Q) we !== "value" && !rs(we) && i2(R2, we, null, Q[we], E2, O);
        "value" in Q && i2(R2, "value", null, Q.value, E2), (V2 = Q.onVnodeBeforeMount) && wt(V2, O, v2);
      }
      ne2 && rn(v2, null, O, "beforeMount");
      const fe2 = Gd(P, X);
      fe2 && X.beforeEnter(R2), s(R2, y2, _), ((V2 = Q && Q.onVnodeMounted) || fe2 || ne2) && Ue(() => {
        try {
          V2 && wt(V2, O, v2), fe2 && X.enter(R2), ne2 && rn(v2, null, O, "mounted");
        } finally {
        }
      }, P);
    }, L2 = (v2, y2, _, O, P) => {
      if (_ && h2(v2, _), O) for (let E2 = 0; E2 < O.length; E2++) h2(v2, O[E2]);
      if (P) {
        let E2 = P.subTree;
        if (y2 === E2 || Ru(E2.type) && (E2.ssContent === y2 || E2.ssFallback === y2)) {
          const W2 = P.vnode;
          L2(v2, W2, W2.scopeId, W2.slotScopeIds, P.parent);
        }
      }
    }, p2 = (v2, y2, _, O, P, E2, W2, B2, R2 = 0) => {
      for (let V2 = R2; V2 < v2.length; V2++) {
        const Q = v2[V2] = B2 ? It(v2[V2]) : _t(v2[V2]);
        g(null, Q, y2, _, O, P, E2, W2, B2);
      }
    }, T = (v2, y2, _, O, P, E2, W2) => {
      const B2 = y2.el = v2.el;
      let { patchFlag: R2, dynamicChildren: V2, dirs: Q } = y2;
      R2 |= v2.patchFlag & 16;
      const j2 = v2.props || Ce, X = y2.props || Ce;
      let ne2;
      if (_ && on(_, false), (ne2 = X.onVnodeBeforeUpdate) && wt(ne2, _, y2, v2), Q && rn(y2, v2, _, "beforeUpdate"), _ && on(_, true), V2 && (!v2.dynamicChildren || v2.dynamicChildren.length !== V2.length) && (R2 = 0, W2 = false, V2 = null), (j2.innerHTML && X.innerHTML == null || j2.textContent && X.textContent == null) && u(B2, ""), V2 ? H(v2.dynamicChildren, V2, B2, _, O, li(y2, P), E2) : W2 || te2(v2, y2, B2, null, _, O, li(y2, P), E2, false), R2 > 0) {
        if (R2 & 16) Y(B2, j2, X, _, P);
        else if (R2 & 2 && j2.class !== X.class && i2(B2, "class", null, X.class, P), R2 & 4 && i2(B2, "style", j2.style, X.style, P), R2 & 8) {
          const fe2 = y2.dynamicProps;
          for (let we = 0; we < fe2.length; we++) {
            const be = fe2[we], Pe = j2[be], Fe = X[be];
            (Fe !== Pe || be === "value") && i2(B2, be, Pe, Fe, P, _);
          }
        }
        R2 & 1 && v2.children !== y2.children && u(B2, y2.children);
      } else !W2 && V2 == null && Y(B2, j2, X, _, P);
      ((ne2 = X.onVnodeUpdated) || Q) && Ue(() => {
        ne2 && wt(ne2, _, y2, v2), Q && rn(y2, v2, _, "updated");
      }, O);
    }, H = (v2, y2, _, O, P, E2, W2) => {
      for (let B2 = 0; B2 < y2.length; B2++) {
        const R2 = v2[B2], V2 = y2[B2], Q = R2.el && (R2.type === Me || !dn(R2, V2) || R2.shapeFlag & 198) ? f2(R2.el) : _;
        g(R2, V2, Q, null, O, P, E2, W2, true);
      }
    }, Y = (v2, y2, _, O, P) => {
      if (y2 !== _) {
        if (y2 !== Ce) for (const E2 in y2) !rs(E2) && !(E2 in _) && i2(v2, E2, y2[E2], null, P, O);
        for (const E2 in _) {
          if (rs(E2)) continue;
          const W2 = _[E2], B2 = y2[E2];
          W2 !== B2 && E2 !== "value" && i2(v2, E2, B2, W2, P, O);
        }
        "value" in _ && i2(v2, "value", y2.value, _.value, P);
      }
    }, I2 = (v2, y2, _, O, P, E2, W2, B2, R2) => {
      const V2 = y2.el = v2 ? v2.el : l(""), Q = y2.anchor = v2 ? v2.anchor : l("");
      let { patchFlag: j2, dynamicChildren: X, slotScopeIds: ne2 } = y2;
      ne2 && (B2 = B2 ? B2.concat(ne2) : ne2), v2 == null ? (s(V2, _, O), s(Q, _, O), p2(y2.children || [], _, Q, P, E2, W2, B2, R2)) : j2 > 0 && j2 & 64 && X && v2.dynamicChildren && v2.dynamicChildren.length === X.length ? (H(v2.dynamicChildren, X, _, P, E2, W2, B2), (y2.key != null || P && y2 === P.subTree) && ao(v2, y2, true)) : te2(v2, y2, _, Q, P, E2, W2, B2, R2);
    }, F2 = (v2, y2, _, O, P, E2, W2, B2, R2) => {
      y2.slotScopeIds = B2, v2 == null ? y2.shapeFlag & 512 ? P.ctx.activate(y2, _, O, W2, R2) : z(y2, _, O, P, E2, W2, R2) : G2(v2, y2, R2);
    }, z = (v2, y2, _, O, P, E2, W2) => {
      const B2 = v2.component = iv(v2, O, P);
      if (jr(v2) && (B2.ctx.renderer = Gn), ov(B2, false, W2), B2.asyncDep) {
        if (P && P.registerDep(B2, re2, W2), !v2.el) {
          const R2 = B2.subTree = k(Ge);
          m(null, R2, y2, _), v2.placeholder = R2.el;
        }
      } else re2(B2, v2, y2, _, P, E2, W2);
    }, G2 = (v2, y2, _) => {
      const O = y2.component = v2.component;
      if ($d(v2, y2, _)) if (O.asyncDep && !O.asyncResolved) {
        q(O, y2, _);
        return;
      } else O.next = y2, O.update();
      else y2.el = v2.el, O.vnode = y2;
    }, re2 = (v2, y2, _, O, P, E2, W2) => {
      const B2 = () => {
        if (v2.isMounted) {
          let { next: j2, bu: X, u: ne2, parent: fe2, vnode: we } = v2;
          {
            const pt2 = Fu(v2);
            if (pt2) {
              j2 && (j2.el = we.el, q(v2, j2, W2)), pt2.asyncDep.then(() => {
                Ue(() => {
                  v2.isUnmounted || V2();
                }, P);
              });
              return;
            }
          }
          let be = j2, Pe;
          on(v2, false), j2 ? (j2.el = we.el, q(v2, j2, W2)) : j2 = we, X && ei(X), (Pe = j2.props && j2.props.onVnodeBeforeUpdate) && wt(Pe, fe2, j2, we), on(v2, true);
          const Fe = nl(v2), yt2 = v2.subTree;
          v2.subTree = Fe, g(yt2, Fe, f2(yt2.el), ae2(yt2), v2, P, E2), j2.el = Fe.el, be === null && Rd(v2, Fe.el), ne2 && Ue(ne2, P), (Pe = j2.props && j2.props.onVnodeUpdated) && Ue(() => wt(Pe, fe2, j2, we), P);
        } else {
          let j2;
          const { el: X, props: ne2 } = y2, { bm: fe2, m: we, parent: be, root: Pe, type: Fe } = v2, yt2 = as(y2);
          on(v2, false), fe2 && ei(fe2), !yt2 && (j2 = ne2 && ne2.onVnodeBeforeMount) && wt(j2, be, y2), on(v2, true);
          {
            Pe.ce && Pe.ce._hasShadowRoot() && Pe.ce._injectChildStyle(Fe, v2.parent ? v2.parent.type : void 0);
            const pt2 = v2.subTree = nl(v2);
            g(null, pt2, _, O, v2, P, E2), y2.el = pt2.el;
          }
          if (we && Ue(we, P), !yt2 && (j2 = ne2 && ne2.onVnodeMounted)) {
            const pt2 = y2;
            Ue(() => wt(j2, be, pt2), P);
          }
          (y2.shapeFlag & 256 || be && as(be.vnode) && be.vnode.shapeFlag & 256) && v2.a && Ue(v2.a, P), v2.isMounted = true, y2 = _ = O = null;
        }
      };
      v2.scope.on();
      const R2 = v2.effect = new Ba(B2);
      v2.scope.off();
      const V2 = v2.update = R2.run.bind(R2), Q = v2.job = R2.runIfDirty.bind(R2);
      Q.i = v2, Q.id = v2.uid, R2.scheduler = () => no(Q), on(v2, true), V2();
    }, q = (v2, y2, _) => {
      y2.component = v2;
      const O = v2.vnode.props;
      v2.vnode = y2, v2.next = null, Nd(v2, y2.props, O, _), Yd(v2, y2.children, _), Ht(), Uo(v2), Ft();
    }, te2 = (v2, y2, _, O, P, E2, W2, B2, R2 = false) => {
      const V2 = v2 && v2.children, Q = v2 ? v2.shapeFlag : 0, j2 = y2.children, { patchFlag: X, shapeFlag: ne2 } = y2;
      if (X > 0) {
        if (X & 128) {
          de2(V2, j2, _, O, P, E2, W2, B2, R2);
          return;
        } else if (X & 256) {
          Te(V2, j2, _, O, P, E2, W2, B2, R2);
          return;
        }
      }
      ne2 & 8 ? (Q & 16 && Qe(V2, P, E2), j2 !== V2 && u(_, j2)) : Q & 16 ? ne2 & 16 ? de2(V2, j2, _, O, P, E2, W2, B2, R2) : Qe(V2, P, E2, true) : (Q & 8 && u(_, ""), ne2 & 16 && p2(j2, _, O, P, E2, W2, B2, R2));
    }, Te = (v2, y2, _, O, P, E2, W2, B2, R2) => {
      v2 = v2 || Dn, y2 = y2 || Dn;
      const V2 = v2.length, Q = y2.length, j2 = Math.min(V2, Q);
      let X;
      for (X = 0; X < j2; X++) {
        const ne2 = y2[X] = R2 ? It(y2[X]) : _t(y2[X]);
        g(v2[X], ne2, _, null, P, E2, W2, B2, R2);
      }
      V2 > Q ? Qe(v2, P, E2, true, false, j2) : p2(y2, _, O, P, E2, W2, B2, R2, j2);
    }, de2 = (v2, y2, _, O, P, E2, W2, B2, R2) => {
      let V2 = 0;
      const Q = y2.length;
      let j2 = v2.length - 1, X = Q - 1;
      for (; V2 <= j2 && V2 <= X; ) {
        const ne2 = v2[V2], fe2 = y2[V2] = R2 ? It(y2[V2]) : _t(y2[V2]);
        if (dn(ne2, fe2)) g(ne2, fe2, _, null, P, E2, W2, B2, R2);
        else break;
        V2++;
      }
      for (; V2 <= j2 && V2 <= X; ) {
        const ne2 = v2[j2], fe2 = y2[X] = R2 ? It(y2[X]) : _t(y2[X]);
        if (dn(ne2, fe2)) g(ne2, fe2, _, null, P, E2, W2, B2, R2);
        else break;
        j2--, X--;
      }
      if (V2 > j2) {
        if (V2 <= X) {
          const ne2 = X + 1, fe2 = ne2 < Q ? y2[ne2].el : O;
          for (; V2 <= X; ) g(null, y2[V2] = R2 ? It(y2[V2]) : _t(y2[V2]), _, fe2, P, E2, W2, B2, R2), V2++;
        }
      } else if (V2 > X) for (; V2 <= j2; ) U2(v2[V2], P, E2, true), V2++;
      else {
        const ne2 = V2, fe2 = V2, we = /* @__PURE__ */ new Map();
        for (V2 = fe2; V2 <= X; V2++) {
          const et = y2[V2] = R2 ? It(y2[V2]) : _t(y2[V2]);
          et.key != null && we.set(et.key, V2);
        }
        let be, Pe = 0;
        const Fe = X - fe2 + 1;
        let yt2 = false, pt2 = 0;
        const Zn = new Array(Fe);
        for (V2 = 0; V2 < Fe; V2++) Zn[V2] = 0;
        for (V2 = ne2; V2 <= j2; V2++) {
          const et = v2[V2];
          if (Pe >= Fe) {
            U2(et, P, E2, true);
            continue;
          }
          let bt2;
          if (et.key != null) bt2 = we.get(et.key);
          else for (be = fe2; be <= X; be++) if (Zn[be - fe2] === 0 && dn(et, y2[be])) {
            bt2 = be;
            break;
          }
          bt2 === void 0 ? U2(et, P, E2, true) : (Zn[bt2 - fe2] = V2 + 1, bt2 >= pt2 ? pt2 = bt2 : yt2 = true, g(et, y2[bt2], _, null, P, E2, W2, B2, R2), Pe++);
        }
        const $o = yt2 ? Zd(Zn) : Dn;
        for (be = $o.length - 1, V2 = Fe - 1; V2 >= 0; V2--) {
          const et = fe2 + V2, bt2 = y2[et], Ro = y2[et + 1], Bo = et + 1 < Q ? Ro.el || $u(Ro) : O;
          Zn[V2] === 0 ? g(null, bt2, _, Bo, P, E2, W2, B2, R2) : yt2 && (be < 0 || V2 !== $o[be] ? Ae(bt2, _, Bo, 2) : be--);
        }
      }
    }, Ae = (v2, y2, _, O, P = null) => {
      const { el: E2, type: W2, transition: B2, children: R2, shapeFlag: V2 } = v2;
      if (V2 & 6) {
        Ae(v2.component.subTree, y2, _, O);
        return;
      }
      if (V2 & 128) {
        v2.suspense.move(y2, _, O);
        return;
      }
      if (V2 & 64) {
        W2.move(v2, y2, _, Gn);
        return;
      }
      if (W2 === Me) {
        s(E2, y2, _);
        for (let j2 = 0; j2 < R2.length; j2++) Ae(R2[j2], y2, _, O);
        s(v2.anchor, y2, _);
        return;
      }
      if (W2 === ai) {
        C2(v2, y2, _);
        return;
      }
      if (O !== 2 && V2 & 1 && B2) if (O === 0) B2.persisted && !E2[ut] ? s(E2, y2, _) : (B2.beforeEnter(E2), s(E2, y2, _), Ue(() => B2.enter(E2), P));
      else {
        const { leave: j2, delayLeave: X, afterLeave: ne2 } = B2, fe2 = () => {
          v2.ctx.isUnmounted ? r2(E2) : s(E2, y2, _);
        }, we = () => {
          const be = E2._isLeaving || !!E2[ut];
          E2._isLeaving && E2[ut](true), B2.persisted && !be ? fe2() : j2(E2, () => {
            fe2(), ne2 && ne2();
          });
        };
        X ? X(E2, fe2, we) : we();
      }
      else s(E2, y2, _);
    }, U2 = (v2, y2, _, O = false, P = false) => {
      const { type: E2, props: W2, ref: B2, children: R2, dynamicChildren: V2, shapeFlag: Q, patchFlag: j2, dirs: X, cacheIndex: ne2, memo: fe2 } = v2;
      if (j2 === -2 && (P = false), B2 != null && (Ht(), ls(B2, null, _, v2, true), Ft()), ne2 != null && (y2.renderCache[ne2] = void 0), Q & 256) {
        y2.ctx.deactivate(v2);
        return;
      }
      const we = Q & 1 && X, be = !as(v2);
      let Pe;
      if (be && (Pe = W2 && W2.onVnodeBeforeUnmount) && wt(Pe, y2, v2), Q & 6) vt2(v2.component, _, O);
      else {
        if (Q & 128) {
          v2.suspense.unmount(_, O);
          return;
        }
        we && rn(v2, null, y2, "beforeUnmount"), Q & 64 ? v2.type.remove(v2, y2, _, Gn, O) : V2 && !V2.hasOnce && (E2 !== Me || j2 > 0 && j2 & 64) ? Qe(V2, y2, _, false, true) : (E2 === Me && j2 & 384 || !P && Q & 16) && Qe(R2, y2, _), O && Z(v2);
      }
      const Fe = fe2 != null && ne2 == null;
      (be && (Pe = W2 && W2.onVnodeUnmounted) || we || Fe) && Ue(() => {
        Pe && wt(Pe, y2, v2), we && rn(v2, null, y2, "unmounted"), Fe && (v2.el = null);
      }, _);
    }, Z = (v2) => {
      const { type: y2, el: _, anchor: O, transition: P } = v2;
      if (y2 === Me) {
        he(_, O);
        return;
      }
      if (y2 === ai) {
        x(v2);
        return;
      }
      const E2 = () => {
        r2(_), P && !P.persisted && P.afterLeave && P.afterLeave();
      };
      if (v2.shapeFlag & 1 && P && !P.persisted) {
        const { leave: W2, delayLeave: B2 } = P, R2 = () => W2(_, E2);
        B2 ? B2(v2.el, E2, R2) : R2();
      } else E2();
    }, he = (v2, y2) => {
      let _;
      for (; v2 !== y2; ) _ = d(v2), r2(v2), v2 = _;
      r2(y2);
    }, vt2 = (v2, y2, _) => {
      const { bum: O, scope: P, job: E2, subTree: W2, um: B2, m: R2, a: V2 } = v2;
      il(R2), il(V2), O && ei(O), P.stop(), E2 && (E2.flags |= 8, U2(W2, v2, y2, _)), B2 && Ue(B2, y2), Ue(() => {
        v2.isUnmounted = true;
      }, y2);
    }, Qe = (v2, y2, _, O = false, P = false, E2 = 0) => {
      for (let W2 = E2; W2 < v2.length; W2++) U2(v2[W2], y2, _, O, P);
    }, ae2 = (v2) => {
      if (v2.shapeFlag & 6) return ae2(v2.component.subTree);
      if (v2.shapeFlag & 128) return v2.suspense.next();
      const y2 = d(v2.anchor || v2.el), _ = y2 && y2[cu];
      return _ ? d(_) : y2;
    };
    let Ve = false;
    const kn = (v2, y2, _) => {
      let O;
      v2 == null ? y2._vnode && (U2(y2._vnode, null, null, true), O = y2._vnode.component) : g(y2._vnode || null, v2, y2, null, null, null, _), y2._vnode = v2, Ve || (Ve = true, Uo(O), ou(), Ve = false);
    }, Gn = { p: g, um: U2, m: Ae, r: Z, mt: z, mc: p2, pc: te2, pbc: H, n: ae2, o: e };
    return { render: kn, hydrate: void 0, createApp: Pd(kn) };
  }
  function li({ type: e, props: t2 }, n2) {
    return n2 === "svg" && e === "foreignObject" || n2 === "mathml" && e === "annotation-xml" && t2 && t2.encoding && t2.encoding.includes("html") ? void 0 : n2;
  }
  function on({ effect: e, job: t2 }, n2) {
    n2 ? (e.flags |= 32, t2.flags |= 4) : (e.flags &= -33, t2.flags &= -5);
  }
  function Gd(e, t2) {
    return (!e || e && !e.pendingBranch) && t2 && !t2.persisted;
  }
  function ao(e, t2, n2 = false) {
    const s = e.children, r2 = t2.children;
    if (ee(s) && ee(r2)) for (let i2 = 0; i2 < s.length; i2++) {
      const o = s[i2];
      let l = r2[i2];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r2[i2] = It(r2[i2]), l.el = o.el), !n2 && l.patchFlag !== -2 && ao(o, l)), l.type === Vs && (l.patchFlag === -1 && (l = r2[i2] = It(l)), l.el = o.el), l.type === Ge && !l.el && (l.el = o.el);
    }
  }
  function Zd(e) {
    const t2 = e.slice(), n2 = [0];
    let s, r2, i2, o, l;
    const a2 = e.length;
    for (s = 0; s < a2; s++) {
      const c2 = e[s];
      if (c2 !== 0) {
        if (r2 = n2[n2.length - 1], e[r2] < c2) {
          t2[s] = r2, n2.push(s);
          continue;
        }
        for (i2 = 0, o = n2.length - 1; i2 < o; ) l = i2 + o >> 1, e[n2[l]] < c2 ? i2 = l + 1 : o = l;
        c2 < e[n2[i2]] && (i2 > 0 && (t2[s] = n2[i2 - 1]), n2[i2] = s);
      }
    }
    for (i2 = n2.length, o = n2[i2 - 1]; i2-- > 0; ) n2[i2] = o, o = t2[o];
    return n2;
  }
  function Fu(e) {
    const t2 = e.subTree.component;
    if (t2) return t2.asyncDep && !t2.asyncResolved ? t2 : Fu(t2);
  }
  function il(e) {
    if (e) for (let t2 = 0; t2 < e.length; t2++) e[t2].flags |= 8;
  }
  function $u(e) {
    if (e.placeholder) return e.placeholder;
    const t2 = e.component;
    return t2 ? $u(t2.subTree) : null;
  }
  var Ru = (e) => e.__isSuspense;
  function qd(e, t2) {
    t2 && t2.pendingBranch ? ee(e) ? t2.effects.push(...e) : t2.effects.push(e) : rd(e);
  }
  var Me = /* @__PURE__ */ Symbol.for("v-fgt");
  var Vs = /* @__PURE__ */ Symbol.for("v-txt");
  var Ge = /* @__PURE__ */ Symbol.for("v-cmt");
  var ai = /* @__PURE__ */ Symbol.for("v-stc");
  var mn = [];
  var st = null;
  function Xd(e = false) {
    mn.push(st = e ? null : []);
  }
  function Bu() {
    mn.pop(), st = mn[mn.length - 1] || null;
  }
  var ys = 1;
  function vr(e, t2 = false) {
    ys += e, e < 0 && st && t2 && (st.hasOnce = true);
  }
  function Nu(e) {
    return e.dynamicChildren = ys > 0 ? st || Dn : null, Bu(), ys > 0 && st && st.push(e), e;
  }
  function ly(e, t2, n2, s, r2, i2) {
    return Nu(N(e, t2, n2, s, r2, i2, true));
  }
  function Jd(e, t2, n2, s, r2) {
    return Nu(k(e, t2, n2, s, r2, true));
  }
  function hr(e) {
    return e ? e.__v_isVNode === true : false;
  }
  function dn(e, t2) {
    return e.type === t2.type && e.key === t2.key;
  }
  var Wu = ({ key: e }) => e ?? null;
  var tr = ({ ref: e, ref_key: t2, ref_for: n2 }) => (typeof e == "number" && (e = "" + e), e != null ? Le(e) || Ee(e) || se(e) ? { i: nt, r: e, k: t2, f: !!n2 } : e : null);
  function N(e, t2 = null, n2 = null, s = 0, r2 = null, i2 = e === Me ? 0 : 1, o = false, l = false) {
    const a2 = { __v_isVNode: true, __v_skip: true, type: e, props: t2, key: t2 && Wu(t2), ref: t2 && tr(t2), scopeId: au, slotScopeIds: null, children: n2, component: null, suspense: null, ssContent: null, ssFallback: null, dirs: null, transition: null, el: null, anchor: null, target: null, targetStart: null, targetAnchor: null, staticCount: 0, shapeFlag: i2, patchFlag: s, dynamicProps: r2, dynamicChildren: null, appContext: null, ctx: nt };
    return l ? (mr(a2, n2), i2 & 128 && e.normalize(a2)) : n2 && (a2.shapeFlag |= Le(n2) ? 8 : 16), ys > 0 && !o && st && (a2.patchFlag > 0 || i2 & 6) && a2.patchFlag !== 32 && st.push(a2), a2;
  }
  var k = Qd;
  function Qd(e, t2 = null, n2 = null, s = 0, r2 = null, i2 = false) {
    if ((!e || e === xd) && (e = Ge), hr(e)) {
      const l = Xt(e, t2, true);
      return n2 && mr(l, n2), ys > 0 && !i2 && st && (l.shapeFlag & 6 ? st[st.indexOf(e)] = l : st.push(l)), l.patchFlag = -2, l;
    }
    if (fv(e) && (e = e.__vccOpts), t2) {
      t2 = ev(t2);
      let { class: l, style: a2 } = t2;
      l && !Le(l) && (t2.class = ie(l)), ve(a2) && (Nr(a2) && !ee(a2) && (a2 = Oe({}, a2)), t2.style = ge(a2));
    }
    const o = Le(e) ? 1 : Ru(e) ? 128 : zr(e) ? 64 : ve(e) ? 4 : se(e) ? 2 : 0;
    return N(e, t2, n2, s, r2, o, i2, true);
  }
  function ev(e) {
    return e ? Nr(e) || Vu(e) ? Oe({}, e) : e : null;
  }
  function Xt(e, t2, n2 = false, s = false) {
    const { props: r2, ref: i2, patchFlag: o, children: l, transition: a2 } = e, c2 = t2 ? ye(r2 || {}, t2) : r2, u = { __v_isVNode: true, __v_skip: true, type: e.type, props: c2, key: c2 && Wu(c2), ref: t2 && t2.ref ? n2 && i2 ? ee(i2) ? i2.concat(tr(t2)) : [i2, tr(t2)] : tr(t2) : i2, scopeId: e.scopeId, slotScopeIds: e.slotScopeIds, children: l, target: e.target, targetStart: e.targetStart, targetAnchor: e.targetAnchor, staticCount: e.staticCount, shapeFlag: e.shapeFlag, patchFlag: t2 && e.type !== Me ? o === -1 ? 16 : o | 16 : o, dynamicProps: e.dynamicProps, dynamicChildren: e.dynamicChildren, appContext: e.appContext, dirs: e.dirs, transition: a2, component: e.component, suspense: e.suspense, ssContent: e.ssContent && Xt(e.ssContent), ssFallback: e.ssFallback && Xt(e.ssFallback), placeholder: e.placeholder, el: e.el, anchor: e.anchor, ctx: e.ctx, ce: e.ce };
    return a2 && s && Cn(u, a2.clone(u)), u;
  }
  function tv(e = " ", t2 = 0) {
    return k(Vs, null, e, t2);
  }
  function nv(e = "", t2 = false) {
    return t2 ? (Xd(), Jd(Ge, null, e)) : k(Ge, null, e);
  }
  function _t(e) {
    return e == null || typeof e == "boolean" ? k(Ge) : ee(e) ? k(Me, null, e.slice()) : hr(e) ? It(e) : k(Vs, null, String(e));
  }
  function It(e) {
    return e.el === null && e.patchFlag !== -1 || e.memo ? e : Xt(e);
  }
  function mr(e, t2) {
    let n2 = 0;
    const { shapeFlag: s } = e;
    if (t2 == null) t2 = null;
    else if (ee(t2)) n2 = 16;
    else if (typeof t2 == "object") if (s & 65) {
      const r2 = t2.default;
      r2 && (r2._c && (r2._d = false), mr(e, r2()), r2._c && (r2._d = true));
      return;
    } else {
      n2 = 32;
      const r2 = t2._;
      !r2 && !Vu(t2) ? t2._ctx = nt : r2 === 3 && nt && (nt.slots._ === 1 ? t2._ = 1 : (t2._ = 2, e.patchFlag |= 1024));
    }
    else if (se(t2)) {
      if (s & 65) {
        mr(e, { default: t2 });
        return;
      }
      t2 = { default: t2, _ctx: nt }, n2 = 32;
    } else t2 = String(t2), s & 64 ? (n2 = 16, t2 = [tv(t2)]) : n2 = 8;
    e.children = t2, e.shapeFlag |= n2;
  }
  function ye(...e) {
    const t2 = {};
    for (let n2 = 0; n2 < e.length; n2++) {
      const s = e[n2];
      for (const r2 in s) if (r2 === "class") t2.class !== s.class && (t2.class = ie([t2.class, s.class]));
      else if (r2 === "style") t2.style = ge([t2.style, s.style]);
      else if (Or(r2)) {
        const i2 = t2[r2], o = s[r2];
        o && i2 !== o && !(ee(i2) && i2.includes(o)) ? t2[r2] = i2 ? [].concat(i2, o) : o : o == null && i2 == null && !Dr(r2) && (t2[r2] = o);
      } else r2 !== "" && (t2[r2] = s[r2]);
    }
    return t2;
  }
  function wt(e, t2, n2, s = null) {
    dt(e, t2, 7, [n2, s]);
  }
  var sv = Au();
  var rv = 0;
  function iv(e, t2, n2) {
    const s = e.type, r2 = (t2 ? t2.appContext : e.appContext) || sv, i2 = { uid: rv++, vnode: e, type: s, parent: t2, appContext: r2, root: null, next: null, subTree: null, effect: null, update: null, job: null, scope: new $a(true), render: null, proxy: null, exposed: null, exposeProxy: null, withProxy: null, provides: t2 ? t2.provides : Object.create(r2.provides), ids: t2 ? t2.ids : ["", 0, 0], accessCache: null, renderCache: [], components: null, directives: null, propsOptions: Iu(s, r2), emitsOptions: ku(s, r2), emit: null, emitted: null, propsDefaults: Ce, inheritAttrs: s.inheritAttrs, ctx: Ce, data: Ce, props: Ce, attrs: Ce, slots: Ce, refs: Ce, setupState: Ce, setupContext: null, suspense: n2, suspenseId: n2 ? n2.pendingId : 0, asyncDep: null, asyncResolved: false, isMounted: false, isUnmounted: false, isDeactivated: false, bc: null, c: null, bm: null, m: null, bu: null, u: null, um: null, bum: null, da: null, a: null, rtg: null, rtc: null, ec: null, sp: null };
    return i2.ctx = { _: i2 }, i2.root = t2 ? t2.root : i2, i2.emit = Od.bind(null, i2), e.ce && e.ce(i2), i2;
  }
  var Ne = null;
  var Ps = () => Ne || nt;
  var gr;
  var ps;
  {
    const e = $r(), t2 = (n2, s) => {
      let r2;
      return (r2 = e[n2]) || (r2 = e[n2] = []), r2.push(s), (i2) => {
        r2.length > 1 ? r2.forEach((o) => o(i2)) : r2[0](i2);
      };
    };
    gr = t2("__VUE_INSTANCE_SETTERS__", (n2) => Ne = n2), ps = t2("__VUE_SSR_SETTERS__", (n2) => bs = n2);
  }
  var Is = (e) => {
    const t2 = Ne;
    return gr(e), e.scope.on(), () => {
      e.scope.off(), gr(t2);
    };
  };
  var ol = () => {
    Ne && Ne.scope.off(), gr(null);
  };
  function zu(e) {
    return e.vnode.shapeFlag & 4;
  }
  var bs = false;
  function ov(e, t2 = false, n2 = false) {
    t2 && ps(t2);
    const { props: s, children: r2 } = e.vnode, i2 = zu(e);
    Bd(e, s, i2, t2), jd(e, r2, n2 || t2);
    const o = i2 ? lv(e, t2) : void 0;
    return t2 && ps(false), o;
  }
  function lv(e, t2) {
    const n2 = e.type;
    e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Ld);
    const { setup: s } = n2;
    if (s) {
      Ht();
      const r2 = e.setupContext = s.length > 1 ? uv(e) : null, i2 = Is(e), o = Ms(s, e, 0, [e.props, r2]), l = Va(o);
      if (Ft(), i2(), (l || e.sp) && !as(e) && yu(e), l) {
        if (o.then(ol, ol), t2) return o.then((a2) => {
          ps(true);
          try {
            ll(e, a2, t2);
          } finally {
            ps(false);
          }
        }).catch((a2) => {
          Wr(a2, e, 0);
        });
        e.asyncDep = o;
      } else ll(e, o);
    } else ju(e);
  }
  function ll(e, t2, n2) {
    se(t2) ? e.type.__ssrInlineRender ? e.ssrRender = t2 : e.render = t2 : ve(t2) && (e.setupState = tu(t2)), ju(e);
  }
  function ju(e, t2, n2) {
    const s = e.type;
    e.render || (e.render = s.render || kt);
    {
      const r2 = Is(e);
      Ht();
      try {
        Ad(e);
      } finally {
        Ft(), r2();
      }
    }
  }
  var av = { get(e, t2) {
    return Be(e, "get", ""), e[t2];
  } };
  function uv(e) {
    const t2 = (n2) => {
      e.exposed = n2 || {};
    };
    return { attrs: new Proxy(e.attrs, av), slots: e.slots, emit: e.emit, expose: t2 };
  }
  function Kr(e) {
    return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(tu(Kf(e.exposed)), { get(t2, n2) {
      if (n2 in t2) return t2[n2];
      if (n2 in us) return us[n2](e);
    }, has(t2, n2) {
      return n2 in t2 || n2 in us;
    } })) : e.proxy;
  }
  function cv(e, t2 = true) {
    return se(e) ? e.displayName || e.name : e.name || t2 && e.__name;
  }
  function fv(e) {
    return se(e) && "__vccOpts" in e;
  }
  var D = (e, t2) => Qf(e, t2, bs);
  function Yn(e, t2, n2) {
    try {
      vr(-1);
      const s = arguments.length;
      return s === 2 ? ve(t2) && !ee(t2) ? hr(t2) ? k(e, null, [t2]) : k(e, t2) : k(e, null, t2) : (s > 3 ? n2 = Array.prototype.slice.call(arguments, 2) : s === 3 && hr(n2) && (n2 = [n2]), k(e, t2, n2));
    } finally {
      vr(1);
    }
  }
  var dv = "3.5.42";
  var Pi;
  var al = typeof window < "u" && window.trustedTypes;
  if (al) try {
    Pi = al.createPolicy("vue", { createHTML: (e) => e });
  } catch {
  }
  var Yu = Pi ? (e) => Pi.createHTML(e) : (e) => e;
  var vv = "http://www.w3.org/2000/svg";
  var hv = "http://www.w3.org/1998/Math/MathML";
  var Pt = typeof document < "u" ? document : null;
  var ul = Pt && Pt.createElement("template");
  var mv = { insert: (e, t2, n2) => {
    t2.insertBefore(e, n2 || null);
  }, remove: (e) => {
    const t2 = e.parentNode;
    t2 && t2.removeChild(e);
  }, createElement: (e, t2, n2, s) => {
    const r2 = t2 === "svg" ? Pt.createElementNS(vv, e) : t2 === "mathml" ? Pt.createElementNS(hv, e) : n2 ? Pt.createElement(e, { is: n2 }) : Pt.createElement(e);
    return e === "select" && s && s.multiple != null && r2.setAttribute("multiple", s.multiple), r2;
  }, createText: (e) => Pt.createTextNode(e), createComment: (e) => Pt.createComment(e), setText: (e, t2) => {
    e.nodeValue = t2;
  }, setElementText: (e, t2) => {
    e.textContent = t2;
  }, parentNode: (e) => e.parentNode, nextSibling: (e) => e.nextSibling, querySelector: (e) => Pt.querySelector(e), setScopeId(e, t2) {
    e.setAttribute(t2, "");
  }, insertStaticContent(e, t2, n2, s, r2, i2) {
    const o = n2 ? n2.previousSibling : t2.lastChild;
    if (r2 && (r2 === i2 || r2.nextSibling)) for (; t2.insertBefore(r2.cloneNode(true), n2), !(r2 === i2 || !(r2 = r2.nextSibling)); ) ;
    else {
      ul.innerHTML = Yu(s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e);
      const l = ul.content;
      if (s === "svg" || s === "mathml") {
        const a2 = l.firstChild;
        for (; a2.firstChild; ) l.appendChild(a2.firstChild);
        l.removeChild(a2);
      }
      t2.insertBefore(l, n2);
    }
    return [o ? o.nextSibling : t2.firstChild, n2 ? n2.previousSibling : t2.lastChild];
  } };
  var jt = "transition";
  var Jn = "animation";
  var Bn = /* @__PURE__ */ Symbol("_vtc");
  var Uu = { name: String, type: String, css: { type: Boolean, default: true }, duration: [String, Number, Object], enterFromClass: String, enterActiveClass: String, enterToClass: String, appearFromClass: String, appearActiveClass: String, appearToClass: String, leaveFromClass: String, leaveActiveClass: String, leaveToClass: String };
  var Ku = Oe({}, du, Uu);
  var gv = (e) => (e.displayName = "Transition", e.props = Ku, e);
  var Sn = gv((e, { slots: t2 }) => Yn(hd, Gu(e), t2));
  var ln = (e, t2 = []) => {
    ee(e) ? e.forEach((n2) => n2(...t2)) : e && e(...t2);
  };
  var cl = (e) => e ? ee(e) ? e.some((t2) => t2.length > 1) : e.length > 1 : false;
  function Gu(e) {
    const t2 = {};
    for (const I2 in e) I2 in Uu || (t2[I2] = e[I2]);
    if (e.css === false) return t2;
    const { name: n2 = "v", type: s, duration: r2, enterFromClass: i2 = `${n2}-enter-from`, enterActiveClass: o = `${n2}-enter-active`, enterToClass: l = `${n2}-enter-to`, appearFromClass: a2 = i2, appearActiveClass: c2 = o, appearToClass: u = l, leaveFromClass: f2 = `${n2}-leave-from`, leaveActiveClass: d = `${n2}-leave-active`, leaveToClass: h2 = `${n2}-leave-to` } = e, b = yv(r2), g = b && b[0], S = b && b[1], { onBeforeEnter: m, onEnter: w, onEnterCancelled: C2, onLeave: x, onLeaveCancelled: M2, onBeforeAppear: A2 = m, onAppear: L2 = w, onAppearCancelled: p2 = C2 } = t2, T = (I2, F2, z, G2) => {
      I2._enterCancelled = G2, Ut(I2, F2 ? u : l), Ut(I2, F2 ? c2 : o), z && z();
    }, H = (I2, F2) => {
      I2._isLeaving = false, Ut(I2, f2), Ut(I2, h2), Ut(I2, d), F2 && F2();
    }, Y = (I2) => (F2, z) => {
      const G2 = I2 ? L2 : w, re2 = () => T(F2, I2, z);
      ln(G2, [F2, re2]), fl(() => {
        Ut(F2, I2 ? a2 : i2), Ct(F2, I2 ? u : l), cl(G2) || dl(F2, s, g, re2);
      });
    };
    return Oe(t2, { onBeforeEnter(I2) {
      ln(m, [I2]), Ct(I2, i2), Ct(I2, o);
    }, onBeforeAppear(I2) {
      ln(A2, [I2]), Ct(I2, a2), Ct(I2, c2);
    }, onEnter: Y(false), onAppear: Y(true), onLeave(I2, F2) {
      I2._isLeaving = true;
      const z = () => H(I2, F2);
      Ct(I2, f2), I2._enterCancelled ? (Ct(I2, d), Ii(I2)) : (Ii(I2), Ct(I2, d)), fl(() => {
        I2._isLeaving && (Ut(I2, f2), Ct(I2, h2), cl(x) || dl(I2, s, S, z));
      }), ln(x, [I2, z]);
    }, onEnterCancelled(I2) {
      T(I2, false, void 0, true), ln(C2, [I2]);
    }, onAppearCancelled(I2) {
      T(I2, true, void 0, true), ln(p2, [I2]);
    }, onLeaveCancelled(I2) {
      H(I2), ln(M2, [I2]);
    } });
  }
  function yv(e) {
    if (e == null) return null;
    if (ve(e)) return [ui(e.enter), ui(e.leave)];
    {
      const t2 = ui(e);
      return [t2, t2];
    }
  }
  function ui(e) {
    return wf(e);
  }
  function Ct(e, t2) {
    t2.split(/\s+/).forEach((n2) => n2 && e.classList.add(n2)), (e[Bn] || (e[Bn] = /* @__PURE__ */ new Set())).add(t2);
  }
  function Ut(e, t2) {
    t2.split(/\s+/).forEach((s) => s && e.classList.remove(s));
    const n2 = e[Bn];
    n2 && (n2.delete(t2), n2.size || (e[Bn] = void 0));
  }
  function fl(e) {
    requestAnimationFrame(() => {
      requestAnimationFrame(e);
    });
  }
  var pv = 0;
  function dl(e, t2, n2, s) {
    const r2 = e._endId = ++pv, i2 = () => {
      r2 === e._endId && s();
    };
    if (n2 != null) return setTimeout(i2, n2);
    const { type: o, timeout: l, propCount: a2 } = Zu(e, t2);
    if (!o) return s();
    const c2 = o + "end";
    let u = 0;
    const f2 = () => {
      e.removeEventListener(c2, d), i2();
    }, d = (h2) => {
      h2.target === e && ++u >= a2 && f2();
    };
    setTimeout(() => {
      u < a2 && f2();
    }, l + 1), e.addEventListener(c2, d);
  }
  function Zu(e, t2) {
    const n2 = window.getComputedStyle(e), s = (b) => (n2[b] || "").split(", "), r2 = s(`${jt}Delay`), i2 = s(`${jt}Duration`), o = vl(r2, i2), l = s(`${Jn}Delay`), a2 = s(`${Jn}Duration`), c2 = vl(l, a2);
    let u = null, f2 = 0, d = 0;
    t2 === jt ? o > 0 && (u = jt, f2 = o, d = i2.length) : t2 === Jn ? c2 > 0 && (u = Jn, f2 = c2, d = a2.length) : (f2 = Math.max(o, c2), u = f2 > 0 ? o > c2 ? jt : Jn : null, d = u ? u === jt ? i2.length : a2.length : 0);
    const h2 = u === jt && /\b(?:transform|all)(?:,|$)/.test(s(`${jt}Property`).toString());
    return { type: u, timeout: f2, propCount: d, hasTransform: h2 };
  }
  function vl(e, t2) {
    for (; e.length < t2.length; ) e = e.concat(e);
    return Math.max(...t2.map((n2, s) => hl(n2) + hl(e[s])));
  }
  function hl(e) {
    return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function Ii(e) {
    return (e ? e.ownerDocument : document).body.offsetHeight;
  }
  function bv(e, t2, n2) {
    const s = e[Bn];
    s && (t2 = (t2 ? [t2, ...s] : [...s]).join(" ")), t2 == null ? e.removeAttribute("class") : n2 ? e.setAttribute("class", t2) : e.className = t2;
  }
  var yr = /* @__PURE__ */ Symbol("_vod");
  var uo = /* @__PURE__ */ Symbol("_vsh");
  var Gr = { name: "show", beforeMount(e, { value: t2 }, { transition: n2 }) {
    e[yr] = e.style.display === "none" ? "" : e.style.display, n2 && t2 ? n2.beforeEnter(e) : Qn(e, t2);
  }, mounted(e, { value: t2 }, { transition: n2 }) {
    n2 && t2 && n2.enter(e);
  }, updated(e, { value: t2, oldValue: n2 }, { transition: s }) {
    !t2 != !n2 && (s ? t2 ? (s.beforeEnter(e), Qn(e, true), s.enter(e)) : s.leave(e, () => {
      Qn(e, false);
    }) : Qn(e, t2));
  }, beforeUnmount(e, { value: t2 }) {
    Qn(e, t2);
  } };
  function Qn(e, t2) {
    e.style.display = t2 ? e[yr] : "none", e[uo] = !t2;
  }
  var wv = /* @__PURE__ */ Symbol("");
  var Cv = /(?:^|;)\s*display\s*:/;
  function Sv(e, t2, n2) {
    const s = e.style, r2 = Le(n2);
    let i2 = false;
    if (n2 && !r2) {
      if (t2) if (Le(t2)) for (const o of t2.split(";")) {
        const l = o.slice(0, o.indexOf(":")).trim();
        n2[l] == null && ss(s, l, "");
      }
      else for (const o in t2) n2[o] == null && ss(s, o, "");
      for (const o in n2) {
        o === "display" && (i2 = true);
        const l = n2[o];
        l != null ? _v(e, o, !Le(t2) && t2 ? t2[o] : void 0, l) || ss(s, o, l) : ss(s, o, "");
      }
    } else if (r2) {
      if (t2 !== n2) {
        const o = s[wv];
        o && (n2 += ";" + o), s.cssText = n2, i2 = Cv.test(n2);
      }
    } else t2 && e.removeAttribute("style");
    yr in e && (e[yr] = i2 ? s.display : "", e[uo] && (s.display = "none"));
  }
  var Xs = /\s*!important$/;
  function ss(e, t2, n2) {
    if (ee(n2)) n2.forEach((s) => ss(e, t2, s));
    else if (n2 == null && (n2 = ""), t2.startsWith("--")) Xs.test(n2) ? e.setProperty(t2, n2.replace(Xs, ""), "important") : e.setProperty(t2, n2);
    else {
      const s = xv(e, t2);
      Xs.test(n2) ? e.setProperty(_n(s), n2.replace(Xs, ""), "important") : e[s] = n2;
    }
  }
  var ml = ["Webkit", "Moz", "ms"];
  var ci = {};
  function xv(e, t2) {
    const n2 = ci[t2];
    if (n2) return n2;
    let s = je(t2);
    if (s !== "filter" && s in e) return ci[t2] = s;
    s = jn(s);
    for (let r2 = 0; r2 < ml.length; r2++) {
      const i2 = ml[r2] + s;
      if (i2 in e) return ci[t2] = i2;
    }
    return t2;
  }
  function _v(e, t2, n2, s) {
    return e.tagName === "TEXTAREA" && (t2 === "width" || t2 === "height") && Le(s) && n2 === s;
  }
  var gl = "http://www.w3.org/1999/xlink";
  function yl(e, t2, n2, s, r2, i2 = Af(t2)) {
    s && t2.startsWith("xlink:") ? n2 == null ? e.removeAttributeNS(gl, t2.slice(6, t2.length)) : e.setAttributeNS(gl, t2, n2) : n2 == null || i2 && !Da(n2) ? e.removeAttribute(t2) : e.setAttribute(t2, i2 ? "" : ft(n2) ? String(n2) : n2);
  }
  function pl(e, t2, n2, s, r2) {
    if (t2 === "innerHTML" || t2 === "textContent") {
      n2 != null && (e[t2] = t2 === "innerHTML" ? Yu(n2) : n2);
      return;
    }
    const i2 = e.tagName;
    if (t2 === "value" && i2 !== "PROGRESS" && !i2.includes("-")) {
      const l = i2 === "OPTION" ? e.getAttribute("value") || "" : e.value, a2 = n2 == null ? e.type === "checkbox" ? "on" : "" : String(n2);
      (l !== a2 || !("_value" in e)) && (e.value = a2), n2 == null && e.removeAttribute(t2), e._value = n2;
      return;
    }
    let o = false;
    if (n2 === "" || n2 == null) {
      const l = typeof e[t2];
      l === "boolean" ? n2 = Da(n2) : n2 == null && l === "string" ? (n2 = "", o = true) : l === "number" && (n2 = 0, o = true);
    }
    try {
      e[t2] = n2;
    } catch {
    }
    o && e.removeAttribute(r2 || t2);
  }
  function Lv(e, t2, n2, s) {
    e.addEventListener(t2, n2, s);
  }
  function Av(e, t2, n2, s) {
    e.removeEventListener(t2, n2, s);
  }
  var bl = /* @__PURE__ */ Symbol("_vei");
  function kv(e, t2, n2, s, r2 = null) {
    const i2 = e[bl] || (e[bl] = {}), o = i2[t2];
    if (s && o) o.value = s;
    else {
      const [l, a2] = Mv(t2);
      if (s) {
        const c2 = i2[t2] = Iv(s, r2);
        Lv(e, l, c2, a2);
      } else o && (Av(e, l, o, a2), i2[t2] = void 0);
    }
  }
  var Tv = /(Once|Passive|Capture)$/;
  var Ev = /^on:?(?:Once|Passive|Capture)$/;
  function Mv(e) {
    let t2, n2;
    for (; (n2 = e.match(Tv)) && !Ev.test(e); ) t2 || (t2 = {}), e = e.slice(0, e.length - n2[1].length), t2[n2[1].toLowerCase()] = true;
    return [e[2] === ":" ? e.slice(3) : _n(e.slice(2)), t2];
  }
  var fi = 0;
  var Vv = Promise.resolve();
  var Pv = () => fi || (Vv.then(() => fi = 0), fi = Date.now());
  function Iv(e, t2) {
    const n2 = (s) => {
      if (!s._vts) s._vts = Date.now();
      else if (s._vts <= n2.attached) return;
      const r2 = n2.value;
      if (ee(r2)) {
        const i2 = s.stopImmediatePropagation;
        s.stopImmediatePropagation = () => {
          i2.call(s), s._stopped = true;
        };
        const o = r2.slice(), l = [s];
        for (let a2 = 0; a2 < o.length && !s._stopped; a2++) {
          const c2 = o[a2];
          c2 && dt(c2, t2, 5, l);
        }
      } else dt(r2, t2, 5, [s]);
    };
    return n2.value = e, n2.attached = Pv(), n2;
  }
  var wl = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123;
  var Ov = (e, t2, n2, s, r2, i2) => {
    const o = r2 === "svg";
    t2 === "class" ? bv(e, s, o) : t2 === "style" ? Sv(e, n2, s) : Or(t2) ? Dr(t2) || kv(e, t2, n2, s, i2) : (t2[0] === "." ? (t2 = t2.slice(1), true) : t2[0] === "^" ? (t2 = t2.slice(1), false) : Dv(e, t2, s, o)) ? (pl(e, t2, s), !e.tagName.includes("-") && (t2 === "value" || t2 === "checked" || t2 === "selected") && yl(e, t2, s, o, i2, t2 !== "value")) : e._isVueCE && (Hv(e, t2) || e._def.__asyncLoader && (/[A-Z]/.test(t2) || !Le(s))) ? pl(e, je(t2), s, i2, t2) : (t2 === "true-value" ? e._trueValue = s : t2 === "false-value" && (e._falseValue = s), yl(e, t2, s, o));
  };
  function Dv(e, t2, n2, s) {
    if (s) return !!(t2 === "innerHTML" || t2 === "textContent" || t2 in e && wl(t2) && se(n2));
    if (t2 === "spellcheck" || t2 === "draggable" || t2 === "translate" || t2 === "autocorrect" || t2 === "sandbox" && e.tagName === "IFRAME" || t2 === "form" || t2 === "list" && e.tagName === "INPUT" || t2 === "type" && e.tagName === "TEXTAREA") return false;
    if (t2 === "width" || t2 === "height") {
      const r2 = e.tagName;
      if (r2 === "IMG" || r2 === "VIDEO" || r2 === "CANVAS" || r2 === "SOURCE") return false;
    }
    return wl(t2) && Le(n2) ? false : t2 in e;
  }
  function Hv(e, t2) {
    const n2 = e._def.props;
    if (!n2) return false;
    const s = je(t2);
    return Array.isArray(n2) ? n2.some((r2) => je(r2) === s) : Object.keys(n2).some((r2) => je(r2) === s);
  }
  var qu = /* @__PURE__ */ new WeakMap();
  var Xu = /* @__PURE__ */ new WeakMap();
  var pr = /* @__PURE__ */ Symbol("_moveCb");
  var Cl = /* @__PURE__ */ Symbol("_enterCb");
  var Fv = (e) => (delete e.props.mode, e);
  var $v = Fv({ name: "TransitionGroup", props: Oe({}, Ku, { tag: String, moveClass: String }), setup(e, { slots: t2 }) {
    const n2 = Ps(), s = fu();
    let r2, i2;
    return io(() => {
      if (!r2.length) return;
      const o = e.moveClass || `${e.name || "v"}-move`;
      if (!Wv(r2[0].el, n2.vnode.el, o)) {
        r2 = [];
        return;
      }
      r2.forEach(Rv), r2.forEach(Bv);
      const l = r2.filter(Nv);
      Ii(n2.vnode.el), l.forEach((a2) => {
        const c2 = a2.el, u = c2.style;
        Ct(c2, o), u.transform = u.webkitTransform = u.transitionDuration = "";
        const f2 = c2[pr] = (d) => {
          d && d.target !== c2 || (!d || d.propertyName.endsWith("transform")) && (c2.removeEventListener("transitionend", f2), c2[pr] = null, Ut(c2, o));
        };
        c2.addEventListener("transitionend", f2);
      }), r2 = [];
    }), () => {
      const o = ue(e), l = Gu(o);
      let a2 = o.tag || Me;
      if (r2 = [], i2) for (let c2 = 0; c2 < i2.length; c2++) {
        const u = i2[c2];
        u.el && u.el instanceof Element && !u.el[uo] && (r2.push(u), Cn(u, gs(u, l, s, n2)), qu.set(u, Ju(u.el)));
      }
      i2 = t2.default ? ro(t2.default()) : [];
      for (let c2 = 0; c2 < i2.length; c2++) {
        const u = i2[c2];
        u.key != null && Cn(u, gs(u, l, s, n2));
      }
      return k(a2, null, i2);
    };
  } });
  var co = $v;
  function Rv(e) {
    const t2 = e.el;
    t2[pr] && t2[pr](), t2[Cl] && t2[Cl]();
  }
  function Bv(e) {
    Xu.set(e, Ju(e.el));
  }
  function Nv(e) {
    const t2 = qu.get(e), n2 = Xu.get(e), s = t2.left - n2.left, r2 = t2.top - n2.top;
    if (s || r2) {
      const i2 = e.el, o = i2.style, l = i2.getBoundingClientRect();
      let a2 = 1, c2 = 1;
      return i2.offsetWidth && (a2 = l.width / i2.offsetWidth), i2.offsetHeight && (c2 = l.height / i2.offsetHeight), (!Number.isFinite(a2) || a2 === 0) && (a2 = 1), (!Number.isFinite(c2) || c2 === 0) && (c2 = 1), Math.abs(a2 - 1) < 0.01 && (a2 = 1), Math.abs(c2 - 1) < 0.01 && (c2 = 1), o.transform = o.webkitTransform = `translate(${s / a2}px,${r2 / c2}px)`, o.transitionDuration = "0s", e;
    }
  }
  function Ju(e) {
    const t2 = e.getBoundingClientRect();
    return { left: t2.left, top: t2.top };
  }
  function Wv(e, t2, n2) {
    const s = e.cloneNode(), r2 = e[Bn];
    r2 && r2.forEach((l) => {
      l.split(/\s+/).forEach((a2) => a2 && s.classList.remove(a2));
    }), n2.split(/\s+/).forEach((l) => l && s.classList.add(l)), s.style.display = "none";
    const i2 = t2.nodeType === 1 ? t2 : t2.parentNode;
    i2.appendChild(s);
    const { hasTransform: o } = Zu(s);
    return i2.removeChild(s), o;
  }
  var zv = Oe({ patchProp: Ov }, mv);
  var Sl;
  function jv() {
    return Sl || (Sl = Ud(zv));
  }
  var ay = (...e) => {
    const t2 = jv().createApp(...e), { mount: n2 } = t2;
    return t2.mount = (s) => {
      const r2 = Uv(s);
      if (!r2) return;
      const i2 = t2._component;
      !se(i2) && !i2.render && !i2.template && (i2.template = r2.innerHTML), r2.nodeType === 1 && (r2.textContent = "");
      const o = n2(r2, false, Yv(r2));
      return r2 instanceof Element && (r2.removeAttribute("v-cloak"), r2.setAttribute("data-v-app", "")), o;
    }, t2;
  };
  function Yv(e) {
    if (e instanceof SVGElement) return "svg";
    if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
  }
  function Uv(e) {
    return Le(e) ? document.querySelector(e) : e;
  }
  var dy = "M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z";
  var vy = "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z";
  var hy = (e, t2) => {
    const n2 = e.__vccOpts || e;
    for (const [s, r2] of t2) n2[s] = r2;
    return n2;
  };
  function Kv(e, t2) {
    t2 = Array.isArray(t2) ? t2.slice(0, -1).map((n2) => `'${n2}'`).join(", ") + ` or '${t2.at(-1)}'` : `'${t2}'`;
  }
  var pe = typeof window < "u";
  var fo = pe && "IntersectionObserver" in window;
  var Gv = pe && ("ontouchstart" in window || window.navigator.maxTouchPoints > 0);
  var Qu = pe && "matchMedia" in window && typeof window.matchMedia == "function";
  var Nn = () => Qu && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var xl = pe && CSS?.supports?.("-webkit-backdrop-filter", "none");
  function _l(e, t2, n2) {
    Zv(e, t2), t2.set(e, n2);
  }
  function Zv(e, t2) {
    if (t2.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function Ll(e, t2, n2) {
    return e.set(ec(e, t2), n2), n2;
  }
  function Vt(e, t2) {
    return e.get(ec(e, t2));
  }
  function ec(e, t2, n2) {
    if (typeof e == "function" ? e === t2 : e.has(t2)) return arguments.length < 3 ? t2 : n2;
    throw new TypeError("Private element is not present on this object");
  }
  function qv(e, t2, n2) {
    const s = t2.length - 1;
    if (s < 0) return e === void 0 ? n2 : e;
    for (let r2 = 0; r2 < s; r2++) {
      if (e == null) return n2;
      e = e[t2[r2]];
    }
    return e == null || e[t2[s]] === void 0 ? n2 : e[t2[s]];
  }
  function Al(e, t2, n2) {
    return e == null || !t2 || typeof t2 != "string" ? n2 : e[t2] !== void 0 ? e[t2] : (t2 = t2.replace(/\[(\w+)\]/g, ".$1"), t2 = t2.replace(/^\./, ""), qv(e, t2.split("."), n2));
  }
  function tc(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return Array.from({ length: e }, (n2, s) => t2 + s);
  }
  function J(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "px";
    if (e == null || e === "") return;
    const n2 = Number(e);
    return isNaN(n2) ? String(e) : isFinite(n2) ? `${n2}${t2}` : void 0;
  }
  function br(e) {
    return e !== null && typeof e == "object" && !Array.isArray(e);
  }
  function kl(e) {
    let t2;
    return e !== null && typeof e == "object" && ((t2 = Object.getPrototypeOf(e)) === Object.prototype || t2 === null);
  }
  function nc(e) {
    if (e && "$el" in e) {
      const t2 = e.$el;
      return t2?.nodeType === Node.TEXT_NODE ? t2.nextElementSibling : t2;
    }
    return e;
  }
  function Oi(e) {
    return Object.keys(e);
  }
  function di(e, t2) {
    return t2.every((n2) => e.hasOwnProperty(n2));
  }
  function sc(e, t2) {
    const n2 = {};
    for (const s of t2) Object.prototype.hasOwnProperty.call(e, s) && (n2[s] = e[s]);
    return n2;
  }
  function Un(e, t2) {
    const n2 = { ...e };
    return t2.forEach((s) => delete n2[s]), n2;
  }
  var rc = /^on[^a-z]/;
  var ic = (e) => rc.test(e);
  function Jv(e) {
    return e == null ? [] : Array.isArray(e) ? e : [e];
  }
  function Bt(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    return Math.max(t2, Math.min(n2, e));
  }
  function El(e, t2) {
    let n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
    return e + n2.repeat(Math.max(0, t2 - e.length));
  }
  function Ml(e, t2) {
    return (arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0").repeat(Math.max(0, t2 - e.length)) + e;
  }
  function Qv(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    const n2 = [];
    let s = 0;
    for (; s < e.length; ) n2.push(e.substr(s, t2)), s += t2;
    return n2;
  }
  function We() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n2 = arguments.length > 2 ? arguments[2] : void 0;
    const s = {};
    for (const r2 in e) s[r2] = e[r2];
    for (const r2 in t2) {
      const i2 = e[r2], o = t2[r2];
      if (kl(i2) && kl(o)) {
        s[r2] = We(i2, o, n2);
        continue;
      }
      if (n2 && Array.isArray(i2) && Array.isArray(o)) {
        s[r2] = n2(i2, o);
        continue;
      }
      s[r2] = o;
    }
    return s;
  }
  function oc(e) {
    return e.map((t2) => t2.type === Me ? oc(t2.children) : t2).flat();
  }
  function gn() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    if (gn.cache.has(e)) return gn.cache.get(e);
    const t2 = e.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
    return gn.cache.set(e, t2), t2;
  }
  gn.cache = /* @__PURE__ */ new Map();
  function In(e, t2) {
    if (!t2 || typeof t2 != "object") return [];
    if (Array.isArray(t2)) return t2.map((n2) => In(e, n2)).flat(1);
    if (t2.suspense) return In(e, t2.ssContent);
    if (Array.isArray(t2.children)) return t2.children.map((n2) => In(e, n2)).flat(1);
    if (t2.component) {
      if (Object.getOwnPropertyDescriptor(t2.component.provides, e)) return [t2.component];
      if (t2.component.subTree) return In(e, t2.component.subTree).flat(1);
    }
    return [];
  }
  var En = /* @__PURE__ */ new WeakMap();
  var an = /* @__PURE__ */ new WeakMap();
  var eh = class {
    constructor(t2) {
      _l(this, En, []), _l(this, an, 0), this.size = t2;
    }
    get isFull() {
      return Vt(En, this).length === this.size;
    }
    push(t2) {
      Vt(En, this)[Vt(an, this)] = t2, Ll(an, this, (Vt(an, this) + 1) % this.size);
    }
    values() {
      return Vt(En, this).slice(Vt(an, this)).concat(Vt(En, this).slice(0, Vt(an, this)));
    }
    clear() {
      Vt(En, this).length = 0, Ll(an, this, 0);
    }
  };
  function vo(e) {
    const t2 = $e({});
    Tt(() => {
      const s = e();
      for (const r2 in s) t2[r2] = s[r2];
    }, { flush: "sync" });
    const n2 = {};
    for (const s in t2) n2[s] = $(() => t2[s]);
    return n2;
  }
  function wr(e, t2) {
    return e.includes(t2);
  }
  function lc(e) {
    return e[2].toLowerCase() + e.slice(3);
  }
  var Vl = () => [Function, Array];
  function Pl(e, t2) {
    return t2 = "on" + jn(t2), !!(e[t2] || e[`${t2}Once`] || e[`${t2}Capture`] || e[`${t2}OnceCapture`] || e[`${t2}CaptureOnce`]);
  }
  function yn(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    const n2 = ["button", "[href]", 'input:not([type="hidden"])', "select", "textarea", "details:not(:has(> summary))", "details > summary", "[tabindex]", '[contenteditable]:not([contenteditable="false"])', "audio[controls]", "video[controls]"].map((r2) => `${r2}${t2 ? ':not([tabindex="-1"])' : ""}:not([disabled], [inert])`).join(", ");
    let s;
    try {
      s = [...e.querySelectorAll(n2)];
    } catch {
      return [];
    }
    return s.filter((r2) => !r2.closest("[inert]")).filter((r2) => !!r2.offsetParent || r2.getClientRects().length > 0).filter((r2) => !r2.parentElement?.closest("details:not([open])") || r2.tagName === "SUMMARY" && r2.parentElement?.tagName === "DETAILS");
  }
  function ac(e, t2, n2) {
    let s, r2 = e.indexOf(document.activeElement);
    const i2 = t2 === "next" ? 1 : -1;
    do
      r2 += i2, s = e[r2];
    while ((!s || s.offsetParent == null || !(n2?.(s) ?? true)) && r2 < e.length && r2 >= 0);
    return s;
  }
  function nr(e, t2, n2) {
    const s = yn(e);
    if (t2 == null) (e === document.activeElement || !e.contains(document.activeElement)) && s[0]?.focus(n2);
    else if (t2 === "first") s[0]?.focus(n2);
    else if (t2 === "last") s.at(-1)?.focus(n2);
    else if (typeof t2 == "number") s[t2]?.focus(n2);
    else {
      const r2 = ac(s, t2);
      r2 ? r2.focus() : nr(e, t2 === "next" ? "first" : "last", n2);
    }
  }
  function th(e, t2) {
    if (!(pe && typeof CSS < "u" && typeof CSS.supports < "u" && CSS.supports(`selector(${t2})`))) return null;
    try {
      return !!e && e.matches(t2);
    } catch {
      return null;
    }
  }
  function nh(e, t2) {
    if (!pe || e === 0) return t2(), () => {
    };
    const n2 = window.setTimeout(t2, e);
    return () => window.clearTimeout(n2);
  }
  function sh(e, t2) {
    const n2 = e.clientX, s = e.clientY, r2 = t2.getBoundingClientRect(), i2 = r2.left, o = r2.top, l = r2.right, a2 = r2.bottom;
    return n2 >= i2 && n2 <= l && s >= o && s <= a2;
  }
  function Di() {
    const e = le(), t2 = (n2) => {
      e.value = n2;
    };
    return Object.defineProperty(t2, "value", { enumerable: true, get: () => e.value, set: (n2) => e.value = n2 }), Object.defineProperty(t2, "el", { enumerable: true, get: () => nc(e.value) }), t2;
  }
  function Cr(e) {
    return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint";
  }
  function rh(e) {
    const t2 = ["checked", "disabled"];
    return Object.fromEntries(Object.entries(e).filter((n2) => {
      let [s, r2] = n2;
      return t2.includes(s) ? !!r2 : r2 !== void 0;
    }));
  }
  var uc = ["top", "bottom"];
  var ih = ["start", "end", "left", "right"];
  function Hi(e, t2) {
    let [n2, s] = e.split(" ");
    return s || (s = wr(uc, n2) ? "start" : wr(ih, n2) ? "top" : "center"), { side: Il(n2, t2), align: Il(s, t2) };
  }
  function Il(e, t2) {
    return e === "start" ? t2 ? "right" : "left" : e === "end" ? t2 ? "left" : "right" : e;
  }
  function vi(e) {
    return { side: { center: "center", top: "bottom", bottom: "top", left: "right", right: "left" }[e.side], align: e.align };
  }
  function hi(e) {
    return { side: e.side, align: { center: "center", top: "bottom", bottom: "top", left: "right", right: "left" }[e.align] };
  }
  function Ol(e) {
    return { side: e.align, align: e.side };
  }
  function Dl(e) {
    return wr(uc, e.side) ? "y" : "x";
  }
  var rt = class {
    constructor(t2) {
      const n2 = document.body.currentCSSZoom ?? 1, s = t2 instanceof Element, r2 = s ? 1 + (1 - n2) / n2 : 1, { x: i2, y: o, width: l, height: a2 } = s ? t2.getBoundingClientRect() : t2;
      this.x = i2 * r2, this.y = o * r2, this.width = l * r2, this.height = a2 * r2;
    }
    get top() {
      return this.y;
    }
    get bottom() {
      return this.y + this.height;
    }
    get left() {
      return this.x;
    }
    get right() {
      return this.x + this.width;
    }
  };
  function Hl(e, t2) {
    return { x: { before: Math.max(0, t2.left - e.left), after: Math.max(0, e.right - t2.right) }, y: { before: Math.max(0, t2.top - e.top), after: Math.max(0, e.bottom - t2.bottom) } };
  }
  function ho(e) {
    if (Array.isArray(e)) {
      const t2 = document.body.currentCSSZoom ?? 1, n2 = 1 + (1 - t2) / t2;
      return new rt({ x: e[0] * n2, y: e[1] * n2, width: 0 * n2, height: 0 * n2 });
    } else return new rt(e);
  }
  function oh(e) {
    return e === document.documentElement ? visualViewport ? new rt({ x: visualViewport.scale > 1 || xl ? 0 : visualViewport.offsetLeft, y: visualViewport.scale > 1 || xl ? 0 : visualViewport.offsetTop, width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }) : new rt({ x: 0, y: 0, width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }) : new rt(e);
  }
  function cc(e) {
    const t2 = new rt(e), n2 = getComputedStyle(e), s = n2.transform;
    if (s) {
      let r2, i2, o, l, a2;
      if (s.startsWith("matrix3d(")) r2 = s.slice(9, -1).split(/, /), i2 = Number(r2[0]), o = Number(r2[5]), l = Number(r2[12]), a2 = Number(r2[13]);
      else if (s.startsWith("matrix(")) r2 = s.slice(7, -1).split(/, /), i2 = Number(r2[0]), o = Number(r2[3]), l = Number(r2[4]), a2 = Number(r2[5]);
      else return new rt(t2);
      const c2 = n2.transformOrigin, u = t2.x - l - (1 - i2) * parseFloat(c2), f2 = t2.y - a2 - (1 - o) * parseFloat(c2.slice(c2.indexOf(" ") + 1)), d = i2 ? t2.width / i2 : e.offsetWidth + 1, h2 = o ? t2.height / o : e.offsetHeight + 1;
      return new rt({ x: u, y: f2, width: d, height: h2 });
    } else return new rt(t2);
  }
  function Gt(e, t2, n2) {
    if (typeof e.animate > "u") return { finished: Promise.resolve() };
    let s;
    try {
      s = e.animate(t2, n2);
    } catch {
      return { finished: Promise.resolve() };
    }
    return typeof s.finished > "u" && (s.finished = new Promise((r2) => {
      s.onfinish = () => {
        r2(s);
      };
    })), s;
  }
  var sr = /* @__PURE__ */ new WeakMap();
  function lh(e, t2) {
    Object.keys(t2).forEach((n2) => {
      if (ic(n2)) {
        const s = lc(n2), r2 = sr.get(e);
        if (t2[n2] == null) r2?.forEach((i2) => {
          const [o, l] = i2;
          o === s && (e.removeEventListener(s, l), r2.delete(i2));
        });
        else if (!r2 || ![...r2].some((i2) => i2[0] === s && i2[1] === t2[n2])) {
          e.addEventListener(s, t2[n2]);
          const i2 = r2 || /* @__PURE__ */ new Set();
          i2.add([s, t2[n2]]), sr.has(e) || sr.set(e, i2);
        }
      } else t2[n2] == null ? e.removeAttribute(n2) : e.setAttribute(n2, t2[n2]);
    });
  }
  function ah(e, t2) {
    Object.keys(t2).forEach((n2) => {
      if (ic(n2)) {
        const s = lc(n2), r2 = sr.get(e);
        r2?.forEach((i2) => {
          const [o, l] = i2;
          o === s && (e.removeEventListener(s, l), r2.delete(i2));
        });
      } else e.removeAttribute(n2);
    });
  }
  var Mn = 2.4;
  var Fl = 0.2126729;
  var $l = 0.7151522;
  var Rl = 0.072175;
  var uh = 0.55;
  var ch = 0.58;
  var fh = 0.57;
  var dh = 0.62;
  var Js = 0.03;
  var Bl = 1.45;
  var vh = 5e-4;
  var hh = 1.25;
  var mh = 1.25;
  var Nl = 0.078;
  var Wl = 12.82051282051282;
  var Qs = 0.06;
  var zl = 1e-3;
  function jl(e, t2) {
    const n2 = (e.r / 255) ** Mn, s = (e.g / 255) ** Mn, r2 = (e.b / 255) ** Mn, i2 = (t2.r / 255) ** Mn, o = (t2.g / 255) ** Mn, l = (t2.b / 255) ** Mn;
    let a2 = n2 * Fl + s * $l + r2 * Rl, c2 = i2 * Fl + o * $l + l * Rl;
    if (a2 <= Js && (a2 += (Js - a2) ** Bl), c2 <= Js && (c2 += (Js - c2) ** Bl), Math.abs(c2 - a2) < vh) return 0;
    let u;
    if (c2 > a2) {
      const f2 = (c2 ** uh - a2 ** ch) * hh;
      u = f2 < zl ? 0 : f2 < Nl ? f2 - f2 * Wl * Qs : f2 - Qs;
    } else {
      const f2 = (c2 ** dh - a2 ** fh) * mh;
      u = f2 > -zl ? 0 : f2 > -Nl ? f2 - f2 * Wl * Qs : f2 + Qs;
    }
    return u * 100;
  }
  var Sr = 0.20689655172413793;
  var gh = (e) => e > Sr ** 3 ? Math.cbrt(e) : e / (3 * Sr ** 2) + 4 / 29;
  var yh = (e) => e > Sr ? e ** 3 : 3 * Sr ** 2 * (e - 4 / 29);
  function fc(e) {
    const t2 = gh, n2 = t2(e[1]);
    return [116 * n2 - 16, 500 * (t2(e[0] / 0.95047) - n2), 200 * (n2 - t2(e[2] / 1.08883))];
  }
  function dc(e) {
    const t2 = yh, n2 = (e[0] + 16) / 116;
    return [t2(n2 + e[1] / 500) * 0.95047, t2(n2), t2(n2 - e[2] / 200) * 1.08883];
  }
  var ph = [[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.204, 1.057]];
  var bh = (e) => e <= 31308e-7 ? e * 12.92 : 1.055 * e ** (1 / 2.4) - 0.055;
  var wh = [[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]];
  var Ch = (e) => e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
  function vc(e) {
    const t2 = Array(3), n2 = bh, s = ph;
    for (let r2 = 0; r2 < 3; ++r2) t2[r2] = Math.round(Bt(n2(s[r2][0] * e[0] + s[r2][1] * e[1] + s[r2][2] * e[2])) * 255);
    return { r: t2[0], g: t2[1], b: t2[2] };
  }
  function mo(e) {
    let { r: t2, g: n2, b: s } = e;
    const r2 = [0, 0, 0], i2 = Ch, o = wh;
    t2 = i2(t2 / 255), n2 = i2(n2 / 255), s = i2(s / 255);
    for (let l = 0; l < 3; ++l) r2[l] = o[l][0] * t2 + o[l][1] * n2 + o[l][2] * s;
    return r2;
  }
  function Fi(e) {
    return !!e && /^(#|var\(--|(rgb|hsl)a?\()/.test(e);
  }
  function Sh(e) {
    return Fi(e) && !/^((rgb|hsl)a?\()?var\(--/.test(e);
  }
  var Yl = /^(?<fn>(?:rgb|hsl)a?)\((?<values>.+)\)/;
  var xh = { rgb: (e, t2, n2, s) => ({ r: e, g: t2, b: n2, a: s }), rgba: (e, t2, n2, s) => ({ r: e, g: t2, b: n2, a: s }), hsl: (e, t2, n2, s) => Ul({ h: e, s: t2, l: n2, a: s }), hsla: (e, t2, n2, s) => Ul({ h: e, s: t2, l: n2, a: s }), hsv: (e, t2, n2, s) => ws({ h: e, s: t2, v: n2, a: s }), hsva: (e, t2, n2, s) => ws({ h: e, s: t2, v: n2, a: s }) };
  function At(e) {
    if (typeof e == "number") return { r: (e & 16711680) >> 16, g: (e & 65280) >> 8, b: e & 255 };
    if (typeof e == "string" && Yl.test(e)) {
      const { groups: t2 } = e.match(Yl), { fn: n2, values: s } = t2, r2 = s.split(/,\s*|\s*\/\s*|\s+/).map((i2, o) => i2.endsWith("%") || o > 0 && o < 3 && ["hsl", "hsla", "hsv", "hsva"].includes(n2) ? parseFloat(i2) / 100 : parseFloat(i2));
      return xh[n2](...r2);
    } else if (typeof e == "string") {
      let t2 = e.startsWith("#") ? e.slice(1) : e;
      return [3, 4].includes(t2.length) ? t2 = t2.split("").map((n2) => n2 + n2).join("") : [6, 8].includes(t2.length), Lh(t2);
    } else if (typeof e == "object") {
      if (di(e, ["r", "g", "b"])) return e;
      if (di(e, ["h", "s", "l"])) return ws(hc(e));
      if (di(e, ["h", "s", "v"])) return ws(e);
    }
    throw new TypeError(`Invalid color: ${e == null ? e : String(e) || e.constructor.name}
Expected #hex, #hexa, rgb(), rgba(), hsl(), hsla(), object or number`);
  }
  function ws(e) {
    const { h: t2, s: n2, v: s, a: r2 } = e, i2 = (l) => {
      const a2 = (l + t2 / 60) % 6;
      return s - s * n2 * Math.max(Math.min(a2, 4 - a2, 1), 0);
    }, o = [i2(5), i2(3), i2(1)].map((l) => Math.round(l * 255));
    return { r: o[0], g: o[1], b: o[2], a: r2 };
  }
  function Ul(e) {
    return ws(hc(e));
  }
  function hc(e) {
    const { h: t2, s: n2, l: s, a: r2 } = e, i2 = s + n2 * Math.min(s, 1 - s), o = i2 === 0 ? 0 : 2 - 2 * s / i2;
    return { h: t2, s: o, v: i2, a: r2 };
  }
  function er(e) {
    const t2 = Math.round(e).toString(16);
    return ("00".substr(0, 2 - t2.length) + t2).toUpperCase();
  }
  function _h(e) {
    let { r: t2, g: n2, b: s, a: r2 } = e;
    return `#${[er(t2), er(n2), er(s), r2 !== void 0 ? er(Math.round(r2 * 255)) : ""].join("")}`;
  }
  function Lh(e) {
    e = Ah(e);
    let [t2, n2, s, r2] = Qv(e, 2).map((i2) => parseInt(i2, 16));
    return r2 = r2 === void 0 ? r2 : r2 / 255, { r: t2, g: n2, b: s, a: r2 };
  }
  function Ah(e) {
    return e.startsWith("#") && (e = e.slice(1)), e = e.replace(/([^0-9a-f])/gi, "F"), (e.length === 3 || e.length === 4) && (e = e.split("").map((t2) => t2 + t2).join("")), e.length !== 6 && (e = El(El(e, 6), 8, "F")), e;
  }
  function kh(e, t2) {
    const n2 = fc(mo(e));
    return n2[0] = n2[0] + t2 * 10, vc(dc(n2));
  }
  function Th(e, t2) {
    const n2 = fc(mo(e));
    return n2[0] = n2[0] - t2 * 10, vc(dc(n2));
  }
  function Eh(e) {
    const t2 = At(e);
    return mo(t2)[1];
  }
  function mc(e) {
    const t2 = Math.abs(jl(At(0), At(e)));
    return Math.abs(jl(At(16777215), At(e))) > Math.min(t2, 50) ? "#fff" : "#000";
  }
  function K(e, t2) {
    return (n2) => Object.keys(e).reduce((s, r2) => {
      const o = typeof e[r2] == "object" && e[r2] != null && !Array.isArray(e[r2]) ? e[r2] : { type: e[r2] };
      return n2 && r2 in n2 ? s[r2] = { ...o, default: n2[r2] } : s[r2] = o, t2 && !s[r2].source && (s[r2].source = t2), s;
    }, {});
  }
  var ke = K({ class: [String, Array, Object], style: { type: [String, Array, Object], default: null } }, "component");
  function Re(e, t2) {
    const n2 = Ps();
    if (!n2) throw new Error(`[Vuetify] ${e} must be called from inside a setup function`);
    return n2;
  }
  function Qt() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "composables";
    const t2 = Re(e).type;
    return gn(t2?.aliasName || t2?.name);
  }
  function Mh(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Re("injectSelf");
    const { provides: n2 } = t2;
    if (n2 && e in n2) return n2[e];
  }
  var Wn = /* @__PURE__ */ Symbol.for("vuetify:defaults");
  function Vh(e) {
    return _e(e);
  }
  function go() {
    const e = Ie(Wn);
    if (!e) throw new Error("[Vuetify] Could not find defaults instance");
    return e;
  }
  function Os(e, t2) {
    const n2 = go(), s = _e(e), r2 = D(() => {
      if (Zt(t2?.disabled)) return n2.value;
      const o = Zt(t2?.scoped), l = Zt(t2?.reset), a2 = Zt(t2?.root);
      if (s.value == null && !(o || l || a2)) return n2.value;
      let c2 = We(s.value, { prev: n2.value });
      if (o) return c2;
      if (l || a2) {
        const u = Number(l || 1 / 0);
        for (let f2 = 0; f2 <= u && !(!c2 || !("prev" in c2)); f2++) c2 = c2.prev;
        return c2 && typeof a2 == "string" && a2 in c2 && (c2 = We(We(c2, { prev: c2 }), c2[a2])), c2;
      }
      return c2.prev ? We(c2.prev, c2) : c2;
    });
    return Et(Wn, r2), r2;
  }
  function Ph(e, t2) {
    return e.props && (typeof e.props[t2] < "u" || typeof e.props[gn(t2)] < "u");
  }
  function Ih() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t2 = arguments.length > 1 ? arguments[1] : void 0, n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : go();
    const s = Re("useDefaults");
    if (t2 = t2 ?? s.type.name ?? s.type.__name, !t2) throw new Error("[Vuetify] Could not determine component name");
    const r2 = D(() => n2.value?.[e._as ?? t2]), i2 = new Proxy(e, { get(a2, c2) {
      const u = Reflect.get(a2, c2);
      if (c2 === "class" || c2 === "style") return [r2.value?.[c2], u].filter((h2) => h2 != null);
      if (Ph(s.vnode, c2)) return u;
      const f2 = r2.value?.[c2];
      if (f2 !== void 0) return f2;
      const d = n2.value?.global?.[c2];
      return d !== void 0 ? d : u;
    } }), o = le();
    Tt(() => {
      if (r2.value) {
        const a2 = Object.entries(r2.value).filter((c2) => {
          let [u] = c2;
          return u.startsWith(u[0].toUpperCase());
        });
        o.value = a2.length ? Object.fromEntries(a2) : void 0;
      } else o.value = void 0;
    });
    function l() {
      const a2 = Mh(Wn, s);
      Et(Wn, D(() => o.value ? We(a2?.value ?? {}, o.value) : a2?.value));
    }
    return { props: i2, provideSubDefaults: l };
  }
  function Ds(e) {
    if (e._setup = e._setup ?? e.setup, !e.name) return e;
    if (e._setup) {
      e.props = K(e.props ?? {}, e.name)();
      const t2 = Object.keys(e.props).filter((n2) => n2 !== "class" && n2 !== "style");
      e.filterProps = function(s) {
        return sc(s, t2);
      }, e.props._as = String, e.setup = function(s, r2) {
        const i2 = go();
        if (!i2.value) return e._setup(s, r2);
        const { props: o, provideSubDefaults: l } = Ih(s, s._as ?? e.name, i2), a2 = e._setup(o, r2);
        return l(), a2;
      };
    }
    return e;
  }
  function ce() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    return (t2) => (e ? Ds : md)(t2);
  }
  function yo(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "div", n2 = arguments.length > 2 ? arguments[2] : void 0;
    return ce()({ name: n2 ?? jn(je(e.replace(/__/g, "-"))), props: { tag: { type: String, default: t2 }, ...ke() }, setup(s, r2) {
      let { slots: i2 } = r2;
      return () => Yn(s.tag, { class: [e, s.class], style: s.style }, i2.default?.());
    } });
  }
  function Oh(e, t2, n2, s) {
    if (!n2 || Cr(e) || Cr(t2)) return;
    const r2 = n2.get(e);
    if (r2) r2.set(t2, s);
    else {
      const i2 = /* @__PURE__ */ new WeakMap();
      i2.set(t2, s), n2.set(e, i2);
    }
  }
  function Dh(e, t2, n2) {
    if (!n2 || Cr(e) || Cr(t2)) return null;
    const s = n2.get(e)?.get(t2);
    if (typeof s == "boolean") return s;
    const r2 = n2.get(t2)?.get(e);
    return typeof r2 == "boolean" ? r2 : null;
  }
  function pn(e, t2) {
    let n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : /* @__PURE__ */ new WeakMap();
    if (e === t2) return true;
    if (e instanceof Date && t2 instanceof Date && e.getTime() !== t2.getTime() || e !== Object(e) || t2 !== Object(t2)) return false;
    const s = Object.keys(e);
    if (s.length !== Object.keys(t2).length) return false;
    const r2 = Dh(e, t2, n2);
    return r2 || (Oh(e, t2, n2, true), s.every((i2) => pn(e[i2], t2[i2], n2)));
  }
  function gc(e) {
    if (typeof e.getRootNode != "function") {
      for (; e.parentNode; ) e = e.parentNode;
      return e !== document ? null : document;
    }
    const t2 = e.getRootNode();
    return t2 !== document && t2.getRootNode({ composed: true }) !== document ? null : t2;
  }
  var xr = "cubic-bezier(0.4, 0, 0.2, 1)";
  var Kl = "cubic-bezier(0.0, 0, 0.2, 1)";
  var Gl = "cubic-bezier(0.4, 0, 1, 1)";
  var Hh = { linear: (e) => e, easeInQuad: (e) => e ** 2, easeOutQuad: (e) => e * (2 - e), easeInOutQuad: (e) => e < 0.5 ? 2 * e ** 2 : -1 + (4 - 2 * e) * e, easeInCubic: (e) => e ** 3, easeOutCubic: (e) => --e ** 3 + 1, easeInOutCubic: (e) => e < 0.5 ? 4 * e ** 3 : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1, easeInQuart: (e) => e ** 4, easeOutQuart: (e) => 1 - --e ** 4, easeInOutQuart: (e) => e < 0.5 ? 8 * e ** 4 : 1 - 8 * --e ** 4, easeInQuint: (e) => e ** 5, easeOutQuint: (e) => 1 + --e ** 5, easeInOutQuint: (e) => e < 0.5 ? 16 * e ** 5 : 1 + 16 * --e ** 5, instant: (e) => 1 };
  function yc(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    for (; e; ) {
      if (t2 ? Fh(e) : po(e)) return e;
      e = e.parentElement;
    }
    return document.scrollingElement;
  }
  function _r(e, t2) {
    const n2 = [];
    if (t2 && e && !t2.contains(e)) return n2;
    for (; e && (po(e) && n2.push(e), e !== t2); ) e = e.parentElement;
    return n2;
  }
  function po(e) {
    if (!e || e.nodeType !== Node.ELEMENT_NODE) return false;
    const t2 = window.getComputedStyle(e), n2 = t2.overflowY === "scroll" || t2.overflowY === "auto" && e.scrollHeight > e.clientHeight, s = t2.overflowX === "scroll" || t2.overflowX === "auto" && e.scrollWidth > e.clientWidth;
    return n2 || s;
  }
  function Fh(e) {
    if (!e || e.nodeType !== Node.ELEMENT_NODE) return false;
    const t2 = window.getComputedStyle(e);
    return ["scroll", "auto"].includes(t2.overflowY);
  }
  function $h(e) {
    for (; e; ) {
      if (window.getComputedStyle(e).position === "fixed") return true;
      e = e.offsetParent;
    }
    return false;
  }
  function Se(e) {
    const t2 = Re("useRender");
    t2.render = e;
  }
  var ze = [String, Function, Object, Array];
  var $i = /* @__PURE__ */ Symbol.for("vuetify:icons");
  var Zr = K({ icon: { type: ze }, tag: { type: [String, Object, Function], required: true } }, "icon");
  var Zl = ce()({ name: "VComponentIcon", props: Zr(), setup(e, t2) {
    let { slots: n2 } = t2;
    return () => {
      const s = e.icon;
      return k(e.tag, null, { default: () => [e.icon ? k(s, null, null) : n2.default?.()] });
    };
  } });
  var bo = Ds({ name: "VSvgIcon", inheritAttrs: false, props: Zr(), setup(e, t2) {
    let { attrs: n2 } = t2;
    return () => k(e.tag, ye(n2, { style: null }), { default: () => [N("svg", { class: "v-icon__svg", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", role: "img", "aria-hidden": "true" }, [Array.isArray(e.icon) ? e.icon.map((s) => Array.isArray(s) ? N("path", { d: s[0], "fill-opacity": s[1] }, null) : N("path", { d: s }, null)) : N("path", { d: e.icon }, null)])] });
  } });
  Ds({ name: "VLigatureIcon", props: Zr(), setup(e) {
    return () => k(e.tag, null, { default: () => [e.icon] });
  } });
  var pc = Ds({ name: "VClassIcon", props: Zr(), setup(e) {
    return () => k(e.tag, { class: ie(e.icon) }, null);
  } });
  var Rh = (e) => {
    const t2 = Ie($i);
    if (!t2) throw new Error("Missing Vuetify Icons provide!");
    return { iconData: D(() => {
      const s = gt(e);
      if (!s) return { component: Zl };
      let r2 = s;
      if (typeof r2 == "string" && (r2 = r2.trim(), r2.startsWith("$") && (r2 = t2.aliases?.[r2.slice(1)])), Array.isArray(r2)) return { component: bo, icon: r2 };
      if (typeof r2 != "string") return { component: Zl, icon: r2 };
      const i2 = Object.keys(t2.sets).find((a2) => typeof r2 == "string" && r2.startsWith(`${a2}:`)), o = i2 ? r2.slice(i2.length + 1) : r2;
      return { component: t2.sets[i2 ?? t2.defaultSet].component, icon: o };
    }) };
  };
  var Bh = { collapse: "mdi-chevron-up", complete: "mdi-check", cancel: "mdi-close-circle", close: "mdi-close", delete: "mdi-close-circle", clear: "mdi-close-circle", success: "mdi-check-circle", info: "mdi-information", warning: "mdi-alert-circle", error: "mdi-close-circle", prev: "mdi-chevron-left", next: "mdi-chevron-right", checkboxOn: "mdi-checkbox-marked", checkboxOff: "mdi-checkbox-blank-outline", checkboxIndeterminate: "mdi-minus-box", delimiter: "mdi-circle", sortAsc: "mdi-arrow-up", sortDesc: "mdi-arrow-down", expand: "mdi-chevron-down", menu: "mdi-menu", subgroup: "mdi-menu-down", dropdown: "mdi-menu-down", radioOn: "mdi-radiobox-marked", radioOff: "mdi-radiobox-blank", edit: "mdi-pencil", ratingEmpty: "mdi-star-outline", ratingFull: "mdi-star", ratingHalf: "mdi-star-half-full", loading: "mdi-cached", first: "mdi-page-first", last: "mdi-page-last", unfold: "mdi-unfold-more-horizontal", file: "mdi-paperclip", plus: "mdi-plus", minus: "mdi-minus", calendar: "mdi-calendar", treeviewCollapse: "mdi-menu-down", treeviewExpand: "mdi-menu-right", tableGroupCollapse: "mdi-chevron-down", tableGroupExpand: "mdi-chevron-right", eyeDropper: "mdi-eyedropper", upload: "mdi-cloud-upload", color: "mdi-palette", command: "mdi-apple-keyboard-command", ctrl: "mdi-apple-keyboard-control", space: "mdi-keyboard-space", shift: "mdi-apple-keyboard-shift", alt: "mdi-apple-keyboard-option", enter: "mdi-keyboard-return", arrowup: "mdi-arrow-up", arrowdown: "mdi-arrow-down", arrowleft: "mdi-arrow-left", arrowright: "mdi-arrow-right", backspace: "mdi-backspace", play: "mdi-play", pause: "mdi-pause", fullscreen: "mdi-fullscreen", fullscreenExit: "mdi-fullscreen-exit", volumeHigh: "mdi-volume-high", volumeMedium: "mdi-volume-medium", volumeLow: "mdi-volume-low", volumeOff: "mdi-volume-variant-off", search: "mdi-magnify" };
  var Nh = { component: (e) => Yn(pc, { ...e, class: "mdi" }) };
  function Wh() {
    return { svg: { component: bo }, class: { component: pc } };
  }
  function zh(e) {
    const t2 = Wh(), n2 = e?.defaultSet ?? "mdi";
    return n2 === "mdi" && !t2.mdi && (t2.mdi = Nh), We({ defaultSet: n2, sets: t2, aliases: { ...Bh, vuetify: ["M8.2241 14.2009L12 21L22 3H14.4459L8.2241 14.2009Z", ["M7.26303 12.4733L7.00113 12L2 3H12.5261C12.5261 3 12.5261 3 12.5261 3L7.26303 12.4733Z", 0.6]], "vuetify-outline": "svg:M7.26 12.47 12.53 3H2L7.26 12.47ZM14.45 3 8.22 14.2 12 21 22 3H14.45ZM18.6 5 12 16.88 10.51 14.2 15.62 5ZM7.26 8.35 5.4 5H9.13L7.26 8.35Z", "vuetify-play": ["m6.376 13.184-4.11-7.192C1.505 4.66 2.467 3 4.003 3h8.532l-.953 1.576-.006.01-.396.677c-.429.732-.214 1.507.194 2.015.404.503 1.092.878 1.869.806a3.72 3.72 0 0 1 1.005.022c.276.053.434.143.523.237.138.146.38.635-.25 2.09-.893 1.63-1.553 1.722-1.847 1.677-.213-.033-.468-.158-.756-.406a4.95 4.95 0 0 1-.8-.927c-.39-.564-1.04-.84-1.66-.846-.625-.006-1.316.27-1.693.921l-.478.826-.911 1.506Z", ["M9.093 11.552c.046-.079.144-.15.32-.148a.53.53 0 0 1 .43.207c.285.414.636.847 1.046 1.2.405.35.914.662 1.516.754 1.334.205 2.502-.698 3.48-2.495l.014-.028.013-.03c.687-1.574.774-2.852-.005-3.675-.37-.391-.861-.586-1.333-.676a5.243 5.243 0 0 0-1.447-.044c-.173.016-.393-.073-.54-.257-.145-.18-.127-.316-.082-.392l.393-.672L14.287 3h5.71c1.536 0 2.499 1.659 1.737 2.992l-7.997 13.996c-.768 1.344-2.706 1.344-3.473 0l-3.037-5.314 1.377-2.278.004-.006.004-.007.481-.831Z", 0.6]] } }, e);
  }
  function Hs(e, t2) {
    let n2;
    function s() {
      n2 = ds(), n2.run(() => t2.length ? t2(() => {
        n2?.stop(), s();
      }) : t2());
    }
    oe(e, (r2) => {
      r2 && !n2 ? s() : r2 || (n2?.stop(), n2 = void 0);
    }, { immediate: true }), Ze(() => {
      n2?.stop();
    });
  }
  function Wt(e, t2, n2) {
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : (f2) => f2, r2 = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : (f2) => f2;
    const i2 = Re("useProxiedModel"), o = _e(e[t2] !== void 0 ? e[t2] : n2), l = gn(t2), c2 = D(l !== t2 ? () => (e[t2], !!((i2.vnode.props?.hasOwnProperty(t2) || i2.vnode.props?.hasOwnProperty(l)) && (i2.vnode.props?.hasOwnProperty(`onUpdate:${t2}`) || i2.vnode.props?.hasOwnProperty(`onUpdate:${l}`)))) : () => (e[t2], !!(i2.vnode.props?.hasOwnProperty(t2) && i2.vnode.props?.hasOwnProperty(`onUpdate:${t2}`))));
    Hs(() => !c2.value, () => {
      oe(() => e[t2], (f2) => {
        o.value = f2;
      });
    });
    const u = D({ get() {
      const f2 = e[t2];
      return s(c2.value ? f2 : o.value);
    }, set(f2) {
      const d = r2(f2), h2 = ue(c2.value ? e[t2] : o.value);
      h2 === d || s(h2) === f2 || (o.value = d, i2?.emit(`update:${t2}`, d));
    } });
    return Object.defineProperty(u, "externalValue", { get: () => c2.value ? e[t2] : o.value }), u;
  }
  var jh = { badge: "Badge", open: "Open", close: "Close", dismiss: "Dismiss", confirmEdit: { ok: "OK", cancel: "Cancel" }, dataIterator: { noResultsText: "No matching records found", loadingText: "Loading items..." }, dataTable: { itemsPerPageText: "Rows per page:", ariaLabel: { sortDescending: "Sorted descending.", sortAscending: "Sorted ascending.", sortNone: "Not sorted.", activateNone: "Activate to remove sorting.", activateDescending: "Activate to sort descending.", activateAscending: "Activate to sort ascending.", selectRow: "Select row", selectAll: "Select all", selectGroup: "Select group" }, sortBy: "Sort by" }, dataFooter: { itemsPerPageText: "Items per page:", itemsPerPageAll: "All", nextPage: "Next page", prevPage: "Previous page", firstPage: "First page", lastPage: "Last page", pageText: "{0}-{1} of {2}" }, dateRangeInput: { divider: "to" }, datePicker: { itemsSelected: "{0} selected", range: { title: "Select dates", header: "Enter dates" }, title: "Select date", header: "Enter date", input: { placeholder: "Enter date" }, ariaLabel: { previousMonth: "Previous month", nextMonth: "Next month", selectYear: "Select year", previousYear: "Previous year", nextYear: "Next year", selectMonth: "Select month", selectDate: "{0}", currentDate: "Today, {0}" } }, noDataText: "No data available", carousel: { prev: "Previous visual", next: "Next visual", ariaLabel: { delimiter: "Carousel slide {0} of {1}" } }, calendar: { moreEvents: "{0} more", today: "Today" }, input: { clear: "Clear {0}", prependAction: "{0} prepended action", appendAction: "{0} appended action", otp: "Please enter OTP character {0}" }, fileInput: { counter: "{0} files", counterSize: "{0} files ({1} in total)" }, fileUpload: { title: "Drag and drop files here", divider: "or", browse: "Browse Files" }, timePicker: { am: "AM", pm: "PM", title: "Select Time", hour: "Hour", minute: "Minute", second: "Second", notAllowed: "Value is not allowed" }, pagination: { ariaLabel: { root: "Pagination Navigation", next: "Next page", previous: "Previous page", page: "Go to page {0}", currentPage: "Page {0}, Current page", first: "First page", last: "Last page" } }, stepper: { next: "Next", prev: "Previous" }, rating: { ariaLabel: { item: "Rating {0} of {1}" } }, loading: "Loading...", infiniteScroll: { loadMore: "Load more", empty: "No more" }, rules: { required: "This field is required", email: "Please enter a valid email", number: "This field can only contain numbers", integer: "This field can only contain integer values", capital: "This field can only contain uppercase letters", maxLength: "You must enter a maximum of {0} characters", minLength: "You must enter a minimum of {0} characters", strictLength: "The length of the entered field is invalid", exclude: "The {0} character is not allowed", notEmpty: "Please choose at least one value", pattern: "Invalid format" }, command: { search: "Type a command or search..." }, hotkey: { then: "then", ctrl: "Ctrl", command: "Command", space: "Space", shift: "Shift", alt: "Alt", enter: "Enter", escape: "Escape", upArrow: "Up Arrow", downArrow: "Down Arrow", leftArrow: "Left Arrow", rightArrow: "Right Arrow", backspace: "Backspace", option: "Option", plus: "plus", shortcut: "Keyboard shortcut: {0}", or: "or" }, video: { play: "Play", pause: "Pause", seek: "Seek", volume: "Volume", showVolume: "Show volume control", mute: "Mute", unmute: "Unmute", enterFullscreen: "Full screen", exitFullscreen: "Exit full screen" }, colorPicker: { ariaLabel: { eyedropper: "Select color with eyedropper", hueSlider: "Hue", alphaSlider: "Alpha", redInput: "Red value", greenInput: "Green value", blueInput: "Blue value", alphaInput: "Alpha value", hueInput: "Hue value", saturationInput: "Saturation value", lightnessInput: "Lightness value", hexInput: "HEX value", hexaInput: "HEX with alpha value", changeFormat: "Change color format" } } };
  var ql = "$vuetify.";
  var Xl = (e, t2) => e.replace(/\{(\d+)\}/g, (n2, s) => String(t2[Number(s)]));
  var bc = (e, t2, n2) => function(s) {
    for (var r2 = arguments.length, i2 = new Array(r2 > 1 ? r2 - 1 : 0), o = 1; o < r2; o++) i2[o - 1] = arguments[o];
    if (!s.startsWith(ql)) return Xl(s, i2);
    const l = s.replace(ql, ""), a2 = e.value && n2.value[e.value], c2 = t2.value && n2.value[t2.value];
    let u = Al(a2, l, null);
    return u || (`${s}${e.value}`, u = Al(c2, l, null)), u || (u = s), typeof u != "string" && (u = s), Xl(u, i2);
  };
  function wo(e, t2) {
    return (n2, s) => new Intl.NumberFormat([e.value, t2.value], s).format(n2);
  }
  function wc(e, t2) {
    return wo(e, t2)(0.1).includes(",") ? "," : ".";
  }
  function mi(e, t2, n2) {
    const s = Wt(e, t2, e[t2] ?? n2.value);
    return s.value = e[t2] ?? n2.value, oe(n2, (r2) => {
      e[t2] == null && (s.value = n2.value);
    }), s;
  }
  function Cc(e) {
    return (t2) => {
      const n2 = mi(t2, "locale", e.current), s = mi(t2, "fallback", e.fallback), r2 = mi(t2, "messages", e.messages);
      return { name: "vuetify", current: n2, fallback: s, messages: r2, decimalSeparator: $(() => wc(n2, s)), t: bc(n2, s, r2), n: wo(n2, s), provide: Cc({ current: n2, fallback: s, messages: r2 }) };
    };
  }
  function Yh(e) {
    const t2 = le(e?.locale ?? "en"), n2 = le(e?.fallback ?? "en"), s = _e({ en: jh, ...e?.messages });
    return { name: "vuetify", current: t2, fallback: n2, messages: s, decimalSeparator: $(() => e?.decimalSeparator ?? wc(t2, n2)), t: bc(t2, n2, s), n: wo(t2, n2), provide: Cc({ current: t2, fallback: n2, messages: s }) };
  }
  var Lr = /* @__PURE__ */ Symbol.for("vuetify:locale");
  function Uh(e) {
    return e.name != null;
  }
  function Kh(e) {
    const t2 = e?.adapter && Uh(e?.adapter) ? e?.adapter : Yh(e), n2 = Zh(t2, e);
    return { ...t2, ...n2 };
  }
  function Co() {
    const e = Ie(Lr);
    if (!e) throw new Error("[Vuetify] Could not find injected locale instance");
    return e;
  }
  function Gh() {
    return { af: false, ar: true, bg: false, ca: false, ckb: false, cs: false, de: false, el: false, en: false, es: false, et: false, fa: true, fi: false, fr: false, hr: false, hu: false, he: true, id: false, it: false, ja: false, km: false, ko: false, lv: false, lt: false, nl: false, no: false, pl: false, pt: false, ro: false, ru: false, sk: false, sl: false, srCyrl: false, srLatn: false, sv: false, th: false, tr: false, az: false, uk: false, vi: false, zhHans: false, zhHant: false };
  }
  function Zh(e, t2) {
    const n2 = _e(t2?.rtl ?? Gh()), s = D(() => n2.value[e.current.value] ?? false);
    return { isRtl: s, rtl: n2, rtlClasses: $(() => `v-locale--is-${s.value ? "rtl" : "ltr"}`) };
  }
  function en() {
    const e = Ie(Lr);
    if (!e) throw new Error("[Vuetify] Could not find injected rtl instance");
    return { isRtl: e.isRtl, rtlClasses: e.rtlClasses };
  }
  function Fs(e) {
    const t2 = e.slice(-2).toUpperCase();
    switch (true) {
      case e === "GB-alt-variant":
        return { firstDay: 0, firstWeekSize: 4 };
      case e === "001":
        return { firstDay: 1, firstWeekSize: 1 };
      case `AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN JM JP KE
    KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PY SA SG SV TH TT TW UM US
    VE VI WS YE ZA ZW`.includes(t2):
        return { firstDay: 0, firstWeekSize: 1 };
      case `AI AL AM AR AU AZ BA BM BN BY CL CM CN CR CY EC GE HR KG KZ LB LK LV
    MD ME MK MN MY NZ RO RS SI TJ TM TR UA UY UZ VN XK`.includes(t2):
        return { firstDay: 1, firstWeekSize: 1 };
      case `AD AN AT AX BE BG CH CZ DE DK EE ES FI FJ FO FR GB GF GP GR HU IE IS
    IT LI LT LU MC MQ NL NO PL RE RU SE SK SM VA`.includes(t2):
        return { firstDay: 1, firstWeekSize: 4 };
      case "AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY".includes(t2):
        return { firstDay: 6, firstWeekSize: 1 };
      case t2 === "MV":
        return { firstDay: 5, firstWeekSize: 1 };
      case t2 === "PT":
        return { firstDay: 0, firstWeekSize: 4 };
      default:
        return null;
    }
  }
  function qh(e, t2, n2) {
    const s = [];
    let r2 = [];
    const i2 = Sc(e), o = xc(e), l = n2 ?? Fs(t2)?.firstDay ?? 0, a2 = (i2.getDay() - l + 7) % 7, c2 = (o.getDay() - l + 7) % 7;
    for (let u = 0; u < a2; u++) {
      const f2 = new Date(i2);
      f2.setDate(f2.getDate() - (a2 - u)), r2.push(f2);
    }
    for (let u = 1; u <= o.getDate(); u++) {
      const f2 = new Date(e.getFullYear(), e.getMonth(), u);
      r2.push(f2), r2.length === 7 && (s.push(r2), r2 = []);
    }
    for (let u = 1; u < 7 - c2; u++) {
      const f2 = new Date(o);
      f2.setDate(f2.getDate() + u), r2.push(f2);
    }
    return r2.length > 0 && s.push(r2), s;
  }
  function cs(e, t2, n2) {
    let s = (n2 ?? Fs(t2)?.firstDay ?? 0) % 7;
    [0, 1, 2, 3, 4, 5, 6].includes(s) || (s = 0);
    const r2 = new Date(e);
    for (; r2.getDay() !== s; ) r2.setDate(r2.getDate() - 1);
    return r2;
  }
  function Xh(e, t2) {
    const n2 = new Date(e), s = ((Fs(t2)?.firstDay ?? 0) + 6) % 7;
    for (; n2.getDay() !== s; ) n2.setDate(n2.getDate() + 1);
    return n2;
  }
  function Sc(e) {
    return new Date(e.getFullYear(), e.getMonth(), 1);
  }
  function xc(e) {
    return new Date(e.getFullYear(), e.getMonth() + 1, 0);
  }
  function Jh(e) {
    const t2 = e.split("-").map(Number);
    return new Date(t2[0], t2[1] - 1, t2[2]);
  }
  var Qh = /^([12]\d{3}-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[12]\d|3[01]))$/;
  function _c(e) {
    if (e == null) return /* @__PURE__ */ new Date();
    if (e instanceof Date) return e;
    if (typeof e == "string") {
      let t2;
      if (Qh.test(e)) return Jh(e);
      if (t2 = Date.parse(e), !isNaN(t2)) return new Date(t2);
    }
    return null;
  }
  var Jl = new Date(2e3, 0, 2);
  function em(e, t2, n2) {
    const s = t2 ?? Fs(e)?.firstDay ?? 0;
    return tc(7).map((r2) => {
      const i2 = new Date(Jl);
      return i2.setDate(Jl.getDate() + s + r2), new Intl.DateTimeFormat(e, { weekday: n2 ?? "narrow" }).format(i2);
    });
  }
  function tm(e, t2, n2, s) {
    const r2 = _c(e) ?? /* @__PURE__ */ new Date(), i2 = s?.[t2];
    if (typeof i2 == "function") return i2(r2, t2, n2);
    let o = {};
    switch (t2) {
      case "fullDate":
        o = { year: "numeric", month: "short", day: "numeric" };
        break;
      case "fullDateWithWeekday":
        o = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        break;
      case "normalDate":
        const l = r2.getDate(), a2 = new Intl.DateTimeFormat(n2, { month: "long" }).format(r2);
        return `${l} ${a2}`;
      case "normalDateWithWeekday":
        o = { weekday: "short", day: "numeric", month: "short" };
        break;
      case "shortDate":
        o = { month: "short", day: "numeric" };
        break;
      case "year":
        o = { year: "numeric" };
        break;
      case "month":
        o = { month: "long" };
        break;
      case "monthShort":
        o = { month: "short" };
        break;
      case "monthAndYear":
        o = { month: "long", year: "numeric" };
        break;
      case "monthAndDate":
        o = { month: "long", day: "numeric" };
        break;
      case "weekday":
        o = { weekday: "long" };
        break;
      case "weekdayShort":
        o = { weekday: "short" };
        break;
      case "dayOfMonth":
        return new Intl.NumberFormat(n2).format(r2.getDate());
      case "hours12h":
        o = { hour: "numeric", hour12: true };
        break;
      case "hours24h":
        o = { hour: "numeric", hour12: false };
        break;
      case "minutes":
        o = { minute: "numeric" };
        break;
      case "seconds":
        o = { second: "numeric" };
        break;
      case "fullTime":
        o = { hour: "numeric", minute: "numeric" };
        break;
      case "fullTime12h":
        o = { hour: "numeric", minute: "numeric", hour12: true };
        break;
      case "fullTime24h":
        o = { hour: "numeric", minute: "numeric", hour12: false };
        break;
      case "fullDateTime":
        o = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
        break;
      case "fullDateTime12h":
        o = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true };
        break;
      case "fullDateTime24h":
        o = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: false };
        break;
      case "keyboardDate":
        o = { year: "numeric", month: "2-digit", day: "2-digit" };
        break;
      case "keyboardDateTime":
        return o = { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric" }, new Intl.DateTimeFormat(n2, o).format(r2).replace(/, /g, " ");
      case "keyboardDateTime12h":
        return o = { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", hour12: true }, new Intl.DateTimeFormat(n2, o).format(r2).replace(/, /g, " ");
      case "keyboardDateTime24h":
        return o = { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", hour12: false }, new Intl.DateTimeFormat(n2, o).format(r2).replace(/, /g, " ");
      default:
        o = i2 ?? { timeZone: "UTC", timeZoneName: "short" };
    }
    return new Intl.DateTimeFormat(n2, o).format(r2);
  }
  function nm(e, t2) {
    const n2 = e.toJsDate(t2), s = n2.getFullYear(), r2 = Ml(String(n2.getMonth() + 1), 2, "0"), i2 = Ml(String(n2.getDate()), 2, "0");
    return `${s}-${r2}-${i2}`;
  }
  function sm(e) {
    const [t2, n2, s] = e.split("-").map(Number);
    return new Date(t2, n2 - 1, s);
  }
  function rm(e, t2) {
    const n2 = new Date(e);
    return n2.setMinutes(n2.getMinutes() + t2), n2;
  }
  function im(e, t2) {
    const n2 = new Date(e);
    return n2.setHours(n2.getHours() + t2), n2;
  }
  function bn(e, t2) {
    const n2 = new Date(e);
    return n2.setDate(n2.getDate() + t2), n2;
  }
  function om(e, t2) {
    const n2 = new Date(e);
    return n2.setDate(n2.getDate() + t2 * 7), n2;
  }
  function lm(e, t2) {
    const n2 = new Date(e);
    return n2.setDate(1), n2.setMonth(n2.getMonth() + t2), n2;
  }
  function Cs(e) {
    return e.getFullYear();
  }
  function am(e) {
    return e.getMonth();
  }
  function um(e, t2, n2, s) {
    const r2 = Fs(t2), i2 = n2 ?? r2?.firstDay ?? 0, o = r2?.firstWeekSize ?? 1;
    return s !== void 0 ? cm(e, t2, i2, s) : fm(e, t2, i2, o);
  }
  function cm(e, t2, n2, s) {
    const r2 = (7 + s - n2) % 7, i2 = cs(e, t2, n2), o = bn(i2, 6);
    function l(d) {
      return (7 + new Date(d, 0, 1).getDay() - n2) % 7;
    }
    let a2 = Cs(i2);
    a2 < Cs(o) && l(a2 + 1) <= r2 && a2++;
    const c2 = new Date(a2, 0, 1), u = l(a2), f2 = u <= r2 ? bn(c2, -u) : bn(c2, 7 - u);
    return 1 + kr(So(i2), Ss(f2), "weeks");
  }
  function fm(e, t2, n2, s) {
    const r2 = cs(e, t2, n2), i2 = bn(cs(e, t2, n2), 6);
    function o(f2) {
      const d = new Date(f2, 0, 1);
      return 7 - kr(d, cs(d, t2, n2), "days");
    }
    let l = Cs(r2);
    l < Cs(i2) && o(l + 1) >= s && l++;
    const a2 = new Date(l, 0, 1), c2 = o(l), u = c2 >= s ? bn(a2, c2 - 7) : bn(a2, c2);
    return 1 + kr(So(r2), Ss(u), "weeks");
  }
  function dm(e) {
    return e.getDate();
  }
  function vm(e) {
    return new Date(e.getFullYear(), e.getMonth() + 1, 1);
  }
  function hm(e) {
    return new Date(e.getFullYear(), e.getMonth() - 1, 1);
  }
  function mm(e) {
    return e.getHours();
  }
  function gm(e) {
    return e.getMinutes();
  }
  function ym(e) {
    return new Date(e.getFullYear(), 0, 1);
  }
  function pm(e) {
    return new Date(e.getFullYear(), 11, 31);
  }
  function bm(e, t2) {
    return Ar(e, t2[0]) && Sm(e, t2[1]);
  }
  function wm(e) {
    const t2 = new Date(e);
    return t2 instanceof Date && !isNaN(t2.getTime());
  }
  function Ar(e, t2) {
    return e.getTime() > t2.getTime();
  }
  function Cm(e, t2) {
    return Ar(Ss(e), Ss(t2));
  }
  function Sm(e, t2) {
    return e.getTime() < t2.getTime();
  }
  function Ql(e, t2) {
    return e.getTime() === t2.getTime();
  }
  function xm(e, t2) {
    return e.getDate() === t2.getDate() && e.getMonth() === t2.getMonth() && e.getFullYear() === t2.getFullYear();
  }
  function _m(e, t2) {
    return e.getMonth() === t2.getMonth() && e.getFullYear() === t2.getFullYear();
  }
  function Lm(e, t2) {
    return e.getFullYear() === t2.getFullYear();
  }
  function kr(e, t2, n2) {
    const s = new Date(e), r2 = new Date(t2);
    switch (n2) {
      case "years":
        return s.getFullYear() - r2.getFullYear();
      case "quarters":
        return Math.floor((s.getMonth() - r2.getMonth() + (s.getFullYear() - r2.getFullYear()) * 12) / 4);
      case "months":
        return s.getMonth() - r2.getMonth() + (s.getFullYear() - r2.getFullYear()) * 12;
      case "weeks":
        return Math.floor((s.getTime() - r2.getTime()) / (1e3 * 60 * 60 * 24 * 7));
      case "days":
        return Math.floor((s.getTime() - r2.getTime()) / (1e3 * 60 * 60 * 24));
      case "hours":
        return Math.floor((s.getTime() - r2.getTime()) / (1e3 * 60 * 60));
      case "minutes":
        return Math.floor((s.getTime() - r2.getTime()) / (1e3 * 60));
      case "seconds":
        return Math.floor((s.getTime() - r2.getTime()) / 1e3);
      default:
        return s.getTime() - r2.getTime();
    }
  }
  function Am(e, t2) {
    const n2 = new Date(e);
    return n2.setHours(t2), n2;
  }
  function km(e, t2) {
    const n2 = new Date(e);
    return n2.setMinutes(t2), n2;
  }
  function Tm(e, t2) {
    const n2 = new Date(e);
    return n2.setMonth(t2), n2;
  }
  function Em(e, t2) {
    const n2 = new Date(e);
    return n2.setDate(t2), n2;
  }
  function Mm(e, t2) {
    const n2 = new Date(e);
    return n2.setFullYear(t2), n2;
  }
  function Ss(e) {
    return new Date(e.getFullYear(), e.getMonth(), e.getDate(), 0, 0, 0, 0);
  }
  function So(e) {
    return new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59, 999);
  }
  var Vm = class {
    constructor(t2) {
      this.locale = t2.locale, this.formats = t2.formats;
    }
    date(t2) {
      return _c(t2);
    }
    toJsDate(t2) {
      return t2;
    }
    toISO(t2) {
      return nm(this, t2);
    }
    parseISO(t2) {
      return sm(t2);
    }
    addMinutes(t2, n2) {
      return rm(t2, n2);
    }
    addHours(t2, n2) {
      return im(t2, n2);
    }
    addDays(t2, n2) {
      return bn(t2, n2);
    }
    addWeeks(t2, n2) {
      return om(t2, n2);
    }
    addMonths(t2, n2) {
      return lm(t2, n2);
    }
    getWeekArray(t2, n2) {
      const s = n2 !== void 0 ? Number(n2) : void 0;
      return qh(t2, this.locale, s);
    }
    startOfWeek(t2, n2) {
      const s = n2 !== void 0 ? Number(n2) : void 0;
      return cs(t2, this.locale, s);
    }
    endOfWeek(t2) {
      return Xh(t2, this.locale);
    }
    startOfMonth(t2) {
      return Sc(t2);
    }
    endOfMonth(t2) {
      return xc(t2);
    }
    format(t2, n2) {
      return tm(t2, n2, this.locale, this.formats);
    }
    isEqual(t2, n2) {
      return Ql(t2, n2);
    }
    isValid(t2) {
      return wm(t2);
    }
    isWithinRange(t2, n2) {
      return bm(t2, n2);
    }
    isAfter(t2, n2) {
      return Ar(t2, n2);
    }
    isAfterDay(t2, n2) {
      return Cm(t2, n2);
    }
    isBefore(t2, n2) {
      return !Ar(t2, n2) && !Ql(t2, n2);
    }
    isSameDay(t2, n2) {
      return xm(t2, n2);
    }
    isSameMonth(t2, n2) {
      return _m(t2, n2);
    }
    isSameYear(t2, n2) {
      return Lm(t2, n2);
    }
    setMinutes(t2, n2) {
      return km(t2, n2);
    }
    setHours(t2, n2) {
      return Am(t2, n2);
    }
    setMonth(t2, n2) {
      return Tm(t2, n2);
    }
    setDate(t2, n2) {
      return Em(t2, n2);
    }
    setYear(t2, n2) {
      return Mm(t2, n2);
    }
    getDiff(t2, n2, s) {
      return kr(t2, n2, s);
    }
    getWeekdays(t2, n2) {
      const s = t2 !== void 0 ? Number(t2) : void 0;
      return em(this.locale, s, n2);
    }
    getYear(t2) {
      return Cs(t2);
    }
    getMonth(t2) {
      return am(t2);
    }
    getWeek(t2, n2, s) {
      const r2 = n2 !== void 0 ? Number(n2) : void 0, i2 = s !== void 0 ? Number(s) : void 0;
      return um(t2, this.locale, r2, i2);
    }
    getDate(t2) {
      return dm(t2);
    }
    getNextMonth(t2) {
      return vm(t2);
    }
    getPreviousMonth(t2) {
      return hm(t2);
    }
    getHours(t2) {
      return mm(t2);
    }
    getMinutes(t2) {
      return gm(t2);
    }
    startOfDay(t2) {
      return Ss(t2);
    }
    endOfDay(t2) {
      return So(t2);
    }
    startOfYear(t2) {
      return ym(t2);
    }
    endOfYear(t2) {
      return pm(t2);
    }
  };
  var Pm = /* @__PURE__ */ Symbol.for("vuetify:date-options");
  var ea = /* @__PURE__ */ Symbol.for("vuetify:date-adapter");
  function Im(e, t2) {
    const n2 = We({ adapter: Vm, locale: { af: "af-ZA", bg: "bg-BG", ca: "ca-ES", ckb: "", cs: "cs-CZ", de: "de-DE", el: "el-GR", en: "en-US", et: "et-EE", fa: "fa-IR", fi: "fi-FI", hr: "hr-HR", hu: "hu-HU", he: "he-IL", id: "id-ID", it: "it-IT", ja: "ja-JP", ko: "ko-KR", lv: "lv-LV", lt: "lt-LT", nl: "nl-NL", no: "no-NO", pl: "pl-PL", pt: "pt-PT", ro: "ro-RO", ru: "ru-RU", sk: "sk-SK", sl: "sl-SI", srCyrl: "sr-SP", srLatn: "sr-SP", sv: "sv-SE", th: "th-TH", tr: "tr-TR", az: "az-AZ", uk: "uk-UA", vi: "vi-VN", zhHans: "zh-CN", zhHant: "zh-TW" } }, e);
    return { options: n2, instance: Om(n2, t2) };
  }
  function Om(e, t2) {
    const n2 = $e(typeof e.adapter == "function" ? new e.adapter({ locale: e.locale[t2.current.value] ?? t2.current.value, formats: e.formats }) : e.adapter);
    return oe(t2.current, (s) => {
      n2.locale = e.locale[s] ?? s ?? n2.locale;
    }), n2;
  }
  var Ri = /* @__PURE__ */ Symbol.for("vuetify:display");
  var ta = { mobileBreakpoint: "lg", thresholds: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 } };
  var Dm = function() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ta;
    return We(ta, e);
  };
  function na(e) {
    return pe && !e ? window.innerWidth : typeof e == "object" && e.clientWidth || 0;
  }
  function sa(e) {
    return pe && !e ? window.innerHeight : typeof e == "object" && e.clientHeight || 0;
  }
  function ra(e) {
    const t2 = pe && !e ? window.navigator.userAgent : "ssr";
    function n2(b) {
      return !!t2.match(b);
    }
    const s = n2(/android/i), r2 = n2(/iphone|ipad|ipod/i), i2 = n2(/cordova/i), o = n2(/electron/i), l = n2(/chrome/i), a2 = n2(/edge/i), c2 = n2(/firefox/i), u = n2(/opera/i), f2 = n2(/win/i), d = n2(/mac/i), h2 = n2(/linux/i);
    return { android: s, ios: r2, cordova: i2, electron: o, chrome: l, edge: a2, firefox: c2, opera: u, win: f2, mac: d, linux: h2, touch: Gv, ssr: t2 === "ssr" };
  }
  function Hm(e, t2) {
    const { thresholds: n2, mobileBreakpoint: s } = Dm(e), r2 = le(sa(t2)), i2 = le(ra(t2)), o = $e({}), l = le(na(t2));
    function a2() {
      r2.value = sa(), l.value = na();
    }
    function c2() {
      a2(), i2.value = ra();
    }
    return Tt(() => {
      const u = l.value < n2.sm, f2 = l.value < n2.md && !u, d = l.value < n2.lg && !(f2 || u), h2 = l.value < n2.xl && !(d || f2 || u), b = l.value < n2.xxl && !(h2 || d || f2 || u), g = l.value >= n2.xxl, S = u ? "xs" : f2 ? "sm" : d ? "md" : h2 ? "lg" : b ? "xl" : "xxl", m = typeof s == "number" ? s : n2[s], w = l.value < m;
      o.xs = u, o.sm = f2, o.md = d, o.lg = h2, o.xl = b, o.xxl = g, o.smAndUp = !u, o.mdAndUp = !(u || f2), o.lgAndUp = !(u || f2 || d), o.xlAndUp = !(u || f2 || d || h2), o.smAndDown = !(d || h2 || b || g), o.mdAndDown = !(h2 || b || g), o.lgAndDown = !(b || g), o.xlAndDown = !g, o.name = S, o.height = r2.value, o.width = l.value, o.mobile = w, o.mobileBreakpoint = s, o.platform = i2.value, o.thresholds = n2;
    }), pe && (window.addEventListener("resize", a2, { passive: true }), Ze(() => {
      window.removeEventListener("resize", a2);
    }, true)), { ...nu(o), update: c2, ssr: !!t2 };
  }
  var Fm = K({ mobile: { type: Boolean, default: false }, mobileBreakpoint: [Number, String] }, "display");
  function Lc() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { mobile: null }, t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qt();
    const n2 = Ie(Ri);
    if (!n2) throw new Error("Could not find Vuetify display injection");
    const s = D(() => e.mobile ? true : typeof e.mobileBreakpoint == "number" ? n2.width.value < e.mobileBreakpoint : e.mobileBreakpoint ? n2.width.value < n2.thresholds.value[e.mobileBreakpoint] : e.mobile === null ? n2.mobile.value : false);
    return { ...n2, displayClasses: $(() => t2 ? { [`${t2}--mobile`]: s.value } : {}), mobile: s };
  }
  var Ac = /* @__PURE__ */ Symbol.for("vuetify:goto");
  function kc() {
    return { container: void 0, duration: 300, layout: false, offset: 0, easing: "easeInOutCubic", patterns: Hh };
  }
  function $m(e) {
    return xo(e) ?? (document.scrollingElement || document.body);
  }
  function xo(e) {
    return typeof e == "string" ? document.querySelector(e) : nc(e);
  }
  function gi(e, t2, n2) {
    if (typeof e == "number") return t2 && n2 ? -e : e;
    let s = xo(e), r2 = 0;
    for (; s; ) r2 += t2 ? s.offsetLeft : s.offsetTop, s = s.offsetParent;
    return r2;
  }
  function Rm(e, t2) {
    return { rtl: t2.isRtl, options: We(kc(), e) };
  }
  async function ia(e, t2, n2, s) {
    const r2 = n2 ? "scrollLeft" : "scrollTop", i2 = We(s?.options ?? kc(), t2), o = s?.rtl.value, l = (typeof e == "number" ? e : xo(e)) ?? 0, a2 = i2.container === "parent" && l instanceof HTMLElement ? l.parentElement : $m(i2.container), c2 = Nn() ? i2.patterns.instant : typeof i2.easing == "function" ? i2.easing : i2.patterns[i2.easing];
    if (!c2) throw new TypeError(`Easing function "${i2.easing}" not found.`);
    let u;
    if (typeof l == "number") u = gi(l, n2, o);
    else if (u = gi(l, n2, o) - gi(a2, n2, o), i2.layout) {
      const b = window.getComputedStyle(l).getPropertyValue("--v-layout-top");
      b && (u -= parseInt(b, 10));
    }
    u += i2.offset, u = Nm(a2, u, !!o, !!n2);
    const f2 = a2[r2] ?? 0;
    if (u === f2) return Promise.resolve(u);
    const d = performance.now();
    return new Promise((h2) => requestAnimationFrame(function b(g) {
      const m = (g - d) / i2.duration, w = Math.floor(f2 + (u - f2) * c2(Bt(m, 0, 1)));
      if (a2[r2] = w, m >= 1 && Math.abs(w - a2[r2]) < 10) return h2(u);
      if (m > 2) return h2(a2[r2]);
      requestAnimationFrame(b);
    }));
  }
  function Bm() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const t2 = Ie(Ac), { isRtl: n2 } = en();
    if (!t2) throw new Error("[Vuetify] Could not find injected goto instance");
    const s = { ...t2, rtl: $(() => t2.rtl.value || n2.value) };
    async function r2(i2, o) {
      return ia(i2, We(e, o), false, s);
    }
    return r2.horizontal = async (i2, o) => ia(i2, We(e, o), true, s), r2;
  }
  function Nm(e, t2, n2, s) {
    const { scrollWidth: r2, scrollHeight: i2 } = e, [o, l] = e === document.scrollingElement ? [window.innerWidth, window.innerHeight] : [e.offsetWidth, e.offsetHeight];
    let a2, c2;
    return s ? n2 ? (a2 = -(r2 - o), c2 = 0) : (a2 = 0, c2 = r2 - o) : (a2 = 0, c2 = i2 + -l), Bt(t2, a2, c2);
  }
  var xs = /* @__PURE__ */ Symbol.for("vuetify:theme");
  var qe = K({ theme: String }, "theme");
  function oa() {
    return { defaultTheme: "light", prefix: "v-", variations: { colors: [], lighten: 0, darken: 0 }, themes: { light: { dark: false, colors: { background: "#FFFFFF", surface: "#FFFFFF", "surface-bright": "#FFFFFF", "surface-light": "#EEEEEE", "surface-variant": "#424242", "on-surface-variant": "#EEEEEE", primary: "#1867C0", "primary-darken-1": "#1F5592", secondary: "#48A9A6", "secondary-darken-1": "#018786", error: "#B00020", info: "#2196F3", success: "#4CAF50", warning: "#FB8C00" }, variables: { "border-color": "#000000", "border-opacity": 0.12, "high-emphasis-opacity": 0.87, "medium-emphasis-opacity": 0.6, "disabled-opacity": 0.38, "idle-opacity": 0.04, "hover-opacity": 0.04, "focus-opacity": 0.12, "selected-opacity": 0.08, "activated-opacity": 0.12, "pressed-opacity": 0.12, "dragged-opacity": 0.08, "theme-kbd": "#EEEEEE", "theme-on-kbd": "#000000", "theme-code": "#F5F5F5", "theme-on-code": "#000000" } }, dark: { dark: true, colors: { background: "#121212", surface: "#212121", "surface-bright": "#ccbfd6", "surface-light": "#424242", "surface-variant": "#c8c8c8", "on-surface-variant": "#000000", primary: "#2196F3", "primary-darken-1": "#277CC1", secondary: "#54B6B2", "secondary-darken-1": "#48A9A6", error: "#CF6679", info: "#2196F3", success: "#4CAF50", warning: "#FB8C00" }, variables: { "border-color": "#FFFFFF", "border-opacity": 0.12, "high-emphasis-opacity": 1, "medium-emphasis-opacity": 0.7, "disabled-opacity": 0.5, "idle-opacity": 0.1, "hover-opacity": 0.04, "focus-opacity": 0.12, "selected-opacity": 0.08, "activated-opacity": 0.12, "pressed-opacity": 0.16, "dragged-opacity": 0.08, "theme-kbd": "#424242", "theme-on-kbd": "#FFFFFF", "theme-code": "#343434", "theme-on-code": "#CCCCCC" } } }, stylesheetId: "vuetify-theme-stylesheet", scoped: false, unimportant: false, utilities: true };
  }
  function Wm() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : oa();
    const t2 = oa();
    if (!e) return { ...t2, isDisabled: true };
    const n2 = {};
    for (const [s, r2] of Object.entries(e.themes ?? {})) {
      const i2 = r2.dark || s === "dark" ? t2.themes?.dark : t2.themes?.light;
      n2[s] = We(i2, r2);
    }
    return We(t2, { ...e, themes: n2 });
  }
  function un(e, t2, n2, s) {
    e.push(`${Um(t2, s)} {
`, ...n2.map((r2) => `  ${r2};
`), `}
`);
  }
  function la(e, t2) {
    const n2 = e.dark ? 2 : 1, s = e.dark ? 1 : 2, r2 = [];
    for (const [i2, o] of Object.entries(e.colors)) {
      const l = At(o);
      r2.push(`--${t2}theme-${i2}: ${l.r},${l.g},${l.b}`), i2.startsWith("on-") || r2.push(`--${t2}theme-${i2}-overlay-multiplier: ${Eh(o) > 0.18 ? n2 : s}`);
    }
    for (const [i2, o] of Object.entries(e.variables)) {
      const l = typeof o == "string" && o.startsWith("#") ? At(o) : void 0, a2 = l ? `${l.r}, ${l.g}, ${l.b}` : void 0;
      r2.push(`--${t2}${i2}: ${a2 ?? o}`);
    }
    return r2;
  }
  function zm(e, t2, n2) {
    const s = {};
    if (n2) for (const r2 of ["lighten", "darken"]) {
      const i2 = r2 === "lighten" ? kh : Th;
      for (const o of tc(n2[r2], 1)) s[`${e}-${r2}-${o}`] = _h(i2(At(t2), o));
    }
    return s;
  }
  function jm(e, t2) {
    if (!t2) return {};
    let n2 = {};
    for (const s of t2.colors) {
      const r2 = e[s];
      r2 && (n2 = { ...n2, ...zm(s, r2, t2) });
    }
    return n2;
  }
  function Ym(e) {
    const t2 = {};
    for (const n2 of Object.keys(e)) {
      if (n2.startsWith("on-") || e[`on-${n2}`]) continue;
      const s = `on-${n2}`, r2 = At(e[n2]);
      t2[s] = mc(r2);
    }
    return t2;
  }
  function Um(e, t2) {
    if (!t2) return e;
    const n2 = `:where(${t2})`;
    return e === ":root" ? n2 : `${n2} ${e}`;
  }
  function Km(e, t2, n2) {
    const s = Gm(e, t2);
    s && (s.innerHTML = n2);
  }
  function Gm(e, t2) {
    if (!pe) return null;
    let n2 = document.getElementById(e);
    return n2 || (n2 = document.createElement("style"), n2.id = e, n2.type = "text/css", t2 && n2.setAttribute("nonce", t2), document.head.appendChild(n2)), n2;
  }
  function Zm(e) {
    const t2 = Wm(e), n2 = le(t2.defaultTheme), s = _e(t2.themes), r2 = le("light"), i2 = D({ get() {
      return n2.value === "system" ? r2.value : n2.value;
    }, set(m) {
      n2.value = m;
    } }), o = D(() => {
      const m = {};
      for (const [w, C2] of Object.entries(s.value)) {
        const x = { ...C2.colors, ...jm(C2.colors, t2.variations) };
        m[w] = { ...C2, colors: { ...x, ...Ym(x) } };
      }
      return m;
    }), l = $(() => o.value[i2.value]), a2 = $(() => n2.value === "system"), c2 = D(() => {
      const m = [], w = t2.unimportant ? "" : " !important", C2 = t2.scoped ? t2.prefix : "";
      l.value?.dark && un(m, ":root", ["color-scheme: dark"], t2.scope), un(m, ":root", la(l.value, t2.prefix), t2.scope);
      for (const [M2, A2] of Object.entries(o.value)) un(m, `.${t2.prefix}theme--${M2}`, [`color-scheme: ${A2.dark ? "dark" : "normal"}`, ...la(A2, t2.prefix)], t2.scope);
      if (t2.utilities) {
        const M2 = [], A2 = [], L2 = new Set(Object.values(o.value).flatMap((p2) => Object.keys(p2.colors)));
        for (const p2 of L2) p2.startsWith("on-") ? un(A2, `.${p2}`, [`color: rgb(var(--${t2.prefix}theme-${p2}))${w}`], t2.scope) : (un(M2, `.${C2}bg-${p2}`, [`--${t2.prefix}theme-overlay-multiplier: var(--${t2.prefix}theme-${p2}-overlay-multiplier)`, `background-color: rgb(var(--${t2.prefix}theme-${p2}))${w}`, `color: rgb(var(--${t2.prefix}theme-on-${p2}))${w}`], t2.scope), un(A2, `.${C2}text-${p2}`, [`color: rgb(var(--${t2.prefix}theme-${p2}))${w}`], t2.scope), un(A2, `.${C2}border-${p2}`, [`--${t2.prefix}border-color: var(--${t2.prefix}theme-${p2})`], t2.scope));
        t2.layers ? m.push(`@layer background {
`, ...M2.map((p2) => `  ${p2}`), `}
`, `@layer foreground {
`, ...A2.map((p2) => `  ${p2}`), `}
`) : m.push(...M2, ...A2);
      }
      let x = m.map((M2, A2) => A2 === 0 ? M2 : `    ${M2}`).join("");
      return t2.layers && (x = `@layer vuetify.theme {
` + m.map((M2) => `  ${M2}`).join("") + `
}`), x;
    }), u = $(() => t2.isDisabled ? void 0 : `${t2.prefix}theme--${i2.value}`), f2 = $(() => Object.keys(o.value));
    if (Qu) {
      let w = function() {
        r2.value = m.matches ? "dark" : "light";
      };
      const m = window.matchMedia("(prefers-color-scheme: dark)");
      w(), m.addEventListener("change", w, { passive: true }), Ra() && Ze(() => {
        m.removeEventListener("change", w);
      });
    }
    function d(m) {
      if (t2.isDisabled) return;
      const w = m._context.provides.usehead;
      if (w) {
        let C2 = function() {
          return { style: [{ textContent: c2.value, id: t2.stylesheetId, nonce: t2.cspNonce || false }] };
        };
        if (w.push) {
          const x = w.push(C2);
          pe && oe(c2, () => {
            x.patch(C2);
          });
        } else pe ? (w.addHeadObjs($(C2)), Tt(() => w.updateDOM())) : w.addHeadObjs(C2());
      } else {
        let C2 = function() {
          Km(t2.stylesheetId, t2.cspNonce, c2.value);
        };
        pe ? oe(c2, C2, { immediate: true }) : C2();
      }
    }
    function h2(m) {
      m !== "system" && !f2.value.includes(m) || (i2.value = m);
    }
    function b() {
      let m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : f2.value;
      const w = m.indexOf(i2.value), C2 = w === -1 ? 0 : (w + 1) % m.length;
      h2(m[C2]);
    }
    function g() {
      let m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["light", "dark"];
      b(m);
    }
    const S = new Proxy(i2, { get(m, w) {
      return Reflect.get(m, w);
    }, set(m, w, C2) {
      return w === "value" && Kv(`theme.global.name.value = ${C2}`, `theme.change('${C2}')`), Reflect.set(m, w, C2);
    } });
    return { install: d, change: h2, cycle: b, toggle: g, isDisabled: t2.isDisabled, isSystem: a2, name: i2, themes: s, current: l, computedThemes: o, prefix: t2.prefix, themeClasses: u, styles: c2, global: { name: S, current: l } };
  }
  function Je(e) {
    Re("provideTheme");
    const t2 = Ie(xs, null);
    if (!t2) throw new Error("Could not find Vuetify theme injection");
    const n2 = $(() => e.theme ?? t2.name.value), i2 = { ...t2, name: n2, current: $(() => t2.themes.value[n2.value]), themeClasses: $(() => t2.isDisabled ? void 0 : `${t2.prefix}theme--${n2.value}`) };
    return Et(xs, i2), i2;
  }
  function qm() {
    Re("useTheme");
    const e = Ie(xs, null);
    if (!e) throw new Error("Could not find Vuetify theme injection");
    return e;
  }
  function _s(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "content";
    const n2 = Di(), s = _e();
    if (pe) {
      const r2 = new ResizeObserver((i2) => {
        e?.(i2, r2), i2.length && (t2 === "content" ? s.value = i2[0].contentRect : s.value = i2[0].target.getBoundingClientRect());
      });
      Jt(() => {
        r2.disconnect();
      }), oe(() => n2.el, (i2, o) => {
        o && (r2.unobserve(o), s.value = void 0), i2 && r2.observe(i2);
      }, { flush: "post" });
    }
    return { resizeRef: n2, contentRect: $n(s) };
  }
  var Bi = /* @__PURE__ */ Symbol.for("vuetify:layout");
  var Xm = /* @__PURE__ */ Symbol.for("vuetify:layout-item");
  var aa = 1e3;
  var Jm = K({ overlaps: { type: Array, default: () => [] }, fullHeight: Boolean }, "layout");
  var Qm = (e, t2, n2, s) => {
    let r2 = { top: 0, left: 0, right: 0, bottom: 0 };
    const i2 = [{ id: "", layer: { ...r2 } }];
    for (const o of e) {
      const l = t2.get(o), a2 = n2.get(o), c2 = s.get(o);
      if (!l || !a2 || !c2) continue;
      const u = { ...r2, [l.value]: parseInt(r2[l.value], 10) + (c2.value ? parseInt(a2.value, 10) : 0) };
      i2.push({ id: o, layer: u }), r2 = u;
    }
    return i2;
  };
  function eg(e) {
    const t2 = Ie(Bi, null), n2 = D(() => t2 ? t2.rootZIndex.value - 100 : aa), s = _e([]), r2 = $e(/* @__PURE__ */ new Map()), i2 = $e(/* @__PURE__ */ new Map()), o = $e(/* @__PURE__ */ new Map()), l = $e(/* @__PURE__ */ new Map()), a2 = $e(/* @__PURE__ */ new Map()), { resizeRef: c2, contentRect: u } = _s(), f2 = D(() => {
      const A2 = /* @__PURE__ */ new Map(), L2 = e.overlaps ?? [];
      for (const p2 of L2.filter((T) => T.includes(":"))) {
        const [T, H] = p2.split(":");
        if (!s.value.includes(T) || !s.value.includes(H)) continue;
        const Y = r2.get(T), I2 = r2.get(H), F2 = i2.get(T), z = i2.get(H);
        !Y || !I2 || !F2 || !z || (A2.set(H, { position: Y.value, amount: parseInt(F2.value, 10) }), A2.set(T, { position: I2.value, amount: -parseInt(z.value, 10) }));
      }
      return A2;
    }), d = D(() => {
      const A2 = [...new Set([...o.values()].map((p2) => p2.value))].sort((p2, T) => p2 - T), L2 = [];
      for (const p2 of A2) {
        const T = s.value.filter((H) => o.get(H)?.value === p2);
        L2.push(...T);
      }
      return Qm(L2, r2, i2, l);
    }), h2 = D(() => !Array.from(a2.values()).some((A2) => A2.value)), b = D(() => d.value[d.value.length - 1].layer), g = $(() => ({ "--v-layout-left": J(b.value.left), "--v-layout-right": J(b.value.right), "--v-layout-top": J(b.value.top), "--v-layout-bottom": J(b.value.bottom), ...h2.value ? void 0 : { transition: "none" } })), S = D(() => d.value.slice(1).map((A2, L2) => {
      let { id: p2 } = A2;
      const { layer: T } = d.value[L2], H = i2.get(p2), Y = r2.get(p2);
      return { id: p2, ...T, size: Number(H.value), position: Y.value };
    })), m = (A2) => S.value.find((L2) => L2.id === A2), w = Re("createLayout"), C2 = le(false);
    return Ln(() => {
      C2.value = true;
    }), Et(Bi, { register: (A2, L2) => {
      let { id: p2, order: T, position: H, layoutSize: Y, elementSize: I2, active: F2, disableTransitions: z, absolute: G2 } = L2;
      o.set(p2, T), r2.set(p2, H), i2.set(p2, Y), l.set(p2, F2), z && a2.set(p2, z);
      const q = In(Xm, w?.vnode).indexOf(A2);
      q > -1 ? s.value.splice(q, 0, p2) : s.value.push(p2);
      const te2 = D(() => S.value.findIndex((U2) => U2.id === p2)), Te = D(() => n2.value + d.value.length * 2 - te2.value * 2), de2 = D(() => {
        const U2 = H.value === "left" || H.value === "right", Z = H.value === "right", he = H.value === "bottom", vt2 = I2.value ?? Y.value, Qe = vt2 === 0 ? "%" : "px", ae2 = { [H.value]: 0, zIndex: Te.value, transform: `translate${U2 ? "X" : "Y"}(${(F2.value ? 0 : -(vt2 === 0 ? 100 : vt2)) * (Z || he ? -1 : 1)}${Qe})`, position: G2.value || n2.value !== aa ? "absolute" : "fixed", ...h2.value ? void 0 : { transition: "none" } };
        if (!C2.value) return ae2;
        const Ve = S.value[te2.value], kn = f2.value.get(p2);
        return kn && (Ve[kn.position] += kn.amount), { ...ae2, height: U2 ? `calc(100% - ${Ve.top}px - ${Ve.bottom}px)` : I2.value ? `${I2.value}px` : void 0, left: Z ? void 0 : `${Ve.left}px`, right: Z ? `${Ve.right}px` : void 0, top: H.value !== "bottom" ? `${Ve.top}px` : void 0, bottom: H.value !== "top" ? `${Ve.bottom}px` : void 0, width: U2 ? I2.value ? `${I2.value}px` : void 0 : `calc(100% - ${Ve.left}px - ${Ve.right}px)` };
      }), Ae = D(() => ({ zIndex: Te.value - 1 }));
      return { layoutItemStyles: de2, layoutItemScrimStyles: Ae, zIndex: Te };
    }, unregister: (A2) => {
      o.delete(A2), r2.delete(A2), i2.delete(A2), l.delete(A2), a2.delete(A2), s.value = s.value.filter((L2) => L2 !== A2);
    }, mainRect: b, mainStyles: g, getLayoutItem: m, items: S, layoutRect: u, rootZIndex: n2 }), { layoutClasses: $(() => ["v-layout", { "v-layout--full-height": e.fullHeight }]), layoutStyles: $(() => ({ zIndex: t2 ? n2.value : void 0, position: t2 ? "relative" : void 0, overflow: t2 ? "hidden" : void 0 })), getLayoutItem: m, items: S, layoutRect: u, layoutRef: c2 };
  }
  function Tc() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const { blueprint: t2, ...n2 } = e, s = We(t2, n2), { aliases: r2 = {}, components: i2 = {}, directives: o = {} } = s, l = ds();
    return l.run(() => {
      const a2 = Vh(s.defaults), c2 = Hm(s.display, s.ssr), u = Zm(s.theme), f2 = zh(s.icons), d = Kh(s.locale), h2 = Im(s.date, d), b = Rm(s.goTo, d);
      function g(m) {
        for (const C2 in o) m.directive(C2, o[C2]);
        for (const C2 in i2) m.component(C2, i2[C2]);
        for (const C2 in r2) m.component(C2, Ds({ ...r2[C2], name: C2, aliasName: r2[C2].name }));
        const w = ds();
        if (w.run(() => {
          u.install(m);
        }), m.onUnmount(() => w.stop()), m.provide(Wn, a2), m.provide(Ri, c2), m.provide(xs, u), m.provide($i, f2), m.provide(Lr, d), m.provide(Pm, h2.options), m.provide(ea, h2.instance), m.provide(Ac, b), pe && s.ssr) if (m.$nuxt) m.$nuxt.hook("app:suspense:resolve", () => {
          c2.update();
        });
        else {
          const { mount: C2 } = m;
          m.mount = function() {
            const x = C2(...arguments);
            return ct(() => c2.update()), m.mount = C2, x;
          };
        }
        m.mixin({ computed: { $vuetify() {
          return $e({ defaults: Vn.call(this, Wn), display: Vn.call(this, Ri), theme: Vn.call(this, xs), icons: Vn.call(this, $i), locale: Vn.call(this, Lr), date: Vn.call(this, ea) });
        } } });
      }
      function S() {
        l.stop();
      }
      return { install: g, unmount: S, defaults: a2, display: c2, theme: u, icons: f2, locale: d, date: h2, goTo: b };
    });
  }
  var tg = "3.13.2";
  Tc.version = tg;
  function Vn(e) {
    const t2 = this.$, n2 = t2.parent?.provides ?? t2.vnode.appContext?.provides;
    if (n2 && e in n2) return n2[e];
  }
  var ng = K({ ...ke(), ...Un(Jm(), ["fullHeight"]), ...qe() }, "VApp");
  var sg = ce()({ name: "VApp", props: ng(), setup(e, t2) {
    let { slots: n2 } = t2;
    const s = Je(e), { layoutClasses: r2, getLayoutItem: i2, items: o, layoutRef: l } = eg({ ...e, fullHeight: true }), { rtlClasses: a2 } = en();
    return Se(() => N("div", { ref: l, class: ie(["v-application", s.themeClasses.value, r2.value, a2.value, e.class]), style: ge([e.style]) }, [N("div", { class: "v-application__wrap" }, [n2.default?.()])])), { getLayoutItem: i2, items: o, theme: s };
  } });
  var He = K({ tag: { type: [String, Object, Function], default: "div" } }, "tag");
  var rg = K({ disabled: Boolean, group: Boolean, hideOnLeave: Boolean, leaveAbsolute: Boolean, mode: String, origin: String }, "transition");
  function lt(e, t2, n2) {
    return ce()({ name: e, props: rg({ mode: n2, origin: t2 }), setup(s, r2) {
      let { slots: i2 } = r2;
      const o = { onBeforeEnter(l) {
        s.origin && (l.style.transformOrigin = s.origin);
      }, onLeave(l) {
        if (s.leaveAbsolute) {
          const { offsetTop: a2, offsetLeft: c2, offsetWidth: u, offsetHeight: f2 } = l;
          l._transitionInitialStyles = { position: l.style.position, top: l.style.top, left: l.style.left, width: l.style.width, height: l.style.height }, l.style.position = "absolute", l.style.top = `${a2}px`, l.style.left = `${c2}px`, l.style.width = `${u}px`, l.style.height = `${f2}px`;
        }
        s.hideOnLeave && l.style.setProperty("display", "none", "important");
      }, onAfterLeave(l) {
        if (s.leaveAbsolute && l?._transitionInitialStyles) {
          const { position: a2, top: c2, left: u, width: f2, height: d } = l._transitionInitialStyles;
          delete l._transitionInitialStyles, l.style.position = a2 || "", l.style.top = c2 || "", l.style.left = u || "", l.style.width = f2 || "", l.style.height = d || "";
        }
      } };
      return () => {
        const l = s.group ? co : Sn;
        return Yn(l, { name: s.disabled ? "" : e, css: !s.disabled, ...s.group ? void 0 : { mode: s.mode }, ...s.disabled ? {} : o }, i2.default);
      };
    } });
  }
  function _o(e, t2) {
    let n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "in-out";
    return ce()({ name: e, props: { mode: { type: String, default: n2 }, disabled: { type: Boolean, default: Nn() }, group: Boolean, hideOnLeave: Boolean }, setup(s, r2) {
      let { slots: i2 } = r2;
      const o = s.group ? co : Sn;
      return () => Yn(o, { name: s.disabled ? "" : e, css: !s.disabled, ...s.disabled ? {} : { ...t2, onLeave: (l) => {
        s.hideOnLeave ? l.style.setProperty("display", "none", "important") : t2.onLeave?.(l);
      } } }, i2.default);
    } });
  }
  function Lo() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "y";
    return { onBeforeEnter(r2) {
      r2._parent = r2.parentNode, r2._initialStyle = { transition: r2.style.transition, overflow: r2.style.overflow, width: r2.style.width, height: r2.style.height };
    }, onEnter(r2) {
      const i2 = r2._initialStyle;
      if (!i2) return;
      r2.style.setProperty("transition", "none", "important"), r2.style.overflow = "hidden";
      const o = `${r2.offsetWidth}px`, l = `${r2.offsetHeight}px`;
      ["x", "both"].includes(t2) && (r2.style.width = "0"), ["y", "both"].includes(t2) && (r2.style.height = "0"), r2.offsetHeight, r2.style.transition = i2.transition, e && r2._parent && r2._parent.classList.add(e), requestAnimationFrame(() => {
        ["x", "both"].includes(t2) && (r2.style.width = o), ["y", "both"].includes(t2) && (r2.style.height = l);
      });
    }, onAfterEnter: s, onEnterCancelled: s, onLeave(r2) {
      r2._initialStyle = { transition: "", overflow: r2.style.overflow, width: r2.style.width, height: r2.style.height }, r2.style.overflow = "hidden", ["x", "both"].includes(t2) && (r2.style.width = `${r2.offsetWidth}px`), ["y", "both"].includes(t2) && (r2.style.height = `${r2.offsetHeight}px`), r2.offsetHeight, requestAnimationFrame(() => {
        ["x", "both"].includes(t2) && (r2.style.width = "0"), ["y", "both"].includes(t2) && (r2.style.height = "0");
      });
    }, onAfterLeave: n2, onLeaveCancelled: n2 };
    function n2(r2) {
      e && r2._parent && r2._parent.classList.remove(e), s(r2);
    }
    function s(r2) {
      if (!r2._initialStyle) return;
      const { width: i2, height: o } = r2._initialStyle;
      r2.style.overflow = r2._initialStyle.overflow, i2 != null && ["x", "both"].includes(t2) && (r2.style.width = i2), o != null && ["y", "both"].includes(t2) && (r2.style.height = o), delete r2._initialStyle;
    }
  }
  var ig = K({ target: [Object, Array] }, "v-dialog-transition");
  var yi = /* @__PURE__ */ new WeakMap();
  var og = ce()({ name: "VDialogTransition", props: ig(), setup(e, t2) {
    let { slots: n2 } = t2;
    const s = { onBeforeEnter(r2) {
      r2.style.pointerEvents = "none", r2.style.visibility = "hidden";
    }, async onEnter(r2, i2) {
      await new Promise((d) => requestAnimationFrame(d)), await new Promise((d) => requestAnimationFrame(d)), r2.style.visibility = "";
      const o = ca(e.target, r2), { x: l, y: a2, sx: c2, sy: u, speed: f2 } = o;
      if (yi.set(r2, o), Nn()) Gt(r2, [{ opacity: 0 }, {}], { duration: 125 * f2, easing: Kl }).finished.then(() => i2());
      else {
        const d = Gt(r2, [{ transform: `translate(${l}px, ${a2}px) scale(${c2}, ${u})`, opacity: 0 }, {}], { duration: 225 * f2, easing: Kl });
        ua(r2)?.forEach((h2) => {
          Gt(h2, [{ opacity: 0 }, { opacity: 0, offset: 0.33 }, {}], { duration: 225 * 2 * f2, easing: xr });
        }), d.finished.then(() => i2());
      }
    }, onAfterEnter(r2) {
      r2.style.removeProperty("pointer-events");
    }, onBeforeLeave(r2) {
      r2.style.pointerEvents = "none";
    }, async onLeave(r2, i2) {
      await new Promise((d) => requestAnimationFrame(d));
      let o;
      !yi.has(r2) || Array.isArray(e.target) || e.target.offsetParent || e.target.getClientRects().length ? o = ca(e.target, r2) : o = yi.get(r2);
      const { x: l, y: a2, sx: c2, sy: u, speed: f2 } = o;
      Nn() ? Gt(r2, [{}, { opacity: 0 }], { duration: 85 * f2, easing: Gl }).finished.then(() => i2()) : (Gt(r2, [{}, { transform: `translate(${l}px, ${a2}px) scale(${c2}, ${u})`, opacity: 0 }], { duration: 125 * f2, easing: Gl }).finished.then(() => i2()), ua(r2)?.forEach((h2) => {
        Gt(h2, [{}, { opacity: 0, offset: 0.2 }, { opacity: 0 }], { duration: 125 * 2 * f2, easing: xr });
      }));
    }, onAfterLeave(r2) {
      r2.style.removeProperty("pointer-events");
    } };
    return () => e.target ? k(Sn, ye({ name: "dialog-transition" }, s, { css: false }), n2) : k(Sn, { name: "dialog-transition" }, n2);
  } });
  function ua(e) {
    const t2 = e.querySelector(":scope > .v-card, :scope > .v-sheet, :scope > .v-list")?.children;
    return t2 && [...t2];
  }
  function ca(e, t2) {
    const n2 = ho(e), s = cc(t2), [r2, i2] = getComputedStyle(t2).transformOrigin.split(" ").map((m) => parseFloat(m)), [o, l] = getComputedStyle(t2).getPropertyValue("--v-overlay-anchor-origin").split(" ");
    let a2 = n2.left + n2.width / 2;
    o === "left" || l === "left" ? a2 -= n2.width / 2 : (o === "right" || l === "right") && (a2 += n2.width / 2);
    let c2 = n2.top + n2.height / 2;
    o === "top" || l === "top" ? c2 -= n2.height / 2 : (o === "bottom" || l === "bottom") && (c2 += n2.height / 2);
    const u = n2.width / s.width, f2 = n2.height / s.height, d = Math.max(1, u, f2), h2 = u / d || 0, b = f2 / d || 0, g = s.width * s.height / (window.innerWidth * window.innerHeight), S = g > 0.12 ? Math.min(1.5, (g - 0.12) * 10 + 1) : 1;
    return { x: a2 - (r2 + s.left), y: c2 - (i2 + s.top), sx: h2, sy: b, speed: S };
  }
  lt("fab-transition", "center center", "out-in");
  lt("dialog-bottom-transition");
  lt("dialog-top-transition");
  var fa = lt("fade-transition");
  var py = lt("scale-transition");
  lt("scroll-x-transition");
  lt("scroll-x-reverse-transition");
  lt("scroll-y-transition");
  lt("scroll-y-reverse-transition");
  lt("slide-x-transition");
  lt("slide-x-reverse-transition");
  var by = lt("slide-y-transition");
  lt("slide-y-reverse-transition");
  _o("expand-transition", Lo());
  var lg = _o("expand-x-transition", Lo("", "x"));
  _o("expand-both-transition", Lo("", "both"));
  var ag = K({ defaults: Object, disabled: Boolean, reset: [Number, String], root: [Boolean, String], scoped: Boolean }, "VDefaultsProvider");
  var Xe = ce(false)({ name: "VDefaultsProvider", props: ag(), setup(e, t2) {
    let { slots: n2 } = t2;
    const { defaults: s, disabled: r2, reset: i2, root: o, scoped: l } = nu(e);
    return Os(s, { reset: i2, root: o, scoped: l, disabled: r2 }), () => n2.default?.();
  } });
  var $s = K({ height: [Number, String], maxHeight: [Number, String], maxWidth: [Number, String], minHeight: [Number, String], minWidth: [Number, String], width: [Number, String] }, "dimension");
  function Rs(e) {
    return { dimensionStyles: D(() => {
      const n2 = {}, s = J(e.height), r2 = J(e.maxHeight), i2 = J(e.maxWidth), o = J(e.minHeight), l = J(e.minWidth), a2 = J(e.width);
      return s != null && (n2.height = s), r2 != null && (n2.maxHeight = r2), i2 != null && (n2.maxWidth = i2), o != null && (n2.minHeight = o), l != null && (n2.minWidth = l), a2 != null && (n2.width = a2), n2;
    }) };
  }
  function ug(e) {
    return { aspectStyles: D(() => {
      const t2 = Number(e.aspectRatio);
      return t2 ? { paddingBottom: String(1 / t2 * 100) + "%" } : void 0;
    }) };
  }
  var Ec = K({ aspectRatio: [String, Number], contentClass: null, inline: Boolean, ...ke(), ...$s() }, "VResponsive");
  var da = ce()({ name: "VResponsive", props: Ec(), setup(e, t2) {
    let { slots: n2 } = t2;
    const { aspectStyles: s } = ug(e), { dimensionStyles: r2 } = Rs(e);
    return Se(() => N("div", { class: ie(["v-responsive", { "v-responsive--inline": e.inline }, e.class]), style: ge([r2.value, e.style]) }, [N("div", { class: "v-responsive__sizer", style: ge(s.value) }, null), n2.additional?.(), n2.default && N("div", { class: ie(["v-responsive__content", e.contentClass]) }, [n2.default()])])), {};
  } });
  function Ao(e) {
    return vo(() => {
      const { class: t2, style: n2 } = fg(e);
      return { colorClasses: t2, colorStyles: n2 };
    });
  }
  function xn(e) {
    const { colorClasses: t2, colorStyles: n2 } = Ao(() => ({ text: gt(e) }));
    return { textColorClasses: t2, textColorStyles: n2 };
  }
  function wn(e) {
    const { colorClasses: t2, colorStyles: n2 } = Ao(() => ({ background: gt(e) }));
    return { backgroundColorClasses: t2, backgroundColorStyles: n2 };
  }
  function cg(e) {
    return { text: typeof e.text == "string" ? e.text.replace(/^text-/, "") : e.text, background: typeof e.background == "string" ? e.background.replace(/^bg-/, "") : e.background };
  }
  function fg(e) {
    const t2 = cg(gt(e)), n2 = [], s = {};
    if (t2.background) if (Fi(t2.background)) {
      if (s.backgroundColor = t2.background, !t2.text && Sh(t2.background)) {
        const r2 = At(t2.background);
        if (r2.a == null || r2.a === 1) {
          const i2 = mc(r2);
          s.color = i2, s.caretColor = i2;
        }
      }
    } else n2.push(`bg-${t2.background}`);
    return t2.text && (Fi(t2.text) ? (s.color = t2.text, s.caretColor = t2.text) : n2.push(`text-${t2.text}`)), { class: n2, style: s };
  }
  var tn = K({ rounded: { type: [Boolean, Number, String], default: void 0 }, tile: Boolean }, "rounded");
  function nn(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qt();
    return { roundedClasses: D(() => {
      const s = Ee(e) ? e.value : e.rounded, r2 = Ee(e) ? false : e.tile, i2 = [];
      if (r2 || s === false) i2.push("rounded-0");
      else if (s === true || s === "") i2.push(`${t2}--rounded`);
      else if (typeof s == "string" || s === 0) for (const o of String(s).split(" ")) i2.push(`rounded-${o}`);
      return i2;
    }) };
  }
  var Mc = K({ transition: { type: null, default: "fade-transition", validator: (e) => e !== true } }, "transition");
  var On = (e, t2) => {
    let { slots: n2 } = t2;
    const { transition: s, disabled: r2, group: i2, target: o, ...l } = e, { component: a2 = i2 ? co : Sn, ...c2 } = br(s) ? s : {};
    let u;
    return br(s) ? u = ye(c2, rh({ disabled: r2, group: i2, target: o }), l) : u = ye({ name: r2 || !s ? "" : s }, l), Yn(a2, u, n2);
  };
  function va(e, t2) {
    if (!fo) return;
    const n2 = t2.modifiers || {}, s = t2.value, { handler: r2, options: i2 } = typeof s == "object" ? s : { handler: s, options: {} }, o = new IntersectionObserver(function() {
      let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], a2 = arguments.length > 1 ? arguments[1] : void 0;
      const c2 = e._observe?.[t2.instance.$.uid];
      if (!c2) return;
      const u = l.some((f2) => f2.isIntersecting);
      r2 && (!n2.quiet || c2.init) && (!n2.once || u || c2.init) && r2(u, l, a2), u && n2.once ? Ni(e, t2) : c2.init = true;
    }, i2);
    e._observe = Object(e._observe), e._observe[t2.instance.$.uid] = { init: false, observer: o }, o.observe(e);
  }
  function Ni(e, t2) {
    const n2 = e._observe?.[t2.instance.$.uid];
    n2 && (n2.observer.unobserve(e), delete e._observe[t2.instance.$.uid]);
  }
  var ha = { mounted: va, unmounted: Ni, updated: (e, t2) => {
    e._observe?.[t2.instance.$.uid] && (Ni(e, t2), va(e, t2));
  } };
  var dg = K({ absolute: Boolean, alt: String, cover: Boolean, color: String, draggable: { type: [Boolean, String], default: void 0 }, eager: Boolean, gradient: String, imageClass: null, lazySrc: String, options: { type: Object, default: () => ({ root: void 0, rootMargin: void 0, threshold: void 0 }) }, sizes: String, src: { type: [String, Object], default: "" }, crossorigin: String, referrerpolicy: String, srcset: String, position: String, ...Ec(), ...ke(), ...tn(), ...Mc() }, "VImg");
  var ko = ce()({ name: "VImg", directives: { vIntersect: ha }, props: dg(), emits: { loadstart: (e) => true, load: (e) => true, error: (e) => true }, setup(e, t2) {
    let { emit: n2, slots: s } = t2;
    const { backgroundColorClasses: r2, backgroundColorStyles: i2 } = wn(() => e.color), { roundedClasses: o } = nn(e), l = Re("VImg"), a2 = le(""), c2 = _e(), u = le(e.eager ? "loading" : "idle"), f2 = le(), d = le();
    let h2 = false;
    const b = D(() => e.src && typeof e.src == "object" ? { src: e.src.src, srcset: e.srcset || e.src.srcset, lazySrc: e.lazySrc || e.src.lazySrc, aspect: Number(e.aspectRatio || e.src.aspect || 0) } : { src: e.src, srcset: e.srcset, lazySrc: e.lazySrc, aspect: Number(e.aspectRatio || 0) }), g = D(() => b.value.aspect || f2.value / d.value || 0);
    oe(() => e.src, () => {
      S(u.value !== "idle");
    }), oe(g, (F2, z) => {
      !F2 && z && c2.value && M2(c2.value);
    }), oe(c2, (F2) => {
      !F2 || u.value === "idle" || (g.value || M2(F2), C2(F2), h2 && (h2 = false, n2("load", F2.currentSrc || b.value.src)));
    }), wu(() => S());
    function S(F2) {
      if (!(e.eager && F2) && !(fo && !F2 && !e.eager)) {
        if (u.value = "loading", b.value.lazySrc) {
          const z = new Image();
          z.src = b.value.lazySrc, M2(z, null);
        }
        b.value.src && ct(() => {
          n2("loadstart", c2.value?.currentSrc || b.value.src), setTimeout(() => {
            if (!l.isUnmounted) if (c2.value?.complete) {
              if (c2.value.naturalWidth || w(), u.value === "error") return;
              g.value || M2(c2.value, null), u.value === "loading" && m();
            } else c2.value && (g.value || M2(c2.value), C2(c2.value));
          });
        });
      }
    }
    function m() {
      l.isUnmounted || (c2.value ? (C2(c2.value), M2(c2.value), n2("load", c2.value.currentSrc || b.value.src)) : h2 = true, u.value = "loaded");
    }
    function w() {
      l.isUnmounted || (u.value = "error", n2("error", c2.value?.currentSrc || b.value.src));
    }
    function C2(F2) {
      a2.value = F2.currentSrc || F2.src;
    }
    let x = -1;
    Jt(() => {
      clearTimeout(x);
    });
    function M2(F2) {
      let z = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
      const G2 = () => {
        if (clearTimeout(x), l.isUnmounted) return;
        const { naturalHeight: re2, naturalWidth: q } = F2;
        re2 || q ? (f2.value = q, d.value = re2) : !F2.complete && u.value === "loading" && z != null ? x = window.setTimeout(G2, z) : (F2.currentSrc.endsWith(".svg") || F2.currentSrc.startsWith("data:image/svg+xml")) && (f2.value = 1, d.value = 1);
      };
      G2();
    }
    const A2 = $(() => ({ "v-img__img--cover": e.cover, "v-img__img--contain": !e.cover })), L2 = () => {
      if (!b.value.src || u.value === "idle") return null;
      const F2 = N("img", { class: ie(["v-img__img", A2.value, e.imageClass]), style: { objectPosition: e.position }, crossorigin: e.crossorigin, src: b.value.src, srcset: b.value.srcset, alt: e.alt, referrerpolicy: e.referrerpolicy, draggable: e.draggable, sizes: e.sizes, ref: c2, onLoad: m, onError: w }, null), z = s.sources?.();
      return k(On, { transition: e.transition, appear: true }, { default: () => [Rt(z ? N("picture", { class: "v-img__picture" }, [z, F2]) : F2, [[Gr, u.value === "loaded"]])] });
    }, p2 = () => k(On, { transition: e.transition }, { default: () => [b.value.lazySrc && u.value !== "loaded" && N("img", { class: ie(["v-img__img", "v-img__img--preload", A2.value]), style: { objectPosition: e.position }, crossorigin: e.crossorigin, src: b.value.lazySrc, alt: e.alt, referrerpolicy: e.referrerpolicy, draggable: e.draggable }, null)] }), T = () => s.placeholder ? k(On, { transition: e.transition, appear: true }, { default: () => [(u.value === "loading" || u.value === "error" && !s.error) && N("div", { class: "v-img__placeholder" }, [s.placeholder()])] }) : null, H = () => s.error ? k(On, { transition: e.transition, appear: true }, { default: () => [u.value === "error" && N("div", { class: "v-img__error" }, [s.error()])] }) : null, Y = () => e.gradient ? N("div", { class: "v-img__gradient", style: { backgroundImage: `linear-gradient(${e.gradient})` } }, null) : null, I2 = le(false);
    {
      const F2 = oe(g, (z) => {
        z && (requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            I2.value = true;
          });
        }), F2());
      });
    }
    return Se(() => {
      const F2 = da.filterProps(e);
      return Rt(k(da, ye({ class: ["v-img", { "v-img--absolute": e.absolute, "v-img--booting": !I2.value, "v-img--fit-content": e.width === "fit-content" }, r2.value, o.value, e.class], style: [{ width: J(e.width === "auto" ? f2.value : e.width) }, i2.value, e.style] }, F2, { aspectRatio: g.value, "aria-label": e.alt, role: e.alt ? "img" : void 0 }), { additional: () => N(Me, null, [k(L2, null, null), k(p2, null, null), k(Y, null, null), k(T, null, null), k(H, null, null)]), default: s.default }), [[ha, { handler: S, options: e.options }, null, { once: true }]]);
    }), { currentSrc: a2, image: c2, state: u, naturalWidth: f2, naturalHeight: d };
  } });
  var Bs = K({ border: [Boolean, Number, String] }, "border");
  function Ns(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qt();
    return { borderClasses: D(() => {
      const s = e.border;
      return s === true || s === "" ? `${t2}--border` : typeof s == "string" || s === 0 ? String(s).split(" ").map((r2) => `border-${r2}`) : [];
    }) };
  }
  var Ws = K({ elevation: { type: [Number, String], validator(e) {
    const t2 = parseInt(e);
    return !isNaN(t2) && t2 >= 0 && t2 <= 24;
  } } }, "elevation");
  function zs(e) {
    return { elevationClasses: $(() => {
      const n2 = Ee(e) ? e.value : e.elevation;
      return n2 == null ? [] : [`elevation-${n2}`];
    }) };
  }
  var ma = { center: "center", top: "bottom", bottom: "top", left: "right", right: "left" };
  var qr = K({ location: String }, "location");
  function Xr(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, n2 = arguments.length > 2 ? arguments[2] : void 0;
    const { isRtl: s } = en();
    return { locationStyles: D(() => {
      if (!e.location) return {};
      const { side: i2, align: o } = Hi(e.location.split(" ").length > 1 ? e.location : `${e.location} center`, s.value);
      function l(c2) {
        return n2 ? n2(c2) : 0;
      }
      const a2 = {};
      return i2 !== "center" && (t2 ? a2[ma[i2]] = `calc(100% - ${l(i2)}px)` : a2[i2] = 0), o !== "center" ? t2 ? a2[ma[o]] = `calc(100% - ${l(o)}px)` : a2[o] = 0 : (i2 === "center" ? a2.top = a2.left = "50%" : a2[{ top: "left", bottom: "left", left: "top", right: "top" }[i2]] = "50%", a2.transform = { top: "translateX(-50%)", bottom: "translateX(-50%)", left: "translateY(-50%)", right: "translateY(-50%)", center: "translate(-50%, -50%)" }[i2]), a2;
    }) };
  }
  function vg() {
    const e = le(false);
    return Ln(() => {
      window.requestAnimationFrame(() => {
        e.value = true;
      });
    }), { ssrBootStyles: $(() => e.value ? void 0 : { transition: "none !important" }), isBooted: $n(e) };
  }
  var hg = [null, "default", "comfortable", "compact"];
  var zt = K({ density: { type: String, default: "default", validator: (e) => hg.includes(e) } }, "density");
  function sn(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qt();
    return { densityClasses: $(() => `${t2}--density-${e.density}`) };
  }
  var mg = ["x-small", "small", "default", "large", "x-large"];
  var Kn = K({ size: { type: [String, Number], default: "default" } }, "size");
  function js(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qt();
    return vo(() => {
      const n2 = e.size;
      let s, r2;
      return wr(mg, n2) ? s = `${t2}--size-${n2}` : n2 && (r2 = { width: J(n2), height: J(n2) }), { sizeClasses: s, sizeStyles: r2 };
    });
  }
  var gg = ["elevated", "flat", "tonal", "outlined", "text", "plain"];
  function Ys(e, t2) {
    return N(Me, null, [e && N("span", { key: "overlay", class: ie(`${t2}__overlay`) }, null), N("span", { key: "underlay", class: ie(`${t2}__underlay`) }, null)]);
  }
  var An = K({ color: String, variant: { type: String, default: "elevated", validator: (e) => gg.includes(e) } }, "variant");
  function Us(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qt();
    const n2 = $(() => {
      const { variant: i2 } = gt(e);
      return `${t2}--variant-${i2}`;
    }), { colorClasses: s, colorStyles: r2 } = Ao(() => {
      const { variant: i2, color: o } = gt(e);
      return { [["elevated", "flat"].includes(i2) ? "background" : "text"]: o };
    });
    return { colorClasses: s, colorStyles: r2, variantClasses: n2 };
  }
  var Vc = K({ baseColor: String, divided: Boolean, direction: { type: String, default: "horizontal" }, ...Bs(), ...ke(), ...zt(), ...Ws(), ...tn(), ...Kn({ size: void 0 }), ...He(), ...qe(), ...An() }, "VBtnGroup");
  var ga = ce()({ name: "VBtnGroup", props: Vc(), setup(e, t2) {
    let { slots: n2 } = t2;
    const { themeClasses: s } = Je(e), { densityClasses: r2 } = sn(e), { borderClasses: i2 } = Ns(e), { elevationClasses: o } = zs(e), { roundedClasses: l } = nn(e);
    Os({ VBtn: { height: $(() => e.direction === "horizontal" && e.size == null ? "auto" : null), baseColor: $(() => e.baseColor), color: $(() => e.color), density: $(() => e.density), flat: true, size: $(() => e.size), variant: $(() => e.variant) } }), Se(() => k(e.tag, { class: ie(["v-btn-group", `v-btn-group--${e.direction}`, { "v-btn-group--divided": e.divided, "v-btn-group--has-size": e.size != null }, s.value, i2.value, r2.value, o.value, l.value, e.class]), style: ge(e.style) }, n2));
  } });
  var To = K({ modelValue: { type: null, default: void 0 }, multiple: Boolean, mandatory: [Boolean, String], max: Number, selectedClass: String, disabled: Boolean }, "group");
  var Eo = K({ value: null, disabled: Boolean, selectedClass: String }, "group-item");
  function Tr(e, t2) {
    let n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    const s = Re("useGroupItem");
    if (!s) throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
    const r2 = gu();
    Et(/* @__PURE__ */ Symbol.for(`${t2.description}:id`), r2);
    const i2 = Ie(t2, null);
    if (!i2) {
      if (!n2) return i2;
      throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${t2.description}`);
    }
    const o = $(() => e.value), l = D(() => !!(i2.disabled.value || e.disabled));
    function a2() {
      i2?.register({ id: r2, value: o, disabled: l }, s);
    }
    function c2() {
      i2?.unregister(r2);
    }
    a2(), Jt(() => c2());
    const u = D(() => i2.isSelected(r2)), f2 = D(() => i2.items.value[0].id === r2), d = D(() => i2.items.value[i2.items.value.length - 1].id === r2), h2 = D(() => u.value && [i2.selectedClass.value, e.selectedClass]);
    return oe(u, (b) => {
      s.emit("group:selected", { value: b });
    }, { flush: "sync" }), { id: r2, isSelected: u, isFirst: f2, isLast: d, toggle: () => i2.select(r2, !u.value), select: (b) => i2.select(r2, b), selectedClass: h2, value: o, disabled: l, group: i2, register: a2, unregister: c2 };
  }
  function Jr(e, t2) {
    let n2 = false;
    const s = $e([]), r2 = Wt(e, "modelValue", [], (d) => d === void 0 ? [] : Pc(s, d === null ? [null] : Jv(d)), (d) => {
      const h2 = pg(s, d);
      return e.multiple ? h2 : h2[0];
    }), i2 = Re("useGroup");
    function o(d, h2) {
      const b = d, g = /* @__PURE__ */ Symbol.for(`${t2.description}:id`), m = In(g, i2?.vnode).indexOf(h2);
      Zt(b.value) === void 0 && (b.value = m, b.useIndexAsValue = true), m > -1 ? s.splice(m, 0, b) : s.push(b);
    }
    function l(d) {
      if (n2) return;
      a2();
      const h2 = s.findIndex((b) => b.id === d);
      s.splice(h2, 1);
    }
    function a2() {
      const d = s.find((h2) => !h2.disabled);
      d && e.mandatory === "force" && !r2.value.length && (r2.value = [d.id]);
    }
    Ln(() => {
      a2();
    }), Jt(() => {
      n2 = true;
    }), io(() => {
      for (let d = 0; d < s.length; d++) s[d].useIndexAsValue && (s[d].value = d);
    });
    function c2(d, h2) {
      const b = s.find((g) => g.id === d);
      if (!(h2 && b?.disabled)) if (e.multiple) {
        const g = r2.value.slice(), S = g.findIndex((w) => w === d), m = ~S;
        if (h2 = h2 ?? !m, m && e.mandatory && g.length <= 1 || !m && e.max != null && g.length + 1 > e.max) return;
        S < 0 && h2 ? g.push(d) : S >= 0 && !h2 && g.splice(S, 1), r2.value = g;
      } else {
        const g = r2.value.includes(d);
        if (e.mandatory && g || !g && !h2) return;
        r2.value = h2 ?? !g ? [d] : [];
      }
    }
    function u(d) {
      if (e.multiple, r2.value.length) {
        const h2 = r2.value[0], b = s.findIndex((m) => m.id === h2);
        let g = (b + d) % s.length, S = s[g];
        for (; S.disabled && g !== b; ) g = (g + d) % s.length, S = s[g];
        if (S.disabled) return;
        r2.value = [s[g].id];
      } else {
        const h2 = s.find((b) => !b.disabled);
        h2 && (r2.value = [h2.id]);
      }
    }
    const f2 = { register: o, unregister: l, selected: r2, select: c2, disabled: $(() => e.disabled), prev: () => u(s.length - 1), next: () => u(1), isSelected: (d) => r2.value.includes(d), selectedClass: $(() => e.selectedClass), items: $(() => s), getItemIndex: (d) => yg(s, d) };
    return Et(t2, f2), f2;
  }
  function yg(e, t2) {
    const n2 = Pc(e, [t2]);
    return n2.length ? e.findIndex((s) => s.id === n2[0]) : -1;
  }
  function Pc(e, t2) {
    const n2 = [];
    return t2.forEach((s) => {
      const r2 = e.find((o) => pn(s, o.value)), i2 = e[s];
      r2?.value !== void 0 ? n2.push(r2.id) : i2?.useIndexAsValue && n2.push(i2.id);
    }), n2;
  }
  function pg(e, t2) {
    const n2 = [];
    return t2.forEach((s) => {
      const r2 = e.findIndex((i2) => i2.id === s);
      if (~r2) {
        const i2 = e[r2];
        n2.push(i2.value !== void 0 ? i2.value : r2);
      }
    }), n2;
  }
  var Ic = /* @__PURE__ */ Symbol.for("vuetify:v-btn-toggle");
  var bg = K({ ...Vc(), ...To() }, "VBtnToggle");
  ce()({ name: "VBtnToggle", props: bg(), emits: { "update:modelValue": (e) => true }, setup(e, t2) {
    let { slots: n2 } = t2;
    const { isSelected: s, next: r2, prev: i2, select: o, selected: l } = Jr(e, Ic);
    return Se(() => {
      const a2 = ga.filterProps(e);
      return k(ga, ye({ class: ["v-btn-toggle", e.class] }, a2, { style: e.style }), { default: () => [n2.default?.({ isSelected: s, next: r2, prev: i2, select: o, selected: l })] });
    }), { next: r2, prev: i2, select: o };
  } });
  var wg = K({ color: String, disabled: Boolean, start: Boolean, end: Boolean, icon: ze, opacity: [String, Number], ...ke(), ...Kn(), ...He({ tag: "i" }), ...qe() }, "VIcon");
  var it = ce()({ name: "VIcon", props: wg(), setup(e, t2) {
    let { attrs: n2, slots: s } = t2;
    const r2 = le(), { themeClasses: i2 } = qm(), { iconData: o } = Rh(() => r2.value || e.icon), { sizeClasses: l } = js(e), { textColorClasses: a2, textColorStyles: c2 } = xn(() => e.color);
    return Se(() => {
      const u = s.default?.();
      u && (r2.value = oc(u).filter((d) => d.type === Vs && d.children && typeof d.children == "string")[0]?.children);
      const f2 = !!(n2.onClick || n2.onClickOnce);
      return k(o.value.component, { tag: e.tag, icon: o.value.icon, class: ie(["v-icon", "notranslate", i2.value, l.value, a2.value, { "v-icon--clickable": f2, "v-icon--disabled": e.disabled, "v-icon--start": e.start, "v-icon--end": e.end }, e.class]), style: ge([{ "--v-icon-opacity": e.opacity }, l.value ? void 0 : { fontSize: J(e.size), height: J(e.size), width: J(e.size) }, c2.value, e.style]), role: f2 ? "button" : void 0, "aria-hidden": !f2, tabindex: f2 ? e.disabled ? -1 : 0 : void 0 }, { default: () => [u] });
    }), {};
  } });
  function Oc(e, t2) {
    const n2 = _e(), s = le(false);
    if (fo) {
      const r2 = new IntersectionObserver((i2) => {
        s.value = !!i2.find((o) => o.isIntersecting);
      }, t2);
      Ze(() => {
        r2.disconnect();
      }), oe(n2, (i2, o) => {
        o && (r2.unobserve(o), s.value = false), i2 && r2.observe(i2);
      }, { flush: "post" });
    }
    return { intersectionRef: n2, isIntersecting: s };
  }
  var Cg = K({ reveal: { type: [Boolean, Object], default: false } }, "reveal");
  function Sg(e) {
    const n2 = $(() => typeof e.reveal == "object" ? Math.max(0, Number(e.reveal.duration ?? 900)) : 900), s = le(e.reveal ? "initial" : "disabled");
    return Ln(async () => {
      e.reveal && (s.value = "initial", await new Promise((r2) => requestAnimationFrame(r2)), s.value = "pending", await new Promise((r2) => setTimeout(r2, n2.value)), s.value = "done");
    }), { duration: n2, state: s };
  }
  var xg = K({ bgColor: String, color: String, indeterminate: [Boolean, String], rounded: Boolean, modelValue: { type: [Number, String], default: 0 }, rotate: { type: [Number, String], default: 0 }, width: { type: [Number, String], default: 4 }, ...ke(), ...Cg(), ...Kn(), ...He({ tag: "div" }), ...qe() }, "VProgressCircular");
  var Dc = ce()({ name: "VProgressCircular", props: xg(), setup(e, t2) {
    let { slots: n2 } = t2;
    const s = 20, r2 = 2 * Math.PI * s, i2 = _e(), { themeClasses: o } = Je(e), { sizeClasses: l, sizeStyles: a2 } = js(e), { textColorClasses: c2, textColorStyles: u } = xn(() => e.color), { textColorClasses: f2, textColorStyles: d } = xn(() => e.bgColor), { intersectionRef: h2, isIntersecting: b } = Oc(), { resizeRef: g, contentRect: S } = _s(), { state: m, duration: w } = Sg(e), C2 = $(() => m.value === "initial" ? 0 : Bt(parseFloat(e.modelValue), 0, 100)), x = $(() => Number(e.width)), M2 = $(() => a2.value ? Number(e.size) : S.value ? S.value.width : Math.max(x.value, 32)), A2 = $(() => s / (1 - x.value / M2.value) * 2), L2 = $(() => x.value / M2.value * A2.value), p2 = $(() => {
      const H = (100 - C2.value) / 100 * r2;
      return e.rounded && C2.value > 0 && C2.value < 100 ? J(Math.min(r2 - 0.01, H + L2.value)) : J(H);
    }), T = D(() => {
      const H = Number(e.rotate);
      return e.rounded ? H + L2.value / 2 / r2 * 360 : H;
    });
    return Tt(() => {
      h2.value = i2.value, g.value = i2.value;
    }), Se(() => k(e.tag, { ref: i2, class: ie(["v-progress-circular", { "v-progress-circular--indeterminate": !!e.indeterminate, "v-progress-circular--visible": b.value, "v-progress-circular--disable-shrink": e.indeterminate && (e.indeterminate === "disable-shrink" || Nn()), "v-progress-circular--revealing": ["initial", "pending"].includes(m.value) }, o.value, l.value, c2.value, e.class]), style: ge([a2.value, u.value, { "--progress-reveal-duration": `${w.value}ms` }, e.style]), role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": e.indeterminate ? void 0 : C2.value }, { default: () => [N("svg", { style: { transform: `rotate(calc(-90deg + ${T.value}deg))` }, xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${A2.value} ${A2.value}` }, [N("circle", { class: ie(["v-progress-circular__underlay", f2.value]), style: ge(d.value), fill: "transparent", cx: "50%", cy: "50%", r: s, "stroke-width": L2.value, "stroke-dasharray": r2, "stroke-dashoffset": 0 }, null), N("circle", { class: "v-progress-circular__overlay", fill: "transparent", cx: "50%", cy: "50%", r: s, "stroke-width": L2.value, "stroke-dasharray": r2, "stroke-dashoffset": p2.value, "stroke-linecap": e.rounded ? "round" : void 0 }, null)]), n2.default && N("div", { class: "v-progress-circular__content" }, [n2.default({ value: C2.value })])] })), {};
  } });
  var _g = K({ chunkCount: { type: [Number, String], default: null }, chunkWidth: { type: [Number, String], default: null }, chunkGap: { type: [Number, String], default: 4 } }, "chunks");
  function Lg(e, t2) {
    const n2 = $(() => !!e.chunkCount || !!e.chunkWidth), s = D(() => {
      const l = gt(t2);
      if (!l) return 0;
      if (!e.chunkCount) return Number(e.chunkWidth);
      const a2 = Number(e.chunkCount);
      return (l - Number(e.chunkGap) * (a2 - 1)) / a2;
    }), r2 = $(() => Number(e.chunkGap)), i2 = D(() => {
      if (!n2.value) return {};
      const l = J(r2.value), a2 = J(s.value);
      return { maskRepeat: "repeat-x", maskImage: `linear-gradient(90deg, #000, #000 ${a2}, transparent ${a2}, transparent)`, maskSize: `calc(${a2} + ${l}) 100%` };
    });
    function o(l) {
      const a2 = gt(t2);
      if (!a2) return l;
      const c2 = 100 * r2.value / a2, u = 100 * (s.value + r2.value) / a2, f2 = Math.floor((l + c2) / u + 1e-9);
      return Bt(f2 * u - c2 / 2, 0, 100);
    }
    return { hasChunks: n2, chunksMaskStyles: i2, snapValueToChunk: o };
  }
  var Ag = K({ absolute: Boolean, active: { type: Boolean, default: true }, bgColor: String, bgOpacity: [Number, String], bufferValue: { type: [Number, String], default: 0 }, bufferColor: String, bufferOpacity: [Number, String], clickable: Boolean, color: String, height: { type: [Number, String], default: 4 }, indeterminate: Boolean, max: { type: [Number, String], default: 100 }, modelValue: { type: [Number, String], default: 0 }, opacity: [Number, String], reverse: Boolean, stream: Boolean, striped: Boolean, roundedBar: Boolean, ..._g(), ...ke(), ...qr({ location: "top" }), ...tn(), ...He(), ...qe() }, "VProgressLinear");
  var kg = ce()({ name: "VProgressLinear", props: Ag(), emits: { "update:modelValue": (e) => true }, setup(e, t2) {
    let { slots: n2 } = t2;
    const s = _e(), r2 = Wt(e, "modelValue"), { isRtl: i2, rtlClasses: o } = en(), { themeClasses: l } = Je(e), { locationStyles: a2 } = Xr(e), { textColorClasses: c2, textColorStyles: u } = xn(() => e.color), { backgroundColorClasses: f2, backgroundColorStyles: d } = wn(() => e.bgColor || e.color), { backgroundColorClasses: h2, backgroundColorStyles: b } = wn(() => e.bufferColor || e.bgColor || e.color), { backgroundColorClasses: g, backgroundColorStyles: S } = wn(() => e.color), { roundedClasses: m } = nn(e), { intersectionRef: w, isIntersecting: C2 } = Oc(), x = D(() => parseFloat(e.max)), M2 = D(() => parseFloat(e.height)), A2 = D(() => Bt(parseFloat(e.bufferValue) / x.value * 100, 0, 100)), L2 = D(() => Bt(parseFloat(r2.value) / x.value * 100, 0, 100)), p2 = D(() => i2.value !== e.reverse), T = D(() => e.indeterminate ? "fade-transition" : "slide-x-transition"), H = le(0), { hasChunks: Y, chunksMaskStyles: I2, snapValueToChunk: F2 } = Lg(e, H);
    Hs(Y, () => {
      const { resizeRef: q } = _s((te2) => H.value = te2[0].contentRect.width);
      Tt(() => q.value = s.value);
    });
    const z = D(() => Y.value ? F2(A2.value) : A2.value), G2 = D(() => Y.value ? F2(L2.value) : L2.value);
    function re2(q) {
      if (!w.value) return;
      const { left: te2, right: Te, width: de2 } = w.value.getBoundingClientRect(), Ae = p2.value ? de2 - q.clientX + (Te - de2) : q.clientX - te2;
      r2.value = Math.round(Ae / de2 * x.value);
    }
    return Tt(() => {
      w.value = s.value;
    }), Se(() => k(e.tag, { ref: s, class: ie(["v-progress-linear", { "v-progress-linear--absolute": e.absolute, "v-progress-linear--active": e.active && C2.value, "v-progress-linear--reverse": p2.value, "v-progress-linear--rounded": e.rounded, "v-progress-linear--rounded-bar": e.roundedBar, "v-progress-linear--striped": e.striped, "v-progress-linear--clickable": e.clickable }, m.value, l.value, o.value, e.class]), style: ge([{ bottom: e.location === "bottom" ? 0 : void 0, top: e.location === "top" ? 0 : void 0, height: e.active ? J(M2.value) : 0, "--v-progress-linear-height": J(M2.value), ...e.absolute ? a2.value : {} }, I2.value, e.style]), role: "progressbar", "aria-hidden": e.active ? "false" : "true", "aria-valuemin": "0", "aria-valuemax": e.max, "aria-valuenow": e.indeterminate ? void 0 : Math.min(parseFloat(r2.value), x.value), onClick: e.clickable && re2 }, { default: () => [e.stream && N("div", { key: "stream", class: ie(["v-progress-linear__stream", c2.value]), style: { ...u.value, [p2.value ? "left" : "right"]: J(-M2.value), borderTop: `${J(M2.value / 2)} dotted`, opacity: e.bufferOpacity != null ? parseFloat(e.bufferOpacity) : void 0, top: `calc(50% - ${J(M2.value / 4)})`, width: J(100 - A2.value, "%"), "--v-progress-linear-stream-to": J(M2.value * (p2.value ? 1 : -1)) } }, null), N("div", { class: ie(["v-progress-linear__background", f2.value]), style: ge([d.value, { opacity: e.bgOpacity != null ? parseFloat(e.bgOpacity) : void 0, width: e.stream ? 0 : void 0 }]) }, null), N("div", { class: ie(["v-progress-linear__buffer", h2.value]), style: ge([b.value, { opacity: e.bufferOpacity != null ? parseFloat(e.bufferOpacity) : void 0, width: J(z.value, "%") }]) }, null), k(Sn, { name: T.value }, { default: () => [e.indeterminate ? N("div", { class: "v-progress-linear__indeterminate" }, [["long", "short"].map((q) => N("div", { key: q, class: ie(["v-progress-linear__indeterminate", q, g.value]), style: ge(S.value) }, null))]) : N("div", { class: ie(["v-progress-linear__determinate", g.value]), style: ge([S.value, { width: J(G2.value, "%") }]) }, null)] }), n2.default && N("div", { class: "v-progress-linear__content" }, [n2.default({ value: L2.value, buffer: A2.value })])] })), {};
  } });
  var Hc = K({ loading: [Boolean, String] }, "loader");
  function Fc(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qt();
    return { loaderClasses: $(() => ({ [`${t2}--loading`]: e.loading })) };
  }
  function Tg(e, t2) {
    let { slots: n2 } = t2;
    return N("div", { class: ie(`${e.name}__loader`) }, [n2.default?.({ color: e.color, isActive: e.active }) || k(kg, { absolute: e.absolute, active: e.active, color: e.color, height: "2", indeterminate: true }, null)]);
  }
  var Eg = ["static", "relative", "fixed", "absolute", "sticky"];
  var Mo = K({ position: { type: String, validator: (e) => Eg.includes(e) } }, "position");
  function Vo(e) {
    let t2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qt();
    return { positionClasses: $(() => e.position ? `${t2}--${e.position}` : void 0) };
  }
  function Mg() {
    const e = Re("useRoute");
    return D(() => e?.proxy?.$route);
  }
  function Vg() {
    return Re("useRouter")?.proxy?.$router;
  }
  function Po(e, t2) {
    const n2 = _d("RouterLink"), s = $(() => !!(e.href || e.to)), r2 = D(() => s?.value || Pl(t2, "click") || Pl(e, "click"));
    if (typeof n2 == "string" || !("useLink" in n2)) {
      const f2 = $(() => e.href);
      return { isLink: s, isRouterLink: $(() => false), isClickable: r2, href: f2, linkProps: $e({ href: f2 }), route: $(() => {
      }), navigate: $(() => {
      }) };
    }
    const i2 = n2.useLink({ to: $(() => e.to || ""), replace: $(() => e.replace) }), o = D(() => e.to ? i2 : void 0), l = Mg(), a2 = D(() => o.value ? e.exact ? l.value ? o.value.isExactActive?.value && pn(o.value.route.value.query, l.value.query) : o.value.isExactActive?.value ?? false : o.value.isActive?.value ?? false : false), c2 = D(() => e.to ? o.value?.route.value.href : e.href);
    return { isLink: s, isRouterLink: $(() => !!e.to), isClickable: r2, isActive: a2, route: $(() => o.value?.route.value), navigate: $(() => o.value?.navigate), href: c2, linkProps: $e({ href: c2, "aria-current": $(() => a2.value ? "page" : void 0), "aria-disabled": $(() => e.disabled && s.value ? "true" : void 0), tabindex: $(() => e.disabled && s.value ? "-1" : void 0) }) };
  }
  var Io = K({ href: String, replace: Boolean, to: [String, Object], exact: Boolean }, "router");
  var pi = false;
  function Pg(e, t2) {
    let n2 = false, s, r2;
    pe && e?.beforeEach && (ct(() => {
      window.addEventListener("popstate", i2), s = e.beforeEach(() => pi ? n2 ? t2() : void 0 : (pi = true, new Promise((o) => {
        setTimeout(() => o(n2 ? t2() : void 0));
      }))), r2 = e?.afterEach(() => {
        pi = false;
      });
    }), Ze(() => {
      window.removeEventListener("popstate", i2), s?.(), r2?.();
    }));
    function i2(o) {
      o.state?.replaced || (n2 = true, setTimeout(() => n2 = false));
    }
  }
  function Ig(e, t2) {
    oe(() => e.isActive?.value, (n2) => {
      e.isLink.value && n2 != null && t2 && ct(() => {
        t2(n2);
      });
    }, { immediate: true });
  }
  var Wi = /* @__PURE__ */ Symbol("rippleStop");
  var Og = 80;
  function ya(e, t2) {
    e.style.transform = t2, e.style.webkitTransform = t2;
  }
  function zi(e) {
    return e.constructor.name === "TouchEvent";
  }
  function $c(e) {
    return e.constructor.name === "KeyboardEvent";
  }
  var Dg = function(e, t2) {
    let n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, s = 0, r2 = 0;
    if (!$c(e)) {
      const f2 = new rt(t2), d = zi(e) ? e.touches[e.touches.length - 1] : e, h2 = ho([d.clientX, d.clientY]);
      s = h2.x - f2.left, r2 = h2.y - f2.top;
    }
    let i2 = 0, o = 0.3;
    t2._ripple?.circle ? (o = 0.15, i2 = t2.clientWidth / 2, i2 = n2.center ? i2 : i2 + Math.sqrt((s - i2) ** 2 + (r2 - i2) ** 2) / 4) : i2 = Math.sqrt(t2.clientWidth ** 2 + t2.clientHeight ** 2) / 2;
    const l = `${(t2.clientWidth - i2 * 2) / 2}px`, a2 = `${(t2.clientHeight - i2 * 2) / 2}px`, c2 = n2.center ? l : `${s - i2}px`, u = n2.center ? a2 : `${r2 - i2}px`;
    return { radius: i2, scale: o, x: c2, y: u, centerX: l, centerY: a2 };
  };
  var Er = { show(e, t2) {
    let n2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!t2?._ripple?.enabled) return;
    const s = document.createElement("span"), r2 = document.createElement("span");
    s.appendChild(r2), s.className = "v-ripple__container", n2.class && (s.className += ` ${n2.class}`);
    const { radius: i2, scale: o, x: l, y: a2, centerX: c2, centerY: u } = Dg(e, t2, n2), f2 = `${i2 * 2}px`;
    r2.className = "v-ripple__animation", r2.style.width = f2, r2.style.height = f2, t2.appendChild(s);
    const d = window.getComputedStyle(t2);
    d && d.position === "static" && (t2.style.position = "relative", t2.dataset.previousPosition = "static"), r2.classList.add("v-ripple__animation--enter"), r2.classList.add("v-ripple__animation--visible"), ya(r2, `translate(${l}, ${a2}) scale3d(${o},${o},${o})`), r2.dataset.activated = String(performance.now()), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        r2.classList.remove("v-ripple__animation--enter"), r2.classList.add("v-ripple__animation--in"), ya(r2, `translate(${c2}, ${u}) scale3d(1,1,1)`);
      });
    });
  }, hide(e) {
    if (!e?._ripple?.enabled) return;
    const t2 = e.getElementsByClassName("v-ripple__animation");
    if (t2.length === 0) return;
    const n2 = Array.from(t2).findLast((i2) => !i2.dataset.isHiding);
    if (n2) n2.dataset.isHiding = "true";
    else return;
    const s = performance.now() - Number(n2.dataset.activated), r2 = Math.max(250 - s, 0);
    setTimeout(() => {
      n2.classList.remove("v-ripple__animation--in"), n2.classList.add("v-ripple__animation--out"), setTimeout(() => {
        e.getElementsByClassName("v-ripple__animation").length === 1 && e.dataset.previousPosition && (e.style.position = e.dataset.previousPosition, delete e.dataset.previousPosition), n2.parentNode?.parentNode === e && e.removeChild(n2.parentNode);
      }, 300);
    }, r2);
  } };
  function Rc(e) {
    return typeof e > "u" || !!e;
  }
  function Ls(e) {
    const t2 = {}, n2 = e.currentTarget;
    if (!(!n2?._ripple || n2._ripple.touched || e[Wi])) {
      if (e[Wi] = true, zi(e)) n2._ripple.touched = true, n2._ripple.isTouch = true;
      else if (n2._ripple.isTouch) return;
      if (t2.center = n2._ripple.centered || $c(e), n2._ripple.class && (t2.class = n2._ripple.class), zi(e)) {
        if (n2._ripple.showTimerCommit) return;
        n2._ripple.showTimerCommit = () => {
          Er.show(e, n2, t2);
        }, n2._ripple.showTimer = window.setTimeout(() => {
          n2?._ripple?.showTimerCommit && (n2._ripple.showTimerCommit(), n2._ripple.showTimerCommit = null);
        }, Og);
      } else Er.show(e, n2, t2);
    }
  }
  function Mr(e) {
    e[Wi] = true;
  }
  function tt(e) {
    const t2 = e.currentTarget;
    if (t2?._ripple) {
      if (window.clearTimeout(t2._ripple.showTimer), e.type === "touchend" && t2._ripple.showTimerCommit) {
        t2._ripple.showTimerCommit(), t2._ripple.showTimerCommit = null, t2._ripple.showTimer = window.setTimeout(() => {
          tt(e);
        });
        return;
      }
      window.setTimeout(() => {
        t2._ripple && (t2._ripple.touched = false);
      }), Er.hide(t2);
    }
  }
  function Bc(e) {
    const t2 = e.currentTarget;
    t2?._ripple && (t2._ripple.showTimerCommit && (t2._ripple.showTimerCommit = null), window.clearTimeout(t2._ripple.showTimer));
  }
  var As = false;
  function Hg(e, t2) {
    !As && t2.includes(e.key) && (As = true, Ls(e));
  }
  function Nc(e) {
    As = false, tt(e);
  }
  function Wc(e) {
    As && (As = false, tt(e));
  }
  function zc(e, t2, n2) {
    const { value: s, modifiers: r2 } = t2, i2 = Rc(s);
    i2 || Er.hide(e), e._ripple = e._ripple ?? {}, e._ripple.enabled = i2, e._ripple.centered = r2.center, e._ripple.circle = r2.circle;
    const o = br(s) ? s : {};
    o.class && (e._ripple.class = o.class);
    const l = o.keys ?? ["Enter", "Space"];
    if (e._ripple.keyDownHandler = (a2) => Hg(a2, l), i2 && !n2) {
      if (r2.stop) {
        e.addEventListener("touchstart", Mr, { passive: true }), e.addEventListener("mousedown", Mr);
        return;
      }
      e.addEventListener("touchstart", Ls, { passive: true }), e.addEventListener("touchend", tt, { passive: true }), e.addEventListener("touchmove", Bc, { passive: true }), e.addEventListener("touchcancel", tt), e.addEventListener("mousedown", Ls), e.addEventListener("mouseup", tt), e.addEventListener("mouseleave", tt), e.addEventListener("keydown", e._ripple.keyDownHandler), e.addEventListener("keyup", Nc), e.addEventListener("blur", Wc), e.addEventListener("dragstart", tt, { passive: true });
    } else !i2 && n2 && jc(e);
  }
  function jc(e) {
    e.removeEventListener("touchstart", Mr), e.removeEventListener("mousedown", Mr), e.removeEventListener("touchstart", Ls), e.removeEventListener("touchend", tt), e.removeEventListener("touchmove", Bc), e.removeEventListener("touchcancel", tt), e.removeEventListener("mousedown", Ls), e.removeEventListener("mouseup", tt), e.removeEventListener("mouseleave", tt), e._ripple?.keyDownHandler && e.removeEventListener("keydown", e._ripple.keyDownHandler), e.removeEventListener("keyup", Nc), e.removeEventListener("blur", Wc), e.removeEventListener("dragstart", tt);
  }
  function Fg(e, t2) {
    zc(e, t2, false);
  }
  function $g(e) {
    jc(e), delete e._ripple;
  }
  function Rg(e, t2) {
    if (t2.value === t2.oldValue) return;
    const n2 = Rc(t2.oldValue);
    zc(e, t2, n2);
  }
  var ks = { mounted: Fg, unmounted: $g, updated: Rg };
  var Yc = K({ active: { type: Boolean, default: void 0 }, activeColor: String, baseColor: String, symbol: { type: null, default: Ic }, flat: Boolean, icon: [Boolean, String, Function, Object], prependIcon: ze, appendIcon: ze, block: Boolean, readonly: Boolean, slim: Boolean, stacked: Boolean, spaced: String, ripple: { type: [Boolean, Object], default: true }, text: { type: [String, Number, Boolean], default: void 0 }, ...Bs(), ...ke(), ...zt(), ...$s(), ...Ws(), ...Eo(), ...Hc(), ...qr(), ...Mo(), ...tn(), ...Io(), ...Kn(), ...He({ tag: "button" }), ...qe(), ...An({ variant: "elevated" }) }, "VBtn");
  var zn = ce()({ name: "VBtn", props: Yc(), emits: { "group:selected": (e) => true }, setup(e, t2) {
    let { attrs: n2, slots: s } = t2;
    const { themeClasses: r2 } = Je(e), { borderClasses: i2 } = Ns(e), { densityClasses: o } = sn(e), { dimensionStyles: l } = Rs(e), { elevationClasses: a2 } = zs(e), { loaderClasses: c2 } = Fc(e), { locationStyles: u } = Xr(e), { positionClasses: f2 } = Vo(e), { roundedClasses: d } = nn(e), { sizeClasses: h2, sizeStyles: b } = js(e), g = Tr(e, e.symbol, false), S = Po(e, n2), m = D(() => e.active !== void 0 ? e.active : S.isRouterLink.value ? S.isActive?.value : g?.isSelected.value), w = $(() => m.value ? e.activeColor ?? e.color : e.color), C2 = D(() => ({ color: g?.isSelected.value && (!S.isLink.value || S.isActive?.value) || !g || S.isActive?.value ? w.value ?? e.baseColor : e.baseColor, variant: e.variant })), { colorClasses: x, colorStyles: M2, variantClasses: A2 } = Us(C2), L2 = D(() => g?.disabled.value || e.disabled), p2 = $(() => e.variant === "elevated" && !(e.disabled || e.flat || e.border)), T = D(() => {
      if (!(e.value === void 0 || typeof e.value == "symbol")) return Object(e.value) === e.value ? JSON.stringify(e.value, null, 0) : e.value;
    });
    function H(Y) {
      L2.value || S.isLink.value && (Y.metaKey || Y.ctrlKey || Y.shiftKey || Y.button !== 0 || n2.target === "_blank") || (S.isRouterLink.value ? S.navigate.value?.(Y) : g?.toggle());
    }
    return Ig(S, g?.select), Se(() => {
      const Y = S.isLink.value ? "a" : e.tag, I2 = !!(e.prependIcon || s.prepend), F2 = !!(e.appendIcon || s.append), z = !!(e.icon && e.icon !== true);
      return Rt(k(Y, ye(S.linkProps, { type: Y === "a" ? void 0 : "button", class: ["v-btn", g?.selectedClass.value, { "v-btn--active": m.value, "v-btn--block": e.block, "v-btn--disabled": L2.value, "v-btn--elevated": p2.value, "v-btn--flat": e.flat, "v-btn--icon": !!e.icon, "v-btn--loading": e.loading, "v-btn--readonly": e.readonly, "v-btn--slim": e.slim, "v-btn--stacked": e.stacked }, e.spaced ? ["v-btn--spaced", `v-btn--spaced-${e.spaced}`] : [], r2.value, i2.value, x.value, o.value, a2.value, c2.value, f2.value, d.value, h2.value, A2.value, e.class], style: [M2.value, l.value, u.value, b.value, e.style], "aria-busy": e.loading ? true : void 0, disabled: L2.value && Y !== "a" || void 0, tabindex: e.loading || e.readonly ? -1 : void 0, onClick: H, value: T.value }), { default: () => [Ys(true, "v-btn"), !e.icon && I2 && N("span", { key: "prepend", class: "v-btn__prepend" }, [s.prepend ? k(Xe, { key: "prepend-defaults", disabled: !e.prependIcon, defaults: { VIcon: { icon: e.prependIcon } } }, s.prepend) : k(it, { key: "prepend-icon", icon: e.prependIcon }, null)]), N("span", { class: "v-btn__content", "data-no-activator": "" }, [!s.default && z ? k(it, { key: "content-icon", icon: e.icon }, null) : k(Xe, { key: "content-defaults", disabled: !z, defaults: { VIcon: { icon: e.icon } } }, { default: () => [s.default?.() ?? fs(e.text)] })]), !e.icon && F2 && N("span", { key: "append", class: "v-btn__append" }, [s.append ? k(Xe, { key: "append-defaults", disabled: !e.appendIcon, defaults: { VIcon: { icon: e.appendIcon } } }, s.append) : k(it, { key: "append-icon", icon: e.appendIcon }, null)]), !!e.loading && N("span", { key: "loader", class: "v-btn__loader" }, [s.loader?.() ?? k(Dc, { color: typeof e.loading == "boolean" ? void 0 : e.loading, indeterminate: true, width: "2" }, null)])] }), [[ks, !L2.value && e.ripple, "", { center: !!e.icon }]]);
    }), { group: g };
  } });
  var Bg = yo("v-alert-title");
  var Ng = K({ iconSize: [Number, String], iconSizes: { type: Array, default: () => [["x-small", 10], ["small", 16], ["default", 24], ["large", 28], ["x-large", 32]] } }, "iconSize");
  function Wg(e, t2) {
    return { iconSize: D(() => {
      const s = new Map(e.iconSizes), r2 = e.iconSize ?? t2() ?? "default";
      return s.has(r2) ? s.get(r2) : r2;
    }) };
  }
  var zg = ["success", "info", "warning", "error"];
  var jg = K({ border: { type: [Boolean, String], validator: (e) => typeof e == "boolean" || ["top", "end", "bottom", "start"].includes(e) }, borderColor: String, closable: Boolean, closeIcon: { type: ze, default: "$close" }, closeLabel: { type: String, default: "$vuetify.close" }, icon: { type: [Boolean, String, Function, Object], default: null }, modelValue: { type: Boolean, default: true }, prominent: Boolean, title: String, text: String, type: { type: String, validator: (e) => zg.includes(e) }, ...ke(), ...zt(), ...$s(), ...Ws(), ...Ng(), ...qr(), ...Mo(), ...tn(), ...He(), ...qe(), ...An({ variant: "flat" }) }, "VAlert");
  var Yg = ce()({ name: "VAlert", props: jg(), emits: { "click:close": (e) => true, "update:modelValue": (e) => true }, setup(e, t2) {
    let { emit: n2, slots: s } = t2;
    const r2 = Wt(e, "modelValue"), i2 = $(() => {
      if (e.icon !== false) return e.type ? e.icon ?? `$${e.type}` : e.icon;
    }), { iconSize: o } = Wg(e, () => e.prominent ? 44 : void 0), { themeClasses: l } = Je(e), { colorClasses: a2, colorStyles: c2, variantClasses: u } = Us(() => ({ color: e.color ?? e.type, variant: e.variant })), { densityClasses: f2 } = sn(e), { dimensionStyles: d } = Rs(e), { elevationClasses: h2 } = zs(e), { locationStyles: b } = Xr(e), { positionClasses: g } = Vo(e), { roundedClasses: S } = nn(e), { textColorClasses: m, textColorStyles: w } = xn(() => e.borderColor), { t: C2 } = Co(), x = $(() => ({ "aria-label": C2(e.closeLabel), onClick(M2) {
      r2.value = false, n2("click:close", M2);
    } }));
    return () => {
      const M2 = !!(s.prepend || i2.value), A2 = !!(s.title || e.title), L2 = !!(s.close || e.closable), p2 = { density: e.density, icon: i2.value, size: e.iconSize || e.prominent ? o.value : void 0 };
      return r2.value && k(e.tag, { class: ie(["v-alert", e.border && { "v-alert--border": !!e.border, [`v-alert--border-${e.border === true ? "start" : e.border}`]: true }, { "v-alert--prominent": e.prominent }, l.value, a2.value, f2.value, h2.value, g.value, S.value, u.value, e.class]), style: ge([c2.value, d.value, b.value, e.style]), role: "alert" }, { default: () => [Ys(false, "v-alert"), e.border && N("div", { key: "border", class: ie(["v-alert__border", m.value]), style: ge(w.value) }, null), M2 && N("div", { key: "prepend", class: "v-alert__prepend" }, [s.prepend ? k(Xe, { key: "prepend-defaults", disabled: !i2.value, defaults: { VIcon: { ...p2 } } }, s.prepend) : k(it, ye({ key: "prepend-icon" }, p2), null)]), N("div", { class: "v-alert__content" }, [A2 && k(Bg, { key: "title" }, { default: () => [s.title?.() ?? e.title] }), s.text?.() ?? e.text, s.default?.()]), s.append && N("div", { key: "append", class: "v-alert__append" }, [s.append()]), L2 && N("div", { key: "close", class: "v-alert__close" }, [s.close ? k(Xe, { key: "close-defaults", defaults: { VBtn: { icon: e.closeIcon, size: "x-small", variant: "text" } } }, { default: () => [s.close?.({ props: x.value })] }) : k(zn, ye({ key: "close-btn", icon: e.closeIcon, size: "x-small", variant: "text" }, x.value), null)])] });
    };
  } });
  var Ug = K({ start: Boolean, end: Boolean, icon: ze, image: String, text: String, ...Bs(), ...ke(), ...zt(), ...tn(), ...Kn(), ...He(), ...qe(), ...An({ variant: "flat" }) }, "VAvatar");
  var Vr = ce()({ name: "VAvatar", props: Ug(), setup(e, t2) {
    let { slots: n2 } = t2;
    const { themeClasses: s } = Je(e), { borderClasses: r2 } = Ns(e), { colorClasses: i2, colorStyles: o, variantClasses: l } = Us(e), { densityClasses: a2 } = sn(e), { roundedClasses: c2 } = nn(e), { sizeClasses: u, sizeStyles: f2 } = js(e);
    return Se(() => k(e.tag, { class: ie(["v-avatar", { "v-avatar--start": e.start, "v-avatar--end": e.end }, s.value, r2.value, i2.value, a2.value, c2.value, u.value, l.value, e.class]), style: ge([o.value, f2.value, e.style]) }, { default: () => [n2.default ? k(Xe, { key: "content-defaults", defaults: { VImg: { cover: true, src: e.image }, VIcon: { icon: e.icon } } }, { default: () => [n2.default()] }) : e.image ? k(ko, { key: "image", src: e.image, alt: "", cover: true }, null) : e.icon ? k(it, { key: "icon", icon: e.icon }, null) : e.text, Ys(false, "v-avatar")] })), {};
  } });
  var bi = /* @__PURE__ */ Symbol("Forwarded refs");
  function wi(e, t2) {
    let n2 = e;
    for (; n2; ) {
      const s = Reflect.getOwnPropertyDescriptor(n2, t2);
      if (s) return s;
      n2 = Object.getPrototypeOf(n2);
    }
  }
  function Uc(e) {
    for (var t2 = arguments.length, n2 = new Array(t2 > 1 ? t2 - 1 : 0), s = 1; s < t2; s++) n2[s - 1] = arguments[s];
    return e[bi] = n2, new Proxy(e, { get(r2, i2) {
      if (Reflect.has(r2, i2)) return Reflect.get(r2, i2);
      if (!(typeof i2 == "symbol" || i2.startsWith("$") || i2.startsWith("__"))) {
        for (const o of n2) if (o.value && Reflect.has(o.value, i2)) {
          const l = Reflect.get(o.value, i2);
          return typeof l == "function" ? l.bind(o.value) : l;
        }
      }
    }, has(r2, i2) {
      if (Reflect.has(r2, i2)) return true;
      if (typeof i2 == "symbol" || i2.startsWith("$") || i2.startsWith("__")) return false;
      for (const o of n2) if (o.value && Reflect.has(o.value, i2)) return true;
      return false;
    }, set(r2, i2, o) {
      if (Reflect.has(r2, i2)) return Reflect.set(r2, i2, o);
      if (typeof i2 == "symbol" || i2.startsWith("$") || i2.startsWith("__")) return false;
      for (const l of n2) if (l.value && Reflect.has(l.value, i2)) return Reflect.set(l.value, i2, o);
      return false;
    }, getOwnPropertyDescriptor(r2, i2) {
      const o = Reflect.getOwnPropertyDescriptor(r2, i2);
      if (o) return o;
      if (!(typeof i2 == "symbol" || i2.startsWith("$") || i2.startsWith("__"))) {
        for (const l of n2) {
          if (!l.value) continue;
          const a2 = wi(l.value, i2) ?? ("_" in l.value ? wi(l.value._?.setupState, i2) : void 0);
          if (a2) return a2;
        }
        for (const l of n2) {
          const a2 = l.value && l.value[bi];
          if (!a2) continue;
          const c2 = a2.slice();
          for (; c2.length; ) {
            const u = c2.shift(), f2 = wi(u.value, i2);
            if (f2) return f2;
            const d = u.value && u.value[bi];
            d && c2.push(...d);
          }
        }
      }
    } });
  }
  function Kg(e) {
    let { selectedElement: t2, containerElement: n2, isRtl: s, isHorizontal: r2 } = e;
    const i2 = Ts(r2, n2), o = Kc(r2, s, n2), l = Ts(r2, t2), a2 = Gc(r2, t2), c2 = l * 0.4;
    return o > a2 ? a2 - c2 : o + i2 < a2 + l ? a2 - i2 + l + c2 : o;
  }
  function Gg(e) {
    let { selectedElement: t2, containerElement: n2, isHorizontal: s } = e;
    const r2 = Ts(s, n2), i2 = Gc(s, t2), o = Ts(s, t2);
    return i2 - r2 / 2 + o / 2;
  }
  function pa(e, t2) {
    return t2?.[e ? "scrollWidth" : "scrollHeight"] || 0;
  }
  function Zg(e, t2) {
    return t2?.[e ? "clientWidth" : "clientHeight"] || 0;
  }
  function Kc(e, t2, n2) {
    if (!n2) return 0;
    const { scrollLeft: s, offsetWidth: r2, scrollWidth: i2 } = n2;
    return e ? t2 ? i2 - r2 + s : s : n2.scrollTop;
  }
  function Ts(e, t2) {
    return t2?.[e ? "offsetWidth" : "offsetHeight"] || 0;
  }
  function Gc(e, t2) {
    return t2?.[e ? "offsetLeft" : "offsetTop"] || 0;
  }
  var Zc = /* @__PURE__ */ Symbol.for("vuetify:v-slide-group");
  var Oo = K({ centerActive: Boolean, scrollToActive: { type: Boolean, default: true }, contentClass: null, direction: { type: String, default: "horizontal" }, symbol: { type: null, default: Zc }, nextIcon: { type: ze, default: "$next" }, prevIcon: { type: ze, default: "$prev" }, showArrows: { type: [Boolean, String], validator: (e) => typeof e == "boolean" || ["always", "desktop", "mobile", "never"].includes(e) }, ...ke(), ...Fm({ mobile: null }), ...He(), ...To({ selectedClass: "v-slide-group-item--active" }) }, "VSlideGroup");
  var Pr = ce()({ name: "VSlideGroup", props: Oo(), emits: { "update:modelValue": (e) => true }, setup(e, t2) {
    let { slots: n2 } = t2;
    const { isRtl: s } = en(), { displayClasses: r2, mobile: i2 } = Lc(e), o = Jr(e, e.symbol), l = le(false), a2 = le(0), c2 = le(0), u = le(0), f2 = D(() => e.direction === "horizontal"), { resizeRef: d, contentRect: h2 } = _s(), { resizeRef: b, contentRect: g } = _s(), S = Bm(), m = D(() => ({ container: d.el, duration: 200, easing: "easeOutQuart" })), w = D(() => o.selected.value.length ? o.items.value.findIndex((U2) => U2.id === o.selected.value[0]) : -1), C2 = D(() => o.selected.value.length ? o.items.value.findIndex((U2) => U2.id === o.selected.value[o.selected.value.length - 1]) : -1);
    if (pe) {
      let U2 = -1;
      oe(() => [o.selected.value, h2.value, g.value, f2.value], () => {
        cancelAnimationFrame(U2), U2 = requestAnimationFrame(() => {
          if (h2.value && g.value) {
            const Z = f2.value ? "width" : "height";
            c2.value = h2.value[Z], u.value = g.value[Z], l.value = c2.value + 1 < u.value;
          }
          if (e.scrollToActive && w.value >= 0 && b.el) {
            const Z = b.el.children[C2.value];
            M2(Z, e.centerActive);
          }
        });
      });
    }
    const x = le(false);
    function M2(U2, Z) {
      let he = 0;
      Z ? he = Gg({ containerElement: d.el, isHorizontal: f2.value, selectedElement: U2 }) : he = Kg({ containerElement: d.el, isHorizontal: f2.value, isRtl: s.value, selectedElement: U2 }), A2(he);
    }
    function A2(U2) {
      if (!pe || !d.el) return;
      const Z = Ts(f2.value, d.el), he = Kc(f2.value, s.value, d.el);
      if (!(pa(f2.value, d.el) <= Z || Math.abs(U2 - he) < 16)) {
        if (f2.value && s.value && d.el) {
          const { scrollWidth: Qe, offsetWidth: ae2 } = d.el;
          U2 = Qe - ae2 - U2;
        }
        f2.value ? S.horizontal(U2, m.value) : S(U2, m.value);
      }
    }
    function L2(U2) {
      const { scrollTop: Z, scrollLeft: he } = U2.target;
      a2.value = f2.value ? he : Z;
    }
    function p2(U2) {
      if (x.value = true, !(!l.value || !b.el)) {
        for (const Z of U2.composedPath()) for (const he of b.el.children) if (he === Z) {
          M2(he);
          return;
        }
      }
    }
    function T(U2) {
      x.value = false;
    }
    let H = false;
    function Y(U2) {
      !H && !x.value && !(U2.relatedTarget && b.el?.contains(U2.relatedTarget)) && G2(), H = false;
    }
    function I2() {
      H = true;
    }
    function F2(U2) {
      if (!b.el) return;
      function Z(he) {
        U2.preventDefault(), G2(he);
      }
      f2.value ? U2.key === "ArrowRight" ? Z(s.value ? "prev" : "next") : U2.key === "ArrowLeft" && Z(s.value ? "next" : "prev") : U2.key === "ArrowDown" ? Z("next") : U2.key === "ArrowUp" && Z("prev"), U2.key === "Home" ? Z("first") : U2.key === "End" && Z("last");
    }
    function z(U2, Z) {
      if (!U2) return;
      let he = U2;
      do
        he = he?.[Z === "next" ? "nextElementSibling" : "previousElementSibling"];
      while (he?.hasAttribute("disabled"));
      return he;
    }
    function G2(U2) {
      if (!b.el) return;
      let Z;
      if (!U2) Z = yn(b.el)[0];
      else if (U2 === "next") {
        if (Z = z(b.el.querySelector(":focus"), U2), !Z) return G2("first");
      } else if (U2 === "prev") {
        if (Z = z(b.el.querySelector(":focus"), U2), !Z) return G2("last");
      } else U2 === "first" ? (Z = b.el.firstElementChild, Z?.hasAttribute("disabled") && (Z = z(Z, "next"))) : U2 === "last" && (Z = b.el.lastElementChild, Z?.hasAttribute("disabled") && (Z = z(Z, "prev")));
      Z && Z.focus({ preventScroll: true });
    }
    function re2(U2) {
      const Z = f2.value && s.value ? -1 : 1, he = (U2 === "prev" ? -Z : Z) * c2.value;
      let vt2 = a2.value + he;
      if (f2.value && s.value && d.el) {
        const { scrollWidth: Qe, offsetWidth: ae2 } = d.el;
        vt2 += Qe - ae2;
      }
      A2(vt2);
    }
    const q = D(() => ({ next: o.next, prev: o.prev, select: o.select, isSelected: o.isSelected })), te2 = D(() => l.value || Math.abs(a2.value) > 0), Te = D(() => {
      switch (e.showArrows) {
        case "never":
          return false;
        case "always":
          return true;
        case "desktop":
          return !i2.value;
        case true:
          return te2.value;
        case "mobile":
          return i2.value || te2.value;
        default:
          return !i2.value && te2.value;
      }
    }), de2 = D(() => Math.abs(a2.value) > 1), Ae = D(() => {
      if (!d.value || !te2.value) return false;
      const U2 = pa(f2.value, d.el), Z = Zg(f2.value, d.el);
      return U2 - Z - Math.abs(a2.value) > 1;
    });
    return Se(() => k(e.tag, { class: ie(["v-slide-group", { "v-slide-group--vertical": !f2.value, "v-slide-group--has-affixes": Te.value, "v-slide-group--is-overflowing": l.value }, r2.value, e.class]), style: ge(e.style), tabindex: x.value || o.selected.value.length ? -1 : 0, onFocus: Y }, { default: () => [Te.value && N("div", { key: "prev", class: ie(["v-slide-group__prev", { "v-slide-group__prev--disabled": !de2.value }]), onMousedown: I2, onClick: () => de2.value && re2("prev") }, [n2.prev?.(q.value) ?? k(fa, null, { default: () => [k(it, { icon: s.value ? e.nextIcon : e.prevIcon }, null)] })]), N("div", { key: "container", ref: d, class: ie(["v-slide-group__container", e.contentClass]), onScroll: L2 }, [N("div", { ref: b, class: "v-slide-group__content", onFocusin: p2, onFocusout: T, onKeydown: F2 }, [n2.default?.(q.value)])]), Te.value && N("div", { key: "next", class: ie(["v-slide-group__next", { "v-slide-group__next--disabled": !Ae.value }]), onMousedown: I2, onClick: () => Ae.value && re2("next") }, [n2.next?.(q.value) ?? k(fa, null, { default: () => [k(it, { icon: s.value ? e.prevIcon : e.nextIcon }, null)] })])] })), { selected: o.selected, scrollTo: re2, scrollOffset: a2, focus: G2, hasPrev: de2, hasNext: Ae };
  } });
  var qc = /* @__PURE__ */ Symbol.for("vuetify:v-chip-group");
  var qg = K({ baseColor: String, column: Boolean, filter: Boolean, valueComparator: { type: Function, default: pn }, ...Oo({ scrollToActive: false }), ...ke(), ...To({ selectedClass: "v-chip--selected" }), ...He(), ...qe(), ...An({ variant: "tonal" }) }, "VChipGroup");
  ce()({ name: "VChipGroup", props: qg(), emits: { "update:modelValue": (e) => true }, setup(e, t2) {
    let { slots: n2 } = t2;
    const { themeClasses: s } = Je(e), { isSelected: r2, select: i2, next: o, prev: l, selected: a2 } = Jr(e, qc);
    return Os({ VChip: { baseColor: $(() => e.baseColor), color: $(() => e.color), disabled: $(() => e.disabled), filter: $(() => e.filter), variant: $(() => e.variant) } }), Se(() => {
      const c2 = Pr.filterProps(e);
      return k(Pr, ye(c2, { class: ["v-chip-group", { "v-chip-group--column": e.column }, s.value, e.class], style: e.style }), { default: () => [n2.default?.({ isSelected: r2, select: i2, next: o, prev: l, selected: a2.value })] });
    }), {};
  } });
  var Xg = K({ activeClass: String, appendAvatar: String, appendIcon: ze, baseColor: String, closable: Boolean, closeIcon: { type: ze, default: "$delete" }, closeLabel: { type: String, default: "$vuetify.close" }, draggable: Boolean, filter: Boolean, filterIcon: { type: ze, default: "$complete" }, label: Boolean, link: { type: Boolean, default: void 0 }, pill: Boolean, prependAvatar: String, prependIcon: ze, ripple: { type: [Boolean, Object], default: true }, text: { type: [String, Number, Boolean], default: void 0 }, modelValue: { type: Boolean, default: true }, onClick: Vl(), onClickOnce: Vl(), ...Bs(), ...ke(), ...zt(), ...Ws(), ...Eo(), ...tn(), ...Io(), ...Kn(), ...He({ tag: "span" }), ...qe(), ...An({ variant: "tonal" }) }, "VChip");
  var Jg = ce()({ name: "VChip", directives: { vRipple: ks }, props: Xg(), emits: { "click:close": (e) => true, "update:modelValue": (e) => true, "group:selected": (e) => true, click: (e) => true }, setup(e, t2) {
    let { attrs: n2, emit: s, slots: r2 } = t2;
    const { t: i2 } = Co(), { borderClasses: o } = Ns(e), { densityClasses: l } = sn(e), { elevationClasses: a2 } = zs(e), { roundedClasses: c2 } = nn(e), { sizeClasses: u } = js(e), { themeClasses: f2 } = Je(e), d = Wt(e, "modelValue"), h2 = Tr(e, qc, false), b = Tr(e, Zc, false), g = Po(e, n2), S = $(() => e.link !== false && g.isLink.value), m = D(() => !e.disabled && e.link !== false && (!!h2 || e.link || g.isClickable.value)), w = $(() => ({ "aria-label": i2(e.closeLabel), disabled: e.disabled, onClick(p2) {
      p2.preventDefault(), p2.stopPropagation(), d.value = false, s("click:close", p2);
    } }));
    oe(d, (p2) => {
      p2 ? (h2?.register(), b?.register()) : (h2?.unregister(), b?.unregister());
    });
    const { colorClasses: C2, colorStyles: x, variantClasses: M2 } = Us(() => ({ color: !h2 || h2.isSelected.value ? e.color ?? e.baseColor : e.baseColor, variant: e.variant }));
    function A2(p2) {
      s("click", p2), m.value && (g.navigate.value?.(p2), h2?.toggle());
    }
    function L2(p2) {
      (p2.key === "Enter" || p2.key === " ") && (p2.preventDefault(), A2(p2));
    }
    return () => {
      const p2 = g.isLink.value ? "a" : e.tag, T = !!(e.appendIcon || e.appendAvatar), H = !!(T || r2.append), Y = !!(r2.close || e.closable), I2 = !!(r2.filter || e.filter) && h2, F2 = !!(e.prependIcon || e.prependAvatar), z = !!(F2 || r2.prepend);
      return d.value && Rt(k(p2, ye(g.linkProps, { class: ["v-chip", { "v-chip--disabled": e.disabled, "v-chip--label": e.label, "v-chip--link": m.value, "v-chip--filter": I2, "v-chip--pill": e.pill, [`${e.activeClass}`]: e.activeClass && g.isActive?.value }, f2.value, o.value, C2.value, l.value, a2.value, c2.value, u.value, M2.value, h2?.selectedClass.value, e.class], style: [x.value, e.style], disabled: e.disabled || void 0, draggable: e.draggable, tabindex: m.value ? 0 : void 0, onClick: A2, onKeydown: m.value && !S.value && L2 }), { default: () => [Ys(m.value, "v-chip"), I2 && k(lg, { key: "filter" }, { default: () => [Rt(N("div", { class: "v-chip__filter" }, [r2.filter ? k(Xe, { key: "filter-defaults", disabled: !e.filterIcon, defaults: { VIcon: { icon: e.filterIcon } } }, r2.filter) : k(it, { key: "filter-icon", icon: e.filterIcon }, null)]), [[Gr, h2.isSelected.value]])] }), z && N("div", { key: "prepend", class: "v-chip__prepend" }, [r2.prepend ? k(Xe, { key: "prepend-defaults", disabled: !F2, defaults: { VAvatar: { image: e.prependAvatar, start: true }, VIcon: { icon: e.prependIcon, start: true } } }, r2.prepend) : N(Me, null, [e.prependIcon && k(it, { key: "prepend-icon", icon: e.prependIcon, start: true }, null), e.prependAvatar && k(Vr, { key: "prepend-avatar", image: e.prependAvatar, start: true }, null)])]), N("div", { class: "v-chip__content", "data-no-activator": "" }, [r2.default?.({ isSelected: h2?.isSelected.value, selectedClass: h2?.selectedClass.value, select: h2?.select, toggle: h2?.toggle, value: h2?.value.value, disabled: e.disabled }) ?? fs(e.text)]), H && N("div", { key: "append", class: "v-chip__append" }, [r2.append ? k(Xe, { key: "append-defaults", disabled: !T, defaults: { VAvatar: { end: true, image: e.appendAvatar }, VIcon: { end: true, icon: e.appendIcon } } }, r2.append) : N(Me, null, [e.appendIcon && k(it, { key: "append-icon", end: true, icon: e.appendIcon }, null), e.appendAvatar && k(Vr, { key: "append-avatar", end: true, image: e.appendAvatar }, null)])]), Y && N("button", ye({ key: "close", class: "v-chip__close", type: "button", "data-testid": "close-chip" }, w.value), [r2.close ? k(Xe, { key: "close-defaults", defaults: { VIcon: { icon: e.closeIcon, size: "x-small" } } }, r2.close) : k(it, { key: "close-icon", icon: e.closeIcon, size: "x-small" }, null)])] }), [[ks, m.value && e.ripple, null]]);
    };
  } });
  var Qg = ["dotted", "dashed", "solid", "double"];
  var e1 = K({ color: String, contentOffset: [Number, String, Array], gradient: Boolean, inset: Boolean, length: [Number, String], opacity: [Number, String], thickness: [Number, String], vertical: Boolean, variant: { type: String, default: "solid", validator: (e) => Qg.includes(e) }, ...ke(), ...qe() }, "VDivider");
  var t1 = ce()({ name: "VDivider", props: e1(), setup(e, t2) {
    let { attrs: n2, slots: s } = t2;
    const { themeClasses: r2 } = Je(e), { textColorClasses: i2, textColorStyles: o } = xn(() => e.color), l = D(() => {
      const c2 = {};
      return e.length && (c2[e.vertical ? "height" : "width"] = J(e.length)), e.thickness && (c2[e.vertical ? "borderRightWidth" : "borderTopWidth"] = J(e.thickness)), c2;
    }), a2 = $(() => {
      const c2 = Array.isArray(e.contentOffset) ? e.contentOffset[0] : e.contentOffset, u = Array.isArray(e.contentOffset) ? e.contentOffset[1] : 0;
      return { marginBlock: e.vertical && c2 ? J(c2) : void 0, marginInline: !e.vertical && c2 ? J(c2) : void 0, transform: u ? `translate${e.vertical ? "X" : "Y"}(${J(u)})` : void 0 };
    });
    return Se(() => {
      const c2 = N("hr", { class: ie([{ "v-divider": true, "v-divider--gradient": e.gradient && !s.default, "v-divider--inset": e.inset, "v-divider--vertical": e.vertical }, r2.value, i2.value, e.class]), style: ge([l.value, o.value, { "--v-border-opacity": e.opacity }, { "border-style": e.variant }, e.style]), "aria-orientation": !n2.role || n2.role === "separator" ? e.vertical ? "vertical" : "horizontal" : void 0, role: `${n2.role || "separator"}` }, null);
      return s.default ? N("div", { class: ie(["v-divider__wrapper", { "v-divider__wrapper--gradient": e.gradient, "v-divider__wrapper--inset": e.inset, "v-divider__wrapper--vertical": e.vertical }]) }, [c2, N("div", { class: "v-divider__content", style: ge(a2.value) }, [s.default()]), c2]) : c2;
    }), {};
  } });
  function Ci(e, t2) {
    return { x: e.x + t2.x, y: e.y + t2.y };
  }
  function n1(e, t2) {
    return { x: e.x - t2.x, y: e.y - t2.y };
  }
  function ba(e, t2) {
    if (e.side === "top" || e.side === "bottom") {
      const { side: n2, align: s } = e, r2 = s === "left" ? 0 : s === "center" ? t2.width / 2 : s === "right" ? t2.width : s, i2 = n2 === "top" ? 0 : n2 === "bottom" ? t2.height : n2;
      return Ci({ x: r2, y: i2 }, t2);
    } else if (e.side === "left" || e.side === "right") {
      const { side: n2, align: s } = e, r2 = n2 === "left" ? 0 : n2 === "right" ? t2.width : n2, i2 = s === "top" ? 0 : s === "center" ? t2.height / 2 : s === "bottom" ? t2.height : s;
      return Ci({ x: r2, y: i2 }, t2);
    }
    return Ci({ x: t2.width / 2, y: t2.height / 2 }, t2);
  }
  var Xc = { static: i1, connected: l1 };
  var s1 = K({ locationStrategy: { type: [String, Function], default: "static", validator: (e) => typeof e == "function" || e in Xc }, location: { type: String, default: "bottom" }, origin: { type: String, default: "auto" }, offset: [Number, String, Array], stickToTarget: Boolean, viewportMargin: { type: [Number, String], default: 12 } }, "VOverlay-location-strategies");
  function r1(e, t2) {
    const n2 = _e({}), s = _e();
    pe && Hs(() => !!(t2.isActive.value && e.locationStrategy), (l) => {
      oe(() => e.locationStrategy, l), Ze(() => {
        window.removeEventListener("resize", r2), visualViewport?.removeEventListener("resize", i2), visualViewport?.removeEventListener("scroll", o), s.value = void 0;
      }), window.addEventListener("resize", r2, { passive: true }), visualViewport?.addEventListener("resize", i2, { passive: true }), visualViewport?.addEventListener("scroll", o, { passive: true }), typeof e.locationStrategy == "function" ? s.value = e.locationStrategy(t2, e, n2)?.updateLocation : s.value = Xc[e.locationStrategy](t2, e, n2)?.updateLocation;
    });
    function r2(l) {
      s.value?.(l);
    }
    function i2(l) {
      s.value?.(l);
    }
    function o(l) {
      s.value?.(l);
    }
    return { contentStyles: n2, updateLocation: s };
  }
  function i1() {
  }
  function o1(e, t2) {
    const n2 = cc(e);
    return t2 ? n2.x += parseFloat(e.style.right || 0) : n2.x -= parseFloat(e.style.left || 0), n2.y -= parseFloat(e.style.top || 0), n2;
  }
  function l1(e, t2, n2) {
    (Array.isArray(e.target.value) || $h(e.target.value)) && Object.assign(n2.value, { position: "fixed", top: 0, [e.isRtl.value ? "right" : "left"]: 0 });
    const { preferredAnchor: r2, preferredOrigin: i2 } = vo(() => {
      const m = Hi(t2.location, e.isRtl.value), w = t2.origin === "overlap" ? m : t2.origin === "auto" ? vi(m) : Hi(t2.origin, e.isRtl.value);
      return m.side === w.side && m.align === hi(w).align ? { preferredAnchor: Ol(m), preferredOrigin: Ol(w) } : { preferredAnchor: m, preferredOrigin: w };
    }), [o, l, a2, c2] = ["minWidth", "minHeight", "maxWidth", "maxHeight"].map((m) => D(() => {
      const w = parseFloat(t2[m]);
      return isNaN(w) ? 1 / 0 : w;
    })), u = D(() => {
      if (Array.isArray(t2.offset)) return t2.offset;
      if (typeof t2.offset == "string") {
        const m = t2.offset.split(" ").map(parseFloat);
        return m.length < 2 && m.push(0), m;
      }
      return typeof t2.offset == "number" ? [t2.offset, 0] : [0, 0];
    });
    let f2 = false, d = -1;
    const h2 = new eh(4), b = new ResizeObserver(() => {
      if (!f2) return;
      if (requestAnimationFrame((w) => {
        w !== d && h2.clear(), requestAnimationFrame((C2) => {
          d = C2;
        });
      }), h2.isFull) {
        const w = h2.values();
        if (pn(w.at(-1), w.at(-3)) && !pn(w.at(-1), w.at(-2))) return;
      }
      const m = S();
      m && h2.push(m.flipped);
    });
    let g = new rt({ x: 0, y: 0, width: 0, height: 0 });
    oe(e.target, (m, w) => {
      w && !Array.isArray(w) && b.unobserve(w), Array.isArray(m) ? pn(m, w) || S() : m && b.observe(m);
    }, { immediate: true }), oe(e.contentEl, (m, w) => {
      w && b.unobserve(w), m && b.observe(m);
    }, { immediate: true }), Ze(() => {
      b.disconnect();
    });
    function S() {
      if (f2 = false, requestAnimationFrame(() => f2 = true), !e.target.value || !e.contentEl.value) return;
      (Array.isArray(e.target.value) || e.target.value.offsetParent || e.target.value.getClientRects().length) && (g = ho(e.target.value));
      const m = o1(e.contentEl.value, e.isRtl.value), w = _r(e.contentEl.value), C2 = Number(t2.viewportMargin);
      w.length || (w.push(document.documentElement), e.contentEl.value.style.top && e.contentEl.value.style.left || (m.x -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-x") || 0), m.y -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-y") || 0)));
      const x = w.reduce((F2, z) => {
        const G2 = oh(z);
        return F2 ? new rt({ x: Math.max(F2.left, G2.left), y: Math.max(F2.top, G2.top), width: Math.min(F2.right, G2.right) - Math.max(F2.left, G2.left), height: Math.min(F2.bottom, G2.bottom) - Math.max(F2.top, G2.top) }) : G2;
      }, void 0);
      t2.stickToTarget ? (x.x += Math.min(C2, g.x), x.y += Math.min(C2, g.y), x.width = Math.max(x.width - C2 * 2, g.x + g.width - C2), x.height = Math.max(x.height - C2 * 2, g.y + g.height - C2)) : (x.x += C2, x.y += C2, x.width -= C2 * 2, x.height -= C2 * 2);
      let M2 = { anchor: r2.value, origin: i2.value };
      function A2(F2) {
        const z = new rt(m), G2 = ba(F2.anchor, g), re2 = ba(F2.origin, z);
        let { x: q, y: te2 } = n1(G2, re2);
        switch (F2.anchor.side) {
          case "top":
            te2 -= u.value[0];
            break;
          case "bottom":
            te2 += u.value[0];
            break;
          case "left":
            q -= u.value[0];
            break;
          case "right":
            q += u.value[0];
            break;
        }
        switch (F2.anchor.align) {
          case "top":
            te2 -= u.value[1];
            break;
          case "bottom":
            te2 += u.value[1];
            break;
          case "left":
            q -= u.value[1];
            break;
          case "right":
            q += u.value[1];
            break;
        }
        return z.x += q, z.y += te2, z.width = Math.min(z.width, a2.value), z.height = Math.min(z.height, c2.value), { overflows: Hl(z, x), x: q, y: te2 };
      }
      let L2 = 0, p2 = 0;
      const T = { x: 0, y: 0 }, H = { x: false, y: false };
      let Y = -1;
      for (; !(Y++ > 10); ) {
        const { x: F2, y: z, overflows: G2 } = A2(M2);
        L2 += F2, p2 += z, m.x += F2, m.y += z;
        {
          const re2 = Dl(M2.anchor), q = G2.x.before || G2.x.after, te2 = G2.y.before || G2.y.after;
          let Te = false;
          if (["x", "y"].forEach((de2) => {
            if (de2 === "x" && q && !H.x || de2 === "y" && te2 && !H.y) {
              const Ae = { anchor: { ...M2.anchor }, origin: { ...M2.origin } }, U2 = de2 === "x" ? re2 === "y" ? hi : vi : re2 === "y" ? vi : hi;
              Ae.anchor = U2(Ae.anchor), Ae.origin = U2(Ae.origin);
              const { overflows: Z } = A2(Ae);
              (Z[de2].before <= G2[de2].before && Z[de2].after <= G2[de2].after || Z[de2].before + Z[de2].after < (G2[de2].before + G2[de2].after) / 2) && (M2 = Ae, Te = H[de2] = true);
            }
          }), Te) continue;
        }
        G2.x.before && (L2 += G2.x.before, m.x += G2.x.before), G2.x.after && (L2 -= G2.x.after, m.x -= G2.x.after), G2.y.before && (p2 += G2.y.before, m.y += G2.y.before), G2.y.after && (p2 -= G2.y.after, m.y -= G2.y.after);
        {
          const re2 = Hl(m, x);
          T.x = x.width - re2.x.before - re2.x.after, T.y = x.height - re2.y.before - re2.y.after, L2 += re2.x.before, m.x += re2.x.before, p2 += re2.y.before, m.y += re2.y.before;
        }
        break;
      }
      const I2 = Dl(M2.anchor);
      return Object.assign(n2.value, { "--v-overlay-anchor-origin": `${M2.anchor.side} ${M2.anchor.align}`, transformOrigin: `${M2.origin.side} ${M2.origin.align}`, top: J(Si(p2)), left: e.isRtl.value ? void 0 : J(Si(L2)), right: e.isRtl.value ? J(Si(-L2)) : void 0, minWidth: J(I2 === "y" ? Math.min(o.value, g.width) : o.value), maxWidth: J(wa(Bt(T.x, o.value === 1 / 0 ? 0 : o.value, a2.value))), maxHeight: J(wa(Bt(T.y, l.value === 1 / 0 ? 0 : l.value, c2.value))) }), { available: T, contentBox: m, flipped: H };
    }
    return oe(() => [r2.value, i2.value, t2.offset, t2.minWidth, t2.minHeight, t2.maxWidth, t2.maxHeight], () => S()), ct(() => {
      const m = S();
      if (!m) return;
      const { available: w, contentBox: C2 } = m;
      C2.height > w.y && requestAnimationFrame(() => {
        S(), requestAnimationFrame(() => {
          S();
        });
      });
    }), { updateLocation: S };
  }
  function Si(e) {
    return Math.round(e * devicePixelRatio) / devicePixelRatio;
  }
  function wa(e) {
    return Math.ceil(e * devicePixelRatio) / devicePixelRatio;
  }
  var ji = true;
  var Ir = [];
  function a1(e) {
    !ji || Ir.length ? (Ir.push(e), Yi()) : (ji = false, e(), Yi());
  }
  var Ca = -1;
  function Yi() {
    cancelAnimationFrame(Ca), Ca = requestAnimationFrame(() => {
      const e = Ir.shift();
      e && e(), Ir.length ? Yi() : ji = true;
    });
  }
  var Jc = { none: null, close: f1, block: d1, reposition: v1 };
  var u1 = K({ scrollStrategy: { type: [String, Function], default: "block", validator: (e) => typeof e == "function" || e in Jc } }, "VOverlay-scroll-strategies");
  function c1(e, t2) {
    if (!pe) return;
    let n2;
    Tt(async () => {
      n2?.stop(), t2.isActive.value && e.scrollStrategy && (n2 = ds(), await new Promise((s) => setTimeout(s)), n2.active && n2.run(() => {
        typeof e.scrollStrategy == "function" ? e.scrollStrategy(t2, e, n2) : Jc[e.scrollStrategy]?.(t2, e, n2);
      }));
    }), Ze(() => {
      n2?.stop();
    });
  }
  function f1(e) {
    function t2(n2) {
      e.isActive.value = false;
    }
    Qc(Do(e.target.value, e.contentEl.value), t2);
  }
  function d1(e, t2) {
    const n2 = e.root.value?.offsetParent, s = Do(e.target.value, e.contentEl.value), r2 = [.../* @__PURE__ */ new Set([..._r(s, t2.contained ? n2 : void 0), ..._r(e.contentEl.value, t2.contained ? n2 : void 0)])].filter((l) => !l.classList.contains("v-overlay-scroll-blocked")), i2 = window.innerWidth - document.documentElement.offsetWidth, o = ((l) => po(l) && l)(n2 || document.documentElement);
    o && e.root.value.classList.add("v-overlay--scroll-blocked"), r2.forEach((l, a2) => {
      l.style.setProperty("--v-body-scroll-x", J(-l.scrollLeft)), l.style.setProperty("--v-body-scroll-y", J(-l.scrollTop)), l !== document.documentElement && l.style.setProperty("--v-scrollbar-offset", J(i2)), l.classList.add("v-overlay-scroll-blocked");
    }), Ze(() => {
      r2.forEach((l, a2) => {
        const c2 = parseFloat(l.style.getPropertyValue("--v-body-scroll-x")), u = parseFloat(l.style.getPropertyValue("--v-body-scroll-y")), f2 = l.style.scrollBehavior;
        l.style.scrollBehavior = "auto", l.style.removeProperty("--v-body-scroll-x"), l.style.removeProperty("--v-body-scroll-y"), l.style.removeProperty("--v-scrollbar-offset"), l.classList.remove("v-overlay-scroll-blocked"), l.scrollLeft = -c2, l.scrollTop = -u, l.style.scrollBehavior = f2;
      }), o && e.root.value.classList.remove("v-overlay--scroll-blocked");
    });
  }
  function v1(e, t2, n2) {
    let s = false, r2 = -1, i2 = -1;
    function o(l) {
      a1(() => {
        const a2 = performance.now();
        e.updateLocation.value?.(l), s = (performance.now() - a2) / (1e3 / 60) > 2;
      });
    }
    i2 = (typeof requestIdleCallback > "u" ? (l) => l() : requestIdleCallback)(() => {
      n2.run(() => {
        Qc(Do(e.target.value, e.contentEl.value), (l) => {
          s ? (cancelAnimationFrame(r2), r2 = requestAnimationFrame(() => {
            r2 = requestAnimationFrame(() => {
              o(l);
            });
          })) : o(l);
        });
      });
    }), Ze(() => {
      typeof cancelIdleCallback < "u" && cancelIdleCallback(i2), cancelAnimationFrame(r2);
    });
  }
  function Do(e, t2) {
    return Array.isArray(e) ? document.elementsFromPoint(...e).find((n2) => !t2?.contains(n2)) : e ?? t2;
  }
  function Qc(e, t2) {
    const n2 = [document, ..._r(e)];
    n2.forEach((s) => {
      s.addEventListener("scroll", t2, { passive: true });
    }), Ze(() => {
      n2.forEach((s) => {
        s.removeEventListener("scroll", t2);
      });
    });
  }
  var Ui = /* @__PURE__ */ Symbol.for("vuetify:v-menu");
  var h1 = K({ closeDelay: [Number, String], openDelay: [Number, String] }, "delay");
  function m1(e, t2) {
    let n2 = () => {
    };
    function s(o, l) {
      n2?.();
      const a2 = o ? e.openDelay : e.closeDelay, c2 = Math.max(l?.minDelay ?? 0, Number(a2 ?? 0));
      return new Promise((u) => {
        n2 = nh(c2, () => {
          t2?.(o), u(o);
        });
      });
    }
    function r2() {
      return s(true);
    }
    function i2(o) {
      return s(false, o);
    }
    return { clearDelay: n2, runOpenDelay: r2, runCloseDelay: i2 };
  }
  var g1 = K({ target: [String, Object], activator: [String, Object], activatorProps: { type: Object, default: () => ({}) }, openOnClick: { type: Boolean, default: void 0 }, openOnHover: Boolean, openOnFocus: { type: Boolean, default: void 0 }, closeOnContentClick: Boolean, ...h1() }, "VOverlay-activator");
  function y1(e, t2) {
    let { isActive: n2, isTop: s, contentEl: r2 } = t2;
    const i2 = Re("useActivator"), o = _e();
    let l = false, a2 = false, c2 = true;
    const u = D(() => e.openOnFocus || e.openOnFocus == null && e.openOnHover), f2 = D(() => e.openOnClick || e.openOnClick == null && !e.openOnHover && !u.value), { runOpenDelay: d, runCloseDelay: h2 } = m1(e, (p2) => {
      p2 === (e.openOnHover && l || u.value && a2) && !(e.openOnHover && n2.value && !s.value) && (n2.value !== p2 && (c2 = true), n2.value = p2);
    }), b = _e(), g = { onClick: (p2) => {
      p2.stopPropagation(), o.value = p2.currentTarget || p2.target, n2.value || (b.value = [p2.clientX, p2.clientY]), n2.value = !n2.value;
    }, onMouseenter: (p2) => {
      l = true, o.value = p2.currentTarget || p2.target, d();
    }, onMouseleave: (p2) => {
      l = false, h2();
    }, onFocus: (p2) => {
      th(p2.target, ":focus-visible") !== false && (a2 = true, p2.stopPropagation(), o.value = p2.currentTarget || p2.target, d());
    }, onBlur: (p2) => {
      a2 = false, p2.stopPropagation(), h2({ minDelay: 1 });
    } }, S = D(() => {
      const p2 = {};
      return f2.value && (p2.onClick = g.onClick), e.openOnHover && (p2.onMouseenter = g.onMouseenter, p2.onMouseleave = g.onMouseleave), u.value && (p2.onFocus = g.onFocus, p2.onBlur = g.onBlur), p2;
    }), m = D(() => {
      const p2 = {};
      if (e.openOnHover && (p2.onMouseenter = () => {
        l = true, d();
      }, p2.onMouseleave = () => {
        l = false, h2();
      }), u.value && (p2.onFocusin = (T) => {
        T.target.matches(":focus-visible") && (a2 = true, d());
      }, p2.onFocusout = () => {
        a2 = false, h2({ minDelay: 1 });
      }), e.closeOnContentClick) {
        const T = Ie(Ui, null);
        p2.onClick = () => {
          n2.value = false, T?.closeParents();
        };
      }
      return p2;
    }), w = D(() => {
      const p2 = {};
      return e.openOnHover && (p2.onMouseenter = () => {
        c2 && (l = true, c2 = false, d());
      }, p2.onMouseleave = () => {
        l = false, h2();
      }), p2;
    });
    oe(s, (p2) => {
      p2 && (e.openOnHover && !l && (!u.value || !a2) || u.value && !a2 && (!e.openOnHover || !l)) && !r2.value?.contains(document.activeElement) && h2();
    }), oe(n2, (p2) => {
      p2 || setTimeout(() => {
        b.value = void 0;
      });
    }, { flush: "post" });
    const C2 = Di();
    Tt(() => {
      C2.value && ct(() => {
        o.value = C2.el;
      });
    });
    const x = Di(), M2 = D(() => e.target === "cursor" && b.value ? b.value : x.value ? x.el : ef(e.target, i2) || o.value), A2 = D(() => Array.isArray(M2.value) ? void 0 : M2.value);
    let L2;
    return oe(() => !!e.activator, (p2) => {
      p2 && pe ? (L2 = ds(), L2.run(() => {
        p1(e, i2, { activatorEl: o, activatorEvents: S });
      })) : L2 && L2.stop();
    }, { flush: "post", immediate: true }), Ze(() => {
      L2?.stop();
    }), { activatorEl: o, activatorRef: C2, target: M2, targetEl: A2, targetRef: x, activatorEvents: S, contentEvents: m, scrimEvents: w };
  }
  function p1(e, t2, n2) {
    let { activatorEl: s, activatorEvents: r2 } = n2;
    oe(() => e.activator, (a2, c2) => {
      if (c2 && a2 !== c2) {
        const u = l(c2);
        u && o(u);
      }
      a2 && ct(() => i2());
    }, { immediate: true }), oe(() => e.activatorProps, () => {
      i2();
    }), Ze(() => {
      o();
    });
    function i2() {
      let a2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : l(), c2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
      a2 && lh(a2, ye(r2.value, c2));
    }
    function o() {
      let a2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : l(), c2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
      a2 && ah(a2, ye(r2.value, c2));
    }
    function l() {
      let a2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : e.activator;
      const c2 = ef(a2, t2);
      return s.value = c2?.nodeType === Node.ELEMENT_NODE ? c2 : void 0, s.value;
    }
  }
  function ef(e, t2) {
    if (!e) return;
    let n2;
    if (e === "parent") {
      let s = t2?.proxy?.$el?.parentNode;
      for (; s?.hasAttribute("data-no-activator"); ) s = s.parentNode;
      n2 = s;
    } else typeof e == "string" ? n2 = document.querySelector(e) : "$el" in e ? n2 = e.$el : n2 = e;
    return n2;
  }
  var b1 = K({ retainFocus: Boolean, captureFocus: Boolean, disableInitialFocus: Boolean }, "focusTrap");
  var rr = /* @__PURE__ */ new Map();
  var Sa = 0;
  function xa(e) {
    const t2 = document.activeElement;
    if (e.key !== "Tab" || !t2) return;
    const n2 = Array.from(rr.values()).filter((c2) => {
      let { isActive: u, contentEl: f2 } = c2;
      return u.value && f2.value?.contains(t2);
    }).map((c2) => c2.contentEl.value);
    let s, r2 = t2.parentElement;
    for (; r2; ) {
      if (n2.includes(r2)) {
        s = r2;
        break;
      }
      r2 = r2.parentElement;
    }
    if (!s) return;
    const i2 = yn(s).filter((c2) => c2.tabIndex >= 0);
    if (!i2.length) return;
    const o = document.activeElement;
    if (i2.length === 1 && i2[0].classList.contains("v-list") && i2[0].contains(o)) {
      e.preventDefault();
      return;
    }
    const l = i2[0], a2 = i2[i2.length - 1];
    e.shiftKey && (o === l || l.classList.contains("v-list") && l.contains(o)) && (e.preventDefault(), a2.focus()), !e.shiftKey && (o === a2 || a2.classList.contains("v-list") && a2.contains(o)) && (e.preventDefault(), l.focus());
  }
  function w1(e, t2) {
    let { isActive: n2, localTop: s, contentEl: r2 } = t2;
    const i2 = /* @__PURE__ */ Symbol("trap");
    let o = false, l = -1;
    async function a2() {
      o = true, l = window.setTimeout(() => {
        o = false;
      }, 100);
    }
    async function c2(d) {
      const h2 = d.relatedTarget, b = d.target;
      document.removeEventListener("pointerdown", a2), document.removeEventListener("keydown", u), await new Promise((g) => requestAnimationFrame(g)), n2.value && !o && h2 !== b && r2.value && gt(s) && ![document, r2.value].includes(b) && !r2.value.contains(b) && yn(r2.value)[0]?.focus();
    }
    function u(d) {
      if (d.key === "Tab" && (document.removeEventListener("keydown", u), n2.value && r2.value && d.target && !r2.value.contains(d.target))) {
        const h2 = yn(document.documentElement);
        if (d.shiftKey && d.target === h2.at(0) || !d.shiftKey && d.target === h2.at(-1)) {
          const b = yn(r2.value);
          b.length > 0 && (d.preventDefault(), b[0].focus());
        }
      }
    }
    const f2 = $(() => n2.value && e.captureFocus && !e.disableInitialFocus);
    pe && (oe(() => e.retainFocus, (d) => {
      d ? rr.set(i2, { isActive: n2, contentEl: r2 }) : rr.delete(i2);
    }, { immediate: true }), oe(f2, (d) => {
      d ? (document.addEventListener("pointerdown", a2), document.addEventListener("focusin", c2, { once: true }), document.addEventListener("keydown", u)) : (document.removeEventListener("pointerdown", a2), document.removeEventListener("focusin", c2), document.removeEventListener("keydown", u));
    }, { immediate: true }), Sa++ < 1 && document.addEventListener("keydown", xa)), Ze(() => {
      rr.delete(i2), clearTimeout(l), document.removeEventListener("pointerdown", a2), document.removeEventListener("focusin", c2), document.removeEventListener("keydown", u), --Sa < 1 && document.removeEventListener("keydown", xa);
    });
  }
  function C1() {
    if (!pe) return le(false);
    const { ssr: e } = Lc();
    if (e) {
      const t2 = le(false);
      return Ln(() => {
        t2.value = true;
      }), t2;
    } else return le(true);
  }
  var tf = K({ eager: Boolean }, "lazy");
  function nf(e, t2) {
    const n2 = le(false), s = $(() => n2.value || e.eager || t2.value);
    oe(t2, () => n2.value = true);
    function r2() {
      e.eager || (n2.value = false);
    }
    return { isBooted: n2, hasContent: s, onAfterLeave: r2 };
  }
  function Ho() {
    const t2 = Re("useScopeId").vnode.scopeId;
    return { scopeId: t2 ? { [t2]: "" } : void 0 };
  }
  var _a = /* @__PURE__ */ Symbol.for("vuetify:stack");
  var es = $e([]);
  function S1(e, t2, n2) {
    const s = Re("useStack"), r2 = !n2, i2 = Ie(_a, void 0), o = $e({ activeChildren: /* @__PURE__ */ new Set() });
    Et(_a, o);
    const l = le(Number(gt(t2)));
    Hs(e, () => {
      const u = es.at(-1)?.[1];
      l.value = u ? u + 10 : Number(gt(t2)), r2 && es.push([s.uid, l.value]), i2?.activeChildren.add(s.uid), Ze(() => {
        if (r2) {
          const f2 = ue(es).findIndex((d) => d[0] === s.uid);
          es.splice(f2, 1);
        }
        i2?.activeChildren.delete(s.uid);
      });
    });
    const a2 = le(true);
    return r2 && Tt(() => {
      const u = es.at(-1)?.[0] === s.uid;
      setTimeout(() => a2.value = u);
    }), { globalTop: $n(a2), localTop: $(() => !o.activeChildren.size), stackStyles: $(() => ({ zIndex: l.value })) };
  }
  function x1(e) {
    return { teleportTarget: D(() => {
      const n2 = e();
      if (n2 === true || !pe) return;
      const s = n2 === false ? document.body : typeof n2 == "string" ? document.querySelector(n2) : n2;
      if (s == null) return;
      let r2 = [...s.children].find((i2) => i2.matches(".v-overlay-container"));
      return r2 || (r2 = document.createElement("div"), r2.className = "v-overlay-container", s.appendChild(r2)), r2;
    }) };
  }
  function _1() {
    return true;
  }
  function sf(e, t2, n2) {
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    if (!e || !s && rf(e, n2) === false) return false;
    const r2 = gc(t2);
    if (typeof ShadowRoot < "u" && r2 instanceof ShadowRoot && r2.host === e.target) return false;
    const i2 = (typeof n2.value == "object" && n2.value.include || (() => []))();
    return i2.push(t2), !i2.some((o) => o?.contains(e.target));
  }
  function rf(e, t2) {
    return (typeof t2.value == "object" && t2.value.closeConditional || _1)(e);
  }
  function L1(e, t2, n2) {
    const s = typeof n2.value == "function" ? n2.value : n2.value.handler;
    e.shadowTarget = e.target, t2._clickOutside.lastMousedownWasOutside && sf(e, t2, n2) && setTimeout(() => {
      rf(e, n2) && s && s(e);
    }, 0);
  }
  function La(e, t2) {
    const n2 = gc(e);
    t2(document), typeof ShadowRoot < "u" && n2 instanceof ShadowRoot && t2(n2);
  }
  var Aa = { mounted(e, t2) {
    const n2 = (r2) => L1(r2, e, t2), s = (r2) => {
      e._clickOutside.lastMousedownWasOutside = sf(r2, e, t2, true);
    };
    La(e, (r2) => {
      r2.addEventListener("click", n2, true), r2.addEventListener("mousedown", s, true);
    }), e._clickOutside || (e._clickOutside = { lastMousedownWasOutside: false }), e._clickOutside[t2.instance.$.uid] = { onClick: n2, onMousedown: s };
  }, beforeUnmount(e, t2) {
    e._clickOutside && (La(e, (n2) => {
      if (!n2 || !e._clickOutside?.[t2.instance.$.uid]) return;
      const { onClick: s, onMousedown: r2 } = e._clickOutside[t2.instance.$.uid];
      n2.removeEventListener("click", s, true), n2.removeEventListener("mousedown", r2, true);
    }), delete e._clickOutside[t2.instance.$.uid]);
  } };
  function A1(e) {
    const { modelValue: t2, color: n2, ...s } = e;
    return k(Sn, { name: "fade-transition", appear: true }, { default: () => [e.modelValue && N("div", ye({ class: ["v-overlay__scrim", e.color.backgroundColorClasses.value], style: e.color.backgroundColorStyles.value }, s), null)] });
  }
  var of = K({ absolute: Boolean, attach: [Boolean, String, Object], closeOnBack: { type: Boolean, default: true }, contained: Boolean, contentClass: null, contentProps: null, disabled: Boolean, opacity: [Number, String], noClickAnimation: Boolean, modelValue: Boolean, persistent: Boolean, scrim: { type: [Boolean, String], default: true }, zIndex: { type: [Number, String], default: 2e3 }, ...g1(), ...ke(), ...$s(), ...tf(), ...s1(), ...u1(), ...b1(), ...qe(), ...Mc() }, "VOverlay");
  var ka = ce()({ name: "VOverlay", directives: { vClickOutside: Aa }, inheritAttrs: false, props: { _disableGlobalStack: Boolean, ...Un(of(), ["disableInitialFocus"]) }, emits: { "click:outside": (e) => true, "update:modelValue": (e) => true, keydown: (e) => true, afterEnter: () => true, afterLeave: () => true }, setup(e, t2) {
    let { slots: n2, attrs: s, emit: r2 } = t2;
    const i2 = Re("VOverlay"), o = _e(), l = _e(), a2 = _e(), c2 = Wt(e, "modelValue"), u = D({ get: () => c2.value, set: (ae2) => {
      ae2 && e.disabled || (c2.value = ae2);
    } }), { themeClasses: f2 } = Je(e), { rtlClasses: d, isRtl: h2 } = en(), { hasContent: b, onAfterLeave: g } = nf(e, u), S = wn(() => typeof e.scrim == "string" ? e.scrim : null), { globalTop: m, localTop: w, stackStyles: C2 } = S1(u, () => e.zIndex, e._disableGlobalStack), { activatorEl: x, activatorRef: M2, target: A2, targetEl: L2, targetRef: p2, activatorEvents: T, contentEvents: H, scrimEvents: Y } = y1(e, { isActive: u, isTop: w, contentEl: a2 }), { teleportTarget: I2 } = x1(() => {
      const ae2 = e.attach || e.contained;
      if (ae2) return ae2;
      const Ve = x?.value?.getRootNode() || i2.proxy?.$el?.getRootNode();
      return Ve instanceof ShadowRoot ? Ve : false;
    }), { dimensionStyles: F2 } = Rs(e), z = C1(), { scopeId: G2 } = Ho();
    oe(() => e.disabled, (ae2) => {
      ae2 && (u.value = false);
    });
    const { contentStyles: re2, updateLocation: q } = r1(e, { isRtl: h2, contentEl: a2, target: A2, isActive: u });
    c1(e, { root: o, contentEl: a2, targetEl: L2, target: A2, isActive: u, updateLocation: q });
    function te2(ae2) {
      r2("click:outside", ae2), e.persistent ? he() : u.value = false;
    }
    function Te(ae2) {
      return u.value && w.value && (!e.scrim || ae2.target === l.value || ae2 instanceof MouseEvent && ae2.shadowTarget === l.value);
    }
    w1(e, { isActive: u, localTop: w, contentEl: a2 }), pe && oe(u, (ae2) => {
      ae2 ? window.addEventListener("keydown", de2) : window.removeEventListener("keydown", de2);
    }, { immediate: true }), Jt(() => {
      pe && window.removeEventListener("keydown", de2);
    });
    function de2(ae2) {
      ae2.key === "Escape" && m.value && (a2.value?.contains(document.activeElement) || r2("keydown", ae2), e.persistent ? he() : (u.value = false, a2.value?.contains(document.activeElement) && x.value?.focus()));
    }
    function Ae(ae2) {
      ae2.key === "Escape" && !m.value || r2("keydown", ae2);
    }
    const U2 = Vg();
    Hs(() => e.closeOnBack, () => {
      Pg(U2, () => {
        if (m.value && u.value) return e.persistent ? he() : u.value = false, false;
      });
    });
    const Z = _e();
    oe(() => u.value && (e.absolute || e.contained) && I2.value == null, (ae2) => {
      if (ae2) {
        const Ve = yc(o.value);
        Ve && Ve !== document.scrollingElement && (Z.value = Ve.scrollTop);
      }
    });
    function he() {
      e.noClickAnimation || a2.value && Gt(a2.value, [{ transformOrigin: "center" }, { transform: "scale(1.03)" }, { transformOrigin: "center" }], { duration: 150, easing: xr });
    }
    function vt2() {
      r2("afterEnter");
    }
    function Qe() {
      g(), r2("afterLeave");
    }
    return Se(() => N(Me, null, [n2.activator?.({ isActive: u.value, targetRef: p2, props: ye({ ref: M2 }, T.value, e.activatorProps) }), z.value && b.value && k(dd, { disabled: !I2.value, to: I2.value }, { default: () => [N("div", ye({ class: ["v-overlay", { "v-overlay--absolute": e.absolute || e.contained, "v-overlay--active": u.value, "v-overlay--contained": e.contained }, f2.value, d.value, e.class], style: [C2.value, { "--v-overlay-opacity": e.opacity, top: J(Z.value) }, e.style], ref: o, onKeydown: Ae }, G2, s), [k(A1, ye({ color: S, modelValue: u.value && !!e.scrim, ref: l }, Y.value), null), k(On, { appear: true, persisted: true, transition: e.transition, target: A2.value, onAfterEnter: vt2, onAfterLeave: Qe }, { default: () => [Rt(N("div", ye({ ref: a2, class: ["v-overlay__content", e.contentClass], style: [F2.value, re2.value] }, H.value, e.contentProps), [n2.default?.({ isActive: u })]), [[Gr, u.value], [Aa, { handler: te2, closeConditional: Te, include: () => [x.value] }]])] })])] })])), { activatorEl: x, scrimEl: l, target: A2, animateClick: he, contentEl: a2, rootEl: o, globalTop: m, localTop: w, updateLocation: q };
  } });
  var k1 = K({ id: String, submenu: Boolean, ...Un(of({ captureFocus: true, closeDelay: 250, closeOnContentClick: true, locationStrategy: "connected", location: void 0, openDelay: 300, scrim: false, scrollStrategy: "reposition", transition: { component: og } }), ["absolute"]) }, "VMenu");
  var T1 = ce()({ name: "VMenu", props: k1(), emits: { "update:modelValue": (e) => true }, setup(e, t2) {
    let { slots: n2 } = t2;
    const s = Wt(e, "modelValue"), { scopeId: r2 } = Ho(), { isRtl: i2 } = en(), o = gu(), l = $(() => e.id || `v-menu-${o}`), a2 = _e(), c2 = Ie(Ui, null), u = le(/* @__PURE__ */ new Set());
    Et(Ui, { register() {
      u.value.add(o);
    }, unregister() {
      u.value.delete(o);
    }, closeParents(g) {
      setTimeout(() => {
        !u.value.size && !e.persistent && (g == null || a2.value?.contentEl && !sh(g, a2.value.contentEl)) && (s.value = false, c2?.closeParents(g));
      }, 40);
    } }), Jt(() => c2?.unregister()), pu(() => s.value = false), oe(s, (g) => {
      g ? c2?.register() : c2?.unregister();
    }, { immediate: true });
    function f2(g) {
      c2?.closeParents(g);
    }
    function d(g) {
      if (!e.disabled) if (g.key === "Tab" || g.key === "Enter" && !e.closeOnContentClick) {
        if (g.key === "Enter" && (g.target instanceof HTMLTextAreaElement || g.target instanceof HTMLInputElement && g.target.closest("form"))) return;
        g.key === "Enter" && g.preventDefault(), !ac(yn(a2.value?.contentEl, false), g.shiftKey ? "prev" : "next", (m) => m.tabIndex >= 0) && !e.retainFocus && (s.value = false, a2.value?.activatorEl?.focus());
      } else e.submenu && g.key === (i2.value ? "ArrowRight" : "ArrowLeft") && (s.value = false, a2.value?.activatorEl?.focus());
    }
    function h2(g) {
      if (e.disabled) return;
      const S = a2.value?.contentEl;
      S && s.value ? g.key === "ArrowDown" ? (g.preventDefault(), g.stopImmediatePropagation(), nr(S, "next")) : g.key === "ArrowUp" ? (g.preventDefault(), g.stopImmediatePropagation(), nr(S, "prev")) : e.submenu && (g.key === (i2.value ? "ArrowRight" : "ArrowLeft") ? s.value = false : g.key === (i2.value ? "ArrowLeft" : "ArrowRight") && (g.preventDefault(), nr(S, "first"))) : (e.submenu ? g.key === (i2.value ? "ArrowLeft" : "ArrowRight") : ["ArrowDown", "ArrowUp"].includes(g.key)) && (s.value = true, g.preventDefault(), setTimeout(() => setTimeout(() => h2(g))));
    }
    const b = D(() => ye({ "aria-haspopup": "menu", "aria-expanded": String(s.value), "aria-controls": l.value, "aria-owns": l.value, onKeydown: h2 }, e.activatorProps));
    return Se(() => {
      const g = ka.filterProps(e);
      return k(ka, ye({ ref: a2, id: l.value, class: ["v-menu", e.class], style: e.style }, g, { modelValue: s.value, "onUpdate:modelValue": (S) => s.value = S, absolute: true, activatorProps: b.value, location: e.location ?? (e.submenu ? "end" : "bottom"), "onClick:outside": f2, onKeydown: d }, r2), { activator: n2.activator, default: function() {
        for (var S = arguments.length, m = new Array(S), w = 0; w < S; w++) m[w] = arguments[w];
        return k(Xe, { root: "VMenu" }, { default: () => [n2.default?.(...m)] });
      } });
    }), Uc({ id: l, \u03A8openChildren: u }, a2);
  } });
  var E1 = K({ ...ke(), ...He() }, "VCardActions");
  var lf = ce()({ name: "VCardActions", props: E1(), setup(e, t2) {
    let { slots: n2 } = t2;
    return Os({ VBtn: { slim: true, variant: "text" } }), Se(() => k(e.tag, { class: ie(["v-card-actions", e.class]), style: ge(e.style) }, n2)), {};
  } });
  var M1 = K({ opacity: [Number, String], ...ke(), ...He() }, "VCardSubtitle");
  var V1 = ce()({ name: "VCardSubtitle", props: M1(), setup(e, t2) {
    let { slots: n2 } = t2;
    return Se(() => k(e.tag, { class: ie(["v-card-subtitle", e.class]), style: ge([{ "--v-card-subtitle-opacity": e.opacity }, e.style]) }, n2)), {};
  } });
  var P1 = yo("v-card-title");
  var I1 = K({ appendAvatar: String, appendIcon: ze, prependAvatar: String, prependIcon: ze, subtitle: { type: [String, Number, Boolean], default: void 0 }, title: { type: [String, Number, Boolean], default: void 0 }, ...ke(), ...zt(), ...He() }, "VCardItem");
  var O1 = ce()({ name: "VCardItem", props: I1(), setup(e, t2) {
    let { slots: n2 } = t2;
    return Se(() => {
      const s = !!(e.prependAvatar || e.prependIcon), r2 = !!(s || n2.prepend), i2 = !!(e.appendAvatar || e.appendIcon), o = !!(i2 || n2.append), l = !!(e.title != null || n2.title), a2 = !!(e.subtitle != null || n2.subtitle);
      return k(e.tag, { class: ie(["v-card-item", e.class]), style: ge(e.style) }, { default: () => [r2 && N("div", { key: "prepend", class: "v-card-item__prepend" }, [n2.prepend ? k(Xe, { key: "prepend-defaults", disabled: !s, defaults: { VAvatar: { density: e.density, image: e.prependAvatar }, VIcon: { density: e.density, icon: e.prependIcon } } }, n2.prepend) : N(Me, null, [e.prependAvatar && k(Vr, { key: "prepend-avatar", density: e.density, image: e.prependAvatar }, null), e.prependIcon && k(it, { key: "prepend-icon", density: e.density, icon: e.prependIcon }, null)])]), N("div", { class: "v-card-item__content" }, [l && k(P1, { key: "title" }, { default: () => [n2.title?.() ?? fs(e.title)] }), a2 && k(V1, { key: "subtitle" }, { default: () => [n2.subtitle?.() ?? fs(e.subtitle)] }), n2.default?.()]), o && N("div", { key: "append", class: "v-card-item__append" }, [n2.append ? k(Xe, { key: "append-defaults", disabled: !i2, defaults: { VAvatar: { density: e.density, image: e.appendAvatar }, VIcon: { density: e.density, icon: e.appendIcon } } }, n2.append) : N(Me, null, [e.appendIcon && k(it, { key: "append-icon", density: e.density, icon: e.appendIcon }, null), e.appendAvatar && k(Vr, { key: "append-avatar", density: e.density, image: e.appendAvatar }, null)])])] });
    }), {};
  } });
  var D1 = K({ opacity: [Number, String], ...ke(), ...He() }, "VCardText");
  var af = ce()({ name: "VCardText", props: D1(), setup(e, t2) {
    let { slots: n2 } = t2;
    return Se(() => k(e.tag, { class: ie(["v-card-text", e.class]), style: ge([{ "--v-card-text-opacity": e.opacity }, e.style]) }, n2)), {};
  } });
  var H1 = K({ appendAvatar: String, appendIcon: ze, disabled: Boolean, flat: Boolean, hover: Boolean, image: String, link: { type: Boolean, default: void 0 }, prependAvatar: String, prependIcon: ze, ripple: { type: [Boolean, Object], default: true }, subtitle: { type: [String, Number, Boolean], default: void 0 }, text: { type: [String, Number, Boolean], default: void 0 }, title: { type: [String, Number, Boolean], default: void 0 }, ...Bs(), ...ke(), ...zt(), ...$s(), ...Ws(), ...Hc(), ...qr(), ...Mo(), ...tn(), ...Io(), ...He(), ...qe(), ...An({ variant: "elevated" }) }, "VCard");
  var F1 = ce()({ name: "VCard", directives: { vRipple: ks }, props: H1(), setup(e, t2) {
    let { attrs: n2, slots: s } = t2;
    const { themeClasses: r2 } = Je(e), { borderClasses: i2 } = Ns(e), { colorClasses: o, colorStyles: l, variantClasses: a2 } = Us(e), { densityClasses: c2 } = sn(e), { dimensionStyles: u } = Rs(e), { elevationClasses: f2 } = zs(e), { loaderClasses: d } = Fc(e), { locationStyles: h2 } = Xr(e), { positionClasses: b } = Vo(e), { roundedClasses: g } = nn(e), S = Po(e, n2), m = le(void 0);
    return oe(() => e.loading, (w, C2) => {
      m.value = !w && typeof C2 == "string" ? C2 : typeof w == "boolean" ? void 0 : w;
    }, { immediate: true }), Se(() => {
      const w = e.link !== false && S.isLink.value, C2 = !e.disabled && e.link !== false && (e.link || S.isClickable.value), x = w ? "a" : e.tag, M2 = !!(s.title || e.title != null), A2 = !!(s.subtitle || e.subtitle != null), L2 = M2 || A2, p2 = !!(s.append || e.appendAvatar || e.appendIcon), T = !!(s.prepend || e.prependAvatar || e.prependIcon), H = !!(s.image || e.image), Y = L2 || T || p2, I2 = !!(s.text || e.text != null);
      return Rt(k(x, ye(S.linkProps, { class: ["v-card", { "v-card--disabled": e.disabled, "v-card--flat": e.flat, "v-card--hover": e.hover && !(e.disabled || e.flat), "v-card--link": C2 }, r2.value, i2.value, o.value, c2.value, f2.value, d.value, b.value, g.value, a2.value, e.class], style: [l.value, u.value, h2.value, { "--v-card-height": J(e.height) }, e.style], onClick: C2 && S.navigate.value, tabindex: e.disabled ? -1 : void 0 }), { default: () => [H && N("div", { key: "image", class: "v-card__image" }, [s.image ? k(Xe, { key: "image-defaults", disabled: !e.image, defaults: { VImg: { cover: true, src: e.image } } }, s.image) : k(ko, { key: "image-img", cover: true, src: e.image }, null)]), k(Tg, { name: "v-card", active: !!e.loading, color: m.value }, { default: s.loader }), Y && k(O1, { key: "item", prependAvatar: e.prependAvatar, prependIcon: e.prependIcon, title: e.title, subtitle: e.subtitle, appendAvatar: e.appendAvatar, appendIcon: e.appendIcon }, { default: s.item, prepend: s.prepend, title: s.title, subtitle: s.subtitle, append: s.append }), I2 && k(af, { key: "text" }, { default: () => [s.text?.() ?? e.text] }), s.default?.(), s.actions && k(lf, null, { default: s.actions }), Ys(C2, "v-card")] }), [[ks, C2 && e.ripple]]);
    }), {};
  } });
  var $1 = (e) => {
    const { touchstartX: t2, touchendX: n2, touchstartY: s, touchendY: r2 } = e, i2 = 0.5, o = 16;
    e.offsetX = n2 - t2, e.offsetY = r2 - s, Math.abs(e.offsetY) < i2 * Math.abs(e.offsetX) && (e.left && n2 < t2 - o && e.left(e), e.right && n2 > t2 + o && e.right(e)), Math.abs(e.offsetX) < i2 * Math.abs(e.offsetY) && (e.up && r2 < s - o && e.up(e), e.down && r2 > s + o && e.down(e));
  };
  function R1(e, t2) {
    const n2 = e.changedTouches[0];
    t2.touchstartX = n2.clientX, t2.touchstartY = n2.clientY, t2.start?.({ originalEvent: e, ...t2 });
  }
  function B1(e, t2) {
    const n2 = e.changedTouches[0];
    t2.touchendX = n2.clientX, t2.touchendY = n2.clientY, t2.end?.({ originalEvent: e, ...t2 }), $1(t2);
  }
  function N1(e, t2) {
    const n2 = e.changedTouches[0];
    t2.touchmoveX = n2.clientX, t2.touchmoveY = n2.clientY, t2.move?.({ originalEvent: e, ...t2 });
  }
  function W1() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const t2 = { touchstartX: 0, touchstartY: 0, touchendX: 0, touchendY: 0, touchmoveX: 0, touchmoveY: 0, offsetX: 0, offsetY: 0, left: e.left, right: e.right, up: e.up, down: e.down, start: e.start, move: e.move, end: e.end };
    return { touchstart: (n2) => R1(n2, t2), touchend: (n2) => B1(n2, t2), touchmove: (n2) => N1(n2, t2) };
  }
  function z1(e, t2) {
    const n2 = t2.value, s = n2?.parent ? e.parentElement : e, r2 = n2?.options ?? { passive: true }, i2 = t2.instance?.$.uid;
    if (!s || i2 === void 0) return;
    const o = W1(t2.value);
    s._touchHandlers = s._touchHandlers ?? /* @__PURE__ */ Object.create(null), s._touchHandlers[i2] = o, Oi(o).forEach((l) => {
      s.addEventListener(l, o[l], r2);
    });
  }
  function j1(e, t2) {
    const n2 = t2.value?.parent ? e.parentElement : e, s = t2.instance?.$.uid;
    if (!n2?._touchHandlers || s === void 0) return;
    const r2 = n2._touchHandlers[s];
    r2 && (Oi(r2).forEach((i2) => {
      n2.removeEventListener(i2, r2[i2]);
    }), delete n2._touchHandlers[s], Oi(n2._touchHandlers).length || delete n2._touchHandlers);
  }
  var Ki = { mounted: z1, unmounted: j1 };
  var uf = /* @__PURE__ */ Symbol.for("vuetify:v-window");
  var cf = /* @__PURE__ */ Symbol.for("vuetify:v-window-group");
  var ff = K({ continuous: Boolean, nextIcon: { type: [Boolean, String, Function, Object], default: "$next" }, prevIcon: { type: [Boolean, String, Function, Object], default: "$prev" }, reverse: Boolean, showArrows: { type: [Boolean, String], validator: (e) => typeof e == "boolean" || e === "hover" }, verticalArrows: [Boolean, String], touch: { type: [Object, Boolean], default: void 0 }, direction: { type: String, default: "horizontal" }, modelValue: null, disabled: Boolean, selectedClass: { type: String, default: "v-window-item--active" }, mandatory: { type: [Boolean, String], default: "force" }, crossfade: Boolean, transitionDuration: Number, ...ke(), ...He(), ...qe() }, "VWindow");
  var Ta = ce()({ name: "VWindow", directives: { vTouch: Ki }, props: ff(), emits: { "update:modelValue": (e) => true }, setup(e, t2) {
    let { slots: n2 } = t2;
    const { themeClasses: s } = Je(e), { isRtl: r2 } = en(), { t: i2 } = Co(), o = Jr(e, cf), l = _e(), a2 = D(() => r2.value ? !e.reverse : e.reverse), c2 = le(false), u = D(() => {
      if (e.crossfade) return "v-window-crossfade-transition";
      const A2 = e.direction === "vertical" ? "y" : "x", p2 = (a2.value ? !c2.value : c2.value) ? "-reverse" : "";
      return `v-window-${A2}${p2}-transition`;
    }), f2 = le(0), d = _e(void 0), h2 = D(() => o.items.value.findIndex((A2) => o.selected.value.includes(A2.id)));
    oe(h2, (A2, L2) => {
      let p2;
      const T = { left: 0, top: 0 };
      pe && L2 >= 0 && (p2 = yc(l.value), T.left = p2?.scrollLeft, T.top = p2?.scrollTop);
      const H = o.items.value.length, Y = H - 1;
      H <= 2 ? c2.value = A2 < L2 : A2 === Y && L2 === 0 ? c2.value = false : A2 === 0 && L2 === Y ? c2.value = true : c2.value = A2 < L2, ct(() => {
        if (!pe || !p2) return;
        p2.scrollTop !== T.top && p2.scrollTo({ ...T, behavior: "instant" }), requestAnimationFrame(() => {
          if (!p2) return;
          p2.scrollTop !== T.top && p2.scrollTo({ ...T, behavior: "instant" });
        });
      });
    }, { flush: "sync" }), Et(uf, { transition: u, isReversed: c2, transitionCount: f2, transitionHeight: d, rootRef: l });
    const b = $(() => e.continuous || h2.value !== 0), g = $(() => e.continuous || h2.value !== o.items.value.length - 1);
    function S() {
      b.value && o.prev();
    }
    function m() {
      g.value && o.next();
    }
    const w = D(() => {
      const A2 = [], L2 = { icon: r2.value ? e.nextIcon : e.prevIcon, class: `v-window__${a2.value ? "right" : "left"}`, onClick: o.prev, "aria-label": i2("$vuetify.carousel.prev") };
      A2.push(b.value ? n2.prev ? n2.prev({ props: L2 }) : k(zn, L2, null) : N("div", null, null));
      const p2 = { icon: r2.value ? e.prevIcon : e.nextIcon, class: `v-window__${a2.value ? "left" : "right"}`, onClick: o.next, "aria-label": i2("$vuetify.carousel.next") };
      return A2.push(g.value ? n2.next ? n2.next({ props: p2 }) : k(zn, p2, null) : N("div", null, null)), A2;
    }), C2 = D(() => e.touch === false ? e.touch : { ...{ left: () => {
      a2.value ? S() : m();
    }, right: () => {
      a2.value ? m() : S();
    }, start: (L2) => {
      let { originalEvent: p2 } = L2;
      p2.stopPropagation();
    } }, ...e.touch === true ? {} : e.touch });
    function x(A2) {
      (e.direction === "horizontal" && A2.key === "ArrowLeft" || e.direction === "vertical" && A2.key === "ArrowUp") && (A2.preventDefault(), S(), ct(() => {
        b.value ? M2(0) : M2(1);
      })), (e.direction === "horizontal" && A2.key === "ArrowRight" || e.direction === "vertical" && A2.key === "ArrowDown") && (A2.preventDefault(), m(), ct(() => {
        g.value ? M2(1) : M2(0);
      }));
    }
    function M2(A2) {
      const L2 = w.value[A2];
      if (!L2) return;
      (Array.isArray(L2) ? L2[0] : L2).el?.focus();
    }
    return Se(() => Rt(k(e.tag, { ref: l, class: ie(["v-window", { "v-window--show-arrows-on-hover": e.showArrows === "hover", "v-window--vertical-arrows": !!e.verticalArrows, "v-window--crossfade": !!e.crossfade }, s.value, e.class]), style: ge([e.style, { "--v-window-transition-duration": Nn() ? null : J(e.transitionDuration, "ms") }]) }, { default: () => [N("div", { class: "v-window__container", style: { height: d.value } }, [n2.default?.({ group: o }), e.showArrows !== false && N("div", { class: ie(["v-window__controls", { "v-window__controls--left": e.verticalArrows === "left" || e.verticalArrows === true }, { "v-window__controls--right": e.verticalArrows === "right" }]), onKeydown: x }, [w.value])]), n2.additional?.({ group: o })] }), [[Ki, C2.value]])), { group: o };
  } });
  var df = K({ reverseTransition: { type: [Boolean, String], default: void 0 }, transition: { type: [Boolean, String], default: void 0 }, ...ke(), ...Eo(), ...tf() }, "VWindowItem");
  var Ea = ce()({ name: "VWindowItem", directives: { vTouch: Ki }, props: df(), emits: { "group:selected": (e) => true }, setup(e, t2) {
    let { slots: n2 } = t2;
    const s = Ie(uf), r2 = Tr(e, cf), { isBooted: i2 } = vg();
    if (!s || !r2) throw new Error("[Vuetify] VWindowItem must be used inside VWindow");
    const o = le(false), l = D(() => i2.value && (s.isReversed.value ? e.reverseTransition !== false : e.transition !== false));
    function a2() {
      !o.value || !s || (o.value = false, s.transitionCount.value > 0 && (s.transitionCount.value -= 1, s.transitionCount.value === 0 && (s.transitionHeight.value = void 0)));
    }
    function c2() {
      o.value || !s || (o.value = true, s.transitionCount.value === 0 && (s.transitionHeight.value = J(s.rootRef.value?.clientHeight)), s.transitionCount.value += 1);
    }
    function u() {
      a2();
    }
    function f2(b) {
      o.value && ct(() => {
        !l.value || !o.value || !s || (s.transitionHeight.value = J(b.clientHeight));
      });
    }
    const d = D(() => {
      const b = s.isReversed.value ? e.reverseTransition : e.transition;
      return l.value ? { name: typeof b != "string" ? s.transition.value : b, onBeforeEnter: c2, onAfterEnter: a2, onEnterCancelled: u, onBeforeLeave: c2, onAfterLeave: a2, onLeaveCancelled: u, onEnter: f2 } : false;
    }), { hasContent: h2 } = nf(e, r2.isSelected);
    return Se(() => k(On, { transition: d.value, disabled: !i2.value }, { default: () => [Rt(N("div", { class: ie(["v-window-item", r2.selectedClass.value, e.class]), style: ge(e.style) }, [h2.value && n2.default?.()]), [[Gr, r2.isSelected.value]])] })), { groupItem: r2 };
  } });
  var Y1 = K({ fixedHeader: Boolean, fixedFooter: Boolean, height: [Number, String], hover: Boolean, striped: { type: String, default: null, validator: (e) => ["even", "odd"].includes(e) }, ...ke(), ...zt(), ...He(), ...qe() }, "VTable");
  var U1 = ce()({ name: "VTable", props: Y1(), setup(e, t2) {
    let { slots: n2, emit: s } = t2;
    const { themeClasses: r2 } = Je(e), { densityClasses: i2 } = sn(e);
    return Se(() => k(e.tag, { class: ie(["v-table", { "v-table--fixed-height": !!e.height, "v-table--fixed-header": e.fixedHeader, "v-table--fixed-footer": e.fixedFooter, "v-table--has-top": !!n2.top, "v-table--has-bottom": !!n2.bottom, "v-table--hover": e.hover, "v-table--striped-even": e.striped === "even", "v-table--striped-odd": e.striped === "odd" }, r2.value, i2.value, e.class]), style: ge(e.style) }, { default: () => [n2.top?.(), n2.default ? N("div", { class: "v-table__wrapper", style: { height: J(e.height) } }, [N("table", null, [n2.default()])]) : n2.wrapper?.(), n2.bottom?.()] })), {};
  } });
  var K1 = yo("v-spacer", "div", "VSpacer");
  var Fo = /* @__PURE__ */ Symbol.for("vuetify:v-tabs");
  var vf = K({ fixed: Boolean, sliderColor: String, sliderTransition: String, sliderTransitionDuration: [String, Number], hideSlider: Boolean, inset: Boolean, direction: { type: String, default: "horizontal" }, ...Un(Yc({ selectedClass: "v-tab--selected", variant: "text" }), ["active", "block", "flat", "location", "position", "symbol"]) }, "VTab");
  var hf = ce()({ name: "VTab", props: vf(), setup(e, t2) {
    let { slots: n2, attrs: s } = t2;
    const { textColorClasses: r2, textColorStyles: i2 } = xn(() => e.sliderColor), { backgroundColorClasses: o, backgroundColorStyles: l } = wn(() => e.sliderColor), a2 = _e(), c2 = _e(), u = D(() => e.direction === "horizontal"), f2 = D(() => a2.value?.group?.isSelected.value ?? false);
    function d(S, m) {
      return { opacity: [0, 1] };
    }
    function h2(S, m) {
      return e.direction === "vertical" ? { transform: ["scaleY(0)", "scaleY(1)"] } : { transform: ["scaleX(0)", "scaleX(1)"] };
    }
    function b(S, m) {
      const w = m.getBoundingClientRect(), C2 = S.getBoundingClientRect(), x = u.value ? "x" : "y", M2 = u.value ? "X" : "Y", A2 = u.value ? "right" : "bottom", L2 = u.value ? "width" : "height", p2 = w[x], T = C2[x], H = p2 > T ? w[A2] - C2[A2] : w[x] - C2[x], Y = Math.sign(H) > 0 ? u.value ? "right" : "bottom" : Math.sign(H) < 0 ? u.value ? "left" : "top" : "center", F2 = (Math.abs(H) + (Math.sign(H) < 0 ? w[L2] : C2[L2])) / Math.max(w[L2], C2[L2]) || 0, z = w[L2] / C2[L2] || 0, G2 = 1.5;
      return { transform: [`translate${M2}(${H}px) scale${M2}(${z})`, `translate${M2}(${H / G2}px) scale${M2}(${(F2 - 1) / G2 + 1})`, "none"], transformOrigin: Array(3).fill(Y) };
    }
    function g(S) {
      let { value: m } = S;
      if (m) {
        const w = a2.value?.$el.parentElement?.querySelector(".v-tab--selected .v-tab__slider"), C2 = c2.value;
        if (!w || !C2) return;
        const x = getComputedStyle(w).backgroundColor, M2 = { fade: d, grow: h2, shift: b }[e.sliderTransition ?? "shift"] ?? b, A2 = Number(e.sliderTransitionDuration) || ({ fade: 400, grow: 350, shift: 225 }[e.sliderTransition ?? "shift"] ?? 225);
        Gt(C2, { backgroundColor: [x, x], ...M2(C2, w) }, { duration: A2, easing: xr });
      }
    }
    return Se(() => {
      const S = zn.filterProps(e);
      return k(zn, ye({ symbol: Fo, ref: a2, class: ["v-tab", e.class, f2.value && e.inset ? o.value : []], style: [e.style, f2.value && e.inset ? l.value : [], { backgroundColor: f2.value && e.inset ? "transparent !important" : void 0 }], tabindex: f2.value ? 0 : -1, role: "tab", "aria-selected": String(f2.value), active: false }, S, s, { block: e.fixed, maxWidth: e.fixed ? 300 : void 0, "onGroup:selected": g }), { ...n2, default: () => N(Me, null, [n2.default?.() ?? e.text, !e.hideSlider && N("div", { ref: c2, class: ie(["v-tab__slider", e.inset ? o.value : r2.value]), style: ge([i2.value, e.inset ? l.value : r2.value]) }, null)]) });
    }), Uc({}, a2);
  } });
  var G1 = K({ ...Un(ff(), ["continuous", "nextIcon", "prevIcon", "showArrows", "touch", "mandatory"]) }, "VTabsWindow");
  var Z1 = ce()({ name: "VTabsWindow", props: G1(), emits: { "update:modelValue": (e) => true }, setup(e, t2) {
    let { slots: n2 } = t2;
    const s = Ie(Fo, null), r2 = Wt(e, "modelValue"), i2 = D({ get() {
      return r2.value != null || !s ? r2.value : s.items.value.find((o) => s.selected.value.includes(o.id))?.value;
    }, set(o) {
      r2.value = o;
    } });
    return Se(() => {
      const o = Ta.filterProps(e);
      return k(Ta, ye({ _as: "VTabsWindow" }, o, { modelValue: i2.value, "onUpdate:modelValue": (l) => i2.value = l, class: ["v-tabs-window", e.class], style: e.style, mandatory: false, touch: false }), n2);
    }), {};
  } });
  var q1 = K({ ...df() }, "VTabsWindowItem");
  var X1 = ce()({ name: "VTabsWindowItem", props: q1(), setup(e, t2) {
    let { slots: n2 } = t2;
    return Se(() => {
      const s = Ea.filterProps(e);
      return k(Ea, ye({ _as: "VTabsWindowItem" }, s, { class: ["v-tabs-window-item", e.class], style: e.style }), n2);
    }), {};
  } });
  function J1(e) {
    return e ? e.map((t2) => br(t2) ? t2 : { text: t2, value: t2 }) : [];
  }
  var Q1 = K({ alignTabs: { type: String, default: "start" }, color: String, fixedTabs: Boolean, items: { type: Array, default: () => [] }, stacked: Boolean, bgColor: String, grow: Boolean, height: { type: [Number, String], default: void 0 }, hideSlider: Boolean, inset: Boolean, insetPadding: [String, Number], insetRadius: [String, Number], sliderColor: String, ...sc(vf(), ["spaced", "sliderTransition", "sliderTransitionDuration"]), ...Oo({ mandatory: "force", selectedClass: "v-tab-item--selected" }), ...zt(), ...He() }, "VTabs");
  var ey = ce()({ name: "VTabs", props: Q1(), emits: { "update:modelValue": (e) => true }, setup(e, t2) {
    let { attrs: n2, slots: s } = t2;
    const r2 = Wt(e, "modelValue"), i2 = D(() => J1(e.items)), { densityClasses: o } = sn(e), { backgroundColorClasses: l, backgroundColorStyles: a2 } = wn(() => e.bgColor), { scopeId: c2 } = Ho();
    return Os({ VTab: { color: $(e, "color"), direction: $(e, "direction"), stacked: $(e, "stacked"), fixed: $(e, "fixedTabs"), inset: $(e, "inset"), sliderColor: $(e, "sliderColor"), sliderTransition: $(e, "sliderTransition"), sliderTransitionDuration: $(e, "sliderTransitionDuration"), hideSlider: $(e, "hideSlider") } }), Se(() => {
      const u = Pr.filterProps(e), f2 = !!(s.window || e.items.length > 0);
      return N(Me, null, [k(Pr, ye(u, { modelValue: r2.value, "onUpdate:modelValue": (d) => r2.value = d, class: ["v-tabs", `v-tabs--${e.direction}`, `v-tabs--align-tabs-${e.alignTabs}`, { "v-tabs--fixed-tabs": e.fixedTabs, "v-tabs--grow": e.grow, "v-tabs--inset": e.inset, "v-tabs--stacked": e.stacked }, o.value, l.value, e.class], style: [{ "--v-tabs-height": J(e.height), "--v-tabs-inset-padding": e.inset ? J(e.insetPadding) : void 0, "--v-tabs-inset-radius": e.inset ? J(e.insetRadius) : void 0 }, a2.value, e.style], role: "tablist", symbol: Fo }, c2, n2), { default: s.default ?? (() => i2.value.map((d) => s.tab?.({ item: d }) ?? k(hf, ye(d, { key: d.text, value: d.value, spaced: e.spaced }), { default: s[`tab.${d.value}`] ? () => s[`tab.${d.value}`]?.({ item: d }) : void 0 }))), prev: s.prev, next: s.next }), f2 && k(Z1, ye({ modelValue: r2.value, "onUpdate:modelValue": (d) => r2.value = d, key: "tabs-window" }, c2), { default: () => [i2.value.map((d) => s.item?.({ item: d }) ?? k(X1, { value: d.value }, { default: () => s[`item.${d.value}`]?.({ item: d }) })), s.window?.()] })]);
    }), {};
  } });
  var ty = { collapse: "svg:M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z", complete: "svg:M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z", cancel: "svg:M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z", close: "svg:M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", delete: "svg:M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z", clear: "svg:M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z", success: "svg:M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z", info: "svg:M13,9H11V7H13M13,17H11V11H13M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z", warning: "svg:M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z", error: "svg:M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z", prev: "svg:M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z", next: "svg:M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", checkboxOn: "svg:M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z", checkboxOff: "svg:M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z", checkboxIndeterminate: "svg:M17,13H7V11H17M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z", delimiter: "svg:M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z", sortAsc: "svg:M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", sortDesc: "svg:M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", expand: "svg:M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", menu: "svg:M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", subgroup: "svg:M7,10L12,15L17,10H7Z", dropdown: "svg:M7,10L12,15L17,10H7Z", radioOn: "svg:M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,7C9.24,7 7,9.24 7,12C7,14.76 9.24,17 12,17C14.76,17 17,14.76 17,12C17,9.24 14.76,7 12,7Z", radioOff: "svg:M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z", edit: "svg:M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z", ratingEmpty: "svg:M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z", ratingFull: "svg:M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z", ratingHalf: "svg:M12,15.4V6.1L13.71,10.13L18.09,10.5L14.77,13.39L15.76,17.67M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z", loading: "svg:M19,8L15,12H18C18,15.31 15.31,18 12,18C11,18 10.03,17.75 9.2,17.3L7.74,18.76C8.97,19.54 10.43,20 12,20C16.42,20 20,16.42 20,12H23M6,12C6,8.69 8.69,6 12,6C13,6 13.97,6.25 14.8,6.7L16.26,5.24C15.03,4.46 13.57,4 12,4C7.58,4 4,7.58 4,12H1L5,16L9,12", first: "svg:M18.41,16.59L13.82,12L18.41,7.41L17,6L11,12L17,18L18.41,16.59M6,6H8V18H6V6Z", last: "svg:M5.59,7.41L10.18,12L5.59,16.59L7,18L13,12L7,6L5.59,7.41M16,6H18V18H16V6Z", unfold: "svg:M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z", file: "svg:M16.5,6V17.5C16.5,19.71 14.71,21.5 12.5,21.5C10.29,21.5 8.5,19.71 8.5,17.5V5C8.5,3.62 9.62,2.5 11,2.5C12.38,2.5 13.5,3.62 13.5,5V15.5C13.5,16.05 13.05,16.5 12.5,16.5C11.95,16.5 11.5,16.05 11.5,15.5V6H10V15.5C10,16.88 11.12,18 12.5,18C13.88,18 15,16.88 15,15.5V5C15,2.79 13.21,1 11,1C8.79,1 7,2.79 7,5V17.5C7,20.54 9.46,23 12.5,23C15.54,23 18,20.54 18,17.5V6H16.5Z", plus: "svg:M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", minus: "svg:M19,13H5V11H19V13Z", calendar: "svg:M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z", treeviewCollapse: "svg:M7,10L12,15L17,10H7Z", treeviewExpand: "svg:M10,17L15,12L10,7V17Z", tableGroupExpand: "svg:M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", tableGroupCollapse: "svg:M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", eyeDropper: "svg:M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z", upload: "svg:M11 20H6.5q-2.28 0-3.89-1.57Q1 16.85 1 14.58q0-1.95 1.17-3.48q1.18-1.53 3.08-1.95q.63-2.3 2.5-3.72Q9.63 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1.88-1.31 3.19T18.5 20H13v-7.15l1.6 1.55L16 13l-4-4l-4 4l1.4 1.4l1.6-1.55Z", color: "svg:M17.5 12a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 17.5 9a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-3-4A1.5 1.5 0 0 1 13 6.5A1.5 1.5 0 0 1 14.5 5A1.5 1.5 0 0 1 16 6.5A1.5 1.5 0 0 1 14.5 8m-5 0A1.5 1.5 0 0 1 8 6.5A1.5 1.5 0 0 1 9.5 5A1.5 1.5 0 0 1 11 6.5A1.5 1.5 0 0 1 9.5 8m-3 4A1.5 1.5 0 0 1 5 10.5A1.5 1.5 0 0 1 6.5 9A1.5 1.5 0 0 1 8 10.5A1.5 1.5 0 0 1 6.5 12M12 3a9 9 0 0 0-9 9a9 9 0 0 0 9 9a1.5 1.5 0 0 0 1.5-1.5c0-.39-.15-.74-.39-1c-.23-.27-.38-.62-.38-1a1.5 1.5 0 0 1 1.5-1.5H16a5 5 0 0 0 5-5c0-4.42-4.03-8-9-8", command: "svg:M6,2A4,4 0 0,1 10,6V8H14V6A4,4 0 0,1 18,2A4,4 0 0,1 22,6A4,4 0 0,1 18,10H16V14H18A4,4 0 0,1 22,18A4,4 0 0,1 18,22A4,4 0 0,1 14,18V16H10V18A4,4 0 0,1 6,22A4,4 0 0,1 2,18A4,4 0 0,1 6,14H8V10H6A4,4 0 0,1 2,6A4,4 0 0,1 6,2M16,18A2,2 0 0,0 18,20A2,2 0 0,0 20,18A2,2 0 0,0 18,16H16V18M14,10H10V14H14V10M6,16A2,2 0 0,0 4,18A2,2 0 0,0 6,20A2,2 0 0,0 8,18V16H6M8,6A2,2 0 0,0 6,4A2,2 0 0,0 4,6A2,2 0 0,0 6,8H8V6M18,8A2,2 0 0,0 20,6A2,2 0 0,0 18,4A2,2 0 0,0 16,6V8H18Z", ctrl: "svg:M19.78,11.78L18.36,13.19L12,6.83L5.64,13.19L4.22,11.78L12,4L19.78,11.78Z", space: "svg:M3 15H5V19H19V15H21V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15Z", shift: "svg:M15 18v-6h2.17L12 6.83L6.83 12H9v6zM12 4l10 10h-5v6H7v-6H2z", alt: "svg:M3 4h6.11l7.04 14H21v2h-6.12L7.84 6H3zm11 0h7v2h-7z", enter: "svg:M19 7v4H5.83l3.58-3.59L8 6l-6 6l6 6l1.41-1.42L5.83 13H21V7z", arrowup: "svg:M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8z", arrowdown: "svg:M11 4h2v12l5.5-5.5l1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5L11 16z", arrowleft: "svg:M20 11v2H8l5.5 5.5l-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5L8 11z", arrowright: "svg:M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z", backspace: "svg:M19 15.59L17.59 17L14 13.41L10.41 17L9 15.59L12.59 12L9 8.41L10.41 7L14 10.59L17.59 7L19 8.41L15.41 12zM22 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7c-.69 0-1.23-.36-1.59-.89L0 12l5.41-8.12C5.77 3.35 6.31 3 7 3zm0 2H7l-4.72 7L7 19h15z", play: "svg:M8,5.14V19.14L19,12.14L8,5.14Z", pause: "svg:M14,19H18V5H14M6,19H10V5H6V19Z", fullscreen: "svg:M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z", fullscreenExit: "svg:M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z", volumeHigh: "svg:M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z", volumeMedium: "svg:M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z", volumeLow: "svg:M7,9V15H11L16,20V4L11,9H7Z", volumeOff: "svg:M5.64,3.64L21.36,19.36L19.95,20.78L16,16.83V20L11,15H7V9H8.17L4.22,5.05L5.64,3.64M16,4V11.17L12.41,7.58L16,4Z", search: "svg:M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" };
  var ny = { component: bo };
  var sy = "light";
  function wy(e) {
    return Tc({ components: { VApp: sg, VAlert: Yg, VBtn: zn, VCard: F1, VCardActions: lf, VCardText: af, VChip: Jg, VDivider: t1, VImg: ko, VMenu: T1, VProgressCircular: Dc, VSpacer: K1, VTab: hf, VTable: U1, VTabs: ey }, icons: { defaultSet: "mdi", aliases: ty, sets: { mdi: ny } }, defaults: { global: { attach: e } }, theme: { defaultTheme: sy } });
  }

  // dist-firefox/assets/index.safari.js-k77OHmOm.js
  var L = /images\.neopets\.com\/items\//i;
  var ct2 = 'img, [data-src], [data-image], [style*="background-image"]';
  var lt2 = 30;
  var M = "neosnipeBadged";
  var $2 = (t2) => String(t2 ?? "").replace(/\s+/g, " ").trim();
  function F(t2) {
    if (t2.tagName === "IMG" && L.test(t2.src)) return t2.src;
    const e = t2.dataset || {};
    for (const s of [e.image, e.src]) if (s && L.test(s)) return s;
    const o = t2.style?.backgroundImage;
    if (o) {
      const s = o.match(/url\(["']?([^"')]+)/);
      if (s && L.test(s[1])) return s[1];
    }
    return null;
  }
  function dt2(t2) {
    return t2.offsetWidth || Number(t2.getAttribute("width")) || t2.naturalWidth || 0;
  }
  function ut2(t2) {
    if (!F(t2)) return false;
    const e = dt2(t2);
    return e === 0 || e >= lt2;
  }
  function pt(t2 = document) {
    return [...t2.querySelectorAll(ct2)].filter((e) => !e.dataset[M] && ut2(e));
  }
  function mt2(t2) {
    return (String(t2 || "").split("?")[0].split("/").pop() || "").replace(/\.[a-z0-9]+$/i, "") || null;
  }
  var ft2 = ".item-name-text, .sdb-item-name, .item-name";
  function yt(t2) {
    let e = t2;
    for (let o = 0; o < 4 && e; o++, e = e.parentElement) {
      const s = e.querySelector?.(ft2), a2 = $2(s?.textContent);
      if (a2) return a2;
    }
    return null;
  }
  function _t2(t2) {
    const e = t2.closest("tr, li");
    if (!e) return null;
    for (const o of e.querySelectorAll("a")) {
      const s = o.getAttribute("href") || "";
      if (/user=|randomfriend|neomail/i.test(s) || /button/i.test(o.className || "") || o.contains(t2)) continue;
      const a2 = $2(o.textContent);
      if (a2 && a2.length <= 80) return a2;
    }
    return null;
  }
  function ht2(t2) {
    const e = $2(t2.dataset?.itemname) || $2(t2.dataset?.name);
    if (e) return e;
    const o = yt(t2);
    if (o) return o;
    if (t2.tagName === "IMG") {
      const s = $2(t2.getAttribute("alt"));
      if (s) return s;
    }
    return _t2(t2);
  }
  function gt2(t2) {
    const e = String(t2.dataset?.link || "").match(/obj_info_id=(\d+)/);
    if (e) return e[1];
    const s = (t2.closest('a[href*="obj_info_id"]') || t2.parentElement?.querySelector?.('a[href*="obj_info_id"]'))?.getAttribute("href")?.match(/obj_info_id=(\d+)/);
    return s ? s[1] : null;
  }
  function vt(t2) {
    const e = ht2(t2);
    return e ? { name: e, imageHash: mt2(F(t2)), itemId: gt2(t2) } : null;
  }
  var v = "neosnipe-badge";
  var C = "neosnipe-anchor";
  var bt = `
.${v} {
  position: absolute; right: 0; bottom: 0; z-index: 20;
  width: 16px; height: 16px; padding: 0; margin: 0;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(0,0,0,.25); border-radius: 50%;
  background: #fff; color: #1f6feb; cursor: pointer; line-height: 1;
  font-size: 10px; opacity: .45; transition: opacity .12s ease, transform .12s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
}
.${v}:hover, .${v}:focus-visible { opacity: 1; transform: scale(1.15); }
.${C}:hover > .${v} { opacity: 1; }

/* "Only show badges on hover" keeps them out of the way until you go looking. */
body[data-neosnipe-hover-only] .${v} { opacity: 0; }
body[data-neosnipe-hover-only] .${C}:hover > .${v},
body[data-neosnipe-hover-only] .${v}:focus-visible,
body[data-neosnipe-hover-only] .${v}[data-state] { opacity: 1; }
.${v}[data-state="loading"] { opacity: 1; color: #999; }
.${v}[data-state="error"]   { opacity: 1; color: #d33; }
.${v} svg { width: 10px; height: 10px; fill: currentColor; }
`;
  var St2 = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3a6.5 6.5 0 0 1 5.25 10.33l5.46 5.46-1.42 1.42-5.46-5.46A6.5 6.5 0 1 1 9.5 3zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/></svg>';
  var R = false;
  function kt2() {
    if (R) return;
    R = true;
    const t2 = document.createElement("style");
    t2.dataset.neosnipe = "badge", t2.textContent = bt, document.head.appendChild(t2);
  }
  function wt2(t2) {
    if (t2.tagName !== "IMG") return getComputedStyle(t2).position === "static" && (t2.style.position = "relative"), t2.classList.add(C), t2;
    const e = t2, o = e.parentElement;
    if (!o) return null;
    if (o.querySelectorAll("img").length > 1) {
      const a2 = document.createElement("span");
      return a2.dataset.neosnipe = "wrap", a2.className = C, a2.style.cssText = "position:relative;display:inline-block;line-height:0", e.replaceWith(a2), a2.appendChild(e), a2;
    }
    return getComputedStyle(o).position === "static" && (o.style.position = "relative"), o.classList.add(C), o;
  }
  function xt2(t2, e, o) {
    const s = wt2(t2);
    if (!s) return null;
    kt2(), t2.dataset[M] = "1";
    const a2 = document.createElement("button");
    return a2.type = "button", a2.className = v, a2.innerHTML = St2, a2.title = `neo-snipe: look up "${e.name}"`, a2.setAttribute("aria-label", a2.title), a2.addEventListener("click", (u) => {
      u.preventDefault(), u.stopPropagation(), o(a2, e);
    }), s.appendChild(a2), a2;
  }
  function A(t2, e) {
    e ? t2.dataset.state = e : delete t2.dataset.state;
  }
  function $t2(t2) {
    let e = null;
    function o() {
      return e || (e = (async () => {
        const { mount: p2, store: k2 } = await t2();
        return await p2.mountPopover(), k2;
      })()), e;
    }
    async function s(p2, k2) {
      A(p2, "loading");
      try {
        const g = await o();
        await g.openFor(p2, k2), A(p2, g.state.error ? "error" : null);
      } catch (g) {
        console.error("[neo-snipe] failed to open popover", g), A(p2, "error");
      }
    }
    function a2(p2 = document) {
      for (const k2 of pt(p2)) {
        const g = vt(k2);
        if (!g) {
          k2.dataset[M] = "skip";
          continue;
        }
        xt2(k2, g, s);
      }
    }
    let u = null;
    const y2 = new MutationObserver(() => {
      u || (u = setTimeout(() => {
        u = null, a2();
      }, 150));
    });
    document.documentElement.dataset.neosnipe = "active", p().then(({ hoverOnly: p2 }) => {
      p2 ? document.body.dataset.neosnipeHoverOnly = "" : delete document.body.dataset.neosnipeHoverOnly;
    }), a2(), y2.observe(document.body, { childList: true, subtree: true });
  }
  var n = $e({ open: false, anchor: null, item: null, data: null, error: null, loading: false, tab: "price", tp: { loading: false, data: null, error: null } });
  var I = 0;
  async function D2(t2, e) {
    if (n.open && n.anchor === t2) {
      n.open = false;
      return;
    }
    const o = ++I;
    Object.assign(n, { open: true, anchor: t2, item: e, data: null, error: null, loading: true, tab: "price" }), n.tp = { loading: false, data: null, error: null };
    const s = await a({ type: y, item: e });
    o === I && (n.loading = false, s?.ok ? n.data = s.data : n.error = j(s));
  }
  var j = (t2) => {
    const e = t2?.error || "internal";
    return { code: e, text: f[e] || "Something went wrong.", detail: t2?.detail };
  };
  async function U() {
    if (n.tp.loading || n.tp.data) return;
    const t2 = n.data?.itemId;
    if (!t2) {
      n.tp.error = j({ error: "no_item_id" });
      return;
    }
    const e = I;
    n.tp = { loading: true, data: null, error: null };
    const o = await a({ type: h, itemId: t2 });
    e === I && (n.tp.loading = false, o?.ok ? n.tp.data = o.data : n.tp.error = j(o));
  }
  function G(t2) {
    n.tab = t2, t2 === "tp" && U();
  }
  function W() {
    n.tp = { loading: false, data: null, error: null }, U();
  }
  function K2() {
    if (n.item && n.anchor) {
      const { anchor: t2, item: e } = n;
      n.anchor = null, D2(t2, e);
    }
  }
  function J2() {
    n.open = false;
  }
  var Ct2 = Object.freeze(Object.defineProperty({ __proto__: null, close: J2, loadTradingPost: U, openFor: D2, retry: K2, retryTradingPost: W, selectTab: G, state: n }, Symbol.toStringTag, { value: "Module" }));
  var Et2 = { class: "ns-card" };
  var Nt2 = { class: "ns-head" };
  var It2 = ["src", "alt"];
  var Ot2 = { class: "ns-head-text" };
  var Pt2 = { class: "ns-name" };
  var Tt2 = { class: "ns-chips" };
  var Lt2 = { key: 0 };
  var At2 = { class: "ns-price" };
  var jt2 = { class: "ns-price-value" };
  var zt2 = { class: "ns-price-date" };
  var Mt2 = { key: 0, class: "ns-desc" };
  var Ut2 = { class: "ns-meta" };
  var Ht2 = { key: 0 };
  var Rt2 = { key: 1, class: "ns-cached" };
  var Bt2 = { __name: "PriceCard", props: { data: { type: Object, required: true } }, setup(t2) {
    const e = t2, o = (a2) => a2 == null ? "\u2014" : `${a2.toLocaleString("en-US")} NP`, s = D(() => {
      const a2 = e.data.rarity;
      return a2 == null ? "grey" : a2 >= 180 ? "deep-purple" : a2 >= 100 ? "red" : a2 >= 90 ? "orange" : a2 >= 80 ? "blue" : "grey";
    });
    return (a2, u) => {
      const y2 = iy("v-chip");
      return Xd(), ly("div", Et2, [N("div", Nt2, [t2.data.imageUrl ? (Xd(), ly("img", { key: 0, src: t2.data.imageUrl, alt: t2.data.name, class: "ns-img" }, null, 8, It2)) : nv("", true), N("div", Ot2, [N("div", Pt2, fs(t2.data.name), 1), N("div", Tt2, [t2.data.rarity !== null ? (Xd(), Jd(y2, { key: 0, size: "x-small", color: s.value, variant: "flat" }, { default: id(() => [tv(" r" + fs(t2.data.rarity), 1), t2.data.rarityLabel ? (Xd(), ly("span", Lt2, "\xA0" + fs(t2.data.rarityLabel), 1)) : nv("", true)]), _: 1 }, 8, ["color"])) : nv("", true), t2.data.category ? (Xd(), Jd(y2, { key: 1, size: "x-small", variant: "tonal" }, { default: id(() => [tv(fs(t2.data.category), 1)]), _: 1 })) : nv("", true)])])]), N("div", At2, [N("div", jt2, fs(t2.data.priceText || o(t2.data.estimatedPrice)), 1), N("div", zt2, [t2.data.priceAsOf ? (Xd(), ly(Me, { key: 0 }, [tv("as of " + fs(t2.data.priceAsOf), 1)], 64)) : (Xd(), ly(Me, { key: 1 }, [tv("no dated price")], 64))])]), t2.data.description ? (Xd(), ly("p", Mt2, fs(t2.data.description), 1)) : nv("", true), N("div", Ut2, [t2.data.neopetsEstValue ? (Xd(), ly("span", Ht2, "NP est. value " + fs(o(t2.data.neopetsEstValue)), 1)) : nv("", true), t2.data.cached ? (Xd(), ly("span", Rt2, "cached")) : nv("", true)])]);
    };
  } };
  var Vt2 = hy(Bt2, [["__scopeId", "data-v-b9f55932"]]);
  var qt2 = { class: "ns-tabs-wrap" };
  var Ft2 = { class: "ns-tab-window" };
  var Dt2 = { class: "ns-num" };
  var Gt2 = { key: 1, class: "ns-empty" };
  var Wt2 = { key: 0, class: "ns-tp-loading" };
  var Kt2 = { class: "ns-tp-stats" };
  var Jt2 = { key: 0 };
  var Xt2 = { key: 1 };
  var Yt2 = { key: 2 };
  var Zt2 = { key: 0, class: "ns-empty" };
  var Qt2 = ["title"];
  var te = { class: "ns-num" };
  var ee2 = { key: 1, class: "ns-noprice" };
  var ne = { class: "ns-owner" };
  var ae = { key: 2, class: "ns-empty" };
  var oe2 = { __name: "HistoryTabs", props: { data: { type: Object, required: true } }, setup(t2) {
    const e = t2, o = (u) => u == null ? "\u2014" : `${u.toLocaleString("en-US")} NP`, s = D(() => (e.data.history || []).filter((u) => u.date)), a2 = D(() => n.tp.data?.lots || []);
    return (u, y2) => {
      const p2 = iy("v-tab"), k2 = iy("v-tabs"), g = iy("v-table"), O = iy("v-progress-circular"), P = iy("v-btn"), T = iy("v-alert");
      return Xd(), ly("div", qt2, [k(k2, { "model-value": Zt(n).tab, density: "compact", height: "30", class: "ns-tabs", "onUpdate:modelValue": Zt(G) }, { default: id(() => [k(p2, { value: "price", class: "ns-tab" }, { default: id(() => [...y2[0] || (y2[0] = [tv("Price History", -1)])]), _: 1 }), k(p2, { value: "tp", class: "ns-tab" }, { default: id(() => [...y2[1] || (y2[1] = [tv("TP History", -1)])]), _: 1 })]), _: 1 }, 8, ["model-value", "onUpdate:modelValue"]), N("div", Ft2, [Zt(n).tab === "price" ? (Xd(), ly(Me, { key: 0 }, [s.value.length ? (Xd(), Jd(g, { key: 0, density: "compact", class: "ns-rows" }, { default: id(() => [N("tbody", null, [(Xd(true), ly(Me, null, oy(s.value, (m) => (Xd(), ly("tr", { key: m.date }, [N("td", null, fs(m.date), 1), N("td", Dt2, fs(o(m.price)), 1), N("td", { class: ie(["ns-num", m.change > 0 ? "ns-up" : m.change < 0 ? "ns-down" : ""]) }, [m.change ? (Xd(), ly(Me, { key: 0 }, [tv(fs(m.change > 0 ? "+" : "") + fs(m.change.toLocaleString("en-US")), 1)], 64)) : nv("", true)], 2)]))), 128))])]), _: 1 })) : (Xd(), ly("p", Gt2, "No price history."))], 64)) : (Xd(), ly(Me, { key: 1 }, [Zt(n).tp.loading ? (Xd(), ly("div", Wt2, [k(O, { indeterminate: "", size: "22", width: "2" }), y2[2] || (y2[2] = N("span", null, "Loading trading post history\u2026", -1))])) : Zt(n).tp.error ? (Xd(), Jd(T, { key: 1, type: "warning", variant: "tonal", density: "compact", class: "ns-tp-error" }, { default: id(() => [N("div", null, fs(Zt(n).tp.error.text), 1), k(P, { size: "x-small", variant: "text", class: "mt-1", onClick: Zt(W) }, { default: id(() => [...y2[3] || (y2[3] = [tv("Retry", -1)])]), _: 1 }, 8, ["onClick"])]), _: 1 })) : Zt(n).tp.data ? (Xd(), ly(Me, { key: 2 }, [N("div", Kt2, [Zt(n).tp.data.lastSeen ? (Xd(), ly("span", Jt2, "last seen " + fs(Zt(n).tp.data.lastSeen), 1)) : nv("", true), Zt(n).tp.data.uniqueOwners90d ? (Xd(), ly("span", Xt2, fs(Zt(n).tp.data.uniqueOwners90d.toLocaleString("en-US")) + " owners/90d", 1)) : nv("", true), Zt(n).tp.data.appearances90d ? (Xd(), ly("span", Yt2, fs(Zt(n).tp.data.appearances90d.toLocaleString("en-US")) + " lots/90d", 1)) : nv("", true)]), !a2.value.length && Zt(n).tp.data.unavailableReason ? (Xd(), ly("p", Zt2, fs(Zt(n).tp.data.unavailableReason), 1)) : a2.value.length ? (Xd(), Jd(g, { key: 1, density: "compact", class: "ns-rows" }, { default: id(() => [N("tbody", null, [(Xd(true), ly(Me, null, oy(a2.value, (m) => (Xd(), ly("tr", { key: m.lot }, [N("td", null, [tv(fs(m.date) + " ", 1), m.items > 1 ? (Xd(), ly("span", { key: 0, class: "ns-bundle", title: `lot of ${m.items} items` }, "\xD7" + fs(m.items), 9, Qt2)) : nv("", true)]), N("td", te, [m.price !== null ? (Xd(), ly(Me, { key: 0 }, [tv(fs(o(m.price)), 1)], 64)) : (Xd(), ly("em", ee2, "bundle"))]), N("td", ne, fs(m.owner), 1)]))), 128))])]), _: 1 })) : (Xd(), ly("p", ae, "No trading post lots recorded."))], 64)) : nv("", true)], 64))])]);
    };
  } };
  var se2 = hy(oe2, [["__scopeId", "data-v-4fc488df"]]);
  var re = { key: 0, class: "ns-center" };
  var ie2 = { class: "ns-loading-label" };
  var ce2 = { key: 0, class: "ns-detail" };
  var le2 = { __name: "PricePopover", props: { attach: { type: [Object, String, Boolean], default: false } }, setup(t2) {
    const e = D({ get: () => n.open, set: (o) => {
      o || J2();
    } });
    return (o, s) => {
      const a2 = iy("v-progress-circular"), u = iy("v-alert"), y2 = iy("v-card-text"), p2 = iy("v-btn"), k2 = iy("v-spacer"), g = iy("v-card-actions"), O = iy("v-card"), P = iy("v-menu"), T = iy("v-app");
      return Xd(), Jd(T, null, { default: id(() => [k(P, { modelValue: e.value, "onUpdate:modelValue": s[0] || (s[0] = (m) => e.value = m), target: Zt(n).anchor, attach: t2.attach, "close-on-content-click": false, location: "bottom end", offset: "6", "max-width": "340" }, { default: id(() => [k(O, { class: "ns-popover", elevation: "8", width: "340" }, { default: id(() => [k(y2, { class: "ns-body" }, { default: id(() => [Zt(n).loading ? (Xd(), ly("div", re, [k(a2, { indeterminate: "", size: "28", width: "3" }), N("div", ie2, "Looking up " + fs(Zt(n).item?.name) + "\u2026", 1)])) : Zt(n).error ? (Xd(), Jd(u, { key: 1, type: "warning", variant: "tonal", density: "compact" }, { default: id(() => [N("div", null, fs(Zt(n).error.text), 1), Zt(n).error.detail ? (Xd(), ly("div", ce2, fs(Zt(n).error.detail), 1)) : nv("", true)]), _: 1 })) : Zt(n).data ? (Xd(), Jd(Vt2, { key: 2, data: Zt(n).data }, null, 8, ["data"])) : nv("", true)]), _: 1 }), Zt(n).data && !Zt(n).loading ? (Xd(), Jd(se2, { key: 0, data: Zt(n).data }, null, 8, ["data"])) : nv("", true), Zt(n).loading ? nv("", true) : (Xd(), Jd(g, { key: 1, class: "ns-actions" }, { default: id(() => [Zt(n).error ? (Xd(), Jd(p2, { key: 0, size: "small", variant: "text", "prepend-icon": Zt(vy), onClick: Zt(K2) }, { default: id(() => [...s[1] || (s[1] = [tv("Retry", -1)])]), _: 1 }, 8, ["prepend-icon", "onClick"])) : nv("", true), k(k2), Zt(n).data?.url ? (Xd(), Jd(p2, { key: 1, size: "small", variant: "text", "append-icon": Zt(dy), href: Zt(n).data.url, target: "_blank", rel: "noopener" }, { default: id(() => [...s[2] || (s[2] = [tv("Jelly Neo", -1)])]), _: 1 }, 8, ["append-icon", "href"])) : nv("", true)]), _: 1 }))]), _: 1 })]), _: 1 }, 8, ["modelValue", "target", "attach"])]), _: 1 });
    };
  } };
  var de = hy(le2, [["__scopeId", "data-v-b7bec910"]]);
  var ue2 = "neosnipe-content.css";
  var pe2 = "vuetify-theme-stylesheet";
  var B = ".v-application{display:flex;background:rgb(var(--v-theme-background));color:rgba(var(--v-theme-on-background),var(--v-high-emphasis-opacity))}.v-application__wrap{backface-visibility:hidden;display:flex;flex-direction:column;flex:1 1 auto;max-width:100%;min-height:100vh;min-height:100dvh;position:relative}.v-img{--v-theme-overlay-multiplier: 3;z-index:0}.v-img.v-img--absolute{height:100%;left:0;overflow:hidden;position:absolute;top:0;width:100%;z-index:-1}.v-img.v-img--fit-content{max-width:fit-content}.v-img.v-img--fit-content>.v-img__img{position:relative}.v-img.v-img--fit-content>.v-responsive__sizer{display:none}.v-img--booting .v-responsive__sizer{transition:none}.v-img--rounded{border-radius:4px}.v-img__img,.v-img__picture,.v-img__gradient,.v-img__placeholder,.v-img__error{z-index:-1}.v-img__img,.v-img__picture,.v-img__gradient,.v-img__placeholder,.v-img__error{position:absolute;top:0;left:0;width:100%;height:100%}.v-img__img--preload{filter:blur(4px)}.v-img__img--contain{object-fit:contain}.v-img__img--cover{object-fit:cover}.v-img__gradient{background-repeat:no-repeat}.v-responsive{display:flex;flex:1 0 auto;max-height:100%;max-width:100%;overflow:hidden;position:relative}.v-responsive--inline{display:inline-flex;flex:0 0 auto}.v-responsive__content{flex:1 0 0px;max-width:100%}.v-responsive__sizer~.v-responsive__content{margin-inline-start:-100%}.v-responsive__sizer{flex:1 0 0px;transition:padding-bottom .2s cubic-bezier(.4,0,.2,1);pointer-events:none}.v-btn{align-items:center;border-radius:4px;display:inline-grid;grid-template-areas:\"prepend content append\";grid-template-columns:max-content auto max-content;font-weight:500;justify-content:center;letter-spacing:.0892857143em;line-height:normal;max-width:100%;outline:none;position:relative;text-decoration:none;text-indent:.0892857143em;text-transform:uppercase;transition-property:box-shadow,transform,opacity,background;transition-duration:.28s;transition-timing-function:cubic-bezier(.4,0,.2,1);user-select:none;vertical-align:middle;flex-shrink:0}.v-locale--is-rtl .v-btn{text-indent:-.0892857143em}.v-btn--size-x-small{--v-btn-size: .625rem;--v-btn-height: 20px;font-size:var(--v-btn-size);min-width:36px;padding:0 8px}.v-btn--size-small{--v-btn-size: .75rem;--v-btn-height: 28px;font-size:var(--v-btn-size);min-width:50px;padding:0 12px}.v-btn--size-default{--v-btn-size: .875rem;--v-btn-height: 36px;font-size:var(--v-btn-size);min-width:64px;padding:0 16px}.v-btn--size-large{--v-btn-size: 1rem;--v-btn-height: 44px;font-size:var(--v-btn-size);min-width:78px;padding:0 20px}.v-btn--size-x-large{--v-btn-size: 1.125rem;--v-btn-height: 52px;font-size:var(--v-btn-size);min-width:92px;padding:0 24px}.v-btn.v-btn--density-default{height:calc(var(--v-btn-height) + 0px)}.v-btn.v-btn--density-comfortable{height:calc(var(--v-btn-height) + -8px)}.v-btn.v-btn--density-compact{height:calc(var(--v-btn-height) + -12px)}.v-btn{border-color:rgba(var(--v-border-color),var(--v-border-opacity));border-style:solid;border-width:0}.v-btn--border{border-width:thin;box-shadow:none}.v-btn--absolute{position:absolute}.v-btn--fixed{position:fixed}.v-btn:hover>.v-btn__overlay{opacity:calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier))}.v-btn:focus-visible>.v-btn__overlay{opacity:calc(var(--v-focus-opacity) * var(--v-theme-overlay-multiplier))}@supports not selector(:focus-visible){.v-btn:focus>.v-btn__overlay{opacity:calc(var(--v-focus-opacity) * var(--v-theme-overlay-multiplier))}}.v-btn--active>.v-btn__overlay,.v-btn[aria-haspopup=menu][aria-expanded=true]>.v-btn__overlay{opacity:calc(var(--v-activated-opacity) * var(--v-theme-overlay-multiplier))}.v-btn--active:hover>.v-btn__overlay,.v-btn[aria-haspopup=menu][aria-expanded=true]:hover>.v-btn__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-hover-opacity)) * var(--v-theme-overlay-multiplier))}.v-btn--active:focus-visible>.v-btn__overlay,.v-btn[aria-haspopup=menu][aria-expanded=true]:focus-visible>.v-btn__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-focus-opacity)) * var(--v-theme-overlay-multiplier))}@supports not selector(:focus-visible){.v-btn--active:focus>.v-btn__overlay,.v-btn[aria-haspopup=menu][aria-expanded=true]:focus>.v-btn__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-focus-opacity)) * var(--v-theme-overlay-multiplier))}}.v-btn--variant-plain,.v-btn--variant-outlined,.v-btn--variant-text,.v-btn--variant-tonal{background:transparent;color:inherit}.v-btn--variant-plain{opacity:.62}.v-btn--variant-plain:focus,.v-btn--variant-plain:hover{opacity:1}.v-btn--variant-plain .v-btn__overlay{display:none}.v-btn--variant-elevated,.v-btn--variant-flat{background:rgb(var(--v-theme-surface));color:rgba(var(--v-theme-on-surface),var(--v-high-emphasis-opacity))}.v-btn--variant-elevated{box-shadow:0 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 2px 2px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 5px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-btn--variant-flat{box-shadow:0 0 0 0 var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 0 0 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 0 0 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-btn--variant-outlined{border:thin solid currentColor}.v-btn--variant-text .v-btn__overlay{background:currentColor}.v-btn--variant-tonal .v-btn__underlay{background:currentColor;opacity:var(--v-activated-opacity);border-radius:inherit;inset:0;pointer-events:none}.v-btn .v-btn__underlay{position:absolute}@supports selector(:focus-visible){.v-btn:after{pointer-events:none;border:2px solid currentColor;border-radius:inherit;opacity:0;transition:opacity .2s ease-in-out}.v-btn:after{content:\"\";position:absolute;top:0;left:0;width:100%;height:100%}.v-btn:focus-visible:after{opacity:calc(.25 * var(--v-theme-overlay-multiplier))}}.v-btn--icon{border-radius:50%;min-width:0;padding:0}.v-btn--icon.v-btn--size-default{--v-btn-size: 1rem}.v-btn--icon.v-btn--density-default{width:calc(var(--v-btn-height) + 12px);height:calc(var(--v-btn-height) + 12px)}.v-btn--icon.v-btn--density-comfortable{width:calc(var(--v-btn-height) + 0px);height:calc(var(--v-btn-height) + 0px)}.v-btn--icon.v-btn--density-compact{width:calc(var(--v-btn-height) + -8px);height:calc(var(--v-btn-height) + -8px)}.v-btn--elevated:hover,.v-btn--elevated:focus{box-shadow:0 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 4px 5px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 10px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-btn--elevated:active{box-shadow:0 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 3px 14px 2px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-btn--flat{box-shadow:none}.v-btn--block{display:flex;flex:1 0 auto;min-width:100%}.v-btn--spaced{display:grid;grid-template-columns:max-content 1fr max-content}.v-btn--spaced.v-btn--spaced-start>.v-btn__content{justify-content:end}.v-btn--spaced.v-btn--spaced-end>.v-btn__content{justify-content:start}.v-btn--disabled{pointer-events:none;opacity:.26}.v-btn--disabled:hover{opacity:.26}.v-btn--disabled.v-btn--variant-elevated,.v-btn--disabled.v-btn--variant-flat{box-shadow:none;opacity:1;color:rgba(var(--v-theme-on-surface),.26);background:rgb(var(--v-theme-surface))}.v-btn--disabled.v-btn--variant-elevated .v-btn__overlay,.v-btn--disabled.v-btn--variant-flat .v-btn__overlay{opacity:.4615384615}.v-btn--loading{pointer-events:none}.v-btn--loading .v-btn__content,.v-btn--loading .v-btn__prepend,.v-btn--loading .v-btn__append{opacity:0}.v-btn--stacked{grid-template-areas:\"prepend\" \"content\" \"append\";grid-template-columns:auto;grid-template-rows:max-content max-content max-content;justify-items:center;align-content:center}.v-btn--stacked .v-btn__content{flex-direction:column;line-height:1.25}.v-btn--stacked .v-btn__prepend,.v-btn--stacked .v-btn__append,.v-btn--stacked .v-btn__content>.v-icon--start,.v-btn--stacked .v-btn__content>.v-icon--end{margin-inline:0}.v-btn--stacked .v-btn__prepend,.v-btn--stacked .v-btn__content>.v-icon--start{margin-bottom:4px}.v-btn--stacked .v-btn__append,.v-btn--stacked .v-btn__content>.v-icon--end{margin-top:4px}.v-btn--stacked.v-btn--size-x-small{--v-btn-size: .625rem;--v-btn-height: 56px;font-size:var(--v-btn-size);min-width:56px;padding:0 12px}.v-btn--stacked.v-btn--size-small{--v-btn-size: .75rem;--v-btn-height: 64px;font-size:var(--v-btn-size);min-width:64px;padding:0 14px}.v-btn--stacked.v-btn--size-default{--v-btn-size: .875rem;--v-btn-height: 72px;font-size:var(--v-btn-size);min-width:72px;padding:0 16px}.v-btn--stacked.v-btn--size-large{--v-btn-size: 1rem;--v-btn-height: 80px;font-size:var(--v-btn-size);min-width:80px;padding:0 18px}.v-btn--stacked.v-btn--size-x-large{--v-btn-size: 1.125rem;--v-btn-height: 88px;font-size:var(--v-btn-size);min-width:88px;padding:0 20px}.v-btn--stacked.v-btn--density-default{height:calc(var(--v-btn-height) + 0px)}.v-btn--stacked.v-btn--density-comfortable{height:calc(var(--v-btn-height) + -16px)}.v-btn--stacked.v-btn--density-compact{height:calc(var(--v-btn-height) + -24px)}.v-btn--slim{padding:0 8px}.v-btn--readonly{pointer-events:none}.v-btn--rounded{border-radius:24px}.v-btn--rounded.v-btn--icon{border-radius:4px}.v-btn .v-icon{--v-icon-size-multiplier: .8571428571}.v-btn--icon .v-icon{--v-icon-size-multiplier: 1}.v-btn--stacked .v-icon{--v-icon-size-multiplier: 1.1428571429}.v-btn--stacked.v-btn--block{min-width:100%}.v-btn__loader{align-items:center;display:flex;height:100%;justify-content:center;left:0;position:absolute;top:0;width:100%}.v-btn__loader>.v-progress-circular{width:1.5em;height:1.5em}.v-btn__content,.v-btn__prepend,.v-btn__append{align-items:center;display:flex;transition:transform,opacity .2s cubic-bezier(.4,0,.2,1)}.v-btn__prepend{grid-area:prepend;margin-inline:calc(var(--v-btn-height) / -9) calc(var(--v-btn-height) / 4.5)}.v-btn--slim .v-btn__prepend{margin-inline-start:0}.v-btn__append{grid-area:append;margin-inline:calc(var(--v-btn-height) / 4.5) calc(var(--v-btn-height) / -9)}.v-btn--slim .v-btn__append{margin-inline-end:0}.v-btn__content{grid-area:content;justify-content:center;white-space:nowrap}.v-btn__content>.v-icon--start{margin-inline:calc(var(--v-btn-height) / -9) calc(var(--v-btn-height) / 4.5)}.v-btn__content>.v-icon--end{margin-inline:calc(var(--v-btn-height) / 4.5) calc(var(--v-btn-height) / -9)}.v-btn--stacked .v-btn__content{white-space:normal}.v-btn__overlay{background-color:currentColor;border-radius:inherit;opacity:0;transition:opacity .2s ease-in-out}.v-btn__overlay,.v-btn__underlay{pointer-events:none}.v-btn__overlay,.v-btn__underlay{position:absolute;top:0;left:0;width:100%;height:100%}.v-pagination .v-btn{width:auto;padding-inline:5px}.v-pagination .v-btn.v-btn--density-default{min-width:calc(var(--v-btn-height) + 12px)}.v-pagination .v-btn.v-btn--density-comfortable{min-width:calc(var(--v-btn-height) + 0px)}.v-pagination .v-btn.v-btn--density-compact{min-width:calc(var(--v-btn-height) + -8px)}.v-pagination .v-btn{border-radius:4px}.v-pagination .v-btn--rounded{border-radius:50%}.v-pagination .v-btn__overlay{transition:none}.v-pagination__prev .v-btn,.v-pagination__next .v-btn{padding-inline:0}.v-pagination__prev .v-btn.v-btn--density-default,.v-pagination__next .v-btn.v-btn--density-default{width:calc(var(--v-btn-height) + 12px)}.v-pagination__prev .v-btn.v-btn--density-comfortable,.v-pagination__next .v-btn.v-btn--density-comfortable{width:calc(var(--v-btn-height) + 0px)}.v-pagination__prev .v-btn.v-btn--density-compact,.v-pagination__next .v-btn.v-btn--density-compact{width:calc(var(--v-btn-height) + -8px)}.v-pagination .v-pagination__item--is-active .v-btn__overlay{opacity:var(--v-border-opacity)}@media (forced-colors: active){.v-btn:not(.v-btn--variant-text,.v-btn--variant-plain){border:thin solid}.v-btn:focus-visible{outline:2px solid;outline-offset:2px}}.v-btn-toggle>.v-btn.v-btn--active:not(.v-btn--disabled)>.v-btn__overlay{opacity:calc(var(--v-activated-opacity) * var(--v-theme-overlay-multiplier))}.v-btn-toggle>.v-btn.v-btn--active:not(.v-btn--disabled):hover>.v-btn__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-hover-opacity)) * var(--v-theme-overlay-multiplier))}.v-btn-toggle>.v-btn.v-btn--active:not(.v-btn--disabled):focus-visible>.v-btn__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-focus-opacity)) * var(--v-theme-overlay-multiplier))}@supports not selector(:focus-visible){.v-btn-toggle>.v-btn.v-btn--active:not(.v-btn--disabled):focus>.v-btn__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-focus-opacity)) * var(--v-theme-overlay-multiplier))}}.v-btn-toggle>.v-btn.v-btn--active:not(.v-btn--disabled).v-btn--variant-plain{opacity:1}@media (forced-colors: active){.v-btn-toggle>.v-btn:not(.v-btn--disabled){border-color:buttontext!important}.v-btn-toggle>.v-btn:not(.v-btn--disabled):focus-visible{outline:0}.v-btn-toggle>.v-btn:not(.v-btn--disabled):not(.v-btn--active):hover,.v-btn-toggle>.v-btn:not(.v-btn--disabled):not(.v-btn--active):focus-visible{color:highlight;border-color:currentColor!important}.v-btn-toggle>.v-btn--active{color:highlight!important;forced-color-adjust:preserve-parent-color}.v-btn-toggle>.v-btn--active:not(.v-btn--variant-text,.v-btn--variant-plain){background-color:highlight!important;color:highlighttext!important;border-color:highlight!important}}.v-btn-group{display:inline-flex;flex-wrap:nowrap;max-width:100%;min-width:0;overflow-y:hidden;overflow-x:auto;vertical-align:middle}.v-btn-group{border-color:rgba(var(--v-border-color),var(--v-border-opacity));border-style:solid;border-width:0}.v-btn-group--border{border-width:thin;box-shadow:none}.v-btn-group{box-shadow:0 0 0 0 var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 0 0 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 0 0 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-btn-group{border-radius:4px}.v-btn-group{background:transparent;color:rgba(var(--v-theme-on-surface),var(--v-high-emphasis-opacity))}.v-btn-group--density-default.v-btn-group{height:48px}.v-btn-group--density-comfortable.v-btn-group{height:40px}.v-btn-group--density-compact.v-btn-group{height:36px}.v-btn-group .v-btn{border-radius:0;border-color:inherit}.v-btn-group--tile{border-radius:0}.v-btn-group--has-size{height:auto!important}.v-btn-group--has-size .v-btn--icon.v-btn--density-default{width:calc(var(--v-btn-height) + 0px);height:calc(var(--v-btn-height) + 0px)}.v-btn-group--has-size .v-btn--icon.v-btn--density-comfortable{width:calc(var(--v-btn-height) + -8px);height:calc(var(--v-btn-height) + -8px)}.v-btn-group--has-size .v-btn--icon.v-btn--density-compact{width:calc(var(--v-btn-height) + -12px);height:calc(var(--v-btn-height) + -12px)}.v-btn-group--horizontal .v-btn:not(:last-child){border-inline-end:none}.v-btn-group--horizontal .v-btn:not(:first-child){border-inline-start:none}.v-btn-group--horizontal .v-btn:first-child{border-start-start-radius:inherit;border-end-start-radius:inherit}.v-btn-group--horizontal .v-btn:last-child{border-start-end-radius:inherit;border-end-end-radius:inherit}.v-btn-group--horizontal.v-btn-group--divided .v-btn:not(:last-child){border-inline-end-width:thin;border-inline-end-style:solid;border-inline-end-color:rgba(var(--v-border-color),var(--v-border-opacity))}.v-btn-group--vertical{flex-direction:column;height:auto!important}.v-btn-group--vertical .v-btn:not(:last-child){border-block-end:none}.v-btn-group--vertical .v-btn:not(:first-child){border-block-start:none}.v-btn-group--vertical .v-btn:first-child{border-start-start-radius:inherit;border-start-end-radius:inherit}.v-btn-group--vertical .v-btn:last-child{border-end-start-radius:inherit;border-end-end-radius:inherit}.v-btn-group--vertical.v-btn-group--divided .v-btn:not(:last-child){border-block-end-width:thin;border-block-end-style:solid;border-block-end-color:rgba(var(--v-border-color),var(--v-border-opacity))}.v-icon{--v-icon-size-multiplier: 1;align-items:center;display:inline-flex;font-feature-settings:\"liga\";height:1em;justify-content:center;letter-spacing:normal;line-height:1;position:relative;opacity:var(--v-icon-opacity, 1);text-indent:0;text-align:center;user-select:none;vertical-align:middle;width:1em;min-width:1em}.v-icon--clickable{cursor:pointer}.v-icon--disabled{pointer-events:none;opacity:.38}.v-icon--size-x-small{font-size:calc(var(--v-icon-size-multiplier) * 1em)}.v-icon--size-small{font-size:calc(var(--v-icon-size-multiplier) * 1.25em)}.v-icon--size-default{font-size:calc(var(--v-icon-size-multiplier) * 1.5em)}.v-icon--size-large{font-size:calc(var(--v-icon-size-multiplier) * 1.75em)}.v-icon--size-x-large{font-size:calc(var(--v-icon-size-multiplier) * 2em)}.v-icon__svg{fill:currentColor;width:100%;height:100%}.v-icon--start{margin-inline-end:8px}.v-icon--end{margin-inline-start:8px}.v-progress-circular{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;position:relative;vertical-align:middle}.v-progress-circular>svg{width:100%;height:100%;margin:auto;position:absolute;inset:0;z-index:0}.v-progress-circular__content{align-items:center;display:flex;justify-content:center}.v-progress-circular__underlay{color:rgba(var(--v-border-color),var(--v-border-opacity));stroke:currentColor;z-index:1}.v-progress-circular__overlay{stroke:currentColor;transition:all .2s ease-in-out,stroke-width 0s;z-index:2}.v-progress-circular--revealing{--progress-reveal-duration: $progress-circular-reveal-duration}.v-progress-circular--revealing .v-progress-circular__overlay{transition-duration:var(--progress-reveal-duration),0s}.v-progress-circular--size-x-small{height:16px;width:16px}.v-progress-circular--size-small{height:24px;width:24px}.v-progress-circular--size-default{height:32px;width:32px}.v-progress-circular--size-large{height:48px;width:48px}.v-progress-circular--size-x-large{height:64px;width:64px}.v-progress-circular--indeterminate>svg{animation:progress-circular-rotate 1.4s linear infinite;transform-origin:center center;transition:all .2s ease-in-out}.v-progress-circular--indeterminate .v-progress-circular__overlay{animation:progress-circular-dash 1.4s ease-in-out infinite,progress-circular-rotate 1.4s linear infinite;stroke-dasharray:25,200;stroke-dashoffset:0;stroke-linecap:round;transform-origin:center center;transform:rotate(-90deg)}.v-progress-circular--disable-shrink>svg{animation-duration:.7s}.v-progress-circular--disable-shrink .v-progress-circular__overlay{animation:none}.v-progress-circular--indeterminate:not(.v-progress-circular--visible)>svg,.v-progress-circular--indeterminate:not(.v-progress-circular--visible) .v-progress-circular__overlay{animation-play-state:paused!important}@keyframes progress-circular-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0px}50%{stroke-dasharray:100,200;stroke-dashoffset:-15px}to{stroke-dasharray:100,200;stroke-dashoffset:-124px}}@keyframes progress-circular-rotate{to{transform:rotate(270deg)}}.v-progress-linear{background:transparent;overflow:hidden;position:relative;transition:.2s cubic-bezier(.4,0,.2,1),mask-size 0s;width:100%}@media (forced-colors: active){.v-progress-linear{border:thin solid buttontext}}.v-progress-linear__background,.v-progress-linear__buffer{background:currentColor;bottom:0;left:0;opacity:var(--v-border-opacity);position:absolute;top:0;width:100%;transition-property:width,left,right;transition-duration:inherit;transition-timing-function:inherit;transition-delay:inherit}@media (forced-colors: active){.v-progress-linear__buffer{background-color:highlight!important;opacity:.5!important}}.v-progress-linear__content{align-items:center;display:flex;height:100%;justify-content:center;left:0;position:absolute;top:0;width:100%}.v-progress-linear--clickable .v-progress-linear__content{pointer-events:none}.v-progress-linear__determinate,.v-progress-linear__indeterminate{background:currentColor}@media (forced-colors: active){.v-progress-linear__determinate,.v-progress-linear__indeterminate{background-color:highlight!important}}.v-progress-linear__determinate{height:inherit;left:0;position:absolute;transition-property:width,left,right;transition-duration:inherit;transition-timing-function:inherit;transition-delay:inherit}.v-progress-linear__indeterminate .long,.v-progress-linear__indeterminate .short{animation-play-state:paused;animation-duration:2.2s;animation-iteration-count:infinite;height:inherit;inset:0 auto 0 0;position:absolute;width:auto}.v-progress-linear__indeterminate .long{animation-name:indeterminate-ltr}.v-progress-linear__indeterminate .short{animation-name:indeterminate-short-ltr}.v-progress-linear__stream{animation:stream .25s infinite linear;animation-play-state:paused;bottom:0;left:auto;opacity:.3;pointer-events:none;position:absolute;transition-property:width,left,right;transition-duration:inherit;transition-timing-function:inherit;transition-delay:inherit}.v-progress-linear--reverse .v-progress-linear__background,.v-progress-linear--reverse .v-progress-linear__determinate,.v-progress-linear--reverse .v-progress-linear__content,.v-progress-linear--reverse .v-progress-linear__indeterminate .long,.v-progress-linear--reverse .v-progress-linear__indeterminate .short{left:auto;right:0}.v-progress-linear--reverse .v-progress-linear__indeterminate .long{animation-name:indeterminate-rtl}.v-progress-linear--reverse .v-progress-linear__indeterminate .short{animation-name:indeterminate-short-rtl}.v-progress-linear--reverse .v-progress-linear__stream{right:auto}.v-progress-linear--absolute,.v-progress-linear--fixed{left:0;z-index:1}.v-progress-linear--absolute{position:absolute}.v-progress-linear--fixed{position:fixed}.v-progress-linear--rounded{border-radius:9999px}.v-progress-linear--rounded.v-progress-linear--rounded-bar .v-progress-linear__determinate,.v-progress-linear--rounded.v-progress-linear--rounded-bar .v-progress-linear__indeterminate{border-radius:inherit}.v-progress-linear--striped .v-progress-linear__determinate{animation:progress-linear-stripes 1s infinite linear;background-image:linear-gradient(135deg,hsla(0,0%,100%,.25) 25%,transparent 0,transparent 50%,hsla(0,0%,100%,.25) 0,hsla(0,0%,100%,.25) 75%,transparent 0,transparent);background-repeat:repeat;background-size:var(--v-progress-linear-height)}.v-progress-linear--active .v-progress-linear__indeterminate .long,.v-progress-linear--active .v-progress-linear__indeterminate .short,.v-progress-linear--active .v-progress-linear__stream{animation-play-state:running}.v-progress-linear--rounded-bar .v-progress-linear__determinate,.v-progress-linear--rounded-bar .v-progress-linear__indeterminate,.v-progress-linear--rounded-bar .v-progress-linear__stream+.v-progress-linear__background{border-radius:9999px}.v-progress-linear--rounded-bar .v-progress-linear__determinate{border-start-start-radius:0;border-end-start-radius:0}@keyframes indeterminate-ltr{0%{left:-90%;right:100%}60%{left:-90%;right:100%}to{left:100%;right:-35%}}@keyframes indeterminate-rtl{0%{left:100%;right:-90%}60%{left:100%;right:-90%}to{left:-35%;right:100%}}@keyframes indeterminate-short-ltr{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@keyframes indeterminate-short-rtl{0%{left:100%;right:-200%}60%{left:-8%;right:107%}to{left:-8%;right:107%}}@keyframes stream{to{transform:translate(var(--v-progress-linear-stream-to))}}@keyframes progress-linear-stripes{0%{background-position-x:var(--v-progress-linear-height)}}.v-ripple__container{color:inherit;border-radius:inherit;position:absolute;width:100%;height:100%;left:0;top:0;overflow:hidden;z-index:0;pointer-events:none;contain:strict}.v-ripple__animation{color:inherit;position:absolute;top:0;left:0;border-radius:50%;background:currentColor;opacity:0;pointer-events:none;overflow:hidden;will-change:transform,opacity}.v-ripple__animation--enter{transition:none;opacity:0}.v-ripple__animation--in{transition:transform .25s cubic-bezier(0,0,.2,1),opacity .1s cubic-bezier(0,0,.2,1);opacity:calc(.25 * var(--v-theme-overlay-multiplier))}@media (prefers-reduced-motion: reduce){.v-ripple__animation--in{transition-property:opacity;transition-duration:.1s}}.v-ripple__animation--out{transition:opacity .3s cubic-bezier(0,0,.2,1);opacity:0}.v-alert{display:grid;flex:1 1;grid-template-areas:\"prepend content append close\" \". content . .\";grid-template-columns:max-content auto max-content max-content;position:relative;padding:16px;overflow:hidden;--v-border-color: currentColor}.v-alert--absolute{position:absolute}.v-alert--fixed{position:fixed}.v-alert--sticky{position:sticky}.v-alert{border-radius:4px}.v-alert--variant-plain,.v-alert--variant-outlined,.v-alert--variant-text,.v-alert--variant-tonal{background:transparent;color:inherit}.v-alert--variant-plain{opacity:.62}.v-alert--variant-plain:focus,.v-alert--variant-plain:hover{opacity:1}.v-alert--variant-plain .v-alert__overlay{display:none}.v-alert--variant-elevated,.v-alert--variant-flat{background:rgb(var(--v-theme-surface-light));color:rgba(var(--v-theme-on-surface-light),var(--v-high-emphasis-opacity))}.v-alert--variant-elevated{box-shadow:0 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 1px 1px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 3px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-alert--variant-flat{box-shadow:0 0 0 0 var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 0 0 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 0 0 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-alert--variant-outlined{border:thin solid currentColor}.v-alert--variant-text .v-alert__overlay{background:currentColor}.v-alert--variant-tonal .v-alert__underlay{background:currentColor;opacity:var(--v-activated-opacity);border-radius:inherit;inset:0;pointer-events:none}.v-alert .v-alert__underlay{position:absolute}.v-alert--prominent{grid-template-areas:\"prepend content append close\" \"prepend content . .\"}.v-alert.v-alert--border{--v-border-opacity: .38}.v-alert.v-alert--border.v-alert--border-start{padding-inline-start:24px}.v-alert.v-alert--border.v-alert--border-end{padding-inline-end:24px}.v-alert--variant-plain{transition:.2s opacity cubic-bezier(.4,0,.2,1)}.v-alert--density-default{padding-bottom:16px;padding-top:16px}.v-alert--density-default.v-alert--border-top{padding-top:24px}.v-alert--density-default.v-alert--border-bottom{padding-bottom:24px}.v-alert--density-comfortable{padding-bottom:12px;padding-top:12px}.v-alert--density-comfortable.v-alert--border-top{padding-top:20px}.v-alert--density-comfortable.v-alert--border-bottom{padding-bottom:20px}.v-alert--density-compact{padding-bottom:8px;padding-top:8px}.v-alert--density-compact.v-alert--border-top{padding-top:16px}.v-alert--density-compact.v-alert--border-bottom{padding-bottom:16px}.v-alert:not(:has(.v-alert-title)) .v-alert__content{padding-block:.125rem}.v-alert__border{border-radius:inherit;inset:0;opacity:var(--v-border-opacity);position:absolute;pointer-events:none;width:100%}.v-alert__border{border-color:currentColor;border-style:solid;border-width:0}.v-alert__border--border{border-width:8px;box-shadow:none}.v-alert--border-start .v-alert__border{border-inline-start-width:8px}.v-alert--border-end .v-alert__border{border-inline-end-width:8px}.v-alert--border-top .v-alert__border{border-top-width:8px}.v-alert--border-bottom .v-alert__border{border-bottom-width:8px}.v-alert__close{flex:0 1 auto;grid-area:close}.v-alert__close>.v-btn{margin-block:calc(-1 * (var(--v-btn-height) + 12px - 1.75rem) / 2)}.v-alert__content{align-self:center;grid-area:content;overflow:hidden}.v-alert__append,.v-alert__close{margin-inline-start:16px}.v-alert__append{align-self:flex-start;grid-area:append}.v-alert__append+.v-alert__close{margin-inline-start:16px}.v-alert__prepend{align-self:flex-start;display:flex;align-items:center;grid-area:prepend;margin-inline-end:16px;min-height:1.75rem}.v-alert__prepend>.v-icon{font-size:1.75rem;height:1.75rem;width:1.75rem}.v-alert--prominent .v-alert__prepend{align-self:center}.v-alert__underlay{grid-area:none;position:absolute}.v-alert--border-start .v-alert__underlay{border-top-left-radius:0;border-bottom-left-radius:0}.v-alert--border-end .v-alert__underlay{border-top-right-radius:0;border-bottom-right-radius:0}.v-alert--border-top .v-alert__underlay{border-top-left-radius:0;border-top-right-radius:0}.v-alert--border-bottom .v-alert__underlay{border-bottom-left-radius:0;border-bottom-right-radius:0}.v-alert-title{align-items:center;align-self:center;display:flex;font-size:1.25rem;font-weight:500;hyphens:auto;letter-spacing:.0125em;line-height:1.75rem;overflow-wrap:normal;text-transform:none;word-break:normal;word-wrap:break-word}@media (forced-colors: active){.v-alert:not(.v-alert--variant-text,.v-alert--variant-plain){border-style:solid}.v-alert--variant-outlined,.v-alert--variant-tonal{border-width:medium}.v-alert--variant-elevated,.v-alert--variant-flat{border-width:thick}}.v-avatar{flex:none;align-items:center;display:inline-flex;justify-content:center;line-height:normal;overflow:hidden;position:relative;text-align:center;transition:.2s cubic-bezier(.4,0,.2,1);transition-property:width,height;vertical-align:middle}.v-avatar.v-avatar--size-x-small{--v-avatar-height: 24px}.v-avatar.v-avatar--size-small{--v-avatar-height: 32px}.v-avatar.v-avatar--size-default{--v-avatar-height: 40px}.v-avatar.v-avatar--size-large{--v-avatar-height: 48px}.v-avatar.v-avatar--size-x-large{--v-avatar-height: 56px}.v-avatar.v-avatar--density-default{height:calc(var(--v-avatar-height) + 0px);width:calc(var(--v-avatar-height) + 0px)}.v-avatar.v-avatar--density-comfortable{height:calc(var(--v-avatar-height) + -4px);width:calc(var(--v-avatar-height) + -4px)}.v-avatar.v-avatar--density-compact{height:calc(var(--v-avatar-height) + -8px);width:calc(var(--v-avatar-height) + -8px)}.v-avatar{border-color:rgba(var(--v-border-color),var(--v-border-opacity));border-style:solid;border-width:0}.v-avatar--border{border-width:thin;box-shadow:none}.v-avatar{border-radius:50%}.v-avatar--variant-plain,.v-avatar--variant-outlined,.v-avatar--variant-text,.v-avatar--variant-tonal{background:transparent;color:inherit}.v-avatar--variant-plain{opacity:.62}.v-avatar--variant-plain:focus,.v-avatar--variant-plain:hover{opacity:1}.v-avatar--variant-plain .v-avatar__overlay{display:none}.v-avatar--variant-elevated,.v-avatar--variant-flat{background:rgb(var(--v-theme-surface));color:rgba(var(--v-theme-on-surface),var(--v-medium-emphasis-opacity))}.v-avatar--variant-elevated{box-shadow:0 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 1px 1px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 3px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-avatar--variant-flat{box-shadow:0 0 0 0 var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 0 0 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 0 0 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-avatar--variant-outlined{border:thin solid currentColor}.v-avatar--variant-text .v-avatar__overlay{background:currentColor}.v-avatar--variant-tonal .v-avatar__underlay{background:currentColor;opacity:var(--v-activated-opacity);border-radius:inherit;inset:0;pointer-events:none}.v-avatar .v-avatar__underlay{position:absolute}.v-avatar--rounded{border-radius:4px}.v-avatar--start{margin-inline-end:8px}.v-avatar--end{margin-inline-start:8px}.v-avatar .v-img{height:100%;width:100%}.v-chip{align-items:center;display:inline-flex;font-weight:400;max-width:100%;min-width:0;overflow:hidden;position:relative;text-decoration:none;white-space:nowrap;vertical-align:middle}.v-chip .v-icon{--v-icon-size-multiplier: .8571428571}.v-chip.v-chip--size-x-small{--v-chip-size: .625rem;--v-chip-height: 20px;font-size:.625rem;padding:0 8px}.v-chip.v-chip--size-x-small .v-avatar{--v-avatar-height: 14px}.v-chip--pill.v-chip.v-chip--size-x-small .v-avatar{--v-avatar-height: 20px}.v-chip.v-chip--size-x-small .v-avatar--start{margin-inline-start:-5.6px;margin-inline-end:4px}.v-chip--pill.v-chip.v-chip--size-x-small .v-avatar--start{margin-inline-start:-8px}.v-chip.v-chip--size-x-small .v-avatar--end{margin-inline-start:4px;margin-inline-end:-5.6px}.v-chip--pill.v-chip.v-chip--size-x-small .v-avatar--end{margin-inline-end:-8px}.v-chip--pill.v-chip.v-chip--size-x-small .v-avatar--end+.v-chip__close{margin-inline-start:12px}.v-chip.v-chip--size-x-small .v-icon--start,.v-chip.v-chip--size-x-small .v-chip__filter{margin-inline-start:-4px;margin-inline-end:4px}.v-chip.v-chip--size-x-small .v-icon--end,.v-chip.v-chip--size-x-small .v-chip__close{margin-inline-start:4px;margin-inline-end:-4px}.v-chip.v-chip--size-x-small .v-icon--end+.v-chip__close,.v-chip.v-chip--size-x-small .v-avatar--end+.v-chip__close,.v-chip.v-chip--size-x-small .v-chip__append+.v-chip__close{margin-inline-start:8px}.v-chip.v-chip--size-small{--v-chip-size: .75rem;--v-chip-height: 26px;font-size:.75rem;padding:0 10px}.v-chip.v-chip--size-small .v-avatar{--v-avatar-height: 20px}.v-chip--pill.v-chip.v-chip--size-small .v-avatar{--v-avatar-height: 26px}.v-chip.v-chip--size-small .v-avatar--start{margin-inline-start:-7px;margin-inline-end:5px}.v-chip--pill.v-chip.v-chip--size-small .v-avatar--start{margin-inline-start:-10px}.v-chip.v-chip--size-small .v-avatar--end{margin-inline-start:5px;margin-inline-end:-7px}.v-chip--pill.v-chip.v-chip--size-small .v-avatar--end{margin-inline-end:-10px}.v-chip--pill.v-chip.v-chip--size-small .v-avatar--end+.v-chip__close{margin-inline-start:15px}.v-chip.v-chip--size-small .v-icon--start,.v-chip.v-chip--size-small .v-chip__filter{margin-inline-start:-5px;margin-inline-end:5px}.v-chip.v-chip--size-small .v-icon--end,.v-chip.v-chip--size-small .v-chip__close{margin-inline-start:5px;margin-inline-end:-5px}.v-chip.v-chip--size-small .v-icon--end+.v-chip__close,.v-chip.v-chip--size-small .v-avatar--end+.v-chip__close,.v-chip.v-chip--size-small .v-chip__append+.v-chip__close{margin-inline-start:10px}.v-chip.v-chip--size-default{--v-chip-size: .875rem;--v-chip-height: 32px;font-size:.875rem;padding:0 12px}.v-chip.v-chip--size-default .v-avatar{--v-avatar-height: 26px}.v-chip--pill.v-chip.v-chip--size-default .v-avatar{--v-avatar-height: 32px}.v-chip.v-chip--size-default .v-avatar--start{margin-inline-start:-8.4px;margin-inline-end:6px}.v-chip--pill.v-chip.v-chip--size-default .v-avatar--start{margin-inline-start:-12px}.v-chip.v-chip--size-default .v-avatar--end{margin-inline-start:6px;margin-inline-end:-8.4px}.v-chip--pill.v-chip.v-chip--size-default .v-avatar--end{margin-inline-end:-12px}.v-chip--pill.v-chip.v-chip--size-default .v-avatar--end+.v-chip__close{margin-inline-start:18px}.v-chip.v-chip--size-default .v-icon--start,.v-chip.v-chip--size-default .v-chip__filter{margin-inline-start:-6px;margin-inline-end:6px}.v-chip.v-chip--size-default .v-icon--end,.v-chip.v-chip--size-default .v-chip__close{margin-inline-start:6px;margin-inline-end:-6px}.v-chip.v-chip--size-default .v-icon--end+.v-chip__close,.v-chip.v-chip--size-default .v-avatar--end+.v-chip__close,.v-chip.v-chip--size-default .v-chip__append+.v-chip__close{margin-inline-start:12px}.v-chip.v-chip--size-large{--v-chip-size: 1rem;--v-chip-height: 38px;font-size:1rem;padding:0 14px}.v-chip.v-chip--size-large .v-avatar{--v-avatar-height: 32px}.v-chip--pill.v-chip.v-chip--size-large .v-avatar{--v-avatar-height: 38px}.v-chip.v-chip--size-large .v-avatar--start{margin-inline-start:-9.8px;margin-inline-end:7px}.v-chip--pill.v-chip.v-chip--size-large .v-avatar--start{margin-inline-start:-14px}.v-chip.v-chip--size-large .v-avatar--end{margin-inline-start:7px;margin-inline-end:-9.8px}.v-chip--pill.v-chip.v-chip--size-large .v-avatar--end{margin-inline-end:-14px}.v-chip--pill.v-chip.v-chip--size-large .v-avatar--end+.v-chip__close{margin-inline-start:21px}.v-chip.v-chip--size-large .v-icon--start,.v-chip.v-chip--size-large .v-chip__filter{margin-inline-start:-7px;margin-inline-end:7px}.v-chip.v-chip--size-large .v-icon--end,.v-chip.v-chip--size-large .v-chip__close{margin-inline-start:7px;margin-inline-end:-7px}.v-chip.v-chip--size-large .v-icon--end+.v-chip__close,.v-chip.v-chip--size-large .v-avatar--end+.v-chip__close,.v-chip.v-chip--size-large .v-chip__append+.v-chip__close{margin-inline-start:14px}.v-chip.v-chip--size-x-large{--v-chip-size: 1.125rem;--v-chip-height: 44px;font-size:1.125rem;padding:0 17px}.v-chip.v-chip--size-x-large .v-avatar{--v-avatar-height: 38px}.v-chip--pill.v-chip.v-chip--size-x-large .v-avatar{--v-avatar-height: 44px}.v-chip.v-chip--size-x-large .v-avatar--start{margin-inline-start:-11.9px;margin-inline-end:8.5px}.v-chip--pill.v-chip.v-chip--size-x-large .v-avatar--start{margin-inline-start:-17px}.v-chip.v-chip--size-x-large .v-avatar--end{margin-inline-start:8.5px;margin-inline-end:-11.9px}.v-chip--pill.v-chip.v-chip--size-x-large .v-avatar--end{margin-inline-end:-17px}.v-chip--pill.v-chip.v-chip--size-x-large .v-avatar--end+.v-chip__close{margin-inline-start:25.5px}.v-chip.v-chip--size-x-large .v-icon--start,.v-chip.v-chip--size-x-large .v-chip__filter{margin-inline-start:-8.5px;margin-inline-end:8.5px}.v-chip.v-chip--size-x-large .v-icon--end,.v-chip.v-chip--size-x-large .v-chip__close{margin-inline-start:8.5px;margin-inline-end:-8.5px}.v-chip.v-chip--size-x-large .v-icon--end+.v-chip__close,.v-chip.v-chip--size-x-large .v-avatar--end+.v-chip__close,.v-chip.v-chip--size-x-large .v-chip__append+.v-chip__close{margin-inline-start:17px}.v-chip.v-chip--density-default{height:calc(var(--v-chip-height) + 0px)}.v-chip.v-chip--density-comfortable{height:calc(var(--v-chip-height) + -4px)}.v-chip.v-chip--density-compact{height:calc(var(--v-chip-height) + -8px)}.v-chip{border-color:rgba(var(--v-border-color),var(--v-border-opacity));border-style:solid;border-width:0}.v-chip:hover>.v-chip__overlay{opacity:calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier))}.v-chip:focus-visible>.v-chip__overlay{opacity:calc(var(--v-focus-opacity) * var(--v-theme-overlay-multiplier))}@supports not selector(:focus-visible){.v-chip:focus>.v-chip__overlay{opacity:calc(var(--v-focus-opacity) * var(--v-theme-overlay-multiplier))}}.v-chip--active>.v-chip__overlay,.v-chip[aria-haspopup=menu][aria-expanded=true]>.v-chip__overlay{opacity:calc(var(--v-activated-opacity) * var(--v-theme-overlay-multiplier))}.v-chip--active:hover>.v-chip__overlay,.v-chip[aria-haspopup=menu][aria-expanded=true]:hover>.v-chip__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-hover-opacity)) * var(--v-theme-overlay-multiplier))}.v-chip--active:focus-visible>.v-chip__overlay,.v-chip[aria-haspopup=menu][aria-expanded=true]:focus-visible>.v-chip__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-focus-opacity)) * var(--v-theme-overlay-multiplier))}@supports not selector(:focus-visible){.v-chip--active:focus>.v-chip__overlay,.v-chip[aria-haspopup=menu][aria-expanded=true]:focus>.v-chip__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-focus-opacity)) * var(--v-theme-overlay-multiplier))}}.v-chip{border-radius:9999px}.v-chip--variant-plain,.v-chip--variant-outlined,.v-chip--variant-text,.v-chip--variant-tonal{background:transparent;color:inherit}.v-chip--variant-plain{opacity:.62}.v-chip--variant-plain:focus,.v-chip--variant-plain:hover{opacity:1}.v-chip--variant-plain .v-chip__overlay{display:none}.v-chip--variant-elevated,.v-chip--variant-flat{background:rgb(var(--v-theme-surface-variant));color:rgb(var(--v-theme-on-surface-variant))}.v-chip--variant-elevated{box-shadow:0 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 1px 1px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 3px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-chip--variant-flat{box-shadow:0 0 0 0 var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 0 0 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 0 0 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-chip--variant-outlined{border:thin solid currentColor}.v-chip--variant-text .v-chip__overlay{background:currentColor}.v-chip--variant-tonal .v-chip__underlay{background:currentColor;opacity:var(--v-activated-opacity);border-radius:inherit;inset:0;pointer-events:none}.v-chip .v-chip__underlay{position:absolute}.v-chip--border{border-width:thin}.v-chip--link{cursor:pointer}.v-chip--link,.v-chip--filter{user-select:none}.v-chip__content{align-items:center;display:inline-flex}.v-autocomplete__selection .v-chip__content,.v-combobox__selection .v-chip__content,.v-select__selection .v-chip__content{overflow:hidden}.v-chip__filter,.v-chip__prepend,.v-chip__append,.v-chip__close{align-items:center;display:inline-flex}.v-chip__close{cursor:pointer;flex:0 1 auto;font-size:18px;max-height:18px;max-width:18px;user-select:none}.v-chip__close .v-icon{font-size:inherit}.v-chip__filter{transition:.15s cubic-bezier(.4,0,.2,1)}.v-chip__overlay{background-color:currentColor;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .2s ease-in-out}.v-chip__overlay{position:absolute;top:0;left:0;width:100%;height:100%}.v-chip--disabled{opacity:.3;pointer-events:none;user-select:none}.v-chip--label{border-radius:4px}@media (forced-colors: active){.v-chip:not(.v-chip--variant-text,.v-chip--variant-plain){border:thin solid}}.v-chip-group{display:flex;max-width:100%;min-width:0;overflow-x:auto;padding:4px 0}.v-chip-group .v-chip{margin:4px 8px 4px 0}@media (forced-colors: active){.v-chip-group .v-chip{background-color:buttonface!important;color:buttontext!important}.v-chip-group .v-chip:hover{color:highlight!important}}.v-chip-group .v-chip.v-chip--selected:not(.v-chip--disabled) .v-chip__overlay{opacity:var(--v-activated-opacity)}@media (forced-colors: active){.v-chip-group .v-chip.v-chip--selected:not(.v-chip--disabled){color:highlight!important;forced-color-adjust:preserve-parent-color}.v-chip-group .v-chip.v-chip--selected:not(.v-chip--disabled):focus-visible{outline-offset:2px}.v-chip-group .v-chip.v-chip--selected:not(.v-chip--disabled).v-chip--variant-elevated,.v-chip-group .v-chip.v-chip--selected:not(.v-chip--disabled).v-chip--variant-flat{background-color:highlight!important;color:highlighttext!important}.v-chip-group .v-chip.v-chip--selected:not(.v-chip--disabled).v-chip--variant-outlined,.v-chip-group .v-chip.v-chip--selected:not(.v-chip--disabled).v-chip--variant-tonal{border-width:medium}}.v-chip-group--column .v-slide-group__content{white-space:normal;flex-wrap:wrap;max-width:100%}.v-slide-group{display:flex;overflow:hidden}.v-slide-group__next,.v-slide-group__prev{align-items:center;display:flex;flex:0 1 52px;justify-content:center;min-width:52px;cursor:pointer}.v-slide-group__next--disabled,.v-slide-group__prev--disabled{pointer-events:none;opacity:var(--v-disabled-opacity)}.v-slide-group__content{display:flex;flex:1 0 auto;position:relative;transition:.2s all cubic-bezier(.4,0,.2,1);white-space:nowrap}.v-slide-group__content>*{white-space:initial}.v-slide-group__container{contain:content;display:flex;flex:1 1 auto;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;scrollbar-color:rgba(0,0,0,0)}.v-slide-group__container::-webkit-scrollbar{display:none}.v-slide-group--vertical{max-height:inherit}.v-slide-group--vertical,.v-slide-group--vertical .v-slide-group__container,.v-slide-group--vertical .v-slide-group__content{flex-direction:column}.v-slide-group--vertical .v-slide-group__container{overflow-x:hidden;overflow-y:auto}.v-divider{color:inherit;display:block;flex:1 1 100%;height:0px;max-height:0px;opacity:var(--v-border-opacity);transition:inherit}.v-divider{border-style:solid;border-width:thin 0 0 0}.v-divider--vertical{align-self:stretch;border-width:0 thin 0 0;display:inline-flex;height:auto;margin-left:-1px;max-height:100%;max-width:0px;vertical-align:text-bottom;width:0px}.v-divider--inset:not(.v-divider--vertical){max-width:calc(100% - 72px);margin-inline-start:72px}.v-divider--inset.v-divider--vertical{margin-bottom:8px;margin-top:8px;max-height:calc(100% - 16px)}.v-divider--gradient{mask-image:linear-gradient(90deg,transparent,#000,transparent)}.v-divider--gradient.v-divider--vertical{mask-image:linear-gradient(0deg,transparent,#000,transparent)}.v-divider__content{padding:0 16px;text-wrap:nowrap}.v-divider__wrapper--vertical .v-divider__content{padding:4px 0}.v-divider__wrapper{display:flex;align-items:center;justify-content:center}.v-divider__wrapper--vertical{flex-direction:column;height:100%}.v-divider__wrapper--vertical .v-divider{margin:0 auto}.v-divider__wrapper--gradient{mask-image:linear-gradient(90deg,transparent,#000,transparent)}.v-divider__wrapper--gradient.v-divider__wrapper--vertical{mask-image:linear-gradient(0deg,transparent,#000,transparent)}.v-menu>.v-overlay__content{display:flex;flex-direction:column}.v-menu>.v-overlay__content{border-radius:4px}.v-menu>.v-overlay__content>.v-card,.v-menu>.v-overlay__content>.v-sheet,.v-menu>.v-overlay__content>.v-list{background:rgb(var(--v-theme-surface));border-radius:inherit;overflow:auto;height:100%}.v-menu>.v-overlay__content>.v-card,.v-menu>.v-overlay__content>.v-sheet,.v-menu>.v-overlay__content>.v-list{box-shadow:0 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 3px 14px 2px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-overlay-container{contain:layout;left:0;pointer-events:none;position:absolute;top:0;display:contents}.v-overlay-scroll-blocked{padding-inline-end:var(--v-scrollbar-offset)}.v-overlay-scroll-blocked:not(html){overflow-y:hidden!important}html.v-overlay-scroll-blocked{position:fixed;top:var(--v-body-scroll-y);left:var(--v-body-scroll-x);width:100%;height:100%}.v-overlay{--v-overlay-opacity: .32;border-radius:inherit;display:flex;inset:0;pointer-events:none;position:fixed}.v-overlay__content{outline:none;position:absolute;pointer-events:auto;contain:layout}.v-overlay__scrim{pointer-events:auto;background:#000;border-radius:inherit;inset:0;opacity:var(--v-overlay-opacity);position:fixed}.v-overlay--absolute,.v-overlay--contained .v-overlay__scrim{position:absolute}.v-overlay--scroll-blocked{padding-inline-end:var(--v-scrollbar-offset)}.v-card{display:block;overflow:hidden;overflow-wrap:break-word;position:relative;padding:0;text-decoration:none;transition-duration:.28s;transition-property:box-shadow,opacity,background;transition-timing-function:cubic-bezier(.4,0,.2,1);z-index:0}.v-card{border-color:rgba(var(--v-border-color),var(--v-border-opacity));border-style:solid;border-width:0}.v-card--border{border-width:thin;box-shadow:none}.v-card--absolute{position:absolute}.v-card--fixed{position:fixed}.v-card{border-radius:4px}.v-card:hover>.v-card__overlay{opacity:calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier))}.v-card:focus-visible>.v-card__overlay{opacity:calc(var(--v-focus-opacity) * var(--v-theme-overlay-multiplier))}@supports not selector(:focus-visible){.v-card:focus>.v-card__overlay{opacity:calc(var(--v-focus-opacity) * var(--v-theme-overlay-multiplier))}}.v-card--active>.v-card__overlay,.v-card[aria-haspopup=menu][aria-expanded=true]>.v-card__overlay{opacity:calc(var(--v-activated-opacity) * var(--v-theme-overlay-multiplier))}.v-card--active:hover>.v-card__overlay,.v-card[aria-haspopup=menu][aria-expanded=true]:hover>.v-card__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-hover-opacity)) * var(--v-theme-overlay-multiplier))}.v-card--active:focus-visible>.v-card__overlay,.v-card[aria-haspopup=menu][aria-expanded=true]:focus-visible>.v-card__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-focus-opacity)) * var(--v-theme-overlay-multiplier))}@supports not selector(:focus-visible){.v-card--active:focus>.v-card__overlay,.v-card[aria-haspopup=menu][aria-expanded=true]:focus>.v-card__overlay{opacity:calc((var(--v-activated-opacity) + var(--v-focus-opacity)) * var(--v-theme-overlay-multiplier))}}.v-card--variant-plain,.v-card--variant-outlined,.v-card--variant-text,.v-card--variant-tonal{background:transparent;color:inherit}.v-card--variant-plain{opacity:.62}.v-card--variant-plain:focus,.v-card--variant-plain:hover{opacity:1}.v-card--variant-plain .v-card__overlay{display:none}.v-card--variant-elevated,.v-card--variant-flat{background:rgb(var(--v-theme-surface));color:rgba(var(--v-theme-on-surface),var(--v-high-emphasis-opacity))}.v-card--variant-elevated{box-shadow:0 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 1px 1px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 3px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-card--variant-flat{box-shadow:0 0 0 0 var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 0 0 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 0 0 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-card--variant-outlined{border:thin solid currentColor}.v-card--variant-text .v-card__overlay{background:currentColor}.v-card--variant-tonal .v-card__underlay{background:currentColor;opacity:var(--v-activated-opacity);border-radius:inherit;inset:0;pointer-events:none}.v-card .v-card__underlay{position:absolute}.v-card--disabled{pointer-events:none;user-select:none}.v-card--disabled>:not(.v-card__loader){opacity:.6}.v-card--flat{box-shadow:none}.v-card--hover{cursor:pointer}.v-card--hover:before,.v-card--hover:after{border-radius:inherit;content:\"\";display:block;inset:0;pointer-events:none;position:absolute;transition:inherit}.v-card--hover:before{opacity:1;z-index:-1}.v-card--hover:before{box-shadow:0 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 1px 1px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 3px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-card--hover:after{z-index:1;opacity:0}.v-card--hover:after{box-shadow:0 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 3px 14px 2px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-card--hover:hover:after{opacity:1}.v-card--hover:hover:before{opacity:0}.v-card--hover:hover{box-shadow:0 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 3px 14px 2px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-card--link{cursor:pointer}.v-card-actions{align-items:center;display:flex;flex:none;min-height:52px;padding:.5rem;gap:.5rem}.v-card-item{align-items:center;display:grid;flex:none;grid-template-areas:\"prepend content append\";grid-template-columns:max-content auto max-content;padding:.625rem 1rem}.v-card-item+.v-card-text{padding-top:0}.v-card-item__prepend,.v-card-item__append{align-items:center;display:flex}.v-card-item__prepend{grid-area:prepend;padding-inline-end:.5rem}.v-card-item__append{grid-area:append;padding-inline-start:.5rem}.v-card-item__content{align-self:center;grid-area:content;overflow:hidden}.v-card-title{display:block;flex:none;font-size:1.25rem;font-weight:500;hyphens:auto;letter-spacing:.0125em;min-width:0;overflow-wrap:normal;overflow:hidden;padding:.5rem 1rem;text-overflow:ellipsis;text-transform:none;white-space:nowrap;word-break:normal;word-wrap:break-word}.v-card .v-card-title{line-height:1.6}.v-card--density-comfortable .v-card-title{line-height:1.75rem}.v-card--density-compact .v-card-title{line-height:1.55rem}.v-card-item .v-card-title{padding:0}.v-card-title+.v-card-text,.v-card-title+.v-card-actions{padding-top:0}.v-card-subtitle{display:block;flex:none;font-size:.875rem;font-weight:400;letter-spacing:.0178571429em;opacity:var(--v-card-subtitle-opacity, var(--v-medium-emphasis-opacity));overflow:hidden;padding:0 1rem;text-overflow:ellipsis;text-transform:none;white-space:nowrap}.v-card .v-card-subtitle{line-height:1.425}.v-card--density-comfortable .v-card-subtitle{line-height:1.125rem}.v-card--density-compact .v-card-subtitle{line-height:1rem}.v-card-item .v-card-subtitle{padding:0 0 .25rem}.v-card-text{flex:1 1 auto;font-size:.875rem;font-weight:400;letter-spacing:.0178571429em;opacity:var(--v-card-text-opacity, 1);padding:1rem;text-transform:none}.v-card .v-card-text{line-height:1.425}.v-card--density-comfortable .v-card-text{line-height:1.2rem}.v-card--density-compact .v-card-text{line-height:1.15rem}.v-card__image{display:flex;height:100%;flex:1 1 auto;left:0;overflow:hidden;position:absolute;top:0;width:100%;z-index:-1}.v-card__content{border-radius:inherit;overflow:hidden;position:relative}.v-card__loader{inset:0 0 auto;position:absolute;width:100%;z-index:1}@media (forced-colors: active){.v-card__loader .v-progress-linear{border:none}}.v-card__overlay{background-color:currentColor;border-radius:inherit;position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .2s ease-in-out}@media (forced-colors: active){.v-card:not(.v-card--variant-text,.v-card--variant-plain){border:thin solid}}.v-window{overflow:hidden}.v-window__container{display:flex;flex-direction:column;height:inherit;position:relative;transition:.3s cubic-bezier(.25,.8,.5,1)}.v-window__controls{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:space-between;padding:0 16px;pointer-events:none}.v-window__controls>*{pointer-events:auto}.v-window--show-arrows-on-hover{overflow:hidden}.v-window--show-arrows-on-hover .v-window__left{transform:translate(-200%)}:has(.v-window__controls--right).v-window--show-arrows-on-hover .v-window__left{transform:translate(200%)}.v-window--show-arrows-on-hover .v-window__right{transform:translate(200%)}:has(.v-window__controls--left).v-window--show-arrows-on-hover .v-window__right{transform:translate(-200%)}.v-window--show-arrows-on-hover:hover .v-window__left,.v-window--show-arrows-on-hover:hover .v-window__right{transform:translate(0)}.v-window--vertical-arrows .v-window__controls{flex-direction:column;justify-content:center;gap:12px}.v-window--vertical-arrows .v-window__controls--left{align-items:start}.v-window--vertical-arrows .v-window__controls--right{align-items:end}.v-window--vertical-arrows .v-window__controls .v-window__left .v-icon,.v-window--vertical-arrows .v-window__controls .v-window__right .v-icon{transform:rotate(90deg)}@container style(--v-window-transition-duration){.v-window .v-window-item{transition-duration:var(--v-window-transition-duration)!important}}.v-window--crossfade>.v-window__container{isolation:isolate}.v-window--crossfade>.v-window__container>.v-window-item{mix-blend-mode:plus-lighter}.v-window-x-transition-enter-active,.v-window-x-transition-leave-active,.v-window-x-reverse-transition-enter-active,.v-window-x-reverse-transition-leave-active,.v-window-y-transition-enter-active,.v-window-y-transition-leave-active,.v-window-y-reverse-transition-enter-active,.v-window-y-reverse-transition-leave-active{transition:.3s cubic-bezier(.25,.8,.5,1)}@media (prefers-reduced-motion: reduce){.v-window-x-transition-enter-active,.v-window-x-transition-leave-active,.v-window-x-reverse-transition-enter-active,.v-window-x-reverse-transition-leave-active,.v-window-y-transition-enter-active,.v-window-y-transition-leave-active,.v-window-y-reverse-transition-enter-active,.v-window-y-reverse-transition-leave-active{transition-duration:0s}}.v-window-x-transition-leave-from,.v-window-x-transition-leave-to,.v-window-x-reverse-transition-leave-from,.v-window-x-reverse-transition-leave-to,.v-window-y-transition-leave-from,.v-window-y-transition-leave-to,.v-window-y-reverse-transition-leave-from,.v-window-y-reverse-transition-leave-to{position:absolute!important;top:0;width:100%}.v-window-x-transition-enter-from{transform:translate(100%)}.v-window-x-transition-leave-to,.v-window-x-reverse-transition-enter-from{transform:translate(-100%)}.v-window-x-reverse-transition-leave-to{transform:translate(100%)}.v-window-y-transition-enter-from{transform:translateY(100%)}.v-window-y-transition-leave-to,.v-window-y-reverse-transition-enter-from{transform:translateY(-100%)}.v-window-y-reverse-transition-leave-to{transform:translateY(100%)}.v-window-crossfade-transition-enter-active,.v-window-crossfade-transition-leave-active{transition:.3s cubic-bezier(.25,.8,.5,1)}.v-window-crossfade-transition-leave-from,.v-window-crossfade-transition-leave-to{position:absolute!important;top:0;width:100%}.v-window-crossfade-transition-enter-from,.v-window-crossfade-transition-leave-to{opacity:0}.v-table{font-size:.875rem;transition-duration:.28s;transition-property:box-shadow,opacity,background,height;transition-timing-function:cubic-bezier(.4,0,.2,1)}.v-table{background:rgb(var(--v-theme-surface));color:rgba(var(--v-theme-on-surface),var(--v-high-emphasis-opacity))}.v-table .v-table-divider{border-right:thin solid rgba(var(--v-border-color),var(--v-border-opacity))}.v-table .v-table__wrapper>table>thead>tr>th{border-bottom:thin solid rgba(var(--v-border-color),var(--v-border-opacity))}.v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>td,.v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>th{border-bottom:thin solid rgba(var(--v-border-color),var(--v-border-opacity))}.v-table .v-table__wrapper>table>tfoot>tr>td,.v-table .v-table__wrapper>table>tfoot>tr>th{border-top:thin solid rgba(var(--v-border-color),var(--v-border-opacity))}.v-table.v-table--hover>.v-table__wrapper>table>tbody>tr>td{position:relative}.v-table.v-table--hover>.v-table__wrapper>table>tbody>tr:hover>td:after{background:rgba(var(--v-border-color),var(--v-hover-opacity));pointer-events:none}.v-table.v-table--hover>.v-table__wrapper>table>tbody>tr:hover>td:after{content:\"\";position:absolute;top:0;left:0;width:100%;height:100%}.v-table.v-table--striped-even>.v-table__wrapper>table>tbody>tr:nth-child(2n){background-image:linear-gradient(0deg,rgba(var(--v-border-color),var(--v-hover-opacity)),rgba(var(--v-border-color),var(--v-hover-opacity)))}.v-table.v-table--striped-odd>.v-table__wrapper>table>tbody>tr:nth-child(odd){background-image:linear-gradient(0deg,rgba(var(--v-border-color),var(--v-hover-opacity)),rgba(var(--v-border-color),var(--v-hover-opacity)))}.v-table.v-table--fixed-header>.v-table__wrapper>table>thead>tr>th{background:rgb(var(--v-theme-surface));box-shadow:inset 0 -1px rgba(var(--v-border-color),var(--v-border-opacity));z-index:1}.v-table.v-table--fixed-footer>tfoot>tr>th,.v-table.v-table--fixed-footer>tfoot>tr>td{background:rgb(var(--v-theme-surface));box-shadow:inset 0 1px rgba(var(--v-border-color),var(--v-border-opacity))}.v-table{border-radius:inherit;line-height:1.5;max-width:100%;display:flex;flex-direction:column}.v-table>.v-table__wrapper>table{width:100%;border-spacing:0}.v-table>.v-table__wrapper>table>tbody>tr>td,.v-table>.v-table__wrapper>table>tbody>tr>th,.v-table>.v-table__wrapper>table>thead>tr>td,.v-table>.v-table__wrapper>table>thead>tr>th,.v-table>.v-table__wrapper>table>tfoot>tr>td,.v-table>.v-table__wrapper>table>tfoot>tr>th{padding:0 16px;transition-duration:.28s;transition-property:box-shadow,opacity,background,height;transition-timing-function:cubic-bezier(.4,0,.2,1)}.v-table>.v-table__wrapper>table>tbody>tr>td,.v-table>.v-table__wrapper>table>thead>tr>td,.v-table>.v-table__wrapper>table>tfoot>tr>td{height:var(--v-table-row-height)}.v-table>.v-table__wrapper>table>tbody>tr>th,.v-table>.v-table__wrapper>table>thead>tr>th,.v-table>.v-table__wrapper>table>tfoot>tr>th{height:var(--v-table-header-height);font-weight:500;font-size:inherit;user-select:none;text-align:start}.v-table--density-default{--v-table-header-height: 56px;--v-table-row-height: 52px}.v-table--density-comfortable{--v-table-header-height: 48px;--v-table-row-height: 44px}.v-table--density-compact{--v-table-header-height: 40px;--v-table-row-height: 36px}.v-table__wrapper{border-radius:inherit;overflow:auto;flex:1 1 auto}.v-table--has-top>.v-table__wrapper{border-top-left-radius:0;border-top-right-radius:0}.v-table--has-bottom>.v-table__wrapper{border-bottom-left-radius:0;border-bottom-right-radius:0}.v-table--fixed-height>.v-table__wrapper{overflow-y:auto}.v-table--fixed-header>.v-table__wrapper>table>thead{position:sticky;top:0;z-index:2}.v-table--fixed-header>.v-table__wrapper>table>thead>tr>th{border-bottom:0px!important}.v-table--fixed-footer>.v-table__wrapper>table>tfoot>tr{position:sticky;bottom:0;z-index:1}.v-table--fixed-footer>.v-table__wrapper>table>tfoot>tr>td,.v-table--fixed-footer>.v-table__wrapper>table>tfoot>tr>th{border-top:0px!important}.v-spacer{flex-grow:1}.v-tab.v-tab.v-btn{height:var(--v-tabs-height);border-radius:0;min-width:90px}.v-slide-group--horizontal .v-tab{max-width:360px}.v-slide-group--vertical .v-tab{justify-content:start}.v-tab__slider{position:absolute;bottom:0;left:0;height:2px;width:100%;background:currentColor;pointer-events:none;opacity:0}.v-tab--selected .v-tab__slider{opacity:1}.v-slide-group--vertical .v-tab__slider{top:0;height:100%;width:2px}@media (forced-colors: active){.v-tab--selected.v-btn{color:highlight!important}.v-tab__slider{background:highlight!important}}.v-tabs{display:flex;height:var(--v-tabs-height)}.v-tabs--density-default{--v-tabs-height: 48px}.v-tabs--density-default.v-tabs--stacked{--v-tabs-height: 72px}.v-tabs--density-comfortable{--v-tabs-height: 44px}.v-tabs--density-comfortable.v-tabs--stacked{--v-tabs-height: 68px}.v-tabs--density-compact{--v-tabs-height: 36px}.v-tabs--density-compact.v-tabs--stacked{--v-tabs-height: 60px}.v-tabs.v-slide-group--vertical{height:auto;flex:none;--v-tabs-height: 48px}.v-tabs--align-tabs-title:not(.v-slide-group--has-affixes) .v-tab:first-child{margin-inline-start:42px}.v-tabs--fixed-tabs .v-slide-group__content>*:last-child,.v-tabs--align-tabs-center .v-slide-group__content>*:last-child{margin-inline-end:auto}.v-tabs--fixed-tabs .v-slide-group__content>*:first-child,.v-tabs--align-tabs-center .v-slide-group__content>*:first-child{margin-inline-start:auto}.v-tabs--grow{flex-grow:1}.v-tabs--grow .v-tab{flex:1 0 auto;max-width:none}.v-tabs--align-tabs-end .v-tab:first-child{margin-inline-start:auto}.v-tabs--align-tabs-end .v-tab:last-child{margin-inline-end:0}.v-tabs--inset{--v-tabs-inset-radius: 4px;--v-tabs-inset-padding: 4px;--v-tabs-slider-background: rgba(var(--v-theme-on-surface), .2);background:rgba(var(--v-theme-on-surface),.06);box-shadow:inset 0 0 0 2px rgba(var(--v-border-color),var(--v-border-opacity));border-radius:calc(var(--v-tabs-inset-radius) + var(--v-tabs-inset-padding))}.v-tabs--inset .v-tab{margin:var(--v-tabs-inset-padding);transition-property:box-shadow,transform,opacity,background,color}.v-tabs--inset .v-tab.v-tab.v-btn{border-radius:var(--v-tabs-inset-radius)}.v-tabs--inset .v-tab:focus-visible{outline:2px solid rgb(var(--v-border-color));outline-offset:2px}.v-tabs--inset .v-tab:focus-visible:after{opacity:0}.v-tabs--inset:not(.v-tabs--fixed-tabs,.v-tabs--grow){max-width:max-content}.v-tabs--inset.v-tabs--fixed-tabs .v-slide-group__content{padding-inline:var(--v-tabs-inset-padding)}.v-tabs--inset .v-tab__slider{background:var(--v-tabs-slider-background);inset:0;border-radius:var(--v-tabs-inset-radius);z-index:-1;width:auto}.v-tabs--inset.v-tabs--horizontal{height:calc(var(--v-tabs-height) + var(--v-tabs-inset-padding) * 2);--v-tabs-inset-tab-radius: calc(var(--v-tabs-outer-radius) - var(--v-tabs-inset-padding) + 4px)}.v-tabs--inset.v-tabs--horizontal .v-tab__slider{height:auto}.v-tabs--inset .v-btn__overlay{display:none}.v-tabs--inset.v-tabs--vertical .v-tab{grid-template-columns:max-content 1fr max-content}.v-tabs--inset.v-tabs--vertical .v-tab>.v-btn__content{justify-content:start}.v-tabs--inset.v-tabs--vertical .v-tab .v-tab__slider{width:auto}@media (max-width: 1279.98px){.v-tabs.v-slide-group--is-overflowing.v-slide-group--horizontal:not(.v-slide-group--has-affixes) .v-tab:first-child{margin-inline-start:52px}.v-tabs.v-slide-group--is-overflowing.v-slide-group--horizontal:not(.v-slide-group--has-affixes) .v-tab:last-child{margin-inline-end:52px}}.ns-root{position:absolute;inset:0;pointer-events:none;font-size:14px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;line-height:1.4;color:#000000de;text-align:left}.ns-root .v-application,.ns-root .v-application__wrap{min-height:0!important;background:transparent!important;display:block!important}.ns-root .v-overlay-container{pointer-events:none}.ns-root .v-overlay__content{pointer-events:auto}.ns-root .v-overlay__scrim{pointer-events:none}.ns-head[data-v-b9f55932]{display:flex;gap:10px;align-items:center}.ns-img[data-v-b9f55932]{width:48px;height:48px;object-fit:contain;flex:0 0 auto}.ns-head-text[data-v-b9f55932]{min-width:0}.ns-name[data-v-b9f55932]{font-weight:600;font-size:14px;line-height:1.25}.ns-chips[data-v-b9f55932]{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}.ns-price[data-v-b9f55932]{margin:10px 0 6px}.ns-price-value[data-v-b9f55932]{font-size:20px;font-weight:700;line-height:1.1}.ns-price-date[data-v-b9f55932]{font-size:11px;opacity:.65}.ns-desc[data-v-b9f55932]{font-size:11.5px;opacity:.8;margin:0 0 8px;font-style:italic}.ns-meta[data-v-b9f55932]{display:flex;justify-content:space-between;gap:8px;font-size:10.5px;opacity:.6;margin-top:8px}.ns-cached[data-v-b9f55932]{font-style:italic}.ns-tabs[data-v-4fc488df]{min-height:30px;border-bottom:1px solid rgba(0,0,0,.12)}.ns-tab[data-v-4fc488df]{font-size:11px;letter-spacing:0;text-transform:none;min-width:0;padding:0 12px}.ns-tab-window[data-v-4fc488df]{flex:0 0 auto;height:168px;min-height:168px;overflow-y:auto;overscroll-behavior:contain}.ns-rows[data-v-4fc488df]{font-size:11px}.ns-rows[data-v-4fc488df] td{height:24px!important;padding:0 8px!important;white-space:nowrap}.ns-num[data-v-4fc488df]{text-align:right;font-variant-numeric:tabular-nums}.ns-up[data-v-4fc488df]{color:#2e7d32}.ns-down[data-v-4fc488df]{color:#c62828}.ns-owner[data-v-4fc488df]{text-align:right;opacity:.55;font-size:10px}.ns-noprice[data-v-4fc488df]{opacity:.5;font-size:10px}.ns-bundle[data-v-4fc488df]{font-size:9px;opacity:.6;border:1px solid currentColor;border-radius:3px;padding:0 2px;margin-left:3px}.ns-tp-stats[data-v-4fc488df]{display:flex;flex-wrap:wrap;gap:8px;font-size:10px;opacity:.65;padding:6px 8px 2px}.ns-tp-loading[data-v-4fc488df]{display:flex;flex-direction:column;align-items:center;gap:8px;padding:40px 0;font-size:11px;opacity:.7}.ns-tp-error[data-v-4fc488df]{margin:8px;font-size:11px}.ns-empty[data-v-4fc488df]{font-size:11px;opacity:.6;padding:16px 8px;text-align:center}.ns-body[data-v-b7bec910]{padding:12px 14px 4px}.ns-center[data-v-b7bec910]{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 0}.ns-loading-label[data-v-b7bec910]{font-size:12px;opacity:.7;text-align:center}.ns-detail[data-v-b7bec910]{font-size:11px;opacity:.75;margin-top:4px;word-break:break-word}.ns-actions[data-v-b7bec910]{padding:0 8px 6px;min-height:0}.v-selection-control{align-items:center;contain:layout;display:flex;flex:1 0;grid-area:control;position:relative;user-select:none}.v-selection-control .v-label{white-space:normal;word-break:break-word;height:100%;opacity:1}.v-selection-control--disabled{opacity:var(--v-disabled-opacity);pointer-events:none}.v-selection-control--error:not(.v-selection-control--disabled) .v-label{color:rgb(var(--v-theme-error))}.v-selection-control--inline{display:inline-flex;flex:0 0 auto;min-width:0;max-width:100%}.v-selection-control--inline .v-label{width:auto}.v-selection-control--density-default{--v-selection-control-size: 40px}.v-selection-control--density-comfortable{--v-selection-control-size: 36px}.v-selection-control--density-compact{--v-selection-control-size: 28px}.v-selection-control__wrapper{width:var(--v-selection-control-size);height:var(--v-selection-control-size);display:inline-flex;align-items:center;position:relative;justify-content:center;flex:none}.v-selection-control__input{width:var(--v-selection-control-size);height:var(--v-selection-control-size);align-items:center;display:flex;flex:none;justify-content:center;position:relative;border-radius:50%}.v-selection-control__input input{cursor:pointer;position:absolute;left:0;top:0;width:100%;height:100%;opacity:0}.v-selection-control__input:before{border-radius:100%;background-color:currentColor;opacity:0;pointer-events:none}.v-selection-control__input:before{content:\"\";position:absolute;top:0;left:0;width:100%;height:100%}.v-selection-control__input:hover:before{opacity:calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier))}.v-selection-control__input>.v-icon{opacity:var(--v-medium-emphasis-opacity)}.v-selection-control--disabled .v-selection-control__input>.v-icon,.v-selection-control--dirty .v-selection-control__input>.v-icon,.v-selection-control--error .v-selection-control__input>.v-icon{opacity:1}.v-selection-control--error:not(.v-selection-control--disabled) .v-selection-control__input>.v-icon{color:rgb(var(--v-theme-error))}.v-selection-control--focus-visible .v-selection-control__input:before{opacity:calc(var(--v-focus-opacity) * var(--v-theme-overlay-multiplier))}.v-label{align-items:center;color:inherit;display:inline-flex;font-size:1rem;letter-spacing:.009375em;min-width:0;opacity:var(--v-medium-emphasis-opacity);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v-label--clickable{cursor:pointer}.v-selection-control-group{grid-area:control;display:flex;flex-direction:column}.v-selection-control-group--inline{flex-direction:row;flex-wrap:wrap}.v-input{display:grid;flex:1 1 auto;font-size:1rem;font-weight:400;line-height:1.5}.v-input--disabled{pointer-events:none}.v-input--density-default{--v-input-control-height: 56px;--v-input-padding-top: 16px}.v-input--density-comfortable{--v-input-control-height: 48px;--v-input-padding-top: 12px}.v-input--density-compact{--v-input-control-height: 40px;--v-input-padding-top: 8px}.v-input--vertical{grid-template-areas:\"append\" \"control\" \"prepend\";grid-template-rows:max-content auto max-content;grid-template-columns:min-content}.v-input--vertical .v-input__prepend{margin-block-start:16px}.v-input--vertical .v-input__append{margin-block-end:16px}.v-input--horizontal{grid-template-areas:\"prepend control append\" \"a messages b\";grid-template-columns:max-content minmax(0,1fr) max-content;grid-template-rows:1fr auto}.v-input--horizontal .v-input__prepend{margin-inline-end:16px}.v-input--horizontal .v-input__append{margin-inline-start:16px}.v-input__details{align-items:flex-end;display:flex;font-size:.75rem;font-weight:400;grid-area:messages;letter-spacing:.0333333333em;line-height:normal;min-height:22px;padding-top:6px;overflow:hidden;justify-content:space-between}.v-input__details>.v-icon,.v-input__prepend>.v-icon,.v-input__append>.v-icon{opacity:var(--v-medium-emphasis-opacity)}.v-input--disabled .v-input__details>.v-icon,.v-input--disabled .v-input__details .v-messages,.v-input--error .v-input__details>.v-icon,.v-input--error .v-input__details .v-messages,.v-input--disabled .v-input__prepend>.v-icon,.v-input--disabled .v-input__prepend .v-messages,.v-input--error .v-input__prepend>.v-icon,.v-input--error .v-input__prepend .v-messages,.v-input--disabled .v-input__append>.v-icon,.v-input--disabled .v-input__append .v-messages,.v-input--error .v-input__append>.v-icon,.v-input--error .v-input__append .v-messages{opacity:1}.v-input--glow.v-input--focused .v-input__details>.v-icon,.v-input--glow.v-input--focused .v-input__prepend>.v-icon,.v-input--glow.v-input--focused .v-input__append>.v-icon{opacity:1}.v-input--disabled .v-input__details,.v-input--disabled .v-input__prepend,.v-input--disabled .v-input__append{opacity:var(--v-disabled-opacity)}.v-input--error:not(.v-input--disabled) .v-input__details>.v-icon,.v-input--error:not(.v-input--disabled) .v-input__details .v-messages,.v-input--error:not(.v-input--disabled) .v-input__prepend>.v-icon,.v-input--error:not(.v-input--disabled) .v-input__prepend .v-messages,.v-input--error:not(.v-input--disabled) .v-input__append>.v-icon,.v-input--error:not(.v-input--disabled) .v-input__append .v-messages{color:rgb(var(--v-theme-error))}.v-input__prepend,.v-input__append{display:flex;align-items:flex-start;padding-top:var(--v-input-padding-top)}.v-input--center-affix .v-input__prepend,.v-input--center-affix .v-input__append{align-items:center;padding-top:0}.v-input__prepend{grid-area:prepend}.v-input__append{grid-area:append}.v-input__control{display:flex;grid-area:control}.v-input--hide-spin-buttons input::-webkit-outer-spin-button,.v-input--hide-spin-buttons input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.v-input--hide-spin-buttons input[type=number]{-moz-appearance:textfield}.v-input--plain-underlined .v-input__prepend,.v-input--plain-underlined .v-input__append{align-items:flex-start}.v-input--density-default.v-input--plain-underlined .v-input__prepend,.v-input--density-default.v-input--plain-underlined .v-input__append{padding-top:calc(var(--v-input-padding-top) + 4px)}.v-input--density-comfortable.v-input--plain-underlined .v-input__prepend,.v-input--density-comfortable.v-input--plain-underlined .v-input__append{padding-top:calc(var(--v-input-padding-top) + 2px)}.v-input--density-compact.v-input--plain-underlined .v-input__prepend,.v-input--density-compact.v-input--plain-underlined .v-input__append{padding-top:calc(var(--v-input-padding-top) + 0px)}.v-messages{flex:1 1 auto;font-size:12px;min-height:14px;min-width:1px;opacity:var(--v-medium-emphasis-opacity);position:relative}.v-messages__message{line-height:12px;word-break:break-word;overflow-wrap:break-word;word-wrap:break-word;hyphens:auto;transition-duration:.15s}.v-container{width:100%;padding:16px;margin-right:auto;margin-left:auto}@media (min-width: 960px){.v-container{max-width:900px}}@media (min-width: 1280px){.v-container{max-width:1200px}}@media (min-width: 1920px){.v-container{max-width:1800px}}@media (min-width: 2560px){.v-container{max-width:2400px}}.v-container--fluid{max-width:100%}.v-container.fill-height{align-items:center;display:flex;flex-wrap:wrap}.v-main{flex:1 0 auto;max-width:100%;transition:.2s cubic-bezier(.4,0,.2,1);padding-left:var(--v-layout-left);padding-right:var(--v-layout-right);padding-top:var(--v-layout-top);padding-bottom:var(--v-layout-bottom)}@media (prefers-reduced-motion: reduce){.v-main{transition:none}}.v-main__scroller{max-width:100%;position:relative}.v-main--scrollable{display:flex}.v-main--scrollable{position:absolute;top:0;left:0;width:100%;height:100%}.v-main--scrollable>.v-main__scroller{flex:1 1 auto;overflow-y:auto;--v-layout-left: 0px;--v-layout-right: 0px;--v-layout-top: 0px;--v-layout-bottom: 0px}.v-switch .v-label{padding-inline-start:10px}.v-switch__loader{display:flex}.v-switch__loader .v-progress-circular{color:rgb(var(--v-theme-surface))}.v-switch__track,.v-switch__thumb{transition:none}.v-selection-control--error:not(.v-selection-control--disabled) .v-switch__track,.v-selection-control--error:not(.v-selection-control--disabled) .v-switch__thumb{background-color:rgb(var(--v-theme-error));color:rgb(var(--v-theme-on-error))}.v-switch__track-true{margin-inline-end:auto}.v-selection-control:not(.v-selection-control--dirty) .v-switch__track-true{opacity:0}.v-switch__track-false{margin-inline-start:auto}.v-selection-control--dirty .v-switch__track-false{opacity:0}.v-switch__track{display:inline-flex;align-items:center;font-size:.5rem;padding:0 5px;background-color:rgb(var(--v-theme-surface-variant));border-radius:9999px;height:14px;opacity:.6;min-width:36px;cursor:pointer;transition:.2s background-color cubic-bezier(.4,0,.2,1)}.v-switch--inset .v-switch__track{border-radius:9999px;font-size:.75rem;height:32px;min-width:52px}.v-switch__thumb{align-items:center;background-color:rgb(var(--v-theme-surface-bright));color:rgb(var(--v-theme-on-surface-bright));border-radius:50%;display:flex;font-size:.75rem;height:20px;justify-content:center;width:20px;pointer-events:none;transition:.15s .05s transform cubic-bezier(0,0,.2,1),.2s color cubic-bezier(.4,0,.2,1),.2s background-color cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}.v-switch:not(.v-switch--inset) .v-switch__thumb{box-shadow:0 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 4px 5px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 10px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-switch.v-switch--flat:not(.v-switch--inset) .v-switch__thumb{background:rgb(var(--v-theme-surface-variant));color:rgb(var(--v-theme-on-surface-variant))}.v-switch.v-switch--flat:not(.v-switch--inset) .v-switch__thumb{box-shadow:0 0 0 0 var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 0 0 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 0 0 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))}.v-switch--inset .v-switch__thumb{height:24px;width:24px;transform:scale(.6666666667)}.v-switch--inset .v-switch__thumb--filled{transform:none}.v-switch--inset .v-selection-control--dirty .v-switch__thumb{transform:none;transition:.15s .05s transform cubic-bezier(0,0,.2,1)}.v-switch.v-input{flex:0 1 auto}.v-switch .v-selection-control{min-height:var(--v-input-control-height)}.v-switch .v-selection-control__input{border-radius:50%;transition:.2s transform cubic-bezier(.4,0,.2,1);position:absolute}.v-locale--is-ltr.v-switch .v-selection-control__input,.v-locale--is-ltr .v-switch .v-selection-control__input{transform:translate(-10px)}.v-locale--is-rtl.v-switch .v-selection-control__input,.v-locale--is-rtl .v-switch .v-selection-control__input{transform:translate(10px)}.v-switch .v-selection-control__input .v-icon{position:absolute}.v-locale--is-ltr.v-switch .v-selection-control--dirty .v-selection-control__input,.v-locale--is-ltr .v-switch .v-selection-control--dirty .v-selection-control__input{transform:translate(10px)}.v-locale--is-rtl.v-switch .v-selection-control--dirty .v-selection-control__input,.v-locale--is-rtl .v-switch .v-selection-control--dirty .v-selection-control__input{transform:translate(-10px)}.v-switch.v-switch--indeterminate .v-selection-control__input{transform:scale(.8)}.v-switch.v-switch--indeterminate .v-switch__thumb{transform:scale(.75);box-shadow:none}.v-switch.v-switch--inset .v-selection-control__wrapper{width:auto}.v-switch.v-input--vertical .v-label{min-width:max-content}.v-switch.v-input--vertical .v-selection-control__wrapper{transform:rotate(-90deg)}@media (forced-colors: active){.v-switch .v-switch__loader .v-progress-circular{color:currentColor}.v-switch .v-switch__thumb{background-color:buttontext}.v-switch .v-switch__track,.v-switch .v-switch__thumb{border:1px solid;color:buttontext}.v-switch:not(.v-switch--loading):not(.v-input--disabled) .v-selection-control--dirty .v-switch__thumb{background-color:highlight}.v-switch:not(.v-input--disabled) .v-selection-control--dirty .v-switch__track{background-color:highlight}.v-switch:not(.v-input--disabled) .v-selection-control--dirty .v-switch__track,.v-switch:not(.v-input--disabled) .v-selection-control--dirty .v-switch__thumb{color:highlight}.v-switch.v-switch--inset .v-switch__track{border-width:2px}.v-switch.v-switch--inset:not(.v-switch--loading):not(.v-input--disabled) .v-selection-control--dirty .v-switch__thumb{background-color:highlighttext;color:highlighttext}.v-switch.v-input--disabled .v-switch__thumb{background-color:graytext}.v-switch.v-input--disabled .v-switch__track,.v-switch.v-input--disabled .v-switch__thumb{color:graytext}.v-switch.v-switch--loading .v-switch__thumb{background-color:canvas}.v-switch.v-switch--loading.v-switch--inset .v-switch__thumb,.v-switch.v-switch--loading.v-switch--indeterminate .v-switch__thumb{border-width:0}}@keyframes v-shake{59%{margin-left:0}60%,80%{margin-left:2px}70%,90%{margin-left:-2px}}.bg-black{background-color:#000!important}.bg-black{color:#fff!important}.bg-white{background-color:#fff!important}.bg-white{color:#000!important}.bg-transparent{background-color:transparent!important}.bg-transparent{color:currentColor!important}.bg-red{background-color:#f44336!important}.bg-red{color:#fff!important}.bg-red-lighten-5{background-color:#ffebee!important}.bg-red-lighten-5{color:#000!important}.bg-red-lighten-4{background-color:#ffcdd2!important}.bg-red-lighten-4{color:#000!important}.bg-red-lighten-3{background-color:#ef9a9a!important}.bg-red-lighten-3{color:#000!important}.bg-red-lighten-2{background-color:#e57373!important}.bg-red-lighten-2{color:#fff!important}.bg-red-lighten-1{background-color:#ef5350!important}.bg-red-lighten-1{color:#fff!important}.bg-red-darken-1{background-color:#e53935!important}.bg-red-darken-1{color:#fff!important}.bg-red-darken-2{background-color:#d32f2f!important}.bg-red-darken-2{color:#fff!important}.bg-red-darken-3{background-color:#c62828!important}.bg-red-darken-3{color:#fff!important}.bg-red-darken-4{background-color:#b71c1c!important}.bg-red-darken-4{color:#fff!important}.bg-red-accent-1{background-color:#ff8a80!important}.bg-red-accent-1{color:#000!important}.bg-red-accent-2{background-color:#ff5252!important}.bg-red-accent-2{color:#fff!important}.bg-red-accent-3{background-color:#ff1744!important}.bg-red-accent-3{color:#fff!important}.bg-red-accent-4{background-color:#d50000!important}.bg-red-accent-4{color:#fff!important}.bg-pink{background-color:#e91e63!important}.bg-pink{color:#fff!important}.bg-pink-lighten-5{background-color:#fce4ec!important}.bg-pink-lighten-5{color:#000!important}.bg-pink-lighten-4{background-color:#f8bbd0!important}.bg-pink-lighten-4{color:#000!important}.bg-pink-lighten-3{background-color:#f48fb1!important}.bg-pink-lighten-3{color:#000!important}.bg-pink-lighten-2{background-color:#f06292!important}.bg-pink-lighten-2{color:#fff!important}.bg-pink-lighten-1{background-color:#ec407a!important}.bg-pink-lighten-1{color:#fff!important}.bg-pink-darken-1{background-color:#d81b60!important}.bg-pink-darken-1{color:#fff!important}.bg-pink-darken-2{background-color:#c2185b!important}.bg-pink-darken-2{color:#fff!important}.bg-pink-darken-3{background-color:#ad1457!important}.bg-pink-darken-3{color:#fff!important}.bg-pink-darken-4{background-color:#880e4f!important}.bg-pink-darken-4{color:#fff!important}.bg-pink-accent-1{background-color:#ff80ab!important}.bg-pink-accent-1{color:#fff!important}.bg-pink-accent-2{background-color:#ff4081!important}.bg-pink-accent-2{color:#fff!important}.bg-pink-accent-3{background-color:#f50057!important}.bg-pink-accent-3{color:#fff!important}.bg-pink-accent-4{background-color:#c51162!important}.bg-pink-accent-4{color:#fff!important}.bg-purple{background-color:#9c27b0!important}.bg-purple{color:#fff!important}.bg-purple-lighten-5{background-color:#f3e5f5!important}.bg-purple-lighten-5{color:#000!important}.bg-purple-lighten-4{background-color:#e1bee7!important}.bg-purple-lighten-4{color:#000!important}.bg-purple-lighten-3{background-color:#ce93d8!important}.bg-purple-lighten-3{color:#fff!important}.bg-purple-lighten-2{background-color:#ba68c8!important}.bg-purple-lighten-2{color:#fff!important}.bg-purple-lighten-1{background-color:#ab47bc!important}.bg-purple-lighten-1{color:#fff!important}.bg-purple-darken-1{background-color:#8e24aa!important}.bg-purple-darken-1{color:#fff!important}.bg-purple-darken-2{background-color:#7b1fa2!important}.bg-purple-darken-2{color:#fff!important}.bg-purple-darken-3{background-color:#6a1b9a!important}.bg-purple-darken-3{color:#fff!important}.bg-purple-darken-4{background-color:#4a148c!important}.bg-purple-darken-4{color:#fff!important}.bg-purple-accent-1{background-color:#ea80fc!important}.bg-purple-accent-1{color:#fff!important}.bg-purple-accent-2{background-color:#e040fb!important}.bg-purple-accent-2{color:#fff!important}.bg-purple-accent-3{background-color:#d500f9!important}.bg-purple-accent-3{color:#fff!important}.bg-purple-accent-4{background-color:#a0f!important}.bg-purple-accent-4{color:#fff!important}.bg-deep-purple{background-color:#673ab7!important}.bg-deep-purple{color:#fff!important}.bg-deep-purple-lighten-5{background-color:#ede7f6!important}.bg-deep-purple-lighten-5{color:#000!important}.bg-deep-purple-lighten-4{background-color:#d1c4e9!important}.bg-deep-purple-lighten-4{color:#000!important}.bg-deep-purple-lighten-3{background-color:#b39ddb!important}.bg-deep-purple-lighten-3{color:#fff!important}.bg-deep-purple-lighten-2{background-color:#9575cd!important}.bg-deep-purple-lighten-2{color:#fff!important}.bg-deep-purple-lighten-1{background-color:#7e57c2!important}.bg-deep-purple-lighten-1{color:#fff!important}.bg-deep-purple-darken-1{background-color:#5e35b1!important}.bg-deep-purple-darken-1{color:#fff!important}.bg-deep-purple-darken-2{background-color:#512da8!important}.bg-deep-purple-darken-2{color:#fff!important}.bg-deep-purple-darken-3{background-color:#4527a0!important}.bg-deep-purple-darken-3{color:#fff!important}.bg-deep-purple-darken-4{background-color:#311b92!important}.bg-deep-purple-darken-4{color:#fff!important}.bg-deep-purple-accent-1{background-color:#b388ff!important}.bg-deep-purple-accent-1{color:#fff!important}.bg-deep-purple-accent-2{background-color:#7c4dff!important}.bg-deep-purple-accent-2{color:#fff!important}.bg-deep-purple-accent-3{background-color:#651fff!important}.bg-deep-purple-accent-3{color:#fff!important}.bg-deep-purple-accent-4{background-color:#6200ea!important}.bg-deep-purple-accent-4{color:#fff!important}.bg-indigo{background-color:#3f51b5!important}.bg-indigo{color:#fff!important}.bg-indigo-lighten-5{background-color:#e8eaf6!important}.bg-indigo-lighten-5{color:#000!important}.bg-indigo-lighten-4{background-color:#c5cae9!important}.bg-indigo-lighten-4{color:#000!important}.bg-indigo-lighten-3{background-color:#9fa8da!important}.bg-indigo-lighten-3{color:#fff!important}.bg-indigo-lighten-2{background-color:#7986cb!important}.bg-indigo-lighten-2{color:#fff!important}.bg-indigo-lighten-1{background-color:#5c6bc0!important}.bg-indigo-lighten-1{color:#fff!important}.bg-indigo-darken-1{background-color:#3949ab!important}.bg-indigo-darken-1{color:#fff!important}.bg-indigo-darken-2{background-color:#303f9f!important}.bg-indigo-darken-2{color:#fff!important}.bg-indigo-darken-3{background-color:#283593!important}.bg-indigo-darken-3{color:#fff!important}.bg-indigo-darken-4{background-color:#1a237e!important}.bg-indigo-darken-4{color:#fff!important}.bg-indigo-accent-1{background-color:#8c9eff!important}.bg-indigo-accent-1{color:#fff!important}.bg-indigo-accent-2{background-color:#536dfe!important}.bg-indigo-accent-2{color:#fff!important}.bg-indigo-accent-3{background-color:#3d5afe!important}.bg-indigo-accent-3{color:#fff!important}.bg-indigo-accent-4{background-color:#304ffe!important}.bg-indigo-accent-4{color:#fff!important}.bg-blue{background-color:#2196f3!important}.bg-blue{color:#fff!important}.bg-blue-lighten-5{background-color:#e3f2fd!important}.bg-blue-lighten-5{color:#000!important}.bg-blue-lighten-4{background-color:#bbdefb!important}.bg-blue-lighten-4{color:#000!important}.bg-blue-lighten-3{background-color:#90caf9!important}.bg-blue-lighten-3{color:#000!important}.bg-blue-lighten-2{background-color:#64b5f6!important}.bg-blue-lighten-2{color:#000!important}.bg-blue-lighten-1{background-color:#42a5f5!important}.bg-blue-lighten-1{color:#fff!important}.bg-blue-darken-1{background-color:#1e88e5!important}.bg-blue-darken-1{color:#fff!important}.bg-blue-darken-2{background-color:#1976d2!important}.bg-blue-darken-2{color:#fff!important}.bg-blue-darken-3{background-color:#1565c0!important}.bg-blue-darken-3{color:#fff!important}.bg-blue-darken-4{background-color:#0d47a1!important}.bg-blue-darken-4{color:#fff!important}.bg-blue-accent-1{background-color:#82b1ff!important}.bg-blue-accent-1{color:#000!important}.bg-blue-accent-2{background-color:#448aff!important}.bg-blue-accent-2{color:#fff!important}.bg-blue-accent-3{background-color:#2979ff!important}.bg-blue-accent-3{color:#fff!important}.bg-blue-accent-4{background-color:#2962ff!important}.bg-blue-accent-4{color:#fff!important}.bg-light-blue{background-color:#03a9f4!important}.bg-light-blue{color:#fff!important}.bg-light-blue-lighten-5{background-color:#e1f5fe!important}.bg-light-blue-lighten-5{color:#000!important}.bg-light-blue-lighten-4{background-color:#b3e5fc!important}.bg-light-blue-lighten-4{color:#000!important}.bg-light-blue-lighten-3{background-color:#81d4fa!important}.bg-light-blue-lighten-3{color:#000!important}.bg-light-blue-lighten-2{background-color:#4fc3f7!important}.bg-light-blue-lighten-2{color:#000!important}.bg-light-blue-lighten-1{background-color:#29b6f6!important}.bg-light-blue-lighten-1{color:#000!important}.bg-light-blue-darken-1{background-color:#039be5!important}.bg-light-blue-darken-1{color:#fff!important}.bg-light-blue-darken-2{background-color:#0288d1!important}.bg-light-blue-darken-2{color:#fff!important}.bg-light-blue-darken-3{background-color:#0277bd!important}.bg-light-blue-darken-3{color:#fff!important}.bg-light-blue-darken-4{background-color:#01579b!important}.bg-light-blue-darken-4{color:#fff!important}.bg-light-blue-accent-1{background-color:#80d8ff!important}.bg-light-blue-accent-1{color:#000!important}.bg-light-blue-accent-2{background-color:#40c4ff!important}.bg-light-blue-accent-2{color:#000!important}.bg-light-blue-accent-3{background-color:#00b0ff!important}.bg-light-blue-accent-3{color:#fff!important}.bg-light-blue-accent-4{background-color:#0091ea!important}.bg-light-blue-accent-4{color:#fff!important}.bg-cyan{background-color:#00bcd4!important}.bg-cyan{color:#000!important}.bg-cyan-lighten-5{background-color:#e0f7fa!important}.bg-cyan-lighten-5{color:#000!important}.bg-cyan-lighten-4{background-color:#b2ebf2!important}.bg-cyan-lighten-4{color:#000!important}.bg-cyan-lighten-3{background-color:#80deea!important}.bg-cyan-lighten-3{color:#000!important}.bg-cyan-lighten-2{background-color:#4dd0e1!important}.bg-cyan-lighten-2{color:#000!important}.bg-cyan-lighten-1{background-color:#26c6da!important}.bg-cyan-lighten-1{color:#000!important}.bg-cyan-darken-1{background-color:#00acc1!important}.bg-cyan-darken-1{color:#fff!important}.bg-cyan-darken-2{background-color:#0097a7!important}.bg-cyan-darken-2{color:#fff!important}.bg-cyan-darken-3{background-color:#00838f!important}.bg-cyan-darken-3{color:#fff!important}.bg-cyan-darken-4{background-color:#006064!important}.bg-cyan-darken-4{color:#fff!important}.bg-cyan-accent-1{background-color:#84ffff!important}.bg-cyan-accent-1{color:#000!important}.bg-cyan-accent-2{background-color:#18ffff!important}.bg-cyan-accent-2{color:#000!important}.bg-cyan-accent-3{background-color:#00e5ff!important}.bg-cyan-accent-3{color:#000!important}.bg-cyan-accent-4{background-color:#00b8d4!important}.bg-cyan-accent-4{color:#fff!important}.bg-teal{background-color:#009688!important}.bg-teal{color:#fff!important}.bg-teal-lighten-5{background-color:#e0f2f1!important}.bg-teal-lighten-5{color:#000!important}.bg-teal-lighten-4{background-color:#b2dfdb!important}.bg-teal-lighten-4{color:#000!important}.bg-teal-lighten-3{background-color:#80cbc4!important}.bg-teal-lighten-3{color:#000!important}.bg-teal-lighten-2{background-color:#4db6ac!important}.bg-teal-lighten-2{color:#fff!important}.bg-teal-lighten-1{background-color:#26a69a!important}.bg-teal-lighten-1{color:#fff!important}.bg-teal-darken-1{background-color:#00897b!important}.bg-teal-darken-1{color:#fff!important}.bg-teal-darken-2{background-color:#00796b!important}.bg-teal-darken-2{color:#fff!important}.bg-teal-darken-3{background-color:#00695c!important}.bg-teal-darken-3{color:#fff!important}.bg-teal-darken-4{background-color:#004d40!important}.bg-teal-darken-4{color:#fff!important}.bg-teal-accent-1{background-color:#a7ffeb!important}.bg-teal-accent-1{color:#000!important}.bg-teal-accent-2{background-color:#64ffda!important}.bg-teal-accent-2{color:#000!important}.bg-teal-accent-3{background-color:#1de9b6!important}.bg-teal-accent-3{color:#000!important}.bg-teal-accent-4{background-color:#00bfa5!important}.bg-teal-accent-4{color:#fff!important}.bg-green{background-color:#4caf50!important}.bg-green{color:#fff!important}.bg-green-lighten-5{background-color:#e8f5e9!important}.bg-green-lighten-5{color:#000!important}.bg-green-lighten-4{background-color:#c8e6c9!important}.bg-green-lighten-4{color:#000!important}.bg-green-lighten-3{background-color:#a5d6a7!important}.bg-green-lighten-3{color:#000!important}.bg-green-lighten-2{background-color:#81c784!important}.bg-green-lighten-2{color:#000!important}.bg-green-lighten-1{background-color:#66bb6a!important}.bg-green-lighten-1{color:#fff!important}.bg-green-darken-1{background-color:#43a047!important}.bg-green-darken-1{color:#fff!important}.bg-green-darken-2{background-color:#388e3c!important}.bg-green-darken-2{color:#fff!important}.bg-green-darken-3{background-color:#2e7d32!important}.bg-green-darken-3{color:#fff!important}.bg-green-darken-4{background-color:#1b5e20!important}.bg-green-darken-4{color:#fff!important}.bg-green-accent-1{background-color:#b9f6ca!important}.bg-green-accent-1{color:#000!important}.bg-green-accent-2{background-color:#69f0ae!important}.bg-green-accent-2{color:#000!important}.bg-green-accent-3{background-color:#00e676!important}.bg-green-accent-3{color:#000!important}.bg-green-accent-4{background-color:#00c853!important}.bg-green-accent-4{color:#000!important}.bg-light-green{background-color:#8bc34a!important}.bg-light-green{color:#000!important}.bg-light-green-lighten-5{background-color:#f1f8e9!important}.bg-light-green-lighten-5{color:#000!important}.bg-light-green-lighten-4{background-color:#dcedc8!important}.bg-light-green-lighten-4{color:#000!important}.bg-light-green-lighten-3{background-color:#c5e1a5!important}.bg-light-green-lighten-3{color:#000!important}.bg-light-green-lighten-2{background-color:#aed581!important}.bg-light-green-lighten-2{color:#000!important}.bg-light-green-lighten-1{background-color:#9ccc65!important}.bg-light-green-lighten-1{color:#000!important}.bg-light-green-darken-1{background-color:#7cb342!important}.bg-light-green-darken-1{color:#fff!important}.bg-light-green-darken-2{background-color:#689f38!important}.bg-light-green-darken-2{color:#fff!important}.bg-light-green-darken-3{background-color:#558b2f!important}.bg-light-green-darken-3{color:#fff!important}.bg-light-green-darken-4{background-color:#33691e!important}.bg-light-green-darken-4{color:#fff!important}.bg-light-green-accent-1{background-color:#ccff90!important}.bg-light-green-accent-1{color:#000!important}.bg-light-green-accent-2{background-color:#b2ff59!important}.bg-light-green-accent-2{color:#000!important}.bg-light-green-accent-3{background-color:#76ff03!important}.bg-light-green-accent-3{color:#000!important}.bg-light-green-accent-4{background-color:#64dd17!important}.bg-light-green-accent-4{color:#000!important}.bg-lime{background-color:#cddc39!important}.bg-lime{color:#000!important}.bg-lime-lighten-5{background-color:#f9fbe7!important}.bg-lime-lighten-5{color:#000!important}.bg-lime-lighten-4{background-color:#f0f4c3!important}.bg-lime-lighten-4{color:#000!important}.bg-lime-lighten-3{background-color:#e6ee9c!important}.bg-lime-lighten-3{color:#000!important}.bg-lime-lighten-2{background-color:#dce775!important}.bg-lime-lighten-2{color:#000!important}.bg-lime-lighten-1{background-color:#d4e157!important}.bg-lime-lighten-1{color:#000!important}.bg-lime-darken-1{background-color:#c0ca33!important}.bg-lime-darken-1{color:#000!important}.bg-lime-darken-2{background-color:#afb42b!important}.bg-lime-darken-2{color:#000!important}.bg-lime-darken-3{background-color:#9e9d24!important}.bg-lime-darken-3{color:#fff!important}.bg-lime-darken-4{background-color:#827717!important}.bg-lime-darken-4{color:#fff!important}.bg-lime-accent-1{background-color:#f4ff81!important}.bg-lime-accent-1{color:#000!important}.bg-lime-accent-2{background-color:#eeff41!important}.bg-lime-accent-2{color:#000!important}.bg-lime-accent-3{background-color:#c6ff00!important}.bg-lime-accent-3{color:#000!important}.bg-lime-accent-4{background-color:#aeea00!important}.bg-lime-accent-4{color:#000!important}.bg-yellow{background-color:#ffeb3b!important}.bg-yellow{color:#000!important}.bg-yellow-lighten-5{background-color:#fffde7!important}.bg-yellow-lighten-5{color:#000!important}.bg-yellow-lighten-4{background-color:#fff9c4!important}.bg-yellow-lighten-4{color:#000!important}.bg-yellow-lighten-3{background-color:#fff59d!important}.bg-yellow-lighten-3{color:#000!important}.bg-yellow-lighten-2{background-color:#fff176!important}.bg-yellow-lighten-2{color:#000!important}.bg-yellow-lighten-1{background-color:#ffee58!important}.bg-yellow-lighten-1{color:#000!important}.bg-yellow-darken-1{background-color:#fdd835!important}.bg-yellow-darken-1{color:#000!important}.bg-yellow-darken-2{background-color:#fbc02d!important}.bg-yellow-darken-2{color:#000!important}.bg-yellow-darken-3{background-color:#f9a825!important}.bg-yellow-darken-3{color:#000!important}.bg-yellow-darken-4{background-color:#f57f17!important}.bg-yellow-darken-4{color:#fff!important}.bg-yellow-accent-1{background-color:#ffff8d!important}.bg-yellow-accent-1{color:#000!important}.bg-yellow-accent-2{background-color:#ff0!important}.bg-yellow-accent-2{color:#000!important}.bg-yellow-accent-3{background-color:#ffea00!important}.bg-yellow-accent-3{color:#000!important}.bg-yellow-accent-4{background-color:#ffd600!important}.bg-yellow-accent-4{color:#000!important}.bg-amber{background-color:#ffc107!important}.bg-amber{color:#000!important}.bg-amber-lighten-5{background-color:#fff8e1!important}.bg-amber-lighten-5{color:#000!important}.bg-amber-lighten-4{background-color:#ffecb3!important}.bg-amber-lighten-4{color:#000!important}.bg-amber-lighten-3{background-color:#ffe082!important}.bg-amber-lighten-3{color:#000!important}.bg-amber-lighten-2{background-color:#ffd54f!important}.bg-amber-lighten-2{color:#000!important}.bg-amber-lighten-1{background-color:#ffca28!important}.bg-amber-lighten-1{color:#000!important}.bg-amber-darken-1{background-color:#ffb300!important}.bg-amber-darken-1{color:#000!important}.bg-amber-darken-2{background-color:#ffa000!important}.bg-amber-darken-2{color:#000!important}.bg-amber-darken-3{background-color:#ff8f00!important}.bg-amber-darken-3{color:#000!important}.bg-amber-darken-4{background-color:#ff6f00!important}.bg-amber-darken-4{color:#fff!important}.bg-amber-accent-1{background-color:#ffe57f!important}.bg-amber-accent-1{color:#000!important}.bg-amber-accent-2{background-color:#ffd740!important}.bg-amber-accent-2{color:#000!important}.bg-amber-accent-3{background-color:#ffc400!important}.bg-amber-accent-3{color:#000!important}.bg-amber-accent-4{background-color:#ffab00!important}.bg-amber-accent-4{color:#000!important}.bg-orange{background-color:#ff9800!important}.bg-orange{color:#000!important}.bg-orange-lighten-5{background-color:#fff3e0!important}.bg-orange-lighten-5{color:#000!important}.bg-orange-lighten-4{background-color:#ffe0b2!important}.bg-orange-lighten-4{color:#000!important}.bg-orange-lighten-3{background-color:#ffcc80!important}.bg-orange-lighten-3{color:#000!important}.bg-orange-lighten-2{background-color:#ffb74d!important}.bg-orange-lighten-2{color:#000!important}.bg-orange-lighten-1{background-color:#ffa726!important}.bg-orange-lighten-1{color:#000!important}.bg-orange-darken-1{background-color:#fb8c00!important}.bg-orange-darken-1{color:#fff!important}.bg-orange-darken-2{background-color:#f57c00!important}.bg-orange-darken-2{color:#fff!important}.bg-orange-darken-3{background-color:#ef6c00!important}.bg-orange-darken-3{color:#fff!important}.bg-orange-darken-4{background-color:#e65100!important}.bg-orange-darken-4{color:#fff!important}.bg-orange-accent-1{background-color:#ffd180!important}.bg-orange-accent-1{color:#000!important}.bg-orange-accent-2{background-color:#ffab40!important}.bg-orange-accent-2{color:#000!important}.bg-orange-accent-3{background-color:#ff9100!important}.bg-orange-accent-3{color:#000!important}.bg-orange-accent-4{background-color:#ff6d00!important}.bg-orange-accent-4{color:#fff!important}.bg-deep-orange{background-color:#ff5722!important}.bg-deep-orange{color:#fff!important}.bg-deep-orange-lighten-5{background-color:#fbe9e7!important}.bg-deep-orange-lighten-5{color:#000!important}.bg-deep-orange-lighten-4{background-color:#ffccbc!important}.bg-deep-orange-lighten-4{color:#000!important}.bg-deep-orange-lighten-3{background-color:#ffab91!important}.bg-deep-orange-lighten-3{color:#000!important}.bg-deep-orange-lighten-2{background-color:#ff8a65!important}.bg-deep-orange-lighten-2{color:#000!important}.bg-deep-orange-lighten-1{background-color:#ff7043!important}.bg-deep-orange-lighten-1{color:#fff!important}.bg-deep-orange-darken-1{background-color:#f4511e!important}.bg-deep-orange-darken-1{color:#fff!important}.bg-deep-orange-darken-2{background-color:#e64a19!important}.bg-deep-orange-darken-2{color:#fff!important}.bg-deep-orange-darken-3{background-color:#d84315!important}.bg-deep-orange-darken-3{color:#fff!important}.bg-deep-orange-darken-4{background-color:#bf360c!important}.bg-deep-orange-darken-4{color:#fff!important}.bg-deep-orange-accent-1{background-color:#ff9e80!important}.bg-deep-orange-accent-1{color:#000!important}.bg-deep-orange-accent-2{background-color:#ff6e40!important}.bg-deep-orange-accent-2{color:#fff!important}.bg-deep-orange-accent-3{background-color:#ff3d00!important}.bg-deep-orange-accent-3{color:#fff!important}.bg-deep-orange-accent-4{background-color:#dd2c00!important}.bg-deep-orange-accent-4{color:#fff!important}.bg-brown{background-color:#795548!important}.bg-brown{color:#fff!important}.bg-brown-lighten-5{background-color:#efebe9!important}.bg-brown-lighten-5{color:#000!important}.bg-brown-lighten-4{background-color:#d7ccc8!important}.bg-brown-lighten-4{color:#000!important}.bg-brown-lighten-3{background-color:#bcaaa4!important}.bg-brown-lighten-3{color:#000!important}.bg-brown-lighten-2{background-color:#a1887f!important}.bg-brown-lighten-2{color:#fff!important}.bg-brown-lighten-1{background-color:#8d6e63!important}.bg-brown-lighten-1{color:#fff!important}.bg-brown-darken-1{background-color:#6d4c41!important}.bg-brown-darken-1{color:#fff!important}.bg-brown-darken-2{background-color:#5d4037!important}.bg-brown-darken-2{color:#fff!important}.bg-brown-darken-3{background-color:#4e342e!important}.bg-brown-darken-3{color:#fff!important}.bg-brown-darken-4{background-color:#3e2723!important}.bg-brown-darken-4{color:#fff!important}.bg-blue-grey{background-color:#607d8b!important}.bg-blue-grey{color:#fff!important}.bg-blue-grey-lighten-5{background-color:#eceff1!important}.bg-blue-grey-lighten-5{color:#000!important}.bg-blue-grey-lighten-4{background-color:#cfd8dc!important}.bg-blue-grey-lighten-4{color:#000!important}.bg-blue-grey-lighten-3{background-color:#b0bec5!important}.bg-blue-grey-lighten-3{color:#000!important}.bg-blue-grey-lighten-2{background-color:#90a4ae!important}.bg-blue-grey-lighten-2{color:#fff!important}.bg-blue-grey-lighten-1{background-color:#78909c!important}.bg-blue-grey-lighten-1{color:#fff!important}.bg-blue-grey-darken-1{background-color:#546e7a!important}.bg-blue-grey-darken-1{color:#fff!important}.bg-blue-grey-darken-2{background-color:#455a64!important}.bg-blue-grey-darken-2{color:#fff!important}.bg-blue-grey-darken-3{background-color:#37474f!important}.bg-blue-grey-darken-3{color:#fff!important}.bg-blue-grey-darken-4{background-color:#263238!important}.bg-blue-grey-darken-4{color:#fff!important}.bg-grey{background-color:#9e9e9e!important}.bg-grey{color:#fff!important}.bg-grey-lighten-5{background-color:#fafafa!important}.bg-grey-lighten-5{color:#000!important}.bg-grey-lighten-4{background-color:#f5f5f5!important}.bg-grey-lighten-4{color:#000!important}.bg-grey-lighten-3{background-color:#eee!important}.bg-grey-lighten-3{color:#000!important}.bg-grey-lighten-2{background-color:#e0e0e0!important}.bg-grey-lighten-2{color:#000!important}.bg-grey-lighten-1{background-color:#bdbdbd!important}.bg-grey-lighten-1{color:#000!important}.bg-grey-darken-1{background-color:#757575!important}.bg-grey-darken-1{color:#fff!important}.bg-grey-darken-2{background-color:#616161!important}.bg-grey-darken-2{color:#fff!important}.bg-grey-darken-3{background-color:#424242!important}.bg-grey-darken-3{color:#fff!important}.bg-grey-darken-4{background-color:#212121!important}.bg-grey-darken-4{color:#fff!important}.bg-shades-black{background-color:#000!important}.bg-shades-black{color:#fff!important}.bg-shades-white{background-color:#fff!important}.bg-shades-white{color:#000!important}.bg-shades-transparent{background-color:transparent!important}.bg-shades-transparent{color:currentColor!important}.text-black{color:#000!important}.text-white{color:#fff!important}.text-transparent{color:transparent!important}.text-red{color:#f44336!important}.text-red-lighten-5{color:#ffebee!important}.text-red-lighten-4{color:#ffcdd2!important}.text-red-lighten-3{color:#ef9a9a!important}.text-red-lighten-2{color:#e57373!important}.text-red-lighten-1{color:#ef5350!important}.text-red-darken-1{color:#e53935!important}.text-red-darken-2{color:#d32f2f!important}.text-red-darken-3{color:#c62828!important}.text-red-darken-4{color:#b71c1c!important}.text-red-accent-1{color:#ff8a80!important}.text-red-accent-2{color:#ff5252!important}.text-red-accent-3{color:#ff1744!important}.text-red-accent-4{color:#d50000!important}.text-pink{color:#e91e63!important}.text-pink-lighten-5{color:#fce4ec!important}.text-pink-lighten-4{color:#f8bbd0!important}.text-pink-lighten-3{color:#f48fb1!important}.text-pink-lighten-2{color:#f06292!important}.text-pink-lighten-1{color:#ec407a!important}.text-pink-darken-1{color:#d81b60!important}.text-pink-darken-2{color:#c2185b!important}.text-pink-darken-3{color:#ad1457!important}.text-pink-darken-4{color:#880e4f!important}.text-pink-accent-1{color:#ff80ab!important}.text-pink-accent-2{color:#ff4081!important}.text-pink-accent-3{color:#f50057!important}.text-pink-accent-4{color:#c51162!important}.text-purple{color:#9c27b0!important}.text-purple-lighten-5{color:#f3e5f5!important}.text-purple-lighten-4{color:#e1bee7!important}.text-purple-lighten-3{color:#ce93d8!important}.text-purple-lighten-2{color:#ba68c8!important}.text-purple-lighten-1{color:#ab47bc!important}.text-purple-darken-1{color:#8e24aa!important}.text-purple-darken-2{color:#7b1fa2!important}.text-purple-darken-3{color:#6a1b9a!important}.text-purple-darken-4{color:#4a148c!important}.text-purple-accent-1{color:#ea80fc!important}.text-purple-accent-2{color:#e040fb!important}.text-purple-accent-3{color:#d500f9!important}.text-purple-accent-4{color:#a0f!important}.text-deep-purple{color:#673ab7!important}.text-deep-purple-lighten-5{color:#ede7f6!important}.text-deep-purple-lighten-4{color:#d1c4e9!important}.text-deep-purple-lighten-3{color:#b39ddb!important}.text-deep-purple-lighten-2{color:#9575cd!important}.text-deep-purple-lighten-1{color:#7e57c2!important}.text-deep-purple-darken-1{color:#5e35b1!important}.text-deep-purple-darken-2{color:#512da8!important}.text-deep-purple-darken-3{color:#4527a0!important}.text-deep-purple-darken-4{color:#311b92!important}.text-deep-purple-accent-1{color:#b388ff!important}.text-deep-purple-accent-2{color:#7c4dff!important}.text-deep-purple-accent-3{color:#651fff!important}.text-deep-purple-accent-4{color:#6200ea!important}.text-indigo{color:#3f51b5!important}.text-indigo-lighten-5{color:#e8eaf6!important}.text-indigo-lighten-4{color:#c5cae9!important}.text-indigo-lighten-3{color:#9fa8da!important}.text-indigo-lighten-2{color:#7986cb!important}.text-indigo-lighten-1{color:#5c6bc0!important}.text-indigo-darken-1{color:#3949ab!important}.text-indigo-darken-2{color:#303f9f!important}.text-indigo-darken-3{color:#283593!important}.text-indigo-darken-4{color:#1a237e!important}.text-indigo-accent-1{color:#8c9eff!important}.text-indigo-accent-2{color:#536dfe!important}.text-indigo-accent-3{color:#3d5afe!important}.text-indigo-accent-4{color:#304ffe!important}.text-blue{color:#2196f3!important}.text-blue-lighten-5{color:#e3f2fd!important}.text-blue-lighten-4{color:#bbdefb!important}.text-blue-lighten-3{color:#90caf9!important}.text-blue-lighten-2{color:#64b5f6!important}.text-blue-lighten-1{color:#42a5f5!important}.text-blue-darken-1{color:#1e88e5!important}.text-blue-darken-2{color:#1976d2!important}.text-blue-darken-3{color:#1565c0!important}.text-blue-darken-4{color:#0d47a1!important}.text-blue-accent-1{color:#82b1ff!important}.text-blue-accent-2{color:#448aff!important}.text-blue-accent-3{color:#2979ff!important}.text-blue-accent-4{color:#2962ff!important}.text-light-blue{color:#03a9f4!important}.text-light-blue-lighten-5{color:#e1f5fe!important}.text-light-blue-lighten-4{color:#b3e5fc!important}.text-light-blue-lighten-3{color:#81d4fa!important}.text-light-blue-lighten-2{color:#4fc3f7!important}.text-light-blue-lighten-1{color:#29b6f6!important}.text-light-blue-darken-1{color:#039be5!important}.text-light-blue-darken-2{color:#0288d1!important}.text-light-blue-darken-3{color:#0277bd!important}.text-light-blue-darken-4{color:#01579b!important}.text-light-blue-accent-1{color:#80d8ff!important}.text-light-blue-accent-2{color:#40c4ff!important}.text-light-blue-accent-3{color:#00b0ff!important}.text-light-blue-accent-4{color:#0091ea!important}.text-cyan{color:#00bcd4!important}.text-cyan-lighten-5{color:#e0f7fa!important}.text-cyan-lighten-4{color:#b2ebf2!important}.text-cyan-lighten-3{color:#80deea!important}.text-cyan-lighten-2{color:#4dd0e1!important}.text-cyan-lighten-1{color:#26c6da!important}.text-cyan-darken-1{color:#00acc1!important}.text-cyan-darken-2{color:#0097a7!important}.text-cyan-darken-3{color:#00838f!important}.text-cyan-darken-4{color:#006064!important}.text-cyan-accent-1{color:#84ffff!important}.text-cyan-accent-2{color:#18ffff!important}.text-cyan-accent-3{color:#00e5ff!important}.text-cyan-accent-4{color:#00b8d4!important}.text-teal{color:#009688!important}.text-teal-lighten-5{color:#e0f2f1!important}.text-teal-lighten-4{color:#b2dfdb!important}.text-teal-lighten-3{color:#80cbc4!important}.text-teal-lighten-2{color:#4db6ac!important}.text-teal-lighten-1{color:#26a69a!important}.text-teal-darken-1{color:#00897b!important}.text-teal-darken-2{color:#00796b!important}.text-teal-darken-3{color:#00695c!important}.text-teal-darken-4{color:#004d40!important}.text-teal-accent-1{color:#a7ffeb!important}.text-teal-accent-2{color:#64ffda!important}.text-teal-accent-3{color:#1de9b6!important}.text-teal-accent-4{color:#00bfa5!important}.text-green{color:#4caf50!important}.text-green-lighten-5{color:#e8f5e9!important}.text-green-lighten-4{color:#c8e6c9!important}.text-green-lighten-3{color:#a5d6a7!important}.text-green-lighten-2{color:#81c784!important}.text-green-lighten-1{color:#66bb6a!important}.text-green-darken-1{color:#43a047!important}.text-green-darken-2{color:#388e3c!important}.text-green-darken-3{color:#2e7d32!important}.text-green-darken-4{color:#1b5e20!important}.text-green-accent-1{color:#b9f6ca!important}.text-green-accent-2{color:#69f0ae!important}.text-green-accent-3{color:#00e676!important}.text-green-accent-4{color:#00c853!important}.text-light-green{color:#8bc34a!important}.text-light-green-lighten-5{color:#f1f8e9!important}.text-light-green-lighten-4{color:#dcedc8!important}.text-light-green-lighten-3{color:#c5e1a5!important}.text-light-green-lighten-2{color:#aed581!important}.text-light-green-lighten-1{color:#9ccc65!important}.text-light-green-darken-1{color:#7cb342!important}.text-light-green-darken-2{color:#689f38!important}.text-light-green-darken-3{color:#558b2f!important}.text-light-green-darken-4{color:#33691e!important}.text-light-green-accent-1{color:#ccff90!important}.text-light-green-accent-2{color:#b2ff59!important}.text-light-green-accent-3{color:#76ff03!important}.text-light-green-accent-4{color:#64dd17!important}.text-lime{color:#cddc39!important}.text-lime-lighten-5{color:#f9fbe7!important}.text-lime-lighten-4{color:#f0f4c3!important}.text-lime-lighten-3{color:#e6ee9c!important}.text-lime-lighten-2{color:#dce775!important}.text-lime-lighten-1{color:#d4e157!important}.text-lime-darken-1{color:#c0ca33!important}.text-lime-darken-2{color:#afb42b!important}.text-lime-darken-3{color:#9e9d24!important}.text-lime-darken-4{color:#827717!important}.text-lime-accent-1{color:#f4ff81!important}.text-lime-accent-2{color:#eeff41!important}.text-lime-accent-3{color:#c6ff00!important}.text-lime-accent-4{color:#aeea00!important}.text-yellow{color:#ffeb3b!important}.text-yellow-lighten-5{color:#fffde7!important}.text-yellow-lighten-4{color:#fff9c4!important}.text-yellow-lighten-3{color:#fff59d!important}.text-yellow-lighten-2{color:#fff176!important}.text-yellow-lighten-1{color:#ffee58!important}.text-yellow-darken-1{color:#fdd835!important}.text-yellow-darken-2{color:#fbc02d!important}.text-yellow-darken-3{color:#f9a825!important}.text-yellow-darken-4{color:#f57f17!important}.text-yellow-accent-1{color:#ffff8d!important}.text-yellow-accent-2{color:#ff0!important}.text-yellow-accent-3{color:#ffea00!important}.text-yellow-accent-4{color:#ffd600!important}.text-amber{color:#ffc107!important}.text-amber-lighten-5{color:#fff8e1!important}.text-amber-lighten-4{color:#ffecb3!important}.text-amber-lighten-3{color:#ffe082!important}.text-amber-lighten-2{color:#ffd54f!important}.text-amber-lighten-1{color:#ffca28!important}.text-amber-darken-1{color:#ffb300!important}.text-amber-darken-2{color:#ffa000!important}.text-amber-darken-3{color:#ff8f00!important}.text-amber-darken-4{color:#ff6f00!important}.text-amber-accent-1{color:#ffe57f!important}.text-amber-accent-2{color:#ffd740!important}.text-amber-accent-3{color:#ffc400!important}.text-amber-accent-4{color:#ffab00!important}.text-orange{color:#ff9800!important}.text-orange-lighten-5{color:#fff3e0!important}.text-orange-lighten-4{color:#ffe0b2!important}.text-orange-lighten-3{color:#ffcc80!important}.text-orange-lighten-2{color:#ffb74d!important}.text-orange-lighten-1{color:#ffa726!important}.text-orange-darken-1{color:#fb8c00!important}.text-orange-darken-2{color:#f57c00!important}.text-orange-darken-3{color:#ef6c00!important}.text-orange-darken-4{color:#e65100!important}.text-orange-accent-1{color:#ffd180!important}.text-orange-accent-2{color:#ffab40!important}.text-orange-accent-3{color:#ff9100!important}.text-orange-accent-4{color:#ff6d00!important}.text-deep-orange{color:#ff5722!important}.text-deep-orange-lighten-5{color:#fbe9e7!important}.text-deep-orange-lighten-4{color:#ffccbc!important}.text-deep-orange-lighten-3{color:#ffab91!important}.text-deep-orange-lighten-2{color:#ff8a65!important}.text-deep-orange-lighten-1{color:#ff7043!important}.text-deep-orange-darken-1{color:#f4511e!important}.text-deep-orange-darken-2{color:#e64a19!important}.text-deep-orange-darken-3{color:#d84315!important}.text-deep-orange-darken-4{color:#bf360c!important}.text-deep-orange-accent-1{color:#ff9e80!important}.text-deep-orange-accent-2{color:#ff6e40!important}.text-deep-orange-accent-3{color:#ff3d00!important}.text-deep-orange-accent-4{color:#dd2c00!important}.text-brown{color:#795548!important}.text-brown-lighten-5{color:#efebe9!important}.text-brown-lighten-4{color:#d7ccc8!important}.text-brown-lighten-3{color:#bcaaa4!important}.text-brown-lighten-2{color:#a1887f!important}.text-brown-lighten-1{color:#8d6e63!important}.text-brown-darken-1{color:#6d4c41!important}.text-brown-darken-2{color:#5d4037!important}.text-brown-darken-3{color:#4e342e!important}.text-brown-darken-4{color:#3e2723!important}.text-blue-grey{color:#607d8b!important}.text-blue-grey-lighten-5{color:#eceff1!important}.text-blue-grey-lighten-4{color:#cfd8dc!important}.text-blue-grey-lighten-3{color:#b0bec5!important}.text-blue-grey-lighten-2{color:#90a4ae!important}.text-blue-grey-lighten-1{color:#78909c!important}.text-blue-grey-darken-1{color:#546e7a!important}.text-blue-grey-darken-2{color:#455a64!important}.text-blue-grey-darken-3{color:#37474f!important}.text-blue-grey-darken-4{color:#263238!important}.text-grey{color:#9e9e9e!important}.text-grey-lighten-5{color:#fafafa!important}.text-grey-lighten-4{color:#f5f5f5!important}.text-grey-lighten-3{color:#eee!important}.text-grey-lighten-2{color:#e0e0e0!important}.text-grey-lighten-1{color:#bdbdbd!important}.text-grey-darken-1{color:#757575!important}.text-grey-darken-2{color:#616161!important}.text-grey-darken-3{color:#424242!important}.text-grey-darken-4{color:#212121!important}.text-shades-black{color:#000!important}.text-shades-white{color:#fff!important}.text-shades-transparent{color:transparent!important}/*!\n * ress.css • v2.0.4\n * MIT License\n * github.com/filipelinhares/ress\n */html{box-sizing:border-box;overflow-y:scroll;-webkit-text-size-adjust:100%;word-break:normal;-moz-tab-size:4;tab-size:4}*,:before,:after{background-repeat:no-repeat;box-sizing:inherit}:before,:after{text-decoration:inherit;vertical-align:inherit}*{padding:0;margin:0}hr{overflow:visible;height:0}details,main{display:block}summary{display:list-item}small{font-size:80%}[hidden]{display:none}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}a{background-color:transparent}a:active,a:hover{outline-width:0}code,kbd,pre,samp{font-family:monospace,monospace}pre{font-size:1em}b,strong{font-weight:bolder}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}input{border-radius:0}[disabled]{cursor:default}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}textarea{overflow:auto;resize:vertical}button,input,optgroup,select,textarea{font:inherit}optgroup{font-weight:700}button{overflow:visible}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit],[role=button]{cursor:pointer;color:inherit}button::-moz-focus-inner,[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner{outline:1px dotted ButtonText}button,html [type=button],[type=reset],[type=submit]{-webkit-appearance:button}button,input,select,textarea{background-color:transparent;border-style:none}select{-moz-appearance:none;-webkit-appearance:none}select::-ms-expand{display:none}select::-ms-value{color:currentColor}legend{border:0;color:inherit;display:table;white-space:normal;max-width:100%}::-webkit-file-upload-button{-webkit-appearance:button;color:inherit;font:inherit}::-ms-clear,::-ms-reveal{display:none}img{border-style:none}progress{vertical-align:baseline}@media screen{[hidden~=screen]{display:inherit}[hidden~=screen]:not(:active):not(:focus):not(:target){position:absolute!important;clip:rect(0 0 0 0)!important}}[aria-busy=true]{cursor:progress}[aria-controls]{cursor:pointer}[aria-disabled=true]{cursor:default}@media (prefers-reduced-motion: no-preference){.dialog-transition-enter-active,.dialog-bottom-transition-enter-active,.dialog-top-transition-enter-active{transition-duration:225ms!important;transition-timing-function:cubic-bezier(0,0,.2,1)!important}.dialog-transition-leave-active,.dialog-bottom-transition-leave-active,.dialog-top-transition-leave-active{transition-duration:125ms!important;transition-timing-function:cubic-bezier(.4,0,1,1)!important}.dialog-transition-enter-active,.dialog-transition-leave-active,.dialog-bottom-transition-enter-active,.dialog-bottom-transition-leave-active,.dialog-top-transition-enter-active,.dialog-top-transition-leave-active{transition-property:transform,opacity!important;pointer-events:none}.dialog-transition-enter-from,.dialog-transition-leave-to{transform:scale(.9);opacity:0}.dialog-transition-enter-to,.dialog-transition-leave-from{opacity:1}.dialog-bottom-transition-enter-from,.dialog-bottom-transition-leave-to{transform:translateY(calc(50vh + 50%))}.dialog-top-transition-enter-from,.dialog-top-transition-leave-to{transform:translateY(calc(-50vh - 50%))}.picker-transition-enter-active,.picker-reverse-transition-enter-active,.picker-transition-leave-active,.picker-reverse-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.picker-transition-move,.picker-reverse-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.picker-transition-enter-from,.picker-transition-leave-to,.picker-reverse-transition-enter-from,.picker-reverse-transition-leave-to{opacity:0}.picker-transition-leave-from,.picker-transition-leave-active,.picker-transition-leave-to,.picker-reverse-transition-leave-from,.picker-reverse-transition-leave-active,.picker-reverse-transition-leave-to{position:absolute!important}.picker-transition-enter-active,.picker-transition-leave-active,.picker-reverse-transition-enter-active,.picker-reverse-transition-leave-active{transition-property:transform,opacity!important}.picker-transition-enter-active,.picker-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.picker-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.picker-transition-enter-from{transform:translate(100%)}.picker-transition-leave-to{transform:translate(-100%)}.picker-reverse-transition-enter-active,.picker-reverse-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.picker-reverse-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.picker-reverse-transition-enter-from{transform:translate(-100%)}.picker-reverse-transition-leave-to{transform:translate(100%)}.expand-transition-enter-active,.expand-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.expand-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.expand-transition-enter-active,.expand-transition-leave-active{transition-property:height!important}.expand-x-transition-enter-active,.expand-x-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.expand-x-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.expand-x-transition-enter-active,.expand-x-transition-leave-active{transition-property:width!important}.expand-both-transition-enter-active,.expand-both-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.expand-both-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.expand-both-transition-enter-active,.expand-both-transition-leave-active{transition-property:height,width!important}.scale-transition-enter-active,.scale-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scale-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scale-transition-leave-to{opacity:0}.scale-transition-leave-active{transition-duration:.1s!important}.scale-transition-enter-from{opacity:0;transform:scale(0)}.scale-transition-enter-active,.scale-transition-leave-active{transition-property:transform,opacity!important}.scale-rotate-transition-enter-active,.scale-rotate-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scale-rotate-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scale-rotate-transition-leave-to{opacity:0}.scale-rotate-transition-leave-active{transition-duration:.1s!important}.scale-rotate-transition-enter-from{opacity:0;transform:scale(0) rotate(-45deg)}.scale-rotate-transition-enter-active,.scale-rotate-transition-leave-active{transition-property:transform,opacity!important}.scale-rotate-reverse-transition-enter-active,.scale-rotate-reverse-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scale-rotate-reverse-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scale-rotate-reverse-transition-leave-to{opacity:0}.scale-rotate-reverse-transition-leave-active{transition-duration:.1s!important}.scale-rotate-reverse-transition-enter-from{opacity:0;transform:scale(0) rotate(45deg)}.scale-rotate-reverse-transition-enter-active,.scale-rotate-reverse-transition-leave-active{transition-property:transform,opacity!important}.message-transition-enter-active,.message-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.message-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.message-transition-enter-from,.message-transition-leave-to{opacity:0;transform:translateY(-15px)}.message-transition-leave-from,.message-transition-leave-active{position:absolute}.message-transition-enter-active,.message-transition-leave-active{transition-property:transform,opacity!important}.slide-y-transition-enter-active,.slide-y-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.slide-y-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.slide-y-transition-enter-from,.slide-y-transition-leave-to{opacity:0;transform:translateY(-15px)}.slide-y-transition-enter-active,.slide-y-transition-leave-active{transition-property:transform,opacity!important}.slide-y-reverse-transition-enter-active,.slide-y-reverse-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.slide-y-reverse-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.slide-y-reverse-transition-enter-from,.slide-y-reverse-transition-leave-to{opacity:0;transform:translateY(15px)}.slide-y-reverse-transition-enter-active,.slide-y-reverse-transition-leave-active{transition-property:transform,opacity!important}.scroll-y-transition-enter-active,.scroll-y-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scroll-y-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scroll-y-transition-enter-from,.scroll-y-transition-leave-to{opacity:0}.scroll-y-transition-enter-from{transform:translateY(-15px)}.scroll-y-transition-leave-to{transform:translateY(15px)}.scroll-y-transition-enter-active,.scroll-y-transition-leave-active{transition-property:transform,opacity!important}.scroll-y-reverse-transition-enter-active,.scroll-y-reverse-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scroll-y-reverse-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scroll-y-reverse-transition-enter-from,.scroll-y-reverse-transition-leave-to{opacity:0}.scroll-y-reverse-transition-enter-from{transform:translateY(15px)}.scroll-y-reverse-transition-leave-to{transform:translateY(-15px)}.scroll-y-reverse-transition-enter-active,.scroll-y-reverse-transition-leave-active{transition-property:transform,opacity!important}.scroll-x-transition-enter-active,.scroll-x-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scroll-x-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scroll-x-transition-enter-from,.scroll-x-transition-leave-to{opacity:0}.scroll-x-transition-enter-from{transform:translate(-15px)}.scroll-x-transition-leave-to{transform:translate(15px)}.scroll-x-transition-enter-active,.scroll-x-transition-leave-active{transition-property:transform,opacity!important}.scroll-x-reverse-transition-enter-active,.scroll-x-reverse-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scroll-x-reverse-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.scroll-x-reverse-transition-enter-from,.scroll-x-reverse-transition-leave-to{opacity:0}.scroll-x-reverse-transition-enter-from{transform:translate(15px)}.scroll-x-reverse-transition-leave-to{transform:translate(-15px)}.scroll-x-reverse-transition-enter-active,.scroll-x-reverse-transition-leave-active{transition-property:transform,opacity!important}.slide-x-transition-enter-active,.slide-x-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.slide-x-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.slide-x-transition-enter-from,.slide-x-transition-leave-to{opacity:0;transform:translate(-15px)}.slide-x-transition-enter-active,.slide-x-transition-leave-active{transition-property:transform,opacity!important}.slide-x-reverse-transition-enter-active,.slide-x-reverse-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.slide-x-reverse-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.slide-x-reverse-transition-enter-from,.slide-x-reverse-transition-leave-to{opacity:0;transform:translate(15px)}.slide-x-reverse-transition-enter-active,.slide-x-reverse-transition-leave-active{transition-property:transform,opacity!important}.fade-transition-enter-active,.fade-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.fade-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.fade-transition-enter-from,.fade-transition-leave-to{opacity:0!important}.fade-transition-enter-active,.fade-transition-leave-active{transition-property:opacity!important}.fab-transition-enter-active,.fab-transition-leave-active{transition-duration:.3s!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.fab-transition-move{transition-duration:.5s!important;transition-property:transform!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}.fab-transition-enter-from,.fab-transition-leave-to{transform:scale(0) rotate(-45deg)}.fab-transition-enter-active,.fab-transition-leave-active{transition-property:transform!important}}.v-locale--is-rtl{direction:rtl}.v-locale--is-ltr{direction:ltr}.blockquote{padding:16px 0 16px 24px;font-size:18px;font-weight:300}html{font-family:Roboto,sans-serif;line-height:1.5;font-size:1rem;overflow-x:hidden;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:rgba(0,0,0,0)}html.overflow-y-hidden{overflow-y:hidden!important}:root{--v-theme-overlay-multiplier: 1;--v-scrollbar-offset: 0px}@supports (-webkit-touch-callout: none){body{cursor:pointer}}@media only print{.hidden-print-only{display:none!important}}@media only screen{.hidden-screen-only{display:none!important}}@media (max-width: 599.98px){.hidden-xs{display:none!important}}@media (min-width: 600px) and (max-width: 959.98px){.hidden-sm{display:none!important}}@media (min-width: 960px) and (max-width: 1279.98px){.hidden-md{display:none!important}}@media (min-width: 1280px) and (max-width: 1919.98px){.hidden-lg{display:none!important}}@media (min-width: 1920px) and (max-width: 2559.98px){.hidden-xl{display:none!important}}@media (min-width: 2560px){.hidden-xxl{display:none!important}}@media (min-width: 600px){.hidden-sm-and-up{display:none!important}}@media (min-width: 960px){.hidden-md-and-up{display:none!important}}@media (min-width: 1280px){.hidden-lg-and-up{display:none!important}}@media (min-width: 1920px){.hidden-xl-and-up{display:none!important}}@media (max-width: 959.98px){.hidden-sm-and-down{display:none!important}}@media (max-width: 1279.98px){.hidden-md-and-down{display:none!important}}@media (max-width: 1919.98px){.hidden-lg-and-down{display:none!important}}@media (max-width: 2559.98px){.hidden-xl-and-down{display:none!important}}.elevation-24{box-shadow:0 11px 15px -7px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 24px 38px 3px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 9px 46px 8px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-23{box-shadow:0 11px 14px -7px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 23px 36px 3px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 9px 44px 8px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-22{box-shadow:0 10px 14px -6px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 22px 35px 3px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 8px 42px 7px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-21{box-shadow:0 10px 13px -6px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 21px 33px 3px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 8px 40px 7px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-20{box-shadow:0 10px 13px -6px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 20px 31px 3px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 8px 38px 7px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-19{box-shadow:0 9px 12px -6px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 19px 29px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 7px 36px 6px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-18{box-shadow:0 9px 11px -5px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 18px 28px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 7px 34px 6px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-17{box-shadow:0 8px 11px -5px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 17px 26px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 6px 32px 5px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-16{box-shadow:0 8px 10px -5px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 16px 24px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 6px 30px 5px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-15{box-shadow:0 8px 9px -5px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 15px 22px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 6px 28px 5px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-14{box-shadow:0 7px 9px -4px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 14px 21px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 5px 26px 4px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-13{box-shadow:0 7px 8px -4px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 13px 19px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 5px 24px 4px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-12{box-shadow:0 7px 8px -4px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 12px 17px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 5px 22px 4px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-11{box-shadow:0 6px 7px -4px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 11px 15px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 4px 20px 3px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-10{box-shadow:0 6px 6px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 10px 14px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 4px 18px 3px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-9{box-shadow:0 5px 6px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 9px 12px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 3px 16px 2px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-8{box-shadow:0 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 3px 14px 2px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-7{box-shadow:0 4px 5px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 7px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 2px 16px 1px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-6{box-shadow:0 3px 5px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 6px 10px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 18px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-5{box-shadow:0 3px 5px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 5px 8px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 14px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-4{box-shadow:0 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 4px 5px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 10px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-3{box-shadow:0 3px 3px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 3px 4px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 8px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-2{box-shadow:0 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 2px 2px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 5px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-1{box-shadow:0 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 1px 1px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 3px 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.elevation-0{box-shadow:0 0 0 0 var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 0 0 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 0 0 0 var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, .12))!important}.pointer-events-none{pointer-events:none!important}.pointer-events-auto{pointer-events:auto!important}.pointer-pass-through{pointer-events:none!important}.pointer-pass-through>*{pointer-events:auto!important}.d-sr-only,.d-sr-only-focusable:not(:focus){border:0!important;clip:rect(0,0,0,0)!important;height:1px!important;margin:-1px!important;overflow:hidden!important;padding:0!important;position:absolute!important;white-space:nowrap!important;width:1px!important}.overflow-auto{overflow:auto!important}.overflow-hidden{overflow:hidden!important}.overflow-visible{overflow:visible!important}.overflow-scroll{overflow:scroll!important}.overflow-x-auto{overflow-x:auto!important}.overflow-x-hidden{overflow-x:hidden!important}.overflow-x-scroll{overflow-x:scroll!important}.overflow-y-auto{overflow-y:auto!important}.overflow-y-hidden{overflow-y:hidden!important}.overflow-y-scroll{overflow-y:scroll!important}.d-none{display:none!important}.d-inline{display:inline!important}.d-inline-block{display:inline-block!important}.d-block{display:block!important}.d-table{display:table!important}.d-table-row{display:table-row!important}.d-table-cell{display:table-cell!important}.d-flex{display:flex!important}.d-inline-flex{display:inline-flex!important}.float-none{float:none!important}.float-left{float:left!important}.float-right{float:right!important}.v-locale--is-rtl .float-end{float:left!important}.v-locale--is-rtl .float-start,.v-locale--is-ltr .float-end{float:right!important}.v-locale--is-ltr .float-start{float:left!important}.flex-fill,.flex-1-1{flex:1 1 auto!important}.flex-1-0{flex:1 0 auto!important}.flex-0-1{flex:0 1 auto!important}.flex-0-0{flex:0 0 auto!important}.flex-1-1-100{flex:1 1 100%!important}.flex-1-0-100{flex:1 0 100%!important}.flex-0-1-100{flex:0 1 100%!important}.flex-0-0-100{flex:0 0 100%!important}.flex-1-1-0{flex:1 1 0!important}.flex-1-0-0{flex:1 0 0!important}.flex-0-1-0{flex:0 1 0!important}.flex-0-0-0{flex:0 0 0!important}.flex-row{flex-direction:row!important}.flex-column{flex-direction:column!important}.flex-row-reverse{flex-direction:row-reverse!important}.flex-column-reverse{flex-direction:column-reverse!important}.flex-grow-0{flex-grow:0!important}.flex-grow-1{flex-grow:1!important}.flex-shrink-0{flex-shrink:0!important}.flex-shrink-1{flex-shrink:1!important}.flex-wrap{flex-wrap:wrap!important}.flex-nowrap{flex-wrap:nowrap!important}.flex-wrap-reverse{flex-wrap:wrap-reverse!important}.justify-start{justify-content:flex-start!important}.justify-end{justify-content:flex-end!important}.justify-center{justify-content:center!important}.justify-space-between{justify-content:space-between!important}.justify-space-around{justify-content:space-around!important}.justify-space-evenly{justify-content:space-evenly!important}.justify-items-start{justify-items:flex-start!important}.justify-items-end{justify-items:flex-end!important}.justify-items-center{justify-items:center!important}.justify-items-stretch{justify-items:stretch!important}.align-start{align-items:flex-start!important}.align-end{align-items:flex-end!important}.align-center{align-items:center!important}.align-baseline{align-items:baseline!important}.align-stretch{align-items:stretch!important}.align-content-start{align-content:flex-start!important}.align-content-end{align-content:flex-end!important}.align-content-center{align-content:center!important}.align-content-space-between{align-content:space-between!important}.align-content-space-around{align-content:space-around!important}.align-content-space-evenly{align-content:space-evenly!important}.align-content-stretch{align-content:stretch!important}.align-self-auto{align-self:auto!important}.align-self-start{align-self:flex-start!important}.align-self-end{align-self:flex-end!important}.align-self-center{align-self:center!important}.align-self-baseline{align-self:baseline!important}.align-self-stretch{align-self:stretch!important}.order-first{order:-1!important}.order-0{order:0!important}.order-1{order:1!important}.order-2{order:2!important}.order-3{order:3!important}.order-4{order:4!important}.order-5{order:5!important}.order-6{order:6!important}.order-7{order:7!important}.order-8{order:8!important}.order-9{order:9!important}.order-10{order:10!important}.order-11{order:11!important}.order-12{order:12!important}.order-last{order:13!important}.ga-0{gap:0px!important}.ga-1{gap:4px!important}.ga-2{gap:8px!important}.ga-3{gap:12px!important}.ga-4{gap:16px!important}.ga-5{gap:20px!important}.ga-6{gap:24px!important}.ga-7{gap:28px!important}.ga-8{gap:32px!important}.ga-9{gap:36px!important}.ga-10{gap:40px!important}.ga-11{gap:44px!important}.ga-12{gap:48px!important}.ga-13{gap:52px!important}.ga-14{gap:56px!important}.ga-15{gap:60px!important}.ga-16{gap:64px!important}.ga-auto{gap:auto!important}.gr-0{row-gap:0px!important}.gr-1{row-gap:4px!important}.gr-2{row-gap:8px!important}.gr-3{row-gap:12px!important}.gr-4{row-gap:16px!important}.gr-5{row-gap:20px!important}.gr-6{row-gap:24px!important}.gr-7{row-gap:28px!important}.gr-8{row-gap:32px!important}.gr-9{row-gap:36px!important}.gr-10{row-gap:40px!important}.gr-11{row-gap:44px!important}.gr-12{row-gap:48px!important}.gr-13{row-gap:52px!important}.gr-14{row-gap:56px!important}.gr-15{row-gap:60px!important}.gr-16{row-gap:64px!important}.gr-auto{row-gap:auto!important}.gc-0{column-gap:0px!important}.gc-1{column-gap:4px!important}.gc-2{column-gap:8px!important}.gc-3{column-gap:12px!important}.gc-4{column-gap:16px!important}.gc-5{column-gap:20px!important}.gc-6{column-gap:24px!important}.gc-7{column-gap:28px!important}.gc-8{column-gap:32px!important}.gc-9{column-gap:36px!important}.gc-10{column-gap:40px!important}.gc-11{column-gap:44px!important}.gc-12{column-gap:48px!important}.gc-13{column-gap:52px!important}.gc-14{column-gap:56px!important}.gc-15{column-gap:60px!important}.gc-16{column-gap:64px!important}.gc-auto{column-gap:auto!important}.ma-0{margin:0!important}.ma-1{margin:4px!important}.ma-2{margin:8px!important}.ma-3{margin:12px!important}.ma-4{margin:16px!important}.ma-5{margin:20px!important}.ma-6{margin:24px!important}.ma-7{margin:28px!important}.ma-8{margin:32px!important}.ma-9{margin:36px!important}.ma-10{margin:40px!important}.ma-11{margin:44px!important}.ma-12{margin:48px!important}.ma-13{margin:52px!important}.ma-14{margin:56px!important}.ma-15{margin:60px!important}.ma-16{margin:64px!important}.ma-auto{margin:auto!important}.mx-0{margin-right:0!important;margin-left:0!important}.mx-1{margin-right:4px!important;margin-left:4px!important}.mx-2{margin-right:8px!important;margin-left:8px!important}.mx-3{margin-right:12px!important;margin-left:12px!important}.mx-4{margin-right:16px!important;margin-left:16px!important}.mx-5{margin-right:20px!important;margin-left:20px!important}.mx-6{margin-right:24px!important;margin-left:24px!important}.mx-7{margin-right:28px!important;margin-left:28px!important}.mx-8{margin-right:32px!important;margin-left:32px!important}.mx-9{margin-right:36px!important;margin-left:36px!important}.mx-10{margin-right:40px!important;margin-left:40px!important}.mx-11{margin-right:44px!important;margin-left:44px!important}.mx-12{margin-right:48px!important;margin-left:48px!important}.mx-13{margin-right:52px!important;margin-left:52px!important}.mx-14{margin-right:56px!important;margin-left:56px!important}.mx-15{margin-right:60px!important;margin-left:60px!important}.mx-16{margin-right:64px!important;margin-left:64px!important}.mx-auto{margin-right:auto!important;margin-left:auto!important}.my-0{margin-top:0!important;margin-bottom:0!important}.my-1{margin-top:4px!important;margin-bottom:4px!important}.my-2{margin-top:8px!important;margin-bottom:8px!important}.my-3{margin-top:12px!important;margin-bottom:12px!important}.my-4{margin-top:16px!important;margin-bottom:16px!important}.my-5{margin-top:20px!important;margin-bottom:20px!important}.my-6{margin-top:24px!important;margin-bottom:24px!important}.my-7{margin-top:28px!important;margin-bottom:28px!important}.my-8{margin-top:32px!important;margin-bottom:32px!important}.my-9{margin-top:36px!important;margin-bottom:36px!important}.my-10{margin-top:40px!important;margin-bottom:40px!important}.my-11{margin-top:44px!important;margin-bottom:44px!important}.my-12{margin-top:48px!important;margin-bottom:48px!important}.my-13{margin-top:52px!important;margin-bottom:52px!important}.my-14{margin-top:56px!important;margin-bottom:56px!important}.my-15{margin-top:60px!important;margin-bottom:60px!important}.my-16{margin-top:64px!important;margin-bottom:64px!important}.my-auto{margin-top:auto!important;margin-bottom:auto!important}.mt-0{margin-top:0!important}.mt-1{margin-top:4px!important}.mt-2{margin-top:8px!important}.mt-3{margin-top:12px!important}.mt-4{margin-top:16px!important}.mt-5{margin-top:20px!important}.mt-6{margin-top:24px!important}.mt-7{margin-top:28px!important}.mt-8{margin-top:32px!important}.mt-9{margin-top:36px!important}.mt-10{margin-top:40px!important}.mt-11{margin-top:44px!important}.mt-12{margin-top:48px!important}.mt-13{margin-top:52px!important}.mt-14{margin-top:56px!important}.mt-15{margin-top:60px!important}.mt-16{margin-top:64px!important}.mt-auto{margin-top:auto!important}.mr-0{margin-right:0!important}.mr-1{margin-right:4px!important}.mr-2{margin-right:8px!important}.mr-3{margin-right:12px!important}.mr-4{margin-right:16px!important}.mr-5{margin-right:20px!important}.mr-6{margin-right:24px!important}.mr-7{margin-right:28px!important}.mr-8{margin-right:32px!important}.mr-9{margin-right:36px!important}.mr-10{margin-right:40px!important}.mr-11{margin-right:44px!important}.mr-12{margin-right:48px!important}.mr-13{margin-right:52px!important}.mr-14{margin-right:56px!important}.mr-15{margin-right:60px!important}.mr-16{margin-right:64px!important}.mr-auto{margin-right:auto!important}.mb-0{margin-bottom:0!important}.mb-1{margin-bottom:4px!important}.mb-2{margin-bottom:8px!important}.mb-3{margin-bottom:12px!important}.mb-4{margin-bottom:16px!important}.mb-5{margin-bottom:20px!important}.mb-6{margin-bottom:24px!important}.mb-7{margin-bottom:28px!important}.mb-8{margin-bottom:32px!important}.mb-9{margin-bottom:36px!important}.mb-10{margin-bottom:40px!important}.mb-11{margin-bottom:44px!important}.mb-12{margin-bottom:48px!important}.mb-13{margin-bottom:52px!important}.mb-14{margin-bottom:56px!important}.mb-15{margin-bottom:60px!important}.mb-16{margin-bottom:64px!important}.mb-auto{margin-bottom:auto!important}.ml-0{margin-left:0!important}.ml-1{margin-left:4px!important}.ml-2{margin-left:8px!important}.ml-3{margin-left:12px!important}.ml-4{margin-left:16px!important}.ml-5{margin-left:20px!important}.ml-6{margin-left:24px!important}.ml-7{margin-left:28px!important}.ml-8{margin-left:32px!important}.ml-9{margin-left:36px!important}.ml-10{margin-left:40px!important}.ml-11{margin-left:44px!important}.ml-12{margin-left:48px!important}.ml-13{margin-left:52px!important}.ml-14{margin-left:56px!important}.ml-15{margin-left:60px!important}.ml-16{margin-left:64px!important}.ml-auto{margin-left:auto!important}.ms-0{margin-inline-start:0px!important}.ms-1{margin-inline-start:4px!important}.ms-2{margin-inline-start:8px!important}.ms-3{margin-inline-start:12px!important}.ms-4{margin-inline-start:16px!important}.ms-5{margin-inline-start:20px!important}.ms-6{margin-inline-start:24px!important}.ms-7{margin-inline-start:28px!important}.ms-8{margin-inline-start:32px!important}.ms-9{margin-inline-start:36px!important}.ms-10{margin-inline-start:40px!important}.ms-11{margin-inline-start:44px!important}.ms-12{margin-inline-start:48px!important}.ms-13{margin-inline-start:52px!important}.ms-14{margin-inline-start:56px!important}.ms-15{margin-inline-start:60px!important}.ms-16{margin-inline-start:64px!important}.ms-auto{margin-inline-start:auto!important}.me-0{margin-inline-end:0px!important}.me-1{margin-inline-end:4px!important}.me-2{margin-inline-end:8px!important}.me-3{margin-inline-end:12px!important}.me-4{margin-inline-end:16px!important}.me-5{margin-inline-end:20px!important}.me-6{margin-inline-end:24px!important}.me-7{margin-inline-end:28px!important}.me-8{margin-inline-end:32px!important}.me-9{margin-inline-end:36px!important}.me-10{margin-inline-end:40px!important}.me-11{margin-inline-end:44px!important}.me-12{margin-inline-end:48px!important}.me-13{margin-inline-end:52px!important}.me-14{margin-inline-end:56px!important}.me-15{margin-inline-end:60px!important}.me-16{margin-inline-end:64px!important}.me-auto{margin-inline-end:auto!important}.ma-n1{margin:-4px!important}.ma-n2{margin:-8px!important}.ma-n3{margin:-12px!important}.ma-n4{margin:-16px!important}.ma-n5{margin:-20px!important}.ma-n6{margin:-24px!important}.ma-n7{margin:-28px!important}.ma-n8{margin:-32px!important}.ma-n9{margin:-36px!important}.ma-n10{margin:-40px!important}.ma-n11{margin:-44px!important}.ma-n12{margin:-48px!important}.ma-n13{margin:-52px!important}.ma-n14{margin:-56px!important}.ma-n15{margin:-60px!important}.ma-n16{margin:-64px!important}.mx-n1{margin-right:-4px!important;margin-left:-4px!important}.mx-n2{margin-right:-8px!important;margin-left:-8px!important}.mx-n3{margin-right:-12px!important;margin-left:-12px!important}.mx-n4{margin-right:-16px!important;margin-left:-16px!important}.mx-n5{margin-right:-20px!important;margin-left:-20px!important}.mx-n6{margin-right:-24px!important;margin-left:-24px!important}.mx-n7{margin-right:-28px!important;margin-left:-28px!important}.mx-n8{margin-right:-32px!important;margin-left:-32px!important}.mx-n9{margin-right:-36px!important;margin-left:-36px!important}.mx-n10{margin-right:-40px!important;margin-left:-40px!important}.mx-n11{margin-right:-44px!important;margin-left:-44px!important}.mx-n12{margin-right:-48px!important;margin-left:-48px!important}.mx-n13{margin-right:-52px!important;margin-left:-52px!important}.mx-n14{margin-right:-56px!important;margin-left:-56px!important}.mx-n15{margin-right:-60px!important;margin-left:-60px!important}.mx-n16{margin-right:-64px!important;margin-left:-64px!important}.my-n1{margin-top:-4px!important;margin-bottom:-4px!important}.my-n2{margin-top:-8px!important;margin-bottom:-8px!important}.my-n3{margin-top:-12px!important;margin-bottom:-12px!important}.my-n4{margin-top:-16px!important;margin-bottom:-16px!important}.my-n5{margin-top:-20px!important;margin-bottom:-20px!important}.my-n6{margin-top:-24px!important;margin-bottom:-24px!important}.my-n7{margin-top:-28px!important;margin-bottom:-28px!important}.my-n8{margin-top:-32px!important;margin-bottom:-32px!important}.my-n9{margin-top:-36px!important;margin-bottom:-36px!important}.my-n10{margin-top:-40px!important;margin-bottom:-40px!important}.my-n11{margin-top:-44px!important;margin-bottom:-44px!important}.my-n12{margin-top:-48px!important;margin-bottom:-48px!important}.my-n13{margin-top:-52px!important;margin-bottom:-52px!important}.my-n14{margin-top:-56px!important;margin-bottom:-56px!important}.my-n15{margin-top:-60px!important;margin-bottom:-60px!important}.my-n16{margin-top:-64px!important;margin-bottom:-64px!important}.mt-n1{margin-top:-4px!important}.mt-n2{margin-top:-8px!important}.mt-n3{margin-top:-12px!important}.mt-n4{margin-top:-16px!important}.mt-n5{margin-top:-20px!important}.mt-n6{margin-top:-24px!important}.mt-n7{margin-top:-28px!important}.mt-n8{margin-top:-32px!important}.mt-n9{margin-top:-36px!important}.mt-n10{margin-top:-40px!important}.mt-n11{margin-top:-44px!important}.mt-n12{margin-top:-48px!important}.mt-n13{margin-top:-52px!important}.mt-n14{margin-top:-56px!important}.mt-n15{margin-top:-60px!important}.mt-n16{margin-top:-64px!important}.mr-n1{margin-right:-4px!important}.mr-n2{margin-right:-8px!important}.mr-n3{margin-right:-12px!important}.mr-n4{margin-right:-16px!important}.mr-n5{margin-right:-20px!important}.mr-n6{margin-right:-24px!important}.mr-n7{margin-right:-28px!important}.mr-n8{margin-right:-32px!important}.mr-n9{margin-right:-36px!important}.mr-n10{margin-right:-40px!important}.mr-n11{margin-right:-44px!important}.mr-n12{margin-right:-48px!important}.mr-n13{margin-right:-52px!important}.mr-n14{margin-right:-56px!important}.mr-n15{margin-right:-60px!important}.mr-n16{margin-right:-64px!important}.mb-n1{margin-bottom:-4px!important}.mb-n2{margin-bottom:-8px!important}.mb-n3{margin-bottom:-12px!important}.mb-n4{margin-bottom:-16px!important}.mb-n5{margin-bottom:-20px!important}.mb-n6{margin-bottom:-24px!important}.mb-n7{margin-bottom:-28px!important}.mb-n8{margin-bottom:-32px!important}.mb-n9{margin-bottom:-36px!important}.mb-n10{margin-bottom:-40px!important}.mb-n11{margin-bottom:-44px!important}.mb-n12{margin-bottom:-48px!important}.mb-n13{margin-bottom:-52px!important}.mb-n14{margin-bottom:-56px!important}.mb-n15{margin-bottom:-60px!important}.mb-n16{margin-bottom:-64px!important}.ml-n1{margin-left:-4px!important}.ml-n2{margin-left:-8px!important}.ml-n3{margin-left:-12px!important}.ml-n4{margin-left:-16px!important}.ml-n5{margin-left:-20px!important}.ml-n6{margin-left:-24px!important}.ml-n7{margin-left:-28px!important}.ml-n8{margin-left:-32px!important}.ml-n9{margin-left:-36px!important}.ml-n10{margin-left:-40px!important}.ml-n11{margin-left:-44px!important}.ml-n12{margin-left:-48px!important}.ml-n13{margin-left:-52px!important}.ml-n14{margin-left:-56px!important}.ml-n15{margin-left:-60px!important}.ml-n16{margin-left:-64px!important}.ms-n1{margin-inline-start:-4px!important}.ms-n2{margin-inline-start:-8px!important}.ms-n3{margin-inline-start:-12px!important}.ms-n4{margin-inline-start:-16px!important}.ms-n5{margin-inline-start:-20px!important}.ms-n6{margin-inline-start:-24px!important}.ms-n7{margin-inline-start:-28px!important}.ms-n8{margin-inline-start:-32px!important}.ms-n9{margin-inline-start:-36px!important}.ms-n10{margin-inline-start:-40px!important}.ms-n11{margin-inline-start:-44px!important}.ms-n12{margin-inline-start:-48px!important}.ms-n13{margin-inline-start:-52px!important}.ms-n14{margin-inline-start:-56px!important}.ms-n15{margin-inline-start:-60px!important}.ms-n16{margin-inline-start:-64px!important}.me-n1{margin-inline-end:-4px!important}.me-n2{margin-inline-end:-8px!important}.me-n3{margin-inline-end:-12px!important}.me-n4{margin-inline-end:-16px!important}.me-n5{margin-inline-end:-20px!important}.me-n6{margin-inline-end:-24px!important}.me-n7{margin-inline-end:-28px!important}.me-n8{margin-inline-end:-32px!important}.me-n9{margin-inline-end:-36px!important}.me-n10{margin-inline-end:-40px!important}.me-n11{margin-inline-end:-44px!important}.me-n12{margin-inline-end:-48px!important}.me-n13{margin-inline-end:-52px!important}.me-n14{margin-inline-end:-56px!important}.me-n15{margin-inline-end:-60px!important}.me-n16{margin-inline-end:-64px!important}.pa-0{padding:0!important}.pa-1{padding:4px!important}.pa-2{padding:8px!important}.pa-3{padding:12px!important}.pa-4{padding:16px!important}.pa-5{padding:20px!important}.pa-6{padding:24px!important}.pa-7{padding:28px!important}.pa-8{padding:32px!important}.pa-9{padding:36px!important}.pa-10{padding:40px!important}.pa-11{padding:44px!important}.pa-12{padding:48px!important}.pa-13{padding:52px!important}.pa-14{padding:56px!important}.pa-15{padding:60px!important}.pa-16{padding:64px!important}.px-0{padding-right:0!important;padding-left:0!important}.px-1{padding-right:4px!important;padding-left:4px!important}.px-2{padding-right:8px!important;padding-left:8px!important}.px-3{padding-right:12px!important;padding-left:12px!important}.px-4{padding-right:16px!important;padding-left:16px!important}.px-5{padding-right:20px!important;padding-left:20px!important}.px-6{padding-right:24px!important;padding-left:24px!important}.px-7{padding-right:28px!important;padding-left:28px!important}.px-8{padding-right:32px!important;padding-left:32px!important}.px-9{padding-right:36px!important;padding-left:36px!important}.px-10{padding-right:40px!important;padding-left:40px!important}.px-11{padding-right:44px!important;padding-left:44px!important}.px-12{padding-right:48px!important;padding-left:48px!important}.px-13{padding-right:52px!important;padding-left:52px!important}.px-14{padding-right:56px!important;padding-left:56px!important}.px-15{padding-right:60px!important;padding-left:60px!important}.px-16{padding-right:64px!important;padding-left:64px!important}.py-0{padding-top:0!important;padding-bottom:0!important}.py-1{padding-top:4px!important;padding-bottom:4px!important}.py-2{padding-top:8px!important;padding-bottom:8px!important}.py-3{padding-top:12px!important;padding-bottom:12px!important}.py-4{padding-top:16px!important;padding-bottom:16px!important}.py-5{padding-top:20px!important;padding-bottom:20px!important}.py-6{padding-top:24px!important;padding-bottom:24px!important}.py-7{padding-top:28px!important;padding-bottom:28px!important}.py-8{padding-top:32px!important;padding-bottom:32px!important}.py-9{padding-top:36px!important;padding-bottom:36px!important}.py-10{padding-top:40px!important;padding-bottom:40px!important}.py-11{padding-top:44px!important;padding-bottom:44px!important}.py-12{padding-top:48px!important;padding-bottom:48px!important}.py-13{padding-top:52px!important;padding-bottom:52px!important}.py-14{padding-top:56px!important;padding-bottom:56px!important}.py-15{padding-top:60px!important;padding-bottom:60px!important}.py-16{padding-top:64px!important;padding-bottom:64px!important}.pt-0{padding-top:0!important}.pt-1{padding-top:4px!important}.pt-2{padding-top:8px!important}.pt-3{padding-top:12px!important}.pt-4{padding-top:16px!important}.pt-5{padding-top:20px!important}.pt-6{padding-top:24px!important}.pt-7{padding-top:28px!important}.pt-8{padding-top:32px!important}.pt-9{padding-top:36px!important}.pt-10{padding-top:40px!important}.pt-11{padding-top:44px!important}.pt-12{padding-top:48px!important}.pt-13{padding-top:52px!important}.pt-14{padding-top:56px!important}.pt-15{padding-top:60px!important}.pt-16{padding-top:64px!important}.pr-0{padding-right:0!important}.pr-1{padding-right:4px!important}.pr-2{padding-right:8px!important}.pr-3{padding-right:12px!important}.pr-4{padding-right:16px!important}.pr-5{padding-right:20px!important}.pr-6{padding-right:24px!important}.pr-7{padding-right:28px!important}.pr-8{padding-right:32px!important}.pr-9{padding-right:36px!important}.pr-10{padding-right:40px!important}.pr-11{padding-right:44px!important}.pr-12{padding-right:48px!important}.pr-13{padding-right:52px!important}.pr-14{padding-right:56px!important}.pr-15{padding-right:60px!important}.pr-16{padding-right:64px!important}.pb-0{padding-bottom:0!important}.pb-1{padding-bottom:4px!important}.pb-2{padding-bottom:8px!important}.pb-3{padding-bottom:12px!important}.pb-4{padding-bottom:16px!important}.pb-5{padding-bottom:20px!important}.pb-6{padding-bottom:24px!important}.pb-7{padding-bottom:28px!important}.pb-8{padding-bottom:32px!important}.pb-9{padding-bottom:36px!important}.pb-10{padding-bottom:40px!important}.pb-11{padding-bottom:44px!important}.pb-12{padding-bottom:48px!important}.pb-13{padding-bottom:52px!important}.pb-14{padding-bottom:56px!important}.pb-15{padding-bottom:60px!important}.pb-16{padding-bottom:64px!important}.pl-0{padding-left:0!important}.pl-1{padding-left:4px!important}.pl-2{padding-left:8px!important}.pl-3{padding-left:12px!important}.pl-4{padding-left:16px!important}.pl-5{padding-left:20px!important}.pl-6{padding-left:24px!important}.pl-7{padding-left:28px!important}.pl-8{padding-left:32px!important}.pl-9{padding-left:36px!important}.pl-10{padding-left:40px!important}.pl-11{padding-left:44px!important}.pl-12{padding-left:48px!important}.pl-13{padding-left:52px!important}.pl-14{padding-left:56px!important}.pl-15{padding-left:60px!important}.pl-16{padding-left:64px!important}.ps-0{padding-inline-start:0px!important}.ps-1{padding-inline-start:4px!important}.ps-2{padding-inline-start:8px!important}.ps-3{padding-inline-start:12px!important}.ps-4{padding-inline-start:16px!important}.ps-5{padding-inline-start:20px!important}.ps-6{padding-inline-start:24px!important}.ps-7{padding-inline-start:28px!important}.ps-8{padding-inline-start:32px!important}.ps-9{padding-inline-start:36px!important}.ps-10{padding-inline-start:40px!important}.ps-11{padding-inline-start:44px!important}.ps-12{padding-inline-start:48px!important}.ps-13{padding-inline-start:52px!important}.ps-14{padding-inline-start:56px!important}.ps-15{padding-inline-start:60px!important}.ps-16{padding-inline-start:64px!important}.pe-0{padding-inline-end:0px!important}.pe-1{padding-inline-end:4px!important}.pe-2{padding-inline-end:8px!important}.pe-3{padding-inline-end:12px!important}.pe-4{padding-inline-end:16px!important}.pe-5{padding-inline-end:20px!important}.pe-6{padding-inline-end:24px!important}.pe-7{padding-inline-end:28px!important}.pe-8{padding-inline-end:32px!important}.pe-9{padding-inline-end:36px!important}.pe-10{padding-inline-end:40px!important}.pe-11{padding-inline-end:44px!important}.pe-12{padding-inline-end:48px!important}.pe-13{padding-inline-end:52px!important}.pe-14{padding-inline-end:56px!important}.pe-15{padding-inline-end:60px!important}.pe-16{padding-inline-end:64px!important}.rounded-0{border-radius:0!important}.rounded-sm{border-radius:2px!important}.rounded{border-radius:4px!important}.rounded-lg{border-radius:8px!important}.rounded-xl{border-radius:24px!important}.rounded-pill{border-radius:9999px!important}.rounded-circle{border-radius:50%!important}.rounded-shaped{border-radius:24px 0!important}.rounded-t-0{border-top-left-radius:0!important;border-top-right-radius:0!important}.rounded-t-sm{border-top-left-radius:2px!important;border-top-right-radius:2px!important}.rounded-t{border-top-left-radius:4px!important;border-top-right-radius:4px!important}.rounded-t-lg{border-top-left-radius:8px!important;border-top-right-radius:8px!important}.rounded-t-xl{border-top-left-radius:24px!important;border-top-right-radius:24px!important}.rounded-t-pill{border-top-left-radius:9999px!important;border-top-right-radius:9999px!important}.rounded-t-circle{border-top-left-radius:50%!important;border-top-right-radius:50%!important}.rounded-t-shaped{border-top-left-radius:24px!important;border-top-right-radius:0!important}.v-locale--is-ltr .rounded-e-0{border-top-right-radius:0!important;border-bottom-right-radius:0!important}.v-locale--is-rtl .rounded-e-0{border-top-left-radius:0!important;border-bottom-left-radius:0!important}.v-locale--is-ltr .rounded-e-sm{border-top-right-radius:2px!important;border-bottom-right-radius:2px!important}.v-locale--is-rtl .rounded-e-sm{border-top-left-radius:2px!important;border-bottom-left-radius:2px!important}.v-locale--is-ltr .rounded-e{border-top-right-radius:4px!important;border-bottom-right-radius:4px!important}.v-locale--is-rtl .rounded-e{border-top-left-radius:4px!important;border-bottom-left-radius:4px!important}.v-locale--is-ltr .rounded-e-lg{border-top-right-radius:8px!important;border-bottom-right-radius:8px!important}.v-locale--is-rtl .rounded-e-lg{border-top-left-radius:8px!important;border-bottom-left-radius:8px!important}.v-locale--is-ltr .rounded-e-xl{border-top-right-radius:24px!important;border-bottom-right-radius:24px!important}.v-locale--is-rtl .rounded-e-xl{border-top-left-radius:24px!important;border-bottom-left-radius:24px!important}.v-locale--is-ltr .rounded-e-pill{border-top-right-radius:9999px!important;border-bottom-right-radius:9999px!important}.v-locale--is-rtl .rounded-e-pill{border-top-left-radius:9999px!important;border-bottom-left-radius:9999px!important}.v-locale--is-ltr .rounded-e-circle{border-top-right-radius:50%!important;border-bottom-right-radius:50%!important}.v-locale--is-rtl .rounded-e-circle{border-top-left-radius:50%!important;border-bottom-left-radius:50%!important}.v-locale--is-ltr .rounded-e-shaped{border-top-right-radius:24px!important;border-bottom-right-radius:0!important}.v-locale--is-rtl .rounded-e-shaped{border-top-left-radius:24px!important;border-bottom-left-radius:0!important}.rounded-b-0{border-bottom-left-radius:0!important;border-bottom-right-radius:0!important}.rounded-b-sm{border-bottom-left-radius:2px!important;border-bottom-right-radius:2px!important}.rounded-b{border-bottom-left-radius:4px!important;border-bottom-right-radius:4px!important}.rounded-b-lg{border-bottom-left-radius:8px!important;border-bottom-right-radius:8px!important}.rounded-b-xl{border-bottom-left-radius:24px!important;border-bottom-right-radius:24px!important}.rounded-b-pill{border-bottom-left-radius:9999px!important;border-bottom-right-radius:9999px!important}.rounded-b-circle{border-bottom-left-radius:50%!important;border-bottom-right-radius:50%!important}.rounded-b-shaped{border-bottom-left-radius:24px!important;border-bottom-right-radius:0!important}.v-locale--is-ltr .rounded-s-0{border-top-left-radius:0!important;border-bottom-left-radius:0!important}.v-locale--is-rtl .rounded-s-0{border-top-right-radius:0!important;border-bottom-right-radius:0!important}.v-locale--is-ltr .rounded-s-sm{border-top-left-radius:2px!important;border-bottom-left-radius:2px!important}.v-locale--is-rtl .rounded-s-sm{border-top-right-radius:2px!important;border-bottom-right-radius:2px!important}.v-locale--is-ltr .rounded-s{border-top-left-radius:4px!important;border-bottom-left-radius:4px!important}.v-locale--is-rtl .rounded-s{border-top-right-radius:4px!important;border-bottom-right-radius:4px!important}.v-locale--is-ltr .rounded-s-lg{border-top-left-radius:8px!important;border-bottom-left-radius:8px!important}.v-locale--is-rtl .rounded-s-lg{border-top-right-radius:8px!important;border-bottom-right-radius:8px!important}.v-locale--is-ltr .rounded-s-xl{border-top-left-radius:24px!important;border-bottom-left-radius:24px!important}.v-locale--is-rtl .rounded-s-xl{border-top-right-radius:24px!important;border-bottom-right-radius:24px!important}.v-locale--is-ltr .rounded-s-pill{border-top-left-radius:9999px!important;border-bottom-left-radius:9999px!important}.v-locale--is-rtl .rounded-s-pill{border-top-right-radius:9999px!important;border-bottom-right-radius:9999px!important}.v-locale--is-ltr .rounded-s-circle{border-top-left-radius:50%!important;border-bottom-left-radius:50%!important}.v-locale--is-rtl .rounded-s-circle{border-top-right-radius:50%!important;border-bottom-right-radius:50%!important}.v-locale--is-ltr .rounded-s-shaped{border-top-left-radius:24px!important;border-bottom-left-radius:0!important}.v-locale--is-rtl .rounded-s-shaped{border-top-right-radius:24px!important;border-bottom-right-radius:0!important}.v-locale--is-ltr .rounded-ts-0{border-top-left-radius:0!important}.v-locale--is-rtl .rounded-ts-0{border-top-right-radius:0!important}.v-locale--is-ltr .rounded-ts-sm{border-top-left-radius:2px!important}.v-locale--is-rtl .rounded-ts-sm{border-top-right-radius:2px!important}.v-locale--is-ltr .rounded-ts{border-top-left-radius:4px!important}.v-locale--is-rtl .rounded-ts{border-top-right-radius:4px!important}.v-locale--is-ltr .rounded-ts-lg{border-top-left-radius:8px!important}.v-locale--is-rtl .rounded-ts-lg{border-top-right-radius:8px!important}.v-locale--is-ltr .rounded-ts-xl{border-top-left-radius:24px!important}.v-locale--is-rtl .rounded-ts-xl{border-top-right-radius:24px!important}.v-locale--is-ltr .rounded-ts-pill{border-top-left-radius:9999px!important}.v-locale--is-rtl .rounded-ts-pill{border-top-right-radius:9999px!important}.v-locale--is-ltr .rounded-ts-circle{border-top-left-radius:50%!important}.v-locale--is-rtl .rounded-ts-circle{border-top-right-radius:50%!important}.v-locale--is-ltr .rounded-ts-shaped{border-top-left-radius:24px 0!important}.v-locale--is-rtl .rounded-ts-shaped{border-top-right-radius:24px 0!important}.v-locale--is-ltr .rounded-te-0{border-top-right-radius:0!important}.v-locale--is-rtl .rounded-te-0{border-top-left-radius:0!important}.v-locale--is-ltr .rounded-te-sm{border-top-right-radius:2px!important}.v-locale--is-rtl .rounded-te-sm{border-top-left-radius:2px!important}.v-locale--is-ltr .rounded-te{border-top-right-radius:4px!important}.v-locale--is-rtl .rounded-te{border-top-left-radius:4px!important}.v-locale--is-ltr .rounded-te-lg{border-top-right-radius:8px!important}.v-locale--is-rtl .rounded-te-lg{border-top-left-radius:8px!important}.v-locale--is-ltr .rounded-te-xl{border-top-right-radius:24px!important}.v-locale--is-rtl .rounded-te-xl{border-top-left-radius:24px!important}.v-locale--is-ltr .rounded-te-pill{border-top-right-radius:9999px!important}.v-locale--is-rtl .rounded-te-pill{border-top-left-radius:9999px!important}.v-locale--is-ltr .rounded-te-circle{border-top-right-radius:50%!important}.v-locale--is-rtl .rounded-te-circle{border-top-left-radius:50%!important}.v-locale--is-ltr .rounded-te-shaped{border-top-right-radius:24px 0!important}.v-locale--is-rtl .rounded-te-shaped{border-top-left-radius:24px 0!important}.v-locale--is-ltr .rounded-be-0{border-bottom-right-radius:0!important}.v-locale--is-rtl .rounded-be-0{border-bottom-left-radius:0!important}.v-locale--is-ltr .rounded-be-sm{border-bottom-right-radius:2px!important}.v-locale--is-rtl .rounded-be-sm{border-bottom-left-radius:2px!important}.v-locale--is-ltr .rounded-be{border-bottom-right-radius:4px!important}.v-locale--is-rtl .rounded-be{border-bottom-left-radius:4px!important}.v-locale--is-ltr .rounded-be-lg{border-bottom-right-radius:8px!important}.v-locale--is-rtl .rounded-be-lg{border-bottom-left-radius:8px!important}.v-locale--is-ltr .rounded-be-xl{border-bottom-right-radius:24px!important}.v-locale--is-rtl .rounded-be-xl{border-bottom-left-radius:24px!important}.v-locale--is-ltr .rounded-be-pill{border-bottom-right-radius:9999px!important}.v-locale--is-rtl .rounded-be-pill{border-bottom-left-radius:9999px!important}.v-locale--is-ltr .rounded-be-circle{border-bottom-right-radius:50%!important}.v-locale--is-rtl .rounded-be-circle{border-bottom-left-radius:50%!important}.v-locale--is-ltr .rounded-be-shaped{border-bottom-right-radius:24px 0!important}.v-locale--is-rtl .rounded-be-shaped{border-bottom-left-radius:24px 0!important}.v-locale--is-ltr .rounded-bs-0{border-bottom-left-radius:0!important}.v-locale--is-rtl .rounded-bs-0{border-bottom-right-radius:0!important}.v-locale--is-ltr .rounded-bs-sm{border-bottom-left-radius:2px!important}.v-locale--is-rtl .rounded-bs-sm{border-bottom-right-radius:2px!important}.v-locale--is-ltr .rounded-bs{border-bottom-left-radius:4px!important}.v-locale--is-rtl .rounded-bs{border-bottom-right-radius:4px!important}.v-locale--is-ltr .rounded-bs-lg{border-bottom-left-radius:8px!important}.v-locale--is-rtl .rounded-bs-lg{border-bottom-right-radius:8px!important}.v-locale--is-ltr .rounded-bs-xl{border-bottom-left-radius:24px!important}.v-locale--is-rtl .rounded-bs-xl{border-bottom-right-radius:24px!important}.v-locale--is-ltr .rounded-bs-pill{border-bottom-left-radius:9999px!important}.v-locale--is-rtl .rounded-bs-pill{border-bottom-right-radius:9999px!important}.v-locale--is-ltr .rounded-bs-circle{border-bottom-left-radius:50%!important}.v-locale--is-rtl .rounded-bs-circle{border-bottom-right-radius:50%!important}.v-locale--is-ltr .rounded-bs-shaped{border-bottom-left-radius:24px 0!important}.v-locale--is-rtl .rounded-bs-shaped{border-bottom-right-radius:24px 0!important}.border-0{border-width:0!important;border-style:solid!important;border-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border,.border-thin{border-width:thin!important;border-style:solid!important;border-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-sm{border-width:1px!important;border-style:solid!important;border-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-md{border-width:2px!important;border-style:solid!important;border-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-lg{border-width:4px!important;border-style:solid!important;border-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-xl{border-width:8px!important;border-style:solid!important;border-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-current{border-color:currentColor!important}.border-opacity-0{--v-border-opacity: 0 !important}.border-opacity{--v-border-opacity: .12 !important}.border-opacity-25{--v-border-opacity: .25 !important}.border-opacity-50{--v-border-opacity: .5 !important}.border-opacity-75{--v-border-opacity: .75 !important}.border-opacity-100{--v-border-opacity: 1 !important}.border-t-0{border-block-start-width:0!important;border-block-start-style:solid!important;border-block-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-t,.border-t-thin{border-block-start-width:thin!important;border-block-start-style:solid!important;border-block-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-t-sm{border-block-start-width:1px!important;border-block-start-style:solid!important;border-block-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-t-md{border-block-start-width:2px!important;border-block-start-style:solid!important;border-block-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-t-lg{border-block-start-width:4px!important;border-block-start-style:solid!important;border-block-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-t-xl{border-block-start-width:8px!important;border-block-start-style:solid!important;border-block-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-e-0{border-inline-end-width:0!important;border-inline-end-style:solid!important;border-inline-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-e,.border-e-thin{border-inline-end-width:thin!important;border-inline-end-style:solid!important;border-inline-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-e-sm{border-inline-end-width:1px!important;border-inline-end-style:solid!important;border-inline-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-e-md{border-inline-end-width:2px!important;border-inline-end-style:solid!important;border-inline-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-e-lg{border-inline-end-width:4px!important;border-inline-end-style:solid!important;border-inline-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-e-xl{border-inline-end-width:8px!important;border-inline-end-style:solid!important;border-inline-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-b-0{border-block-end-width:0!important;border-block-end-style:solid!important;border-block-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-b,.border-b-thin{border-block-end-width:thin!important;border-block-end-style:solid!important;border-block-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-b-sm{border-block-end-width:1px!important;border-block-end-style:solid!important;border-block-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-b-md{border-block-end-width:2px!important;border-block-end-style:solid!important;border-block-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-b-lg{border-block-end-width:4px!important;border-block-end-style:solid!important;border-block-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-b-xl{border-block-end-width:8px!important;border-block-end-style:solid!important;border-block-end-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-s-0{border-inline-start-width:0!important;border-inline-start-style:solid!important;border-inline-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-s,.border-s-thin{border-inline-start-width:thin!important;border-inline-start-style:solid!important;border-inline-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-s-sm{border-inline-start-width:1px!important;border-inline-start-style:solid!important;border-inline-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-s-md{border-inline-start-width:2px!important;border-inline-start-style:solid!important;border-inline-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-s-lg{border-inline-start-width:4px!important;border-inline-start-style:solid!important;border-inline-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-s-xl{border-inline-start-width:8px!important;border-inline-start-style:solid!important;border-inline-start-color:rgba(var(--v-border-color),var(--v-border-opacity))!important}.border-solid{border-style:solid!important}.border-dashed{border-style:dashed!important}.border-dotted{border-style:dotted!important}.border-double{border-style:double!important}.border-none{border-style:none!important}.text-left{text-align:left!important}.text-right{text-align:right!important}.text-center{text-align:center!important}.text-justify{text-align:justify!important}.text-start{text-align:start!important}.text-end{text-align:end!important}.text-decoration-line-through{text-decoration:line-through!important}.text-decoration-none{text-decoration:none!important}.text-decoration-overline{text-decoration:overline!important}.text-decoration-underline{text-decoration:underline!important}.text-wrap{white-space:normal!important}.text-no-wrap{white-space:nowrap!important}.text-pre{white-space:pre!important}.text-pre-line{white-space:pre-line!important}.text-pre-wrap{white-space:pre-wrap!important}.text-break{overflow-wrap:break-word!important;word-break:break-word!important}.opacity-hover{opacity:var(--v-hover-opacity)!important}.opacity-focus{opacity:var(--v-focus-opacity)!important}.opacity-selected{opacity:var(--v-selected-opacity)!important}.opacity-activated{opacity:var(--v-activated-opacity)!important}.opacity-pressed{opacity:var(--v-pressed-opacity)!important}.opacity-dragged{opacity:var(--v-dragged-opacity)!important}.opacity-0{opacity:0!important}.opacity-10{opacity:.1!important}.opacity-20{opacity:.2!important}.opacity-30{opacity:.3!important}.opacity-40{opacity:.4!important}.opacity-50{opacity:.5!important}.opacity-60{opacity:.6!important}.opacity-70{opacity:.7!important}.opacity-80{opacity:.8!important}.opacity-90{opacity:.9!important}.opacity-100{opacity:1!important}.text-high-emphasis{color:rgba(var(--v-theme-on-background),var(--v-high-emphasis-opacity))!important}.text-medium-emphasis{color:rgba(var(--v-theme-on-background),var(--v-medium-emphasis-opacity))!important}.text-disabled{color:rgba(var(--v-theme-on-background),var(--v-disabled-opacity))!important}.text-truncate{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.text-h1{font-size:6rem!important;font-weight:300;line-height:1;letter-spacing:-.015625em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-h2{font-size:3.75rem!important;font-weight:300;line-height:1;letter-spacing:-.0083333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-h3{font-size:3rem!important;font-weight:400;line-height:1.05;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-h4{font-size:2.125rem!important;font-weight:400;line-height:1.175;letter-spacing:.0073529412em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-h5{font-size:1.5rem!important;font-weight:400;line-height:1.333;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-h6{font-size:1.25rem!important;font-weight:500;line-height:1.6;letter-spacing:.0125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-subtitle-1{font-size:1rem!important;font-weight:400;line-height:1.75;letter-spacing:.009375em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-subtitle-2{font-size:.875rem!important;font-weight:500;line-height:1.6;letter-spacing:.0071428571em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-body-1{font-size:1rem!important;font-weight:400;line-height:1.5;letter-spacing:.03125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-body-2{font-size:.875rem!important;font-weight:400;line-height:1.425;letter-spacing:.0178571429em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-button{font-size:.875rem!important;font-weight:500;line-height:2.6;letter-spacing:.0892857143em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.text-caption{font-size:.75rem!important;font-weight:400;line-height:1.667;letter-spacing:.0333333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-overline{font-size:.75rem!important;font-weight:500;line-height:2.667;letter-spacing:.1666666667em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.text-none{text-transform:none!important}.text-capitalize{text-transform:capitalize!important}.text-lowercase{text-transform:lowercase!important}.text-uppercase{text-transform:uppercase!important}.font-weight-thin{font-weight:100!important}.font-weight-light{font-weight:300!important}.font-weight-regular{font-weight:400!important}.font-weight-medium{font-weight:500!important}.font-weight-semibold{font-weight:600!important}.font-weight-bold{font-weight:700!important}.font-weight-black{font-weight:900!important}.font-italic{font-style:italic!important}.text-mono{font-family:monospace!important}.position-static{position:static!important}.position-relative{position:relative!important}.position-fixed{position:fixed!important}.position-absolute{position:absolute!important}.position-sticky{position:sticky!important}.top-0{top:0!important}.right-0{right:0!important}.bottom-0{bottom:0!important}.left-0{left:0!important}.cursor-auto{cursor:auto!important}.cursor-default{cursor:default!important}.cursor-pointer{cursor:pointer!important}.cursor-wait{cursor:wait!important}.cursor-text{cursor:text!important}.cursor-move{cursor:move!important}.cursor-help{cursor:help!important}.cursor-not-allowed{cursor:not-allowed!important}.cursor-progress{cursor:progress!important}.cursor-grab{cursor:grab!important}.cursor-grabbing{cursor:grabbing!important}.cursor-none{cursor:none!important}.fill-height{height:100%!important}.h-auto{height:auto!important}.h-screen{height:100vh!important}.h-0{height:0!important}.h-25{height:25%!important}.h-50{height:50%!important}.h-75{height:75%!important}.h-100{height:100%!important}.h-screen{height:100dvh!important}.w-auto{width:auto!important}.w-0{width:0!important}.w-25{width:25%!important}.w-33{width:33%!important}.w-50{width:50%!important}.w-66{width:66%!important}.w-75{width:75%!important}.w-100{width:100%!important}@media (min-width: 600px){.d-sm-none{display:none!important}.d-sm-inline{display:inline!important}.d-sm-inline-block{display:inline-block!important}.d-sm-block{display:block!important}.d-sm-table{display:table!important}.d-sm-table-row{display:table-row!important}.d-sm-table-cell{display:table-cell!important}.d-sm-flex{display:flex!important}.d-sm-inline-flex{display:inline-flex!important}.float-sm-none{float:none!important}.float-sm-left{float:left!important}.float-sm-right{float:right!important}.v-locale--is-rtl .float-sm-end{float:left!important}.v-locale--is-rtl .float-sm-start,.v-locale--is-ltr .float-sm-end{float:right!important}.v-locale--is-ltr .float-sm-start{float:left!important}.flex-sm-fill,.flex-sm-1-1{flex:1 1 auto!important}.flex-sm-1-0{flex:1 0 auto!important}.flex-sm-0-1{flex:0 1 auto!important}.flex-sm-0-0{flex:0 0 auto!important}.flex-sm-1-1-100{flex:1 1 100%!important}.flex-sm-1-0-100{flex:1 0 100%!important}.flex-sm-0-1-100{flex:0 1 100%!important}.flex-sm-0-0-100{flex:0 0 100%!important}.flex-sm-1-1-0{flex:1 1 0!important}.flex-sm-1-0-0{flex:1 0 0!important}.flex-sm-0-1-0{flex:0 1 0!important}.flex-sm-0-0-0{flex:0 0 0!important}.flex-sm-row{flex-direction:row!important}.flex-sm-column{flex-direction:column!important}.flex-sm-row-reverse{flex-direction:row-reverse!important}.flex-sm-column-reverse{flex-direction:column-reverse!important}.flex-sm-grow-0{flex-grow:0!important}.flex-sm-grow-1{flex-grow:1!important}.flex-sm-shrink-0{flex-shrink:0!important}.flex-sm-shrink-1{flex-shrink:1!important}.flex-sm-wrap{flex-wrap:wrap!important}.flex-sm-nowrap{flex-wrap:nowrap!important}.flex-sm-wrap-reverse{flex-wrap:wrap-reverse!important}.justify-sm-start{justify-content:flex-start!important}.justify-sm-end{justify-content:flex-end!important}.justify-sm-center{justify-content:center!important}.justify-sm-space-between{justify-content:space-between!important}.justify-sm-space-around{justify-content:space-around!important}.justify-sm-space-evenly{justify-content:space-evenly!important}.justify-items-sm-start{justify-items:flex-start!important}.justify-items-sm-end{justify-items:flex-end!important}.justify-items-sm-center{justify-items:center!important}.justify-items-sm-stretch{justify-items:stretch!important}.align-sm-start{align-items:flex-start!important}.align-sm-end{align-items:flex-end!important}.align-sm-center{align-items:center!important}.align-sm-baseline{align-items:baseline!important}.align-sm-stretch{align-items:stretch!important}.align-content-sm-start{align-content:flex-start!important}.align-content-sm-end{align-content:flex-end!important}.align-content-sm-center{align-content:center!important}.align-content-sm-space-between{align-content:space-between!important}.align-content-sm-space-around{align-content:space-around!important}.align-content-sm-space-evenly{align-content:space-evenly!important}.align-content-sm-stretch{align-content:stretch!important}.align-self-sm-auto{align-self:auto!important}.align-self-sm-start{align-self:flex-start!important}.align-self-sm-end{align-self:flex-end!important}.align-self-sm-center{align-self:center!important}.align-self-sm-baseline{align-self:baseline!important}.align-self-sm-stretch{align-self:stretch!important}.order-sm-first{order:-1!important}.order-sm-0{order:0!important}.order-sm-1{order:1!important}.order-sm-2{order:2!important}.order-sm-3{order:3!important}.order-sm-4{order:4!important}.order-sm-5{order:5!important}.order-sm-6{order:6!important}.order-sm-7{order:7!important}.order-sm-8{order:8!important}.order-sm-9{order:9!important}.order-sm-10{order:10!important}.order-sm-11{order:11!important}.order-sm-12{order:12!important}.order-sm-last{order:13!important}.ga-sm-0{gap:0px!important}.ga-sm-1{gap:4px!important}.ga-sm-2{gap:8px!important}.ga-sm-3{gap:12px!important}.ga-sm-4{gap:16px!important}.ga-sm-5{gap:20px!important}.ga-sm-6{gap:24px!important}.ga-sm-7{gap:28px!important}.ga-sm-8{gap:32px!important}.ga-sm-9{gap:36px!important}.ga-sm-10{gap:40px!important}.ga-sm-11{gap:44px!important}.ga-sm-12{gap:48px!important}.ga-sm-13{gap:52px!important}.ga-sm-14{gap:56px!important}.ga-sm-15{gap:60px!important}.ga-sm-16{gap:64px!important}.ga-sm-auto{gap:auto!important}.gr-sm-0{row-gap:0px!important}.gr-sm-1{row-gap:4px!important}.gr-sm-2{row-gap:8px!important}.gr-sm-3{row-gap:12px!important}.gr-sm-4{row-gap:16px!important}.gr-sm-5{row-gap:20px!important}.gr-sm-6{row-gap:24px!important}.gr-sm-7{row-gap:28px!important}.gr-sm-8{row-gap:32px!important}.gr-sm-9{row-gap:36px!important}.gr-sm-10{row-gap:40px!important}.gr-sm-11{row-gap:44px!important}.gr-sm-12{row-gap:48px!important}.gr-sm-13{row-gap:52px!important}.gr-sm-14{row-gap:56px!important}.gr-sm-15{row-gap:60px!important}.gr-sm-16{row-gap:64px!important}.gr-sm-auto{row-gap:auto!important}.gc-sm-0{column-gap:0px!important}.gc-sm-1{column-gap:4px!important}.gc-sm-2{column-gap:8px!important}.gc-sm-3{column-gap:12px!important}.gc-sm-4{column-gap:16px!important}.gc-sm-5{column-gap:20px!important}.gc-sm-6{column-gap:24px!important}.gc-sm-7{column-gap:28px!important}.gc-sm-8{column-gap:32px!important}.gc-sm-9{column-gap:36px!important}.gc-sm-10{column-gap:40px!important}.gc-sm-11{column-gap:44px!important}.gc-sm-12{column-gap:48px!important}.gc-sm-13{column-gap:52px!important}.gc-sm-14{column-gap:56px!important}.gc-sm-15{column-gap:60px!important}.gc-sm-16{column-gap:64px!important}.gc-sm-auto{column-gap:auto!important}.ma-sm-0{margin:0!important}.ma-sm-1{margin:4px!important}.ma-sm-2{margin:8px!important}.ma-sm-3{margin:12px!important}.ma-sm-4{margin:16px!important}.ma-sm-5{margin:20px!important}.ma-sm-6{margin:24px!important}.ma-sm-7{margin:28px!important}.ma-sm-8{margin:32px!important}.ma-sm-9{margin:36px!important}.ma-sm-10{margin:40px!important}.ma-sm-11{margin:44px!important}.ma-sm-12{margin:48px!important}.ma-sm-13{margin:52px!important}.ma-sm-14{margin:56px!important}.ma-sm-15{margin:60px!important}.ma-sm-16{margin:64px!important}.ma-sm-auto{margin:auto!important}.mx-sm-0{margin-right:0!important;margin-left:0!important}.mx-sm-1{margin-right:4px!important;margin-left:4px!important}.mx-sm-2{margin-right:8px!important;margin-left:8px!important}.mx-sm-3{margin-right:12px!important;margin-left:12px!important}.mx-sm-4{margin-right:16px!important;margin-left:16px!important}.mx-sm-5{margin-right:20px!important;margin-left:20px!important}.mx-sm-6{margin-right:24px!important;margin-left:24px!important}.mx-sm-7{margin-right:28px!important;margin-left:28px!important}.mx-sm-8{margin-right:32px!important;margin-left:32px!important}.mx-sm-9{margin-right:36px!important;margin-left:36px!important}.mx-sm-10{margin-right:40px!important;margin-left:40px!important}.mx-sm-11{margin-right:44px!important;margin-left:44px!important}.mx-sm-12{margin-right:48px!important;margin-left:48px!important}.mx-sm-13{margin-right:52px!important;margin-left:52px!important}.mx-sm-14{margin-right:56px!important;margin-left:56px!important}.mx-sm-15{margin-right:60px!important;margin-left:60px!important}.mx-sm-16{margin-right:64px!important;margin-left:64px!important}.mx-sm-auto{margin-right:auto!important;margin-left:auto!important}.my-sm-0{margin-top:0!important;margin-bottom:0!important}.my-sm-1{margin-top:4px!important;margin-bottom:4px!important}.my-sm-2{margin-top:8px!important;margin-bottom:8px!important}.my-sm-3{margin-top:12px!important;margin-bottom:12px!important}.my-sm-4{margin-top:16px!important;margin-bottom:16px!important}.my-sm-5{margin-top:20px!important;margin-bottom:20px!important}.my-sm-6{margin-top:24px!important;margin-bottom:24px!important}.my-sm-7{margin-top:28px!important;margin-bottom:28px!important}.my-sm-8{margin-top:32px!important;margin-bottom:32px!important}.my-sm-9{margin-top:36px!important;margin-bottom:36px!important}.my-sm-10{margin-top:40px!important;margin-bottom:40px!important}.my-sm-11{margin-top:44px!important;margin-bottom:44px!important}.my-sm-12{margin-top:48px!important;margin-bottom:48px!important}.my-sm-13{margin-top:52px!important;margin-bottom:52px!important}.my-sm-14{margin-top:56px!important;margin-bottom:56px!important}.my-sm-15{margin-top:60px!important;margin-bottom:60px!important}.my-sm-16{margin-top:64px!important;margin-bottom:64px!important}.my-sm-auto{margin-top:auto!important;margin-bottom:auto!important}.mt-sm-0{margin-top:0!important}.mt-sm-1{margin-top:4px!important}.mt-sm-2{margin-top:8px!important}.mt-sm-3{margin-top:12px!important}.mt-sm-4{margin-top:16px!important}.mt-sm-5{margin-top:20px!important}.mt-sm-6{margin-top:24px!important}.mt-sm-7{margin-top:28px!important}.mt-sm-8{margin-top:32px!important}.mt-sm-9{margin-top:36px!important}.mt-sm-10{margin-top:40px!important}.mt-sm-11{margin-top:44px!important}.mt-sm-12{margin-top:48px!important}.mt-sm-13{margin-top:52px!important}.mt-sm-14{margin-top:56px!important}.mt-sm-15{margin-top:60px!important}.mt-sm-16{margin-top:64px!important}.mt-sm-auto{margin-top:auto!important}.mr-sm-0{margin-right:0!important}.mr-sm-1{margin-right:4px!important}.mr-sm-2{margin-right:8px!important}.mr-sm-3{margin-right:12px!important}.mr-sm-4{margin-right:16px!important}.mr-sm-5{margin-right:20px!important}.mr-sm-6{margin-right:24px!important}.mr-sm-7{margin-right:28px!important}.mr-sm-8{margin-right:32px!important}.mr-sm-9{margin-right:36px!important}.mr-sm-10{margin-right:40px!important}.mr-sm-11{margin-right:44px!important}.mr-sm-12{margin-right:48px!important}.mr-sm-13{margin-right:52px!important}.mr-sm-14{margin-right:56px!important}.mr-sm-15{margin-right:60px!important}.mr-sm-16{margin-right:64px!important}.mr-sm-auto{margin-right:auto!important}.mb-sm-0{margin-bottom:0!important}.mb-sm-1{margin-bottom:4px!important}.mb-sm-2{margin-bottom:8px!important}.mb-sm-3{margin-bottom:12px!important}.mb-sm-4{margin-bottom:16px!important}.mb-sm-5{margin-bottom:20px!important}.mb-sm-6{margin-bottom:24px!important}.mb-sm-7{margin-bottom:28px!important}.mb-sm-8{margin-bottom:32px!important}.mb-sm-9{margin-bottom:36px!important}.mb-sm-10{margin-bottom:40px!important}.mb-sm-11{margin-bottom:44px!important}.mb-sm-12{margin-bottom:48px!important}.mb-sm-13{margin-bottom:52px!important}.mb-sm-14{margin-bottom:56px!important}.mb-sm-15{margin-bottom:60px!important}.mb-sm-16{margin-bottom:64px!important}.mb-sm-auto{margin-bottom:auto!important}.ml-sm-0{margin-left:0!important}.ml-sm-1{margin-left:4px!important}.ml-sm-2{margin-left:8px!important}.ml-sm-3{margin-left:12px!important}.ml-sm-4{margin-left:16px!important}.ml-sm-5{margin-left:20px!important}.ml-sm-6{margin-left:24px!important}.ml-sm-7{margin-left:28px!important}.ml-sm-8{margin-left:32px!important}.ml-sm-9{margin-left:36px!important}.ml-sm-10{margin-left:40px!important}.ml-sm-11{margin-left:44px!important}.ml-sm-12{margin-left:48px!important}.ml-sm-13{margin-left:52px!important}.ml-sm-14{margin-left:56px!important}.ml-sm-15{margin-left:60px!important}.ml-sm-16{margin-left:64px!important}.ml-sm-auto{margin-left:auto!important}.ms-sm-0{margin-inline-start:0px!important}.ms-sm-1{margin-inline-start:4px!important}.ms-sm-2{margin-inline-start:8px!important}.ms-sm-3{margin-inline-start:12px!important}.ms-sm-4{margin-inline-start:16px!important}.ms-sm-5{margin-inline-start:20px!important}.ms-sm-6{margin-inline-start:24px!important}.ms-sm-7{margin-inline-start:28px!important}.ms-sm-8{margin-inline-start:32px!important}.ms-sm-9{margin-inline-start:36px!important}.ms-sm-10{margin-inline-start:40px!important}.ms-sm-11{margin-inline-start:44px!important}.ms-sm-12{margin-inline-start:48px!important}.ms-sm-13{margin-inline-start:52px!important}.ms-sm-14{margin-inline-start:56px!important}.ms-sm-15{margin-inline-start:60px!important}.ms-sm-16{margin-inline-start:64px!important}.ms-sm-auto{margin-inline-start:auto!important}.me-sm-0{margin-inline-end:0px!important}.me-sm-1{margin-inline-end:4px!important}.me-sm-2{margin-inline-end:8px!important}.me-sm-3{margin-inline-end:12px!important}.me-sm-4{margin-inline-end:16px!important}.me-sm-5{margin-inline-end:20px!important}.me-sm-6{margin-inline-end:24px!important}.me-sm-7{margin-inline-end:28px!important}.me-sm-8{margin-inline-end:32px!important}.me-sm-9{margin-inline-end:36px!important}.me-sm-10{margin-inline-end:40px!important}.me-sm-11{margin-inline-end:44px!important}.me-sm-12{margin-inline-end:48px!important}.me-sm-13{margin-inline-end:52px!important}.me-sm-14{margin-inline-end:56px!important}.me-sm-15{margin-inline-end:60px!important}.me-sm-16{margin-inline-end:64px!important}.me-sm-auto{margin-inline-end:auto!important}.ma-sm-n1{margin:-4px!important}.ma-sm-n2{margin:-8px!important}.ma-sm-n3{margin:-12px!important}.ma-sm-n4{margin:-16px!important}.ma-sm-n5{margin:-20px!important}.ma-sm-n6{margin:-24px!important}.ma-sm-n7{margin:-28px!important}.ma-sm-n8{margin:-32px!important}.ma-sm-n9{margin:-36px!important}.ma-sm-n10{margin:-40px!important}.ma-sm-n11{margin:-44px!important}.ma-sm-n12{margin:-48px!important}.ma-sm-n13{margin:-52px!important}.ma-sm-n14{margin:-56px!important}.ma-sm-n15{margin:-60px!important}.ma-sm-n16{margin:-64px!important}.mx-sm-n1{margin-right:-4px!important;margin-left:-4px!important}.mx-sm-n2{margin-right:-8px!important;margin-left:-8px!important}.mx-sm-n3{margin-right:-12px!important;margin-left:-12px!important}.mx-sm-n4{margin-right:-16px!important;margin-left:-16px!important}.mx-sm-n5{margin-right:-20px!important;margin-left:-20px!important}.mx-sm-n6{margin-right:-24px!important;margin-left:-24px!important}.mx-sm-n7{margin-right:-28px!important;margin-left:-28px!important}.mx-sm-n8{margin-right:-32px!important;margin-left:-32px!important}.mx-sm-n9{margin-right:-36px!important;margin-left:-36px!important}.mx-sm-n10{margin-right:-40px!important;margin-left:-40px!important}.mx-sm-n11{margin-right:-44px!important;margin-left:-44px!important}.mx-sm-n12{margin-right:-48px!important;margin-left:-48px!important}.mx-sm-n13{margin-right:-52px!important;margin-left:-52px!important}.mx-sm-n14{margin-right:-56px!important;margin-left:-56px!important}.mx-sm-n15{margin-right:-60px!important;margin-left:-60px!important}.mx-sm-n16{margin-right:-64px!important;margin-left:-64px!important}.my-sm-n1{margin-top:-4px!important;margin-bottom:-4px!important}.my-sm-n2{margin-top:-8px!important;margin-bottom:-8px!important}.my-sm-n3{margin-top:-12px!important;margin-bottom:-12px!important}.my-sm-n4{margin-top:-16px!important;margin-bottom:-16px!important}.my-sm-n5{margin-top:-20px!important;margin-bottom:-20px!important}.my-sm-n6{margin-top:-24px!important;margin-bottom:-24px!important}.my-sm-n7{margin-top:-28px!important;margin-bottom:-28px!important}.my-sm-n8{margin-top:-32px!important;margin-bottom:-32px!important}.my-sm-n9{margin-top:-36px!important;margin-bottom:-36px!important}.my-sm-n10{margin-top:-40px!important;margin-bottom:-40px!important}.my-sm-n11{margin-top:-44px!important;margin-bottom:-44px!important}.my-sm-n12{margin-top:-48px!important;margin-bottom:-48px!important}.my-sm-n13{margin-top:-52px!important;margin-bottom:-52px!important}.my-sm-n14{margin-top:-56px!important;margin-bottom:-56px!important}.my-sm-n15{margin-top:-60px!important;margin-bottom:-60px!important}.my-sm-n16{margin-top:-64px!important;margin-bottom:-64px!important}.mt-sm-n1{margin-top:-4px!important}.mt-sm-n2{margin-top:-8px!important}.mt-sm-n3{margin-top:-12px!important}.mt-sm-n4{margin-top:-16px!important}.mt-sm-n5{margin-top:-20px!important}.mt-sm-n6{margin-top:-24px!important}.mt-sm-n7{margin-top:-28px!important}.mt-sm-n8{margin-top:-32px!important}.mt-sm-n9{margin-top:-36px!important}.mt-sm-n10{margin-top:-40px!important}.mt-sm-n11{margin-top:-44px!important}.mt-sm-n12{margin-top:-48px!important}.mt-sm-n13{margin-top:-52px!important}.mt-sm-n14{margin-top:-56px!important}.mt-sm-n15{margin-top:-60px!important}.mt-sm-n16{margin-top:-64px!important}.mr-sm-n1{margin-right:-4px!important}.mr-sm-n2{margin-right:-8px!important}.mr-sm-n3{margin-right:-12px!important}.mr-sm-n4{margin-right:-16px!important}.mr-sm-n5{margin-right:-20px!important}.mr-sm-n6{margin-right:-24px!important}.mr-sm-n7{margin-right:-28px!important}.mr-sm-n8{margin-right:-32px!important}.mr-sm-n9{margin-right:-36px!important}.mr-sm-n10{margin-right:-40px!important}.mr-sm-n11{margin-right:-44px!important}.mr-sm-n12{margin-right:-48px!important}.mr-sm-n13{margin-right:-52px!important}.mr-sm-n14{margin-right:-56px!important}.mr-sm-n15{margin-right:-60px!important}.mr-sm-n16{margin-right:-64px!important}.mb-sm-n1{margin-bottom:-4px!important}.mb-sm-n2{margin-bottom:-8px!important}.mb-sm-n3{margin-bottom:-12px!important}.mb-sm-n4{margin-bottom:-16px!important}.mb-sm-n5{margin-bottom:-20px!important}.mb-sm-n6{margin-bottom:-24px!important}.mb-sm-n7{margin-bottom:-28px!important}.mb-sm-n8{margin-bottom:-32px!important}.mb-sm-n9{margin-bottom:-36px!important}.mb-sm-n10{margin-bottom:-40px!important}.mb-sm-n11{margin-bottom:-44px!important}.mb-sm-n12{margin-bottom:-48px!important}.mb-sm-n13{margin-bottom:-52px!important}.mb-sm-n14{margin-bottom:-56px!important}.mb-sm-n15{margin-bottom:-60px!important}.mb-sm-n16{margin-bottom:-64px!important}.ml-sm-n1{margin-left:-4px!important}.ml-sm-n2{margin-left:-8px!important}.ml-sm-n3{margin-left:-12px!important}.ml-sm-n4{margin-left:-16px!important}.ml-sm-n5{margin-left:-20px!important}.ml-sm-n6{margin-left:-24px!important}.ml-sm-n7{margin-left:-28px!important}.ml-sm-n8{margin-left:-32px!important}.ml-sm-n9{margin-left:-36px!important}.ml-sm-n10{margin-left:-40px!important}.ml-sm-n11{margin-left:-44px!important}.ml-sm-n12{margin-left:-48px!important}.ml-sm-n13{margin-left:-52px!important}.ml-sm-n14{margin-left:-56px!important}.ml-sm-n15{margin-left:-60px!important}.ml-sm-n16{margin-left:-64px!important}.ms-sm-n1{margin-inline-start:-4px!important}.ms-sm-n2{margin-inline-start:-8px!important}.ms-sm-n3{margin-inline-start:-12px!important}.ms-sm-n4{margin-inline-start:-16px!important}.ms-sm-n5{margin-inline-start:-20px!important}.ms-sm-n6{margin-inline-start:-24px!important}.ms-sm-n7{margin-inline-start:-28px!important}.ms-sm-n8{margin-inline-start:-32px!important}.ms-sm-n9{margin-inline-start:-36px!important}.ms-sm-n10{margin-inline-start:-40px!important}.ms-sm-n11{margin-inline-start:-44px!important}.ms-sm-n12{margin-inline-start:-48px!important}.ms-sm-n13{margin-inline-start:-52px!important}.ms-sm-n14{margin-inline-start:-56px!important}.ms-sm-n15{margin-inline-start:-60px!important}.ms-sm-n16{margin-inline-start:-64px!important}.me-sm-n1{margin-inline-end:-4px!important}.me-sm-n2{margin-inline-end:-8px!important}.me-sm-n3{margin-inline-end:-12px!important}.me-sm-n4{margin-inline-end:-16px!important}.me-sm-n5{margin-inline-end:-20px!important}.me-sm-n6{margin-inline-end:-24px!important}.me-sm-n7{margin-inline-end:-28px!important}.me-sm-n8{margin-inline-end:-32px!important}.me-sm-n9{margin-inline-end:-36px!important}.me-sm-n10{margin-inline-end:-40px!important}.me-sm-n11{margin-inline-end:-44px!important}.me-sm-n12{margin-inline-end:-48px!important}.me-sm-n13{margin-inline-end:-52px!important}.me-sm-n14{margin-inline-end:-56px!important}.me-sm-n15{margin-inline-end:-60px!important}.me-sm-n16{margin-inline-end:-64px!important}.pa-sm-0{padding:0!important}.pa-sm-1{padding:4px!important}.pa-sm-2{padding:8px!important}.pa-sm-3{padding:12px!important}.pa-sm-4{padding:16px!important}.pa-sm-5{padding:20px!important}.pa-sm-6{padding:24px!important}.pa-sm-7{padding:28px!important}.pa-sm-8{padding:32px!important}.pa-sm-9{padding:36px!important}.pa-sm-10{padding:40px!important}.pa-sm-11{padding:44px!important}.pa-sm-12{padding:48px!important}.pa-sm-13{padding:52px!important}.pa-sm-14{padding:56px!important}.pa-sm-15{padding:60px!important}.pa-sm-16{padding:64px!important}.px-sm-0{padding-right:0!important;padding-left:0!important}.px-sm-1{padding-right:4px!important;padding-left:4px!important}.px-sm-2{padding-right:8px!important;padding-left:8px!important}.px-sm-3{padding-right:12px!important;padding-left:12px!important}.px-sm-4{padding-right:16px!important;padding-left:16px!important}.px-sm-5{padding-right:20px!important;padding-left:20px!important}.px-sm-6{padding-right:24px!important;padding-left:24px!important}.px-sm-7{padding-right:28px!important;padding-left:28px!important}.px-sm-8{padding-right:32px!important;padding-left:32px!important}.px-sm-9{padding-right:36px!important;padding-left:36px!important}.px-sm-10{padding-right:40px!important;padding-left:40px!important}.px-sm-11{padding-right:44px!important;padding-left:44px!important}.px-sm-12{padding-right:48px!important;padding-left:48px!important}.px-sm-13{padding-right:52px!important;padding-left:52px!important}.px-sm-14{padding-right:56px!important;padding-left:56px!important}.px-sm-15{padding-right:60px!important;padding-left:60px!important}.px-sm-16{padding-right:64px!important;padding-left:64px!important}.py-sm-0{padding-top:0!important;padding-bottom:0!important}.py-sm-1{padding-top:4px!important;padding-bottom:4px!important}.py-sm-2{padding-top:8px!important;padding-bottom:8px!important}.py-sm-3{padding-top:12px!important;padding-bottom:12px!important}.py-sm-4{padding-top:16px!important;padding-bottom:16px!important}.py-sm-5{padding-top:20px!important;padding-bottom:20px!important}.py-sm-6{padding-top:24px!important;padding-bottom:24px!important}.py-sm-7{padding-top:28px!important;padding-bottom:28px!important}.py-sm-8{padding-top:32px!important;padding-bottom:32px!important}.py-sm-9{padding-top:36px!important;padding-bottom:36px!important}.py-sm-10{padding-top:40px!important;padding-bottom:40px!important}.py-sm-11{padding-top:44px!important;padding-bottom:44px!important}.py-sm-12{padding-top:48px!important;padding-bottom:48px!important}.py-sm-13{padding-top:52px!important;padding-bottom:52px!important}.py-sm-14{padding-top:56px!important;padding-bottom:56px!important}.py-sm-15{padding-top:60px!important;padding-bottom:60px!important}.py-sm-16{padding-top:64px!important;padding-bottom:64px!important}.pt-sm-0{padding-top:0!important}.pt-sm-1{padding-top:4px!important}.pt-sm-2{padding-top:8px!important}.pt-sm-3{padding-top:12px!important}.pt-sm-4{padding-top:16px!important}.pt-sm-5{padding-top:20px!important}.pt-sm-6{padding-top:24px!important}.pt-sm-7{padding-top:28px!important}.pt-sm-8{padding-top:32px!important}.pt-sm-9{padding-top:36px!important}.pt-sm-10{padding-top:40px!important}.pt-sm-11{padding-top:44px!important}.pt-sm-12{padding-top:48px!important}.pt-sm-13{padding-top:52px!important}.pt-sm-14{padding-top:56px!important}.pt-sm-15{padding-top:60px!important}.pt-sm-16{padding-top:64px!important}.pr-sm-0{padding-right:0!important}.pr-sm-1{padding-right:4px!important}.pr-sm-2{padding-right:8px!important}.pr-sm-3{padding-right:12px!important}.pr-sm-4{padding-right:16px!important}.pr-sm-5{padding-right:20px!important}.pr-sm-6{padding-right:24px!important}.pr-sm-7{padding-right:28px!important}.pr-sm-8{padding-right:32px!important}.pr-sm-9{padding-right:36px!important}.pr-sm-10{padding-right:40px!important}.pr-sm-11{padding-right:44px!important}.pr-sm-12{padding-right:48px!important}.pr-sm-13{padding-right:52px!important}.pr-sm-14{padding-right:56px!important}.pr-sm-15{padding-right:60px!important}.pr-sm-16{padding-right:64px!important}.pb-sm-0{padding-bottom:0!important}.pb-sm-1{padding-bottom:4px!important}.pb-sm-2{padding-bottom:8px!important}.pb-sm-3{padding-bottom:12px!important}.pb-sm-4{padding-bottom:16px!important}.pb-sm-5{padding-bottom:20px!important}.pb-sm-6{padding-bottom:24px!important}.pb-sm-7{padding-bottom:28px!important}.pb-sm-8{padding-bottom:32px!important}.pb-sm-9{padding-bottom:36px!important}.pb-sm-10{padding-bottom:40px!important}.pb-sm-11{padding-bottom:44px!important}.pb-sm-12{padding-bottom:48px!important}.pb-sm-13{padding-bottom:52px!important}.pb-sm-14{padding-bottom:56px!important}.pb-sm-15{padding-bottom:60px!important}.pb-sm-16{padding-bottom:64px!important}.pl-sm-0{padding-left:0!important}.pl-sm-1{padding-left:4px!important}.pl-sm-2{padding-left:8px!important}.pl-sm-3{padding-left:12px!important}.pl-sm-4{padding-left:16px!important}.pl-sm-5{padding-left:20px!important}.pl-sm-6{padding-left:24px!important}.pl-sm-7{padding-left:28px!important}.pl-sm-8{padding-left:32px!important}.pl-sm-9{padding-left:36px!important}.pl-sm-10{padding-left:40px!important}.pl-sm-11{padding-left:44px!important}.pl-sm-12{padding-left:48px!important}.pl-sm-13{padding-left:52px!important}.pl-sm-14{padding-left:56px!important}.pl-sm-15{padding-left:60px!important}.pl-sm-16{padding-left:64px!important}.ps-sm-0{padding-inline-start:0px!important}.ps-sm-1{padding-inline-start:4px!important}.ps-sm-2{padding-inline-start:8px!important}.ps-sm-3{padding-inline-start:12px!important}.ps-sm-4{padding-inline-start:16px!important}.ps-sm-5{padding-inline-start:20px!important}.ps-sm-6{padding-inline-start:24px!important}.ps-sm-7{padding-inline-start:28px!important}.ps-sm-8{padding-inline-start:32px!important}.ps-sm-9{padding-inline-start:36px!important}.ps-sm-10{padding-inline-start:40px!important}.ps-sm-11{padding-inline-start:44px!important}.ps-sm-12{padding-inline-start:48px!important}.ps-sm-13{padding-inline-start:52px!important}.ps-sm-14{padding-inline-start:56px!important}.ps-sm-15{padding-inline-start:60px!important}.ps-sm-16{padding-inline-start:64px!important}.pe-sm-0{padding-inline-end:0px!important}.pe-sm-1{padding-inline-end:4px!important}.pe-sm-2{padding-inline-end:8px!important}.pe-sm-3{padding-inline-end:12px!important}.pe-sm-4{padding-inline-end:16px!important}.pe-sm-5{padding-inline-end:20px!important}.pe-sm-6{padding-inline-end:24px!important}.pe-sm-7{padding-inline-end:28px!important}.pe-sm-8{padding-inline-end:32px!important}.pe-sm-9{padding-inline-end:36px!important}.pe-sm-10{padding-inline-end:40px!important}.pe-sm-11{padding-inline-end:44px!important}.pe-sm-12{padding-inline-end:48px!important}.pe-sm-13{padding-inline-end:52px!important}.pe-sm-14{padding-inline-end:56px!important}.pe-sm-15{padding-inline-end:60px!important}.pe-sm-16{padding-inline-end:64px!important}.text-sm-left{text-align:left!important}.text-sm-right{text-align:right!important}.text-sm-center{text-align:center!important}.text-sm-justify{text-align:justify!important}.text-sm-start{text-align:start!important}.text-sm-end{text-align:end!important}.text-sm-h1{font-size:6rem!important;font-weight:300;line-height:1;letter-spacing:-.015625em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-h2{font-size:3.75rem!important;font-weight:300;line-height:1;letter-spacing:-.0083333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-h3{font-size:3rem!important;font-weight:400;line-height:1.05;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-h4{font-size:2.125rem!important;font-weight:400;line-height:1.175;letter-spacing:.0073529412em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-h5{font-size:1.5rem!important;font-weight:400;line-height:1.333;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-h6{font-size:1.25rem!important;font-weight:500;line-height:1.6;letter-spacing:.0125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-subtitle-1{font-size:1rem!important;font-weight:400;line-height:1.75;letter-spacing:.009375em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-subtitle-2{font-size:.875rem!important;font-weight:500;line-height:1.6;letter-spacing:.0071428571em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-body-1{font-size:1rem!important;font-weight:400;line-height:1.5;letter-spacing:.03125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-body-2{font-size:.875rem!important;font-weight:400;line-height:1.425;letter-spacing:.0178571429em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-button{font-size:.875rem!important;font-weight:500;line-height:2.6;letter-spacing:.0892857143em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.text-sm-caption{font-size:.75rem!important;font-weight:400;line-height:1.667;letter-spacing:.0333333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-sm-overline{font-size:.75rem!important;font-weight:500;line-height:2.667;letter-spacing:.1666666667em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.h-sm-auto{height:auto!important}.h-sm-screen{height:100vh!important}.h-sm-0{height:0!important}.h-sm-25{height:25%!important}.h-sm-50{height:50%!important}.h-sm-75{height:75%!important}.h-sm-100{height:100%!important}.w-sm-auto{width:auto!important}.w-sm-0{width:0!important}.w-sm-25{width:25%!important}.w-sm-33{width:33%!important}.w-sm-50{width:50%!important}.w-sm-66{width:66%!important}.w-sm-75{width:75%!important}.w-sm-100{width:100%!important}}@media (min-width: 960px){.d-md-none{display:none!important}.d-md-inline{display:inline!important}.d-md-inline-block{display:inline-block!important}.d-md-block{display:block!important}.d-md-table{display:table!important}.d-md-table-row{display:table-row!important}.d-md-table-cell{display:table-cell!important}.d-md-flex{display:flex!important}.d-md-inline-flex{display:inline-flex!important}.float-md-none{float:none!important}.float-md-left{float:left!important}.float-md-right{float:right!important}.v-locale--is-rtl .float-md-end{float:left!important}.v-locale--is-rtl .float-md-start,.v-locale--is-ltr .float-md-end{float:right!important}.v-locale--is-ltr .float-md-start{float:left!important}.flex-md-fill,.flex-md-1-1{flex:1 1 auto!important}.flex-md-1-0{flex:1 0 auto!important}.flex-md-0-1{flex:0 1 auto!important}.flex-md-0-0{flex:0 0 auto!important}.flex-md-1-1-100{flex:1 1 100%!important}.flex-md-1-0-100{flex:1 0 100%!important}.flex-md-0-1-100{flex:0 1 100%!important}.flex-md-0-0-100{flex:0 0 100%!important}.flex-md-1-1-0{flex:1 1 0!important}.flex-md-1-0-0{flex:1 0 0!important}.flex-md-0-1-0{flex:0 1 0!important}.flex-md-0-0-0{flex:0 0 0!important}.flex-md-row{flex-direction:row!important}.flex-md-column{flex-direction:column!important}.flex-md-row-reverse{flex-direction:row-reverse!important}.flex-md-column-reverse{flex-direction:column-reverse!important}.flex-md-grow-0{flex-grow:0!important}.flex-md-grow-1{flex-grow:1!important}.flex-md-shrink-0{flex-shrink:0!important}.flex-md-shrink-1{flex-shrink:1!important}.flex-md-wrap{flex-wrap:wrap!important}.flex-md-nowrap{flex-wrap:nowrap!important}.flex-md-wrap-reverse{flex-wrap:wrap-reverse!important}.justify-md-start{justify-content:flex-start!important}.justify-md-end{justify-content:flex-end!important}.justify-md-center{justify-content:center!important}.justify-md-space-between{justify-content:space-between!important}.justify-md-space-around{justify-content:space-around!important}.justify-md-space-evenly{justify-content:space-evenly!important}.justify-items-md-start{justify-items:flex-start!important}.justify-items-md-end{justify-items:flex-end!important}.justify-items-md-center{justify-items:center!important}.justify-items-md-stretch{justify-items:stretch!important}.align-md-start{align-items:flex-start!important}.align-md-end{align-items:flex-end!important}.align-md-center{align-items:center!important}.align-md-baseline{align-items:baseline!important}.align-md-stretch{align-items:stretch!important}.align-content-md-start{align-content:flex-start!important}.align-content-md-end{align-content:flex-end!important}.align-content-md-center{align-content:center!important}.align-content-md-space-between{align-content:space-between!important}.align-content-md-space-around{align-content:space-around!important}.align-content-md-space-evenly{align-content:space-evenly!important}.align-content-md-stretch{align-content:stretch!important}.align-self-md-auto{align-self:auto!important}.align-self-md-start{align-self:flex-start!important}.align-self-md-end{align-self:flex-end!important}.align-self-md-center{align-self:center!important}.align-self-md-baseline{align-self:baseline!important}.align-self-md-stretch{align-self:stretch!important}.order-md-first{order:-1!important}.order-md-0{order:0!important}.order-md-1{order:1!important}.order-md-2{order:2!important}.order-md-3{order:3!important}.order-md-4{order:4!important}.order-md-5{order:5!important}.order-md-6{order:6!important}.order-md-7{order:7!important}.order-md-8{order:8!important}.order-md-9{order:9!important}.order-md-10{order:10!important}.order-md-11{order:11!important}.order-md-12{order:12!important}.order-md-last{order:13!important}.ga-md-0{gap:0px!important}.ga-md-1{gap:4px!important}.ga-md-2{gap:8px!important}.ga-md-3{gap:12px!important}.ga-md-4{gap:16px!important}.ga-md-5{gap:20px!important}.ga-md-6{gap:24px!important}.ga-md-7{gap:28px!important}.ga-md-8{gap:32px!important}.ga-md-9{gap:36px!important}.ga-md-10{gap:40px!important}.ga-md-11{gap:44px!important}.ga-md-12{gap:48px!important}.ga-md-13{gap:52px!important}.ga-md-14{gap:56px!important}.ga-md-15{gap:60px!important}.ga-md-16{gap:64px!important}.ga-md-auto{gap:auto!important}.gr-md-0{row-gap:0px!important}.gr-md-1{row-gap:4px!important}.gr-md-2{row-gap:8px!important}.gr-md-3{row-gap:12px!important}.gr-md-4{row-gap:16px!important}.gr-md-5{row-gap:20px!important}.gr-md-6{row-gap:24px!important}.gr-md-7{row-gap:28px!important}.gr-md-8{row-gap:32px!important}.gr-md-9{row-gap:36px!important}.gr-md-10{row-gap:40px!important}.gr-md-11{row-gap:44px!important}.gr-md-12{row-gap:48px!important}.gr-md-13{row-gap:52px!important}.gr-md-14{row-gap:56px!important}.gr-md-15{row-gap:60px!important}.gr-md-16{row-gap:64px!important}.gr-md-auto{row-gap:auto!important}.gc-md-0{column-gap:0px!important}.gc-md-1{column-gap:4px!important}.gc-md-2{column-gap:8px!important}.gc-md-3{column-gap:12px!important}.gc-md-4{column-gap:16px!important}.gc-md-5{column-gap:20px!important}.gc-md-6{column-gap:24px!important}.gc-md-7{column-gap:28px!important}.gc-md-8{column-gap:32px!important}.gc-md-9{column-gap:36px!important}.gc-md-10{column-gap:40px!important}.gc-md-11{column-gap:44px!important}.gc-md-12{column-gap:48px!important}.gc-md-13{column-gap:52px!important}.gc-md-14{column-gap:56px!important}.gc-md-15{column-gap:60px!important}.gc-md-16{column-gap:64px!important}.gc-md-auto{column-gap:auto!important}.ma-md-0{margin:0!important}.ma-md-1{margin:4px!important}.ma-md-2{margin:8px!important}.ma-md-3{margin:12px!important}.ma-md-4{margin:16px!important}.ma-md-5{margin:20px!important}.ma-md-6{margin:24px!important}.ma-md-7{margin:28px!important}.ma-md-8{margin:32px!important}.ma-md-9{margin:36px!important}.ma-md-10{margin:40px!important}.ma-md-11{margin:44px!important}.ma-md-12{margin:48px!important}.ma-md-13{margin:52px!important}.ma-md-14{margin:56px!important}.ma-md-15{margin:60px!important}.ma-md-16{margin:64px!important}.ma-md-auto{margin:auto!important}.mx-md-0{margin-right:0!important;margin-left:0!important}.mx-md-1{margin-right:4px!important;margin-left:4px!important}.mx-md-2{margin-right:8px!important;margin-left:8px!important}.mx-md-3{margin-right:12px!important;margin-left:12px!important}.mx-md-4{margin-right:16px!important;margin-left:16px!important}.mx-md-5{margin-right:20px!important;margin-left:20px!important}.mx-md-6{margin-right:24px!important;margin-left:24px!important}.mx-md-7{margin-right:28px!important;margin-left:28px!important}.mx-md-8{margin-right:32px!important;margin-left:32px!important}.mx-md-9{margin-right:36px!important;margin-left:36px!important}.mx-md-10{margin-right:40px!important;margin-left:40px!important}.mx-md-11{margin-right:44px!important;margin-left:44px!important}.mx-md-12{margin-right:48px!important;margin-left:48px!important}.mx-md-13{margin-right:52px!important;margin-left:52px!important}.mx-md-14{margin-right:56px!important;margin-left:56px!important}.mx-md-15{margin-right:60px!important;margin-left:60px!important}.mx-md-16{margin-right:64px!important;margin-left:64px!important}.mx-md-auto{margin-right:auto!important;margin-left:auto!important}.my-md-0{margin-top:0!important;margin-bottom:0!important}.my-md-1{margin-top:4px!important;margin-bottom:4px!important}.my-md-2{margin-top:8px!important;margin-bottom:8px!important}.my-md-3{margin-top:12px!important;margin-bottom:12px!important}.my-md-4{margin-top:16px!important;margin-bottom:16px!important}.my-md-5{margin-top:20px!important;margin-bottom:20px!important}.my-md-6{margin-top:24px!important;margin-bottom:24px!important}.my-md-7{margin-top:28px!important;margin-bottom:28px!important}.my-md-8{margin-top:32px!important;margin-bottom:32px!important}.my-md-9{margin-top:36px!important;margin-bottom:36px!important}.my-md-10{margin-top:40px!important;margin-bottom:40px!important}.my-md-11{margin-top:44px!important;margin-bottom:44px!important}.my-md-12{margin-top:48px!important;margin-bottom:48px!important}.my-md-13{margin-top:52px!important;margin-bottom:52px!important}.my-md-14{margin-top:56px!important;margin-bottom:56px!important}.my-md-15{margin-top:60px!important;margin-bottom:60px!important}.my-md-16{margin-top:64px!important;margin-bottom:64px!important}.my-md-auto{margin-top:auto!important;margin-bottom:auto!important}.mt-md-0{margin-top:0!important}.mt-md-1{margin-top:4px!important}.mt-md-2{margin-top:8px!important}.mt-md-3{margin-top:12px!important}.mt-md-4{margin-top:16px!important}.mt-md-5{margin-top:20px!important}.mt-md-6{margin-top:24px!important}.mt-md-7{margin-top:28px!important}.mt-md-8{margin-top:32px!important}.mt-md-9{margin-top:36px!important}.mt-md-10{margin-top:40px!important}.mt-md-11{margin-top:44px!important}.mt-md-12{margin-top:48px!important}.mt-md-13{margin-top:52px!important}.mt-md-14{margin-top:56px!important}.mt-md-15{margin-top:60px!important}.mt-md-16{margin-top:64px!important}.mt-md-auto{margin-top:auto!important}.mr-md-0{margin-right:0!important}.mr-md-1{margin-right:4px!important}.mr-md-2{margin-right:8px!important}.mr-md-3{margin-right:12px!important}.mr-md-4{margin-right:16px!important}.mr-md-5{margin-right:20px!important}.mr-md-6{margin-right:24px!important}.mr-md-7{margin-right:28px!important}.mr-md-8{margin-right:32px!important}.mr-md-9{margin-right:36px!important}.mr-md-10{margin-right:40px!important}.mr-md-11{margin-right:44px!important}.mr-md-12{margin-right:48px!important}.mr-md-13{margin-right:52px!important}.mr-md-14{margin-right:56px!important}.mr-md-15{margin-right:60px!important}.mr-md-16{margin-right:64px!important}.mr-md-auto{margin-right:auto!important}.mb-md-0{margin-bottom:0!important}.mb-md-1{margin-bottom:4px!important}.mb-md-2{margin-bottom:8px!important}.mb-md-3{margin-bottom:12px!important}.mb-md-4{margin-bottom:16px!important}.mb-md-5{margin-bottom:20px!important}.mb-md-6{margin-bottom:24px!important}.mb-md-7{margin-bottom:28px!important}.mb-md-8{margin-bottom:32px!important}.mb-md-9{margin-bottom:36px!important}.mb-md-10{margin-bottom:40px!important}.mb-md-11{margin-bottom:44px!important}.mb-md-12{margin-bottom:48px!important}.mb-md-13{margin-bottom:52px!important}.mb-md-14{margin-bottom:56px!important}.mb-md-15{margin-bottom:60px!important}.mb-md-16{margin-bottom:64px!important}.mb-md-auto{margin-bottom:auto!important}.ml-md-0{margin-left:0!important}.ml-md-1{margin-left:4px!important}.ml-md-2{margin-left:8px!important}.ml-md-3{margin-left:12px!important}.ml-md-4{margin-left:16px!important}.ml-md-5{margin-left:20px!important}.ml-md-6{margin-left:24px!important}.ml-md-7{margin-left:28px!important}.ml-md-8{margin-left:32px!important}.ml-md-9{margin-left:36px!important}.ml-md-10{margin-left:40px!important}.ml-md-11{margin-left:44px!important}.ml-md-12{margin-left:48px!important}.ml-md-13{margin-left:52px!important}.ml-md-14{margin-left:56px!important}.ml-md-15{margin-left:60px!important}.ml-md-16{margin-left:64px!important}.ml-md-auto{margin-left:auto!important}.ms-md-0{margin-inline-start:0px!important}.ms-md-1{margin-inline-start:4px!important}.ms-md-2{margin-inline-start:8px!important}.ms-md-3{margin-inline-start:12px!important}.ms-md-4{margin-inline-start:16px!important}.ms-md-5{margin-inline-start:20px!important}.ms-md-6{margin-inline-start:24px!important}.ms-md-7{margin-inline-start:28px!important}.ms-md-8{margin-inline-start:32px!important}.ms-md-9{margin-inline-start:36px!important}.ms-md-10{margin-inline-start:40px!important}.ms-md-11{margin-inline-start:44px!important}.ms-md-12{margin-inline-start:48px!important}.ms-md-13{margin-inline-start:52px!important}.ms-md-14{margin-inline-start:56px!important}.ms-md-15{margin-inline-start:60px!important}.ms-md-16{margin-inline-start:64px!important}.ms-md-auto{margin-inline-start:auto!important}.me-md-0{margin-inline-end:0px!important}.me-md-1{margin-inline-end:4px!important}.me-md-2{margin-inline-end:8px!important}.me-md-3{margin-inline-end:12px!important}.me-md-4{margin-inline-end:16px!important}.me-md-5{margin-inline-end:20px!important}.me-md-6{margin-inline-end:24px!important}.me-md-7{margin-inline-end:28px!important}.me-md-8{margin-inline-end:32px!important}.me-md-9{margin-inline-end:36px!important}.me-md-10{margin-inline-end:40px!important}.me-md-11{margin-inline-end:44px!important}.me-md-12{margin-inline-end:48px!important}.me-md-13{margin-inline-end:52px!important}.me-md-14{margin-inline-end:56px!important}.me-md-15{margin-inline-end:60px!important}.me-md-16{margin-inline-end:64px!important}.me-md-auto{margin-inline-end:auto!important}.ma-md-n1{margin:-4px!important}.ma-md-n2{margin:-8px!important}.ma-md-n3{margin:-12px!important}.ma-md-n4{margin:-16px!important}.ma-md-n5{margin:-20px!important}.ma-md-n6{margin:-24px!important}.ma-md-n7{margin:-28px!important}.ma-md-n8{margin:-32px!important}.ma-md-n9{margin:-36px!important}.ma-md-n10{margin:-40px!important}.ma-md-n11{margin:-44px!important}.ma-md-n12{margin:-48px!important}.ma-md-n13{margin:-52px!important}.ma-md-n14{margin:-56px!important}.ma-md-n15{margin:-60px!important}.ma-md-n16{margin:-64px!important}.mx-md-n1{margin-right:-4px!important;margin-left:-4px!important}.mx-md-n2{margin-right:-8px!important;margin-left:-8px!important}.mx-md-n3{margin-right:-12px!important;margin-left:-12px!important}.mx-md-n4{margin-right:-16px!important;margin-left:-16px!important}.mx-md-n5{margin-right:-20px!important;margin-left:-20px!important}.mx-md-n6{margin-right:-24px!important;margin-left:-24px!important}.mx-md-n7{margin-right:-28px!important;margin-left:-28px!important}.mx-md-n8{margin-right:-32px!important;margin-left:-32px!important}.mx-md-n9{margin-right:-36px!important;margin-left:-36px!important}.mx-md-n10{margin-right:-40px!important;margin-left:-40px!important}.mx-md-n11{margin-right:-44px!important;margin-left:-44px!important}.mx-md-n12{margin-right:-48px!important;margin-left:-48px!important}.mx-md-n13{margin-right:-52px!important;margin-left:-52px!important}.mx-md-n14{margin-right:-56px!important;margin-left:-56px!important}.mx-md-n15{margin-right:-60px!important;margin-left:-60px!important}.mx-md-n16{margin-right:-64px!important;margin-left:-64px!important}.my-md-n1{margin-top:-4px!important;margin-bottom:-4px!important}.my-md-n2{margin-top:-8px!important;margin-bottom:-8px!important}.my-md-n3{margin-top:-12px!important;margin-bottom:-12px!important}.my-md-n4{margin-top:-16px!important;margin-bottom:-16px!important}.my-md-n5{margin-top:-20px!important;margin-bottom:-20px!important}.my-md-n6{margin-top:-24px!important;margin-bottom:-24px!important}.my-md-n7{margin-top:-28px!important;margin-bottom:-28px!important}.my-md-n8{margin-top:-32px!important;margin-bottom:-32px!important}.my-md-n9{margin-top:-36px!important;margin-bottom:-36px!important}.my-md-n10{margin-top:-40px!important;margin-bottom:-40px!important}.my-md-n11{margin-top:-44px!important;margin-bottom:-44px!important}.my-md-n12{margin-top:-48px!important;margin-bottom:-48px!important}.my-md-n13{margin-top:-52px!important;margin-bottom:-52px!important}.my-md-n14{margin-top:-56px!important;margin-bottom:-56px!important}.my-md-n15{margin-top:-60px!important;margin-bottom:-60px!important}.my-md-n16{margin-top:-64px!important;margin-bottom:-64px!important}.mt-md-n1{margin-top:-4px!important}.mt-md-n2{margin-top:-8px!important}.mt-md-n3{margin-top:-12px!important}.mt-md-n4{margin-top:-16px!important}.mt-md-n5{margin-top:-20px!important}.mt-md-n6{margin-top:-24px!important}.mt-md-n7{margin-top:-28px!important}.mt-md-n8{margin-top:-32px!important}.mt-md-n9{margin-top:-36px!important}.mt-md-n10{margin-top:-40px!important}.mt-md-n11{margin-top:-44px!important}.mt-md-n12{margin-top:-48px!important}.mt-md-n13{margin-top:-52px!important}.mt-md-n14{margin-top:-56px!important}.mt-md-n15{margin-top:-60px!important}.mt-md-n16{margin-top:-64px!important}.mr-md-n1{margin-right:-4px!important}.mr-md-n2{margin-right:-8px!important}.mr-md-n3{margin-right:-12px!important}.mr-md-n4{margin-right:-16px!important}.mr-md-n5{margin-right:-20px!important}.mr-md-n6{margin-right:-24px!important}.mr-md-n7{margin-right:-28px!important}.mr-md-n8{margin-right:-32px!important}.mr-md-n9{margin-right:-36px!important}.mr-md-n10{margin-right:-40px!important}.mr-md-n11{margin-right:-44px!important}.mr-md-n12{margin-right:-48px!important}.mr-md-n13{margin-right:-52px!important}.mr-md-n14{margin-right:-56px!important}.mr-md-n15{margin-right:-60px!important}.mr-md-n16{margin-right:-64px!important}.mb-md-n1{margin-bottom:-4px!important}.mb-md-n2{margin-bottom:-8px!important}.mb-md-n3{margin-bottom:-12px!important}.mb-md-n4{margin-bottom:-16px!important}.mb-md-n5{margin-bottom:-20px!important}.mb-md-n6{margin-bottom:-24px!important}.mb-md-n7{margin-bottom:-28px!important}.mb-md-n8{margin-bottom:-32px!important}.mb-md-n9{margin-bottom:-36px!important}.mb-md-n10{margin-bottom:-40px!important}.mb-md-n11{margin-bottom:-44px!important}.mb-md-n12{margin-bottom:-48px!important}.mb-md-n13{margin-bottom:-52px!important}.mb-md-n14{margin-bottom:-56px!important}.mb-md-n15{margin-bottom:-60px!important}.mb-md-n16{margin-bottom:-64px!important}.ml-md-n1{margin-left:-4px!important}.ml-md-n2{margin-left:-8px!important}.ml-md-n3{margin-left:-12px!important}.ml-md-n4{margin-left:-16px!important}.ml-md-n5{margin-left:-20px!important}.ml-md-n6{margin-left:-24px!important}.ml-md-n7{margin-left:-28px!important}.ml-md-n8{margin-left:-32px!important}.ml-md-n9{margin-left:-36px!important}.ml-md-n10{margin-left:-40px!important}.ml-md-n11{margin-left:-44px!important}.ml-md-n12{margin-left:-48px!important}.ml-md-n13{margin-left:-52px!important}.ml-md-n14{margin-left:-56px!important}.ml-md-n15{margin-left:-60px!important}.ml-md-n16{margin-left:-64px!important}.ms-md-n1{margin-inline-start:-4px!important}.ms-md-n2{margin-inline-start:-8px!important}.ms-md-n3{margin-inline-start:-12px!important}.ms-md-n4{margin-inline-start:-16px!important}.ms-md-n5{margin-inline-start:-20px!important}.ms-md-n6{margin-inline-start:-24px!important}.ms-md-n7{margin-inline-start:-28px!important}.ms-md-n8{margin-inline-start:-32px!important}.ms-md-n9{margin-inline-start:-36px!important}.ms-md-n10{margin-inline-start:-40px!important}.ms-md-n11{margin-inline-start:-44px!important}.ms-md-n12{margin-inline-start:-48px!important}.ms-md-n13{margin-inline-start:-52px!important}.ms-md-n14{margin-inline-start:-56px!important}.ms-md-n15{margin-inline-start:-60px!important}.ms-md-n16{margin-inline-start:-64px!important}.me-md-n1{margin-inline-end:-4px!important}.me-md-n2{margin-inline-end:-8px!important}.me-md-n3{margin-inline-end:-12px!important}.me-md-n4{margin-inline-end:-16px!important}.me-md-n5{margin-inline-end:-20px!important}.me-md-n6{margin-inline-end:-24px!important}.me-md-n7{margin-inline-end:-28px!important}.me-md-n8{margin-inline-end:-32px!important}.me-md-n9{margin-inline-end:-36px!important}.me-md-n10{margin-inline-end:-40px!important}.me-md-n11{margin-inline-end:-44px!important}.me-md-n12{margin-inline-end:-48px!important}.me-md-n13{margin-inline-end:-52px!important}.me-md-n14{margin-inline-end:-56px!important}.me-md-n15{margin-inline-end:-60px!important}.me-md-n16{margin-inline-end:-64px!important}.pa-md-0{padding:0!important}.pa-md-1{padding:4px!important}.pa-md-2{padding:8px!important}.pa-md-3{padding:12px!important}.pa-md-4{padding:16px!important}.pa-md-5{padding:20px!important}.pa-md-6{padding:24px!important}.pa-md-7{padding:28px!important}.pa-md-8{padding:32px!important}.pa-md-9{padding:36px!important}.pa-md-10{padding:40px!important}.pa-md-11{padding:44px!important}.pa-md-12{padding:48px!important}.pa-md-13{padding:52px!important}.pa-md-14{padding:56px!important}.pa-md-15{padding:60px!important}.pa-md-16{padding:64px!important}.px-md-0{padding-right:0!important;padding-left:0!important}.px-md-1{padding-right:4px!important;padding-left:4px!important}.px-md-2{padding-right:8px!important;padding-left:8px!important}.px-md-3{padding-right:12px!important;padding-left:12px!important}.px-md-4{padding-right:16px!important;padding-left:16px!important}.px-md-5{padding-right:20px!important;padding-left:20px!important}.px-md-6{padding-right:24px!important;padding-left:24px!important}.px-md-7{padding-right:28px!important;padding-left:28px!important}.px-md-8{padding-right:32px!important;padding-left:32px!important}.px-md-9{padding-right:36px!important;padding-left:36px!important}.px-md-10{padding-right:40px!important;padding-left:40px!important}.px-md-11{padding-right:44px!important;padding-left:44px!important}.px-md-12{padding-right:48px!important;padding-left:48px!important}.px-md-13{padding-right:52px!important;padding-left:52px!important}.px-md-14{padding-right:56px!important;padding-left:56px!important}.px-md-15{padding-right:60px!important;padding-left:60px!important}.px-md-16{padding-right:64px!important;padding-left:64px!important}.py-md-0{padding-top:0!important;padding-bottom:0!important}.py-md-1{padding-top:4px!important;padding-bottom:4px!important}.py-md-2{padding-top:8px!important;padding-bottom:8px!important}.py-md-3{padding-top:12px!important;padding-bottom:12px!important}.py-md-4{padding-top:16px!important;padding-bottom:16px!important}.py-md-5{padding-top:20px!important;padding-bottom:20px!important}.py-md-6{padding-top:24px!important;padding-bottom:24px!important}.py-md-7{padding-top:28px!important;padding-bottom:28px!important}.py-md-8{padding-top:32px!important;padding-bottom:32px!important}.py-md-9{padding-top:36px!important;padding-bottom:36px!important}.py-md-10{padding-top:40px!important;padding-bottom:40px!important}.py-md-11{padding-top:44px!important;padding-bottom:44px!important}.py-md-12{padding-top:48px!important;padding-bottom:48px!important}.py-md-13{padding-top:52px!important;padding-bottom:52px!important}.py-md-14{padding-top:56px!important;padding-bottom:56px!important}.py-md-15{padding-top:60px!important;padding-bottom:60px!important}.py-md-16{padding-top:64px!important;padding-bottom:64px!important}.pt-md-0{padding-top:0!important}.pt-md-1{padding-top:4px!important}.pt-md-2{padding-top:8px!important}.pt-md-3{padding-top:12px!important}.pt-md-4{padding-top:16px!important}.pt-md-5{padding-top:20px!important}.pt-md-6{padding-top:24px!important}.pt-md-7{padding-top:28px!important}.pt-md-8{padding-top:32px!important}.pt-md-9{padding-top:36px!important}.pt-md-10{padding-top:40px!important}.pt-md-11{padding-top:44px!important}.pt-md-12{padding-top:48px!important}.pt-md-13{padding-top:52px!important}.pt-md-14{padding-top:56px!important}.pt-md-15{padding-top:60px!important}.pt-md-16{padding-top:64px!important}.pr-md-0{padding-right:0!important}.pr-md-1{padding-right:4px!important}.pr-md-2{padding-right:8px!important}.pr-md-3{padding-right:12px!important}.pr-md-4{padding-right:16px!important}.pr-md-5{padding-right:20px!important}.pr-md-6{padding-right:24px!important}.pr-md-7{padding-right:28px!important}.pr-md-8{padding-right:32px!important}.pr-md-9{padding-right:36px!important}.pr-md-10{padding-right:40px!important}.pr-md-11{padding-right:44px!important}.pr-md-12{padding-right:48px!important}.pr-md-13{padding-right:52px!important}.pr-md-14{padding-right:56px!important}.pr-md-15{padding-right:60px!important}.pr-md-16{padding-right:64px!important}.pb-md-0{padding-bottom:0!important}.pb-md-1{padding-bottom:4px!important}.pb-md-2{padding-bottom:8px!important}.pb-md-3{padding-bottom:12px!important}.pb-md-4{padding-bottom:16px!important}.pb-md-5{padding-bottom:20px!important}.pb-md-6{padding-bottom:24px!important}.pb-md-7{padding-bottom:28px!important}.pb-md-8{padding-bottom:32px!important}.pb-md-9{padding-bottom:36px!important}.pb-md-10{padding-bottom:40px!important}.pb-md-11{padding-bottom:44px!important}.pb-md-12{padding-bottom:48px!important}.pb-md-13{padding-bottom:52px!important}.pb-md-14{padding-bottom:56px!important}.pb-md-15{padding-bottom:60px!important}.pb-md-16{padding-bottom:64px!important}.pl-md-0{padding-left:0!important}.pl-md-1{padding-left:4px!important}.pl-md-2{padding-left:8px!important}.pl-md-3{padding-left:12px!important}.pl-md-4{padding-left:16px!important}.pl-md-5{padding-left:20px!important}.pl-md-6{padding-left:24px!important}.pl-md-7{padding-left:28px!important}.pl-md-8{padding-left:32px!important}.pl-md-9{padding-left:36px!important}.pl-md-10{padding-left:40px!important}.pl-md-11{padding-left:44px!important}.pl-md-12{padding-left:48px!important}.pl-md-13{padding-left:52px!important}.pl-md-14{padding-left:56px!important}.pl-md-15{padding-left:60px!important}.pl-md-16{padding-left:64px!important}.ps-md-0{padding-inline-start:0px!important}.ps-md-1{padding-inline-start:4px!important}.ps-md-2{padding-inline-start:8px!important}.ps-md-3{padding-inline-start:12px!important}.ps-md-4{padding-inline-start:16px!important}.ps-md-5{padding-inline-start:20px!important}.ps-md-6{padding-inline-start:24px!important}.ps-md-7{padding-inline-start:28px!important}.ps-md-8{padding-inline-start:32px!important}.ps-md-9{padding-inline-start:36px!important}.ps-md-10{padding-inline-start:40px!important}.ps-md-11{padding-inline-start:44px!important}.ps-md-12{padding-inline-start:48px!important}.ps-md-13{padding-inline-start:52px!important}.ps-md-14{padding-inline-start:56px!important}.ps-md-15{padding-inline-start:60px!important}.ps-md-16{padding-inline-start:64px!important}.pe-md-0{padding-inline-end:0px!important}.pe-md-1{padding-inline-end:4px!important}.pe-md-2{padding-inline-end:8px!important}.pe-md-3{padding-inline-end:12px!important}.pe-md-4{padding-inline-end:16px!important}.pe-md-5{padding-inline-end:20px!important}.pe-md-6{padding-inline-end:24px!important}.pe-md-7{padding-inline-end:28px!important}.pe-md-8{padding-inline-end:32px!important}.pe-md-9{padding-inline-end:36px!important}.pe-md-10{padding-inline-end:40px!important}.pe-md-11{padding-inline-end:44px!important}.pe-md-12{padding-inline-end:48px!important}.pe-md-13{padding-inline-end:52px!important}.pe-md-14{padding-inline-end:56px!important}.pe-md-15{padding-inline-end:60px!important}.pe-md-16{padding-inline-end:64px!important}.text-md-left{text-align:left!important}.text-md-right{text-align:right!important}.text-md-center{text-align:center!important}.text-md-justify{text-align:justify!important}.text-md-start{text-align:start!important}.text-md-end{text-align:end!important}.text-md-h1{font-size:6rem!important;font-weight:300;line-height:1;letter-spacing:-.015625em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-h2{font-size:3.75rem!important;font-weight:300;line-height:1;letter-spacing:-.0083333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-h3{font-size:3rem!important;font-weight:400;line-height:1.05;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-h4{font-size:2.125rem!important;font-weight:400;line-height:1.175;letter-spacing:.0073529412em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-h5{font-size:1.5rem!important;font-weight:400;line-height:1.333;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-h6{font-size:1.25rem!important;font-weight:500;line-height:1.6;letter-spacing:.0125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-subtitle-1{font-size:1rem!important;font-weight:400;line-height:1.75;letter-spacing:.009375em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-subtitle-2{font-size:.875rem!important;font-weight:500;line-height:1.6;letter-spacing:.0071428571em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-body-1{font-size:1rem!important;font-weight:400;line-height:1.5;letter-spacing:.03125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-body-2{font-size:.875rem!important;font-weight:400;line-height:1.425;letter-spacing:.0178571429em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-button{font-size:.875rem!important;font-weight:500;line-height:2.6;letter-spacing:.0892857143em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.text-md-caption{font-size:.75rem!important;font-weight:400;line-height:1.667;letter-spacing:.0333333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-md-overline{font-size:.75rem!important;font-weight:500;line-height:2.667;letter-spacing:.1666666667em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.h-md-auto{height:auto!important}.h-md-screen{height:100vh!important}.h-md-0{height:0!important}.h-md-25{height:25%!important}.h-md-50{height:50%!important}.h-md-75{height:75%!important}.h-md-100{height:100%!important}.w-md-auto{width:auto!important}.w-md-0{width:0!important}.w-md-25{width:25%!important}.w-md-33{width:33%!important}.w-md-50{width:50%!important}.w-md-66{width:66%!important}.w-md-75{width:75%!important}.w-md-100{width:100%!important}}@media (min-width: 1280px){.d-lg-none{display:none!important}.d-lg-inline{display:inline!important}.d-lg-inline-block{display:inline-block!important}.d-lg-block{display:block!important}.d-lg-table{display:table!important}.d-lg-table-row{display:table-row!important}.d-lg-table-cell{display:table-cell!important}.d-lg-flex{display:flex!important}.d-lg-inline-flex{display:inline-flex!important}.float-lg-none{float:none!important}.float-lg-left{float:left!important}.float-lg-right{float:right!important}.v-locale--is-rtl .float-lg-end{float:left!important}.v-locale--is-rtl .float-lg-start,.v-locale--is-ltr .float-lg-end{float:right!important}.v-locale--is-ltr .float-lg-start{float:left!important}.flex-lg-fill,.flex-lg-1-1{flex:1 1 auto!important}.flex-lg-1-0{flex:1 0 auto!important}.flex-lg-0-1{flex:0 1 auto!important}.flex-lg-0-0{flex:0 0 auto!important}.flex-lg-1-1-100{flex:1 1 100%!important}.flex-lg-1-0-100{flex:1 0 100%!important}.flex-lg-0-1-100{flex:0 1 100%!important}.flex-lg-0-0-100{flex:0 0 100%!important}.flex-lg-1-1-0{flex:1 1 0!important}.flex-lg-1-0-0{flex:1 0 0!important}.flex-lg-0-1-0{flex:0 1 0!important}.flex-lg-0-0-0{flex:0 0 0!important}.flex-lg-row{flex-direction:row!important}.flex-lg-column{flex-direction:column!important}.flex-lg-row-reverse{flex-direction:row-reverse!important}.flex-lg-column-reverse{flex-direction:column-reverse!important}.flex-lg-grow-0{flex-grow:0!important}.flex-lg-grow-1{flex-grow:1!important}.flex-lg-shrink-0{flex-shrink:0!important}.flex-lg-shrink-1{flex-shrink:1!important}.flex-lg-wrap{flex-wrap:wrap!important}.flex-lg-nowrap{flex-wrap:nowrap!important}.flex-lg-wrap-reverse{flex-wrap:wrap-reverse!important}.justify-lg-start{justify-content:flex-start!important}.justify-lg-end{justify-content:flex-end!important}.justify-lg-center{justify-content:center!important}.justify-lg-space-between{justify-content:space-between!important}.justify-lg-space-around{justify-content:space-around!important}.justify-lg-space-evenly{justify-content:space-evenly!important}.justify-items-lg-start{justify-items:flex-start!important}.justify-items-lg-end{justify-items:flex-end!important}.justify-items-lg-center{justify-items:center!important}.justify-items-lg-stretch{justify-items:stretch!important}.align-lg-start{align-items:flex-start!important}.align-lg-end{align-items:flex-end!important}.align-lg-center{align-items:center!important}.align-lg-baseline{align-items:baseline!important}.align-lg-stretch{align-items:stretch!important}.align-content-lg-start{align-content:flex-start!important}.align-content-lg-end{align-content:flex-end!important}.align-content-lg-center{align-content:center!important}.align-content-lg-space-between{align-content:space-between!important}.align-content-lg-space-around{align-content:space-around!important}.align-content-lg-space-evenly{align-content:space-evenly!important}.align-content-lg-stretch{align-content:stretch!important}.align-self-lg-auto{align-self:auto!important}.align-self-lg-start{align-self:flex-start!important}.align-self-lg-end{align-self:flex-end!important}.align-self-lg-center{align-self:center!important}.align-self-lg-baseline{align-self:baseline!important}.align-self-lg-stretch{align-self:stretch!important}.order-lg-first{order:-1!important}.order-lg-0{order:0!important}.order-lg-1{order:1!important}.order-lg-2{order:2!important}.order-lg-3{order:3!important}.order-lg-4{order:4!important}.order-lg-5{order:5!important}.order-lg-6{order:6!important}.order-lg-7{order:7!important}.order-lg-8{order:8!important}.order-lg-9{order:9!important}.order-lg-10{order:10!important}.order-lg-11{order:11!important}.order-lg-12{order:12!important}.order-lg-last{order:13!important}.ga-lg-0{gap:0px!important}.ga-lg-1{gap:4px!important}.ga-lg-2{gap:8px!important}.ga-lg-3{gap:12px!important}.ga-lg-4{gap:16px!important}.ga-lg-5{gap:20px!important}.ga-lg-6{gap:24px!important}.ga-lg-7{gap:28px!important}.ga-lg-8{gap:32px!important}.ga-lg-9{gap:36px!important}.ga-lg-10{gap:40px!important}.ga-lg-11{gap:44px!important}.ga-lg-12{gap:48px!important}.ga-lg-13{gap:52px!important}.ga-lg-14{gap:56px!important}.ga-lg-15{gap:60px!important}.ga-lg-16{gap:64px!important}.ga-lg-auto{gap:auto!important}.gr-lg-0{row-gap:0px!important}.gr-lg-1{row-gap:4px!important}.gr-lg-2{row-gap:8px!important}.gr-lg-3{row-gap:12px!important}.gr-lg-4{row-gap:16px!important}.gr-lg-5{row-gap:20px!important}.gr-lg-6{row-gap:24px!important}.gr-lg-7{row-gap:28px!important}.gr-lg-8{row-gap:32px!important}.gr-lg-9{row-gap:36px!important}.gr-lg-10{row-gap:40px!important}.gr-lg-11{row-gap:44px!important}.gr-lg-12{row-gap:48px!important}.gr-lg-13{row-gap:52px!important}.gr-lg-14{row-gap:56px!important}.gr-lg-15{row-gap:60px!important}.gr-lg-16{row-gap:64px!important}.gr-lg-auto{row-gap:auto!important}.gc-lg-0{column-gap:0px!important}.gc-lg-1{column-gap:4px!important}.gc-lg-2{column-gap:8px!important}.gc-lg-3{column-gap:12px!important}.gc-lg-4{column-gap:16px!important}.gc-lg-5{column-gap:20px!important}.gc-lg-6{column-gap:24px!important}.gc-lg-7{column-gap:28px!important}.gc-lg-8{column-gap:32px!important}.gc-lg-9{column-gap:36px!important}.gc-lg-10{column-gap:40px!important}.gc-lg-11{column-gap:44px!important}.gc-lg-12{column-gap:48px!important}.gc-lg-13{column-gap:52px!important}.gc-lg-14{column-gap:56px!important}.gc-lg-15{column-gap:60px!important}.gc-lg-16{column-gap:64px!important}.gc-lg-auto{column-gap:auto!important}.ma-lg-0{margin:0!important}.ma-lg-1{margin:4px!important}.ma-lg-2{margin:8px!important}.ma-lg-3{margin:12px!important}.ma-lg-4{margin:16px!important}.ma-lg-5{margin:20px!important}.ma-lg-6{margin:24px!important}.ma-lg-7{margin:28px!important}.ma-lg-8{margin:32px!important}.ma-lg-9{margin:36px!important}.ma-lg-10{margin:40px!important}.ma-lg-11{margin:44px!important}.ma-lg-12{margin:48px!important}.ma-lg-13{margin:52px!important}.ma-lg-14{margin:56px!important}.ma-lg-15{margin:60px!important}.ma-lg-16{margin:64px!important}.ma-lg-auto{margin:auto!important}.mx-lg-0{margin-right:0!important;margin-left:0!important}.mx-lg-1{margin-right:4px!important;margin-left:4px!important}.mx-lg-2{margin-right:8px!important;margin-left:8px!important}.mx-lg-3{margin-right:12px!important;margin-left:12px!important}.mx-lg-4{margin-right:16px!important;margin-left:16px!important}.mx-lg-5{margin-right:20px!important;margin-left:20px!important}.mx-lg-6{margin-right:24px!important;margin-left:24px!important}.mx-lg-7{margin-right:28px!important;margin-left:28px!important}.mx-lg-8{margin-right:32px!important;margin-left:32px!important}.mx-lg-9{margin-right:36px!important;margin-left:36px!important}.mx-lg-10{margin-right:40px!important;margin-left:40px!important}.mx-lg-11{margin-right:44px!important;margin-left:44px!important}.mx-lg-12{margin-right:48px!important;margin-left:48px!important}.mx-lg-13{margin-right:52px!important;margin-left:52px!important}.mx-lg-14{margin-right:56px!important;margin-left:56px!important}.mx-lg-15{margin-right:60px!important;margin-left:60px!important}.mx-lg-16{margin-right:64px!important;margin-left:64px!important}.mx-lg-auto{margin-right:auto!important;margin-left:auto!important}.my-lg-0{margin-top:0!important;margin-bottom:0!important}.my-lg-1{margin-top:4px!important;margin-bottom:4px!important}.my-lg-2{margin-top:8px!important;margin-bottom:8px!important}.my-lg-3{margin-top:12px!important;margin-bottom:12px!important}.my-lg-4{margin-top:16px!important;margin-bottom:16px!important}.my-lg-5{margin-top:20px!important;margin-bottom:20px!important}.my-lg-6{margin-top:24px!important;margin-bottom:24px!important}.my-lg-7{margin-top:28px!important;margin-bottom:28px!important}.my-lg-8{margin-top:32px!important;margin-bottom:32px!important}.my-lg-9{margin-top:36px!important;margin-bottom:36px!important}.my-lg-10{margin-top:40px!important;margin-bottom:40px!important}.my-lg-11{margin-top:44px!important;margin-bottom:44px!important}.my-lg-12{margin-top:48px!important;margin-bottom:48px!important}.my-lg-13{margin-top:52px!important;margin-bottom:52px!important}.my-lg-14{margin-top:56px!important;margin-bottom:56px!important}.my-lg-15{margin-top:60px!important;margin-bottom:60px!important}.my-lg-16{margin-top:64px!important;margin-bottom:64px!important}.my-lg-auto{margin-top:auto!important;margin-bottom:auto!important}.mt-lg-0{margin-top:0!important}.mt-lg-1{margin-top:4px!important}.mt-lg-2{margin-top:8px!important}.mt-lg-3{margin-top:12px!important}.mt-lg-4{margin-top:16px!important}.mt-lg-5{margin-top:20px!important}.mt-lg-6{margin-top:24px!important}.mt-lg-7{margin-top:28px!important}.mt-lg-8{margin-top:32px!important}.mt-lg-9{margin-top:36px!important}.mt-lg-10{margin-top:40px!important}.mt-lg-11{margin-top:44px!important}.mt-lg-12{margin-top:48px!important}.mt-lg-13{margin-top:52px!important}.mt-lg-14{margin-top:56px!important}.mt-lg-15{margin-top:60px!important}.mt-lg-16{margin-top:64px!important}.mt-lg-auto{margin-top:auto!important}.mr-lg-0{margin-right:0!important}.mr-lg-1{margin-right:4px!important}.mr-lg-2{margin-right:8px!important}.mr-lg-3{margin-right:12px!important}.mr-lg-4{margin-right:16px!important}.mr-lg-5{margin-right:20px!important}.mr-lg-6{margin-right:24px!important}.mr-lg-7{margin-right:28px!important}.mr-lg-8{margin-right:32px!important}.mr-lg-9{margin-right:36px!important}.mr-lg-10{margin-right:40px!important}.mr-lg-11{margin-right:44px!important}.mr-lg-12{margin-right:48px!important}.mr-lg-13{margin-right:52px!important}.mr-lg-14{margin-right:56px!important}.mr-lg-15{margin-right:60px!important}.mr-lg-16{margin-right:64px!important}.mr-lg-auto{margin-right:auto!important}.mb-lg-0{margin-bottom:0!important}.mb-lg-1{margin-bottom:4px!important}.mb-lg-2{margin-bottom:8px!important}.mb-lg-3{margin-bottom:12px!important}.mb-lg-4{margin-bottom:16px!important}.mb-lg-5{margin-bottom:20px!important}.mb-lg-6{margin-bottom:24px!important}.mb-lg-7{margin-bottom:28px!important}.mb-lg-8{margin-bottom:32px!important}.mb-lg-9{margin-bottom:36px!important}.mb-lg-10{margin-bottom:40px!important}.mb-lg-11{margin-bottom:44px!important}.mb-lg-12{margin-bottom:48px!important}.mb-lg-13{margin-bottom:52px!important}.mb-lg-14{margin-bottom:56px!important}.mb-lg-15{margin-bottom:60px!important}.mb-lg-16{margin-bottom:64px!important}.mb-lg-auto{margin-bottom:auto!important}.ml-lg-0{margin-left:0!important}.ml-lg-1{margin-left:4px!important}.ml-lg-2{margin-left:8px!important}.ml-lg-3{margin-left:12px!important}.ml-lg-4{margin-left:16px!important}.ml-lg-5{margin-left:20px!important}.ml-lg-6{margin-left:24px!important}.ml-lg-7{margin-left:28px!important}.ml-lg-8{margin-left:32px!important}.ml-lg-9{margin-left:36px!important}.ml-lg-10{margin-left:40px!important}.ml-lg-11{margin-left:44px!important}.ml-lg-12{margin-left:48px!important}.ml-lg-13{margin-left:52px!important}.ml-lg-14{margin-left:56px!important}.ml-lg-15{margin-left:60px!important}.ml-lg-16{margin-left:64px!important}.ml-lg-auto{margin-left:auto!important}.ms-lg-0{margin-inline-start:0px!important}.ms-lg-1{margin-inline-start:4px!important}.ms-lg-2{margin-inline-start:8px!important}.ms-lg-3{margin-inline-start:12px!important}.ms-lg-4{margin-inline-start:16px!important}.ms-lg-5{margin-inline-start:20px!important}.ms-lg-6{margin-inline-start:24px!important}.ms-lg-7{margin-inline-start:28px!important}.ms-lg-8{margin-inline-start:32px!important}.ms-lg-9{margin-inline-start:36px!important}.ms-lg-10{margin-inline-start:40px!important}.ms-lg-11{margin-inline-start:44px!important}.ms-lg-12{margin-inline-start:48px!important}.ms-lg-13{margin-inline-start:52px!important}.ms-lg-14{margin-inline-start:56px!important}.ms-lg-15{margin-inline-start:60px!important}.ms-lg-16{margin-inline-start:64px!important}.ms-lg-auto{margin-inline-start:auto!important}.me-lg-0{margin-inline-end:0px!important}.me-lg-1{margin-inline-end:4px!important}.me-lg-2{margin-inline-end:8px!important}.me-lg-3{margin-inline-end:12px!important}.me-lg-4{margin-inline-end:16px!important}.me-lg-5{margin-inline-end:20px!important}.me-lg-6{margin-inline-end:24px!important}.me-lg-7{margin-inline-end:28px!important}.me-lg-8{margin-inline-end:32px!important}.me-lg-9{margin-inline-end:36px!important}.me-lg-10{margin-inline-end:40px!important}.me-lg-11{margin-inline-end:44px!important}.me-lg-12{margin-inline-end:48px!important}.me-lg-13{margin-inline-end:52px!important}.me-lg-14{margin-inline-end:56px!important}.me-lg-15{margin-inline-end:60px!important}.me-lg-16{margin-inline-end:64px!important}.me-lg-auto{margin-inline-end:auto!important}.ma-lg-n1{margin:-4px!important}.ma-lg-n2{margin:-8px!important}.ma-lg-n3{margin:-12px!important}.ma-lg-n4{margin:-16px!important}.ma-lg-n5{margin:-20px!important}.ma-lg-n6{margin:-24px!important}.ma-lg-n7{margin:-28px!important}.ma-lg-n8{margin:-32px!important}.ma-lg-n9{margin:-36px!important}.ma-lg-n10{margin:-40px!important}.ma-lg-n11{margin:-44px!important}.ma-lg-n12{margin:-48px!important}.ma-lg-n13{margin:-52px!important}.ma-lg-n14{margin:-56px!important}.ma-lg-n15{margin:-60px!important}.ma-lg-n16{margin:-64px!important}.mx-lg-n1{margin-right:-4px!important;margin-left:-4px!important}.mx-lg-n2{margin-right:-8px!important;margin-left:-8px!important}.mx-lg-n3{margin-right:-12px!important;margin-left:-12px!important}.mx-lg-n4{margin-right:-16px!important;margin-left:-16px!important}.mx-lg-n5{margin-right:-20px!important;margin-left:-20px!important}.mx-lg-n6{margin-right:-24px!important;margin-left:-24px!important}.mx-lg-n7{margin-right:-28px!important;margin-left:-28px!important}.mx-lg-n8{margin-right:-32px!important;margin-left:-32px!important}.mx-lg-n9{margin-right:-36px!important;margin-left:-36px!important}.mx-lg-n10{margin-right:-40px!important;margin-left:-40px!important}.mx-lg-n11{margin-right:-44px!important;margin-left:-44px!important}.mx-lg-n12{margin-right:-48px!important;margin-left:-48px!important}.mx-lg-n13{margin-right:-52px!important;margin-left:-52px!important}.mx-lg-n14{margin-right:-56px!important;margin-left:-56px!important}.mx-lg-n15{margin-right:-60px!important;margin-left:-60px!important}.mx-lg-n16{margin-right:-64px!important;margin-left:-64px!important}.my-lg-n1{margin-top:-4px!important;margin-bottom:-4px!important}.my-lg-n2{margin-top:-8px!important;margin-bottom:-8px!important}.my-lg-n3{margin-top:-12px!important;margin-bottom:-12px!important}.my-lg-n4{margin-top:-16px!important;margin-bottom:-16px!important}.my-lg-n5{margin-top:-20px!important;margin-bottom:-20px!important}.my-lg-n6{margin-top:-24px!important;margin-bottom:-24px!important}.my-lg-n7{margin-top:-28px!important;margin-bottom:-28px!important}.my-lg-n8{margin-top:-32px!important;margin-bottom:-32px!important}.my-lg-n9{margin-top:-36px!important;margin-bottom:-36px!important}.my-lg-n10{margin-top:-40px!important;margin-bottom:-40px!important}.my-lg-n11{margin-top:-44px!important;margin-bottom:-44px!important}.my-lg-n12{margin-top:-48px!important;margin-bottom:-48px!important}.my-lg-n13{margin-top:-52px!important;margin-bottom:-52px!important}.my-lg-n14{margin-top:-56px!important;margin-bottom:-56px!important}.my-lg-n15{margin-top:-60px!important;margin-bottom:-60px!important}.my-lg-n16{margin-top:-64px!important;margin-bottom:-64px!important}.mt-lg-n1{margin-top:-4px!important}.mt-lg-n2{margin-top:-8px!important}.mt-lg-n3{margin-top:-12px!important}.mt-lg-n4{margin-top:-16px!important}.mt-lg-n5{margin-top:-20px!important}.mt-lg-n6{margin-top:-24px!important}.mt-lg-n7{margin-top:-28px!important}.mt-lg-n8{margin-top:-32px!important}.mt-lg-n9{margin-top:-36px!important}.mt-lg-n10{margin-top:-40px!important}.mt-lg-n11{margin-top:-44px!important}.mt-lg-n12{margin-top:-48px!important}.mt-lg-n13{margin-top:-52px!important}.mt-lg-n14{margin-top:-56px!important}.mt-lg-n15{margin-top:-60px!important}.mt-lg-n16{margin-top:-64px!important}.mr-lg-n1{margin-right:-4px!important}.mr-lg-n2{margin-right:-8px!important}.mr-lg-n3{margin-right:-12px!important}.mr-lg-n4{margin-right:-16px!important}.mr-lg-n5{margin-right:-20px!important}.mr-lg-n6{margin-right:-24px!important}.mr-lg-n7{margin-right:-28px!important}.mr-lg-n8{margin-right:-32px!important}.mr-lg-n9{margin-right:-36px!important}.mr-lg-n10{margin-right:-40px!important}.mr-lg-n11{margin-right:-44px!important}.mr-lg-n12{margin-right:-48px!important}.mr-lg-n13{margin-right:-52px!important}.mr-lg-n14{margin-right:-56px!important}.mr-lg-n15{margin-right:-60px!important}.mr-lg-n16{margin-right:-64px!important}.mb-lg-n1{margin-bottom:-4px!important}.mb-lg-n2{margin-bottom:-8px!important}.mb-lg-n3{margin-bottom:-12px!important}.mb-lg-n4{margin-bottom:-16px!important}.mb-lg-n5{margin-bottom:-20px!important}.mb-lg-n6{margin-bottom:-24px!important}.mb-lg-n7{margin-bottom:-28px!important}.mb-lg-n8{margin-bottom:-32px!important}.mb-lg-n9{margin-bottom:-36px!important}.mb-lg-n10{margin-bottom:-40px!important}.mb-lg-n11{margin-bottom:-44px!important}.mb-lg-n12{margin-bottom:-48px!important}.mb-lg-n13{margin-bottom:-52px!important}.mb-lg-n14{margin-bottom:-56px!important}.mb-lg-n15{margin-bottom:-60px!important}.mb-lg-n16{margin-bottom:-64px!important}.ml-lg-n1{margin-left:-4px!important}.ml-lg-n2{margin-left:-8px!important}.ml-lg-n3{margin-left:-12px!important}.ml-lg-n4{margin-left:-16px!important}.ml-lg-n5{margin-left:-20px!important}.ml-lg-n6{margin-left:-24px!important}.ml-lg-n7{margin-left:-28px!important}.ml-lg-n8{margin-left:-32px!important}.ml-lg-n9{margin-left:-36px!important}.ml-lg-n10{margin-left:-40px!important}.ml-lg-n11{margin-left:-44px!important}.ml-lg-n12{margin-left:-48px!important}.ml-lg-n13{margin-left:-52px!important}.ml-lg-n14{margin-left:-56px!important}.ml-lg-n15{margin-left:-60px!important}.ml-lg-n16{margin-left:-64px!important}.ms-lg-n1{margin-inline-start:-4px!important}.ms-lg-n2{margin-inline-start:-8px!important}.ms-lg-n3{margin-inline-start:-12px!important}.ms-lg-n4{margin-inline-start:-16px!important}.ms-lg-n5{margin-inline-start:-20px!important}.ms-lg-n6{margin-inline-start:-24px!important}.ms-lg-n7{margin-inline-start:-28px!important}.ms-lg-n8{margin-inline-start:-32px!important}.ms-lg-n9{margin-inline-start:-36px!important}.ms-lg-n10{margin-inline-start:-40px!important}.ms-lg-n11{margin-inline-start:-44px!important}.ms-lg-n12{margin-inline-start:-48px!important}.ms-lg-n13{margin-inline-start:-52px!important}.ms-lg-n14{margin-inline-start:-56px!important}.ms-lg-n15{margin-inline-start:-60px!important}.ms-lg-n16{margin-inline-start:-64px!important}.me-lg-n1{margin-inline-end:-4px!important}.me-lg-n2{margin-inline-end:-8px!important}.me-lg-n3{margin-inline-end:-12px!important}.me-lg-n4{margin-inline-end:-16px!important}.me-lg-n5{margin-inline-end:-20px!important}.me-lg-n6{margin-inline-end:-24px!important}.me-lg-n7{margin-inline-end:-28px!important}.me-lg-n8{margin-inline-end:-32px!important}.me-lg-n9{margin-inline-end:-36px!important}.me-lg-n10{margin-inline-end:-40px!important}.me-lg-n11{margin-inline-end:-44px!important}.me-lg-n12{margin-inline-end:-48px!important}.me-lg-n13{margin-inline-end:-52px!important}.me-lg-n14{margin-inline-end:-56px!important}.me-lg-n15{margin-inline-end:-60px!important}.me-lg-n16{margin-inline-end:-64px!important}.pa-lg-0{padding:0!important}.pa-lg-1{padding:4px!important}.pa-lg-2{padding:8px!important}.pa-lg-3{padding:12px!important}.pa-lg-4{padding:16px!important}.pa-lg-5{padding:20px!important}.pa-lg-6{padding:24px!important}.pa-lg-7{padding:28px!important}.pa-lg-8{padding:32px!important}.pa-lg-9{padding:36px!important}.pa-lg-10{padding:40px!important}.pa-lg-11{padding:44px!important}.pa-lg-12{padding:48px!important}.pa-lg-13{padding:52px!important}.pa-lg-14{padding:56px!important}.pa-lg-15{padding:60px!important}.pa-lg-16{padding:64px!important}.px-lg-0{padding-right:0!important;padding-left:0!important}.px-lg-1{padding-right:4px!important;padding-left:4px!important}.px-lg-2{padding-right:8px!important;padding-left:8px!important}.px-lg-3{padding-right:12px!important;padding-left:12px!important}.px-lg-4{padding-right:16px!important;padding-left:16px!important}.px-lg-5{padding-right:20px!important;padding-left:20px!important}.px-lg-6{padding-right:24px!important;padding-left:24px!important}.px-lg-7{padding-right:28px!important;padding-left:28px!important}.px-lg-8{padding-right:32px!important;padding-left:32px!important}.px-lg-9{padding-right:36px!important;padding-left:36px!important}.px-lg-10{padding-right:40px!important;padding-left:40px!important}.px-lg-11{padding-right:44px!important;padding-left:44px!important}.px-lg-12{padding-right:48px!important;padding-left:48px!important}.px-lg-13{padding-right:52px!important;padding-left:52px!important}.px-lg-14{padding-right:56px!important;padding-left:56px!important}.px-lg-15{padding-right:60px!important;padding-left:60px!important}.px-lg-16{padding-right:64px!important;padding-left:64px!important}.py-lg-0{padding-top:0!important;padding-bottom:0!important}.py-lg-1{padding-top:4px!important;padding-bottom:4px!important}.py-lg-2{padding-top:8px!important;padding-bottom:8px!important}.py-lg-3{padding-top:12px!important;padding-bottom:12px!important}.py-lg-4{padding-top:16px!important;padding-bottom:16px!important}.py-lg-5{padding-top:20px!important;padding-bottom:20px!important}.py-lg-6{padding-top:24px!important;padding-bottom:24px!important}.py-lg-7{padding-top:28px!important;padding-bottom:28px!important}.py-lg-8{padding-top:32px!important;padding-bottom:32px!important}.py-lg-9{padding-top:36px!important;padding-bottom:36px!important}.py-lg-10{padding-top:40px!important;padding-bottom:40px!important}.py-lg-11{padding-top:44px!important;padding-bottom:44px!important}.py-lg-12{padding-top:48px!important;padding-bottom:48px!important}.py-lg-13{padding-top:52px!important;padding-bottom:52px!important}.py-lg-14{padding-top:56px!important;padding-bottom:56px!important}.py-lg-15{padding-top:60px!important;padding-bottom:60px!important}.py-lg-16{padding-top:64px!important;padding-bottom:64px!important}.pt-lg-0{padding-top:0!important}.pt-lg-1{padding-top:4px!important}.pt-lg-2{padding-top:8px!important}.pt-lg-3{padding-top:12px!important}.pt-lg-4{padding-top:16px!important}.pt-lg-5{padding-top:20px!important}.pt-lg-6{padding-top:24px!important}.pt-lg-7{padding-top:28px!important}.pt-lg-8{padding-top:32px!important}.pt-lg-9{padding-top:36px!important}.pt-lg-10{padding-top:40px!important}.pt-lg-11{padding-top:44px!important}.pt-lg-12{padding-top:48px!important}.pt-lg-13{padding-top:52px!important}.pt-lg-14{padding-top:56px!important}.pt-lg-15{padding-top:60px!important}.pt-lg-16{padding-top:64px!important}.pr-lg-0{padding-right:0!important}.pr-lg-1{padding-right:4px!important}.pr-lg-2{padding-right:8px!important}.pr-lg-3{padding-right:12px!important}.pr-lg-4{padding-right:16px!important}.pr-lg-5{padding-right:20px!important}.pr-lg-6{padding-right:24px!important}.pr-lg-7{padding-right:28px!important}.pr-lg-8{padding-right:32px!important}.pr-lg-9{padding-right:36px!important}.pr-lg-10{padding-right:40px!important}.pr-lg-11{padding-right:44px!important}.pr-lg-12{padding-right:48px!important}.pr-lg-13{padding-right:52px!important}.pr-lg-14{padding-right:56px!important}.pr-lg-15{padding-right:60px!important}.pr-lg-16{padding-right:64px!important}.pb-lg-0{padding-bottom:0!important}.pb-lg-1{padding-bottom:4px!important}.pb-lg-2{padding-bottom:8px!important}.pb-lg-3{padding-bottom:12px!important}.pb-lg-4{padding-bottom:16px!important}.pb-lg-5{padding-bottom:20px!important}.pb-lg-6{padding-bottom:24px!important}.pb-lg-7{padding-bottom:28px!important}.pb-lg-8{padding-bottom:32px!important}.pb-lg-9{padding-bottom:36px!important}.pb-lg-10{padding-bottom:40px!important}.pb-lg-11{padding-bottom:44px!important}.pb-lg-12{padding-bottom:48px!important}.pb-lg-13{padding-bottom:52px!important}.pb-lg-14{padding-bottom:56px!important}.pb-lg-15{padding-bottom:60px!important}.pb-lg-16{padding-bottom:64px!important}.pl-lg-0{padding-left:0!important}.pl-lg-1{padding-left:4px!important}.pl-lg-2{padding-left:8px!important}.pl-lg-3{padding-left:12px!important}.pl-lg-4{padding-left:16px!important}.pl-lg-5{padding-left:20px!important}.pl-lg-6{padding-left:24px!important}.pl-lg-7{padding-left:28px!important}.pl-lg-8{padding-left:32px!important}.pl-lg-9{padding-left:36px!important}.pl-lg-10{padding-left:40px!important}.pl-lg-11{padding-left:44px!important}.pl-lg-12{padding-left:48px!important}.pl-lg-13{padding-left:52px!important}.pl-lg-14{padding-left:56px!important}.pl-lg-15{padding-left:60px!important}.pl-lg-16{padding-left:64px!important}.ps-lg-0{padding-inline-start:0px!important}.ps-lg-1{padding-inline-start:4px!important}.ps-lg-2{padding-inline-start:8px!important}.ps-lg-3{padding-inline-start:12px!important}.ps-lg-4{padding-inline-start:16px!important}.ps-lg-5{padding-inline-start:20px!important}.ps-lg-6{padding-inline-start:24px!important}.ps-lg-7{padding-inline-start:28px!important}.ps-lg-8{padding-inline-start:32px!important}.ps-lg-9{padding-inline-start:36px!important}.ps-lg-10{padding-inline-start:40px!important}.ps-lg-11{padding-inline-start:44px!important}.ps-lg-12{padding-inline-start:48px!important}.ps-lg-13{padding-inline-start:52px!important}.ps-lg-14{padding-inline-start:56px!important}.ps-lg-15{padding-inline-start:60px!important}.ps-lg-16{padding-inline-start:64px!important}.pe-lg-0{padding-inline-end:0px!important}.pe-lg-1{padding-inline-end:4px!important}.pe-lg-2{padding-inline-end:8px!important}.pe-lg-3{padding-inline-end:12px!important}.pe-lg-4{padding-inline-end:16px!important}.pe-lg-5{padding-inline-end:20px!important}.pe-lg-6{padding-inline-end:24px!important}.pe-lg-7{padding-inline-end:28px!important}.pe-lg-8{padding-inline-end:32px!important}.pe-lg-9{padding-inline-end:36px!important}.pe-lg-10{padding-inline-end:40px!important}.pe-lg-11{padding-inline-end:44px!important}.pe-lg-12{padding-inline-end:48px!important}.pe-lg-13{padding-inline-end:52px!important}.pe-lg-14{padding-inline-end:56px!important}.pe-lg-15{padding-inline-end:60px!important}.pe-lg-16{padding-inline-end:64px!important}.text-lg-left{text-align:left!important}.text-lg-right{text-align:right!important}.text-lg-center{text-align:center!important}.text-lg-justify{text-align:justify!important}.text-lg-start{text-align:start!important}.text-lg-end{text-align:end!important}.text-lg-h1{font-size:6rem!important;font-weight:300;line-height:1;letter-spacing:-.015625em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-h2{font-size:3.75rem!important;font-weight:300;line-height:1;letter-spacing:-.0083333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-h3{font-size:3rem!important;font-weight:400;line-height:1.05;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-h4{font-size:2.125rem!important;font-weight:400;line-height:1.175;letter-spacing:.0073529412em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-h5{font-size:1.5rem!important;font-weight:400;line-height:1.333;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-h6{font-size:1.25rem!important;font-weight:500;line-height:1.6;letter-spacing:.0125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-subtitle-1{font-size:1rem!important;font-weight:400;line-height:1.75;letter-spacing:.009375em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-subtitle-2{font-size:.875rem!important;font-weight:500;line-height:1.6;letter-spacing:.0071428571em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-body-1{font-size:1rem!important;font-weight:400;line-height:1.5;letter-spacing:.03125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-body-2{font-size:.875rem!important;font-weight:400;line-height:1.425;letter-spacing:.0178571429em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-button{font-size:.875rem!important;font-weight:500;line-height:2.6;letter-spacing:.0892857143em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.text-lg-caption{font-size:.75rem!important;font-weight:400;line-height:1.667;letter-spacing:.0333333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-lg-overline{font-size:.75rem!important;font-weight:500;line-height:2.667;letter-spacing:.1666666667em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.h-lg-auto{height:auto!important}.h-lg-screen{height:100vh!important}.h-lg-0{height:0!important}.h-lg-25{height:25%!important}.h-lg-50{height:50%!important}.h-lg-75{height:75%!important}.h-lg-100{height:100%!important}.w-lg-auto{width:auto!important}.w-lg-0{width:0!important}.w-lg-25{width:25%!important}.w-lg-33{width:33%!important}.w-lg-50{width:50%!important}.w-lg-66{width:66%!important}.w-lg-75{width:75%!important}.w-lg-100{width:100%!important}}@media (min-width: 1920px){.d-xl-none{display:none!important}.d-xl-inline{display:inline!important}.d-xl-inline-block{display:inline-block!important}.d-xl-block{display:block!important}.d-xl-table{display:table!important}.d-xl-table-row{display:table-row!important}.d-xl-table-cell{display:table-cell!important}.d-xl-flex{display:flex!important}.d-xl-inline-flex{display:inline-flex!important}.float-xl-none{float:none!important}.float-xl-left{float:left!important}.float-xl-right{float:right!important}.v-locale--is-rtl .float-xl-end{float:left!important}.v-locale--is-rtl .float-xl-start,.v-locale--is-ltr .float-xl-end{float:right!important}.v-locale--is-ltr .float-xl-start{float:left!important}.flex-xl-fill,.flex-xl-1-1{flex:1 1 auto!important}.flex-xl-1-0{flex:1 0 auto!important}.flex-xl-0-1{flex:0 1 auto!important}.flex-xl-0-0{flex:0 0 auto!important}.flex-xl-1-1-100{flex:1 1 100%!important}.flex-xl-1-0-100{flex:1 0 100%!important}.flex-xl-0-1-100{flex:0 1 100%!important}.flex-xl-0-0-100{flex:0 0 100%!important}.flex-xl-1-1-0{flex:1 1 0!important}.flex-xl-1-0-0{flex:1 0 0!important}.flex-xl-0-1-0{flex:0 1 0!important}.flex-xl-0-0-0{flex:0 0 0!important}.flex-xl-row{flex-direction:row!important}.flex-xl-column{flex-direction:column!important}.flex-xl-row-reverse{flex-direction:row-reverse!important}.flex-xl-column-reverse{flex-direction:column-reverse!important}.flex-xl-grow-0{flex-grow:0!important}.flex-xl-grow-1{flex-grow:1!important}.flex-xl-shrink-0{flex-shrink:0!important}.flex-xl-shrink-1{flex-shrink:1!important}.flex-xl-wrap{flex-wrap:wrap!important}.flex-xl-nowrap{flex-wrap:nowrap!important}.flex-xl-wrap-reverse{flex-wrap:wrap-reverse!important}.justify-xl-start{justify-content:flex-start!important}.justify-xl-end{justify-content:flex-end!important}.justify-xl-center{justify-content:center!important}.justify-xl-space-between{justify-content:space-between!important}.justify-xl-space-around{justify-content:space-around!important}.justify-xl-space-evenly{justify-content:space-evenly!important}.justify-items-xl-start{justify-items:flex-start!important}.justify-items-xl-end{justify-items:flex-end!important}.justify-items-xl-center{justify-items:center!important}.justify-items-xl-stretch{justify-items:stretch!important}.align-xl-start{align-items:flex-start!important}.align-xl-end{align-items:flex-end!important}.align-xl-center{align-items:center!important}.align-xl-baseline{align-items:baseline!important}.align-xl-stretch{align-items:stretch!important}.align-content-xl-start{align-content:flex-start!important}.align-content-xl-end{align-content:flex-end!important}.align-content-xl-center{align-content:center!important}.align-content-xl-space-between{align-content:space-between!important}.align-content-xl-space-around{align-content:space-around!important}.align-content-xl-space-evenly{align-content:space-evenly!important}.align-content-xl-stretch{align-content:stretch!important}.align-self-xl-auto{align-self:auto!important}.align-self-xl-start{align-self:flex-start!important}.align-self-xl-end{align-self:flex-end!important}.align-self-xl-center{align-self:center!important}.align-self-xl-baseline{align-self:baseline!important}.align-self-xl-stretch{align-self:stretch!important}.order-xl-first{order:-1!important}.order-xl-0{order:0!important}.order-xl-1{order:1!important}.order-xl-2{order:2!important}.order-xl-3{order:3!important}.order-xl-4{order:4!important}.order-xl-5{order:5!important}.order-xl-6{order:6!important}.order-xl-7{order:7!important}.order-xl-8{order:8!important}.order-xl-9{order:9!important}.order-xl-10{order:10!important}.order-xl-11{order:11!important}.order-xl-12{order:12!important}.order-xl-last{order:13!important}.ga-xl-0{gap:0px!important}.ga-xl-1{gap:4px!important}.ga-xl-2{gap:8px!important}.ga-xl-3{gap:12px!important}.ga-xl-4{gap:16px!important}.ga-xl-5{gap:20px!important}.ga-xl-6{gap:24px!important}.ga-xl-7{gap:28px!important}.ga-xl-8{gap:32px!important}.ga-xl-9{gap:36px!important}.ga-xl-10{gap:40px!important}.ga-xl-11{gap:44px!important}.ga-xl-12{gap:48px!important}.ga-xl-13{gap:52px!important}.ga-xl-14{gap:56px!important}.ga-xl-15{gap:60px!important}.ga-xl-16{gap:64px!important}.ga-xl-auto{gap:auto!important}.gr-xl-0{row-gap:0px!important}.gr-xl-1{row-gap:4px!important}.gr-xl-2{row-gap:8px!important}.gr-xl-3{row-gap:12px!important}.gr-xl-4{row-gap:16px!important}.gr-xl-5{row-gap:20px!important}.gr-xl-6{row-gap:24px!important}.gr-xl-7{row-gap:28px!important}.gr-xl-8{row-gap:32px!important}.gr-xl-9{row-gap:36px!important}.gr-xl-10{row-gap:40px!important}.gr-xl-11{row-gap:44px!important}.gr-xl-12{row-gap:48px!important}.gr-xl-13{row-gap:52px!important}.gr-xl-14{row-gap:56px!important}.gr-xl-15{row-gap:60px!important}.gr-xl-16{row-gap:64px!important}.gr-xl-auto{row-gap:auto!important}.gc-xl-0{column-gap:0px!important}.gc-xl-1{column-gap:4px!important}.gc-xl-2{column-gap:8px!important}.gc-xl-3{column-gap:12px!important}.gc-xl-4{column-gap:16px!important}.gc-xl-5{column-gap:20px!important}.gc-xl-6{column-gap:24px!important}.gc-xl-7{column-gap:28px!important}.gc-xl-8{column-gap:32px!important}.gc-xl-9{column-gap:36px!important}.gc-xl-10{column-gap:40px!important}.gc-xl-11{column-gap:44px!important}.gc-xl-12{column-gap:48px!important}.gc-xl-13{column-gap:52px!important}.gc-xl-14{column-gap:56px!important}.gc-xl-15{column-gap:60px!important}.gc-xl-16{column-gap:64px!important}.gc-xl-auto{column-gap:auto!important}.ma-xl-0{margin:0!important}.ma-xl-1{margin:4px!important}.ma-xl-2{margin:8px!important}.ma-xl-3{margin:12px!important}.ma-xl-4{margin:16px!important}.ma-xl-5{margin:20px!important}.ma-xl-6{margin:24px!important}.ma-xl-7{margin:28px!important}.ma-xl-8{margin:32px!important}.ma-xl-9{margin:36px!important}.ma-xl-10{margin:40px!important}.ma-xl-11{margin:44px!important}.ma-xl-12{margin:48px!important}.ma-xl-13{margin:52px!important}.ma-xl-14{margin:56px!important}.ma-xl-15{margin:60px!important}.ma-xl-16{margin:64px!important}.ma-xl-auto{margin:auto!important}.mx-xl-0{margin-right:0!important;margin-left:0!important}.mx-xl-1{margin-right:4px!important;margin-left:4px!important}.mx-xl-2{margin-right:8px!important;margin-left:8px!important}.mx-xl-3{margin-right:12px!important;margin-left:12px!important}.mx-xl-4{margin-right:16px!important;margin-left:16px!important}.mx-xl-5{margin-right:20px!important;margin-left:20px!important}.mx-xl-6{margin-right:24px!important;margin-left:24px!important}.mx-xl-7{margin-right:28px!important;margin-left:28px!important}.mx-xl-8{margin-right:32px!important;margin-left:32px!important}.mx-xl-9{margin-right:36px!important;margin-left:36px!important}.mx-xl-10{margin-right:40px!important;margin-left:40px!important}.mx-xl-11{margin-right:44px!important;margin-left:44px!important}.mx-xl-12{margin-right:48px!important;margin-left:48px!important}.mx-xl-13{margin-right:52px!important;margin-left:52px!important}.mx-xl-14{margin-right:56px!important;margin-left:56px!important}.mx-xl-15{margin-right:60px!important;margin-left:60px!important}.mx-xl-16{margin-right:64px!important;margin-left:64px!important}.mx-xl-auto{margin-right:auto!important;margin-left:auto!important}.my-xl-0{margin-top:0!important;margin-bottom:0!important}.my-xl-1{margin-top:4px!important;margin-bottom:4px!important}.my-xl-2{margin-top:8px!important;margin-bottom:8px!important}.my-xl-3{margin-top:12px!important;margin-bottom:12px!important}.my-xl-4{margin-top:16px!important;margin-bottom:16px!important}.my-xl-5{margin-top:20px!important;margin-bottom:20px!important}.my-xl-6{margin-top:24px!important;margin-bottom:24px!important}.my-xl-7{margin-top:28px!important;margin-bottom:28px!important}.my-xl-8{margin-top:32px!important;margin-bottom:32px!important}.my-xl-9{margin-top:36px!important;margin-bottom:36px!important}.my-xl-10{margin-top:40px!important;margin-bottom:40px!important}.my-xl-11{margin-top:44px!important;margin-bottom:44px!important}.my-xl-12{margin-top:48px!important;margin-bottom:48px!important}.my-xl-13{margin-top:52px!important;margin-bottom:52px!important}.my-xl-14{margin-top:56px!important;margin-bottom:56px!important}.my-xl-15{margin-top:60px!important;margin-bottom:60px!important}.my-xl-16{margin-top:64px!important;margin-bottom:64px!important}.my-xl-auto{margin-top:auto!important;margin-bottom:auto!important}.mt-xl-0{margin-top:0!important}.mt-xl-1{margin-top:4px!important}.mt-xl-2{margin-top:8px!important}.mt-xl-3{margin-top:12px!important}.mt-xl-4{margin-top:16px!important}.mt-xl-5{margin-top:20px!important}.mt-xl-6{margin-top:24px!important}.mt-xl-7{margin-top:28px!important}.mt-xl-8{margin-top:32px!important}.mt-xl-9{margin-top:36px!important}.mt-xl-10{margin-top:40px!important}.mt-xl-11{margin-top:44px!important}.mt-xl-12{margin-top:48px!important}.mt-xl-13{margin-top:52px!important}.mt-xl-14{margin-top:56px!important}.mt-xl-15{margin-top:60px!important}.mt-xl-16{margin-top:64px!important}.mt-xl-auto{margin-top:auto!important}.mr-xl-0{margin-right:0!important}.mr-xl-1{margin-right:4px!important}.mr-xl-2{margin-right:8px!important}.mr-xl-3{margin-right:12px!important}.mr-xl-4{margin-right:16px!important}.mr-xl-5{margin-right:20px!important}.mr-xl-6{margin-right:24px!important}.mr-xl-7{margin-right:28px!important}.mr-xl-8{margin-right:32px!important}.mr-xl-9{margin-right:36px!important}.mr-xl-10{margin-right:40px!important}.mr-xl-11{margin-right:44px!important}.mr-xl-12{margin-right:48px!important}.mr-xl-13{margin-right:52px!important}.mr-xl-14{margin-right:56px!important}.mr-xl-15{margin-right:60px!important}.mr-xl-16{margin-right:64px!important}.mr-xl-auto{margin-right:auto!important}.mb-xl-0{margin-bottom:0!important}.mb-xl-1{margin-bottom:4px!important}.mb-xl-2{margin-bottom:8px!important}.mb-xl-3{margin-bottom:12px!important}.mb-xl-4{margin-bottom:16px!important}.mb-xl-5{margin-bottom:20px!important}.mb-xl-6{margin-bottom:24px!important}.mb-xl-7{margin-bottom:28px!important}.mb-xl-8{margin-bottom:32px!important}.mb-xl-9{margin-bottom:36px!important}.mb-xl-10{margin-bottom:40px!important}.mb-xl-11{margin-bottom:44px!important}.mb-xl-12{margin-bottom:48px!important}.mb-xl-13{margin-bottom:52px!important}.mb-xl-14{margin-bottom:56px!important}.mb-xl-15{margin-bottom:60px!important}.mb-xl-16{margin-bottom:64px!important}.mb-xl-auto{margin-bottom:auto!important}.ml-xl-0{margin-left:0!important}.ml-xl-1{margin-left:4px!important}.ml-xl-2{margin-left:8px!important}.ml-xl-3{margin-left:12px!important}.ml-xl-4{margin-left:16px!important}.ml-xl-5{margin-left:20px!important}.ml-xl-6{margin-left:24px!important}.ml-xl-7{margin-left:28px!important}.ml-xl-8{margin-left:32px!important}.ml-xl-9{margin-left:36px!important}.ml-xl-10{margin-left:40px!important}.ml-xl-11{margin-left:44px!important}.ml-xl-12{margin-left:48px!important}.ml-xl-13{margin-left:52px!important}.ml-xl-14{margin-left:56px!important}.ml-xl-15{margin-left:60px!important}.ml-xl-16{margin-left:64px!important}.ml-xl-auto{margin-left:auto!important}.ms-xl-0{margin-inline-start:0px!important}.ms-xl-1{margin-inline-start:4px!important}.ms-xl-2{margin-inline-start:8px!important}.ms-xl-3{margin-inline-start:12px!important}.ms-xl-4{margin-inline-start:16px!important}.ms-xl-5{margin-inline-start:20px!important}.ms-xl-6{margin-inline-start:24px!important}.ms-xl-7{margin-inline-start:28px!important}.ms-xl-8{margin-inline-start:32px!important}.ms-xl-9{margin-inline-start:36px!important}.ms-xl-10{margin-inline-start:40px!important}.ms-xl-11{margin-inline-start:44px!important}.ms-xl-12{margin-inline-start:48px!important}.ms-xl-13{margin-inline-start:52px!important}.ms-xl-14{margin-inline-start:56px!important}.ms-xl-15{margin-inline-start:60px!important}.ms-xl-16{margin-inline-start:64px!important}.ms-xl-auto{margin-inline-start:auto!important}.me-xl-0{margin-inline-end:0px!important}.me-xl-1{margin-inline-end:4px!important}.me-xl-2{margin-inline-end:8px!important}.me-xl-3{margin-inline-end:12px!important}.me-xl-4{margin-inline-end:16px!important}.me-xl-5{margin-inline-end:20px!important}.me-xl-6{margin-inline-end:24px!important}.me-xl-7{margin-inline-end:28px!important}.me-xl-8{margin-inline-end:32px!important}.me-xl-9{margin-inline-end:36px!important}.me-xl-10{margin-inline-end:40px!important}.me-xl-11{margin-inline-end:44px!important}.me-xl-12{margin-inline-end:48px!important}.me-xl-13{margin-inline-end:52px!important}.me-xl-14{margin-inline-end:56px!important}.me-xl-15{margin-inline-end:60px!important}.me-xl-16{margin-inline-end:64px!important}.me-xl-auto{margin-inline-end:auto!important}.ma-xl-n1{margin:-4px!important}.ma-xl-n2{margin:-8px!important}.ma-xl-n3{margin:-12px!important}.ma-xl-n4{margin:-16px!important}.ma-xl-n5{margin:-20px!important}.ma-xl-n6{margin:-24px!important}.ma-xl-n7{margin:-28px!important}.ma-xl-n8{margin:-32px!important}.ma-xl-n9{margin:-36px!important}.ma-xl-n10{margin:-40px!important}.ma-xl-n11{margin:-44px!important}.ma-xl-n12{margin:-48px!important}.ma-xl-n13{margin:-52px!important}.ma-xl-n14{margin:-56px!important}.ma-xl-n15{margin:-60px!important}.ma-xl-n16{margin:-64px!important}.mx-xl-n1{margin-right:-4px!important;margin-left:-4px!important}.mx-xl-n2{margin-right:-8px!important;margin-left:-8px!important}.mx-xl-n3{margin-right:-12px!important;margin-left:-12px!important}.mx-xl-n4{margin-right:-16px!important;margin-left:-16px!important}.mx-xl-n5{margin-right:-20px!important;margin-left:-20px!important}.mx-xl-n6{margin-right:-24px!important;margin-left:-24px!important}.mx-xl-n7{margin-right:-28px!important;margin-left:-28px!important}.mx-xl-n8{margin-right:-32px!important;margin-left:-32px!important}.mx-xl-n9{margin-right:-36px!important;margin-left:-36px!important}.mx-xl-n10{margin-right:-40px!important;margin-left:-40px!important}.mx-xl-n11{margin-right:-44px!important;margin-left:-44px!important}.mx-xl-n12{margin-right:-48px!important;margin-left:-48px!important}.mx-xl-n13{margin-right:-52px!important;margin-left:-52px!important}.mx-xl-n14{margin-right:-56px!important;margin-left:-56px!important}.mx-xl-n15{margin-right:-60px!important;margin-left:-60px!important}.mx-xl-n16{margin-right:-64px!important;margin-left:-64px!important}.my-xl-n1{margin-top:-4px!important;margin-bottom:-4px!important}.my-xl-n2{margin-top:-8px!important;margin-bottom:-8px!important}.my-xl-n3{margin-top:-12px!important;margin-bottom:-12px!important}.my-xl-n4{margin-top:-16px!important;margin-bottom:-16px!important}.my-xl-n5{margin-top:-20px!important;margin-bottom:-20px!important}.my-xl-n6{margin-top:-24px!important;margin-bottom:-24px!important}.my-xl-n7{margin-top:-28px!important;margin-bottom:-28px!important}.my-xl-n8{margin-top:-32px!important;margin-bottom:-32px!important}.my-xl-n9{margin-top:-36px!important;margin-bottom:-36px!important}.my-xl-n10{margin-top:-40px!important;margin-bottom:-40px!important}.my-xl-n11{margin-top:-44px!important;margin-bottom:-44px!important}.my-xl-n12{margin-top:-48px!important;margin-bottom:-48px!important}.my-xl-n13{margin-top:-52px!important;margin-bottom:-52px!important}.my-xl-n14{margin-top:-56px!important;margin-bottom:-56px!important}.my-xl-n15{margin-top:-60px!important;margin-bottom:-60px!important}.my-xl-n16{margin-top:-64px!important;margin-bottom:-64px!important}.mt-xl-n1{margin-top:-4px!important}.mt-xl-n2{margin-top:-8px!important}.mt-xl-n3{margin-top:-12px!important}.mt-xl-n4{margin-top:-16px!important}.mt-xl-n5{margin-top:-20px!important}.mt-xl-n6{margin-top:-24px!important}.mt-xl-n7{margin-top:-28px!important}.mt-xl-n8{margin-top:-32px!important}.mt-xl-n9{margin-top:-36px!important}.mt-xl-n10{margin-top:-40px!important}.mt-xl-n11{margin-top:-44px!important}.mt-xl-n12{margin-top:-48px!important}.mt-xl-n13{margin-top:-52px!important}.mt-xl-n14{margin-top:-56px!important}.mt-xl-n15{margin-top:-60px!important}.mt-xl-n16{margin-top:-64px!important}.mr-xl-n1{margin-right:-4px!important}.mr-xl-n2{margin-right:-8px!important}.mr-xl-n3{margin-right:-12px!important}.mr-xl-n4{margin-right:-16px!important}.mr-xl-n5{margin-right:-20px!important}.mr-xl-n6{margin-right:-24px!important}.mr-xl-n7{margin-right:-28px!important}.mr-xl-n8{margin-right:-32px!important}.mr-xl-n9{margin-right:-36px!important}.mr-xl-n10{margin-right:-40px!important}.mr-xl-n11{margin-right:-44px!important}.mr-xl-n12{margin-right:-48px!important}.mr-xl-n13{margin-right:-52px!important}.mr-xl-n14{margin-right:-56px!important}.mr-xl-n15{margin-right:-60px!important}.mr-xl-n16{margin-right:-64px!important}.mb-xl-n1{margin-bottom:-4px!important}.mb-xl-n2{margin-bottom:-8px!important}.mb-xl-n3{margin-bottom:-12px!important}.mb-xl-n4{margin-bottom:-16px!important}.mb-xl-n5{margin-bottom:-20px!important}.mb-xl-n6{margin-bottom:-24px!important}.mb-xl-n7{margin-bottom:-28px!important}.mb-xl-n8{margin-bottom:-32px!important}.mb-xl-n9{margin-bottom:-36px!important}.mb-xl-n10{margin-bottom:-40px!important}.mb-xl-n11{margin-bottom:-44px!important}.mb-xl-n12{margin-bottom:-48px!important}.mb-xl-n13{margin-bottom:-52px!important}.mb-xl-n14{margin-bottom:-56px!important}.mb-xl-n15{margin-bottom:-60px!important}.mb-xl-n16{margin-bottom:-64px!important}.ml-xl-n1{margin-left:-4px!important}.ml-xl-n2{margin-left:-8px!important}.ml-xl-n3{margin-left:-12px!important}.ml-xl-n4{margin-left:-16px!important}.ml-xl-n5{margin-left:-20px!important}.ml-xl-n6{margin-left:-24px!important}.ml-xl-n7{margin-left:-28px!important}.ml-xl-n8{margin-left:-32px!important}.ml-xl-n9{margin-left:-36px!important}.ml-xl-n10{margin-left:-40px!important}.ml-xl-n11{margin-left:-44px!important}.ml-xl-n12{margin-left:-48px!important}.ml-xl-n13{margin-left:-52px!important}.ml-xl-n14{margin-left:-56px!important}.ml-xl-n15{margin-left:-60px!important}.ml-xl-n16{margin-left:-64px!important}.ms-xl-n1{margin-inline-start:-4px!important}.ms-xl-n2{margin-inline-start:-8px!important}.ms-xl-n3{margin-inline-start:-12px!important}.ms-xl-n4{margin-inline-start:-16px!important}.ms-xl-n5{margin-inline-start:-20px!important}.ms-xl-n6{margin-inline-start:-24px!important}.ms-xl-n7{margin-inline-start:-28px!important}.ms-xl-n8{margin-inline-start:-32px!important}.ms-xl-n9{margin-inline-start:-36px!important}.ms-xl-n10{margin-inline-start:-40px!important}.ms-xl-n11{margin-inline-start:-44px!important}.ms-xl-n12{margin-inline-start:-48px!important}.ms-xl-n13{margin-inline-start:-52px!important}.ms-xl-n14{margin-inline-start:-56px!important}.ms-xl-n15{margin-inline-start:-60px!important}.ms-xl-n16{margin-inline-start:-64px!important}.me-xl-n1{margin-inline-end:-4px!important}.me-xl-n2{margin-inline-end:-8px!important}.me-xl-n3{margin-inline-end:-12px!important}.me-xl-n4{margin-inline-end:-16px!important}.me-xl-n5{margin-inline-end:-20px!important}.me-xl-n6{margin-inline-end:-24px!important}.me-xl-n7{margin-inline-end:-28px!important}.me-xl-n8{margin-inline-end:-32px!important}.me-xl-n9{margin-inline-end:-36px!important}.me-xl-n10{margin-inline-end:-40px!important}.me-xl-n11{margin-inline-end:-44px!important}.me-xl-n12{margin-inline-end:-48px!important}.me-xl-n13{margin-inline-end:-52px!important}.me-xl-n14{margin-inline-end:-56px!important}.me-xl-n15{margin-inline-end:-60px!important}.me-xl-n16{margin-inline-end:-64px!important}.pa-xl-0{padding:0!important}.pa-xl-1{padding:4px!important}.pa-xl-2{padding:8px!important}.pa-xl-3{padding:12px!important}.pa-xl-4{padding:16px!important}.pa-xl-5{padding:20px!important}.pa-xl-6{padding:24px!important}.pa-xl-7{padding:28px!important}.pa-xl-8{padding:32px!important}.pa-xl-9{padding:36px!important}.pa-xl-10{padding:40px!important}.pa-xl-11{padding:44px!important}.pa-xl-12{padding:48px!important}.pa-xl-13{padding:52px!important}.pa-xl-14{padding:56px!important}.pa-xl-15{padding:60px!important}.pa-xl-16{padding:64px!important}.px-xl-0{padding-right:0!important;padding-left:0!important}.px-xl-1{padding-right:4px!important;padding-left:4px!important}.px-xl-2{padding-right:8px!important;padding-left:8px!important}.px-xl-3{padding-right:12px!important;padding-left:12px!important}.px-xl-4{padding-right:16px!important;padding-left:16px!important}.px-xl-5{padding-right:20px!important;padding-left:20px!important}.px-xl-6{padding-right:24px!important;padding-left:24px!important}.px-xl-7{padding-right:28px!important;padding-left:28px!important}.px-xl-8{padding-right:32px!important;padding-left:32px!important}.px-xl-9{padding-right:36px!important;padding-left:36px!important}.px-xl-10{padding-right:40px!important;padding-left:40px!important}.px-xl-11{padding-right:44px!important;padding-left:44px!important}.px-xl-12{padding-right:48px!important;padding-left:48px!important}.px-xl-13{padding-right:52px!important;padding-left:52px!important}.px-xl-14{padding-right:56px!important;padding-left:56px!important}.px-xl-15{padding-right:60px!important;padding-left:60px!important}.px-xl-16{padding-right:64px!important;padding-left:64px!important}.py-xl-0{padding-top:0!important;padding-bottom:0!important}.py-xl-1{padding-top:4px!important;padding-bottom:4px!important}.py-xl-2{padding-top:8px!important;padding-bottom:8px!important}.py-xl-3{padding-top:12px!important;padding-bottom:12px!important}.py-xl-4{padding-top:16px!important;padding-bottom:16px!important}.py-xl-5{padding-top:20px!important;padding-bottom:20px!important}.py-xl-6{padding-top:24px!important;padding-bottom:24px!important}.py-xl-7{padding-top:28px!important;padding-bottom:28px!important}.py-xl-8{padding-top:32px!important;padding-bottom:32px!important}.py-xl-9{padding-top:36px!important;padding-bottom:36px!important}.py-xl-10{padding-top:40px!important;padding-bottom:40px!important}.py-xl-11{padding-top:44px!important;padding-bottom:44px!important}.py-xl-12{padding-top:48px!important;padding-bottom:48px!important}.py-xl-13{padding-top:52px!important;padding-bottom:52px!important}.py-xl-14{padding-top:56px!important;padding-bottom:56px!important}.py-xl-15{padding-top:60px!important;padding-bottom:60px!important}.py-xl-16{padding-top:64px!important;padding-bottom:64px!important}.pt-xl-0{padding-top:0!important}.pt-xl-1{padding-top:4px!important}.pt-xl-2{padding-top:8px!important}.pt-xl-3{padding-top:12px!important}.pt-xl-4{padding-top:16px!important}.pt-xl-5{padding-top:20px!important}.pt-xl-6{padding-top:24px!important}.pt-xl-7{padding-top:28px!important}.pt-xl-8{padding-top:32px!important}.pt-xl-9{padding-top:36px!important}.pt-xl-10{padding-top:40px!important}.pt-xl-11{padding-top:44px!important}.pt-xl-12{padding-top:48px!important}.pt-xl-13{padding-top:52px!important}.pt-xl-14{padding-top:56px!important}.pt-xl-15{padding-top:60px!important}.pt-xl-16{padding-top:64px!important}.pr-xl-0{padding-right:0!important}.pr-xl-1{padding-right:4px!important}.pr-xl-2{padding-right:8px!important}.pr-xl-3{padding-right:12px!important}.pr-xl-4{padding-right:16px!important}.pr-xl-5{padding-right:20px!important}.pr-xl-6{padding-right:24px!important}.pr-xl-7{padding-right:28px!important}.pr-xl-8{padding-right:32px!important}.pr-xl-9{padding-right:36px!important}.pr-xl-10{padding-right:40px!important}.pr-xl-11{padding-right:44px!important}.pr-xl-12{padding-right:48px!important}.pr-xl-13{padding-right:52px!important}.pr-xl-14{padding-right:56px!important}.pr-xl-15{padding-right:60px!important}.pr-xl-16{padding-right:64px!important}.pb-xl-0{padding-bottom:0!important}.pb-xl-1{padding-bottom:4px!important}.pb-xl-2{padding-bottom:8px!important}.pb-xl-3{padding-bottom:12px!important}.pb-xl-4{padding-bottom:16px!important}.pb-xl-5{padding-bottom:20px!important}.pb-xl-6{padding-bottom:24px!important}.pb-xl-7{padding-bottom:28px!important}.pb-xl-8{padding-bottom:32px!important}.pb-xl-9{padding-bottom:36px!important}.pb-xl-10{padding-bottom:40px!important}.pb-xl-11{padding-bottom:44px!important}.pb-xl-12{padding-bottom:48px!important}.pb-xl-13{padding-bottom:52px!important}.pb-xl-14{padding-bottom:56px!important}.pb-xl-15{padding-bottom:60px!important}.pb-xl-16{padding-bottom:64px!important}.pl-xl-0{padding-left:0!important}.pl-xl-1{padding-left:4px!important}.pl-xl-2{padding-left:8px!important}.pl-xl-3{padding-left:12px!important}.pl-xl-4{padding-left:16px!important}.pl-xl-5{padding-left:20px!important}.pl-xl-6{padding-left:24px!important}.pl-xl-7{padding-left:28px!important}.pl-xl-8{padding-left:32px!important}.pl-xl-9{padding-left:36px!important}.pl-xl-10{padding-left:40px!important}.pl-xl-11{padding-left:44px!important}.pl-xl-12{padding-left:48px!important}.pl-xl-13{padding-left:52px!important}.pl-xl-14{padding-left:56px!important}.pl-xl-15{padding-left:60px!important}.pl-xl-16{padding-left:64px!important}.ps-xl-0{padding-inline-start:0px!important}.ps-xl-1{padding-inline-start:4px!important}.ps-xl-2{padding-inline-start:8px!important}.ps-xl-3{padding-inline-start:12px!important}.ps-xl-4{padding-inline-start:16px!important}.ps-xl-5{padding-inline-start:20px!important}.ps-xl-6{padding-inline-start:24px!important}.ps-xl-7{padding-inline-start:28px!important}.ps-xl-8{padding-inline-start:32px!important}.ps-xl-9{padding-inline-start:36px!important}.ps-xl-10{padding-inline-start:40px!important}.ps-xl-11{padding-inline-start:44px!important}.ps-xl-12{padding-inline-start:48px!important}.ps-xl-13{padding-inline-start:52px!important}.ps-xl-14{padding-inline-start:56px!important}.ps-xl-15{padding-inline-start:60px!important}.ps-xl-16{padding-inline-start:64px!important}.pe-xl-0{padding-inline-end:0px!important}.pe-xl-1{padding-inline-end:4px!important}.pe-xl-2{padding-inline-end:8px!important}.pe-xl-3{padding-inline-end:12px!important}.pe-xl-4{padding-inline-end:16px!important}.pe-xl-5{padding-inline-end:20px!important}.pe-xl-6{padding-inline-end:24px!important}.pe-xl-7{padding-inline-end:28px!important}.pe-xl-8{padding-inline-end:32px!important}.pe-xl-9{padding-inline-end:36px!important}.pe-xl-10{padding-inline-end:40px!important}.pe-xl-11{padding-inline-end:44px!important}.pe-xl-12{padding-inline-end:48px!important}.pe-xl-13{padding-inline-end:52px!important}.pe-xl-14{padding-inline-end:56px!important}.pe-xl-15{padding-inline-end:60px!important}.pe-xl-16{padding-inline-end:64px!important}.text-xl-left{text-align:left!important}.text-xl-right{text-align:right!important}.text-xl-center{text-align:center!important}.text-xl-justify{text-align:justify!important}.text-xl-start{text-align:start!important}.text-xl-end{text-align:end!important}.text-xl-h1{font-size:6rem!important;font-weight:300;line-height:1;letter-spacing:-.015625em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-h2{font-size:3.75rem!important;font-weight:300;line-height:1;letter-spacing:-.0083333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-h3{font-size:3rem!important;font-weight:400;line-height:1.05;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-h4{font-size:2.125rem!important;font-weight:400;line-height:1.175;letter-spacing:.0073529412em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-h5{font-size:1.5rem!important;font-weight:400;line-height:1.333;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-h6{font-size:1.25rem!important;font-weight:500;line-height:1.6;letter-spacing:.0125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-subtitle-1{font-size:1rem!important;font-weight:400;line-height:1.75;letter-spacing:.009375em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-subtitle-2{font-size:.875rem!important;font-weight:500;line-height:1.6;letter-spacing:.0071428571em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-body-1{font-size:1rem!important;font-weight:400;line-height:1.5;letter-spacing:.03125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-body-2{font-size:.875rem!important;font-weight:400;line-height:1.425;letter-spacing:.0178571429em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-button{font-size:.875rem!important;font-weight:500;line-height:2.6;letter-spacing:.0892857143em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.text-xl-caption{font-size:.75rem!important;font-weight:400;line-height:1.667;letter-spacing:.0333333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xl-overline{font-size:.75rem!important;font-weight:500;line-height:2.667;letter-spacing:.1666666667em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.h-xl-auto{height:auto!important}.h-xl-screen{height:100vh!important}.h-xl-0{height:0!important}.h-xl-25{height:25%!important}.h-xl-50{height:50%!important}.h-xl-75{height:75%!important}.h-xl-100{height:100%!important}.w-xl-auto{width:auto!important}.w-xl-0{width:0!important}.w-xl-25{width:25%!important}.w-xl-33{width:33%!important}.w-xl-50{width:50%!important}.w-xl-66{width:66%!important}.w-xl-75{width:75%!important}.w-xl-100{width:100%!important}}@media (min-width: 2560px){.d-xxl-none{display:none!important}.d-xxl-inline{display:inline!important}.d-xxl-inline-block{display:inline-block!important}.d-xxl-block{display:block!important}.d-xxl-table{display:table!important}.d-xxl-table-row{display:table-row!important}.d-xxl-table-cell{display:table-cell!important}.d-xxl-flex{display:flex!important}.d-xxl-inline-flex{display:inline-flex!important}.float-xxl-none{float:none!important}.float-xxl-left{float:left!important}.float-xxl-right{float:right!important}.v-locale--is-rtl .float-xxl-end{float:left!important}.v-locale--is-rtl .float-xxl-start,.v-locale--is-ltr .float-xxl-end{float:right!important}.v-locale--is-ltr .float-xxl-start{float:left!important}.flex-xxl-fill,.flex-xxl-1-1{flex:1 1 auto!important}.flex-xxl-1-0{flex:1 0 auto!important}.flex-xxl-0-1{flex:0 1 auto!important}.flex-xxl-0-0{flex:0 0 auto!important}.flex-xxl-1-1-100{flex:1 1 100%!important}.flex-xxl-1-0-100{flex:1 0 100%!important}.flex-xxl-0-1-100{flex:0 1 100%!important}.flex-xxl-0-0-100{flex:0 0 100%!important}.flex-xxl-1-1-0{flex:1 1 0!important}.flex-xxl-1-0-0{flex:1 0 0!important}.flex-xxl-0-1-0{flex:0 1 0!important}.flex-xxl-0-0-0{flex:0 0 0!important}.flex-xxl-row{flex-direction:row!important}.flex-xxl-column{flex-direction:column!important}.flex-xxl-row-reverse{flex-direction:row-reverse!important}.flex-xxl-column-reverse{flex-direction:column-reverse!important}.flex-xxl-grow-0{flex-grow:0!important}.flex-xxl-grow-1{flex-grow:1!important}.flex-xxl-shrink-0{flex-shrink:0!important}.flex-xxl-shrink-1{flex-shrink:1!important}.flex-xxl-wrap{flex-wrap:wrap!important}.flex-xxl-nowrap{flex-wrap:nowrap!important}.flex-xxl-wrap-reverse{flex-wrap:wrap-reverse!important}.justify-xxl-start{justify-content:flex-start!important}.justify-xxl-end{justify-content:flex-end!important}.justify-xxl-center{justify-content:center!important}.justify-xxl-space-between{justify-content:space-between!important}.justify-xxl-space-around{justify-content:space-around!important}.justify-xxl-space-evenly{justify-content:space-evenly!important}.justify-items-xxl-start{justify-items:flex-start!important}.justify-items-xxl-end{justify-items:flex-end!important}.justify-items-xxl-center{justify-items:center!important}.justify-items-xxl-stretch{justify-items:stretch!important}.align-xxl-start{align-items:flex-start!important}.align-xxl-end{align-items:flex-end!important}.align-xxl-center{align-items:center!important}.align-xxl-baseline{align-items:baseline!important}.align-xxl-stretch{align-items:stretch!important}.align-content-xxl-start{align-content:flex-start!important}.align-content-xxl-end{align-content:flex-end!important}.align-content-xxl-center{align-content:center!important}.align-content-xxl-space-between{align-content:space-between!important}.align-content-xxl-space-around{align-content:space-around!important}.align-content-xxl-space-evenly{align-content:space-evenly!important}.align-content-xxl-stretch{align-content:stretch!important}.align-self-xxl-auto{align-self:auto!important}.align-self-xxl-start{align-self:flex-start!important}.align-self-xxl-end{align-self:flex-end!important}.align-self-xxl-center{align-self:center!important}.align-self-xxl-baseline{align-self:baseline!important}.align-self-xxl-stretch{align-self:stretch!important}.order-xxl-first{order:-1!important}.order-xxl-0{order:0!important}.order-xxl-1{order:1!important}.order-xxl-2{order:2!important}.order-xxl-3{order:3!important}.order-xxl-4{order:4!important}.order-xxl-5{order:5!important}.order-xxl-6{order:6!important}.order-xxl-7{order:7!important}.order-xxl-8{order:8!important}.order-xxl-9{order:9!important}.order-xxl-10{order:10!important}.order-xxl-11{order:11!important}.order-xxl-12{order:12!important}.order-xxl-last{order:13!important}.ga-xxl-0{gap:0px!important}.ga-xxl-1{gap:4px!important}.ga-xxl-2{gap:8px!important}.ga-xxl-3{gap:12px!important}.ga-xxl-4{gap:16px!important}.ga-xxl-5{gap:20px!important}.ga-xxl-6{gap:24px!important}.ga-xxl-7{gap:28px!important}.ga-xxl-8{gap:32px!important}.ga-xxl-9{gap:36px!important}.ga-xxl-10{gap:40px!important}.ga-xxl-11{gap:44px!important}.ga-xxl-12{gap:48px!important}.ga-xxl-13{gap:52px!important}.ga-xxl-14{gap:56px!important}.ga-xxl-15{gap:60px!important}.ga-xxl-16{gap:64px!important}.ga-xxl-auto{gap:auto!important}.gr-xxl-0{row-gap:0px!important}.gr-xxl-1{row-gap:4px!important}.gr-xxl-2{row-gap:8px!important}.gr-xxl-3{row-gap:12px!important}.gr-xxl-4{row-gap:16px!important}.gr-xxl-5{row-gap:20px!important}.gr-xxl-6{row-gap:24px!important}.gr-xxl-7{row-gap:28px!important}.gr-xxl-8{row-gap:32px!important}.gr-xxl-9{row-gap:36px!important}.gr-xxl-10{row-gap:40px!important}.gr-xxl-11{row-gap:44px!important}.gr-xxl-12{row-gap:48px!important}.gr-xxl-13{row-gap:52px!important}.gr-xxl-14{row-gap:56px!important}.gr-xxl-15{row-gap:60px!important}.gr-xxl-16{row-gap:64px!important}.gr-xxl-auto{row-gap:auto!important}.gc-xxl-0{column-gap:0px!important}.gc-xxl-1{column-gap:4px!important}.gc-xxl-2{column-gap:8px!important}.gc-xxl-3{column-gap:12px!important}.gc-xxl-4{column-gap:16px!important}.gc-xxl-5{column-gap:20px!important}.gc-xxl-6{column-gap:24px!important}.gc-xxl-7{column-gap:28px!important}.gc-xxl-8{column-gap:32px!important}.gc-xxl-9{column-gap:36px!important}.gc-xxl-10{column-gap:40px!important}.gc-xxl-11{column-gap:44px!important}.gc-xxl-12{column-gap:48px!important}.gc-xxl-13{column-gap:52px!important}.gc-xxl-14{column-gap:56px!important}.gc-xxl-15{column-gap:60px!important}.gc-xxl-16{column-gap:64px!important}.gc-xxl-auto{column-gap:auto!important}.ma-xxl-0{margin:0!important}.ma-xxl-1{margin:4px!important}.ma-xxl-2{margin:8px!important}.ma-xxl-3{margin:12px!important}.ma-xxl-4{margin:16px!important}.ma-xxl-5{margin:20px!important}.ma-xxl-6{margin:24px!important}.ma-xxl-7{margin:28px!important}.ma-xxl-8{margin:32px!important}.ma-xxl-9{margin:36px!important}.ma-xxl-10{margin:40px!important}.ma-xxl-11{margin:44px!important}.ma-xxl-12{margin:48px!important}.ma-xxl-13{margin:52px!important}.ma-xxl-14{margin:56px!important}.ma-xxl-15{margin:60px!important}.ma-xxl-16{margin:64px!important}.ma-xxl-auto{margin:auto!important}.mx-xxl-0{margin-right:0!important;margin-left:0!important}.mx-xxl-1{margin-right:4px!important;margin-left:4px!important}.mx-xxl-2{margin-right:8px!important;margin-left:8px!important}.mx-xxl-3{margin-right:12px!important;margin-left:12px!important}.mx-xxl-4{margin-right:16px!important;margin-left:16px!important}.mx-xxl-5{margin-right:20px!important;margin-left:20px!important}.mx-xxl-6{margin-right:24px!important;margin-left:24px!important}.mx-xxl-7{margin-right:28px!important;margin-left:28px!important}.mx-xxl-8{margin-right:32px!important;margin-left:32px!important}.mx-xxl-9{margin-right:36px!important;margin-left:36px!important}.mx-xxl-10{margin-right:40px!important;margin-left:40px!important}.mx-xxl-11{margin-right:44px!important;margin-left:44px!important}.mx-xxl-12{margin-right:48px!important;margin-left:48px!important}.mx-xxl-13{margin-right:52px!important;margin-left:52px!important}.mx-xxl-14{margin-right:56px!important;margin-left:56px!important}.mx-xxl-15{margin-right:60px!important;margin-left:60px!important}.mx-xxl-16{margin-right:64px!important;margin-left:64px!important}.mx-xxl-auto{margin-right:auto!important;margin-left:auto!important}.my-xxl-0{margin-top:0!important;margin-bottom:0!important}.my-xxl-1{margin-top:4px!important;margin-bottom:4px!important}.my-xxl-2{margin-top:8px!important;margin-bottom:8px!important}.my-xxl-3{margin-top:12px!important;margin-bottom:12px!important}.my-xxl-4{margin-top:16px!important;margin-bottom:16px!important}.my-xxl-5{margin-top:20px!important;margin-bottom:20px!important}.my-xxl-6{margin-top:24px!important;margin-bottom:24px!important}.my-xxl-7{margin-top:28px!important;margin-bottom:28px!important}.my-xxl-8{margin-top:32px!important;margin-bottom:32px!important}.my-xxl-9{margin-top:36px!important;margin-bottom:36px!important}.my-xxl-10{margin-top:40px!important;margin-bottom:40px!important}.my-xxl-11{margin-top:44px!important;margin-bottom:44px!important}.my-xxl-12{margin-top:48px!important;margin-bottom:48px!important}.my-xxl-13{margin-top:52px!important;margin-bottom:52px!important}.my-xxl-14{margin-top:56px!important;margin-bottom:56px!important}.my-xxl-15{margin-top:60px!important;margin-bottom:60px!important}.my-xxl-16{margin-top:64px!important;margin-bottom:64px!important}.my-xxl-auto{margin-top:auto!important;margin-bottom:auto!important}.mt-xxl-0{margin-top:0!important}.mt-xxl-1{margin-top:4px!important}.mt-xxl-2{margin-top:8px!important}.mt-xxl-3{margin-top:12px!important}.mt-xxl-4{margin-top:16px!important}.mt-xxl-5{margin-top:20px!important}.mt-xxl-6{margin-top:24px!important}.mt-xxl-7{margin-top:28px!important}.mt-xxl-8{margin-top:32px!important}.mt-xxl-9{margin-top:36px!important}.mt-xxl-10{margin-top:40px!important}.mt-xxl-11{margin-top:44px!important}.mt-xxl-12{margin-top:48px!important}.mt-xxl-13{margin-top:52px!important}.mt-xxl-14{margin-top:56px!important}.mt-xxl-15{margin-top:60px!important}.mt-xxl-16{margin-top:64px!important}.mt-xxl-auto{margin-top:auto!important}.mr-xxl-0{margin-right:0!important}.mr-xxl-1{margin-right:4px!important}.mr-xxl-2{margin-right:8px!important}.mr-xxl-3{margin-right:12px!important}.mr-xxl-4{margin-right:16px!important}.mr-xxl-5{margin-right:20px!important}.mr-xxl-6{margin-right:24px!important}.mr-xxl-7{margin-right:28px!important}.mr-xxl-8{margin-right:32px!important}.mr-xxl-9{margin-right:36px!important}.mr-xxl-10{margin-right:40px!important}.mr-xxl-11{margin-right:44px!important}.mr-xxl-12{margin-right:48px!important}.mr-xxl-13{margin-right:52px!important}.mr-xxl-14{margin-right:56px!important}.mr-xxl-15{margin-right:60px!important}.mr-xxl-16{margin-right:64px!important}.mr-xxl-auto{margin-right:auto!important}.mb-xxl-0{margin-bottom:0!important}.mb-xxl-1{margin-bottom:4px!important}.mb-xxl-2{margin-bottom:8px!important}.mb-xxl-3{margin-bottom:12px!important}.mb-xxl-4{margin-bottom:16px!important}.mb-xxl-5{margin-bottom:20px!important}.mb-xxl-6{margin-bottom:24px!important}.mb-xxl-7{margin-bottom:28px!important}.mb-xxl-8{margin-bottom:32px!important}.mb-xxl-9{margin-bottom:36px!important}.mb-xxl-10{margin-bottom:40px!important}.mb-xxl-11{margin-bottom:44px!important}.mb-xxl-12{margin-bottom:48px!important}.mb-xxl-13{margin-bottom:52px!important}.mb-xxl-14{margin-bottom:56px!important}.mb-xxl-15{margin-bottom:60px!important}.mb-xxl-16{margin-bottom:64px!important}.mb-xxl-auto{margin-bottom:auto!important}.ml-xxl-0{margin-left:0!important}.ml-xxl-1{margin-left:4px!important}.ml-xxl-2{margin-left:8px!important}.ml-xxl-3{margin-left:12px!important}.ml-xxl-4{margin-left:16px!important}.ml-xxl-5{margin-left:20px!important}.ml-xxl-6{margin-left:24px!important}.ml-xxl-7{margin-left:28px!important}.ml-xxl-8{margin-left:32px!important}.ml-xxl-9{margin-left:36px!important}.ml-xxl-10{margin-left:40px!important}.ml-xxl-11{margin-left:44px!important}.ml-xxl-12{margin-left:48px!important}.ml-xxl-13{margin-left:52px!important}.ml-xxl-14{margin-left:56px!important}.ml-xxl-15{margin-left:60px!important}.ml-xxl-16{margin-left:64px!important}.ml-xxl-auto{margin-left:auto!important}.ms-xxl-0{margin-inline-start:0px!important}.ms-xxl-1{margin-inline-start:4px!important}.ms-xxl-2{margin-inline-start:8px!important}.ms-xxl-3{margin-inline-start:12px!important}.ms-xxl-4{margin-inline-start:16px!important}.ms-xxl-5{margin-inline-start:20px!important}.ms-xxl-6{margin-inline-start:24px!important}.ms-xxl-7{margin-inline-start:28px!important}.ms-xxl-8{margin-inline-start:32px!important}.ms-xxl-9{margin-inline-start:36px!important}.ms-xxl-10{margin-inline-start:40px!important}.ms-xxl-11{margin-inline-start:44px!important}.ms-xxl-12{margin-inline-start:48px!important}.ms-xxl-13{margin-inline-start:52px!important}.ms-xxl-14{margin-inline-start:56px!important}.ms-xxl-15{margin-inline-start:60px!important}.ms-xxl-16{margin-inline-start:64px!important}.ms-xxl-auto{margin-inline-start:auto!important}.me-xxl-0{margin-inline-end:0px!important}.me-xxl-1{margin-inline-end:4px!important}.me-xxl-2{margin-inline-end:8px!important}.me-xxl-3{margin-inline-end:12px!important}.me-xxl-4{margin-inline-end:16px!important}.me-xxl-5{margin-inline-end:20px!important}.me-xxl-6{margin-inline-end:24px!important}.me-xxl-7{margin-inline-end:28px!important}.me-xxl-8{margin-inline-end:32px!important}.me-xxl-9{margin-inline-end:36px!important}.me-xxl-10{margin-inline-end:40px!important}.me-xxl-11{margin-inline-end:44px!important}.me-xxl-12{margin-inline-end:48px!important}.me-xxl-13{margin-inline-end:52px!important}.me-xxl-14{margin-inline-end:56px!important}.me-xxl-15{margin-inline-end:60px!important}.me-xxl-16{margin-inline-end:64px!important}.me-xxl-auto{margin-inline-end:auto!important}.ma-xxl-n1{margin:-4px!important}.ma-xxl-n2{margin:-8px!important}.ma-xxl-n3{margin:-12px!important}.ma-xxl-n4{margin:-16px!important}.ma-xxl-n5{margin:-20px!important}.ma-xxl-n6{margin:-24px!important}.ma-xxl-n7{margin:-28px!important}.ma-xxl-n8{margin:-32px!important}.ma-xxl-n9{margin:-36px!important}.ma-xxl-n10{margin:-40px!important}.ma-xxl-n11{margin:-44px!important}.ma-xxl-n12{margin:-48px!important}.ma-xxl-n13{margin:-52px!important}.ma-xxl-n14{margin:-56px!important}.ma-xxl-n15{margin:-60px!important}.ma-xxl-n16{margin:-64px!important}.mx-xxl-n1{margin-right:-4px!important;margin-left:-4px!important}.mx-xxl-n2{margin-right:-8px!important;margin-left:-8px!important}.mx-xxl-n3{margin-right:-12px!important;margin-left:-12px!important}.mx-xxl-n4{margin-right:-16px!important;margin-left:-16px!important}.mx-xxl-n5{margin-right:-20px!important;margin-left:-20px!important}.mx-xxl-n6{margin-right:-24px!important;margin-left:-24px!important}.mx-xxl-n7{margin-right:-28px!important;margin-left:-28px!important}.mx-xxl-n8{margin-right:-32px!important;margin-left:-32px!important}.mx-xxl-n9{margin-right:-36px!important;margin-left:-36px!important}.mx-xxl-n10{margin-right:-40px!important;margin-left:-40px!important}.mx-xxl-n11{margin-right:-44px!important;margin-left:-44px!important}.mx-xxl-n12{margin-right:-48px!important;margin-left:-48px!important}.mx-xxl-n13{margin-right:-52px!important;margin-left:-52px!important}.mx-xxl-n14{margin-right:-56px!important;margin-left:-56px!important}.mx-xxl-n15{margin-right:-60px!important;margin-left:-60px!important}.mx-xxl-n16{margin-right:-64px!important;margin-left:-64px!important}.my-xxl-n1{margin-top:-4px!important;margin-bottom:-4px!important}.my-xxl-n2{margin-top:-8px!important;margin-bottom:-8px!important}.my-xxl-n3{margin-top:-12px!important;margin-bottom:-12px!important}.my-xxl-n4{margin-top:-16px!important;margin-bottom:-16px!important}.my-xxl-n5{margin-top:-20px!important;margin-bottom:-20px!important}.my-xxl-n6{margin-top:-24px!important;margin-bottom:-24px!important}.my-xxl-n7{margin-top:-28px!important;margin-bottom:-28px!important}.my-xxl-n8{margin-top:-32px!important;margin-bottom:-32px!important}.my-xxl-n9{margin-top:-36px!important;margin-bottom:-36px!important}.my-xxl-n10{margin-top:-40px!important;margin-bottom:-40px!important}.my-xxl-n11{margin-top:-44px!important;margin-bottom:-44px!important}.my-xxl-n12{margin-top:-48px!important;margin-bottom:-48px!important}.my-xxl-n13{margin-top:-52px!important;margin-bottom:-52px!important}.my-xxl-n14{margin-top:-56px!important;margin-bottom:-56px!important}.my-xxl-n15{margin-top:-60px!important;margin-bottom:-60px!important}.my-xxl-n16{margin-top:-64px!important;margin-bottom:-64px!important}.mt-xxl-n1{margin-top:-4px!important}.mt-xxl-n2{margin-top:-8px!important}.mt-xxl-n3{margin-top:-12px!important}.mt-xxl-n4{margin-top:-16px!important}.mt-xxl-n5{margin-top:-20px!important}.mt-xxl-n6{margin-top:-24px!important}.mt-xxl-n7{margin-top:-28px!important}.mt-xxl-n8{margin-top:-32px!important}.mt-xxl-n9{margin-top:-36px!important}.mt-xxl-n10{margin-top:-40px!important}.mt-xxl-n11{margin-top:-44px!important}.mt-xxl-n12{margin-top:-48px!important}.mt-xxl-n13{margin-top:-52px!important}.mt-xxl-n14{margin-top:-56px!important}.mt-xxl-n15{margin-top:-60px!important}.mt-xxl-n16{margin-top:-64px!important}.mr-xxl-n1{margin-right:-4px!important}.mr-xxl-n2{margin-right:-8px!important}.mr-xxl-n3{margin-right:-12px!important}.mr-xxl-n4{margin-right:-16px!important}.mr-xxl-n5{margin-right:-20px!important}.mr-xxl-n6{margin-right:-24px!important}.mr-xxl-n7{margin-right:-28px!important}.mr-xxl-n8{margin-right:-32px!important}.mr-xxl-n9{margin-right:-36px!important}.mr-xxl-n10{margin-right:-40px!important}.mr-xxl-n11{margin-right:-44px!important}.mr-xxl-n12{margin-right:-48px!important}.mr-xxl-n13{margin-right:-52px!important}.mr-xxl-n14{margin-right:-56px!important}.mr-xxl-n15{margin-right:-60px!important}.mr-xxl-n16{margin-right:-64px!important}.mb-xxl-n1{margin-bottom:-4px!important}.mb-xxl-n2{margin-bottom:-8px!important}.mb-xxl-n3{margin-bottom:-12px!important}.mb-xxl-n4{margin-bottom:-16px!important}.mb-xxl-n5{margin-bottom:-20px!important}.mb-xxl-n6{margin-bottom:-24px!important}.mb-xxl-n7{margin-bottom:-28px!important}.mb-xxl-n8{margin-bottom:-32px!important}.mb-xxl-n9{margin-bottom:-36px!important}.mb-xxl-n10{margin-bottom:-40px!important}.mb-xxl-n11{margin-bottom:-44px!important}.mb-xxl-n12{margin-bottom:-48px!important}.mb-xxl-n13{margin-bottom:-52px!important}.mb-xxl-n14{margin-bottom:-56px!important}.mb-xxl-n15{margin-bottom:-60px!important}.mb-xxl-n16{margin-bottom:-64px!important}.ml-xxl-n1{margin-left:-4px!important}.ml-xxl-n2{margin-left:-8px!important}.ml-xxl-n3{margin-left:-12px!important}.ml-xxl-n4{margin-left:-16px!important}.ml-xxl-n5{margin-left:-20px!important}.ml-xxl-n6{margin-left:-24px!important}.ml-xxl-n7{margin-left:-28px!important}.ml-xxl-n8{margin-left:-32px!important}.ml-xxl-n9{margin-left:-36px!important}.ml-xxl-n10{margin-left:-40px!important}.ml-xxl-n11{margin-left:-44px!important}.ml-xxl-n12{margin-left:-48px!important}.ml-xxl-n13{margin-left:-52px!important}.ml-xxl-n14{margin-left:-56px!important}.ml-xxl-n15{margin-left:-60px!important}.ml-xxl-n16{margin-left:-64px!important}.ms-xxl-n1{margin-inline-start:-4px!important}.ms-xxl-n2{margin-inline-start:-8px!important}.ms-xxl-n3{margin-inline-start:-12px!important}.ms-xxl-n4{margin-inline-start:-16px!important}.ms-xxl-n5{margin-inline-start:-20px!important}.ms-xxl-n6{margin-inline-start:-24px!important}.ms-xxl-n7{margin-inline-start:-28px!important}.ms-xxl-n8{margin-inline-start:-32px!important}.ms-xxl-n9{margin-inline-start:-36px!important}.ms-xxl-n10{margin-inline-start:-40px!important}.ms-xxl-n11{margin-inline-start:-44px!important}.ms-xxl-n12{margin-inline-start:-48px!important}.ms-xxl-n13{margin-inline-start:-52px!important}.ms-xxl-n14{margin-inline-start:-56px!important}.ms-xxl-n15{margin-inline-start:-60px!important}.ms-xxl-n16{margin-inline-start:-64px!important}.me-xxl-n1{margin-inline-end:-4px!important}.me-xxl-n2{margin-inline-end:-8px!important}.me-xxl-n3{margin-inline-end:-12px!important}.me-xxl-n4{margin-inline-end:-16px!important}.me-xxl-n5{margin-inline-end:-20px!important}.me-xxl-n6{margin-inline-end:-24px!important}.me-xxl-n7{margin-inline-end:-28px!important}.me-xxl-n8{margin-inline-end:-32px!important}.me-xxl-n9{margin-inline-end:-36px!important}.me-xxl-n10{margin-inline-end:-40px!important}.me-xxl-n11{margin-inline-end:-44px!important}.me-xxl-n12{margin-inline-end:-48px!important}.me-xxl-n13{margin-inline-end:-52px!important}.me-xxl-n14{margin-inline-end:-56px!important}.me-xxl-n15{margin-inline-end:-60px!important}.me-xxl-n16{margin-inline-end:-64px!important}.pa-xxl-0{padding:0!important}.pa-xxl-1{padding:4px!important}.pa-xxl-2{padding:8px!important}.pa-xxl-3{padding:12px!important}.pa-xxl-4{padding:16px!important}.pa-xxl-5{padding:20px!important}.pa-xxl-6{padding:24px!important}.pa-xxl-7{padding:28px!important}.pa-xxl-8{padding:32px!important}.pa-xxl-9{padding:36px!important}.pa-xxl-10{padding:40px!important}.pa-xxl-11{padding:44px!important}.pa-xxl-12{padding:48px!important}.pa-xxl-13{padding:52px!important}.pa-xxl-14{padding:56px!important}.pa-xxl-15{padding:60px!important}.pa-xxl-16{padding:64px!important}.px-xxl-0{padding-right:0!important;padding-left:0!important}.px-xxl-1{padding-right:4px!important;padding-left:4px!important}.px-xxl-2{padding-right:8px!important;padding-left:8px!important}.px-xxl-3{padding-right:12px!important;padding-left:12px!important}.px-xxl-4{padding-right:16px!important;padding-left:16px!important}.px-xxl-5{padding-right:20px!important;padding-left:20px!important}.px-xxl-6{padding-right:24px!important;padding-left:24px!important}.px-xxl-7{padding-right:28px!important;padding-left:28px!important}.px-xxl-8{padding-right:32px!important;padding-left:32px!important}.px-xxl-9{padding-right:36px!important;padding-left:36px!important}.px-xxl-10{padding-right:40px!important;padding-left:40px!important}.px-xxl-11{padding-right:44px!important;padding-left:44px!important}.px-xxl-12{padding-right:48px!important;padding-left:48px!important}.px-xxl-13{padding-right:52px!important;padding-left:52px!important}.px-xxl-14{padding-right:56px!important;padding-left:56px!important}.px-xxl-15{padding-right:60px!important;padding-left:60px!important}.px-xxl-16{padding-right:64px!important;padding-left:64px!important}.py-xxl-0{padding-top:0!important;padding-bottom:0!important}.py-xxl-1{padding-top:4px!important;padding-bottom:4px!important}.py-xxl-2{padding-top:8px!important;padding-bottom:8px!important}.py-xxl-3{padding-top:12px!important;padding-bottom:12px!important}.py-xxl-4{padding-top:16px!important;padding-bottom:16px!important}.py-xxl-5{padding-top:20px!important;padding-bottom:20px!important}.py-xxl-6{padding-top:24px!important;padding-bottom:24px!important}.py-xxl-7{padding-top:28px!important;padding-bottom:28px!important}.py-xxl-8{padding-top:32px!important;padding-bottom:32px!important}.py-xxl-9{padding-top:36px!important;padding-bottom:36px!important}.py-xxl-10{padding-top:40px!important;padding-bottom:40px!important}.py-xxl-11{padding-top:44px!important;padding-bottom:44px!important}.py-xxl-12{padding-top:48px!important;padding-bottom:48px!important}.py-xxl-13{padding-top:52px!important;padding-bottom:52px!important}.py-xxl-14{padding-top:56px!important;padding-bottom:56px!important}.py-xxl-15{padding-top:60px!important;padding-bottom:60px!important}.py-xxl-16{padding-top:64px!important;padding-bottom:64px!important}.pt-xxl-0{padding-top:0!important}.pt-xxl-1{padding-top:4px!important}.pt-xxl-2{padding-top:8px!important}.pt-xxl-3{padding-top:12px!important}.pt-xxl-4{padding-top:16px!important}.pt-xxl-5{padding-top:20px!important}.pt-xxl-6{padding-top:24px!important}.pt-xxl-7{padding-top:28px!important}.pt-xxl-8{padding-top:32px!important}.pt-xxl-9{padding-top:36px!important}.pt-xxl-10{padding-top:40px!important}.pt-xxl-11{padding-top:44px!important}.pt-xxl-12{padding-top:48px!important}.pt-xxl-13{padding-top:52px!important}.pt-xxl-14{padding-top:56px!important}.pt-xxl-15{padding-top:60px!important}.pt-xxl-16{padding-top:64px!important}.pr-xxl-0{padding-right:0!important}.pr-xxl-1{padding-right:4px!important}.pr-xxl-2{padding-right:8px!important}.pr-xxl-3{padding-right:12px!important}.pr-xxl-4{padding-right:16px!important}.pr-xxl-5{padding-right:20px!important}.pr-xxl-6{padding-right:24px!important}.pr-xxl-7{padding-right:28px!important}.pr-xxl-8{padding-right:32px!important}.pr-xxl-9{padding-right:36px!important}.pr-xxl-10{padding-right:40px!important}.pr-xxl-11{padding-right:44px!important}.pr-xxl-12{padding-right:48px!important}.pr-xxl-13{padding-right:52px!important}.pr-xxl-14{padding-right:56px!important}.pr-xxl-15{padding-right:60px!important}.pr-xxl-16{padding-right:64px!important}.pb-xxl-0{padding-bottom:0!important}.pb-xxl-1{padding-bottom:4px!important}.pb-xxl-2{padding-bottom:8px!important}.pb-xxl-3{padding-bottom:12px!important}.pb-xxl-4{padding-bottom:16px!important}.pb-xxl-5{padding-bottom:20px!important}.pb-xxl-6{padding-bottom:24px!important}.pb-xxl-7{padding-bottom:28px!important}.pb-xxl-8{padding-bottom:32px!important}.pb-xxl-9{padding-bottom:36px!important}.pb-xxl-10{padding-bottom:40px!important}.pb-xxl-11{padding-bottom:44px!important}.pb-xxl-12{padding-bottom:48px!important}.pb-xxl-13{padding-bottom:52px!important}.pb-xxl-14{padding-bottom:56px!important}.pb-xxl-15{padding-bottom:60px!important}.pb-xxl-16{padding-bottom:64px!important}.pl-xxl-0{padding-left:0!important}.pl-xxl-1{padding-left:4px!important}.pl-xxl-2{padding-left:8px!important}.pl-xxl-3{padding-left:12px!important}.pl-xxl-4{padding-left:16px!important}.pl-xxl-5{padding-left:20px!important}.pl-xxl-6{padding-left:24px!important}.pl-xxl-7{padding-left:28px!important}.pl-xxl-8{padding-left:32px!important}.pl-xxl-9{padding-left:36px!important}.pl-xxl-10{padding-left:40px!important}.pl-xxl-11{padding-left:44px!important}.pl-xxl-12{padding-left:48px!important}.pl-xxl-13{padding-left:52px!important}.pl-xxl-14{padding-left:56px!important}.pl-xxl-15{padding-left:60px!important}.pl-xxl-16{padding-left:64px!important}.ps-xxl-0{padding-inline-start:0px!important}.ps-xxl-1{padding-inline-start:4px!important}.ps-xxl-2{padding-inline-start:8px!important}.ps-xxl-3{padding-inline-start:12px!important}.ps-xxl-4{padding-inline-start:16px!important}.ps-xxl-5{padding-inline-start:20px!important}.ps-xxl-6{padding-inline-start:24px!important}.ps-xxl-7{padding-inline-start:28px!important}.ps-xxl-8{padding-inline-start:32px!important}.ps-xxl-9{padding-inline-start:36px!important}.ps-xxl-10{padding-inline-start:40px!important}.ps-xxl-11{padding-inline-start:44px!important}.ps-xxl-12{padding-inline-start:48px!important}.ps-xxl-13{padding-inline-start:52px!important}.ps-xxl-14{padding-inline-start:56px!important}.ps-xxl-15{padding-inline-start:60px!important}.ps-xxl-16{padding-inline-start:64px!important}.pe-xxl-0{padding-inline-end:0px!important}.pe-xxl-1{padding-inline-end:4px!important}.pe-xxl-2{padding-inline-end:8px!important}.pe-xxl-3{padding-inline-end:12px!important}.pe-xxl-4{padding-inline-end:16px!important}.pe-xxl-5{padding-inline-end:20px!important}.pe-xxl-6{padding-inline-end:24px!important}.pe-xxl-7{padding-inline-end:28px!important}.pe-xxl-8{padding-inline-end:32px!important}.pe-xxl-9{padding-inline-end:36px!important}.pe-xxl-10{padding-inline-end:40px!important}.pe-xxl-11{padding-inline-end:44px!important}.pe-xxl-12{padding-inline-end:48px!important}.pe-xxl-13{padding-inline-end:52px!important}.pe-xxl-14{padding-inline-end:56px!important}.pe-xxl-15{padding-inline-end:60px!important}.pe-xxl-16{padding-inline-end:64px!important}.text-xxl-left{text-align:left!important}.text-xxl-right{text-align:right!important}.text-xxl-center{text-align:center!important}.text-xxl-justify{text-align:justify!important}.text-xxl-start{text-align:start!important}.text-xxl-end{text-align:end!important}.text-xxl-h1{font-size:6rem!important;font-weight:300;line-height:1;letter-spacing:-.015625em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-h2{font-size:3.75rem!important;font-weight:300;line-height:1;letter-spacing:-.0083333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-h3{font-size:3rem!important;font-weight:400;line-height:1.05;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-h4{font-size:2.125rem!important;font-weight:400;line-height:1.175;letter-spacing:.0073529412em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-h5{font-size:1.5rem!important;font-weight:400;line-height:1.333;letter-spacing:normal!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-h6{font-size:1.25rem!important;font-weight:500;line-height:1.6;letter-spacing:.0125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-subtitle-1{font-size:1rem!important;font-weight:400;line-height:1.75;letter-spacing:.009375em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-subtitle-2{font-size:.875rem!important;font-weight:500;line-height:1.6;letter-spacing:.0071428571em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-body-1{font-size:1rem!important;font-weight:400;line-height:1.5;letter-spacing:.03125em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-body-2{font-size:.875rem!important;font-weight:400;line-height:1.425;letter-spacing:.0178571429em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-button{font-size:.875rem!important;font-weight:500;line-height:2.6;letter-spacing:.0892857143em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.text-xxl-caption{font-size:.75rem!important;font-weight:400;line-height:1.667;letter-spacing:.0333333333em!important;font-family:Roboto,sans-serif;text-transform:none!important}.text-xxl-overline{font-size:.75rem!important;font-weight:500;line-height:2.667;letter-spacing:.1666666667em!important;font-family:Roboto,sans-serif;text-transform:uppercase!important}.h-xxl-auto{height:auto!important}.h-xxl-screen{height:100vh!important}.h-xxl-0{height:0!important}.h-xxl-25{height:25%!important}.h-xxl-50{height:50%!important}.h-xxl-75{height:75%!important}.h-xxl-100{height:100%!important}.w-xxl-auto{width:auto!important}.w-xxl-0{width:0!important}.w-xxl-25{width:25%!important}.w-xxl-33{width:33%!important}.w-xxl-50{width:50%!important}.w-xxl-66{width:66%!important}.w-xxl-75{width:75%!important}.w-xxl-100{width:100%!important}}@media print{.d-print-none{display:none!important}.d-print-inline{display:inline!important}.d-print-inline-block{display:inline-block!important}.d-print-block{display:block!important}.d-print-table{display:table!important}.d-print-table-row{display:table-row!important}.d-print-table-cell{display:table-cell!important}.d-print-flex{display:flex!important}.d-print-inline-flex{display:inline-flex!important}.float-print-none{float:none!important}.float-print-left{float:left!important}.float-print-right{float:right!important}.v-locale--is-rtl .float-print-end{float:left!important}.v-locale--is-rtl .float-print-start,.v-locale--is-ltr .float-print-end{float:right!important}.v-locale--is-ltr .float-print-start{float:left!important}}.opts[data-v-153adc62]{max-width:560px;padding-top:32px}\n";
  function me2() {
    return B.length > 32 ? Promise.resolve(B) : fetch(c(ue2)).then((t2) => t2.text());
  }
  function V(t2) {
    return t2.replace(/(^|[\s,}])(:root\b)/g, "$1:host");
  }
  function fe() {
    const t2 = document.getElementById(pe2) || [...document.head.querySelectorAll("style")].find((o) => o.textContent.includes("--v-theme-"));
    if (!t2) return "";
    const e = t2.textContent;
    return t2.remove(), e;
  }
  var E = null;
  async function ye2() {
    if (E) return E;
    const t2 = await me2(), e = document.createElement("div");
    e.dataset.neosnipe = "popover-host", e.style.cssText = "position:fixed;inset:0;z-index:2147483000;pointer-events:none", document.body.appendChild(e);
    const o = e.attachShadow({ mode: "open" }), s = new CSSStyleSheet();
    s.replaceSync(V(t2)), o.adoptedStyleSheets = [s];
    const a2 = document.createElement("div");
    a2.className = `ns-root v-theme--${sy}`, o.appendChild(a2);
    const u = ay(de, { attach: a2 });
    u.use(wy(a2)), u.mount(a2);
    const y2 = fe();
    if (y2) {
      const p2 = new CSSStyleSheet();
      p2.replaceSync(V(y2)), o.adoptedStyleSheets = [...o.adoptedStyleSheets, p2];
    }
    return E = { host: e, shadow: o, root: a2, app: u }, E;
  }
  var _e2 = Object.freeze(Object.defineProperty({ __proto__: null, mountPopover: ye2 }, Symbol.toStringTag, { value: "Module" }));
  $t2(async () => ({ mount: _e2, store: Ct2 }));
})();
