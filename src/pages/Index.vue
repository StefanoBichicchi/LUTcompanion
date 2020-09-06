<template>
  <q-page class="fit row wrap justify-center items-stretch content-stetch">
    <div class="col-12 self-center">
      <h3 class="windlass">{{ this.$t("home_page.welcome_msg") }}</h3>
    </div>
    <div class="col-12 q-gutter-md self-center content-center">
      <img alt="logo" src="./../assets/logo.png" height="400" width="400" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex"
};
</script>
