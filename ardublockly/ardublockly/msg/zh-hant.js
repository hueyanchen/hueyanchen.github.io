var Ardublockly = Ardublockly || {};
Ardublockly.LOCALISED_TEXT = {
  translationLanguage: "中文",
  title: "Ardublockly",
  blocks: "積木",
  /* Menu */
  open: "開啟",
  save: "儲存",
  deleteAll: "全部刪除",
  settings: "設定",
  documentation: "文件",
  reportBug: "回報錯誤",
  examples: "Arduino範例",
  /* Settings */
  compilerLocation: "編譯位置",
  compilerLocationDefault: "arduino.exe編譯器位置未知",
  sketchFolder: "草稿碼目錄",
  sketchFolderDefault: "草稿碼目錄未知",
  arduinoBoard: "Arduino開發板",
  arduinoBoardDefault: "Arduino開發板未知",
  comPort: "序列埠",
  comPortDefault: "序列埠未知",
  defaultIdeButton: "預設IDE按鈕",
  defaultIdeButtonDefault: "IDE選項設定未知",
  language: "語言",
  languageDefault: "語言未知",
  sketchName: "草稿碼名稱",
  /* Arduino console output */
  arduinoOpMainTitle: "Arduino IDE 輸出 - 中文加強版 : 陳會安",
  arduinoOpWaiting: "等待Arduino IDE輸出...",
  arduinoOpUploadedTitle: "成功上傳Arduino草稿碼",
  arduinoOpVerifiedTitle: "成功驗證/編譯Arduino草稿碼",
  arduinoOpOpenedTitle: "使用Arduino IDE開啟草稿碼",
  arduinoOpOpenedBody: "草稿碼應該已經在Arduino IDE開啟.",
  arduinoOpErrorUpVerTitle: "建構或上傳失敗",
  arduinoOpErrorSketchTitle: "草稿碼不存在",
  arduinoOpErrorFlagTitle: "命令列參數不合法",
  arduinoOpErrorFlagPrefTitle: "選項設定傳入 'get-pref' 旗標不存在",
  arduinoOpErrorIdeDirTitle: "無法找到 Arduino IDE",
  arduinoOpErrorIdeDirBody: "arduino.exe編譯器位置尚未設定.<br>" +
                            "請在[設定]功能指定路徑.",
  arduinoOpErrorIdeOptionTitle: "我們準備如何處理這個Arduino草稿碼?",
  arduinoOpErrorIdeOptionBody: "啟動 IDE 的選項設定沒有設定.<br>" +
                               "請在[設定]功能選擇 IDE 選項設定.",
  arduinoOpErrorIdePortTitle: "序列埠不可用",
  arduinoOpErrorIdePortBody: "這個序列埠無法存取.<br>" +
                             "請檢查Arduino開發板是否正確的連接PC電腦, 且在[設定]功能選擇使用的序列埠.",
  arduinoOpErrorIdeBoardTitle: "未知的Arduino開發板",
  arduinoOpErrorIdeBoardBody: "Arduino開發板種類未設定.<br>" +
                              "請在[設定]功能選擇適當的Arduino開發板.",
  /* Modals */
  noServerTitle: "Ardublockly應用程式沒有啟動",
  noServerTitleBody: "<p>為了讓所有 Ardublockly 功能可正確啟用, Ardublockly桌面應用程式必須在本機電腦執行.</p>" +
                     "<p>如果你是使用線上版本, 你將無法建立選項設定和載入積木程式至.</p>" +
                     "<p>安裝說明請參閱 <a href=\"https://github.com/carlosperate/ardublockly\">Ardublockly檔案庫</a>.</p>" +
                     "<p>如果Ardublockly已經安裝, 請確認應用程式正確的啟動且執行中.</p>",
  noServerNoLangBody: "如果Ardublockly應用程式不在執行中, 介面語言將無法完整更新.",
  addBlocksTitle: "更多積木",
  /* Alerts */
  loadNewBlocksTitle: "載入新積木?",
  loadNewBlocksBody: "載入新的XML檔將會取代目前工作區的積木程式.<br>" +
                     "確認載入XML檔?",
  discardBlocksTitle: "刪除積木程式?",
  discardBlocksBody: "目前有 %1 積木程式在工作區.<br>" +
                     "確認刪除這些積木程式?",
  invalidXmlTitle: "不合法的XML檔",
  invalidXmlBody: "XML檔案沒有成功剖析成積木程式. 請更新XML標籤碼再試一次.",
  /* Tooltips */
  uploadingSketch: "上傳草稿碼至Arduino開發板中...",
  uploadSketch: "上傳草稿碼至Arduino開發板",
  verifyingSketch: "驗證/編譯草稿碼中...",
  verifySketch: "驗證/編譯草稿碼",
  openingSketch: "正在Arduino IDE開啟草稿碼...",
  openSketch: "在IDE開啟草稿碼",
  notImplemented: "功能尚未實作",
  /* Prompts */
  ok: "確定",
  okay: "確定",
  cancel: "取消",
  return: "返回",
  /* Cards */
  arduinoSourceCode: "Arduino 草稿碼",
  blocksXml: "積木 XML 標籤碼",
  /* Toolbox Categories*/
  catLogic: "邏輯",
  catLoops: "迴圈",
  catMath: "運算",
  catText: "字串",
  catVariables: "變數",
  catFunctions: "程序",
  catInputOutput: "輸入/輸出",
  catTime: "時間",
  catAudio: "蜂鳴器",
  catMotors: "伺服馬達",
  catComms: "序列埠",
  catSmartCar: "智慧車"
};
