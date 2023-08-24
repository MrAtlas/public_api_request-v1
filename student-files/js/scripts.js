//MrAtlas

//As first thing I am going to select all the elements in the HTML file
const divSearchContainer = document.querySelector('.search-container');
const divPhotoGalleryContainer = document.getElementById('gallery');

//Random user url 'https://randomuser.me/api/'

//Method to get the api from random user 
function getRandomUser(url){
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log(error));
}

function checkStatus(response){
    if(response.ok === true){
      return Promise.resolve(response);
    }else{
      return Promise.reject(new Error(response.statusText));
    }
}

//getRandomUser('https://randomuser.me/api/').then(data => console.log(data.results[0]))
  
//Adding the search form to the page
const searchHtml = `
<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>
`;
divSearchContainer.insertAdjacentHTML('afterend', searchHtml)

//TODO:
// Add functionality to the search form and eventlisteners

//Display 12 random users

function generateCard(picture, firstName, lastName, email, city, state){
    const userCardHtml = `
    <div class="card">
    <div class="card-img-container">
        <img class="card-img" src=${picture} alt=profile picture>
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
        <p class="card-text">${email}</p>
        <p class="card-text cap">${city}, ${state}</p>
    </div>
    </div>
`;
    return userCardHtml;
}


let i = 0;

while (i < 12){
    getRandomUser('https://randomuser.me/api/')
        .then(data => {divPhotoGalleryContainer.insertAdjacentHTML('afterend', 
            generateCard(
                data.results[0].picture.medium,
                data.results[0].name.first,
                data.results[0].name.last,
                data.results[0].email,
                data.results[0].location.city,
                data.results[0].location.state
            ));
        });

    i = i + 1;
}