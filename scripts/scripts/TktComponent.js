/*!
 * Register.js v1.0.0
 * (c) 2022-2023 Marlon Cruz Ovalles kurosaky970828@gmail.com
 * Mmenu Company 
 * menu24horas.com
 * Released under the MIT License.
 */
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

var X6N = new URL(window.location.href).hostname
var X6NGE = X6N == 'localhost'?'localhost:8080/': X6N == "184.168.23.29" ? 'http://184.168.23.29/': 'https://airdrop.x6nge.io/'
var API = X6N == 'localhost'?'localhost:5000/api/': X6N == "184.168.23.29"? 'https://airdrop.x6nge.io/api/': 'https://airdrop.x6nge.io/api/'

var TKT = AolaxReactive({
    el: "#multi_step_sign_up",
    data: {
        linetype: "-",
        separador: '---',
        totMax: 348,
    },
    methods: {
        init: function(){
			if(X6N != 'localhost')$("body").css('overflow', 'hidden')
			this.contactusbtn();
			this.validatePaso();
			//this.congratulation();

            $(document).ready(function() {
				// $('.theme-loader').addClass('loaded');
				$('.theme-loader').animate({
					'opacity': '0',
				}, 1200);
				setTimeout(function() {
					$('.theme-loader').remove();
				}, 2000);
				// $('.pcoded').addClass('loaded');
			});
			$('form').on('submit', function(e) {});

			$('#btn_send').on('click', function(){
				TKT.auth_metamask(this);
			});
			$(".next").on('click',function(){
				if($(this).attr('btn') == 'auth_twitter') TKT.auth_twitter(this);
				if($(this).attr('btn') == 'auth_telegram') TKT.auth_telegram(this);
				if($(this).attr('btn') == 'auth_telegram_code') TKT.verifiCode(this);
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
			$("#modalbutton").on('click', ()=>{
				window.location.href = "https://x6nge.io"
			})
        },
		auth_twitter: function(e){
			//this.auth_metamask(e);
			/*
				ru = $('#rules');
				if (ru.is(":checked")) {
					$("#tiprules").hide();
					
				} else {
					tip = $("#tiprules");
					w = (tip.parent().width() / 2 - tip.width() / 2) + "px";
					tip.css("left", w).show();
					isok = false;
				}
			*/
			//return this.startNext(e);
			window.location.href = "https://airdrop.x6nge.io";
			return;
		},
		auth_telegram: function(e){
			$(document).data('element', e)
			that = this;
			var btntelg = $('button[btn="auth_telegram"]')
			if(btntelg.hasClass('disabledtkt')) return;

			var user = $('#telegramUsername').val();
			var url = new URL(API+"telegram")
			
			json = {
				token: "tktk9wv7I8UU26FGGhtsSyMgZv8caqygNgPVMrdDw02IZlnRhbK3s",
				username: user,
				group: "thekeyoftrueTKT",
				type: "broadcast"
			}
			this.loaderShow();
			$.ajax({
                url : url,
                data : JSON.stringify(json),
				contentType: "application/json",
				method: "POST",
				success : function(r){
					
					console.log(r.response)
					if(r.response == 'user_ok'){
						var btncode = $('button[btn="auth_telegram_code"]')
						btncode.removeClass('disabledtkt')
						var code = $('#telegramCode')
						code.removeAttr('disabled')
						code.removeClass('disabledtkt')

						that.setCookie("telegramhash", JSON.stringify(r.hash));
						that.setCookie("telegramid", JSON.stringify(r.id));
						that.loaderHideOk();
					}
					else if(r.response == 'user_exist'){
						that.loaderHide();
						window.setTimeout(function(){
							swal("Error", "The user '"+user.toUpperCase()+"' already received the tokens, please use another account", "error");
						}, 400)
					}
					else if(r.response == 'user_not_registry'){
						that.loaderHide();
						window.setTimeout(function(){
							swal("Error", "The user '"+user.toUpperCase()+"' is not a 'The Key of True - TKT Oficial' channel subscriber, visit https://t.me/thekeyoftrueTKT, if yow are new press start, otherwise type /airdrop to register.", "error");
							var sweet = $('.sweet-alert .sa-confirm-button-container .confirm')
							sweet.attr('redirect', 'https://t.me/thekeyoftrueTKT')
							sweet.on('click', ()=>{
								var url = sweet.attr("redirect");
								sweet.attr("redirect", 'false');
								if(url != 'false')
									window.open(url)
							})
						}, 400)
						
					}
					else if(r.response == 'user_timeout'){
						var btntelg = $('button[btn="auth_telegram"]')
						btntelg.addClass('disabledtkt')
						window.setTimeout(()=>{
							btntelg.removeClass("disabledtkt")
						}, r.segundos)
						that.loaderHide();
						window.setTimeout(function(){
							$('#telegramCode').val("");
							swal("Error", `Para solicitar el codigo de nuevo es necesario esperar ${r.segundos}.`, "error");
						}, 400)
					}
					
                },
                error: function(error){
					that.loaderHide();
					swal("Error", "An unexpected error has occurred, please try again.", "error");
                }
        	});
		},
		verifiCode: function(e){
			var btn = $('button[btn="auth_telegram_code"]')
			if(btn.hasClass('disabledtkt')) return;

			that = this;
			var user = $('#telegramUsername').val();
			var code = $('#telegramCode').val();
			var url = new URL(API+"telegram/code")
			var hash = this.getCookie("telegramhash");
			var id = this.getCookie("telegramid");
			json = {
				token: "tktk9wv7I8UU26FGGhtsSyMgZv8caqygNgPVMrdDw02IZlnRhbK3s",
				hash: hash,
				id: id,
				code: code,
			}
			this.loaderShow();
			$.ajax({
                url : url,
                data : JSON.stringify(json),
				contentType: "application/json",
				method: "POST",
				success : function(r){
					
					console.log(r.response)
					if(r.response == 'code_ok'){
						//that.setCookie("telegramhash", JSON.stringify(r.data.hash));
						that.loaderHideOk();
						window.setTimeout(function(){
							that.startNext($('#telegramCode').parent());
						}, 1000)
						
					}
					else if(r.response == 'code_error'){
						that.loaderHide();
						window.setTimeout(function(){
							$('#telegramCode').val("");
							swal("Error", "The code is not correct, please try again", "error");
						}, 400)
					}
					else if(r.response == 'code_error_time'){
						that.loaderHide();
						window.setTimeout(function(){
							$('#telegramCode').val("");
							swal("Error", "It's been more than 10 minutes since I requested the code, check your username again.", "error");
						}, 400)
					}
                },
                error: function(error){
					that.loaderHide();
					swal("Error", "An unexpected error has occurred, please try agains.", "error");
                }
        	});
		},
		auth_metamask: function(e){
			that = this;
			var wallet = $('#wallet').val();
			twitterhash = this.getCookie('twitterhash')
			telegramhash = this.getCookie('telegramhash')
			var url = new URL(API+"wallet");
			ref = this.getCookie("ref")
			json = {
				token: "tktk9wv7I8UU26FGGhtsSyMgZv8caqygNgPVMrdDw02IZlnRhbK3s",
				wallet: wallet,
				twitter: twitterhash,
				telegram: telegramhash,
				referido: ref?ref:"none"
			}
			
			this.loaderShow();
			$.ajax({
                url : url,
                data : JSON.stringify(json),
				contentType: "application/json",
				method: "POST",
				success : function(r){
						console.log(r.response)
						
						if(r.response == 'user_twitter_exist'){
							that.loaderHide();
							swal("Error", "Your twitter user has already received the tokens.", "error");
						}
						else if(r.response == 'user_telegram_exist'){
							that.loaderHide();
							swal("Error", "Your Telegram user has already received the tokens", "error");
						}
						else if(r.response == 'user_twitter_notexist'){
							that.loaderHide();
							swal("Error", "The twitter user does not exist or was recently deleted", "error");
						}
						else if(r.response == 'user_telegram_notexist'){
							that.loaderHide();
							swal("Error", "Telegram user does not exist or was recently deleted", "error");
						}
						else if(r.response == 'user_wallet_paid'){
							that.loaderHide();
							swal("Error", "The wallet '"+wallet.toUpperCase()+"' already received the tokens, please use another wallet", "error");
						}
						else if(r.response == 'user_wallet_notpaid'){
							that.loaderHide();
							swal("Error", "The wallet '"+user.toUpperCase()+"' has already completed the process, payments will be made between 10:00 pm and 12:00 am", "error");
						}
						else if(r.response == 'user_wallet_ok'){
							that.loaderHideOk();
							that.showModal(r.data, r.reflink)
							window.setTimeout(()=>{
								that.congratulation()
							}, 1200);
						}
                },
                error: function(error){
					that.loaderHide();
					swal("Error", "An unexpected error has occurred, please try agains.", "error");
                }
        	});
		},
		showModal: function(data, link){
			$('#finish_overlay').show()
			let that = this
			window.setTimeout(()=>{
				let modal = $('#showmodal'),
				spamlink = $('#modallink')
	
				spamlink.text(X6NGE+`?ref=${link}`)
				modal.show();
			}, 500)
			
		},
		startNext: function(elemt){
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
		},
		setCookie: function(name, value, days=365){
			var d = new Date();
			d.setTime(d.getTime() + 24*60*60*1000*days);
			document.cookie = name + "=" + value + ";path=/; secure = true; expires=" + d.toGMTString() +"; max-age=" + d.toGMTString();
		},
		getCookie: function(name){
			var v = document.cookie.match('(^|;)\\s*' + name + '=([^;]*)(;|$)');
			return v ? v[2] : false;
		},
		loaderShow: function(){
			$('#loader_verificacion_overlay').show()
			$('#loader_verificacion .sa-success').hide()
			$('#sa_success_text').hide()
			$('#loader_verificacion #pre_loader2').show()
			$('#loader_verificacion #pre_loader_3').show()
			$('#loader_verificacion #pre_loader_text').show()
			$('#loader_verificacion').show()
		},
		loaderHide: function(){
			console.log("loaderHide")
			$('#loader_verificacion_overlay').show()
			$('#loader_verificacion .sa-success').show()
			$('#loader_verificacion #pre_loader2').hide()
			$('#loader_verificacion #pre_loader_3').hide()
			$('#loader_verificacion #pre_loader_text').hide()
			$('#loader_verificacion').hide()
			$('#loader_verificacion_overlay').hide()
			console.log("loaderHide2")
		},
		loaderHideOk: function(){
			$('#loader_verificacion .sa-success').show()
			$('#sa_success_text').show()
			$('#loader_verificacion #pre_loader2').hide()
			$('#loader_verificacion #pre_loader_3').hide()
			$('#loader_verificacion #pre_loader_text').hide()
			window.setTimeout(()=>{
				$('#loader_verificacion').hide()
				$('#loader_verificacion_overlay').hide()
			}, 1000)
		},
		validatePaso: function(){
			const urlParams = new URLSearchParams(window.location.search);
			const twitteralert = urlParams.get("twitteralert");
			const twitterfollow = urlParams.get("twitter");
			const twitterhash = urlParams.get("hash");
			const username = urlParams.get("username");
			const error = urlParams.get("error");
			const ref = urlParams.get("ref");

			if(error){
				if(error == "connexion_timeout"){
					swal("Error", "Could not connect to the server, please try again.", "error");
				}
				else if(error == "user_twitter_exist"){
					var u = username?username+" ":''
					swal("Error", "The user "+u.toUpperCase()+" has already received the tokens", "error");
				}
			}
			if(twitterhash){
				this.setCookie('twitterhash', twitterhash);
			}
			if(ref){
				this.setCookie('referido', ref);
			}
			/*var twitteralert = this.getCookie('twitteralert')
			var tttt = this.getCookie('twitterfollow')
			alert(tttt)
			alert(`la alerta fue ${twitteralert}`)
			*/
			if(twitteralert){
				this.setCookie('twitteralert', false);
				this.setCookie('twitterfollow', twitterfollow);
				//var twitterfollow = this.getCookie('twitterfollow')
				
				if(twitterfollow){
					var redirect = true
					//username = this.getCookie('twitterusername')
					if(twitterfollow == "invalid"){
						swal("Error", "The user '"+username.toUpperCase()+"' is not yet following our Twitter account, please follow the required steps to continue with the process.", "error");
						var sweet = $('.sweet-alert .sa-confirm-button-container .confirm')
						sweet.attr('redirect', 'https://twitter.com/x6nge')
						sweet.on('click', ()=>{
							var url = $(this).attr("redirect");
							$(this).attr("redirect", 'false');
							if(url != 'false')
								window.open(url)
						})
					}else if(twitterfollow == 'valid'){
						swal("Success", "Your user has been successfully verified.", "success");
						redirect = false
						this.startNext($('button[btn="auth_twitter"]'))
					}else if(twitterfollow == 'notexist'){
						swal("Error", "The  Username '"+username.toUpperCase()+"' does not exist.", "error");
					}else{
						swal("Error", "An unexpected error has occurred, please try again.", "error");
					}
					if(redirect){
						$('.sa-confirm-button-container button.confirm').on('click', ()=>{
							window.location.href = 'https://airdrop.x6nge.io/'
						})
					}
				}
			}
		},
		congratulation: function(){
			var myCanvas = document.createElement('canvas');
			myCanvas.width = 1300
			myCanvas.height = 1300

			let container = document.getElementById('multi_step_sign_up')
			container.appendChild(myCanvas)

			var myConfetti = confetti.create(myCanvas, {
			resize: true,
			useWorker: true
			});
			myConfetti({
				particleCount: 400,
				spread: 150,
				startVelocity: 50,
			}).then(()=> container.removeChild(myCanvas) )
			
			
			//https://codepen.io/Danivalldo/embed/BawRZvP?default-tab=result&theme-id=dark
		},
		contactusbtn: function(){
			var e="contactus",
			t=document.querySelector("#contactus"),
			a=t.getAttribute("position"),
			s=t.getAttribute("title"),
			l={
				facebook:{
					url:"https://m.me/",
					label:"Write a message"
				},
				whatsapp:{
					url:"https://wa.me/",
					label:"Write a message"
				},
				viber:{
					url:"viber://chat?number=",
					label:"Write a message"
				},
				telegram:{
					url:"https://t.me/",
					label:"Write a message"
				},
				call:{
					url:"tel:",
					label:"Call us"
				}
			};
			
			var c=document.createElement("div");
			c.classList.add(e+"_btn"),
			t.appendChild(c);
			var d=document.createElement("div");
			d.classList.add(e+"_btn_icon"),
			c.appendChild(d);
			var i=document.createElement("div");
			i.classList.add(e+"_btn_alert"),
			i.textContent="1",
			c.appendChild(i);
			var r=document.createElement("div");

			r.classList.add(e+"_box")
			
			function o(a){
				var n=a.classList.contains("opened");
				a.classList.toggle("opened"),
				c.classList.toggle("opened");
				var d=document.createElement("div");
				d.classList.add(e+"_box_header"),
				r.appendChild(d),
				null!=s&&""!==s||(s="Need help? Contact us!!");
				var i=document.createElement("span");
				i.classList.add(e+"_box_header_title"),
				i.textContent=s,d.appendChild(i);
				var m=document.createElement("a");
				for(var u in m.classList.add(e+"_box_header_logo"),
				m.setAttribute("href","https://x6nge.io/"),
				m.setAttribute("target","_blank"),
				d.appendChild(m),l)
				if(l.hasOwnProperty(u)){
					var p=t.getAttribute(u),
					b=t.getAttribute(u+"-label"),
					h=u,_=l[u],
					v=_.url,
					C=_.label;
					if(null!==p&&""!==p){
						var f=document.createElement("a");
						f.className=e+"_box_item",
						f.href=v+p,
						f.setAttribute("target","_blank"),
						r.appendChild(f);
						var L=document.createElement("span");
						L.classList.add(e+"_box_item_btn"),
						L.classList.add(e+"_"+h),
						f.appendChild(L);
						var g=document.createElement("div");
						g.classList.add(e+"_item_btn_icon"),
						L.appendChild(g);
						var E=document.createElement("span");
						E.classList.add(e+"_item_label"),
						E.textContent=h,
						f.appendChild(E),
						null!=b&&""!==b||(b=C);
						var x=document.createElement("span");
						x.classList.add(e+"_item_sub_label"),
						x.textContent=b,
						E.appendChild(x)
					}
				}
				n&&(c.removeEventListener("click",(
							function(){return o(r)}
						)
					),
					function(){
						for(var e=document.querySelector(".contactus_box");e.firstChild;)
							e.removeChild(e.firstChild)
					}()
				)
			}
			
			$('.contactus_btn').on("click", function(){
				o(r)
			})

			t.appendChild(r)
			"left"==a&&(
				c.classList.add(e+"_btn_left"),
				r.classList.add(e+"_box_left")
			)
		},

    },
    styles: `
		#msform {
			margin: 10px auto !important;
		}
		#progressbar {
			margin-bottom: 20px !important;
		}
		#progressbar i::before {
			font-size: 15px;
			color: rgb(137, 188, 255) !important;
		}
		#progressbar li{
			color: rgb(137, 188, 255) !important;
		}
		#msform #progressbar li.active::before, #progressbar li.active::after {
			background: rgb(137, 188, 255) !important;
		}
		body {
			overflow: hidden !important;
		}
		ul {
			counter-reset: step;
		}
		#process li {
			display: flex;
		}
		#process li + li {
			margin-top: 5px;
		}
		.counters {
			background: rgba(1, 181, 255, 0.19);
			border-radius: 50%;
			width: 13px;
			height: 14px;
			margin: auto 3px auto 0;
			color: white;
			font-size: 11px;
			text-align: center;
			align-content: center;
			display: flex;
			align-items: center;
		}
    `,
});
var ShareWeb = AolaxReactive({
    el: '#Compartir',
    data: {
        title: 'Compartir',
        text: "Learn web development on MDN!",
    },
    methods: {
        init: function(){
            $('.SharedComp').on('click', function(){
                try{
                    $('#Shared1').removeClass('perspectiveUpReturn');
                    $('#Shared2').removeClass('perspectiveDownReturn');
                    $('#Shared1').addClass('perspectiveUp');
                    $('#Shared2').addClass('perspectiveDown');
                    setTimeout(function(){
                        $('#Shared1').removeClass('perspectiveUp');
                        $('#Shared2').removeClass('perspectiveDown');
                        $('#Shared2').addClass('perspectiveDownReturn');
                        $('#Shared1').addClass('perspectiveUpReturn');
                    }, 7000);
                }catch(e){
                    console.log(' el error ')
                    console.error(e)
                }
                
            })
        },
        SharedWhat: function(){
			var reflink = $('#modallink').text()
            text = "☰ Is a project that is created to help companies to enter the current world of cryptocurrencies, with all the benefits that decentralization brings. Enter the ongoing airdrop to get free tokens => "+reflink.trim()
            setTimeout(function () {document.location.href= 'https://api.whatsapp.com/send?text='+text;}, 1500);
        },
		CopyClipBoar: function(){
			var e = $('#modallink'),
			imp = $("<input id='copyclicp' type='text' style='opacity: 0;'>")
			

			$('#multi_step_sign_up').append(imp);
			var s = document.getElementById('copyclicp');
			//$(e).text().select();
			lk = $(e).text();
			imp.val(lk);
			s.select();
			document.execCommand('copy');
			$(e).text('Copiado');
			window.setTimeout(function(){
				$(e).text(lk);
			}, 5000);
			$(s).remove();
			//$('.shoplinkbot').hide();
		},
		SharedFacebook: function(){
			window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fairdrop.x6nge.io%2F&amp;src=sdkpreparse', "popup")
		}

    },
})

/*
function() {
	user = $('#username');
	em = $('#email');
	pw = $('#passw');
	cpw = $('#passw2');
	ru = $('#rules');
	isok = true;
	elemt = this;
	//validando Usuarios password y email
	var url = encodeURI('login.php?page=register&mode=ValidRegister&user=' + user.val() + '&email=' + em.val() + '&pass=' + pw.val() + "&pass2=" + cpw.val());
  
	$.post(url, $(this).serialize(), function(data) {
  
	  if (data.code == 200) {
  
		if (data.data.username != undefined) {
		  tip = $("#tipusername");
  
		  $("#tipusername .tooltip-inner b").text("" + data.data.username);
		  w = (tip.parent().width() / 2 - tip.width() / 2) + "px";
		  tip.css("left", w).show();
		  user.css('background', "#fd972b30");
		  isok = false;
		} else {
		  user.css('background', "#fff");
		}
		if (ru.is(":checked")) {
		  $("#tiprules").hide();
		} else {
		  tip = $("#tiprules");
		  w = (tip.parent().width() / 2 - tip.width() / 2) + "px";
		  tip.css("left", w).show();
		  isok = false;
		}
	  } else {
		isok = false;
	  }
	  if (!isok) return;
	  startNext(elemt);
	}, 'json');
}
*/
/*
$(function() {
	$('form').on('submit', function(e) {});

	$('#btn_send').on('click', function(){
		fn 	 = $('#fname');
		ln   = $('#lname');
		ph   = $('#phone');
		ad  = $('#address');
		isok = true;
		
		if(fn.val().length < 3){
			tip = $("#tipfname");
			
			$("#tipfname .tooltip-inner b").text("Ingrese un Nombre Valido");
			w = (tip.parent().width() / 2 - tip.width() / 2)+"px";
			tip.css("left", w).show();
			fn.css('background', "#fd972b30");
			isok = false;
		}
		else{
			fn.css('background', "#fff");
		}
		if(ln.val().length < 3){
			tip = $("#tiplname");
			
			$("#tiplname .tooltip-inner b").text("Ingrese su Primer Apellido");
			w = (tip.parent().width() / 2 - tip.width() / 2)+"px";
			tip.css("left", w).show();
			ln.css('background', "#fd972b30");
			isok = false;
		}
		else{
			ln.css('background', "#fff");
		}
		if(ph.val().length < 6){
			tip = $("#tipphone");
			
			$("#tipphone .tooltip-inner b").text("Ingrese un Número Valido");
			w = (tip.parent().width() / 2 - tip.width() / 2)+"px";
			tip.css("left", w).show();
			ph.css('background', "#fd972b30");
			isok = false;
		}
		else{
			ph.css('background', "#fff");
		}
		if(ad.val().length < 6){
			tip = $("#tipaddres");
			
			$("#tipaddres .tooltip-inner b").text("Debe Tener 6 o más Caracteres");
			w = (tip.parent().width() / 2 - tip.width() / 2)+"px";
			tip.css("left", w).show();
			ad.css('background', "#fd972b30");
			isok = false;
		}
		else{
			ad.css('background', "#fff");
		}
		
		if(!isok) return;

		$('form').submit();
	});
	
});
*/