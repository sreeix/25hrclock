$(function  () {
  var startTime = new Date(Date.parse(window.localStorage['twentyfivehourclock_starttime'])) || defaultStart();


  $("#twentyfourhour").digitalclock();

  $("#twentyfivehour").digitalclock({
    getTimeArray : function  () {
      var now = new Date(),
          elapsedHours = (now - startTime) / 3600000;
      return [(elapsedHours+ startTime.getHours() )% 25, now.getMinutes(), now.getSeconds(), now.getMilliseconds()];
    }
  });

  $(".timeago").text(jQuery.timeago(startTime));
  $(".reset").click(function () {
    window.localStorage['twentyfivehourclock_starttime'] = new Date().toString();
  });

  $(".visibility").click(function (e) {
    var $this = $(this), $clock = $this.next();
    if($clock.is(":visible")){
      $clock.hide('slide');
      $this.text("Show");
    } else {
      $clock.show('slide');
      $this.text("Hide");
    }
  });

  var defaultStart = function today() {
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0)
    d.setSeconds(0);
    return d;
  }
})