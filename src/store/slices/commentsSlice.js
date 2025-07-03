import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockApi } from "../../services/mockApi";

// Using mock API for demo purposes
// In a real app, you would use axios and a real API

// Async thunks for comments
export const fetchCommentsByPostId = createAsyncThunk(
  "comments/fetchCommentsByPostId",
  async (postId, { rejectWithValue }) => {
    try {
      const data = await mockApi.getCommentsByPostId(postId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch comments");
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ postId, content }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const data = await mockApi.createComment(postId, content, auth.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create comment");
    }
  }
);

// Update and delete functions for future implementation
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, content }) => {
    // Mock implementation - in real app, would call API
    return { id: commentId, content };
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId) => {
    // Mock implementation - in real app, would call API
    return commentId;
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment.id === action.payload.id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
      });
  },
});

export const { clearError, clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
