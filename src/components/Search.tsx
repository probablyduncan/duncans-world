import { useMapContext } from "./MapContext";
import levenshtein from "js-levenshtein";
import { createSignal, For } from "solid-js";
import type { SearchData, SearchEntry } from "../lib/content";
import { EntryLink } from "./EntryLink";

export function Search() {

    const { searchData, select } = useMapContext();

    const isApple = navigator.platform.startsWith("Mac") || navigator.platform === "iPhone";

    const modifierKey = isApple ? "⌘" : "^";
    const modifierLabel = isApple ? "Cmd" : "Ctrl";

    function isModifierPressed(e: KeyboardEvent) {
        return isApple ? e.metaKey : e.ctrlKey;
    }

    let input: HTMLInputElement | undefined;

    window.addEventListener("keydown", e => {
        if (input && (e.key === "k" && isModifierPressed(e) || e.key === "/")) {
            e.preventDefault();
            input.focus();
        }
    });

    const [results, setResults] = createSignal<SearchEntry[]>([]);

    function getSearchResults() {
        const searchString = input?.value ?? "";

        if (searchString === "") {
            setResults([]);
            return;
        };

        setResults(Object.values(searchData.entries)
            .map(entry => ({ ...entry, diff: getDiffImpl(searchString, entry) }))
            .sort((a, b) => a.diff - b.diff)
            .slice(0, 5));
    }

    function blurSearch() {
        setResults([])
        if (input) {
            input.value = "";
            input.blur()
        }
    }

    function onSearchKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            e.stopPropagation();
            e.preventDefault();
            blurSearch();
        }
    }

    function onInputKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (results().length > 0) {
                select(results()[0].key);
            }
            blurSearch();
        }
    }

    return (<>
        <div class="search" onkeydown={onSearchKeyDown}>
            <div class="img"></div>
            <label>
                <input ref={input} oninput={getSearchResults} onkeydown={onInputKeyDown} placeholder="Search ..." />
                <span class="keyhint"><span>{modifierLabel} + K</span></span>
            </label>
            {results().length && <ul>
                <For each={results()}>{(entry) => {
                    return (<li>
                        <EntryLink key={entry.key} title={entry.title} onclick={blurSearch}>
                            {entry.title} {entry.tags.length && <span class="serif">&lcub;{entry.tags.join(", ")}&rcub;</span>}
                        </EntryLink>
                    </li>)
                }}</For>
            </ul>}
        </div>
    </>)
}






function getDiffImpl(searchString: string, entry: SearchEntry) {

    searchString = searchString.toLowerCase();
    const targetString = entry.title.toLowerCase();

    let diff = levenshtein(searchString, targetString);
    const index = targetString.indexOf(searchString);

    // if search in title
    if (index !== -1) {
        diff -= targetString.length - searchString.length;

        // if search is start of word in title
        if (index === 0 || targetString[index - 1] === " ") {
            diff -= targetString.length;
        }
    }

    return diff;
}