<template>
  <div class="container">
    <h1 class="display-4 primary--text">WELCOME!</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      items: [
        { title: 'Home', icon: 'mdi-view-dashboard' },
        { title: 'About', icon: 'mdi-forum' },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
