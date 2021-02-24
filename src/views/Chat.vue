<template>
	<div class="home bg-dark">

		<b-icon icon="question" style="position: absolute; top: 5px; right: 5px; font-size: 30px;" class="text-success"
			v-b-modal.modal-1></b-icon>

		<b-icon icon="person" style="position: absolute; top: 5px; left: 5px; font-size: 30px;" class="text-danger"
			v-b-modal.modal-2></b-icon>

		<b-alert :show="dismissCountDown" dismissible variant="warning" @dismissed="dismissCountDown=0"
			@dismiss-count-down="countDownChanged" style="width: 40%; margin: auto;">
			<p>{{alertText}}</p>
			<p>Will be dismissed automaticaly after {{dismissCountDown}}</p>
			<b-progress variant="warning" :max="dismissSecs" :value="dismissCountDown" height="4px"></b-progress>
		</b-alert>

		<b-modal id="modal-1" title="Safemessage" body-bg-variant="dark" header-bg-variant="dark"
			footer-bg-variant="dark" body-text-variant="light" header-text-variant="light" :cancel-disabled="true">
			<p>A secure chat aimed at maximum privacy.</p>
			<p>No cookies.</p>
			<p>No trackers.</p>
			<p>No database.</p>
			<p>New username on refresh.</p>
			<router-link to="/donate">Support the author :)</router-link>
		</b-modal>

		<b-modal ref="usernamePopUp" id="modal-2" title="Enter username" body-bg-variant="dark" header-bg-variant="dark"
			footer-bg-variant="dark" body-text-variant="light" header-text-variant="light" :cancel-disabled="true"
			ok-variant="success">
			<b-form-input id="usernameInput" v-model="username"></b-form-input>

		</b-modal>


		<p style="color: white; font-size: 22px;">Your name is: {{username}}</p>

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
					<b-button type="submit" variant="success" @click="sendMessage">
						<b-icon icon="chat-fill"></b-icon> Send
					</b-button>
					<b-button variant="danger" @click="()=>{messages=[]}">
						<b-icon icon="trash"></b-icon> Clear
					</b-button>
				</span>

			</div>


		</b-form>


	</div>
</template>

<script>
	// @ is an alias to /src
	import HelloWorld from '@/components/HelloWorld.vue'
	import SockJs from 'sockjs-client';
	import StompClient from 'webstomp-client';
	import Message from '../components/Message.vue';
	import Info from './Info.vue';
	import * as uuid from 'uuid';
	import * as axios from 'axios';

	export default {
		name: 'Home',
		components: {
			HelloWorld,
			Message,
			Info,
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
			}
			// this.username = "";
		},
		async mounted() {

			this.showInfo = false;
			await this.sendInitialConnectionRequest();
			// this.username = prompt("Enter a username");
			this.connectToChatServer();

		},
		created() {
			this.username = undefined;
			this.messages = [];
		},
		methods: {
			enterUsernamePrompt(){
				this.username = prompt("Enter a username", uuid.v4());
			},
			countDownChanged(dismissCountDown) {
				this.dismissCountDown = dismissCountDown
			},
			showAlert() {
				this.dismissCountDown = this.dismissSecs
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

			addMessage(message) {

				if (this.messages.length > 7) {
					this.messages.pop();
				}
				this.messages.push(message);
			},

			async sendInitialConnectionRequest(){
				const ax = axios.default;
				const obtainIpAddressUrl = 'https://api.ipify.org?format=json';
				const ipData = (await ax.get(obtainIpAddressUrl)).data;
				const {ip} = ipData;
				const checkUrl = 'https://https://java-chat-backend.herokuapp.com/check/'+ip;
				// data should contain IP
				const {data} = await ax.get(checkUrl);
				if(data.ipAddressHash && data.username){
					this.username = username;
				}else{
					this.username = prompt("Enter a username");
					if(this.username){
						const registerUrl = "https://java-chat-backend.herokuapp.com/create";
						const requestData = {
							ip,
							username
						};
						await ax.post(registerUrl, requestData);
					}else{
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
				// https://java-chat-backend.herokuapp.com
				this.socket = new SockJs("http://localhost:8080/chat-app");
				this.stompClient = StompClient.over(this.socket, {
					debug: false
				});

				this.stompClient.connect({}, (frame) => {
					this.connectedToServer = true;
					this.subscribeToChat();
					this.subscribeToCoinListing();
				});
			},

			sendMessage(e) {
				e.preventDefault();
				const message = {
					senderUsername: this.username,
					recipientUsername: document.getElementById('recipient').value,
					content: document.getElementById('messageContent').value,
				};
				if(message.content.length > 0){

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