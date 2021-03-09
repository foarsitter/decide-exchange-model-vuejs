<template>
  <div class="section">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          Data
        </p>
        <a
          v-if="hidden"
          class="card-header-icon card-toggle"
          @click="hidden = false"
        >
          Show
        </a>
        <a v-else class="card-header-icon card-toggle" @click="hidden = true">
          Hide
        </a>
      </header>

      <table
        v-if="!hidden"
        class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
      >
        <thead>
          <tr>
            <th>Actor</th>
            <th>Issue</th>
            <th style="width: 100px;">Position</th>
            <th style="width: 100px;">Salience</th>
            <th style="width: 100px;">Power</th>
          </tr>
        </thead>
        <tr>
          <td>
            <input class="input" v-model="model.p.i.actor.name" />
          </td>
          <td>
            <input class="input" v-model="model.p.issue" />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.p.i.position"
              type="number"
              step="5"
            />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.p.i.salience"
              type="number"
              step="0.05"
            />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.p.i.actor.power"
              type="number"
              step="0.05"
            />
          </td>
        </tr>
        <tr>
          <td>
            <input class="input" v-model="model.q.i.actor.name" />
          </td>
          <td>
            <input class="input" v-model="model.q.issue" />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.q.i.position"
              type="number"
              step="5"
            />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.q.i.salience"
              type="number"
              step="0.05"
            />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.q.i.actor.power"
              type="number"
              step="0.05"
            />
          </td>
        </tr>
        <tr>
          <td>
            <input class="input" v-model="model.p.j.actor.name" />
          </td>
          <td>
            <input class="input" v-model="model.p.issue" />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.p.j.position"
              type="number"
              step="5"
            />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.p.j.salience"
              type="number"
              step="0.05"
            />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.p.j.actor.power"
              type="number"
              step="0.05"
            />
          </td>
        </tr>
        <tr>
          <td>
            <input class="input" v-model="model.q.j.actor.name" />
          </td>
          <td>
            <input class="input" v-model="model.q.issue" />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.q.j.position"
              type="number"
              step="5"
            />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.q.j.salience"
              type="number"
              step="0.05"
            />
          </td>
          <td>
            <input
              class="input"
              v-model.number="model.q.j.actor.power"
              type="number"
              step="0.05"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import "vue-slider-component/theme/default.css";

import { Component, Prop, Vue } from "vue-property-decorator";
import Interchange from "@/model/interchange";
import SingleValueSlider from "@/components/sliders/SingleValueSlider.vue";

@Component({
  components: { SingleValueSlider }
})
export default class REXComponent extends Vue {
  @Prop(Interchange)
  model!: Interchange;

  hidden = false;
}
</script>

<style scoped></style>
