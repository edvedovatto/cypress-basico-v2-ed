/// <reference types="Cypress" />

beforeEach(() => {
    cy.visit('src/index.html')
})

describe('Central de Atendimento ao Cliente TAT', function () {
    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function () {
        cy.get('#firstName').type('Eduardo')
        cy.get('#lastName').type('Barbosa')
        cy.get('#email').type('teste@exemplo.com')
        cy.get('#open-text-area').type('Teste escrevendo texto', { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').type('Eduardo')
        cy.get('#lastName').type('Barbosa')
        cy.get('#email').type('teste@exemplo,com')
        cy.get('#open-text-area').type('Teste escrevendo texto')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    });

    it('campo telefone continua vazio ao digitar valores não numéricos', () => {
        cy.get('#phone')
            .type('abcde')
            .should('have.value', '')
    });
    //aula2ex4
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Eduardo')
        cy.get('#lastName').type('Barbosa')
        cy.get('#email').type('teste@exemplo.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste escrevendo texto')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
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
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    });

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
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

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('a[href="privacy.html"]')
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('Talking About Testing').should('be.visible')
    });

})