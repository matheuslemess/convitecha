import { app } from "../server/_core/app";

// Tell Vercel not to parse the body, so Express can do it.
// If Vercel parses it first, Express.json() hangs infinitely waiting for the stream!
export const config = {
  api: {
    bodyParser: false,
  },
};

// Export a handler that normalizes the URL before passing to Express
export default function handler(req: any, res: any) {
  // Vercel strips the /api prefix when executing inside the /api folder.
  // We add it back so our Express app.use('/api/trpc', ...) matches correctly.
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
}
