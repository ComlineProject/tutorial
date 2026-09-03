<script>
    import "../styles/global.css"
    import { baseUrl } from "$lib/paging";
</script>


<header>
    <a class="titleLink" href={baseUrl}>
        <h1 class="title">Comline Tutorial</h1>
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
        display: flex;
        flex-direction: column;
        margin: 2px auto;
        padding-bottom: 1%;
        
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
