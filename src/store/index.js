import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import postsSlice from "./slices/postsSlice";
import commentsSlice from "./slices/commentsSlice";
import themeSlice from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    comments: commentsSlice,
    theme: themeSlice,
  },
});

export default store;
