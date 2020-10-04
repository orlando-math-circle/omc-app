<template>
  <div style="height: 100%">
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon large>mdi-chevron-left</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fill-height>
      <v-row align="start" justify="center" no-gutters>
        <v-col cols="10" md="6">
          <h2>Registration</h2>
          <span class="subheader">Welcome to Orlando Math Circle</span>
          <span class="d-flex subheader"
            >Already registered? <a class="pl-2" href="#">Log in</a></span
          >

          <v-form>
            <v-row>
              <v-col>
                <v-text-field label="First Name" hide-details></v-text-field>
              </v-col>

              <v-col>
                <v-text-field label="Last Name" hide-details></v-text-field>
              </v-col>
            </v-row>

            <v-row class="pa-0">
              <v-col cols="6">
                <v-select
                  label="Birthday Month"
                  :items="[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ]"
                  error
                  hide-details
                ></v-select>
              </v-col>

              <v-col cols="3">
                <v-text-field
                  type="number"
                  label="Day"
                  error
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-text-field
                  type="number"
                  label="Year"
                  error
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <span class="error--text">{{ error }}</span>
              </v-col>
            </v-row>

            <v-text-field label="Email"> </v-text-field>

            <v-text-field label="Password"> </v-text-field>
            <v-text-field label="Confirm Password"> </v-text-field>

            <v-checkbox
              label="Receive emails about upcoming events"
              dense
              hide-details
            ></v-checkbox>

            <v-checkbox
              label="Receive emails reminding me of registered events"
              dense
              hide-details
            ></v-checkbox>

            <v-btn block class="mt-4">Sign up</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script land="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  layout: 'landing',
})
export default class RegisterPage extends Vue {
  error = 'Please have a parent or guardian register for you'
}
</script>

<style lang="scss" scoped>
.example {
  a {
    text-decoration: none;
  }
}
</style>
