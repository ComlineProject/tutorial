<script>
    import "../styles/global.css"
    import { baseUrl } from "$lib/paging";
</script>


<header>
    <a class="titleLink" href="{baseUrl}">
        <h2 class="title">Comline Tutorial</h2>
    </a>
</header>

<main>
    <slot/>
</main>

<footer>
    Made with bread and smoothies
</footer>


<style>
    header {
        display: flex;
        justify-content: center;
        margin-top: 1pt;
        margin-bottom: 1pt;
        
        border-style: ridge;
        border-color: #614A39;
    }

    main {
        width: 100%;
        height: 100%;
        margin: 2px auto;
        padding-bottom: 2px;

        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        border-style: ridge;
        border-color: #614A39;
    }

    footer {
        padding-top: 10px;
        text-align: center;
        color: #F2E1CA;
    }

    .titleLink {
        text-decoration: none;
    }
    .title {
        position: relative;
        display: flex;
    }
    .title:hover {
        color: #DBB594;
    }
</style>
