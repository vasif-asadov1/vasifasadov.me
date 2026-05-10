---
layout: ../../../layouts/ArticleLayout.astro
title:  Building Documentation and Portfolio Website
description:  This project focuses on building a documentation and portfolio website using Astro and Tailwind CSS. All necessary steps from scratch will be covered in this project. The website will serve as a platform to showcase your work, share your knowledge, and connect with potential clients or employers.
tags: [astro, tailwindcss, documentation, portfolio, website]
hide_next: true
hide_prev: true
---


## Why Build a Documentation and Portfolio Website?

In today's digital age, having an online presence is crucial for professionals in various fields. A documentation and portfolio website serves as a platform to showcase your work, share your knowledge, and connect with potential clients or employers. It allows you to demonstrate your skills, highlight your projects, and establish yourself as an authority in your industry. By building a documentation and portfolio website, you can:

- **Showcase Your Work:** A well-designed website provides a visually appealing way to display your projects, achievements, and skills. It allows you to present your work in a professional manner, making it easier for visitors to understand your capabilities.
- **Share Your Knowledge:** A documentation website allows you to share your expertise and insights with others. You can create tutorials, write articles, and provide valuable resources that can help others learn and grow in their respective fields.
- **Connect with Others:** An online portfolio can help you connect with potential clients, employers, and collaborators. It serves as a central hub where people can learn more about you, your work, and how to contact you.
- **Establish Your Personal Brand:** A well-crafted website can help you establish your personal brand and differentiate yourself from others in your industry. It allows you to communicate your unique value proposition and create a memorable impression on visitors.
- **Enhance Your Career Opportunities:** A strong online presence can open up new career opportunities. Employers and clients often search for candidates online, and having a professional website can increase your chances of being noticed and hired.
- **Demonstrate Your Skills:** Building a website allows you to demonstrate your technical skills, such as web development, design, and content creation. It provides a tangible example of your abilities that can impress potential employers or clients.
- **Stay Updated:** A documentation website can serve as a platform to share updates about your projects, industry trends, and personal achievements. It allows you to keep your audience informed and engaged with your work.

Overall, building a documentation and portfolio website is a valuable investment in your professional growth and online presence. It can help you showcase your work, share your knowledge, connect with others, establish your personal brand, enhance your career opportunities, demonstrate your skills, and stay updated with industry trends.


## Why not Notion, Medium or other platforms?

Using ready made platforms like Notion, Medium, or others has following advantages and disadvantages:

<div class = "md-comparison-row">

<div class="comp-box pros">
<h4>Advantages</h4>
<ul>
<li>It is easy to use and requires no coding knowledge.</li>
<li>It provides a user-friendly interface for creating and organizing content.</li>
<li>It offers built-in templates and features for creating documentation and portfolios.</li>
<li>It allows for easy collaboration and sharing with others.</li>
<li>It provides hosting and maintenance, eliminating the need for technical setup.</li>
<li> Managing content is easier as it provides a centralized platform for all your documentation and portfolio needs.</li>
<li> Manual updates and maintenance are not required as the platform takes care of it.</li>
</ul>
</div>

<div class="comp-box cons">
<h4>Disadvantages</h4>
<ul>
<li>Customization is limited, and you may not be able to achieve the exact look and feel you want for your website.</li>
<li> You may have limited control over the functionality and features of your website, as you are restricted to what the platform offers.</li>
<li> You may have to pay for premium features or subscriptions to access certain functionalities or remove ads.</li>
<li> You may have limited options for integrating third-party tools or services, which can restrict the capabilities of your website.</li>
<li> You can never have unlimited customization and control over your website, as you are dependent on the platform's updates and changes.</li>
<li> You depend on the platform's stability and security, and if the platform experiences downtime or security breaches, it can affect your website and its visitors.</li>
<li>Theme and design options are very limited compared to building your own website, which can make it difficult to create a unique and personalized online presence.</li>
<li> Your platform will look like copy-paste of other websites using the same platform, which can make it difficult to stand out and differentiate yourself from others in your industry.</li>
</ul>
</div>

</div>


