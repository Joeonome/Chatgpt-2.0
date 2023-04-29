const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3080;

const configuration = new Configuration({
    organization: "org-uue1cHXLc8WlK8lIsScQYqKH",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);


// console.log(process.env.OPENAI_API_KEY);


app.post('/', async (req, res) => {
    const { message, currentModel } = req.body;
    console.log(currentModel, "currentModel");
    const response = await openai.createCompletion({
         model: `${currentModel}`,
         prompt: `${message}`,
         max_tokens: 100,
         temperature: 0.5,
       });
       
       res.json({
        message: response.data.choices[0].text
      })
}); 

app.get('/models', async (req, res) => {
    const response = await openai.listEngines();
    res.json({
        models: response.data
    })
});

app.listen(port, () => {
    console.log(`Version 2 running @ http://localhost:${port}`);
})