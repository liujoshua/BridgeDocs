// Activate the current navigation link
var items = document.body.querySelectorAll("a");
for (var i=0; i < items.length; i++) {
    var item = items[i];
    var href = item.getAttribute('data-filepath') || item.getAttribute('href');
    if (/http[s]?\:/.test(href)) {
        var icon = document.createElement("i");
        icon.className = "ui small external icon";
        icon.textContent = " ";
        item.appendChild(document.createTextNode(" "));
        item.appendChild(icon);
        item.target = "_blank";
    }
    if (document.location.pathname.indexOf(href) > -1) {
        item.classList.add("active");
    }
}
var items = document.body.querySelectorAll("table");
for (var i=0; i < items.length; i++) {
    var item = items[i];

    item.className = "ui compact table";
    var div = document.createElement('div');
    div.className = "table-wrapper";
    item.parentNode.replaceChild(div, item);
    div.appendChild(item);
}