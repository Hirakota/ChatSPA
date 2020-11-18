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

function generateList(arr) {
    const frm = new DocumentFragment();
    const el = document.getElementById('list');

    frm.appendChild(generateNode(arr));
    el.appendChild(frm);
}

function generateNode(arr) {
    const frm = new DocumentFragment();

    const newUl = document.createElement('ul');
    for(let i = 0; i < arr.length; i++) {
        const newLi = document.createElement('li');
        newLi.innerText = arr[i].value;
        newUl.appendChild(newLi);

        if(!!arr[i].children) {
            const childNode = generateNode(arr[i].children);
            newUl.appendChild(childNode);
        }
    }

    return frm.appendChild(newUl);
}

generateList(list);