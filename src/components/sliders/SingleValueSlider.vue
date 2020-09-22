<template>
  <div class="columns">
    <div class="column is-one-fifth">
      <slot name="icon"></slot>
    </div>
    <div class="column">
      <vue-slider
        :value="value"
        :min="0"
        :max="1"
        :interval="0.05"
        :tooltip="'always'"
        lazy
        @change="change"
      ></vue-slider>
    </div>
  </div>
</template>

<script lang="ts">
import VueSlider from "vue-slider-component";

import "vue-slider-component/theme/default.css";

import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: { VueSlider }
})
export default class SingleValueSlider extends Vue {
  @Prop(Number)
  value!: number;

  change(value: number) {
    this.$emit("input", value);
  }
}
</script>
