var element_loading = document.querySelector('#loading');
var loadings = 0;

var containerNode;

var scale = 1/2;
var width = 0;
var height = 0;

//Mitsubishi
var header_color = "rgb(207,207,207)";
var header_height = 236;
var for_fontsize = 38;
var carno_width = 80;
var carno_radius = 16;
var carno_fontsize = 64;
var carno_text_fontsize = 28;
var next_text_fontsize = 48;
var border_color0 = "rgb(128,128,128)";
var border_color1 = "rgb(96,96,96)";
var border_width = 4;
var nextsta_color = "rgb(154,205,50)";
var nextsta_width = 498;
var nextsta_height = 160;
var nextsta_fontsize = 156;
var bg_color = "rgb(239,239,239)";

var header_tick = 0;
var header_en = false;
var timeout_id;

var carno = 10;
var for_ja_input;
var for_ja = "上野・東京";
var direction_checkbox;
var direction = true;
var last_direction = true;
var next_phase_button;
var phase = 0;
var next_phase_button_labels = ["発車する", "減速する", "停車する"];
var next_phase_button_label = next_phase_button_labels[phase];
var sta0_ja_labels = ["ただいま", "次は", "まもなく"]
var sta0_ja = sta0_ja_labels[phase];
var sta_ja_input;
var sta_ja = "鶯谷";

window.addEventListener('DOMContentLoaded', function () {tvm_init();});

function tvm_init() {
	if (containerNode == null) {
		containerNode = document.querySelector('#trainvision');
		for_ja_input = document.getElementById('for-ja-input');
		for_ja_input.addEventListener('input', function (event) {for_ja = for_ja_input.value;tvm_draw();});
		for_ja_input.value = for_ja;
		direction_checkbox = document.getElementById('direction-checkbox');
		direction_checkbox.addEventListener('change', function () {direction = direction_checkbox.checked;});
		direction_checkbox.checked = direction;
		sta_ja_input = document.getElementById('nextsta-ja-input');
		sta_ja_input.addEventListener('input', function (event) {sta_ja = sta_ja_input.value;tvm_draw();});
		sta_ja_input.value = sta_ja;
		next_phase_button = document.getElementById('next-phase-button');
		next_phase_button.addEventListener('click', function (event) {
			phase++;
			if (phase == 3)
				phase = 0;
			next_phase_button.value = next_phase_button_label = next_phase_button_labels[phase];
		});
		next_phase_button.value = next_phase_button_label;
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
	if (header_tick == 3) {
		header_tick = 0;
		if (sta0_ja != sta0_ja_labels[phase])
			header_en = false;
		else
			header_en = !header_en;
		sta0_ja = sta0_ja_labels[phase];
		last_direction = direction;
	}
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
	
	/*tags.push('<rect x="0" y="0" width="'+width*scale
	+'" height="'+64*scale
	+'" fill="blue" />');*/

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

	tags.push('<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="'+border_color1
	+'" /><stop offset="100%" stop-color="'+header_color
	+'" /></linearGradient>');

	tags.push('<rect x="'+(width/2-nextsta_width/2-border_width)*scale
	+'" y="'+(64-border_width)*scale
	+'" width="'+(nextsta_width+border_width*2)*scale
	+'" height="'+(nextsta_height+border_width*2)*scale
	+'" fill="url(#grad1)" />');
	tags.push('<rect x="'+(width/2-nextsta_width/2)*scale
	+'" y="'+64*scale+'" width="'+nextsta_width*scale
	+'" height="'+nextsta_height*scale
	+'" fill="rgb(255,255,255)" />');

	if (header_en) {
		//TODO 英語表示
	} else {
		tags.push('<text x="'+8*scale+'" y="'+32*scale
		+'" fill="rgb(80,80,80)" font-family="Noto Sans Japanese" font-weight="500" font-size="'+for_fontsize*scale
		+'px" dy="'+for_fontsize*0.37*scale+'">'
		+for_ja+(last_direction?"行":"行き")+'</text>');

		tags.push('<text x="'+(width-16)*scale+'" y="'+(16+carno_width)*scale
		+'" fill="rgb(48,48,48)" font-family="Noto Sans Japanese" font-weight="500" font-size="'+carno_text_fontsize*scale
		+'px" text-anchor="end" dy="'+carno_text_fontsize*scale+'">号車</text>');

		tags.push('<text x="'+(width/2-nextsta_width/2-16)*scale+'" y="'+(64+nextsta_height-8)*scale
		+'" fill="rgb(48,48,48)" font-family="Noto Sans Japanese" font-weight="500" font-size="'+next_text_fontsize*scale
		+'px" text-anchor="end">'+sta0_ja+'</text>');

		tags.push('<text x="'+width/2*scale+'" y="'+(64+nextsta_height/2)*scale
		+'" fill="'+nextsta_color+'" font-family="Noto Sans Japanese" font-weight="500" font-size="'+nextsta_fontsize*scale
		+'px" text-anchor="middle" dy="'+nextsta_fontsize*0.37*scale+'">'+sta_ja+'</text>');

		tags.push('<text x="'+(width/2+nextsta_width/2+16)*scale+'" y="'+(64+nextsta_height-8)*scale
		+'" fill="rgb(48,48,48)" font-family="Noto Sans Japanese" font-weight="500" font-size="'+next_text_fontsize*scale
		+'px">です。</text>');
	}

	tags.push('<rect x="0" y="'+header_height*scale
	+'" width="'+width*scale
	+'" height="'+border_width*scale
	+'" fill="'+border_color0+'" />');

	tags.push('<rect x="0" y="'+(header_height+border_width)*scale
	+'" width="'+width*scale
	+'" height="'+(height-header_height+border_width)*scale
	+'" fill="'+bg_color+'" />');

	tags.push('</svg>');
	containerNode.innerHTML = tags;
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