So, the main problem of using other ready made platforms is their limits and the restricted control over the design, functionality, and customization of your website. Building your own documentation and portfolio website allows you to have complete control over the look, feel, and features of your site, enabling you to create a unique and personalized online presence that truly represents you and your work. This will also give you the opportunity to learn and demonstrate your web development skills, which can be valuable for your career growth and opportunities and hence increase your confidence in your technical abilities.


## Which Technologies to Use?

For building a documentation and portfolio website, there are several technologies you can consider. Here are some popular options:

- **Astro:** Astro is a modern static site generator that allows you to build fast and optimized websites. It supports multiple frameworks and provides a great developer experience. Astro is a good choice for building a documentation and portfolio website due to its performance and flexibility. There are also many templates available for Astro that can help you get started quickly. For example, Starlight is a popular Astro template that is designed for documentation and portfolio websites. It provides a clean and modern design, along with features like dark mode, responsive layout, and easy customization. 
- **Hugo:** Hugo is another popular static site generator that is known for its speed and simplicity. It has a large community and a wide range of themes available, making it a good choice for building a documentation and portfolio website. It has also a good documentation and portfolio template called Docsy, Blowfish which are designed for technical documentation and project portfolios. It provides a clean and professional design, along with features like search functionality, responsive layout, and easy customization.
- **Jekyll:** Jekyll is a static site generator that is built on Ruby. It is widely used for building blogs and documentation websites. Jekyll has a large community and a wide range of themes available, making it a good choice for building a documentation and portfolio website. It has also a good documentation and portfolio template called Just the Docs, Minimal Mistakes which are designed for technical documentation and project portfolios. It provides a clean and professional design, along with features like search functionality, responsive layout, and easy customization.
- **Gatsby:** Gatsby is a React-based static site generator that allows you to build fast and dynamic websites. It has a large ecosystem of plugins and themes, making it a good choice for building a documentation and portfolio website. Gatsby has a good documentation and portfolio template called Gatsby Starter Portfolio, which is designed for showcasing projects and skills. It provides a modern and visually appealing design, along with features like responsive layout, easy customization, and integration with various data sources.
- **MkDocs:** MkDocs is a static site generator that is specifically designed for building documentation websites. It is written in Python and has a simple and intuitive configuration. MkDocs has a good documentation template called Material for MkDocs, which is designed for technical documentation. It provides a clean and modern design, along with features like search functionality, responsive layout, and easy customization.
- **Docusaurus:** Docusaurus is well suited for building documentation websites, especially for open-source projects. It is built on React and provides a simple and intuitive way to create and maintain documentation. Docusaurus has a good documentation template called Classic, which is designed for technical documentation. It provides a clean and modern design, along with features like search functionality, responsive layout, and easy customization. 

There are more technologies available for building documentation and portfolio websites, and the choice ultimately depends on your specific needs, preferences, and technical skills. It is important to consider factors such as ease of use, customization options, performance, and community support when selecting the right technology for your project. 

I will not dive deeper into the comparison of these technologies in this project, but I will be clearly list all advantages and disadvantages of using Astro together with Tailwind CSS for building a documentation and portfolio website in the next section.

<div class = "md-comparison-row">

