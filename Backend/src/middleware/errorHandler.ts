import { errorHandler as utilsErrorHandler, notFoundHandler as utilsNotFoundHandler } from '../utils/http';

// Re-export from utils/http to use cleanly in app.ts
export const notFoundHandler = utilsNotFoundHandler;
export const errorHandler = utilsErrorHandler;
