import items from './items.json'
import formatCurrency from './util/formatCurrency.js'
import { addToCart } from './shoppingCart.js'
import addGlobalEventListener from './util/addGlobalEventListener.js'

const storeItemTemplate = document.querySelector('#store-item-template') //选中模板
const storeItemContainer = document.querySelector('[data-store-container]')
const IMAGE_URL = 'https://dummyimage.com/420x260'

export function setupStore() {
  if (storeItemContainer == null) return
  addGlobalEventListener('click', '[data-add-to-cart-button]', e => {
    const selectedId = e.target.closest('[data-store-item]').dataset.itemId
    addToCart(parseInt(selectedId))
  })

  items.forEach(renderStoreItem)
}

function renderStoreItem(item) {
  const storeItem = storeItemTemplate.content.cloneNode(true) // 拷贝一份模板

  const container = storeItem.querySelector('[data-store-item]')
  container.dataset.itemId = item.id

  const name = storeItem.querySelector('[data-name]')
  name.innerText = item.name

  const category = storeItem.querySelector('[data-category]')
  category.innerText = item.category

  const price = storeItem.querySelector('[data-price]')
  price.innerText = `${formatCurrency(item.priceCents / 100)}`

  const image = storeItem.querySelector('[data-image]')
  image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

  storeItemContainer.appendChild(storeItem)
}
