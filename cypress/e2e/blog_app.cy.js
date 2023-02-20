describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Testi Testinen',
      username: 'testinen',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Kirjaudu sisään sovellukseen')
  })

  describe('Login', function() {
    it('Succeeds with correct credentials', function() {
      cy.get('#username').type('testinen')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Testi Testinen on kirjautuneena')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testinen')
      cy.get('#password').type('väärä')
      cy.get('#login-button').click()

      cy.get('.error').contains('väärät kirjautumistiedot')
      cy.get('html').should('not.contain', 'Testi Testinen on kirjautuneena')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testinen', password: 'salainen' })
      cy.createBlog({
        title: 'Testailuja',
        author: 'Susanna H',
        url: 'testi.url',
        likes: 5
      })
      cy.createBlog({
        title: 'Testi2',
        author: 'Jokunen',
        url: 'juu.testi',
        likes: 7
      })
    })

    it('A blog can be created', function() {
      cy.contains('Uusi blogi').click()
      cy.get('#title-input').type('Cypress blogi')
      cy.get('#author-input').type('Susanna Haataja')
      cy.get('#url-input').type('www.testicypress')
      cy.contains('Lisää').click()
      cy.contains('Cypress blogi')
    })

    it('Blog can be liked', function() {
      cy.contains('Testailuja').contains('näytä').click()
      cy.get('.blog').contains('tykkää').click()

      cy.get('.blog').contains('tykkäykset 6')
    })

    it('User who created blog can remove it', function() {
      cy.contains('Testi2').contains('näytä').click()
      cy.get('.blog').contains('poista').click()

      cy.get('html').should('not.contain', 'Testi2')
      cy.get('.confirmation').contains('Blogi poistettu')
    })

    it('Only user who created the blog sees the remove button', function() {
      const user = {
        name: 'Testailija Toinen',
        username: 'toinentesti',
        password: 'salainen2'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

      cy.contains('Kirjaudu ulos').click()
      cy.login({ username: 'toinentesti', password: 'salainen2' })

      cy.contains('Testailuja').contains('näytä').click()
      cy.get('.blog').should('not.contain', 'poista')
    })

    it('Blogs are arranged according to likes', function() {
      cy.get('.hiddenBlog').eq(0).should('contain', 'Testi2')
      cy.get('.hiddenBlog').eq(1).should('contain', 'Testailuja')

      cy.contains('Testailuja').contains('näytä').click()
      cy.get('.blog').contains('tykkää').click()
      cy.get('.blog').contains('tykkäykset 6')
      cy.get('.blog').contains('tykkää').click()
      cy.get('.blog').contains('tykkäykset 7')
      cy.get('.blog').contains('tykkää').click()
      cy.get('.blog').contains('piilota').click()

      cy.get('.hiddenBlog').eq(0).should('contain', 'Testailuja')
      cy.get('.hiddenBlog').eq(1).should('contain', 'Testi2')
    })
  })
})