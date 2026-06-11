import { defineConfig } from 'orval';

export default defineConfig({
  pawCloudApi: {
    input: 'http://localhost:3000/api/docs-json',
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/endpoints.ts',
      schemas: 'src/api/generated/model',
      client: 'react-query',
      mock: false,
    },
  },
});
