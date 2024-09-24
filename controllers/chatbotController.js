import { CohereClient } from 'cohere-ai';
import predefinedQuestions from '../utils/chatbot/questions.json' assert { type: 'json' };

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

export const handleRecyclingQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;

    // Verificar la pregunta recibida
    console.log('Pregunta recibida:', question);

    const predefinedAnswer = predefinedQuestions.find(q =>
        question.toLowerCase().includes(q.question.toLowerCase())
    );    

    if (predefinedAnswer) {
      return res.json({ answer: predefinedAnswer.answer });
    }

    const keywords = ["reciclaje", "puntos", "materiales", "aplicación", "clasifico", "plastico", "vidrio", "papel", "latas"];
    const isRelated = keywords.some(keyword => question.toLowerCase().includes(keyword));

    if (!isRelated) {
      return res.status(400).json({ error: 'La pregunta no está relacionada con reciclaje o la aplicación.' });
    }

    // Crear el historial de chat
    const chatHistory = [
      { role: 'USER', message: question },
      {
        role: 'CHATBOT',
        message: 'Eres un experto en reciclaje y debes proporcionar respuestas que cualquier persona pueda entender y que correspondan a la aplicación. La aplicación que gestionas intercambia materiales por puntos que puedes canjear por descuentos. Las respuestas deben ser cortas y no debes daar mas de una respuesta.',
      },
    ];

    // Consultar a Cohere
    const response = await cohere.chat({
      chatHistory, // Usar la variable de historial de chat
      message: question,
      connectors: [{ id: 'web-search' }], // Añadir conectores si es necesario
    });

    // Depuración: Verificar respuesta de Cohere
    console.log('Respuesta de Cohere:', response);

    if (!response || !response.generations || response.generations.length === 0) {
      console.error('Error de Cohere:', response);
      return res.status(500).json({ error: 'No se pudo obtener una respuesta de Cohere.' });
    }

    const aiResponse = response.generations[0].text.trim();
    return res.json({ answer: aiResponse });

  } catch (error) {
    console.error('Error en el controlador:', error);
    return next(error);
  }
};
