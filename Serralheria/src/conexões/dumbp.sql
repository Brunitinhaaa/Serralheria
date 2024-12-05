-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rua VARCHAR(150),
    cep VARCHAR(10),
    bairro VARCHAR(100),
    telefone VARCHAR(15)
);

-- Tabela de orçamentos
CREATE TABLE orcamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo_servico VARCHAR(50) NOT NULL,
    altura NUMERIC(10, 2) NOT NULL,
    largura NUMERIC(10, 2) NOT NULL,
    comprimento NUMERIC(10, 2) NOT NULL,
    material VARCHAR(50) NOT NULL,
    detalhes JSON, -- Lista de detalhes adicionais
    preco_final NUMERIC(10, 2) NOT NULL,
    data_criacao TIMESTAMP DEFAULT NOW(),
    descricao TEXT, -- Descrição opcional

    -- Relacionamento com usuários
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);
