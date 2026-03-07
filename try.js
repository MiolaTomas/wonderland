import fs from "fs";
import readline from "readline";
import nlp from "compromise";

const STORY_FILE = "app/data/story.json";
const EN_DICTIONARY_FILE = "./kaikki.org-dictionary-English.jsonl";
const OUTPUT_FILE = "./words_data.json";

const POS_MAP = {
  noun: "noun",
  verb: "verb",
  adj: "adjective",
  adv: "adverb",
  name: "proper noun",
  pron: "pronoun",
  det: "determiner",
  prep: "preposition",
  conj: "conjunction",
  article: "article",
};

function normalizePOS(pos) {
  return POS_MAP[pos] || pos || "";
}

function lemmatize(word) {
  const doc = nlp(word);
  return (
    doc.verbs().toInfinitive().text() || doc.nouns().toSingular().text() || word
  );
}

async function readLines(file, onLine) {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });
  for await (const line of rl) onLine(line);
}

async function buildDictionary() {
  const story = JSON.parse(fs.readFileSync(STORY_FILE, "utf-8"));

  const rawWords = new Set(
    story.words
      .filter((w) => /^[a-zA-Z']+$/.test(w))
      .map((w) => w.toLowerCase()),
  );

  // Mapa: palabra original → lema
  const lemmaMap = new Map();
  for (const word of rawWords) {
    const lemma = lemmatize(word).toLowerCase();
    lemmaMap.set(word, lemma);
  }

  const targetLemmas = new Set(lemmaMap.values());
  const foundWords = new Map();

  // --- Paso 1: diccionario inglés ---
  console.log("📖 Leyendo diccionario inglés...");
  await readLines(EN_DICTIONARY_FILE, (line) => {
    const entry = JSON.parse(line);
    if (entry.lang !== "English") return;

    const word = entry.word.toLowerCase();
    if (!targetLemmas.has(word)) return;
    if (foundWords.has(word)) return;

    const pos = normalizePOS(entry.pos);
    const sense = entry.senses?.find((s) => s.glosses);
    const definition_en = sense?.glosses?.[0] || "";
    const example_en = sense?.examples?.[0]?.text || "";
    const ipa = entry.sounds?.find((s) => s.ipa)?.ipa || "";
    const esTrans = entry.translations?.find(
      (t) => t.lang === "Spanish" && t.word,
    );

    foundWords.set(word, {
      part_of_speech: pos,
      definition_en,
      definition_es: esTrans?.word || "",
      example_en,
      example_es: "",
      ipa,
    });

    console.log("✅ Found:", word);
  });

  // --- Paso 2: armar resultado ---
  const result = {
    words: story.words.map((w) => {
      if (!/^[a-zA-Z']+$/.test(w)) return { word: w, punctuation: true };

      const original = w.toLowerCase();
      const lemma = lemmaMap.get(original) || original;
      const data = foundWords.get(lemma);

      return data ? { word: w, ...data } : { word: w };
    }),
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log("\n✅ Finished:", OUTPUT_FILE);
}

buildDictionary();
