<template>
  <q-page class="row justify-center items-center q-pa-md">
    <q-card class="q-pa-md" style="max-width: 500px; width: 100%;">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <!-- Ensure form does not reset inputs -->
        <q-form @submit.prevent="onLogin" ref="loginForm" class="q-gutter-md">
          <!-- Email Input -->
          <q-input
            v-model="email"
            type="email"
            label="Email"
            outlined
            class="full-width"
            dense
            required
            autocomplete="off"
            @focus="onInputFocus('email')" 
          />

          <!-- Password Input with Toggle -->
          <q-input
            v-model="password"
            :type="passwordVisible ? 'text' : 'password'"
            label="Password"
            outlined
            class="full-width"
            dense
            required
            autocomplete="off"
            @focus="onInputFocus('password')" 
          >
            <!-- Toggle visibility button -->
            <template v-slot:append>
              <q-icon
                :name="passwordVisible ? 'visibility_off' : 'visibility'"
                @click="togglePasswordVisibility"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <!-- Login Button -->
          <q-btn
            label="Login"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
            dense
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { loginUser } from '../api/auth'; // Import your login API function
import { useRouter } from 'vue-router'; // Import useRouter

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter(); // Move useRouter inside setup()
    const email = ref('');
    const password = ref('');
    const passwordVisible = ref(false); // Track password visibility state

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    // Debugging focus behavior
    const onInputFocus = (field) => {
      console.log(`Focus on: ${field}, email: ${email.value}, password: ${password.value}`);
    };

    const onLogin = async (event) => {
      try {
        // Prevent default form behavior
        event.preventDefault();

        // Handle user login logic (API call)
        await loginUser(email.value, password.value);

        $q.notify({
          color: 'positive',
          message: 'Logged in successfully!',
          position: 'top',
        });

        // Clear the form
        email.value = '';
        password.value = '';

        // Redirect to the main page
        router.push('/main');
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: error.message || 'Login failed!',
          position: 'top',
        });
      }
    };

    return {
      email,
      password,
      passwordVisible,
      togglePasswordVisibility,
      onLogin,
      onInputFocus,
    };
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
