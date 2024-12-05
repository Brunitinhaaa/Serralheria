const knex = require('../conexões/postgres');
const enviarOrcamentoPorEmail = require('../utils/enviarOrcamento'); 

const calcularPrecoFinal = (tipoServico, altura, largura, comprimento, material, detalhes) => {
    const valoresBase = {
        "Portão": 500.0,
        "Grade de janela": 300.0,
        "Corrimão": 400.0,
        "Estrutura metálica": 800.0,
        "Portão basculante": 700.0,
        "Escada metálica": 1000.0,
        "Guarda-corpo": 600.0,
        "Estrutura de toldo": 900.0,
        "Janela": 350.0,
    };

    const multiplicadoresMaterial = {
        "Ferro galvanizado": 1.0,
        "Aço inox": 1.5,
        "Alumínio": 1.2,
        "Aço carbono": 1.3,
        "Ferro comum": 0.9,
    };

    const custosDetalhes = {
        "Pintura eletrostática": 50.0,
        "Tratamento anti-ferrugem": 70.0,
        "Acabamento em madeira": 100.0,
        "Textura fosca": 40.0,
        "Acabamento escovado": 60.0,
        "Sem detalhes adicionais": 0.0,
    };

    if (!valoresBase[tipoServico] || !multiplicadoresMaterial[material]) {
        throw new Error('Dados inválidos ou ausentes para tipo de serviço ou material.');
    }

    const alturaMetros = altura / 100;
    const larguraMetros = largura / 100;
    const comprimentoMetros = comprimento / 100;

    const volume = alturaMetros * larguraMetros * comprimentoMetros;
    const custoBaseVolume = volume * 150.0;

    const multiplicadorMaterial = multiplicadoresMaterial[material];
    const custoMaterial = custoBaseVolume * multiplicadorMaterial;

    const custoDetalhesTotal = custosDetalhes[detalhes] ? custosDetalhes[detalhes] * volume : 0;

    return valoresBase[tipoServico] + custoMaterial + custoDetalhesTotal;
}

const fazerOrcamento = async (req, res) => {
    const { tipoServico, altura, largura, comprimento, material, detalhes, descricao } = req.body;
    const usuario_id = req.usuario.id;

    const detalhesJson = Array.isArray(detalhes) ? JSON.stringify(detalhes) : JSON.stringify([detalhes]);

    if (!tipoServico || !altura || !largura || !comprimento || !material || !detalhesJson) {
        return res.status(400).json({ mensagem: "Faltam informações para calcular o orçamento." });
    }

    try {
        const precoFinal = calcularPrecoFinal(tipoServico, altura, largura, comprimento, material, detalhesJson);

        const [novoOrcamento] = await knex('orcamentos').insert({
            usuario_id,
            tipo_servico: tipoServico,
            altura,
            largura,
            comprimento,
            material,
            detalhes: detalhesJson, 
            preco_final: precoFinal,
            descricao: descricao || null,
        }).returning('*');

        await enviarOrcamentoPorEmail(novoOrcamento.id, usuario_id);

        return res.status(201).json({
            mensagem: "Orçamento calculado e e-mail enviado com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao salvar o orçamento:", error);
        return res.status(500).json({ mensagem: "Erro ao salvar o orçamento ou enviar o e-mail." });
    }
};

module.exports = fazerOrcamento;
