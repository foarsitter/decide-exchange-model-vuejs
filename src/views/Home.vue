<template>
  <div class="container">
    <Power v-bind:rabbit="rabbit" v-bind:turtle="turtle"></Power>
    <Exchange v-bind:exchange="holiday">
      <template #title>{{ holiday.issue }}</template>
    </Exchange>
    <Exchange v-bind:exchange="diner">
      <template #title>{{ diner.issue }}</template>
    </Exchange>
    <REXComponent v-bind:model="model"></REXComponent>
    <ResultsComponent v-bind:model="model"></ResultsComponent>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PowerComponent from "@/components/PowerComponent.vue";
import ExchangeComponent from "@/components/IssueComponent.vue";
import Actor from "@/model/actor";
import Exchange from "@/model/exchange";
import ActorIssue from "@/model/actorIssue";
import Model from "@/model/model";
import VueApexCharts from "vue-apexcharts";
import ResultsComponent from "@/components/ResultsComponent.vue";
import REXComponent from "@/components/REXComponent.vue";

@Component({
  components: {
    REXComponent,
    ResultsComponent,
    Exchange: ExchangeComponent,
    Power: PowerComponent,
    apexchart: VueApexCharts
  }
})
export default class Home extends Vue {
  dirty = false;

  // i in the excel sheet
  rabbit = new Actor("🐰 Actor 1", 1);

  // j
  turtle = new Actor("🐢 Actor 2", 1);

  // p in the excel sheet
  holiday = new Exchange(
    "Issue 1: Holiday",
    new ActorIssue(this.rabbit, 0, 0.1),
    new ActorIssue(this.turtle, 100, 0.6)
  );

  // q
  diner = new Exchange(
    "Diner",
    new ActorIssue(this.rabbit, 0, 0.9),
    new ActorIssue(this.turtle, 100, 0.5)
  );
  model = new Model(this.diner, this.holiday);

  @Watch("diner.demand", {
    immediate: false,
    deep: true
  })
  @Watch("diner.supply", {
    immediate: false,
    deep: true
  })
  @Watch("holiday.demand", {
    immediate: false,
    deep: true
  })
  @Watch("holiday.supply", {
    immediate: false,
    deep: true
  })
  dinerChanged(value: ActorIssue) {
    if (value.exchange instanceof Exchange) {
      value.exchange.calcMds();
    }
  }
}
</script>
