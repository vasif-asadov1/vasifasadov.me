// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  // KANKA BURAYI REPO ADINA GÖRE GÜNCELLEDİK:
  site: 'https://vasif-asadov1.github.io',
  base: '/vasifasadov.me', // Alt klasör yolunu belirttik
  
  vite: {
    plugins: [tailwindcss()]
  },
  
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeKatex, {
        output: 'htmlAndMathml',
        strict: false
      }]
    ],
    shikiConfig: {
      theme: 'dracula',
      wrap: true, 
    },
  },
});