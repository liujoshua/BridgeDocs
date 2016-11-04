var container = document.querySelector("#toc");
if (container) {
    container.className = "ui segment";
    var headers = document.querySelectorAll("h2, h3, h4, h5, h6");
    for (var i=0; i < headers.length; i++) {
        var header = headers[i];
        var level = parseInt(header.nodeName.substring(1), 10) - 2; 

        var a = document.createElement("a");
        a.style.marginLeft = (level*15) + "px";
        a.style.display = "block";
        a.textContent = header.textContent;
        a.href = "#n" + i;
        container.appendChild(a);
        
        var up = document.createElement("a");
        up.textContent = "[back to contents]";
        up.href = "#";
        up.style.fontSize = "small";
        up.style.marginLeft = "3rem";
        header.appendChild(up);

        header.id = "n" + i;
    }
}
