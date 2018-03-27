var element_loading = document.querySelector('#loading');
var loadings = 0;

var containerNode;

var scale = 1/2;
var width = 0;
var height = 0;

//Mitsubishi
var header_color = "rgb(207,207,207)";
var header_height = 236;
var for_ja_fontsize = 38;
var for_en_fontsize = 37;
var carno_width = 80;
var carno_radius = 16;
var carno_fontsize = 64;
var carno_text_fontsize = 28;
var text_color0 = "rgb(64,64,64)";
var text_color1 = "rgb(88,88,88)";
var next_text_ja_fontsize = 48;
var next_text_en_fontsize = 56;
var border_color0 = "rgb(96,96,96)";
var border_color1 = "rgb(128,128,128)";
var border_width = 4;
var sta_color = "rgb(154,205,50)";
var sta_width = 498;
var sta_height = 160;
var sta_ja_fontsize = 156;
var sta_en_fontsize = 120;
var sta_text_ja_width = sta_width - 32;
var sta_text_en_width = sta_width - 16;
var sta_text_hiragana_width = sta_width;
var bg_color = "rgb(239,239,239)";

var font_ja = "Noto Sans Japanese";
var font_en = "Noto Sans Japanese";

var header_tick = 0;
var header_en = false;
var header_hiragana = false;
var timeout_id;

var carno = 10;
var for_ja_input;
var for_ja = "品川･渋谷";
var for_en_input;
var for_en = "Shinagawa & Shibuya";
var loop_checkbox;
var loop = true;
var last_loop = true;
var next_phase_button;
var stopping = true;
var last_stopping = true;
var arriving = false;
var last_arriving = false;
var forinfo_tick = 0;
var sta0_ja = "ただいま";
var sta0_hiragana = "ただいま";

var stalist_table;
var stalist_ja = ["東京", "有楽町", "新橋", "浜松町", "田町", "品川", "大崎", "五反田", "目黒", "恵比寿", "渋谷", "原宿", "代々木", "新宿", "新大久保", "高田馬場", "目白", "池袋", "大塚", "巣鴨", "駒込", "田端", "西日暮里", "日暮里", "鶯谷", "上野", "御徒町", "秋葉原", "神田"];
var stalist_en = ["Tōkyō", "Yūrakuchō", "Shimbashi", "Hamamatsuchō", "Tamachi", "Shinagawa", "Ōsaki", "Gotanda", "Meguro", "Ebisu", "Shibuya", "Harajuku", "Yoyogi", "Shinjuku", "Shin-Ōkubo", "Takadanobaba", "Mejiro", "Ikebukuro", "Ōtsuka", "Sugamo", "Komagome", "Tabata", "Nishi-Nippori", "Nippori", "Uguisudani", "Ueno", "Okachimachi", "Akihabara", "Kanda"];
var stalist_hiragana = ["とうきょう", "ゆうらくちょう", "しんばし", "はままつちょう", "たまち", "しながわ", "おおさき", "ごたんだ", "めぐろ", "えびす", "しぶや", "はらじゅく", "よよぎ", "しんじゅく", "しんおおくぼ", "たかだのばば", "めじろ", "いけぶくろ", "おおつか", "すがも", "こまごめ", "たばた", "にしにっぽり", "にっぽり", "うぐいすだに", "うえの", "おかちまち", "あきはばら", "かんだ"];

window.addEventListener('DOMContentLoaded', function () {tvm_init();});

function tvm_init() {
	if (containerNode == null) {
		containerNode = document.querySelector('#trainvision');
		for_ja_input = document.getElementById('for-ja-input');
		for_ja_input.addEventListener('input', function () {for_ja = for_ja_input.value;tvm_draw();});
		for_ja_input.value = for_ja;
		for_en_input = document.getElementById('for-en-input');
		for_en_input.addEventListener('input', function () {for_en = for_en_input.value;tvm_draw();});
		for_en_input.value = for_en;
		loop_checkbox = document.getElementById('loop-checkbox');
		loop_checkbox.addEventListener('change', function () {loop = loop_checkbox.checked;});
		loop_checkbox.checked = loop;

		next_phase_button = document.getElementById('next-phase-button');
		next_phase_button.addEventListener('click', function () {
			if (stopping) {
				tvm_departure();
			} else if (arriving) {
				tvm_stopping();
			} else {
				tvm_arriving();
			}
			next_phase_button.value = (stopping ? "発車する" : arriving ? "停車する" : "減速する");
		});
		next_phase_button.value = (stopping ? "発車する" : arriving ? "停車する" : "減速する");
		next_phase_button.disabled = stalist_ja.length == 1;

		stalist_table = document.getElementById('stalist-table');
		tvm_stalist_0();
	}

	width = 1024;
	height = 768;
	//width = 1280;
	//height = 720;
	//width = 1280;
	//height = 768;

	containerNode.style.width = width * scale + 'px';
	containerNode.style.height = height * scale + 'px';

	tvm_draw();
	timeout_id = setInterval(function () {tvm_tick();}, 1000);
}

