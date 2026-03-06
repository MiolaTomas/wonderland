export function useSpeech() {
  function speak(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }

  return { speak };
}
// The speakWord function uses the Web Speech API to vocalize the selected word.It creates a new SpeechSynthesisUtterance, sets the language to English(US), and adjusts the speaking rate for better clarity.When a user clicks on a word in the story, this function is called to provide an auditory representation of the word, enhancing the learning experience.
