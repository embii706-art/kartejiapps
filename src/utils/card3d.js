/**
 * 3D Card Effect Utility - v2.5.0
 * Creates interactive tilt/rotate effects on cards with pointer movement
 * Respects prefers-reduced-motion
 */

export class Card3D {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      maxTilt: options.maxTilt || 10,
      perspective: options.perspective || 1000,
      scale: options.scale || 1.02,
      speed: options.speed || 400,
      glare: options.glare !== false,
      ...options
    };

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!this.prefersReducedMotion) {
      this.init();
    }
  }

  init() {
    this.element.style.transformStyle = 'preserve-3d';
    this.element.style.transition = `transform ${this.options.speed}ms ease-out`;
    
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  handleMouseEnter() {
    this.element.style.transition = `transform ${this.options.speed}ms ease-out`;
  }

  handleMouseMove(e) {
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * this.options.maxTilt;
    const rotateY = ((centerX - x) / centerX) * this.options.maxTilt;
    
    this.element.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(${this.options.scale}, ${this.options.scale}, ${this.options.scale})
    `;
  }

  handleMouseLeave() {
    this.element.style.transition = `transform ${this.options.speed}ms ease-out`;
    this.element.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;
  }

  destroy() {
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
    this.element.style.transform = '';
  }
}

/**
 * Initialize 3D effect on elements with .card-3d class
 */
export function initCard3D(selector = '.card-3d') {
  const cards = document.querySelectorAll(selector);
  const instances = [];
  
  cards.forEach(card => {
    instances.push(new Card3D(card));
  });
  
  return instances;
}
