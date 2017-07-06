class MyPromise {
  constructor(fun) {
    this.status = 'pending';
    try {
      fun.apply(this, [this.resolve.bind(this), this.reject.bind(this)]);
    } catch (err) {
      console.log(err);
    }
  }

  catch(_nextFun) {
    this.err = _nextFun;
  }

  then(_nextFun) {
    this.next = _nextFun;
    this.nextPromise = new MyPromise(function () { });
    if (this.status === 'finish') {
      return this.next(this.result);
    }

    return this.nextPromise;
  }

  resolve(res) {
    this.result = res;
    if (!this.next) {
      this.status = 'finish';
      return this.result;
    }

    let tempres = this.next(this.result);
    if (tempres instanceof MyPromise) {
      return tempres.then(din => {
        this.result = din;
        this.status = 'finish';
        this.nextPromise.resolve(din);
        return din;
      });
    }
    this.result = tempres;
    this.nextPromise.resolve(tempres);
    this.status = 'finish';
  }

  reject(res) {
    this.err(res)
  }
}

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('hi');
  }, 1000);
}).then(d1 => {
  return new MyPromise((resolve, reject) => {
    setTimeout(function () {
      resolve(d1 + ' kasora');
    }, 1000);
  });
}).then(d2 => {
  return new MyPromise((resolve, reject) => {
    resolve(d2 + ' not finish');
  })
}).then(d3 => {
  return (d3 + '. finish now.');
}).then(d4 => {
  console.log(d4);
});