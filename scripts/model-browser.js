var COMMENT_PARSER = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//;
function multiline(fn) {
	return COMMENT_PARSER.exec(fn.toString())[1];
};

fetch('./swagger.json').then(function(response) {
    response.json().then(function(swagger) {
        window.definitions = processSwagger(swagger); 
        init();
        loadModel();
    });
});
marked.setOptions({gfm: true, tables: true});

var templateText = multiline(function() {/*
    <h2>
        Type: <span style='color:black'>{{{displayName}}}</span> 
        {{#discriminator}}<i>&laquo;Abstract&raquo;</i>{{/discriminator}}
        {{#if supertype}} <i>subtype of <a href="#{{supertype}}">{{supertype}}</a></i>{{/if}}
    </h2>
    {{#if showClassRelationships}}
        <div class="ui message">
            {{#if subclasses.length}}
                <p class="subclass">
                    To create a complete JSON payload, you will need to use one of these subtypes: 
                    {{#subclasses}}
                        <a href="{{link}}">{{name}}</a>
                    {{/subclasses}}. 
                </p>
            {{/if}}
            {{#if uses.length}}
                <p class="subclass">Used in types: 
                    {{#uses}}
                        <a href="{{link}}">{{{displayName}}}</a>
                    {{/uses}}
                </p>
            {{/if}}
        </div>
    {{/if}}
    <p>{{{description}}}</p>
    <h2>Properties</h2>
    <dl>
        {{#properties}}
            <dt>
                <b>{{name}}</b> : 
                {{#if type.title}}
                    <a href="{{type.link}}">{{type.title}}</a>
                {{else}}
                    {{type}}
                {{/if}}
            </dt>
            <dd>
                {{#if enum}}
                    <div class="enumeration">
                        {{#enum}}<code>{{.}}</code><br>{{/enum}}
                    </div>
                {{/if}}
                {{{description}}}
            </dd>
        {{/properties}}
    </dl>
*/});
var nameContainer = document.querySelector("#model_nav");
var modelDetail = document.querySelector("#model_detail");
var currentItem, definitions;
var template = Handlebars.compile(templateText);

var getTypeLabel = function() {
    var TYPE_LABELS = {
        'boolean': 'Boolean',
        'string': 'String',
        'date-time': 'ISO 8601 date & time string',
        'date': 'ISO 8601 date string',
        'integer': 'Integer'
    };
    return function(key) {
        var value = TYPE_LABELS[key];
        // If there's no label we check that elsewhere. There are some cases where things
        // are getting processed twice, where this would fail the second time.
        return value;
    }
}

