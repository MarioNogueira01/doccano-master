<template>
  <v-card>
    <v-card-title>
      <v-btn class="text-capitalize" color="primary" @click.stop="$router.push('users/create')">
        {{ $t('generic.create') }}
      </v-btn>
    </v-card-title>

    <!-- Mostrar o componente UsersList apenas quando isLoading for false -->
    <users-list
      v-if="!isLoading && users.items.length > 0"
      v-model="selected"
      :items="users.items"
      :is-loading="isLoading"
      :total="users.items.length"
      @update:query="updateQuery"
    />
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash'
import UsersList from '~/components/users/UsersList.vue'
import { UserItem } from '~/domain/models/user/user'
import { UserPage } from '~/domain/models/page'
import { SearchQueryData } from '~/services/application/user/userAplicationService'


export default {
  components: {
    UsersList
  },
  data() {
    return {
      users: {} as UserPage<UserItem>,
      selected: [] as UserItem[],
      isLoading: false
    }
  },

  async fetch() {
    this.isLoading = true
    try {
      // Realiza a requisição para obter os dados de usuários
      this.users = await this.$services.user.list(
        this.$route.query as unknown as SearchQueryData
      )
      console.log('Users recebidos:', this.users)
    } catch (e) {
      console.error('Erro ao carregar usuários:', e)
    } finally {
      this.isLoading = false
    }
  },

  // Usando o watch para observar mudanças na query da rota
  watch: {
    '$route.query': _.debounce(function () {
      // Só chama o fetch se houver uma mudança nas query params
      // @ts-ignore
      this.$fetch()
    }, 1000)
  },

  methods: {
    updateQuery(query: object) {
      // Atualiza a query da rota
      this.$router.push(query)
    }
  }
}
</script>
