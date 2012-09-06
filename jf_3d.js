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

var LinkColor="#000000";
var PointColor="#000000";


function setLinkColor(tlink) {
	LinkColor=tlink;
}
function setPointColor(tpoint) {
	PointColor=tpoint;
}

function getWinSize() {

	winX = document.body.clientWidth - 10;
	winY = document.body.clientHeight - 10;
	if (winX>800)  winX=400;
	if (winY>600) winY=600
	if (nGon) {
		nGon.centerX=winX/2;
		nGon.centerY=winY/2;
		nGon.clear();
	}
	drawPolygon();
}



function nGonPointObj(tid,x,y,z,strTxt) {
	if (!strTxt) strTxt="O";
	this.id=tid;
	this.x=x;
	this.y=y;
	this.z=z;
	this.scrX=x;
	this.scrY=y;
	var newObj=document.createElement("div");
	newObj.id="nGonPoint"+tid;
	newObj.style.position="absolute";
	newObj.style.display="inline";
	newObj.style.color="red";
	newObj.style.textAlign="center";
	newObj.style.fontWeight="bold";
	newObj.style.fontSize="16px";
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
	this.redraw=NGON_POINT_redraw;
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
	this.name="NGonObject";
	this.nPoints=new Array();
	this.nFaces=new Array();
	this.angleDivisor=0;
	this.angle=0;
	this.rotate=NGON_rotate;
	this.clear=NGON_clear;
	this.addPoint=NGON_addPoint;
	this.init=NGON_init;
	this.setCorpus=NGON_setCorpus;
	return this;
}

function NGON_POINT_redraw() {

	
	if (this.z<-50) {
		if (this.linkObj.className.indexOf("grey")>-1) {
			this.linkObj.className="grey6";
			this.linkObj.style.color=getGrad(PointColor,6);
		}
		else {
			this.linkObj.className="nav6";
			this.linkObj.style.color=getGrad(LinkColor,6);
		}
		this.divObj.style.zIndex="10";
		this.divObj.style.fontSize="10px";
		}
	else if (this.z<-25)  {
		if (this.linkObj.className.indexOf("grey")>-1) {
			this.linkObj.className="grey5";
			this.linkObj.style.color=getGrad(PointColor,5);
		}
		else {
			this.linkObj.className="nav5";
			this.linkObj.style.color=getGrad(LinkColor,5);
		}
		this.divObj.style.zIndex="20";
		this.divObj.style.fontSize="12px";
		}
	else if (this.z<-0)  {
		if (this.linkObj.className.indexOf("grey")>-1)  {
			this.linkObj.className="grey4";
			this.linkObj.style.color=getGrad(PointColor,4);
		}
		else {
			this.linkObj.className="nav4";
			this.linkObj.style.color=getGrad(LinkColor,4);
		}
		this.divObj.style.zIndex="30";
		this.divObj.style.fontSize="13px";
		}
	else if (this.z<-25)  {
		if (this.linkObj.className.indexOf("grey")>-1)  {
			this.linkObj.className="grey3";
			this.linkObj.style.color=getGrad(PointColor,3);
		}
		else {
			this.linkObj.className="nav3";
			this.linkObj.style.color=getGrad(LinkColor,3);
		}
		this.divObj.style.zIndex="40";
		this.divObj.style.fontSize="14px";
		}
	else if (this.z<50)  {
		if (this.linkObj.className.indexOf("grey")>-1)  {
			this.linkObj.className="grey2";
			this.linkObj.style.color=getGrad(PointColor,2);
		}
		else {
			this.linkObj.className="nav2";
			this.linkObj.style.color=getGrad(LinkColor,2);
		}
		this.divObj.style.zIndex="50";
		this.divObj.style.fontSize="15px";
		}
	else  {
		if (this.linkObj.className.indexOf("grey")>-1) { 
			this.linkObj.className="grey1";
			this.linkObj.style.color=getGrad(PointColor,1);
		}
		else {
			this.linkObj.className="nav1";
			this.linkObj.style.color=getGrad(LinkColor,1);
		}
		this.divObj.style.zIndex="60";
		this.divObj.style.fontSize="16px";
		}
	this.divObj.style.left=this.scrX+"px";
	this.divObj.style.top=this.scrY+"px";
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
		if (i>=this.corpus.length) i=0;
		this.corpus_index=i;		  
		this.nPoints[i].txtHolder.innerHTML=this.corpus[i];				
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
		// ** BUT DON''T UPDATE POINTOBJ.X/Y
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
		pointObj.redraw();
	}
	this.transX=0;

}



function MoveHandler(e) {

	if(window.event) {
		  moveX = window.event.x + document.body.scrollLeft;;     //IE
		  moveY = window.event.y;     //IE
	}
	else{
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

	if (bRightMouseDown &&  (xRotate!=0 || yRotate!=0)) {
		nGon.rotate(xRotate,yRotate,0);
	}
	else if (nGon)  {
		for (i=1;i<nGon.nPoints.length;i++) {
			var objPoint=nGon.nPoints[i];
			if (moveX>objPoint.scrX-10 &&
				moveX<objPoint.scrX+10 &&
				moveY>objPoint.scrY-10 &&
				moveY<objPoint.scrY+10 &&
				bLeftMouseDown) {
					objPoint.x=moveX;
					objPoint.y=moveY;
					objPoint.scrX=moveX;
					objPoint.scrY=moveY;
					objPoint.redraw();
				}

		}

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
	bLeftMouseDown=false;
	bRightMouseDown=false;
	return false;
}

function doClick(strText) {


}
	
window.onresize = getWinSize;
document.onmouseup=UpHandler;
document.addEventListener('mouseup',UpHandler,false);
document.onkeydown = KeyHandler;
document.addEventListener('keydown',KeyHandler,false);
document.onmousemove = MoveHandler;
document.addEventListener('mousemove',MoveHandler,false);
document.onmousedown = PressHandler;
document.addEventListener('mousedown',PressHandler,false);
document.oncontextmenu=new Function("return false;");
document.addEventListener('contextmenu',new function(){return false;},false);
	