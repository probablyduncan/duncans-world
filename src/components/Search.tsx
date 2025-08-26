import { useMapContext } from "./MapContext";
import levenshtein from "js-levenshtein";
import { createSignal, For } from "solid-js";

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

    const [results, setResults] = createSignal<string[]>([]);

    function getSearchResults() {
        const searchString = input?.value ?? "";

        if (!searchString) {
            setResults([]);
        };

        // const cache = new Map<string, number>();
        // function getDiffCached(str: string) {
        //     let diff = cache.get(str);
        //     if (diff === undefined) {
        //         diff = getDiffImpl(searchString, str);
        //         cache.set(str, diff);
        //     }
        //     return diff;
        // }

        const results = searchData.entryIDs.map(id => ({
            id, diff: getDiffImpl(searchString, id),
        })).sort((a, b) => a.diff - b.diff);

        setResults(results.filter(r => r.diff <= 10).map(r => r.id));
    }

    function blurSearch() {
        setResults([])
        if (input) {
            input.value = "";
            input.blur()
        }
    }

    return (<>
        <div class="search" onkeydown={(e) => {
            if (e.key === "Escape") blurSearch()
        }}>
            <div class="img"></div>
            <label>
                <input ref={input} oninput={getSearchResults} placeholder="Search ..." />
                <span class="keyhint"><span>{modifierLabel} + K</span></span>
            </label>
            <div class="results"><For each={results()}>{(r) => <div><button onclick={() => select(r)}>{r}</button></div>}</For></div>
        </div>
    </>)
}






function getDiffImpl(searchString: string, targetString: string) {
    const diff = levenshtein(searchString, targetString);

    // const stringSizeDiff = Math.abs(searchString.length - targetString.length);

    // if (diff === stringSizeDiff && searchString.length > 1) {
    //     return 0;
    // }

    return diff;
}