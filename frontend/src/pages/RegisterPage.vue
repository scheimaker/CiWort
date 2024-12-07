<template>
  <q-page class="row justify-center items-center q-pa-md">
    <q-card class="q-pa-md" style="max-width: 500px; width: 100%;">
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">Register</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onRegister" ref="registerForm" class="q-gutter-md">
          <q-input
            v-model="username"
            label="Username"
            outlined
            class="full-width"
            dense
            :error="!!errors.username"
            :error-message="errors.username"
            required
          />
          <q-input
            v-model="email"
            type="email"
            label="Email"
            outlined
            class="full-width"
            dense
            :error="!!errors.email"
            :error-message="errors.email"
            required
          />
          <q-input
            v-model="password"
            type="password"
            label="Password"
            outlined
            class="full-width"
            dense
            :error="!!errors.password"
            :error-message="errors.password"
            required
          />
          <q-input
            v-model="confirmPassword"
            type="password"
            label="Confirm Password"
            outlined
            class="full-width"
            dense
            :error="!!errors.confirmPassword"
            :error-message="errors.confirmPassword"
            required
          />

          <q-btn
            label="Register"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
            size="lg"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { useQuasar } from 'quasar'; 
import { registerUser } from 'src/api/auth'; // Import the registerUser API function
import { useRouter } from 'vue-router'; 

// Quasar instance
const $q = useQuasar();
const router = useRouter();

// Form data
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Error messages
const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Form submission method
const onRegister = async (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  // Reset errors
  errors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match';
    return;
  }

  try {
    // Call the registerUser function from api/auth.ts to send data
    const responseMessage = await registerUser(username.value, email.value, password.value);

    console.log(responseMessage);
    // Clear form after registration
    username.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';

    // Redirect to login page
    router.push('/login');

  } catch (error) {
    if (error.response?.data?.errors) {
      // Assume the backend returns field-specific errors in `error.response.data.errors`
      errors.value = { ...error.response.data.errors };
    } else {
      $q.notify({
        color: 'negative',
        message: error.message || 'An unknown error occurred',
        position: 'top',
      });
    }
  }
};
</script>

<style scoped>
.q-page {
  background-color: #f5f5f5;
}
.full-width {
  width: 100%;
}
</style>