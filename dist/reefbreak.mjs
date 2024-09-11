class r {
  constructor(t = {}) {
    this.NS = "http://www.w3.org/2000/svg", this.svg = document.createElementNS(this.NS, "svg"), this.defs = document.createElementNS(this.NS, "defs"), this.filter = document.createElementNS(this.NS, "filter"), this.blur = document.createElementNS(this.NS, "feGaussianBlur"), this.colorMatrix = document.createElementNS(this.NS, "feColorMatrix"), this.turbulence = document.createElementNS(this.NS, "feTurbulence"), this.displacement = document.createElementNS(this.NS, "feDisplacementMap"), this.composite = document.createElementNS(this.NS, "feComposite"), this.defaults = {
      target: "[data-reefbreak]",
      intensity: 1,
      speed: 1,
      animate: !0
    }, this.config = { ...this.defaults, ...t }, this.settings = {
      blur: 2 * this.config.intensity,
      baseFrequency: 0.0125 * this.config.intensity,
      scale: 50 * this.config.intensity
    }, this.init(this.config);
  }
  init(t) {
    this.createElements(), this.initBlur(), this.initColorMatrix(), this.initTurbulence(), this.initDisplacement(), this.initComposite(), this.bindFilter(t.target), t.animate && this.animate(t);
  }
  createElements() {
    this.svg.appendChild(this.defs), this.defs.appendChild(this.filter), this.filter.appendChild(this.blur), this.filter.appendChild(this.colorMatrix), this.filter.appendChild(this.turbulence), this.filter.appendChild(this.displacement), this.filter.appendChild(this.composite), this.svg.id = "reefbreak-svg", this.filter.id = "reefbreak", document.body.appendChild(this.svg);
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
  animate(t) {
    let e = 0;
    const i = () => {
      e += 5e-3 * t.speed, this.blur.setAttribute("stdDeviation", this.settings.blur + Math.sin(e) * 1), this.turbulence.setAttribute("baseFrequency", this.settings.baseFrequency + Math.sin(e) * 0.01), this.displacement.setAttribute("scale", this.settings.scale + Math.sin(e) * 10), requestAnimationFrame(i);
    };
    i();
  }
  bindFilter(t) {
    document.querySelectorAll(t).forEach((e) => {
      e.style.filter = "url('#reefbreak')", e.style.webkitFilter = "url('#reefbreak')";
    });
  }
}
export {
  r as default
};
