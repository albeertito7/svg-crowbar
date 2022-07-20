/**
 * Javascript module pattern: tp wrap a set of variables and functions together in a single scope.
 * used to define objects and specify the variables and the functions that can be accessed from outside the scope of the function.
 * expose certain properties and function s as public and can also restrict the scope of some within the object itself, making them private.
 *
 * 
 * NodeList: collections of nodes, usually returned by properties such as Node.childNodes and methods such as document.querySelectorAll().
 * 
 * Node: is an abstract base class upon which many other DOM API objects are based, thus letting those object types to be used similary and often interchangeably.
 * as an abstract class, there is no such thing as a plain Node object.
 * all objects that implement Node functionality are based on one of its sublaclasses.
 * most notable are Document, Element, and DocumentFragment.
 * 
 * 
 */

/**
 * @link          https://albeertito7.github.com
 * @since         1.0.0
 * @module        crowbar
 * @author        albeertito7 <albertperezdatsira@gmail.com>
 * @author_uri    https://albeertito7.github.io
 * @license       MIT
 * @description
 */

// Js module dependencies
const crowbar_deps = {
  _window: window,
  _document: document
}

const crowbar = (function(_deps) {
  
  // static properties
  let _doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
      _prefix = {
        svg: "http://www.w3.org/2000/svg",
        xlink: "http://www.w3.org/1999/xlink",
        xmlns: "http://www.w3.org/2000/xmlns/"
      };
    
  window.URL = (window.URL || window.webkitURL);

  /**
   * To get the base SVG Empty Styles from the page browser.
   */
  function _getEmtpySvgStyle() {
    
    // create element specifying a namespace URI
    // namespaceURI => a string to associate with the element
    let empty_svg = window.document.createElementNS( _prefix.svg, 'svg' );

    // retrieve the Svg Style
    return window.getComputedStyle(empty_svg);
  }
  
  // Document: represents any web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
  // describes the common properties and methods for any kind of document.
  // depending on the document's type (e.g. HTML, XML, SVG, ...)

  /**
   * The JS module bootsraps method.
   */
  function _initialize() {

    let documents = [window.document], 
        iframes = document.querySelectorAll("iframe"),      // getting all iframes
        objects = document.querySelectorAll("object"),      // getting all objects
        emptySvgDeclarationComputed = _getEmtpySvgStyle();  // retrieve the Svg base Style

    //get documents
    //get sources from documents
    let SVGSources = getSources(window.document, emptySvgDeclarationComputed);

    // retrieving the required documents
    SVGSources = [...iframes, ...objects].reduce(function(filtered, element) {
      if (element.contentDocument) {
          let newSources = getSources(element.contentDocument, emptySvgDeclarationComputed);
          filtered = filtered.concat(newSources);
      }
      return filtered;
    }, SVGSources);

    console.log(SVGSources);

    // halting case
    if (!SVGSources.length) {
      alert("The Crowbar couldn’t find any SVG nodes.");
    }

    createPopover(SVGSources);

  }

  /**
   * 
   */
  function createPopover(sources) {

    cleanup();

    sources.forEach(function(s1) {
      sources.forEach(function(s2) {
        if (s1 !== s2) {
          if ((Math.abs(s1.top - s2.top) < 38) && (Math.abs(s1.left - s2.left) < 38)) {
            s2.top += 38;
            s2.left += 38;
          }
        }
      });
    });

    let buttonsContainer = document.createElement("div"); // <div> <!-- main buttons container -->
    buttonsContainer.setAttribute("class", "svg-crowbar");
    document.body.appendChild(buttonsContainer);

    // positioning
    buttonsContainer.classList.add("crowbar-container");
    buttonsContainer.style["z-index"] = 999999;//1e7;
    buttonsContainer.style["position"] = "absolute";
    buttonsContainer.style["top"] = 0;
    buttonsContainer.style["left"] = 0;

    let background = document.createElement("div"); // <div> <!-- opacity background -->
    background.setAttribute("class", "svg-crowbar");
    document.body.appendChild(background);

    background.classList.add("crowbar-background");
    background.style["background"] = "rgba(255, 255, 255, 0.7)";
    background.style["z-index"] = 999998;
    background.style["position"] = "fixed";
    background.style["left"] = 0;
    background.style["top"] = 0;
    background.style["width"] = "100%";
    background.style["height"] = "100%";

    sources.forEach(function(d, i) {
      
      let buttonWrapper = document.createElement("div"); // <div>
      buttonWrapper.setAttribute("class", "svg-crowbar");
      buttonsContainer.appendChild(buttonWrapper);

      buttonWrapper.classList.add("crowbar-btn-wrapper");
      buttonWrapper.style["position"] = "absolute";
      buttonWrapper.style["top"] = (d.top + document.body.scrollTop) + "px";
      buttonWrapper.style["left"] = (document.body.scrollLeft + d.left) + "px";
      buttonWrapper.style["padding"] = "4px";
      buttonWrapper.style["border-radius"] = "3px";
      buttonWrapper.style.setProperty("color", "white", "important");
      buttonWrapper.style.setProperty("text-align", "center", "important");
      buttonWrapper.style["font-family"] = "'Helvetica Neue'";
      buttonWrapper.style.setProperty("background", "rgba(0, 0, 0, 0.8)", "important");
      buttonWrapper.style["box-shadow"] = "0px 4px 18px rgba(0, 0, 0, 0.4)";
      buttonWrapper.style["cursor"] = "move";
      buttonWrapper.textContent =  "SVG #" + i + ": " + (d.id ? "#" + d.id : "") + (d.class ? "." + d.class : "");

      let button = document.createElement("button");
      buttonWrapper.appendChild(button);

      button.setAttribute("data-source-id", i);
      button.style["width"] = "130px";
      button.style["font-size"] = "12px";
      button.style["line-height"] = "1.4em";
      button.style["margin"] = "5px 0 0 0";
      button.style.setProperty("color", "black", "important");
      button.style["cursor"] = "pointer";
      button.style.setProperty("background", "rgba(255, 255, 255, 0.9)", "important");
      button.textContent = "Download";

      let cross = document.createElement("div");
      cross.setAttribute("class", "crowbar-cross");
      buttonWrapper.appendChild(cross);
      cross.style["width"] = "20px";
      cross.style["font-size"] = "12px";
      cross.style["line-height"] = "1.4em";
      cross.style["margin"] = "5px 0 0 0";
      cross.style.setProperty("color", "black", "important");
      cross.style["cursor"] = "pointer";
      cross.style.setProperty("background", "rgba(255, 255, 255, 0.9)", "important");
      cross.textContent = "X";

      let show = document.createElement("div");
      show.setAttribute("class", "crowbar-show");
      buttonWrapper.appendChild(show);
      show.style["width"] = "40px";
      show.style["font-size"] = "12px";
      show.style["line-height"] = "1.4em";
      show.style["margin"] = "5px 0 0 0";
      show.style.setProperty("color", "black", "important");
      show.style["cursor"] = "pointer";
      show.style.setProperty("background", "rgba(255, 255, 255, 0.9)", "important");
      show.textContent = "Show";

      _dragElement(buttonWrapper);

      button.onclick = function() {
        download(d);
      };

      cross.onclick = function() {
        $(this).parent().remove();
      };

      show.onclick = function () {
        console.log(d.source);
      };

    });

  }

  /**
   * Removes the DOM .svg-crowbar already created elements, so that
   * a new set can be raised.
   */
  function cleanup() {

    let crowbarElements = document.querySelectorAll(".svg-crowbar");

    [...crowbarElements].forEach((element) => {
      element.parentNode.removeChild(element);
    });
  }

  /**
   * 
   */
  function getSources(document, emptySvgDeclarationComputed) {

    let svgInfo = [],
        svgs = document.querySelectorAll("svg"); // returns a static NodeList representing a list of the document's elements that match the specified group of selectors

    [...svgs].forEach((svg) => {

      svg.setAttribute("version", "1.1");
      
      // removing attributes so they aren't doubled up
      svg.removeAttribute("xmlns");
      svg.removeAttribute("xlink");

      // these are needed for the svg
      if (!svg.hasAttributeNS(_prefix.xmlns, "xmlns")) {
        svg.setAttributeNS(_prefix.xmlns, "xmlns", _prefix.svg);
      }

      if (!svg.hasAttributeNS(_prefix.xmlns, "xmlns:xlink")) {
        svg.setAttributeNS(_prefix.xmlns, "xmlns:xlink", _prefix.xlink);
      }

      //
      setInlineStyles(svg, emptySvgDeclarationComputed);

      let source = (new XMLSerializer()).serializeToString(svg),
          rect = svg.getBoundingClientRect(); // returns a DOMRect object providing information about the size of an element and its position relative to the viewport

      svgInfo.push({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        id: svg.getAttribute("id"),
        class: svg.getAttribute("class"),
        name: svg.getAttribute("name"),
        childElementCount: svg.childElementCount,
        source: [ _doctype + source ]
      });

    });

    return svgInfo;
        
  }

  /**
   * Downloads a specific svg source file.
   */
  function download(source) {

    let filename = "untitled";

    if (source.name) {
      filename = source.name;
    } else if (source.id) {
      filename = source.id;
    } else if (source.class) {
      filename = source.class;
    } else if (window.document.title) {
      filename = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }

    let url = window.URL.createObjectURL(new Blob(source.source, { "type" : "text\/xml" }));

    let a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("class", "svg-crowbar");
    a.setAttribute("download", filename + ".svg");
    a.setAttribute("href", url);
    a.style["display"] = "none";
    a.click();

    setTimeout(function() {
      window.URL.revokeObjectURL(url);
    }, 10);
  }

  /**
   * 
   */
  function setInlineStyles(svg, emptySvgDeclarationComputed) {

    /**
     * 
     */
    function explicitlySetStyle (element) {

      let cSSStyleDeclarationComputed = getComputedStyle(element);
      let i, len, key, value;
      let computedStyleStr = "";
      for (i=0, len=cSSStyleDeclarationComputed.length; i<len; i++) {
        key=cSSStyleDeclarationComputed[i];
        value=cSSStyleDeclarationComputed.getPropertyValue(key);
        if (value!==emptySvgDeclarationComputed.getPropertyValue(key)) {
          computedStyleStr+=key+":"+value+";";
        }
      }
      element.setAttribute('style', computedStyleStr);
    }

    /**
     * 
     */
    function traverse(obj) {

      let tree = [];
      tree.push(obj);
      visit(obj);
      function visit(node) {
        if (node && node.hasChildNodes()) {
          let child = node.firstChild;
          while (child) {
            if (child.nodeType === 1 && child.nodeName != 'SCRIPT'){
              tree.push(child);
              visit(child);
            }
            child = child.nextSibling;
          }
        }
      }
      return tree;
    }
    
    // hardcode computed css styles inside svg
    let allElements = traverse(svg);
    let i = allElements.length;

    while (i--) {
      explicitlySetStyle(allElements[i]);
    }
  }

  function _dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    /*if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {*/
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    //}
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  // public domain
  return {
    initialize: _initialize
  }

}(crowbar_deps));

crowbar.initialize();