//MrAtlas

//As first thing I am going to select all the elements in the HTML file
const divSearchContainer = document.querySelector('.search-container');
const divPhotoGalleryContainer = document.getElementById('gallery');

//Random user url 'https://randomuser.me/api/?nat=us&results=12'
//looking at the documentation I was able to get multiple users of us nationality


async function getUsers() {
    try {
        const response = await fetch('https://randomuser.me/api/?nat=us&results=12');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

/*

let people = [];

getUsers().then(data => {
    people.push(...data.results);
})

*/

  
//Adding the search form to the page
const searchHtml = `
<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>
`;
divSearchContainer.insertAdjacentHTML('afterend', searchHtml)


//generateCard Will generate a card with the given parameters and then return that card
function generateCard(object, index){

    const userCardHtml = `
    <div class="card" data-index=${index}>
    <div class="card-img-container">
        <img class="card-img" src=${object.picture.medium} alt=profile picture>
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${object.name.first} ${object.name.last}</h3>
        <p class="card-text">${object.email}</p>
        <p class="card-text cap">${object.location.city}, ${object.location.state}</p>
    </div>
    </div>
`;
    divPhotoGalleryContainer.insertAdjacentHTML('beforeend', userCardHtml);
}

//For modal
//modal as the generateCard will create a modal (from index.html) with the parameters given 
function modal(object, index){

    const dob = new Date(object.dob.date);
    const formattedDob = `${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}`;
    
    const modalHtml = `
        <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src=${object.picture.large} alt="profile picture">
                <h3 id="name" class="modal-name cap">${object.name.first} ${object.name.last}</h3>
                <p class="modal-text">${object.email}</p>
                <p class="modal-text cap">${object.location.city}</p>
                <hr>
                <p class="modal-text">${object.phone}</p>
                <p class="modal-text">${object.location.street.number} ${object.location.street.name}, ${object.location.city}, ${object.location.state}, ${object.location.postcode}</p>
                <p class="modal-text">Birthday: ${formattedDob}</p>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;

    //divPhotoGalleryContainer.insertAdjacentElement('afterend', modalHtml);
    divPhotoGalleryContainer.insertAdjacentHTML('afterend', modalHtml);

    closeModal();

    const modalContainer = document.querySelector('.modal-container');
    modalContainer.addEventListener('click', e => {
      if (e.target.id === 'modal-next') {
        if (index !== people.length - 1) {
          index += 1;
          document.body.removeChild(modalContainer);
          modal(people[index], index);
        }
      }
      if (e.target.id === 'modal-prev') {
        if (index !== 0) {
          index -= 1;
          document.body.removeChild(modalContainer);
          modal(people[index], index);
        }
      }
    });
}

//updated this function to get the modal-close-btn and add an event listener
//then it checks if it exist and if it does and its clicked remove it
function closeModal() {
    const closeModalButton = document.getElementById('modal-close-btn');
    closeModalButton.addEventListener('click', () => {
        const modalContainer = document.querySelector('.modal-container');
        if (modalContainer) {
            modalContainer.remove();
        }
    });
}

/**
 * The search function will get the form and add a submit event listener which prevents default loading
 * Then it will get the input and set it to lower case 
 * then it will create a filteredUsers which will get each user and get the first and last name to lower case
 * and it returns a new array of users that contain the search item
 * it will clean the gallery container and generates a new card for the new array of users
 */
function searchUser(people){
    const searchForm = document.querySelector('form');
    const searchInput = document.getElementById('search-input');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchTerm = searchInput.value.toLowerCase();

        const filteredUsers = people.filter(user => {
            const fullName = `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`;
            return fullName.includes(searchTerm);
        });

        divPhotoGalleryContainer.innerHTML = '';

        filteredUsers.forEach((user, index) => {
            generateCard(user, index);
            //divPhotoGalleryContainer.insertAdjacentHTML('beforeend', userCardHtml);
        });

        card(filteredUsers);
    });
}

/**
 * this will create a card and adds an event listener for each card which will call the modal function
 */
function card(people){
    //select all the cards generated
    const cards = divPhotoGalleryContainer.querySelectorAll('.card');

    //Add an event listener to each of the card and get their index
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const userData = people[index];

            //this will create a modal with the userData of index clicked,
            //basically when a card is clicked it will call modal with that object
            modal(userData, index);

            closeModal();
        });
    });
}

/**
 * Create a new empty array
 * then using the getUsers api function will push the users in to the array
 * loops through the array and calls generateCard for each user object
 * then it calls the card and search method
 */
let people = [];

getUsers().then(data => {
    //this will copy the data from the fetch into the people array
    people.push(...data.results);

    //this will generate a card for each user object in people array
    for(let i = 0; i < people.length; i++){
        generateCard(people[i], i)
    }
    card(people);
    searchUser(people);
})


//Custom CSS

//select all the cards generated
/*
*I added a setTimeout to give time to the document to generate all the cards
* then select them and add a style class that will transform the card to grow when the mouse hover 
* credits:
* https://travis.media/how-to-make-an-item-grow-on-hover-with-css/
* https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event
*/


setTimeout(() => {
    const cards = divPhotoGalleryContainer.querySelectorAll('.card');

    const cssGrow = 'transform: scale(1.1);';

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style = cssGrow;
        });

        card.addEventListener('mouseleave', () => {
            card.style = '';
        });
    });

}, 1500)

