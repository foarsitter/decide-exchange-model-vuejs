<template>
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
              <tr>
                <td>interval 1</td>
                <td>
                  {{ model.interval() }}
                </td>
              </tr>
              <tr>
                <td>interval 2</td>
                <td>
                  {{ model.interval2() }}
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
</template>

<script lang="ts">
import "vue-slider-component/theme/default.css";

import { Component, Prop, Vue } from "vue-property-decorator";
import Model from "@/model/model";
import VueApexCharts from "vue-apexcharts";

@Component({
  components: {
    apexchart: VueApexCharts
  }
})
export default class ResultsComponent extends Vue {
  @Prop(Model)
  model!: Model;

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
      // {
      //   name: "euMaxI",
      //   data: [
      //     [0, this.model.euMaxI["j"]],
      //     this.model.interval(),
      //     [this.model.euMaxI["i"], 0]
      //   ]
      // },
      {
        name: "mds",
        data: [
          [0, this.model.expectedUtilityJ],
          [this.model.expectedUtilityJ, this.model.expectedUtilityJ],
          [this.model.expectedUtilityJ, 0]
        ]
      },
      {
        name: "euMaxJ",
        data: [
          [0, this.model.euMaxJ["i"]],
          [this.model.interval2()[1], this.model.interval2()[0]],
          [this.model.euMaxJ["j"], 0]
        ]
      }
    ];
  }
}
</script>
