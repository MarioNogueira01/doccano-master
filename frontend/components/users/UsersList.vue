<template>
  <v-data-table 
    :value="value"
    :headers="headers"
    :items="filteredItems"
    :options.sync="options"
    :server-items-length="total"
    :search="search"
    :loading="isLoading"
    :loading-text="$t('generic.loading')"
    :no-data-text="$t('vuetify.noDataAvailable')"
    :footer-props="{
      showFirstLastPage: true,
      'items-per-page-options': [10, 50, 100],
      'items-per-page-text': $t('vuetify.itemsPerPageText'),
      'page-text': $t('dataset.pageText')
    }"
    item-key="id"
    show-select
    @input="$emit('input', $event)">
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
        {{ dateFormat(dateParse(item.last_login, 'YYYY-MM-DDTHH:mm:ss'), 'YYYY/MM/DD HH:mm') }}
      </span>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { mdiMagnify } from '@mdi/js'
import { dateFormat } from '@vuejs-community/vue-filter-date-format'
import { dateParse } from '@vuejs-community/vue-filter-date-parse'
import type { PropType } from 'vue'
import Vue from 'vue'
import { DataOptions } from 'vuetify/types'
import { UserItem } from '~/domain/models/user/user'

export default Vue.extend({
  props: {
    isLoading: {
      type: Boolean,
      default: false,
      required: true
    },
    items: {
      type: Array as PropType<UserItem[]>,
      default: () => [],
      required: true
    },
    value: {
      type: Array as PropType<UserItem[]>,
      default: () => [],
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
      selected: [],
      options: {} as DataOptions,
      mdiMagnify,
      dateFormat,
      dateParse
    }
  },

  computed: {
    headers() {
      return [
        { text: this.$t('username'), value: 'username' },
        { text: this.$t('email'), value: 'email' },
        { text: this.$t('SuperUser'), value: 'isSuperuser' },
        { text: this.$t('last login'), value: 'last_login' }
      ]
    },
    filteredItems() {
      if (!this.search) return this.items;
      const searchLower = this.search.toLowerCase();
      return this.items.filter(item =>
        item.username.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower)
      );
    }
  }
})
</script>

<style scoped>
::v-deep .v-data-table {
  width: 100%;
}
</style>
