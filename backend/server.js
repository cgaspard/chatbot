const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors'); // Import the cors package
const dotenv = require('dotenv');
const path = require('path');
const { passport, generateToken } = require('./auth');


const sequelize = require('./database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQLite');
  } catch (error) {
    console.error('Error connecting to SQLite:', error);
  }
})();

// Load the environment variables from .env.local file
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.post(
  '/auth/google/callback',
  (req, res, next) => {
    passport.authenticate('google-token', { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      const token = generateToken(user);
      res.json({ token });
    })(req, res, next);
  }
);


// app.use(async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.sendStatus(401);
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch (err) {
//     res.sendStatus(401);
//   }
// });

app.post('/message', async (req, res) => {
  try {
    const { prompt, temperature } = req.body;
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `ChatGPT: ${prompt}`,
        max_tokens: 4000,
        n: 1,
        stop: null,
        temperature: parseFloat(temperature) || 0.5
      });
  
      const reply = response.data.choices[0].text.trim();
      res.json({ reply: reply, code: isCode(decodeURI(reply)) });
      
      console.log(response.data);
  
    } catch (error) {

      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  function isCode(text) {
    const codePatterns = [
      // Variable declarations, assignment, and function calls
      /\w+\s*(?:\(|\s*=\s*|\s*\+=\s*|\s*-=\s*|\s*\*=\s*|\s*\/=)/g,
      // Control structures (if, while, for, switch, case)
      /\b(?:if|while|for|switch|case)\b/g,
      // Class and function declarations
      /\b(?:class|function|def)\b/g,
      // Imports and includes
      /\b(?:import|from|require|#include|using)\b/g,
      // Code comments
      /(?:\/\/|\/\*|\*\/|<!--|--|-->|#)/g,
      // Curly braces and brackets
      /[{}[\]]/g,
      // Operators
      /(?:[+\-*/%&|^<>]=?|==|!=|===|!==|<=|>=|&&|\|\||!|~|>>|<<|>>>|<<<)/g,
    ];
  
    const minOccurrences = 4;
  
    return codePatterns.some((pattern) => {
      const matches = text.match(pattern);
      return matches && matches.length >= minOccurrences;
    });
  }
  
  
