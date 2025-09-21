# Social Media Post Generator

A modern web application that transforms product descriptions into engaging social media posts for Twitter/X, Instagram, and LinkedIn using OpenAI's GPT-4 API.

## 🚀 Features

### Core Functionality
- **Multi-Platform Support**: Generate posts optimized for Twitter/X, Instagram, and LinkedIn
- **AI-Powered Content**: Uses OpenAI's GPT-4 for intelligent post generation
- **Real-Time Validation**: Comprehensive input validation with instant feedback
- **Copy-to-Clipboard**: Easy copying of individual posts or all posts at once
- **Platform Previews**: See how posts will look on each social media platform

### User Experience
- **Loading States**: Visual feedback during post generation
- **Error Handling**: Comprehensive error messages and recovery
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Form Reset**: Automatic form clearing after successful generation

### Technical Features
- **Environment Validation**: Automatic validation of required environment variables
- **Request Timeout**: 30-second timeout protection for API calls
- **Input Sanitization**: Server-side validation and sanitization
- **Error Recovery**: Graceful handling of API failures and network issues
- **CORS Configuration**: Proper cross-origin request handling
- **Health Monitoring**: Backend health check endpoints

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

### What Was Fixed
- ✅ **Fixed API Connection Issues**: Resolved backend server startup and CORS problems
- ✅ **Added Input Validation**: Real-time validation for all form fields
- ✅ **Implemented Loading States**: Visual feedback during post generation
- ✅ **Enhanced Error Handling**: User-friendly error messages and recovery
- ✅ **Added Copy Functionality**: Individual and bulk copy to clipboard
- ✅ **Improved OpenAI Integration**: Fixed prompt format and response parsing
- ✅ **Better State Management**: Proper React state management with hooks

### New Features
- 🎯 **Platform Previews**: See how posts will look on each social media platform
- 📋 **Copy-to-Clipboard**: Easy copying of individual posts or all posts at once
- 🔄 **Form Reset**: Automatic form clearing after successful generation
- ⚡ **Health Monitoring**: Backend health check endpoints
- 🛡️ **Request Timeout**: 30-second timeout protection for API calls

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
Generates social media posts for a given product.

**Request Body:**
```json
{
  "product": {
    "name": "EcoBottle Pro",
    "description": "Revolutionary reusable water bottle...",
    "price": 49.99,
    "category": "Health & Wellness"
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
  "generated_at": "2025-01-21T02:30:00.000Z",
  "count": 5
}
```

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
└── docs/
    └── LOG.md           # Development log
```

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