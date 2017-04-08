//Einen Dünamisch skalierbarer Fensterhintergrund zeichnen
function draw_background(canvas, x, y, width, height, color){
	canvas.drawImage(image_repository.ui_part, 0 , 0 , 5, 5, x            , y             , 5         , 5);
	canvas.drawImage(image_repository.ui_part, 0 , 7 , 5, 1, x            , y + 5         , 5         , height - 10);
	canvas.drawImage(image_repository.ui_part, 0 , 10, 5, 5, x            , y + height - 5, 5         , 5);
	canvas.drawImage(image_repository.ui_part, 7 , 10, 1, 5, x + 5        , y + height - 5, width - 10, 5);
	canvas.drawImage(image_repository.ui_part, 10, 10, 5, 5, x + width - 5, y + height - 5, 5         , 5);
	canvas.drawImage(image_repository.ui_part, 10, 7 , 5, 1, x + width - 5, y + 5         , 5         , height - 10);
	canvas.drawImage(image_repository.ui_part, 10, 0 , 5, 5, x + width - 5, y             , 5         , 5);
	canvas.drawImage(image_repository.ui_part, 7 , 0 , 1, 5, x + 5        , y             , width - 10, 5);
	
	if(color){
		canvas.drawImage(image_repository.ui_part, 6, 17, 2, 2, x + 5, y + 5, width - 10, height - 10);
	}
	else{
		canvas.drawImage(image_repository.ui_part, 0, 17, 2, 2, x + 5, y + 5, width - 10, height - 10);
	}
}

//-------------Algemeine UI Objekte-------------------------------------------
//Klasse für Menüfenster
function Ui_Part(canvas, x, y, width, height, color_id, own_parent){
	this.canvas = canvas;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color_id = color_id
	this.own_parent = own_parent;
	this.sub_parts = [];
	this.is_activ = true;
	
	this.draw_image = function(){
		if(this.is_activ){
			draw_background(this.canvas, this.x, this.y, this.width, this.height, this.color_id);
			for(var i = 0; i < this.sub_parts.length; i++){
				this.sub_parts[i].draw_image();
			}
		}
	}
	
	this.mouse_over = function(){
		if(this.is_activ){
			for(var i = 0; i < this.sub_parts.length; i++){
				if(this.sub_parts[i].mouse_over()){
					return true;
				}
			}
		}
		return false;
	}
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].x = x + this.sub_parts[i].save_x;
			this.sub_parts[i].y = y + this.sub_parts[i].save_y;
		}
	}
	
	this.activate = function(){
		this.is_activ = true;
		this.draw_image();
	}
	
	this.deactivate = function(){
		this.is_activ = false;
		ui_canvas.clearRect(this.x - 1, this.y - 1, this.width+ 2, this.height + 2);
	}
}

