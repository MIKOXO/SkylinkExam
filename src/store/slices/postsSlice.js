import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockApi } from "../../services/mockApi";

// Using mock API for demo purposes
// In a real app, you would use axios and a real API

// Async thunks for posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ search = "", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await mockApi.getPosts(search, page, limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch posts");
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const data = await mockApi.getPostById(postId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch post");
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ title, content }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const data = await mockApi.createPost(title, content, auth.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create post");
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, title, content }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const data = await mockApi.updatePost(id, title, content, auth.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update post");
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await mockApi.deletePost(postId, auth.token);
      return postId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete post");
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    currentPost: null,
    isLoading: false,
    error: null,
    searchQuery: "",
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalPosts: 0,
      limit: 10,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      });
  },
});

export const { clearError, setSearchQuery, clearCurrentPost } =
  postsSlice.actions;
export default postsSlice.reducer;
