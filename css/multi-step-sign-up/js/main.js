
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
$(".form-control").on("click", function(){
	$(".form-control").css('background', "#fff");
	$(".tooltip").hide()
});
$("#rules").on("change", function(){
	$(".form-control").css('background', "#fff");
	$(".tooltip").hide()
});
$(".next").on('click',function(){
	user = $('#username');
	em   = $('#email');
	pw   = $('#passw');
	cpw  = $('#passw2');
	ru 	 = $('#rules');
	isok = true;
	elemt = this;
	//validando Usuarios password y email
	var url = encodeURI('login.php?page=register&mode=ValidRegister&user='+user.val()+'&email='+em.val()+'&pass='+pw.val()+"&pass2="+cpw.val());
	
	$.post(url, $(this).serialize(), function (data) {
	
		if(data.code == 200){
			
			if(data.data.username != undefined){
				tip = $("#tipusername");
				
				$("#tipusername .tooltip-inner b").text(""+data.data.username);
				w = (tip.parent().width() / 2 - tip.width() / 2)+"px";
				tip.css("left", w).show();
				user.css('background', "#fd972b30");
				isok = false;
			}
			else{
				user.css('background', "#fff");
			}
			if(data.data.email != undefined){
				tip = $("#tipemail");
				
				$("#tipemail .tooltip-inner b").text(""+data.data.email);
				w = (tip.parent().width() / 2 - tip.width() / 2)+"px";
				tip.css("left", w).show();
				em.css('background', "#fd972b30");
				isok = false;
			}
			else{
				em.css('background', "#fff");
			}
			if(data.data.password != undefined){
				tip = $("#tippassword");
				
				$("#tippassword .tooltip-inner b").text(""+data.data.password);
				w = (tip.parent().width() / 2 - tip.width() / 2)+"px";
				tip.css("left", w).show();
				pw.css('background', "#fd972b30");
				isok = false;
			}
			else{
				pw.css('background', "#fff");
			}
			if(data.data.password2 != undefined){
				tip = $("#tippassword2");
				
				$("#tippassword2 .tooltip-inner b").text(""+data.data.password2);
				w = (tip.parent().width() / 2 - tip.width() / 2)+"px";
				tip.css("left", w).show();
				cpw.css('background', "#fd972b30");
				isok = false;
			}
			else{
				cpw.css('background', "#fff");
			}

			if(ru.is(":checked")){
				$("#tiprules").hide();
			}else{
				tip = $("#tiprules");
				w = (tip.parent().width() / 2 - tip.width() / 2)+"px";
				tip.css("left", w).show();
				isok= false;
			}
			
		}else{
			isok = false;
		}
		if(!isok) return;
		startNext(elemt);
	}, 'json');
	
	//return false;
	
	
});

$(".previous").on('click',function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".submit").on('click',function(){
	return false;
});
function startNext(elemt){
	if(animating) return false;
	animating = true;
	current_fs = $(elemt).parent();
	next_fs = $(elemt).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
				'transform': 'scale('+scale+')',
				'position': 'absolute'
			});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
}