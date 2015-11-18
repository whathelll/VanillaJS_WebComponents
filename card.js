window.onload = function() {
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
};


(function() {
    var Person = function(first, last) {
        this.firstName = first;
        this.lastName = last;
    }

    window.person1 = new Person("Michael", "Jordan");
    window.person2 = new Person("Lebron", "James");


})();




//var MyElement = (function() {
//    function MyElement() {}
//    var indexTable = new WeakMap;
//    MyElement.prototype = {
//        __proto__: HTMLElement.prototype,
//        get index() {
//            return indexTable.get(this);
//        },
//        set index(value) {
//            indexTable.set(this, value);
//        }
//    };
//    return document.register('my-element', MyElement);
//})();
