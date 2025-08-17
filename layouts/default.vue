<template>
  <div id="app">
    <slot />
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/variables';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #62d2fbff 0%, #1964cc 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}
</style>
