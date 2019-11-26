# 整理复习一些JS“基础”

重学一些JS基础

## 1、三大特性
### 1.1 封装
```js
function Animal(place) {
  this.place = place;
  this.type = 'animal';

  this.run = function(m) {
    console.log('run: ', m);
  }
}
Animal.prototype = {
  a: 'a'
}
```

### 1.2 继承
#### new 的时候做了什么？
1. 创建一个新对象；
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。

```js
function F(type) {
  this.type = type;
  this.f = 'f';

  this.run = function(m) {
    console.log('run: ', m);
  }
}
F.prototype.a = 'a';

function _new() {
  var obj = {};
  var fn = Array.prototype.shift.call(arguments);

  obj.__proto__ = fn.prototype;
  var newObj = fn.apply(obj, arguments);

  return (
    Object.prototype.toString.call(newObj) === '[object Object]'
    ? newObj
    : obj
  );
}

// var f1 = new F();
var f1 = _new(F, 'F4');
console.log('f: ', f1); // { type: 'F4', f: 'f', run: [Function] }
console.log('a: ', f1.a); // a
console.log('type: ', f1.type); // F4
f1.run(2); // 2
```

#### 继承方式1：原型
* 可以继承父类内置方法、原型属性
* 缺点：不能向构造函数传参数；与父类共享，互相影响
```js
function Cat1() {
  this.c = 'c';
}
Cat1.prototype = new Animal();

console.log('-------- 1 ---------');
const cc1 = new Cat1();
console.log(cc1.type); // animal
console.log(cc1.a); // a
console.log(cc1.place); // undefined
cc1.run(2); // 2
```

#### 继承方式2：apply
继承父类内置方法
 * 缺点：无法继承父类的原型属性
 * 解决：看方法3、方法4
```js
function Cat2() {
  // Animal.apply(this, arguments);
  Animal.apply(this, ['深圳']);
  // this.type = 'cat'; // 会覆盖上面继承的东西
  this.c = 'c';
}

console.log('--------- 2 --------');
const cc2 = new Cat2();
console.log(cc2.type); // animal
console.log(cc2.a); // undefined
console.log(cc2.place); // 深圳
cc2.run(2); // 2
```

#### 继承方式3：Object.create
继承父类的原型属性
 * 缺点：不能向构造函数传参数；
 * 解决：与方式2一起用

```js
function Cat3() {
  // Animal.apply(this, arguments);
  Animal.apply(this, ['深圳']);
  // this.type = 'cat'; // 会覆盖上面继承的东西
  this.c = 'c';
}
Cat3.prototype = Object.create(Animal.prototype);
Cat3.prototype.constructor = Cat3;

console.log('--------- 3 --------');
const cc3 = new Cat3();
console.log(cc3.type); // animal
console.log(cc3.a); // a
console.log(cc3.place); // 深圳
cc3.run(2); // 2
```

#### 继承方式4：寄生+组合
* 缺点：无法继承父类内置方法
* 解决：与方式2一起用

```js
function Cat4() {
  // Animal.apply(this, arguments);
  Animal.apply(this, ['深圳']);
  // this.type = 'cat'; // 会覆盖上面继承的东西
  this.c = 'c';
}

// 可以改一下，Function.prototype.extend 写方法
// 使用更方便：Child.extend(Parent);
function extend(Child, Parent) {
  var fn = function() {};
  fn.prototype = Parent.prototype;
  Child.prototype = new fn();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}

extend(Cat4, Animal);

console.log('--------- 4 --------');
const cc4 = new Cat4();
console.log(cc4.type); // animal
console.log(cc4.a); // a
console.log(cc4.place); // 深圳
cc4.run(2); // 2
```


## 2、事件循环 Event Loop
浏览器是单线程，一旦遇到异步任务就会把其中的内容放到任务队列 Task；
然后浏览器在执行同步任务的同时，不断轮询任务队列，如果任务队列中有任务，会按照 **先进先出** 的顺序执行；一般来说任务队列中都是宏任务

### 2.1 异步任务
分为微任务 Micro Task，宏任务 Macro Task；

**任务队列** 中的宏任务会在上一个宏任务执行完时执行；

**微任务** 则是在主线程空闲时（如每一个宏任务执行完）执行；期间有新的微任务会继续执行，微任务都执行完才会继续轮询任务队列；

#### 宏任务 Macro Task
* 浏览器 <br />
    `setTimeout`, `setInterval`, `requestAnimationFrame`, `I/O`
* Node.js <br />
    `setTimeout`, `setInterval`, `setImmediate`

#### 微任务 Micro Task
* 浏览器 <br />
    `Promsie.then`, `Promsie.catch`, `Promsie.finally`, `MutationObserver`
