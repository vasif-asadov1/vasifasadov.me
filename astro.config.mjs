// @ts-check
import { defineConfig } from 'astro:config';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  // 1. GITHUB PAGES AYARLARI (SENIOR CONFIG)
  // Repo ismin kullanıcı adınla aynı olduğu için 'base' boş kalmalı, site tam URL olmalı.
  site: 'https://vasif-asadov1.github.io',
  base: '/', 
  
  // 2. VITE & TAILWIND V4
  vite: {
    plugins: [tailwindcss()]
  },
  
  // 3. MARKDOWN & MATH & SHIKI
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeKatex, {
        // Formüllerin daha net görünmesi için çıktı kalitesi ayarı
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