/**
 * KARTEJI V2.5 - 3D Card Effects Component
 * Interactive 3D card transformations with mouse tracking
 */

export default class Card3D {
  constructor() {
    this.cards = new Map();
  }

  /**
   * Initialize 3D tilt effect on element
   * @param {HTMLElement|string} element - Element or selector
   * @param {Object} options - Configuration options
   */
  initTiltEffect(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const {
      maxTilt = 15,
      perspective = 1000,
      scale = 1.05,
      speed = 400,
      glare = true,
      maxGlare = 0.3
    } = options;

    el.style.transformStyle = 'preserve-3d';
    el.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;

    let glareEl;
    if (glare) {
      glareEl = document.createElement('div');
      glareEl.className = 'card-3d-glare';
      glareEl.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        pointer-events: none;
        background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${maxGlare}) 100%);
        opacity: 0;
        transition: opacity ${speed}ms ease;
      `;
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(glareEl);
    }

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
      
      el.style.transform = `
        perspective(${perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;

      if (glareEl) {
        const glarePos = (mouseX / rect.width) * 100;
        glareEl.style.backgroundPosition = `${glarePos}% ${glarePos}%`;
        glareEl.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      el.style.transform = `
        perspective(${perspective}px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;

      if (glareEl) {
        glareEl.style.opacity = '0';
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    // Store for cleanup
    this.cards.set(el, { handleMouseMove, handleMouseLeave });

    return {
      destroy: () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
        if (glareEl) glareEl.remove();
        this.cards.delete(el);
      }
    };
  }

  /**
   * Initialize flip card effect
   * @param {HTMLElement|string} element - Element or selector
   * @param {Object} options - Configuration options
   */
  initFlipEffect(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const {
      trigger = 'click',
      duration = 600,
      flipDirection = 'horizontal' // 'horizontal' or 'vertical'
    } = options;

    el.style.transformStyle = 'preserve-3d';
    el.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    el.style.position = 'relative';

    let isFlipped = false;

    const flip = () => {
      isFlipped = !isFlipped;
      const rotateAxis = flipDirection === 'horizontal' ? 'rotateY' : 'rotateX';
      el.style.transform = isFlipped ? `${rotateAxis}(180deg)` : `${rotateAxis}(0deg)`;
    };

    if (trigger === 'click') {
      el.addEventListener('click', flip);
    } else if (trigger === 'hover') {
      el.addEventListener('mouseenter', () => {
        if (!isFlipped) flip();
      });
      el.addEventListener('mouseleave', () => {
        if (isFlipped) flip();
      });
    }

    return {
      flip,
      isFlipped: () => isFlipped,
      destroy: () => {
        el.removeEventListener('click', flip);
        el.removeEventListener('mouseenter', flip);
        el.removeEventListener('mouseleave', flip);
      }
    };
  }

  /**
   * Create 3D parallax effect
   */
  initParallaxEffect(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const {
      strength = 20,
      layers = el.querySelectorAll('[data-depth]')
    } = options;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = (e.clientX - centerX) / rect.width;
      const mouseY = (e.clientY - centerY) / rect.height;

      layers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth) || 1;
        const moveX = mouseX * strength * depth;
        const moveY = mouseY * strength * depth;
        
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    };

    const handleMouseLeave = () => {
      layers.forEach(layer => {
        layer.style.transform = 'translate3d(0, 0, 0)';
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return {
      destroy: () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }

  /**
   * Create floating card animation
   */
  initFloatingEffect(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const {
      duration = 3000,
      distance = 10,
      easing = 'ease-in-out'
    } = options;

    const keyframes = [
      { transform: 'translateY(0px)' },
      { transform: `translateY(-${distance}px)` },
      { transform: 'translateY(0px)' }
    ];

    const timing = {
      duration,
      iterations: Infinity,
      easing
    };

    const animation = el.animate(keyframes, timing);

    return {
      pause: () => animation.pause(),
      play: () => animation.play(),
      destroy: () => animation.cancel()
    };
  }

  /**
   * Create bounce on scroll effect
   */
  initBounceOnScroll(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const {
      threshold = 0.2,
      duration = 600
    } = options;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.style.animation = `bounce ${duration}ms ease`;
          setTimeout(() => {
            el.style.animation = '';
          }, duration);
        }
      });
    }, { threshold });

    observer.observe(el);

    return {
      destroy: () => observer.disconnect()
    };
  }

  /**
   * Apply 3D transform to card layers
   */
  apply3DLayers(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const {
      layers = 3,
      gap = 10
    } = options;

    const children = Array.from(el.children);
    children.forEach((child, index) => {
      const depth = (index + 1) * gap;
      child.style.transform = `translateZ(${depth}px)`;
      child.style.transition = 'transform 0.3s ease';
    });

    el.style.transformStyle = 'preserve-3d';
    el.style.perspective = '1000px';
  }

  /**
   * Create hover expand effect
   */
  initHoverExpand(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const {
      scale = 1.1,
      duration = 300,
      shadow = true
    } = options;

    const originalTransform = el.style.transform;
    const originalShadow = el.style.boxShadow;

    el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

    const handleMouseEnter = () => {
      el.style.transform = `scale(${scale}) translateZ(20px)`;
      if (shadow) {
        el.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
      }
    };

    const handleMouseLeave = () => {
      el.style.transform = originalTransform;
      el.style.boxShadow = originalShadow;
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return {
      destroy: () => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }

  /**
   * Initialize all cards with class
   */
  initAll(selector = '.card-3d', options = {}) {
    const elements = document.querySelectorAll(selector);
    const instances = [];

    elements.forEach(el => {
      const instance = this.initTiltEffect(el, options);
      instances.push(instance);
    });

    return {
      destroy: () => instances.forEach(instance => instance.destroy())
    };
  }

  /**
   * Cleanup all card effects
   */
  destroyAll() {
    this.cards.forEach((handlers, el) => {
      el.removeEventListener('mousemove', handlers.handleMouseMove);
      el.removeEventListener('mouseleave', handlers.handleMouseLeave);
    });
    this.cards.clear();
  }
}
