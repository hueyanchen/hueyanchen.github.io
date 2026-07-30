# Blockly 積木編輯器 - 修改記錄

## 版本資訊

- Blockly 版本：依專案內建版本（Copyright 2011 Google Inc.）
- 修改日期：2026-07-29

---

## 修改一覽

| # | 檔案 | 問題 | 修正方式 |
|---|------|------|----------|
| 1 | `blockly/blockly_compressed.js` | Flyout 積木無法新增到工作區 | 在 SVG 上加入 capture 階段的 mousedown 監聽器 |

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


## 長期使用評估

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

---

## 備份與升級建議

1. **備份現有檔案**
   ```
   blockly/blockly_compressed.js        ← 已修改
   ```

2. **Blockly 升級時**
   - 下載新版Blockly 壓縮檔
   - 將新版 `blockly_compressed.js` 重新套用修改一的修正

3. **驗證方式**
   - 開啟頁面後，從左側工具箱點擊積木，確認能正常新增到工作區
   - 測試拖曳積木、右鍵選單、Undo/Redo 等功能正常運作

### 修正：Mutator 氣泡視窗內積木無法拖拉（blockly_compressed.js）

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
