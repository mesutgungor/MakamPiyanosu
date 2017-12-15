function AudioSynthView() {



	

//alert("a.draw");
	var isMobile = !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
	if(isMobile) { 
	var evtListener = ['touchstart', 'touchend','touchstart', 'touchend'	]; 
	var black_key_width='28px';
	var white_key_width='60px'; 
	var start_octave=0;
	document.getElementById("makamm").style.display = 'block';
	document.getElementById("textmakam").style.display = 'none';	
	} 
	else 
	{ 
	var black_key_width='24px';
	var white_key_width='50px';  
	var start_octave=-1;
	var evtListener = ['mouseenter', 'mouseout','mousedown','mouseup']; 
	document.getElementById("makamm").style.display = 'none';
		document.getElementById("textmakam").style.display = 'block';		
	}

	var __audioSynth = new AudioSynth();
	__audioSynth.setVolume(0.5);
	var __octave = 4;
	
	document.getElementById("makamm").onclick = function() {fnPlayMakam()};


	// Change octave
	var fnChangeOctave = function(x) {

		x |= 0;
	
		__octave += x;
	
		__octave = Math.min(5, Math.max(3, __octave));
	
		var octaveName = document.getElementsByName('OCTAVE_LABEL');
		var i = octaveName.length;
		while(i--) {
			var val = parseInt(octaveName[i].getAttribute('value'));
			octaveName[i].innerHTML = (val + __octave);
		}
	
		document.getElementById('OCTAVE_LOWER').innerHTML = __octave-1;
		document.getElementById('OCTAVE_UPPER').innerHTML = __octave+1;
	
	};
		
	// Key bindings, notes to keyCodes.
	var keyboard = {
	
    
            /* 1 */
			128:'Bt,-1',
	
			/* Q */
			129:'C,-1',
	
			/* A */
			130:'C#,-1',
	
			/* Z */
			131:'Db,-1',
	
			/* 2 */
			132:'Dd,-1',
	
			/* W */
			133:'D,-1',
	
			/* S */
			134:'D#,-1',
	
			/* X */
			135:'Eb,-1',
	
			/* 3 */
			136:'Ed,-1',
			
			/* E */
			137:'E,-1',
	
			/* 4 */
			138:'Et,-1',
	
			/* R */
			139:'F,-1',
	
			/* F */
			140:'F#,-1',
            
            /* V */
			141:'Gb,-1',
	
			/* 5 */
			142:'Gd,-1',
	
			/* T */
			143:'G,-1',
	
			/* G */
			144:'G#,-1',
	
			/* B */
			145:'Ab,-1',
	
			/* 6 */
			146:'Ad,-1',
	
			/* Y */
			147:'A,-1',
	
			/* H */
			148:'A#,-1',
	
			/* N */
			149:'Bb,-1',
	
			/* 7 */
			150:'Bd,-1',
			
			/* U */
			151:'B,-1',
    
    
    
    
		    /* 1 */
			49:'Bt,0',
	
			/* q */
			113:'C,0',
	
			/* a */
			97:'C#,0',
	
			/* z */
			122:'Db,0',
	
			/* 2 */
			50:'Dd,0',
	
			/* w */
			119:'D,0',
	
			/* s */
			115:'D#,0',
	
			/* x */
			120:'Eb,0',
	
			/* 3 */
			51:'Ed,0',
			
			/* e */
			101:'E,0',
	
			/* 4 */
			52:'Et,0',
	
			/* r */
			114:'F,0',
	
			/* f */
			102:'F#,0',
            
            /* v */
			118:'Gb,0',
	
			/* 5 */
			53:'Gd,0',
	
			/* t */
			116:'G,0',
	
			/* g */
			103:'G#,0',
	
			/* b */
			98:'Ab,0',
	
			/* 6 */
			54:'Ad,0',
	
			/* y */
			121:'A,0',
	
			/* h */
			104:'A#,0',
	
			/* n */
			110:'Bb,0',
	
			/* 7 */
			55:'Bd,0',
			
			/* u */
			117:'B,0',
			
            
            

            /* 8 */
 			56:'Bt,1',
            
            /* ! */
			33:'Bt,1',

//            /* i */
// 			105:'C,1',
                        
            /* Q */
			81:'C,1',
	
			/* A */
			65:'C#,1',
	
			/* Z */
			90:'Db,1',
	
			/* @ */
			64:'Dd,1',
	
			/* W */
			87:'D,1',
	
			/* S */
			83:'D#,1',
	
			/* X */
			88:'Eb,1',
	
			/* # */
			35:'Ed,1',
			
			/* E */
			69:'E,1',
	
			/* $ */
			36:'Et,1',
			
			/* R */
			82:'F,1',
	
			/* F */
			70:'F#,1',
            
            /* V */
			86:'Gb,1',
	
			/* % */
			37:'Gd,1',
	
			/* T */
			84:'G,1',
	
			/* G */
			71:'G#,1',
	
			/* B */
			66:'Ab,1',
	
			/* ^ */
			94:'Ad,1',
	
			/* Y */
			89:'A,1',
	
			/* H */
			72:'A#,1',
	
			/* N */
			78:'Bb,1',
	
			/* & */
			38:'Bd,1',
			
			/* U */
			85:'B,1'
			
			

		};


		
		
	var reverseLookupText = {};
	var reverseLookup = {};

	// Create a reverse lookup table.
	for(var i in keyboard) {
	
		var val;

		switch(i|0) {
		
			case 187:
				val = 61;
				break;
					
			case 219:
				val = 91;
				break;
			
			case 221:
				val = 93;
				break;
			
			case 188:
				val = 44;
				break;
			
			case 190:
				val = 46;
				break;
			
			default:
				val = i;
				break;
		
		}
	
		reverseLookupText[keyboard[i]] = val;
		reverseLookup[keyboard[i]] = i;
	
	}

	// Keys you have pressed down.
	var keysPressed = [];
	var keysRecorded = [];
	var keyTimesRecorded = [];
	var visualKeyboard = null;
	var selectSound = null;

	var fnCreateKeyboard = function(keyboardElement) {
	
	
		if (document.getElementById('yarman24c').value.includes("YA24c"))
{					

		keyboard[138] = 'Ft,-1';
		keyboard[52] = 'Ft,0';
		keyboard[36] = 'Ft,1';
		

}else{
		keyboard[138] = 'Et,-1';
		keyboard[52] = 'Et,0';
		keyboard[36] = 'Et,1';

}

	is_perdeleractive=document.getElementById('perdeler').checked;
	if(isMobile) {var width=300; var start_octave=0;} else{var start_octave=-1;}
	is_hovveractive=document.getElementById('hovver').checked;
			//if(is_hovveractive){
			//alert("Now you can play by just hovering on the keys. ");
			//}else{
			//alert("Now you can play by clicking & dragging cursor over the keys.");
			//}
			
			
			document.getElementById('keyboard').innerHTML = "";
			
		// Generate keyboard
		// This is our main keyboard element! It's populated dynamically based on what you've set above.
		visualKeyboard = document.getElementById('keyboard');
		selectSound = document.getElementById('sound');
		
		
		var iKeys = 0;
		var iWhite = 0;
		var k=0;
		var notalar = [];
		var perdeler1=__audioSynth._perdeler_1k;
		var perdeler2=__audioSynth._perdeler_0;
		var perdeler3=__audioSynth._perdeler_1;
		
	    if (document.getElementById('yarman24c').value.includes("YA24c")){
				var notes = __audioSynth._notes_aeu;
				}
		else {
				var notes = __audioSynth._notes_yarman;
}
		
		
		
		
		for(var i=start_octave;i<=1;i++) {
		
		     switch(i){
		     case -1 : perdeler=perdeler1; break;
		     case 0  : perdeler=perdeler2; break;
		     case 1  : perdeler=perdeler3; break;
		     }
		     
       for(var n in notes) {
					var thisKey = document.createElement('div');
	
					
					if( (n.indexOf("b")> -1 || n.indexOf("#")> -1)  ) {

					  				
				     if(n.indexOf("b")> -1){
				        
						thisKey.className = 'black key ';
						thisKey.style.width = black_key_width;
						thisKey.style.height = '70px';
						thisKey.style.zIndex = "4";
						if (is_perdeleractive) 
						thisKey.title=perdeler[n];
						thisKey.style.left = (50 * (iWhite-1)) + 37 + 'px';
					  }else{
					  
					    thisKey.className = 'black key ';
						thisKey.style.width = black_key_width;
						thisKey.style.height = '140px';
						thisKey.style.zIndex = "3";
						if (is_perdeleractive) thisKey.title=perdeler[n];
						thisKey.style.left = (50 * (iWhite-1)) + 37 + 'px';
						}


					} else {
						
						if(n.indexOf("d")> -1||n.indexOf("t")> -1 )
						{
					    thisKey.className = 'white key ';
						thisKey.style.width = white_key_width;
						thisKey.style.zIndex = "2";
						thisKey.style.height = '112px';
						
						if (is_perdeleractive) thisKey.title=perdeler[n];
						thisKey.style.left = 50 * iWhite + 'px';
					   }else{
					   
					   if (is_perdeleractive) thisKey.title=perdeler[n];
						thisKey.className = 'white 	key ';
						thisKey.style.width = white_key_width;
						thisKey.style.height = '220px';
						//thisKey.title=perdeler[n];
						thisKey.style.left = 50 * iWhite + 'px';
					   iWhite++;
					   }
					
					
					
					}
					var label = document.createElement('div');
					label.className = 'label';
					label.style.zIndex="-1";
					
			

			if (is_perdeleractive){
			                         thisKey.title=perdeler[n];

                    if (n == "Ft") 
                     {                         					    
                    keyvalue_ =  String.fromCharCode(reverseLookupText['Et' + ',' + i]) ;
                    } 
                    else
                    { 
                    keyvalue_ =  String.fromCharCode(reverseLookupText[n + ',' + i]) ;

                    }
                      label.innerHTML = '<b>' + keyvalue_ + '</b>' + '<br /><br />' + n.substr(0,1) +
                        '<span name="OCTAVE_LABEL" value="' + i + '">' + (__octave + parseInt(i)) + '</span>' + (n.substr(1,1)?n.substr(1,1):'');
                    }
                    
            else{                         					    
                    if (n == "Ft") 
                     {                         					                
                    keyvalue_ =  String.fromCharCode(reverseLookupText['Et' + ',' + i]) ;
                    } 
                    else
                    { 
                    keyvalue_ =  String.fromCharCode(reverseLookupText[n + ',' + i]) ;
                    }
                      label.innerHTML = '<b>' + keyvalue_ + '</b>' + '<br /><br />' + n.substr(0,1) +
                        '<span name="OCTAVE_LABEL" value="' + i + '">' + (__octave + parseInt(i)) + '</span>' + (n.substr(1,1)?n.substr(1,1):'');
                    }
                    
							
				   // thisKey.setAttribute('')
					thisKey.appendChild(label);
					thisKey.setAttribute('ID', 'KEY_' + n + ',' + i);
					//thisKey.setAttribute('onMouseOut',"fixOnMouseOut(this, event, '');");
					
					//thisKey.setAttribute('title','test');
					
					if(is_hovveractive){
					 if (n == "Ft") 
					  n="Et";
					thisKey.addEventListener(evtListener[0], (function(_temp) { return function() { fnPlayKeyboard_Mouse({keyCode:_temp}); } })(reverseLookup[n + ',' + i]));
						
					}else{
				    if (n == "Ft") 
					  n="Et";
					
					thisKey.addEventListener(evtListener[2], (function(_temp) { return function() { fnPlayKeyboard_Mouse({keyCode:_temp}); } })(reverseLookup[n + ',' + i]));
					
					}
						
					
					
					
					visualKeyboard[n + ',' + i] = thisKey;
					visualKeyboard.appendChild(thisKey);
					// visualKeyboard[notalar[t+1] + ',' + i] = thisKey2;
                    // visualKeyboard.appendChild(thisKey2);
					
					iKeys++;
					//alert(n);
					k++;
				
			}
		}

		visualKeyboard.style.width = iWhite * 50 + 'px';

	
		if (is_hovveractive){
		 if (n == "Ft") 
					  n="Et";
		window.addEventListener(evtListener[1], function() { n = keysPressed.length; while(n--) { fnRemoveKeyBinding({keyCode:keysPressed[n]}); } });
		}else{
		 if (n == "Ft") 
					  n="Et";
	    window.addEventListener(evtListener[3], function() { n = keysPressed.length; while(n--) { fnRemoveKeyBinding({keyCode:keysPressed[n]}); } });
		}
	
	
	};
//alert(hovveractive);
	// Creates our audio player
	var fnPlayNote = function(note, octave) {
	    //alert(note+octave);
	    
	    //alert(hoveractive);

		src = __audioSynth.generate(selectSound.value, note, octave, 2);
		container = new Audio(src);
		container.addEventListener('ended', function() { container = null; });
		container.addEventListener('loadeddata', function(e) { e.target.play(); });
		container.autoplay = false;
		container.setAttribute('type', 'audio/mp3');
		/*document.body.appendChild(container);*/
		container.load();
		return container;
	
	};

var fnPlayRecord = function(keysrecorded,keysduration){

var record_array=[];
for (var i = 0, len = keysrecorded.length; i < len; i++) {
  record_array[i] = [keysrecorded[i],keysduration[i]];	
}
console.log(record_array);
fnPlaySong2(record_array);

}

	var fnPlayMakam = function(){
		
		
		switch(document.getElementById('makam').value){
				
                case 'Rast':
                if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
                var makam_array =[
                    ['C,0', 2],
					['D,0', 4],
					['E,0', 4],
					['F,0', 2],
					['G,0', 2],
					['A,0', 4],
					['B,0', 4],
					['C,1', 1],
					['C,1', 2],
                    ['Bd,0', 4],
					['A,0', 4],
					['G,0', 2],
					['F,0', 2],
					['Ed,0', 4],
					['D,0', 4],
					['C,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['G,-1', 2],
					['A,-1', 4],
					['Bd,-1', 4],
					['C,0', 4],
					['D,0', 2],
					['E,0', 4],
					['F#,0', 4],
					['G,0', 1],
					['G,0', 2],
                    ['F#,0', 4],
					['E,0', 4],
					['D,0', 2],
					['C,0', 4],
					['Bd,-1', 4],
					['A,-1', 4],
					['G,-1', 1]
				];
				}
                break;
                case 'Mahur':
                 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
                var makam_array =[
                    ['C,0', 2],
					['D,0', 4],
					['Et,0', 4],
					['F,0', 2],
					['G,0', 2],
					['A,0', 4],
					['Bt,1', 4],
					['C,1', 1],
					['C,1', 2],
                    ['B,0', 4],
					['A,0', 4],
					['G,0', 2],
					['F,0', 2],
					['E,0', 4],
					['D,0', 4],
					['C,0', 1]
				];
				}
				else{
				//  AEU versiyonu
				var makam_array =[
                    ['G,-1', 2],
					['A,-1', 4],
					['B,-1', 4],
					['C,0', 4],
					['D,0', 2],
					['E,0', 4],
					['Gb,0', 4],
					['G,0', 1],
					['G,0', 2],
                    ['Gb,0', 4],
					['E,0', 4],
					['D,0', 2],
					['C,0', 4],
					['B,-1', 4],
					['A,-1', 4],
					['G,-1', 1]
				];
				}
                break;
				case 'Hicaz':
				 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {	
				var makam_array = [
                    ['D,0', 2],
					['D#,0', 4],
					['F#,0', 4],
					['G,0', 2],
					['A,0', 2],
					['Bd,0', 4],
					['C,1', 4],
					['D,1', 1],
					['D,1', 2],
                    ['C,1', 4],
					['A#,0', 4],
					['A,0', 2],
					['G,0', 2],
					['F#,0', 4],
					['D#,0', 4],
					['D,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['A,-1', 2],
					['Bb,-1', 4],
					['C#,0', 4],
					['D,0', 2],
					['E,0', 4],
					['F#,0', 4],
					['G,0', 4],
					['A,0', 1],
					['A,0', 2],
                    ['G,0', 4],
					['F#,0', 4],
					['E,0', 4],
					['D,0', 2],
					['C#,0', 4],
					['Bb,-1', 4],
					['A,-1', 1]
				];
				}
				break;
				case 'Nihavend':
				 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array =[
                    ['C,0', 2],
					['D,0', 4],
					['D#,0', 4],
					['F,0', 2],
					['G,0', 2],
					['G#,0', 4],
					['B,0', 4],
					['C,1', 1],
					['C,1', 2],
                    ['A#,0', 4],
					['G#,0', 4],
					['G,0', 2],
					['F,0', 2],
					['D#,0', 4],
					['D,0', 4],
					['C,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['G,-1', 2],
					['A,-1', 4],
					['A#,-1', 4],
					['C,0', 4],
					['D,0', 2],
					['Eb,0', 4],
					['F#,0', 4],
					['G,0', 1],
					['G,0', 2],
                    ['F,0', 4],
					['D#,0', 4],
					['D,0', 2],
					['C,0', 4],
					['A#,-1', 4],
					['A,-1', 4],
					['G,-1', 1]
				];
				}
				break;
                case 'Hicazkar':
                 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['C,0', 2],
					['Db,0', 4],
					['E,0', 4],
					['F,0', 2],
					['G,0', 2],
                    ['Ab,0', 4],
					['B,0', 4],
					['C,1', 1],
					['C,1', 2],
                    ['B,0', 4],
					['Ab,0', 4],
					['G,0', 2],
					['F,0', 2],
					['E,0', 4],
					['Db,0', 4],
					['C,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['G,-1', 2],
					['Ab,-1', 4],
					['Bd,-1', 4],
					['C,0', 4],
					['D,0', 2],
					['Eb,0', 4],
					['F#,0', 4],
					['G,0', 1],
					['G,0', 2],
                    ['F,0', 4],
					['D#,0', 4],
					['D,0', 2],
					['C,0', 4],
					['Bd,-1', 4],
					['Ab,-1', 4],
					['G,-1', 1]
				];
				}
				break;
				case 'Kürdilihicazkar':
				 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array =[
                    ['C,0', 2],
					['Db,0', 4],
					['E,0', 4],
					['F,0', 2],
					['G,0', 2],
					['Ab,0', 4],
					['B,0', 4],
					['C,1', 1],
                    ['C,1', 2],
					['A#,0', 4],
					['G#,0', 4],
					['G,0', 2],
					['F,0', 2],
					['D#,0', 4],
					['C#,0', 4],
					['C,0', 2]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['G,-1', 2],
					['G#,-1', 4],
					['A#,-1', 4],
					['C,0', 2],
					['D,0', 4],
					['D#,0', 4],
					['F,0', 4],
					['G,0', 1],
					['G,0', 2],
                    ['F,0', 4],
					['D#,0', 4],
					['D,0', 4],
					['C,0', 2],
					['A#,-1', 4],
					['G#,-1', 4],
					['G,-1', 1]
				];
				}
				break;
				case 'Buselik':
				 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['D,0', 2],
					['Et,0', 4],
					['F,0', 4],
					['G,0', 2],
					['A,0', 2],
					['A#,0', 4],
					['C#,1', 4],
					['D,1', 1],
					['D,1', 2],
                    ['C,1', 4],
					['A#,0', 4],
					['A,0', 2],
					['G,0', 2],
					['F,0', 4],
					['Et,0', 4],
					['D,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['A,-1', 2],
					['B,-1', 4],
					['C,0', 4],
					['D,0', 4],
					['E,0', 2],
					['Et,0', 4],
					['G#,0', 4],
					['A,0', 1],
					['A,0', 2],
                    ['G,0', 4],
					['F,0', 4],
					['E,0', 2],
					['D,0', 4],
					['C,0', 4],
					['B,-1', 4],
					['A,-1', 1]
				];
				}
				break;
				case 'Saba':
				 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['D,0', 1],
					['Ed,0', 4],
					['F,0', 1],
					['Gd,0', 4],
					['A,0', 4],
					['A#,0', 2],
					['C,1', 2],
					['Db,1', 4],
					['E,1', 4],
                    ['F,1', 1],
                    ['F,1', 2],
                    ['E,1', 4],
                    ['Db,1', 4],
                    ['C,1', 2],
					['A#,0', 2],
					['Ad,0', 4],
					['Gb,0', 4],
					['F,0', 1],
					['Ed,0', 4],
					['D,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['A,-1', 2],
					['Bd,-1', 4],
					['C,0', 1],
					['Db,0', 4],
					['Ed,0', 4],
					['F,0', 4],
					['G,0', 2],
					['Ab,0', 4],
                    ['Bd,0', 4],
                    ['C,1', 1],
                    ['C,1', 2],
                    ['Bd,0', 4],
					['Ab,0', 4],
                    ['G,0', 2],
					['F,0', 4],
					['Ed,0', 4],
					['Db,0', 4],
					['C,0', 1],
					['Bd,-1', 4],
					['A,-1', 1]
				];
				}
				break;
				case 'Bestenigar':
				 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['Bd,-1', 2],
                    ['C,0', 4],
                    ['D,0', 4],
					['Ed,0', 2],
					['F,0', 1],
					['Gd,0', 4],
					['A,0', 4],
					['A#,0', 2],
					['C,1', 2],
					['Db,1', 4],
					['E,1', 4],
                    ['F,1', 1],
                    ['F,1', 2],
                    ['E,1', 4],
                    ['Db,1', 4],
                    ['C,1', 2],
					['A#,0', 2],
					['Ad,0', 4],
					['Gb,0', 4],
					['F,0', 1],
					['Ed,0', 2],
					['D,0', 4],
                    ['C,0', 4],
                    ['Bd,-1', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['F#,-1', 2],
                    ['G,-1', 4],
                    ['A,-1', 4],
					['Bd,-1', 2],
					['C,0', 1],
					['Db,0', 4],
					['Ed,0', 4],
					['F,0', 4],
					['G,0', 2],
					['Ab,0', 4],
                    ['Bd,0', 4],
                    ['C,1', 1],
                    ['C,1', 2],
                    ['Bd,0', 4],
					['Ab,0', 4],
                    ['G,0', 2],
					['F,0', 4],
					['Ed,0', 4],
					['Db,0', 4],
					['C,0', 1],
                    ['Bd,-1', 2],
                    ['A,-1', 4],
                    ['G,-1', 4],
                    ['F#,-1', 1]
				];
				}
				break;
                case 'Kürdi':
                 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['D,0', 2],
					['D#,0', 4],
					['F,0', 4],
					['G,0', 2],
					['A,0', 2],
					['A#,0', 4],
					['C,1', 4],
					['D,1', 1],
					['D,1', 2],
                    ['C,1', 1],
					['A#,0', 4],
					['G#,0', 4],
					['F#,0', 4],
					['F,0', 1],
					['D#,0', 4],
					['D,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['A,-1', 2],
					['A#,-1', 4],
					['C,0', 4],
					['D,0', 2],
					['E,0', 4],
					['F,0', 4],
					['G,0', 4],
					['A,0', 1],
					['A,0', 2],
                    ['G,0', 4],
					['F,0', 4],
					['E,0', 4],
					['D,0', 2],
					['C,0', 4],
					['A#,-1', 4],
					['A,-1', 1]
				];
				}
                break;
                case 'Segah':
                 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['E,0', 2],
					['F,0', 4],
					['G,0', 4],
					['Ad,0', 2],
					['B,0', 2],
					['C,1', 4],
					['D#,1', 4],
					['E,1', 1],
                    ['E,1', 2],
                    ['D,1', 4],
                    ['C,1', 4],
					['B,0', 2],
					['Ad,0', 2],
					['G,0', 4],
					['F,0', 4],
					['E,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
					['Bd,-1', 2],
					['C,0', 4],
					['D,0', 4],
					['Ed,0', 4],
					['F#,0', 2],
					['G,0', 4],
					['A#,0', 4],
                    ['Bd,0', 1],
                    ['Bd,0', 2],
					['A,0', 4],
                    ['G,0', 4],
					['F,0', 4],
					['Ed,0', 2],
					['D,0', 4],
					['C,0', 4],
					['Bd,-1', 1]
				];
				}
				break;
                case 'Hüzzam':
                 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['E,0', 2],
					['F,0', 4],
					['G,0', 4],
					['Ab,0', 4],
					['B,0', 2],
					['C,1', 4],
					['D#,1', 4],
					['E,1', 1],
                    ['E,1', 2],
                    ['D,1', 1],
                    ['C,1', 4],
					['Bd,0', 4],
					['Ab,0', 4],
					['G,0', 2],
					['F,0', 4],
					['E,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
					['Bd,-1', 2],
					['C,0', 4],
					['D,0', 4],
					['Eb,0', 4],
					['F#,0', 2],
					['G,0', 4],
					['A#,0', 4],
                    ['Bd,0', 1],
                    ['Bd,0', 2],
					['A,0', 4],
                    ['G,0', 4],
					['F#,0', 2],
					['Eb,0', 4],
					['D,0', 4],
					['C,0', 4],
					['Bd,-1', 1]
				];
				}
				break;
                case 'Karcığar':
                 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['D,0', 2],
					['Ed,0', 4],
					['F,0', 4],
					['G,0', 2],
					['Ab,0', 4],
					['B,0', 4],
					['C,1', 2],
					['D,1', 1],
					['D,1', 2],
                    ['C,1', 1],
					['Bd,0', 4],
					['Ab,0', 4],
					['G,0', 2],
					['F,0', 4],
					['Eb,0', 4],
					['D,0', 1]
				];	}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['A,-1', 2],
					['Bd,-1', 4],
					['C,0', 4],
					['D,0', 2],
					['Eb,0', 4],
					['F#,0', 4],
					['G,0', 4],
					['A,0', 1],
                    ['A,0', 2],
                    ['G,0', 4],
					['F#,0', 4],
					['Eb,0', 4],
					['D,0', 2],
					['C,0', 4],
					['Bd,-1', 4],
					['A,-1', 1]
				];
				}
			    break;
                case 'Hüseyni':
                 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['D,0', 2],
					['Ed,0', 4],
					['F,0', 4],
					['G,0', 2],
					['A,0', 2],
					['Bd,0', 4],
					['C,1', 4],
					['D,1', 1],
					['D,1', 2],
                    ['C,1', 4],
					['Bd,0', 4],
					['A,0', 2],
					['G,0', 2],
					['F,0', 4],
					['Ed,0', 4],
					['D,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['A,-1', 2],
					['Bd,-1', 4],
					['C,0', 4],
					['D,0', 4],
					['E,0', 2],
					['F#,0', 4],
					['G,0', 4],
					['A,0', 1],
                    ['A,0', 2],
                    ['G,0', 4],
					['F,0', 4],
					['E,0', 2],
					['D,0', 4],
					['C,0', 4],
					['Bd,-1', 4],
					['A,-1', 1]
				];
				}
				break;
                case 'Uşşak':
                 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['D,0', 2],
					['Ed,0', 4],
					['F,0', 4],
					['G,0', 2],
					['A,0', 2],
					['A#,0', 4],
					['C,1', 4],
					['D,1', 1],
					['D,1', 2],
                    ['C,1', 4],
					['A#,0', 4],
					['A,0', 2],
					['G,0', 2],
					['F,0', 4],
					['Eb,0', 4],
					['D,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['A,-1', 2],
					['Bd,-1', 4],
					['C,0', 4],
					['D,0', 2],
					['E,0', 4],
					['F,0', 4],
					['G,0', 4],
					['A,0', 1],
                    ['A,0', 2],
                    ['G,0', 4],
					['F,0', 4],
					['E,0', 4],
					['D,0', 2],
					['C,0', 4],
					['Bd,-1', 4],
					['A,-1', 1]
				];
				}
				break;
                case 'Nikriz':
                 if (document.getElementById('yarman24c').value.includes("Arel-Ezgi-Uzdilek"))
                {
				var makam_array = [
                    ['C,0', 2],
					['D,0', 4],
					['D#,0', 4],
					['F#,0', 4],
					['G,0', 2],
					['A,0', 4],
					['Bd,0', 4],
					['C,1', 1],
					['C,1', 2],
                    ['A#,0', 4],
					['A,0', 4],
					['G,0', 2],
					['F#,0', 4],
					['D#,0', 4],
					['D,0', 4],
					['C,0', 1]
				];
				}
				else{
				// AEU versiyonu
				var makam_array =[
                    ['G,-1', 2],
					['A,-1', 4],
					['Bb,-1', 4],
					['C#,0', 4],
					['D,0', 2],
					['E,0', 4],
					['F#,0', 4],
					['G,0', 1],
					['G,0', 2],
                    ['F,0', 4],
					['E,0', 4],
					['D,0', 2],
					['C#,0', 4],
					['Bb,-1', 4],
					['A,-1', 4],
					['G,-1', 1]
				];
				}
				break;
				}
				
				
	           
				fnPlaySong(makam_array);


	};

	// Detect keypresses, play notes.
	var start_time = [];

	var fnPlayKeyboard = function(e) {
     
     
     start_time.push((new Date()).getTime());
     //console.log("Start_time__++ : "+start_time);
    

	if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ 
	 var k =e.which;
	}else{
	 var k=e.keyCode;
	}
	


	
	
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==k) {
				return false;	
			}
		}

		keysPressed.push(k);
		

		switch(k) {
		
			// left
			case 111: 
			case 79:
				fnChangeOctave(-1);
				break;
		
			// right
			case 112: 
			case 80:
				fnChangeOctave(1);
				break;
		
			case 106:
			case 74:
			   fnPlayRecord(keysRecorded,keyTimesRecorded);
			   keysRecorded = [];
			   keyTimesRecorded = []; 
			   break;
			// L
        	case 108:
			case 76:
				fnPlayMakam();
				break;
		
		}
	
		if(keyboard[k]) {
          						
       if (keyboard[138] == 'Ft,-1' || keyboard[52] == 'Ft,0' || keyboard[36] == 'Ft,1')
{
		keyboard[138] = 'Et,-1';
		keyboard[52] = 'Et,0';
		keyboard[36] = 'Et,1';

}
			
			
			if(visualKeyboard[keyboard[k]]) {
			 //alert(visualKeyboard[keyboard[k]]);
			   //alert("test");
			
				visualKeyboard[keyboard[k]].style.backgroundColor = '#ff0000';
				visualKeyboard[keyboard[k]].style.marginTop = '5px';
				visualKeyboard[keyboard[k]].style.boxShadow = 'none';
			}
			var arrPlayNote = keyboard[k].split(',');
			var note = arrPlayNote[0];
			var octaveModifier = arrPlayNote[1]|0;
			//alert(note);
			fnPlayNote(note, __octave + octaveModifier);
			
			keysRecorded.push(note+","+octaveModifier);
			//console.log("Keys_Recorded_Mouse"+keysRecorded);	


		} else {
			return false;	
		}
	
	}




