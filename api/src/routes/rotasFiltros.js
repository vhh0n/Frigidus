import { Router } from "express";
import { BD } from "../../db.js";

const router = Router();


// =====================================
// 🔎 FILTRO DINÂMICO DE LEITURAS
// =====================================
router.get('/leituras/filtro', async (req, res) => {
    const {
        id_ambiente,
        data_inicio,
        data_fim,
        temp_min,
        temp_max,
        umidade_min,
        umidade_max
    } = req.query;

    try {
        let sql = `
            SELECT *
            FROM leituras
            WHERE 1=1
        `;

        let valores = [];
        let contador = 1;

        if (id_ambiente) {
            sql += ` AND id_ambiente = $${contador}`;
            valores.push(id_ambiente);
            contador++;
        }

        if (data_inicio) {
            sql += ` AND data_hora >= $${contador}`;
            valores.push(data_inicio);
            contador++;
        }

        if (data_fim) {
            sql += ` AND data_hora <= $${contador}`;
            valores.push(data_fim);
            contador++;
        }

        if (temp_min) {
            sql += ` AND temperatura >= $${contador}`;
            valores.push(temp_min);
            contador++;
        }

        if (temp_max) {
            sql += ` AND temperatura <= $${contador}`;
            valores.push(temp_max);
            contador++;
        }

        if (umidade_min) {
            sql += ` AND umidade >= $${contador}`;
            valores.push(umidade_min);
            contador++;
        }   

        if (umidade_max) {
            sql += ` AND umidade <= $${contador}`;
            valores.push(umidade_max);
            contador++;
        }

        sql += ` ORDER BY data_hora DESC`;

        const resultado = await BD.query(sql, valores);

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("Erro ao filtrar leituras:", error.message);
        return res.status(500).json({
            error: "Erro ao filtrar leituras"
        });
    }
});


// =====================================
// 📊 MÉDIA POR AMBIENTE
// =====================================
router.get('/leituras/media', async (req, res) => {
    try {
        const sql = `
            SELECT 
                id_ambiente,
                AVG(temperatura) AS media_temperatura,
                AVG(umidade) AS media_umidade,
                COUNT(*) AS total_leituras
            FROM leituras
            GROUP BY id_ambiente
            ORDER BY id_ambiente;
        `;

        const resultado = await BD.query(sql);

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("Erro ao calcular médias:", error.message);
        return res.status(500).json({
            error: "Erro ao calcular médias"
        });
    }
});


// =====================================
// 📈 ÚLTIMAS LEITURAS (DASHBOARD)
// =====================================
router.get('/leituras/recentes', async (req, res) => {
    try {
        const sql = `
            SELECT *
            FROM leituras
            ORDER BY data_hora DESC
            LIMIT 10;
        `;

        const resultado = await BD.query(sql);

        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("Erro ao buscar leituras recentes:", error.message);
        return res.status(500).json({
            error: "Erro ao buscar leituras recentes"
        });
    }
});


export default router;