const documentacao = {
    openapi: '3.0.3',
    info: {
        title: 'API Frigidus',
        description: 'API Frigidus para controle de ambientes e leituras de temperatura e umidade',
        version: '1.0.0'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor Local'
        },
        {
            url: 'https://frigidus-brown.vercel.app',
            description: 'Servidor Vercel'
        }
    ],
    tags: [
        { name: 'Usuários', description: 'Operações relacionadas aos usuários' },
        { name: 'Autenticação', description: 'Operações de autenticação' },
        { name: 'Ambientes', description: 'Operações relacionadas aos ambientes' },
        { name: 'Leituras', description: 'Operações relacionadas às leituras' },
    ],
    paths: {
        "/usuarios": {
            get: {
                tags: ["Usuários"],
                summary: "Listar todos os usuários",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Dados obtidos com sucesso!",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: '#/components/schemas/Listar_Usuarios' }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Usuários'],
                summary: 'Cadastrar novo usuário',
                description: "Recebe nome, email, senha para cadastrar novo usuário",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Usuario"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Usuário cadastrado com sucesso!"
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            }
        },
        "/usuarios/{id_usuario}": {
            put: {
                tags: ['Usuários'],
                summary: 'Atualizar todos os dados do usuário',
                description: 'Atualiza todos os dados de um usuário existente, é necessário enviar todos os campos',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: "id_usuario",
                        in: "path",
                        required: true,
                        description: "ID do usuário a ser atualizado",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Atualizar_Usuario" },
                            example: {
                                nome: "Ricardo Santos",
                                email: "ricardo5@sesisp.com",
                                senha: "senhaAtualizada",
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Usuário atualizado com sucesso!"
                    },
                    404: {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json": {
                                example: { message: "Usuário não encontrado" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            },
            delete: {
                tags: ['Usuários'],
                summary: 'Remover Usuário',
                description: 'Remove usuário existente pelo ID',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: "id_usuario",
                        in: "path",
                        required: true,
                        description: "ID do usuário a ser removido",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Usuário removido com sucesso!"
                    },
                    404: {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json": {
                                example: { message: "Usuário não encontrado" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            },
        },
        "/login": {
            post: {
                tags: ['Autenticação'],
                summary: 'Realizar Login',
                description: "Autentica um usuario e retorna id e nome",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Login_Usuario"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Login realizado com sucesso!",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Resposta_Login"
                                }
                            }
                        }
                    },
                    400: { description: "Email e senha são obrigatorios" },
                    401: { description: "Credenciais inválidas" },
                    500: { description: "Erro interno no servidor" }
                }
            }
        },

"/ambientes": {
    get: {
        tags: ["Ambientes"],
        summary: "Listar ambientes",
        security: [
            {
                bearerAuth: []
            }
        ],

        responses: {
            200: {
                description: "Dados obtidos com sucesso",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Listar_Ambiente"
                            }
                        }
                    }
                    
                }
            }
        }
    },

    post: {
        tags: ["Ambientes"],
        summary: "Cadastrar ambiente",

        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Cadastrar_Ambiente"
                    }
                }
            }
        },

        responses: {
            201: {
                description: "Ambiente cadastrado com sucesso"
            }
        }
    }
},

        "/ambientes/{id_ambiente}": {
            put: {
                tags: ["Ambientes"],
                summary: "Atualizar ambiente",
                parameters: [
                    {
                        name: "id_ambiente",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer",
                            example: 1
                        }
                    }
                ],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Ambiente"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Ambiente atualizado com sucesso"
                    },
                    404: {
                        description: "Ambiente não encontrado"
                    },
                    500: {
                        description: "Erro interno no servidor"
                    },
                    400: {
                        description: "Dados inválidos"
                    }
                }
            },
            delete: {
                tags: ["Ambientes"],
                summary: "Excluir ambiente",

                parameters: [
                    {
                        name: "id_ambiente",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer",
                            example: 1
                        }
                    }
                ],

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                responses: {
                    200: {
                        description: "Ambiente removido com sucesso"
                    }
                }
            }
        },

        "/leituras": {
            get: {
                tags: ["Leituras"],
                summary: "Listar leituras",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Dados obtidos com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Listar_Leitura"
                                    }
                                }
                            }
                        }
                    }
                }
            },

            post: {
                tags: ["Leituras"],
                summary: "Cadastrar leitura",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Leitura"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Leitura cadastrada com sucesso"
                    }
                }
            }
        },

        "/leituras/{id_leitura}": {
            put: {
                tags: ["Leituras"],
                summary: "Atualizar leitura",

                parameters: [
                    {
                        name: "id_leitura",
                        in: "path",
                        required: true,
                        description: "ID da leitura a ser atualizada",
                        schema: {
                            type: "integer",
                            example: 4
                        }
                    }
                ],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Leitura"
                            },
                            example: {
                                id_ambiente: 2,
                                temperatura: 24.5,
                                umidade: 60.0
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: "Leitura atualizada com sucesso"
                    },
                    404: {
                        description: "Leitura não encontrada"
                    },
                    500: {
                        description: "Erro interno do servidor"
                    }
                }
            },

            delete: {
                tags: ["Leituras"],
                summary: "Excluir leitura",

                parameters: [
                    {
                        name: "id_leitura",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer",
                            example: 1
                        }
                    }
                ],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Leitura removida com sucesso"
                    }
                }
            }
        },

        "/leituras/filtro": {
    get: {
        tags: ["Leituras"],
        summary: "Filtrar leituras",
        description: "Permite filtrar leituras por ambiente, período, temperatura e umidade",

        security: [
            {
                bearerAuth: []
            }
        ],

        parameters: [
            {
                name: "id_ambiente",
                in: "query",
                required: false,
                schema: {
                    type: "integer",
                    example: 1
                }
            },
            {
                name: "data_inicio",
                in: "query",
                required: false,
                schema: {
                    type: "string",
                    format: "date-time",
                    example: "2026-06-01T00:00:00"
                }
            },
            {
                name: "data_fim",
                in: "query",
                required: false,
                schema: {
                    type: "string",
                    format: "date-time",
                    example: "2026-06-30T23:59:59"
                }
            },
            {
                name: "temp_min",
                in: "query",
                required: false,
                schema: {
                    type: "number",
                    example: 18
                }
            },
            {
                name: "temp_max",
                in: "query",
                required: false,
                schema: {
                    type: "number",
                    example: 25
                }
            },
            {
                name: "umidade_min",
                in: "query",
                required: false,
                schema: {
                    type: "number",
                    example: 40
                }
            },
            {
                name: "umidade_max",
                in: "query",
                required: false,
                schema: {
                    type: "number",
                    example: 80
                }
            }
        ],

        responses: {
            200: {
                description: "Leituras filtradas com sucesso",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Listar_Leitura"
                            }
                        }
                    }
                }
            },
            500: {
                description: "Erro ao filtrar leituras"
            }
        }
    }
},

