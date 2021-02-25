<template>
    <div id="index-info-box">
        <h4><b>SafeMessage</b></h4>
        <h5>The unique privacy oriented messenger</h5>
        <router-link class="text-success rlink" to="/chat">
            <b-icon icon="chat-fill"></b-icon> Chat
        </router-link>

        <router-link class="text-success rlink" to="/cryptoMonitor">
            <b-icon icon="code-slash"></b-icon> Monitor
        </router-link>
        <router-link class="text-success rlink" to="/donate">
            <b-icon icon="emoji-smile"></b-icon> Support the creator with BTC
        </router-link>

    </div>
</template>

<script>
    export default {
        components:{
        }
    }
</script>

<style>
    #index-info-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
    }

    .rlink {
        font-size: 18px;
    }
</style>