/********************************************/
/*********************************************
	JavaScript 3D - points
	BY JOEY FORTUNA
	http://frogstomper.com
	COPYRIGHT (C) 2006, Joey Fortuna
	PERMISSION TO USE GRANTED PROVIDING THE
	ADOPTER INCLUDES THIS NOTICE
*********************************************/
/********************************************/
var nGon;
var moveX=0;
var oldMoveX=0;
var moveY=0;
var oldMoveY=0;
var xRotate=0;
var yRotate=0;
var bRightMouseDown=false;
var bLeftMouseDown=false;
var iDistance=525;
var iFov=590;
var iLineYDiff=60;
var clickData=null;
var LinkColor="#000000";
var PointColor="#000000";



function setLinkColor(tlink) {
	LinkColor=tlink;
}
function setPointColor(tpoint) {
	PointColor=tpoint;
}

function getWinSize(p) {
	if (typeof(p)=='undefined') proportionate=false;
	winX = document.body.clientWidth - 10;
	winY = document.body.clientHeight - 10;
	//if (winX>800)  winX=400;
	//if (winY>600) winY=600
	if (nGon) {
		nGon.centerX=winX/2;
		nGon.centerY=winY/2;
		nGon.clear();
	}
	drawPolygon(p);
}



function nGonPointObj(tid,x,y,z,strTxt,fontSize,udv,nGon) {
	if (!strTxt) strTxt="O";
	this.id=tid;
	this.x=x;
	this.y=y;
	this.z=z;
	this.nGon=nGon;
	this.fontSize=((typeof fontSize=='undefined')?16:fontSize);
	this.scrX=x;
	this.scrY=y;
	this.udv=udv;	
	this.udf=null;
	this.text=strTxt;
	var newObj=document.createElement("div");
	newObj.id="nGonPoint"+tid;
	newObj.style.position="absolute";
	newObj.style.display="none";
	newObj.style.color="red";
	newObj.style.textAlign="center";
	newObj.style.fontWeight="bold";
	newObj.style.fontSize=this.fontSize+"px";
	newObj.style.fontFamily="arial";
	newObj.style.width="140px";
	newObj.style.heigth="20px";
	newObj.style.top=this.y+"px";
	newObj.style.left=this.x+"px";
	var divObj=document.body.appendChild(newObj);
	this.divObj=divObj;
	var linkObj;
	if (strTxt!="O") {
		linkObj=document.createElement("a");
		linkObj.setAttribute('href', "javascript:doClick('"+strTxt+"');");
		linkObj.className="nav1";
 	}
 	else {
		linkObj=document.createElement("span");
		linkObj.className="grey";
 	}
	linkObj.innerHTML=strTxt;
	this.linkObj=linkObj;
	this.divObj.appendChild(this.linkObj)
	this.txtHolder=linkObj;
	this.redrawDiv=NGON_POINT_redrawDiv;
	this.redrawCanvas=NGON_POINT_redrawCanvas;
	return this;
}


function nGonObj() {
	this.corpus=null;
	this.corpus_index=-1;
	this.transX=0;
	this.centerX=0;
	this.centerY=0;
	this.centerZ=0;
	this.parallel=false;
	this.displayType='canvas';
	this.name="NGonObject";
	this.nPoints=new Array();
	this.nFaces=new Array();
	this.angleDivisor=0;
	this.angle=0;
	this.rotate=NGON_rotate;
	this.clear=NGON_clear;
	this.addPoint=NGON_addPoint;
	this.init=NGON_init;
	this.initArray=NGON_initArray;
	this.setCorpus=NGON_setCorpus;
	this.initAutomate=NGON_initAutomate;
	this.setDisplay=NGON_setDisplay;	
	this.autoTimer=0;
	this.autoW=0;
	this.autoH=0;
	this.autoX=0;
	this.autoY=0;
	this.self=this;
	this.maxZ=0;
	this.minZ=0;
	this.showUDV=false;
	
	return this;
}
function NGON_setDisplay(val) {
	var canvas=document.getElementById('canvas');
	if (val=='canvas') {
		for (var i=0;i<this.nPoints.length;i++) {
			var p=this.nPoints[i];
			p.divObj.style.display='none';
		}
		canvas.style.display='block';
		this.displayType='canvas';
	}
	else if (val=='div') {		
		for (var i=0;i<this.nPoints.length;i++) {
			var p=this.nPoints[i];
			p.divObj.style.display='inline-block';
		}
		canvas.style.display='none';
		this.displayType='div';
		this.rotate(0,0,0);
	}

	
}

function NGON_initAutomate(w,h) {
	this.autoW=w;
	this.autoH=h;
	wake(this.self);
}

