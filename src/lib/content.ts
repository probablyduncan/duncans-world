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


export type SearchData = {
    entryIDs: string[],
    tags: string[],
    // entriesByTag: Record<string, string[]>,
    // tagsByEntry: Record<string, string[]>,
}

export async function getSearchData(): Promise<SearchData> {
    const wikiCollection = await getCollection("wiki");
    const tagCollection = await getCollection("tags");

    const wikiIDs = wikiCollection.map((w) => w.id);
    // console.log(wikiIDs)
    const wikiTags = tagCollection.map((t) => t.id);
    // console.log(wikiTags)

    const wikiData: Record<string, {
        tags: string[],
        title: string,
    }> = wikiCollection.reduce(
        (result, entry) => {
            result[entry.id] = {
                title: entry.data.title,
                tags: toSeveral(entry.data.tags ?? []).map((t) => t?.id),
            };
            return result;
        },
        {},
    );
    // console.log(wikiData)

    const wikiIDsbyTag: Record<string, string[]> = wikiTags.reduce((result, tag) => {
        result[tag] = wikiIDs
            .filter((w) => wikiData[w]?.tags?.includes(tag) ?? false)
            .map((w) => w);
        return result;
    }, {});
    // console.log(wikiIDsbyTag)

    // map of all related entries by entry id
    const relatedIDs: Record<string, string[]> = wikiCollection.reduce(
        (result, entry) => {
            const related = toSeveral(entry.data.related ?? []).map(r => r.id);

            result[entry.id] ??= [];
            result[entry.id].push(...related);

            related.forEach(r => {
                result[r] ??= [];
                result[r].push(entry.id);
            });

            return result;
        }, {}
    )
    // remove duplicates
    Object.entries(relatedIDs).forEach(e => relatedIDs[e[0]] = [...new Set(e[1])]);
    // console.log(relatedIDs)

    return {
        entryIDs: wikiIDs,
        tags: wikiTags,
        // entriesByTag: wikiIDsbyTag,
        // tagsByEntry: 
    }
}