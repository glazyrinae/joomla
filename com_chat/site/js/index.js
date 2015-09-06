var updateTimer	= false;
var inProgress	= false;
var stopajax	= false;
var originName	= '';
var user_status = '';
var noactivity;
var nextRequest   = 5000;
var startFrom;
var id_user;			
var onlineTimer;

var lastIdScroll;
onlineUser = function()
{
	jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=users", function(data) {
		if (data){
			getUserList(data);
			triggerContent("user");
					
			var url = window.location.href;
			var id = getURLParameter(url, 'id');
			//var noactivity = 1;
			
			jQuery("#content_msg").find(".tr").each(function(){
				if (jQuery(this).data('userid')==id)
					jQuery(this).click();
			});
					
			jQuery("#content_msg .user_hover").removeClass("danger").addClass("success");
			
			jQuery.each(data, function(index) {					
				
				if (data){
					var $index	   = data[index].id;
					var date	   = data[index].date;
					var offile 	   = data[index].online;
					var new_msg    = data[index].new_msg;
					var msg 	   = data[index].msg;
					var isHref     = jQuery('<div class="isHref">'+data[index].msg+'</div>');
					jQuery("#content_msg .user_hover").each(function(index){
						if (jQuery(this).data("userid")==$index){									
							//var test=false;
							if (msg){								
								
								var $tr   = jQuery(this).find(".td");
								var $span = "<span class='msg ' >"+(!isHref.find("a").attr("href") ? jQuery.emotions(msg.slice(0, -(msg.length-55)))+"..." : msg)+"</span><span class='user_msg_date'>11.01.2005 11:00:01</span>"; //переписка
								
								if (!offile) 
									jQuery(this).removeClass("success").addClass("danger"); //проверка онлайн
								
								$tr.find(".msg").remove();
								jQuery(this).find(".user_msg_date").remove();
								$tr.append(jQuery($span));	
								
								jQuery(this).find(".new_msg").remove();
								if (parseInt(new_msg)){	
									$tr.find('.msg').after(jQuery('<span class="new_msg" style="float:right;margin-top:-40px">+'+new_msg+'</span>')); //новые сооб-я  
								}
								//test=true;
							}
							else{
								//alert('???');
								//jQuery(this).remove();
							}	
						}							
					});
				}
			});	
		}	
	},"json");
};
	
setTimeout(onlineUser);			
	
onlineTimer = setInterval(onlineUser, nextRequest);	
		
jQuery(document).on("click",".list_user",function(e){
	e.preventDefault();
	jQuery('#sendmsg').empty(); 
	jQuery("#title").find(".user_name").remove();
	if (updateTimer) clearInterval(updateTimer);
	if (onlineTimer) clearInterval(onlineTimer);
	jQuery('#content_msg').html('');
	onlineUser();
	onlineTimer = setInterval(onlineUser, nextRequest);
});	

jQuery(document).on("keyup input change focus blur", "#sendmsg", function(e){
	e.preventDefault();
	if (jQuery("#content_msg").find('.info').length>0){
		var $lastId = jQuery("#content_msg .user_msg:last").data("idmsg") ? jQuery("#content_msg .user_msg:last").data("idmsg") : 0;
		jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=readmsg", { id: $lastId}, function(data) {
			var str = '';
			if (data=='ok') {
				jQuery("#content_msg").find(".tr").removeClass('info').end().find('.msg_delete').remove();
			}			
		});
	}
});	

jQuery(document).on("keyup input change", "#search", function(e){
	e.preventDefault();
	var searchString = jQuery('#search').val();
	searchString = searchString.toLowerCase();
	jQuery("#content_msg .tr .td .user").each(function(){					
		if (jQuery(this).html().toLowerCase().indexOf(searchString) == -1)
			jQuery(this).parent().hide();
		else
			jQuery(this).parent().show();
	});
});

