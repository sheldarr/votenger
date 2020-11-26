/// <reference path="../../support/index.d.ts" />

import * as faker from 'faker';

describe('Admin', () => {
  it('should be able to creae new poll', () => {
    // given
    const someName = faker.git.branch();
    const someDescription = faker.lorem.sentence();

    cy.login();
    cy.visit('/');

    cy.get('[data-cy="create-poll"]').click();

    cy.get('#name').type(someName);
    cy.get('#description').type(someDescription);

    // when
    cy.contains('button', 'Create').click();

    // then
    cy.contains(someName).should('be.visible');
    cy.contains(someDescription).should('be.visible');
  });
});
