# Blockly 積木編輯器 - 修改記錄

## 版本資訊

- Blockly 版本：依專案內建版本（Copyright 2011 Google Inc.）
- 最後修改日期：2026-07-29

---

## 修改一覽

| # | 檔案 | 問題 | 修正方式 |
|---|------|------|----------|
| 1 | `blockly/blockly_compressed.js` | Flyout 積木無法新增到工作區 | 在 SVG 上加入 capture 階段的 mousedown 監聽器 |
| 2 | `blockly/demos/code/index.html` | 頁面頂端顯示原始碼文字 | 移除未包在 `<script>` 標籤內的 JS 程式碼 |
| 3 | `blockly/blockly_compressed.js` | 新增積木後無法立即拖拉 | 對齊 Ardublockly 的 stopPropagation + addBlockListeners_ |
| 4 | `blockly/blockly_compressed.js` | 新增積木後無法立即拖拉（根本修正） | `addBlockListeners_` 在 autoClose 時綁定 `createBlockFunc_` |
| 5 | `blockly/blockly_compressed.js` | mousemove 事件處理器因 touchIdentifier_ 為 null 被略過 | `createBlockFunc_` 中在呼叫 `d.onMouseDown_` 前設定 `touchIdentifier_` |
| 6 | `blockly/blockly_compressed.js` | Mutator 氣泡視窗內的積木無法拖拉新增 | capture 監聽器擴充搜尋所有可見 Mutator 的 flyout |

---

## 修改詳情

### 修改一：Flyout 積木無法新增（blockly_compressed.js）

#### 問題描述

在工作區中點擊 Flyout（工具箱旁的積木面板）中的積木時，積木無法被新增到主工作區。

根本原因是 `Blockly.Flyout.prototype.blockMouseDown_` 函式在事件處理結尾呼叫了 `stopPropagation()` 和 `preventDefault()`，導致 mousedown 事件無法向上传播到上層的 workspace `onMouseDown_` 處理器，使得新增積木的邏輯無法被觸發。

#### 原始碼位置

`blockly/blockly_compressed.js`，`Blockly.init_` 函式末尾（約第 1442-1443 行）。

#### 修正方式

在 `Blockly.init_` 函式最後，取得 parent SVG 元素並新增一個 **capture 階段**（第三參數 `!0`）的 `mousedown` 事件監聽器。

```javascript
// 新增於 Blockly.init_ 函式末尾
var svg = a.getParentSvg();
svg && svg.addEventListener("mousedown", function(e) {
    // 取得 flyout（可能是 toolbox 的 flyout 或獨立 flyout）
    var fl = a.toolbox_ ? a.toolbox_.flyout_ : a.flyout_;
    if (!fl || !fl.isVisible() || !fl.autoClose) return;

    // 用 elementsFromPoint 找出點擊位置的所有 DOM 元素
    var els = document.elementsFromPoint(e.clientX, e.clientY);
    var bks = fl.workspace_.getTopBlocks(false);
    var found = null;

    // 比對點擊到的元素是否屬於某個 flyout 積木
    for (var i = 0; i < els.length; i++) {
        for (var bi = 0; bi < bks.length; bi++) {
            if (bks[bi].getSvgRoot) {
                var sr = bks[bi].getSvgRoot();
                if (sr && (sr === els[i] || sr.contains(els[i]))) {
                    found = bks[bi];
                    break;
                }
            }
        }
        if (found) break;
    }

    // 找到積木後，直接呼叫 createBlockFunc_ 新增積木到工作區
    if (found) {
        try {
            var cf = fl.createBlockFunc_(found);
            cf(e);
        } catch (ex) {}
        e.stopPropagation();
        e.preventDefault();
    }
}, true); // true = capture 階段，在 stopPropagation 之前攔截
```

#### 運作原理

```
事件流程：
mousedown 事件觸發
    │
    ▼ (capture 階段 - 從上往下)
    [SVG 監聽器] ← ★ 新增的監聽器在這裡攔截
    │              用 elementsFromPoint 找到積木
    │              直接呼叫 createBlockFunc_() 新增積木
    ▼ (target 階段)
    [Flyout 積木的 blockMouseDown_]
    │              呼叫 stopPropagation()
    ▼ (bubble 階段 - 被截斷，不會到達)
    [Workspace onMouseDown_] ← 原本依賴這個，但被截斷了
```

