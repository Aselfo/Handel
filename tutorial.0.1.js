function Tutorial_Script(){
	
	this.tutorial_target = [];
	this.actual_step = 0;
	this.actual_substep = 0; 
	this.steps = [];
	
	this.continue_button = popup_message.panel.sub_parts[2];
	
	
	mouse_down_listener = function(event){
		move_view = true;
		if(!tutorial_mode ||(tutorial_mode && tutorial_script.check_mouse_down(focus_object))){
			focus_object.mouse_down();
		}
	}
		
	mouse_up_listener = function(event){
		move_view = false;
		if(view_moved){
			view_moved = false;
		}
		else{
			if(selected_object != default_focus && focus_object != selected_object){
				selected_object.unselect();
			}
			if(!tutorial_mode ||(tutorial_mode && tutorial_script.check_mouse_over(focus_object))){
				focus_object.mouse_up();
				if(tutorial_mode){
					tutorial_script.post_click();
				}
			}
		}
	}
	
	this.step_0 = function(){
		this.tutorial_target[0] = this.continue_button;
		show_message("Dies ist das Tutorial zu Handel");
		show_message("Wir werden hir ein kleines Geschäft starten um alles Wichtige zu erklären. Anschließend wird alles wieder auf Anfang gesetzt damit sie ihr ganz eigenes Geschäft gründen können.");
	}
	this.step_1 = function(){
		for(i in windows[0].game_content){
			windows[0].game_content[i].tutorial_highlight = true;
			windows[0].game_content[i].draw_element();
		}
		
		show_message("Dies ist der Grundriss deines Geschäftsgebäudes. Hier wird dein gesammtes Tagesgeschäfft statfinden.");
	}
	this.step_2 = function(){
		var tiles = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,36,37,38,39,40,41];
		for(i in tiles){
			windows[0].game_content[tiles[i]].tutorial_highlight = false;
			windows[0].game_content[tiles[i]].draw_element();
		}
		show_message("Die 5X4 große Fläche in der Mitte ist der dir zur verfügung stehende Platz. Da die Außenwand nicht abgerissen werden kann zählt sie nicht zum Bauplatz dazu.");
		show_message("Diese Fläche wirst du später vergrößern können was alerdings eine etwas größere investition erfordern wird. (noch nicht im Spiel)");
		this.actual_substep = 0;
	}
	this.step_3 = function(){
		for(i in windows[0].game_content){
			windows[0].game_content[i].tutorial_highlight = false;
			windows[0].game_content[i].draw_element();
		}
		show_message("Wir beginnen damit die Fläche in Räume einzuteilen.");
	}
	this.step_4 = function(){
		show_message("Drücke auf Bauen", false);
		this.tutorial_target[1] = windows[0].ui_content[1];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
	}
	this.step_5 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].ui_content[2];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Nun auf Baue Wand", false);
		popup_message.next_message();
	}
	this.step_6 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		var tiles = [10,17,22,23,24,25,26];
		for(var i = 0; i < tiles.length; i++){
			windows[0].game_content[tiles[i]].tutorial_highlight = true;
			windows[0].game_content[tiles[i]].draw_element();
			var j = i + 1;
			this.tutorial_target[j] = windows[0].game_content[tiles[i]];
		}
		show_message("klick nun auf die markierten Felder.", false);
		popup_message.next_message();
		this.actual_substep = 0;
	}
	this.step_7 = function(){
		show_message("Als nächstes benötigt jeder Raum eine Tür die ihn mit einem Ausgang des Gebäudes verbindet.");
		popup_message.next_message();
	}
	this.step_8 = function(){
		var tiles = [23,25,38];
		for(var i = 0; i < tiles.length; i++){
			windows[0].game_content[tiles[i]].tutorial_highlight = true;
			windows[0].game_content[tiles[i]].draw_element();
			var j = i + 1;
			this.tutorial_target[j] = windows[0].game_content[tiles[i]];
		}
		this.actual_substep = 0;
		show_message("Um Türen zu bauen klicke auf die markierten Wände.",false)
	}
	this.step_9 = function(){
		show_message("Nun da wir den Grundriss unseres Geschäfts haben können wir den Räumen eine aufgabe zuweisen.");
		popup_message.next_message();
		show_message("Zuerst werden wir ein Lager Einrichten, da kein Geschäft ohne Lager arbeiten kann.");
		this.actual_substep = 0;
	}
	this.step_10 = function(){
		this.tutorial_target[1] = windows[0].ui_content[3];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Klicke nun zuerst auf Baue Raum", false);
	}
	this.step_11 = function(){
		
	}
	this.post_step_11 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].construct_menue.panel.sub_parts[0].sub_parts[0];
		this.tutorial_target[2] = windows[0].construct_menue.panel.sub_parts[0].up_button;
		this.tutorial_target[3] = windows[0].construct_menue.panel.sub_parts[0].down_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Wähle nun das Lager als zu bauenden Raum aus.", false);
		popup_message.next_message();
	}
	this.step_12 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		var tiles = [8,9,15,16];
		for(var i = 0; i < tiles.length; i++){
			windows[0].game_content[tiles[i]].tutorial_highlight = true;
			windows[0].game_content[tiles[i]].draw_element();
			var j = i + 1;
			this.tutorial_target[j] = windows[0].game_content[tiles[i]];
		}
		show_message("Baue das Lager nun in den markirten Raum", false);
		popup_message.next_message();
	}
	this.step_13 = function(){
		var tiles = [8,9,15,16];
		for(var i = 0; i < tiles.length; i++){
			windows[0].game_content[tiles[i]].tutorial_highlight = false;
			windows[0].game_content[tiles[i]].draw_element();
			var j = i + 1;
			this.tutorial_target[j] = windows[0].game_content[tiles[i]];
		}
		this.actual_substep = 0;
		show_message("In dieses Lager werden wir später Lagerplatz für den Betrieb einbauen.");
		popup_message.next_message();
		show_message("Nun brauchen wir eine Werkstatt. Für dieses Tutorial werden wir ein Alchemielabor bauen.");
		show_message("Wenn du nach diesem Tutorial dein eigenes Geschäft gründest solltest du dir vorher die Beschreibungen der verschiedenen Handwerkszweige druchlesen bevor du dich für einen Geschäftsmodel entscheidest.");
	}
	this.step_14 = function(){
		this.tutorial_target[1] = windows[0].ui_content[3];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Klicke wieder auf Baue Raum", false);
	}
	this.step_15 = function(){
		
	}
	this.post_step_15 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].construct_menue.panel.sub_parts[0].sub_parts[2];
		this.tutorial_target[2] = windows[0].construct_menue.panel.sub_parts[0].up_button;
		this.tutorial_target[3] = windows[0].construct_menue.panel.sub_parts[0].down_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Wähle nun das Alchemielabor aus.", false);
		popup_message.next_message();
	}
	this.step_16 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		var tiles = [11,12,18,19];
		for(var i = 0; i < tiles.length; i++){
			windows[0].game_content[tiles[i]].tutorial_highlight = true;
			windows[0].game_content[tiles[i]].draw_element();
			var j = i + 1;
			this.tutorial_target[j] = windows[0].game_content[tiles[i]];
		}
		show_message("Baue die Werkstatt nun in den markirten Raum", false);
		popup_message.next_message();
	}
	this.step_17 = function(){
		var tiles = [11,12,18,19];
		for(var i = 0; i < tiles.length; i++){
			windows[0].game_content[tiles[i]].tutorial_highlight = false;
			windows[0].game_content[tiles[i]].draw_element();
			var j = i + 1;
			this.tutorial_target[j] = windows[0].game_content[tiles[i]];
		}
		this.actual_substep = 0;
		show_message("In dieser Werkstatt werden wir später die Gerätschaften aufstellen damit Arbeiter alles von Tränken über Zauber bis hin zu Schießpulver herstellen können.");
		popup_message.next_message();
		show_message("Zuletzt bauen wir noch einen Laden in dem du deine Waren an Kunden verkaufen kannst.");
		show_message("Dies dient nur zur demonstration. Du kannst in deinem eigenen Unternehmen auch nur Werkstätten haben und deine Waren am Markt verkaufst oder nur Läden haben und alle Waren die du dort anbietest ." +
		"über den Markt einkaufen.");
	}
	this.step_18 = function(){
		this.tutorial_target[1] = windows[0].ui_content[3];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Klicke ein letztes mal auf Baue Raum", false);
	}
	this.step_19 = function(){
		
	}
	this.post_step_19 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].construct_menue.panel.sub_parts[0].sub_parts[3];
		this.tutorial_target[2] = windows[0].construct_menue.panel.sub_parts[0].up_button;
		this.tutorial_target[3] = windows[0].construct_menue.panel.sub_parts[0].down_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Wähle nun den Verkaufsladen aus.", false);
		popup_message.next_message();
	}
	this.step_20 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		var tiles = [29,30,31,32,33];
		for(var i = 0; i < tiles.length; i++){
			windows[0].game_content[tiles[i]].tutorial_highlight = true;
			windows[0].game_content[tiles[i]].draw_element();
			var j = i + 1;
			this.tutorial_target[j] = windows[0].game_content[tiles[i]];
		}
		show_message("Baue den nun in den markirten Raum", false);
		popup_message.next_message();
	}
	this.step_21 = function(){
		var tiles = [29,30,31,32,33];
		for(var i = 0; i < tiles.length; i++){
			windows[0].game_content[tiles[i]].tutorial_highlight = false;
			windows[0].game_content[tiles[i]].draw_element();
			var j = i + 1;
			this.tutorial_target[j] = windows[0].game_content[tiles[i]];
		}
		this.actual_substep = 0;
		show_message("An jedem Laden gehen in regelmäßigen Abständen Kunden vorbei und jedes mal wenn sie das tuen hast du eine chance dass sie den Laden betreten und etwas kaufen.");
		popup_message.next_message();
		show_message("Beim bau eines Ladens muss eine weitere sonderregel beachtet werden.");
	}
	this.step_22 = function(){
		windows[0].game_content[38].tutorial_highlight = true;
		windows[0].game_content[38].draw_element();
		show_message("Wärend Werkstätten lediglich einen Weg zu einem Gebäudeausgang haben müssen, muss ein Laden immer direckt an einem Ausgang liegen.");
	}
	this.step_23 = function(){
		windows[0].game_content[38].tutorial_highlight = false;
		windows[0].game_content[38].draw_element();
		this.actual_substep = 0;
		show_message("Damit hätten wir die Räume definiert und müssen als letztes jetzt die Einrichtung einbauen.");
		show_message("Da wir auf jeden Fall, Waren lagern müssen beginnen wir mit dem Lager.");
	}
	this.step_24 = function(){
		this.tutorial_target[1] = windows[0].ui_content[4];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Klicke auf Baue Einrichtung", false);
	}
	this.step_25 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].game_content[8]
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Klicke jetzt auf das markierte Feld im Lager.",false);
		popup_message.next_message();
	}
	this.step_26 = function(){
		
	}
	this.post_step_26 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].construct_menue.panel.sub_parts[0].sub_parts[0];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Und nun wähle das Regal.",false);
		popup_message.next_message();
	}
	this.step_27 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		show_message("Nun haben wir ein Regal dass uns 5 Einheiten von 4 verschiedenen Waren Lagern lässt.");
		popup_message.next_message();
		
	}
	this.step_28 = function(){
		this.tutorial_target[1] = head_bar.location_menue.storage_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Um die Lagervorräte zu sehen musst du in das Lager wechseln. Hierfür klicke im Menü auf Lager", false);
	}
	this.step_29 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.actual_substep = 0;
		show_message("Hier siehst du alle Lagerflächen die dir zu verfügung stehen und ihre Größe.");
		popup_message.next_message();
		show_message("Sobald du Waren hast wird dir hier neben der vorhandenen Menge pro Stapel auch die Beschreibung und der momentane Kauf- und Verkaufswert auf dem Markt angezeigt.");
	}
	this.step_30 = function(){
		this.tutorial_target[1] = head_bar.location_menue.shop_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Wechsle im Menü wieder auf dein Geschäft zurück.", false);	
	}
	this.step_31 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		show_message("Als nächstes brauchen wir einen Arbeitsplatz in unserer Werkstatt um Waren zu produzieren.");
		popup_message.next_message();
	}
	this.step_32 = function(){
		this.tutorial_target[1] = windows[0].ui_content[1];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Baue einen Alchemietisch in das Labor", false);
	}
	this.step_33 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].ui_content[4];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
	}
	this.step_34 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].game_content[11]
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
	}
	this.step_35 = function(){
		
	}
	this.post_step_35 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].construct_menue.panel.sub_parts[0].sub_parts[0];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
	}
	this.step_36 = function(){
		this.actual_substep = 0;
		show_message("Damit wären wir jetzt in der Lage mit der Produktion anzufangen.");
		popup_message.next_message();
		show_message("zum Schluss brauchen wir jetzt noch einen Ausstelltisch in unserem Laden um die Waren anzubieten");
	}
	this.step_37 = function(){
		this.tutorial_target[1] = windows[0].game_content[29]
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Baue einen Ausstelltisch in den Laden", false);
	}
	this.step_38 = function(){
		
	}
	this.post_step_38 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].construct_menue.panel.sub_parts[0].sub_parts[0];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
	}
	this.step_39 = function(){
		this.actual_substep = 0;
		show_message("Auf diesem Aussteller werden wir später unser Produkte anbieten.");
		popup_message.next_message();
		show_message("Nun da unser Geschäft eingerichtet ist können wir uns unserer Produktion zuwenden.");
		show_message("Als erstes müssen Rohstoffe eingekauft werden. Daher werden wir als nächstes den Markt erklären.");
	}
	this.step_40 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1] = head_bar.location_menue.market_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Wechsle im Menü zum Markt.",false);
	}
	this.step_41 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.actual_substep = 0;
		show_message("Dies ist der Markt. Hier können alle Waren zu festen Preisen ge- und verkauft werden. (Später werden sie sich an Angebot und Nachfrage der Spieler anpassen)");
		popup_message.next_message();
		show_message("Wir werden nun Waren kaufen und den Verkauf später erklären");
		show_message("Zur Produktion von Heiltränken benötigen wir Heilkräuter");
	}
	this.step_42 = function(){
		this.tutorial_target[1] = windows[2].buy_screen.panel.sub_parts[2].sub_parts[3];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Kaufen sie 12 Heilkräuter. Diese sind in der Kategori \"Alchemierzutaten\"", false);
	}
	this.step_43 = function(){
		
	}
	this.post_step_43 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[2].buy_screen.panel.sub_parts[3].sub_parts[0];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
	}
	this.step_44 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = this.tutorial_target[1].up_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		this.actual_substep = 0;
	}
	this.step_45 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[2].buy_screen.panel.sub_parts[1];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
	}
	this.step_46 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = head_bar.location_menue.shop_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Nun haben wir alle Rohstoffe und können nun zurück zum Geschäft wechseln um unsere erste Produktion einrichten",false);
		popup_message.next_message();
	}
	this.step_47 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].ui_content[6];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Um nun mit der Produktion zu beginnen müssen wir als erstes einen Arbeiter einstellen.",false);
		popup_message.next_message();
	}
	this.step_48 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		show_message("Nun haben wir einen Arbeiter und können diesem auftragen etwas an einem Arbeitsplatz herzustellen.");
		popup_message.next_message();
	}
	this.step_49 = function(){
		this.tutorial_target[1] = windows[0].game_content[11];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Hierfür wählen wir zuerst den Arbeitsplatz.",false);
	}
	this.step_50 = function(){
		
	}
	this.post_step_50 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].crafting_menue.panel.sub_parts[0].sub_parts[0];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Nun geben wir 6 Heiltränke in Auftrag.",false);
		popup_message.next_message();
	}
	this.step_51 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].crafting_menue.panel.sub_parts[0].sub_parts[0].up_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		this.actual_substep = 0;
	}
	this.step_52 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[0].crafting_menue.panel.sub_parts[1];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
	}
	this.step_53 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.timer(60);
		show_message("Wir machen weiter wenn die Tränke fertig sind.",false);
		popup_message.next_message();
	}
	this.step_54 = function(){
		show_message("Nun haben wir 6 Heiltränke die wir verkaufen können.");
		popup_message.next_message();
		show_message("Um beide Varianten des Verkaufs vorzustellen werden wir 3 Tränke am Markt und 3 in unserem Laden verkaufen.");
		this.actual_substep = 0;
	}
	this.step_55 = function(){
		this.tutorial_target[1] = head_bar.location_menue.market_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Zuerst werden wir die Tränke auf dem Markt verkaufen.",false);
	}
	this.step_56 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[2].ui_parts[1];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Hierführ wechseln wir in das Verkaufsmenü.",false);
		popup_message.next_message();
	}
	this.step_57 = function(){
	}
	this.post_step_57 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[2].sell_screen.panel.sub_parts[2].sub_parts[3];
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
		show_message("Nun wählen wir einen der Lagerplätze mit heiltränken und verkaufen 3 Stück.",false);
		popup_message.next_message();
	}
	this.step_58 = function(){
		this.tutorial_target[1].tutorial_highlight = false;
		this.tutorial_target[1].draw_element();
		this.tutorial_target[1] = windows[2].sell_screen.panel.sub_parts[2].sub_parts[3].up_button;
		this.tutorial_target[1].tutorial_highlight = true;
		this.tutorial_target[1].draw_element();
	}
	this.step_59 = function(){
		
	}
	this.step_60 = function(){
		
	}
	
	this.next_step = function(){
		switch(this.actual_step){	
			case 0: this.step_0();
					break;
			case 1:	this.step_1();
					break;
			case 2:	this.step_2();
					break;
			case 3:	this.step_3();
					break;
			case 4:	this.step_4();
					break;
			case 5:	this.step_5();
					break;
			case 6:	this.step_6();
					break;
			case 7:	this.step_7();
					break;
			case 8:	this.step_8();
					break;
			case 9:	this.step_9();
					break;
			case 10:this.step_10();
					break;
			case 11:this.step_11();
					break;
			case 12:this.step_12();
					break;
			case 13:this.step_13();
					break;
			case 14:this.step_14();
					break;
			case 15:this.step_15();
					break;
			case 16:this.step_16();
					break;
			case 17:this.step_17();
					break;
			case 18:this.step_18();
					break;
			case 19:this.step_19();
					break;
			case 20:this.step_20();
					break;
			case 21:this.step_21();
					break;
			case 22:this.step_22();
					break;
			case 23:this.step_23();
					break;
			case 24:this.step_24();
					break;
			case 25:this.step_25();
					break;
			case 26:this.step_26();
					break;
			case 27:this.step_27();
					break;
			case 28:this.step_28();
					break;
			case 29:this.step_29();
					break;
			case 30:this.step_30();
					break;
			case 31:this.step_31();
					break;
			case 32:this.step_32();
					break;
			case 33:this.step_33();
					break;
			case 34:this.step_34();
					break;
			case 35:this.step_35();
					break;
			case 36:this.step_36();
					break;
			case 37:this.step_37();
					break;
			case 38:this.step_38();
					break;
			case 39:this.step_39();
					break;
			case 40:this.step_40();
					break;
			case 41:this.step_41();
					break;
			case 42:this.step_42();
					break;
			case 43:this.step_43();
					break;
			case 44:this.step_44();
					break;
			case 45:this.step_45();
					break;
			case 46:this.step_46();
					break;
			case 47:this.step_47();
					break;
			case 48:this.step_48();
					break;
			case 49:this.step_49();
					break;
			case 50:this.step_50();
					break;
			case 51:this.step_51();
					break;
			case 52:this.step_52();
					break;
			case 53:this.step_53();
					break;
			case 54:this.step_54();
					break;
			case 55:this.step_55();
					break;
			case 56:this.step_56();
					break;
			case 57:this.step_57();
					break;
			case 58:this.step_58();
					break;
			case 59:this.step_59();
					break;
			case 60:this.step_60();
					break;
		}
	}
	
	this.button_click = function(source){
		this.actual_substep++;
		switch(this.actual_step){	
			case 0: if(this.actual_substep > 1){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 1:	this.actual_step++;
					this.next_step();
					break;
			case 2:	if(this.actual_substep > 1){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 3:	this.actual_step++;
					this.next_step();
					break;
			case 4:	this.actual_step++;
					this.next_step();
					break;
			case 5:	this.actual_step++;
					this.next_step();
					break;
			case 6:	if(this.actual_substep > 6){
						source.tutorial_highlight = false;
						source.draw_element();
						this.tutorial_target = this.tutorial_target.slice(0,this.tutorial_target.indexOf(source)).concat(this.tutorial_target.slice((this.tutorial_target.indexOf(source) + 1),this.tutorial_target.length));
						this.actual_step++;
						this.next_step();
					}
					else{
						source.tutorial_highlight = false;
						source.draw_element();
						this.tutorial_target = this.tutorial_target.slice(0,this.tutorial_target.indexOf(source)).concat(this.tutorial_target.slice((this.tutorial_target.indexOf(source) + 1),this.tutorial_target.length));
					}
					break;
			case 7:	this.actual_step++;
					this.next_step();
					break;
			case 8:	if(this.actual_substep > 2){
						source.tutorial_highlight = false;
						source.draw_element();
						this.tutorial_target = this.tutorial_target.slice(0,this.tutorial_target.indexOf(source)).concat(this.tutorial_target.slice((this.tutorial_target.indexOf(source) + 1),this.tutorial_target.length));
						this.actual_step++;
						this.next_step();
					}
					else{
						source.tutorial_highlight = false;
						source.draw_element();
						this.tutorial_target = this.tutorial_target.slice(0,this.tutorial_target.indexOf(source)).concat(this.tutorial_target.slice((this.tutorial_target.indexOf(source) + 1),this.tutorial_target.length));
					}
					break;
			case 9:	if(this.actual_substep > 1){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 10:this.actual_step++;
					this.next_step();
					break;
			case 11:this.actual_step++;
					this.next_step();
					break;
			case 12:this.actual_step++;
					this.next_step();
					break;
			case 13:if(this.actual_substep > 2){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 14:this.actual_step++;
					this.next_step();
					break;
			case 15:this.actual_step++;
					this.next_step();
					break;
			case 16:this.actual_step++;
					this.next_step();
					break;
			case 17:if(this.actual_substep > 2){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 18:this.actual_step++;
					this.next_step();
					break;
			case 19:this.actual_step++;
					this.next_step();
					break;
			case 20:this.actual_step++;
					this.next_step();
					break;
			case 21:if(this.actual_substep > 1){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 22:this.actual_step++;
					this.next_step();
					break;
			case 23:if(this.actual_substep > 1){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 24:this.actual_step++;
					this.next_step();
					break;
			case 25:this.actual_step++;
					this.next_step();
					break;
			case 26:this.actual_step++;
					this.next_step();
					break;
			case 27:this.actual_step++;
					this.next_step();
					break;
			case 28:this.actual_step++;
					this.next_step();
					break;
			case 29:if(this.actual_substep > 1){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 30:this.actual_step++;
					this.next_step();
					break;
			case 31:this.actual_step++;
					this.next_step();
					break;
			case 32:this.actual_step++;
					this.next_step();
					break;
			case 33:this.actual_step++;
					this.next_step();
					break;
			case 34:this.actual_step++;
					this.next_step();
					break;
			case 35:this.actual_step++;
					this.next_step();
					break;
			case 36:if(this.actual_substep > 1){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 37:this.actual_step++;
					this.next_step();
					break;
			case 38:this.actual_step++;
					this.next_step();
					break;
			case 39:if(this.actual_substep > 2){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 40:this.actual_step++;
					this.next_step();
					break;
			case 41:if(this.actual_substep > 2){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 42:this.actual_step++;
					this.next_step();
					break;
			case 43:this.actual_step++;
					this.next_step();
					break;
			case 44:if(parseInt(this.tutorial_target[1].quantity.content) == 12){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 45:this.actual_step++;
					this.next_step();
					break;
			case 46:this.actual_step++;
					this.next_step();
					break;
			case 47:this.actual_step++;
					this.next_step();
					break;
			case 48:this.actual_step++;
					this.next_step();
					break;
			case 49:this.actual_step++;
					this.next_step();
					break;
			case 50:this.actual_step++;
					this.next_step();
					break;
			case 51:if(this.actual_substep > 5){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 52:this.actual_step++;
					this.next_step();
					break;
			case 53:this.actual_step++;
					this.next_step();
					break;
			case 54:if(parseInt(this.tutorial_target[1].quantity.content) == 6){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 55:this.actual_step++;
					this.next_step();
					break;
			case 56:this.actual_step++;
					this.next_step();
					break;
			case 57:this.actual_step++;
					this.next_step();
					break;
			case 58:if(parseInt(this.tutorial_target[1].quantity.content) == 3){
						this.actual_step++;
						this.next_step();
					}
					break;
			case 59:this.actual_step++;
					this.next_step();
					break;
			case 60:this.actual_step++;
					this.next_step();
					break;
		}
	}
	
	this.post_click = function(){
		switch(this.actual_step){
			case 11:this.post_step_11();
					break;
			case 15:this.post_step_15();
					break;
			case 19:this.post_step_19();
					break;
			case 26:this.post_step_26();
					break;
			case 35:this.post_step_35();
					break;
			case 38:this.post_step_38();
					break;
			case 43:this.post_step_43();
					break;
			case 50:this.post_step_50();
					break;
			case 57:this.post_step_57();
					break;
		}
	}
	
	this.finish_tutorial = function(){
		
		mouse_down_listener = function(event){
			move_view = true;
			focus_object.mouse_down();
		}
		
		mouse_up_listener = function(event){
			move_view = false;
			
			if(view_moved){
				view_moved = false;
			}
			else{
				if(selected_object != default_focus && focus_object != selected_object){
					selected_object.unselect();
				}
				focus_object.mouse_up();
			}
		}
	}
	
	this.check_mouse_down = function(target){
		var allowed = false;
		if(this.tutorial_target.indexOf(target) > -1){
			allowed = true;
		}
		
		return allowed;
	}
	
	this.check_mouse_over = function(target){
		
		var allowed = false;
		if(this.tutorial_target.indexOf(target) > -1){
			allowed = true;
			this.button_click(target);
		}
		
		return allowed;
	}
	
	this.timer = function(time){
		setTimeout(this.time_over,(time*1000), this);
	}
	
	this.time_over = function(script){
		script.button_click();
	}
	
	this.next_step();
}