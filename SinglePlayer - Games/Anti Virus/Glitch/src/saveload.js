function saveData(key, data) {
    localStorage[key] = JSON.stringify(data);
    localStorage.setItem("item", true);
}

function loadData(key) {

    return localStorage[key];
}