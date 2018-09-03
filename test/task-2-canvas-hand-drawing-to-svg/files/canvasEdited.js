/* © 2009 ROBO Design
 * http://www.robodesign.ro
 */

// Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
  window.addEventListener(
    "load",
    function() {
      var canvas,
        context,
        tool,
        cw,
        ch,
        rad = Math.PI / 180,
        w = 0,
        h = 12,
        cx,
        cy,
        px,
        py,
        amplitude = h,
        frequency = 0.07,
        phi = 0,
        frames = 0,
        dt = 1,
        initId;
      //intId = window.setInterval(draw, 10 * dt);

      function init() {
        // Find the canvas element.
        canvas = document.getElementById("imageView");
        cw = canvas.width;
        ch = canvas.height;
        if (!canvas) {
          alert("Error: I cannot find the canvas element!");
          return;
        }

        if (!canvas.getContext) {
          alert("Error: no canvas.getContext!");
          return;
        }

        // Get the 2D canvas context.
        context = canvas.getContext("2d");
        if (!context) {
          alert("Error: failed to getContext!");
          return;
        }

        // Pencil tool instance.
        tool = new tool_pencil();

        // Attach the mousedown, mousemove and mouseup event listeners.
        canvas.addEventListener("mousedown", ev_canvas, false);
        canvas.addEventListener("mousemove", ev_canvas, false);
        canvas.addEventListener("mouseup", ev_canvas, false);
      }

      // This painting tool works like a drawing pencil which tracks the mouse
      // movements.
      function tool_pencil() {
        var tool = this;
        this.started = false;

        // This is called when you start holding down the mouse button.
        // This starts the pencil drawing.
        this.mousedown = function(ev) {
          //context.moveTo(ev._x, ev._y);
          px = ev._x;
          py = ev._y;
          console.log(px + ' ' + py);
          startDrawing();
          tool.started = true;
        };

        // This function is called every time you move the mouse. Obviously, it only
        // draws if the tool.started state is set to true (when you are holding down
        // the mouse button).
        this.mousemove = function(ev) {
          if (tool.started) {
            //updatePosition();
          }
        };

        // This is called when you release the mouse button.
        this.mouseup = function(ev) {
          if (tool.started) {
            window.clearInterval(initId);
            initId = null;
          }
        };
      }

      function draw() {
        context.beginPath();
        context.strokeStyle = "hsl(" + frames + ",100%,-50%)";
        context.moveTo(px, py);
        w += dt;
        step();
        context.lineTo(px, py);
        if (w > cw-5) {
          window.clearInterval(initId);
          initId = null;
        }
        context.stroke();
      }

      function step() {
        frames++;
        phi = frames / 5;
        py = Math.sin(w * frequency + -phi) * amplitude / 1 + amplitude / 1;
        px = w;
      }

      // The general-purpose event handler. This function just determines the mouse
      // position relative to the canvas element.
      function ev_canvas(ev) {
        if (ev.layerX || ev.layerX == 0) {
          // Firefox
          ev._x = ev.layerX;
          ev._y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) {
          // Opera
          ev._x = ev.offsetX;
          ev._y = ev.offsetY;
        }

        // Call the event handler of the tool.
        var func = tool[ev.type];
        if (func) {
          func(ev);
        }
      }
      
      function startDrawing() {
        //alert(initId);
        if (!initId) {
          initId = window.setInterval(draw, 10 * dt)
        }
      }
      
      function stopDrawing() {
        if (initId) {
          initId = window.clearInterval(draw);
          initId = null;
        }
      }

      init();
    },
    false
  );
}

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:

