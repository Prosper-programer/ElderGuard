import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL;
    const prompt = 'Test prompt';
    
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.4, maxOutputTokens: 80 }
                }),
            }
        );
        
        console.log('STATUS:', response.status);
        const data = await response.json();
        console.log('DATA:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('ERROR:', err);
    }
}
test();
