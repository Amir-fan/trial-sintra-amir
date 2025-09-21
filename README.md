# Social Media Post Generator

A modern web application that transforms product descriptions into engaging social media posts for Twitter/X, Instagram, and LinkedIn using OpenAI's GPT-4 API.

## 🚀 Features

### Core Functionality
- **Multi-Platform Support**: Generate posts optimized for Twitter/X, Instagram, and LinkedIn
- **AI-Powered Content**: Uses OpenAI's GPT-4 for intelligent post generation
- **Real-Time Validation**: Comprehensive input validation with instant feedback
- **Copy-to-Clipboard**: Easy copying of individual posts or all posts at once
- **Platform Previews**: See how posts will look on each social media platform with authentic branding

### 🆕 Enhanced Features (Full-Stack Implementation)
- **📸 Image Analysis**: Upload product images for AI-powered visual analysis and content enhancement
- **🔍 Web Research**: Real-time market research using OpenAI's Responses API for data-driven content
- **📅 Content Calendar**: 7-day posting schedule with optimal timing recommendations
- **⏰ Post Scheduling**: Intelligent scheduling with platform-specific optimal times
- **🎨 Brand Voice Customization**: Choose from 5 different brand voices (friendly, luxury, playful, clinical, casual)
- **🌍 Timezone Support**: Schedule posts across different timezones
- **📊 Market Insights**: Get trending topics, competitor analysis, and sentiment data

### User Experience
- **Stunning Visual Design**: Modern gradient theme with glassmorphism effects
- **Astronaut Mascots**: Integrated Soshie AI astronaut characters throughout the interface
- **Smooth Animations**: Hover effects, scale transforms, and micro-interactions
- **Loading States**: Visual feedback with animated astronaut during post generation
- **Error Handling**: User-friendly error messages with modern design
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional Branding**: "Soshie AI" identity with AI-focused messaging
- **Form Reset**: Automatic form clearing after successful generation

### Technical Features
- **Environment Validation**: Automatic validation of required environment variables
- **Request Timeout**: 30-second timeout protection for API calls
- **Input Sanitization**: Server-side validation and sanitization
- **Error Recovery**: Graceful handling of API failures and network issues
- **CORS Configuration**: Proper cross-origin request handling
- **Health Monitoring**: Backend health check endpoints
- **Real Social Icons**: Authentic SVG icons for all social media platforms
- **TypeScript Safety**: Full type safety with proper error handling

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **OpenAI API** for content generation
- **CORS** for cross-origin requests

### Frontend
- **Next.js 15** with **React 19**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Modern React Hooks** for state management

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

## 🆕 Recent Improvements

### 🚀 Major UI/UX Overhaul (Latest)
- ✨ **Complete Design Transformation**: Modern gradient theme with purple/pink/indigo color scheme
- 👨‍🚀 **Astronaut Integration**: Added real Soshie astronaut images throughout the interface
- 📱 **Authentic Social Icons**: Replaced emojis with real SVG social media platform icons
- 🎨 **Glassmorphism Effects**: Backdrop-blur and transparency for modern, professional look
- ⚡ **Enhanced Animations**: Smooth hover effects, scale transforms, and micro-interactions
- 🎯 **Professional Branding**: "Soshie AI" branding with AI-focused messaging and visual hierarchy

### What Was Fixed
- ✅ **Fixed API Connection Issues**: Resolved backend server startup and CORS problems
- ✅ **Added Input Validation**: Real-time validation for all form fields with purple focus states
- ✅ **Implemented Loading States**: Visual feedback with animated astronaut during post generation
- ✅ **Enhanced Error Handling**: User-friendly error messages with better visual design
- ✅ **Added Copy Functionality**: Individual and bulk copy to clipboard with smooth animations
- ✅ **Improved OpenAI Integration**: Fixed prompt format and response parsing
- ✅ **Better State Management**: Proper React state management with hooks
- ✅ **TypeScript Errors**: Fixed PORT type issue in server.ts

### New Features
- 🎯 **Platform Previews**: See how posts will look on each social media platform with authentic branding
- 📋 **Copy-to-Clipboard**: Easy copying of individual posts or all posts at once
- 🔄 **Form Reset**: Automatic form clearing after successful generation
- ⚡ **Health Monitoring**: Backend health check endpoints
- 🛡️ **Request Timeout**: 30-second timeout protection for API calls
- 🎨 **Modern Form Design**: Rounded inputs with gradient focus states and better validation styling
- 🌟 **Animated Elements**: Floating particles, pulsing indicators, and smooth transitions

## 🛠️ Development Details

### Development Time
- **Total Time**: 4.5 hours
- **Tools Used**: Cursor AI, Node.js, TypeScript, React, Next.js, Tailwind CSS
- **Approach**: Iterative development with real-time debugging and UI/UX enhancement

