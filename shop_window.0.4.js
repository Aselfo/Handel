//Klasse die, die Geschäftsansicht definiert und verwaltet
function Window_Shop(){
	
	this.view_x = 0;							//X Verschiebung des Sichtfeldes
	this.view_y = 0;							//Y Verschiebung des Sichtfeldes
	
	this.ui_content = [];
	this.game_content = [];
	
	this.construct_menue = new Construckt_Menue(this);
	this.crafting_menue = new Crafting_Menue(this);
	this.sell_menue = new Sell_Menue(this);
	
	this.construction_mode = 0;									//Aktueller Bau Modus (0:nichts 1:Einrichtung 2:Wände 3:Raum 4:Abreisen)
	this.new_room_id = 0;
	this.menue_open = false;
	
	this.action_on_hold = null;
	
	this.init_window = function(){
		//Initialisieren der Buttons
		this.ui_content[0] = new Ui_Button(0, 20, 70, this, "Gebäudeaufwertung");
		this.ui_content[0].is_activ = false;
		this.ui_content[1] = new Ui_Button(1, 20, 120, this, "Bauen");
		this.ui_content[1].mouse_over_text = "In den Baumodus wechseln";
		this.ui_content[2] = new Ui_Button(2, 20, 170, this, "Baue Wand");
		this.ui_content[2].is_activ = false;
		this.ui_content[2].mouse_over_text = "Neue Wandsegmente bauen. Auf eine bestehende Wand clicken um eine Tür zu bauen oder auf eine Bestehende Tür clicken um sie wieder zu entfernen.";
		this.ui_content[3] = new Ui_Button(3, 20, 220, this, "Baue Raum");
		this.ui_content[3].is_activ = false;
		this.ui_content[3].mouse_over_text = "Eine Neuen Raum setzen. Ein Raum braucht eine durchgehende Wand und einen direckten oder indirecken(je nach Raum) Pfand zu einem Ausgang(Tür in der Außenwand). ";
		this.ui_content[4] = new Ui_Button(4, 20, 270, this, "Baue Einrichtung");
		this.ui_content[4].is_activ = false;
		this.ui_content[4].mouse_over_text = "Baut in einem Raum ein neues Einrichtungsobject. Die Auswahl an Einrichtung hängt vom Raum ab.";
		this.ui_content[5] = new Ui_Button(5, 20, 320, this, "Abreißen");
		this.ui_content[5].is_activ = false;
		this.ui_content[5].mouse_over_text = "Einrichtung, Räume und Wände wieder abreißen. Für einen Raum muss die gesammte Einrichtung in ihm vorher abgerissen werden und für eine Wand müssen alle Räume und Türen die die Wand begrenzt abgerissen werden. Außenwände können nicht abgerissen werden.";
		this.ui_content[6] = new Ui_Button(6, 20, 470, this, "Arbeiter Einstellen 100$");
		this.ui_content[7] = new Ui_Button(7, 20, 520, this, "Arbeiter Entlassen");
	}
	
	//Zeichnet das Spielfeld neu und Meldet den Kacheln sich selbst neu zu Zeichnen
	this.draw_game_canvas = function(){
		game_canvas.beginPath();
		game_canvas.rect(0, 0, 1200, 650);
		game_canvas.fillStyle = "lightgrey";
		game_canvas.fill();
		for(var i = 0; i < this.game_content.length; i++){
			this.game_content[i].draw_element();
		}
	}
	
	//Zeichnet die UI neu
	this.draw_ui_canvas = function(){
		ui_canvas.clearRect(0, 60, 1200, 590);
		for(var i = 0; i < this.ui_content.length; i++){
			this.ui_content[i].draw_element();
		}
		head_bar.draw_element();
	}
	
	this.mouse_over = function(view_move_x, view_move_y){
		if(move_view && !this.menue_open){
			view_moved = true;
			this.view_x += old_mpos_x - mpos_x;
			this.view_y += old_mpos_y - mpos_y;
			for(var i = 0; i < this.game_content.length; i++){
				this.game_content[i].scroll_position(this.view_x, this.view_y);
			}
			this.draw_game_canvas();
		}
		else{
			var match_found = false;
			if(this.menue_open){
				if(this.construct_menue.mouse_over() || this.crafting_menue.mouse_over() || this.sell_menue.mouse_over()){
					match_found = true;
				}
			}
			if(!match_found){
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
			}
			if(!match_found){
				focus_object.mouse_out();
				focus_object = default_focus;
			}
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
					
			case 4: this.press_construckt_funiture_button();
					break;
					
			case 5: this.press_delet_button();
					 break;

			case 6: game.hire_worker();
					break;
					
			case 7: game.fire_worker();
					break;
		}
	}
	
	this.tile_click = function(source){
		if(!this.menue_open){
			if(this.construction_mode == 0 && source.room != null && source.funiture != null){
				if(source.funiture.action_id == 0){
					if(source.room.kind_of_room == 4){
						this.sell_menue.show_sell_menue(source);
						this.menue_open = true;
					}
					else if(source.room.kind_of_room < 4 && source.room.kind_of_room > 1){
						this.crafting_menue.show_crafting_menue(source);
						this.menue_open = true;
					}
				}
				else if(source.funiture.action_id == 2){
					this.action_on_hold = function(){var object = source; object.funiture.abort_action();}
					confirm_request_message.request_answer(this, mpos_x, mpos_y, "Aktion wirklich abbrechen?");
				}
			}
			else if(this.construction_mode == 1 && source.action_possible){
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
			else if(this.construction_mode == 2 && source.action_possible){			
				game.build_room(source.monitor.member, this.new_room_id);
				source.monitor.unhighlight();
				this.press_construckt_room_button();
			}
			else if(this.construction_mode == 3 && source.action_possible){
				this.construct_menue.show_funiture_menue(source);
				this.menue_open = true;
			}
			else if(this.construction_mode == 4 && source.action_possible){
				if(source.room == null){
					game.delete_wall(source);
				}
				else if(source.funiture == null){
					game.delete_room(source);
					source.monitor.unhighlight();
				}
				else if(source.funiture != null){
					game.delete_funiture(source);
				}
			}
			else if(source.fail_reason != ""){
				show_message(source.fail_reason);
			}
		}
		source.action_possible = false;
	}
	
	this.chose_room = function(id){
		this.new_room_id = id;
		this.construction_mode = 2;
		this.menue_open = false;
		this.construct_menue.hide_menue();
	}
	
	this.chose_funiture = function(id, tile){
		game.build_funiture(tile.room, id, tile);
		head_bar.update_money(-existing_funiture[tile.room.kind_of_room][id].price);
		this.menue_open = false;
		this.construct_menue.hide_menue();
	}
	
	this.press_construckt_button = function(){
		if(!this.ui_content[1].lock){
			this.ui_content[1].lock = true;
			this.ui_content[1].pictur_y = 40;
			this.ui_content[1].set_label("Beenden");
			this.ui_content[2].activate();
			this.ui_content[3].activate();
			this.ui_content[4].activate();
			this.ui_content[5].activate();
		}
		else{
			if(this.ui_content[2].lock){
				this.press_construckt_wall_button();
			}
			if(this.ui_content[3].lock){
				this.press_construckt_room_button();
				new_room_id = 0;
			}
			if(this.ui_content[4].lock){
				this.press_construckt_funiture_button();
			}
			if(this.ui_content[5].lock){
				this.press_delet_button();
			}
			if(this.menue_open){
				this.close_all_windows();
			}
			this.ui_content[1].lock = false;
			this.ui_content[1].pictur_y = 0;
			this.ui_content[1].set_label("Bauen");
			this.ui_content[2].deactivate();
			this.ui_content[3].deactivate();
			this.ui_content[4].deactivate();
			this.ui_content[5].deactivate();
			
		}
		this.ui_content[1].draw_element();
	}
	
	this.press_construckt_wall_button = function(){
		if(!this.ui_content[2].lock){
			if(this.ui_content[3].lock){
				this.press_construckt_room_button();
				this.construction_mode = 1;
				new_room_id = 0;
			}
			if(this.ui_content[4].lock){
				this.press_construckt_funiture_button();
			}
			if(this.ui_content[5].lock){
				this.press_delet_button();
			}
			if(this.menue_open){
				this.close_all_windows();
			}
			this.construction_mode = 1;
			this.ui_content[2].lock = true;
			this.ui_content[2].pictur_y = 40;
			this.ui_content[2].set_label("Beenden");
		}
		else{
			this.construction_mode = 0;
			this.ui_content[2].lock = false;
			this.ui_content[2].pictur_y = 0;
			this.ui_content[2].set_label("Baue Wand");
		}
		this.ui_content[2].draw_element();
	}
	
	this.press_construckt_room_button = function(){
		if(!this.ui_content[3].lock){
			if(this.ui_content[2].lock){
				this.press_construckt_wall_button();
			}
			if(this.ui_content[4].lock){
				this.press_construckt_funiture_button();
			}
			if(this.ui_content[5].lock){
				this.press_delet_button();
			}
			if(this.menue_open){
				this.close_all_windows();
			}
			this.ui_content[3].lock = true;
			this.ui_content[3].pictur_y = 40;
			this.ui_content[3].set_label("Beenden");
			this.menue_open = true;
			this.construct_menue.show_room_menue();
		}
		else{
			this.ui_content[3].lock = false;
			this.ui_content[3].pictur_y = 0;
			this.ui_content[3].set_label("Baue Raum");
			this.construction_mode = 0;
			this.close_all_windows();
			
		}
		this.ui_content[3].draw_element();
	}
	
	this.press_construckt_funiture_button = function(){
		if(!this.ui_content[4].lock){
			if(this.ui_content[2].lock){
				this.press_construckt_wall_button();
			}
			if(this.ui_content[3].lock){
				this.press_construckt_room_button();
				this.construction_mode = 1;
				this.new_room_id = 0;
			}
			if(this.ui_content[5].lock){
				this.press_delet_button();
			}
			if(this.menue_open){
				this.close_all_windows();
			}
			this.ui_content[4].lock = true;
			this.ui_content[4].pictur_y = 40;
			this.ui_content[4].set_label("Beenden");
			this.construction_mode = 3;
		}
		else{
			this.ui_content[4].lock = false;
			this.ui_content[4].pictur_y = 0;
			this.ui_content[4].set_label("Baue Einrichtung");
			this.construction_mode = 0;
			this.close_all_windows();
			
		}
		this.ui_content[4].draw_element();
	}
	
	this.press_delet_button = function(){
		if(!this.ui_content[5].lock){
			if(this.ui_content[2].lock){
				this.press_construckt_wall_button();
			}
			if(this.ui_content[3].lock){
				this.press_construckt_room_button();
				this.construction_mode = 1;
				this.new_room_id = 0;
			}
			if(this.ui_content[4].lock){
				this.press_construckt_funiture_button();
			}
			if(this.menue_open){
				this.close_all_windows();
			}
			this.construction_mode = 4;
			this.ui_content[5].lock = true;
			this.ui_content[5].pictur_y = 40;
			this.ui_content[5].set_label("Beenden");
		}
		else{
			this.construction_mode = 0;
			this.ui_content[5].lock = false;
			this.ui_content[5].pictur_y = 0;
			this.ui_content[5].set_label("Abreißen");
		}
		this.ui_content[5].draw_element();
	}	
	
	this.close_all_windows = function(){
		this.crafting_menue.hide_crafting_menue();
		this.sell_menue.hide_sell_menue();
		this.construct_menue.hide_menue();
		this.menue_open = false;
		this.draw_ui_canvas();
	}
	
	this.set_default = function(){
		if(this.ui_content[1].lock){
			this.press_construckt_button();
		}
		if(this.menue_open){
			this.close_all_windows();
		}
	}
	//Leitet den Sekundentick der Uhr an die Kacheln weiter
	this.timer_tick = function(seconds){
		for(var i = 0; i < this.game_content.length; i++){
			this.game_content[i].count_down(seconds);
		}
	}
}