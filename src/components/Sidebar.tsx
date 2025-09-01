import { SolidMarkdown } from "solid-markdown"
import { useMapContext } from "./MapContext"
import type { HTMLAttributes } from "astro/types"
import type { ParentProps } from "solid-js"
import { EntryLink } from "./EntryLink";
import { getComponentText } from "../lib/getComponentText";

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

function Link(props: ParentProps<{
    href?: string;
    title?: string;
}>) {

    const { searchData } = useMapContext();

    let key: string = "";
    
    if (props.href) {
        // try get key from href
        key = props.href.toString();
    }

    if (key === "") {
        // try get key from inner text
        key = getComponentText(props.children).toLowerCase().replaceAll(" ", "-");
    }

    if (key in searchData.entries) {
        const entry = searchData.entries[key];
        return (
            <EntryLink
                key={key}
                title={entry.title}
            >
                {props.children}
            </EntryLink>
        );
    }

    return (
        <span
            title="I’m still working on that!"
            class="bad-link"
        >
            {props.children}
        </span>
    );
}