jQuery(document).on("keyup","#sendmsg",function(e){			
	e.preventDefault();
	if(e.keyCode == 13){
		sendMsg(jQuery("#sendmsg").val());
	}
});
		
jQuery(document).on("click","#content_msg .info .td .msg_delete",function(e){
	e.preventDefault();
	$id = (jQuery(this).closest(".tr").data("idmsg") ? jQuery(this).closest(".tr").data("idmsg") : 0);
	var _self=jQuery(this);
	jQuery.get( "index.php?option=com_chat&task=getajax&format=raw&type=hide",{id:$id},function(data) {
		if (data){
			_self.closest(".tr").remove();
		}	
	});
});
		
jQuery(document).on("click",".user_hover",function(){
	//var noactivity = 1;
	//var noactivity = 1000;
	if (!jQuery(this).hasClass("tr")) return false;
	
	id_user = jQuery(this).data("userid");
	
	var user_status = (jQuery(this).attr("class")).split(" ");
	var user_avatar = jQuery(this).find(".ava_nick img").attr("src");
	
	jQuery("#title").find(".user_name").remove();
	jQuery("#title").attr("data-userid",id_user);
	jQuery(this).find(".new_msg").remove();
	
	jQuery("#title").append(jQuery('<div class="ava_nick"><img class="chat_user_avatar" style="margin-top:0px" src="'+user_avatar+'" alt="user_avatar_001" width=32 height=32></div><span class="user_name '+user_status[1]+'" style="padding:5px 10px;line-height:2em;font-size:18px;font-weight:bold;">'
	+jQuery(this).find('.td').find('.user').html()+'</span>'));
	
	triggerContent("messages");				
	jQuery("#content_msg").html('');
	
	jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=getmsg", { id: jQuery(this).data("userid")},function( data ) {
		var str  = '';
		var $del = '';
		var h    = '';
		var r;
		var cls;
		if (data) {
			jQuery.each(data, function(index) {
			
				if (data[index].hide==1){ h="hidde";} else { h=""}
				
				if (data[index].read==1){ r="";} else {r="info";$del='<div class="msg_delete" style="float:right"><img src="/components/com_chat/images/uploadify-cancel.png" /></div>'}
				
				if (data[index].id_from==id_user){ cls="active";$del="";} else {cls="";}
				
				str+="<div class='tr user_msg "+cls+" "+r+" "+h+"' data-userid="+data[index].id_from+" data-idmsg="+data[index].id+"><div class='td'>"+jQuery.emotions(data[index].msg)+"<span>"+data[index].date+"</span>"+$del+"</div></div>";	
			});					
		}	
		if (str) jQuery("#content_msg").html(str);
		lastIdScroll=jQuery("#content_msg").find(".tr:last").data("idmsg");
		scrollTab();
	},"json");
	//updateTimer = setInterval(updateContent, nextRequest);
	
	//callback();
	updateTimer = setTimeout(callback, 5000);
	noactivity = 1;
	if (onlineTimer) clearInterval(onlineTimer);

		
});	
function getURLParameter(url, name) {
	return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}	
