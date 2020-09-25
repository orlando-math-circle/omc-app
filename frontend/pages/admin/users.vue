<template>
  <div>
    <!-- <v-row>
      <v-col class="ma-4">
        <h2>Users!</h2>
      </v-col>
    </v-row> -->

    <v-row>
      <v-col class="ma-4">
        <v-card>
          <v-card-title>
            Users
            <v-spacer></v-spacer>

            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="$store.state.users.users"
            :search="search"
          >
            <template v-slot:item.feeWaived="{ item }">
              <v-simple-checkbox
                v-model="item.feeWaived"
                disabled
              ></v-simple-checkbox>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { FindUsersDto } from '~/../backend/src/user/dtos/find-users.dto'

export default Vue.extend({
  layout: 'admin',
  async fetch() {
    const payload: FindUsersDto = { limit: 10, offset: 0 }

    try {
      await this.$store.dispatch('users/fetchUsers', payload)
    } catch (error) {
      console.error(error)
    }
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'First Name', value: 'first' },
        { text: 'Last Name', value: 'last' },
        { text: 'Email', value: 'email' },
        { text: 'Roles', value: 'roles' },
        { text: 'Fee Waived', value: 'feeWaived' },
      ],
    }
  },
  head: {
    title: 'Users',
  },
})
</script>
