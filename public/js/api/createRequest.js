/**
 * Основная функция для совершения запросов
 * на сервер.
 * @param {{ 
 *  url: string;
 *  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
 *  responseType: 'json';
 *  data: *;
 *  callback: Function;
 * }} options 
 */
const createRequest = (options = {}) => {
    const { method, responseType = 'json', data = {}, callback = () => {} } = options;
    let url = options.url;

    let query = new URLSearchParams();
    const fd = new FormData();

    const xhr = new XMLHttpRequest();
    xhr.responseType = responseType;

    const entries = Object.entries(data);
    if (entries.length) {
        const target = method === 'GET' ? query : fd;
        entries.forEach(([k, v]) => {
            if (Number.isFinite(v) || v) {
                target.append(k, v);
            }
        })
        if (method === 'GET') {
            url += `?${target.toString()}`;
        }
    }

    xhr.open(method, url);

    xhr.addEventListener('load', () => {
        callback(null, xhr.response);
    });

    xhr.addEventListener('error', (e) => {
        callback('Error');
    });

    xhr.send(fd);
};
