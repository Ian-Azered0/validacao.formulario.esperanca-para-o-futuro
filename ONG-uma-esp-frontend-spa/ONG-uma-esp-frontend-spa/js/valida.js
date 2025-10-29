// Advanced form validation: consistency checks, CPF validation, email, field highlighting.
(function(){
  function setError(el, msg){
    el.classList.add('invalid');
    el.setAttribute('aria-invalid','true');
    // small inline message
    let sibling = el.nextElementSibling;
    if(!sibling || !sibling.classList.contains('field-error')){
      sibling = document.createElement('div'); sibling.className='field-error'; el.parentNode.insertBefore(sibling, el.nextSibling);
    }
    sibling.textContent = msg;
  }
  function clearError(el){
    el.classList.remove('invalid');
    el.removeAttribute('aria-invalid');
    const sibling = el.nextElementSibling;
    if(sibling && sibling.classList.contains('field-error')) sibling.remove();
  }

  function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  // CPF validation algorithm (Brazilian)
  function validateCPF(str){
    if(!str) return false;
    const cpf = str.replace(/\D/g,'');
    if(cpf.length !== 11) return false;
    if(/^([0-9])\1+$/.test(cpf)) return false; // all identical
    let sum = 0, rest;
    for(let i=1;i<=9;i++) sum += parseInt(cpf.substring(i-1,i)) * (11 - i);
    rest = (sum * 10) % 11; if(rest === 10) rest = 0;
    if(rest !== parseInt(cpf.substring(9,10))) return false;
    sum = 0;
    for(let i=1;i<=10;i++) sum += parseInt(cpf.substring(i-1,i)) * (12 - i);
    rest = (sum * 10) % 11; if(rest === 10) rest = 0;
    if(rest !== parseInt(cpf.substring(10,11))) return false;
    return true;
  }

  function validateForm(form){
    let ok = true;
    // clear previous errors
    form.querySelectorAll('.invalid, .field-error').forEach(n => { n.classList && n.classList.remove('invalid'); if(n.classList && n.classList.contains('field-error')) n.remove(); });

    // required checks
    form.querySelectorAll('[required]').forEach(function(field){
      if(!field.value || String(field.value).trim() === ''){
        setError(field, 'Campo obrigatório');
        ok = false;
      } else {
        clearError(field);
      }
    });

    // email
    const email = form.querySelector('#email');
    if(email && email.value && !validateEmail(email.value)){
      setError(email, 'E-mail inválido');
      ok = false;
    }

    // CPF
    const cpf = form.querySelector('#cpf');
    if(cpf){
      const cleaned = cpf.value.replace(/\D/g,'');
      if(cleaned.length !== 11 || !validateCPF(cpf.value)){
        setError(cpf, 'CPF inválido');
        ok = false;
      }
    }

    // telefone (basic)
    const tel = form.querySelector('#telefone');
    if(tel && tel.value){
      const t = tel.value.replace(/\D/g,'');
      if(t.length < 10){ setError(tel, 'Telefone incompleto'); ok = false; }
    }

    // CEP (basic)
    const cep = form.querySelector('#cep');
    if(cep && cep.value){
      const c = cep.value.replace(/\D/g,'');
      if(c.length !== 8){ setError(cep, 'CEP inválido'); ok = false; }
    }

    if(!ok){
      // focus first invalid
      const first = form.querySelector('.invalid');
      first && first.focus();
      window.showToast('Corrija os campos em destaque', 'error');
    }

    return ok;
  }

  window.validateForm = validateForm;
})();
