import { SolidMarkdown } from "solid-markdown"
import { useMapContext } from "./MapContext"
import type { HTMLAttributes } from "astro/types"
import type { ParentProps } from "solid-js"

export function Sidebar() {

    const { selected, select } = useMapContext();

    window.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            // close sidebar
            select();
        }

        // this `false` means it'll get called after keydown event in search,
        // which will capture escape key and stopPropagation to blur search
    }, false);

    return (<>
        {selected.entry && <div class="sidebar">
            {/* <div style={{ margin: "1em", }}>
                <button onclick={() => select("daybreak")}>daybreak!</button>
                <br />
                <button onclick={() => select("about")}>about!</button>
                <br />
                <button onclick={() => select("bunko")}>bunko!</button>
                <br />
                <button onclick={() => select()}>none!</button>
                <br />
                <br />
                key: {selected.key}
                <br />
                <br />
                <code>{JSON.stringify(selected.entry, null, 2)}</code>
                <br />
                <br />
            </div> */}
            <article style={{ margin: "1em", }}>
                <h1>{selected.entry?.data.title}</h1>
                <SolidMarkdown children={selected.entry?.body} components={{ a: Link }} />
            </article>
        </div>}
    </>)
}

function Link(props) {

    const { select, searchData } = useMapContext()

    const href = props.href?.toString() ?? "";
    const attrs = {}
    if (href in searchData.entries) {
        attrs["onclick"] = () => { select(href); }
        attrs["style"] = { color: "cornflowerblue", cursor: "pointer", "text-decoration": "underline" };
        attrs["title"] = "Navigate to view";
    }
    else {
        attrs["style"] = { color: "indianred", cursor: "not-allowed" };
        attrs["title"] = "I'm still working on that!"
    }

    return <a {...attrs}>{props.children}</a>
}