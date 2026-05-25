const e = "http://www.w3.org/2000/svg";
let o = 0;
class l {
  constructor(t = {}) {
    this.defaults = {
      target: "[data-reefbreak]",
      intensity: 1,
      speed: 1,
      animate: !0,
      respectReducedMotion: !0
    }, this.config = { ...this.defaults, ...t }, this.settings = {
      blur: 2 * this.config.intensity,
      baseFrequency: 0.0125 * this.config.intensity,
      scale: 50 * this.config.intensity
    }, this.id = `reefbreak-${o += 1}`, this._rafId = null, this._targets = [], this._whenReady(() => this.init());
  }
  // Defer DOM work until the document is ready, and no-op outside the browser
  // (e.g. server-side rendering) so importing the module never throws.
  _whenReady(t) {
    typeof document > "u" || (document.readyState === "loading" || !document.body ? document.addEventListener("DOMContentLoaded", t, { once: !0 }) : t());
  }
  init() {
    this.createElements(), this.initBlur(), this.initColorMatrix(), this.initTurbulence(), this.initDisplacement(), this.initComposite(), this.bindFilter(this.config.target), this.config.animate && !this._prefersReducedMotion() && this.animate();
  }
  _prefersReducedMotion() {
    return this.config.respectReducedMotion && typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  createElements() {
    this.svg = document.createElementNS(e, "svg"), this.defs = document.createElementNS(e, "defs"), this.filter = document.createElementNS(e, "filter"), this.blur = document.createElementNS(e, "feGaussianBlur"), this.colorMatrix = document.createElementNS(e, "feColorMatrix"), this.turbulence = document.createElementNS(e, "feTurbulence"), this.displacement = document.createElementNS(e, "feDisplacementMap"), this.composite = document.createElementNS(e, "feComposite"), this.svg.appendChild(this.defs), this.defs.appendChild(this.filter), this.filter.appendChild(this.blur), this.filter.appendChild(this.colorMatrix), this.filter.appendChild(this.turbulence), this.filter.appendChild(this.displacement), this.filter.appendChild(this.composite), this.svg.id = `${this.id}-svg`, this.filter.id = this.id, this.svg.setAttribute("width", "0"), this.svg.setAttribute("height", "0"), this.svg.setAttribute("aria-hidden", "true"), this.svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden", document.body.appendChild(this.svg);
  }
  initBlur() {
    this.blur.setAttribute("in", "SourceGraphic"), this.blur.setAttribute("result", "blur"), this.blur.setAttribute("stdDeviation", this.settings.blur);
  }
  initColorMatrix() {
    this.colorMatrix.setAttribute("in", "blur"), this.colorMatrix.setAttribute("type", "matrix"), this.colorMatrix.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 1 0 1 0 0 0 0 0 12 -8"), this.colorMatrix.setAttribute("result", "goo");
  }
  initTurbulence() {
    this.turbulence.setAttribute("type", "fractalNoise"), this.turbulence.setAttribute("numOctaves", "1"), this.turbulence.setAttribute("seed", "1"), this.turbulence.setAttribute("result", "noise"), this.turbulence.setAttribute("baseFrequency", this.settings.baseFrequency);
  }
  initDisplacement() {
    this.displacement.setAttribute("in", "goo"), this.displacement.setAttribute("in2", "noise"), this.displacement.setAttribute("result", "displacement"), this.displacement.setAttribute("scale", this.settings.scale);
  }
  initComposite() {
    this.composite.setAttribute("in", "SourceGraphic"), this.composite.setAttribute("in2", "displacement"), this.composite.setAttribute("operator", "atop");
  }
  animate() {
    const { speed: t } = this.config, { blur: i, baseFrequency: s, scale: h } = this.settings;
    let n = 0;
    const a = () => {
      n += 5e-3 * t;
      const r = Math.sin(n);
      this.blur.setAttribute("stdDeviation", i + r), this.turbulence.setAttribute("baseFrequency", Math.max(1e-4, s + r * 0.01)), this.displacement.setAttribute("scale", h + r * 10), this._rafId = requestAnimationFrame(a);
    };
    this._rafId = requestAnimationFrame(a);
  }
  bindFilter(t) {
    const i = `url('#${this.id}')`;
    this._targets = Array.from(document.querySelectorAll(t)), this._targets.forEach((s) => {
      s.style.filter = i, s.style.webkitFilter = i;
    });
  }
  // Stop the animation, remove the filter from targets, and clean up the SVG.
  destroy() {
    this._rafId !== null && (cancelAnimationFrame(this._rafId), this._rafId = null), this._targets.forEach((t) => {
      t.style.filter = "", t.style.webkitFilter = "";
    }), this._targets = [], this.svg && this.svg.parentNode && this.svg.parentNode.removeChild(this.svg);
  }
}
export {
  l as default
};
