import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Tüm dosyalar için ortak bir kural (Schema) belirliyoruz
const commonSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
  
  // ═════ AKILLI PAGINATION KONTROLLERİ ═════
  hide_next: z.boolean().optional(),
  hide_prev: z.boolean().optional(),
  custom_next_url: z.string().optional(),
  custom_next_title: z.string().optional(),
  custom_prev_url: z.string().optional(),
  custom_prev_title: z.string().optional(),
});

export const collections = {
  // 1. Data Analysis
  'data_analysis': defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/data_analysis" }),
    schema: commonSchema,
  }),
  // 2. Data Science
  'data_science': defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/data_science" }),
    schema: commonSchema,
  }),
  // 3. Data Articles
  'data_articles': defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/data_articles" }),
    schema: commonSchema,
  }),
  // 4. Linux Roadmap
  'linux_roadmap': defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/linux_roadmap" }),
    schema: commonSchema,
  }),
  // 5. Master Thesis
  'master_thesis': defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/master_thesis" }),
    schema: commonSchema,
  }),
};