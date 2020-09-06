<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";

export default {
  name: "App",

  methods: {
    loadUserSettings() {
      const dirName = "lut_companion";
      const fileName = "settings.json";

      const dirPath =
        this.$q.electron.remote.app.getPath("appData") + "/" + dirName;
      const filePath = dirPath + "/" + fileName;

      if (!existsSync(dirPath)) mkdirSync(dirPath);

      if (!existsSync(filePath)) {
        const data = require("./data/sample_config.json");
        writeFileSync(filePath, JSON.stringify(data, null, 2));
      }

      const userSettings = JSON.parse(readFileSync(filePath));

      this.$q.sessionStorage.set("userSettings", userSettings);
    },

    setUserSettings() {
      const userSettings = this.$q.sessionStorage.getItem("userSettings");
      this.$q.dark.set(userSettings.theme.enableDark);
      this.$i18n.locale = userSettings.language;
    },
  },

  mounted() {
    this.loadUserSettings();
    this.setUserSettings();
  },
};
</script>
