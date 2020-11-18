<template>
  <div class="container">
    <!--    <ConfigTable v-bind:model="model"></ConfigTable>-->
    <Power v-bind:rabbit="i" v-bind:turtle="j"></Power>
    <Exchange v-bind:exchange="p">
      <template #title>{{ p.issue }}</template>
    </Exchange>
    <Exchange v-bind:exchange="q">
      <template #title>{{ q.issue }}</template>
    </Exchange>
    <REXComponent v-bind:model="model"></REXComponent>
    <ResultsComponent
      v-bind:model="model"
      v-bind:eui="eui"
      v-bind:euj="euj"
      v-bind:exchangeRatioQ="exchangeRatioQ"
      v-bind:exchangeRatioP="exchangeRatioP"
      v-bind:equal-gain="equalGain"
      v-bind:eu-max-i="euMaxI"
      v-bind:eu-max-j="euMaxJ"
      v-bind:supply-loss-i="supplyLossI"
      v-bind:supply-loss-j="supplyLossJ"
      v-bind:demand-gain-i="demandGainI"
      v-bind:demand-gain-j="demandGainJ"
      v-bind:pareto-frontier="paretoFrontier"
    ></ResultsComponent>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PowerComponent from "@/components/PowerComponent.vue";
import ConfigTable from "@/components/ConfigTable.vue";
import ExchangeComponent from "@/components/IssueComponent.vue";
import Actor from "@/model/actor";
import Exchange from "@/model/exchange";
import ActorIssue from "@/model/actorIssue";
import Interchange from "@/model/interchange";
import VueApexCharts from "vue-apexcharts";
import ResultsComponent from "@/components/ResultsComponent.vue";
import REXComponent from "@/components/REXComponent.vue";

@Component({
  components: {
    ConfigTable,
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
  i = new Actor("China", 1);
  j = new Actor("USA", 1);

  p = new Exchange(
    "fin vol",
    new ActorIssue(this.i, 100, 0.5),
    new ActorIssue(this.j, 0, 0.7)
  );

  q = new Exchange(
    "fin who",
    new ActorIssue(this.i, 0, 0.8),
    new ActorIssue(this.j, 80, 0.5)
  );
  model = new Interchange(this.p, this.q);

  eui = 0;
  euj = 0;

  equalGain = 0;

  exchangeRatioP = 0;
  exchangeRatioQ = 0;

  euMaxI = 0;
  euMaxJ = 0;

  supplyLossI = 0;
  supplyLossJ = 0;

  demandGainI = 0;
  demandGainJ = 0;

  paretoFrontier = [0, 0];

  // actors
  @Watch("i.power")
  @Watch("j.power")
  // issue p
  @Watch("p.i.salience")
  @Watch("p.j.salience")
  @Watch("p.i.position")
  @Watch("p.j.position")
  // issue q
  @Watch("q.i.salience")
  @Watch("q.j.salience")
  @Watch("q.i.position")
  @Watch("q.j.position")
  // model values
  @Watch("model.pValue")
  @Watch("model.rValue")
  @Watch("model.useActorI")
  @Watch("model.giveExtraGain")
  dinerChanged() {
    this.update();
  }

  update() {
    this.model.negotiate();

    this.equalGain = this.model.equalGain();
    this.eui = this.model.calcExpectedUtilityI();
    this.euj = this.model.calcExpectedUtilityJ();

    this.exchangeRatioP = this.model.calcExchangeRatioP();
    this.exchangeRatioQ = this.model.calcExchangeRatioQ();

    this.supplyLossI = this.model.iSupply.Loss();
    this.supplyLossJ = this.model.jSupply.Loss();

    this.demandGainI = this.model.iDemand.Gain();
    this.demandGainJ = this.model.jDemand.Gain();

    this.euMaxI = this.model.euMaxI;
    this.euMaxJ = this.model.euMaxJ;
    this.paretoFrontier = this.model.paretoFrontier();
  }

  mounted() {
    this.update();
  }
}
</script>
