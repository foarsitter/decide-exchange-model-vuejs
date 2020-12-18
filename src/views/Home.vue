<template>
  <div class="container">
    <ConfigTable v-bind:model="model"></ConfigTable>
    <Power v-bind:rabbit="i" v-bind:turtle="j"></Power>
    <Exchange
      v-bind:exchange="p"
      v-bind:mds-voting="mdsPVoting"
      v-bind:mds-random="mdsRandomP"
      v-bind:voting-position="votingPositionP"
      v-bind:voting-random="votingRandomP"
      v-bind:move="moveP"
      v-bind:move-random="moveRandomP"
      v-bind:exchange-ratio="exchangeRatioP"
      v-bind:exchange-ratio-random="exchangeRatioRandomP"
    >
      <template #title>{{ p.issue }}</template>
    </Exchange>
    <Exchange
      v-bind:exchange="q"
      v-bind:mds-voting="mdsQVoting"
      v-bind:mds-random="mdsRandomQ"
      v-bind:voting-position="votingPositionQ"
      v-bind:voting-random="votingRandomQ"
      v-bind:move="moveQ"
      v-bind:move-random="moveRandomQ"
      v-bind:exchange-ratio="exchangeRatioQ"
      v-bind:exchange-ratio-random="exchangeRatioRandomQ"
    >
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
  i = new Actor("Brazil", 0.7);
  j = new Actor("USA", 1);

  p = new Exchange(
    "L&D",
    new ActorIssue(this.i, 50, 0.55),
    new ActorIssue(this.j, 0, 0.9)
  );

  q = new Exchange(
    "Who Pays",
    new ActorIssue(this.i, 0, 0.7),
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

  paretoFrontier = [
    [0, 0],
    [0, 0]
  ];

  mdsPVoting = 0;
  mdsQVoting = 0;

  votingPositionP = 0;
  votingPositionQ = 0;

  moveP = 0;
  moveQ = 0;

  rexExpectedUtilityI = 0;
  rexExpectedUtilityJ = 0;
  // actors
  moveRandomP = 0;
  moveRandomQ = 0;

  votingRandomP = 0;
  votingRandomQ = 0;

  mdsRandomP = 0;
  mdsRandomQ = 0;

  exchangeRatioRandomP = 0;
  exchangeRatioRandomQ = 0;

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
  @Watch("model.selectedActor")
  @Watch("model.extraGainOrLoss")
  dinerChanged() {
    this.update();
  }

  update() {
    console.log("Update");
    this.equalGain = this.model.equalGain();
    this.eui = this.model.calcExpectedUtilityI();
    this.euj = this.model.calcExpectedUtilityJ();

    this.mdsPVoting = this.model.p.MDSVoting();
    this.mdsQVoting = this.model.q.MDSVoting();

    this.votingPositionP = this.model.p.votingPosition;
    this.votingPositionQ = this.model.q.votingPosition;

    this.moveP = this.p.move;
    this.moveQ = this.q.move;

    this.exchangeRatioP = this.model.calcExchangeRatioP();
    this.exchangeRatioQ = this.model.calcExchangeRatioQ();

    this.supplyLossI = this.model.iSupply.Loss();
    this.supplyLossJ = this.model.jSupply.Loss();

    this.demandGainI = this.model.iDemand.Gain();
    this.demandGainJ = this.model.jDemand.Gain();

    this.euMaxI = this.model.euMaxI;
    this.euMaxJ = this.model.euMaxJ;

    this.paretoFrontier = this.model.paretoFrontier();

    this.model.randomGain();

    this.eui = this.model.calcExpectedUtilityI();
    this.euj = this.model.calcExpectedUtilityJ();

    this.moveRandomP = this.p.move;
    this.moveRandomQ = this.q.move;

    this.votingRandomP = this.p.votingPosition;
    this.votingRandomQ = this.q.votingPosition;

    this.exchangeRatioRandomP = this.model.calcExchangeRatioP();
    this.exchangeRatioRandomQ = this.model.calcExchangeRatioQ();

    this.mdsRandomP = this.model.p.MDSVoting();
    this.mdsRandomQ = this.model.q.MDSVoting();
  }

  mounted() {
    this.update();
  }
}
</script>
