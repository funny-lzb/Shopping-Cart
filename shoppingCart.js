// 收获：列出Todos，然后从最容易的开始
// 一个函数负责一个功能，比如说渲染，那么久单独建一个渲染函数
import items from './items.json'
import formatCurrency from './util/formatCurrency'
import addGlobalEventListener from './util/addGlobalEventListener.js'

const cartButton = document.querySelector('[data-cart-button]')
const cartItemsWrapper = document.querySelector('[data-cart-items-wrapper]')
const IMAGE_URL = 'https://dummyimage.com/210x130'
const cartItemTemplate = document.querySelector('#cart-item-template')
const cartItemContainer = document.querySelector('[data-cart-items]')
const cartQuantity = document.querySelector('[data-cart-quantity]')
const cartTotal = document.querySelector('[data-cart-total]')
const cart = document.querySelector('[data-cart]')
const SESSION_STORAGE_KEY = 'SHOPPING_CART_cart'
let shoppingCart = loadCart()

export default function setupShoppingCart() {
  addGlobalEventListener('click', '[data-remove-from-cart-button]', e => {
    const selectedId = parseInt(e.target.closest('[data-item]').dataset.itemId)
    removeFromCart(selectedId)
  })

  renderCart()
}
// a.没有商品/商品从0到1增长时，显示/隐藏购物车
// a.可以从购物车移除此商品
// d.跨页面后，依然能保存之前的状态

// a1.点击时，隐藏/显示 购物车
cartButton.addEventListener('click', () => {
  cartItemsWrapper.classList.toggle('invisible')
})

// a2.点击Add，可以添加此商品到购物车
export function addToCart(selectedId) {
  const existingItem = shoppingCart.find(entry => entry.id === selectedId)
  if (existingItem) {
    existingItem.quantity++
  } else {
    shoppingCart.push({ id: selectedId, quantity: 1 })
  }

  renderCart()
  saveCart()
}

function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart()
  } else {
    showCart()
    renderCartItems()
  }
}
function removeFromCart(selectedId) {
  const existingItem = shoppingCart.find(entry => entry.id === selectedId)
  if (existingItem == null) return

  shoppingCart = shoppingCart.filter(entry => entry.id !== selectedId)
  renderCart()
  saveCart()
}

function hideCart() {
  cart.classList.add('invisible')
  cartItemsWrapper.classList.add('invisible')
}

function showCart() {
  cart.classList.remove('invisible')
}

function renderCartItems() {
  cartItemContainer.innerHTML = ''

  cartQuantity.innerText = shoppingCart.length

  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find(i => i.id === entry.id)
    return sum + item.priceCents * entry.quantity
  }, 0)

  cartTotal.innerText = formatCurrency(totalCents / 100)

  shoppingCart.forEach(entry => {
    const item = items.find(i => entry.id === i.id)
    const cartItem = cartItemTemplate.content.cloneNode(true)

    const container = cartItem.querySelector('[data-item]')
    container.dataset.itemId = item.id

    const name = cartItem.querySelector('[data-name]')
    name.innerText = item.name

    if (entry.quantity > 1) {
      const quantity = cartItem.querySelector('[data-quantity]') // c.购物车相同的商品让其只出现1次
      quantity.innerText = `x${entry.quantity}`
    }

    const price = cartItem.querySelector('[data-price]')
    price.innerText = `${formatCurrency(
      (item.priceCents * entry.quantity) / 100
    )}`

    const image = cartItem.querySelector('[data-image]')
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}` // c.计算购物车里的商品总价

    cartItemContainer.appendChild(cartItem)
  })
}

function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart))
}

function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY)
  return JSON.parse(cart) || []
}
