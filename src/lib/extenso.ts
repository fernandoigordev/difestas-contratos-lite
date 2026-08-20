/**
 * Conversor de valores monetários para texto por extenso em português (BR).
 * Implementação própria e enxuta (sem dependência externa) — cobre bem a
 * faixa de valores típica de um contrato de decoração de eventos (unidades
 * a milhões). O resultado é usado como sugestão pré-preenchida no formulário
 * e pode ser revisado/editado pelo usuário antes de gerar o PDF.
 */

const UNITS = [
  "zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito",
  "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis",
  "dezessete", "dezoito", "dezenove",
];
const TENS = [
  "", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta",
  "oitenta", "noventa",
];
const HUNDREDS = [
  "", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos",
  "seiscentos", "setecentos", "oitocentos", "novecentos",
];
const SCALES: Array<{ singular: string; plural: string }> = [
  { singular: "", plural: "" },
  { singular: "mil", plural: "mil" },
  { singular: "milhão", plural: "milhões" },
  { singular: "bilhão", plural: "bilhões" },
  { singular: "trilhão", plural: "trilhões" },
];

function threeDigitsToWords(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cem";
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (h > 0) parts.push(HUNDREDS[h]!);
  if (rest > 0) {
    if (rest < 20) {
      parts.push(UNITS[rest]!);
    } else {
      const t = Math.floor(rest / 10);
      const u = rest % 10;
      parts.push(u > 0 ? `${TENS[t]} e ${UNITS[u]}` : TENS[t]!);
    }
  }
  return parts.join(" e ");
}

interface GroupPart {
  words: string;
  value: number;
  index: number;
}

export function integerToWords(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return `menos ${integerToWords(-n)}`;

  const groups: number[] = [];
  let rem = Math.floor(n);
  while (rem > 0) {
    groups.push(rem % 1000);
    rem = Math.floor(rem / 1000);
  }

  const parts: GroupPart[] = [];
  groups.forEach((value, index) => {
    if (value === 0) return;
    const base = threeDigitsToWords(value);
    let words: string;
    if (index === 0) {
      words = base;
    } else if (index === 1) {
      words = value === 1 ? "mil" : `${base} mil`;
    } else {
      const scale = SCALES[index] ?? SCALES[SCALES.length - 1]!;
      const scaleWord = value === 1 ? scale.singular : scale.plural;
      words = value === 1 ? `um ${scaleWord}` : `${base} ${scaleWord}`;
    }
    parts.push({ words, value, index });
  });

  parts.sort((a, b) => b.index - a.index);

  let result = "";
  parts.forEach((part, i) => {
    if (i === 0) {
      result = part.words;
      return;
    }
    const isLast = i === parts.length - 1;
    const useE = isLast && (part.value < 100 || part.value % 100 === 0);
    result += `${useE ? " e " : ", "}${part.words}`;
  });

  return result;
}

/** Ex.: 1234.5 -> "mil, duzentos e trinta e quatro reais e cinquenta centavos" */
export function valorPorExtenso(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "";
  const totalCents = Math.round(value * 100);
  const reais = Math.floor(totalCents / 100);
  const centavos = totalCents % 100;

  const reaisWords = integerToWords(reais);
  const reaisLabel = reais === 1 ? "real" : "reais";
  let result = `${reaisWords} ${reaisLabel}`;

  if (centavos > 0) {
    const centavosWords = integerToWords(centavos);
    const centavosLabel = centavos === 1 ? "centavo" : "centavos";
    result += ` e ${centavosWords} ${centavosLabel}`;
  }

  return result;
}

export function formatCurrencyBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
