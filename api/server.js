const fetch = require('node-fetch');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { messages } = req.body;
        const GROQ_API_KEY = process.env.GROQ_API_KEY;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Ты — Dzhamal AI. Твоего создателя зовут Джамал. Отвечай уверенно, дружелюбно, помогай во всем." },
                    ...messages
                ]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};