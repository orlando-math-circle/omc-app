<template>
  <div style="height: 100%">
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon large>mdi-chevron-left</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container>
      <v-row>
        <v-col>
          <h2>Registration</h2>
          <span class="subheader">Welcome to Orlando Math Circle</span>

          <v-card>
            <v-card-text>
              <v-text-field append-icon="mdi-email"> </v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: 'landing',
  auth: 'guest',
}
</script>
