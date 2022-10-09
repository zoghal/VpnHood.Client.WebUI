<template>
  <v-container id="homeContainer" :class="`h-100 py-0 state-${connectionState.toLowerCase()}`">
    <!-- Public Server Hint -->
    <v-dialog :value="store.requestedPublicServerProfileId != null" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" v-html="$t('publicServerWarningTitle')" />
        <v-card-text v-html="$t('publicServerWarning')" class="pt-4" />
        <v-card-text>
          <strong>{{ $t("warning") }}! {{ $t("privacyWarning") }}</strong>
          <br />
          <a href="https://www.vpnhood.com/privacy-policy" target="_blank">{{
          $t("readPrivacyPolicy")
          }}</a>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="
            store.lastServerHintId = null;
            store.requestedPublicServerProfileId = null;
          " v-text="$t('cancel')" />
          <v-btn color="primary" text @click="store.connect(store.requestedPublicServerProfileId, true)"
            v-text="$t('accept')" />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar top :timeout="-1" :value="store.state.isWaitingForAd" class="body-2">
      <div>
        <p class="text-center subtitle-2">
          You have connected to a<br><b class="yellow--text">Free Public VpnHood Server!</b>
        </p>
        <p class="text-justify">
          VpnHood offers a free, open-source solution to bypass censorship. We need you to watch an ad to help us maintain these servers. Please wait...
        </p>
      </div>
    </v-snackbar>
    <v-row class="align-center h-100">
      <!-- Circle -->
      <v-col cols="12" sm="6" id="middleSection" class="text-center align-self-center">
        <div class="my-card-view">
          <!-- Speed -->
          <div id="speedSection" class="text-center d-inline-flex mb-8">
            <div class="mx-2">
              <span class="speedLabel">{{ $t("downloadSpeed") }}:</span>
              <span class="speedValue">
                {{ this.formatSpeed(this.store.state.receiveSpeed) }}
              </span>
              <span class="speedUnit">Mbps</span>
            </div>
            <div class="mx-2">
              <span class="speedLabel">{{ $t("uploadSpeed") }}:</span>
              <span class="speedValue">
                {{ this.formatSpeed(this.store.state.sendSpeed) }}
              </span>
              <span class="speedUnit">Mbps</span>
            </div>
          </div>

          <div id="circleOuter" class="">
            <div id="circle">
              <div id="circleContent" class="align-center">
                <span id="stateText">{{ store.connectionStateText("$") }}</span>

                <!-- usage -->
                <div v-if="connectionState == 'Connected' && this.bandwidthUsage()">
                  <div id="bandwidthUsage">
                    <span>{{ this.bandwidthUsage().used }} of</span>
                  </div>
                  <div id="bandwithTotal" v-if="connectionState == 'Connected'">
                    <span>{{ this.bandwidthUsage().total }}</span>
                  </div>
                </div>

                <!-- check -->
                <v-icon class="state-icon" v-if="stateIcon != null" size="90" color="white">{{ this.stateIcon }}
                </v-icon>
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Connect buttons -->
      <v-col cols="12" order-sm="12" align-self="start" class="text-center">
        <!-- Connect Button -->
        <v-btn v-if="connectionState == 'None'" id="connectButton" class="main-button py-sm-8"
          @click="store.connect('$')">
          {{ $t("connect") }}
        </v-btn>

        <!-- Diconnect Button -->
        <v-btn v-if="
          connectionState == 'Waiting' ||
          connectionState == 'Connecting' ||
          connectionState == 'Connected' ||
          connectionState == 'Diagnosing'
        " id="disconnectButton" class="main-button py-sm-8" @click="store.disconnect()">
          <span>{{ $t("disconnect") }}</span>
        </v-btn>

        <!-- Diconnecting -->
        <v-btn v-if="connectionState == 'Disconnecting'" id="disconnectingButton" class="main-button py-sm-8"
          style="pointer-events: none">
          <span>{{ $t("disconnecting") }}</span>
        </v-btn>
      </v-col>

      <!-- Config (Bottom btn)-->
      <v-col cols="12" sm="6" id="configSection" class="align-self-end align-self-sm-auto pb-0 pb-sm-3">
        <!--Card view apply style only on min-width 600px-->
        <div class="my-card-view">
          <!-- *** ipFilter *** -->
          <v-btn depressed block class="config-btn mb-2" @click="showIpFilterSheet()">
            <v-icon class="config-icon">public</v-icon>
            <span class="config-label">{{ $t("ipFilterStatus_title") }}</span>
            <v-icon class="config-arrow" flat>keyboard_arrow_right</v-icon>
            <span class="config">{{ this.clientCountryFilterStatus }}</span>
            <v-img v-if="!store.userSettings.tunnelClientCountry"
              :src="store.getIpGroupImageUrl(store.state.clientIpGroup)" max-width="24" class="ma-1" />
          </v-btn>

          <!-- *** appFilter *** -->
          <v-btn v-if="
            store.features.isExcludeAppsSupported ||
            store.features.isIncludeAppsSupported
          " depressed block class="config-btn mb-2" @click="showAppFilterSheet()">
            <v-icon class="config-icon">apps</v-icon>
            <span class="config-label">{{ $t("appFilterStatus_title") }}</span>
            <v-icon class="config-arrow">keyboard_arrow_right</v-icon>
            <span class="config">{{ this.appFilterStatus }}</span>
          </v-btn>

          <!-- *** Protocol *** -->
          <v-btn depressed block class="config-btn mb-2" @click="showProtocolSheet()">
            <v-icon class="config-icon">settings_ethernet</v-icon>
            <span class="config-label">{{ $t("protocol_title") }}</span>
            <v-icon class="config-arrow" flat>keyboard_arrow_right</v-icon>
            <span class="config">{{ protocolStatus }}</span>
          </v-btn>

          <!-- *** server *** -->
          <v-btn depressed block class="config-btn" @click="showServersSheet()">
            <v-icon class="config-icon">dns</v-icon>
            <span class="config-label">{{ $t("selectedServer") }}</span>
            <v-icon class="config-arrow" flat>keyboard_arrow_right</v-icon>
            <span class="config">{{ store.clientProfile.name("$") }}</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.v-input--checkbox .v-label {
  font-size: 12px;
}
</style>