function wake(ngon) {
	if (typeof ngon == 'undefined') ngon=nGon;
	ngon.autoX=Math.floor(ngon.autoW*Math.random());
	ngon.autoY=Math.floor(ngon.autoH*Math.random());		
	var intvl=Math.floor(50*Math.random());
	this.autoTimer=setInterval(function() {move(ngon);},intvl);	
}

function move(ngon) {
	
	if (ngon.autoX>moveX+10) moveX+=(10*Math.random());
	else if (ngon.autoX<moveX-10) moveX-=(10*Math.random());
	
	if (ngon.autoY>moveY+10) moveY+=(10*Math.random());
	else if (ngon.autoY<moveY-10) moveY-=(10*Math.random());
	
	
	if (ngon.autoY<=moveY+10 && ngon.autoY>=moveY-10 && ngon.autoX<=moveX+10 && ngon.autoX>=moveX-10) {		
		clearInterval(ngon.autoTimer);		
		wake(ngon);
	}
	else {
		MoveHandler('automate');	
	}
}
function sortZ(a,b) {
	if (a.z>b.z) return 1;
	if (b.z>a.z) return -1;
	return 0
}
 
function NGON_POINT_redrawCanvas() {
	var canvaselem = document.getElementById("canvas");
	var ctx = canvaselem.getContext("2d");
	var canvaswidth = canvaselem.width-0;
	var canvasheight = canvaselem.height-0;   
	var fs=(this.fontSize-(3*discretizeZ(this.z)));	
	if (this.z>nGon.maxZ-2 && nGon.showUDV) {
		var fs=20;	
		ctx.beginPath();		
		ctx.font=fs+"px Courier";
		var metrics=ctx.measureText((this.udv)?this.udv:this.text);
		var width = metrics.width;
		ctx.fillStyle="#ffffff";
        	ctx.strokeStyle = 'black';
        	ctx.rect(Math.floor(this.scrX)-(width/2)-15, Math.floor(this.scrY),width+10,(fs*2));
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.font=fs+"px Courier";
		ctx.textBaseline="top";
		ctx.fillStyle="#ff0000";	
		ctx.fillText(this.text,Math.floor(this.scrX)-(width/2)-10, Math.floor(this.scrY));
		if (this.udv) {
			ctx.beginPath();
			ctx.font=fs+"px Courier";
			ctx.textBaseline="top";
			ctx.fillStyle="#ff0000";	
			ctx.fillText(this.udv,Math.floor(this.scrX)-(width/2)-10, Math.floor(this.scrY)+fs);
		}
		
	}
	else {
		ctx.beginPath();
		ctx.textBaseline="top";
		ctx.font=fs+"px Courier";
		var metrics=ctx.measureText(this.text);
		var width = metrics.width;
		ctx.fillStyle=getGrad(PointColor,discretizeZ(this.z));
		ctx.fillText(this.text,Math.floor(this.scrX)-(width/2)-10, Math.floor(this.scrY));
		
	}
	if (this.udf) this.udf(this.udv)
	
	//ctx.strokeStyle="#000000";
  //	ctx.arc(Math.floor(this.scrX), Math.floor(this.scrY), 9-discretizeZ(this.z), 0 , 2 * Math.PI, false);
	
	
	
}
function discretizeZ(z) {
	if (z<-50) return 6;
	else if (z<-25) return 5;
	else if (z<-0) return 4;
	else if (z<25) return 3;
	else if (z<50) return 2;
	else return 1;
}

function NGON_POINT_redrawDiv() {
	var zd=discretizeZ(this.z);
	if (this.linkObj.className.indexOf("grey")>-1) {
		this.linkObj.className="grey"+zd;
		this.linkObj.style.color=getGrad(PointColor,zd);
	}
	else {
		this.linkObj.className="nav"+zd;
		this.linkObj.style.color=getGrad(LinkColor,zd);
	}
	this.divObj.style.zIndex=((7-zd)*10)+"";
	this.divObj.style.fontSize=(13-zd)+"px";
	
	this.divObj.style.left=this.scrX+"px";
	this.divObj.style.top=this.scrY+"px";
}


function dbg(txt) {
	document.getElementById("dbg").innerHTML=txt;
}

