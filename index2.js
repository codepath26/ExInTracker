let ids = [];
let amount = document.getElementById("price");
let product = document.getElementById("product");
let category = document.getElementById("Category");
let addProduct = document.getElementById("add-items");
let Electronics = document.getElementById("Electronics");
let Clothing = document.getElementById("Clothing");
let Beauty = document.getElementById("Beauty");
let Home = document.getElementById("Home");
let Sports = document.getElementById("Sports");
let Books = document.getElementById("Books");
let Toys = document.getElementById("Toys");
let items = document.getElementById("items");
addProduct.addEventListener("submit", addData);
items.addEventListener("click", modified);
window.addEventListener("DOMContentLoaded", getdataFromLocalStorage);
async function getdataFromLocalStorage() {
  try {
    let response = await axios.get("http://localhost:8000/productDetails");
    response.data.forEach((obj) => {
      ids.push(obj.id);
      DisplayData(obj);
    });
  } catch (err) {
    console.log(err);
  }
}

async function addData(e) {
  let item = document.createElement("li");
  item.classList.add("list-group-item");
  let obj = {
    amount: amount.value,
    product: product.value,
    category: category.value,
  };
  try {
    // console.log(obj)
    let response = await axios.post(
      "http://localhost:8000/productDetails",
      obj
    );

     DisplayData(response.data)
    // console.log(response.data)
    // ids.push(response.data.id)
    amount.value = "";
    product.value = "";
    category.value = "Movies";
  } catch (err) {
    console.log(err);
  }
}
async function modified(e)
 {
  e.preventDefault();

  if (e.target.classList.contains("delete")) 
  {
    let li = e.target.parentElement;
    let id = li.querySelector('#productId').value
    try
    {
       await axios.delete(`http://localhost:8000/productDetails/${id}`);
       li.remove();
      } catch (err) {
        console.log(err);
    }
  }
  
  if (e.target.classList.contains("edit")) {
    let li = e.target.parentElement;
    let id = li.querySelector('#productId').value
    try {
      let response = await axios.get(
        `http://localhost:8000/productDetails/${id}`
        );
        amount.value = response.data.amount;
        product.value = response.data.product;
        category.value = response.data.category;
        li.remove();
      await axios.delete(`http://localhost:8000/productDetails/${id}`);
    } catch (err) {
      console.log(err);
    }
  }
}
function DisplayData(obj) {
  // console.log(obj.category)
  switch (obj.category) {
    case "Electronics":
      console.log(obj.id);
      Electronics.innerHTML += `<li class="list-group-item mt-2">Amount :${obj.amount}, product :${obj.product}, Category :${obj.category}<button class="btn btn-success btn-sm mx-1 edit float-end">Edit</button><button class="btn btn-danger btn-sm float-end delete mx-1">Delete</button><input type="hidden" id="productId" name="productId" value="${obj.id}"></li>`;
      break;
    case "Clothing":
      console.log(obj.id);
      Clothing.innerHTML += `<li class="list-group-item mt-2">Amount :${obj.amount}, product :${obj.product}, Category :${obj.category}<button class="btn btn-success btn-sm mx-1 edit float-end">Edit</button><button class="btn btn-danger btn-sm float-end delete mx-1">Delete</button><input type="hidden" id="productId" name="productId" value="${obj.id}"></li>`;
      break;
    case "Beauty":
      console.log(obj.id);
      Beauty.innerHTML += `<li class="list-group-item mt-2">Amount :${obj.amount}, product :${obj.product}, Category :${obj.category}<button class="btn btn-success btn-sm mx-1 edit float-end">Edit</button><button class="btn btn-danger btn-sm float-end delete mx-1">Delete</button><input type="hidden" id="productId" name="productId" value="${obj.id}"></li>`;
      break;
    case "Home":
      console.log(obj.id);
      Home.innerHTML += `<li class="list-group-item mt-2">Amount :${obj.amount}, product :${obj.product}, Category :${obj.category}<button class="btn btn-success btn-sm mx-1 edit float-end">Edit</button><button class="btn btn-danger btn-sm float-end delete mx-1">Delete</button><input type="hidden" id="productId" name="productId" value="${obj.id}"></li>`;
      break;
    case "Sports":
      console.log(obj.id);
      Sports.innerHTML += `<li class="list-group-item mt-2">Amount :${obj.amount}, product :${obj.product}, Category :${obj.category}<button class="btn btn-success btn-sm mx-1 edit float-end">Edit</button><button class="btn btn-danger btn-sm float-end delete mx-1">Delete</button><input type="hidden" id="productId" name="productId" value="${obj.id}"></li>`;
      break;
    case "Books":
      console.log(obj.id);
      Books.innerHTML += `<li class="list-group-item mt-2">Amount :${obj.amount}, product :${obj.product}, Category :${obj.category}<button class="btn btn-success btn-sm mx-1 edit float-end">Edit</button><button class="btn btn-danger btn-sm float-end delete mx-1">Delete</button><input type="hidden" id="productId" name="productId" value="${obj.id}"></li>`;
      break;
    case "Toys":
      console.log(obj.id);
      Toys.innerHTML += `<li class="list-group-item mt-2">Amount :${obj.amount}, product :${obj.product}, Category :${obj.category}<button class="btn btn-success btn-sm mx-1 edit float-end">Edit</button><button class="btn btn-danger btn-sm float-end delete mx-1">Delete</button><input type="hidden" id="productId" name="productId" value="${obj.id}"></li>`;
      break;

    default:
      break;
  }
}
