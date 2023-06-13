function getSign(num) {
  return num < 0 ? -1 : num > 0 ? 1 : 0;
}

let Random = {
  values: [],
  value: null,
  index: null,
  numNegatives: 0,
  numPositives: 0,
  setValues: function(values) {
    this.values = values;
    this.numNegatives = 0;
    this.numPositives = 0;
  },
  seed: function(index) {
    this.index = index;
    this.value = this.values[index];
  },
  getNext: function(num) {
    let sign = getSign(this.value);

    if ((sign === -1 && this.numNegatives - this.numPositives > 100) ||
        (sign === 1 && this.numPositives - this.numNegatives > 100)) {
      sign = -sign
    }

    if (sign === -1) {
      this.numNegatives++;
    }
    else {
      this.numPositives++;
    }

    let rand = sign * (num - num * Math.abs(this.value));
    let randIndex = (this.value * 10000 % 100 * 5 | 0);
    let index = this.index - randIndex;

    if (index < 0 || index > this.values.length - 1) {
      index = this.index + randIndex;
    }
    this.seed(index);

    return rand;
  }
};