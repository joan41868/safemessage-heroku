<template>
  <div id="app" class="bg-dark">
    <div id="nav">
      <img src="../public/img/anonymous.png" style="heigth: 50px; width: 50px;" class="bg-dark"/>
      <!-- <router-link to="/">Chat</router-link> -->
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
