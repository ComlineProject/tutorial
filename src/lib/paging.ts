import { error } from "@sveltejs/kit"


export interface Page {
    id: string,
    url: string,
    name: string
}

const PAGES: Page[] = [
    { id: "p1", url: "/part-1_introduction", name: "Introduction" },
    { id: "p1-s1", url: "/part-1_introduction/sect-1_what-is-comline", name: "What is Comline?" },
    { id: "p1-s2", url: "/part-1_introduction/sect-2_how-is-comline", name: "How is Comline?" },
    
    { id: "p2", url: "/part-2_basics", name: "Basics" },
    { id: "p2-s1", url: "/part-2_basics/sect-2_what-is-comline", name: "What is Comline?" },
]

export function pageUrl(id: string): string {
    let found = PAGES.find(page => page.id === id)

    if (!found) {
        throw error(400, `Couldn't find tutorial page by ID '${id}', go back or start from beginning`)
    }

    return found.url
}
