fetch('./swagger.json').then(function(response) {
    response.json().then(function(swagger) {
        init(swagger);
        loadModel();
    });
});

// 1. resolve the whole model first
// 2. then render.

var COMMENT_PARSER = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//;
var FORMAT_PARSER = /\{[^\|}]+\}/g;
var TYPE_LABELS = {
    'boolean': function(prop) { return 'Boolean' },
    'string': function(prop) { return 'String' },
    'date-time': function(prop) { return 'ISO 8601 date & time string' },
    'date': function(prop) { return 'ISO 8601 date string' },
    'integer': function(prop) { return 'Integer' },
    'array': function(prop) {
        if (TYPE_LABELS[prop.items.type]) {
            return 'Array&lt;'+TYPE_LABELS[prop.items.type](prop.items)+'&gt;'
        }
        return 'Array';
    },
    'object': function(prop) {
        return 'Object';
    }
}
function multiline(fn) {
	return COMMENT_PARSER.exec(fn.toString())[1];
};
function format(string, obj) {
    return string.replace(FORMAT_PARSER, function(token){
        var prop = token.substring(1, token.length-1);
        return (typeof obj[prop] == "function") ? obj[prop]() : obj[prop];
    });
}

var detailTemplate = multiline(function(){/*
    <h1>{displayName}</h1>
    <p>{description}</p>
    <h4>Properties</h4>
    {propList}
*/});
var propTemplate = multiline(function() {/*
    <dt><b>{name}</b> : {type}</dt>
    <dd>{enum}
        {description}</dd>
*/});

var nameContainer = document.querySelector("#model_nav");
var modelDetail = document.querySelector("#model_detail");
var currentItem, definitions;

function getModelFromRef($ref) {
    return definitions[ $ref.split("/").pop() ];
}
function processDefinitions(swagger) {
    Object.keys(swagger.definitions).forEach(function(modelName) {
        var model = swagger.definitions[modelName];
        model.displayName = modelName;
        if (modelName.indexOf("_") > -1) {
            model.displayName = modelName.split("_")[0]  + "&lt;" + modelName.split("_")[1] + "&gt;"
        }
        model.properties = model.properties || {};
        model.allOf = model.allOf || []
        model.description = model.description || "";
        model.description = markdown.toHTML(model.description);
        model.allOf.forEach(function(entry) {
            if (entry.properties) {
                for (var propName in entry.properties) {
                    model.properties[propName] = entry.properties[propName];
                }
            }
        });
    });
    definitions = swagger.definitions;
}

function init(swagger) {
    processDefinitions(swagger);
    var modelNames = Object.keys(swagger.definitions);
    modelNames = modelNames.sort();
    
    var df = document.createDocumentFragment();
    modelNames.forEach(function(modelName) {
        var item = document.createElement("a");
        item.classList.add("item");
        item.id = "node-" + modelName;
        item.href = "#" + modelName;
        item.innerHTML = swagger.definitions[modelName].displayName;
        df.appendChild(item);
    });
    nameContainer.appendChild(df);
    definitions = swagger.definitions;
}
function processProperty(propName, prop) {
    // If it's at the top level, the model is the property. However this
    // doesn't actually work.
    if (prop.$ref) {
        var propModel = getModelFromRef(prop.$ref);
        for (var propName in propModel) {
            prop[propName] = propModel[propName];
        }
        console.log("prop", prop);
    }
    prop.name = propName;
    if (prop.description) {
        if (!/\.$/.test(prop.description.trim())) {
            prop.description += ".";
        }
    } else {
        prop.description = "<i>No description.</i>";
    }
    prop.type = TYPE_LABELS[prop.format || prop.type](prop);
    if (propName === "type" && prop.enum && prop.enum.length === 1) {
        prop.type = "String";
        prop.description = "<tt>&ldquo;" + prop.enum[0] + "&rdquo;</tt>";
    }
    if (prop.enum && prop.enum.length > 1) {
        prop.enum = "Enumerated: <span style='color:rebeccapurple'>" + prop.enum.join(", ") + "</span><br>"
    } else {
        prop.enum = "";
    }
}
function renderDetail(modelName) {
    var def = definitions[modelName];
    def.propList = def.propList || (function() {
        return "<dl>" + Object.keys(def.properties).map(function(propName) {
            var prop = def.properties[propName];
            processProperty(propName, prop);
            return format(propTemplate, prop);
        }).join("") + "</dl>";
    })();
    modelDetail.innerHTML = format(detailTemplate, def);
}
function loadModel() {
    var modelName = document.location.hash.substring(1);
    var item = document.querySelector("#node-"+modelName);
    if (item) {
        if (currentItem) {
            currentItem.classList.remove("active");
        }
        item.classList.add("active");
        renderDetail(modelName);
        currentItem = item;
    }
}
window.addEventListener('hashchange', loadModel, false);
