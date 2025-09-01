import { createSignal, For } from "solid-js";
import { useMapContext } from "./MapContext";
import { EntryLink } from "./EntryLink";

interface MapContainerProps {
    labels: LabelProps[]
}

type LabelProps = {
    text: string;
    key: string;
    coords: [number, number];
    origin: "center" | "left";

    // scale??
    // show when zoomed a certain amount? idk

}

export function MapContainer(props: MapContainerProps) {

    const { select, selected } = useMapContext();

    const labels: LabelProps[] = [
        {
            coords: [0.75, 0.48],
            text: "Daybreak",
            key: "daybreak",
            origin: "left",
        },
        {
            coords: [0.69, 0.48],
            text: "The Cauldron",
            key: "cauldron",
            origin: "center",
        },
    ];

    function coordToCSSPercentage(fraction: number) {
        return `${fraction * 100}%`;
    }

    const [pos, setPos] = createSignal<[number, number]>([0, 0]);
    const [scale, setScale] = createSignal<number>(1);

    function resetMap() {
        select();
        setScale(1);
        setPos([0, 0]);
    }

    window.addEventListener("keydown", e => {
        if (e.key === "x") {
            e.preventDefault();
            resetMap();
        }
    });

    return (<>
        <div class="map-container">
            <div class="map" style={{}}>
                <For each={labels}>
                    {label =>
                        <EntryLink
                            key={label.key}
                            title={label.text}
                            isToggle={true}
                            classList={{
                                left: label.origin === "left",
                                center: label.origin === "center",
                                selected: selected.key === label.key,
                            }}
                            style={{
                                "--x": `${coordToCSSPercentage(label.coords[0])}`,
                                "--y": `${coordToCSSPercentage(label.coords[1])}`,
                            }}
                        >
                            {label.origin === "left" && "* "}{label.text}
                        </EntryLink>
                    }
                    {/* {label => <a
                        href={label.key}
                        title={label.text}
                        onClick={e => {

                            // check if trying to open in new tab and allow that
                            if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
                                return;
                            }

                            // otherwise select in current window
                            e.preventDefault();

                            if (selected.key === label.key) {
                                select();
                            }
                            else {
                                select(label.key);
                            }


                        }}
                        classList={{
                            left: label.origin === "left",
                            center: label.origin === "center",
                            selected: selected.key === label.key,
                        }}
                        style={{
                            "--x": `${coordToCSSPercentage(label.coords[0])}`,
                            "--y": `${coordToCSSPercentage(label.coords[1])}`,
                        }}
                    >{label.origin === "left" && "* "}{label.text}</a>} */}
                </For>
            </div>
        </div>
    </>)
}