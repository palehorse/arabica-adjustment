## arabica-adjustment
把數字輸入框塑造成圖形化的控制桿
## 前置安裝
    jQuery
## 安裝
1.用npm指令安裝
```sh
npm install arabica-adjustment
```
2.用html語法引入
```html
<script src="arabica-adjustment/arabica-adjustment.jquery.js"></script>
```
#### Vue
```javascript
require('arabica-adjustment/arabica-adjustment.jquery.js');
```
## Demo
[Demo on jsFiddle](https://jsfiddle.net/Palehorse/3qon58g0/27/)
## 使用方法
#### HTML
```html
<!-- type須設定為number -->
<!-- max和min是必須設定的屬性 -->
<input type="number" max=10 min=1 />
```
#### JavaScript
```javascript
$('input[type=number]').adjustment();
```
#### 隨時顯示數值
```html
<label for="adjustment">目前數值：</label>
<input id="adjustment" type="number" max=10 min=1 />
```
## Callbacks
#### 設定數值
```javascript
$('input[type=number]').adjustment('set', 5);
```
#### 重設
```javascript
$('input[type=number]').adjustment('set');
```