使用 `document.elementsFromPoint()` 的好處：
- 不依賴事件的 target（可能被 SVG 群組截斷）
- 可以精確找到點擊位置實際對應的積木 SVG 元素

---

### 修改二：頁面頂端顯示原始碼（index.html）

#### 問題描述

`blockly/demos/code/index.html` 第 9-15 行有一段 JavaScript 程式碼沒有被 `<script>` 標籤包覆，導致瀏覽器將其當作純文字渲染，頁面頂端會顯示出原始碼字串：

```
// 在 blockly_compressed.js 載入後執行 window.addEventListener('load', ...
```

#### 修正方式

移除那段未包在 `<script>` 標籤內的 JavaScript 程式碼（第 9-15 行），恢復正常的 `<script>` 引用順序。

**修改前：**
```html
<script src="../../blocks_compressed.js"></script>
// 在 blockly_compressed.js 載入後執行
window.addEventListener('load', function() {
    // 強制觸發一次 resize,校正 Blockly 工作區座標
    ...
});
<script src="../../javascript_compressed.js"></script>
```

**修改後：**
```html
<script src="../../blocks_compressed.js"></script>
<script src="../../javascript_compressed.js"></script>
```

---

### 修改三：新增積木後無法立即拖拉（blockly_compressed.js）

#### 問題描述

修改一修正了 Flyout 積木無法新增到工作區的問題，但產生了新的 UI 問題：從 Flyout 點擊新增積木後，積木出現在工作區，但無法立即拖拉組合，需再次點擊才能拖拉。

經過深入分析，對齊 Ardublockly 版本，將 `stopImmediatePropagation` 改回 `stopPropagation`（與 Ardublockly 一致）。真正的拖拉問題由修改四和修正五解決。

#### 修正方式

將 capture 監聽器中的事件停止方法對齊 Ardublockly：

```javascript
if (found) {
    try {
        fl.createBlockFunc_(found)(e);
    } catch (ex) {}
    e.stopPropagation();  // 對齊 Ardublockly：阻止事件向子元素傳播
    e.preventDefault();
}
```

---

### 修改四：addBlockListeners_ 根本修正（blockly_compressed.js）

#### 問題描述

修改三（`stopImmediatePropagation`）嘗試解決拖拉問題，但實際上根本原因不在事件傳播，而在於 `addBlockListeners_` 的綁定方式。

對比 **Ardublockly** 版本的 Blockly，發現其 `addBlockListeners_` 在 `autoClose=true` 時，**直接將 `createBlockFunc_` 綁定到 flyout 積木的 mousedown**。這使得點擊積木時立即建立並進入拖曳狀態。

而原始版本（以及我們修改前的版本）不論 `autoClose` 為何，**一律使用 `blockMouseDown_`**。`blockMouseDown_` 只記錄狀態，等 mouseup 才呼叫 `createBlockFunc_`，但隨即被 `terminateDrag_()` 終止拖曳。

#### 原始碼位置

`blockly/blockly_compressed.js`，`Blockly.Flyout.prototype.addBlockListeners_`（第 1372 行）。

#### 修正方式

**修改前（原始版本）：**
```javascript
Blockly.Flyout.prototype.addBlockListeners_ = function(a, b, c) {
    // 不論 autoClose 為何，都用 blockMouseDown_
    this.listeners_.push(Blockly.bindEventWithChecks_(a, "mousedown", null, this.blockMouseDown_(b)));
    this.listeners_.push(Blockly.bindEventWithChecks_(c, "mousedown", null, this.blockMouseDown_(b)));
    // ...
};
```

**修改後（對齊 Ardublockly）：**
```javascript
Blockly.Flyout.prototype.addBlockListeners_ = function(a, b, c) {
    this.autoClose ?
        // autoClose=true：直接綁定 createBlockFunc_，點擊即建立+拖曳
        (this.listeners_.push(Blockly.bindEvent_(a, "mousedown", null, this.createBlockFunc_(b))),
         this.listeners_.push(Blockly.bindEvent_(c, "mousedown", null, this.createBlockFunc_(b)))) :
        // autoClose=false：使用 blockMouseDown_（等 mouseup 才建立）
        (this.listeners_.push(Blockly.bindEventWithChecks_(a, "mousedown", null, this.blockMouseDown_(b))),
         this.listeners_.push(Blockly.bindEventWithChecks_(c, "mousedown", null, this.blockMouseDown_(b))));
    // ...
};
```

