//Klasse die, die Geschäftsansicht definiert und verwaltet
function Window_Shop(){
	
	var move_view = false;					//Flag ob das Sichtfeld sich beim scrollen bewegen soll
	var view_moved = false;					//Flag ob das Sichtfeld bewegt wurde
	this.view_x = 0;							//X Verschiebung des Sichtfeldes
	this.view_y = 0;							//Y Verschiebung des Sichtfeldes
	
	this.ui_content = [];
	this.game_content = [];
	
	this.construction_mode = 0;									//Aktueller Bau Modus (0:nichts 1:Einrichtung 2:Wände 3:Raum 4:Abreisen)
	
	this.init_window = function(){
		//Initialisieren der Buttons
		this.ui_content[0] = new UI_Button(0, 20, 70, this, "Gebäudeaufwertung");
		//this.ui_content[0].is_activ = true;
		this.ui_content[1] = new UI_Button(1, 20, 120, this, "Bauen");
		this.ui_content[1].is_activ = true;
		this.ui_content[1].mouse_over_text = "In den Baumodus wechseln";
		this.ui_content[2] = new UI_Button(2, 20, 170, this, "Baue Wand");
		this.ui_content[2].mouse_over_text = "Neue Wandsegmente bauen. Auf eine bestehende Wand clicken um eine Tür zu bauen oder auf eine Bestehende Tür clicken um sie wieder zu entfernen.";
		this.ui_content[3] = new UI_Button(3, 20, 220, this, "Neuer Raum");
		this.ui_content[3].mouse_over_text = "Eine Neuen Raum setzen. Ein Raum braucht eine durchgehende Wand und einen direckten oder indirecken(je nach Raum) Pfand zu einem Ausgang(Tür in der Außenwand). ";
		this.ui_content[4] = new UI_Button(4, 20, 270, this, "Abreißen");
		this.ui_content[4].mouse_over_text = "Einrichtung, Räume und Wände wieder abreißen";
		this.ui_content[5] = new UI_Button(12, 980, 70, this, "Lager");
		this.ui_content[5].is_activ = true;
		this.ui_content[6] = new UI_Button(13, 980, 120, this, "Markt");
		this.ui_content[6].is_activ = true;
		this.ui_content[7] = new UI_Button(14, 20, 470, this, "Arbeiter Einstellen 100$");
		this.ui_content[7].is_activ = true;
		this.ui_content[8] = new UI_Button(15, 20, 520, this, "Arbeiter Entlassen");
		this.ui_content[8].is_activ = true;
	}
	
	//Zeichnet das Spielfeld neu und Meldet den Kacheln sich selbst neu zu Zeichnen
	this.draw_game_canvas = function(){
		game_canvas.beginPath();
		game_canvas.rect(0, 0, 1200, 650);
		game_canvas.fillStyle = "lightgrey";
		game_canvas.fill();
		for(var i = 0; i < this.game_content.length; i++){
			this.game_content[i].draw_image();
		}
	}
	
	//Zeichnet die UI neu
	this.draw_ui_canvas = function(){
		ui_canvas.clearRect(0, 60, 1200, 590);
		for(var i = 0; i < this.ui_content.length; i++){
			this.ui_content[i].draw_image();
		}
	}
	
	this.mouse_over = function(view_move_x, view_move_y){
		if(move_view){
			this.view_x += view_move_x;
			this.view_y += view_move_y;
			this.draw_game_canvas();
		}
		else{
			var match_found = false;
			for(var i = 0; i < (this.ui_content.length + this.game_content.length); i++){
				if(i < this.ui_content.length){
					if(this.ui_content[i].mouse_over()){
						match_found = true;
						break;
					}
				}
				else{
					if(this.game_content[i - this.ui_content.length].mouse_over()){
						match_found = true;
						break;
					}
				}
			}
			if(focus_object != null && !match_found){
				focus_object.mouse_out();
				focus_object = default_focus;
			}
		}
	}
	
	this.mouse_down = function(){
		move_view = true;
		focus_object.mouse_down();
	}
	
	this.mouse_up = function(){
		move_view = false;
		if(!view_moved){
			focus_object.mouse_up();	
		}
		else{
			view_moved = false;
		}
	}
	
	this.button_click = function(source){
		switch(source){
			case 0: this.press_upgrade_button();
					break;
			
			case 1: this.press_construckt_button();
					break;
			
			case 2: this.press_construckt_wall_button();
					break;
					
			case 3: this.press_construckt_room_button();
					break;
					
			case 4: this.press_delet_button();
					 break;
					 
		}
	}
	
	this.tile_click = function(source){
		if(this.construction_mode == 2 && source.action_possible){
			if(source.funiture == null){
				game.build_funiture(null, 0, source);
				head_bar.update_money(-existing_funiture[0][0].price);
			}
			else if(source.funiture.id == 0){
				game.build_funiture(null, 1, source);
				head_bar.update_money(-existing_funiture[0][1].price);
			}
			else{
				game.build_funiture(null, 0, source);
				head_bar.update_money(-existing_funiture[0][0].price);
			}
			source.status_check();
		}
		else if(this.construction_mode == 3 && source.action_possible){			
			game.build_room(source.monitor.member, 1);
			source.monitor.unhighlight();
		}
		else if(this.construction_mode == 4 && source.action_possible){
			game.delete_wall(source);
		}
	}
	
	this.press_construckt_button = function(){
		if(!this.ui_content[1].lock){
			this.construction_mode = 1;
			this.ui_content[1].lock = true;
			this.ui_content[1].pictur_y = 40;
			this.ui_content[1].label = "Beenden";
			this.ui_content[2].enable_button();
			this.ui_content[3].enable_button();
			this.ui_content[4].enable_button();
		}
		else{
			this.construction_mode = 0;
			this.ui_content[1].lock = false;
			this.ui_content[1].pictur_y = 0;
			this.ui_content[1].label = "Bauen";
			this.ui_content[2].disable_button();
			this.ui_content[3].disable_button();
			this.ui_content[4].disable_button();
			if(this.ui_content[2].lock){
				this.press_construckt_wall_button();
			}
			if(this.ui_content[3].lock){
				this.press_construckt_room_button();
				new_room_id = 0;
			}
			if(this.ui_content[4].lock){
				this.press_delet_button();
			}
		}
		this.ui_content[1].draw_image();
	}
	
	this.press_construckt_wall_button = function(){
		if(!this.ui_content[2].lock){
			if(this.ui_content[3].lock){
				this.press_construckt_room_button();
				this.construction_mode = 1;
				new_room_id = 0;
			}
			if(this.ui_content[4].lock){
				this.press_delet_button();
			}
			this.construction_mode = 2;
			this.ui_content[2].lock = true;
			this.ui_content[2].pictur_y = 40;
			this.ui_content[2].label = "Beenden";
		}
		else{
			this.construction_mode = 1;
			this.ui_content[2].lock = false;
			this.ui_content[2].pictur_y = 0;
			this.ui_content[2].label = "Baue Wand";
		}
		this.ui_content[2].draw_image();
	}
	
	this.press_construckt_room_button = function(){
		if(!this.ui_content[3].lock){
			if(this.ui_content[2].lock){
				this.press_construckt_wall_button();
			}
			if(this.ui_content[4].lock){
				this.press_delet_button();
			}
			this.ui_content[3].lock = true;
			this.ui_content[3].pictur_y = 40;
			this.ui_content[3].label = "Beenden";
			this.construction_mode = 3;
			/*menue_open = true;
			this.menue_window.set_position(230, 210);
			this.menue_window.width = 220;
			this.menue_window.height = 210;
			this.menue_window.reset_buttons();
			this.menue_window.sub_parts[0].is_activ = true;
			this.menue_window.sub_parts[0].id = 5;
			this.menue_window.sub_parts[0].label = "Lager";
			this.menue_window.sub_parts[0].mouse_over_text = "Ein Lager für Rohstoffe, Halbfabrikate und Endprodukte. Jedes Geschäft braucht ein Lager.";
			this.menue_window.sub_parts[1].is_activ = true;
			this.menue_window.sub_parts[1].id = 6;
			this.menue_window.sub_parts[1].label = "Schmiede";
			this.menue_window.sub_parts[1].mouse_over_text = "Eine Schmiede für Waffen, Rüstungen und Metallteile.";
			this.menue_window.sub_parts[2].is_activ = true;
			this.menue_window.sub_parts[2].id = 7;
			this.menue_window.sub_parts[2].label = "Alchemilabor";
			this.menue_window.sub_parts[2].mouse_over_text = "Ein Laboratorium für Alchemie- und Magiewaren.";
			this.menue_window.sub_parts[3].is_activ = true;
			this.menue_window.sub_parts[3].id = 8;
			this.menue_window.sub_parts[3].label = "Laden";
			this.menue_window.sub_parts[3].mouse_over_text = "Ein Einzelhandelsladen um Waren an Privatkunden zu verkaufen.";
			this.menue_window.activate();*/
		}
		else{
			this.ui_content[3].lock = false;
			this.ui_content[3].pictur_y = 0;
			this.ui_content[3].label = "Neuer Raum";
			menue_open = false;
			this.menue_window.deactivate();
			
		}
		this.ui_content[3].draw_image();
	}
	
	this.press_delet_button = function(){
		if(!this.ui_content[4].lock){
			if(this.ui_content[2].lock){
				this.press_construckt_wall_button();
			}
			if(this.ui_content[3].lock){
				this.press_construckt_room_button();
				this.construction_mode = 1;
				this.new_room_id = 0;
			}
			this.construction_mode = 4;
			this.ui_content[4].lock = true;
			this.ui_content[4].pictur_y = 40;
			this.ui_content[4].label = "Beenden";
		}
		else{
			this.construction_mode = 1;
			this.ui_content[4].lock = false;
			this.ui_content[4].pictur_y = 0;
			this.ui_content[4].label = "Abreisen";
		}
		this.ui_content[4].draw_image();
	}	
	
	//Leitet den Sekundentick der Uhr an die Kacheln weiter
	this.timer_tick = function(){
		for(var i = 0; i < this.game_content.length; i++){
			this.game_content[i].count_down();
		}
	}
}