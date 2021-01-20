export default class Stack {
    constructor() {
      this.stack = []
      this.max = 0
      this.opts = {
        '+': 1,
        '-': 1,
        '*': 5,
        '/': 5,
        '(': 10,
        ')': 10
      }
    }
    in(char) {
      this.stack.push(char)
      this.max = this.opts[this.stack[this.stack.length - 1]]
    }
    out() {
      let pop = this.stack.pop()
      this.max = this.opts[this.stack[this.stack.length - 1]]
      return pop
    }
    empty() {
      return !this.stack.length
    }
    last() {
      return this.stack[this.stack.length - 1]
    }
  }