function tokenizeText(strText) {	
	strText = strText.replace(/<!--[\s\S]*?-->/g,"");
	strText = strText.replace(/(<([^>]+)>)/ig,"");
	strText = strText.replace(/\n+/ig," ");
	strText = strText.replace(/\s+/ig," ");
	strText = strText.replace(/&[a-z]+;/ig,"");
	strText = strText.replace(/\s{3,}/g," ");		
	strText = strText.replace(/[\'\.,-\/#!$%\^&\*;:{}=\-_`~()]/g," ");	
	strText = strText.replace(/[ ]+/g," ").toLowerCase();	
	return strText;
}

function NGON_setCorpus(strText) {
	this.corpus=tokenizeText(strText).split(" ");
	this.corpus_index=0;
	for (i=0;i<this.nPoints.length;i++) {
		var str="";
		if (this.corpus_index>=this.corpus.length) this.corpus_index=0;
		else str=this.corpus[this.corpus_index]
		this.nPoints[i].txtHolder.innerHTML=str;	
		this.nPoints[i].text=str;				
		this.corpus_index++;
	}
}

function NGON_initArray(arrPoints) {
	var pid=this.nPoints.length;
	
	for (i=0;i<arrPoints.length;i++) {
		var point=arrPoints[i];
		var x=point.x;
		var y=point.y;
		var z=point.z;
		var fontSize=point.fontSize;
		var text=point.text;
		var objPoint= new nGonPointObj(pid+i,this.centerX+x,this.centerY+y,z,text,fontSize,point.udv,this);
		if (point.udf) objPoint.udf=point.udf;
		this.addPoint(objPoint);

	}
}
function NGON_init(strPoints) {
	var pid=this.nPoints.length;
	var pointArray=strPoints.split(" ");
	for (i=0;i<pointArray.length;i++) {
		var coorArray=pointArray[i].split(",");
		var objPoint= new nGonPointObj(pid+i,this.centerX+parseInt(coorArray[0]),this.centerY+parseInt(coorArray[1]),parseInt(coorArray[2]));
		this.addPoint(objPoint);

	}
}
function NGON_clear() {
	for (i=this.nPoints.length-1;i>=0;i--) {
		this.nPoints[i].divObj.style.display="none";
		this.nPoints[i].divObj=null;
		this.nPoints.pop(i);
	}
	while (this.nPoints.length>0) this.nPoints.pop(0);
	for (i=this.nFaces.length-1;i>=0;i--) {
		this.nFaces[i].shape.style.display="none";
		this.nFaces[i].shape=null;
		this.nFaces[i]=null;
		this.nFaces.pop(i);
	}
	while (this.nFaces.length>0) this.nFaces.pop(0);
}



function NGON_addPoint(obj) {
	this.nPoints[this.nPoints.length]=obj;
	if (obj.z<this.minZ) this.minZ=obj.z;
	if (obj.z>this.maxZ) this.maxZ=obj.z;
	
}


function faceNormal(point1,point2,point3,point4) {
		var sx1=point1.scrX-point2.scrX;
		var sy1=point1.scrY-point2.scrY;
		var sz1=point1.z-point2.z;
		var sx2=point3.scrX-point4.scrX;
		var sy2=point3.scrY-point4.scrY;
		var sz2=point3.z-point4.z;
		var dpx = sy1 * sz2 - sy2 * sz1;
		var dpy = sx2 * sz1 - sx1 * sz2;
		var dpz= sx1 * sy2 - sx2 * sy1;
	    var dprod = 0 * dpx + 0 * dpy + iFov*(dpz/iDistance);
	    return dprod;
}

function NGON_rotate(xRotate,yRotate,iZoom) {

	var xRotateAngle=(-yRotate)*(2*Math.PI)/180;
	var yRotateAngle=(-xRotate)*(2*Math.PI)/180;
	var zRotateAngle=0;//xRotate*(2*Math.PI)/180;
	
	for (i=0;i<this.nPoints.length;i++) {
		var pointObj=this.nPoints[i];
		
		// Re-tool for the 0-MAX_X, 0 - MAX_Y screen coords
		var x=pointObj.x-this.centerX;
		var y=this.centerY-pointObj.y;

		var z=pointObj.z;

		var newy=y;
		var newx=x;
		var newz=z;

		newy=(y*Math.cos(xRotateAngle))-(z*Math.sin(xRotateAngle)); // X axis
		newz=(z*Math.cos(xRotateAngle))+(y*Math.sin(xRotateAngle));
		z=newz;
		y=newy;

		newz=(z*Math.cos(yRotateAngle))-(x*Math.sin(yRotateAngle)); // Y axis
		newx=(x*Math.cos(yRotateAngle))+(z*Math.sin(yRotateAngle));
		z=newz;
		x=newx;


		// BASIC 2D ROTATION (around Z axis)
		newx=(x*Math.cos(zRotateAngle))-(y*Math.sin(zRotateAngle)); // Z axis
		newy=(y*Math.cos(zRotateAngle))+(x*Math.sin(zRotateAngle));
		x=newx;
		y=newy;


		if (this.transX!=0) {
			newx+=this.transX;
		}


		// PARALLEL PROJECTION //
		pointObj.x=newx+this.centerX;
		pointObj.y=this.centerY-newy;


		// PERSPECTIVE PROJECTION //

		// ** DO THIS WITH X/Y VALUES
		// ** DERIVED FROM PARALLEL ROTATION
		// ** BUT DON'T UPDATE POINTOBJ.X/Y
		// ** WITH PROJECTED RESULTS!

		iDistance+=iZoom;
		if (!this.parallel) {
			pointObj.scrX = ((iFov*newx) / (iDistance-(newz+this.centerZ))) + (this.centerX);
	  		pointObj.scrY = (this.centerY) - ((iFov*newy) / (iDistance-(newz+this.centerZ)));
		}
		else {
			pointObj.scrX=pointObj.x;
			pointObj.scrY=pointObj.y;
		}

		pointObj.z=newz;
		if (pointObj.z<this.minZ) this.minZ=pointObj.z;
		if (pointObj.z>this.maxZ) this.maxZ=pointObj.z;
		
	}
	if (this.displayType=='canvas') {
		nGon.nPoints.sort(sortZ);
		var canvaselem = document.getElementById("canvas");
		var ctx = canvaselem.getContext("2d");
		var canvaswidth = canvaselem.width-0;
		var canvasheight = canvaselem.height-0;   
		ctx.clearRect(0,0,canvaswidth,canvasheight);
	}
	
	for (var i=0;i<nGon.nPoints.length;i++) {
		var pointObj=this.nPoints[i];
		if (this.displayType=='canvas') pointObj.redrawCanvas();
		else pointObj.redrawDiv();
	}
	
	
	this.transX=0;

}



function MoveHandler(e) {
	
 	if (e!='automate' && e.targetTouches) {
 		e.preventDefault();
		moveX = e.targetTouches[0].clientX;
		moveY = e.targetTouches[0].clientY;		
	}
	else if (e!='automate') {
		 moveX = e.clientX;     //firefox
		 moveY = e.clientY;     //firefox			
	}
	
	if (moveX<oldMoveX) xRotate=1;
	else if(moveX>oldMoveX) xRotate=-1;
	else xRotate=0;

	if (moveY<oldMoveY) yRotate=1;
	else if(moveY>oldMoveY) yRotate=-1;
	else yRotate=0;

	xRotate=oldMoveX-moveX;
	yRotate=oldMoveY-moveY;

	oldMoveX=moveX;
	oldMoveY=moveY;

	if ((bRightMouseDown || e=='automate')&&  (xRotate!=0 || yRotate!=0)) {
		nGon.rotate(xRotate,yRotate,0);
		
	}
	
}



function KeyHandler(e) {
	if(window.event)
		  key = window.event.keyCode;     //IE
	else
		  key = e.which;     //firefox
	switch(key) {
	case 51:
		nGon.clear();
		nGon.init();
	break;
	case 16: // strafe left;
		nGon.transX-=10;
		nGon.rotate(0,0,0);
	break;
	case 67: // strafe right;
		nGon.transX+=10;
		nGon.rotate(0,0,0);
	break;
	case 80: // toggle parallel
		nGon.parallel=!nGon.parallel;
		nGon.rotate(0,0,0);
	break;
	case 37:
		nGon.rotate(1,0,0);
	break;


	case 38:
		nGon.rotate(0,1,0);
	break;

	case 39:
		nGon.rotate(-1,0,0);
	break;

	case 40:
		nGon.rotate(0,-1,0);
	break;

	case 83:
		nGon.rotate(0,0,-1);
	break;

	case 90:
		nGon.rotate(0,0,1);
	break;
	default:
	break;
	}
}

function PressHandler(e) {
	bRightMouseDown=true;

	return false;
//	if(window.event) mousegrabber.setCapture(true);
	if(window.event) {
		if (window.event.button==1) bLeftMouseDown=true;
		else if (window.event.button==2) {bRightMouseDown=true;}
	}
	else{
		if (e.button==1) bLeftMouseDown=true;
		else if (e.button==2) bRightMouseDown=true;
	}

	return false;
}

function UpHandler(e) {
	
//	if(window.event) mousegrabber.releaseCapture();	
	if (typeof e.targetTouches=='undefined') {
		if (e.button==0) {
			bLeftMouseDown=true;
		}
		else if (e.button==1) bRightMouseDown=true;
	}
	bLeftMouseDown=false;
	bRightMouseDown=false;
	return false;
}

function doClick(strText) {


}
	
window.onresize = getWinSize;
document.addEventListener('mouseup',UpHandler,true);
document.addEventListener('touchend',UpHandler,true);
document.addEventListener('keydown',KeyHandler,false);
document.addEventListener('mousemove',MoveHandler,true);
document.addEventListener('touchmove',MoveHandler,true);
document.addEventListener('mousedown',PressHandler,true);
document.addEventListener('touchstart',PressHandler,true);
document.oncontextmenu=new Function("return false;");
document.addEventListener('contextmenu',new function(){return false;},false);
	