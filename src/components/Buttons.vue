<template>
  <div>
    <Row :gutter="8">
      <Col span="6">
        <Button @click="clearAll">c</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('(')">(</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber(')')">)</Button>
      </Col>
      <Col span="6">
        <Button type="primary" @click="calResult">=</Button>
      </Col>
    </Row>

    <Row :gutter="8">
      <Col span="6">
        <Button @click="storeNumber('7')">7</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('8')">8</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('9')">9</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('+')">+</Button>
      </Col>
    </Row>
    <Row :gutter="8">
      <Col span="6">
        <Button @click="storeNumber('4')">4</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('5')">5</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('6')">6</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('-')">-</Button>
      </Col>
    </Row>
    <Row :gutter="8">
      <Col span="6">
        <Button @click="storeNumber('1')">1</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('2')">2</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('3')">3</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('*')">*</Button>
      </Col>
    </Row>
    <Row :gutter="8">
      <Col span="12">
        <Button class="zeroSign" @click="storeNumber('0')">0</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('.')">.</Button>
      </Col>
      <Col span="6">
        <Button @click="storeNumber('/')">/</Button>
      </Col>
    </Row>
    <div></div>
  </div>
</template>

<script>
//引入自定義類別stack使用
import Stack from "./Stack";
export default {
  components: {},
  props: {
    //從父元件傳進來的當前值
    current: String
  },
  data() {
    return {
      //要更新到父元件的答案
      ans: ""
    };
  },
  computed: {},
  methods: {
    /**
     * 清空所有數據
     */
    clearAll: function() {
      this.ans = "";
      this.$emit("update", this.ans);
    },
    /**
     * 將按鈕的值用字串串起來，並更新到父元件的輸入框顯示
     */
    storeNumber: function(val) {
      this.ans += val;
      this.$emit("update", this.ans);
    },
    /**
     * 計算結果
     */
    calResult: function() {
        this.ans = this.current;
        this.ans = this.getResult(this.transform(this.ans.trim()));
        this.$emit("update", this.ans.toString());
        this.ans = "";
    },
    /**
     * 將輸入字串轉換成後續運算式
     */
    transform: function(str) {
      // 模擬棧 存儲運算操作符
      var stack = new Stack();
      // 後序表達式數組
      var postfixExp = [];
      // 切分中序表達式
      str = this.str2arr(str);
      // 遍歷處理過後的中序表達式
      for (let i = 0; i < str.length; i++) {
        // debugger
        let item = str[i];
        if (!isNaN(Number(item))) {
          // 數字直接入棧
          postfixExp.push(item);
        } else if (item === "(") {
          // '(' 直接入棧
          stack.in(item);
        } else if (item === ")") {
          // 遇到 ')' 則持續出棧至遇到'('停止
          let top = stack.out();
          while (top && top !== "(") {
            postfixExp.push(top);
            top = stack.out();
          }
        } else if (stack.opts[item]) {
          // 合法的 加減乘除字符
          if (
            stack.empty() ||
            stack.opts[item] > stack.max ||
            stack.last() === "("
          ) {
            // 棧爲空 || 當前運算符優先級較高 || 棧頂是'('字符
            stack.in(item);
          } else {
            // 棧頂元素依次出棧 直至新操作符比棧頂優先級高 新操作符入棧
            let top = stack.last(); // 目前棧頂的元素
            let max = stack.opts[item]; // 新操作符的權重
            while (top && max <= stack.max && stack.last() !== "(") {
              postfixExp.push(stack.out());
              top = stack.last();
            }
            stack.in(item);
          }
        }
      }
      // 遍歷結束 輸出棧中所有元素
      while (!stack.empty()) {
        postfixExp.push(stack.out());
      }
      return postfixExp;
    },
    /**
     * 將數字與運算符號轉成陣列
     */
    str2arr: function(str) {
      str = str.split("+").join("|+|");
      str = str.split("-").join("|-|");
      str = str.split("*").join("|*|");
      str = str.split("/").join("|/|");
      str = str.split("(").join("(|");
      str = str.split(")").join("|)");
      return str.split("|");
    },
    /**
     * 使用後序運算式計算答案
     */
    getResult: function(arr) {
      // 模擬棧 存儲運算數字
      let stack = new Stack();
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (!isNaN(Number(item))) {
          // 數字直接入棧
          stack.in(item);
        } else {
          // 遇到操作符 則拿出棧頂的兩個元素 進行運算 並將運算結果入棧
          let tempRes = 0;
          let a = Number(stack.out());
          let b = Number(stack.out());
          switch (item) {
            case "+":
              tempRes = b + a;
              break;
            case "-":
              tempRes = b - a;
              break;
            case "*":
              tempRes = b * a;
              break;
            case "/":
              tempRes = b / a;
              break;
            default:
              throw new Error("操作符有誤");
          }
          stack.in(tempRes);
        }
      }
      return stack.out();
    }
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  activated() {},
  deactivated() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.zeroSign {
  width: 6.2em;
}
</style>