<script setup>

</script>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
@import "assets/main.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

body, html {
  height: 100%;
  width: 100%;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}
</style>
