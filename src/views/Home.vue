<template>
  <div class="container">
    <Power v-bind:rabbit="rabbit" v-bind:turtle="turtle"></Power>
    <Exchange v-bind:exchange="holiday"
      ><template #title>{{ holiday.issue }}</template></Exchange
    >
    <Exchange v-bind:exchange="diner"
      ><template #title>{{ diner.issue }}</template></Exchange
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PowerComponent from "@/components/PowerComponent.vue";
import ExchangeComponent from "@/components/IssueComponent.vue";
import Actor from "@/model/actor";
import Exchange from "@/model/exchange";
import ActorIssue from "@/model/actorIssue";

@Component({
  components: {
    Exchange: ExchangeComponent,
    Power: PowerComponent
  }
})
export default class Home extends Vue {
  // i in the excel sheet
  rabbit = new Actor("🐰", 0.7);

  // j
  turtle = new Actor("🐢", 0.3);

  // p in the excel sheet
  holiday = new Exchange(
    "Holiday",
    new ActorIssue(0.3, 0, this.rabbit),
    new ActorIssue(0.7, 100, this.turtle)
  );

  // q
  diner = new Exchange(
    "Diner",
    new ActorIssue(0.9, 0, this.rabbit),
    new ActorIssue(0.2, 100, this.turtle)
  );

  @Watch("diner", {
    immediate: true,
    deep: true
  })
  @Watch("holiday", {
    immediate: true,
    deep: true
  })
  dinerChanged(exchange: Exchange) {
    exchange.calcMds();

    const q = this.diner;
    const p = this.holiday;

    const exchangeRatioP =
      (Math.abs(p.i.position - p.j.position) * p.i.salience * p.i.actor.power) /
      p.calcPowerSalience();

    const exchangeRatioQ =
      ((p.i.salience + p.j.salience) / (q.i.salience + q.j.salience)) *
      exchangeRatioP;

    const expectedUtilityI = Math.abs(
      exchangeRatioQ * q.i.salience - exchangeRatioP * p.i.salience
    );

    const expectedUtilityJ = Math.abs(
      exchangeRatioP * p.j.salience - exchangeRatioQ * q.j.salience
    );

    console.log(expectedUtilityI == expectedUtilityJ);
    console.log(expectedUtilityI);
    console.log(expectedUtilityJ);
  }
}
</script>
