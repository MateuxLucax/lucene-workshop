// Based on: https://www.inf.ufrgs.br/~viviane/rslp/index.htm

/**
 * Stemmer for the Portuguese language.
 *
 * @param {string} word - The word to be stemmed.
 *
 * @returns {string} The stemmed word.
 */
export default function stemmer(word) {
  if (typeof word !== "string") {
    throw new Error("Word must be a string");
  }

  let stem = word.toLowerCase();

  if (stem.endsWith("s")) {
    stem = pluralReduction(stem);
  }

  if (stem.endsWith("a") || stem.endsWith("ã")) {
    stem = feminineReduction(stem);
  }

  stem = augumentativeReduction(stem);

  stem = adverbReduction(stem);

  let beforeStem = stem;

  stem = nounReduction(stem);

  if (stem == beforeStem) {
    return removeAccents(stem);
  }

  beforeStem = stem;
  stem = verbReduction(stem);

  if (stem == beforeStem) {
    return removeAccents(stem);
  }

  stem = removeVowels(stem);

  return removeAccents(stem);
}

/**
 * Reduce a word from its plural form.
 *
 * @param {string} word - The word to be stemmed.
 *
 * @returns {string} The stemmed word.
 */
function pluralReduction(word) {
  const rules = [
    // bons -> bom
    { suffix: "ns", replacement: "m" },
    // balões -> balão
    { suffix: "ões", replacement: "ão" },
    // capitães -> capitão
    { suffix: "ães", replacement: "ão", exceptions: ["mães"] },
    // casas -> casa
    { suffix: "as", replacement: "a" },
    // testes -> test
    { suffix: "es", exceptions: ["mes", "fregues", "interesses"] },
  ];

  return applyRules(word, rules);
}

/**
 * Reduce a word from its feminine form.
 *
 * @param {string} word - The word to be stemmed.
 *
 * @returns {string} The stemmed word.
 */
function feminineReduction(word) {
  const rules = [
    // chefona -> chefão
    { suffix: "ona", replacement: "ão" },
    // brasileira -> brasileiro
    { suffix: "eira", replacement: "eiro", exceptions: ["poeira"] },
    // paulista -> paulisto
    { suffix: "ista", replacement: "isto", exceptions: ["vista"] },
    // presidenta -> presidente
    { suffix: "enta", replacement: "ente" },
  ];

  return applyRules(word, rules);
}

/**
 * Reduce a word from its augmentative (and diminutive) form.
 *
 * @param {string} word - The word to be stemmed.
 *
 * @returns {string} The stemmed word.
 */
function augumentativeReduction(word) {
  const rules = [
    // grandão -> grand
    { suffix: "ão", exceptions: ["pão", "mão", "chimarrão"] },
    // pezinho -> pe
    { suffix: "zinho" },
    // cidadão -> cidad
    { suffix: "idão" },
  ];

  return applyRules(word, rules);
}

/**
 * Reduce a word from its adverb form.
 *
 * @param {string} word - The word to be stemmed.
 *
 * @returns {string} The stemmed word.
 */
function adverbReduction(word) {
  const rules = [
    // felizmente -> feliz
    { suffix: "mente", exceptions: ["realmente", "experimente"] },
  ];

  return applyRules(word, rules);
}

/**
 * Reduce a word from its noun form.
 *
 * @param {string} word - The word to be stemmed.
 * @returns {string} The stemmed word.
 */
function nounReduction(word) {
  const rules = [
    // americano -> améric
    { suffix: "ano" },
    // criminal -> crim
    { suffix: "inal" },
    // decorrente -> decorr
    { suffix: "ente", exceptions: ["frequente", "alimente"] },
  ];

  return applyRules(word, rules);
}

/**
 * Remove accents from a word.
 *
 * @param {string} word - The word to be stemmed.
 *
 * @returns {string} The stemmed word.
 */
function removeAccents(word) {
  const accentsRegex = /[\u0300-\u036f]/g;

  return word.normalize("NFD").replace(accentsRegex, "");
}

/**
 * Reduce a word from its verb form.
 *
 * @param {string} word - The word to be stemmed.
 *
 * @returns {string} The stemmed word.
 */
function verbReduction(word) {
  const rules = [
    // cantando -> cant
    { suffix: "ando" },
    // bebendo -> beb
    { suffix: "endo" },
    // propondo -> prop
    { suffix: "endo" },
    // partírei -> part
    { suffix: "irei", exceptions: ["admirei"] },
    // partirem -> part
    { suffix: "irem", exceptions: ["admirem"] },
    // bebiam -> beb
    { suffix: "iam", exceptions: ["enfiam", "ampliam", "elogiam", "ensaiam"] },
  ];

  return applyRules(word, rules);
}

/**
 * Reduce a word from its vowels.
 *
 * @param {string} word - The word to be stemmed.
 *
 * @returns {string} The stemmed word.
 */
function removeVowels(word) {
  const rules = [
    // menino -> menin
    { suffix: "o", exceptions: ["pão", "mão", "chimarrão"] },
    // menina -> menin
    { suffix: "a", exceptions: ["pá", "má", "ásia", "águia"] },
  ];

  return applyRules(word, rules);
}

/**
 * Apply a set of rules to a word.
 *
 * @param {string} word - The word to be stemmed.
 * @param {{ suffix: string, replacement?: string, exceptions?: string[] }[]} rules - The rules to be applied.
 *
 * @returns {string} The stemmed word.
 */
function applyRules(word, rules) {
  for (const rule of rules) {
    if (!word.endsWith(rule.suffix)) continue;
    if (rule.exceptions && rule.exceptions.includes(word)) continue;

    return word.slice(0, -rule.suffix.length) + (rule.replacement || "");
  }

  return word;
}
