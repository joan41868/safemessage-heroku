<template>
	<div class="home bg-dark" >
		
		<b-icon icon="question" style="position: absolute; top: 5px; right: 5px; font-size: 30px;" class="text-success"
			 v-b-modal.modal-1></b-icon>
		
		<b-icon icon="person" style="position: absolute; top: 5px; left: 5px; font-size: 30px;" class="text-danger"
			v-b-modal.modal-2></b-icon>
		
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
	import Message from './Message.vue';
	import * as uuid from 'uuid';
	import Info from './Info.vue';
	export default {
		name: 'Home',
		components: {
			HelloWorld,
			Message,
			Info
		},
		data() {
			return {
				connectedToServer: false,
				messages: [],
				showInfo: Boolean,
				username: String
			}
		},
		mounted() {

			this.showUsernamePopUp();
			this.showInfo = false;
			// this.username = document.getElementById("usernameInput").value;// prompt("Enter a username, please :)");
			this.username = "";
			// if(!this.username) this.username = uuid.v4().toString(); 
			this.connectToChatServer();
		},
		created() {
			this.username = "";
			this.messages = [];

		},
		methods: {
			showUsernamePopUp() {
				this.$refs.usernamePopUp.show();

			},
			triggerShowInfo: function () {
				this.showInfo = !this.showInfo;
			},

			connectToChatServer: function () {
				this.connectedToServer = false;
				this.socket = new SockJs("https://java-chat-backend.herokuapp.com/chat-app");
				this.stompClient = StompClient.over(this.socket, {
					debug: false
				});
				this.stompClient.connect({}, (frame) => {
					this.connectedToServer = true;
					this.stompClient.subscribe("/topic/messages/" + this.username, (data) => {
						const {
							senderUsername,
							recipientUsername,
							content
						} = data.headers;
						const message = {
							senderUsername,
							recipientUsername,
							content,
						};
						// const message = JSON.parse(body);
						if (this.messages.length > 7) {
							this.messages.pop();
						}
						this.messages.push(message);

					});
				});
			},

			sendMessage: function (e) {
				e.preventDefault();
				const message = {
					senderUsername: this.username,
					recipientUsername: document.getElementById('recipient').value,
					content: document.getElementById('messageContent').value,
				};
				this.stompClient.send("/topic/messages/" + message.recipientUsername, {}, message);
				this.messages.push(message);
				document.getElementById('messageContent').value = "";
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
	button{
		font-size: 19px;
	}
	input{
		font-size: 20px;
	}
</style>