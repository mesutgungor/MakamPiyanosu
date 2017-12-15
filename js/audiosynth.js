var Synth, AudioSynth, AudioSynthInstrument;
!function(){
	var _encapsulated = false;
	var AudioSynthInstance = null;
	var pack = function(c,arg){return [String.fromCharCode(arg&255,(arg>>8)&255),String.fromCharCode(arg&255,(arg>>8)&255,(arg>>16)&255,(arg>>24)&255)][c];};
	var setPrivateVar = function(n,v,w,e){Object.defineProperty(this,n,{value:v,writable:!!w,enumerable:!!e});};
	var setPublicVar = function(n,v,w){setPrivateVar.call(this,n,v,w,true);};
	AudioSynthInstrument = function AudioSynthInstrument(){this.__init__.apply(this,arguments);};
	var setPriv = setPrivateVar.bind(AudioSynthInstrument.prototype);
	var setPub = setPublicVar.bind(AudioSynthInstrument.prototype);
	setPriv('__init__', function(a,b,c) {
		if(!_encapsulated) { throw new Error('AudioSynthInstrument can only be instantiated from the createInstrument method of the AudioSynth object.'); }
		setPrivateVar.call(this, '_parent', a);
		setPublicVar.call(this, 'name', b);
		setPrivateVar.call(this, '_soundID', c);
	});
	setPub('play', function(note, octave, duration) {
		return this._parent.play(this._soundID, note, octave, duration);
	});
	setPub('generate', function(note, octave, duration) {
		return this._parent.generate(this._soundID, note, octave, duration);
	});
	AudioSynth = function AudioSynth(){if(AudioSynthInstance instanceof AudioSynth){return AudioSynthInstance;}else{ this.__init__(); return this; }};
	setPriv = setPrivateVar.bind(AudioSynth.prototype);
	setPub = setPublicVar.bind(AudioSynth.prototype);
	setPriv('_debug',false,true);
	setPriv('_bitsPerSample',16);
	setPriv('_channels',1);
	setPriv('_sampleRate',44100,true);
	setPub('setSampleRate', function(v) {
		this._sampleRate = Math.max(Math.min(v|0,44100), 4000);
		this._clearCache();
		return this._sampleRate;
	});
	setPub('getSampleRate', function() { return this._sampleRate; });
	setPriv('_volume',32768,true);
	setPub('setVolume', function(v) {
		v = parseFloat(v); if(isNaN(v)) { v = 0; }
		v = Math.round(v*32768);
		this._volume = Math.max(Math.min(v|0,32768), 0);
		this._clearCache();
		return this._volume;
	});
	setPub('getVolume', function() { return Math.round(this._volume/32768*10000)/10000; });
	setPriv('_notes',{'Bt':249.649303,'C': 260.740741,'C#':273.871371,'Db':283.294429,'Dd':291.283703,'D':293.333333,'D#':308.718833, 'Eb':318.855346, 'Ed':321.473895,'E':325.404444,'Et':331.429772,'F':347.654321,'F#':364.798788,'Gb':376.096415,'Gd':379.259259,'G':390.068148,'G#':411.215880,'Ab':426.782762,'Ad':435.396398,'A':440.000000,'A#': 463.539095,'Bb':476.442539,'Bd':484.300087,'B':488.106667},true);
	setPriv('_notes_yarman',{'Bt':249.649303,'C': 260.740741,'C#':273.871371,'Db':283.294429,'Dd':291.283703,'D':293.333333,'D#':308.718833, 'Eb':318.855346, 'Ed':321.473895,'E':325.404444,'Et':331.429772,'F':347.654321,'F#':364.798788,'Gb':376.096415,'Gd':379.259259,'G':390.068148,'G#':411.215880,'Ab':426.782762,'Ad':435.396398,'A':440.000000,'A#': 463.539095,'Bb':476.442539,'Bd':484.300087,'B':488.106667},true);
	setPriv('_notes_aeu',{'Bt':257.231266,'C':260.7407407,'C#':274.6898339,'Db':278.4375,'Dd':289.3851748,'D':293.3333333,'D#':309.0260631,'Eb':313.2421875,'Ed':325.5583216,'E':330, 'Ft':352.3974609,'F':347.654321,'F#':366.2531118,'Gb':371.25,'Gd':385.8468997,'G':391.1111111,'G#':412.0347508,'Ab':417.65625,'Ad':434.0777622,'A':440,'A#':463.5390947,'Bb':469.8632813,'Bd':488.3374824,'B':495},true);

	setPub('setNoteFreq',function(v) {
		this._notes=v; 
		this._clearCache();
		return this._notes;
	});
	
	
	setPriv('_perdeler_1k',{'Bt':'kaba dik-gevaşt /dik-rahavi','C':'kaba rast','C#':'kaba nim-zengule /şuri','Db':'kaba zengule','Dd':'kaba dik-zengule','D':'kaba dügah','D#':'kaba kürdi /nihavend', 'Eb':'kaba dik-kürdi /uşşak', 'Ed':'kaba segah','E':'kaba segahçe','Et':'kaba buselik /nişabur','F':'kaba çargah','F#':'kaba nim-hicaz /uzzal','Gb':'kaba hicaz /saba','Gd':'kaba dik-hicaz /bestenigar','G':'yegah','G#':'kaba nim-hisar /bayati','Ab':'kaba hisar /hüzzam','Ad':'kaba dik-hisar /hisarek','A':'(hüseyni)aşiran','A#':'acemaşiran /kaba nevruz','Bb':'dik-acemaşiran /kaba arazbar','Bd':'arak','B':'gevaşt /rahavi'},true);
	setPriv('_perdeler_0',{'Bt':'dik-gevaşt /dik-rahavi','C':'rast','C#':'nim-zengule /şuri','Db':'zengule','Dd':'dik-zengule','D':'dügah','D#':'kürdi /nihavend','Eb':'dik-kürdi /uşşak','Ed':'segah','E':'segahçe','Et':'buselik /nişabur','F':'çargah','F#':'nim-hicaz /uzzal','Gb':'hicaz /saba','Gd':'dik-hicaz /bestenigar','G':'neva','G#':'nim-hisar /bayati','Ab':'hisar /hüzzam','Ad':'dik-hisar /hisarek','A':'hüseyni','A#':'acem /nevruz','Bb':'dik-acem /arazbar','Bd':'evc','B':'mahur'},true);
	setPriv('_perdeler_1',{'Bt':'dik-mahur','C':'gerdaniye','C#':'nim-şehnaz','Db':'şehnaz','Dd':'dik-şehnaz','D':'muhayyer','D#':'sünbüle', 'Eb':'dik-sünbüle /tiz uşşak', 'Ed':'tiz segah','E':'tiz segahçe','Et':'tiz buselik /nişabur','F':'tiz çargah','F#':'tiz nim-hicaz /uzzal','Gb':'tiz hicaz /saba','Gd':'tiz dik-hicaz /bestenigar','G':'tiz neva','G#':'tiz nim-hisar /bayati','Ab':'tiz hisar /hüzzam','Ad':'tiz dik-hisar /hisarek','A':'tiz hüseyni','A#': 'tiz acem /nevruz','Bb':'tiz dik-acem /arazbar','Bd':'tiz evc','B':'tiz mahur'},true);

	
	setPub('setPerdeler_1k',function(t) {
	//console.log("testperdeler : "+t['Bt']);
		this._perdeler_1k = t; 
		this._clearCache();
		return this._perdeler_1k;
	});
		setPub('setPerdeler_0',function(t) {
	//console.log("testperdeler : "+t['Bt']);
		this._perdeler_0 = t; 
		this._clearCache();
		return this._perdeler_0;
	});
		setPub('setPerdeler_1',function(t) {
	//console.log("testperdeler : "+t['Bt']);
		this._perdeler_1 = t; 
		this._clearCache();
		return this._perdeler_1;
	});
	

	setPriv('_fileCache',[],true);
	setPriv('_temp',{},true);
	setPriv('_sounds',[],true);
	setPriv('_mod',[function(i,s,f,x){return Math.sin((2 * Math.PI)*(i/s)*f+x);}]);
	setPriv('_resizeCache', function() {
		var f = this._fileCache;
		var l = this._sounds.length;
		while(f.length<l) {
			var octaveList = [];
			for(var i = 0; i < 24; i++) {
				var noteList = {};
				for(var k in this._notes) {
					noteList[k] = {};
				} 
				octaveList.push(noteList);
			}
			f.push(octaveList);
		}
	});
	setPriv('_clearCache', function() {
		this._fileCache = [];
		this._resizeCache();
	});
	setPub('generate', function(sound, note, octave, duration) {
	

		var thisSound = this._sounds[sound];
		if(!thisSound) {
			for(var i=0;i<this._sounds.length;i++) {
				if(this._sounds[i].name==sound) {
					thisSound = this._sounds[i];
					sound = i;
					break;
				}
			}
		}
		if(!thisSound) { throw new Error('Invalid sound or sound ID: ' + sound); }
		var t = (new Date).valueOf();
		this._temp = {};
		octave |= 0;
		octave = Math.min(16, Math.max(1, octave));
		var time = !duration?2:parseFloat(duration);
		if(typeof(this._notes[note])=='undefined') { throw new Error(note + ' is not a valid note.'); }
		if(typeof(this._fileCache[sound][octave-1][note][time])!='undefined') {
			if(this._debug) { console.log((new Date).valueOf() - t, 'ms to retrieve (cached)'); }
			return this._fileCache[sound][octave-1][note][time];
		} else {
			var frequency = this._notes[note] * Math.pow(2,octave-4);
			var data = [];
			var sampleRate = this._sampleRate;
			var volume = this._volume;
			var channels = this._channels;
			var bitsPerSample = this._bitsPerSample;
			var attack = thisSound.attack(sampleRate, frequency, volume);
			var dampen = thisSound.dampen(sampleRate, frequency, volume);
			var wave = thisSound.wave.bind({modulate: this._mod, vars: this._temp});
			var val = 0;
			var curVol = 0;

			for (var i = 0; i < (sampleRate * time); i++) {	
				if(i<=sampleRate*attack) {
					curVol = volume * (i/(sampleRate*attack));
				} else {
					curVol = volume * Math.pow((1-((i-(sampleRate*attack))/(sampleRate*(time-attack)))),dampen);
				}
		
				val = curVol * Math.min(Math.max(wave(i, sampleRate, frequency, volume), -1), 1);
				val = String.fromCharCode(val&255, (val>>>8)&255);
				data.push(val);
			}
	
			data = data.join('');

			// Format sub-chunk
			var chunk1 = [
				'fmt ', // Sub-chunk identifier
				pack(1, 16), // Chunk length
				pack(0, 1), // Audio format (1 is linear quantization)
				pack(0, channels),
				pack(1, sampleRate),
				pack(1, sampleRate * channels * bitsPerSample / 8), // Byte rate
				pack(0, channels * bitsPerSample / 8),
				pack(0, bitsPerSample)
			].join('');
			// Data sub-chunk (contains the sound)
			var chunk2 = [
				'data', // Sub-chunk identifier
				pack(1, data.length * channels * bitsPerSample / 8), // Chunk length
				data
			].join('');
			// Header
			var header = [
				'RIFF',
				pack(1, 4 + (8 + chunk1.length) + (8 + chunk2.length)), // Length
				'WAVE'
			].join('');
			var out = [header, chunk1, chunk2].join('');
			var dataURI = 'data:audio/wav;base64,' + escape(window.btoa(out)); 
			this._fileCache[sound][octave-1][note][time] = dataURI;
			if(this._debug) { console.log((new Date).valueOf() - t, 'ms to generate'); }
			return dataURI;
		}
	});
	setPub('play', function(note, octave, duration) {
		var src = this.generate(note, octave, duration);
		var audio = new Audio(src);
		audio.addEventListener('ended', function() { audio = null; });
		audio.autoplay = true;
		audio.setAttribute('type', 'audio/wav');
		return true;
	});
	setPub('debug', function() { this._debug = true; });
	setPub('createInstrument', function(sound) {
		var n = 0;
		var found = false;
		if(typeof(sound)=='string') {
			for(var i=0;i<this._sounds.length;i++) {
				if(this._sounds[i].name==sound) {
					found = true;
					n = i;
					break;
				}
			}
		} else {
			if(this._sounds[sound]) {
				n = sound;
				sound = this._sounds[n].name;
				found = true;
			}
		}
		if(!found) { throw new Error('Invalid sound or sound ID: ' + sound); }
		_encapsulated = true;
		var ins = new AudioSynthInstrument(this, sound, n);
		_encapsulated = false;
		return ins;
	});
	setPub('listSounds', function() {
		var r = [];
		for(var i=0;i<this._sounds.length;i++) {
			r.push(this._sounds[i].name);
		}
		return r;
	});
	setPriv('__init__', function(){
		this._resizeCache();
	});
	setPub('loadSoundProfile', function() {
		for(var i=0,len=arguments.length;i<len;i++) {
			o = arguments[i];
			if(!(o instanceof Object)) { throw new Error('Invalid sound profile.'); }
			this._sounds.push(o);
		}
		this._resizeCache();
		return true;
	});
	setPub('loadModulationFunction', function() {
		for(var i=0,len=arguments.length;i<len;i++) {
			f = arguments[i];
			if(typeof(f)!='function') { throw new Error('Invalid modulation function.'); }
			this._mod.push(f);
		}
		return true;
	});
	AudioSynthInstance = new AudioSynth();
	Synth = AudioSynthInstance;
}();

