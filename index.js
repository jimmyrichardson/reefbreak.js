/**
 * ReefBreak.js — a wavy animation engine powered by SVG filters.
 * @see https://github.com/jimmyrichardson/reefbreak.js
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

// Lets multiple instances coexist without colliding on DOM ids.
let instanceCount = 0;

export default class ReefBreak {
  constructor(config = {}) {
    this.defaults = {
      target: '[data-reefbreak]',
      intensity: 1,
      speed: 1,
      animate: true,
      respectReducedMotion: true,
    };
    this.config = { ...this.defaults, ...config };
    this.settings = {
      blur: 2 * this.config.intensity,
      baseFrequency: 0.0125 * this.config.intensity,
      scale: 50 * this.config.intensity,
    };

    this.id = `reefbreak-${(instanceCount += 1)}`;
    this._rafId = null;
    this._targets = [];

    this._whenReady(() => this.init());
  }

  // Defer DOM work until the document is ready, and no-op outside the browser
  // (e.g. server-side rendering) so importing the module never throws.
  _whenReady(callback) {
    if (typeof document === 'undefined') return;
    if (document.readyState === 'loading' || !document.body) {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  init() {
    this.createElements();
    this.initBlur();
    this.initColorMatrix();
    this.initTurbulence();
    this.initDisplacement();
    this.initComposite();
    this.bindFilter(this.config.target);
    if (this.config.animate && !this._prefersReducedMotion()) {
      this.animate();
    }
  }

  _prefersReducedMotion() {
    return (
      this.config.respectReducedMotion &&
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  createElements() {
    this.svg = document.createElementNS(SVG_NS, 'svg');
    this.defs = document.createElementNS(SVG_NS, 'defs');
    this.filter = document.createElementNS(SVG_NS, 'filter');
    this.blur = document.createElementNS(SVG_NS, 'feGaussianBlur');
    this.colorMatrix = document.createElementNS(SVG_NS, 'feColorMatrix');
    this.turbulence = document.createElementNS(SVG_NS, 'feTurbulence');
    this.displacement = document.createElementNS(SVG_NS, 'feDisplacementMap');
    this.composite = document.createElementNS(SVG_NS, 'feComposite');

    this.svg.appendChild(this.defs);
    this.defs.appendChild(this.filter);
    this.filter.appendChild(this.blur);
    this.filter.appendChild(this.colorMatrix);
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.displacement);
    this.filter.appendChild(this.composite);

    this.svg.id = `${this.id}-svg`;
    this.filter.id = this.id;

    // The host SVG only carries the <defs> filter — keep it out of layout and
    // paint so it never renders as a stray box on the page.
    this.svg.setAttribute('width', '0');
    this.svg.setAttribute('height', '0');
    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';

    document.body.appendChild(this.svg);
  }

  initBlur() {
    this.blur.setAttribute('in', 'SourceGraphic');
    this.blur.setAttribute('result', 'blur');
    this.blur.setAttribute('stdDeviation', this.settings.blur);
  }

  initColorMatrix() {
    this.colorMatrix.setAttribute('in', 'blur');
    this.colorMatrix.setAttribute('type', 'matrix');
    this.colorMatrix.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 1 0 1 0 0 0 0 0 12 -8');
    this.colorMatrix.setAttribute('result', 'goo');
  }

  initTurbulence() {
    this.turbulence.setAttribute('type', 'fractalNoise');
    this.turbulence.setAttribute('numOctaves', '1');
    this.turbulence.setAttribute('seed', '1');
    this.turbulence.setAttribute('result', 'noise');
    this.turbulence.setAttribute('baseFrequency', this.settings.baseFrequency);
  }

  initDisplacement() {
    this.displacement.setAttribute('in', 'goo');
    this.displacement.setAttribute('in2', 'noise');
    this.displacement.setAttribute('result', 'displacement');
    this.displacement.setAttribute('scale', this.settings.scale);
  }

  initComposite() {
    this.composite.setAttribute('in', 'SourceGraphic');
    this.composite.setAttribute('in2', 'displacement');
    this.composite.setAttribute('operator', 'atop');
  }

  animate() {
    const { speed } = this.config;
    const { blur, baseFrequency, scale } = this.settings;
    let time = 0;

    const tick = () => {
      time += 0.005 * speed;
      const wave = Math.sin(time);
      this.blur.setAttribute('stdDeviation', blur + wave);
      // baseFrequency must stay positive — clamp so low intensities stay valid.
      this.turbulence.setAttribute('baseFrequency', Math.max(0.0001, baseFrequency + wave * 0.01));
      this.displacement.setAttribute('scale', scale + wave * 10);
      this._rafId = requestAnimationFrame(tick);
    };

    this._rafId = requestAnimationFrame(tick);
  }

  bindFilter(target) {
    const value = `url('#${this.id}')`;
    this._targets = Array.from(document.querySelectorAll(target));
    this._targets.forEach((item) => {
      item.style.filter = value;
      item.style.webkitFilter = value;
    });
  }

  // Stop the animation, remove the filter from targets, and clean up the SVG.
  destroy() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._targets.forEach((item) => {
      item.style.filter = '';
      item.style.webkitFilter = '';
    });
    this._targets = [];
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
  }
}