#### 兩個版本的事件流程對比

```
Ardublockly 流程（autoClose=true）：
mousedown on flyout block
    │
    ▼
    addBlockListeners_ 綁定的 createBlockFunc_ 被觸發
    │
    ├─ placeNewBlock_() → 建立積木到工作區
    ├─ flyout.hide()    → 隱藏 flyout
    ├─ block.onMouseDown_(e) → 啟動拖曳 (DRAG_STICKY)
    ├─ Blockly.dragMode_ = DRAG_FREE
    └─ block.setDragging_(true)
    │
    ▼
    使用者移動滑鼠 → 積木跟隨移動 ✓
    │
    ▼
    使用者放開滑鼠 → 拖曳結束，積木定位 ✓

原始版本流程（autoClose=true）：
mousedown on flyout block
    │
    ▼
    addBlockListeners_ 綁定的 blockMouseDown_ 被觸發
    │
    ├─ 記錄 startDownEvent_、startBlock_
    ├─ 綁定 mousemove → onMouseMoveBlock_
    └─ 綁定 mouseup → onMouseUp_
    │
    ▼
    mouseup（使用者放開）
    │
    ├─ createBlockFunc_() → 建立積木，啟動拖曳
    └─ terminateDrag_()   → 立即終止拖曳！
    │
    ▼
    積木出現在工作區，但無法拖拉 ✗
    需再次點擊才能拖拉
```

#### 穩定性評估

| 面向 | 說明 |
|------|------|
| **修改範圍** | 修改 `addBlockListeners_` 的條件判斷，對齊 Ardublockly 已驗證的行為 |
| **副作用風險** | 低。此修改完全對齊 Ardublockly 版本的 Blockly，該版本已被大量使用者驗證 |
| **回歸風險** | 低。`autoClose=false` 的行為不受影響（仍使用 `blockMouseDown_`） |

---

### 修正五：touchIdentifier_ 未設定導致 mousemove 被略過（blockly_compressed.js）

#### 問題描述

修改三和修正四修正了事件傳播和 `addBlockListeners_` 的綁定方式，但實際測試仍無法立即拖拉。深入分析 Blockly 的觸控/滑鼠事件處理機制後，發現根本原因是 **`touchIdentifier_` 未被設定**。

Blockly 的 `bindEventWithChecks_` 函式在綁定事件處理器時，會包裝一個 `shouldHandleEvent` 檢查。對於 `mousemove` 事件，該檢查會呼叫 `checkTouchIdentifier`：

```javascript
Blockly.Touch.checkTouchIdentifier = function(a) {
    var b = a.changedTouches && ... ? a.changedTouches[0].identifier : "mouse";
    return (touchIdentifier_ != null)
        ? (touchIdentifier_ == b)
        : ("mousedown" == a.type || "touchstart" == a.type)
            ? (touchIdentifier_ = b, true)
            : false;  // ← mousemove 在 touchIdentifier_ 為 null 時回傳 false！
};
```

問題流程：
1. Capture 監聽器透過 `svg.addEventListener` 攔截 mousedown（**不經過** `bindEventWithChecks_`）
2. 呼叫 `createBlockFunc_` → `d.onMouseDown_()` 綁定 `mousemove` 到 document
3. `mousemove` 透過 `bindEventWithChecks_` 綁定，包裝了 `shouldHandleEvent` 檢查
4. 使用者移動滑鼠 → `mousemove` 事件觸發 → `shouldHandleEvent` 檢查 `touchIdentifier_`
5. **`touchIdentifier_` 為 null**（從未被設定過），且事件類型是 `mousemove`（非 `mousedown`）
6. `checkTouchIdentifier` 回傳 `false` → **mousemove 處理器被跳過，積木無法拖動**

#### 修正方式

在 `createBlockFunc_` 函式中，於呼叫 `d.onMouseDown_(c)` 之前，設定 `touchIdentifier_` 為 `"mouse"`：