function tvm_tick() {
	if (header_tick == -1) {
		//TODO 急停車表示
	}
	header_tick++;
	if (header_tick == 3 || stopping != last_stopping) {
		header_tick = 0;
		if (stopping != last_stopping || arriving != last_arriving) {
			sta0_ja = (stopping ? "ただいま" : arriving ? "まもなく" : "次は");
			header_en = false;
			header_hiragana = false;
		} else {
			if (header_en) {
				header_en = false;
				if (!stopping && !arriving && forinfo_tick != 0)
					header_hiragana = true;
			} else if (header_hiragana)
				header_hiragana = false;
			else
				header_en = true;
		}
		last_loop = loop;
		last_arriving = arriving;
	}
	last_stopping = stopping;
	if (forinfo_tick >= 0)
		forinfo_tick--;
	tvm_draw();

	//clearInterval(interval_id);
	//interval_id = null;
}

function tvm_draw() {
	containerNode.innerHTML = null;
	var tags = ['<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width:inherit;height:inherit;">'];

	//header
	tags.push('<rect x="0" y="0" width="'+width*scale
	+'" height="'+header_height*scale
	+'" fill="'+header_color+'" />');

	tags.push('<rect x="'+(width-16-carno_width)*scale
	+'" y="'+16*scale+'" width="'+carno_width*scale
	+'" height="'+carno_width*scale
	+'" rx="'+carno_radius*scale
	+'" ry="'+carno_radius*scale
	+'" fill="rgb(255,255,255)" />');

	tags.push('<text x="'+(width-16-carno_width/2)*scale+'" y="'+(16+carno_width/2)*scale
	+'" fill="rgb(48,48,48)" font-family="MS PGothic" font-weight="bold" font-size="'+carno_fontsize*scale
	+'px" text-anchor="middle" dominant-baseline="central" letter-spacing="-3">'
	+carno+'</text>');

	tags.push('<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="'+border_color0
	+'" /><stop offset="100%" stop-color="'+header_color
	+'" /></linearGradient>');

	tags.push('<rect x="'+(width/2-sta_width/2-border_width)*scale
	+'" y="'+(64-border_width)*scale
	+'" width="'+(sta_width+border_width*2)*scale
	+'" height="'+(sta_height+border_width*2)*scale
	+'" fill="url(#grad1)" />');
	tags.push('<rect x="'+(width/2-sta_width/2)*scale
	+'" y="'+64*scale+'" width="'+sta_width*scale
	+'" height="'+sta_height*scale
	+'" fill="rgb(255,255,255)" />');

	if (header_en) {
		if (forinfo_tick >= 0 || last_stopping && stalist_en[0] == "Tōkyō") {
			tags.push('<text id="sta0_en" x="'+(width/2-sta_width/2-16)*scale+'" y="'+(64+sta_height-36)*scale
			+'" fill="'+text_color0+'" font-family="'+font_en+'" font-weight="700" font-size="'+next_text_en_fontsize*scale
			+'px" text-anchor="end">'+(last_loop?"Bound for":"For")+'</text>');

			var b = for_en.indexOf('&');
			if (b == -1)
				tags.push('<text id="sta" x="'+width/2*scale
				+'" y="'+(64+sta_height/2)*scale
				+'" fill="'+sta_color+'" font-family="'+font_en+'" font-weight="700" font-size="'+sta_en_fontsize*scale
				+'px" text-anchor="middle" dy="'+sta_en_fontsize*0.37*scale+'">'+for_en+'</text>');
			else {
				tags.push('<text id="sta" x="'+(width/2-sta_text_en_width/2)*scale
				+'" y="'+(64+sta_height/2-sta_en_fontsize/3.4)*scale
				+'" fill="'+sta_color+'" font-family="'+font_en+'" font-weight="700" font-size="'+sta_en_fontsize/1.7*scale
				+'px" text-anchor="start" dy="'+(sta_en_fontsize/2)*0.37*scale+'">'+for_en.substr(0, b+1)+'</text>');
				tags.push('<text id="sta1" x="'+(width/2+sta_text_en_width/2)*scale
				+'" y="'+(64+sta_height/2+sta_en_fontsize/1.7-sta_en_fontsize/3.4)*scale
				+'" fill="'+sta_color+'" font-family="'+font_en+'" font-weight="700" font-size="'+sta_en_fontsize/1.7*scale
				+'px" text-anchor="end" dy="'+(sta_en_fontsize/2)*0.37*scale+'">'+for_en.substr(b+1)+'</text>');
			}
		} else {
			tags.push('<text x="'+8*scale+'" y="'+32*scale
			+'" fill="'+text_color1+'" font-family="'+font_en+'" font-weight="700" font-size="'+for_en_fontsize*scale
			+'px" dy="'+for_en_fontsize*0.3*scale+'">'+(last_loop?"Bound for ":"For ")
			+for_en+'</text>');

			var a = '<text id="sta0_en" x="'+(width/2-sta_width/2-16)*scale
			+'" y="'+(last_stopping?(64+sta_height-36-next_text_en_fontsize)*scale:(64+sta_height-36)*scale)
			+'" fill="'+text_color0+'" font-family="'+font_en+'" font-weight="700" font-size="'+next_text_en_fontsize*scale
			+'px" text-anchor="end">';
			if (last_stopping)
				a += 'Now<tspan dx="'+-80*scale
				+'" dy="'+next_text_en_fontsize*scale
				+'">Stopping at</tspan>';
			else
				a += arriving ? "Arriving at" : "Next";
			tags.push(a+'</text>');

			tags.push('<text id="sta" x="'+width/2*scale+'" y="'+(64+sta_height/2)*scale
			+'" fill="'+sta_color+'" font-family="'+font_en+'" font-weight="700" font-size="'+sta_en_fontsize*scale
			+'px" text-anchor="middle" dy="'+sta_en_fontsize*0.37*scale+'">'+stalist_en[0]+'</text>');
		}

		tags.push('<text x="'+(width-16-carno_width-4)*scale+'" y="'+16*scale
		+'" fill="'+text_color0+'" font-family="'+font_en+'" font-weight="700" font-size="'+carno_text_fontsize*scale
		+'px" text-anchor="end" dy="'+carno_text_fontsize*scale+'">Car No.</text>');
	} else {
		if (forinfo_tick >= 0 || last_stopping && stalist_ja[0] == "東京") {
			tags.push('<text x="'+(width/2-sta_width/2-16)*scale+'" y="'+(64+sta_height-8)*scale
			+'" fill="'+text_color0+'" font-family="'+font_ja+'" font-weight="600" font-size="'+next_text_ja_fontsize*scale
			+'px" text-anchor="end">山手線</text>');

			tags.push('<text id="sta" x="'+width/2*scale+'" y="'+(64+sta_height/2)*scale
			+'" fill="'+sta_color+'" font-family="'+font_ja+'" font-weight="500" font-size="'+sta_ja_fontsize*scale
			+'px" text-anchor="middle" dy="'+sta_ja_fontsize*0.37*scale+'">'+for_ja+'</text>');

			tags.push('<text x="'+(width/2+sta_width/2+16)*scale+'" y="'+(64+sta_height-8)*scale
			+'" fill="'+text_color0+'" font-family="'+font_ja+'" font-weight="600" font-size="'+next_text_ja_fontsize*scale
			+'px">'+(last_loop?"方面行":"行き")+'</text>');
		} else {
			tags.push('<text x="'+8*scale+'" y="'+32*scale
			+'" fill="'+text_color1+'" font-family="'+font_ja+'" font-weight="600" font-size="'+for_ja_fontsize*scale
			+'px" dy="'+for_ja_fontsize*0.37*scale+'">'
			+for_ja+(last_loop?"方面行":"行き")+'</text>');

			if (header_hiragana) {
				tags.push('<text x="'+(width/2-sta_width/2-16)*scale+'" y="'+(64+sta_height-8)*scale
				+'" fill="'+text_color0+'" font-family="'+font_ja+'" font-weight="600" font-size="'+next_text_ja_fontsize*scale
				+'px" text-anchor="end">つぎは</text>');

				tags.push('<text id="sta" x="'+width/2*scale+'" y="'+(64+sta_height/2)*scale
				+'" fill="'+sta_color+'" font-family="'+font_ja+'" font-weight="500" font-size="'+sta_ja_fontsize*scale
				+'px" text-anchor="middle" letter-spacing="-12" dy="'+sta_ja_fontsize*0.37*scale+'">'+stalist_hiragana[0]+'</text>');
			} else {
				tags.push('<text x="'+(width/2-sta_width/2-16)*scale+'" y="'+(64+sta_height-8)*scale
				+'" fill="'+text_color0+'" font-family="'+font_ja+'" font-weight="600" font-size="'+next_text_ja_fontsize*scale
				+'px" text-anchor="end">'+sta0_ja+'</text>');

				tags.push('<text id="sta" x="'+width/2*scale+'" y="'+(64+sta_height/2)*scale
				+'" fill="'+sta_color+'" font-family="'+font_ja+'" font-weight="500" font-size="'+sta_ja_fontsize*scale
				+'px" text-anchor="middle" dy="'+sta_ja_fontsize*0.37*scale+'">'+stalist_ja[0]+'</text>');
			}
			tags.push('<text x="'+(width/2+sta_width/2+16)*scale+'" y="'+(64+sta_height-8)*scale
			+'" fill="'+text_color0+'" font-family="'+font_ja+'" font-weight="600" font-size="'+next_text_ja_fontsize*scale
			+'px">です。</text>');
		}
		tags.push('<text x="'+(width-16)*scale+'" y="'+(16+carno_width)*scale
		+'" fill="'+text_color0+'" font-family="'+font_ja+'" font-weight="600" font-size="'+carno_text_fontsize*scale
		+'px" text-anchor="end" dy="'+carno_text_fontsize*scale+'">号車</text>');
	}

	tags.push('<rect x="0" y="'+header_height*scale
	+'" width="'+width*scale
	+'" height="'+border_width*scale
	+'" fill="'+border_color1+'" />');

	tags.push('<rect x="0" y="'+(header_height+border_width)*scale
	+'" width="'+width*scale
	+'" height="'+(height-header_height-border_width)*scale
	+'" fill="'+bg_color+'" />');

	tags.push('</svg>');
	containerNode.innerHTML = tags;

	var e = document.getElementById('sta');
	if (e) {
		if (header_en) {
			if (e.getBBox().width > sta_text_en_width*scale) {
				e.setAttribute("textLength", sta_text_en_width*scale);
				e.setAttribute("lengthAdjust", "spacingAndGlyphs");
			}
		} else if (header_hiragana) {
			if (e.getBBox().width > sta_text_hiragana_width*scale) {
				e.setAttribute("textLength", sta_text_hiragana_width*scale);
				e.setAttribute("lengthAdjust", "spacingAndGlyphs");
			}
		} else if (e.getBBox().width > sta_text_ja_width*scale) {
			e.setAttribute("textLength", sta_text_ja_width*scale);
			e.setAttribute("lengthAdjust", "spacingAndGlyphs");
		}
	}

	var e = document.getElementById('sta1');
	if (e) {
		if (e.getBBox().width > sta_text_en_width*scale) {
			e.setAttribute("textLength", sta_text_en_width*scale);
			e.setAttribute("lengthAdjust", "spacingAndGlyphs");
		}
	}

	e = document.getElementById('sta0_en');
	if (e && e.getBBox().width > (width/2-sta_width/2-border_width-32)*scale) {
		e.setAttribute("textLength", (width/2-sta_width/2-border_width-32)*scale);
		e.setAttribute("lengthAdjust", "spacingAndGlyphs");
	}
}

