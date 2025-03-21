<template>
    <v-app id="inspire">
      <v-main>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <base-card
                :disabled="!valid"
                title="Create User"
                agree-text="Create User"
                @agree="createUser"
              >
                <template #content>
                  <v-form v-model="valid">
                    <v-alert v-show="showError" v-model="showError" type="error" dismissible>
                      {{ errorMessage }}
                    </v-alert>
                    <v-text-field
                      v-model="userData.username"
                      :rules="userNameRules('Username is required')"
                      label="Username"
                      name="username"
                      :prepend-icon="mdiAccount"
                      type="text"
                      autofocus
                    />
                    <v-text-field
                      v-model="userData.email"
                      :rules="emailRules"
                      label="Email"
                      name="email"
                      :prepend-icon="mdiEmail"
                      type="email"
                    />
                    <v-text-field
                      v-model="userData.password1"
                      :rules="passwordRules('Password is required')"
                      label="Password"
                      name="password1"
                      :prepend-icon="mdiLock"
                      type="password"
                    />
                    <v-text-field
                      v-model="userData.password2"
                      :rules="[...passwordRules('Confirm password is required'), passwordMatchRule]"
                      label="Confirm Password"
                      name="password2"
                      :prepend-icon="mdiLock"
                      type="password"
                    />
                  </v-form>
                </template>
              </base-card>
              <div class="text-center mt-4">
                <v-btn text color="primary" @click="goBack">Back to Login</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script lang="ts">
  import Vue from 'vue'
  import { mdiAccount, mdiLock, mdiEmail } from '@mdi/js'
  import { userNameRules, passwordRules } from '@/rules/index'
  import BaseCard from '@/components/utils/BaseCard.vue'
  import { APIAuthRepository } from '@/repositories/auth/apiAuthRepository'
  
  export default Vue.extend({
    components: {
      BaseCard
    },
  
    data() {
      return {
        valid: false,
        showError: false,
        errorMessage: '',
        userData: {
          username: '',
          email: '',
          password1: '',
          password2: ''
        },
        userNameRules,
        passwordRules,
        mdiAccount,
        mdiLock,
        mdiEmail,
        emailRules: [
          (v: string) => !!v || 'Email is required',
          (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
        ]
      }
    },
  
    computed: {
      passwordMatchRule() {
        return () => 
          this.userData.password1 === this.userData.password2 || 
          'Passwords must match'
      }
    },
  
    methods: {
      async createUser() {
        if (!this.valid) return
  
        try {
          this.showError = false
          const apiAuthRepository = new APIAuthRepository()
          await apiAuthRepository.createUser(this.userData)
          // Navigate back to the login page after successful creation
          this.$router.push('/auth')
        } catch (error) {
          console.error('Error creating user:', error.response ? error.response.data : error.message)
          
          // Handle and display the error message
          this.showError = true
          if (error.response && error.response.data) {
            if (error.response.data.non_field_errors) {
              this.errorMessage = error.response.data.non_field_errors.join(', ')
            } else if (typeof error.response.data === 'object') {
              // Format all validation errors
              this.errorMessage = Object.entries(error.response.data)
                .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                .join('; ')
            } else {
              this.errorMessage = 'Failed to create user'
            }
          } else {
            this.errorMessage = error.message || 'Failed to create user'
          }
        }
      },
      
      goBack() {
        this.$router.push('/auth')
      }
    }
  })
  </script>