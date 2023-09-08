# PowerSheet
a web app that simulate EXCEL, and has some of excel's functions.

# Requirements:
**`Nothing!`**

**PowerSheet has no dependences!**  you just need a browser!

# Useage
### Quick Try
Try it on [my github pages](https://berniehuang2008.github.io/PowerSheet/PowerSheet.html)!
### insert to your site
Insert to your website with `<iframe>`, and use our powerful APIs. [Details](#apis)

# Functions it has?
Some formulars ...
![image](https://github.com/BernieHuang2008/PowerSheet/assets/88757735/4ae4d2e5-60b5-4f71-9332-7c9ea2fb57b6)

Own File Format ...
![image](https://github.com/BernieHuang2008/PowerSheet/assets/88757735/870e590e-24e2-41df-8883-aa8a908a363c)

# APIs
## Insert to your website
by using the following code, you can insert PowerSheet into your website. 
```html
<iframe src="https://berniehuang2008.github.io/PowerSheet/PowerSheet.html"></iframe>
```
## APIs
static api:
```js
_$file_workspaces[0].content.range .................. get the content range of sheet0.
```
api functions:
```js
getValue($("#F9")) ......................... get the content in cell F9.
```

# Thanks ...
```text
JsZip ............. for zipping and unzipping data.
FileSaver ......... for saving `.sheet` files.
```
