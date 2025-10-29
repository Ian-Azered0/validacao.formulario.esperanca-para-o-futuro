# ONG Uma Esperança para o Futuro — SPA (Vanilla JS)

Esta versão implementa um **Single Page Application (SPA)** usando JavaScript, com:
- Sistema de rotas via hash (home, projetos, cadastro)
- Renderização de templates com <template>
- Validação avançada de formulários (CPF, email, telefone, CEP)
- Máscaras de entrada (CPF, telefone, CEP)
- Armazenamento local (localStorage) para persistir cadastro
- Feedback visual (toasts, mensagens inline, modais)

## Rodar localmente
1. Abra no VS Code.
2. Rode Live Server ou `python -m http.server`.
3. Acesse `http://127.0.0.1:5500/` (ou a porta do Live Server).
## Notas
- Arquivo `index.html` agora contém as views como templates e o SPA router em `js/main_spa.js`.
- Validação avançada em `js/valida.js` (inclui algoritmo de CPF).
- Dados de cadastro são armazenados em `localStorage` sob a chave `cadastro`.
