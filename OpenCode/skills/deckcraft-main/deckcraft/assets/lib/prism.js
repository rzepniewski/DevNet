/**
 * Prism.js - Syntax Highlighting Library (Custom Build)
 *
 * Bundled for DeckCraft offline presentations.
 * Includes: Core + JavaScript, Python, Bash, HTML, CSS, JSON, TypeScript, JSX
 *
 * Based on Prism.js by Lea Verou (MIT License)
 * https://prismjs.com/
 */

var Prism = (function() {
    'use strict';

    // Core utilities
    var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
    var uniqueId = 0;

    var _ = {
        manual: false,
        disableWorkerMessageHandler: true,
        util: {
            encode: function encode(tokens) {
                if (tokens instanceof Token) {
                    return new Token(tokens.type, encode(tokens.content), tokens.alias);
                } else if (Array.isArray(tokens)) {
                    return tokens.map(encode);
                } else {
                    return tokens.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/\u00a0/g, ' ');
                }
            },
            type: function(o) {
                return Object.prototype.toString.call(o).slice(8, -1);
            },
            objId: function(obj) {
                if (!obj['__id']) {
                    Object.defineProperty(obj, '__id', { value: ++uniqueId });
                }
                return obj['__id'];
            },
            clone: function deepClone(o, visited) {
                visited = visited || {};
                var clone, id;
                switch (_.util.type(o)) {
                    case 'Object':
                        id = _.util.objId(o);
                        if (visited[id]) {
                            return visited[id];
                        }
                        clone = {};
                        visited[id] = clone;
                        for (var key in o) {
                            if (o.hasOwnProperty(key)) {
                                clone[key] = deepClone(o[key], visited);
                            }
                        }
                        return clone;
                    case 'Array':
                        id = _.util.objId(o);
                        if (visited[id]) {
                            return visited[id];
                        }
                        clone = [];
                        visited[id] = clone;
                        o.forEach(function(v, i) {
                            clone[i] = deepClone(v, visited);
                        });
                        return clone;
                    default:
                        return o;
                }
            }
        },
        languages: {
            extend: function(id, redef) {
                var lang = _.util.clone(_.languages[id]);
                for (var key in redef) {
                    lang[key] = redef[key];
                }
                return lang;
            },
            insertBefore: function(inside, before, insert, root) {
                root = root || _.languages;
                var grammar = root[inside];
                var ret = {};
                for (var token in grammar) {
                    if (grammar.hasOwnProperty(token)) {
                        if (token == before) {
                            for (var newToken in insert) {
                                if (insert.hasOwnProperty(newToken)) {
                                    ret[newToken] = insert[newToken];
                                }
                            }
                        }
                        if (!insert.hasOwnProperty(token)) {
                            ret[token] = grammar[token];
                        }
                    }
                }
                var old = root[inside];
                root[inside] = ret;
                _.languages.DFS(_.languages, function(key, value) {
                    if (value === old && key != inside) {
                        this[key] = ret;
                    }
                });
                return ret;
            },
            DFS: function DFS(o, callback, type, visited) {
                visited = visited || {};
                var objId = _.util.objId;
                for (var i in o) {
                    if (o.hasOwnProperty(i)) {
                        callback.call(o, i, o[i], type || i);
                        var property = o[i];
                        var propertyType = _.util.type(property);
                        if (propertyType === 'Object' && !visited[objId(property)]) {
                            visited[objId(property)] = true;
                            DFS(property, callback, null, visited);
                        } else if (propertyType === 'Array' && !visited[objId(property)]) {
                            visited[objId(property)] = true;
                            DFS(property, callback, i, visited);
                        }
                    }
                }
            }
        },
        plugins: {},
        highlightAll: function(async, callback) {
            _.highlightAllUnder(document, async, callback);
        },
        highlightAllUnder: function(container, async, callback) {
            var env = {
                callback: callback,
                container: container,
                selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };
            var elements = container.querySelectorAll(env.selector);
            for (var i = 0, element; (element = elements[i++]);) {
                _.highlightElement(element, async === true, env.callback);
            }
        },
        highlightElement: function(element, async, callback) {
            var language = _.util.getLanguage(element);
            var grammar = _.languages[language];

            element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

            var parent = element.parentElement;
            if (parent && parent.nodeName.toLowerCase() === 'pre') {
                parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
            }

            var code = element.textContent;
            var env = {
                element: element,
                language: language,
                grammar: grammar,
                code: code
            };

            if (!code || !grammar) {
                _.hooks.run('complete', env);
                if (callback) callback.call(env.element);
                return;
            }

            _.hooks.run('before-sanity-check', env);

            if (!env.code) {
                _.hooks.run('complete', env);
                if (callback) callback.call(env.element);
                return;
            }

            _.hooks.run('before-highlight', env);

            env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

            _.hooks.run('before-insert', env);

            env.element.innerHTML = env.highlightedCode;

            _.hooks.run('after-highlight', env);
            _.hooks.run('complete', env);
            if (callback) callback.call(env.element);
        },
        highlight: function(text, grammar, language) {
            var tokens = _.tokenize(text, grammar);
            return Token.stringify(_.util.encode(tokens), language);
        },
        tokenize: function(text, grammar) {
            var rest = grammar.rest;
            if (rest) {
                for (var token in rest) {
                    grammar[token] = rest[token];
                }
                delete grammar.rest;
            }
            var tokenList = new LinkedList();
            addAfter(tokenList, tokenList.head, text);
            matchGrammar(text, tokenList, grammar, tokenList.head, 0);
            return toArray(tokenList);
        },
        hooks: {
            all: {},
            add: function(name, callback) {
                var hooks = _.hooks.all;
                hooks[name] = hooks[name] || [];
                hooks[name].push(callback);
            },
            run: function(name, env) {
                var callbacks = _.hooks.all[name];
                if (!callbacks || !callbacks.length) {
                    return;
                }
                for (var i = 0, callback; (callback = callbacks[i++]);) {
                    callback(env);
                }
            }
        },
        Token: Token
    };

    // Add getLanguage utility
    _.util.getLanguage = function(element) {
        while (element && !lang.test(element.className)) {
            element = element.parentElement;
        }
        if (element) {
            return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
        }
        return 'none';
    };

    // Token class
    function Token(type, content, alias, matchedStr) {
        this.type = type;
        this.content = content;
        this.alias = alias;
        this.length = (matchedStr || '').length | 0;
    }

    Token.stringify = function stringify(o, language) {
        if (typeof o == 'string') {
            return o;
        }
        if (Array.isArray(o)) {
            var s = '';
            o.forEach(function(e) {
                s += stringify(e, language);
            });
            return s;
        }
        var env = {
            type: o.type,
            content: stringify(o.content, language),
            tag: 'span',
            classes: ['token', o.type],
            attributes: {},
            language: language
        };

        var aliases = o.alias;
        if (aliases) {
            if (Array.isArray(aliases)) {
                Array.prototype.push.apply(env.classes, aliases);
            } else {
                env.classes.push(aliases);
            }
        }

        _.hooks.run('wrap', env);

        var attributes = '';
        for (var name in env.attributes) {
            attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
        }

        return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
    };

    // Linked list for tokenization
    function LinkedList() {
        var head = { value: null, prev: null, next: null };
        var tail = { value: null, prev: head, next: null };
        head.next = tail;
        this.head = head;
        this.tail = tail;
        this.length = 0;
    }

    function addAfter(list, node, value) {
        var next = node.next;
        var newNode = { value: value, prev: node, next: next };
        node.next = newNode;
        next.prev = newNode;
        list.length++;
        return newNode;
    }

    function removeRange(list, node, count) {
        var next = node.next;
        for (var i = 0; i < count && next !== list.tail; i++) {
            next = next.next;
        }
        node.next = next;
        next.prev = node;
        list.length -= i;
    }

    function toArray(list) {
        var array = [];
        var node = list.head.next;
        while (node !== list.tail) {
            array.push(node.value);
            node = node.next;
        }
        return array;
    }

    function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
        for (var token in grammar) {
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
                continue;
            }
            var patterns = grammar[token];
            patterns = Array.isArray(patterns) ? patterns : [patterns];

            for (var j = 0; j < patterns.length; ++j) {
                if (rematch && rematch.cause == token + ',' + j) {
                    return;
                }

                var patternObj = patterns[j];
                var inside = patternObj.inside;
                var lookbehind = !!patternObj.lookbehind;
                var greedy = !!patternObj.greedy;
                var alias = patternObj.alias;

                if (greedy && !patternObj.pattern.global) {
                    var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
                    patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
                }

                var pattern = patternObj.pattern || patternObj;

                for (var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
                    if (rematch && pos >= rematch.reach) {
                        break;
                    }

                    var str = currentNode.value;

                    if (tokenList.length > text.length) {
                        return;
                    }

                    if (str instanceof Token) {
                        continue;
                    }

                    var removeCount = 1;
                    var match;

                    if (greedy) {
                        match = matchPattern(pattern, pos, text, lookbehind);
                        if (!match) {
                            break;
                        }

                        var from = match.index;
                        var to = match.index + match[0].length;
                        var p = pos;

                        p += currentNode.value.length;
                        while (from >= p) {
                            currentNode = currentNode.next;
                            p += currentNode.value.length;
                        }
                        p -= currentNode.value.length;
                        pos = p;

                        if (currentNode.value instanceof Token) {
                            continue;
                        }

                        for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === 'string'); k = k.next) {
                            removeCount++;
                            p += k.value.length;
                        }
                        removeCount--;

                        str = text.slice(pos, p);
                        match.index -= pos;
                    } else {
                        match = matchPattern(pattern, 0, str, lookbehind);
                        if (!match) {
                            continue;
                        }
                    }

                    var from = match.index;
                    var matchStr = match[0];
                    var before = str.slice(0, from);
                    var after = str.slice(from + matchStr.length);

                    var reach = pos + str.length;
                    if (rematch && reach > rematch.reach) {
                        rematch.reach = reach;
                    }

                    var removeFrom = currentNode.prev;

                    if (before) {
                        removeFrom = addAfter(tokenList, removeFrom, before);
                        pos += before.length;
                    }

                    removeRange(tokenList, removeFrom, removeCount);

                    var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
                    currentNode = addAfter(tokenList, removeFrom, wrapped);

                    if (after) {
                        addAfter(tokenList, currentNode, after);
                    }

                    if (removeCount > 1) {
                        var nestedRematch = {
                            cause: token + ',' + j,
                            reach: reach
                        };
                        matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

                        if (rematch && nestedRematch.reach > rematch.reach) {
                            rematch.reach = nestedRematch.reach;
                        }
                    }
                }
            }
        }
    }

    function matchPattern(pattern, pos, text, lookbehind) {
        pattern.lastIndex = pos;
        var match = pattern.exec(text);
        if (match && lookbehind && match[1]) {
            var lookbehindLength = match[1].length;
            match.index += lookbehindLength;
            match[0] = match[0].slice(lookbehindLength);
        }
        return match;
    }

    // ============================================
    // LANGUAGE DEFINITIONS
    // ============================================

    // Markup (HTML/XML)
    _.languages.markup = {
        'comment': {
            pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
            greedy: true
        },
        'prolog': {
            pattern: /<\?[\s\S]+?\?>/,
            greedy: true
        },
        'doctype': {
            pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
            greedy: true,
            inside: {
                'internal-subset': {
                    pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
                    lookbehind: true,
                    greedy: true,
                    inside: null
                },
                'string': {
                    pattern: /"[^"]*"|'[^']*'/,
                    greedy: true
                },
                'punctuation': /^<!|>$|[[\]]/,
                'doctype-tag': /^DOCTYPE/i,
                'name': /[^\s<>'"]+/
            }
        },
        'cdata': {
            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
            greedy: true
        },
        'tag': {
            pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
            greedy: true,
            inside: {
                'tag': {
                    pattern: /^<\/?[^\s>\/]+/,
                    inside: {
                        'punctuation': /^<\/?/,
                        'namespace': /^[^\s>\/:]+:/
                    }
                },
                'special-attr': [],
                'attr-value': {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        'punctuation': [
                            {
                                pattern: /^=/,
                                alias: 'attr-equals'
                            },
                            {
                                pattern: /^(\s*)["']|["']$/,
                                lookbehind: true
                            }
                        ]
                    }
                },
                'punctuation': /\/?>/,
                'attr-name': {
                    pattern: /[^\s>\/]+/,
                    inside: {
                        'namespace': /^[^\s>\/:]+:/
                    }
                }
            }
        },
        'entity': [
            {
                pattern: /&[\da-z]{1,8};/i,
                alias: 'named-entity'
            },
            /&#x?[\da-f]{1,8};/i
        ]
    };

    _.languages.html = _.languages.markup;
    _.languages.xml = _.languages.markup;

    // CSS
    _.languages.css = {
        'comment': /\/\*[\s\S]*?\*\//,
        'atrule': {
            pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
            inside: {
                'rule': /^@[\w-]+/,
                'selector-function-argument': {
                    pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                    lookbehind: true,
                    alias: 'selector'
                },
                'keyword': {
                    pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                    lookbehind: true
                }
            }
        },
        'url': {
            pattern: RegExp('\\burl\\((?:' + /"(?:\\[\s\S]|[^"\\])*"/.source + '|' + /'(?:\\[\s\S]|[^'\\])*'/.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
            greedy: true,
            inside: {
                'function': /^url/i,
                'punctuation': /^\(|\)$/,
                'string': {
                    pattern: RegExp('^' + /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'/.source + '$'),
                    alias: 'url'
                }
            }
        },
        'selector': {
            pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'/.source + ')*(?=\\s*\\{)'),
            lookbehind: true
        },
        'string': {
            pattern: /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'/,
            greedy: true
        },
        'property': {
            pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
            lookbehind: true
        },
        'important': /!important\b/i,
        'function': {
            pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
            lookbehind: true
        },
        'punctuation': /[(){};:,]/
    };

    // JavaScript
    _.languages.javascript = {
        'comment': [
            {
                pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
                lookbehind: true,
                greedy: true
            },
            {
                pattern: /(^|[^\\:])\/\/.*/,
                lookbehind: true,
                greedy: true
            }
        ],
        'string': {
            pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\\r\n])*\1/,
            greedy: true
        },
        'template-string': {
            pattern: /`(?:\\[\s\S]|[^\\`])*`/,
            greedy: true,
            inside: {
                'template-punctuation': {
                    pattern: /^`|`$/,
                    alias: 'string'
                },
                'interpolation': {
                    pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                    lookbehind: true,
                    inside: {
                        'interpolation-punctuation': {
                            pattern: /^\$\{|\}$/,
                            alias: 'punctuation'
                        },
                        rest: null
                    }
                },
                'string': /[\s\S]+/
            }
        },
        'regex': {
            pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
            lookbehind: true,
            greedy: true,
            inside: {
                'regex-source': {
                    pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                    lookbehind: true,
                    alias: 'language-regex',
                    inside: null
                },
                'regex-delimiter': /^\/|\/$/,
                'regex-flags': /^[a-z]+$/
            }
        },
        'function-variable': {
            pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
            alias: 'function'
        },
        'keyword': [
            {
                pattern: /((?:^|\})\s*)catch\b/,
                lookbehind: true
            },
            {
                pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                lookbehind: true
            }
        ],
        'boolean': /\b(?:false|true)\b/,
        'number': {
            pattern: /(^|[^\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?|\d+(?:_\d+)*n|(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?)(?![\w$])/,
            lookbehind: true
        },
        'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
        'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        'punctuation': /[{}[\];(),.:]/
    };

    _.languages.js = _.languages.javascript;

    // TypeScript (extends JavaScript)
    _.languages.typescript = _.languages.extend('javascript', {
        'class-name': {
            pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
            lookbehind: true,
            greedy: true,
            inside: null
        },
        'builtin': /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
    });

    // Add TypeScript-specific keywords
    if (_.languages.typescript.keyword) {
        if (Array.isArray(_.languages.typescript.keyword)) {
            _.languages.typescript.keyword.push({
                pattern: /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
                lookbehind: false
            });
        }
    }

    _.languages.ts = _.languages.typescript;

    // JSON
    _.languages.json = {
        'property': {
            pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
            lookbehind: true,
            greedy: true
        },
        'string': {
            pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
            lookbehind: true,
            greedy: true
        },
        'comment': {
            pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
            greedy: true
        },
        'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
        'punctuation': /[{}[\],]/,
        'operator': /:/,
        'boolean': /\b(?:false|true)\b/,
        'null': {
            pattern: /\bnull\b/,
            alias: 'keyword'
        }
    };

    _.languages.jsonc = _.languages.json;

    // Python
    _.languages.python = {
        'comment': {
            pattern: /(^|[^\\])#.*/,
            lookbehind: true,
            greedy: true
        },
        'string-interpolation': {
            pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
            greedy: true,
            inside: {
                'interpolation': {
                    pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
                    lookbehind: true,
                    inside: {
                        'format-spec': {
                            pattern: /(:)[^:(){}]+(?=\}$)/,
                            lookbehind: true
                        },
                        'conversion-option': {
                            pattern: /![sra](?=[:}]$)/,
                            alias: 'punctuation'
                        },
                        rest: null
                    }
                },
                'string': /[\s\S]+/
            }
        },
        'triple-quoted-string': {
            pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
            greedy: true,
            alias: 'string'
        },
        'string': {
            pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
            greedy: true
        },
        'function': {
            pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
            lookbehind: true
        },
        'class-name': {
            pattern: /(\bclass\s+)\w+/i,
            lookbehind: true
        },
        'decorator': {
            pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
            lookbehind: true,
            alias: ['annotation', 'punctuation'],
            inside: {
                'punctuation': /\./
            }
        },
        'keyword': /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
        'builtin': /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|print|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
        'boolean': /\b(?:False|None|True)\b/,
        'number': /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
        'operator': /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
        'punctuation': /[{}[\];(),.:]/
    };

    _.languages.py = _.languages.python;

    // Bash/Shell
    _.languages.bash = {
        'shebang': {
            pattern: /^#!\s*\/.*/,
            alias: 'important'
        },
        'comment': {
            pattern: /(^|[^"{\\$])#.*/,
            lookbehind: true
        },
        'function-name': [
            {
                pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
                lookbehind: true,
                alias: 'function'
            },
            {
                pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
                alias: 'function'
            }
        ],
        'for-or-select': {
            pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
            alias: 'variable',
            lookbehind: true
        },
        'assign-left': {
            pattern: /(^|[\s;|&]|[<>]\()\w+(?:\+?=)/,
            inside: {
                'environment': {
                    pattern: RegExp('(^|[\\s;|&]|[<>]\\()' + /\w+/.source + '(?=\\+?=)'),
                    lookbehind: true,
                    alias: 'constant'
                }
            },
            lookbehind: true,
            alias: 'variable'
        },
        'parameter': {
            pattern: /(^|\s)-{1,2}(?:\w+(?:=(?:(?:[^\s'"\\]|\\.)+|(?:"(?:[^"\\]|\\.)*"|'[^']*'))?)?|\w+)/,
            lookbehind: true,
            alias: 'variable'
        },
        'string': [
            {
                pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
                lookbehind: true,
                greedy: true,
                inside: null
            },
            {
                pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
                lookbehind: true,
                greedy: true,
                inside: {
                    'bash': null
                }
            },
            {
                pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
                lookbehind: true,
                greedy: true,
                inside: null
            },
            {
                pattern: /(^|[^$\\])'[^']*'/,
                lookbehind: true,
                greedy: true
            },
            {
                pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
                greedy: true,
                inside: null
            }
        ],
        'environment': {
            pattern: RegExp('\\$?' + /\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\b/.source),
            alias: 'constant'
        },
        'variable': [
            /\$(?:\w+|[#?*!@$])/,
            {
                pattern: /\$\{[^}]+\}/,
                greedy: true,
                inside: null
            }
        ],
        'file-descriptor': {
            pattern: /\B&\d\b/,
            alias: 'important'
        },
        'keyword': {
            pattern: /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
            lookbehind: true
        },
        'builtin': {
            pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|history|jobs|kill|let|local|logout|mapfile|popd|printf|pushd|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
            lookbehind: true,
            alias: 'class-name'
        },
        'boolean': {
            pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
            lookbehind: true
        },
        'operator': {
            pattern: /&&|\|\||[!=]~|&>|\d?(?:>>|[<>])&?|[<>=!]=?|[|&;]+/,
            inside: {
                'file-descriptor': {
                    pattern: /^\d/,
                    alias: 'important'
                }
            }
        },
        'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
        'number': {
            pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
            lookbehind: true
        }
    };

    _.languages.sh = _.languages.bash;
    _.languages.shell = _.languages.bash;

    // JSX (extends JavaScript)
    _.languages.jsx = _.languages.extend('javascript', {});

    // Add JSX tag support
    var jsx_tag = {
        'tag': {
            pattern: /<\/?(?:[\w.:-]+(?:\s+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'">=]+|\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}))?|\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}))*\s*\/?)?>/i,
            greedy: true,
            inside: {
                'tag': {
                    pattern: /^<\/?[^\s>\/]*/,
                    inside: {
                        'punctuation': /^<\/?/,
                        'namespace': /^[^\s>\/:]+:/
                    }
                },
                'attr-value': {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        'punctuation': [
                            {
                                pattern: /^=/,
                                alias: 'attr-equals'
                            },
                            /"|'/
                        ]
                    }
                },
                'punctuation': /\/?>/,
                'attr-name': {
                    pattern: /[^\s>\/]+/,
                    inside: {
                        'namespace': /^[^\s>\/:]+:/
                    }
                }
            }
        }
    };

    _.languages.insertBefore('jsx', 'keyword', jsx_tag);

    // Go
    _.languages.go = {
        'comment': [
            { pattern: /\/\/.*/, greedy: true },
            { pattern: /\/\*[\s\S]*?(?:\*\/|$)/, greedy: true }
        ],
        'string': [
            { pattern: /"(?:\\.|[^"\\\r\n])*"/, greedy: true },
            { pattern: /`[^`]*`/, greedy: true },
            { pattern: /'(?:\\.|[^'\\\r\n])'/, greedy: true }
        ],
        'keyword': /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
        'boolean': /\b(?:true|false)\b/,
        'builtin': /\b(?:nil|iota|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print|println|real|recover|bool|byte|complex64|complex128|error|float32|float64|int|int8|int16|int32|int64|rune|string|uint|uint8|uint16|uint32|uint64|uintptr)\b/,
        'function': /\b\w+(?=\s*\()/,
        'class-name': /\b[A-Z]\w*/,
        'number': /\b(?:0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?i?)\b/,
        'operator': /:=|<-|[+\-*/%&|^!=<>]=?|&&|\|\||\.\.\./,
        'punctuation': /[{}[\]();,.:]/
    };

    // Rust
    _.languages.rust = {
        'comment': [
            { pattern: /\/\/.*/, greedy: true },
            { pattern: /\/\*[\s\S]*?(?:\*\/|$)/, greedy: true }
        ],
        'string': [
            { pattern: /b?"(?:\\.|[^"\\\r\n])*"/, greedy: true },
            { pattern: /b?r#*"[\s\S]*?"#*/, greedy: true },
            { pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/, greedy: true }
        ],
        'keyword': /\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|type|unsafe|use|where|while)\b/,
        'boolean': /\b(?:true|false)\b/,
        'builtin': /\b(?:bool|char|f32|f64|i8|i16|i32|i64|i128|isize|str|u8|u16|u32|u64|u128|usize|String|Vec|Option|Result|Box|Rc|Arc|HashMap|HashSet|None|Some|Ok|Err)\b/,
        'attribute': { pattern: /#!?\[[\s\S]*?\]/, greedy: true },
        'macro': { pattern: /\b\w+!/, greedy: true },
        'function': /\b\w+(?=\s*\()/,
        'class-name': /\b[A-Z]\w*/,
        'number': /\b(?:0[xX][\da-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?[\d_]+)?(?:f32|f64|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize)?)\b/,
        'operator': /->|=>|\.{2,3}|[+\-*/%&|^!=<>]=?|&&|\|\||<<?|>>?|[~?@]/,
        'punctuation': /[{}[\]();,.:]/
    };

    // SQL
    _.languages.sql = {
        'comment': [
            { pattern: /--.*/, greedy: true },
            { pattern: /\/\*[\s\S]*?(?:\*\/|$)/, greedy: true }
        ],
        'string': [
            { pattern: /'(?:''|[^'])*'/, greedy: true },
            { pattern: /"(?:""|[^"])*"/, greedy: true }
        ],
        'keyword': /\b(?:SELECT|FROM|WHERE|AND|OR|NOT|IN|ON|AS|IS|NULL|JOIN|LEFT|RIGHT|INNER|OUTER|CROSS|FULL|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|DATABASE|SCHEMA|IF|EXISTS|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|DEFAULT|AUTO_INCREMENT|SERIAL|CONSTRAINT|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|BETWEEN|LIKE|ILIKE|CASE|WHEN|THEN|ELSE|END|BEGIN|COMMIT|ROLLBACK|TRANSACTION|GRANT|REVOKE|WITH|RECURSIVE|RETURNING|CASCADE|RESTRICT|TRIGGER|PROCEDURE|FUNCTION|EXECUTE|ASC|DESC|TOP|FETCH|NEXT|ROWS|ONLY|ADD|COLUMN|RENAME|TRUNCATE|REPLACE|MERGE|USING|MATCHED|LATERAL|NATURAL|EXCEPT|INTERSECT|PIVOT|UNPIVOT)\b/i,
        'builtin': /\b(?:INT|INTEGER|SMALLINT|BIGINT|DECIMAL|NUMERIC|FLOAT|REAL|DOUBLE|CHAR|VARCHAR|TEXT|BLOB|DATE|TIME|TIMESTAMP|DATETIME|BOOLEAN|BOOL|JSON|JSONB|UUID|ARRAY|BYTEA|SERIAL|BIGSERIAL|MONEY|XML|INET|CIDR|MACADDR|BIT|VARYING)\b/i,
        'function': /\b(?:COUNT|SUM|AVG|MIN|MAX|COALESCE|NULLIF|CAST|CONVERT|CONCAT|LENGTH|SUBSTR|SUBSTRING|TRIM|UPPER|LOWER|NOW|CURRENT_TIMESTAMP|EXTRACT|DATE_TRUNC|ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD|FIRST_VALUE|LAST_VALUE|OVER|PARTITION|ROUND|ABS|CEIL|FLOOR|MOD|POWER|SQRT|RANDOM|STRING_AGG|ARRAY_AGG|JSON_AGG|GREATEST|LEAST|REPLACE|SPLIT_PART|TO_CHAR|TO_DATE|TO_NUMBER|POSITION|OVERLAY|SIMILAR)\b/i,
        'boolean': /\b(?:TRUE|FALSE)\b/i,
        'number': /\b\d+(?:\.\d+)?\b/,
        'operator': /[=<>!]+|::|AND|OR|NOT|IS|IN|LIKE|BETWEEN|SIMILAR\s+TO|\|\||&&/i,
        'punctuation': /[{}[\]();,.*]/
    };

    // YAML
    _.languages.yaml = {
        'comment': { pattern: /#.*/, greedy: true },
        'key': {
            pattern: /(?:^|[\r\n])[ \t]*(?:[^\s:,[\]{}#&*!|>'"%@`\-]|[?:\-](?=\S))(?:[^#\r\n:]*(?::(?![: \t\r\n]))?)*(?=\s*:(?:\s|$))/m,
            alias: 'property'
        },
        'directive': { pattern: /^%\w+.*$/m, alias: 'keyword' },
        'string': [
            { pattern: /"(?:\\.|[^"\\\r\n])*"/, greedy: true },
            { pattern: /'(?:''|[^'])*'/, greedy: true }
        ],
        'boolean': /\b(?:true|false|yes|no|on|off)\b/i,
        'null': { pattern: /\b(?:null|~)\b/i, alias: 'builtin' },
        'number': /[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)\b/i,
        'tag': /![^\s]+/,
        'anchor': /[&*]\w+/,
        'punctuation': /---|\.{3}|[:\-[\]{}|>?,]/
    };
    _.languages.yml = _.languages.yaml;

    return _;
})();

// Auto-highlight on DOMContentLoaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!Prism.manual) {
            Prism.highlightAll();
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Prism;
}
