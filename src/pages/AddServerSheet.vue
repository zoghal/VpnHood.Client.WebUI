<template>
  <v-bottom-sheet v-model="sheetVisible" value="true">
    <v-sheet>
      <!-- Add Test Server -->
      <v-card v-if="testServerVisible" class="mx-auto ma-5" max-width="600" flat>
        <v-card-title>{{ $t("addTestServer") }}</v-card-title>
        <v-card-subtitle>{{ $t("addTestServerSubtitle") }}</v-card-subtitle>
        <v-btn text @click="addTestServer()">{{ $t("add") }}</v-btn>
        <v-divider class="mt-5" />
      </v-card>

      <!-- Add Private Server -->
      <v-card class="mx-auto" max-width="600" flat>
        <v-card-title>{{ $t("addAcessKeyTitle") }}</v-card-title>
        <v-card-subtitle>{{ $t("addAcessKeySubtitle") }}</v-card-subtitle>
        <v-text-field v-model="accessKeyValue" spellcheck="false" autocomplete="off"
          :error-messages="accessKeyErrorMessage" class="mx-5" @input="onKeyAccessChanged" append-icon="vpn_key"
          :placeholder="accessKeyPrefix" solo autofocus></v-text-field>
      </v-card>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>

import { Base64 } from 'js-base64';

export default {
  components: {
  },
  props: {
  },
  created() {
    this.isRouterBusy = false;
  },
  data: () => ({
    accessKeyValue: null,
    accessKeyErrorMessage: null,
    accessKeyPrefix: "vh://"
  }),
  watch:
  {
    "$route"() {
      this.isRouterBusy = false;
    }
  },

  computed: {
    sheetVisible: {
      get() {
        return this.$route.query.addserver != null;
      },
      set(value) {
        if (!value && !this.isRouterBusy) {
          this.isRouterBusy = true;
          this.accessKeyValue = null;
          this.accessKeyErrorMessage = null;
          this.$router.back();
        }
      }
    },

    testServerVisible() {
      return this.store.features.testServerTokenId &&
        !this.store.clientProfileItems.find(x => x.clientProfile.tokenId == this.store.features.testServerTokenId);
    }
  },

  methods: {
    async onKeyAccessChanged(value) {
      this.accessKeyErrorMessage = null;

      if (value == null || value == "")
        return;

      value = this.validateAccessKey(value);
      if (!value) {
        this.accessKeyErrorMessage = this.$t("invalidAccessKeyFormat", { prefix: this.accessKeyPrefix });
        return;
      }

      try {
        let clientProfile = await this.store.invoke("addAccessKey", { accessKey: value });
        let isNew = !this.store.clientProfile.exists(clientProfile.clientProfileId);
        this.accessKeyValue = null;
        this.store.loadApp();
        this.$router.back();
        this.store.newServerAdded = isNew;
      }
      catch (ex) {
        this.accessKeyErrorMessage = ex.toString();
      }
    },

    validateAccessKey(accessKey) {
      try {
        accessKey = accessKey.replace(/(^[^A-Za-z0-9]*)|([^A-Za-z0-9=+/]*$)/g, '');
        if (accessKey.indexOf("vh://") == 0) accessKey = accessKey.substr(5);
        const json = Base64.decode(accessKey);
        return JSON.parse(json) != null ? accessKey : null;
      }
      catch (ex) {
        return null;
      }
    },

    async addTestServer() {
      await this.store.invoke("addTestServer");
      this.accessKeyValue = null;
      await this.store.loadApp();
      this.$router.back();
      this.store.newServerAdded = true;
    },
  }
}
</script>
