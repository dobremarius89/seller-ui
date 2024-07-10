<template>
  <router-view/>
</template>

<script>
import {getUserName} from "@/config/store.config";
import router, {Route} from "@/config/router.config";

export default {

  mounted() {
    if (!getUserName()) {
      router.push({
        name: Route.LOGIN,
      });
    }
  }

}
</script>

<style>
@font-face {
  font-family: "Inter-SemiBold";
  src: url('../public/fonts/Inter-SemiBold.ttf') format("truetype");
}

@font-face {
  font-family: "Inter-Medium";
  src: url('../public/fonts/Inter-Medium.ttf') format("truetype");
}

@font-face {
  font-family: "Inter-Regular";
  src: url('../public/fonts/Inter-Regular.ttf') format("truetype");
}

@font-face {
  font-family: "Inter-Bold";
  src: url('../public/fonts/Inter-Bold.ttf') format("truetype");
}

html, body {
  margin: 0;
  background: white;
}
</style>
