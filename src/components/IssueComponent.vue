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
              <p class="title">Position</p>
              <vue-slider
                v-model="value"
                :min="0"
                :tooltip="'always'"
                :order="false"
                :max="100"
                :interval="1"
                @change="change"
              >
                <template #tooltip="{ index, value }">
                  {{ actorName(index) }} {{ value }}
                </template>
              </vue-slider>
            </div>
            <div class="column">
              <p class="title">Salience</p>
              <SingleValueSlider v-model="exchange.rabbit.salience"
                ><template v-slot:icon>{{
                  exchange.rabbit.actor.name
                }}</template></SingleValueSlider
              >
              <SingleValueSlider v-model="exchange.turtle.salience"
                ><template v-slot:icon>{{
                  exchange.turtle.actor.name
                }}</template></SingleValueSlider
              >
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
import IssueSlider from "@/components/sliders/PositionSlider.vue";
import SingleValueSlider from "@/components/sliders/SingleValueSlider.vue";
import Exchange from "@/model/exchange";
import VueSlider from "vue-slider-component";

@Component({
  components: { SingleValueSlider, IssueSlider, VueSlider }
})
export default class ExchangeComponent extends Vue {
  @Prop(Exchange)
  exchange!: Exchange;

  actor_issues = [this.exchange.turtle, this.exchange.rabbit];

  actorName(index: number) {
    return this.actor_issues[index].actor.name;
  }

  data() {
    return {
      value: [this.exchange.turtle.position, this.exchange.rabbit.position]
    };
  }
  change(value: number[], index: number) {
    this.actor_issues[index].position = value[index];
  }
}
</script>
