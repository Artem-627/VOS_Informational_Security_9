// Подключение библиотек, необходимых для работы
const express = require('express');
const res = require('express/lib/response');
const { send } = require('express/lib/response');
const app = express();

// Введение необходимых констант
const IP = '192.168.1.68'; // Ip сервера
const PORT = 627; // Порт сервера
const MAX_PRIME = 600; // Ограничение для генерации простых чисел

var requests = []; // Массив генерации закрытого ключа и промежуточных вычислений
var results = []; // Массив полученных расшифрованных сообщений

// Функция получения исходного сообщения (C ^ D) % N
function GetM(C, D, N){
    var mod1 = C % N;
    var mod = C % N;
    var i = 0;
    for (i = 0; i < D; ++i){
        mod *= mod1;
        mod %= N;
        if (i == C - 2){
            return mod;
        }
    }
}


/// Генерация массива с простыми числами
var is_prime = new Array(MAX_PRIME + 1).fill(1); // Массив для работы с решетом Эратосфена
var primes = []; // Массив, в котором будут простые числа

// Решето Эратосфена
for (var i = 2; i * i < MAX_PRIME; ++i){
    for (var prime_n = i + i; prime_n < MAX_PRIME; prime_n += i){
        is_prime[prime_n] = 0;
    }
}

// Добавление итоговых простых чисел в массив primes[]
for (var i = 2; i < MAX_PRIME; ++i){
    if (is_prime[i] == 1){
        primes.push(i);
    }
}
/// Конец генерации массива с простыми числами

// Проверка цисла на целость
function IsInt(value) {
return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

// Инициализация прослушивания сервера http:<IP>.<PORT>
app.listen(PORT, IP, (error) => {
    error ? console.log(error) : console.log(`[Listening http://${IP}:${PORT}]`);
});

// Инициализация страницы для вывода сообщений
app.get('/messages', (req, res) => {
    res.status(200).json(results);
});

app.get('/check-connection', (req, res) => {
    res.send(1);
})

app.get('/generation-request', (req, res) => {
    let P = primes[Math.floor(Math.random()*primes.length)];
    let Q = primes[Math.floor(Math.random()*primes.length)];
    let N = P * Q;
    let F = (P - 1) * (Q - 1);
    let E = 5;
    let k = 1;
    D = (k * F + 1) / E;
    while(D != Math.round(D)){
        k ++;
        D = (k * F + 1) / E;
        console.log(k + ": " + D);
        if (k == 50000){
            P = primes[Math.floor(Math.random()*primes.length)];
            Q = primes[Math.floor(Math.random()*primes.length)];
            N = P * Q;
            F = (P - 1) * (Q - 1);
            k = 1;
        }
    }
    requests.push(
        {
            P: P,
            Q: Q,
            N: N,
            F: F,
            E: E,
            D: D
        }
    );
    res.send({
        ID: requests.length - 1,
        E: requests[requests.length - 1].E,
        N: requests[requests.length - 1].N,
    });
    results.push({
        id: requests.length - 1,
        message: "Не принято"
    });
});

// Инициализация страницы для приема сообщений
app.get('/send', (req, res) => {
    results[req.query.id].message = GetM(req.query.C, requests[requests.length - 1].D, requests[requests.length - 1].N);
    res.send('ok');
});

