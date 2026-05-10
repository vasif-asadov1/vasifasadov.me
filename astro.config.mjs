// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  // Tailwind v4 ayarın (Mükemmel çalışmaya devam ediyor)
  vite: {
    plugins: [tailwindcss()]
  },
  
  // Markdown yeteneklerimizi matematiksel boyuta taşıyoruz
  markdown: {
    // Matematik render eklentileri
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    
    // Shiki Dracula teması ve kod ayarlarımız
    shikiConfig: {
      theme: 'dracula',
      wrap: true, // Uzun kod satırlarını alt satıra indirir
    },
  },
});