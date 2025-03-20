<template>
  <v-card>
    <v-card-title>
      <v-btn class="text-capitalize" color="primary" @click.stop="$router.push('users/create')">
        {{ $t('generic.create') }}
      </v-btn>
      
    </v-card-title>

    <!-- Tabela para exibir apenas o username -->
    <v-data-table
      :items="items"
      :headers="headers"
      item-key="id"
      :loading="isLoading"
      :search="search"
      :server-items-length="total"
      :loading-text="$t('generic.loading')"
      :no-data-text="$t('vuetify.noDataAvailable')"
    >
      <template #top>
        <v-text-field
          v-model="search"
          :prepend-inner-icon="mdiMagnify"
          :label="$t('generic.search')"
          single-line
          hide-details
          filled
        />
      </template>

      <template #[`item.username`]="{ item }">
        <span>{{ item.username }}</span>
      </template>
      <template #[`item.email`]="{ item }">
        <span>{{ item.email }}</span> 
      </template>
      <template #[`item.isSuperuser`]="{ item }">
        <span>{{ item.isSuperuser ? 'Yes' : 'No' }}</span>
      </template>
      <template #[`item.last_login`]="{ item }">
        <span>
          <span>
            {{
              dateFormat(dateParse(item.last_login, 'YYYY-MM-DDTHH:mm:ss'), 'YYYY/MM/DD HH:mm')
            }}
          </span>
        </span> 
      </template>
    </v-data-table>
  </v-card>
</template>


<script lang="ts">
import { mdiMagnify } from '@mdi/js'
import type { PropType } from 'vue'
import { dateFormat } from '@vuejs-community/vue-filter-date-format'
import { dateParse } from '@vuejs-community/vue-filter-date-parse'
import { UserItem } from '~/domain/models/user/user'

export default {
  props: {
    items: {
      type: Array as PropType<UserItem[]>,
      default: () => [],
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false,
      required: true
    },
    total: {
      type: Number,
      default: 0,
      required: true
    }
  },
  
  data() {
    return {
      search: this.$route.query.q || '',
      mdiMagnify,
      dateFormat,
      dateParse
    }
  },

  computed: {
    // Header apenas com 'username'
    headers() {
      return [
        { text: this.$t('username'), value: 'username' },
        { text: this.$t('email'), value: 'email' }, // Exibe apenas o campo 'username'
        { text: this.$t('SuperUser'), value: 'isSuperuser' },
        { text: this.$t('last login'), value: 'last_login' },
        
      ]
    }
  }
}
</script>


<style scoped>
::v-deep .v-data-table {
  width: 100%;
}
</style>
