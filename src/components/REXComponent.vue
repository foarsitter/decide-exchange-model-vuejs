<template>
  <section class="section">
    <div class="card">
      <div class="card-header">
        <h1 class="card-header-title">
          Results
        </h1>
      </div>
      <div class="card-content"></div>
      <SingleValueSlider v-model="model.pValue">
        <template #icon>P-value</template>
      </SingleValueSlider>
      <SingleValueSlider v-model="model.rValue">
        <template #icon>X-value</template>
      </SingleValueSlider>
      <div class="columns">
        <div class="column is-one-fifth"></div>

        <div class="field">
          <input
            v-model="model.useX"
            id="switchRoundedDefault"
            type="checkbox"
            name="switchRoundedDefault"
            class="switch is-rounded"
            checked="checked"
          />
          <label for="switchRoundedDefault"
            >Choice
            <span v-if="model.useX">{{ model.iSupply.supply.actor.name }}</span>
            <span v-else>{{ model.iSupply.demand.actor.name }}</span> as random
            actor</label
          >
        </div>
      </div>
      <div class="columns mt-2">
        <div class="column is-one-fifth"></div>
        <div class="field">
          <input
            v-model="model.useRight"
            id="switchRoundedDefault2"
            type="checkbox"
            name="switchRoundedDefault"
            class="switch is-rounded"
            checked="checked"
          />
          <label for="switchRoundedDefault2"
            ><span v-if="model.useRight">Right (X – r.X) </span>
            <span v-else>Left (X + r (Y-X))</span></label
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import "vue-slider-component/theme/default.css";

import { Component, Prop, Vue } from "vue-property-decorator";
import Model from "@/model/model";
import SingleValueSlider from "@/components/sliders/SingleValueSlider.vue";

@Component({
  components: { SingleValueSlider }
})
export default class REXComponent extends Vue {
  @Prop(Model)
  model!: Model;
}
</script>
