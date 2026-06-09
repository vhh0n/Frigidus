import { Router } from "express";
import { BD } from "../../db.js";

const router = Router();

// Listar todas as leituras
router.get('/leituras',  async (req, res) => {
    try {
        const comando = `
            SELECT * FROM leitura
            ORDER BY data_hora DESC
        `;

        const leituras = await BD.query(comando);

        return res.status(200).json(leituras.rows);
    } catch (error) {
        console.error('Erro ao listar leituras:', error.message);
        return res.status(500).json({ error: 'Erro ao listar leituras' });
    }
});

// Buscar uma leitura por ID
router.get('/leituras/:id_leitura', async (req, res) => {
    const { id_leitura } = req.params;

    try {
        const comando = `
            SELECT * FROM leitura
            WHERE id_leitura = $1
        `;

        const resultado = await BD.query(comando, [id_leitura]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Leitura não encontrada' });
        }

        return res.status(200).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar leitura:', error.message);
        return res.status(500).json({ error: 'Erro ao buscar leitura' });
    }
});

// Cadastrar nova leitura
router.post('/leituras', async (req, res) => {
    const { id_ambiente, temperatura, umidade } = req.body;

    try {
        const comando = `
            INSERT INTO leitura
            (id_ambiente, temperatura, umidade)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const valores = [id_ambiente, temperatura, umidade];

        const resultado = await BD.query(comando, valores);

        return res.status(201).json({
            message: 'Leitura cadastrada com sucesso',
            leitura: resultado.rows[0]
        });

    } catch (error) {
        console.error('Erro ao cadastrar leitura:', error.message);
        return res.status(500).json({ error: 'Erro ao cadastrar leitura' });
    }
});

// Atualizar completamente uma leitura
router.put('/leituras/:id_leitura',  async (req, res) => {
    const { id_leitura } = req.params;
    const { id_ambiente, temperatura, umidade } = req.body;

    try {
        const verificar = await BD.query(
            `SELECT * FROM leitura WHERE id_leitura = $1`,
            [id_leitura]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({ message: 'Leitura não encontrada' });
        }

        const comando = `
            UPDATE leitura
            SET id_ambiente = $1,
                temperatura = $2,
                umidade = $3
            WHERE id_leitura = $4
        `;

        const valores = [
            id_ambiente,
            temperatura,
            umidade,
            id_leitura
        ];

        await BD.query(comando, valores);

        return res.status(200).json({
            message: 'Leitura atualizada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar leitura:', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar leitura' });
    }
});

// Atualização parcial
router.patch('/leituras/:id_leitura',  async (req, res) => {
    const { id_leitura } = req.params;
    const { id_ambiente, temperatura, umidade } = req.body;

    try {
        const verificar = await BD.query(
            `SELECT * FROM leitura WHERE id_leitura = $1`,
            [id_leitura]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({ message: 'Leitura não encontrada' });
        }

        const campos = [];
        const valores = [];
        let contador = 1;

        if (id_ambiente !== undefined) {
            campos.push(`id_ambiente = $${contador}`);
            valores.push(id_ambiente);
            contador++;
        }

        if (temperatura !== undefined) {
            campos.push(`temperatura = $${contador}`);
            valores.push(temperatura);
            contador++;
        }

        if (umidade !== undefined) {
            campos.push(`umidade = $${contador}`);
            valores.push(umidade);
            contador++;
        }

        if (campos.length === 0) {
            return res.status(400).json({
                message: 'Nenhum campo enviado para atualização'
            });
        }

        valores.push(id_leitura);

        const comando = `
            UPDATE leitura
            SET ${campos.join(', ')}
            WHERE id_leitura = $${contador}
        `;

        await BD.query(comando, valores);

        return res.status(200).json({
            message: 'Leitura atualizada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar leitura:', error.message);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Excluir leitura
router.delete('/leituras/:id_leitura', async (req, res) => {
    const { id_leitura } = req.params;

    try {
        const comando = `
            DELETE FROM leitura
            WHERE id_leitura = $1
        `;

        await BD.query(comando, [id_leitura]);

        return res.status(200).json({
            message: 'Leitura removida com sucesso'
        });

    } catch (error) {
        console.error('Erro ao remover leitura:', error.message);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

export default router;