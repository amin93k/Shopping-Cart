const listItems = [
    {id: 1, name: "luxury watch", price: 300, img: "img/1.png"},
    {id: 2, name: "luxury watch", price: 700, img: "img/2.png"},
    {id: 3, name: "luxury watch", price: 400, img: "img/3.png"},
    {id: 4, name: "luxury watch", price: 150, img: "img/4.png"},
    {id: 5, name: "luxury watch", price: 280, img: "img/5.png"},
    {id: 6, name: "luxury watch", price: 430, img: "img/6.png"},
    {id: 7, name: "luxury watch", price: 80, img: "img/7.png"},
    {id: 8, name: "luxury watch", price: 240, img: "img/8.png"},
    {id: 9, name: "luxury watch", price: 560, img: "img/9.png"},
    {id: 10, name: "luxury watch", price: 300, img: "img/10.png"},
    {id: 11, name: "luxury watch", price: 120, img: "img/11.png"},
    {id: 12, name: "luxury watch", price: 1200, img: "img/12.png"},
]

let currentPage = 1
const amountItemPerPage = 8
const docElm = document.documentElement
const mainElm = document.getElementById("main")
const addCartIconCount = document.querySelector(".cart-number")
const addCartIcon = document.querySelector(".cart-icon")
const cartTab = document.querySelector(".cart-tab")
let cart = []

// pagination with scroll
function scrollPagination(){
    const pageNumber = Math.ceil(listItems.length / amountItemPerPage)
    // when scroll at the end appear new item
    if (Math.ceil(docElm.scrollTop) + docElm.clientHeight > docElm.scrollHeight - 5) {
        if (currentPage < pageNumber){
            currentPage ++
            displayItems()
        }
    }
}

function displayItems (){

    let temporaryList = listItems.slice((currentPage -1) * amountItemPerPage , currentPage * amountItemPerPage)
    temporaryList.forEach((product) =>{
        const newDiv = document.createElement("div")
        newDiv.className = "item"
        newDiv.innerHTML =
            `<img src="${product.img}" alt="wrist watch">
             <h2>wrist watch</h2>
             <p class="item-name">${product.name}</p>
             <div class="price">$ ${product.price}</div>
             <button 
                 class="addCart" 
                 data-id='${product.id}'>
                     Add To Cart
             </button>`
        mainElm.append(newDiv)
    })
}

function clickAddCartBtn(event){
    // Add a unit to the purchase Icon counter
    addCartIconCount.textContent ++
    // Check the item already exists in the cart
    const existingItem = cart.find(item => item.id === event.target.dataset.id)

    if (existingItem) {
        existingItem.count ++
    } else {
        cart.push({ id: event.target.dataset.id, count: 1 })
    }
    setItemToCart(event.target.dataset.id)
}

// display chooses item according item id in cart tab
function setItemToCart(id){
    const itemFromCart = cart.find(item => item.id === id)
    let count = itemFromCart.count

    let itemFromList = listItems.find(item => item.id === +id)

    // if item already exist in cart tab
    if (count > 1){
        const cartItem = document.querySelectorAll(".cart-item")
        cartItem.forEach(item => {
            if (item.dataset.id === id){
                item.children[2].innerHTML = '<div class="totalPrice">$ ' + itemFromList.price * count + '</div>';
                item.children[3].innerHTML = `
                <div class="quantity">
                    <span class="minus" data-id="${itemFromList.id}">-</span>
                    <span>${count}</span>
                    <span class="plus" data-id="${itemFromList.id}">+</span>
                </div>
                `;
            }
        })
    }else {
        // create a new item in the cart tab
        const newElm = document.createElement("div")
        newElm.className = "cart-item"
        newElm.dataset.id = id

        document.querySelector(".list-cart").append(newElm)

        newElm.innerHTML =`
                        <img src="${itemFromList.img}" alt="${itemFromList.name}">
                        <div class="name">
                        ${itemFromList.name}
                        </div>
                        <div class="totalPrice">$ ${itemFromList.price}</div>
                        <div class="quantity">
                            <span class="minus" data-id="${itemFromList.id}">-</span>
                            <span>${count}</span>
                            <span class="plus" data-id="${itemFromList.id}">+</span>
                        </div>
                    
                        `;
    }

    // add the item price to the total price
    calculateTotalPrice("plus", itemFromList.price)
}

// adding or reducing the item number with plus or minus sign in cart tab
function minusAndPlusItemCountBtn (elm){
    const cartElm = document.querySelectorAll(".cart-item")
    let priceElm
    let parentElm
    cartElm.forEach(item => {
        if (item.dataset.id === elm.dataset.id){
            priceElm = item.children[2] // item price
            parentElm = item
        }
    })
    let itemInList = listItems.find(item => item.id == elm.dataset.id)
    let cost = itemInList.price
    let multi
    let itemIndex

    cart.some((item, index) =>{
        if (item.id === elm.dataset.id){
            itemIndex = index
        }
    })

    if (elm.innerHTML === "+"){
        // Add a unit to the count of item in cart tab
        elm.previousElementSibling.innerHTML ++
        cart[itemIndex].count ++
        multi = cost * cart[itemIndex].count
        priceElm.innerHTML =  "$ " + multi
        addCartIconCount.textContent ++
        calculateTotalPrice("plus", cost)
    }
    else if (elm.innerHTML === "-"){
        // subtract a unit to the count of item in cart tab
        elm.nextElementSibling.innerHTML --
        cart[itemIndex].count --
        multi = cost * cart[itemIndex].count
        priceElm.innerHTML =  "$ " + multi
        addCartIconCount.textContent --
        if (cart[itemIndex].count === 0){
            parentElm.remove()
        }
        calculateTotalPrice("minus", cost)
    }
}

function calculateTotalPrice (status, price){
    const totalElm = document.querySelector(".total-price")
    let total = +totalElm.innerHTML.split(" ")[1]
    if (status === "plus"){
        total += price
        totalElm.innerHTML = "$ " + total
    }
    else if (status === "minus"){
        total -= price
        totalElm.innerHTML = "$ " + total
    }
}

function showListCartTab(){
    cartTab.classList.add("show-tab")
    document.querySelector("body").classList.add("show-cart-list")
}

// set event on the document element
function  setEventOnElm (event){
    const closeBtn = document.querySelector(".cart-btn span")
    const targetElm = event.target

    // if when the cart tab is open click outside the enclosure close cart tab
    if (!cartTab.contains(targetElm) && cartTab.classList.contains("show-tab") && !addCartIcon.contains(targetElm) && !targetElm.classList.contains("addCart") || closeBtn.contains(targetElm)){
        cartTab.classList.remove("show-tab")
        document.querySelector("body").classList.remove("show-cart-list")
    }
    // handel minus and plus button
    if (targetElm.classList.contains("minus")){
        minusAndPlusItemCountBtn (targetElm)
        return
    }
    if (targetElm.classList.contains("plus")){
        minusAndPlusItemCountBtn (targetElm)
        return
    }
    // set event on add cart button
    if (targetElm.classList.contains("addCart")){
        clickAddCartBtn (event)
        return
    }
}

displayItems()

document.addEventListener("DOMContentLoaded", () =>{
    document.addEventListener('scroll', scrollPagination)
    addCartIcon.addEventListener("click", showListCartTab)
    document.addEventListener("click", setEventOnElm)
})

// when user leave web page
window.addEventListener("beforeunload", () =>{
    document.removeEventListener('scroll', scrollPagination)
    addCartIcon.removeEventListener("click", showListCartTab)
    document.removeEventListener("click", setEventOnElm)
})

