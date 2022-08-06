function debounce(fn, ms) {
    let timer;
    return function(...args) {
        if(timer) clearTimeout(timer);
        timer = setTimeout( () => { fn.apply(this, args) }, ms);
    }
}

async function getUrl(text) {
    let responce = await fetch(`https://api.github.com/search/repositories?q=${text}`);
    if(!responce.ok) return null;
    let json = await responce.json();
    return json['items'].slice(0, 5);
}

function createDiv(name, owner, stars) {
    let div = document.createElement('div');
    div.classList = 'repositories__repository';

    let info = document.createElement('div');
    info.classList = 'repositories__info';

    let pName = document.createElement('p');
    pName.textContent = `Name: ${name}`;
    info.appendChild(pName);
    let pOwner = document.createElement('p');
    pOwner.textContent = `Owner: ${owner}`;
    info.appendChild(pOwner);
    let pStars = document.createElement('p');
    pStars.textContent = `Stars: ${stars}`;
    info.appendChild(pStars);

    let btn = document.createElement('button');
    btn.classList = 'repositories__btn';

    div.appendChild(info);
    div.appendChild(btn);

    div.addEventListener('click', e => {
        e.stopImmediatePropagation();
        if(e.target.className == 'repositories__btn' ) {
            e.currentTarget.remove();
        }
    });

    repositories.appendChild(div);
}


function createAutocom(json, autocom) {
    let fragment = document.createDocumentFragment();

    for(let obj of json) {
        let {name, owner: {login}, stargazers_count: stars} = obj;

        let li = document.createElement('li');
        li.textContent = name;
        li.classList = `search__item`
        fragment.appendChild(li);

        li.addEventListener('click', e => {
            createDiv(name, login, stars);
        });

    }
    autocom.appendChild(fragment);
    autocom.classList.add('search__autocom-active');

}


function clearAutocom(autocom) {
    autocom.classList.remove('search__autocom-active');
    autocom.innerHTML = '';
}


async function logic(text, autocom) {
    let json = await getUrl(text);
    if(json !== null ) {
        clearAutocom(autocom);
        createAutocom(json, autocom);
    }
}



const input = document.querySelector('.search__input');
const autocom = document.querySelector(".search__autocom");
const repositories = document.querySelector(".repositories");
/*const repository = repositories.getElementsByClassName('repositories__btn');
console.log(repository)*/

let fn = debounce( logic, 250 );


input.addEventListener('keyup', async (e)=> {
    let str =  e.target.value.trim();
    if(str.length > 0) {
        fn(str, autocom);
    } else {
        clearAutocom(autocom);
    }
});


window.addEventListener('click', e => {
    if( !e.target.closest('.search__autocom > *') ) clearAutocom(autocom);
});