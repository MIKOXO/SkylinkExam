/* eslint-disable no-unused-vars */
import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";
import React from "react";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => {
      // Remove framer-motion specific props
      const {
        variants,
        initial,
        animate,
        exit,
        whileHover,
        whileTap,
        ...cleanProps
      } = props;
      return React.createElement("div", cleanProps, children);
    },
    button: ({ children, ...props }) => {
      const {
        variants,
        initial,
        animate,
        exit,
        whileHover,
        whileTap,
        ...cleanProps
      } = props;
      return React.createElement("button", cleanProps, children);
    },
    svg: ({ children, ...props }) => {
      const {
        variants,
        initial,
        animate,
        exit,
        whileHover,
        whileTap,
        ...cleanProps
      } = props;
      return React.createElement("svg", cleanProps, children);
    },
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null), // Return null by default
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Clear localStorage before each test
beforeEach(() => {
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
