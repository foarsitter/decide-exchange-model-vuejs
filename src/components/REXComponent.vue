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
        <div class="column is-one-fifth">Actor</div>
        <div class="column has-text-left">
          <div class="control">
            <label class="radio"
              ><input
                type="radio"
                v-model="model.selectedActor"
                v-bind:value="model.iSupply.supply.actor.name"
              />
              {{ model.iSupply.supply.actor.name }}</label
            >
            <label class="radio"
              ><input
                type="radio"
                v-model="model.selectedActor"
                v-bind:value="model.jSupply.supply.actor.name"
              />
              {{ model.jSupply.supply.actor.name }}</label
            >
          </div>
        </div>
      </div>
      <div class="columns mt-2">
        <div class="column is-one-fifth">Extra Gain or Loss</div>
        <div class="column  has-text-left">
          <div class="control">
            <label class="radio"
              ><input
                type="radio"
                v-model="model.extraGainOrLoss"
                value="gain"
              />
              Gain</label
            >
            <label class="radio"
              ><input
                type="radio"
                v-model="model.extraGainOrLoss"
                value="loss"
              />
              Loss</label
            >
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
}
</script>
