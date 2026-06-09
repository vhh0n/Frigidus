import { Router } from "express";
import { BD } from "../../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { autenticarToken } from "../middleware/autenticacao.js";

const SECRET_KEY = 'sua_chave_secreta';

const router = Router();

// Listar usuários
router.get('/usuarios', autenticarToken, async (req, res) => {
    try {
        const query = `SELECT id_usuario, nome, email FROM usuarios`;

        const usuarios = await BD.query(query);

        return res.status(200).json(usuarios.rows);
    } catch (error) {
        console.error('Erro ao listar usuários', error.message);
        return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

// Cadastrar usuário
router.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        const comando = `
            INSERT INTO usuarios(nome, email, senha)
            VALUES($1, $2, $3)
        `;

        const valores = [nome, email, senhaCriptografada];

        await BD.query(comando, valores);

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso"
        });
    } catch (error) {
        console.error('Erro ao cadastrar usuário', error.message);
        return res.status(500).json({
            error: 'Erro ao cadastrar usuário'
        });
    }
});

// Atualizar usuário completo (PUT)
router.put('/usuarios/:id_usuario', autenticarToken, async (req, res) => {
    const { id_usuario } = req.params;
    const { nome, email, senha } = req.body;

    try {
        const verificarUsuario = await BD.query(
            `SELECT * FROM usuarios WHERE id_usuario = $1`,
            [id_usuario]
        );

        if (verificarUsuario.rows.length === 0) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const comando = `
            UPDATE usuarios
            SET nome = $1,
                email = $2,
                senha = $3
            WHERE id_usuario = $4
        `;

        const valores = [
            nome,
            email,
            senhaCriptografada,
            id_usuario
        ];

        await BD.query(comando, valores);

        return res.status(200).json({
            message: 'Usuário atualizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar usuário', error.message);

        return res.status(500).json({
            error: 'Erro ao atualizar usuário'
        });
    }
});

// Excluir usuário
router.delete('/usuarios/:id_usuario', autenticarToken, async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const comando = `
            DELETE FROM usuarios
            WHERE id_usuario = $1
        `;

        const resultado = await BD.query(comando, [id_usuario]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        return res.status(200).json({
            message: 'Usuário removido com sucesso'
        });

    } catch (error) {
        console.error('Erro ao remover usuário', error.message);

        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            message: 'Email e senha são obrigatórios'
        });
    }

    try {
        const comando = `
            SELECT id_usuario, nome, email, senha
            FROM usuarios
            WHERE email = $1
        `;

        const resultado = await BD.query(comando, [email]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                message: 'Email não encontrado'
            });
        }

        const usuario = resultado.rows[0];

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                message: 'Senha inválida'
            });
        }

        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            },
            SECRET_KEY
        );

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Erro no login', error.message);

        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

export default router;