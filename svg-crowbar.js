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

// Js module dependencies
const crowbar_deps = {
  _window: window,
  _document: document
}

const crowbar = (function(_deps) {
  
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
    let emptySvg = window.document.createElementNS( _prefix.svg, 'svg' );
    
    // add empty svg element
    window.document.body.appendChild(emptySvg);
    
    // retrieve the Svg Style
    return getComputedStyle(emptySvg); // window.getComputedStyle
  }
  
  // Document: represents any web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
  // describes the common properties and methods for any kind of document.
  // depending on the document's type (e.g. HTML, XML, SVG, ...)

  /**
   * 
   */
  function _initialize() {
    //console.log("initialize");

    let documents = [window.document], // creating array with the first element being the document itself
        SVGSources = [],
        iframes = document.querySelectorAll("iframe"), // getting all iframes
        objects = document.querySelectorAll("object"); // getting all objects
    
    // retrieve the Svg Style
    let emptySvgDeclarationComputed = _getEmtpySvgStyle();

    // for each document iframe, push to the documents array
    [].forEach.call(iframes, function(el) {
      try {
        if (el.contentDocument) {
          documents.push(el.contentDocument);
        }
      } catch(err) {
        console.log(err);
      }
    });

    // for each document object
    [].forEach.call(objects, function(el) {
      try {
        if (el.contentDocument) {
          documents.push(el.contentDocument);
        }
      } catch(err) {
        console.log(err);
      }
    });

    // for each documents
    documents.forEach(function(doc) {
      
      //
      let newSources = getSources(doc, emptySvgDeclarationComputed);

      // because of prototype on NYT pages
      for (let i = 0; i < newSources.length; i++) {
        SVGSources.push(newSources[i]);
      }

    });

    // creating the popOvers, or download if only one SVG source
    if (SVGSources.length > 1) {
      createPopover(SVGSources);
    } 
    else if (SVGSources.length > 0) {
      download(SVGSources[0]);
    } 
    else {
      alert("The Crowbar couldn’t find any SVG nodes.");
    }
  }

  /**
   * 
   */
  function createPopover(sources) {
    //console.log("createPopover");

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

    var buttonsContainer = document.createElement("div");
    document.body.appendChild(buttonsContainer);

    buttonsContainer.setAttribute("class", "svg-crowbar");
    buttonsContainer.style["z-index"] = 1e7;
    buttonsContainer.style["position"] = "absolute";
    buttonsContainer.style["top"] = 0;
    buttonsContainer.style["left"] = 0;

    var background = document.createElement("div");
    document.body.appendChild(background);

    background.setAttribute("class", "svg-crowbar");
    background.style["background"] = "rgba(255, 255, 255, 0.7)";
    background.style["position"] = "fixed";
    background.style["left"] = 0;
    background.style["top"] = 0;
    background.style["width"] = "100%";
    background.style["height"] = "100%";

    sources.forEach(function(d, i) {
      var buttonWrapper = document.createElement("div");
      buttonsContainer.appendChild(buttonWrapper);
      buttonWrapper.setAttribute("class", "svg-crowbar");
      buttonWrapper.style["position"] = "absolute";
      buttonWrapper.style["top"] = (d.top + document.body.scrollTop) + "px";
      buttonWrapper.style["left"] = (document.body.scrollLeft + d.left) + "px";
      buttonWrapper.style["padding"] = "4px";
      buttonWrapper.style["border-radius"] = "3px";
      buttonWrapper.style["color"] = "white";
      buttonWrapper.style["text-align"] = "center";
      buttonWrapper.style["font-family"] = "'Helvetica Neue'";
      buttonWrapper.style["background"] = "rgba(0, 0, 0, 0.8)";
      buttonWrapper.style["box-shadow"] = "0px 4px 18px rgba(0, 0, 0, 0.4)";
      buttonWrapper.style["cursor"] = "move";
      buttonWrapper.textContent =  "SVG #" + i + ": " + (d.id ? "#" + d.id : "") + (d.class ? "." + d.class : "");

      var button = document.createElement("button");
      buttonWrapper.appendChild(button);
      button.setAttribute("data-source-id", i);
      button.style["width"] = "150px";
      button.style["font-size"] = "12px";
      button.style["line-height"] = "1.4em";
      button.style["margin"] = "5px 0 0 0";
      button.textContent = "Download";

      button.onclick = function(el) {
        // console.log(el, d, i, sources)
        download(d);
      };

    });

  }

  /**
   * 
   */
  function cleanup() {
    //console.log("cleanup");

    var crowbarElements = document.querySelectorAll(".svg-crowbar");

    [].forEach.call(crowbarElements, function(el) {
      el.parentNode.removeChild(el);
    });
  }

  /**
   * 
   */
  function getSources(doc, emptySvgDeclarationComputed) {
    //console.log("getSources");

    let svgInfo = [],
        svgs = doc.querySelectorAll("svg"); // returns a static NodeList representing a list of the document's elements that match the specified group of selectors

    // for each SVG of the document (doc)
    [].forEach.call(svgs, function (svg) {

      svg.setAttribute("version", "1.1");

      // removing attributes so they aren't doubled up
      svg.removeAttribute("xmlns");
      svg.removeAttribute("xlink");

      // These are needed for the svg
      if (!svg.hasAttributeNS(_prefix.xmlns, "xmlns")) {
        svg.setAttributeNS(_prefix.xmlns, "xmlns", _prefix.svg);
      }

      if (!svg.hasAttributeNS(_prefix.xmlns, "xmlns:xlink")) {
        svg.setAttributeNS(_prefix.xmlns, "xmlns:xlink", _prefix.xlink);
      }

      setInlineStyles(svg, emptySvgDeclarationComputed);

      let source = (new XMLSerializer()).serializeToString(svg);
      let rect = svg.getBoundingClientRect();

      svgInfo.push({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        class: svg.getAttribute("class"),
        id: svg.getAttribute("id"),
        name: svg.getAttribute("name"),
        childElementCount: svg.childElementCount,
        source: [ _doctype + source ]
      });

    });

    return svgInfo;
  }

  /**
   * 
   */
  function download(source) {
    //console.log("download");

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
    //console.log("setInlineStyles");

    //
    function explicitlySetStyle (element) {
      //console.log("explicitlySetStyle");

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

    //
    function traverse(obj) {
      //console.log("traverse");

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

  // public domain
  return {
    initialize: _initialize
  }

}(crowbar_deps));

// run
crowbar.initialize();