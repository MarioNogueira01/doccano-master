<template>
  <v-card>
    <v-card-title>
      <v-btn class="text-capitalize" color="primary" @click.stop="$router.push('users/create')">
        {{ $t('generic.create') }}
      </v-btn>
    </v-card-title>

    <!-- Usando o componente UsersList para exibir a tabela de usuários -->
    <users-list
      v-model="selected"
      :items="users.items"
      :is-loading="isLoading"
      :total="users.count"
      @update:query="updateQuery"
    />
  </v-card>
</template>

<script lang="ts">
import UsersList from '~/components/users/UsersList.vue' // Importa o componente UsersList
import { UserItem } from '~/domain/models/user/user' // Agora usa UserItem
import { Page } from '~/domain/models/page'
import { SearchQueryData } from '~/services/application/user/userAplicationService'

export default {
  components: {
    UsersList
  },
  data() {
    return {
      users: {} as Page<UserItem>, // Usa UserItem
      selected: [] as UserItem[], // Usa UserItem
      isLoading: false
    }
  },

  async fetch() {
    this.isLoading = true
    this.users = await this.$services.user.list(
      this.$route.query as unknown as SearchQueryData
    )
    this.isLoading = false
  },

  methods: {
    updateQuery(query: object) {
      this.$router.push(query)
    }
  }
}
</script>
