<template>
  <section class="section" id="power">
    <div class="card">
      <header class="card-header">
        <h1 class="card-header-title">
          Power
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
      </header>
      <div class="card-content" v-if="!hidden">
        <SingleValueSlider v-model="rabbit.power"
          ><template v-slot:icon>{{ rabbit.name }}</template></SingleValueSlider
        >
        <SingleValueSlider v-model="turtle.power"
          ><template v-slot:icon>{{ turtle.name }}</template></SingleValueSlider
        >
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

  hidden = false;
}
</script>
