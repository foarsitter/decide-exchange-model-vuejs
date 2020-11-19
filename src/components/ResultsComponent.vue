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
          <div class="column is-one-quarter">
            <table class="table">
              <tr>
                <td colspan="2">
                  Exchange ratio
                </td>
              </tr>
              <tr>
                <td>{{ model.paretoOptimalExchange.issue }}</td>
                <td>{{ exchangeRatioP.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ model.partialShiftExchange.issue }}</td>
                <td>{{ exchangeRatioQ.toFixed(2) }}</td>
              </tr>
              <tr>
                <td colspan="2">
                  Utility
                </td>
              </tr>
              <tr>
                <td>Equal Gain</td>
                <td>{{ equalGain.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ model.iSupply.supply.actor.name }}</td>
                <td>{{ eui.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ model.jSupply.supply.actor.name }}</td>
                <td>{{ euj.toFixed(2) }}</td>
              </tr>
              <tr>
                <td colspan="2">
                  Max Utility
                </td>
              </tr>
              <tr>
                <td>{{ model.iSupply.supply.actor.name }}</td>
                <td>
                  {{ euMaxI.toFixed(4) }}
                </td>
              </tr>
              <tr>
                <td>{{ model.jSupply.supply.actor.name }}</td>
                <td>
                  {{ euMaxJ.toFixed(4) }}
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  Loss / Gain
                </td>
              </tr>
              <tr>
                <td>{{ model.iSupply.supply.actor.name }}</td>
                <td>
                  <table>
                    <tr>
                      <td>- {{ supplyLossI.toFixed(2) }}</td>
                      <td>
                        {{ demandGainI.toFixed(2) }}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>{{ model.jSupply.supply.actor.name }}</td>
                <td>
                  <table>
                    <tr>
                      <td>- {{ supplyLossJ.toFixed(2) }}</td>
                      <td>
                        {{ demandGainJ.toFixed(2) }}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
          <div class="column">
            <apexchart
              :options="chartOptions"
              :series="series"
              type="line"
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
import Interchange from "@/model/interchange";
import VueApexCharts from "vue-apexcharts";

@Component({
  components: {
    apexchart: VueApexCharts
  }
})
export default class ResultsComponent extends Vue {
  @Prop(Interchange)
  model!: Interchange;
  @Prop(Number)
  eui!: number;
  @Prop(Number)
  euj!: number;
  @Prop(Number)
  equalGain!: number;
  @Prop(Number)
  exchangeRatioP!: number;
  @Prop(Number)
  exchangeRatioQ!: number;
  @Prop(Number)
  euMaxI!: number;
  @Prop(Number)
  euMaxJ!: number;
  @Prop(Number)
  supplyLossI!: number;
  @Prop(Number)
  supplyLossJ!: number;
  @Prop(Number)
  demandGainI!: number;
  @Prop(Number)
  demandGainJ!: number;
  @Prop(Array)
  paretoFrontier!: number[];

  get chartOptions() {
    return {
      stroke: {
        curve: "straight",
        width: 1
      },
      xaxis: {
        decimalsInFloat: 0,
        title: { text: this.model.iSupply.supply.actor.name }
      },
      yaxis: {
        decimalsInFloat: 0,
        title: { text: this.model.jSupply.supply.actor.name }
      }
    };
  }

  get series() {
    return [
      {
        name: "Random interval " + this.model.jSupply.demand.actor.name,
        data: [
          [this.model.lowerLoss() * 100, 0],
          [this.equalGain * 100, 0],
          [this.model.upperGainJ() * 100, 0]
        ]
      },
      {
        name: "Random interval " + this.model.iSupply.demand.actor.name,
        data: [
          [0, this.model.lowerLoss() * 100],
          [0, this.equalGain * 100],
          [0, this.model.upperGainI() * 100]
        ]
      },
      {
        name: "Equal Gain",
        data: [
          [0, this.equalGain * 100],
          [this.equalGain * 100, this.equalGain * 100],
          [this.equalGain * 100, 0]
        ]
      },
      {
        name: "Pareto frontier",
        data: [
          [0, this.euMaxI * 100],
          [this.paretoFrontier[0] * 100, this.paretoFrontier[1] * 100],
          [this.euMaxJ * 100, 0]
        ]
      },
      {
        name: "REX",
        data: this.model.xyz(100)
      }
    ];
  }
}
</script>
