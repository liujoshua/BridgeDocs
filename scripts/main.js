// Activate the current navigation link
var items = document.querySelectorAll("a");
for (var i=0; i < items.length; i++) {
    var href = items[i].getAttribute('href');
    console.log(href, document.location.pathname);
    if (href === document.location.pathname) {
        items[i].classList.add("active");
    }
}
