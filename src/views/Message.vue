<template>
  <div class="chatmessage"  style="">
					<p><b>{{senderUsername}}</b></p>
					<p>{{content}}</p>
          <p style="font-size: 9px; color: darkgray;">{{createdAt}}</p>
  </div>
</template>

<script>
export default {
    props:{
        content: String,
        senderUsername: String,
        createdAt: Date
    }
}
</script>

<style>
.chatmessage{
  background-color: #212121;
  color: white;
  border-radius: 9px;
  max-width: 250px;
  margin: auto;
  font-size: 15px;
}
</style>