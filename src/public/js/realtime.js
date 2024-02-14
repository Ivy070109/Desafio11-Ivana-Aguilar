const socketClient = io()

socketClient.on('enviarproducts', (products) => {
    updateproducts(products)
})

function updateproducts(products) {
    let contenedor = document.getElementById('list-products')
    let productos = ""

    products.forEach((product) => {
        productos += `
        <article class="container">
          <div class="card">
            <div class="imgBx">
              <img src="${product.thumbnail}" height="310" width="200"/>
            </div>
            <div class="contentBx">
              <h2>${product.title}</h2>
              <p>$${product.price}</p>  
              <button class="buy" href="#">Comprar</button>
            </div>
          </div>
        </article>
        `
    })
    contenedor.innerHTML = productos
}

let form = document.getElementById("formProduct")
form.addEventListener("submit", (evt) => {
  evt.preventDefault()

  let title = form.elements.title.value
  let description = form.elements.description.value
  let stock = form.elements.stock.value
  let thumbnail = form.elements.thumbnail.value
  let category = form.elements.category.value
  let price = form.elements.price.value
  let code = form.elements.code.value

  socketClient.emit("addProduct", {
    title,
    description,
    stock,
    thumbnail,
    category,
    price,
    code,
  })

  form.reset()
})

// document.getElementById("delete-btn").addEventListener("click", function () {
//     const deleteidinput = document.getElementById("id-prod")
//     const deleteid = parseInt(deleteidinput.value)
//     socketClient.emit("deleteProduct", deleteid)
//     deleteidinput.value = ""
// })
//borro el event porque ya no utilizo el botón de borrar

socketClient.on("productsupdated", (obj) => {
  updateproducts(obj)
})