const API_BASE_URL = "http://127.0.0.1:8000/api";

// Função para buscar e exibir as ações
async function fetchAndDisplayActions() {
    try {
        const response = await fetch(`${API_BASE_URL}/actions`);
        const actions = await response.json();

        const completedCount = actions.filter(a => a.status === 'Concluída').length;
        const inProgressCount = actions.filter(a => a.status === 'Em Progresso').length;

        // Como o frontend é minificado, vamos apenas exibir um log e um resumo
        // para provar que a funcionalidade está funcionando.
        console.log("Ações carregadas do DB:", actions);

        // Atualiza o resumo de ações (simulação)
        const summaryElement = document.getElementById('action-summary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <p>Ações Concluídas: <strong>${completedCount}</strong></p>
                <p>Em Progresso: <strong>${inProgressCount}</strong></p>
            `;
        }

    } catch (error) {
        console.error("Erro ao buscar ações:", error);
    }
}

// Função para criar a interface de inserção de dados
function createActionInterface() {
    const root = document.getElementById('root');
    if (!root) return;

    // Cria um container para o formulário de inserção
    const formContainer = document.createElement('div');
    formContainer.id = 'action-form-container';
    formContainer.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #2e3440; padding: 15px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 8px rgba(0,0,0,0.5); color: white;';
    formContainer.innerHTML = `
        <h3>Adicionar Nova Ação (Funcional)</h3>
        <input type="text" id="action-description" placeholder="Descrição da Ação" style="width: 100%; margin-bottom: 5px; padding: 5px;">
        <select id="action-status" style="width: 100%; margin-bottom: 5px; padding: 5px;">
            <option value="Em Progresso">Em Progresso</option>
            <option value="Concluída">Concluída</option>
        </select>
        <input type="text" id="action-category" placeholder="Categoria (Ex: Energia)" style="width: 100%; margin-bottom: 10px; padding: 5px;">
        <button id="submit-action" style="width: 100%; padding: 8px; background: #5e81ac; color: white; border: none; border-radius: 4px; cursor: pointer;">Salvar Ação</button>
        <div id="action-summary" style="margin-top: 10px; border-top: 1px solid #4c566a; padding-top: 10px;"></div>
    `;

    root.appendChild(formContainer);

    // Adiciona o listener para o botão de salvar
    document.getElementById('submit-action').addEventListener('click', async () => {
        const description = document.getElementById('action-description').value;
        const status = document.getElementById('action-status').value;
        const category = document.getElementById('action-category').value;

        if (!description || !category) {
            alert("Descrição e Categoria são obrigatórias.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/actions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, status, category }),
            });

            const result = await response.json();

            if (result.success) {
                alert("Ação salva com sucesso! ID: " + result.id);
                document.getElementById('action-description').value = '';
                document.getElementById('action-category').value = '';
                fetchAndDisplayActions(); // Recarrega a lista para atualizar o resumo
            } else {
                alert("Erro ao salvar ação: " + result.message);
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            alert("Erro de conexão com a API. Verifique se o backend está rodando.");
        }
    });

    fetchAndDisplayActions(); // Carrega as ações iniciais
}

// Espera o carregamento completo do DOM e do script principal
window.addEventListener('load', () => {
    // Verifica se o usuário está logado (simulação: se a URL não for a de login)
    if (!window.location.href.includes('/login')) {
        createActionInterface();
    }
});