<div class="comp-box pros">
<h4>Advantages of using Astro and Tailwind CSS</h4>
<ul>
<li><b>Zero-JS "Islands" Architecture:</b> Astro ships pure, lightning-fast HTML by default. It only loads JavaScript for the specific interactive components you choose, eliminating the heavy bundle bloat seen in React-based generators like Gatsby or Docusaurus.</li>
<li><b>Unrestricted Customization:</b> Instead of fighting against the constraints of rigid, pre-built themes that often prove insufficient for custom needs, Tailwind allows you to build exactly what you want directly in your markup.</li>
<li><b>"Bring Your Own Framework" Flexibility:</b> You are not locked into a single ecosystem. You can seamlessly drop React, Vue, Svelte, or SolidJS components into the same Astro project.</li>
<li><b>First-Class Tailwind Support:</b> Astro integrates Tailwind natively. It automatically handles the build process and CSS purging without the messy PostCSS pipelines required by Jekyll or older tools. Hugo requires manually setting up Node dependencies, PostCSS, and configuring complex asset pipelines just to get Tailwind working properly.</li>
<li><b>Advanced MDX Capabilities:</b> Moving beyond traditional documentation setups, Astro treats Markdown and MDX as first-class citizens. You can easily embed dynamic, interactive components directly into your Markdown files without relying on clunky shortcodes. Hugo forces you to use its proprietary "shortcode" syntax, which is less flexible and harder to debug.</li>
<li><b>Modern Developer Experience:</b> Powered by Vite, Astro offers near-instant Hot Module Replacement (HMR). You see your Tailwind class changes and component updates immediately, making the development loop significantly faster than older Go or Ruby-based generators.</li>
<li><b>Total Customization Control:</b> Instead of feeling boxed in by rigid templates or struggling to override deep styling in themes like Hugo Blowfish, Astro and Tailwind let you build the exact UI you envision without fighting an underlying theme architecture.</li>
<li><b>Intuitive Component System:</b> Astro uses a modern, HTML-like component structure that is very familiar to web developers. Hugo relies on Go templating, which can have a steep learning curve and become messy when handling complex logic.</li>
<li><b>Painless Interactivity:</b> If you ever need to add a dynamic React, Vue, or Svelte component (like a complex data visualization), Astro handles it natively through its "Islands" architecture. With Hugo, you have to manually wire up vanilla JavaScript or write custom build scripts.</li>
<li><b>Full Access to NPM:</b> Astro lives natively in the modern web ecosystem, meaning you can easily install and use any package from NPM. Hugo is a standalone Go binary, making it much harder to integrate standard JavaScript libraries.</li>
<li><b>Built-in Image Optimization:</b> Astro has native support for image optimization, allowing you to easily serve responsive images without additional configuration. Hugo requires manual setup and third-party tools for similar functionality.</li>
<li><b>Perfect Code Syntax Highlighting - Shiki:</b> Astro uses Shiki for code syntax highlighting, which is more flexible and easier to customize than Hugo's built-in Chroma highlighter. Shiki is the engine that is used by Visual Studio Code and GitHub to provide seamless integration.</li>
</ul>
</div>

<div class="comp-box cons">

<h4>Disadvantages of using Astro and Tailwind CSS</h4>
<ul>
<li><b>Slower Build Times for Massive Sites (vs. Hugo)</b> If you are building a massive enterprise documentation site with tens of thousands of pages, Hugo (written in Go) will compile it in seconds, whereas Astro will take noticeably longer. However, it is still faster than most of the other website generators.</li>
<li><b>A Steeper Learning Curve for Non-JS Developers (vs. MkDocs & Jekyll)</b> Astro and Tailwind CSS require a certain level of JavaScript knowledge, which might be a barrier for developers who are more comfortable with static site generators like MkDocs or Jekyll.</li>
<li><b>The "Blank Slate" Overhead (vs. Pre-configured Themes)</b> Starting from scratch with Astro and Tailwind CSS means more initial setup time compared to using pre-configured themes in tools like MkDocs or Jekyll. However, this also provides greater flexibility and control over the final product.</li>
<li><b>Overkill for Simple Static Content </b> If your documentation or portfolio needs are very basic and do not require custom design or interactivity, using Astro and Tailwind CSS might be overkill compared to simpler platforms like Mkdocs or Jekyll.</li>
<li><b>Less Mature Ecosystem (vs. Hugo & Jekyll)</b> While Astro is rapidly growing, it is still a newer tool compared to established generators like Hugo and Jekyll, which have larger communities and more plugins/themes available. However, you can apply any theme to your website using Tailwind CSS even though it requires manual effort.</li>
<li><b>Requires Node.js Environment</b> Astro requires a Node.js environment for development and building, which might not be ideal for all users, especially those who prefer a more lightweight setup without the need for a JavaScript runtime.</li>
</ul>
</div>

</div>

Overall, while there are some disadvantages to using Astro and Tailwind CSS, the advantages in terms of customization, performance, and developer experience make it a compelling choice for building a documentation and portfolio website. The flexibility and control it offers can help you create a unique and personalized online presence that truly represents you and your work.