**修改前：**
```javascript
Blockly.Flyout.prototype.createBlockFunc_ = function(a) {
    var b = this;
    return function(c) {
        if (!Blockly.isRightButton(c) && !a.disabled) {
            // ... placeNewBlock_, hide, etc.
            d.onMouseDown_(c);  // ← 此時 touchIdentifier_ 為 null
            Blockly.dragMode_ = Blockly.DRAG_FREE;
            d.setDragging_(!0);
        }
    }
};
```

**修改後：**
```javascript
Blockly.Flyout.prototype.createBlockFunc_ = function(a) {
    var b = this;
    return function(c) {
        if (!Blockly.isRightButton(c) && !a.disabled) {
            // ... placeNewBlock_, hide, etc.
            Blockly.Touch.touchIdentifier_ = "mouse";  // ← 確保 touchIdentifier_ 已設定
            d.onMouseDown_(c);
            Blockly.dragMode_ = Blockly.DRAG_FREE;
            d.setDragging_(!0);
        }
    }
};
```

#### 運作原理

```
修正前：
mousedown on flyout block
    │
    ▼
    createBlockFunc_() → d.onMouseDown_() 綁定 mousemove
    │                     但 touchIdentifier_ = null
    ▼
    mousemove 事件觸發
    │
    ▼
    shouldHandleEvent → checkTouchIdentifier
    │                   touchIdentifier_ = null, 事件類型 = mousemove
    │                   回傳 false → 處理器被跳過！
    ▼
    積木無法拖動 ✗

修正後：
mousedown on flyout block
    │
    ▼
    createBlockFunc_() → touchIdentifier_ = "mouse"
    │                     d.onMouseDown_() 綁定 mousemove
    ▼
    mousemove 事件觸發
    │
    ▼
    shouldHandleEvent → checkTouchIdentifier
    │                   touchIdentifier_ = "mouse", 事件識別碼 = "mouse"
    │                   回傳 true → 處理器正常執行 ✓
    ▼
    積木跟隨滑鼠移動 ✓
```

#### 穩定性評估

| 面向 | 說明 |
|------|------|
| **修改範圍** | 在 `createBlockFunc_` 中新增一行賦值語句 |
| **副作用風險** | 極低。`touchIdentifier_` 是 Blockly 內部的狀態變數，用於區分多點觸控的手指。在桌面環境中，只有滑鼠事件，設定為 `"mouse"` 是正確的值。Ardublockly 的 `addBlockListeners_` 透過 `Blockly.bindEvent_` 綁定 mousedown（不檢查 touchIdentifier_），而我們的 capture 監聽器繞過了此檢查，因此需手動補上。 |
| **回歸風險** | 極低。此設定僅影響後續 `shouldHandleEvent` 的判斷，不改變任何事件處理邏輯。 |

---

### 修正六：Mutator 氣泡視窗內積木無法拖拉（blockly_compressed.js）

#### 問題描述

修改一至修正五解决了主工具箱（Toolbox）Flyout 積木無法新增與拖拉的問題，但 **Mutator 氣泡視窗**（點擊積木左上角齒輪/星星圖示後彈出的小視窗）內的積木仍然無法拖拉。

Mutator 氣泡視窗內部是一個獨立的 Workspace / Flyout 容器，其 Flyout 不屬於主工具箱的 `a.toolbox_.flyout_` 或 `a.flyout_`。原本的 capture 監聽器只搜尋主 Flyout，因此 Mutator 內的積木比對時找不到目標，直接跳過。

#### 原始碼位置

`blockly/blockly_compressed.js`，`Blockly.init_` 函式末尾的 capture 階段 mousedown 監聽器（第 1443 行）。

#### 修正方式

將原本只比對單一 Flyout 的邏輯，改為**收集所有可能的 Flyout**（包含主工具箱與所有可見的 Mutator 氣泡視窗），再逐一比對：

