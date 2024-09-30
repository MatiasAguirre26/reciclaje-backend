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

        const keywords = ["reciclaje", "puntos", "materiales", "aplicación", "clasifico", "plástico", "vidrio", "papel", "latas"];
        const isRelated = keywords.some(keyword => question.toLowerCase().includes(keyword));

        if (!isRelated) {
            return res.status(400).json({ error: 'La pregunta no está relacionada con reciclaje o la aplicación.' });
        }

        // Consultar a Cohere sin historial
        const response = await cohere.chat({
            model: "command-r-plus-08-2024",
            message: question,
            preamble: 'Eres un experto en reciclaje y debes proporcionar respuestas claras y concisas, limitadas a 2-3 oraciones. Evita detalles innecesarios.',
            maxTokens: 150,
        });

        // Depuración: Verificar respuesta de Cohere
        console.log('Respuesta de Cohere:', response);

        // Asegurarse de que hay texto en la respuesta
        const aiResponse = response.body && response.body.text 
            ? response.body.text.trim() 
            : "No se pudo obtener una respuesta clara.";

        if (!aiResponse) {
            console.error('Error de Cohere: Respuesta vacía', response);
            return res.status(500).json({ error: 'No se pudo obtener una respuesta de Cohere.', details: response });
        }

        return res.json({ answer: aiResponse });

    } catch (error) {
        console.error('Error en el controlador:', error);
        return next(error);
    }
};