Synth.loadModulationFunction(
	function(i, sampleRate, frequency, x) { return 1 * Math.sin(2 * Math.PI * ((i / sampleRate) * frequency) + x); },
	function(i, sampleRate, frequency, x) { return 1 * Math.sin(4 * Math.PI * ((i / sampleRate) * frequency) + x); },
	function(i, sampleRate, frequency, x) { return 1 * Math.sin(8 * Math.PI * ((i / sampleRate) * frequency) + x); },
	function(i, sampleRate, frequency, x) { return 1 * Math.sin(0.5 * Math.PI * ((i / sampleRate) * frequency) + x); },
	function(i, sampleRate, frequency, x) { return 1 * Math.sin(0.25 * Math.PI * ((i / sampleRate) * frequency) + x); },
	function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(2 * Math.PI * ((i / sampleRate) * frequency) + x); },
	function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(4 * Math.PI * ((i / sampleRate) * frequency) + x); },
	function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(8 * Math.PI * ((i / sampleRate) * frequency) + x); },
	function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(0.5 * Math.PI * ((i / sampleRate) * frequency) + x); },
	function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(0.25 * Math.PI * ((i / sampleRate) * frequency) + x); }
);

Synth.loadSoundProfile({
	name: 'piano',
	attack: function() { return 0.002; },
	dampen: function(sampleRate, frequency, volume) {
		return Math.pow(0.5*Math.log((frequency*volume)/sampleRate),2);
	},
	wave: function(i, sampleRate, frequency, volume) {
		var base = this.modulate[1];
		return this.modulate[1](
			i,
			sampleRate,
			frequency,
			Math.pow(base(i, sampleRate, frequency, 0), 2) +
				(0.75 * base(i, sampleRate, frequency, 0.25)) +
				(0.1 * base(i, sampleRate, frequency, 0.25))
		);
	}
},
{
	name: 'organ',
	attack: function() { return 0.35 },
	dampen: function(sampleRate, frequency) { return 1+(frequency * 0.035); },
	wave: function(i, sampleRate, frequency) {
		var base = this.modulate[0];
		return this.modulate[2](
			i,
			sampleRate,
			frequency,
			base(i, sampleRate, frequency, 2) +
				0.5*base(i, sampleRate, frequency, 0.25) +
				0.75*base(i, sampleRate, frequency, 0.5)
		);
	}
},
{
	name: 'acoustic',
	attack:	function() { return 0.002; },
	dampen: function() { return 2; },
	wave: function(i, sampleRate, frequency) {

		var vars = this.vars;
		vars.valueTable = !vars.valueTable?[]:vars.valueTable;
		if(typeof(vars.playVal)=='undefined') { vars.playVal = 1; }
		if(typeof(vars.periodCount)=='undefined') { vars.periodCount = 1; }
	
		var valueTable = vars.valueTable;
		var playVal = vars.playVal;
		var periodCount = vars.periodCount;

		var period = sampleRate/frequency;
		var p_hundredth = Math.floor((period-Math.floor(period))*-1);

		var resetPlay = false;

		if(valueTable.length<=Math.ceil(period)) {
	
			valueTable.push(Math.round(Math.random())*2-1);
	
			return valueTable[valueTable.length+1];
	
		} else {
	
			valueTable[playVal] = (valueTable[playVal>=(valueTable.length-1)?0:playVal+1] + valueTable[playVal]) * 0.5;
	
			if(playVal>=Math.floor(period)) {
				if(playVal<Math.ceil(period)) {
					if((periodCount%49.75)>=p_hundredth) {
						// Reset
						resetPlay = true;
						valueTable[playVal+1] = (valueTable[3] + valueTable[playVal-1]) * 0.5;
						vars.periodCount++;	
					}
				} else {
					resetPlay = true;	
				}
			}
	
			var _return = valueTable[playVal];
			if(resetPlay) { vars.playVal = 0; } else { vars.playVal++; }
	
			return _return;
	
		}
	}
},
{
	name: 'edm',
	attack:	function() { return 0.001; },
	dampen: function() { return 6; },
	wave: function(i, sampleRate, frequency) {
		var base = this.modulate[1];
		var mod = this.modulate.slice(0);
		return mod[2](
			i,
			sampleRate,
			frequency,
			mod[3](
				i,
				sampleRate,
				frequency,
				mod[2](
					i,
					sampleRate,
					frequency,
					Math.pow(base(i, sampleRate, frequency, 2), 3) +
						Math.pow(base(i, sampleRate, frequency, 0.5), 5) +
						Math.pow(base(i, sampleRate, frequency, 2), 6)
				)
			) +
				mod[8](
					i,
					sampleRate,
					frequency,
					base(i, sampleRate, frequency, 3)
				)
		);
	}
});