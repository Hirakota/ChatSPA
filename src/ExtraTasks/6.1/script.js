const list = [
    {
       value: 'Пункт 1.',
       children: null,
    },
    {
       value: 'Пункт 2.',
       children: [
          {
             value: 'Подпункт 2.1.',
             children: null,
          },
          {
             value: 'Подпункт 2.2.',
             children: [
                {
                   value: 'Подпункт 2.2.1.',
                   children: null,
                },
                {
                   value: 'Подпункт 2.2.2.',
                   children: null,
                }
             ],
          },
          {
             value: 'Подпункт 2.3.',
             children: null,
          }
       ]
    },
    {
       value: 'Пункт 3.',
       children: null,
    }
];

function createList(title, arr) {
    const frm = new DocumentFragment();
    const el = document.querySelector('body');

    const newH2 = document.createElement('h2');
    newH2.innerText = title;
    frm.appendChild(newH2);

    frm.appendChild(generateNode(arr));
    el.appendChild(frm);
}

function generateNode(arr, fs = 1) {
    const frm = new DocumentFragment();

    const newUl = document.createElement('ul');
    
    newUl.style.fontSize = fs >= 1 ? fs + 'rem' : fs + 'em';

    for(let i = 0; i < arr.length; i++) {
        const newLi = document.createElement('li');
        const span = document.createElement('span');
        span.innerText = arr[i].value;

        newLi.appendChild(span);
        newUl.appendChild(newLi);

        if(!!arr[i].children) {
            const childNode = generateNode(arr[i].children, 0.9);
            newLi.appendChild(childNode);
        }
    }

    return frm.appendChild(newUl);
}

createList('Hello world', list);

const mainUl = document.querySelector('ul');
mainUl.addEventListener('click', (event) => {
    const li = event.target.closest('li');
    const span = event.target.closest('span');

    if(span && li) {
        const ul = li.querySelector('ul');
        if(ul) {
            ul.classList.toggle('disp');
        }
    }

    event.preventDefault();
})