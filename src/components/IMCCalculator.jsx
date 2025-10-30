import React, { useState, useMemo } from 'react';

// Tabela de Classificação do IMC
const CLASSIFICACOES = [
  { min: 0, max: 18.5, classificacao: 'Magreza', risco: 'Risco de problemas de saúde', cor: 'yellow-600', bg: 'yellow-100' },
  { min: 18.5, max: 24.9, classificacao: 'Normal', risco: 'Risco baixo', cor: 'green-600', bg: 'green-100' },
  { min: 25.0, max: 29.9, classificacao: 'Sobrepeso', risco: 'Risco moderado de doenças', cor: 'orange-600', bg: 'orange-100' },
  { min: 30.0, max: 39.9, classificacao: 'Obesidade', risco: 'Risco alto de doenças crônicas', cor: 'red-600', bg: 'red-100' },
  { min: 40.0, max: Infinity, classificacao: 'Obesidade Grave', risco: 'Risco muito alto de doenças crônicas', cor: 'purple-600', bg: 'purple-100' },
];

/**
 * Componente principal da Calculadora de IMC.
 * Atende aos requisitos: 1) Formulário (altura/peso), 2) Cálculo do IMC, 3) Retorno do IMC e Classificação.
 */
const IMCCalculator = () => {
  // Estado para altura (em cm) e peso (em kg)
  const [altura, setAltura] = useState(''); 
  const [peso, setPeso] = useState('');

  // Lógica principal de cálculo e classificação
  const calcularResultado = (p, a) => {
    const pesoKg = parseFloat(p);
    const alturaMetros = parseFloat(a) / 100; // Converte cm para metros

    // Validação básica dos inputs
    if (isNaN(pesoKg) || isNaN(alturaMetros) || pesoKg <= 0 || alturaMetros <= 0) {
      return {
        imc: null,
        classificacao: 'Aguardando dados...',
        risco: 'Preencha os campos com valores válidos.',
        cor: 'gray-500',
        bg: 'gray-100',
      };
    }

    // Cálculo do IMC: Peso / (Altura * Altura)
    const imc = pesoKg / (alturaMetros * alturaMetros);

    // Busca a classificação na tabela
    const classificacaoDetalhes = CLASSIFICACOES.find(item => imc < item.max);

    return {
      imc: imc.toFixed(2),
      classificacao: classificacaoDetalhes.classificacao,
      risco: classificacaoDetalhes.risco,
      cor: classificacaoDetalhes.cor,
      bg: classificacaoDetalhes.bg,
    };
  };

  // 2. Cálculo reativo: Usa useMemo para recalcular apenas quando peso ou altura mudam
  const resultado = useMemo(() => calcularResultado(peso, altura), [peso, altura]);

  // Handler para garantir que apenas números/decimais sejam inseridos
  const handleInputChange = (e, setter) => {
    const value = e.target.value;
    // Permite números, pontos (para decimais) e strings vazias
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setter(value);
    }
  };

  return (
    <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        Calculadora de IMC
      </h1>

      {/* Formulário (HTML/JSX) */}
      <form className="space-y-6">
        <div>
          <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-2">
            Altura (cm)
          </label>
          <input
            id="altura"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 175"
            value={altura}
            onChange={(e) => handleInputChange(e, setAltura)}
            className="w-full p-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-lg"
          />
        </div>

        <div>
          <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-2">
            Peso (kg)
          </label>
          <input
            id="peso"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 75.5"
            value={peso}
            onChange={(e) => handleInputChange(e, setPeso)}
            className="w-full p-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-lg"
          />
        </div>
      </form>

      {/* 3. Display de Resultado */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Seu Resultado:</h2>

        <div className={`p-6 rounded-xl shadow-lg border-l-8 border-${resultado.cor}`}>
          
          {/* IMC Calculado */}
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-lg font-medium text-gray-600">IMC:</span>
            <span className={`text-5xl font-extrabold text-${resultado.cor}`}>
              {resultado.imc || 'N/A'}
            </span>
          </div>

          {/* Classificação */}
          <div className={`p-3 rounded-lg font-semibold text-center bg-${resultado.bg} text-${resultado.cor}`}>
            <p className="text-lg">Classificação:</p>
            <p className="text-2xl mt-1">{resultado.classificacao}</p>
          </div>

          {/* Risco/Mensagem Adicional */}
          <p className="mt-4 text-center text-sm text-gray-500">
            {resultado.risco}
          </p>
        </div>
      </div>
      
      {/* Tabela de Referência */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tabela de Referência</h3>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-indigo-100 text-indigo-700 uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left">IMC (kg/m²)</th>
                <th className="p-3 text-left">Classificação</th>
              </tr>
            </thead>
            <tbody>
              {CLASSIFICACOES.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-mono">{item.min < 18.5 ? 'Abaixo de 18.5' : item.min >= 40 ? 'Acima de 40.0' : `${item.min.toFixed(1)} - ${item.max.toFixed(1)}`}</td>
                  <td className="p-3 text-gray-700 font-medium">{item.classificacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default IMCCalculator;
