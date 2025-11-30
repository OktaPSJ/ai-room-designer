
const API_TOKEN = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;

// Using Llama 3.2 11B Vision Instruct for image analysis
const VISION_MODEL = '@cf/meta/llama-3.2-11b-vision-instruct';
// Using Stable Diffusion XL for image generation
const IMAGE_MODEL = '@cf/stabilityai/stable-diffusion-xl-base-1.0';

/**
 * Convert image file to array of integers (required for some CF models) 
 * OR base64 depending on the specific model requirements.
 * Llama 3.2 Vision usually accepts an array of integers or a URL.
 * For direct upload via REST API, we often send the input object.
 * 
 * Input format for @cf/meta/llama-3.2-11b-vision-instruct:
 * {
 *   "prompt": "string",
 *   "image": [int, int, ...] // or base64 string if supported by the worker shim, but standard API often wants array
 * }
 * 
 * However, standard CF AI API often handles base64 in "image" field for vision models.
 * Let's try sending base64 string first.
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Remove data:image/jpeg;base64, prefix
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Convert base64 string to array of integers (uint8)
 * Some CF models require this format.
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

export async function analyzeRoom(imageFile, roomStyle, customContext = '') {
    console.log('=== DEBUG: analyzeRoom called ===');
    console.log('API_TOKEN exists:', !!API_TOKEN);
    console.log('ACCOUNT_ID:', ACCOUNT_ID);
    console.log('VISION_MODEL:', VISION_MODEL);
    console.log('Room Style:', roomStyle);
    console.log('Image file:', imageFile?.name, imageFile?.size, 'bytes');

    if (!API_TOKEN || !ACCOUNT_ID) {
        throw new Error('Cloudflare configuration missing. Please check VITE_CLOUDFLARE_API_TOKEN and VITE_CLOUDFLARE_ACCOUNT_ID in .env');
    }

    try {
        console.log('=== DEBUG: Converting image to base64 ===');
        const base64Image = await fileToBase64(imageFile);
        console.log('Base64 length:', base64Image.length);

        // Convert to integer array as often required by CF AI REST API for binary data
        const imageArray = base64ToUint8Array(base64Image);
        console.log('Image array length:', imageArray.length);

        const prompt = `Analyze this room image and provide comprehensive interior design suggestions for a ${roomStyle} style.
${customContext ? `User's specific requirements: ${customContext}\n` : ''}

Please provide detailed recommendations in the following format:

**Overall Assessment:**
[Brief description]

**Color Palette:**
- Primary colors: [hex codes]
- Accent colors: [hex codes]

**Furniture Recommendations:**
1. [Item] - [Placement]
2. [Item] - [Placement]

**Decor & Lighting:**
- [Suggestion]

**Budget Tips:**
- [Tip]

Make the suggestions practical and specific to ${roomStyle} style.`;

        // Use proxy in development to avoid CORS
        const apiUrl = import.meta.env.DEV
            ? `/api/cloudflare/client/v4/accounts/${ACCOUNT_ID}/ai/run/${VISION_MODEL}`
            : `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${VISION_MODEL}`;

        console.log('=== DEBUG: Sending request ===');
        console.log('API URL:', apiUrl);
        console.log('Prompt length:', prompt.length);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                image: imageArray,
            }),
        });

        console.log('=== DEBUG: Response received ===');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        const result = await response.json();
        console.log('=== DEBUG: Full API Response ===');
        console.log(JSON.stringify(result, null, 2));

        if (!response.ok) {
            throw new Error(result.errors?.[0]?.message || 'Failed to fetch from Cloudflare AI');
        }

        // Llama 3.2 Vision response format: { result: { response: "string" } }
        console.log('=== DEBUG: Extracted suggestions ===');
        console.log('Suggestions:', result.result?.response);

        return {
            success: true,
            suggestions: result.result?.response || 'No response from AI',
            style: roomStyle,
        };

    } catch (error) {
        console.error('=== DEBUG: Error ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        throw new Error(`AI Analysis Failed: ${error.message}`);
    }
}

export function isApiKeyConfigured() {
    return !!API_TOKEN && !!ACCOUNT_ID;
}

/**
 * Generate room design image using Stable Diffusion
 */
export async function generateRoomImage(roomStyle, suggestions) {
    console.log('=== DEBUG: generateRoomImage called ===');
    console.log('Room Style:', roomStyle);

    if (!API_TOKEN || !ACCOUNT_ID) {
        throw new Error('Cloudflare configuration missing');
    }

    try {
        // Create a concise prompt for image generation based on room style
        const imagePrompt = `Interior design photograph of a ${roomStyle} style living room, professional interior photography, high quality, 8k, realistic lighting, modern furniture, elegant decor, architectural digest style, wide angle shot`;

        console.log('=== DEBUG: Image generation prompt ===');
        console.log('Prompt:', imagePrompt);

        const apiUrl = import.meta.env.DEV
            ? `/api/cloudflare/client/v4/accounts/${ACCOUNT_ID}/ai/run/${IMAGE_MODEL}`
            : `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${IMAGE_MODEL}`;

        console.log('=== DEBUG: Sending image generation request ===');
        console.log('API URL:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: imagePrompt,
                num_steps: 20,
                guidance: 7.5,
            }),
        });

        console.log('=== DEBUG: Image generation response ===');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        console.log('Content-Type:', response.headers.get('content-type'));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error('Failed to generate image');
        }

        // Stable Diffusion returns raw image bytes
        const imageBlob = await response.blob();
        console.log('=== DEBUG: Image blob received ===');
        console.log('Blob size:', imageBlob.size);
        console.log('Blob type:', imageBlob.type);

        // Convert blob to base64 data URL
        const imageUrl = URL.createObjectURL(imageBlob);
        console.log('=== DEBUG: Image URL created ===');
        console.log('URL:', imageUrl);

        return {
            success: true,
            imageUrl: imageUrl,
            style: roomStyle,
        };

    } catch (error) {
        console.error('=== DEBUG: Image generation error ===');
        console.error('Error:', error);
        throw new Error(`Image Generation Failed: ${error.message}`);
    }
}
