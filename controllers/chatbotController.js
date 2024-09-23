import { CohereClient } from 'cohere-ai';
import predefinedQuestions from '../utils/chatbot/questions.json' assert { type: 'json' };

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

export const handleRecyclingQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;

    // Verificar preguntas predefinidas
    const predefinedAnswer = predefinedQuestions.find(q => 
      q.question.toLowerCase() === question.toLowerCase()
    );

    if (predefinedAnswer) {
      return res.json({ answer: predefinedAnswer.answer });
    }

    // Comprobar si la pregunta está relacionada con reciclaje
    const keywords = ["reciclaje", "puntos", "materiales", "aplicación"];
    const isRelated = keywords.some(keyword => question.toLowerCase().includes(keyword));

    if (!isRelated) {
      return res.status(400).json({ error: 'La pregunta no está relacionada con reciclaje o la aplicación.' });
    }

    // Consultar a Cohere
    const response = await cohere.chat({
      message: question,
      roles: [{ role: 'CHATBOT', content: 'Eres un experto en reciclaje y debes proporcionar respuestas que cualquier persona pueda entender y que correspondan a la aplicación. La aplicación que gestiones intercambia materiales por puntos que puedes canjear por descuentos.' }],
    });

    console.log(response); // Verificar respuesta de Cohere

    if (!response.body || !response.body.generations || response.body.generations.length === 0) {
      return res.status(500).json({ error: 'No se pudo obtener una respuesta de Cohere.' });
    }

    const aiResponse = response.body.generations[0].text.trim();
    res.json({ answer: aiResponse });
    
  } catch (error) {
    console.error('Error en el controlador:', error);
    next(error);
  }
};

