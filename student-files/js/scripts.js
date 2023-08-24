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

//getRandomUser('https://randomuser.me/api/').then(data => console.log(data.results))
  
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
for(let i = 0; i < 12; i++){
    
}