//Klasse für Knöpfe
function UI_Button(id, x, y, own_parent, label){
	this.canvas = ui_canvas;			//Referenz auf die Zeichenebene
	this.x = x;							//X position des Knopfes
	this.y = y;							//Y position des Knopfes
	this.width = 200
	this.height = 40
	this.pictur_x = 0;					//X position des Bildausschnittes
	this.pictur_y = 0;					//Y position des Bildausschnittes
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	
	this.id = id;						//ID Des Knopfes
	this.own_parent = own_parent;		//Referenz auf das Fenster zu dem der Knopf gehört
	this.label = label;					//String mit der Beschriftung des Knopfes
	this.lock = false;					//Flag ob der Knopf eingerasstet ist
	this.is_activ = false;				//Flag ob der Knopf gerade aktiv ist
	this.mouse_over_text = "";			//String für die Ausgabe als popup
	
	//Zeichnet den Knopf
	this.draw_image = function(){
		if(this.is_activ){
			this.canvas.drawImage(image_repository.button_image, this.pictur_x, this.pictur_y, 200, 40, this.x, this.y, this.width, this.height);
			this.canvas.font = "bold 14px Arial";
			this.canvas.fillText(this.label, this.x + (this.width - this.canvas.measureText(this.label).width) / 2, this.y + 25);
		}
	}
	
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.mouse_down = function(){

	}
	
	this.mouse_up = function(){
		this.own_parent.button_click(this.id);
	}
	
	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){
		if(mpos_x > this.x && mpos_x <= (this.x + this.width) && mpos_y > this.y && mpos_y <= (this.y + this.height) && this.is_activ){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.pictur_x = 200;
				this.draw_image();
				if(this.mouse_over_text != ""){
					mouse_over_tooltip.show_tooltip(this.x + this.width + 15, this.y, this.mouse_over_text);
				}
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	//Wird aufgerufen wenn die Maus auß dem Knopf fährt
	this.mouse_out = function(){
		this.mouse_over_status = false;
		this.pictur_x = 0;
		this.draw_image();
		if(this.mouse_over_text != ""){
			mouse_over_tooltip.hide_tooltip();
		}
	}
	
	//Activiert einen Knopf
	this.enable_button = function(){
		this.is_activ = true;
		this.draw_image();
	}
	
	//Deactiviert einen Knopf
	this.disable_button = function(){
		this.is_activ = false;
		ui_canvas.clearRect(this.x, this.y, this.width, this.height);
	}
}

//------------Einmalige Objekte-----------------------------------------------

//Klasse für die Spiel Uhr
function Clock(){
	var date;		//Speichervariable für die Aktuelle zeit die man vom System holt
	var day;		//Der Wochentag von 0-6 (nicht welcher tag des Monats)
	var hour;		//Aktuelle Stunde von 0-23
	var minute;		//Aktuelle Minute von 0-59
	var second;		//Aktuelle Sekunde von 0-59
	var weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Sammstag"]; //Array zum übersetzen von Wochentag in Name des Tages
	
	//Funktion zum starten der Uhr
	this.start_clock = function(){
		setTimeout(this.second_tick, 100);
		setInterval(this.second_tick, 1000);
	}
	//Funktion für den sekundentick (neue Zeit holen, formatieren und ausgeben)
	this.second_tick = function(){
		//Daten Auslesen
		date = new Date();
		day = date.getDay();
		hour = date.getHours();
		minute = date.getMinutes();
		second = date.getSeconds();
		
		//Bei Bedarf führende Null setzen
		if(hour < 10){
			hour = "0" + hour;
		}
		if(minute < 10){
			minute = "0" + minute;
		}
		if(second < 10){
			second = "0" + second;
		}
		
		//String bauen und Anzeigen
		var time_string = weekdays[day] + " " + hour + ":" + minute + ":" + second;
		
		ui_canvas.font = "bold 14px Arial";
		ui_canvas.drawImage(image_repository.head_bar_background, 10, 20, 150, 20 ,10, 20, 150, 20);
		ui_canvas.fillText(time_string, 10, 35);
		
		windows[0].timer_tick();
	}
}

function Tooltip(){
	this.x;
	this.y;
	this.show_tooltip = function(x, y, tip_text){
		this.x = x;
		this.y = y;
		
		var tip_text = tip_text.split(" ");
		var j = 0;
		var memory = tip_text;
		tip_text = [];
		tip_text[0] = "";
		for(var i = 0; i < memory.length; i++){
			if(popup_canvas.measureText(tip_text[j] + " " + memory[i]).width <= 250){
				tip_text[j] = tip_text[j] + " " + memory[i];
			}
			else{
				j++;
				tip_text[j] = " " + memory[i];
			}
		}
		
		this.height = tip_text.length * 12 + 20;
		
		draw_background(popup_canvas, this.x, this.y, 260, this.height, 0);
		
		for(var i = 0; i < tip_text.length; i++){
			popup_canvas.font = "bold 12px Arial";
			popup_canvas.fillText(tip_text[i], this.x + 10, 20 + 12 * i + this.y);
		}
	}
	
	this.hide_tooltip = function(){
		popup_canvas.clearRect(this.x - 5, this.y - 5, 270, this.height + 10);
	}
}

function Shop_Tile_UI(x, y, border_left, border_top, own_parent, own_back_end){
	this.x = x * 75 + Math.round(border_left);		//Grafische X Position des Feldes
	this.y = y * 75 + Math.round(border_top);		//Grafische Y Position des Feldes
	this.pictur_x = 0;								//X Wert des Startpunktes des Ausschnittes der von der Bilddatei angezeigt wird
	this.mouse_over_status = false;					//Flag ob die Maus auf diesem Feld liegt
	this.highlight_status = 0;						//Flag ob und wie dieses Feld Markiert ist
	this.own_parent = own_parent;
	this.own_back_end = own_back_end;
	this.own_back_end.own_ui = this;
	
	this.draw_image = function(){
		game_canvas.drawImage(image_repository.shop_tile, this.pictur_x, 0, 75, 75, this.x - own_parent.view_x, this.y - own_parent.view_y, 75, 75);
		game_canvas.font = "bold 14px Arial";
		game_canvas.fillStyle = "BLACK";
		if(this.own_back_end.funiture != null){
			this.own_back_end.funiture.draw_image(this.x - own_parent.view_x, this.y - own_parent.view_y);
		}
		if(this.highlight_status == 1){
			game_canvas.drawImage(image_repository.shop_tile_marking, 0, 0, 75, 75, this.x - own_parent.view_x, this.y - own_parent.view_y, 75, 75);
		}
		else if(this.highlight_status == 2){
			game_canvas.drawImage(image_repository.shop_tile_marking, 75, 0, 75, 75, this.x - own_parent.view_x, this.y - own_parent.view_y, 75, 75);
		}
	}
	
	this.mouse_over = function(){
		if(mpos_x > this.x - own_parent.view_x && mpos_x <= (this.x + 75) - own_parent.view_x && mpos_y > this.y - own_parent.view_y && mpos_y <= (this.y + 75) - own_parent.view_y){
			if(!this.mouse_over_status){
				this.highlight_status = this.own_back_end.mouse_over();
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.draw_image();	
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	this.mouse_out = function(){
		this.mouse_over_status = false;
		if(this.own_back_end.monitor == null){
			this.highlight_status = 0;
			this.own_back_end.action_possible = false;
			this.draw_image();
		}
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		this.own_back_end.mouse_up();
	}
	
	//gibt einen Timertick an das Objekt weiter das auf diesem Feld liegt (wenn vorhanden) und zeichnet sich neu
	this.count_down = function(){
		if(this.own_back_end.funiture != null && this.own_back_end.funiture.time_left != 0){
			this.own_back_end.funiture.count_down();
			this.draw_image();
		}
	}
}

function Shop_Tile(x_cord, y_cord){
	this.own_ui;
	
	this.x_cord = x_cord;							//X Cordinate des Feldes im Raster des Spielfeldes
	this.y_cord = y_cord;							//Y Cordinate des Feldes im Raster des Spielfeldes
	
	this.top_tile = null;							//Referenz auf das darüberliegende Feld
	this.bot_tile = null;							//Referenz auf das darunterliegende Feld
	this.left_tile = null;							//Referenz auf das linke Feld
	this.right_tile = null;							//Referenz auf das rechte Feld
	
	this.outer_wall = false;						//Flag ob dieses Feld eine Ausenwand ist
	
	this.funiture = null;							//Referenz auf das Objekt das auf diesem Feld liegt(kann null sein)
	this.room = null;								//Referenz auf den Raum zu dem dieses Feld gehört(kann null sein)
	
	this.action_possible = false;
	this.monitor = null;
	
	this.mouse_over = function(){
		switch(windows[0].construction_mode){
			case 0: return 1;
			
			case 1: if(this.room != null && this.funiture == null){
						return 1;
					}
					else{
						return 2;
					}
			
			case 2: if(this.wall_construcktable()){
						this.action_possible = true;
						return 1;
					}
					else{
						return 2;
					}
			case 3: return this.room_construcktable();
			case 4: if(this.funiture != null && this.room == null && this.wall_deletable()){
						this.action_possible = true;
						return 1;
					}
					else{
						return 2;
					}
		}
		
	}
	
	this.mouse_out = function(){
		
	}
	
	this.wall_construcktable = function(){
		if(this.room == null){
			if(this.funiture == null){
				if((this.top_tile.funiture != null && this.top_tile.funiture.id == 1 && !this.top_tile.funiture.door_direction) ||
				   (this.bot_tile.funiture != null && this.bot_tile.funiture.id == 1 && !this.bot_tile.funiture.door_direction) ||
				   (this.left_tile.funiture != null && this.left_tile.funiture.id == 1 && this.left_tile.funiture.door_direction) ||
				   (this.right_tile.funiture != null && this.right_tile.funiture.id == 1 && this.right_tile.funiture.door_direction)){
					    
					return false;
				}
				else{
					return true;
				}
			}
			else if(this.funiture.id == 0){
				if((this.funiture.top_wall && this.funiture.bot_wall && !this.funiture.left_wall && !this.funiture.right_wall) || (!this.funiture.top_wall && !this.funiture.bot_wall && this.funiture.left_wall && this.funiture.right_wall)){
					return true;
				}
			}
			else if(this.funiture.id == 1){
				if(!this.funiture.door_direction && (this.top_tile == null || this.top_tile.room == null) && (this.bot_tile == null || this.bot_tile.room == null)){
					return true;
				}
				else if(this.funiture.door_direction && (this.left_tile == null || this.left_tile.room == null) && (this.right_tile == null || this.right_tile.room == null)){
					return true;
				}
				else{
					return false;
				} 
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	}
	
	this.room_construcktable = function(){
		if(this.funiture == null){
			var monitor = new function(){this.member = [];
						   this.wall_complete = true;
						   this.found_exit = false;
						   this.room_empty = true;
						   this.last_status = false;
						   this.add_to_room = function(tile){
								this.member.push(tile);
								for(tile in this.member){
									this.member[tile].highlight(this.last_status);
								}	
						   }
						   this.check_status = function(){
							   if(this.last_status != (this.wall_complete && this.found_exit && this.room_empty)){
								   this.last_status = this.wall_complete && this.found_exit && this.room_empty;
							   }
						   }
						   };
			return this.check_area(monitor, true);
		}
		else{
			if(typeof focus_object.own_back_end !== 'undefined' && focus_object.own_back_end.monitor != null){
				focus_object.own_back_end.monitor.member.forEach(function(i){i.unhighlight()});
			}
			return 2;
		}
	}
	
	this.wall_deletable = function(){
		if(!this.outer_wall){
			if((!this.funiture.top_wall || (this.funiture.top_wall && this.top_tile.funiture.id == 0)) &&
			   (!this.funiture.bot_wall || (this.funiture.bot_wall && this.bot_tile.funiture.id == 0)) &&
			   (!this.funiture.left_wall || (this.funiture.left_wall && this.left_tile.funiture.id == 0)) &&
			   (!this.funiture.right_wall || (this.funiture.right_wall && this.right_tile.funiture.id == 0))){
				   return true;
			}
		}
		else{
			return false;
		}
	}
	
	this.check_area = function(monitor, in_room){
		if(!monitor.member.includes(this)){
			if(in_room){
				monitor.add_to_room(this);
				this.monitor = monitor;
				var top_wall = false;
				var bot_wall = false;
				var left_wall = false;
				var right_wall = false;
				if(this.top_tile.funiture == null){
					this.top_tile.check_area(monitor, true);
				}
				else if(this.top_tile.funiture.id == 0){
					top_wall = true;
				}
				else if(this.top_tile.funiture.id == 1){
					top_wall = true;
					if(this.top_tile.outer_wall){
						monitor.found_exit = true;
						monitor.check_status();
					}
					else{
						this.top_tile.check_area(monitor, false);
					}
				}
				if(this.bot_tile.funiture == null){
					this.bot_tile.check_area(monitor, true);
				}
				else if(this.bot_tile.funiture.id == 0){
					bot_wall = true;
				}
				else if(this.bot_tile.funiture.id == 1){
					bot_wall = true;
					if(this.bot_tile.outer_wall){
						monitor.found_exit = true;
						monitor.check_status();
					}
					else{
						this.bot_tile.check_area(monitor, false);
					}
				}
				if(this.left_tile.funiture == null){
					this.left_tile.check_area(monitor, true);
				}
				else if(this.left_tile.funiture.id == 0){
					left_wall = true;
				}
				else if(this.left_tile.funiture.id == 1){
					left_wall = true;
					if(this.left_tile.outer_wall){
						monitor.found_exit = true;
						monitor.check_status();
					}
					else{
						this.left_tile.check_area(monitor, false);
					}
				}
				if(this.right_tile.funiture == null){
					this.right_tile.check_area(monitor, true);
				}
				else if(this.right_tile.funiture.id == 0){
					right_wall = true;
				}
				else if(this.right_tile.funiture.id == 1){
					right_wall = true;
					if(this.right_tile.outer_wall){
						monitor.found_exit = true;
						monitor.check_status();
					}
					else{
						this.right_tile.check_area(monitor, false);
					}
				}
				if(this.room != null){
					monitor.room_empty = false;
				}
				monitor.wall_complete = this.check_wall_compleat(top_wall, bot_wall, left_wall, right_wall);;
				monitor.check_status();
				if(this.monitor.last_status){
					return 1;
				}
				else{
					return 2;
				}
			}
			else{
				if(this.room != null){
					this.monitor.found_exit = true;
					this.monitor.check_status();
				}
				else{
					if(top_tile.funiture == null){
						top_tile.check_area(monitor, false);
					}
					else if(top_tile.funiture.id == 1){
						if(top_tile.outer_wall){
							monitor.found_exit = true;
							monitor.check_status();
						}
						else{
							top_tile.check_area(monitor, false);
						}
					}
					if(bot_tile.funiture == null){
						bot_tile.check_area(monitor, true);
					}
					else if(bot_tile.funiture.id == 1){
						if(bot_tile.outer_wall){
							monitor.found_exit = true;
							monitor.check_status();
						}
						else{
							bot_tile.check_area(monitor, false);
						}
					}
					if(left_tile.funiture == null){
						left_tile.check_area(monitor, true);
					}
					else if(left_tile.funiture.id == 1){
						if(left_tile.outer_wall){
							monitor.found_exit = true;
							monitor.check_status();
						}
						else{
							left_tile.check_area(monitor, false);
						}
					}
					if(right_tile.funiture == null){
						right_tile.check_area(monitor, true);
					}
					else if(right_tile.funiture.id == 1){
						if(right_tile.outer_wall){
							monitor.found_exit = true;
							monitor.check_status();
						}
						else{
							right_tile.check_area(monitor, false);
						}
					}
				}
				return 0;
			}
		}
		else{
			if(this.monitor.last_status){
				return 1;
			}
			else{
				return 2;
			}
		}
	}
	
	this.check_wall_compleat = function(top_wall, bot_wall, left_wall, right_wall){
		if(top_wall && !bot_wall && left_wall && right_wall){
			if(this.top_tile.right_tile.room == null && this.top_tile.right_tile.funiture != null && this.top_tile.right_tile.funiture.id == 0 &&
			   this.top_tile.left_tile.room == null && this.top_tile.left_tile.funiture != null && this.top_tile.left_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(top_wall && bot_wall && !left_wall && right_wall){
			if(this.right_tile.bot_tile.room == null && this.right_tile.bot_tile.funiture != null && this.right_tile.bot_tile.funiture.id == 0 &&
			   this.right_tile.top_tile.room == null && this.right_tile.top_tile.funiture != null && this.right_tile.top_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(!top_wall && bot_wall && left_wall && right_wall){
			if(this.bot_tile.left_tile.room == null && this.bot_tile.left_tile.funiture != null && this.bot_tile.left_tile.funiture.id == 0 &&
			   this.bot_tile.right_tile.room == null && this.bot_tile.right_tile.funiture != null && this.bot_tile.right_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(top_wall && bot_wall && left_wall && !right_wall){
			if(this.left_tile.top_tile.room == null && this.left_tile.top_tile.funiture != null && this.left_tile.top_tile.funiture.id == 0 &&
			   this.left_tile.bot_tile.room == null && this.left_tile.bot_tile.funiture != null && this.left_tile.bot_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(top_wall && !bot_wall && !left_wall && right_wall){
			if(this.top_tile.right_tile.room == null && this.top_tile.right_tile.funiture != null && this.top_tile.right_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(!top_wall && bot_wall && !left_wall && right_wall){
			if(this.right_tile.bot_tile.room == null && this.right_tile.bot_tile.funiture != null && this.right_tile.bot_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(!top_wall && bot_wall && left_wall && !right_wall){
			if(this.bot_tile.left_tile.room == null && this.bot_tile.left_tile.funiture != null && this.bot_tile.left_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(top_wall && !bot_wall && left_wall && !right_wall){
			if(this.left_tile.top_tile.room == null && this.left_tile.top_tile.funiture != null && this.left_tile.top_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return true;
		}
	}
	
	this.highlight = function(constructable){
		if(constructable){
			this.own_ui.highlight_status = 1;
			this.action_possible = true;
		}
		else{
			this.own_ui.highlight_status = 2;
		}
		this.own_ui.draw_image();
	}
	
	this.unhighlight = function(){
		this.monitor = null;
		this.own_ui.highlight_status = 0;
		this.action_possible = false;
		this.own_ui.draw_image();
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		this.own_ui.own_parent.tile_click(this);
	}
}

//Klasse für Einrichtungs Objecte
function Funiture(room, id, tile){
	this.id = id;														//ID des Einrichtungsobjekts
	this.room = room;													//Raum_ID des Einrichtungsobjekts
	this.parent_tile = tile; 											//Referenz auf das Tile auf dem die Einrichtung steht
	this.pictur_x;														//X position des Bildausschnittes
	this.pictur_y;														//Y position des Bildausschnittes
	
	this.action_id = 1;													//ID der Momentan laufenden Aktion(0: Ruhezustand 1: im Bau 2: Produzierend 3: Verkauft)
	if(room != null){
		this.time_left = existing_funiture[room.kind_of_room][id].construckion_time;	//Verbleibende Zeit der aktuellen Aktion in Sekunden
	}
	else{
		this.time_left = existing_funiture[0][id].construckion_time;
	}
	//Zeichnet das Einrichtungsobjekt
	this.draw_image = function(x, y){
		//Zeichnet das Objekt wenn es nicht gerade im bau ist
		if(this.action_id == 0){
			game_canvas.drawImage(image_repository.funiture,this.pictur_x, this.pictur_y, 75, 75, x, y, 75, 75);
		}
		else if(this.action_id > 1){
			game_canvas.drawImage(image_repository.funiture_at_work,this.pictur_x, this.pictur_y, 75, 75, x, y, 75, 75);
		}
		
		//Zeichnet die Aktuelle Zeit wenn ein Time läuft
		if(this.action_id != 0){
			var seconds = this.time_left % 60;
			var minutes = ((this.time_left % 3600) - seconds) / 60;
			var hour = (this.time_left - (this.time_left % 3600)) / 3600;
			if(seconds < 10){
				seconds = "0" + seconds;
			}
			if(minutes < 10){
				minutes = "0" + minutes;
			}
			if(hour < 10){
				hour = "0" + hour;
			}
			var time_string = hour + ":" + minutes + ":" + seconds;
			game_canvas.font = "bold 12px Arial";
			game_canvas.fillStyle = "BLACK";
			game_canvas.fillText(time_string, (x + 15), (y + 65));
		}
	}

	//geht eine Sekunde beim Timer weiter
	this.count_down = function(){
		this.time_left--;
		if(this.time_left == 0){
			this.finish_action();
		}
	}

	//Beendet die momentane Aktion
	this.finish_action = function(){
	}
}

//Klasse für den Datentüp Funiture der die Definition eines Einrichtungsobjekts enthält
function Funiture_Data(name, description, price, construckion_time, craftable_wares){
	this.name = name;
	this.description = description;
	this.price = price;
	this.construckion_time = construckion_time;
	this.craftable_wares = craftable_wares;
	
	this.get_construction_time = function(){
		var seconds = this.construckion_time % 60;
		var minutes = ((this.construckion_time % 3600) - seconds) / 60;
		var hour = (this.construckion_time - (this.construckion_time % 3600)) / 3600;
		if(seconds < 10){
			seconds = "0" + seconds;
		}
		if(minutes < 10){
			minutes = "0" + minutes;
		}
		if(hour < 10){
			hour = "0" + hour;
		}
		var time_string = hour + ":" + minutes + ":" + seconds;
		return time_string;
	}
}