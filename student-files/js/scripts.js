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

//checkStatus will check if the Promise has been resolved
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

//generateCard Will generate a card with the given parameters and then return that card
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

//The while loop will use the api call and generate 12 card ( as soon as i varible gets from 0 to 11 = so 12)
//the will append to the array people each call
//then will append each card to the gallery
let i = 0;
let people = [];

while (i < 12){
    getRandomUser('https://randomuser.me/api/?nat=us')
    .then(data => {
        people.push(data.results[0]);
        const userCardHtml = generateCard(
            data.results[0].picture.medium,
            data.results[0].name.first,
            data.results[0].name.last,
            data.results[0].email,
            data.results[0].location.city,
            data.results[0].location.state
        );

      divPhotoGalleryContainer.insertAdjacentHTML('beforeend', userCardHtml);
            
    });

  i = i + 1;
}

//For modal
//modal as the generateCard will create a modal (from index.html) with the parameters given 
function modal(picture, firstName, lastName, email, city, phone, street, state, postal, dob){
    const modalHtml = `
        <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src=${picture} alt="profile picture">
                <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${street}, ${city}, ${state}, ${postal}</p>
                <p class="modal-text">Birthday: ${dob}</p>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    //divPhotoGalleryContainer.insertAdjacentElement('afterend', modalHtml);
    return modalHtml;
}

//I decided to use setTimeout to give 2 seconds of time for the script to generate the cards then i can select them
//I then used a forEach loop to get the card and the index adding to each card an event listener
//then calling the modal if the card is clicked using thepeople array and the index
//also added a close button event listener to remove the modal from the document
//added the prev and next element giving them an event listener
setTimeout(() => {
    const cards = divPhotoGalleryContainer.querySelectorAll('.card');

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const userData = people[index];

            const modalCardHtml = modal(
                userData.picture.large,
                userData.name.first,
                userData.name.last,
                userData.email,
                userData.location.city,
                userData.phone,
                `${userData.location.street.number} ${userData.location.street.name}`,
                userData.location.state,
                userData.location.postcode,
                userData.dob.date
            );

            divPhotoGalleryContainer.insertAdjacentHTML('afterend', modalCardHtml);
            const closeModal = document.getElementById('modal-close-btn');
            closeModal.addEventListener('click', () => {
                document.querySelector('.modal-container').remove();
            });

            const modalPrev = document.getElementById('modal-prev');
            modalPrev.addEventListener('click', () => {
                //
            });
            
            const modalNext = document.getElementById('modal-next');
            modalNext.addEventListener('click', () => {
                //
            });

        });
    });
}, 2000);


//Search Input
//got the search form that i previously added and gave it an event listener for submit
//set the value of the input to lower case
//then filtering the people array for person that includes the first name and/or lastName
//cleaned the document of all cardsand generated a new card of the people filtered

const searchForm = document.querySelector('form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredPeople = people.filter(person => {
        const fullName = `${person.name.first.toLowerCase()} ${person.name.last.toLowerCase()}`;
        return fullName.includes(searchTerm);
    });
    
    divPhotoGalleryContainer.innerHTML = '';
    
    filteredPeople.forEach(person => {
        const userCardHtml = generateCard(
            person.picture.medium,
            person.name.first,
            person.name.last,
            person.email,
            person.location.city,
            person.location.state
        );
        divPhotoGalleryContainer.insertAdjacentHTML('beforeend', userCardHtml);
    });
});
