
CREATE TABLE empreendimentos
(
    id SMALLSERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL
);


CREATE TABLE torres
(
    id SMALLSERIAL PRIMARY KEY,
    empreendimento_id SMALLINT NOT NULL references empreendimentos(id),
    nome VARCHAR NOT NULL
);

CREATE TYPE tipo_unidade AS ENUM ('apartamento', 'vaga');

CREATE TABLE unidades
(
    id SMALLSERIAL PRIMARY KEY,
    torre_id SMALLINT  NOT NULL references torres(id),
    andar SMALLINT NOT NULL,
    numero VARCHAR NOT NULL,
    tipo tipo_unidade NOT NULL
);



CREATE TABLE unidades_vagas_garagem
(
    unidade_id SMALLINT NOT NULL references unidades(id),
    vaga_de_garagem_id SMALLINT NOT NULL references unidades(id),
    PRIMARY KEY (unidade_id, vaga_de_garagem_id)
);