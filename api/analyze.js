// Vercel Serverless Function - Proxy for Cloudflare AI Vision API
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ACCOUNT_ID = process.env.VITE_CLOUDFLARE_ACCOUNT_ID;
    const API_TOKEN = process.env.VITE_CLOUDFLARE_API_TOKEN;

    if (!ACCOUNT_ID || !API_TOKEN) {
        return res.status(500).json({ error: 'Cloudflare API not configured' });
    }

    try {
        const { prompt, image } = req.body;
        const VISION_MODEL = '@cf/meta/llama-3.2-11b-vision-instruct';

        const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${VISION_MODEL}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                image: image,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Vision API error:', error);
        return res.status(500).json({ error: error.message });
    }
}
