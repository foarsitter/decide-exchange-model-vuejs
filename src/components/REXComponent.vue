<template>
  <section class="section">
    <div class="card">
      <div class="card-header">
        <h1 class="card-header-title">
          REX options
        </h1>
      </div>
      <div class="card-content"></div>
      <SingleValueSlider v-model="model.pValue">
        <template #icon>P-value</template>
      </SingleValueSlider>
      <SingleValueSlider v-model="model.rValue">
        <template #icon>Random value</template>
      </SingleValueSlider>
      <div class="columns">
        <div class="column is-one-fifth">Actor & Gain/Loss</div>
        <div class="column has-text-left">
          Use
          <select class="select" v-model="model.selectedActor"
            ><option>{{ model.iSupply.supply.actor.name }}</option
            ><option>{{ model.jSupply.supply.actor.name }}</option></select
          >
          as actor to calculate a simulation where {{ model.selectedActor }} has
          <select class="select" v-model="model.extraGainOrLoss"
            ><option value="gain">More</option
            ><option value="loss">Less</option>
          </select>
          utility then in the case of Equal Gain
        </div>
      </div>
    </div>
  </section>
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