function getDefinition(definitions, $ref) {
    return definitions[ $ref.split("/").pop() ];
}
function processSwagger(swagger) {
    var defKeys = Object.keys(swagger.definitions);
    // pre-process definitions
    defKeys.forEach(function(propName) {
        var def = swagger.definitions[propName];
        def.title = propName;
        def.name = propName;
        def.link = "#"+propName;
    });
    // Proces definitions
    defKeys.forEach(function(propName) {
        var def = swagger.definitions[propName];
        processDefinition(swagger.definitions, propName, def);
    });
    // Post-process definitions, converting objects/sets into arrays for rendering 
    defKeys.forEach(function(propName) {
        var def = swagger.definitions[propName];
        // Object.values(def.properties);
        def.properties = Object.keys(def.properties).map(function(key) {
            return def.properties[key];
        });
        // Deduplicate arrays. Sets are not widely enough supported for this.
        if (def.uses) {
            def.uses = def.uses.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
            });
        }
        transferUsesFromSuperToSubType(swagger.definitions, def, propName);
        if (def.uses || def.subclasses) {
            def.showClassRelationships = true;
        }
    });
    // This is not describable as a super-type, because it doesn't have a discriminator 
    // property to select a concreate subtype. It's just a mixin. I beleve anything
    // with subclasses property and no discriminator can be deleted this way.
    delete swagger.definitions.AbstractStudyParticipant;
    return swagger.definitions;
}
function transferUsesFromSuperToSubType(definitions, def, propName) {
    if (def.supertype) {
        var aSuper = definitions[def.supertype];
        if (aSuper.uses) {
            def.uses = (def.uses || []).concat( aSuper.uses );
        }
    }
}
function processDefinition(definitions, propName, def) {
    def.displayName = displayName(def);
    def.properties = def.properties || {};
    def.required = def.required || [];
    def.description = def.description || "";
    if (def.allOf) {
        processAllOf(definitions, def, def.allOf);
        delete def.allOf;
    }
    Object.keys(def.properties).forEach(function(propName) {
        processProperty(definitions, propName, def, def.properties[propName]);
    });
    /* This is no longer sufficient fo find subclasses; look for a top-level
        $ref in an allOf: clause (there can be only one in our modeling)
    if (typeof def.discriminator !== "undefined") {
        def.subclasses = def.properties.type.enum.map(function(className) {
            var subtype = definitions[className];
            subtype.supertype = def.title;
            return {name: className, link: className};
        });
        delete def.properties.type;
    }
    */
    // This is just so the key appears last; iteration in browser I test is consisent
    // with order of insertion.
    if (def.properties.type) {
        var type = def.properties.type;
        delete def.properties.type;
        def.properties.type = type;
    }
}
function processProperty(definitions, propName, def, property) {
    property.name = propName;
    property.definition = property.definition || "";
    for (propField in property) {
        switch(propField) {
            case 'enum':
                enumToConstant(property); break;
            case 'items':
                relabelArray(definitions, propName, def, property); break;
            case 'format':
            case 'type':
                relabelPropType(definitions, def, property); break;
            case '$ref':
                createSuperType(definitions, def, property); break;
            case 'description':
                property.description = marked(property.description); break;
        }
    }
    if (property.enum) {
        property.type = "Enumeration";
    }
    return property;
}
function enumToConstant(property) {
    if (property.enum.length === 1) {
        property.type = property.enum[0];
        delete property.enum;
    }
}
function relabelArray(definitions, propName, def, property) {
    var itemsProp = property.items;
    for (var itemsPropName in itemsProp) {
        switch(itemsPropName) {
            case '$ref':
                var arrayType = getDefinition(definitions, itemsProp.$ref);
                addUse(arrayType, def);
                property.link = arrayType.link;
                property.type = {
                    title: arrayType.title + "[]",
                    link: arrayType.link
                };
                break;
            case 'type':
                var label = getTypeLabel(itemsProp.type);
                if (label) {
                    property.type = label + "[]";
                }
                break;
            case 'description':
                property[itemsPropName] = marked(itemsProp[itemsPropName]); break;
            default:
                if (itemsProp[itemsPropName]){
                    property[itemsPropName] = itemsProp[itemsPropName];
                }
        }
    }
    delete property.items;
}
function relabelPropType(definitions, def, property) {
    if (property.type === "object") {
        var ap = property.additionalProperties;
        if (ap) {
            if (ap.type) {
                var label = getTypeLabel(ap.type);
                property.type = "Map<String,"+label+">";
            } else if (ap.$ref) {
                var refType = getDefinition(definitions, ap.$ref);
                addUse(refType, def);
                property.type = {
                    title: "Map<String,"+refType.title+">",
                    link: refType.link
                };
            }
        }
    }
    var label = getTypeLabel(property.format || property.type);
    if (label) {
        property.type = label;
        delete property.format;
    }
}
function addUse(parentDef, childDef) {
    parentDef.uses = parentDef.uses || [];
    parentDef.uses.push(childDef);
}
function createSuperType(definitions, def, property) {
    var superType = getDefinition(definitions, property.$ref);
    addUse(superType, def);
    property.type = superType;
    delete property.$ref;
}
function processAllOf(definitions, def, array) {
    array.forEach(function(entryObj) {
        if (entryObj instanceof Array) {
            processAllOf(definitions, def, entryObj);
        } else {
            processAllOfEntry(definitions, def, entryObj);
        }
    });
}
function processAllOfEntry(definitions, def, entryObj) {
    for (var propName in entryObj) {
        switch(propName) {
            case 'properties':
                Object.assign(def.properties, entryObj.properties); break;
            case '$ref':
                var parentRef = getDefinition(definitions, entryObj.$ref);
                //processAllOfEntry(definitions, def, parentDef);
                def.supertype = parentRef.title;
                parentRef.subclasses = parentRef.subclasses || [];
                parentRef.subclasses.push(def);
                break;
            case 'required':
                copyRequired(def, entryObj.required); break;
            case 'description':
            case 'type':
                copyPropIfMissing(def, entryObj, propName); break;
            // case 'name':
            // case 'displayName':
            // case 'title':
            // ignore for now, although this is information about parents 
        }
    }
}
function copyRequired(targetDef, required) {
    (required || []).forEach(function(required) {
        targetDef.required.push(required);
    });
}
function copyPropIfMissing(targetDef, source, propName) {
    if (!targetDef[propName]) {
        targetDef[propName] = source[propName]; 
    }
}
function init() {
    var modelNames = Object.keys(definitions);
    modelNames = modelNames.sort();
    
    var df = document.createDocumentFragment();
    modelNames.forEach(function(modelName) {
        var item = document.createElement("a");
        item.classList.add("item");
        item.id = "node-" + modelName;
        item.href = "#" + modelName;
        item.innerHTML = definitions[modelName].displayName;
        df.appendChild(item);
    });
    nameContainer.appendChild(df);
}

function displayName(def) {
    if (/List_/.test(def.name)) {
        var parts = def.name.split("_");
        return parts[0]  + "&lt;" + parts[1] + "&gt;"
    }
    return def.name;
}
function renderDetail(defName) {
    modelDetail.innerHTML = "";
    var def = definitions[defName];
    def.description = marked(def.description);
    modelDetail.innerHTML = template(def);
}
function loadModel() {
    window.scrollTo(0,0);
    var defName = document.location.hash.substring(1);
    var item = document.querySelector("#node-"+defName);
    if (item) {
        if (currentItem) {
            currentItem.classList.remove("active");
        }
        item.classList.add("active");
        renderDetail(defName);
        currentItem = item;
    }
}
window.addEventListener('hashchange', loadModel, false);
