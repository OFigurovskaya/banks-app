import Chart from 'chart.js/auto';
export async function getToken() {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify({
            login: 'developer',
            password: 'skillbox'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    if (response.status !== 200) {
        throw new Error('Что-то пошло не так, попробуйте обновить страницу')
    }

    try {
        let data = (await response.json());
        return data.payload.token;
    } catch (error) {
        throw error;
    }
}

const token = getToken();

export function updteLS(arr) {
    localStorage.setItem('key', JSON.stringify(arr));
    let str = localStorage.getItem('key');
    let res = JSON.parse(str);
    return res;
}


export function month(str) {
    let monthArr = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    for (let i = str; i <= 12; i++) {
        return monthArr[str];
    }
}

export function changeDate(str) {
    let dateNew = new Date(str);
    // console.log(dateNew);
    return (dateNew.getDate() + ' ' + month(dateNew.getMonth()) + ' ' + dateNew.getFullYear());
}

export function changeDateTable(str) {
    let dateNew = new Date(str);
    return (dateNew.getDate() + '.' + (+dateNew.getMonth() + 1) + '.' + dateNew.getFullYear());
}

export function getCraph(elem, labels, datasets) {
    new Chart(elem, {
        type: 'bar',
        options: {
            animation: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        },
        data: {
            labels: labels,
            datasets: [{
                data: datasets,
            }]
        }
    })
}

export function getSumArr(data) {
    let sumArr = [];
    let x1 = 0;
    let x2 = 0;
    let x3 = 0;
    let x4 = 0;
    let x5 = 0;
    let x6 = 0;
    let x7 = 0;
    let x8 = 0;
    let x9 = 0;
    let x10 = 0;
    let x11 = 0;
    let x12 = 0;
    for (let elem of data) {
        let z = new Date(elem.date);
        if (z.getMonth() === 0) {
            x1 += (elem.amount);
        }
        if (z.getMonth() === 1) {
            x2 += (elem.amount);
        }
        if (z.getMonth() === 2) {
            x3 += (elem.amount);
        }
        if (z.getMonth() === 3) {
            x4 += (elem.amount);
        }
        if (z.getMonth() === 4) {
            x5 += (elem.amount);
        }
        if (z.getMonth() === 5) {
            x6 += (elem.amount);
        }
        if (z.getMonth() === 6) {
            x7 += (elem.amount);
        }
        if (z.getMonth() === 7) {
            x8 += (elem.amount);
        }
        if (z.getMonth() === 8) {
            x9 += (elem.amount);
        }
        if (z.getMonth() === 9) {
            x10 += (elem.amount);
        }
        if (z.getMonth() === 10) {
            x11 += (elem.amount);
        }
        if (z.getMonth() === 11) {
            x12 += (elem.amount);
        }
    }
    sumArr.push(x1);
    sumArr.push(x2);
    sumArr.push(x3);
    sumArr.push(x4);
    sumArr.push(x5);
    sumArr.push(x6);
    sumArr.push(x7);
    sumArr.push(x8);
    sumArr.push(x9);
    sumArr.push(x10);
    sumArr.push(x11);
    sumArr.push(x12);

    return sumArr;
}

