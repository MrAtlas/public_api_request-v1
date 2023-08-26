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

function getModal(object){
    const dob = new Date(object.dob.date);
    const formattedDob = `${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}`;

    const modalUserHtml = modal(
        object.picture.large,
        object.name.first,
        object.name.last,
        object.email,
        object.location.city,
        object.phone,
        `${object.location.street.number} ${object.location.street.name}`,
        object.location.state,
        object.location.postcode,
        formattedDob
    );

    divPhotoGalleryContainer.insertAdjacentHTML('afterend', modalUserHtml);
}

function closeModal(){
    const closeModal = document.getElementById('modal-close-btn');
    closeModal.addEventListener('click', () => {
        document.querySelector('.modal-container').remove();
    });
}

let people = [];

getUsers().then(data => {
    people.push(...data.results);

    for(let i = 0; i < people.length; i++){
        const userCardHtml = generateCard(
            people[i].picture.medium,
            people[i].name.first,
            people[i].name.last,
            people[i].email,
            people[i].location.city,
            people[i].location.state
        )
        divPhotoGalleryContainer.insertAdjacentHTML('beforeend', userCardHtml);
    }

    const cards = divPhotoGalleryContainer.querySelectorAll('.card');

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const userData = people[index];

            getModal(userData);

            closeModal();

            const modalPrev = document.getElementById('modal-prev');
            const modalNext = document.getElementById('modal-next');

            let currentIndex = index;

            modalPrev.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + people.length) % people.length;
                closeModal();
                const prevUser = people[currentIndex];
                getModal(prevUser);
            });

            modalNext.addEventListener('click', () => {
                currentIndex = index + 1;
                closeModal();
                const nextUser = people[currentIndex];
                getModal(nextUser);
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
            const userCardHtml = generateCard(
                user.picture.medium,
                user.name.first,
                user.name.last,
                user.email,
                user.location.city,
                user.location.state
            )
            divPhotoGalleryContainer.insertAdjacentHTML('beforeend', userCardHtml);
        });
    });
})


//Custom CSS

