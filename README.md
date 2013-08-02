HIGH-RISE
=========

<a href='http://bite-software.co.uk/highrise'>Plugin Site</a>

BASIC USAGE:
```javascript
$('.element').plugin({
	target_item,
	colour,
	shadow,
	gradient,
	z-index
});
```
<h1>config options:</h1>

| Option             		| data type      | values             | Default  | Nb.                		| 
| --------------------------|----------------|--------------------|----------|--------------------------|
| tgt   			 		| string         | 'li'			      | 'li'     | target element type  	|       
| colour        	 		| RGBA array     | [0,0,0,.5]         | black    | highlight colour			|        
| shadow:{blur,col}  		| int, RGBA array| 0+ , [0,0,0,.5]	  | false    | colour/blur value of focused elements' drop shadow  |        
| gradient:{colour,angle} 	| RGBA array, int| [0,0,0,.5] , 0-360 | false    | enable gradient behaviour for highlight. gradient.colour is colour-stop #2  |        
| z   			 			| int	         | 2			      | 1	     | enables z-index hirarchy to make sure you highrise sits on top|

<h2>HTML case</h2>
```html
<ul class="container">
	<li>
		<div class="yours"></div>	
	</li>
	<li>
		<div class="yours"></div>
	</li>
</ul>
```
<h1>usage example</h1>
```javascript
$('.container').highrise({
	tgt:'li',
	colour:[255,0,0,.7].
	gradient:{colour:[0,255,0,1]}
});
```

<h3>upcoming :: need to add speed var for rollover opacity animation</h3>