# AI Room Designer

Transform ruangan Anda dengan kekuatan AI! Upload foto ruangan kosong dan dapatkan saran desain interior yang menakjubkan dari Google Gemini AI.

## 🌟 Features

### Free Tier
- ✅ 3 uploads per hari
- ✅ 3 basic room styles
- ✅ AI design suggestions
- ⚠️ Watermark pada hasil
- 📢 Tampil iklan

### Premium Tier (Rp 99.000/bulan)
- ✨ Unlimited uploads
- 🎨 15+ room styles
- 🚫 No watermark
- 📸 High-resolution export
- 💾 Save & manage projects
- ⚡ Priority processing
- 🎯 No ads

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Gemini API key (free from Google AI Studio)

### Installation

1. Clone or navigate to the project directory:
```bash
cd AIGeneratorArchitecture
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Get your free Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

4. Configure environment variables:
```bash
# Edit .env file and add your API key
VITE_GEMINI_API_KEY=your_api_key_here
```

5. Start the development server:

**Option 1: Using start script (Recommended)**
```bash
# Mac/Linux
./start_server.sh

# Windows
start_server.bat
```

**Option 2: Using npm directly**
```bash
npm run dev
```

6. Open your browser and visit: `http://localhost:5173`

## 🎨 How to Use

1. **Upload Photo**: Drag & drop atau klik untuk upload foto ruangan kosong
2. **Choose Style**: Pilih style ruangan yang Anda inginkan (Modern, Scandinavian, Industrial, dll)
3. **Add Context** (Optional): Berikan detail spesifik tentang preferensi Anda
4. **Generate**: Klik tombol "Generate AI Design Suggestions"
5. **Review**: Lihat saran desain AI yang komprehensif
6. **Download/Share**: Simpan atau bagikan hasil desain Anda

## 🔧 Tech Stack

- **Frontend**: React 18 + Vite
- **AI**: Google Gemini 2.0 Flash API
- **Styling**: Vanilla CSS with modern design system
- **Icons**: Lucide React
- **Camera**: React Webcam

## 📊 Gemini API Free Tier Limits

- **Requests per minute**: 15
- **Requests per day**: 1,500
- **Cost**: FREE forever for Gemini 2.0 Flash

## 🎯 Monetization Strategy

1. **Google AdSense**: Ads for free tier users
2. **Premium Subscriptions**: Rp 99.000/bulan
3. **Affiliate Links**: Furniture and decor recommendations (future)

## 🏗️ Project Structure

```
AIGeneratorArchitecture/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── ImageUploader.jsx
│   │   ├── RoomStyleSelector.jsx
│   │   ├── AIResultDisplay.jsx
│   │   ├── PricingSection.jsx
│   │   └── AdPlaceholder.jsx
│   ├── services/
│   │   └── geminiService.js
│   ├── utils/
│   │   ├── auth.js
│   │   └── usageTracker.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## 🔐 Authentication

Current implementation uses localStorage for demo purposes. For production:
- Implement proper backend authentication
- Add payment processing (Stripe/PayPal)
- Database for user management
- Subscription management system

## 📝 License

This project is for demonstration purposes.

## 🤝 Support

For issues or questions, please contact support.

---

Made with ❤️ using Google Gemini AI
