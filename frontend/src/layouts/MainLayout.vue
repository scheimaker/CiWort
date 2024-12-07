<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          CiWort
        </q-toolbar-title>
        <div v-if="username"> Hello, {{ username }} - </div>
        <div>遨游辞海多酣畅</div>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase authentication

defineOptions({
  name: 'MainLayout'
});

const leftDrawerOpen = ref(false);
const username = ref('');

// Fetch the user's name when the component mounts
onMounted(() => {
  const auth = getAuth();
  
  // Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      username.value = user.displayName || 'User'; // Set the username to the display name or a fallback
    } else {
      username.value = 'Guest'; // Fallback when no user is logged in
    }
  });
});

// const linksList: EssentialLinkProps[] = []; // Your links

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
