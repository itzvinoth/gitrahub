<template>
  <div id="app">
    <GitraHub/>
  </div>
</template>

<script>
import GitraHub from './components/GitraHub'

export default {
  name: 'App',
  components: {
    GitraHub
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
