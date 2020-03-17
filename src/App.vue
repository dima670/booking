<template>
  <v-app id="keep">
    <v-app-bar
            app
            clipped-left
            color="amber"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5">Аренда&nbsp;<span class="font-weight-light">залов</span></span>

      <v-spacer />
    </v-app-bar>

    <navigation :drawer="drawer" />

    <v-content>
      <v-container
              fluid
              class="grey lighten-4 fill-height"
      >
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Navigation from "./components/Navigation";

  export default {
    components: {
      Navigation
    },
    props: {
    },
    data: () => ({
      drawer: true,
    }),

  }
</script>

<style>

</style>