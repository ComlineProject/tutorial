<script lang="ts">
    export let href_url: string | null;
    export let text: string;
    export let disabled: boolean = false;
</script>


<!-- A disabled button has no href, so it isn't a link at all. -->
<a class="btn" class:disabled href={disabled ? undefined : href_url ?? '#'}
    aria-disabled={disabled}>
    {text}
</a>


<style>
    .btn {
        text-align: center;
        padding: 10px 20px;
        cursor: pointer;
        text-decoration: none;
        background-color: var(--btn-bg);
        color: var(--btn-fg);
        border-color: var(--btn-border);
        border-style: ridge;
    }
    .btn:hover {
        background-color: var(--btn-hover);
    }
    .btn:active {
        background-color: var(--btn-active);
    }
    .btn.disabled {
        cursor: default;
        opacity: 0.4;
        background-color: var(--btn-bg);
    }
</style>
