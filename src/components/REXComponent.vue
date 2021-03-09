<template>
  <section class="section pb-6">
    <div class="card">
      <div class="card-header">
        <h1 class="card-header-title">
          REX options
        </h1>
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
      </div>
      <div class="card-content" v-if="!hidden">
        <SingleValueSlider v-model="model.pValue">
          <template #icon>P-value</template>
        </SingleValueSlider>
        <SingleValueSlider v-model="model.rValue">
          <template #icon>Random value</template>
        </SingleValueSlider>
        <div class="columns">
          <div class="column is-one-fifth">Actor & Gain/Loss</div>
          <div class="column has-text-left">
            We chooise
            <div class="select">
              <select v-model="model.selectedActor">
                <option>{{ model.iSupply.supply.actor.name }} </option>
                <option>{{ model.jSupply.supply.actor.name }}</option>
              </select>
            </div>
            randomly to calculate
            <div class="select">
              <select class="select" v-model="model.extraGainOrLoss">
                <option value="gain">More </option>
                <option value="loss">Less</option>
              </select>
            </div>
            utility than in the Equal Gain
          </div>
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

  hidden = false;
}
</script>
