/// <reference types="Cypress" />

beforeEach(() => {
    cy.visit('src/index.html')
})

describe('Central de Atendimento ao Cliente TAT', function () {
    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function () {
        const longText = Cypress._.repeat('0123456789', 3)
        
        cy.clock()
        cy.get('#firstName').type('Eduardo')
        cy.get('#lastName').type('Barbosa')
        cy.get('#email').type('teste@exemplo.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    })

    it('valida o conteudo digitado de texto livre', function () {
        const longText = Cypress._.repeat('0123456789', 3)
        
        cy.clock()
        cy.get('#firstName').type('Eduardo')
        cy.get('#lastName').type('Barbosa')
        cy.get('#email').type('teste@exemplo.com')
        cy.get('#open-text-area')
            //.type(longText, { delay: 0 })
            .invoke('val', longText)
            .should('have.value', longText)
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.clock()
        cy.get('#firstName').type('Eduardo')
        cy.get('#lastName').type('Barbosa')
        cy.get('#email').type('teste@exemplo,com')
        cy.get('#open-text-area').type('Teste escrevendo texto')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    });

    it('campo telefone continua vazio ao digitar valores não numéricos', () => {
        cy.get('#phone')
            .type('abcde')
            .should('have.value', '')
    });
    //aula2ex4
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()
        cy.get('#firstName').type('Eduardo')
        cy.get('#lastName').type('Barbosa')
        cy.get('#email').type('teste@exemplo.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste escrevendo texto')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName')
            .type('Eduardo')
            .should('have.value', 'Eduardo')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Barbosa')
            .should('have.value', 'Barbosa')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('teste@exemplo.com')
            .should('have.value', 'teste@exemplo.com')
            .clear()
            .should('have.value', '')
        cy.get('#open-text-area')
            .type('Teste escrevendo texto')
            .should('have.value', 'Teste escrevendo texto')
            .clear()
            .should('have.value', '')
    });

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    });

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    });

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    });

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    });

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"]')
            //cy.get('input[type="radio"][value="feedback"]')
            .check('feedback')
            .should('have.value', 'feedback')
    });

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
            .should('have.length', '3')
            .each(($radio) => {
                cy.wrap($radio)
                    .click()
                    .should('be.checked')
            })
    });

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type=checkbox]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    });

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type=file][id=file-upload]')
            .selectFile('cypress/fixtures/example.json')
            .then(input => {
                //console.log(input)
                expect(input[0].files[0].name).to.equal('example.json')
            })
    });

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type=file][id=file-upload]')
        .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
        .then(input => {
            //console.log(input)
            expect(input[0].files[0].name).to.equal('example.json')
        })
    });

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('exampleFile')
        
        cy.get('input[type=file][id=file-upload]')
        .selectFile('@exampleFile')
        .then(input => {
            //console.log(input)
            expect(input[0].files[0].name).to.equal('example.json')
        })
    });

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank')
    });

    Cypress._.times(3, () => {
        it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
            cy.get('a[href="privacy.html"]')
                .invoke('removeAttr', 'target')
                .click()
    
            cy.contains('Talking About Testing').should('be.visible')
        });
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })

      
    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html').as('urlrequest')
            cy.get('@urlrequest').then(response => {
                expect(response.status).to.eq(200);
                expect(response.statusText).to.eq('OK')
                expect(response.body).to.include('CAC TAT')
            })

    });

    it.only('encontre o gato!', () => {
        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
        cy.get('#title')
            .invoke('text', 'CACA')
        cy.get('#subtitle')
            .invoke('text', 'RARA')
        
    });
})