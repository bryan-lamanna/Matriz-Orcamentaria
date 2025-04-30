// Adiciona funcionalidade aos botões
document.querySelectorAll('.btn-department').forEach(button => {
    button.addEventListener('click', function () {
        // Remove a classe 'active' de todos os botões
        document.querySelectorAll('.btn-department').forEach(btn => {
            btn.classList.remove('active');
        });

        // Adiciona a classe 'active' apenas ao botão clicado
        this.classList.add('active');

        // Aqui você pode adicionar a lógica para filtrar a tabela orçamentária
        // de acordo com o departamento selecionado
        console.log('Departamento selecionado:', this.textContent.trim());
    });
});

// Adiciona funcionalidade ao dropdown de anos
document.querySelectorAll('.dropdown-item[data-year]').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove a classe 'active' de todos os itens
        document.querySelectorAll('.dropdown-item[data-year]').forEach(el => {
            el.classList.remove('active');
        });

        // Adiciona a classe 'active' ao item selecionado
        this.classList.add('active');

        // Atualiza o texto do botão dropdown
        const year = this.getAttribute('data-year');
        const dropdownButton = document.getElementById('yearDropdown');
        dropdownButton.innerHTML = `<i class="fas fa-calendar-alt me-2"></i> ${year}`;

        // Aqui você pode adicionar a lógica para carregar os dados do ano selecionado
        console.log('Ano selecionado:', year);
        // Exemplo: loadBudgetData(year);
    });
});

// Mantém a funcionalidade dos botões de departamento
document.querySelectorAll('.btn-department').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.btn-department').forEach(btn => {
            btn.classList.remove('active');
            showLoading()
        });
        this.classList.add('active');
    });
});

// Método para exibir o overlay de loading
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
    
    // Opcional: desativar interação com outros elementos
    document.body.style.pointerEvents = 'none';
    overlay.style.pointerEvents = 'auto';

    setTimeout(() => {
        hideLoading();
    
    }, 1000);
}

// Método para ocultar o overlay de loading
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'none';
    
    // Reativar interação com outros elementos
    document.body.style.pointerEvents = 'auto';
}

fetch('./public/js/rubricas.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Arquivo não encontrado');
        }
        return response.json();
    })
    .then(data => {
        document.querySelectorAll('.conta-header').forEach(button => {
            button.addEventListener('click', function() {
                const categoria = this.textContent.trim();
                const items = data[categoria];

                if (!items) {
                    console.error('Categoria não encontrada no JSON');
                    return;
                }

                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2>${categoria}</h2>
                        <table>
                            <tbody id="modal-body">
                            </tbody>
                        </table>
                    </div>
                `;

                const tbody = modal.querySelector('#modal-body');
                items.forEach(item => {
                    const [codigo, descricao] = item.includes(' - ') ? 
                        item.split(' - ') : 
                        ['', item];

                    // Cabeçalho da rubrica
                    const headerRow = document.createElement('tr');
                    headerRow.innerHTML = `
                        <td class="conta-header" colspan="14">
                            ${codigo}${codigo ? ' - ' : ''}${descricao}
                        </td>
                    `;
                    tbody.appendChild(headerRow);

                    // Linhas P/R/D
                    ['P', 'R', 'D'].forEach(tipo => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="conta-header">${tipo}</td>
                            ${Array(12).fill('<td>0</td>').join('')}
                            <td class="total-column">0</td>
                        `;
                        tbody.appendChild(row);
                    });
                });

                // Restante do código para fechar o modal permanece igual
                modal.querySelector('.close').addEventListener('click', () => {
                    modal.remove();
                });

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });

                document.body.appendChild(modal);
            });
        });

             // Adiciona os estilos CSS (mesmo código anterior)
             const style = document.createElement('style');
             style.textContent = `
                 .modal {
                     position: fixed;
                     top: 0;
                     left: 0;
                     width: 100%;
                     height: 100%;
                     background-color: rgba(0,0,0,0.5);
                     display: flex;
                     justify-content: center;
                     align-items: center;
                     z-index: 1000;
                 }
     
                 .modal-content {
                     background: white;
                     padding: 20px;
                     border-radius: 5px;
                     max-width: 80%;
                     max-height: 80vh;
                     overflow-y: auto;
                     position: relative;
                 }
     
                 .close {
                     position: absolute;
                     right: 10px;
                     top: 5px;
                     font-size: 24px;
                     cursor: pointer;
                 }
     
                 table {
                     width: 100%;
                     border-collapse: collapse;
                     margin-top: 15px;
                 }
     
                 th, td {
                     border: 1px solid #ddd;
                     padding: 8px;
                     text-align: left;
                 }
     
                 th {
                     background-color: #f2f2f2;
                 }
             `;
        document.head.appendChild(style);
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
        alert('Erro ao carregar os dados. Por favor tente recarregar a página.');
    });