document.addEventListener("keydown", function(event){
	var dict={
		"Ctrl_s":saveFile,
		"Ctrl_o":getFile,
		"Alt_f": focusbar_File,
		"Alt_h": focusbar_Home,
		"Alt_n": focusbar_Ins,
		"Alt_p": focusbar_Page,
		"Alt_d": focusbar_Data,
		"Ctrl_Alt_a": app_about,
	}
	if(event.ctrlKey){
		if(event.altKey){
			event.preventDefault();
			eval("dict.Ctrl_Alt_"+event.key+"()");
		}else{
			if('acv'.indexOf(event.key)==-1){
				event.preventDefault();
				try{
					eval("dict.Ctrl_"+event.key+"()");
				}catch(err){}
			}
		}
	}
	else if(event.altKey){
		event.preventDefault();
		try{
			eval("dict.Alt_"+event.key+"()");
		}catch(err){}
	}
})

function focusbar_File(){
	$("li[data-name=File]").onclick();
}
function focusbar_Home(){
	$("li[data-name=Home]").onclick();
}
function focusbar_Ins(){
	$("li[data-name=Insert]").onclick();
}
function focusbar_Data(){
	$("li[data-name=Data]").onclick();
}
function focusbar_Page(){
	$("li[data-name=Page]").onclick();
}




