<script lang="ts">
	import NavigationButton from "./navigation_button.svelte";
	import NavigationTable from "./navigation_table.svelte";

    export let previous_url: string | null;
    export let next_url: string | null;
</script>


<div class="page">
    <NavigationTable/>
    <div class="main">
        <!-- A page with a `workspace` (an editor, a simulation) shows it beside
             the lesson; one without has the lesson alone. -->
        <div class="body" class:split={$$slots.workspace}>
            <div class="scroll">
                <div class="content">
                    <slot/>
                </div>
            </div>
            {#if $$slots.workspace}
                <div class="workspace">
                    <slot name="workspace"/>
                </div>
            {/if}
        </div>

        <div class="buttons">
            <NavigationButton href_url={previous_url ?? ''}
                text="Back" disabled={previous_url === null}
            />
            <NavigationButton href_url={next_url ?? ''}
                text="Next" disabled={next_url === null}
            />
        </div>
    </div>
</div>


<style>
    /* The page fills the height it's given: the navigation down one side, and
       the content beside it. */
    .page {
        display: flex;
        flex-direction: row;
        flex: 1;
        min-height: 0;
        width: 100%;
    }
    /* The content scrolls; the Back/Next bar stays at the bottom. */
    .main {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        min-height: 0;
    }
    .body {
        display: flex;
        flex: 1;
        min-height: 0;
    }
    .scroll {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
    }
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 48rem;
        margin: 0 auto;
        padding: 0 8px 12px;
    }
    .buttons {
        display: flex;
        flex: none;
        gap: 4pt;
        padding: 10px 8px;

        align-items: center;
        justify-content: center;

        border-top: 3px ridge var(--border);
    }

    /* Split: the lesson on the left, read top to bottom, and the workspace on
       the right at the full height. */
    .split .scroll {
        flex: 0 0 clamp(18rem, 38%, 32rem);
        border-right: 3px ridge var(--border);
    }
    .split .content {
        max-width: none;
        align-items: stretch;
        padding: 8px 32px 24px;
        text-align: left;
    }
    /* global.css indents every paragraph, which only shows once it's left-aligned. */
    .split .content :global(p) {
        padding-left: 0;
    }
    .workspace {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        min-height: 0;
    }

    /* On a narrow screen the navigation goes above the content. */
    @media (max-width: 640px) {
        .page {
            flex-direction: column;
        }
    }

    /* Too narrow for two columns: the lesson, then the workspace below it,
       scrolling together. */
    @media (max-width: 900px) {
        .split {
            flex-direction: column;
            overflow-y: auto;
        }
        .split .scroll {
            flex: none;
            overflow: visible;
            border-right: none;
            border-bottom: 3px ridge var(--border);
        }
        .workspace {
            flex: none;
            height: 85%;
            min-height: 28rem;
        }
    }
</style>
