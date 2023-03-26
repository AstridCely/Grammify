const { response, request } = require("express");
const LanguageDetect = require("languagedetect");
const { translate } = require("@vitalets/google-translate-api");
const { openai } = require("../openai/config");

const translateToEnglish = async (prompt) => {
  const result = await translate(prompt, { to: "en" });
  return result.text;
};

const initialApp = async (req, res = response) => {
  res.status(200).send({
    message: "Hello from Grammify",
  });
};

const sendPrompt = async (req = request, res = response) => {
  try {
    let prompt = req.body.prompt;

    const detectLanguage = (prompt) => {
      const detector = new LanguageDetect();
      detector.setLanguageType("iso2");
      const languages = detector.detect(prompt);
      if (languages.length > 0) {
        return languages[0][0];
      } else {
        return null;
      }
    };

    const promptLanguage = detectLanguage(prompt);
    if (promptLanguage !== "en") {
      if (promptLanguage == null) {
      } else {
        prompt = await translateToEnglish(prompt);
        console.log({ prompt, promptLanguage });
      }
    }

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Correct this to standard English:\n\n${prompt}.`,
      temperature: 0,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
    });
  }
};

module.exports = {
  initialApp,
  sendPrompt,
};
