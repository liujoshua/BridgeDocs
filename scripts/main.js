// Activate the current navigtion link
var items = document.querySelectorAll(".ui.vertical.menu .item a");
for (var i=0; i < items.length; i++) {
    var href = items[i].getAttribute('href');
    if (href === document.location.pathname) {
        items[i].parentNode.classList.add("active");
    }
}
