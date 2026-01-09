/**
 * 3D Card Effects
 * Interactive card animations with depth
 */

export class Card3D {
  static init() {
    // Add 3D effects to all cards
    document.addEventListener('DOMContentLoaded', () => {
      Card3D.applyToExistingCards();
    });
    
    // Observer for dynamically added cards
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList && node.classList.contains('card-3d')) {
            Card3D.addMouseEffect(node);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  static applyToExistingCards() {
    document.querySelectorAll('.card-3d, .card-3d-flip, .card-3d-lift').forEach(card => {
      Card3D.addMouseEffect(card);
    });
  }

  static addMouseEffect(card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  }

  static createInteractiveCard(content, options = {}) {
    const card = document.createElement('div');
    card.className = `card-3d rounded-2xl glass p-6 ${options.className || ''}`;
    card.innerHTML = content;
    
    if (options.onClick) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', options.onClick);
    }
    
    Card3D.addMouseEffect(card);
    return card;
  }

  static createFlipCard(frontContent, backContent, options = {}) {
    const container = document.createElement('div');
    container.className = 'relative w-full h-64';
    container.style.perspective = '1000px';
    
    const card = document.createElement('div');
    card.className = 'absolute inset-0 transition-transform duration-600';
    card.style.transformStyle = 'preserve-3d';
    
    const front = document.createElement('div');
    front.className = 'absolute inset-0 rounded-2xl glass p-6 backface-hidden';
    front.innerHTML = frontContent;
    
    const back = document.createElement('div');
    back.className = 'absolute inset-0 rounded-2xl glass p-6 backface-hidden';
    back.style.transform = 'rotateY(180deg)';
    back.innerHTML = backContent;
    
    card.appendChild(front);
    card.appendChild(back);
    container.appendChild(card);
    
    let isFlipped = false;
    container.addEventListener('click', () => {
      isFlipped = !isFlipped;
      card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0)';
    });
    
    return container;
  }

  static addParallaxEffect(element, depth = 20) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * depth / 1000;
      element.style.transform = `translateY(${rate}px)`;
    });
  }
}

// Auto-initialize
Card3D.init();
