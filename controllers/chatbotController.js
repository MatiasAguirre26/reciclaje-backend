import { CohereClient } from 'cohere-ai';
import predefinedQuestions from '../utils/chatbot/questions.json' assert { type: 'json' };

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

export const handleRecyclingQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;

  
    const predefinedAnswer = predefinedQuestions.find(q => 
      q.question.toLowerCase() === question.toLowerCase()
    );

    if (predefinedAnswer) {
      return res.json({ answer: predefinedAnswer.answer });
    }

   
    const response = await cohere.chat({
        message: question,
        roles: [{ role: 'CHATBOT', content: 'Eres un experto en reciclaje y debes proporcionar respuestas que cualquier persona pueda entender y las respuestas deben corresponder a la aplicación. La aplicación que gestiones intercambia materiales por puntos que puedes canjear por descuentos.' }],
      });
      

    console.log(response); 

    if (!response.body || !response.body.generations || response.body.generations.length === 0) {
        return res.status(500).json({ error: 'No se pudo obtener una respuesta de Cohere.' });
      }
       
      const aiResponse = response.body.generations[0].text.trim();

  
    res.json({ answer: aiResponse });
  } catch (error) {
    next(error);
  }
};
