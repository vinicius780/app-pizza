let cart = [];
let modalQt = 1;
let modalKey = 0;
// listagem das pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = document.querySelector(".models .pizza-item").cloneNode(true);

  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = ` R$ ${item.price.toFixed(2)}`; //tofixed fixa 2 depoi da virgula
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalQt = 1;
    modalKey = key;
    myQuerySelector(".pizzaBig img").src = item.img;
    myQuerySelector(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    myQuerySelector(".pizzaInfo--desc ").innerHTML = pizzaJson[key].description;
    myQuerySelector(
      ".pizzaInfo--actualPrice"
    ).innerHTML = `R$ ${item.price.toFixed(2)}`;
    myQuerySelector(".pizzaInfo--size.selected").classList.remove("selected");
    document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    myQuerySelector(".pizzaInfo--qt").innerHTML = modalQt;

    myQuerySelector(".pizzaWindowArea").style.opacity = 0;
    myQuerySelector(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      document.querySelector(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  myQuerySelector(".pizza-area").append(pizzaItem);
});

//events do modal
function closeModal() {
  myQuerySelector(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    myQuerySelector(".pizzaWindowArea").style.display = "none";
  }, 500);
}
document
  .querySelectorAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton")
  .forEach((item) => {
    item.addEventListener("click", closeModal);
  });

function myQuerySelector(selector) {
  // função para substitui o document.queryselector
  return document.querySelector(selector);
}

// aumentar a quantidade de pizza
myQuerySelector(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  myQuerySelector(".pizzaInfo--qt").innerHTML = modalQt;
});

//diminuir quantidade pizza
myQuerySelector(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    myQuerySelector(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

// selecionar se a pizza é grande, media ou pequena
document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    myQuerySelector(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

myQuerySelector(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(
    myQuerySelector(".pizzaInfo--size.selected").getAttribute("data-key")
  );
  let indentifier = pizzaJson[modalKey].id + "@" + size;
  let key = cart.findIndex((item) => item.indentifier == indentifier); // o findIndex vai percorrer todos item do carrinho e depois fazer
  // uma verficação se o item estiver no carrinho ele acrescenta mais um se não ele da um push
  if (key > -1) {
    cart[key].qt += modalQt;
    // key seria a pizza por exemplo a pizza media ela irá aumentar,
    // ex vc ja adicionou 2 media no carrinho e adicionar mais uma do mesmo sabor ela irá aumentar +1  de forma certa
  } else {
    cart.push({
      indentifier,
      id: pizzaJson[modalKey].id,
      size,
      name: pizzaJson[modalKey].name,
      qt: modalQt
    });
  }
  
  updateCart();
  closeModal();
});

myQuerySelector('.menu-openner').addEventListener("click",() => {
  if(cart.length > 0) {
     myQuerySelector('aside').style.left = '0' 
     // para aparecer o carrinho de compra, ele só aparece se tiver alguma pizza nele
     // left 0 para aparecer pois ele está todo para direita com left = 100vw
  }
})

myQuerySelector('.menu-closer').addEventListener("click", () => {
  myQuerySelector('aside').style.left = "100vw"
})

function updateCart() {
  myQuerySelector('.menu-openner span').innerHTML = cart.length;
  console.log('Conteúdo do carrinho:', cart); // Verifique o conteúdo do carrinho

  if (cart.length > 0) {
      myQuerySelector("aside").classList.add("show");
      document.querySelector(".cart").innerHTML = ""; // Limpa o carrinho

      let subtotal = 0;
      let desconto = 0;
      let total = 0;

      for (let i in cart) {
        let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

        subtotal += pizzaItem.price * cart[i].qt;

        let cartItem = myQuerySelector('.models .cart--item').cloneNode(true);
        let pizzaSizeName;
        switch (cart[i].size) {

            case 0:
                pizzaSizeName = 'P';
                break;
            case 1:
                pizzaSizeName = 'M';
                break;
            case 2:
                pizzaSizeName = 'G';
                break;
        };

          let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

          // Preenche o item do carrinho
          cartItem.querySelector('img').src = pizzaItem.img;
          cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; 
          cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
          cartItem.querySelector('.cart--item-qtmenos').addEventListener("click", ()=>{
            if(cart[i].qt > 1) {
              cart[i].qt--
            } else {
              cart.splice(i, 1)
            }
            updateCart()
             // chamando a função aqui ajuda atualizar os preço pq se eu só colocar
            // a verificação ele n atualiza na tela.
          })
          cartItem.querySelector('.cart--item-qtmais').addEventListener("click", ()=> {
            cart[i].qt++ // aqui estou adicionando uma pizza a mais na pizza especifica que eu quero
            updateCart() // mesma coisa aqui, tenho que chamar a função para aparecer na tela
          })


          // Adiciona o item do carrinho à exibição
          myQuerySelector('.cart').append(cartItem);
      }
      desconto = subtotal * 0.1;
      total = subtotal - desconto
      // last child para pegar o ultimo item no caso o ultimo span
      myQuerySelector('.subtotal span:last-child').innerHTML = `${subtotal.toFixed(2)}`
       myQuerySelector('.desconto span:last-child').innerHTML = `${desconto.toFixed(2)}`
        myQuerySelector('.total span:last-child').innerHTML = `${total.toFixed(2)}`
  } else {
      myQuerySelector('aside').classList.remove("show"); // Oculta o carrinho se estiver vazio
      myQuerySelector('aside').style.left = "100vw" 
      // fecha no mobile quando reduz as pizza a 0 no carrinho e n consegue abrir mais igual no pc
  }
}