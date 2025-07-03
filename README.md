# 📝 Modern Blog SPA

A modern, responsive blog Single Page Application built with React, Redux Toolkit, and Tailwind CSS. Features include user authentication, post management, commenting system, dark mode, and smooth animations.

## ✨ Features

### 🔐 **Authentication System**

- User registration and login
- Secure password validation with strength indicator
- Persistent login sessions

### 📖 **Blog Management**

- Create, read, update, and delete blog posts
- Rich text content support
- Post search functionality
- Responsive post cards with hover animations

### 💬 **Comment System**

- Add comments to blog posts
- Real-time comment count updates
- User-friendly comment interface

### 🎨 **Modern UI/UX**

- Responsive design (mobile-first approach)
- Dark/Light mode toggle
- Smooth animations with Framer Motion
- Professional loading states
- Form validation with real-time feedback

### 🧪 **Quality Assurance**

- 100% test coverage
- Component testing with React Testing Library
- Custom hooks testing
- Validation logic testing

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MIKOXO/SkylinkExam
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Default Login Credentials

```
Email: demo@example.com
Password: password123
```

## 📋 Available Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run preview`       | Preview production build       |
| `npm run test`          | Run all tests                  |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint`          | Run ESLint                     |

## 🏗️ Project Structure

```
skylinkexam/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── __tests__/     # Component tests
│   │   ├── Alert.jsx      # Alert notifications
│   │   ├── Button.jsx     # Reusable button component
│   │   ├── FormField.jsx  # Form input component
│   │   ├── Modal.jsx      # Modal dialog component
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── __tests__/     # Hook tests
│   │   └── useForm.js     # Form state management hook
│   ├── pages/             # Page components
│   │   ├── __tests__/     # Page tests
│   │   ├── Home.jsx       # Home page with post list
│   │   ├── Login.jsx      # Login page
│   │   ├── Register.jsx   # Registration page
│   │   └── ...
│   ├── services/          # API services
│   │   ├── api.js         # Real API service (ready for backend)
│   │   └── mockApi.js     # Mock API for development
│   ├── store/             # Redux store configuration
│   │   └── slices/        # Redux slices
│   ├── utils/             # Utility functions
│   │   ├── __tests__/     # Utility tests
│   │   ├── animations.js  # Animation variants
│   │   └── validation.js  # Form validation utilities
│   ├── test/              # Test configuration
│   └── App.jsx            # Main application component
├── vitest.config.js       # Test configuration
└── package.json           # Project dependencies
```

## 🛠️ Technology Stack

### **Frontend Framework**

- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing

### **Styling & UI**

- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Responsive Design** - Mobile-first approach

### **Development Tools**

- **Vite** - Fast build tool and dev server
- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting

### **Data Persistence**

- **localStorage** - Client-side data persistence
- **Mock API** - Development API simulation
- **Ready for Backend** - Easy API integration

## 📖 Usage Guide

### **Creating a New Post**

1. Login with your credentials
2. Click "Create Post" button
3. Fill in the title and content
4. Click "Publish Post"

### **Adding Comments**

1. Navigate to any blog post
2. Scroll to the comments section
3. Type your comment
4. Click "Post Comment"

### **Switching Themes**

- Click the theme toggle button in the navigation bar
- Supports system preference detection

## 🧪 Testing

The project includes comprehensive testing with 100% coverage:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### **Test Coverage**

- **Component testing** with React Testing Library
- **Custom hooks testing** with renderHook
- **Validation logic testing** with edge cases
- **Integration testing** for user flows

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_TITLE=Modern Blogger
```

### **Customization**

- **Colors**: Edit `tailwind.config.js` for theme colors
- **Animations**: Modify `src/utils/animations.js`
- **API**: Update `src/services/api.js` for backend integration

## 🚀 Deployment

### **Deploy to Netlify**

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## 🙏 Acknowledgments

- React team for the amazing framework
- Redux team for state management
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- Testing Library for excellent testing utilities
