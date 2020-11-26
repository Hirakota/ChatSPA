    const ul = document.getElementById('ul');
    const li = ul.querySelectorAll('li');
    const inp = ul.querySelectorAll('input');

    const form = document.forms[0];
    const textAr = form.elements[0];

    const todo = JSON.parse(localStorage.getItem('key')) || [];
    /* todo.forEach(el => {addLi(el.name)}); */

    todo.forEach(el => addLiView(el.name, el.check));

    form.addEventListener('submit', (event) => {
        console.log('submit ', textAr.value);
        addLi(textAr.value, false);
        textAr.value = '';
        event.preventDefault();
    });

    /* for (let el of li) {
        liEvent(el)
    } */

    ul.addEventListener('click', (event) => { //* Делать так
        console.log('about: ', event.target);

        const input = event.target.closest('input');
        console.log(input);

        if(input) {
            onChecked(event);
            todo[todo.findIndex(el => el => event.target)].check = input.checked;
            localStorage.setItem('key', JSON.stringify(todo));
        }

        if(event.target.closest('li')) {
            console.log('Liiiiiiiiii');
        }
    });

    function liEvent(elem) {
        elem.addEventListener('click', stopProp);
        elem.querySelector('input').addEventListener('click', onChecked);
    }

    function onChecked(event) {
        console.log(event.target);
        event.stopPropagation();
    }

    function stopProp(event) {
        console.log('stop propagation');
        event.stopPropagation();
    }

    function addLiView(value, check) {
        const newLi = document.createElement('li');
        
        const newLabel = document.createElement('label');
        newLabel.innerText = value;
        const newInput = document.createElement('input');
        newInput.type = 'checkbox';
        newInput.checked = check;
        
        

        localStorage.setItem('key', JSON.stringify(todo));

        newLabel.appendChild(newInput);
        newLi.appendChild(newLabel);
        
        /* liEvent(newLi); */

        ul.appendChild(newLi);
    }

    function addLi(value, check) {
        todo.push({name: value, check: check || false});
        addLiView(value, check);
        console.log(todo);
    }

