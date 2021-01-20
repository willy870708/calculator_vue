<template>
  <div id="app">
    <div>
      <label>calculator</label>
      <Row type="flex" justify="center" class="code-row-bg">
        <Row>
          <Col span="24">
            <Input class="inputAns" v-model="ans" />
          </Col>
        </Row>
      </Row>

      <Row type="flex" justify="center" class="code-row-bg">
        <Buttons @update="updateAns" :current="this.ans" />
      </Row>
    </div>
  </div>
</template>

<script>
import Buttons from "./components/Buttons.vue";

export default {
  name: "App",
  data() {
    return {
      //顯示在input框的字串
      ans: ""
    };
  },
  components: {
    Buttons
  },
  methods: {
    /**
     * 由子元件觸發，更新輸入框的值
     */
    updateAns: function(val) {
      this.ans = val;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

</style>