### Key Challenges Solved
1. **API Key Management**: Fixed environment variable precedence issues (Windows user/system env overriding .env). Backend now force-reads `backend-ts/.env` and sanitizes values, plus docs include verification steps and clean restart instructions.
2. **UI/UX Design**: Transformed basic interface to professional 10/10 design
3. **TypeScript Integration**: Fixed type safety and compilation issues
4. **Real-time Validation**: Implemented comprehensive form validation
5. **Error Handling**: Created user-friendly error states and recovery

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Amir-fan/trial-sintra-amir.git
cd trial-sintra-amir
```

### 2. Backend Setup
```bash
cd backend-ts
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your OpenAI API key
```

**Required Environment Variables:**
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.8
OPENAI_MAX_TOKENS=1000
```

```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local and set the backend URL
```

**Required Environment Variables:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📖 Usage

1. **Enter Product Information**:
   - Product Name (required)
   - Description (required)
   - Price (required)
   - Category (optional)

2. **Generate Posts**:
   - Click "Generate Posts" button
   - Wait for AI to create platform-specific content
   - View generated posts in organized cards

3. **Copy Content**:
   - Copy individual posts using the "Copy" button
   - Copy all posts using "Copy All Posts" button

## 🔧 API Endpoints

### POST /api/generate
Generates social media posts for a given product with enhanced features.

**Request Body:**
```json
{
  "product": {
    "name": "EcoBottle Pro",
    "description": "Revolutionary reusable water bottle...",
    "price": 49.99,
    "category": "Health & Wellness"
  },
  "options": {
    "imageBase64": "base64_encoded_image_data",
    "imageMimeType": "image/png",
    "researchQuery": "sustainable water bottles market trends",
    "voice": "friendly",
    "schedulePosts": true,
    "timezone": "America/New_York"
  }
}
```

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "platform": "twitter",
      "content": "🚀 Introducing EcoBottle Pro..."
    }
  ],
  "imageInsights": {
    "summary": "Modern water bottle with sleek design",
    "tags": ["sustainable", "modern", "portable"],
    "altText": "EcoBottle Pro water bottle"
  },
  "researchInsights": {
    "bullets": ["Market growing 15% annually", "Sustainability is key trend"]
  },
  "scheduledPosts": [
    {
      "id": "post_1234567890_abc123",
      "platform": "twitter",
      "content": "🚀 Introducing EcoBottle Pro...",
      "scheduledTime": "2025-01-22T09:00:00.000Z",
      "timezone": "America/New_York",
      "status": "pending"
    }
  ],
  "generated_at": "2025-01-21T02:30:00.000Z",
  "count": 5
}
```

### POST /api/upload-image
Analyzes uploaded product images using OpenAI Vision API.

### POST /api/research
Performs web research using OpenAI's Responses API.

### POST /api/calendar
Generates 7-day content calendar with optimal posting times.

### GET /api/optimal-times/:platform
Gets optimal posting times for specific platforms.

## 🛡️ Validation Rules

### Product Name
- Required, non-empty string
- Maximum 200 characters

### Description
- Required, non-empty string
- Maximum 2000 characters

### Price
- Required, non-negative number
- Maximum $999,999

### Category
- Optional string
- Maximum 100 characters

## 🚨 Error Handling

The application handles various error scenarios:

- **Validation Errors**: Real-time input validation with specific error messages
- **API Errors**: Graceful handling of OpenAI API failures
- **Network Errors**: Timeout protection and retry mechanisms
- **Server Errors**: Comprehensive error logging and user feedback

## 🎨 UI/UX Features

- **Real-time Validation**: Instant feedback on form inputs
- **Loading States**: Visual indicators during API calls
- **Error Messages**: Clear, actionable error messages
- **Responsive Design**: Optimized for all screen sizes
- **Platform Cards**: Visual representation of each social media platform
- **Copy Functionality**: One-click copying of generated content

## 📁 Project Structure

```
trial-sintra-amir/
├── backend-ts/           # TypeScript backend
│   ├── src/
│   │   ├── server.ts     # Express server setup
│   │   ├── generate.ts   # Post generation logic
│   │   ├── openai.ts     # OpenAI API integration
│   │   ├── webResearch.ts # Web research service
│   │   ├── scheduling.ts # Content scheduling service
│   │   ├── types.ts      # TypeScript type definitions
│   │   └── config.ts     # Configuration constants
│   └── package.json
├── frontend/             # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx  # Main application page
│   │   │   └── layout.tsx
│   │   └── api.ts        # API client functions
│   └── package.json
├── docs/
│   ├── LOG.md           # Development log
│   └── TROUBLESHOOTING.md # Issue resolution guide
├── FEATURES.md          # Detailed feature documentation
├── IMPLEMENTATION_SUMMARY.md # Complete implementation overview
└── APPROACH.md          # Development approach and decisions
```

## 📚 Documentation

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Complete overview of what we built and why
- **[FEATURES.md](./FEATURES.md)** - Detailed technical documentation of all features
- **[APPROACH.md](./APPROACH.md)** - Development approach and technical decisions
- **[docs/LOG.md](./docs/LOG.md)** - Complete development timeline and commit history

## 🔄 Development Workflow

This project follows conventional commit standards:

- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks
- `docs:` Documentation updates

## 📝 License

This project is part of the Sintra Trial Task and is for demonstration purposes.

## 👨‍💻 Developer

**Amir**  
GitHub: [@Amir-fan](https://github.com/Amir-fan)

---

*Built with ❤️ using modern web technologies*