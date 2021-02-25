<template>
  <div id="app" class="bg-dark">
    <div id="nav">
          <img src="../public/img/anonymous.png" style="heigth: 45px; width: 45px; border-radius: 8px; border-color: black; border-width: 0.5px; border-style: solid;" class="bg-dark"/>
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
}

#nav {
  padding: 30px;
}

#nav a {
  color: #2c3e50;
}

#nav a.router-link-exact-active {
}
</style>
