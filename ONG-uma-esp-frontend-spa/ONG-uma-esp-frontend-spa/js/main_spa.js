// SPA router + template rendering + storage integration (Vanilla JS)
(function(){
  const routes = {
    '': 'home',
    '/': 'home',
    'home': 'home',
    'projetos': 'projetos',
    'cadastro': 'cadastro'
  };

  function el(id){ return document.getElementById(id); }
  function q(sel, root=document){ return root.querySelector(sel); }
  function qAll(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  // Templates
  function renderTemplate(name){
    const tpl = document.getElementById('tpl-' + name);
    const view = document.getElementById('view');
    if(!tpl || !view) return;
    view.innerHTML = '';
    const clone = tpl.content.cloneNode(true);
    view.appendChild(clone);
    // after render hooks
    if(name === 'projetos') renderProjects();
    if(name === 'cadastro') initCadastro();
    view.focus();
  }

  // Simple projects data (could be fetched)
  const projects = [
    {title:'Projeto Educação', desc:'Reforço escolar e atividades culturais.', img:'images/projetos.jpg', tags:['Educação','Comunidade']},
    {title:'Saúde Comunitária', desc:'Atendimentos e campanhas preventivas.', img:'images/impacto.jpg', tags:['Saúde']},
    {title:'Meio Ambiente', desc:'Preservação e educação ambiental.', img:'images/voluntarios.jpg', tags:['Meio Ambiente']}
  ];

  function renderProjects(){
    const list = q('.projects-list');
    if(!list) return;
    list.innerHTML = '';
    projects.forEach(p => {
      const art = document.createElement('article');
      art.className = 'card project-card';
      art.innerHTML = `
        <img src="${p.img}" alt="${p.title}" class="card-img">
        <div class="card-body">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="card-footer">
            ${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
            <div style="margin-top:12px;"><button class="btn btn-primary" data-join>${'Participar'}</button></div>
          </div>
        </div>`;
      list.appendChild(art);
    });
    // add handler to "Participar" -> navigate to cadastro
    qAll('[data-join]').forEach(btn => btn.addEventListener('click', ()=> location.hash = '#/cadastro'));
  }

  // SPA navigation
  function getRoute(){
    const hash = location.hash.replace('#','').split('?')[0];
    return routes[hash] || routes[hash.split('/')[1]] || 'home';
  }
  function onNavigate(){
    const route = getRoute();
    renderTemplate(route);
  }

  // Header interactions: menu toggle and dropdowns
  function headerInit(){
    const btn = q('.menu-toggle');
    const menu = q('.main-nav .menu');
    btn && btn.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('active');
    });
    qAll('.dropdown').forEach(drop => {
      const a = drop.querySelector('a');
      const sub = drop.querySelector('.submenu');
      a.addEventListener('click', (e)=>{
        // allow hash navigation too
        if(window.innerWidth < 768){
          e.preventDefault();
          sub.hidden = !sub.hidden;
        }
      });
    });
  }

  // Cadastro initialization (attach validation and load saved)
  function initCadastro(){
    // load stored data if any
    const stored = localStorage.getItem('cadastro');
    if(stored){
      try{
        const data = JSON.parse(stored);
        Object.keys(data).forEach(k => { const el = document.getElementById(k); if(el) el.value = data[k]; });
        showToast('Dados carregados do armazenamento local', 'success');
      }catch(e){}
    }

    const form = document.getElementById('cadastroForm');
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      // advanced validation in valida.js (global function)
      const valid = window.validateForm(form);
      if(!valid) return;
      // save to localStorage
      const data = Object.fromEntries(new FormData(form).entries());
      localStorage.setItem('cadastro', JSON.stringify(data));
      showToast('Cadastro salvo localmente. (Demo)', 'success');
      form.reset();
    });
  }

  // small toast helper
  function showToast(msg, type='info'){
    const toast = el('toast');
    if(!toast) return;
    toast.hidden = false;
    toast.textContent = msg;
    toast.className = 'toast ' + (type==='success' ? 'toast-success' : 'toast-info');
    setTimeout(()=>{ toast.hidden = true; toast.className='toast'; }, 3500);
  }
  window.showToast = showToast; // expose for other modules

  // initial setup
  document.addEventListener('DOMContentLoaded', function(){
    headerInit();
    // route on load and hashchange
    onNavigate();
    window.addEventListener('hashchange', onNavigate);
    // set year
    const y = el('year'); if(y) y.textContent = new Date().getFullYear();
  });
})();
