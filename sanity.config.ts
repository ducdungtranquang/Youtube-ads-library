import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './sanity/env';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'ads-spy-blog',
  title: 'Ads Spy Blog',
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