```javascript
var svg = a.getParentSvg();
svg && svg.addEventListener("mousedown", function(e) {
    // 1. 收集所有可能的 Flyout
    var flyouts = [];
    var fl = a.toolbox_ ? a.toolbox_.flyout_ : a.flyout_;
    if (fl && fl.isVisible()) flyouts.push(fl);

    // 搜尋所有可見的 Mutator 氣泡視窗內部的 Flyout
    var allBlocks = a.getAllBlocks();
    for (var i = 0; i < allBlocks.length; i++) {
        var blk = allBlocks[i];
        if (blk.mutator && blk.mutator.isVisible() &&
            blk.mutator.workspace_ && blk.mutator.workspace_.flyout_)
            flyouts.push(blk.mutator.workspace_.flyout_);
    }

    // 2. 逐一比對每個 Flyout 裡的積木
    var els = document.elementsFromPoint(e.clientX, e.clientY);
    for (var f = 0; f < flyouts.length; f++) {
        var fly = flyouts[f];
        if (!fly || !fly.isVisible()) continue;
        var bks = fly.workspace_ ? fly.workspace_.getTopBlocks(false) : [];
        var found = null;
        for (var i = 0; i < els.length; i++) {
            for (var bi = 0; bi < bks.length; bi++) {
                if (bks[bi].getSvgRoot) {
                    var sr = bks[bi].getSvgRoot();
                    if (sr && (sr === els[i] || sr.contains(els[i]))) {
                        found = bks[bi];
                        break;
                    }
                }
            }
            if (found) break;
        }

        // 3. 找到目標即觸發該 Flyout 的建立與拖拉邏輯
        if (found) {
            try { fly.createBlockFunc_(found)(e); } catch (ex) {}
            e.stopPropagation();
            e.preventDefault();
            break;
        }
    }
}, true);
```

#### 與使用者提案的差異

使用者提案中使用 `Blockly.Mutator.activeBubble_` 來取得當前開啟的 Mutator 氣泡，但此屬性在本專案的 Blockly 版本中**不存在**。修正改用 `a.getAllBlocks()` 迭代主工作區的所有積木，檢查每個積木的 `mutator.isVisible()` 來動態發現可見的 Mutator，無依賴不存在的靜態屬性。

#### 運作原理

```
修正前：
mousedown on Mutator flyout block
    │
    ▼
    capture 監聽器攔截
    │
    ├─ fl = a.toolbox_.flyout_  ← 只取得主 Flyout
    ├─ 在 Mutator flyout 積木上比對 → 找不到（不在主 Flyout 裡）
    └─ return → 事件被截斷，但沒有觸發任何新增
    ▼
    Mutator 內積木無法拖拉 ✗

修正後：
mousedown on Mutator flyout block
    │
    ▼
    capture 監聽器攔截
    │
    ├─ flyouts = [主 Flyout, Mutator.flyout_, ...]  ← 收集所有 Flyout
    ├─ 逐一比對 flyouts[0]（主 Flyout）→ 找不到
    ├─ 逐一比對 flyouts[1]（Mutator flyout）→ 找到積木 ✓
    ├─ fly.createBlockFunc_(found)(e) → 建立積木到 Mutator workspace
    └─ stopPropagation + preventDefault
    ▼
    Mutator 內積木可正常拖拉 ✓
```

#### 穩定性評估

| 面向 | 說明 |
|------|------|
| **修改範圍** | 擴充現有 capture 監聽器的 Flyout 搜尋範圍 |
| **副作用風險** | 低。僅增加可搜尋的 Flyout 來源，不改變原有比對與建立邏輯 |
| **回歸風險** | 低。主工具箱 Flyout 的行為完全不變，僅新增 Mutator flyout 的搜尋 |

### 修改一（Flyout 修正）— 穩定性：高

| 面向 | 說明 |
|------|------|
| **是否依賴瀏覽器特性** | 否。使用的是標準 DOM API（`addEventListener`、`elementsFromPoint`、`contains`），這些是 W3C 標準，所有主流瀏覽器長期支援，不會因 Chrome 更新而失效。 |
| **是否依賴 Blockly 內部 API** | 是。使用了 `flyout_`、`createBlockFunc_`、`workspace_`、`getTopBlocks()`、`getSvgRoot()` 等 Blockly 內部屬性/方法。 |
| **何時會失效** | 當 Blockly 版本升級，且上述內部 API 被重新命名、移除或行為改變時。 |

**建議：**
- 此修正不會像過去那樣因 Chrome 更新而失效。
- 若 Blockly 升級到新版本，需重新檢查 `blockly_compressed.js` 中 `Blockly.init_` 函式的結構，確認修改是否仍然適用。
- 建議保留 Blockly 的原始備份（如 `blockly_compressed.js.bak`），以便升級時對比差異。

### 修改二（index.html）— 穩定性：高

純 HTML 語法修正，不涉及任何 API 或執行時邏輯，長期無效風險為零。