function tvm_departure() {
	stopping = false;
	if (stalist_ja[0] != "東京")
		forinfo_tick = 6;

	if (loop) {
		stalist_ja.push(stalist_ja[0]);
		stalist_en.push(stalist_en[0]);
		stalist_hiragana.push(stalist_hiragana[0]);
	}
	stalist_ja.shift();
	stalist_en.shift();
	stalist_hiragana.shift();
	tvm_stalist_0();
}

function tvm_stopping() {
	arriving = false;
	stopping = true;

	if (stalist_ja.length == 1)
		next_phase_button.disabled = true;
}

function tvm_arriving() {
	arriving = true;
}

function tvm_add_station_button(n = -1) {
	if (n == -1) {
		stalist_ja.push("");
		stalist_en.push("");
		stalist_hiragana.push("");
	} else {
		stalist_ja.splice(n, 0, "");
		stalist_en.splice(n, 0, "");
		stalist_hiragana.splice(n, 0, "");
	}

	tvm_stalist_0();
	tvm_draw();
}

function tvm_remove_station_button(n) {
	stalist_ja.splice(n, 1);
	stalist_en.splice(n, 1);
	stalist_hiragana.splice(n, 1);

	if (!stalist_ja.length) {
		stalist_ja.push("");
		stalist_en.push("");
		stalist_hiragana.push("");
	}

	tvm_stalist_0();
	tvm_draw();
}

