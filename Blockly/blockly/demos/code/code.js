/**
 * Blockly Demos: Code
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Code = {};

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'en': 'English',
  'zh-hant': '正體中文',
  'zh-hans': '简体中文'
};

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if paramater not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function() {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to English.
    lang = 'en';
  }
  return lang;
};
/**
 * Get the Programming language of this user from the URL.
 * @return {int}  0: JavaScript   1:Python  2: Lua
 */
Code.getProgLang = function() {
  var code = Code.getStringParamFromUrl('code', '-1');
  if (code <= -1 || code > 2) {
    // Default to English.
    code = 1;
  }
  return code;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function() {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function() {
  // Store the blocks for the duration of the reload.
  // This should be skipped for the index page, which has no blocks and does
  // not load Blockly.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (typeof Blockly != 'undefined' && window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var languageMenu = document.getElementById('languageMenu');
  var newLang = encodeURIComponent(
      languageMenu.options[languageMenu.selectedIndex].value);
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
};

/**
 * Load the Prettify CSS and JavaScript.
 */
Code.importPrettify = function() {
  //<link rel="stylesheet" href="../prettify.css">
  //<script src="../prettify.js"></script>
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', '../prettify.css');
  document.head.appendChild(link);
  var script = document.createElement('script');
  script.setAttribute('src', '../prettify.js');
  document.head.appendChild(script);
};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = Code.getLang();

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function() {
  Code.initLanguage();
  
  // 指定使用的程式語言, 從URL參數code取得
  languageDropdown.selectedIndex  = Code.getProgLang();
  
  var rtl = Code.isRtl();

  // Interpolate translated messages into toolbox.
  var toolboxText = document.getElementById('toolbox').outerHTML;
  toolboxText = toolboxText.replace(/{(\w+)}/g,
      function(m, p1) {return MSG[p1]});
  var toolboxXml = Blockly.Xml.textToDom(toolboxText);
  
  Code.workspace = Blockly.inject('blocklyDiv',
      {rtl: rtl,toolbox: toolboxXml}
      );

  Code.loadBlocks('');

  languageDropdown.addEventListener('change', Code.myUpdateFunction, true);
  Code.workspace.addChangeListener(Code.myUpdateFunction);

  // Init load event.
  var loadInput = document.getElementById('load');
  loadInput.addEventListener('change', Code.load, false);
  document.getElementById('loadXmlButton').onclick = function() {
    loadInput.click();
  };  
};

Code.saveToFile = function() {
  var filename;
  // alert(Code.LANG);
  if (Code.LANG == "en")
      filename = prompt("Please enter the filename", "Blockly");
  else
      filename = prompt("請輸入程式語言的檔案名稱", "Blockly");
  if( filename == null ) return;
  var fileExt = ".txt";
  var languageDropdown = document.getElementById('languageDropdown');
  var languageSelection = languageDropdown.options[languageDropdown.selectedIndex].value;
  
  if( languageSelection === "JavaScript") {
    fileExt = ".js";
  } else if( languageSelection === "Python") {
    fileExt = ".py";
  } else if( languageSelection === "Lua") {
    fileExt = ".lua";
  }
  var code = document.createTextNode(Blockly[languageSelection].workspaceToCode(Code.workspace));
  var blob = new Blob([code.data], {type: "text/plain;charset=utf-8"});
  if( blob.size != 0 )
    saveAs(blob, filename + fileExt);
};

Code.saveBlocksToXml = function() {
  var filename;
  if (Code.LANG == "en")
     filename = prompt("Please enter the filename", "Blockly");
  else 
     filename = prompt("請輸入積木程式的檔案名稱", "Blockly");
  var xml = Blockly.Xml.workspaceToDom(Code.workspace);

  if( filename == null ) return;
  var fileExt = ".xml";

  var xml_text = Blockly.Xml.domToPrettyText(xml);
  //save the DOM
  var blob = new Blob([xml_text], {type: "text/plain;charset=utf-8"});
  if( blob.size != 0 )
    saveAs(blob, filename + fileExt);
};

/**
 * Load blocks from local file.
 */
Code.load = function(event) {
  var files = event.target.files;
  // Only allow uploading one file.
  if (files.length != 1) {
    return;
  }

  // FileReader
  var reader = new FileReader();
  reader.onloadend = function(event) {
    var target = event.target;
    // 2 == FileReader.DONE
    if (target.readyState == 2) {
      try {
        var xml = Blockly.Xml.textToDom(target.result);
      } catch (e) {
        if (Code.LANG == "en")
            alert('Error parsing XML:\n' + e);
        else 
            alert('剖析XML錯誤:\n' + e);
        return;
      }
      var count = Blockly.mainWorkspace.getAllBlocks().length;
      var loadMsg;
      if (Code.LANG == "en")
         loadMsg = 'Replace existing blocks?\n"Cancel" will merge.';
      else
         loadMsg = '確認取代存在的積木?\n按"取消"鈕是合併積木.';
      if (count && confirm(loadMsg)) {
         Blockly.mainWorkspace.clear();
      }
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('load').value = '';
  };
  reader.readAsText(files[0]);
}

Code.myUpdateFunction = function(event) {
  var languageDropdown = document.getElementById('languageDropdown');
  var languageSelection = languageDropdown.options[languageDropdown.selectedIndex].value;
  var codeDiv = document.getElementById('codeDiv');
  var codeHolder = document.createElement('pre');
  codeHolder.className = 'prettyprint but-not-that-pretty';
  var code = document.createTextNode(Blockly[languageSelection].workspaceToCode(Code.workspace));
  codeHolder.appendChild(code);
  codeDiv.replaceChild(codeHolder, codeDiv.lastElementChild);
  prettyPrint();
};

Code.executeBlockCode = function() {
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  var initFunc = function(interpreter, scope) {
    var alertWrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(alert(text));
    };
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(alertWrapper));
    var promptWrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
        interpreter.createNativeFunction(promptWrapper));
  };
  var myInterpreter = new Interpreter(code, initFunc);
  var stepsAllowed = 10000;
  while (myInterpreter.step() && stepsAllowed) {
    stepsAllowed--;
  }
  if (!stepsAllowed) {
    throw EvalError('Infinite loop.');
  }
};
  
/**
 * Initialize the page language.
 */
Code.initLanguage = function() {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function(a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // Populate the language selection menu.
  var languageMenu = document.getElementById('languageMenu');
  languageMenu.options.length = 0;
  for (var i = 0; i < languages.length; i++) {
    var tuple = languages[i];
    var lang = tuple[tuple.length - 1];
    var option = new Option(tuple[0], lang);
    if (lang == Code.LANG) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  languageMenu.addEventListener('change', Code.changeLanguage, true);
  document.getElementById('playButton').addEventListener('click', Code.executeBlockCode);
  document.getElementById('saveButton').addEventListener('click', Code.saveToFile);
  document.getElementById('saveBlockButton').addEventListener('click', Code.saveBlocksToXml);
};

// Load the Code demo's language strings.
document.write('<script src="msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="../../msg/js/' + Code.LANG + '.js"></script>\n');

window.addEventListener('load', Code.init);