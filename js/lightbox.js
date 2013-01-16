/* 
* Required: http://jquery.com/
* Written by: Vignesh M
* Based on code by: John Resig
* License: GPL
*/

var GB_DONE = false;
var FIRST_TIME_NAV_PRESS = false;
var GB_HEIGHT, GB_WIDTH;
var count =0;
var urls = [];

//This get the URL of all the images from the page.
$("a img").each(function(i) {
	urls[i] = $(this).parent('a').attr('href');
});

$('a img').click(function(e){			
	e.preventDefault();
	var index= $('a img').index(this);
	//index -- is the current index of the image which you've clicked.
	GB_show(urls[index]);
	$('img.next').unbind('click').bind('click',{source:index, count:"add"}, navigation);
	$('img.prev').unbind('click').bind('click',{source:index, count:"sub"}, navigation);
	$('#GB_window').bind('keydown',{source:index}, navigation);
});

function navigation(e){
   
	if (e.keyCode == 27) { //If the key you've pressed is ESC key.
		GB_hide();
	}
	if((e.data.count == 'add')||(e.keyCode == 39)){//If the key you've pressed is Right arrow key.
		count++;
	}else{
		if((e.data.count == 'sub')||(e.keyCode == 37)){//If the key you've pressed is Left arrow key.
			--count;
		}else{
			return false;
		}
	}
	if(!FIRST_TIME_NAV_PRESS) {//If you've navigated the image for the 1st time it'll add the index of that image to count.
		count =(e.data.source)+count;
		FIRST_TIME_NAV_PRESS= true;
	}
	
	var tot=urls.length;
	count=count==-1?tot-1:count%tot;//This is the algorithm to rotate the image url.
	GB_show(urls[count]);		
}

function GB_show(url, height, width) {
	if(!GB_DONE) {
		$(document.body)
		.append("<div id='GB_overlay' class='black_overlay'></div><div id='GB_window' tabindex='-1'><img src='images/prev.png' class='prev'/><div id='GB_caption'></div>"
		+ "<img src='images/close.png' alt='Close window' class='close' style='position:absolute'/><img id='GB_frame' src=''/><img src='images/loading.gif' id='loading'><img src='images/next.png' class='next' /></div>");
		$("#GB_window img.close").click(GB_hide);
		$("#GB_overlay").click(GB_hide);
		$(window).resize(GB_position);
		$(window).scroll(GB_position);
		GB_DONE = true;
	}
	$('#GB_window').show().focus();
	//This tmpImg is used to get the Width & Height of the image using image URL.
	var tmpImg = new Image();
	tmpImg.src= url;
	if (tmpImg.complete) {
		setDimension(tmpImg);
	}else{
		$(tmpImg).load(function(){
		setDimension(tmpImg);
		});
	}
	
	$("#GB_frame").load(function(){
		$("#loading").show();
	}).attr({src:url}).error(function(){
		alert("Image is too large to load");
		GB_hide();
    }).animate({width:GB_WIDTH,height:GB_HEIGHT}, 500,"swing",function(){
		$("#loading").hide();	
	});
	GB_position();
	$("#GB_overlay").show();
	
} 

//This fn() is used to set the Dimension for <img> element. If image width and height is greater than 1000 it will set it to 500, 400px respectively.
function setDimension(tmpImg){
		GB_WIDTH= (tmpImg.width < 1000) ? tmpImg.width : 500;
		GB_HEIGHT =(tmpImg.height < 1000) ? tmpImg.height : 400;
	}
	
function GB_hide() {
	$("#GB_window,#GB_overlay").hide().remove();;
	count =0;
	FIRST_TIME_NAV_PRESS = false;
	GB_DONE = false;
}

function GB_position()
{
	var de = document.documentElement;
	var h = self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	var w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var iebody=(document.compatMode && document.compatMode != "BackCompat")? document.documentElement : document.body;
	var dsocleft=document.all? iebody.scrollLeft : pageXOffset;
	var dsoctop=document.all? iebody.scrollTop : pageYOffset;	
	var height = h < GB_HEIGHT ? h - 32 : GB_HEIGHT;
	var topPx = (h - height)/2 ;//+ dsoctop;-- If the position is absolute for #GB_window, variable dsoctop must be added to this line. Now I've commented that out!
	
	$("#GB_window").animate({left: ((w - GB_WIDTH)/2), top: topPx});
}
