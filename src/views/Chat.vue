<template>
	<div class="home bg-dark">
		<h3 style="color: white">Your name is: {{username}}</h3>
		<b-form @submit="sendMessage"
			style="display: flex; flex-direction: column; justify-content: space-between; margin: auto; width: 450px;">
			<b-form-input id="recipient" type="text" placeholder="recipient..." style="margin: 5px;" />
			<b-form-input id="messageContent" type="text" placeholder="Your message.." style="margin: 5px;" />
			<span style="display: flex; flex-direction: row; justify-content: space-between;">
				<b-button type="submit" variant="success" @click="sendMessage">Send</b-button>
				<b-button variant="danger" @click="()=>{messages=[]}">Clear</b-button>
			</span>
		</b-form>

		<div class="chatmessagecontainer" v-show="messages.length > 0">
			<span v-for="message in messages" v-bind:key="message.content + Math.random().toString()">
				<message :content="message.content" :senderUsername="message.senderUsername"></message>
			</span>
		</div>
	</div>
</template>

<script>
	// @ is an alias to /src
	import HelloWorld from '@/components/HelloWorld.vue'
	import SockJs from 'sockjs-client';
	import StompClient from 'webstomp-client';
	import Message from './Message.vue';

	export default {
		name: 'Home',
		components: {
			HelloWorld,
			Message
		},
		data() {
			return {
				connectedToServer: false,
				messages: []
			}
		},
		created() {
			this.messages = [];
			this.username = prompt("Enter a username, please :)");
			this.connectToChatServer();
		},
		methods: {
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
							content
						};
						// const message = JSON.parse(body);
						this.messages.push(message);
					});
				});
			},

			sendMessage: function (e) {
				e.preventDefault();
				const message = {
					senderUsername: this.username,
					recipientUsername: document.getElementById('recipient').value,
					content: document.getElementById('messageContent').value
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
		max-height: 420px;
		overflow-x: none;
		overflow-y: scroll;
		border: 1px solid black;
		border-radius: 8px;
		margin: auto;
		margin-top: 10px;
		width: 75%;
		padding: 5px 5px 5px 5px;
	}
</style>