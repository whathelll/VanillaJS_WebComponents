1. show the finished name card

2. Start with a simple empty custom element and see what it means.
```
     var MyCard = window.document.registerElement('my-card');
     var myCard = new MyCard();
     myCard.innerHTML = "inserted by js";
     document.body.appendChild(myCard);
```

alternative form
```
    var MyCard = window.document.registerElement('my-card', {
        prototype: Object.create(HTMLElement.prototype)
    });
    var myCard = new MyCard();
    myCard.innerHTML = "inserted by js";
    document.body.appendChild(myCard);
```

extending a button
```
    var MyCard = window.document.registerElement('my-card', {
        prototype: Object.create(HTMLButtonElement.prototype),
        extends: 'button'
    });
    var myCard = new MyCard();
    myCard.innerHTML = "inserted by js";
    document.body.appendChild(myCard);
```


3. Add a person property which determine's it's inner html, "My name is:" + first name + last name

```

    var weakmap = new WeakMap();
    var myCardProtoType = Object.create(HTMLElement.prototype, {
        testValue: {
            writable: true,
            value: 1,
        },
        person: {
            enumerable: true,
            get: function() {
                return weakmap.get(this);
            },
            set: function(newValue) {
                weakmap.set(this, newValue);
                this.innerHTML = "My name is <strong>" + newValue.firstName + " " + newValue.lastName + "</strong>";
            }
        }
    });


    var MyCard = window.document.registerElement('my-card', {
        prototype: myCardProtoType,
    });
    var myCard = new MyCard();
    myCard.id = "testEl";
    myCard.innerHTML = "inserted by js";

    document.body.appendChild(myCard);
```

4. What about observing value changes?

```
    var weakmap = new WeakMap();
    var observermap = new WeakMap();
    var writeContent = function(newValue) {
        this.innerHTML = "My name is <strong>" + newValue.firstName + " " + newValue.lastName + "</strong>";
    }
    var myCardProtoType = Object.create(HTMLElement.prototype, {
        testValue: {
            writable: true,
            value: 1,
        },
        person: {
            enumerable: true,
            get: function() {
                return weakmap.get(this);
            },
            set: function(newValue) {
                var el = this;
                var update = function (changes) {
                    writeContent.call(el, newValue);
                };
                var prevVal = weakmap.get(this);
                if (prevVal) {
                    Object.unobserve(prevVal, observermap.get(this));
                }
                if (typeof newValue == "object") {
                    Object.observe(newValue, update);
                    observermap.set(this, update);
                }
                update();
                weakmap.set(this, newValue);
            }
        }
    });


    var MyCard = window.document.registerElement('my-card', {
        prototype: myCardProtoType,
    });
    var myCard = new MyCard();
    myCard.id = "testEl";
    myCard.innerHTML = "inserted by js";

    document.body.appendChild(myCard);

    myCard.person = person1;

    var myCard2 = new MyCard();
    document.body.appendChild(myCard2);
    myCard2.person = person1;
    
```


5. Shadow DOM?
```

    var weakmap = new WeakMap();
    var observermap = new WeakMap();
    var shadowmap = new WeakMap();
    var writeContent = function(newValue) {
        var shadowRoot = shadowmap.get(this);
        shadowRoot.innerHTML = "My name is <strong>" + newValue.firstName + " " + newValue.lastName + "</strong>";
    }
    var myCardProtoType = Object.create(HTMLElement.prototype, {
        testValue: {
            writable: true,
            value: 1,
        },
        person: {
            enumerable: true,
            get: function() {
                return weakmap.get(this);
            },
            set: function(newValue) {
                var el = this;
                var update = function (changes) {
                    writeContent.call(el, newValue);
                };
                var prevVal = weakmap.get(this);
                if (prevVal) {
                    Object.unobserve(prevVal, observermap.get(this));
                }
                if (typeof newValue == "object") {
                    Object.observe(newValue, update);
                    observermap.set(this, update);
                }
                update();
                weakmap.set(this, newValue);
            }
        },
        createdCallback: {
            value: function() {
                var shadowRoot = this.createShadowRoot()
                shadowmap.set(this, shadowRoot);
            }
        }
    });


    var MyCard = window.document.registerElement('my-card', {
        prototype: myCardProtoType,
    });
    var myCard = new MyCard();
    myCard.id = "testEl";
    myCard.innerHTML = "inserted by js";

    document.body.appendChild(myCard);

    myCard.person = person1;

    var myCard2 = new MyCard();
    document.body.appendChild(myCard2);
    myCard2.person = person1;
    
```


