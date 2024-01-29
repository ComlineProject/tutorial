<script lang="ts">
    export let href_url: string;
    export let text: string;
    export let disabled: boolean = false;
</script>


<a class="{disabled ? "btn-disabled" : "btn"}" href={href_url}>
    {text}
</a>


<style>
    .btn {
        text-align: center;
        padding: 10px 20px;
        cursor: pointer;
        text-decoration: none;
        background-color: #322922;
        color: #DBB594;
        border-color: #4D3C2F;
        border-style: ridge;
    }
    .btn:hover {
        background-color: #3E3128;
    }
    .btn:active {
        background-color: #28211D;
    }
</style>
