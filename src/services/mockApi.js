// Mock API service for demo purposes
// This simulates a real backend API

// Mock data storage (in a real app, this would be a database)
// Load users from localStorage or use default
const loadUsers = () => {
  try {
    const stored = localStorage.getItem("mockUsers");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load users from localStorage:", error);
  }

  // Default users
  return [
    {
      id: 1,
      name: "Demo User",
      email: "demo@example.com",
      password: "password123", // In real app, this would be hashed
    },
  ];
};

let mockUsers = loadUsers();

// Save users to localStorage
const saveUsers = () => {
  try {
    localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
  } catch (error) {
    console.warn("Failed to save users to localStorage:", error);
  }
};

// Load posts from localStorage or use default
const loadPosts = () => {
  try {
    const stored = localStorage.getItem("mockPosts");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load posts from localStorage:", error);
  }

  // Default posts
  return [
    {
      id: 1,
      title: "Welcome to Blogger",
      content:
        "This is a demo blog post to showcase the features of our modern SPA. You can create, read, and comment on posts. The application features a responsive design, dark mode, search functionality, and much more!",
      author: { id: 1, name: "Demo User" },
      createdAt: new Date().toISOString(),
      commentsCount: 2,
    },
  ];
};

let mockPosts = loadPosts();

// Save posts to localStorage
const savePosts = () => {
  try {
    localStorage.setItem("mockPosts", JSON.stringify(mockPosts));
  } catch (error) {
    console.warn("Failed to save posts to localStorage:", error);
  }
};

// Load comments from localStorage or use default
const loadComments = () => {
  try {
    const stored = localStorage.getItem("mockComments");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load comments from localStorage:", error);
  }

  // Default comments
  return [
    {
      id: 1,
      postId: 1,
      content: "Great introduction! Looking forward to more posts.",
      author: { id: 1, name: "Demo User" },
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      postId: 1,
      content: "This is exactly what I was looking for. Thanks for sharing!",
      author: { id: 1, name: "Demo User" },
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
  ];
};

let mockComments = loadComments();

// Save comments to localStorage
const saveComments = () => {
  try {
    localStorage.setItem("mockComments", JSON.stringify(mockComments));
  } catch (error) {
    console.warn("Failed to save comments to localStorage:", error);
  }
};

// Calculate next IDs based on existing data
let nextUserId = Math.max(...mockUsers.map((u) => u.id), 0) + 1;
let nextPostId = Math.max(...mockPosts.map((p) => p.id), 0) + 1;
let nextCommentId = Math.max(...mockComments.map((c) => c.id), 0) + 1;

// Utility function to simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate a simple JWT-like token (for demo purposes only)
const generateToken = (userId) => {
  return btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 })); // 24 hours
};

// Mock API functions
export const mockApi = {
  // Authentication
  async login(email, password) {
    await delay();

    console.log("Login attempt:", { email, password });
    console.log(
      "Available users:",
      mockUsers.map((u) => ({ id: u.id, email: u.email }))
    );

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      console.log("Login failed: User not found");
      throw new Error("Invalid email or password");
    }

    console.log("Login successful for user:", user.email);
    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  },

  async register(name, email, password) {
    await delay();

    // Check if user already exists
    if (mockUsers.find((u) => u.email === email)) {
      throw new Error("User with this email already exists");
    }

    const newUser = {
      id: nextUserId++,
      name,
      email,
      password, // In real app, this would be hashed
    };

    mockUsers.push(newUser);
    saveUsers(); // Persist to localStorage

    const token = generateToken(newUser.id);
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token,
    };
  },

  // Posts
  async getPosts(search = "", page = 1, limit = 10) {
    await delay();

    let filteredPosts = mockPosts;

    if (search) {
      filteredPosts = mockPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalPosts: filteredPosts.length,
        limit,
      },
    };
  },

  async getPostById(id) {
    await delay();

    const post = mockPosts.find((p) => p.id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  },

  async createPost(title, content, token) {
    await delay();

    // In a real app, you'd verify the token and get user from token
    const newPost = {
      id: nextPostId++,
      title,
      content,
      author: { id: 1, name: "Demo User" }, // In real app, get from token
      createdAt: new Date().toISOString(),
      commentsCount: 0,
    };

    mockPosts.unshift(newPost);
    savePosts(); // Save to localStorage
    return newPost;
  },

  async updatePost(id, title, content, token) {
    await delay();

    const postIndex = mockPosts.findIndex((p) => p.id === parseInt(id));
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    // In a real app, you'd verify the token and check if user owns the post
    const updatedPost = {
      ...mockPosts[postIndex],
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    mockPosts[postIndex] = updatedPost;
    savePosts(); // Save to localStorage
    return updatedPost;
  },

  async deletePost(id, token) {
    await delay();

    const postIndex = mockPosts.findIndex((p) => p.id === parseInt(id));
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    // In a real app, you'd verify the token and check if user owns the post
    mockPosts.splice(postIndex, 1);
    savePosts(); // Save to localStorage

    // Also remove associated comments
    const postId = parseInt(id);
    for (let i = mockComments.length - 1; i >= 0; i--) {
      if (mockComments[i].postId === postId) {
        mockComments.splice(i, 1);
      }
    }
    saveComments(); // Save updated comments to localStorage

    return { id: postId };
  },

  // Comments
  async getCommentsByPostId(postId) {
    await delay();

    const comments = mockComments.filter((c) => c.postId === parseInt(postId));
    return comments.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  },

  async createComment(postId, content, token) {
    await delay();

    const newComment = {
      id: nextCommentId++,
      postId: parseInt(postId),
      content,
      author: { id: 1, name: "Demo User" }, // In real app, get from token
      createdAt: new Date().toISOString(),
    };

    mockComments.push(newComment);
    saveComments(); // Save comments to localStorage

    // Update post comment count by creating a new post object
    const postIndex = mockPosts.findIndex((p) => p.id === parseInt(postId));
    if (postIndex !== -1) {
      mockPosts[postIndex] = {
        ...mockPosts[postIndex],
        commentsCount: (mockPosts[postIndex].commentsCount || 0) + 1,
      };
      savePosts(); // Save updated post to localStorage
    }

    return newComment;
  },
};
