
import { hapticTap } from '../lib/net.js';

const items = [
  { hash:'#/home', icon:'home', label:'Beranda' },
  { hash:'#/feed', icon:'newspaper', label:'Feed' },
  { hash:'#/activities', icon:'event', label:'Kegiatan' },
  { hash:'#/finance', icon:'account_balance_wallet', label:'Kas' },
  { hash:'#/profile', icon:'person', label:'Profil' },
];

export function shouldShowBottomNav(hash){
  return ['#/home','#/feed','#/activities','#/finance','#/profile','#/admin','#/calendar','#/members','#/minutes','#/documents','#/periods','#/admin/users','#/admin/roles','#/admin/inbox'].includes(hash);
}

export function mountBottomNav(){
  // Create bottomNav if it doesn't exist
  let navContainer = document.getElementById('bottomNav');
  if (!navContainer) {
    navContainer = document.createElement('nav');
    navContainer.id = 'bottomNav';
    navContainer.className = 'fixed bottom-0 left-0 right-0 z-30 safe-area-inset-bottom';
    navContainer.innerHTML = '<div class="h-16 glass border-t border-slate-200/50 dark:border-slate-700/50 flex items-center px-2"></div>';
    document.body.appendChild(navContainer);
  }
  
  const root = document.querySelector('#bottomNav .h-16');
  if (!root) return;
  
  root.innerHTML = '';
  items.forEach(it=>{
    const btn = document.createElement('a');
    btn.href = it.hash;
    btn.dataset.hash = it.hash;
    btn.className = 'flex-1 h-12 mx-1 rounded-full flex items-center justify-center gap-2 text-sm font-semibold transition active:scale-[0.96] hover:bg-slate-100 dark:hover:bg-slate-800';
    btn.innerHTML = `
      <span class="material-symbols-rounded text-[20px]">${it.icon}</span>
      <span class="hidden xs:inline">${it.label}</span>
    `;
    btn.addEventListener('click', ()=> hapticTap());
    root.appendChild(btn);
  });

  const updateActive = ()=>{
    const current = location.hash || '#/home';
    [...root.querySelectorAll('a')].forEach(a=>{
      const active = a.dataset.hash === current;
      a.classList.toggle('bg-gradient-primary', active);
      a.classList.toggle('text-white', active);
      a.classList.toggle('text-slate-600', !active);
      a.classList.toggle('dark:text-slate-400', !active);
    });
  };
  window.addEventListener('hashchange', updateActive);
  updateActive();
}