## Astro Project Folder Structure

When building a documentation and portfolio website using Astro and Tailwind CSS, it is important to organize your project files in a clear and logical manner. When you create a new Astro project, it will generate a default folder structure for you. However, it is better to understand it not roughly. Here is a typical folder structure for an Astro project:
<div class="file-tree">

<div class="folder">portfolio-website/ <span class="tree-comment">Root directory of the project</span></div>

<div class="folder indent-1">public/ <span class="tree-comment">Static assets served directly at root path</span></div> 
<div class="folder indent-2">images <span class="tree-comment">Static images, icons, and diagrams</span></div>
<div class="file indent-3">logo.png <span class="tree-comment">Main website logo</span></div>

<div class="folder indent-1">src/ <span class="tree-comment">Main source code directory</span></div>

<div class="folder indent-2">components <span class="tree-comment">Reusable UI components</span></div>
<div class="file indent-3">Navbar.astro <span class="tree-comment">Top navigation bar</span></div>
<div class="file indent-3">ProjectNavigation.astro <span class="tree-comment">Step-by-step roadmap for project series</span></div>

<div class="folder indent-2">layouts <span class="tree-comment">Page layout wrappers</span></div>
<div class="file indent-3">ArticleLayout.astro <span class="tree-comment">Layout for markdown articles with sidebar/TOC</span></div>
<div class="file indent-3">MainLayout.astro <span class="tree-comment">Base HTML shell and global head tags</span></div>

<div class="folder indent-2">pages <span class="tree-comment">File-based routing directory</span></div>
<div class="folder indent-3">data-science <span class="tree-comment">Route folder for data science section</span></div>
<div class="file indent-4">[...slug].astro <span class="tree-comment">Dynamic route handler for data science articles</span></div>
<div class="folder indent-3">data-analysis <span class="tree-comment">Route folder for data analysis section</span></div>
<div class="file indent-4">[...slug].astro <span class="tree-comment">Dynamic route handler for data analysis articles</span></div>
<div class="folder indent-3">data-articles <span class="tree-comment">Route folder for standalone articles</span></div>
<div class="file indent-4">[...slug].astro <span class="tree-comment">Dynamic route handler for standalone articles</span></div>
<div class="folder indent-3">linux-world <span class="tree-comment">Route folder for Linux and automation guides</span></div>
<div class="file indent-4">[...slug].astro <span class="tree-comment">Dynamic route handler for Linux guides</span></div>
<div class="folder indent-3">master-thesis <span class="tree-comment">Route folder for academic research</span></div>
<div class="file indent-4">[...slug].astro <span class="tree-comment">Dynamic route handler for master thesis chapters</span></div>

<div class="folder indent-2">styles <span class="tree-comment">Global stylesheets and CSS variables</span></div>
<div class="file indent-3">globals.css <span class="tree-comment">Tailwind directives and custom shortcode styles</span></div>

<div class="folder indent-2">data <span class="tree-comment">Static JSON or configuration data</span></div>

<div class="folder indent-2">content <span class="tree-comment">Astro Markdown content collections</span></div>
<div class="folder indent-3">data_science <span class="tree-comment">Markdown files for data science projects</span></div>
<div class="file indent-4">index.md <span class="tree-comment">Category overview and project listing</span></div>
<div class="file indent-4">00_problem_description.md <span class="tree-comment">First step: Problem statement and goals</span></div>
<div class="file indent-4">01_solution_approach.md <span class="tree-comment">Second step: Architecture and tool selection</span></div>
<div class="file indent-4">02_implementation_details.md <span class="tree-comment">Third step: Step-by-step coding and setup</span></div>

<div class="folder indent-3">data_analysis <span class="tree-comment">Markdown files for data analysis projects</span></div>
<div class="file indent-4">index.md <span class="tree-comment">Category overview and project listing</span></div>

<div class="folder indent-3">data_articles <span class="tree-comment">Markdown files for standalone articles</span></div>
<div class="file indent-4">index.md <span class="tree-comment">Category overview and article listing</span></div>