---

## 備份與升級建議

1. **備份現有檔案**
   ```
   blockly/blockly_compressed.js        ← 已修改
   blockly/demos/code/index.html        ← 已修改
   ```

2. **Blockly 升級時**
   - 下載新版Blockly 壓縮檔
   - 將新版 `blockly_compressed.js` 重新套用修改一的修正
   - `index.html` 的修正不需重新套用（除非新版也引入了相同的錯誤）

3. **驗證方式**
   - 開啟頁面後，從左側工具箱點擊積木，確認能正常新增到工作區
   - 確認頁面頂端不會顯示原始碼文字
   - 點擊積木左上角齒輪/星星圖示開啟 Mutator 氣泡視窗，確認能從氣泡內拖拉積木
   - 測試拖曳積木、右鍵選單、Undo/Redo 等功能正常運作

---

## 改版記錄

### v1.1 — 2026-07-29（Mutator flyout 修正）

修正 Mutator 氣泡視窗內的積木無法拖拉新增的問題。

#### 修改檔案

| 檔案 | 變更內容 |
|------|----------|
| `blockly/blockly_compressed.js` | 擴充 capture 階段 mousedown 監聽器，加入 Mutator flyout 搜尋 |

#### 變更摘要

1. **`Blockly.init_` 末尾 capture 監聽器擴充**
   - 新增 `a.getAllBlocks()` 迭代，搜尋所有可見的 Mutator 氣泡視窗
   - 將 Mutator 的 `workspace_.flyout_` 納入 flyouts 陣列
   - 逐一比對所有 flyouts，找到目標後呼叫 `createBlockFunc_()` 觸發建立與拖拉

---

### v1.0 — 2026-07-29（首次发布）

完整修正 Flyout 積木無法新增到工作區、無法立即拖拉、頁面顯示原始碼等問題。

#### 修改檔案

| 檔案 | 變更內容 |
|------|----------|
| `blockly/blockly_compressed.js` | 新增 capture 階段 mousedown 監聽器、修正 `addBlockListeners_`、修正 `createBlockFunc_` |
| `blockly/demos/code/index.html` | 移除未包在 `<script>` 標籤內的 JS 程式碼 |

#### 變更摘要

1. **`Blockly.init_` 末尾新增 capture 監聽器**
   - 透過 `document.elementsFromPoint()` 偵測點擊的 flyout 積木
   - 直接呼叫 `createBlockFunc_()` 將積木新增到工作區
   - 使用 `stopPropagation()` 阻止事件繼續傳播

2. **`Blockly.Flyout.prototype.addBlockListeners_`**
   - `autoClose=true` 時改用 `Blockly.bindEvent_` 綁定 `createBlockFunc_`
   - `autoClose=false` 時維持 `Blockly.bindEventWithChecks_` 綁定 `blockMouseDown_`
   - 對齊 Ardublockly 版本的行為

3. **`Blockly.Flyout.prototype.createBlockFunc_`**
   - 在呼叫 `d.onMouseDown_(c)` 前設定 `Blockly.Touch.touchIdentifier_ = "mouse"`
   - 確保後續 `mousemove` 事件能通過 `shouldHandleEvent` 檢查

4. **`blockly/demos/code/index.html`**
   - 移除第 9-15 行未包在 `<script>` 標籤內的 JavaScript 程式碼

#### 已知問題修正歷程

| 階段 | 問題 | 解決方式 |
|------|------|----------|
| 初版 | Flyout 積木點擊後不出現在工作區 | 新增 capture 監聽器直接呼叫 `createBlockFunc_` |
| 初版 | 頁面頂端顯示原始碼 | 移除未包在 `<script>` 標籤內的 JS 程式碼 |
| 迭代 | 積木出現但無法立即拖拉 | 嘗試 `stopImmediatePropagation`（無效） |
| 迭代 | 積木出現但無法立即拖拉 | 修正 `addBlockListeners_` 對齊 Ardublockly（部分有效） |
| 最終 | 積木出現但無法立即拖拉 | 修正 `createBlockFunc_` 設定 `touchIdentifier_`（**根本解決**） |
| 迭代 | Mutator 氣泡視窗內積木無法拖拉 | 擴充 capture 監聽器，搜尋所有可見 Mutator 的 flyout |
