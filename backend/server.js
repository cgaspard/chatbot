const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors'); // Import the cors package
const dotenv = require('dotenv');
const path = require('path');


// Load the environment variables from .env.local file
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

app.post('/message', async (req, res) => {
  try {
    const { prompt, temperature } = req.body;
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `ChatGPT: ${prompt}`,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: parseFloat(temperature) || 0.5
      });
  
      const reply = response.data.choices[0].text.trim();
      res.json({ reply });
  
    } catch (error) {

      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
