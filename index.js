export default class ReefBreak {
  constructor(
    items = '[data-reefbreak]',
    config = {
      intensity: 1,
      speed: 1,
      animate: true,
    }) {
    this.NS = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(this.NS, 'svg');
    this.defs = document.createElementNS(this.NS, 'defs');
    this.filter = document.createElementNS(this.NS, 'filter');
    this.blur = document.createElementNS(this.NS, 'feGaussianBlur');
    this.colorMatrix = document.createElementNS(this.NS, 'feColorMatrix');
    this.turbulence = document.createElementNS(this.NS, 'feTurbulence');
    this.displacement = document.createElementNS(this.NS, 'feDisplacementMap');
    this.composite = document.createElementNS(this.NS, 'feComposite');
    this.config = {
      blur: 2,
      baseFrequency: 0.0125,
      scale: 50,
    };
    this.init(items, config);
  }

  init(items, config) {
    this.createElements();
    this.initBlur();
    this.initColorMatrix();
    this.initTurbulence();
    this.initDisplacement();
    this.initComposite();
    this.bindFilter(items);
    if (config.animate) {
      this.animate();
    }
  }

  createElements() {
    this.svg.appendChild(this.defs);
    this.defs.appendChild(this.filter);
    this.filter.appendChild(this.blur);
    this.filter.appendChild(this.colorMatrix);
    this.filter.appendChild(this.turbulence);
    this.filter.appendChild(this.displacement);
    this.filter.appendChild(this.composite);
    this.svg.id = 'reefbreak-svg';
    this.filter.id = 'reefbreak';
    document.body.appendChild(this.svg);
  }

  initBlur() {
    this.blur.setAttribute('in', 'SourceGraphic');
    this.blur.setAttribute('result', 'blur');
    this.blur.setAttribute('stdDeviation', this.config.blur);
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
    this.turbulence.setAttribute('baseFrequency', this.config.baseFrequency);
  }

  initDisplacement() {
    this.displacement.setAttribute('in', 'goo');
    this.displacement.setAttribute('in2', 'noise');
    this.displacement.setAttribute('result', 'displacement');
    this.displacement.setAttribute('scale', this.config.scale);
  }

  initComposite() {
    this.composite.setAttribute('in', 'SourceGraphic');
    this.composite.setAttribute('in2', 'displacement');
    this.composite.setAttribute('operator', 'atop');
  }

  animate() {
    let time = 0;
    const animate = () => {
      time += 0.005;
      this.blur.setAttribute('stdDeviation', this.config.blur + Math.sin(time) * 1);
      this.turbulence.setAttribute('baseFrequency', this.config.baseFrequency + Math.sin(time) * 0.01);
      this.displacement.setAttribute('scale', this.config.scale + Math.sin(time) * 10);
      requestAnimationFrame(animate);
    }
    animate();
  }

  bindFilter(items) {
    document.querySelectorAll(items).forEach((item) => {
      item.style.filter = "url('#reefbreak')";
      item.style.webkitFilter = "url('#reefbreak')";
    });
  }
}