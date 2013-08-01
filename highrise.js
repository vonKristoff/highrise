/**
* High Rise jQuery plug-in
* Lifting your content up for display
*
* @author Jean-Christophe Nicolas <mrjcnicolas@gmail.com>
* @homepage http://bite-software.co.uk/highrise/
* @version 0.1.0
* @license MIT http://opensource.org/licenses/MIT
* @date 2013-07-31
*/
(function($) {

$.fn.highrise = function(options){
	
	var el = $(this),
		mobile = isMobile.any(),	
	
		process = new Plugin(el,options);

	$(window).resize(function() {
  		process.resize();
	});

	window.onscroll = function(){
		process.onscroll()
	}
			
	return el;	
}

var Plugin = function(me,options){

	var config = {	
		z:2,
		tgt:'li',
		colour:[55,255,55,.5],
		shadow:{
			blur:20,
			col:[0,0,0,.5]
		},
		gradient:{
			colour:[255,55,55,.75],
			angle:45
		},
		parent:false
	}
	$.extend(config,options);

	this.el = me;
	this.config = config;
	this.tgtType = this.config.tgt;
	this.working = false;
	this.over = false;
	
	this.init();

}

Plugin.prototype.init = function(){

	this.createDiv();

	this.list = [];
	this.setupItems();

	this.poscheck();

}

Plugin.prototype.setupItems = function(){

	var	$super = this;

	this.el.children(this.tgtType).each(function(i){
		
		var $this = $(this),
			cords = $this.offset();

		$super.list[i] = {
			i:i,
			el:$this,
			x:cords.left,
			y:cords.top,
			css:{
				mx:$this.css('margin-left'),
				my:$this.css('margin-top'),
				px:$this.css('padding-left'),
				py:$this.css('padding-top'),
			}
		}
		$super.interaction($this,i);
	})

}
Plugin.prototype.createDiv = function(){

	var cfg = this.config;

	var div1 = document.createElement('div');
	div1.id = 'hi-rise';

	var div2 = document.createElement('div');
	div2.id = 'hi-cloud';

	var copy = document.body.appendChild( div1 ),
		cover = document.body.appendChild( div2 );

	this.copy = $('#'+div1.id);
	this.cover = $('#'+div2.id);
	
	if(cfg.shadow){
		var alf = this.rgbaise(cfg.shadow.col);

		this.copy.css({
			'position':'absolute',
			'z-index':cfg.z+1,
			'box-shadow':'0 0 '+cfg.shadow.blur+'px '+alf
		})

	}else{
		this.copy.css({
			'position':'absolute',
			'z-index':cfg.z+1
		})
	}

	this.cover.css({
		'position':'absolute',
		'z-index':-1,
		'transition':'top 0s',
		'transition':'opacity .15s',
		'opacity':0,
		'width':'100%',
		'height':'100%',
		'top':0,
		'left':0
	})
	if(cfg.gradient){

		var c1 = this.rgbaise(cfg.colour),
			c2 = this.rgbaise(cfg.gradient.colour),
			ang = this.rgbaise(cfg.gradient.angle),
			grad = 'linear-gradient(0deg,'+c1+', '+c2+')'

		this.cover.css({
			'background':grad
		})
	}else{
		this.cover.css({
			'background':this.rgbaise(cfg.colour)
		})
	}
	
}
Plugin.prototype.interaction = function(item,i){

	var $this = this,
		ary = this.list[i];

	function fadeout(){
		
		$this.cover.css({
			'opacity':0,
			'transition':'opacity 0s'
		}).promise().done(function(){

			setTimeout(function(){
				$this.cover.css({
					'z-index':-1,
					 // check this
				})
				$this.copy.html('');
				$this.working = false;
			},0)
		});

		
	}

	item.on('mouseenter',function(){

		$this.over = true;

		if(! $this.working){

			$this.copy.css({
				'left':ary.x,
				'top':ary.y
			})
			$this.cover.css({
				'transition':'opacity .4s',
				'z-index':$this.config.z,
				'opacity':1
			}).promise().done(function(){

				item.clone().appendTo($this.copy);

				$this.adjustMargins($this.copy,ary);
			})

			$this.copy.on('mouseleave',function(){
				
				$this.over = false;
				$this.working = true;
				if(this.major){

				}else{
					fadeout();	
				}
				
			})


			$this.cover.on('mousemove',function(){
		
				if($this.over && !$this.working){
					
					$this.over = false;
					$this.working = true;
					fadeout();			
				}
			})
		}

		


	})


}
Plugin.prototype.poscheck = function(){

	$this = this;
	this.major = false;

	this.el.on('mouseenter',function(){
		this.major = true;
	}).on('mouseleave',function(){
		this.major = false;
	})

	

	

}
Plugin.prototype.adjustMargins = function(item,ary){
	
	var tgt = ary.css,
		li = item.children('li');

	li.css({
		'margin':0,
		'padding':0
	})
	
}

Plugin.prototype.rgbise = function(rgb){

	var r = rgb[0],
		g = rgb[1],
		b = rgb[2];

	var str = 'rgb(';

	str += r + ',';
	str += g + ',';
	str += b + ')';

	return str;

}

Plugin.prototype.rgbaise = function(rgb){

	var r = rgb[0],
		g = rgb[1],
		b = rgb[2],
		a = rgb[3];

	var str = 'rgba(';

	str += r + ',';
	str += g + ',';
	str += b + ',';
	str += a + ')';

	return str;

}


Plugin.prototype.onscroll = function(){

	this.cover.css({
		'top':window.pageYOffset
	})
	// console.log(
 //        'scroll', window.pageYOffset,
 //        'visible height',window.innerHeight,
 //        'page height',document.documentElement.scrollHeight,
 //        'total',window.pageYOffset + window.innerHeight,
 //        'focus',(window.pageYOffset + window.innerHeight) - window.innerHeight/2
 //    );
}

Plugin.prototype.resize = function(){
	
	for(var i=0;i<this.list.length;i++){

		var obj = this.list[i],
			cords = obj.el.offset();

		obj.x = cords.left;
		obj.y = cords.top;

	}

}



Plugin.prototype.hsl = function(rgb){

	var r1 = rgb[0] / 255;
	var g1 = rgb[1] / 255;
	var b1 = rgb[2] / 255;
	var maxColor = Math.max(r1,g1,b1);
	var minColor = Math.min(r1,g1,b1);
	//Calculate L:
	var L = (maxColor + minColor) / 2 ;
	var S = 0;
	var H = 0;
	if(maxColor != minColor){
	    //Calculate S:
	    if(L < 0.5){
	        S = (maxColor - minColor) / (maxColor + minColor);
	    }else{
	        S = (maxColor - minColor) / (2.0 - maxColor - minColor);
	    }
	    //Calculate H:
	    if(r1 == maxColor){
	        H = (g1-b1) / (maxColor - minColor);
	    }else if(g1 == maxColor){
	        H = 2.0 + (b1 - r1) / (maxColor - minColor);
	    }else{
	        H = 4.0 + (r1 - g1) / (maxColor - minColor);
	    }
	}

	L = L * 100;
	S = S * 100;
	H = H * 60;
	if(H<0){
	    H += 360;
	}

	var result = [H, S, L];
	return result;
	
}
Plugin.prototype.rgb = function(hsl){
	var h = hsl[0];
	var s = hsl[1];
	var l = hsl[2];
	
	var m1, m2, hue;
	var r, g, b;
	s /=100;
	l /= 100;
	if (s == 0)
		r = g = b = (l * 255);
	else {
		if (l <= 0.5)
			m2 = l * (s + 1);
		else
			m2 = l + s - l * s;
		m1 = l * 2 - m2;
		hue = h / 360;
		r = this.hue2rgb(m1, m2, hue + 1/3);
		g = this.hue2rgb(m1, m2, hue);
		b = this.hue2rgb(m1, m2, hue - 1/3);
	}
	return [Math.round(r), Math.round(g), Math.round(b)];
}
Plugin.prototype.hue2rgb = function(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return 255 * v;
};

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

})(jQuery);