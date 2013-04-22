;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "digitalclock",
        defaults = {
            digitClasses:  ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
            getTimeArray: function(){
              var dat = new Date();
              return [dat.getHours(), dat.getMinutes(), dat.getSeconds(), dat.getMilliseconds()];
              }
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var $digit;

            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            $(this.element).append('<span class="digit"></span>    <span class="digit"></span>    <span class="colon"></span>    <span class="digit"></span>    <span class="digit"></span>    <span class="colon"></span>    <span class="digit"></span>    <span class="digit"></span>');
            $digit = $(this.element).find('.digit');

            this.hour = [$($digit[0]), $($digit[1])];
            this.min  = [$($digit[2]), $($digit[3])];
            this.sec  = [$($digit[4]), $($digit[5])];
            this.drawInterval(this.drawSecond, function(time){
              return 1000 - time[3];
            });

            this.drawInterval(this.drawMinute, function(time){
              return 60000 - time[2] * 1000 - time[3];
            })

           this.drawInterval(this.drawHour, function(time){
              return (60 - time[1]) * 60000 - time[2] * 1000 - time[3];
            });
        },

        drawInterval : function(func, timeCallback){
          var time = this.options.getTimeArray();

          func.call(this, time);

          var that = this;
          setTimeout(function(){
            that.drawInterval(func, timeCallback);
          }, timeCallback(time));
        },

        drawHour : function(time){
          this.drawDigits(this.hour, time[0]);
        },

        drawMinute : function(time){
          this.drawDigits(this.min,  time[1]);
        },

        drawSecond : function(time){
          this.drawDigits(this.sec,  time[2]);
        },

        drawDigits : function(digits, digit){
          var ten = Math.floor(digit / 10);
          var one = Math.floor(digit % 10);
          digits[0].attr('class', 'digit '+this.options.digitClasses[ten]);
          digits[1].attr('class', 'digit '+this.options.digitClasses[one]);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );