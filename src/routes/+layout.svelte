<script>
    import "../styles/global.css"
    import { baseUrl } from "$lib/paging";
    import ThemeToggle from "$lib/ui/ThemeToggle.svelte";
</script>


<header>
    <a class="titleLink" href={baseUrl}>
        <h1 class="title">Comline Tutorial</h1>
    </a>
    <div class="headerEnd">
        <ThemeToggle/>
    </div>
</header>

<main>
    <slot/>
</main>

<footer>
    Made with bread and smoothies
</footer>


<style>
    header {
        position: relative;
        display: flex;
        flex: none;
        justify-content: center;
        margin-top: 1pt;
        margin-bottom: 1pt;

        border-style: ridge;
        border-color: var(--border);
    }

    main {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        overflow: auto;
        width: 100%;
        margin: 2px auto;

        align-items: center;
        text-align: center;

        border-style: ridge;
        border-color: var(--border);
    }

    footer {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: center;
        padding: 8px;
        text-align: center;
        color: var(--fg);

        border-style: ridge;
        border-color: var(--border);
    }

    .titleLink {
        text-decoration: none;
    }
    .title {
        position: relative;
        display: flex;
    }
    .title:hover {
        color: var(--accent);
    }

    /* The theme toggle, at the header's right end. */
    .headerEnd {
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translateY(-50%);
    }
</style>
