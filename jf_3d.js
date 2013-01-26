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
//var nGon;
var world;
var moveX=0;
var oldMoveX=0;
var moveY=0;
var oldMoveY=0;
var bRightMouseDown=false;
var bLeftMouseDown=false;
var iDistance=525;
var iFov=590;
var iLineYDiff=60;


function clearCanvas() {
		var canvaselem = document.getElementById("canvas");
		var ctx = canvaselem.getContext("2d");
		var canvaswidth = canvaselem.width-0;
		var canvasheight = canvaselem.height-0;   
		ctx.clearRect(0,0,canvaswidth,canvasheight);
}

function worldObj(x,y) {
	this.totalXRot=0;
	this.totalYRot=0;
	this.totalZRot=0;
	
	this.clear=WORLD_clear;
	this.addNGon=WORLD_addNGon;
	this.rotate=WORLD_rotate;
	this.getNGon=WORLD_getNGon;
	this.ngons=[];
	this.centerX=x;
	this.centerY=y;
	return this;
}
function WORLD_getNGon(ngonid) {
	for (var i=0;i<this.ngons.length;i++) {	
		if (this.ngons[i].id==ngonid) return this.ngons[i];
	}
	return null;
}

function WORLD_rotate(x,y,z) {
	this.totalXRot+=x;
	this.totalYRot+=y;
	this.totalZRot+=z;
	
	clearCanvas();
	for (var i=0;i<this.ngons.length;i++) {	
		var ngon=this.ngons[i];
		this.ngons[i].maxZ=-1;
		ngon.worldRotate(this.totalXRot,this.totalYRot,this.totalZRot);
	}
	this.ngons.sort(sortNGonZ);

}
function WORLD_addNGon(ngon) {
	this.ngons[this.ngons.length]=ngon;

}
function WORLD_clear() {
	for (var i=0;i<this.ngons.length;i++) {
		var ngon=this.ngons[i];
		ngon.clear();
	}
}

function nGonPointObj(tid,x,y,z,nGon) {
	this.id=tid;
	this.camx=x;
	this.camy=y;
	this.camz=z;
	this.x=x;
	this.y=y;
	this.z=z;
	this.cartX;
	this.cartY;
	this.ngon=nGon;
	this.fontSize=((typeof fontSize=='undefined')?16:fontSize);
	this.scrX=x;
	this.scrY=y;
 	this.fillStyle="#ababab";
	this.redrawCanvas=NGON_POINT_redrawCanvas;
	return this;
}

function nGonFaceObj(p1,p2,p3) {
	this.fillStyle="#99bfde";
	this.myname="shape";
	this.p1=p1;
	this.p2=p2;
	this.p3=p3;
	return this;
}


function nGonObj(id,world,objectInfo) {
	if (typeof objectInfo=='undefined') this.objectInfo=null;
	else this.objectInfo=objectInfo;
	this.id=id;
	this.animData=null;
	this.world=world;
	this.transX=0;
	this.centerX=world.centerX;
	this.centerY=world.centerY;
	this.centerZ=0;
	this.parallel=false;
	this.displayType='canvas';
	this.name="NGonObject";
	this.nPoints=new Array();
	this.nFaces=new Array();
	this.angleDivisor=0;
	this.angle=0;
	this.objectInfo=objectInfo;
	this.rotate=NGON_rotate;
	this.worldRotate=NGON_worldRotate;
	this.selfRotate=NGON_selfRotate;
	this.rotate=NGON_rotate;
	this.getNewMids=NGON_getNewMids;
	this.clear=NGON_clear;
	this.addPoint=NGON_addPoint;
	this.addFace=NGON_addFace;
	this.drawFaces=NGON_drawFaces;
	this.translate=NGON_translate;
	this.getHeight=NGON_getHeight;
	this.midx=0;
	this.midy=0;
	this.midz=0;
	this.initArray=NGON_initArray;
	this.self=this;
	this.maxZ=0;
	this.minZ=0;
	
	return this;
}

function NGON_getHeight() {
	var minY=Infinity;
	var maxY=-Infinity;
	for (var i=0;i<this.nPoints.length;i++) {	
		var point=this.nPoints[i];
		if (point.y<minY) minY=point.y;
		if (point.y>maxY) maxY=point.y;	
	}
	return Math.abs(maxY-minY);

}
function NGON_translate(vec) {
	for (i=0;i<this.nPoints.length;i++) {		
		var point=this.nPoints[i];
		point.x+=vec[0];
		point.y+=vec[1];
		point.z+=vec[2];
		point.cartX=parseInt(point.x);
		point.cartY=parseInt(point.y);	
	}
	this.getNewMids();
}

function sortNGonZ(a,b) {
	if (a.maxZ>b.maxZ) return 1;
	if (b.maxZ>a.maxZ) return -1;
	return 0
}

