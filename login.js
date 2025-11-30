const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener('DOMContentLoaded', () => {
    // A função principal do seu site (index-Cm22GqIN.js) deve renderizar a tela de login.
    // Vamos esperar que o DOM esteja pronto.

    const loginButton = document.querySelector('button'); // O primeiro botão é o "Entrar"
    
    // Verifica se estamos na tela de login (o botão "Entrar" existe)
    if (loginButton && loginButton.textContent.trim() === 'Entrar') {
        
        // Previne o comportamento padrão do botão (que pode ser um submit de formulário)
        loginButton.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const emailInput = document.querySelector('input[placeholder="seu@email.com"]');
            const passwordInput = document.querySelector('input[placeholder="••••••••"]');
            
            if (!emailInput || !passwordInput) {
                console.error("Campos de e-mail ou senha não encontrados.");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                alert("Por favor, preencha o e-mail e a senha.");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (data.success) {
                    alert(`Login bem-sucedido! Bem-vindo(a), ${data.user.name}.`);
                    
                    // Simula a navegação para o dashboard
                    // Como o seu site é um SPA, a navegação é controlada pelo script principal.
                    // A maneira mais simples de simular o login é recarregar a página para o dashboard.
                    // O script principal do seu site (index-Cm22GqIN.js) deve detectar o estado de login.
                    
                    // Para fins de demonstração local, vamos apenas mudar a URL para a raiz
                    // e deixar o script principal (index-Cm22GqIN.js) renderizar o dashboard.
                    window.location.href = '/'; 
                    
                } else {
                    alert(`Falha no Login: ${data.message}`);
                }
            } catch (error) {
                console.error("Erro ao tentar login:", error);
                alert("Erro de conexão com a API. Verifique se o backend está rodando.");
            }
        });
    }
});
