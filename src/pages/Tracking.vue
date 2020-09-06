<template>
  <q-page class="fit row wrap justify-center items-start content-between">
    <q-toolbar class="bg-secondary text-white col-12">
      <q-toolbar-title>{{ this.$t("tracking_page.title") }}</q-toolbar-title>
    </q-toolbar>

    <!-- Left column -->

    <div class="col-4 q-gutter-md self-start q-pa-md">
      <!-- List tracking -->

      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>{{
          this.$t("tracking_page.initiative.title")
        }}</q-toolbar-title>
      </q-toolbar>
      <q-list bordered separator>
        <q-item
          v-for="(player, index) in players"
          :key="player.name"
          :active="index === activePlayer"
          active-class="bg-green-2"
        >
          <q-item-section avatar>
            <q-icon
              :color="heartColor(player)"
              :name="player.HP <= 0 ? 'far fa-heart' : 'fas fa-heart'"
            />
          </q-item-section>
          <q-item-section>{{
            player.roll + " - " + player.name
          }}</q-item-section>
          <q-item-section>{{
            player.HP + "/" + player.totalHP + " HP"
          }}</q-item-section>
          <q-item-section side>
            <q-btn
              :disabled="matchStarted"
              dense
              flat
              icon="far fa-trash-alt"
              @click="deleteMe(index)"
            >
              <q-tooltip :delay="500">
                {{ $t("tracking_page.initiative.delete_me") }}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Buttons -->

      <q-btn
        v-if="players.length !== 0"
        :disabled="matchStarted"
        color="warning"
        @click="clean"
        >{{ this.$t("tracking_page.initiative.delete_all") }}
      </q-btn>
      <q-btn
        v-if="players.length !== 0 && matchStarted"
        color="info"
        @click="next"
        >{{ this.$t("tracking_page.initiative.next") }}</q-btn
      >
    </div>

    <!-- Right column -->

    <div class="col-8 q-pa-md">
      <!-- Form -->

      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title>{{
          this.$t("tracking_page.info.title")
        }}</q-toolbar-title>
      </q-toolbar>
      <div class="q-gutter-md self-center q-mt-sm">
        <q-input
          filled
          outlined
          v-model="playerToInsert.name"
          @keypress.enter.stop="insert"
          :label="$t('tracking_page.info.name')"
          :readonly="matchStarted"
        ></q-input>
        <q-input
          filled
          outlined
          type="number"
          v-model.number="playerToInsert.roll"
          @keypress.enter.stop="insert"
          :label="$t('tracking_page.info.roll')"
          :readonly="matchStarted"
        ></q-input>
        <q-input
          filled
          outlined
          type="number"
          v-model.number="playerToInsert.totalHP"
          @keypress.enter.stop="insert"
          :label="$t('tracking_page.info.hp')"
          :readonly="matchStarted"
        ></q-input>
        <q-checkbox
          v-model="playerToInsert.enemy"
          :label="$t('tracking_page.info.enemy')"
          :disabled="matchStarted"
        />
        <q-btn v-if="!matchStarted" color="info" @click="insert">{{
          this.$t("tracking_page.info.insert")
        }}</q-btn>
      </div>

      <!-- Match buttons -->

      <div class="q-mt-lg q-gutter-md">
        <q-btn color="positive" v-if="!matchStarted" @click="start">{{
          this.$t("tracking_page.info.start")
        }}</q-btn>
        <q-btn color="negative" v-if="matchStarted" @click="stop">{{
          this.$t("tracking_page.info.stop")
        }}</q-btn>
      </div>

      <!-- HP manager -->

      <div v-if="matchStarted" class="q-gutter-md self-center q-mt-xl">
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title>{{
            this.$t("tracking_page.hp.title")
          }}</q-toolbar-title>
        </q-toolbar>
        <q-input
          readonly
          filled
          outlined
          :label="$t('tracking_page.hp.current_character')"
          :value="players[activePlayer].name"
        ></q-input>
        <q-select
          outlined
          filled
          emit-value
          :label="$t('tracking_page.hp.target')"
          :options="targets"
          v-model="attack.target"
        ></q-select>
        <q-input
          type="number"
          filled
          outlined
          :label="$t('tracking_page.hp.hp')"
          v-model.number="attack.floatingHP"
        />
        <q-btn color="positive" @click="addHP">{{
          this.$t("tracking_page.hp.add_hp")
        }}</q-btn>
        <q-btn color="negative" @click="removeHP">{{
          this.$t("tracking_page.hp.remove_hp")
        }}</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageTracking",

  data() {
    return {
      activePlayer: -1,
      playerToInsert: {
        name: null,
        roll: null,
        enemy: false,
        totalHP: null,
        HP: null
      },
      matchStarted: false,
      players: [],
      attack: {
        floatingHP: null,
        target: null
      }
    };
  },

  computed: {
    targets() {
      return this.players.map((player, index) => {
        return {
          label: player.name,
          value: index
        };
      });
    }
  },

  methods: {
    heartColor(player) {
      if (player.HP < 0) {
        if (this.$q.dark.isActive) return "";
        else return "black";
      } else {
        if (player.enemy) return "green-6";
        else return "red";
      }
    },

    insert() {
      if (
        this.playerToInsert.name === null ||
        this.playerToInsert.roll === null ||
        this.hp === null
      )
        return;
      this.playerToInsert.HP = this.playerToInsert.totalHP;
      this.players.push(this.playerToInsert);
      this.players = this.players.sort((a, b) => b.roll - a.roll);
      this.playerToInsert = {
        name: null,
        roll: null,
        enemy: false
      };
    },

    start() {
      if (this.players.length < 2) {
        this.$q.notify({
          type: "negative",
          message: this.$t("tracking_page.notify.not_enough")
        });
        return;
      }
      this.matchStarted = true;
      this.activePlayer = 0;
    },

    stop() {
      this.matchStarted = false;
      this.activePlayer = -1;
    },

    clean() {
      this.players = [];
      this.activePlayer = -1;
      this.matchStarted = false;
    },

    next() {
      this.activePlayer++;
      if (this.activePlayer > this.players.length - 1) this.activePlayer = 0;
      while (this.players[this.activePlayer].HP <= 0) {
        this.activePlayer++;
      }
    },

    deleteMe(index) {
      this.players.splice(index, 1).sort((a, b) => b.roll - a.roll);
    },

    addHP() {
      let index = this.attack.target;
      this.players[index].HP += this.attack.floatingHP;
      if (this.players[index].HP > this.players[index].totalHP)
        this.players[index].HP = this.players[index].totalHP;

      this.floatingHP = null;
    },

    removeHP() {
      this.players[this.attack.target].HP -= this.attack.floatingHP;
      this.attack.floatingHP = null;
      this.attack.target = null;
      this.watchMatch();
    },

    watchMatch() {
      let enemies = this.players.filter(player => player.enemy === true);
      let pgs = this.players.filter(player => player.enemy === false);

      let flag = false;

      for (let i = 0; i < pgs.length; i++) {
        if (pgs[i].HP > 0) flag = true;
      }

      if (!flag) {
        this.$q.notify({
          type: "negative",
          message: this.$t("tracking_page.notify.match_lose")
        });
        this.stop();

        return;
      }

      flag = false;

      for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].HP > 0) flag = true;
      }

      if (!flag) {
        this.$q.notify({
          type: "info",
          message: this.$t("tracking_page.notify.match_won")
        });
        this.stop();
      }
    }
  }
};
</script>
