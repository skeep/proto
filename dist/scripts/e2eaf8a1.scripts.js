angular.module("protoApp",[]).config(["$routeProvider",function(e){"use strict";e.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("protoApp").controller("MainCtrl",["$scope","uuid","fs",function(e,t,n){"use strict";function o(t){n.handleFileSelect(t,e)}function r(t){n.handleImportFile(t,e)}e.appName="myApp",e.set=function(e){n.write(e)},e.reset=function(){n.write({})},e.loadScreen=function(t){e.screens=JSON.parse(t),e.images={},e.screenList=_.keys(e.screens),e.screenList=_.map(e.screenList,function(t){return{id:t,imageData:e.screens[t].imageData,getImageData:function(){console.log("reading "+e.screens[t].imageName),e.images[t]={},n.read(e.screens[t].imageName,"",e.images[t])},imageName:e.screens[t].imageName}}),e.screenList[0]&&(e.screen=e.screens[e.screenList[0].id],e.$apply()),n.readTemplateFile(),setTimeout(function(){e.$apply()},2e3)},e.download=function(){n.download(e)},e.spotId=null;var i=!1,s=null;n.requestForFile(e.loadScreen),e.editMode=!0,e.showHotspot=!0,e.toggleSpotList=function(){e.showHotspot=!e.showHotspot},e.changeMode=function(){e.editMode=!e.editMode},e.changeScreen=function(t){e.screen=e.screens[t]},e.deleteScreen=function(t){delete e.screens[t],e.set(e.screens)},e.addSpot=function(t,n){e.screens[n].hotspots.push({top:t.offsetY-28,left:t.offsetX-2,width:150,height:30,target:null}),e.set(e.screens)},e.deleteSpot=function(t,n){e.screens[t].hotspots.splice(n,1),e.set(e.screens)},e.makePersistent=function(t,n){_.each(e.screens,function(e){e.id!==n&&e.hotspots.push(t)})},e.selectTarget=function(t,n){i=!i,i&&(s=t,e.spotId=n)},e.selectScreen=function(t){i?(e.screens[s].hotspots[e.spotId].target=t,i=!1,s=null,e.spotId=null,e.set(e.screens)):e.changeScreen(t)};var a=document.getElementById("drop_zone");a.addEventListener("dragover",n.handleDragOver,!1),a.addEventListener("drop",o,!1),document.getElementById("files").addEventListener("change",r,!1)}]),angular.module("protoApp").directive("draggable",function(){"use strict";return{restrict:"A",link:function(e,t,n){$(t).draggable({handle:"span.handle",stop:function(t,o){e.$parent.screens[n.screen].hotspots[n.id].top=o.position.top,e.$parent.screens[n.screen].hotspots[n.id].left=o.position.left,console.log(e.$parent.screens[n.screen].hotspots[n.id]),e.$parent.set(e.$parent.screens)}})}}}),angular.module("protoApp").directive("resizable",function(){"use strict";return{restrict:"A",link:function(e,t,n){$(t).resizable({stop:function(t,o){e.$parent.screens[n.screen].hotspots[n.id].width=o.size.width,e.$parent.screens[n.screen].hotspots[n.id].height=o.size.height,console.log(e.$parent.screens[n.screen].hotspots[n.id]),e.$parent.set(e.$parent.screens)}})}}}),angular.module("protoApp").directive("popover",function(){"use strict";return{restrict:"A",link:function(e,t){$(t).popover()}}}),angular.module("protoApp").directive("tooltip",function(){"use strict";return{restrict:"A",link:function(e,t){$(t).tooltip()}}}),angular.module("protoApp").factory("uuid",function(){"use strict";function e(){var e,t,n=[],o="0123456789ABCDEF";for(e=0;36>e;e++)n[e]=Math.floor(16*Math.random());for(n[14]=4,n[19]=8|3&n[19],t=0;36>t;t++)n[t]=o[n[t]];return n[8]=n[13]=n[18]=n[23]="-",n.join("")}return{get:e}}),angular.module("protoApp").factory("fs",["uuid",function(e){"use strict";function t(e,t){var t=t||"tempdata";window.webkitStorageInfo.requestQuota(PERSISTENT,10485760,function(o){window.requestFileSystem(PERSISTENT,o,function(o){f=o,f.root.getFile(t,{create:!0,exclusive:!1},function(){"tempdata"==t&&n(t,e)},i)},i)},function(e){console.log("Error",e)})}function n(e,t,n){f.root.getFile(e,{create:!1},function(o){o.file(function(o){var r=new FileReader;r.onloadend=function(){console.log(e+' content: "'+this.result+'"'),t?t(this.result||"{}"):n.imageData=this.result},r.readAsText(o)},i)},i)}function o(e,t){var t=t||"tempdata";r(t),window.webkitStorageInfo.requestQuota(PERSISTENT,104857600,function(n){window.requestFileSystem(PERSISTENT,n,function(n){f=n,f.root.getFile(t,{create:!0,exclusive:!1},function(n){n.createWriter(function(n){if(n.onwriteend=function(){console.log("Write completed.")},n.onerror=function(e){console.log("Write failed: "+(""+e))},"tempdata"==t)var o=new Blob([JSON.stringify(e)],{type:"text/plain"});else var o=new Blob([e],{type:"text/plain"});n.write(o),console.log(o)},i)},i)},i)},function(e){console.log("Error",e)})}function r(e){f.root.getFile(e,{},function(e){e.remove(function(){console.log("File removed.")},i)},i)}function i(e){var t="";switch(e.code){case FileError.QUOTA_EXCEEDED_ERR:t="QUOTA_EXCEEDED_ERR";break;case FileError.NOT_FOUND_ERR:t="NOT_FOUND_ERR";break;case FileError.SECURITY_ERR:t="SECURITY_ERR";break;case FileError.INVALID_MODIFICATION_ERR:t="INVALID_MODIFICATION_ERR";break;case FileError.INVALID_STATE_ERR:t="INVALID_STATE_ERR";break;default:t="Unknown Error"}console.log("Error: "+t)}function s(){h="";var e=new XMLHttpRequest;e.onreadystatechange=function(){200==e.status&&4==e.readyState&&(h=e.responseText)},e.open("GET","appTemp.js",!0),e.send()}function a(e){for(var t in e.images)e.screens[t].imageData=e.images[t].imageData;Downloadify.create("downloadFile",{filename:function(){return e.appName+".html"},data:h+"var data = "+JSON.stringify(e.screens)+"</script></body></html>",onComplete:function(){alert("Your File Has Been Saved!")},onCancel:function(){alert("You have cancelled the saving of this file.")},onError:function(){alert("You must put something in the File Contents or there will be nothing to save!")},swf:"components/downloadify/downloadify.swf",downloadImage:"components/downloadify/download.png",width:100,height:30,transparent:!0,append:!1})}function c(e){if(e.lengthComputable){var t=Math.round(100*(e.loaded/e.total));100>t&&(g.style.width=t+"%",g.textContent=t+"%")}}function l(e,t){g.style.width="0%",g.textContent="0%",p=new FileReader,p.onerror=i,p.onprogress=c,p.onabort=function(){alert("File read cancelled")},p.onloadstart=function(){m.style.visibility="",m.className="loading"},p.onload=function(e){g.style.width="100%",g.textContent="100%",console.log("Import File: "+e.target.result),t.loadScreen(e.target.result),o(JSON.parse(e.target.result)),m.style.visibility="hidden"},p.readAsBinaryString(e.target.files[0])}function u(t,n){t.stopPropagation(),t.preventDefault();for(var r,i=t.dataTransfer.files,s=0;r=i[s];s++)if(r.type.match("image.*")){var a=new FileReader;a.onload=function(t){return function(r){var i=e.get(),s=escape(t.name);n.screens[i]={id:i,imageName:s,writeImageData:function(){o(r.target.result,s)}(),hotspots:[]},n.set(n.screens)}}(r),a.readAsDataURL(r)}}function d(e){e.stopPropagation(),e.preventDefault(),e.dataTransfer.dropEffect="copy"}window.requestFileSystem=window.requestFileSystem||window.webkitRequestFileSystem;var p,f=null,g=document.querySelector(".percent"),m=document.getElementById("progress_bar"),h="";return{requestForFile:t,read:n,readTemplateFile:s,write:o,download:a,handleImportFile:l,handleFileSelect:u,handleDragOver:d}}]);