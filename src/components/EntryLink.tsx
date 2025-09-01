import type { JSX, ParentProps } from "solid-js";
import { useMapContext } from "./MapContext";

interface EntryLinkProps extends ParentProps<{
    
    key?: string;
    title?: string;
    
    /**
     * Called on click. IsModified is true if opening in new tab.
     */
    onclick?: (e: MouseEvent, isModified: boolean) => void;
    
    /**
     * If true, entry will be deselected
     * on click if already selected
     */
    isToggle?: boolean;

    classList?: { [key: string]: boolean };
    class?: string;
    style?: string | JSX.CSSProperties;
}> {}

export function EntryLink(props: EntryLinkProps) {

    const { select, selected } = useMapContext();

    if (!props.key) {
        return props.children;
    }

    return (
        <a
            href={"/" + props.key}
            title={props.title}
            class={props.class}
            classList={props.classList ?? {}}
            style={props.style}
            onclick={e => {
                const isModified = e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;

                if (!isModified) {
                    e.preventDefault();

                    if (props.isToggle && selected.key === props.key) {
                        select();
                    }
                    else {
                        select(props.key);
                    }
                }

                if (props.onclick) {
                    props.onclick(e, isModified);
                }
            }}
        >{props.children}</a>
    )
}