function $(s){
	s=document.querySelectorAll(s);
	if(s.length==1)	s=s[0];
	return s;
}
function $$(s){
	s=document.querySelectorAll(s);
	return s;
}

lastFocusBar="Home";
lastFocusCBar="cBarHome";

function init(){
	$("#title").style.backgroundColor="#217346";
	$("#title").style.height=`${window.outerHeight*0.0425}px`;
	$("#title").style.fontSize=`${window.outerHeight*0.018}px`;
	$("#title").style.lineHeight=`${window.outerHeight*0.0425}px`;
	$("#title").classList="t1 centre";
	$("#tool-bar").style.height=`${window.outerHeight*0.0375}px`;
	$("#tool-bar").style.lineHeight=`${window.outerHeight*0.0375}px`;
	$("#tool-bar").childNodes.forEach(n=>{
		if(n.nodeName=="LI"){
			n.dataset.name=n.innerText.trim();
			n.className="bar";
			n.onclick=function(){
				if(this.classList=="bar"){
					$('li[data-name='+lastFocusBar+']').classList="bar";
					lastFocusBar=n.dataset.name;
					this.classList="focusbar";
					onFocusBar(lastFocusBar);
				}
			}
		}
	})
	$("#cover-bar").childNodes.forEach(n=>{
		if(n.nodeName=="LI"){
			n.dataset.name="cBar"+n.innerText.trim();
			n.className="cbar";
			n.onclick=function(){
				if(this.classList=="cbar"){
					$('li[data-name='+lastFocusCBar+']').classList="cbar";
					lastFocusCBar=n.dataset.name;
					this.classList="focusCbar";
					onFocusCBar(lastFocusCBar);
				}
			}
		}
	})
	$("li[data-name=Home]").classList="focusbar";
	$("#tools").style.height=`${0.1155*window.outerHeight}px`;
	$("#tools").style.lineHeight=`${0.1155*window.outerHeight}px`;
	$("#funcbar").style.height=`${0.055*window.outerHeight}px`;
	$("#funcbar").style.lineHeight=`${0.055*window.outerHeight}px`;
	$("#func").style.height=`${0.055*window.outerHeight}px`;
	$("#func").style.lineHeight=`${0.055*window.outerHeight}px`;
	$("#cellname").style.minWidth=`${0.1255*window.outerHeight}px`;
	$("#cellname").style.width=`${0.1255*window.outerHeight}px`;
	$("#foot1").style.height=`${0.024*window.outerHeight}px`;
	$("#foot1").style.lineHeight=`${0.024*window.outerHeight}px`;
	$("#foot2").style.height=`${0.0265*window.outerHeight}px`;
	$("#main-sheet").style.height=`${17+$("#foot").offsetTop-$("#main-sheet").offsetTop}px`;
	$("#main-sheet").style.overflowX="scroll";
	$("#main-sheet").style.overflowY="scroll";
	$("#cover-bar").style.width=$("#cover-content").style.left=`${0.11667*window.outerWidth}px`;
	$("#cover-bar").style.paddingTop=$("#cover-content").style.paddingTop=`${0.0525*window.outerHeight}px`;
	$("#cover-content").style.paddingLeft=$("#cover-content").style.paddingRight=`${0.0367*window.outerWidth}px`;
	$("#cover-content").style.width=`calc(100vw - ${0.11667*window.outerWidth}px - ${2*0.0367*window.outerWidth}px)`;
	$("#cover-bar-return").children[0].style.height=$("#cover-bar-return").children[0].style.width=`${0.03*window.outerHeight}px`;
	$("#cover-bar-return").onclick=focusbar_Home;
	
	onFocusBar(lastFocusBar);
	onFocusCBar(lastFocusCBar);
}

