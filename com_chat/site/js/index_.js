var updateTimer=false;
		var originName='';
		var id_user;			
		var onlineTimer;
		var user_status = '';
		
		function getURLParameter(url, name) {
			return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
		}
		
		jQuery(document).ready(function(){
		//triggerContent("user");
			/*jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=users", function(data) {
				if (data){
					getUserList(data);
					triggerContent("user");
					
					var url = window.location.href;
					var id = getURLParameter(url, 'id');
					//alert(id);
					jQuery("#content_msg").find(".tr").each(function(){
						if (jQuery(this).data('userid')==id)
							jQuery(this).click();
					});
				}	
			},"json");
			//alert(999999*jQuery("#content_msg").height()+'px');*/
			
		});		
		onlineUser = function(){
			jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=checkonline", function(data) {
				//jQuery("#content_msg .user_hover").removeClass("danger").addClass("success");
				if (data){
					getUserList(data);
					triggerContent("user");
					var url = window.location.href;
					var id = getURLParameter(url, 'id');
					//alert(id);
					jQuery("#content_msg").find(".tr").each(function(){
						if (jQuery(this).data('userid')==id)
							jQuery(this).click();
					});
					jQuery("#content_msg .user_hover").removeClass("danger").addClass("success");
					jQuery.each(data, function(index) {					
					if (data){
						var $index=data[index].id;
						var offile =data[index].online;
						var new_msg = data[index].new_msg;
						var msg = data[index].msg;
						var isHref = jQuery('<div class="isHref">'+data[index].msg+'</div>');
						if (msg){
							jQuery("#content_msg .user_hover").each(function(index){
								if (jQuery(this).data("userid")==$index){
									
									if (msg){								
										if (!offile)
											jQuery(this).removeClass("success").addClass("danger");
										jQuery(this).find(".td").find(".msg").remove();
										jQuery(this).find(".td").append(jQuery("<span class='msg' style='margin-left:20px'>"+(!isHref.find("a").attr("href") ? 
										jQuery.emotions(msg.slice(0, -(msg.length-65)))+"..." : msg)+"</span>&nbsp&nbsp"));	 //target.is( "li" )
										
										//jQuery(this).find(".td").append(jQuery("<span class='msg' style='margin-left:20px'>"+ 
										//jQuery.emotions(msg.slice(0, -(msg.length-65)))+"...</span>&nbsp&nbsp"));
										if (parseInt(new_msg))
										{
											jQuery(this).find(".new_msg").remove();
											jQuery(this).find(".td").append(jQuery('<span class="new_msg" style="float:right">+'+new_msg+'</span>'));		
										}
										else{
											jQuery(this).find(".new_msg").remove();		
										}									
									}
									else{
										jQuery(this).remove();
									}	
								}							
							});
						}	
					}
				});	
				}	
			},"json");
		};
		setTimeout(onlineUser);			
		onlineTimer = setInterval(onlineUser, 5000);	
		jQuery(document).on("click",".list_user",function(e){
			e.preventDefault();
			jQuery("#title").find(".user_name").remove();
			if (updateTimer) clearInterval(updateTimer);
			if (onlineTimer) clearInterval(onlineTimer);
			onlineUser();
			onlineTimer = setInterval(onlineUser, 5000);
			/*jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=users", function(data) {
				if (data){
					getUserList(data);
					triggerContent("user");
				}
			},"json");*/
				
		});	
		jQuery(document).on("keyup input change focus blur", "#sendmsg", function(e){
			e.preventDefault();
			if (jQuery("#content_msg").find('.info').length>0){
				var $lastId = jQuery("#content_msg .user_msg:last").data("idmsg") ? jQuery("#content_msg .user_msg:last").data("idmsg") : 0;
				console.log($lastId);
				//var id_user = jQuery("#content_msg .active:last").data("userid") ? jQuery("#content_msg .active:last").data("userid") : 0;
				jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=readmsg", { id: $lastId},function(data) {
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
				{
					jQuery(this).parent().hide();
					//console.log(jQuery(this).parent("tr").html());
				}
				else{
					jQuery(this).parent().show();
				}
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
			if (!jQuery(this).hasClass("tr")) return false;
			id_user = jQuery(this).data("userid");
			var user_status = (jQuery(this).attr("class")).split(" ");
			jQuery("#title").find(".user_name").remove();
			jQuery("#title").attr("data-userid",id_user);
			var color = (user_status[1])=="danger" ? "color:red" : "color:green"; 
			jQuery(this).find(".new_msg").remove();
			jQuery("#title").append(jQuery('<span class="user_name '+user_status[1]+'" style="padding:5px 10px;line-height:2em;font-size:18px;font-weight:bold;'+color+'">'
			+jQuery(this).find('.td').find('.user').html()+'</span>'));
			triggerContent("messages");		
			
			jQuery("#content_msg").html('<span>Идет загрузка...</span>');
			jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=getmsg", { id: jQuery(this).data("userid")},function( data ) {
				var str = '';
				var $del='';
				var cls;
				var h='';
				var r;
				if (data) {
					jQuery.each(data, function(index) {
						if (data[index].hide==1){ h="hidde";} else { h=""}
						if (data[index].read==1){ r="";} else {r="info";$del='<div class="msg_delete" style="float:right"><img src="/components/com_chat/images/uploadify-cancel.png" /></div>'}
						if (data[index].id_from==id_user){ cls="active";$del="";} else {cls="";}
						str+="<div class='tr user_msg "+cls+" "+r+" "+h+"' data-userid="+data[index].id_from+" data-idmsg="+data[index].id+"><div class='td'>"+jQuery.emotions(data[index].msg)+"<span>"+data[index].date+"</span>"+$del+"</div></div>";	
					});					
				}	
				jQuery("#content_msg").html(str);
				scrollTab();

			},"json");
			this.updateContent = function(){
				var str = '';
				var $lastId = jQuery("#content_msg .active:last").data("idmsg") ? jQuery("#content_msg .active:last").data("idmsg") : 0;
				jQuery.post( "index.php?option=com_chat&task=getajax&format=raw&type=update", { id_to: id_user, id_last: $lastId},function(data) {							
					var $i=1;
					var r;
					var h;
					//var $del='';
					var lst;
					if (data){
						jQuery.each(data, function(index) {
							lst = (data.length==$i) ? 'info' : ''; 
							h = (data[index].hide==1 ? "hidde" : "");
							r = (data[index].read==1 ? "" : "info");
							
							if (lst && data[index].id){
								jQuery("#content_msg").find(".tr:not(.active)").removeClass('info').end().find('.msg_delete').remove(); 
							}
							if (data[index].id){ 
								str+="<div class='tr user_msg active "+r+" "+h+"' data-userid="+data[index].id_from+" data-idmsg="+data[index].id+"><div class='td'>"+
								((data[index].msg) ? jQuery.emotions(data[index].msg) : '')+'<span>'+data[index].date+"</span></div></div>";
								jQuery("#title span").css('color','green');
							}
							jQuery("#title").find(".status_online").remove();
							if (data[index].status=='offline'){
								jQuery("#title").append(jQuery("<span class='status_online'>Ушел из сети</span>"));
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
							scrollTab();
						}
					}					
				},"json");
			};	
			updateTimer = setInterval(this.updateContent, 3000);
			if (onlineTimer) clearInterval(onlineTimer);	
		});	
		function getUserList(data){
			var str = '';
			var status = '';
			jQuery("#content_msg").html('<span>Идет загрузка...</span>');
			jQuery.each(data, function(index) {
				if (data[index].msg){
				data[index].status=="online" ? status='success' : status='danger'; 
				str+="<div class='tr user_hover "+status+"' data-userid="+data[index].id+"><div class='td'><span class='user'>"+data[index].name+"</span></div></div>";}	
			});	
			jQuery("#content_msg").html(str);
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
			//var $del;
			var $del='<div class="msg_delete" style="float:right"><img src="/components/com_chat/images/uploadify-cancel.png" /></div>';
			var $lastId = jQuery("#content_msg .active:last").data("idmsg") ? jQuery("#content_msg .active:last").data("idmsg") : 0;
			var lastIdMsg = jQuery("#content_msg .user_msg:last").data("idmsg") ? jQuery("#content_msg .user_msg:last").data("idmsg") : 0;
			str_del="<div id='delete_msg' class='tr user_msg info' data-userid="+id_user+" data-idmsg="+lastIdMsg+"><div class='td'>"+jQuery.emotions(message)+"<br><span>"+dateNow()+"</span>"+"</div></div>";
			//alert(str_del);
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
				jQuery('#smilesBtn').hide();
				jQuery('#smilesChoose').hide();
				jQuery("#MyUploadForm").hide();
				jQuery("#title").find(".status_online").remove();
			}
			else{
				jQuery('#search').attr("id","sendmsg");
				jQuery('#smilesBtn').show();		
				jQuery("#MyUploadForm").show();
				jQuery("#title").find(".status_online").remove();
			}
		}
		function scrollTab(){
			var height=999999*jQuery("#content_msg").height(); //999999*jQuery("#content_msg").height(); 
			jQuery('#content_msg').slimScroll({ height: '480px',color: '#337ab7',scrollTo: height+'px'}); // 
			//alert(height);
			//999999*jQuery("#content_msg").height()+'px'			
			//jQuery("#content_msg").animate({"scrollTop":height},0); 
		}	


