import pkg from 'pg';
const { Pool } = pkg;
const BD = new Pool({
    connectionString:
        `postgres://postgres.uepedstvcmgntzcdqwdr:zN9GBjtFsblIL7IU@aws-1-sa-east-1.pooler.supabase.com:5432/postgres`,

    ssl: {
        rejectUnauthorized: false // O Supabase requer SSL
    }
});

// import { Pool } from 'pg';
// const BD = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     password: 'admin',
//     database: 'bd_frigidus',
//     port: 5432
// })
const testarConexao = async () => {
    try {
        const cliente = await BD.connect(); // Realiza a conexão
        console.log('Conexão estabelecida');
        cliente.release(); // Libera a conexão
    } catch (error) {
        console.error('Erro ao conectar com o banco', error.message);
    }
}

export { BD, testarConexao }