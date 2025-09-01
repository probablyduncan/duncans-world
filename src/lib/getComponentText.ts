import type { JSX } from "solid-js/jsx-runtime";

export function getComponentText(component: JSX.Element): string {
    
    if (!component) {
        return "";
    }

    if (typeof component === "string") {
        return component;
    }

    // can be Node, in which case innerText gets all descendents' text
    if (typeof component === "object" && "innerText" in component) {
        return getComponentText(component.innerText as string);
    }

    if (typeof component === "function") {
        return getComponentText((component as () => "")());
    }
    
    if (Array.isArray(component)) {
        return component.map(getComponentText).join("");
    }

    return "";
}
