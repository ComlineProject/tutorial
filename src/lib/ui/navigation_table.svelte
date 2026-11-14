<script lang="ts">
    import "../../styles/global.css"
    import { page } from "$app/state";
    import { PARTS, pageUrl, type Part } from "$lib/paging";

    // Paths compare without their trailing slash (the site uses `trailingSlash: 'always'`).
    const trim = (path: string) => path.replace(/\/$/, "")
    const current = $derived(trim(page.url.pathname))

    const isCurrent = (id: string) => trim(pageUrl(id) ?? "") === current
    /** A part starts open when the reader is on it or one of its sections. */
    const holdsCurrent = (part: Part) =>
        isCurrent(part.id) || part.sections.some(section => isCurrent(section.id))
</script>


<nav class="nav" aria-label="Tutorial contents">
    <ul class="tree">
        {#each PARTS as part, i (part.id)}
            <li>
                <details open={holdsCurrent(part)}>
                    <summary>
                        <a href={pageUrl(part.id)} aria-current={isCurrent(part.id) ? "page" : undefined}>
                            <span class="num">{i + 1}.</span> <span>{part.name}</span>
                        </a>
                    </summary>
                    <ul class="sections">
                        {#each part.sections as section, j (section.id)}
                            <li>
                                <a href={pageUrl(section.id)} aria-current={isCurrent(section.id) ? "page" : undefined}>
                                    <span class="num">{i + 1}.{j + 1}</span> <span>{section.name}</span>
                                </a>
                            </li>
                        {/each}
                    </ul>
                </details>
            </li>
        {/each}
    </ul>
</nav>


<style>
    /* The tree scrolls on its own when it's longer than the page. */
    .nav {
        flex: 0 0 16rem;
        overflow-y: auto;
        padding: 12px 8px;
        text-align: left;

        border-right: 3px ridge var(--border);
    }

    .tree, .sections {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .sections {
        margin: 4px 0 8px 6px;
        padding-left: 10px;
        border-left: 1px solid var(--border);
    }
    li {
        margin: 2px 0;
    }

    summary {
        display: flex;
        align-items: baseline;
        cursor: pointer;
        color: var(--accent);
    }
    summary::before {
        content: "▾";
        width: 1em;
    }
    details:not([open]) > summary::before {
        content: "▸";
    }
    summary::-webkit-details-marker {
        display: none;
    }
    summary a {
        flex: 1;
    }

    /* A long name wraps under itself, not under its number. */
    a {
        display: flex;
        gap: 0.5em;
        padding: 1px 4px;
        text-decoration: none;
    }
    .num {
        flex: none;
    }
    a:hover {
        text-decoration: underline;
    }
    a[aria-current="page"] {
        color: var(--accent);
        background-color: var(--current-bg);
    }

    @media (max-width: 640px) {
        /* Above the content, the tree takes at most a third of the page. */
        .nav {
            flex: none;
            max-height: 33%;
            border-right: none;
            border-bottom: 3px ridge var(--border);
        }
    }
</style>
