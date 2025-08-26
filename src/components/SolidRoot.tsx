import { MapContextProvider } from "./MapContext";
import { MapContainer } from "./MapContainer";
import { Sidebar } from "./Sidebar";
import { Search } from "./Search";
import type { SearchData, WikiDTO } from "../lib/content";

export function SolidRoot(props: {
    entry?: WikiDTO;
    searchData: SearchData;
}) {
    return <>
        <MapContextProvider initialEntry={props.entry} searchData={props.searchData}>
            <MapContainer />
            <Search />
            <Sidebar />
        </MapContextProvider>
    </>
}