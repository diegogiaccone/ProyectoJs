//variables globales
const lista = document.querySelector("#productos");
const tbody = document.querySelector(".tbody")
let carrito = []

const asincronismo = async () => {
  const res = await fetch("json/data.json")
  const data = await res.json();
  data.forEach((producto) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="col d-flex justify-content-center mb-4">
            <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem">
              <h5 class="card-title pt-2 text-center text-primary">${producto.nombre}</h5>
              <img
                src="${producto.img}"
                class="card-img-top"
                alt="..."
              />
              <div class="card-body">
                <p class="card-text text-white-50 description">
                  Edición limitada no te lo podes perder. Esta increible oferta
                  expira el 30 de marzo del 2023.
                </p>
                <h5 class="text-primary">
                  Precio: <span class="precio">$ ${producto.precio}</span>
                </h5>
                <div class="d-grid gap-2">
                  <button class="btn btn-primary button" id="${producto.id}">
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
    `
    lista.append(div);
  })

  const clickbtn = document.querySelectorAll(".button")
  clickbtn.forEach(btn =>{
      btn.addEventListener("click", addToCarritoItem)  
  })

}

asincronismo();


//agregar productos al carrito
function addToCarritoItem(e){
    const button = e.target    
    const item = button.closest(".card")    
    const itemTitle = item.querySelector(".card-title").textContent;    
    const itemPrice = item.querySelector(".precio").textContent;   
    const itemImg = item.querySelector(".card-img-top").src;    
    console.log(itemImg);
    const newItem = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1
    }   
    addItemCarrito(newItem)  
}

function addItemCarrito(newItem){

  modal(newItem.img)

    const InputElemento = tbody.getElementsByClassName("input__elemento")
    for(let i =0; i < carrito.length ; i++){
        if(carrito[i].title.trim() === newItem.title.trim()){
            carrito[i].cantidad ++;
            const inputValue = InputElemento[i]
            inputValue.value++; 
            CarritoTotal()           
            return null;
        }
    }

    carrito.push(newItem)
    renderCarrito()
   
  }
 
function renderCarrito(){
    tbody.innerHTML = ""
    carrito.map(item => {
        const tr = document.createElement ("tr")
        tr.classList.add("ItemCarrito")
        const Content = `
        
        <th scope="row">1</th>
        <td class="table__productos">
          <img src=${item.img} alt="">
          <h6 class="title">${item.title}</h6>
        </td>
        <td class="table__precio"><p>${item.precio}</p></td>
        <td class="table__cantidad">
          <input type="number" min="1" value=${item.cantidad} class="input__elemento">
          <button class="btn btn-danger delete">X</button>
        </td>
        
        `
        tr.innerHTML = Content;
        tbody.append(tr);

        tr.querySelector(".delete").addEventListener("click", removeItemCarrito)
        tr.querySelector(".input__elemento").addEventListener("change", sumaCantidad)

    })
    
    CarritoTotal()
}
// suma los productos del carrito y nos da el total
function CarritoTotal(){
    let Total = 0;
    const itemCartTotal = document.querySelector(".itemCartTotal")
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("$", ""))
        Total = Total + precio*item.cantidad
    })

    itemCartTotal.innerHTML = `Total $ ${Total}`
    addLocalStorage()
}
//remover productos del carrito
function removeItemCarrito(e){
    const buttonDelete = e.target
    const tr = buttonDelete.closest(".ItemCarrito")
    const title = tr.querySelector(".title").textContent;
    for(let i=0; i < carrito.length ; i++){
        if(carrito[i].title.trim() === title.trim()){
            carrito.splice(i, 1)
        }
    }
    //alert de eliminar producto
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Estas seguro?',
        text: "Se eliminará el Producto del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Borrar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Tu producto ha sido removido del carrito.',
            'success'
            )

            tr.remove()
            CarritoTotal()

        } else if (

          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Tu Producto sigue en el carrito',
            'error'            
          )
        }
      })

    }

//suma la cantidad de un mismo producto para que no se repita en el carrito 
function sumaCantidad(e){
    const sumaInput = e.target
    const tr = sumaInput.closest(".ItemCarrito")
    const title = tr.querySelector(".title").textContent;
    carrito.forEach(item => {
        if (item.title.trim() === title){
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            CarritoTotal()
        }
    })
}
//localstorage
function addLocalStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

window.onload = function(){
    const storage = JSON.parse(localStorage.getItem("carrito"));
    if(storage){
        carrito = storage;
        renderCarrito()
    }
}
//alert de agregar productos
function modal (imgurl){  
  Swal.fire({
    title: 'Se agregó tu Producto al carrito',
    text: 'Muchas Gracias!.',
    imageUrl: imgurl,
    imageWidth: 500,
    imageHeight: 500,
    imageAlt: 'Custom image',
})
}
 //alert boton de comprar 
const comprarCarrito = document.getElementById("btncomprar")

comprarCarrito.addEventListener("click", function(){
  Swal.fire({
    title: 'Muchas Gracias por su Compra',
    width: 600,
    padding: '3em',
    color: '#716add',
    background: `#fff`,
    backdrop: `
      rgba(0,0,123,0.4)
    `
  })
})