function callback(){
	var str = '';		
	var $lastId = jQuery("#content_msg .active:last").data("idmsg") ? jQuery("#content_msg .active:last").data("idmsg") : 0;
	jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=update", { id_to: id_user, id_last: $lastId},function(data) {							
		var $i=1;
		var r;
		var h;
		var lst;			
		if (data){
			jQuery.each(data, function(index) {
				lst = (data.length==$i)    ? 'info'  : ''; 
				h   = (data[index].hide==1 ? "hidde" : "");
				r   = (data[index].read==1 ?  ""     : "info");
								
				if (lst && data[index].id){
					jQuery("#content_msg").find(".tr:not(.active)").removeClass('info').end().find('.msg_delete').remove(); 
				}
				if (data[index].id){ 
					str+="<div class='tr user_msg active "+r+" "+h+"' data-userid="+data[index].id_from+" data-idmsg="+data[index].id+"><div class='td'>"+
					((data[index].msg) ? jQuery.emotions(data[index].msg) : '')+'<span>'+data[index].date+"</span></div></div>";
				}
					
				jQuery("#title").find(".status_online").remove();
				if (data[index].status=='offline'){
					jQuery("#title").append(jQuery("<span class='status_online'>Покинул чат</span>"));
				}
				else{
					jQuery("#title").append(jQuery("<span class='status_online'>В сети</span>"));
				}
				if (data[index].hide){
					var $index=data[index].hide.id;
					jQuery("#content_msg .active").each(function(index){
						if (jQuery(this).data("idmsg")==$index)
							jQuery(this).remove();
					});
				}
				$i++;
			});
			if (str){
				jQuery("#content_msg").append(jQuery(str));
				noactivity  = 0;
				scrollTab();
			}
			else{
				++noactivity;
				console.log('='+noactivity);
			}
			// 2 секунды
			if(noactivity > 1){
				nextRequest = 2000;
			}								
			if(noactivity > 10){
				nextRequest = 5000;
			}								
			// 15 секунд
			if(noactivity > 20){
				nextRequest = 15000;
				noactivity = 30;
			}
			console.log(nextRequest);
		}					
	},"json");
	updateTimer=setTimeout(callback, nextRequest);
};	
function getUserList(data){
	var str = '';
	var status = '';
	if (!jQuery("#content_msg").find(".user_hover").length)
		jQuery("#content_msg").html('<span>Идет загрузка...</span>');
	jQuery.each(data, function(index) {
		if (data[index]){
			data[index].status=="online" ? status='success' : status='danger'; 
			data[index].avatar = data[index].avatar ? data[index].avatar : "";
			str+="<div class='tr user_hover "+status+"' data-userid="+data[index].id+"><div class='td'><div class='ava_nick'><img class='chat_user_avatar' src='"+data[index].avatar +"' alt='user_avatar_001' ></div><span class='user'>"+data[index].name+"</span></div></div>";
			
			}	
		});	
	
	if (!jQuery("#content_msg").find(".user_hover").length)
		jQuery("#content_msg").html(str);
	//alert(str);
	//alert(jQuery("#content_msg").find(".user_hover").length);		
}	
function dateNow(){
	var d = new Date();
	var curr_day = d.getDate();
	var curr_month = d.getMonth()+1;
	var curr_year = d.getFullYear();
	var curr_hour = d.getHours();
	var curr_min = d.getMinutes();			
	if (curr_day < 10)
		curr_day = "0" + curr_day;
	if (curr_month < 10)
		curr_month = "0" + curr_month;
	if (curr_hour < 10)
		curr_hour = "0" + curr_hour;
	if (curr_min < 10)
		curr_min = "0" + curr_min;
	return curr_day+"."+curr_month+"."+curr_year+"("+curr_hour+":"+curr_min+")";
}
function sendMsg(message)
{
	var str = '';
	var $del='<div class="msg_delete" style="float:right"><img src="/components/com_chat/images/uploadify-cancel.png" /></div>';
	var $lastId = jQuery("#content_msg .active:last").data("idmsg") ? jQuery("#content_msg .active:last").data("idmsg") : 0;
	var lastIdMsg = jQuery("#content_msg .user_msg:last").data("idmsg") ? jQuery("#content_msg .user_msg:last").data("idmsg") : 0;
	str_del="<div id='delete_msg' class='tr user_msg info' data-userid="+id_user+" data-idmsg="+lastIdMsg+"><div class='td'>"+jQuery.emotions(message)+"<br><span>"+dateNow()+"</span>"+"</div></div>";
	jQuery("#content_msg").append(jQuery(str_del));
	jQuery('#sendmsg').val("");
	scrollTab();
	jQuery.post("index.php?option=com_chat&task=getajax&format=raw&type=sendmsg", { id_to: id_user, id_last: $lastId , date: parseInt(new Date().getTime()/1000), msg: message},function(data) {				
		if (data)
		{					
			var r;
			jQuery("#content_msg").find("#delete_msg").remove();
			jQuery("#content_msg").find("#delete_progress").remove();
			jQuery.each(data, function(index) {							
				if (data[index].id){ 
					if (data[index].id_from==id_user){ var cls="active";} else {var cls="";}
					if (data[index].read==1){r="";$del="";}else{r="info";$del='<div class="msg_delete" style="float:right"><img src="/components/com_chat/images/uploadify-cancel.png" /></div>';}
					str+="<div class='tr user_msg "+cls+" "+r+"' data-userid="+data[index].id_from+" data-idmsg="+data[index].id+"><div class='td'>"+jQuery.emotions(data[index].msg)+data[index].date+$del+"</div></div>";
				}
			});	
			str+="<div class='tr user_msg info' data-userid="+id_user+" data-idmsg="+data[0].last_id+"><div class='td'>"+jQuery.emotions(message)+"<br><span>"+dateNow()+"</span>"+$del+"</div></div>";	
			jQuery("#content_msg").append(jQuery(str));
			scrollTab();
		}
	},"json");	
}
function triggerContent(trigger){
	if (trigger=="user"){
		jQuery('#sendmsg').attr("id","search");
		jQuery('#sendmsg').empty(); 
		jQuery('#smilesBtn').hide();
		jQuery('#smilesChoose').hide();
		jQuery("#MyUploadForm").hide();
		jQuery("#title").find(".status_online").remove();
		jQuery("#title").find(".chat_user_avatar").remove();
	}
	else{
		jQuery('#search').attr("id","sendmsg");
		jQuery('#search').empty(); 
		jQuery('#smilesBtn').show();		
		jQuery("#MyUploadForm").show();
		jQuery("#title").find(".status_online").remove();
		startFrom = 10;
		inProgress=false;
		stopajax=false;
		scrollTab();
	}
}
function scrollTab(){
	var height=999999*jQuery("#content_msg").height();
	jQuery('#content_msg').slimScroll({ height: '480px',color: '#337ab7',scrollTo: height+'px',start:'bottom'}); // 
}	
//function after succesful file upload (when server response)
function afterSuccess(data)
{
	jQuery('#submit-btn').show(); //hide submit button
	jQuery('#loading-img').hide(); //hide submit button
	jQuery('.progressbox:last').delay( 1000 ).fadeOut(); //hide progress bar
	if (data.indexOf("Error") == -1)
		sendMsg('<a href="/components/com_chat/addfile.php?q='+data+'" title='+fileName+'>'+trimFilename(fileName)+'</a>');
	else
		alert(data);
}
function trimFilename(str){
	var c = str.length-5;
	return str.slice(0, -c)+'...';
}
//function to check file size before uploading.
function beforeSubmit(){
   //check whether browser fully supports all File API
   if (window.File && window.FileReader && window.FileList && window.Blob)
	{
		
		fileName = jQuery('#FileInput')[0].files[0].name;
		if( !jQuery('#FileInput').val()) //check empty input filed
		{
			alert("Are you kidding me?");
			return false
		}
		
		var fsize = jQuery('#FileInput')[0].files[0].size; //get file size
		var ftype = jQuery('#FileInput')[0].files[0].type; // get file type
		

		//allow file types 
		switch(ftype)
        {
            case 'image/png': 
			case 'image/gif': 
			case 'image/jpeg': 
			case 'image/pjpeg':
			case 'text/plain':
			case 'text/html':
			case 'application/x-zip-compressed':
			case 'application/pdf':
			case 'application/msword':
			case 'application/vnd.ms-excel':
			case 'video/mp4':
                break;
            default:
                alert("<b>"+ftype+"</b> Данный тип файла не поддерживается!");
				return false
        }
		
		//Allowed file size is less than 5 MB (1048576)
		if(fsize>5242880) 
		{
			alert("<b>"+bytesToSize(fsize) +"</b> Файл превышает допустимые размеры! <br />Файл не должен превышать 5 MB.");
			return false
		}
				
		jQuery('#submit-btn').hide(); //hide submit button
		jQuery('#loading-img').show(); //hide submit button
		jQuery("#output").html("");  
	}
	else
	{
		//Output error to older unsupported browsers that doesn't support HTML5 File API
		alert("Please upgrade your browser, because your current browser lacks some new features we need!");
		return false;
	}
}
function OnProgress(event, position, total, percentComplete)
{
}
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Bytes';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
jQuery(document).ready(function() { 
	scrollTab();
    var smiles 		= jQuery("#smilesChoose");
    var smilesBtn 	= jQuery("#smilesBtn");
    var messages 	= jQuery("div.chat-messages");
	var data;
	var scrollflag	= false; 
	var fileName	= '';
	var options = { 
		beforeSubmit	: beforeSubmit,  // pre-submit callback 
		success			: afterSuccess,  // post-submit callback 
		uploadProgress	: OnProgress, //upload progress callback 
		resetForm		: true        // reset the form after successful submit 
	}; 			
	inProgress 		= false;
	startFrom 		= 10;
	stopajax 		= false;
    jQuery('div.chat-message').emotions();
    smiles.emotions();
	
    jQuery("#smilesChoose span").click(function () {
        var shortCode = jQuery.emotions.shortcode(jQuery(this).attr("title"));
        jQuery("#sendmsg").val(jQuery("#sendmsg").val() + " " + shortCode + " ");
        smiles.toggle();
        jQuery("#sendmsg").focus();
    });
    jQuery("#smilesBtn").click(function () {
        smiles.toggle();
    });
	jQuery('#MyUploadForm').submit(function() { 
		jQuery(this).ajaxSubmit(options);  			
		return false; 
	}); 
	jQuery('#content_msg').slimScroll().bind('slimscroll', function(e, pos){
		if (pos=="top" && !inProgress && !stopajax) {
			jQuery.ajax({
				url: "index.php?option=com_chat&task=getajax&format=raw&type=getmsg",
				method: 'POST',
				data: {"startFrom" : startFrom,"id": jQuery("#title").attr("data-userid"),"deltaId":lastIdScroll},
				beforeSend: function() {
				inProgress = true;}
			}).done(function(data){
				arr = jQuery.parseJSON(data);
				var dataNum = 0;
				for (i in arr) {if (arr.hasOwnProperty(i)) {dataNum++;}}    
				stopajax = (arr[0].startFrom) ? true : false;
				if (dataNum && !arr[0].startFrom && jQuery('textarea').attr("id")=="sendmsg") {
					for (var index=0; index<dataNum; index++){				
						var str  = '';
						var $del = '';
						var cls;
						var r;
						var h;
							
						if (arr[index].hide==1){ h="hidde";} else { h="";}
						if (arr[index].read==1){ r="";} else {r="info";$del='<div class="msg_delete" style="float:right"><img src="/components/com_chat/images/uploadify-cancel.png" /></div>'}
						if (arr[index].id_from==id_user){ cls="active";$del="";} else {cls="";}
						str+="<div class='tr user_msg "+cls+" "+r+" "+h+"' data-userid="+arr[index].id_from+" data-idmsg="+arr[index].id+"><div class='td'>"+jQuery.emotions(arr[index].msg)+"<span>"+arr[index].date+"</span>"+$del+"</div></div>";	
						if (str)
							jQuery("#content_msg").prepend(jQuery(str));
					}
				}
				inProgress = false;
				if (!arr[0].startFrom) {
					startFrom += 10;
					(startFrom==20) ? scrollTab() : jQuery('#content_msg').slimScroll({ scrollTo: '400px'}); // 				
				}
			});
        }
	});
});	