6. Bringing html templates into the picture
```

    var weakmap = new WeakMap();
    var observermap = new WeakMap();
    var shadowmap = new WeakMap();
    var writeContent = function(newValue) {
        //var shadowRoot = shadowmap.get(this);
        this.innerHTML = newValue.firstName + " " + newValue.lastName;
    }
    var myCardProtoType = Object.create(HTMLElement.prototype, {
        testValue: {
            writable: true,
            value: 1,
        },
        person: {
            enumerable: true,
            get: function() {
                return weakmap.get(this);
            },
            set: function(newValue) {
                var el = this;
                var update = function (changes) {
                    writeContent.call(el, newValue);
                };
                var prevVal = weakmap.get(this);
                if (prevVal) {
                    Object.unobserve(prevVal, observermap.get(this));
                }
                if (typeof newValue == "object") {
                    Object.observe(newValue, update);
                    observermap.set(this, update);
                }
                update();
                weakmap.set(this, newValue);
            }
        },
        createdCallback: {
            value: function() {
                var shadowRoot = this.createShadowRoot()
                var template = document.getElementById('my-card-template');
                var clone = document.importNode(template.content, true);
                shadowRoot.appendChild(clone);
            }
        }
    })

    var MyCard = window.document.registerElement('my-card', {
        prototype: myCardProtoType,
    });
    var myCard = new MyCard();
    myCard.id = "testEl";
    myCard.innerHTML = "inserted by js";

    document.body.appendChild(myCard);

    myCard.person = person1;

    var myCard2 = new MyCard();
    document.body.appendChild(myCard2);
    myCard2.person = person1;
    
```

7. html imports
```

    var weakmap = new WeakMap();
    var observermap = new WeakMap();
    var shadowmap = new WeakMap();
    var writeContent = function(newValue) {
        //var shadowRoot = shadowmap.get(this);
        this.innerHTML = newValue.firstName + " " + newValue.lastName;
    }
    var myCardProtoType = Object.create(HTMLElement.prototype, {
        testValue: {
            writable: true,
            value: 1,
        },
        person: {
            enumerable: true,
            get: function() {
                return weakmap.get(this);
            },
            set: function(newValue) {
                var el = this;
                var update = function (changes) {
                    writeContent.call(el, newValue);
                };
                var prevVal = weakmap.get(this);
                if (prevVal) {
                    Object.unobserve(prevVal, observermap.get(this));
                }
                if (typeof newValue == "object") {
                    Object.observe(newValue, update);
                    observermap.set(this, update);
                }
                update();
                weakmap.set(this, newValue);
            }
        },
        createdCallback: {
            value: function() {
                var shadowRoot = this.createShadowRoot()
                var link = document.querySelector('link[rel="import"]');
                var content = link.import;
                var template = content.getElementById('my-card-template');
                var clone = document.importNode(template.content, true);
                shadowRoot.appendChild(clone);
            }
        }
    });


    var MyCard = window.document.registerElement('my-card', {
        prototype: myCardProtoType,
    });
    var myCard = new MyCard();
    myCard.id = "testEl";
    myCard.innerHTML = "inserted by js";

    document.body.appendChild(myCard);

    myCard.person = person1;

    var myCard2 = new MyCard();
    document.body.appendChild(myCard2);
    myCard2.person = person1;
    
```