function tvm_stalist_0() {
	stalist_table.innerHTML = null;
	for (a = 0; a < stalist_ja.length; a++) {
		tr = document.createElement('tr');
		td = document.createElement('td');
		input = document.createElement('input');
		input.type = 'text';
		input.addEventListener('input', function () {tvm_stalist_1();});
		input.value = stalist_ja[a];
		td.appendChild(input);
		tr.appendChild(td);
		td = document.createElement('td');
		input = document.createElement('input');
		input.type = 'text';
		input.addEventListener('input', function () {tvm_stalist_1();});
		input.value = stalist_en[a];
		td.appendChild(input);
		tr.appendChild(td);
		td = document.createElement('td');
		input = document.createElement('input');
		input.type = 'text';
		input.addEventListener('input', function () {tvm_stalist_1();});
		input.value = stalist_hiragana[a];
		td.appendChild(input);
		tr.appendChild(td);
		td = document.createElement('td');
		input = document.createElement('input');
		input.type = 'button';
		input.id = 'remove_sta,'+a;
		input.addEventListener('click', function (event) {tvm_remove_station_button(event.currentTarget.id.split(',')[1]);});
		input.value = "-";
		td.appendChild(input);
		tr.appendChild(td);
		td = document.createElement('td');
		input = document.createElement('input');
		input.type = 'button';
		input.id = 'add_sta,'+a;
		input.addEventListener('click', function (event) {tvm_add_station_button(event.currentTarget.id.split(',')[1]);});
		input.value = "+";
		td.appendChild(input);
		tr.appendChild(td);
		stalist_table.appendChild(tr);
	}
	tr = document.createElement('tr');
	td = document.createElement('td');
	input = document.createElement('input');
	input.type = 'button';
	input.id = 'add_sta';
	input.addEventListener('click', function (event) {tvm_add_station_button();});
	input.value = "+";
	td.appendChild(input);
	tr.appendChild(td);
	stalist_table.appendChild(tr);
}

