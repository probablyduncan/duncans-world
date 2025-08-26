// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import solidJs from '@astrojs/solid-js';

export default defineConfig({
    site: "https://duncans.world",
    vite: {
        // https://github.com/andi23rosca/solid-markdown/issues/33
        optimizeDeps: { include: ['solid-markdown > micromark', 'solid-markdown > unified'], },
    },
    integrations: [mdx(), solidJs()],
});