import { createEffect, createSignal, For } from "solid-js";
import { useMapContext } from "./MapContext";
import { EntryLink } from "./EntryLink";
import { Gesture } from "@use-gesture/vanilla";
import { clamp } from "@probablyduncan/common";

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

/**
 * how about:
 * map itself is scaled with transform
 * but label container is scaled with width/height
 * would that work
 */

export function MapContainer(props: MapContainerProps) {

    const { select, selected } = useMapContext();

    const labels: LabelProps[] = [
        {
            coords: [0.746, 0.484],
            text: "Daybreak",
            key: "daybreak",
            origin: "left",
        },
        {
            coords: [0.697, 0.482],
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

    let containerEl: HTMLDivElement | undefined;
    createEffect(() => {
        if (!containerEl) return;
        const mapEl = containerEl.querySelector(".map")!;

        const gesture = new Gesture(containerEl, {
            onDrag: ({ offset: [x, y], pinching, cancel }) => {
                if (pinching) return cancel();
                setPos([x, y]);
            },
            onPinch: ({ origin: [ox, oy], first, movement: [ms], offset: [s, a], memo }) => {

                if (first) {
                    const { width, height, x, y } = mapEl.getBoundingClientRect()
                    const tx = ox - (x + width / 2)
                    const ty = oy - (y + height / 2)
                    const [boundX, boundY] = getPosBounds(mapEl, containerEl);
                    memo = [pos()[0], pos()[1], tx, ty, boundX, boundY];
                }

                const x = memo[0] - (ms - 1) * memo[2]
                const y = memo[1] - (ms - 1) * memo[3]
                setScale(s);
                setPos([
                    clamp(x, -memo[4], memo[4]),
                    clamp(y, -memo[5], memo[5]),
                ]);
                return memo;
            },
            onWheel: ({ delta: [dx, dy] }) => {
                // translate map based on x/y scroll
                setPos(prev => [prev[0] - dx, prev[1] - dy]);
            }
        }, {
            target: mapEl,
            drag: {
                from: () => [pos()[0], pos()[1]],
                // bounds: () => getPosBoundsAsGestureBounds(mapEl, containerEl),
            },
            pinch: { scaleBounds: { min: 1, max: 10 } },
            wheel: {
                // bounds: () => getPosBoundsAsGestureBounds(mapEl, containerEl),
            }
        });
    });

    // pinch memo is broken, or on first pinch tick
    // something is not set properly

    // it seems like when pos or scale get set outside of
    // explicitly bounded gestures (wheel and drag), they
    // don't update the bounds function and some memo is outdated

    function getPosBoundsAsGestureBounds(mapEl: Element, containerEl: Element) {
        const [boundX, boundY] = getPosBounds(mapEl, containerEl);
        return {
            top: -boundY,
            bottom: boundY,
            left: -boundX,
            right: boundX,
        }
    }

    function getPosBounds(mapEl: Element, containerEl: Element): [number, number] {
        const { width: mapWidth, height: mapHeight } = mapEl.getBoundingClientRect();
        const { width: containerWidth, height: containerHeight } = containerEl.getBoundingClientRect();

        const boundY = (mapHeight / 2) + (containerHeight / 2) - 24;
        const boundX = (mapWidth / 2) + (containerWidth / 2) - 24;

        return [boundX, boundY];
    }

    return (<>
        <div ref={containerEl} class="map-container" style={{
            "--x": `${pos()[0]}px`,
            "--y": `${pos()[1]}px`,
            "--scale": scale(),
        }}>
            <div class="map"></div>
            <div class="labels">
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
                </For>
            </div>
            {/* <div class="border"></div> */}
        </div>
    </>)
}