function tvm_stalist_1() {
	a = stalist_table.childNodes;
	stalist_ja = [a.length];
	stalist_en = [a.length];
	stalist_hiragana = [a.length];
	for (b = 0; b < a.length; b++) {
		stalist_ja[b] = a[b].childNodes[0].childNodes[0].value;
		stalist_en[b] = a[b].childNodes[1].childNodes[0].value;
		stalist_hiragana[b] = a[b].childNodes[2].childNodes[0].value;
	}
	next_phase_button.disabled = stalist_ja.length == 1;

	tvm_draw();
}

function tvm_getLineColor(line) {
	switch (line["owl:sameAs"]) {
		case "odpt.Railway:JR-East.Chuo":
			return ["0", "0", "128"];
			break;
		case "odpt.Railway:Keio.Inokashira":
			return ["0", "0", "136"];
			break;
		case "odpt.Railway:Tobu.Tojo":
		case "odpt.Railway:Tobu.Ogose":
			return ["0", "64", "152"];
			break;
		case "odpt.Railway:TWR.Rinkai":
			return ["0", "65", "142"];
			break;
		case "odpt.Railway:Keisei.Main":
		case "odpt.Railway:Keisei.HigashiNarita":
		case "odpt.Railway:Keisei.Oshiage":
		case "odpt.Railway:Keisei.Kanamachi":
		case "odpt.Railway:Keisei.Chiba":
		case "odpt.Railway:Keisei.Chihara":
			return ["0", "90", "170"];
			break;
		case "odpt.Railway:JR-East.Yokosuka":
		case "odpt.Railway:JR-East.SobuRapid":
		case "odpt.Railway:Tobu.TobuSkytree":
		case "odpt.Railway:Tobu.TobuSkytreeBranch":
		case "odpt.Railway:Tobu.Kameido":
		case "odpt.Railway:Tobu.Daishi":
		case "odpt.Railway:Yurikamome.Yurikamome":
			return ["0", "103", "192"];
			break;
		case "odpt.Railway:Tokyu.Kodomonokuni":
			return ["0", "104", "183"];
			break;
		case "odpt.Railway:JR-East.Kamaishi":
		case "odpt.Railway:JR-East.Aterazawa":
			return ["0", "115", "191"];
			break;
		case "odpt.Railway:Toei.Mita":
			return ["0", "121", "194"];
			break;
		case "odpt.Railway:JR-East.TohokuShinkansen":
		case "odpt.Railway:JR-East.JoetsuShinkansen":
		case "odpt.Railway:JR-East.HokurikuShinkansen":
			return ["0", "128", "0"];
			break;
		case "odpt.Railway:JR-East.Tadami":
			return ["0", "141", "209"];
			break;
		case "odpt.Railway:JR-East.Sagami":
			return ["0", "151", "147"];
			break;
		case "odpt.Railway:TokyoMetro.Chiyoda":
			return ["0", "153", "68"];
			break;
		case "odpt.Railway:Tokyu.Meguro":
			return ["0", "156", "210"];
			break;
		case "odpt.Railway:Seibu.Shinjuku":
		case "odpt.Railway:Seibu.Haijima":
			return ["0", "166", "191"];
			break;
		case "odpt.Railway:TokyoMetro.Tozai":
			return ["0", "167", "219"];
			break;
		case "odpt.Railway:JR-East.Senseki":
		case "odpt.Railway:JR-East.SensekiTohoku":
			return ["0", "170", "238"];
			break;
		case "odpt.Railway:JR-East.Saikyo":
			return ["0", "172", "154"];
			break;
		case "odpt.Railway:TokyoMetro.Namboku":
			return ["0", "173", "169"];
			break;
		case "odpt.Railway:JR-East.Narita":
			return ["0", "178", "97"];
			break;
		case "odpt.Railway:JR-East.Negishi":
		case "odpt.Railway:JR-East.Uchibo":
		case "odpt.Railway:JR-East.KeihinTohoku":
			return ["0", "178", "229"];
			break;
		case "odpt.Railway:JR-East.Joetsu":
			return ["0", "179", "230"];
			break;
		case "odpt.Railway:JR-East.Kururi":
			return ["0", "181", "173"];
			break;
		case "odpt.Railway:Keikyu.Main":
		case "odpt.Railway:Keikyu.Airport":
		case "odpt.Railway:Keikyu.Daishi":
		case "odpt.Railway:Keikyu.Zushi":
		case "odpt.Railway:Keikyu.Kurihama":
		case "odpt.Railway:Tobu.Noda":
		case "odpt.Railway:Tobu.TobuUrbanPark":
			return ["0", "191", "255"];
			break;
		case "odpt.Railway:Seibu.Kokubunji":
		case "odpt.Railway:Seibu.Seibuen":
			return ["0", "204", "102"];
			break;
		case "odpt.Railway:JR-East.Gono":
			return ["12", "122", "173"];
			break;
		case "odpt.Railway:JR-East.Agatsuma":
			return ["15", "84", "116"];
			break;
		case "odpt.Railway:JR-East.Tsugaru":
			return ["21", "162", "196"];
			break;
		case "odpt.Railway:JR-East.Uetsu":
			return ["22", "192", "233"];
			break;
		case "odpt.Railway:Tokyu.DenEnToshi":
			return ["32", "162", "136"];
			break;
		case "odpt.Railway:Odakyu.Odawara":
		case "odpt.Railway:Odakyu.Enoshima":
		case "odpt.Railway:Odakyu.Tama":
			return ["34", "136", "204"];
			break;
		case "odpt.Railway:JR-East.Kawagoe":
			return ["46", "139", "87"];
			break;
		case "odpt.Railway:JR-East.Joban":
		case "odpt.Railway:JR-East.Mito":
			return ["51", "51", "255"];
			break;
		case "odpt.Railway:JR-East.Karasuyama":
			return ["51", "153", "102"];
			break;
		case "odpt.Railway:JR-East.JobanRapid":
			return ["51", "153", "153"];
			break;
		case "odpt.Railway:JR-East.Oga":
			return ["54", "130", "62"];
			break;
		case "odpt.Railway:JR-East.Suigun":
			return ["54", "140", "68"];
			break;
		case "odpt.Railway:JR-East.Kesennuma":
			return ["59", "69", "155"];
			break;
		case "odpt.Railway:JR-East.Tohoku":
			return ["60", "179", "113"];
			break;
		case "odpt.Railway:JR-East.Echigo":
			return ["64", "147", "77"];
			break;
		case "odpt.Railway:JR-East.Koumi":
			return ["65", "147", "76"];
			break;
		case "odpt.Railway:Toei.Shinjuku":
			return ["108", "187", "90"];
			break;
		case "odpt.Railway:JR-East.RikuWest":
			return ["111", "191", "127"];
			break;
		case "odpt.Railway:JR-East.Senzan":
			return ["114", "188", "74"];
			break;
		case "odpt.Railway:JR-East.Iiyama":
			return ["123", "194", "75"];
			break;
		case "odpt.Railway:JR-East.JobanLocal":
			return ["128", "128", "128"];
			break;
		case "odpt.Railway:JR-East.Kitakami":
			return ["133", "26", "114"];
			break;
		case "odpt.Railway:JR-East.Nikko":
			return ["136", "0", "34"];
			break;
		case "odpt.Railway:JR-East.Yahiko":
			return ["146", "39", "144"];
			break;
		case "odpt.Railway:JR-East.Oito":
			return ["147", "112", "219"];
			break;
		case "odpt.Railway:JR-East.RikuEast":
		case "odpt.Railway:JR-East.Iwaizumi":
			return ["153", "153", "153"];
			break;
		case "odpt.Railway:JR-East.Yamanote":
		case "odpt.Railway:JR-East.Yokohama":
		case "odpt.Railway:JR-East.Shinetsu":
			return ["154", "205", "50"];
			break;
		case "odpt.Railway:TokyoMetro.Hanzomon":
			return ["155", "124", "182"];
			break;
		case "odpt.Railway:TokyoMetro.Hibiya":
			return ["156", "174", "183"];
			break;
		case "odpt.Railway:JR-East.Tazawako":
			return ["157", "114", "176"];
			break;
		case "odpt.Railway:JR-East.Yonesaka":
			return ["158", "126", "185"];
			break;
		case "odpt.Railway:JR-East.Hanawa":
			return ["170", "30", "48"];
			break;
		case "odpt.Railway:Tokyu.Tamagawa":
			return ["174", "3", "120"];
			break;
		case "odpt.Railway:Toei.Oedo":
			return ["182", "0", "122"];
			break;
		case "odpt.Railway:TokyoMetro.Fukutoshin":
			return ["187", "100", "29"];
			break;
		case "odpt.Railway:JR-East.Kashima":
			return ["197", "110", "46"];
			break;
		case "odpt.Railway:JR-East.BanetsuEast":
			return ["199", "21", "133"];
			break;
		case "odpt.Railway:JR-East.Keiyo":
			return ["201", "36", "47"];
			break;
		case "odpt.Railway:JR-East.BanetsuWest":
			return ["203", "123", "53"];
			break;
		case "odpt.Railway:Toei.NipporiToneri":
			return ["204", "204", "204"];
			break;
		case "odpt.Railway:JR-East.Yamada":
			return ["205", "122", "30"];
			break;
		case "odpt.Railway:JR-East.Shinonoi":
			return ["213", "106", "41"];
			break;
		case "odpt.Railway:TokyoMetro.Yurakucho":
			return ["215", "196", "71"];
			break;
		case "odpt.Railway:Tokyu.Toyoko":
			return ["218", "4", "66"];
			break;
		case "odpt.Railway:JR-East.Sotobo":
			return ["219", "64", "40"];
			break;
		case "odpt.Railway:Toei.Asakusa":
			return ["220", "67", "95"];
			break;
		case "odpt.Railway:Keio.Keio":
		case "odpt.Railway:Keio.KeioNew":
		case "odpt.Railway:Keio.Sagamihara":
		case "odpt.Railway:Keio.Keibajo":
		case "odpt.Railway:Keio.Dobutsuen":
		case "odpt.Railway:Keio.Takao":
			return ["221", "0", "119"];
			break;
		case "odpt.Railway:TokyoMetro.Marunouchi":
		case "odpt.Railway:TokyoMetro.MarunouchiBranch":
			return ["230", "0", "18"];
			break;
		case "odpt.Railway:JR-East.Hachinohe":
			return ["233", "57", "32"];
			break;
		case "odpt.Railway:JR-East.AkitaShinkansen":
			return ["237", "67", "153"];
			break;
		case "odpt.Railway:JR-East.Ishinomaki":
			return ["237", "119", "164"];
			break;
		case "odpt.Railway:JR-East.YamagataShinkansen":
		case "odpt.Railway:JR-East.Ou":
		case "odpt.Railway:JR-East.OuYamagata":
			return ["238", "123", "40"];
			break;
		case "odpt.Railway:Tokyu.Ikegami":
		case "odpt.Railway:Toei.Arakawa":
			return ["238", "134", "167"];
			break;
		case "odpt.Railway:Seibu.Ikebukuro":
		case "odpt.Railway:Seibu.SeibuChichibu":
		case "odpt.Railway:Seibu.SeibuYurakucho":
		case "odpt.Railway:Seibu.Toshima":
		case "odpt.Railway:Seibu.Sayama":
		case "odpt.Railway:Seibu.Tamagawa":
			return ["239", "129", "15"];
			break;
		case "odpt.Railway:JR-East.Musashino":
		case "odpt.Railway:JR-East.ChuoRapid":
		case "odpt.Railway:JR-East.Ome":
		case "odpt.Railway:JR-East.Itsukaichi":
		case "odpt.Railway:JR-East.Hachiko":
		case "odpt.Railway:JR-East.Togane":
			return ["241", "90", "34"];
			break;
		case "odpt.Railway:Tokyu.Oimachi":
			return ["241", "140", "67"];
			break;
		case "odpt.Railway:JR-East.Ofunato":
			return ["241", "142", "68"];
			break;
		case "odpt.Railway:JR-East.Ominato":
			return ["241", "170", "40"];
			break;
		case "odpt.Railway:JR-East.Hakushin":
			return ["243", "135", "183"];
			break;
		case "odpt.Railway:TokyoMetro.Ginza":
			return ["243", "151", "0"];
			break;
		case "odpt.Railway:JR-East.Tokaido":
		case "odpt.Railway:JR-East.UenoTokyo":
		case "odpt.Railway:JR-East.ShonanShinjuku":
		case "odpt.Railway:JR-East.Takasaki":
		case "odpt.Railway:JR-East.Ito":
		case "odpt.Railway:JR-East.Utsunomiya":
			return ["246", "139", "30"];
			break;
		case "odpt.Railway:Tokyu.Setagaya":
			return ["252", "199", "13"];
			break;
		case "odpt.Railway:Seibu.Tamako":
			return ["253", "188", "0"];
			break;
		case "odpt.Railway:Tobu.Isesaki":
		case "odpt.Railway:Tobu.Sano":
		case "odpt.Railway:Tobu.Kiryu":
		case "odpt.Railway:Tobu.Koizumi":
		case "odpt.Railway:Tobu.KoizumiBranch":
			return ["255", "0", "0"];
			break;
		case "odpt.Railway:Seibu.Yamaguchi":
			return ["255", "51", "51"];
			break;
		case "odpt.Railway:Keisei.NaritaSkyAccess":
			return ["255", "134", "32"];
			break;
		case "odpt.Railway:Tobu.Nikko":
		case "odpt.Railway:Tobu.Utsunomiya":
		case "odpt.Railway:Tobu.Kinugawa":
			return ["255", "165", "0"];
			break;
		case "odpt.Railway:JR-East.Sobu":
			return ["255", "194", "13"];
			break;
		case "odpt.Railway:JR-East.Nambu":
		case "odpt.Railway:JR-East.ChuoSobuLocal":
		case "odpt.Railway:JR-East.Tsurumi":
		case "odpt.Railway:JR-East.Ryomo":
			return ["255", "212", "0"];
			break;
		case "odpt.Railway:MIR.":
			return ["191", "191", "191"];
			break;
		default:
			console.log(line["owl:sameAs"]);
			break;
	}
	return ["191", "191", "191"];
}