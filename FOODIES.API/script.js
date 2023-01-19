
var  mealList = document.getElementById('gallery');

let dataList = [];
async function getData() {
  let card = "";

  for (let i = 0; i < 6; i++) {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();
    dataList = data.meals[0];
    console.log(dataList);
    card += ` <div class="col">
    <div class="card">
      <img src="${dataList.strMealThumb}" class="card-img-top" alt="image">
      <div class="card-body">
      <h5 class="card-title">${dataList.strMeal}</h5>
        <button type="button" class="btn btn-success" onclick="showModal(${dataList.idMeal})"  data-bs-toggle="modal" data-bs-target="#exampleModal">Voir plus...</button>
      </div>
    </div>
  </div>`;
    document.querySelector("#gallery").innerHTML = card;
  }
}
getData();
//////////////////////////////////Modal//////////////////////////////
async function showModal(id) {
  const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const data = await response.json();
    // dataList = data.meals[0];
    let show = document.querySelector("#Modal");
    show.innerHTML = 
    `<div>
    <h3>${data.meals[0].strMeal}</h3>
    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="image">
    <p>${data.meals[0].strCategory}</p>
    <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${data.meals[0].strInstructions}</p>
        </div>
    </div>
    <h5>Ingredients</h5>`;
    let i=1;
  do {
    show.innerHTML +=`<li>${data.meals[0]["strIngredient" + i]}  : ${data.meals[0]["strMeasure" + i]} </li>`;
    i++

  } while ( data.meals[0]["strIngredient" + i] !== null &&
  data.meals[0]["strIngredient" + i] !== "" &&
  data.meals[0]["strIngredient" + i] !== " ");
  show.innerHTML +=` <div class = "recipe-link">
  <a href = "${data.meals[0].strYoutube}" target = "_blank">Watch Video</a>
</div>`;
}

const pageSize = 6;
let curPage = 1;
    //================================= Search ==============================//
    // let resp;
    let resp = []; 
    let searchBtn = document.getElementById("search-btn");
    //event listeners
    searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let value = document.getElementById("search-input").value
    // console.log(value)
    // let table;

    async function getMealList() {
        let resMeal = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + value);
        let data = await resMeal.json();
        resp = data.meals;
        renderTable();
        document.querySelector('#nextButton').addEventListener('click', nextPage, false);
        document.querySelector('#previousButton').addEventListener('click', previousPage, false);
      }
    getMealList();
    })
    function renderTable() {
    // create html
    document.querySelector("#gallery").innerHTML = ""; 
    // let result = '';
    resp.filter((row, index) => {
        let start = (curPage-1)*pageSize;
        let end = curPage*pageSize;
        if(index >= start && index < end)
        return true;
    }).forEach(c => {
    document.querySelector("#gallery").innerHTML += `
    <div class="col">
            <div class="card">
            <img src="${c.strMealThumb}" class="card-img-top" alt="image">
            <div class="card-body">
            <h5 class="card-title">${c.strMeal}</h5>
            <button type="button" class="btn btn-success" onclick="showModal(${c.idMeal})"  data-bs-toggle="modal" data-bs-target="#exampleModal">Voir plus...</button>
            </div>
            </div>
                </div> `;
    });
    // table.innerHTML = result;
    $("search-input").value = '';
    }

    function previousPage() {
    if(curPage > 1) curPage--;
    renderTable();
    }

    function nextPage() {
    if((curPage * pageSize) < resp.length) curPage++;
    renderTable();
    }