* Node.js <br />
    `Promsie.then`, `Promsie.catch`, `Promsie.finally`, `process.nextTick`

```js
console.log('Start!');

setTimeout(() => {
  console.log('setTimeout1')
}, 0);

new Promise((resolve, reject) => {
  console.log('Promise');
  resolve();

  setTimeout(() => {
    console.log('setTimeout2');
  }, 0);

  Promise.resolve().then(() => {
    console.log('then2');
  })
}).then(() => {
  console.log('then1');
})

console.log('End!');

// Start, Promise, End, then2, then1, setTimeout1, setTimeout2;
```


## 3、this
执行上下文，可以理解为是一个对象，一般函数是那个对象的 `key`，这个函数的 `this` 就是那个对象；除非 `call/bind/apply` 改变了 `this`

```js
/**
 * this
 */
function a() {
  // 如果 a.call(obj)，则是 { a: 'a', fn: [Function: fn] }，
  // 否则 global/Window
  console.log('a: ', this); 
  
  b();
  function b() {
    console.log('b: ', this); // global/Window
    c();
    function c() {
      console.log('c: ', this); // global/Window
    }
  }
}

const obj = {
  a: 'a',
  fn: function() {
    console.log('fn: ', this); // { a: 'a', fn: [Function: fn] }
  }
};

obj.fn();

a.call(obj);
```

