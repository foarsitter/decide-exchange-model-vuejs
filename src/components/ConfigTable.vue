<template>
  <div class="section">
    <table class="table">
      <thead>
        <tr>
          <th>Actor</th>
          <th>Issue</th>
          <th>Position</th>
          <th>Salience</th>
          <th>Power</th>
        </tr>
      </thead>
      <tr>
        <td>
          <input v-model="model.p.i.actor.name" />
        </td>
        <td>
          <input v-model="model.p.issue" />
        </td>
        <td>
          <input v-model="model.p.i.position" type="number" />
        </td>
        <td>
          <input v-model="model.p.i.salience" type="number" />
        </td>
        <td>
          <input v-model="model.p.i.actor.power" type="number" />
        </td>
      </tr>
      <tr>
        <td>
          <input v-model="model.q.i.actor.name" />
        </td>
        <td>
          <input v-model="model.q.issue" />
        </td>
        <td>
          <input v-model="model.q.i.position" type="number" />
        </td>
        <td>
          <input v-model="model.q.i.salience" type="number" />
        </td>
        <td>
          <input v-model="model.q.i.actor.power" type="number" />
        </td>
      </tr>
      <tr>
        <td>
          <input v-model="model.p.j.actor.name" />
        </td>
        <td>
          <input v-model="model.p.issue" />
        </td>
        <td>
          <input v-model="model.p.j.position" type="number" />
        </td>
        <td>
          <input v-model="model.p.j.salience" type="number" />
        </td>
        <td>
          <input v-model="model.p.j.actor.power" type="number" />
        </td>
      </tr>
      <tr>
        <td>
          <input v-model="model.q.j.actor.name" />
        </td>
        <td>
          <input v-model="model.q.issue" />
        </td>
        <td>
          <input v-model="model.q.j.position" type="number" />
        </td>
        <td>
          <input v-model="model.q.j.salience" type="number" />
        </td>
        <td>
          <input v-model="model.q.j.actor.power" type="number" />
        </td>
      </tr>
    </table>
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
}
</script>

<style scoped></style>
