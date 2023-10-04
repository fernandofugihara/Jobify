import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/


// basically all the requests that are being made in our frontend application on url http://localhost:5173 are gonna go 
// to the localhost5100.api


// This code configures a proxy rule for the development server, specifically for requests that start with /api. Let's go through
// each property:

// '/api': This is the path to match. If a request is made to the development server with a path that starts with /api, the proxy 
// rule will be applied.
// target: 'http://localhost:5100/api': This specifies the target URL where the requests will be redirected. In this case, any request
// that matches the /api path will be forwarded to http://localhost:5100/api.

// changeOrigin: true: When set to true, this property changes the origin of the request to match the target URL. This can be useful 
// when working with CORS (Cross-Origin Resource Sharing) restrictions.

// rewrite: (path) => path.replace(/^\/api/, ''): This property allows you to modify the path of the request before it is forwarded to 
// the target. In this case, the rewrite function uses a regular expression (/^\/api/) to remove the /api prefix from the path. 
// For example, if a request is made to /api/users, the rewritten path will be /users.

// To summarize, these lines of code configure a proxy rule for requests starting with /api on the development server. The 
// requests will be redirected to http://localhost:5100/api, with the /api prefix removed from the path.

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5100/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
