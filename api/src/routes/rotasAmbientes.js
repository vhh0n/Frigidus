import { Router } from "express";
import { BD } from "../../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { autenticarToken } from "../middleware/autenticacao.js";

const router = Router();

// Listar ambientes
router.get('/ambientes', async (req, res) => {
    try {
        const ambientes = await BD.query('SELECT * FROM ambientes');

        return res.status(200).json(ambientes.rows);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            error: 'Erro ao listar ambientes'
        });
    }
});

// Cadastrar ambientes
router.post('/ambientes', async (req, res) => {
    const { sala, temperatura_min, temperatura_max } = req.body;

    try {
        const comando = `
            INSERT INTO ambientes
            (sala, temperatura_min, temperatura_max)
            VALUES ($1, $2, $3)
        `;

        const valores = [sala, temperatura_min, temperatura_max];

        await BD.query(comando, valores);

        return res.status(201).json({
            message: 'Ambiente cadastrado com sucesso'
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            error: 'Erro ao cadastrar ambientes'
        });
    }
});

// Atualizar ambientes (PUT)
router.put('/ambientes/:id_ambiente', async (req, res) => {
    const { id_ambiente } = req.params;
    const { sala, temperatura_min, temperatura_max } = req.body;

    try {
        const verificar = await BD.query(
            'SELECT * FROM ambientes WHERE id_ambiente = $1',
            [id_ambiente]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({
                message: 'Ambiente não encontrado'
            });
        }

        const comando = `
            UPDATE ambientes
            SET sala = $1,
                temperatura_min = $2,
                temperatura_max = $3
            WHERE id_ambiente = $4
        `;

        const valores = [
            sala,
            temperatura_min,
            temperatura_max,
            id_ambiente
        ];

        await BD.query(comando, valores);

        return res.status(200).json({
            message: 'Ambiente atualizado com sucesso'
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            error: 'Erro ao atualizar ambientes'
        });
    }
});

// Excluir ambientes
router.delete('/ambientes/:id_ambiente', async (req, res) => {
    const { id_ambiente } = req.params;

    try {
        await BD.query(
            'DELETE FROM ambientes WHERE id_ambiente = $1',
            [id_ambiente]
        );

        return res.status(200).json({
            message: 'Ambiente removido com sucesso'
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            error: 'Erro ao remover ambiente'
        });
    }
});

export default router;