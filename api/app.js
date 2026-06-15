import express from 'express';
import cors from 'cors';
import { BD, testarConexao } from './db.js';
import rotasAmbientes from './src/routes/rotasAmbientes.js';
import rotasLeituras from './src/routes/rotasLeituras.js';
import rotasUsuarios from './src/routes/rotasUsuarios.js';
import rotasFiltros from './src/routes/rotasFiltros.js';
import swaggerUi from 'swagger-ui-express';
import documentacao from './config/swagger.js';

const app = express();

app.use(express.json());


// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(documentacao))
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentacao));

// Adicione:

app.get('/swagger', (req, res) => {


    res.send(`<!DOCTYPE html>

<html><head>

<title>API Frigidus</title>

<meta charset="utf-8"/>

<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">

</head><body>

<div id="swagger-ui"></div>

<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>

 <script>

 SwaggerUIBundle({

 spec: ${JSON.stringify(documentacao)},

 dom_id: '#swagger-ui'})

 </script>

 </body></html>`);

});
app.use(cors())


app.get('/', async (req, res) => {
    await testarConexao();
    // res.status(200).json("Api Funcionando");
    res.redirect('/swagger')
});

// Rotas da API
app.use(rotasAmbientes);
app.use(rotasFiltros);
app.use(rotasLeituras);
app.use(rotasUsuarios);

// Inicialização do servidor
const porta = 3000;


app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
    console.log(`Swagger: http://localhost:${porta}/swagger`);
});

// https://frigidus-brown.vercel.app