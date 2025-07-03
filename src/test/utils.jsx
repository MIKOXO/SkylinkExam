import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../store/slices/authSlice';
import postsSlice from '../store/slices/postsSlice';
import commentsSlice from '../store/slices/commentsSlice';
import themeSlice from '../store/slices/themeSlice';

// Create a test store with initial state
export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
      posts: postsSlice,
      comments: commentsSlice,
      theme: themeSlice,
    },
    preloadedState: initialState,
  });
};

// Custom render function that includes providers
export const renderWithProviders = (
  ui,
  {
    initialState = {},
    store = createTestStore(initialState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Mock user data
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};

// Mock post data
export const mockPost = {
  id: 1,
  title: 'Test Post',
  content: 'This is a test post content.',
  author: mockUser,
  createdAt: '2024-01-01T00:00:00.000Z',
  commentsCount: 2,
};

// Mock comment data
export const mockComment = {
  id: 1,
  postId: 1,
  content: 'This is a test comment.',
  author: mockUser,
  createdAt: '2024-01-01T00:00:00.000Z',
};

// Mock authenticated state
export const mockAuthenticatedState = {
  auth: {
    user: mockUser,
    token: 'mock-token',
    isLoading: false,
    error: null,
    isAuthenticated: true,
  },
};

// Mock unauthenticated state
export const mockUnauthenticatedState = {
  auth: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  },
};

// Mock posts state
export const mockPostsState = {
  posts: {
    posts: [mockPost],
    currentPost: mockPost,
    isLoading: false,
    error: null,
    searchQuery: '',
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalPosts: 1,
      limit: 10,
    },
  },
};

// Mock comments state
export const mockCommentsState = {
  comments: {
    comments: [mockComment],
    isLoading: false,
    error: null,
  },
};
