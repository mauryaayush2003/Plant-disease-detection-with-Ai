# Plant Disease Detection with AI VEDA Chatbot

A comprehensive plant disease detection and AI-powered chatbot application that helps farmers and gardeners with plant health, disease identification, and care recommendations.

## Features

### 🌿 AI Plant Assistant (VEDA)
- **Multi-language Support**: English, Hindi (हिंदी)
- **Voice Input**: Speech-to-text functionality for hands-free interaction
- **Voice Output**: Text-to-speech with Sarvam AI for natural Hindi pronunciation
- **Smart Responses**: AI-powered plant care advice and disease information

### 📸 Plant Disease Detection
- **Image Analysis**: Upload plant images for AI-powered disease detection
- **Detailed Reports**: Get comprehensive analysis and recommendations
- **Treatment Guidance**: Receive care instructions and prevention tips

### 🎤 Voice Assistant Features
- **Speech Recognition**: Convert voice to text in multiple languages
- **Natural TTS**: High-quality Hindi text-to-speech using Sarvam AI API
- **Fallback System**: Browser-based TTS for English and error scenarios
- **Auto-send**: Voice input automatically sends messages to VEDA

### 🌐 Multi-language Support
- **English**: Full English language support
- **Hindi**: Complete Hindi interface and voice support
- **Voice Recognition**: Language-aware speech recognition
- **Localized Content**: All UI elements and responses in selected language

## Technology Stack

### Frontend
- **React**: Modern React application with hooks
- **Vite**: Fast development and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing

### APIs & Services
- **Google Gemini AI**: Plant disease analysis and chat responses
- **Sarvam AI**: High-quality Hindi text-to-speech
- **Web Speech API**: Browser-based speech recognition and synthesis
- **Google Translate TTS**: Fallback text-to-speech service

## Key Components

### Chat Interface
- Real-time messaging with VEDA AI assistant
- Quick action chips for common queries
- Image upload for plant analysis
- Voice input/output controls

### Language System
- Dynamic language switching
- Translation system with JSON-based translations
- Voice recognition language adaptation
- TTS language routing

### Voice Features
- **Speech-to-Text**: Browser Web Speech API
- **Text-to-Speech**: Sarvam AI for Hindi, Browser for English
- **Error Handling**: Comprehensive fallback mechanisms
- **Audio Management**: Proper cleanup and resource management

## Getting Started

### Prerequisites
- Node.js and npm installed
- Modern web browser with Web Speech API support
- Internet connection for API calls

### Installation
```bash
# Clone the repository
git clone https://github.com/mauryaayush2003/Plant-disease-detection-with-Ai.git

# Navigate to project
cd Plant-disease-detection-with-Ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the frontend directory:
```
VITE_API_KEY=your_sarvam_ai_api_key_here
```

## Usage

1. **Open Application**: Launch the web app in your browser
2. **Select Language**: Choose between English and Hindi
3. **Voice Interaction**: 
   - Click microphone button to speak
   - VEDA responds with voice in selected language
4. **Text Chat**: Type messages for text-based interaction
5. **Image Analysis**: Upload plant images for disease detection

## API Integration

### Sarvam AI TTS
- High-quality Hindi text-to-speech
- Natural voice synthesis
- Streaming API for real-time responses
- Fallback to browser TTS on errors

### Google Gemini AI
- Plant disease analysis from images
- Intelligent chat responses
- Multi-language understanding
- Context-aware conversations

## Browser Compatibility

- **Chrome**: Full support for all features
- **Firefox**: Basic support, some voice features may be limited
- **Safari**: Basic support, microphone permissions required
- **Edge**: Good support for most features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **Google Gemini AI** for plant disease detection and chat capabilities
- **Sarvam AI** for high-quality Hindi text-to-speech
- **Web Speech API** for browser-based voice features
- **Tailwind CSS** for utility-first styling
