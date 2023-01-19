open();
/*/////////////////fill the select inputs function/////////////////*/
function open() {
  ///////////////fill the select input with the areas list//////////////
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    .then((response) => response.json())
    .then((data) => {
      let areas;
      
      data.meals.reverse().forEach((meal) => {
        if (meal.strArea == "Moroccan") {
          areas =
            "<option value='" +
            meal.strArea +
            "' selected>" +
            meal.strArea +
            "</option>";
        } else {
          areas =
            "<option value='" +
            meal.strArea +
            "'>" +
            meal.strArea +
            "</option>";
        }

        document
          .getElementById("areaSelection")
          .insertAdjacentHTML("afterbegin", areas);
      });
    });
          
  /////////////fill the select input with the categories list//////////////

  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`)
    .then((response) => response.json())
    .then((data) => {
      let category;
      data.meals.reverse().forEach((meal) => {
        if (meal.strCategory == "Lamb") {
          category =
            "<option value='" +
            meal.strCategory +
            "' selected>" +
            meal.strCategory +
            "</option>";
        } else {
          category =
            "<option value='" +
            meal.strCategory +
            "'>" +
            meal.strCategory +
            "</option>";
        }

        document
          .getElementById("categorySelection")
          .insertAdjacentHTML("afterbegin", category);
      });
    });
}

/*//////////////////////removing childs function/////////////////////*/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*/////////////////////Filtration function////////////////////////*/

async function filterMeals() {
  var categorySelection = document.getElementById("categorySelection");
  var areaSelection = document.getElementById("areaSelection");

  var selectedCategory =
    categorySelection.options[categorySelection.selectedIndex].value;
  var selectedArea = areaSelection.options[areaSelection.selectedIndex].value;
  removeAllChildNodes(gallery);
  if (selectedCategory === "" && selectedArea !== "") {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`
    )
      .then((response) => response.json())
      .then((areaf) => {
        removeAllChildNodes(gallery);
        renderPaginatedMeals(6, areaf.meals);
      });
  } else if (selectedCategory !== "" && selectedArea === "") {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
    )
      .then((response) => response.json())
      .then((cateF) => {
        removeAllChildNodes(gallery);
        renderPaginatedMeals(6, cateF.meals);
      });
  } else if (selectedCategory !== "" && selectedArea !== "") {
    const [a, b] = await Promise.all([
      fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`
      ),
      fetch(
        ` https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
      ),
    ]);

    const [areaF, cateF] = await Promise.all([a.json(), b.json()]);
    const areaFMeals = areaF.meals;
    const cateFMeals = cateF.meals;
    const mergedMeals = [];
    for (let i = 0; i < areaFMeals.length; i++) {
      for (let j = 0; j < cateFMeals.length; j++) {
        if (areaFMeals[i].idMeal == cateFMeals[j].idMeal) {
          mergedMeals.push(areaFMeals[i]);
        }
      }
    }

    removeAllChildNodes(gallery);
    renderPaginatedMeals(6, mergedMeals);
  }
}

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
////////////////////////////////Card/////////////////////
function renderPaginatedMeals(pageSize, dataSource) {
  $("#pagination-container").pagination({
    dataSource: dataSource,
    pageSize: pageSize,
    callback: function (data) {
      let html = "";

      for (let i = 0; i < data.length; i++) {
        html +=
        ` <div class="col">
        <div class="card">
          <img src="${data[i].strMealThumb}" class="card-img-top" alt="image">
          <div class="card-body">
          <h5 class="card-title">${data[i].strMeal}</h5>
            <button type="button" class="btn btn-success" onclick="showModal(${data[i].idMeal})"   data-bs-toggle="modal" data-bs-target="#exampleModal">Voir plus...</button>
          </div>
        </div>
      </div>`
      }
    
      if (html) {
        $("#gallery").html(html);
      }
    },
  });
}