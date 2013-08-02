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
		parent:false // rollout helper (not implemented)
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

	// this.poscheck(); unneccessary as yet

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
Plugin.prototype.poscheck = function(){ // needs redeveloping

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

}

Plugin.prototype.resize = function(){
	
	for(var i=0;i<this.list.length;i++){

		var obj = this.list[i],
			cords = obj.el.offset();

		obj.x = cords.left;
		obj.y = cords.top;

	}

}



})(jQuery);