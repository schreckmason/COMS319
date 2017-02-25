$(document).ready(function(){
   
   $('p').eq(3).hide();//hide effect
   
   $('#hideShow').click(function () {//click event
      $('#dinnerTable').toggle(2000);//toggle effect
   });
   
   $('p').eq(0)click(function () {//click event
      $('p').slideUp(400);//slideUp effect
   })
   $('p').eq(1).click(function () {//click event
      $('p').css('color', 'red');//color css
   })
   
   $('#dinnerTable').click(function () {//click event
      $('p').eq(3).show();//show effect
      $('p').fadeTo(1000,0.5);//fadeTo effect
   });
   
   $('#dinnerTable').dblclick(function () {//dblclick event
      $('p').fadeIn(1500);//fadein effect
   });
   
   $('p').eq(3).mouseover(function () {//mouseover event
      $('p').eq(3).css('font-size', '80px');//font-size css
   });
   
   $('#dinnerTable').contextmenu(function () {//contextmenu event
      $('td').css('background-color', 'powderblue');//background-color css
      $('#dinnerTable').css('border', '6px dashed red');//border css
   });
   
   $("p").mousemove(function(event) {//mousmove event
      var msg = "Mouse moved to: (";
      msg += event.pageX + ", " + event.pageY + ")";
      $("p").eq(1).text(msg);
   });
   
   $('input').keydown(function(event) {//keypress event
      if(event.which%2){
         $('td').filter(':even').css('background-color', "#A2F4C6");//background-color css
      } else {
         $('td').filter(':odd').css('font-family', 'courier');//font-family css
      }
   });
});