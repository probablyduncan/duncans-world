import { getCollection } from "astro:content";
import type {
    InferGetStaticParamsType,
    InferGetStaticPropsType,
    GetStaticPaths,
} from "astro";

export const getWikiPaths = (async () => {
    const wiki = await getCollection("wiki");
    const mapped = Promise.all(wiki.map(async w => ({
        params: { id: w.id },
        props: { entry: w },
    })));
    return mapped;
}) satisfies GetStaticPaths;

export type WikiParams = InferGetStaticParamsType<typeof getWikiPaths>;
export type WikiProps = InferGetStaticPropsType<typeof getWikiPaths>;