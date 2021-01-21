/// <reference path="../../support/index.d.ts" />

import * as faker from 'faker';

describe('Admin', () => {
  it('should be able to creae new event', () => {
    // given
    const someName = faker.git.branch();

    cy.login();
    cy.visit('/');

    cy.get('[data-cy="create-event"]').click();

    cy.get('#name').type(someName);

    // when
    cy.contains('button', 'Create').click();

    // then
    cy.contains(someName).should('be.visible');
  });
});
