<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-bar class="q-electron-drag">
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <div>LUTCompanion</div>

        <q-space />

        <div class="q-mr-md">
          <q-btn dense flat :icon="themeIcon" @click="toggleDarkMode"></q-btn>
        </div>

        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="maximize" />
        <q-btn dense flat icon="close" @click="close" />
      </q-bar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" elevated overlay>
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title>{{ $t("left_menu.title") }}</q-toolbar-title>
          <q-avatar>
            <img alt="logo" src="../assets/logo.png" />
          </q-avatar>
        </q-toolbar>
        <q-list>
          <template v-for="(menuItem, index) in menuList">
            <q-item :key="index" clickable v-ripple :to="menuItem.to">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>{{ menuItem.label }}</q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      left: null,
      menuList: [
        {
          icon: "home",
          label: this.$t("left_menu.home"),
          separator: false,
          to: "/",
        },
        {
          icon: "group",
          label: this.$t("left_menu.party"),
          separator: false,
          to: "Party",
        },
        {
          icon: "fas fa-list-ol",
          label: this.$t("left_menu.tracking"),
          separator: true,
          to: "Tracking",
        },
        {
          icon: "settings",
          label: this.$t("left_menu.settings"),
          separator: false,
          to: "Settings",
        },
      ],
    };
  },

  computed: {
    themeIcon() {
      if (this.$q.dark.isActive) return "fas fa-sun";
      else return "fas fa-moon";
    },
  },

  methods: {
    minimize: function () {
      if (process.env.MODE === "electron") {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize();
      }
    },

    maximize: function () {
      if (process.env.MODE === "electron") {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();

        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    },

    close: function () {
      if (process.env.MODE === "electron") {
        const window = this.$q.electron.remote.BrowserWindow.getFocusedWindow();
        window.close();
        window.destroy();
      }
    },

    toggleDarkMode() {
      this.$q.dark.toggle();
    },
  },
};
</script>