"/leituras/media": {
    get: {
        tags: ["Leituras"],
        summary: "Média das leituras por ambiente",
        description: "Calcula média de temperatura e umidade agrupadas por ambiente",

        security: [
            {
                bearerAuth: []
            }
        ],

        responses: {
            200: {
                description: "Médias calculadas com sucesso",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Media_Leitura"
                            }
                        }
                    }
                }
            },
            500: {
                description: "Erro ao calcular médias"
            }
        }
    }
},

"/leituras/recentes": {
    get: {
        tags: ["Leituras"],
        summary: "Últimas leituras",
        description: "Retorna as 10 leituras mais recentes",

        security: [
            {
                bearerAuth: []
            }
        ],

        responses: {
            200: {
                description: "Leituras obtidas com sucesso",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Listar_Leitura"
                            }
                        }
                    }
                }
            },
            500: {
                description: "Erro ao buscar leituras recentes"
            }
        }
    }
},
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Insira o token JWT obtido no login para autenticação'
            }
        },
        schemas: {
            Listar_Usuarios: {
                type: 'object',
                properties: {
                    id_usuario: { type: "integer", example: 1 },
                    nome: { type: "string", example: "Isac" },
                    email: { type: "string", example: "isac@gmail.com" }
                }
            },

            Cadastrar_Usuario: {
                type: 'object',
                required: ['nome', 'email', 'senha'],
                properties: {
                    nome: { type: "string", example: "Isac" },
                    email: { type: "string", example: "isac@gmail.com" },
                    senha: { type: "string", example: "123456" },

                }
            },

            Atualizar_Usuario: {
                type: 'object',
                properties: {
                    nome: { type: "string", example: "Isac" },
                    email: { type: "string", example: "isac@gmail.com" },
                    senha: { type: "string", example: "123456" },

                }
            },

            Listar_Ambiente: {
                type: 'object',
                properties: {
                    id_ambiente: { type: "integer", example: 1 },
                    sala: { type: "string", example: "Produção" },
                    temperatura_min: { type: "number", example: 18.0 },
                    temperatura_max: { type: "number", example: 25.0 }
                }
            },

            Cadastrar_Ambiente: {
                type: 'object',
                properties: {
                    sala: { type: "string", example: "Produção" },
                    temperatura_min: { type: "number", example: 18.0 },
                    temperatura_max: { type: "number", example: 25.0 }
                }
            },

            Listar_Leitura: {
                type: 'object',
                properties: {
                    id_leitura: { type: "integer", example: 1 },
                    id_ambiente: { type: "integer", example: 1 },
                    temperatura: { type: "number", example: 24.5 },
                    umidade: { type: "number", example: 60.0 },
                    data_hora: {
                        type: "string",
                        format: "date-time",
                        example: "2026-06-08T14:30:00"
                    }
                }
            },

            Cadastrar_Leitura: {
                type: 'object',
                required: ['id_ambiente', 'temperatura', 'umidade'],
                properties: {
                    id_ambiente: {
                        type: "integer",
                        example: 2
                    },
                    temperatura: {
                        type: "number",
                        example: 24.5
                    },
                    umidade: {
                        type: "number",
                        example: 60.0
                    }
                }
            },

            Login_Usuario: {
                type: 'object',
                required: ['email', 'senha'],
                properties: {
                    email: {
                        type: 'string',
                        example: 'isac@gmail.com'
                    },
                    senha: {
                        type: 'string',
                        example: '123456'
                    }
                }
            },

            Resposta_Login: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        example: 'Login realizado com sucesso'
                    },
                    token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    },
                    usuario: {
                        type: 'object',
                        properties: {
                            id_usuario: {
                                type: 'integer',
                                example: 1
                            },
                            nome: {
                                type: 'string',
                                example: 'Isac'
                            },
                            email: {
                                type: 'string',
                                example: 'isac@gmail.com'
                            }
                        }
                    }
                }
            },

        }
    }
}
export default documentacao