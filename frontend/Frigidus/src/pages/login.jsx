import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { enderecoServidor } from '../utils';

import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { EstilosLogin } from '../styles/EstilosLogin';
import { Estilos } from '../styles/Estilos';
import logo from '../assets/74558.png';
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const [lembrar, setLembrar] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    useEffect(() => {
        async function buscarUsuario() {
            const usuarioLogado = localStorage.getItem('UsuarioLogado');
            if (usuarioLogado != null) {
                const usuario = JSON.parse(usuarioLogado);
                if (usuario.lembrar == true) {
                    navigate('/principal');
                }
            }
        }
        buscarUsuario();
    }, [navigate]);


    async function botaoEntrar(event) {
        event.preventDefault();
        try {
            if (email === '' || senha === '') {

                setMensagem('Preencha todos os campos');
                return; //sai da funcao e não executa o resto do codigo
            }

            const dadoslogin = {
                email: email,
                senha: senha
            };

            const resposta = await fetch(`${enderecoServidor}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadoslogin)
            });

            if (resposta.status === 404) {
                setMensagem(`Rota não encontrada: ${resposta.url}`);
                return;
            }
            const dados = await resposta.json();
            if (resposta.status === 500) {
                setMensagem(`Erro no servidor: ${dados.message}`);
                return
            }
            if (resposta.ok) {
                localStorage.setItem('UsuarioLogado', JSON.stringify({ ...dados, lembrar }));
                navigate('/principal');
            } else {
                setMensagem('Email ou Senha incorretos')
            }

        } catch (erro) {
            setMensagem(`Erro ao realizar login: ${erro.message}`);
        }
    }

    return (
        <div style={EstilosLogin.container}>
            <header style={EstilosLogin.cabecalho}>
                <img src={logo} style={EstilosLogin.iconeLogo} />
                <div>
                    <h1 style={EstilosLogin.nomeApp}>Frigidus</h1>
                    <p style={EstilosLogin.subtituloApp}>O seu controler de temperatura</p>
                </div>
            </header>
            <main style={EstilosLogin.conteudoPrincipal}>
                <form style={EstilosLogin.formularioLogin}>
                    <h2 style={EstilosLogin.titulo}> Acesse sua Conta</h2>
                    <div style={EstilosLogin.grupoInput}>
                        <MdEmail style={EstilosLogin.iconeInput} />
                        <input type="email" style={EstilosLogin.input} placeholder="Digite seu Email" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div style={EstilosLogin.grupoInput}>
                        <MdLock style={EstilosLogin.iconeInput} />
                        <input type={mostrarSenha == true ? 'text' : 'password'}
                            style={EstilosLogin.input} placeholder="Digite sua senha" value={senha}
                            onChange={(e) => setSenha(e.target.value)} />
                        <button style={EstilosLogin.alternarVisibilidade} type="button" onClick={() => setMostrarSenha
                            (!mostrarSenha)}>
                            {mostrarSenha == true ? <MdVisibility /> : <MdVisibilityOff />}
                        </button>
                    </div>
                    <div style={EstilosLogin.entreOpcoes}>
                        <div style={EstilosLogin.containerCheckbox}>
                            <input type="checkbox" style={EstilosLogin.checkbox}
                                checked={lembrar} onChange={(e) => setLembrar(e.target.checked)}
                            />
                            <label> Lembrar-me</label>
                        </div>
                        <a href="#" style={EstilosLogin.esqueceuSenha}>Esqueci a senha</a>
                    </div>
                    <button type="submit" onClick={botaoEntrar} style={EstilosLogin.botaoEntrar}> Entrar</button>
                </form>
            </main>
        </div>
    );
}