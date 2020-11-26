Cypress.Commands.add('login', (username = 'admin') => {
  window.localStorage.setItem('USER', JSON.stringify({ username }));
});

export {};