var fnPlayKeyboard_Mouse = function(e) {
	var start_time = (new Date()).getTime();

	if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ 
	 var k =e.keyCode;
	}else{
	 var k=e.keyCode;
	}
	
	
	
	
	
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==k) {
				return false;	
			}
		}
		keysPressed.push(k);
		
	
		switch(k) {
		
			// left
			case 111:
				fnChangeOctave(-1);
				break;
		
			// right
			case 112:
				fnChangeOctave(1);
				break;
		
			case 74:
			case 106:
			   fnPlayRecord(keysRecorded,keyTimesRecorded);
			   break;
			// L
			
			
			case 108:
			case 76:

				
				fnPlaySong(document.getElementById('makam').value);
				break;
		
		}
	
		if(keyboard[k]) {
		
		  if (keyboard[138] == 'Ft,-1' || keyboard[52] == 'Ft,0' || keyboard[36] == 'Ft,1')
{
		keyboard[138] = 'Et,-1';
		keyboard[52] = 'Et,0';
		keyboard[36] = 'Et,1';

}
		//	console.log(visualKeyboard[keyboard[k]]);
			if(visualKeyboard[keyboard[k]]) {
			//console.log(visualKeyboard[keyboard[k]]);
			   //alert("test");
			   //alert(keyboard[k]);
				visualKeyboard[keyboard[k]].style.backgroundColor = '#ff0000';
				visualKeyboard[keyboard[k]].style.marginTop = '5px';
				visualKeyboard[keyboard[k]].style.boxShadow = 'none';
			}
			var arrPlayNote = keyboard[k].split(',');
			var note = arrPlayNote[0];
			var octaveModifier = arrPlayNote[1]|0;
			
			fnPlayNote(note, __octave + octaveModifier);
			
			//keysRecorded.push(note+","+octaveModifier);
			//console.log("Keys_Recorded_Mouse"+keysRecorded);	

		} else {
			return false;	
		}
	
	}

	





