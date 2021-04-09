<template>
  <v-row>
    <v-col>
      <h2>Projects</h2>
      <span class="subtitle">Events hosted by OMC</span>

      <v-select
        :items="['Tutoring', 'Courses', 'Competitions']"
        class="mt-3"
        label="Projects"
        chips
        solo
      ></v-select>

      <v-card>
        <v-card-title>JavaScript Course</v-card-title>
        <v-card-subtitle
          >Learn the fundamentals of JavaScript, the language that powers the
          web!</v-card-subtitle
        >
        <v-list-item>
          <v-list-item-content>
            <v-row no-gutters class="mb-2">
              <v-col cols="auto">
                <v-icon>mdi-clock-outline</v-icon>
              </v-col>

              <v-col class="pl-5">Occasional Course</v-col>
            </v-row>

            <v-row no-gutters class="mb-2">
              <v-col cols="auto">
                <v-icon>mdi-account-circle-outline</v-icon>
              </v-col>

              <v-col class="pl-5"> Google Classroom </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="auto">
                <v-icon>mdi-web</v-icon>
              </v-col>

              <v-col class="pl-5"> Online </v-col>
            </v-row>
          </v-list-item-content>

          <v-list-item-avatar rounded size="100">
            <v-img :src="require('~/assets/images/programmer.jpg')"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-card>

      <v-card class="mt-5">
        <v-card-title>Girls Special Projects</v-card-title>
        <v-card-subtitle
          >A group to encourage girls in mathematics outside of school. Our
          mentors will help girls develop special projects like creating a math
          video, writing a math story, developing a lesson plan, or creating
          math art. Girls will have an opportunity to do math puzzles together
          and play math games.</v-card-subtitle
        >
        <v-list-item>
          <v-list-item-content>
            <v-row no-gutters class="mb-2">
              <v-col cols="auto">
                <v-icon>mdi-clock-outline</v-icon>
              </v-col>

              <v-col class="pl-5">Occasional Meetings</v-col>
            </v-row>

            <v-row no-gutters class="mb-2">
              <v-col cols="auto">
                <v-icon>mdi-account-circle-outline</v-icon>
              </v-col>

              <v-col class="pl-5"> Google Classroom </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="auto">
                <v-icon>mdi-map-marker</v-icon>
              </v-col>

              <v-col class="pl-5"> P Sherman, 42 Wallaby Way, Sydney</v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="auto">
                <v-icon>mdi-school</v-icon>
              </v-col>

              <v-col class="pl-5"> Grades 5 through 8</v-col>
            </v-row>
          </v-list-item-content>

          <v-list-item-avatar rounded size="100">
            <v-img :src="require('~/assets/images/string.png')"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  head() {
    return {
      title: 'Projects',
    }
  },
})
export default class ProjectsPage extends Vue {}
</script>
