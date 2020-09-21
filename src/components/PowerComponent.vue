<template>
  <section class="section" id="power">
    <div class="container">
      <div class="card">
        <header class="card-header">
          <h1 class="card-header-title">
            Power
          </h1>
        </header>
        <div class="card-content">
          <SingleValueSlider v-model="rabbit.power"
            ><template v-slot:icon>{{
              rabbit.name
            }}</template></SingleValueSlider
          >
          <SingleValueSlider v-model="turtle.power"
            ><template v-slot:icon>{{
              turtle.name
            }}</template></SingleValueSlider
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import "vue-slider-component/theme/default.css";
import "vue-slider-component/theme/antd.css";

import { Component, Prop, Vue } from "vue-property-decorator";
import SingleValueSlider from "@/components/sliders/SingleValueSlider.vue";
import Actor from "@/model/actor";

@Component({
  components: { SingleValueSlider }
})
export default class PowerComponent extends Vue {
  @Prop(Actor)
  rabbit!: Actor;

  @Prop(Actor)
  turtle!: Actor;
}
</script>
