<template>
  <div></div>
</template>

<script lang="ts">
import VueSlider from "vue-slider-component";

import "vue-slider-component/theme/default.css";
import "vue-slider-component/theme/antd.css";

import { Component, Vue } from "vue-property-decorator";

@Component({
  components: { VueSlider }
})
export default class IssueSlider extends Vue {
  data = [25, 75];

  change(value: number, index: number) {
    console.log(value, index);
  }
}
</script>
