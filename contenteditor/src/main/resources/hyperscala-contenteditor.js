// Support capitalizing text
String.prototype.capitalize = function () {
    return this.replace(/[a-zA-Z0-9]+/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

var ContentEditor = {
    instances: {},
    listeners: {},
    byId: function(id) {
        var instance = this.instances[id];
        if (instance == null) {
            instance = new ContentEditorInstance(id);
            this.instances[id] = instance;
        }
        return instance;
    },
    exists: function(id) {
        return this.instances[id] != null;
    },
    on: function(key, f) {
        if (this.listeners[key] == null) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(f);
    },
    fire: function(key, evt) {
        if (this.listeners[key]) {
            for (var i = 0; i < this.listeners[key].length; i++) {
                this.listeners[key][i](evt);
            }
        }
    },
    lastStyle: null,
    check: function() {
        var activeId = null;
        if (document.activeElement != null) {
            activeId = $(document.activeElement).attr('id');
        }
        if (this.instances[activeId]) {       // Only fire change if editable is focused
            var currentStyle = this.style2JSON(contentEditor.selectionInfo().scopedStyle);
            if (JSON.stringify(currentStyle) != JSON.stringify(this.lastStyle)) {
                this.fire('styleChanged', {
                    instance: this.instances[document.activeElement],
                    style: currentStyle,
                    previous: this.lastStyle
                });
                this.lastStyle = currentStyle;
            }
        }
    },
    bind: function(id, key, doc, valueCleaner) {
        if (doc == null) doc = document;
        var element = doc.jQuery('#' + id);
        if (element.size() == 0) {
            realtime.error('ContentEditorInstance.bind: Unable to find element by id ' + id + ' (style: ' + key + ')');
        } else {
            element.change(function() {
                var activeId = null;
                if (document.activeElement != null) {
                    activeId = $(document.activeElement).attr('id');
                }
                if (ContentEditor.exists(activeId)) {
                    var value = element.val();
                    if (valueCleaner != null) {
                        value = valueCleaner(value);
                        element.val(value);
                    }
                    ContentEditor.byId(activeId).set(key, value);
                }
            });
            ContentEditor.on('styleChanged', function(evt) {
                element.val(evt.style[key]);
            });
        }
    },
    /**
     * Custom binding to allow more advanced style bindings.
     *
     * @param id the id of the field with the value
     * @param doc the document (uses document if null)
     * @param fromString function(value: String, instance: ContentEditorInstance) to set the style from the value changed in the field.
     * @param toString function(styleChangeEvent: {instance, style, previous}): String to get the style String from the current style.
     */
    bindCustom: function(id, doc, fromString, toString) {
        if (doc == null) doc = document;
        var element = doc.jQuery('#' + id);
        if (element.size() == 0) {
            realtime.error('ContentEditorInstance.bind: Unable to find element by id ' + id + ' (style: ' + key + ')');
        } else {
            element.change(function() {
                var activeId = null;
                if (document.activeElement != null) {
                    activeId = $(document.activeElement).attr('id');
                }
                if (ContentEditor.exists(activeId)) {
                    fromString(element.val(), ContentEditor.byId(activeId));
                }
            });
            ContentEditor.on('styleChanged', function(evt) {
                element.val(toString(evt));
            });
        }
    },
    bindFontStyle: function(id, doc) {
        var weight2Internal = {'Thin': '100', 'Light': '300', 'Medium': '500', 'Extra-Bold': '800', 'Ultra-Bold': '900'};
        var weight2Visual = {
            '100': 'Thin',
            '300': 'Light',
            '400': 'Normal',
            '500': 'Medium',
            '700': 'Bold',
            '800': 'Extra-Bold',
            '900': 'Ultra-Bold'
        };
        var fromString = function(value, instance) {
            var index = value.lastIndexOf(' ');
            var parser = [value];
            if (index > 0) {
                parser = [value.substring(0, index), value.substring(index + 1)];
            }
            for (var i = 0; i < parser.length; i++) {
                parser[i] = parser[i].capitalize();
            }
            var w = 'normal';
            var s = 'normal';
            if (parser.length == 1) {
                if (parser[0].toLowerCase() == 'italic' || parser[0].toLowerCase() == 'oblique') {
                    s = parser[0];
                } else {
                    w = parser[0];
                    if (w in weight2Internal) {
                        w = weight2Internal[w];
                    }
                }
            } else {
                w = parser[0];
                if (w in weight2Internal) {
                    w = weight2Internal[w];
                }
                s = parser[1];
            }
            w = w.toLowerCase();
            s = s.toLowerCase();
            instance.set('font-weight', w);
            instance.set('font-style', s);
        };
        var toString = function(styleChangeEvent) {
            var weight = styleChangeEvent.style['font-weight'];
            if (weight in weight2Visual) {
                weight = weight2Visual[weight];
            }
            var style = styleChangeEvent.style['font-style'];
            if (style == null) {
                style = 'normal';
            }
            style = style.capitalize();

            var s = '';
            if (weight != null && (weight.toLowerCase() != 'normal' || style == null || style.toLowerCase() == 'normal')) {
                s = weight;
            }
            if (style != null && style.toLowerCase() != 'normal') {
                if (s != '') {
                    s += ' ';
                }
                s += style;
            }
            return s.capitalize();
        };
        this.bindCustom(id, doc, fromString, toString);
    },
    style2JSON: function(style) {
        var json = {};
        for (var i = 0; i < style.length; i++) {
            json[style[i]] = style[style[i]];
        }
        return json;
    }
};

$(document).on('selectionchange', function() {
    ContentEditor.check();
});

var ContentEditorInstance = function(id) {
    this.element = document.getElementById(id);
    if (this.element == null) {
        throw 'Element not found by id: ' + id;
    }
    this.formatters = {};
};

ContentEditorInstance.prototype.focused = function() {
    return this.element == document.activeElement;
};

ContentEditorInstance.prototype.stylize = function(key, value) {
    if (this.focused()) {
        var formatter = this.formatters[key];
        if (formatter == null) {
            formatter = contentEditor.createClassWrapper('stylized-' + key);
            this.formatters[key] = formatter;
        }
        formatter.undo();
        formatter.style[key] = value;
        formatter.apply();
        ContentEditor.check();
    }
};

ContentEditorInstance.prototype.style = function(key) {
    return contentEditor.selectionInfo().scopedStyle[key];
};

ContentEditorInstance.prototype.hasStyle = function(key, value) {
    return this.style(key) == value;
};

ContentEditorInstance.prototype.toggle = function(key, value, reverse) {
    if (reverse == null) {
        reverse = '';
    }
    if (this.hasStyle(key, value)) {
        this.stylize(key, reverse);
    } else {
        this.stylize(key, value);
    }
};

ContentEditorInstance.prototype.set = function(key, value) {
    this.stylize(key, value);
};

ContentEditorInstance.prototype.insert = function(tagName, details) {
    if (this.focused()) {
        var formatter = this.formatters[tagName];
        if (formatter == null) {
            formatter = contentEditor.createHtmlWrapper(tagName);
            this.formatters[tagName] = formatter;
        }
        formatter.insert(details);
        ContentEditor.check();
    }
};

ContentEditorInstance.prototype.wrap = function(tagName, details) {
    if (this.focused()) {
        var formatter = this.formatters[tagName];
        if (formatter == null) {
            formatter = contentEditor.createHtmlWrapper(tagName);
            this.formatters[tagName] = formatter;
        }
        formatter.wrap(details);
        ContentEditor.check();
    }
};

ContentEditorInstance.prototype.clearFormatting = function() {
    if (this.focused()) {
        contentEditor.clearFormating();
    }
};