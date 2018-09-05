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
      pathID = 'wave',
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
    animate: function(o) {
      var svgNS = this.ns.svgNS,
          xlink = this.ns.xlink,
          a = document.createElementNS(svgNS, "animate");
      if (o.hrf) {a.setAttributeNS(xlink, 'href', o.hrf);};
      a.setAttribute("attributeName", o.attrName);
      if (o.attrName == "offset") {
        a.setAttribute("values", o.values);
      } else if (o.attrName == "d") {
        a.setAttribute("from", o.from);
        a.setAttribute("to", o.to);
        a.setAttribute("repeatCount", o.repeat);
        a.setAttribute("keyTimes", o.kt);
        a.setAttribute("values", o.values);
      }
      a.setAttribute("dur", o.dur);
      a.setAttribute("begin", o.begin);
      a.setAttribute("fill", o.fill);
      return a;
    },
    linearGradient: function(id) {
      var svgNS = this.ns.svgNS,
          lg = document.createElementNS(svgNS, "linearGradient"),
          s1 = this.stop(),
          s2 = this.stop(),
          a1 = this.animate({
            attrName: "offset",
            values: "0;1",
            dur: "3s",
            begin: "3s",
            fill: "freeze"
          }),
          a2 = this.animate({
            attrName: "offset",
            values: "0;1",
            dur: "3s",
            begin: "3s",
            fill: "freeze"
          });
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
    }
  }

  var utils = {
    getXY: function(d, r) {
      var xy = new Object();
      xy['x'] = new Array();
      xy['y'] = new Array();
      do {
        m = r.exec(d);
        if (m) {
            xy['x'].push(parseInt(m[1]));
            xy['y'].push(parseInt(m[2]));
        }
      } while (m);
      return xy;
    },
    createPath: function(x, y) {
      d = new String();
      for (var i = 0; i < x.length; i++) {
        d += (i == 0) ? 'M ' + x[i] + ',' + y[i] : ' L' + x[i] + ',' + y[i]
      }
      return d;
    },
    computePathForAnimation: function(d) {
      var regx = /\s(\d+),(\d+)/g,
          xy = this.getXY(d, regx),
          py,
          oy,
          newY = new Array();
          x = xy.x;
          y = xy.y;
          y.forEach(function(cy, i, ay) {
            var sy = ay[0],
                ty = 0;
            if (i > 0) {
              py = ay[i - 1];
              oy = sy - cy
              ty = (2 * (sy - cy)) + cy
            }
            newY[i] = (i == 0) ? cy : ty;
          });
      d = this.createPath(x, newY);
      return d;
    }
  }

  function convertToSVG() {
    p = context.getSVG().lastChild;
    var attributes = p.attributes,
        attrs = {};
    for (var i = 0; i < attributes.length; i++) {
      attrs[attributes[Object.keys(attributes)[i]].nodeName] = attributes[Object.keys(attributes)[i]].value;
    }
    attrs['id'] = pathID;
    var svg = create.svg(),
        lg = create.linearGradient(lgID),
        defs = create.defs(),
        path = create.path(attrs),
        fromD = attrs.d,
        toD = utils.computePathForAnimation(attrs.d),
        v = fromD + ";" + toD + ";" + fromD,
        animate = create.animate({
          attrName: 'd',
          dur: '2s',
          begin: '7s',
          from: fromD,
          to: toD,
          repeat: 'indefinite',
          fill: 'remove',
          kt: "0;0.5;1",
          values:  v
        });
    defs.appendChild(lg);
    svg.appendChild(defs);
    path.appendChild(animate);
    svg.appendChild(path);
    svgRoot.appendChild(svg);
  }

  init();

}, false); }

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:
