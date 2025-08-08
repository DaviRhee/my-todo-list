document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.querySelector('#form-cadastro');
    const formLogin = document.querySelector('#form-login');

    function prepararContaTeste() {
        const emailTeste = 'teste@email.com';
        const senhaTeste = '123456';
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

        if (!usuarios[emailTeste]) {
            usuarios[emailTeste] = { senha: senhaTeste, tarefas: [] };
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
    }
    prepararContaTeste();

    if (formCadastro) {
        formCadastro.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.querySelector('#email-cadastro').value;
            const emailConfirm = document.querySelector('#email-confirmacao').value;
            const senha = document.querySelector('#senha-cadastro').value;
            const senhaConfirm = document.querySelector('#senha-confirmacao').value;

            if (email !== emailConfirm) {
                alert("Os e-mails não coincidem!");
                return;
            }
            if (senha !== senhaConfirm) {
                alert("As senhas não coincidem!");
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

            if (usuarios[email]) {
                alert("Este e-mail já está cadastrado!");
                return;
            }

            usuarios[email] = { senha: senha, tarefas: [] };
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            alert("Cadastro realizado com sucesso!");
            window.location.href = 'login.html';
        });
    }

    if (formLogin) {
        const inputEmail = document.querySelector('#email-login');
        const inputSenha = document.querySelector('#senha-login');
        const lembrarCheckbox = document.querySelector('#lembrar-email');
        const btnToggleSenha = document.querySelector('#btn-toggle-senha');
        const linkTeste = document.querySelector('#link-teste');
        const emailLembrado = localStorage.getItem('emailLembrado');

        if (emailLembrado) {
            inputEmail.value = emailLembrado;
            lembrarCheckbox.checked = true;
        }

        if (linkTeste) {
            linkTeste.addEventListener('click', (event) => {
                event.preventDefault();
                inputEmail.value = 'teste@email.com';
                inputSenha.value = '123456';
            });
        }

        if (btnToggleSenha) {
            btnToggleSenha.addEventListener('click', function() {
                if (inputSenha.type === 'password') {
                    inputSenha.type = 'text';
                } else {
                    inputSenha.type = 'password';
                }
                const icone = this.querySelector('i');
                icone.classList.toggle('fa-eye');
                icone.classList.toggle('fa-eye-slash');
            });
        }

        formLogin.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = inputEmail.value;
            const senha = inputSenha.value;
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

            if (!usuarios[email] || usuarios[email].senha !== senha) {
                alert("E-mail ou senha incorretos!");
                return;
            }

            if (lembrarCheckbox.checked) {
                localStorage.setItem('emailLembrado', email);
            } else {
                localStorage.removeItem('emailLembrado');
            }

            localStorage.setItem('usuarioLogado', email);
            alert("Login realizado com sucesso!");
            window.location.href = 'index.html';
        });
    }
});