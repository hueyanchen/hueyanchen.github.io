'use strict';
// Depending on the URL argument, render as LTR or RTL.
var rtl = (document.location.search == '?rtl');
var block = null;

function start() {
  Blockly.inject(document.getElementById('blocklyDiv'), 
      {
        path: '../', 
        toolbox: document.getElementById('toolbox')
      }
  );
  Blockly.addChangeListener(renderContent);
  Blockly.Blocks.CreateMainBlock();
}

function renderContent() {
  var content = document.getElementById('code');
  var code = Blockly.cake.workspaceToCode();
  content.textContent = code;
  if (typeof prettyPrintOne == 'function') {
    code = content.innerHTML;
    code = prettyPrintOne(code, 'c');
    content.innerHTML = code;
  }
}

/**
 * Discard all blocks from the workspace.
 */
function discard() {
  var count = Blockly.mainWorkspace.getAllBlocks().length;
  if (count < 2 || window.confirm("Remove all blocks?")) {
    Blockly.mainWorkspace.clear();
    Blockly.Blocks.CreateMainBlock();
    window.location.hash = '';
  }
}

/**
 * Insert terminal into page.
 * https://github.com/jcubic/jquery.terminal
 */
jQuery(function($, undefined) {
//    $('#terminal').terminal(function(command, term) {
//        if (command !== '') {
//            var result = window.eval(command);
//            if (result != undefined) {
//                term.echo(String(result));
//            }
//        }
//    }, {
//        greetings: 'Cake Console Terminal',
 //       name: 'js_demo',
 //       height: 0,
//        width: 0,
 //       prompt: 'cake> '});
});

/**
 * Save current codes into a *.c file.
 * https://github.com/eligrey/FileSaver.js
 */
function downloadCode() {
  var code = Blockly.cake.workspaceToCode();
  var codeArray = [];
  codeArray.push(code);
  console.log(code);
  var codeBlob = new Blob(codeArray, {type: "text/plain;charset=utf-8"});
  // alert(document.getElementById('program_name').value)
  var filename = document.getElementById('program_name').value;
  // alert(filename);
  if (filename) 
     filename = removeExtension(filename);
  else
     filename = "Example";
  var fileExt = ".c";
  
  saveAs(codeBlob, filename + fileExt);
}
// 刪除副檔名
function removeExtension(filename){
    var lastDotPosition = filename.lastIndexOf(".");
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
}

function saveXmlBlocks() {
  var filename = document.getElementById('program_name').value;
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  // alert(xml);
  if (filename) 
     filename = removeExtension(filename);
  else
     filename = "Blockly";
  var fileExt = ".xml";

  var xml_text = Blockly.Xml.domToPrettyText(xml);
  //save the DOM
  var blob = new Blob([xml_text], {type: "text/plain;charset=utf-8"});
  if( blob.size != 0 )
    saveAs(blob, filename + fileExt);
}

function loadXmlBlocks(){
    // Init load event.
   var loadInput = document.getElementById('load');
   loadInput.addEventListener('change', loadXmlDom, false);
   loadInput.click();
}

function loadXmlDom(event) {
  var files = event.target.files;
  // Only allow uploading one file.
  if (files.length != 1) {
    return;
  }
  var a = document.getElementById("program_name");
  a.value = removeExtension(files[0].name) + ".c";
  // FileReader
  var reader = new FileReader();
  reader.onloadend = function(event) {
    var target = event.target;
    // 2 == FileReader.DONE
    if (target.readyState == 2) {
      try {
        var xml = Blockly.Xml.textToDom(target.result);
      } catch (e) {
        alert('XML Parse Error:\n' + e);
        return;
      }
      var count = Blockly.mainWorkspace.getAllBlocks().length;
      if (count) {
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