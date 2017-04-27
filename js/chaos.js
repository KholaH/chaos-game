$(document).ready(function() {
   // varaiblea creation and initialization
    var canvasAspectRatio = 5/4;//2 / Math.sqrt(3);

    var canvas = document.getElementById('chaosCanvas');
    var canvasCtx = canvas.getContext('2d');

    var width = null;
    var height = null;
    var centerX = null;
    var centerY = null;
    var startPlot = null;
    var pts = null;

    var fromPoint = null;

    function widthToHeight(width) {
        return width * Math.sqrt(3) / 2;
    }
    function heightToWidth(height) {
        return height * 2 / Math.sqrt(3);
    }

    function initSize() {
        var calcWidth = $('#content').width();
        var calcHeight = $('html').height() - $('#userInput').height();

        /* Padding. */
        calcWidth = calcWidth;
        calcHeight = calcHeight - 50;

        /* Fix aspect ratio. */
        if (calcWidth / canvasAspectRatio > calcHeight) {
            calcWidth = calcHeight * canvasAspectRatio;
        } else if (calcHeight * canvasAspectRatio > calcWidth) {
            calcHeight = calcWidth / canvasAspectRatio;
        }

        /* Set canvas size. */
        $('#chaosCanvas').width(calcWidth);
        $('#chaosCanvas').height(calcHeight);
    }

    function initPoints(x1,y1,x2,y2,x3,y3) {

      width = x3;
      height = y3;
      canvas.width = x3;
      canvas.height = y3;

      if (widthToHeight(width) > height) {
          width = heightToWidth(height);
      } else if (heightToWidth(height) > width) {
          height = widthToHeight(width);
      }

        centerX = x1+x2+x3/ 3;
        centerY = y1+y2+y3/ 3;

        pts = [
          { x: x1, y: y1 },
          { x: x2, y: y2 },
          { x: x3, y: y3 }
        ]
    }

    function randomPoint(initX,initY) {
         var x = initX * width;
         var y = initY * height;

        /* Now, check if the point is in the rightmost triangle. */
        if (x/width > y/height) {
            /*
             * It is in the rightmost triangle. Then let us rotate
             * the point 180 degrees, so that it falls in the leftmost
             * triangle.
             */
            x = width - x;
            y = height - y;
        }

        /* Now we are left with points in a right isosceles triangle.
         * Transform to a point in a equilateral triangle.
         */
        x += (width / 2) * (height - y) / height;

        x = centerX - width/2 + x;
        y = centerY - height/2 + y;


        return { 'x': x, 'y': y };
    }

    $('#start').click(function() {
        // The three vertices for the triangle inputted by the user
          var x1 = $('#vx1').val();
          var y1 = $('#vy1').val();
          var x2 = $('#vx2').val();
          var y2 = $('#vy2').val();
          var x3 = $('#vx3').val();
          var y3 = $('#vy3').val();

          var initX =$('#currentX').val();
          var initY =$('#currentY').val();
          if(x1 === "" || y1 === "" || x2 === ""|| y2 === "" ||x3 === "" ||y3 === "" || initX === "" || initY === ""){
            $("#errorMsg").show();
          }
          else{
            $("#errorMsg").hide();
          }
          initSize();
          initPoints(x1,y1,x2,y2,x3,y3);
          fromPoint = randomPoint(initX,initY);
          startPlot = window.setInterval(function() {
              doPoints(300);
          }, 100);
      });

    function doPoints(count) {
        for (var i = 0; i < count; i++) {
            var targetPoint = pts[Math.floor(Math.random() * 3)];
            var pt = {
                'x': fromPoint.x + (targetPoint.x - fromPoint.x) / 2,
                'y': fromPoint.y + (targetPoint.y - fromPoint.y) / 2
            }
            canvasCtx.fillRect(Math.floor(pt.x), Math.floor(pt.y), 1, 1);
            fromPoint = pt;
        }
    }

    $(window).resize(initSize);


    $('#stop').click(function(){
      clearInterval(startPlot); // Ends plotting the points on canvas
    });
});
