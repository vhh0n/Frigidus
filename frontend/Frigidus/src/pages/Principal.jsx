import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Principal() {
    const navigate = useNavigate();
    const [dadosLogin, setDadosLogin] = useState(null);

    useEffect(() => {
        async function buscarUsuario() {
            const usuarioLogado = localStorage.getItem('UsuarioLogado');
            if (usuarioLogado != null) {
                setDadosLogin(JSON.parse(usuarioLogado));
            }
        }
        buscarUsuario();
    }, [navigate]);

    function botaoLogout() {
        localStorage.removeItem('UsuarioLogado');
        navigate('/');
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
                <p>Usuário: {dadosLogin?.usuario?.nome}</p>
                <p>Email: {dadosLogin?.usuario?.email}</p>
                <button onClick={botaoLogout}>Sair</button>
            </div>
        </div>
    );
}