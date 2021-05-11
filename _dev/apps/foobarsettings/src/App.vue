<template>
  <div id="app">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import { mapSagas } from "@/lib/store-saga";

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  setup(props, context) {
    console.log('demo rbm 1');
    const saga = { ...mapSagas({ retrieveToken: "retrieveToken" }, context) };
    saga.retrieveToken();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
