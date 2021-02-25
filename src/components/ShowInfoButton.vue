<template>
    <div>
        <b-icon icon="question" style="position: absolute; top: 5px; right: 5px; font-size: 33px;"
            class="h4 text-success" v-b-modal.modal-1></b-icon>


        <b-modal id="modal-1" title="Safemessage" body-bg-variant="dark" header-bg-variant="dark"
            footer-bg-variant="dark" body-text-variant="light" header-text-variant="light" :cancel-disabled="true">
            <p>A secure chat aimed at maximum privacy.</p>
            <p>No cookies.</p>
            <p>No trackers.</p>
            <p>No database for messages.</p>
            <router-link to="/donate">Support the author :)</router-link>
        </b-modal>

    </div>

</template>

<script>
    export default {

    }
</script>

<style>

</style>