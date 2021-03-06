Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function createCalendar(elem, y, m) {
    let daysName = [{"name": "Mon", "value": 0},
                    {"name": "Tue", "value": 1}, 
                    {"name": "Wed", "value": 2}, 
                    {"name": "Thu", "value": 3}, 
                    {"name": "Fri", "value": 4},
                    {"name": "Sat", "value": 5}, 
                    {"name": "Sun", "value": 6}];

    let arr = [];
    let date = new Date(y, m - 1, 1)
    
    let mounth = date.getMonth();
    while(mounth === date.getMonth()) {
        arr.push({value: date.getDate(), name: date.getDay()});
        date = date.addDays(1);
    }
    arr.forEach((day) => {
        if(day.name !== 0) {
            day.name -= 1;
        } else {
            if(day.name === 0) {
                day.name = 6;
            }
        }
    });

    const frm = new DocumentFragment();
    const el = document.getElementById(elem);
    
    const newTab = document.createElement('table');
    newTab.border = '1';
    const newTr = document.createElement('tr');
    
    for(let i = 0; i < daysName.length; i++) {
        const newTh = document.createElement('th');
        newTh.innerText = daysName[i].name;
        newTr.appendChild(newTh);
    }
    newTab.appendChild(newTr);

    let i = 0;
    while(i < arr.length) {
        let newTr = document.createElement('tr');
        for(let j = 0; j < 7; j++) {
            const newTd = document.createElement('td');
            if(i < arr.length && j === arr[i].name) {
                newTd.innerText = arr[i].value;
                i++;
            } else {
                newTd.innerText = '';
            }

            newTr.appendChild(newTd);
        }
 
        newTab.appendChild(newTr);
    }

    
    frm.appendChild(newTab);
    el.appendChild(frm);
}

createCalendar('cal', 2012, 9);


