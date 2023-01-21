import items from './items.json'
import { setupStore } from './store.js'
import setupShoppingCart from './shoppingCart.js'

setupStore() // 1、根据数组填充渲染页面

setupShoppingCart()
