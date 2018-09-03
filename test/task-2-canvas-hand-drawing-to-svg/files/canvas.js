/* © 2009 ROBO Design
 * http://www.robodesign.ro
 */

// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
  var canvas,
      cw,
      ch,
      svgRoot,
      context,
      tool,
      lgID = 'paint';

  function init () {
    svgRoot = document.getElementById('svgRoot');
    context = new CanvasSVG.Deferred();
    // Find the canvas element.
    canvas = document.getElementById('imageView');
    cw = canvas.width;
    ch = canvas.height;
    context.wrapCanvas(canvas);
    if (!canvas) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvas.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    context = canvas.getContext('2d');
    context.lineWidth = 1;
    if (!context) {
      alert('Error: failed to getContext!');
      return;
    }

    // Pencil tool instance.
    tool = new tool_pencil();

    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);
  }

  function resetCanvas() {
    context.clearRect(0, 0, cw, ch);
  }

  function resetSVG() {
    svgRoot.innerHTML = '';
  }

  // This painting tool works like a drawing pencil which tracks the mouse
  // movements.
  function tool_pencil () {
    var tool = this;
    this.started = false;

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
      resetCanvas();
      resetSVG();
      context.beginPath();
      context.moveTo(ev._x, ev._y);
      tool.started = true;
    };

    // This function is called every time you move the mouse. Obviously, it only
    // draws if the tool.started state is set to true (when you are holding down
    // the mouse button).
    this.mousemove = function (ev) {
      if (tool.started) {
        context.lineTo(ev._x, ev._y);
        context.stroke();
        resetSVG();
        convertToSVG();
      }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
      }
    };
  }

  // The general-purpose event handler. This function just determines the mouse
  // position relative to the canvas element.
  function ev_canvas (ev) {
    if (ev.layerX || ev.layerX == 0) { // Firefox
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;
    }

    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
      func(ev);
    }
  }

  var create = {
    ns: {
      svgNS: "http://www.w3.org/2000/svg",
      xmlNS: "http://www.w3.org/2000/xmlns/",
      xlink: "http://www.w3.org/1999/xlink"
    },
    svg: function() {
      var svgNS = this.ns.svgNS,
          xmlNS = this.ns.xmlNS,
          xlink = this.ns.xlink,
          s = document.createElementNS(svgNS, "svg");
      s.setAttributeNS(xmlNS, "xmlns:xlink", xlink);
      s.setAttribute('width', cw);
      s.setAttribute('height', ch);
      return s;
    },
    path: function(a) {
      var svgNS = this.ns.svgNS,
          p = document.createElementNS(svgNS, "path");
      Object.keys(a).forEach(
        function(attr) { p.setAttribute(attr, (attr == "stroke") ? "url(#" + lgID + ")" : a[attr]);}
      );
      return p;
    },
    defs: function() {
      var svgNS = this.ns.svgNS;
      return document.createElementNS(svgNS, "defs");
    },
    stop: function() {
      var svgNS = this.ns.svgNS;
      return document.createElementNS(svgNS, "stop");
    },
    animateGrad: function(d, b, f) {
      var svgNS = this.ns.svgNS,
          a = document.createElementNS(svgNS, "animate");
      a.setAttribute("attributeName", "offset");
      a.setAttribute("values", "-1;2");
      a.setAttribute("dur", d);
      a.setAttribute("begin", b);
      a.setAttribute("fill", f);
      return a;
    },
    linearGradient: function(id) {
      var svgNS = this.ns.svgNS,
          lg = document.createElementNS(svgNS, "linearGradient"),
          s1 = this.stop(),
          s2 = this.stop(),
          a1 = this.animateGrad("3s", "3s", "freeze"),
          a2 = this.animateGrad("3s", "3s", "freeze");
      lg.setAttribute("id", id);
      s1.setAttribute("offset", "-1");
      s1.setAttribute("stop-color", "#0ff");
      s1.appendChild(a1);
      s2.setAttribute("offset", "-1");
      s2.setAttribute("stop-color", "#000");
      s2.appendChild(a2);
      lg.appendChild(s1);
      lg.appendChild(s2);
      return lg;
    },
  }

  function convertToSVG() {
    p = context.getSVG().lastChild;
    var attributes = p.attributes;
    var attrs = {};
    for (var i = 0; i < attributes.length; i++) {
      attrs[attributes[Object.keys(attributes)[i]].nodeName] = attributes[Object.keys(attributes)[i]].value;
    }
    var svg = create.svg();
    var lg = create.linearGradient(lgID);
    var defs = create.defs();
    defs.appendChild(lg);
    svg.appendChild(defs);
    var path = create.path(attrs);
    svg.appendChild(path);
    svgRoot.appendChild(svg);
  }

  init();

}, false); }

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:
