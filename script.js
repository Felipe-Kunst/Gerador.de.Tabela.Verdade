function gerarTabelaVerdade() {
    var expressao = document.getElementById('expressao').value;
    var tabelaVerdadeDiv = document.getElementById('tabelaVerdade');
    tabelaVerdadeDiv.innerHTML = '';

    if (expressao.trim() === '') {
        alert('Por favor, insira uma expressão lógica válida.');
        return;
    }

    var variaveis = [];
    var regex = /[A-D]/g; 
    var correspondencia;
    while ((correspondencia = regex.exec(expressao)) !== null) {
        if (!variaveis.includes(correspondencia[0])) {
            variaveis.push(correspondencia[0]);
        }
    }

    var tabela = document.createElement('table');
    var linhaCabecalho = tabela.createTHead().insertRow();
    linhaCabecalho.innerHTML = '<th>' + variaveis.join('</th><th>') + '</th><th>' + expressao + '</th>';

    var numLinhas = Math.pow(2, variaveis.length);
    var combinacoes = [];

    for (var i = 0; i < numLinhas; i++) {
        var valoresVariaveis = [];
        for (var j = variaveis.length - 1; j >= 0; j--) {
            valoresVariaveis.push((i >> j) & 1 ? '1' : '0');
        }
        combinacoes.push(valoresVariaveis);
    }
    combinacoes.sort((a, b) => b.join('').localeCompare(a.join('')));
    for (var k = 0; k < combinacoes.length; k++) {
        var resultado = avaliarExpressao(expressao, variaveis, combinacoes[k]);
        var linha = tabela.insertRow();
        linha.innerHTML = '<td>' + combinacoes[k].join('</td><td>') + '</td><td>' + resultado + '</td>';
    }
    tabelaVerdadeDiv.appendChild(tabela);
}

function avaliarExpressao(expressao, variaveis, valoresVariaveis) {
    expressao = expressao.replace(/∼/g, '!'); // NOT
    expressao = expressao.replace(/∧/g, '&&'); // AND
    expressao = expressao.replace(/∨/g, '||'); // OR
    expressao = expressao.replace(/→/g, '=>'); // Implicação
    expressao = expressao.replace(/↔/g, '==='); // Equivalência

    var expressaoComValores = expressao;
    for (var i = 0; i < variaveis.length; i++) {
        var regex = new RegExp(variaveis[i], 'g');
        expressaoComValores = expressaoComValores.replace(regex, valoresVariaveis[i] === '1' ? 'true' : 'false');
    }
    try {
        expressaoComValores = expressaoComValores.replace(/true\s*=>\s*false/g, 'false');
        expressaoComValores = expressaoComValores.replace(/true\s*=>\s*true/g, 'true');
        expressaoComValores = expressaoComValores.replace(/false\s*=>\s*true/g, 'true');
        expressaoComValores = expressaoComValores.replace(/false\s*=>\s*false/g, 'true');
        expressaoComValores = expressaoComValores.replace(/true\s*===\s*true/g, 'true');
        expressaoComValores = expressaoComValores.replace(/false\s*===\s*false/g, 'true');
        expressaoComValores = expressaoComValores.replace(/true\s*===\s*false/g, 'false');
        expressaoComValores = expressaoComValores.replace(/false\s*===\s*true/g, 'false');
        var resultado = eval(expressaoComValores) ? '1' : '0';
        return resultado;
    } catch (error) {
        return '0'; 
    }
}