<div class="folder indent-3">linux_world <span class="tree-comment">Markdown files for Linux tutorials</span></div>
<div class="file indent-4">index.md <span class="tree-comment">Category overview and tutorial listing</span></div>

<div class="folder indent-3">master_thesis <span class="tree-comment">Markdown files for academic research</span></div>

<div class="file indent-1 active">astro.config.mjs <span class="tree-comment">Main Astro configuration and integrations</span></div>
<div class="file indent-1">package.json <span class="tree-comment">Project dependencies and NPM scripts</span></div>
<div class="file indent-1">tailwind.config.js <span class="tree-comment">Tailwind theme, colors, and typography settings</span></div>
<div class="file indent-1">postcss.config.js <span class="tree-comment">PostCSS plugins configuration</span></div>

</div>

We will dive deeper into the folder structure and the purpose of each file in the next sections of this project. For now, it is important to understand that this structure is designed to keep your project organized and maintainable as it grows in complexity. Each folder serves a specific purpose, and following this structure will help you manage your code and content effectively as you build your documentation and portfolio website.

## Whole Project Roadmap

The project will be divided within the following steps: 


<div class="md-timeline">

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 01 - Dependencies</span>
<h4>Astro & Tailwind Setup</h4>
<p>Initialize the project using the Astro CLI and install Tailwind CSS integration to build our utility-first styling foundation.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 02 - Architecture</span>
<h4>Folder Structure & Config</h4>
<p>Organize the directory with components, layouts, and pages. Configure <code>src/content.config.ts</code> to define our Zod-powered schemas for data science and articles.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 03 - Core Layouts</span>
<h4>Main & Article Layouts</h4>
<p>Develop <code>MainLayout.astro</code> for global SEO/HTML and <code>ArticleLayout.astro</code> with our custom sidebar, TOC, and interactive code copy scripts.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 04 - Navigation Logic</span>
<h4>Navbar & Project Roadmap</h4>
<p>Implement the top navigation menu and the <code>ProjectNavigation.astro</code> component to handle step-by-step guidance within project series.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 05 - Content Ingestion</span>
<h4>Markdown & MDX Collections</h4>
<p>Populate the <code>src/content/</code> directories with your data science projects, thesis chapters, and technical articles using our custom shortcodes.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 06 - Routing</span>
<h4>Dynamic Slug Generation</h4>
<p>Create <code>[...slug].astro</code> files in the pages directory to automatically generate clean URLs and handle data injection for all content collections.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 07 - UI Polish</span>
<h4>Shortcodes & Math Rendering</h4>
<p>Finalize the CSS for file-trees, comparison boxes, and KaTeX math blocks to ensure a premium reading experience.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 08 - Git Integration</span>
<h4>Repository Initialization</h4>
<p>Initialize a local Git repository, create a <code>.gitignore</code>, and push the source code to a private or public GitHub repository.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 09 - CI/CD Workflow</span>
<h4>GitHub Actions Setup</h4>
<p>Configure a GitHub Action (<code>deploy.yml</code>) to automatically build the project and deploy it to GitHub Pages or a cloud provider on every push.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 10 - Launch</span>
<h4>Deployment & Live Preview</h4>
<p>Verify the production build, check the SSL certificate, and officially launch your portfolio to the world at your custom domain.</p>
</div>
</div>

</div>


After completing these steps, you will have a fully functional documentation and portfolio website built with Astro and Tailwind CSS.  

<div class="callout attention">
<h4 class="callout-title">Attention</h4>
<p>Please note that the steps are not strictly linear, and you may find yourself iterating between them as you build and refine your website. The key is to focus on one aspect at a time while keeping the overall architecture and design in mind. By following this roadmap, you will be able to create a professional and personalized online presence that effectively showcases your work and expertise.</p>
</div>


## Links to Resources


<div class="reference-list">
<div class="ref-item">
<a href="https://github.com/" class="ref-link" target="_blank">Github Repository of the Project</a>
</div>
<div class="ref-item">
<a href="https://docs.astro.build/en/getting-started/" class="ref-link" target="_blank">Astro Documentation</a>
</div>
<div class="ref-item">
<a href="https://my-website.com/" class="ref-link" target="_blank">My Website</a>
</div>
</div>







