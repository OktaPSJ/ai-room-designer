// Vercel Serverless Function - Proxy for Cloudflare AI Image Generation
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
        const { prompt, num_steps, guidance } = req.body;
        const IMAGE_MODEL = '@cf/stabilityai/stable-diffusion-xl-base-1.0';

        const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${IMAGE_MODEL}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                num_steps: num_steps || 20,
                guidance: guidance || 7.5,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        // Stable Diffusion returns raw image bytes
        const imageBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(imageBuffer).toString('base64');

        return res.status(200).json({
            success: true,
            data: base64,
            mimeType: 'image/png'
        });
    } catch (error) {
        console.error('Image generation error:', error);
        return res.status(500).json({ error: error.message });
    }
}