function sortPointZ(a,b) {
	if (a.camz>b.camz) return 1;
	if (b.camz>a.camz) return -1;
	return 0
}
 
function sortFaceZ(a,b) {	
	var p11=a.p1;
	var p12=a.p2;
	var p13=a.p3;
	var z1=Math.max(p11.camz,p12.camz,p13.camz);
	var p21=b.p1;
	var p22=b.p2;
	var p23=b.p3;
	var z2=Math.max(p21.camz,p22.camz,p23.camz);
	if (z1>z2) return 1;
	else if (z1<z2) return -1;
	else return 0;
}

function NGON_drawFaces () {
	var strPath="";
	var dprod=0;
	var canvaselem = document.getElementById("canvas");
	var c2 = canvaselem.getContext('2d');
	this.nFaces.sort(sortFaceZ);
	for (i=0;i<this.nFaces.length;i++) {
		var faceObj=this.nFaces[i];
		var p1=faceObj.p1;
		var p2=faceObj.p2;
		var p3=faceObj.p3;
		var tZ=p1.camz+p2.camz+p3.camz;
		if (tZ>this.maxZ) this.maxZ=tZ;
		dprod=faceNormal(faceObj); 
		if (dprod>0) {			
			c2.fillStyle = faceObj.fillStyle;
			c2.strokeStyle="#999999";
			c2.beginPath();
			c2.moveTo(p1.scrX,p1.scrY);
			c2.lineTo(p2.scrX,p2.scrY);
			c2.lineTo(p3.scrX,p3.scrY);
			c2.closePath();
			c2.fill();
			c2.stroke();
		}
		
	}
}

function NGON_POINT_redrawCanvas() {
	var canvaselem = document.getElementById("canvas");
	var ctx = canvaselem.getContext("2d");
	var canvaswidth = canvaselem.width-0;
	var canvasheight = canvaselem.height-0;   
	var fs=(this.fontSize*(1/discretizeZ(this.z)));	
	ctx.beginPath();
	ctx.fillStyle="#000000";
	var r=2;
	ctx.arc(Math.floor(this.scrX), Math.floor(this.scrY), r, 0 , 2 * Math.PI, false);
	ctx.fill();
		
}

function discretizeZ(z) {
	if (z<-50) return 6;
	else if (z<-25) return 5;
	else if (z<-0) return 4;
	else if (z<25) return 3;
	else if (z<50) return 2;
	else return 1;
}

function dbg(txt,clear) {
	var db=document.getElementById('dbg');
	if (clear) db.innerHTML='';
	db.innerHTML=db.innerHTML+txt;
}
function NGON_getNewMids() {
	var extx=[Infinity,-Infinity];
	var exty=[Infinity,-Infinity];
	var extz=[Infinity,-Infinity];
	for (i=0;i<this.nPoints.length;i++) {
		var point=this.nPoints[i];
		var x=point.x;
		if (x>extx[1]) extx[1]=x;
		if (x<extx[0]) extx[0]=x;		
		var y=point.y;
		if (y>exty[1]) exty[1]=y;
		if (y<exty[0]) exty[0]=y;		
		var z=point.z;
		if (z>extz[1]) extz[1]=z;
		if (z<extz[0]) extz[0]=z;	
	}
	this.midx=extx[0]+(Math.abs(extx[1]-extx[0])/2);
	this.midy=exty[0]+(Math.abs(exty[1]-exty[0])/2);
	this.midz=extz[0]+(Math.abs(extz[1]-extz[0])/2);
}

function NGON_initArray(arrPoints,scale) {
	if (typeof scale=='undefined') scale=1;
	var pid=this.nPoints.length;
	for (i=0;i<arrPoints.length;i++) {
		var point=arrPoints[i];
		var x=point.x*scale;
		var y=point.y*scale;
		var z=point.z*scale;
		var objPoint= new nGonPointObj(pid+i,this.centerX+x,this.centerY+y,z,this);
		objPoint.fillStyle=point.fillStyle;
		objPoint.cartX=parseInt(x);
		objPoint.cartY=parseInt(y);		
		this.addPoint(objPoint);
		if ((i+1)%3==0) {			
			var objFace = new nGonFaceObj(this.nPoints[i], this.nPoints[i-1], this.nPoints[i-2]);
			objFace.fillStyle=point.fillStyle;
			this.addFace(objFace);
		}
	}
	this.getNewMids();
}
function NGON_clear() {
	for (i=this.nPoints.length-1;i>=0;i--) {
		this.nPoints.splice(i,1);
	}
	while (this.nPoints.length>0) this.nPoints.splice(0);
	for (i=this.nFaces.length-1;i>=0;i--) {
		this.nFaces[i]=null;
		this.nFaces.splice(i,1);
	}
	while (this.nFaces.length>0) this.nFaces.splice(0);
}



