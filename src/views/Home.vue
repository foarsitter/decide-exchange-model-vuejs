<template>
  <div class="container">
    <Power v-bind:rabbit="rabbit" v-bind:turtle="turtle"></Power>
    <Exchange v-bind:exchange="holiday">
      <template #title>{{ holiday.issue }}</template>
    </Exchange>
    <Exchange v-bind:exchange="diner">
      <template #title>{{ diner.issue }}</template>
    </Exchange>
    <section class="section">
      <div class="card">
        <div class="card-header">
          <h1 class="card-header-title">
            Results
          </h1>
        </div>
        <div class="card-content">
          <div class="columns">
            <div class="column">
              <table class="table">
                <tr>
                  <td colspan="2">
                    Exchange ratio
                  </td>
                </tr>
                <tr>
                  <td>{{ model.iSupply.supply.actor.name }}</td>
                  <td>{{ model.exchangeRatioP.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>{{ model.jSupply.supply.actor.name }}</td>
                  <td>{{ model.exchangeRatioQ.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="2">
                    Utility
                  </td>
                </tr>
                <tr>
                  <td>{{ model.iSupply.supply.actor.name }}</td>
                  <td>{{ model.expectedUtilityI.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>{{ model.jSupply.supply.actor.name }}</td>
                  <td>{{ model.expectedUtilityI.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="2">
                    Max Utility
                  </td>
                </tr>
                <tr>
                  <td>{{ model.iSupply.supply.actor.name }}</td>
                  <td>
                    {{ model.euMaxI["i"].toFixed(4) }} -
                    {{ model.euMaxI["j"].toFixed(4) }}
                  </td>
                </tr>
                <tr>
                  <td>{{ model.jSupply.supply.actor.name }}</td>
                  <td>
                    {{ model.euMaxJ["j"].toFixed(4) }} -
                    {{ model.euMaxJ["i"].toFixed(4) }}
                  </td>
                </tr>
              </table>
            </div>
            <div class="column">
              <apexchart
                :options="chartOptions"
                :series="series"
                type="line"
                width="500"
              ></apexchart>
            </div>
          </div>
        </div>
      </div>
    </section>
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

@Component({
  components: {
    Exchange: ExchangeComponent,
    Power: PowerComponent,
    apexchart: VueApexCharts
  }
})
export default class Home extends Vue {
  dirty = false;

  // i in the excel sheet
  rabbit = new Actor("🐰 Actor 1", 0.7);

  // j
  turtle = new Actor("🐢 Actor 2", 0.3);

  // p in the excel sheet
  holiday = new Exchange(
    "Issue 1: Holiday",
    new ActorIssue(this.rabbit, 0, 0.3),
    new ActorIssue(this.turtle, 100, 0.7)
  );

  // q
  diner = new Exchange(
    "Diner",
    new ActorIssue(this.rabbit, 0, 0.9),
    new ActorIssue(this.turtle, 100, 0.2)
  );
  model = new Model(this.diner, this.holiday);

  @Watch("diner", {
    immediate: true,
    deep: true
  })
  @Watch("holiday", {
    immediate: true,
    deep: true
  })
  dinerChanged(exchange: Exchange) {
    if (!this.dirty) {
      this.dirty = true;
      exchange.calcMds();
      this.model.update();
    }
  }

  get chartOptions() {
    return {
      chart: {
        id: "vuechart-example",
        stroke: {
          curve: "smooth"
        }
      }
    };
  }

  get series() {
    return [
      {
        name: "euMaxI",
        data: [
          [0, this.model.euMaxI["j"]],
          // [this.model.euMaxI["i"], this.model.euMaxI["j"]],
          [this.model.euMaxI["i"], 0]
        ]
      },
      {
        name: "mds",
        data: [
          [0, this.model.expectedUtilityJ],
          [this.model.expectedUtilityJ, this.model.expectedUtilityJ],
          [this.model.expectedUtilityJ, 0]
        ]
      },
      {
        name: "euMaxJ p=1",
        data: [
          [0, this.model.euMaxJ["i"]],
          // [this.model.euMaxJ["j"], this.model.euMaxJ["i"]],
          [this.model.euMaxJ["j"], 0]
        ]
      }
    ];
  }
}
</script>
