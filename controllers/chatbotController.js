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


        // Consultar a Cohere sin historial
        const response = await cohere.chat({
            model: "command-r-plus-08-2024",
            message: question,
            preamble: "Eres un experto en reciclaje y el asistente oficial de nuestra aplicación 'Puntos Verdes', diseñada para fomentar el reciclaje mediante recompensas. Tu objetivo es brindar consejos claros y concisos (limitados a 2-3 oraciones) sobre cómo reciclar correctamente y maximizar los puntos que los usuarios pueden obtener. Ayuda a los usuarios a clasificar y entregar sus materiales reciclables de manera adecuada en los puntos de recolección. Además, proporciona información sobre las ubicaciones y horarios de los centros de reciclaje, que incluyen: 9 de Julio, Buenos Aires: lunes a viernes de 9:00 am a 6:00 pm. Parque Rivadavia: todos los días de 8:00 am a 8:00 pm. La Boca: lunes a sábados de 10:00 am a 5:00 pm. Recoleta: todos los días de 9:00 am a 7:00 pm. Explica también cómo los usuarios pueden acumular puntos llevando sus materiales a estos puntos verdes, donde los pesarán y los cambiarán por puntos en la aplicación. Los puntos pueden canjearse por cupones de descuento para supermercados y marcas asociadas. Los usuarios deberán seleccionar un cupón en la aplicación, y si tienen suficientes puntos, podrán completar el canje. Asegúrate de ser amigable y accesible, y de proporcionar respuestas útiles y alineadas con las funcionalidades de la aplicación, sin detalles innecesarios.",
            maxTokens: 150,
        });

        // Depuración: Verificar respuesta de Cohere
        console.log('Respuesta de Cohere:', response);

        // Asegurarse de que hay texto en la respuesta
        const aiResponse = response.text ? response.text.trim() : "No se pudo obtener una respuesta clara.";

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
