function debounce(fn, ms) {
    let timer;
    return function(...args) {
        if(timer) clearTimeout(timer);
        timer = setTimeout( () => { fn.apply(this, args) }, ms);
    }
}

async function getRepositories(text) {
    const responce = await fetch(`https://api.github.com/search/repositories?q=${text}`);
    if(!responce.ok) return null;
    const json = await responce.json();
    return json['items'].slice(0, 5);
}

function addRepository(name, owner, stars) {

    const div = document.createElement('div');
    div.innerHTML =  `<div class="repositories__repository">
                            <div class="repositories__info">
                                <p>Name: ${name}</p>
                                <p>Owner: ${owner}</p>
                                <p>Stars: ${stars}</p>
                            </div>
                            <button class="repositories__btn" type="button"></button>
                        </div>`;

    div.addEventListener('click', e => {
        e.stopImmediatePropagation();
        if(e.target.className == 'repositories__btn' ) {
            e.currentTarget.remove();
        }
    });

    repositories.append(div);
}


function createAutocompleteList(json, autocom) {
    const fragment = document.createDocumentFragment();

    for(let obj of json) {
        const {name, owner: {login}, stargazers_count: stars} = obj;

        const li = document.createElement('li');
        li.textContent = name;
        li.classList = `search__item`
        fragment.append(li);

        li.addEventListener('click', e => {
            addRepository(name, login, stars);
            input.value = '';
        });

    }
    autocom.append(fragment);
    autocom.classList.add('search__autocom-active');

}


function deleteAutocompleteList(autocom) {
    autocom.classList.remove('search__autocom-active');
    autocom.innerHTML = '';
}


async function starter(text, autocom) {
    const json = await getRepositories(text);
    if(json !== null ) {
        deleteAutocompleteList(autocom);
        createAutocompleteList(json, autocom);
    }
}


const input = document.querySelector('.search__input');
const autocom = document.querySelector(".search__autocom");
const repositories = document.querySelector(".repositories");

const delayedStarter = debounce( starter, 250 );


input.addEventListener('keyup', async (e)=> {
    const str =  e.target.value.trim();
    if(str.length > 0) {
        delayedStarter(str, autocom);
    } else {
        deleteAutocompleteList(autocom);
    }
});


window.addEventListener('click', e => {
    if( !e.target.closest('.search__autocom > *') ) deleteAutocompleteList(autocom);
});
