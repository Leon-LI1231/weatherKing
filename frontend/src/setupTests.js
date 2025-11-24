// src/setupTests.js
import "@testing-library/jest-dom";

// Mock matchMedia for Bootstrap components that use it (like Offcanvas)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => {
    const mockMediaQueryList = {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    // Add refCount property that the useMediaQuery hook expects
    mockMediaQueryList.refCount = 1;

    return mockMediaQueryList;
  }),
});

// Also ensure ResizeObserver is available
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