jQuery(document).ready(function () {
	var height=999999*jQuery("#content_msg").height();//999999*jQuery("#content_msg").height(); 
	jQuery('#content_msg').slimScroll({ height: '480px',color: '#337ab7',scrollTo: height+'px'}); // 
    var smiles = jQuery("#smilesChoose");
    var smilesBtn = jQuery("#smilesBtn");
    var messages = jQuery("div.chat-messages");

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
	 /* jQuery('#content_msg').jScrollPane({ 

showArrows: true, // показывать стрелки 
arrowScrollOnHover: true, // скроллинг при наведении на стрлки 
enableKeyboardNavigation: false, // запрет управления с клавиатуры 
hideFocus: true // скрывает outline при фокусе 
}); */

});
jQuery(document).ready(function() { 
	var fileName='';
	var options = { 
			//target:   '#output',   // target element(s) to be updated with server response 
			beforeSubmit:  beforeSubmit,  // pre-submit callback 
			success:       afterSuccess,  // post-submit callback 
			uploadProgress: OnProgress, //upload progress callback 
			resetForm: true        // reset the form after successful submit 
		}; 
		
	 jQuery('#MyUploadForm').submit(function() { 
			jQuery(this).ajaxSubmit(options);  			
			// always return false to prevent standard browser submit and page navigation 
			return false; 
		}); 
		
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

//progress bar function
function OnProgress(event, position, total, percentComplete)
{
    /*var str='';
	str+="<tr id='delete_progress'><td><br><div class='progressbox' ><div class='progressbar' ></div></div></td></tr>";
	jQuery("#content_msg").append(jQuery(str));
	scrollTab();
	//sendMsg('<br><div class="progressbox" ><div class="progressbar" ></div></div>');
	jQuery('.progressbox:last').show();
    jQuery('.progressbar:last').width(percentComplete + '%') //update progressbar percent complete
    jQuery('#statustxt').html(percentComplete + '%'); //update status text
    if(percentComplete>50)
    {
        jQuery('#statustxt').css('color','#000'); //change status text to white after 50%
    }*/

}

//function to format bites bit.ly/19yoIPO
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Bytes';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

/* Переменная-флаг для отслеживания того, происходит ли в данный момент ajax-запрос. В самом начале даем ей значение false, т.е. запрос не в процессе выполнения */
var inProgress = false;
/* С какой статьи надо делать выборку из базы при ajax-запросе */
var startFrom = 10;
var data;
    /* Используйте вариант $('#more').click(function() для того, чтобы дать пользователю возможность управлять процессом, кликая по кнопке "Дальше" под блоком статей (см. файл index.php) */
    jQuery('#content_msg').scroll(function() {
		//alert(jQuery('#content_msg').scrollTop()+':'+jQuery('#content_msg').height());	
        /* Если высота окна + высота прокрутки больше или равны высоте всего документа и ajax-запрос в настоящий момент не выполняется, то запускаем ajax-запрос */
        if (jQuery('#content_msg').scrollTop()==0 && !inProgress){//($('#content_msg').scrollTop() + $('#content_msg').height() >= $(document).height() - 200 && !inProgress)  {
		
		//alert('!!!');	
		//console.log('???????????????');
        jQuery.ajax({
            /* адрес файла-обработчика запроса */
            url: 'index.php?option=com_ajax&module=chat&format=raw&type=getmsg',
            /* метод отправки данных */
            method: 'POST',
			//type:"json",
            /* данные, которые мы передаем в файл-обработчик */
            data: {"startFrom" : startFrom,"id": jQuery("#title").attr("data-userid")},
            /* что нужно сделать до отправки запрса */
            beforeSend: function() {
            /* меняем значение флага на true, т.е. запрос сейчас в процессе выполнения */
            inProgress = true;}
            /* что нужно сделать по факту выполнения запроса */
            }).done(function(data){

            /* Преобразуем результат, пришедший от обработчика - преобразуем json-строку обратно в массив */
            arr = jQuery.parseJSON(data);
			var dataNum = 0;
			//var h=0;
			for (i in arr) {if (arr.hasOwnProperty(i)) {dataNum++;}}    
			
			//alert(dataNum);
            /* Если массив не пуст (т.е. статьи там есть) */
            if (dataNum) {
				for (var index=0; index<dataNum; index++){
					var str = '';
					var cls;
					var r;
					if (arr[index].id_from==id_user){ var cls="active";} else {var cls=""}
					if (arr[index].read==1){ r="";} else {r="info"}
					str+="<tr class='user_msg "+cls+" "+r+"' data-userid="+arr[index].id_from+" data-idmsg="+arr[index].id+"><td>"+jQuery.emotions(arr[index].msg)+"<span>"+arr[index].date+"</span></td></tr>";
					if (str)
						jQuery("#content_msg").prepend(jQuery(str));
					//h=h+5;
				}
				//alert(h);
				jQuery('#content_msg').animate({
					scrollTop: 100
				}, 400);
				//
				//alert(arr[1].id_from);
            /* Делаем проход по каждому результату, оказвашемуся в массиве,
            где в index попадает индекс текущего элемента массива, а в data - сама статья */
            //jQuery.each(arr, function(index, arr){
				
            //});
			}
            /* По факту окончания запроса снова меняем значение флага на false */
            inProgress = false;
            // Увеличиваем на 10 порядковый номер статьи, с которой надо начинать выборку из базы
            if (!data.startFrom) startFrom += 10; else startFrom=data.startFrom;//}
            //}
			});
        }
    });


});	

