import fs from "fs";
import readline from "readline";
import nlp from "compromise";

const slug = process.argv[2];
if (!slug) {
  console.error("❌ Usage: node buildDictionary.js <story-slug>");
  process.exit(1);
}

const STORY_FILE = `app/data/stories/${slug}.json`;
const EN_DICTIONARY_FILE = "./kaikki.org-dictionary-English.jsonl";

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

const CONTRACTIONS = {
  "don't": "do",
  "doesn't": "do",
  "didn't": "do",
  "won't": "will",
  "can't": "can",
  "couldn't": "could",
  "wouldn't": "would",
  "shouldn't": "should",
  "isn't": "be",
  "aren't": "be",
  "wasn't": "be",
  "weren't": "be",
  "haven't": "have",
  "hasn't": "have",
  "hadn't": "have",
  "it's": "it",
  "he's": "he",
  "she's": "she",
  "that's": "that",
  "what's": "what",
  "i'm": "i",
  "i've": "i",
  "i'll": "i",
  "i'd": "i",
  "you're": "you",
  "you've": "you",
  "you'll": "you",
  "you'd": "you",
  "they're": "they",
  "they've": "they",
  "they'll": "they",
  "they'd": "they",
  "we're": "we",
  "we've": "we",
  "we'll": "we",
  "we'd": "we",
  "he'd": "he",
  "she'd": "she",
  "it'd": "it",
  "there's": "there",
  "here's": "here",
  "who's": "who",
  "how's": "how",
};

function expandContraction(word) {
  return CONTRACTIONS[word.toLowerCase()] ?? null;
}

function lemmatize(word) {
  // First check if it's a contraction — skip NLP entirely
  const expanded = expandContraction(word);
  if (expanded) return expanded;

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
  if (!fs.existsSync(STORY_FILE)) {
    console.error(`❌ Story file not found: ${STORY_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(STORY_FILE, "utf-8");
  const story = JSON.parse(raw);

  // Normalize smart apostrophes in all words
  story.words = story.words.map((w) =>
    typeof w === "string" ? w.replace(/[‘’‚‛′‵]/g, "'") : w,
  );
  console.log(`📖 Processing: "${story.title}"`);

  const manualDictionary = story.dictionary || {};

  // ─── Lemmatize ────────────────────────────────────────────────────────────
  const rawWords = new Set(
    story.words
      .filter((w) => /^[a-zA-Z']+$/.test(w))
      .map((w) => w.toLowerCase()),
  );

  const lemmaMap = new Map();
  for (const word of rawWords) {
    lemmaMap.set(word, lemmatize(word).toLowerCase());
  }

  const targetLemmas = new Set(lemmaMap.values());
  const kaikkiData = new Map();

  // ─── Read Kaikki ──────────────────────────────────────────────────────────
  console.log("🔍 Reading Kaikki dictionary...");
  await readLines(EN_DICTIONARY_FILE, (line) => {
    const entry = JSON.parse(line);
    if (entry.lang !== "English") return;
    const word = entry.word.toLowerCase();
    if (!targetLemmas.has(word) || kaikkiData.has(word)) return;

    const sense = entry.senses?.find((s) => s.glosses);
    const esTrans = entry.translations?.find(
      (t) => t.lang === "Spanish" && t.word,
    );

    kaikkiData.set(word, {
      part_of_speech: normalizePOS(entry.pos),
      definition_en: sense?.glosses?.[0] || "",
      definition_es: esTrans?.word || "",
      example_en: sense?.examples?.[0]?.text || "",
      example_es: "",
      ipa: entry.sounds?.find((s) => s.ipa)?.ipa || "",
    });

    console.log("  ✅", word);
  });

  // ─── Enrich words ─────────────────────────────────────────────────────────
  const enrichedWords = story.words.map((w) => {
    if (!/^[a-zA-Z']+$/.test(w)) return { word: w, punctuation: true };

    const original = w.toLowerCase();
    const lemma = lemmaMap.get(original) || original;
    const manualEntry = manualDictionary[original] || manualDictionary[lemma];
    const kaikkiEntry = kaikkiData.get(lemma);

    if (manualEntry) {
      return {
        word: w,
        part_of_speech: kaikkiEntry?.part_of_speech || "",
        definition_en: kaikkiEntry?.definition_en || "",
        definition_es:
          manualEntry.translation || kaikkiEntry?.definition_es || "",
        example_en: manualEntry.example || kaikkiEntry?.example_en || "",
        example_es: "",
        ipa: kaikkiEntry?.ipa || "",
      };
    }

    if (kaikkiEntry) return { word: w, ...kaikkiEntry };
    return { word: w };
  });

  // ─── Recalculate minutes ──────────────────────────────────────────────────
  const wordCount = enrichedWords.filter((w) => !w.punctuation).length;
  const minutes = Math.ceil(wordCount / 200);

  // ─── Write back ───────────────────────────────────────────────────────────
  const updatedStory = {
    ...story,
    wordCount,
    minutes,
    words: enrichedWords,
    dictionary: manualDictionary,
  };

  fs.writeFileSync(STORY_FILE, JSON.stringify(updatedStory, null, 2));
  console.log(`\n✅ Done! Updated: ${STORY_FILE}`);
  console.log(
    `   📊 Enriched: ${enrichedWords.filter((w) => !w.punctuation && w.definition_en).length}`,
  );
  console.log(
    `   ⚠️  Not found: ${enrichedWords.filter((w) => !w.punctuation && !w.definition_en).length}`,
  );
  console.log(`   🕐 Reading time: ~${minutes} min`);
}

buildDictionary();
