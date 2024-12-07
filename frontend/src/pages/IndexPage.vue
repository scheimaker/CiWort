<template>
  <q-page class="row items-center justify-center q-pa-lg bg-grey-2">
    <q-card class="q-pa-md" style="max-width: 800px; width: 400px; height: 600px;">
      <q-card-section class="text-center">
        <img
          src="../../public/images/dictionary.png"
          alt="Quasar Logo"
          style="width: 240px; margin-bottom: 20px;"
        />
        <div class="text-h5 q-mb-sm">Welcome to the CiWort</div>
        <p class="q-mb-lg">
          Unlock new words and boost your vocabulary!
        </p>
      </q-card-section>

      <q-card-section class="text-center">
        <q-btn
          label="Register"
          color="primary"
          class="q-mb-md full-width"
          size="lg"
          rounded
          @click="goToRegister"
        />
        <q-btn
          label="Login"
          color="secondary"
          class="full-width"
          size="lg"
          rounded
          @click="goToLogin"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'; // Router import

// Define component name for debugging purposes (optional)
defineOptions({
  name: 'IndexPage',
});

// Router instance
const router = useRouter();

// Navigation functions
const goToRegister = () => {
  router.push('/register');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.q-page {
  background-image: url('../../public/dictionary.png'); /* Background image from Unsplash */
  background-size: cover;
  background-position: center;
  height: 100vh;
}
.q-card {
  background-color: rgba(255, 255, 255, 0.8); /* Slight transparency */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Add some depth */
}
</style>
