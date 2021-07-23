<template>
  <div>
    <v-app-bar app color="primary"> </v-app-bar>
    <v-card width="600" class="mx-auto mt-15 mb-0">
      <v-toolbar color="primary" dark>
        <v-card-title>Ingreso al sistema</v-card-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          placeholder="email@ejemplo.com"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          hint="At least 5 characters"
          counter
          @click:append="show1 = !show1"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="login">
          ingresar
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    show1: false,
    password: 'Password',
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    rules: {
      required: (value) => !!value || 'Required.',
      min: (v) => v.length >= 5 || 'Min 5 characters',
      emailMatch: () => 'The email and password you entered don\'t match',
    },
  }),
  methods: {
    login() {
      axios.post('/usuario/login', {
        email: this.email,
        password: this.password,
      })
        .then((response) => {
          this.$store.dispatch('setToken', response.data.token);
          this.$store.dispatch('setUsuario', response.data.usuario);
          this.$router.push('/');
        })
        .catch((error) => {
          console.error(error);
          alert(error.response.data.msg);
        });
    },
  },
};

</script>
