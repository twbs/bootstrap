A dead simple way to do inheritance in JS.

    var inherits = require("inherits")

    function Animal () {
      this.alive = true
    }
    Animal.prototype.say = function (what) {
      console.log(what)
    }

    inherits(Dog, Animal)
    function Dog () {
      Dog.super.apply(this)
    }
    Dog.prototype.sniff = function () {
      this.say("sniff sniff")
    }
    Dog.prototype.bark = function () {
      this.say("woof woof")
    }

    inherits(Chihuahua, Dog)
    function Chihuahua () {
      Chihuahua.super.apply(this)
    }
    Chihuahua.prototype.bark = function () {
      this.say("yip yip")
    }

    // also works
    function Cat () {
      Cat.super.apply(this)
    }
    Cat.prototype.hiss = function () {
      this.say("CHSKKSS!!")
    }
    inherits(Cat, Animal, {
      meow: function () { this.say("miao miao") }
    })
    Cat.prototype.purr = function () {
      this.say("purr purr")
    }


    var c = new Chihuahua
    assert(c instanceof Chihuahua)
    assert(c instanceof Dog)
    assert(c instanceof Animal)

The actual function is laughably small.  10-lines small.
