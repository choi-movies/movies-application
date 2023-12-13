const url = `http://localhost:3000/movies`;
const loadingElement = document.querySelector('.loading');
const buttonElement = document.querySelector('.add-btn');
const modalButtonElement = document.querySelector('.modal-btn');
loadingElement.style.display = 'block';
modalButtonElement.style.display = 'none';
const addMovie = async (movie) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        };
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
};
const updateMovie = async (movie) => {
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        };
        const response = await fetch(url+`/${movie.id}`, options);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
};
const deleteMovie = async (movie) => {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        };
        const response = await fetch(url+`/${movie.id}`, options);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
};

let selectedValue;
document.getElementById('ratingDropdown').addEventListener('click', function (event) {
    if (event.target.classList.contains('dropdown-item')) {
        selectedValue = Number(event.target.textContent);
    }
});
document.querySelector('.add-btn').addEventListener('click', async () => {
    let title = document.querySelector('#title').value;

    const movie = {
        title: title,
        rating: selectedValue,
    };

    if (title && selectedValue !== undefined) {
        const movie = {
            title: title,
            rating: selectedValue,
        };

        const newMovie = await addMovie(movie);
        const newCard = createCard(newMovie);
        console.log('New movie added:', newMovie);
        document.querySelector('.movies-card-container').appendChild(newCard);
    }
});
function createCard(movie) {
    const card = document.createElement('div');
    card.classList.add('card', 'm-2');
    const updateModalId = `updateModal-${movie.id}`;  // Assuming there's an ID property for each movie
    const titleInputId = `title-${movie.id}`;
    const dropdownInputId = `dropdown-${movie.id}`;
    const updateBtnId = `update-button-${movie.id}`;
    const deleteBtnId = `delete-button-${movie.id}`;

    card.innerHTML = `
        <div class="card-body" id="${movie.id}">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">Rating: ${movie.rating}</p>
            <div class="button-row">
                <button type="button" class="update-button btn btn-primary" data-bs-toggle="modal" data-bs-target="#${updateModalId}">Update</button>
                <button type="button" id=${deleteBtnId} class="delete-button btn btn-danger" >Delete</button>
                <div class="modal fade" id="${updateModalId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Movie</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="mb-3">
                                        <label for="${titleInputId}" class="form-label">Title</label>
                                        <input type="text" class="form-control" id="${titleInputId}" value="${movie.title}">
                                    </div>
                                    <div class="btn-group">
                                        <button id=${dropdownInputId} class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Rating
                                        </button>
                                        <ul class="dropdown-menu" id="ratingDropdown-${movie.id}" data-rating="${movie.rating}">
                                            <li><a class="dropdown-item" href="#" data-value="5">5</a></li>
                                            <li><a class="dropdown-item" href="#" data-value="4">4</a></li>
                                            <li><a class="dropdown-item" href="#" data-value="3">3</a></li>
                                            <li><a class="dropdown-item" href="#" data-value="2">2</a></li>
                                            <li><a class="dropdown-item" href="#" data-value="1">1</a></li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" id=${updateBtnId} class="update-btn btn btn-primary" data-bs-dismiss="modal">Update</button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    const deleteButton = card.querySelector(`#${deleteBtnId}`);
    deleteButton.addEventListener('click', async () => {
        const result = await deleteMovie(movie);
        card.remove();
    });
    return card;
}


fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const movieCardsContainer = document.querySelector('.movies-card-container');
        movieCardsContainer.innerHTML = '';

        data.forEach(item => {
            const newCard = createCard(item);
            document.querySelector('.movies-card-container').appendChild(newCard);
        })
        let dropdowns = document.getElementsByClassName('dropdown-menu');
        for (let dd of dropdowns) {
            dd.addEventListener('click', function (event) {
                if (event.target.classList.contains('dropdown-item')) {
                    selectedValue = Number(event.target.textContent);
                    dd.setAttribute('data-rating', selectedValue);
                    console.log(selectedValue);
                }
            });
        }
        let updateButtons = document.getElementsByClassName('update-btn');
        for (let ub of updateButtons) {
            ub.addEventListener('click', function(event) {
                let id = Number(ub.id.slice(-1));
                let titleId = 'title-' + id;
                let ratingId = 'ratingDropdown-' + id;
                let title = document.getElementById(titleId).value;
                let rating = document.getElementById(ratingId).getAttribute('data-rating');
                const movie = {
                    id: id,
                    title: title,
                    rating: rating
                }
                let card = document.getElementById(''+id);
                card.querySelector('.card-title').textContent = title;
                card.querySelector('.card-text').textContent = `Rating: ${rating}`;
                updateMovie(movie);
            });
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    })
    .finally(() => {
        loadingElement.style.display = 'none';
        modalButtonElement.style.display = 'block';
    });
