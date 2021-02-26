<template>
    <div id="index-info-box">
        <h4><b>SafeMessage</b></h4>
        <h5>The unique privacy oriented messenger</h5>

        <div id="index-info-links-box">
            <router-link class="rlink" to="/chat">
                <b-icon icon="chat-fill"></b-icon> Chat
            </router-link>

            <router-link class="rlink" to="/cryptoMonitor">
                <b-icon icon="code-slash"></b-icon> Monitor Crypto
            </router-link>

            <router-link class="rlink" to="/donate">
                <b-icon icon="emoji-smile"></b-icon> Support the creator with BTC
            </router-link>

        </div>


    <div id="footer">
        <p id="footer-text">Created with 
            <span><b-icon icon="heart-fill" style="color: red; width: 16px; height: 16px;"></b-icon></span>
            + <span><img src="../../public/img/spring.svg" style="width: 22px; height: 22px;"/></span>
            + <span><img src="../../public/img/icons/favicon-16x16.png"/></span>
            </p>
    </div>

    </div>
</template>

<script>
    export default {
        components: {}
    }
</script>

<style>
    #index-info-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #b491c8;
    }

    #index-info-links-box{
        margin-top: 5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .rlink {
        font-size: 18px;
        margin: 10px 10px 10px 10px;
        color: #b491c8;
    }

    .rlink{
        color: #b491c8;

    }
    a:hover{
        color: #663a82;
    }

    #footer{
        margin: auto;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: darkslategray;
        text-align: center;
        padding-top: 5px;

    }
    #footer-text{
        text-align: center;
        vertical-align: middle;
    }

    span{
        vertical-align: middle;
    }
</style>