function NGON_addFace(obj) {
	this.nFaces[this.nFaces.length]=obj;
}

function NGON_addPoint(obj) {
	this.nPoints[this.nPoints.length]=obj;
	if (obj.z<this.minZ) this.minZ=obj.z;
	if (obj.z>this.maxZ) this.maxZ=obj.z;
	
}


function faceNormal(faceObj) {
	var point1,point2,point3,point4;
	
	point1=faceObj.p1;
	point2=faceObj.p2;
	point3=faceObj.p2;
	point4=faceObj.p3;


	var sx1=point1.cartX-point2.cartX;
	var sy1=point1.cartY-point2.cartY;
	var sz1=point1.camz-point2.camz;

	var sx2=point3.cartX-point4.cartX;
	var sy2=point3.cartY-point4.cartY;
	var sz2=point3.camz-point4.camz;

	var dpx = sy1 * sz2 - sy2 * sz1;
	var dpy = sx1 * sz2 - sx2 * sz1;
	var dpz = sx1 * sy2 - sx2 * sy1;
	var dprod = 0 * dpx + 0 * dpy + iFov*(dpz/iDistance);
	return dprod;
}

function NGON_selfRotate(xRotate,yRotate,iZoom) {
	this.rotate(xRotate,yRotate,iZoom,false);
}

function NGON_worldRotate(xRotate,yRotate,iZoom) {
	this.rotate(xRotate,yRotate,iZoom,true);
}


function NGON_rotate(xRotate,yRotate,zRotate,bWorld) {
	var cx,cy,cz;
	if (bWorld) {
		cx=this.centerX;
		cy=this.centerY;
		cz=this.centerZ;
	}
	else {
		/*cx=this.centerX;
		cy=this.centerY;
		cz=this.centerZ;*/
		cx=this.midx;
		cy=this.midy;
		cz=this.midz;
	
	}
	var xRotateAngle=(-yRotate)*(2*Math.PI)/180;
	var yRotateAngle=(-xRotate)*(2*Math.PI)/180;
	var zRotateAngle=(-zRotate)*(2*Math.PI)/180;
	
	for (i=0;i<this.nPoints.length;i++) {
		var pointObj=this.nPoints[i];
		
		// Re-tool for the 0-MAX_X, 0 - MAX_Y screen coords
		var x=pointObj.x-cx;
		var y=cy-pointObj.y;
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
		if (bWorld) {
			pointObj.camx=newx+cx;
			pointObj.camy=cy-newy;
		}
		else {
			pointObj.x=newx+cx;
			pointObj.y=cy-newy;
		
		}

		// PERSPECTIVE PROJECTION //

		// ** DO THIS WITH X/Y VALUES
		// ** DERIVED FROM PARALLEL ROTATION
		// ** BUT DON'T UPDATE POINTOBJ.X/Y
		// ** WITH PROJECTED RESULTS!

		//iDistance+=iZoom;
		
		if (bWorld) {
			pointObj.scrX = ((iFov*newx) / (iDistance-(newz+cz))) + (cx);
			pointObj.scrY = (cy) - ((iFov*newy) / (iDistance-(newz+cz)));
			pointObj.cartX=pointObj.scrX-cx;
			pointObj.cartY=pointObj.scrY-cy;
			pointObj.cartY=-newy;
			pointObj.camz=newz;		
		}
		else {
			pointObj.z=newz;		
		}
	}
	if (bWorld) {
		this.nPoints.sort(sortPointZ);
		for (var i=0;i<this.nPoints.length;i++) {
			var pointObj=this.nPoints[i];
			pointObj.redrawCanvas();	
		}
		this.drawFaces();	
		this.transX=0;
	}
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
	//dbg(world.rotate)
		world.rotate(xRotate,yRotate,0);
		
	}
	
}



function KeyHandler(e) {

}

function PressHandler(e) {
	bRightMouseDown=true;
	if (e!='automate' && e.targetTouches) {
 		e.preventDefault();
		oldMoveX = e.targetTouches[0].clientX;
		oldMoveY = e.targetTouches[0].clientY;		
	}
	else if (e!='automate') {
		 oldMoveX = e.clientX;     //firefox
		 oldMoveY = e.clientY;     //firefox			
	}
	return false;
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

	
document.addEventListener('mouseup',UpHandler,true);
document.addEventListener('touchend',UpHandler,true);
document.addEventListener('keydown',KeyHandler,false);
document.addEventListener('mousemove',MoveHandler,true);
document.addEventListener('touchmove',MoveHandler,true);
document.addEventListener('mousedown',PressHandler,true);
document.addEventListener('touchstart',PressHandler,true);
document.oncontextmenu=new Function("return false;");
document.addEventListener('contextmenu',new function(){return false;},false);
	