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
function generateCard(object){

    const userCardHtml = `
    <div class="card">
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
function modal(object){

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
}

function prevModal(prevUser){
    const currentModal = document.querySelector('.modal');

    const dob = new Date(prevUser.dob.date);
    const formattedDob = `${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}`;

    currentModal.innerHTML = `
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src=${prevUser.picture.large} alt="profile picture">
            <h3 id="name" class="modal-name cap">${prevUser.name.first} ${prevUser.name.last}</h3>
            <p class="modal-text">${prevUser.email}</p>
            <p class="modal-text cap">${prevUser.location.city}</p>
            <hr>
            <p class="modal-text">${prevUser.phone}</p>
            <p class="modal-text">${prevUser.location.street.number} ${prevUser.location.street.name}, ${prevUser.location.city}, ${prevUser.location.state}, ${prevUser.location.postcode}</p>
            <p class="modal-text">Birthday: ${formattedDob}</p>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `;
}

function nextModal(nextUser){
    const currentModal = document.querySelector('.modal');

    const dob = new Date(nextUser.dob.date);
    const formattedDob = `${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}`;

    currentModal.innerHTML = `
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src=${nextUser.picture.large} alt="profile picture">
            <h3 id="name" class="modal-name cap">${nextUser.name.first} ${nextUser.name.last}</h3>
            <p class="modal-text">${nextUser.email}</p>
            <p class="modal-text cap">${nextUser.location.city}</p>
            <hr>
            <p class="modal-text">${nextUser.phone}</p>
            <p class="modal-text">${nextUser.location.street.number} ${nextUser.location.street.name}, ${nextUser.location.city}, ${nextUser.location.state}, ${nextUser.location.postcode}</p>
            <p class="modal-text">Birthday: ${formattedDob}</p>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `;
}


function closeModal(){
    const closeModal = document.getElementById('modal-close-btn');
    closeModal.addEventListener('click', () => {
        document.querySelector('.modal-container').remove();
    });
}

let people = [];

getUsers().then(data => {
    //this will copy the data from the fetch into the people array
    people.push(...data.results);

    //this will generate a card for each user object in people array
    for(let i = 0; i < people.length; i++){
        generateCard(people[i])
    }

    //select all the cards generated
    const cards = divPhotoGalleryContainer.querySelectorAll('.card');

    //Add an event listener to each of the card and get their index
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const userData = people[index];

            //this will create a modal with the userData of index clicked,
            //basically when a card is clicked it will call modal with that object
            modal(userData);

            closeModal();

            /**
             * First selecting the next button and prev button
             */
            const modalPrev = document.getElementById('modal-prev');
            const modalNext = document.getElementById('modal-next');

            let currentIndex = index;

            modalPrev.addEventListener('click', () => {
                currentIndex = index - 1;
                const prevUser = people[currentIndex];
                prevModal(prevUser);
            });

            modalNext.addEventListener('click', () => {
                currentIndex = index + 1;
                const nextUser = people[currentIndex];
                nextModal(nextUser);
            });
        });
    });

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

        filteredUsers.forEach(user => {
            generateCard(user);
            //divPhotoGalleryContainer.insertAdjacentHTML('beforeend', userCardHtml);
        });
    });
})


//Custom CSS

