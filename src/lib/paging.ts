import { dev } from "$app/environment"
import { base } from "$app/paths"


export interface Page {
    id: string,
    url: string,
    name: string
}

/** A part of the tutorial: its own page, then its sections. */
export interface Part extends Page {
    sections: Page[]
}

/** The tutorial as a tree, which `NavigationTable` draws. Ids are stable —
 *  add entries as routes land. */
export const PARTS: Part[] = [
    { id: "p1", url: "part-1_introduction", name: "Introduction", sections: [
        { id: "p1-s1", url: "part-1_introduction/sect-1_what-is-comline", name: "What is Comline?" },
        { id: "p1-s2", url: "part-1_introduction/sect-2_how-is-comline", name: "How is Comline?" },
        { id: "p1-s3", url: "part-1_introduction/sect-3_try-it", name: "Try it" },
    ] },
    { id: "p2", url: "part-2_basics", name: "Basics", sections: [
        { id: "p2-s1", url: "part-2_basics/sect-1_your-first-schema", name: "Your first schema" },
        { id: "p2-s2", url: "part-2_basics/sect-2_structs-and-enums", name: "Structs and enums" },
        { id: "p2-s3", url: "part-2_basics/sect-3_protocols", name: "Protocols" },
    ] },
    { id: "p3", url: "part-3_generating-code", name: "Generating code", sections: [
        { id: "p3-s1", url: "part-3_generating-code/sect-1_running-the-generator", name: "Running the generator" },
        { id: "p3-s2", url: "part-3_generating-code/sect-2_using-the-generated-code", name: "Using the generated code" },
    ] },
]

/** Every tutorial page, in reading order. `pageUrl(id)` resolves against this. */
export const PAGES: Page[] = PARTS.flatMap(({ sections, ...part }) => [part, ...sections])

export const baseUrl = dev ? '/' : base + '/'

/** The URL for a page id, or `null` when that page does not exist yet — callers
 *  hand the `null` straight to a `NavigationButton`'s `disabled`. */
export function pageUrl(id: string): string | null {
    const found = PAGES.find(page => page.id === id)
    return found ? `${baseUrl}${found.url}` : null
}
