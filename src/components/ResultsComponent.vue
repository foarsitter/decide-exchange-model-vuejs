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
                  {{ euMaxI.toFixed(4) }} <br />
                  {{ model.zeroUtilityI().toFixed(2) }}
                </td>
              </tr>
              <tr>
                <td>{{ model.jSupply.supply.actor.name }}</td>
                <td>
                  {{ euMaxJ.toFixed(4) }} <br />
                  {{ model.zeroUtilityJ().toFixed(2) }}
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
  paretoFrontier!: number[][];

  @Prop(Number)
  rexExpectedUtilityI!: number;

  @Prop(Number)
  rexExpectedUtilityJ!: number;

  get chartOptions() {
    return {
      dataLabels: {
        enabled: true,
        formatter: function(val: number, opts: any) {
          const seriesIndex = opts.seriesIndex;
          const dataPointIndex = opts.dataPointIndex;

          const x =
            Math.round(
              opts.w.config.series[seriesIndex].data[dataPointIndex][0] * 100
            ) / 100;
          const y =
            Math.round(
              opts.w.config.series[seriesIndex].data[dataPointIndex][1] * 100
            ) / 100;

          if (val == 0) {
            return x;
          }

          if (x != 0) {
            if (seriesIndex == 5) {
              return y + "; " + x;
            }
            {
              return "";
            }
          }

          return Math.round(val * 100) / 100;
        }
      },
      tooltip: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width: 1
      },
      xaxis: {
        labels: {
          show: false
        },
        decimalsInFloat: 0,
        title: { text: this.model.iSupply.supply.actor.name }
      },
      yaxis: {
        labels: {
          show: false
        },
        decimalsInFloat: 0,
        title: { text: this.model.jSupply.supply.actor.name }
      },
      colors: [
        "#008FFB", // loss j
        "#008FFB", // gain.ts j
        "#00E396", // loss i
        "#00E396", // loss i
        "#FEB019", // Equal Gain
        "#FF4560", // Pareto frontier
        "#775DD0" // REX
      ]
    };
  }

  get series() {
    return [
      {
        name: "Loss interval " + this.model.jSupply.demand.actor.name,
        data: [
          [this.equalGain, 0],
          [this.model.lowerLoss(), 0]
        ]
      },
      {
        name: "Gain interval " + this.model.jSupply.demand.actor.name,
        data: [
          [this.model.upperGainJ(), 0],
          [this.equalGain, 0]
        ]
      },
      {
        name: "Loss interval " + this.model.iSupply.demand.actor.name,
        data: [
          [0, this.model.lowerLoss()],
          [0, this.equalGain]
        ]
      },
      {
        name: "Gain interval " + this.model.iSupply.demand.actor.name,
        data: [
          [0, this.model.upperGainI()],
          [0, this.equalGain]
        ]
      },
      {
        name: "Equal Gain",
        data: [
          [0, this.equalGain],
          [this.equalGain, this.equalGain],
          [this.equalGain, 0]
        ]
      },
      {
        name: "Pareto frontier",

        data: this.paretoFrontier
      },
      {
        name: "REX",
        data: this.model.rex(1)
      }
    ];
  }
}
</script>
