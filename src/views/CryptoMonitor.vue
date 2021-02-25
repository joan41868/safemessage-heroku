<template>
    <div>
        <show-info-button></show-info-button>
        <go-home-button></go-home-button>
        <b-alert :show="dismissCountDown" dismissible variant="success" @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged" style="width: 70%; margin: auto;">
            <p>{{alertText}}</p>
            <p>Will be dismissed automaticaly after {{dismissCountDown}}</p>
            <b-progress variant="warning" :max="dismissSecs" :value="dismissCountDown" height="4px"></b-progress>
        </b-alert>

    </div>

</template>

<script>
    import SockJs from 'sockjs-client';
    import StompClient from 'webstomp-client';
    import ShowInfoButton from '../components/ShowInfoButton.vue';
    import GoHomeButton from '../components/GoHomeButton.vue';

    export default {
        components: {
            ShowInfoButton,
            GoHomeButton
        },
        data() {
            return {
                alertText: '',
                dismissCountDown: 0,
                dismissSecs: 0,
                beUrl: 'http://localhost:8080', //'https://java-chat-backend.herokuapp.com',
                connectedToServer: Boolean
            }
        },
        mounted() {
            this.connectToChatServer();
        },
        methods: {
            subscribeToCoinListing() {
                this.stompClient.subscribe("/topic/listedCoins", (data) => {
                    const {
                        body
                    } = data;
                    this.alertText = JSON.parse(body).ListedCoin.message;
                    this.dismissSecs = 5;
                    this.dismissCountDown = 5;
                    this.showAlert = true;
                });
            },

            connectToChatServer() {
                this.connectedToServer = false;
                this.socket = new SockJs(this.beUrl + "/chat-app");
                this.stompClient = StompClient.over(this.socket, {
                    debug: false
                });

                this.stompClient.connect({}, (frame) => {
                    this.connectedToServer = true;
                    this.subscribeToCoinListing();
                });
            },
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs
            },
        }
    }
</script>

<style>

</style>