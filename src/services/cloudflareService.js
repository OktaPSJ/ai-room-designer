const API_TOKEN = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;

// Using Llama 3.2 11B Vision Instruct for image analysis
const VISION_MODEL = '@cf/meta/llama-3.2-11b-vision-instruct';
// Using Stable Diffusion XL for image generation
const IMAGE_MODEL = '@cf/stabilityai/stable-diffusion-xl-base-1.0';

/**
 * Convert image file to base64
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Convert base64 string to array of integers (uint8)
 */
function base64ToUint8Array(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return Array.from(bytes);
}

/**
 * Generate room design image using Stable Diffusion
 */
async function generateRoomImage(roomStyle) {
    if (!API_TOKEN || !ACCOUNT_ID) {
        return null;
    }

    try {
        const imagePrompt = `Interior design photograph of a ${roomStyle} style living room, professional interior photography, high quality, 8k, realistic lighting, modern furniture, elegant decor, architectural digest style, wide angle shot`;

        // Use Vercel API route in production, Vite proxy in development
        const apiUrl = import.meta.env.DEV
            ? `/api/cloudflare/client/v4/accounts/${ACCOUNT_ID}/ai/run/${IMAGE_MODEL}`
            : '/api/generate-image';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                ...(import.meta.env.DEV ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: imagePrompt,
                num_steps: 20,
                guidance: 7.5,
            }),
        });

        if (!response.ok) {
            return null;
        }

        if (import.meta.env.DEV) {
            // Dev mode: Stable Diffusion returns raw image bytes via proxy
            const imageBlob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result.split(',')[1];
                    resolve({
                        data: base64,
                        mimeType: 'image/png'
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(imageBlob);
            });
        } else {
            // Production: Vercel API returns JSON with base64
            const result = await response.json();
            if (result.success && result.data) {
                return {
                    data: result.data,
                    mimeType: result.mimeType || 'image/png'
                };
            }
            return null;
        }

    } catch (error) {
        console.error('Image generation failed:', error);
        return null;
    }
}

export async function analyzeRoom(imageFile, roomStyle, customContext = '') {
    if (!API_TOKEN || !ACCOUNT_ID) {
        throw new Error('Cloudflare API not configured. Please contact admin.');
    }

    try {
        const base64Image = await fileToBase64(imageFile);
        const imageArray = base64ToUint8Array(base64Image);

        const prompt = `Kamu adalah desainer interior profesional. Analisis foto ruangan ini dan berikan saran desain dengan gaya ${roomStyle}.
${customContext ? `Permintaan khusus: ${customContext}\n` : ''}

Berikan rekomendasi dalam format berikut (dalam Bahasa Indonesia):

**Penilaian Keseluruhan:**
[Deskripsi singkat kondisi ruangan]

**Palet Warna:**
- Warna utama: [warna dengan kode hex]
- Warna aksen: [warna dengan kode hex]

**Rekomendasi Furnitur:**
1. [Item] - [Penempatan dan alasan]
2. [Item] - [Penempatan dan alasan]
3. [Item] - [Penempatan dan alasan]

**Dekorasi & Pencahayaan:**
- [Saran dekorasi]
- [Saran pencahayaan]

**Tips Hemat Budget:**
- [Tips 1]
- [Tips 2]

Berikan saran praktis untuk gaya ${roomStyle}.`;

        // Use Vercel API route in production, Vite proxy in development
        const apiUrl = import.meta.env.DEV
            ? `/api/cloudflare/client/v4/accounts/${ACCOUNT_ID}/ai/run/${VISION_MODEL}`
            : '/api/analyze';

        // Run vision analysis and image generation in parallel
        const [visionResponse, generatedImage] = await Promise.all([
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    ...(import.meta.env.DEV ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    image: imageArray,
                }),
            }),
            generateRoomImage(roomStyle).catch(() => null)
        ]);

        const result = await visionResponse.json();

        if (!visionResponse.ok) {
            throw new Error(result.errors?.[0]?.message || 'Failed to analyze image');
        }

        return {
            success: true,
            suggestions: result.result?.response || 'No response from AI',
            generatedImage: generatedImage,
            style: roomStyle,
        };

    } catch (error) {
        console.error('Analysis error:', error);
        throw new Error(`AI Analysis Failed: ${error.message}`);
    }
}

export function isApiKeyConfigured() {
    return !!(API_TOKEN && ACCOUNT_ID);
}
