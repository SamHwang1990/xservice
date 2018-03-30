# XService

经过一段时间的思考和摸索，我为团队提供了下面的一套新的、以数据流为基础的、跨越视图层和业务service 层的应用状态管理方案：

1. 增加`xService` 概念，每个业务模块都可以拥有的独立的controller，用于连接agent 层和视图层。xService 中可按需要创建和持有模块的状态数据；
2. 上面提到的模块状态数据，我参考了[`ngrx/platform`](https://github.com/ngrx/platform)中的`store ` 设计，在项目中引入了XStateSubject，一种继承于Observable.BehaviorSubject，提供类似于Vuex mutation 的方式来修改数据的对象；
3. xService 中持有的XStateSubject 建议都会暴露一个只读的流给外界（比如Vue 实例）订阅，而修改XStateSubject 则需要通过dispatch 某个action，并附带对应payload 来完成；
4. Vue 视图层则配合`vue-rx` 中的`subscriptions` 来替代原来的`computed`；

在实践中，甚至连Vue 视图层的`data` 我都很大程度上弃用。Vue 实例中对data 的读取是很方便的，`this.dataName` 即可，但在设置data 数据时就显得过于没有成本了，简单的`this.dataName = 'say something'`，就能修改状态数据，这种低成本setter 操作让我很没有安全感。于是配合`subscriptions` 和`XStateSubject`，我有意地将让数据更新的操作变得更加有指引性。

不是一个完备的JS 工具库，单纯从项目中抽取出来的而已。