<script>

export default {
  name: "HomePage",
  components: {

  },
  created() {
    this.store.setTitle(this.$t("home"));
    this.monitorId = setInterval(() => {
      if (!document.hidden)
        this.store.updateState();
    }, 1000);

  },
  beforeDestroy() {
    clearInterval(this.monitorId);
    this.monitorId = 0;
  },
  data: () => ({
  }),
  computed: {
    connectionState() { return this.store.connectionState("$"); },
    appFilterStatus() {
      let appFilters = this.store.userSettings.appFilters;
      if (!appFilters) appFilters = [];

      if (this.store.userSettings.appFiltersMode == 'Exclude') return this.$t("appFilterStatus_exclude", { x: appFilters.length });
      if (this.store.userSettings.appFiltersMode == 'Include') return this.$t("appFilterStatus_include", { x: appFilters.length });
      return this.$t("appFilterStatus_all");
    },
    ipFilterStatus() {
      let ipGroupFilters = this.store.userSettings.ipGroupFilters;
      if (!ipGroupFilters) ipGroupFilters = [];

      if (this.store.userSettings.ipGroupFiltersMode == 'Exclude') return this.$t("ipFilterStatus_exclude", { x: ipGroupFilters.length });
      if (this.store.userSettings.ipGroupFiltersMode == 'Include') return this.$t("ipFilterStatus_include", { x: ipGroupFilters.length });
      return this.$t("ipFilterStatus_all");
    },
    clientCountryFilterStatus() {
      return this.store.userSettings.tunnelClientCountry
        ? this.$t("ipFilterStatus_all")
        : this.$t("ipFilterStatus_excludeClientCountry");
    },
    protocolStatus() {
      return (this.store.userSettings.useUdpChannel) ? this.$t('protocol_udpOn') : this.$t('protocol_udpOff');
    },
    stateIcon() {
      if (this.connectionState == 'Connected' && !this.bandwidthUsage()) return "check";
      if (this.connectionState == 'None') return "power_off";
      if (this.connectionState == 'Connecting') return "power";
      if (this.connectionState == 'Diagnosing') return "network_check";
      if (this.connectionState == 'Waiting') return "hourglass_top";
      return null;
    }
  },
  methods: {
    async remove(clientProfileId) {
      clientProfileId = this.store.clientProfile.updateId(clientProfileId);
      const res = await this.$confirm(this.$t("confirmRemoveServer"), { title: this.$t("warning") })
      if (res) {
        await this.store.invoke("removeClientProfile", { clientProfileId });
        this.store.loadApp();
      }
    },

    editClientProfile(clientProfileId) {
      window.gtag('event', "editprofile");
      clientProfileId = this.store.clientProfile.updateId(clientProfileId);
      this.$router.push({ path: this.$route.path, query: { ... this.$route.query, editprofile: clientProfileId } })
    },

    showAddServerSheet() {
      window.gtag('event', "addServerButton");
      this.$router.push({ path: this.$route.path, query: { ... this.$route.query, addserver: '1' } })
    },

    showServersSheet() {
      window.gtag('event', "changeServer");
      this.$router.push({ path: this.$route.path, query: { ... this.$route.query, servers: '1' } })
    },

    showProtocolSheet() {
      window.gtag('event', "changeProtocol");
      this.$router.push({ path: this.$route.path, query: { ... this.$route.query, protocol: '1' } })
    },

    showAppFilterSheet() {
      window.gtag('event', "changeAppFilter");
      this.$router.push({ path: this.$route.path, query: { ... this.$route.query, appfilter: '1' } })
    },

    showIpFilterSheet() {
      window.gtag('event', "changeIpFilter");
      //this.$router.push({ path: this.$route.path, query: { ... this.$route.query, ipfilter: '1' } })
      this.$router.push({ path: this.$route.path, query: { ... this.$route.query, mycountry: '1' } })
    },

    bandwidthUsage() {

      if (!this.store.state || !this.store.state.sessionStatus || !this.store.state.sessionStatus.accessUsage)
        return null;
      let accessUsage = this.store.state.sessionStatus.accessUsage;
      if (accessUsage.maxTraffic == 0)
        return null;

      let mb = 1000000;
      let gb = 1000 * mb;

      let ret = { used: accessUsage.sentTraffic + accessUsage.receivedTraffic, total: accessUsage.maxTraffic };
      // let ret = { used: 100 * mb, total: 2000 * mb };

      if (ret.total > 1000 * mb) {
        ret.used = (ret.used / gb).toFixed(0) + "GB";
        ret.total = (ret.total / gb) + "GB";
      }
      else {
        ret.used = (ret.used / mb).toFixed(0) + "MB";
        ret.total = (ret.total / mb).toFixed(0) + "MB";
      }

      return ret;
    },

    formatSpeed(speed) {
      return (speed * 10 / 1000000).toFixed(2);
    },
  }
}
</script>
