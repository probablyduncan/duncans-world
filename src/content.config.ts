import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const wiki = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/data/wiki" }),
    schema: z.object({
        title: z.string(),
        related: reference("wiki").or(z.array(reference("wiki"))).optional(),
        tags: reference("tags").or(z.array(reference("tags"))).optional(),
        entryDate: z.date(),
        modifiedDate: z.date(),
        coordinates: z.array(z.string()).length(2).optional(),
    }),
});

const tags = defineCollection({
    loader: file("./src/data/tags.yaml"),
    schema: z.object({
        id: z.string(),
        plural: z.string(),
    })
});

export const collections = { wiki, tags };