### 3.1 箭头函数
看这位大佬的 [文章](https://juejin.im/post/5cfdb35af265da1bb96fd17b)

**箭头函数与普通函数的区别：**
* 没有 `this`
* 没有 `arguments`
* 无法 `call/bind/apply`
* 没有原型
* 没有构造函数，不能 `new` 


## 4、对象/数组拷贝
### 4.1 浅拷贝
只拷贝一层 key，如果这个 key 是复杂数据类型（Object/Array）的话，有引用赋值

```js
function clone(objArr) {
  var getType = o => Object.prototype.toString.call(o);
  var isObjectOrArray = o => (
    getType(o) === '[object Object]' 
    || getType(o) === '[object Array]'
  );
  if (!isObjectOrArray(objArr)) return objArr;

  var newObj = getType(objArr) === '[object Object]' ? {} : [];
  Object.keys(objArr).forEach(item => {
    newObj[item] = objArr[item];
  })
  return newObj;
}

var obj1 = {
  a: 'a',
  b: {
    c: 'c1'
  }
};

var obj2 = clone(obj1);
console.log(obj2); // { a: 'a', b: { c: 'c1' } }
obj2.a = 'a2';
obj2.b.c = 'c2';
console.log(obj2); // { a: 'a2', b: { c: 'c2' } }
console.log(obj1); // { a: 'a', b: { c: 'c2' } }

var arr1 = [1, [3]];
var arr2 = clone(arr1);
console.log(arr2); // [ 1, [ 3 ] ]
arr2[0] = 2;
arr2[1][0] = 4;
console.log(arr2); // [ 2, [ 4 ] ]
console.log(arr1); // [ 1, [ 4 ] ]
```

### 4.2 深拷贝
* 判断 `objArr` 是否对象或数组，否的话直接返回；
* 是的话，对象则给新变量初始化为对象 `{}`，数组则 `[]`，
* 然后 循环判断每个 `key`，`key` 的值是对象或数组的话继续循环

```js
/**
 * 深拷贝
 * 判断 `obj` 是否对象或数组，否的话直接返回；
 * 是的话，对象则给新变量初始化为对象 `{}`，数组则 `[]`，
 * 然后 循环判断每个 `key`，`key` 的值是对象或数组的话继续循环
 */
function deepClone(objArr) {
  var getType = o => Object.prototype.toString.call(o);
  var isObjectOrArray = o => (
    getType(o) === '[object Object]' 
    || getType(o) === '[object Array]'
  );
  if (!isObjectOrArray(objArr)) return objArr;

  var newObjArr = getType(objArr) === '[object Object]' ? {} : [];

  Object.keys(objArr).forEach(item => {
    newObjArr[item] = isObjectOrArray(objArr[item])
      ? deepClone(objArr[item])
      : objArr[item]
  })

  return newObjArr; 
}

var obj3 = {
  a: 'a',
  b: {
    c: 'c1',
    e: {
      f: 'f'
    }
  },
  d: [0, 1, [2]]
};

var obj4 = deepClone(obj3);
console.log(obj4); // { a: 'a', b: { c: 'c1', e: { f: 'f' } }, d: [ 0, 1, [ 2 ] ] }
obj4.a = 'a2';
obj4.b.c = 'c2';
obj4.b.e.f = 'f1';
obj4.d[0] = 1;
obj4.d[2][0] = 3;
console.log(obj4); // { a: 'a2', b: { c: 'c2', e: { f: 'f1' } }, d: [ 1, 1, [ 3 ] ] }
console.log(obj3); // { a: 'a', b: { c: 'c1', e: { f: 'f' } }, d: [ 0, 1, [ 2 ] ] }
```


## 5、ES6一些数组方法的实现
### 5.1 Array.map
回调函数的返回值作为 `item`，返回一个与原数组一样长度的新数组

```js
/**
 * Array.map
 * 回调函数的返回值作为 item，返回一个与原数组一样长度的新数组
 */
Array.prototype._map = function(cb) {
  var arr = this;
  var newArr = [];

  // while 写法
  var i = 0;
  while(i < arr.length) {
    newArr.push(cb(arr[i], i));
    i++;
  }
  
  // for 循环写法：
  // for(var i=0; i<arr.length; i++) {
  //   newArr.push(cb(arr[i], i));
  // }

  return newArr;
}

var arr1 = arr._map(item => item.a);
var arr2 = arr._map(item => item.b);
var arr3 = arr._map(item => {
  return {
    a: 'aa',
    b: item.b
  }
});
console.log(arr1); // [ 'a1', 'a2', 'a3', 'a4' ]
console.log(arr2); // [ 'b1', 'b1', 'b2', 'b3' ]
console.log(arr3);
```

### 5.2 Array.forEach
for 循环，将 `item`、`循环序列号` 作为两个参数传给回调函数，循环直接执行回调函数

```js
/**
 * Array.forEach
 * for 循环，将 `item`、`循环序列号` 作为两个参数传给回调函数，循环直接执行回调函数
 */
Array.prototype._forEach = function(cb) {
  var arr = this;
  var i = 0;

  while(i < arr.length) {
    cb(arr[i], i);
    i++;
  }
}

arr._forEach(item => {
  item.a = 'aa';
  item['d'] = 'dd';
});
console.log(arr);
/**
[ { a: 'aa', b: 'b1', c: [ 'c1' ], d: 'dd' },
  { a: 'aa', b: 'b1', c: [ 'c2' ], d: 'dd' },
  { a: 'aa', b: 'b2', c: [ 'c2' ], d: 'dd' },
  { a: 'aa', b: 'b3', c: [ 'c3' ], d: 'dd' } ]
 */
```

### 5.3 Array.filter
* 将 `item`、`循环序列号` 作为两个参数传给回调函数；
* 回调函数的返回值作为条件，去过滤原数组，返回符合条件的 `item` 组成的数组

```js
/**
 * Array.filter
 * 将 `item`、`循环序列号` 作为两个参数传给回调函数；
 * 回调函数的返回值作为条件，去过滤原数组，返回符合条件的 `item` 组成的数组
 */
Array.prototype._filter = function(cb) {
  var arr = this;
  var newArr = [];
  var i = 0;

  while(i < arr.length) {
    var res = Boolean(cb(arr[i], i));
    if (res) newArr.push(arr[i]);
    i++;
  }

  return newArr;
}

var arr1 = arr._filter(item => item.a === 'a1');
var arr2 = arr._filter(item => item);
console.log(arr1); // [ { a: 'a1', b: 'b1', c: [ 'c1' ], d: 'd' } ]
console.log(arr2);
/**
[ { a: 'a1', b: 'b1', c: [ 'c1' ], d: 'd' },
  { a: 'a2', b: 'b1', c: [ 'c2' ], d: 'd' } ]
 */
```

### 5.4 Array.find
* 将 `item`、`循环序列号` 作为两个参数传给回调函数；
* 回调函数的返回值作为条件，只找一个，返回第一个符合条件的 `item` 

```js
/**
 * Array.find
 * 将 `item`、`循环序列号` 作为两个参数传给回调函数；
 * 回调函数的返回值作为条件，只找一个，返回第一个符合条件的 `item` 
 */
Array.prototype._find = function(cb) {
  var arr = this;
  var item = null;
  var i = 0;

  while(i < arr.length && item === null) {
    if (Boolean(cb(arr[i], i))) {
      item = arr[i];
    }
  }

  return item;
}

var item1 = arr._find(item => item.b === 'b1');
var item2 = arr._find(item => item);
console.log(arr);
console.log(item1); // { a: 'a1', b: 'b1', c: [ 'c1' ], d: 'd' }
console.log(item2); // { a: 'a1', b: 'b1', c: [ 'c1' ], d: 'd' }
```

### 5.5 Array.every
* 将 `item`、`循环序列号` 作为两个参数传给回调函数；
* 回调函数的返回值作为条件，判断是否所有 `item` 符合；也可以反向用 `Array.some` 找一个不符合的来替代

```js
/**
 * Array.every
 * 将 `item`、`循环序列号` 作为两个参数传给回调函数；
 * 回调函数的返回值作为条件，判断是否所有 `item` 符合；也可以反向用 `Array.some` 找一个不符合的来替代
 */
Array.prototype._every = function(cb) {
  var arr = this;
  var result = false;
  var i = 0;

  while(i < arr.length) {
    result = Boolean(cb(arr[i], i));
    i++;
  }

  return result;
}

var res1 = arr._every(item => item.d === 'd');
var res2 = arr._every(item => item.a === 'a');
console.log(res1); // true
console.log(res2); // false
```

### 5.6 Array.some
* 将 `item`、`循环序列号` 作为两个参数传给回调函数；
* 查找符合条件的 `item`，只找一个，返回 `Boolean`

```js
/**
 * Array.some
 * 将 `item`、`循环序列号` 作为两个参数传给回调函数；
 * 查找符合条件的 `item`，只找一个，返回 `Boolean`
 */
Array.prototype._some = function(cb) {
  var arr = this;
  var result = false;
  var i = 0;

  while(i < arr.length && !result) {
    result = Boolean(cb(arr[i], i));
    i++;
  }

  return result;
}

var has_a1 = arr._some(item => item.a === 'a1');
var has_b = arr._some(item => item.b === 'b');
var has_b1 = arr._some(item => item.b === 'b1');
console.log(has_a1); // true
console.log(has_b); // false
console.log(has_b1); // true
```

### 5.7 Array.reduce
* 将 `item`、`循环序列号` 作为两个参数传给回调函数；
* 累计循环；两个参数，第一个为函数（其中，第一个形参为第二个参数），第二个参数可不传;
* 回调函数的返回值作为下次回调的第二个参数，最终返回回调函数的返回值

```js
/**
 * Array.reduce
 * 将 `item`、`循环序列号` 作为两个参数传给回调函数；
 * 累计循环；两个参数，第一个为函数（其中，第一个形参为第二个参数），第二个参数可不传;
 * 回调函数的返回值作为下次回调的第二个参数，最终返回回调函数的返回值
 */
Array.prototype._reduce = function() {
  var arr = this;
  var i = 0;
  var cb = arguments[0];  // 第一个参数，回调函数
  var cur = arguments[1] || null; // 第二个参数

  while(i < arr.length) {
    cur = cb(cur, arr[i], i, arr);
    i++;
  }

  return cur;
}

// 求和
var list = [1,2,3,4,5,6,7,8,9];
var result = list._reduce((res, cur) => res + cur, 0);
console.log(result); // 45

// 统计某个字符出现的次数
var list2 = ['aa', 'bb', 'jj', 'cc', 'dd', 'aa', 'b1'];
var result2 = list2._reduce((res, cur) => {
  res[cur] ? res[cur]++ : res[cur] = 1;
  return res;
}, {});
console.log(result2); // { aa: 2, bb: 1, jj: 1, cc: 1, dd: 1 }
```


## 6、私有属性/公有属性
这个是在又一次面试的时候，面试官问的，挺简单，虽然第一次遇到这么问的

```js
/**
 * 私有属性，公有属性
 */
function fn() {
  // private
  var list = [];

  // public
  this.a = function() {
    console.log('a');
  }

  // public
  this.b = function() {
    console.log('b');
  }
}

const f = new fn();
console.log(f.list); // undefined
f.a(); // a
```


## 7、发布订阅模式
可以看 [这里](https://juejin.im/post/5cde23b3e51d45698161f63d)


## 8、斐波那契数列
理解概念之后还是很好写的

```js
/**
 * 求斐波那契数列
 * n<=2时为1，从3开始，每个数等于前两个之和
 * @param {*} n 
 */
function fb2(n) {
  const arr = [];
  for (var i = 0; i <= n; i++) {
    arr.push(
      i <= 2 ? 1 : arr[i - 1] + arr[i - 2]
    )
  }
  return arr;
}

console.log(fb2(15));
// [ 1, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610 ]
```

## 9、动态规划
### 9.1 硬币问题
思路：
1. 先求最大数的倍数 
2. 其中两个的组合（大数优先）
3. 三个的组合

![](../static/images/js-js-review-9.1.png)
```js
/**
 * 动态规划
 * 1块，4块，5块，求总数N块的最小硬笔数
 * 思路：1、先求最大数的倍数 2、其中两个的组合（大数优先） 3、三个的组合
 */
function getCoinNum(N) {
  let n1 = 1;
  let n2 = 4;
  let n3 = 5;

  // 输出结果组合、最少数量，如：12: { result: '5*2,4*0,2*1', minCount: 4 }
  const getResult = (result, minCount) => ({ result, minCount });

  if (N < n2) return getResult(`${n1}*${N}`, N / n1);
  if (N === n1) return getResult(`${n1}*1`, 1);
  if (N === n2) return getResult(`${n2}*1`, 1);
  if (N%n3 === 0) return getResult(`${n3}*${N/n3}`, N/n3);

  for (var j = 0; j < N/n2; j++) {
    for (var k = 0; k < N/n3; k++) {
      if (N === n3 * k + n2 * j) return getResult(`${n3}*${k},${n2}*${j}`, j + k);
      if (N === n2 * j) return getResult(`${n2}*${j}`, j);

      // N - n3*k - n2*j) 结果小于 4，则剩下的由 1 组成
      if ((N - n3 * k - n2 * j) > 0 && (N - n3 * k - n2 * j) < n2) {
        return getResult(
          `${n3}*${k},${n2}*${j},${(N - n3 * k - n2 * j)}*1`,
          j + k + (N - n3 * k - n2 * j)
        );
      }
    }
  }
}

// for (var i=0; i<=50; i++) console.log(`${i}: `, getCoinNum(i));
/**
 * 打印：
 * 0:  { result: '1*0', minCount: 0 }
1:  { result: '1*1', minCount: 1 }
2:  { result: '1*2', minCount: 2 }
3:  { result: '1*3', minCount: 3 }
4:  { result: '4*1', minCount: 1 }
5:  { result: '5*1', minCount: 1 }
6:  { result: '5*1,4*0,1*1', minCount: 2 }
7:  { result: '5*1,4*0,2*1', minCount: 3 }
8:  { result: '5*1,4*0,3*1', minCount: 4 }
9:  { result: '5*1,4*1', minCount: 2 }
10:  { result: '5*2', minCount: 2 }
11:  { result: '5*2,4*0,1*1', minCount: 3 }
12:  { result: '5*2,4*0,2*1', minCount: 4 }
13:  { result: '5*2,4*0,3*1', minCount: 5 }
14:  { result: '5*2,4*1', minCount: 3 }
15:  { result: '5*3', minCount: 3 }
16:  { result: '5*3,4*0,1*1', minCount: 4 }
17:  { result: '5*3,4*0,2*1', minCount: 5 }
18:  { result: '5*3,4*0,3*1', minCount: 6 }
19:  { result: '5*3,4*1', minCount: 4 }
20:  { result: '5*4', minCount: 4 }
21:  { result: '5*4,4*0,1*1', minCount: 5 }
22:  { result: '5*4,4*0,2*1', minCount: 6 }
23:  { result: '5*4,4*0,3*1', minCount: 7 }
24:  { result: '5*4,4*1', minCount: 5 }
25:  { result: '5*5', minCount: 5 }
26:  { result: '5*5,4*0,1*1', minCount: 6 }
27:  { result: '5*5,4*0,2*1', minCount: 7 }
28:  { result: '5*5,4*0,3*1', minCount: 8 }
29:  { result: '5*5,4*1', minCount: 6 }
30:  { result: '5*6', minCount: 6 }
31:  { result: '5*6,4*0,1*1', minCount: 7 }
32:  { result: '5*6,4*0,2*1', minCount: 8 }
33:  { result: '5*6,4*0,3*1', minCount: 9 }
34:  { result: '5*6,4*1', minCount: 7 }
35:  { result: '5*7', minCount: 7 }
36:  { result: '5*7,4*0,1*1', minCount: 8 }
37:  { result: '5*7,4*0,2*1', minCount: 9 }
38:  { result: '5*7,4*0,3*1', minCount: 10 }
39:  { result: '5*7,4*1', minCount: 8 }
40:  { result: '5*8', minCount: 8 }
41:  { result: '5*8,4*0,1*1', minCount: 9 }
42:  { result: '5*8,4*0,2*1', minCount: 10 }
43:  { result: '5*8,4*0,3*1', minCount: 11 }
44:  { result: '5*8,4*1', minCount: 9 }
45:  { result: '5*9', minCount: 9 }
46:  { result: '5*9,4*0,1*1', minCount: 10 }
47:  { result: '5*9,4*0,2*1', minCount: 11 }
48:  { result: '5*9,4*0,3*1', minCount: 12 }
49:  { result: '5*9,4*1', minCount: 10 }
50:  { result: '5*10', minCount: 10 }
 */
```