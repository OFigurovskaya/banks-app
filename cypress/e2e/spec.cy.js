describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080/');
    cy.get('.form__login-input').type('developer')
    cy.get('.entryWind__form__password__input').type('skillbox')
    cy.contains('Войти').click(cy.url('http://localhost:8080/accounts'));

    const fs = cy.get('a.accountsCardWrapper__card__btn__href').first();
    fs.click();

    cy.get('.bodyAccount__transfer__form__btn').click()
    cy.get('.bodyAccount__transfer__form__sum__input').type(230);

    if(cy.get('.bodyAccount__transfer__form__btn').click()) {
      cy.intercept(
        {
          method: 'GET', 
          url: 'http://localhost:3000/transfer-funds/', 
        },
        [] 
      ).as('getUsers')
    }

    cy.get('.bodyAccount__requisite__btn__href').click()
    cy.url('http://localhost:8080/accounts');

    cy.get('.accountsHeader__new').click(cy.url('http://localhost:8080/accounts'))

    if(cy.get('.accountsHeader__new').click()) {
      cy.intercept(
        {
          method: 'POST', 
          url: 'http://localhost:3000/create-account/', 
        },
        [] 
      ).as('getUsers')
    }

    cy.get('.divHeaderListLi1Btn__href').click(cy.url('http://localhost:8080/banks'))

    cy.get('.divHeaderListLi2Btn__href').click(cy.url('http://localhost:8080/accounts'))

    cy.get('.divHeaderListLi3Btn__href').click(cy.url('http://localhost:8080/currencies'))

    cy.get('.divHeaderListLi4Btn__href').click(cy.url('http://localhost:8080/'))

    
  })
})