var fnRemoveKeyBinding = function(e) {
	var note = note;
	var octaveModifier = octaveModifier;
	var start_time_temp = start_time;
	start_time=[];
    
	var end_time = (new Date()).getTime();
	var time_elapsed = (end_time-start_time_temp[0])/1000;
	start_time_temp = [];
	//console.log("End_Time : "+ end_time);
	//console.log("Time Elapsed : "+time_elapsed/1000);
			keyTimesRecorded.push(time_elapsed);
			//console.log("Time_Elapsed"+keyTimesRecorded);	
					

	//sleep(10000);
		var i = keysPressed.length;
		//console.log(i);	
		//console.log(e.keyCode);
		//console.log(e.charCode);
		//for(var k=0;k<=32;k=k+32){
		  if (keyboard[138] == 'Ft,-1' || keyboard[52] == 'Ft,0' || keyboard[36] == 'Ft,1')
{
		keyboard[138] = 'Et,-1';
		keyboard[52] = 'Et,0';
		keyboard[36] = 'Et,1';

}
		
		while(i--) {
			
			
			switch(keysPressed[i]){
			case e.keyCode:
				if(visualKeyboard[keyboard[e.keyCode]]) {
				
					visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode]].style.boxShadow = '';
				}
				keysPressed.splice(i, 1);
			break;
			case e.keyCode+32:
			 if(visualKeyboard[keyboard[e.keyCode]]) {
			 
					visualKeyboard[keyboard[e.keyCode+32]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode+32]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode+32]].style.boxShadow = '';
					}
				keysPressed.splice(i, 1);
				break;
					
					
			  case e.keyCode-16:	
			  	 if(visualKeyboard[keyboard[e.keyCode]]) {	
			  	 
					visualKeyboard[keyboard[e.keyCode-16]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode-16]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode-16]].style.boxShadow = '';
			  	}
				keysPressed.splice(i, 1);
				break;
				
				
			case e.keyCode-17:	
			  	 if(visualKeyboard[keyboard[e.keyCode]]) {	
			  	 
					visualKeyboard[keyboard[e.keyCode-17]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode-17]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode-17]].style.boxShadow = '';
			  	}
				keysPressed.splice(i, 1);
				break;	
				
			case e.keyCode+14:	
			  	 if(visualKeyboard[keyboard[e.keyCode]]) {	
			  	 
					visualKeyboard[keyboard[e.keyCode+14]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode+14]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode+14]].style.boxShadow = '';
			  	}
				keysPressed.splice(i, 1);
				break;	
			  
			  case e.keyCode+40:
			   if(visualKeyboard[keyboard[e.keyCode]]) {
			  		
					visualKeyboard[keyboard[e.keyCode+40]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode+40]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode+40]].style.boxShadow = '';
				}
				keysPressed.splice(i, 1);
				break;
			
			
			
			}
			
			
			
		}
	//}
	}



	var fnPlaySong = function(arr) {
	
		if(arr.length>0) {
		
			var noteLen = 1000*(1/parseInt(arr[0][1]));
			console.log("notelen: "+noteLen);
			if(!(arr[0][0] instanceof Array)) {
				arr[0][0] = [arr[0][0]];	
			}
			var i = arr[0][0].length;
			var keys = [];
			while(i--) {
							console.log("while ->"+arr[0][0][i]);

				keys.unshift(reverseLookup[arr[0][0][i]]);
				fnPlayKeyboard_Mouse({keyCode:keys[0]});
			}
			arr.shift();
			setTimeout(function(array, val){ return function() { var i = val.length; while(i--) { fnRemoveKeyBinding({keyCode:val[i]}); } fnPlaySong(array); } }(arr, keys), noteLen);
		
		}
	
	};

	var fnPlaySong2 = function(arr) {
	 console.log("test : --> "+arr);
		if(arr.length>0) {
		
			var noteLen = 2710*arr[0][1];
			console.log("noteln-- : =>"+noteLen);
			if(!(arr[0][0] instanceof Array)) {
				arr[0][0] = [arr[0][0]];	
			}
			var i = arr[0][0].length;
			var keys = [];
			while(i--) {
				console.log("while ->"+arr[0][0][i]);
				keys.unshift(reverseLookup[arr[0][0][i]]);
				fnPlayKeyboard_Mouse({keyCode:keys[0]});
			}
			arr.shift();
			setTimeout(function(array, val){ return function() { var i = val.length; while(i--) { fnRemoveKeyBinding({keyCode:val[i]}); } fnPlaySong2(array); } }(arr, keys), noteLen);
		
		}
	
	};

	// Set up global event listeners

	window.addEventListener('keypress', fnPlayKeyboard);
	window.addEventListener('keyup', fnRemoveKeyBinding);
    //window.addEventListener('touchstart', fnPlayKeyboard);
    //window.addEventListener('touchend', fnRemoveKeyBinding);
	//window.addEventListener('mouseover',fnPlayKeyboard);
	//window.addEventListener('mouseout',fnRemoveKeyBinding);
	document.getElementById('hovver').addEventListener('change',function() {fnCreateKeyboard();});
    //document.getElementById('yarman24c').addEventListener('click',function() {fnCreateKeyboard();});

	document.getElementById('perdeler').addEventListener('change',function() {fnCreateKeyboard();});
	document.getElementById('-_OCTAVE').addEventListener('click', function() { fnChangeOctave(-1); });
	document.getElementById('+_OCTAVE').addEventListener('click', function() { fnChangeOctave(1); });
	
	Object.defineProperty(this, 'draw', {
		value: fnCreateKeyboard
	});

}
