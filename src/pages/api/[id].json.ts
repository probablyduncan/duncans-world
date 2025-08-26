import type { APIRoute } from "astro";
import { getWikiPaths, type WikiDTO } from "../../lib/content";
import { getEntry, type CollectionEntry } from "astro:content";

export const partial = true;
export const getStaticPaths = getWikiPaths;

/**
 * Returns JSON containing the `id`, `data`, and `body` props of the Wiki collection.
 */
export const GET: APIRoute = async ({ params }) => {
    const entry = await getEntry("wiki", params.id as CollectionEntry<"wiki">["id"])!;
    const dto: WikiDTO = {
        id: entry.id,
        data: entry.data,
        body: entry.body,
    }

    return new Response(
        JSON.stringify(dto),
    );
};