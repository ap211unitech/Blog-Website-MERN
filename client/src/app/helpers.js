export const isValidJSON = (str) => {
    try {
        JSON.parse(str)
        return true;
    } catch (e) {
        return false;
    }
}

export const formatDate = (iso) => {
    let date = new Date(iso);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    date = dd + '/' + mm + '/' + yyyy;

    let time = new Date(iso).toLocaleTimeString();

    return date
}

export const extractDescriptionFromHTML = (txt, space = false) => {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(txt, 'text/html');
    return htmlDoc.documentElement.textContent;

    var span = document.createElement('span');
    span.innerHTML = htmlDoc;
    if (space) {
        var children = span.querySelectorAll('*');
        for (var i = 0; i < children.length; i++) {
            if (children[i].textContent)
                children[i].textContent += ' ';
            else
                children[i].innerText += ' ';
        }
    }
    console.log(span.innerText)
    return [span.textContent || span.innerText].toString().replace(/ +/g, ' ');

}