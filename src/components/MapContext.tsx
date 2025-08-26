import { createContext, useContext, type ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import type { SearchData, WikiDTO } from "../lib/content";

export function useMapContext() {
    if (!MapContext) throw "MapContext undefined!";
    const context = useContext(MapContext);
    if (!context) throw "useContext(MapContext) undefined!";
    return context;
}

const MapContext = createContext<MapContext>();

interface MapContext {
    selected: ViewState;
    select: (key?: string) => Promise<void>;
    deselect: () => void;
    searchData: SearchData;
}

interface ViewState {
    key: string | undefined;
    entry?: WikiDTO;
}

export function MapContextProvider(props: ParentProps<{
    initialEntry?: WikiDTO,
    searchData: SearchData,
}>) {

    async function fetchEntry(key: string): Promise<WikiDTO | undefined> {
        const response = await fetch("/api/" + key + ".json");
        if (response.status === 200) {
            return await response.json() as WikiDTO;
        }

        return undefined;
    }

    const [selected, setSelected] = createStore<ViewState>({
        key: props.initialEntry?.id,
        entry: props.initialEntry,
    })

    const cache = new Map<string, WikiDTO>();

    async function select(key?: string) {

        if (!key) {
            setSelected("key", undefined);
            setSelected("entry", undefined);
            return;
        }

        setSelected("key", key);
        let entry: WikiDTO | undefined;
        if (cache.has(key)) {
            entry = cache.get(key);
        }
        else {
            entry = await fetchEntry(key);
            if (entry) {
                cache.set(key, entry);
            }
        }

        if (entry) {
            setSelected("entry", { ...entry });
        }
        else {
            setSelected("entry", undefined);
        }

        // history.pushState(entry, "", entry ? ("/" + key) : "");
    }

    // window.addEventListener("popstate", (e) => {
    //     if (e.state) {
    //         select(e.state.id);
    //         console.log("popstate", e.state);
    //     }
    //     else {
    //         select("");
    //     }
    //     return true
    // })

    function deselect() {
        setSelected("key", undefined);
    }

    return <MapContext.Provider value={{
        selected,
        select,
        deselect,
        searchData: props.searchData
    }}>
        {props.children}
    </MapContext.Provider>;
}