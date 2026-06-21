<template>
  <q-layout class="bg-white">
    <q-page-container class="layout">
      <q-page>
        <q-toolbar class="toolbar text-center">
          <q-toolbar-title class="text-bold text-white">
            <strong class="title"
              ><span style="color: white">MADA-</span><span style="color: red">EVENT</span></strong
            ></q-toolbar-title
          >
        </q-toolbar>
        <q-page-sticky position="bottom">
          <router-view class="page" />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/vtks-caveirada');

.layout {
  background-color: #14452f;
  height: 100vh;
}
.page {
  width: 100vw;
  border-radius: 64px 64px 0px 0px;
}

.title {
  border-radius: 64px;
  font-family: 'vtks caveirada', sans-serif;
  background: white;
  -webkit-background-clip: text;
  font-style: italic;
}
</style>
