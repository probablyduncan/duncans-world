import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type {
    InferGetStaticParamsType,
    InferGetStaticPropsType,
    GetStaticPaths,
} from "astro";
import { toSeveral } from "@probablyduncan/common/sos";

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

export type WikiDTO = Pick<CollectionEntry<"wiki">, "data" | "id" | "body">;

export type SearchEntry = {
    key: string;
    title: string;
    tags: string[];
    related: string[];
}

export type SearchData = {
    entries: Record<string, SearchEntry>;
    tags: Record<string, { singular: string; plural: string; }>;
}

export async function getSearchData(): Promise<SearchData> {

    const wikiCollection = await getCollection("wiki");
    const tagCollection = await getCollection("tags");

    const entries = wikiCollection.reduce((result, entry) => {
        result[entry.id] = {
            key: entry.id,
            title: entry.data.title,
            tags: toSeveral(entry.data.tags ?? []).map(t => t.id),
            related: toSeveral(entry.data.related ?? []).map(r => r.id),
        }
        return result;
    }, {});

    const tags = tagCollection.reduce((result, tag) => {
        result[tag.id] = {
            singular: tag.data.id,
            title: tag.data.plural,
        };
        return result;
    }, {});

    return {
        entries,
        tags,
    };
}