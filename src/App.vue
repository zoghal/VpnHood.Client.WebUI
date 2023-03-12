<template>
  <v-app>
    <AddServerSheet />
    <ClientProfileSheet />
    <ErrorSheet />
    <ServersSheet />
    <ProtocolSheet />
    <AppFilterSheet v-if="this.$route.query.appfilter != null" />
    <IpFilterSheet v-if="this.$route.query.ipfilter != null" />
    <TunnelClientCountrySheet v-if="this.$route.query.mycountry != null" />
    <SettingsSheet />
    <v-navigation-drawer app :width="250" temporary :disable-resize-watcher="false" :right="$vuetify.rtl"
      v-model="store.navigationDrawer">
      <Navigation />
    </v-navigation-drawer>
    <!-- Add New Server Hint -->
    <v-snackbar top app color="success" centered v-model="store.newServerAdded">{{ $t("newServerAdded") }}</v-snackbar>
    <v-app-bar dense color="transparent" dark elevation="0">
      <v-app-bar-nav-icon @click.stop="store.navigationDrawer = !store.navigationDrawer" />
      <v-img v-if="0" class="mx-2" src="@/assets/images/logo-small.png" :alt="$t('appName')" max-height="20"
        max-width="20"></v-img>
      <v-spacer></v-spacer>
      <v-toolbar-title class="app-title">{{
        $t("appName")
      }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="font-weight-light  grey--text app-version-mini" >v{{store.appBuildVersion()}}</span>
      <ClientProfileMenu clientProfileId="$" color="white" :showSettingsItem="true" :showAddServerItem="true"
        :showDeleteItem="false" :showRenameItem="false" />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow-y: auto !important;
}
</style>

<script>
import Navigation from "./components/NavigationPane.vue";
import ErrorSheet from "./pages/ErrorSheet";
import AddServerSheet from "./pages/AddServerSheet";
import ClientProfileSheet from "./pages/ClientProfileSheet";
import ProtocolSheet from "./pages/ProtocolSheet";
import ServersSheet from "./pages/ServersSheet";
import AppFilterSheet from "./pages/AppFilterSheet";
import IpFilterSheet from "./pages/IpFilterSheet";
import TunnelClientCountrySheet from "./pages/TunnelClientCountrySheet.vue";
import SettingsSheet from "./pages/SettingsSheet";
import ClientProfileMenu from "./components/ClientProfileMenu";

export default {
  name: 'App',

  components: {
    ClientProfileMenu,
    Navigation,
    ErrorSheet,
    AddServerSheet,
    ClientProfileSheet,
    ServersSheet,
    AppFilterSheet,
    ProtocolSheet,
    IpFilterSheet,
    TunnelClientCountrySheet,
    SettingsSheet
  },

  data: () => ({
  })
};
</script>
