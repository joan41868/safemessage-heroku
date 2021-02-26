<template>
	<div class="home bg-dark">

		<show-info-button></show-info-button>
		<go-home-button></go-home-button>


		<p style="color: white; font-size: 22px;">Your are: {{username}}</p>

		<b-form @submit="sendMessage"
			style="display: flex; flex-direction: column; justify-content: space-between; margin: auto; width: 75%;">
			<b-form-input id="recipient" type="text" placeholder="recipient..."
				style="margin-top: 5px; margin-bottom: 5px;" />

			<div class="chatmessagecontainer" v-show="messages.length > 0">

				<span v-for="message in messages" v-bind:key="message.content + Math.random().toString()">
					<message :content="message.content" :senderUsername="message.senderUsername"></message>
				</span>

			</div>

			<div class="chat-controller">

				<b-form-input id="messageContent" type="text" placeholder="Your message.."
					style="margin-top: 5px; margin-bottom: 10px;" />

				<span
					style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 5px; margin: auto;">
					<b-button type="submit" variant="outline-success" @click="sendMessage">
						<b-icon icon="chat-fill"></b-icon> Send
					</b-button>
					<b-button variant="outline-danger" @click="()=>{messages=[]}">
						<b-icon icon="trash"></b-icon> Clear
					</b-button>
				</span>

			</div>


		</b-form>


	</div>
</template>

<script>
	// @ is an alias to /src
	import SockJs from 'sockjs-client';
	import StompClient from 'webstomp-client';
	import Message from '../components/Message.vue';
	import * as uuid from 'uuid';
	import * as axios from 'axios';
	import GoHomeButton from '../components/GoHomeButton.vue';
	import ShowInfoButton from '../components/ShowInfoButton.vue';

	export default {
		name: 'Chat',
		components: {
			Message,
			GoHomeButton,
			ShowInfoButton
		},
		data() {
			return {
				connectedToServer: false,
				messages: [],
				showInfo: Boolean,
				username: String,
				alertText: String,
				dismissSecs: 0,
				dismissCountDown: 0,
				beUrl: 'https://java-chat-backend.herokuapp.com'
			}
			// this.username = "";
		},
		async mounted() {

			this.showInfo = false;
			await this.sendInitialConnectionRequest();
			this.connectToChatServer();

		},
		created() {
			this.username = undefined;
			this.messages = [];
		},
		methods: {
			enterUsernamePrompt() {
				this.username = prompt("Enter a fancy username", uuid.v4());
			},

			showUsernamePopUp() {
				this.$refs.usernamePopUp.show();
			},

			triggerShowInfo() {
				this.showInfo = !this.showInfo;
			},

			resubscribe() {
				if (this.stompClient.connected && this.lastSubscription) {
					this.lastSubscription.unsubscribe();
					this.subscribeToChat();
				}
			},
			goBack(){
				this.$router.push("/");
			},

			addMessage(message) {

				if (this.messages.length > 7) {
					this.messages.pop();
				}
				this.messages.push(message);
			},

			async sendInitialConnectionRequest() {
				const ax = axios.default;
				const ipifyUrl = 'https://api.ipify.org?format=json';
				const ipData = (await ax.get(ipifyUrl)).data;
				const {
					ip
				} = ipData;
				const checkUrl = this.beUrl + '/check/' + ip;
				// data should contain IP
				const rsp = await ax.get(checkUrl);

				const {
					data
				} = rsp;

				if (data.ipAddressHash && data.username) {
					this.username = data.username;
				} else {
					this.username = prompt("Enter a username");
					if (this.username) {
						const registerUrl = this.beUrl + "/create";
						const requestData = {
							ipAddress: ip,
							username: this.username
						};
						await ax.post(registerUrl, requestData);
					} else {
						await this.sendInitialConnectionRequest();
					}
				}

			},

			subscribeToChat() {
				if (this.username && this.username !== '') {
					this.lastSubscription = this.stompClient.subscribe("/topic/messages/" + this.username, (data) => {
						const {
							senderUsername,
							recipientUsername,
							content
						} = JSON.parse(data.body);

						const message = {
							senderUsername,
							recipientUsername,
							content,
						};

						this.addMessage(message);
					});
				}
			},
			connectToChatServer() {
				this.connectedToServer = false;
				// https://java-chat-backend.herokuapp.com
				this.socket = new SockJs(this.beUrl + "/chat-app");
				this.stompClient = StompClient.over(this.socket, {
					debug: false
				});

				this.stompClient.connect({}, (frame) => {
					this.connectedToServer = true;
					this.subscribeToChat();
				});
			},

			sendMessage(e) {
				e.preventDefault();
				const message = {
					senderUsername: this.username,
					recipientUsername: document.getElementById('recipient').value,
					content: document.getElementById('messageContent').value,
				};
				if (message.content.length > 0) {

					this.stompClient.send("/topic/messages/" + message.recipientUsername, JSON.stringify(message), {});

					this.addMessage(message);

					document.getElementById('messageContent').value = "";
				}
			}
		}
	}
</script>

<style scoped>
	.chatmessagecontainer {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		max-height: 320px;
		overflow-x: none;
		overflow-y: scroll;
		border: 1px solid black;
		border-radius: 8px;
		margin: auto;
		margin-top: 10px;
		width: 75%;
		padding: 5px 5px 5px 5px;
	}

	.chat-controller {
		margin: auto;
		width: 75%;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 5px;

	}

	button {
		font-size: 15px;
	}

	input {
		font-size: 16px;
	}
</style>