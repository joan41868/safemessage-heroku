<template>
  <div class="about">
    <go-home-button></go-home-button>
    <h4>Support privacy with BTC:</h4>
    <h6>1KSymNBV87Q1id1a8P9xfqW8MoWZXa6bX8</h6>
    <span style="display: flex; flex-direction: row; justify-content: space-evenly;">
    </span>
    
  </div>
</template>

<script>
import GoHomeButton from '../components/GoHomeButton.vue';
export default {
  components:{
    GoHomeButton,
  },
  methods:{
    goHome(){
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>
  .about{
    color: #b491c8;
  }
</style>
