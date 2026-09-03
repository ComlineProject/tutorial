import { dev } from "$app/environment"
import { base } from "$app/paths"


export interface Page {
    id: string,
    url: string,
    name: string
}

/** Every tutorial page, in reading order. `pageUrl(id)` resolves against this
 *  and `NavigationTable` lists it. Ids are stable — add entries as routes land. */
export const PAGES: Page[] = [
    { id: "p1", url: "part-1_introduction", name: "Introduction" },
    { id: "p1-s1", url: "part-1_introduction/sect-1_what-is-comline", name: "What is Comline?" },
    { id: "p1-s2", url: "part-1_introduction/sect-2_how-is-comline", name: "How is Comline?" },
]

export const baseUrl = dev ? '/' : base + '/'

/** The URL for a page id, or `null` when that page does not exist yet — callers
 *  hand the `null` straight to a `NavigationButton`'s `disabled`. */
export function pageUrl(id: string): string | null {
    const found = PAGES.find(page => page.id === id)
    return found ? `${baseUrl}${found.url}` : null
}
