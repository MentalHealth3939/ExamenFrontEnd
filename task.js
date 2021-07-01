//----Get JSON data---//

let jsondata = "";
let apiUrl = "https://eshop-deve.herokuapp.com/api/v2/orders"
let apiToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYyMDY2Mjk4NjIwM30.lhfzSXW9_TC67SdDKyDbMOYiYsKuSk6bG6XDE1wz2OL4Tq0Og9NbLMhb0LUtmrgzfWiTrqAFfnPldd8QzWvgVQ'

async function getJson(url) {
    let response = await fetch(url,{method:'GET',
    headers: {
        'Authorization': apiToken},
    });
    let data = await response.json()
    return data;
}

//----Process----//

let currentID = 'init'
let currentORderNumber = 'init'

async function main() {
    jsondata = await getJson(apiUrl)
    getOrders(jsondata)
}

main();

getOrders = (orders) => {

let orderUl = document.createElement('ul')
orderUl.classList.add('order-list')

for (const indvOrder of orders.orders) {
  addOrderList(indvOrder, orderUl);
 }

const orderListContainer = document.querySelector('.order-list-container')
orderListContainer.append(orderUl)

addEventsToOrders()
}

addOrderList = (indvOrder, orderUl) => {
    let indvOrderItem = `<li class="order-list-item"><div class="id" data-order-id="${indvOrder.id}" >${indvOrder.number}</div></li>`
    orderUl.insertAdjacentHTML('beforeend',indvOrderItem)
}

addEventsToOrders = () => {
    const orderListItems = document.querySelectorAll('.order-list-item')
    const addButton = document.querySelector('.add-button-area')
    const purchaseButton = document.querySelector('.purchase-button-area')
    const returnButton = document.querySelector('.return-button-area')
    const screenLayer = document.querySelector('.screenlayer')

    for (const indvOrder of orderListItems) {
        indvOrder.firstChild.addEventListener('click', (e) => selectOrder(e.currentTarget))
    }
    
    addButton.firstChild.addEventListener('click', () => addNewItem() )
    purchaseButton.firstChild.addEventListener('click', () => purchaseNotice() )
    screenLayer.addEventListener('click', () => purchaseNotice() )
}

//---PURCHASE NOTICE---//

purchaseNotice = () => {

    if(currentID != 'init'){

        const screenLayer = document.querySelector('.screenlayer')
        const noticeCard = document.querySelector('.notice-card')
    
        const ordernumberNotice = document.querySelector('.order-ban')
        const totalNumberNotice = document.querySelector('.total-ban')
    
        document.querySelector('.order-ban').firstElementChild.innerHTML = currentORderNumber
        document.querySelector('.total-ban').firstElementChild.innerHTML = document.querySelector('.qty-total').firstElementChild.innerHTML
    
        noticeCard.classList.toggle('active')
        screenLayer.classList.toggle('active')
    }
}

//---ADD NEW ITEM---//

addNewItem = () => {

    if (currentID != 'init') {
        const inputElements = document.querySelectorAll('input')

        let newName = inputElements[0].value
        let newQty = inputElements[1].value
        let newSku = inputElements[2].value
        let newPrice = inputElements[3].value

        let addItem = true;

        inputElements.forEach(InEl => {
            if (InEl.value == '') {
                InEl.classList.add("empty");
                addItem = false;
            }
        }
    )

    console.log(parseInt(inputElements[1].value))

    if(Number.isInteger(parseInt(inputElements[1].value)) && parseInt(inputElements[1].value) != 0){
        newQty = parseInt(inputElements[1].value)
    }else{
        inputElements[1].value = 1
        addItem = false;
    }

    if(Number.isInteger(parseInt(inputElements[3].value)) && parseInt(inputElements[3].value) != 0){
        newPrice = parseInt(inputElements[3].value)
    }else{
        inputElements[3].value = 100
        addItem = false;
    }

    if(addItem == true){

        inputElements.forEach(InEl => {
                InEl.classList.remove("empty");
            }
        )

        for(const indvOrder of jsondata.orders){
            if(currentID == indvOrder.id){
                indvOrder.items.push({"name":newName,"sku":newSku, "quantity":newQty, "price":newPrice })
            }
        }
    }

    retrieveOrderInfo(currentID)
}
}

//---RETRIEVE INFORMATION---// 

selectOrder = (currentOrder) => {
    const orderListItems = document.querySelectorAll('.order-list-item')
    orderListItems.forEach(indvOrder => indvOrder.firstElementChild.classList.remove('active'))
    currentOrder.classList.add('active')
    retrieveOrderInfo(currentOrder.dataset.orderId)
    const setOrderNumer = document.querySelector('.current-order-number').innerHTML = currentORderNumber;
}

retrieveOrderInfo = (id) => {
    const orderActualContent = document.querySelector('.order-actual-content')
    deletePreviousItems(orderActualContent)
    currentID = id
    
    for(const indvOrder of jsondata.orders){
        if(currentID == indvOrder.id){
            currentORderNumber = indvOrder.number;
            for(const indvItem of indvOrder.items){
                addItemInfo(indvItem.name, indvItem.sku, indvItem.quantity, indvItem.price, orderActualContent)
            }
        }
    }

    getOrderTotal()
}

addItemInfo = (name, sku, quantity, price, itemContainer) => {

    let indvOrderItem = `
    <div class="order-row item-row">
        <div class="order-item item-detail">
            <div class="item-name">Nombre: <span>${name}</span></div>
            <div class="item-sku">SKU: <span>${sku}</span></div>
        </div>
        <div class="order-item item-price">$ <span>${price}</span></div>
        <div class="order-item item-qty">${quantity}</div>
    </div>
    `
    itemContainer.insertAdjacentHTML('beforeend',indvOrderItem)
}

deletePreviousItems = (orderActualContent) => {
    orderActualContent.innerHTML = ''
}

getOrderTotal = () => {
    const qtyTotal = document.querySelector('.qty-total')
    const itemRows = document.querySelectorAll('.item-row')

    let finalTotal = 0;

    for (let detail of itemRows){
        let itemPrice = detail.querySelector('.item-price').firstElementChild.innerHTML
        let itemQty = detail.querySelector('.item-qty').innerHTML

        itemFinalPrice = itemPrice * itemQty

        finalTotal += itemFinalPrice
    }

    qtyTotal.firstElementChild.innerHTML = finalTotal
}


