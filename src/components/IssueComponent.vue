<template>
  <section class="section">
    <div class="container">
      <div class="card">
        <header class="card-header">
          <h1 class="card-header-title">
            <slot name="title"></slot>
          </h1>
        </header>
        <div class="card-content">
          <div class="columns">
            <div class="column">
              <vue-slider
                class="my-6 mb-6"
                ref="xyzSlider"
                v-model="sliderValues"
                :min="0"
                :tooltip="'always'"
                :order="false"
                :max="100"
                :interval="1"
                :tooltipPlacement="['top', 'top', 'bottom']"
                :dot-options="dotOptions"
                lazy
                @change="change"
              >
                <template #tooltip="{ index, value }">
                  {{ actorName(index) }} {{ value.toFixed(2) }}
                </template>
              </vue-slider>

              <div class="mt-6 pt-6">
                <p>
                  * Supply issue of
                  <strong>{{ exchange.supply.actor.name }}</strong>
                </p>

                <table class="table is-fullwidth">
                  <tr>
                    <td class="has-text-left">Model</td>
                    <td>Exchange Ratio</td>
                    <td>move</td>
                    <td>voting position</td>
                    <td>MDS</td>
                  </tr>
                  <tr>
                    <td class="has-text-left">Equal Gain</td>
                    <td>{{ exchangeRatio.toFixed(2) }}</td>
                    <td>
                      {{ move.toFixed(2) }}
                    </td>
                    <td>{{ votingPosition.toFixed(2) }}</td>
                    <td>{{ mdsVoting.toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <td class="has-text-left">Random Exchange</td>
                    <td>{{ exchangeRatioRandom.toFixed(2) }}</td>
                    <td>
                      {{ moveRandom.toFixed(2) }}
                    </td>
                    <td>{{ votingRandom.toFixed(2) }}</td>
                    <td>{{ mdsRandom.toFixed(2) }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="column">
              <p class="title">Salience</p>
              <SingleValueSlider v-model="exchange.i.salience">
                <template v-slot:icon>{{ exchange.i.actor.name }} </template>
              </SingleValueSlider>
              <SingleValueSlider v-model="exchange.j.salience">
                <template v-slot:icon>{{ exchange.j.actor.name }} </template>
              </SingleValueSlider>
            </div>
          </div>
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
import Exchange from "@/model/exchange";
import VueSlider from "vue-slider-component";

@Component({
  components: { SingleValueSlider, VueSlider }
})
export default class ExchangeComponent extends Vue {
  @Prop(Exchange)
  exchange!: Exchange;
  @Prop(Number)
  mdsVoting!: number;
  @Prop(Number)
  mdsRandom!: number;
  @Prop(Number)
  votingPosition!: number;
  @Prop(Number)
  votingRandom!: number;
  @Prop(Number)
  move!: number;
  @Prop(Number)
  moveRandom!: number;
  @Prop(Number)
  exchangeRatio!: number;
  @Prop(Number)
  exchangeRatioRandom!: number;

  actor_issues = [this.exchange.i, this.exchange.j];

  actorName(index: number) {
    if (index == 2) {
      return "mds";
    }

    const a = this.actor_issues[index];
    if (a.exchange?.supply.actor.name == a.actor.name) {
      return a.actor.name + "*";
    }
    return a.actor.name;
  }

  get sliderValues() {
    return [
      this.exchange.i.position,
      this.exchange.j.position,
      this.exchange.MDS()
    ];
  }

  data() {
    return {
      dotOptions: [
        {
          disabled: false
        },
        {
          disabled: false
        },
        {
          disabled: true
        }
      ]
    };
  }

  change(value: number[], index: number) {
    if (index != 2) {
      this.actor_issues[index].position = value[index];
    }
    this.sliderValues[2] = this.exchange.MDS();
  }

  getSlider(): VueSlider {
    return this.$refs.xyzSlider as VueSlider;
  }
}
</script>
