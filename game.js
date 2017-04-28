var game_canvas;							//Zeichenfläche der Spielelemente(Untere Zeichenfläche)
var ui_canvas;								//Zeichenfläche der UI_Elemente(Mittlere Zeichenfläche)
var popup_canvas;							//Zeichenfläche für Popup_Fenster und Mouseover Tooltips(Obere Zeichenfläche)
var game = new Game();						//Instanz des Spiels
var head_bar;								//Instanz der Kopfzeile
var windows = [];							//Array mit den Instanzen der Fenster

var mouse_over_tooltip = new Tooltip(); 				//Fenster für mousover tooltips
var popup_message = new Popup_Message();				//Fenster für Popup Nachrichten
var confirm_request_message = new Confirm_Request();	//Fenster für Bestätigungsabfragen

var popup_message_visible = false;						//Flag ob das Popupfenster gerade sichtbar ist

//Variablen der Maus- und Sichtfeldbewegung
var actual_window = 0;					//Angabe welches Fenster gerade aktiv ist
var mpos_x = 0;							//X Position der Maus
var mpos_y = 0;							//Y Position der Maus

var default_focus;						//default Objekt falls die Maus auf keinem anderen liegt (gegen nullpointer Probleme)
var focus_object						//Objekt auf dem die Maus gerade liegt;

//Spielvariablen
var shop_field = [];
var rooms = [];							//Array mit allen aktuell existierenden Raimobjekten
var storage = [];						//Array der Lagerstacks

//Spieldatenbanken
var existing_wares = []; 				//Liste aller Existierenden Güter und ihrer Eigenschaften
var existing_funiture = []				//Liste aller Existierenden Einrichtungsgegenständen und ihrer Eigenschaften

var money = 0;							//Momentan vorhandenes Geld
var workforce = 0;
var free_worker = 0;

//----------------------------Mouse Listener--------------------------------------------
//Funktion die aufgerufen wird wenn sich die Maus innerhalb des Wrappers bewegt.
var mouse_over_listener = function(event){
	if(actual_window > 0){
		var rect = event.target.getBoundingClientRect();
		mpos_x = event.clientX - rect.left;
		mpos_y = event.clientY - rect.top;
		windows[actual_window].mouse_over();
	}
	else{
		var rect = event.target.getBoundingClientRect();
		var old_x = mpos_x;
		var old_y = mpos_y;
		mpos_x = event.clientX - rect.left;
		mpos_y = event.clientY - rect.top;
		windows[actual_window].mouse_over(old_x - mpos_x, old_y - mpos_y);
	}
	
}

//Funktion die aufgerufen wird wenn der Mausbutton innerhalb des Wrappers gedrückt wird.
var mouse_down_listener = function(event){
	windows[actual_window].mouse_down();
}

//Funktion die aufgerufen wird wenn der Mausbutton innerhalb des Wrappers losgelassen wird.
var mouse_up_listener = function(event){
	if(popup_message_visible){
		next_message();
	}
	else{
		windows[actual_window].mouse_up();
	}
}

//Zeigen einer Popup_Message
var show_message = function(message){
	popup_message.add_message(message);
}

var next_message = function(){
	popup_message.next_message();
}

function Game(){
	this.draw_window = function(){
		//zeichne das Gesammte Bild neu
		head_bar.draw_head_bar();
		head_bar.update_money(0);
		windows[actual_window].draw_game_canvas();
		windows[actual_window].draw_ui_canvas();
	}
	
	//Erzeige Funiture Objekt und Speichert es im Array
	this.build_funiture = function(room, id, tile){
		if(room == null){
			if(id == 0){
				tile.funiture = new Funiture(room, id, tile);
				this.upgrade_to_wall(tile.funiture);
			}
			else{
				this.upgrade_to_door(tile.funiture);
			}
			tile.wall_construcktable();
		}
		else if(room.kind_of_room == 1){
			tile.funiture = new Funiture(room, id, tile);
			tile.funiture.pictur_x = id * 75
			tile.funiture.pictur_y = room.kind_of_room * 75;
			this.upgrade_to_storage(tile.funiture);
		}
		else if(room.kind_of_room > 1 && room.kind_of_room < 4){
			tile.funiture = new Funiture(room, id, tile);
			tile.funiture.pictur_x = id * 75
			tile.funiture.pictur_y = room.kind_of_room * 75;
			this.upgrade_to_production(tile.funiture);
		}
		else if(room.kind_of_room == 4){
			tile.funiture = new Funiture(room, id, tile);
			tile.funiture.pictur_x = id * 75
			tile.funiture.pictur_y = room.kind_of_room * 75;
			this.upgrade_to_shop(tile.funiture);
		}
		
		tile.own_ui.draw_image();
	}
	
	this.upgrade_to_wall = function(funiture){
		
		funiture.top_wall = false;							//Flag ob oberhalb dieser Wand noch eine Wand ist
		funiture.bot_wall = false;							//Flag ob unter dieser Wand noch eine Wand ist
		funiture.left_wall = false;							//Flag ob links von dieser Wand noch eine Wand ist
		funiture.right_wall = false;						//Flag ob rechts von dieser Wand noch eine Wand ist
		
		funiture.pictur_y = 0;
		
		//Entscheidet welches Mauerbild angezeigt wird
		funiture.chose_wall_picture = function(){
			if(this.top_wall && this.bot_wall && this.left_wall && this.right_wall){
				this.pictur_x = 0;
			}
			else if(this.top_wall && this.bot_wall && this.left_wall && !this.right_wall){
				this.pictur_x = 75;
			}
			else if(!this.top_wall && this.bot_wall && this.left_wall && this.right_wall){
				this.pictur_x = 150;
			}
			else if(this.top_wall && !this.bot_wall && this.left_wall && this.right_wall){
				this.pictur_x = 225;
			}
			else if(this.top_wall && this.bot_wall && !this.left_wall && this.right_wall){
				this.pictur_x = 300;
			}
			else if(this.top_wall && !this.bot_wall && !this.left_wall && this.right_wall){
				this.pictur_x = 375;
			}
			else if(!this.top_wall && this.bot_wall && !this.left_wall && this.right_wall){
				this.pictur_x = 450;
			}
			else if(!this.top_wall && this.bot_wall && this.left_wall && !this.right_wall){
				this.pictur_x = 525;
			}
			else if(this.top_wall && !this.bot_wall && this.left_wall && !this.right_wall){
				this.pictur_x = 600;
			}
			else if(this.left_wall || this.right_wall){
				if(this.id == 0){
					this.pictur_x = 675;
				}
				else  if(this.id == 1){
					this.pictur_x = 825;
					funiture.door_direction = false;
				}
			}
			else if(this.top_wall || this.bot_wall){
				if(this.id == 0){
					this.pictur_x = 750;
				}
				else if(this.id == 1){
					this.pictur_x = 900;
					funiture.door_direction = true;
				}
			}
			else if(!this.top_wall && !this.bot_wall && !this.left_wall && !this.right_wall){
				if(this.id == 0){
					this.pictur_x = 975;
				}
			}
			this.parent_tile.own_ui.draw_image();
		}
		
		//Zählt wie viele Angrenzende Wände diese Wand hat und gibt diese Zahl zurück
		funiture.count_connections = function(){
			var walls = 0;
			if(this.top_wall){
				walls++;
			}
			if(this.bot_wall){
				walls++;
			}
			if(this.left_wall){
				walls++;
			}
			if(this.right_wall){
				walls++;
			}
			return walls;
		}
	
		funiture.finish_action = function(){
			if(this.action_id == 1){
				this.action_id = 0;
				this.parent_tile.status_check();
			}
		}
		
		if(funiture.parent_tile.top_tile != null && funiture.parent_tile.top_tile.room == null && funiture.parent_tile.top_tile.funiture != null && funiture.parent_tile.top_tile.funiture.id >= 0){
			funiture.top_wall = true;
			funiture.parent_tile.top_tile.funiture.bot_wall = true;
			funiture.parent_tile.top_tile.funiture.chose_wall_picture();
		}
		
		if(funiture.parent_tile.bot_tile != null && funiture.parent_tile.bot_tile.room == null && funiture.parent_tile.bot_tile.funiture != null && funiture.parent_tile.bot_tile.funiture.id >= 0){
			funiture.bot_wall = true;
			funiture.parent_tile.bot_tile.funiture.top_wall = true;
			funiture.parent_tile.bot_tile.funiture.chose_wall_picture();
		}
		
		if(funiture.parent_tile.left_tile != null && funiture.parent_tile.left_tile.room == null && funiture.parent_tile.left_tile.funiture != null && funiture.parent_tile.left_tile.funiture.id >= 0){
			funiture.left_wall = true;
			funiture.parent_tile.left_tile.funiture.right_wall = true;
			funiture.parent_tile.left_tile.funiture.chose_wall_picture();
		}
		
		if(funiture.parent_tile.right_tile != null && funiture.parent_tile.right_tile.room == null && funiture.parent_tile.right_tile.funiture != null && funiture.parent_tile.right_tile.funiture.id >= 0){
			funiture.right_wall = true;
			funiture.parent_tile.right_tile.funiture.left_wall = true;
			funiture.parent_tile.right_tile.funiture.chose_wall_picture();
		}
		
		funiture.chose_wall_picture();
	}
		
	this.upgrade_to_door = function(funiture){
		if(funiture.top_wall && funiture.bot_wall && !funiture.left_wall && !funiture.right_wall){
			funiture.door_direction = true;
		}
		else if(!funiture.top_wall && !funiture.bot_wall && funiture.left_wall && funiture.right_wall){
			funiture.door_direction = false;
		}
		
		funiture.id = 1;
		funiture.action_id = 1;
		funiture.time_left = existing_funiture[0][1].construckion_time;
		funiture.chose_wall_picture();
	}	
		
	this.upgrade_to_storage = function(funiture){
		funiture.storag_stacks = [];
		for(var i = 0; i < existing_funiture[funiture.room.kind_of_room][funiture.id].craftable_wares[0]; i++){
			var stack = new Ware_Stack(funiture, existing_funiture[funiture.room.kind_of_room][funiture.id].craftable_wares[1]);
			funiture.storag_stacks.push(stack);
		}
		funiture.finish_action = function(){
			if(this.action_id == 1){
				this.action_id = 0;
				this.parent_tile.status_check();
				game.finish_construction(this);
			}
		}
		if(actual_window != 0){
			windows[actual_window].draw_ui_canvas();
		}
	}
		
	this.upgrade_to_shop = function(funiture){
		
		funiture.new_offer = 0;
		funiture.offer_quantity = 0;
		funiture.sell_price = 0;
		funiture.sold = true;
		
		//Beendet die momentane Aktion
		funiture.finish_action = function(){
			if(this.action_id == 1){
				game.finish_construction(this);
				this.action_id = 0;
			}
			else if(this.action_id == 2){
				this.action_id = 0;
				var sell_chance = get_ware_data(this.new_product.id).sell_price / this.sell_price;
				var hit = Math.random();
				if(hit < sell_chance){
					this.sold = true;
					money += this.sell_price;
					game.head_bar.update_money();
					if(this.product_quantity > 0){
						this.product_quantity--;
						this.offer_for_sale(this.new_product);
					}
					else if(this.product_quantity < 0){
						this.offer_for_sale(this.new_product);
					}
				}
				else{
					this.sold = false;
					this.offer_for_sale(this.new_product);
				}
			}
		}
	
		//Beginnt ein neues Angebot
		funiture.offer_for_sale = function(ware){
			if(this.sold){
				if(game.get_ware_from_store([[ware.id, 1]])){
					this.action_id = 2;
					this.new_product = ware;
					this.time_left = 10;
				}
				else if(this.product_quantity >= 0){
					show_message("Unzureichende Waren für Verkaufsauftrag");
				}
			}
			else{
				this.action_id = 2;
				this.new_product = ware;
				this.time_left = 10;
			}
		}
	
		funiture.abort_action = function(){
			game.store_ware(this.new_product.id, 1)
			this.time_left = 0;
			this.action_id = 0;
		}
	}
	
	this.upgrade_to_production = function(funiture){
		
		funiture.new_product = 0;
		funiture.product_quantity = 0;
		funiture.production_pause = false;
		
		//Beginnt eine neue Produktion
		funiture.start_production = function(ware){
			if(free_worker > 0 && game.get_ware_from_store(get_ware_data(ware.id).production_cost)){
				free_worker--;
				game.head_bar.update_workforce();
				this.action_id = 2;
				this.new_product = ware;
				this.time_left = get_ware_data(ware.id).production_time;
			}
			else if(free_worker <= 0){
				show_message("Kein Freier Arbeiter");
			}
			else if(this.product_quantity >= 0){
				show_message("Unzureichende Rohstoffe für die Produktionsauftrag");
			}
		}
		
		//Beendet die momentane Aktion
		funiture.finish_action = function(){
			if(this.action_id == 1){
				this.action_id = 0;
				this.parent_tile.status_check();
			}
			else if(this.action_id == 2){
				if(game.store_ware(this.new_product.id, 1)){
					this.action_id = 0;
					free_worker++;
					game.head_bar.update_workforce();
					if(this.product_quantity > 0){
						this.product_quantity--;
						this.start_production(this.new_product);
					}
					else if(this.product_quantity < 0){
						this.start_production(this.new_product);
					}
				}
				else{
					this.production_pause = true;
				}
			}
		}
	
		funiture.abort_action = function(){
			free_worker++;
			game.head_bar.update_workforce();
			this.time_left = 0;
			this.action_id = 0;
		}
	}

	this.set_funiture = function(room, id, tile){
		if(room == null){
			if(id == 0){
				tile.funiture = new Funiture(room, id, tile);
				this.upgrade_to_wall(tile.funiture);
			}
			else{
				tile.funiture = new Funiture(room, id, tile);
				this.upgrade_to_wall(tile.funiture);
				this.upgrade_to_door(tile.funiture);
			}
		}
		else if(room == 1){
			tile.funiture = new Funiture(null, id, tile);
			tile.funiture.pictur_x = id * 75
			tile.funiture.pictur_y = room * 75;
			this.upgrade_to_storage(tile.funiture);
		}
		else if(room > 1 && room < 4){
			tile.funiture = new Funiture(null, id, tile);
			tile.funiture.pictur_x = id * 75
			tile.funiture.pictur_y = room * 75;
			this.upgrade_to_production(tile.funiture);
		}
		else if(room == 4){
			tile.funiture = new Funiture(null, id, tile);
			tile.funiture.pictur_x = id * 75
			tile.funiture.pictur_y = room * 75;
			this.upgrade_to_shop(tile.funiture);
		}
		tile.funiture.action_id = 0;
		tile.funiture.time_left = 0;
		tile.own_ui.draw_image();
	}
	
	//Aktiviert Seiteneffecte von Funitur nach vertigstellung wenn sie welche besitzen
	this.finish_construction = function(source){
		if(source.room.kind_of_room == 1){
			storage = storage.concat(source.storag_stacks);
			if(actual_window != 0){
				game.draw_window();
			}
		}
	}
	
	//Erstellt einen Neuen Raum 
	this.build_room = function(member, new_room_id){
		var new_room = new Room(rooms.length, new_room_id, member);
		member.forEach(function(object){
			object.room = new_room;
			object.set_room();
		});
		rooms.push(new_room);
		windows[actual_window].draw_game_canvas();
	}
	
	//Löscht eine Wand
	this.delete_wall = function(tile){
		var room = null;
		if(tile.funiture.top_wall){
			tile.top_tile.funiture.bot_wall = false;
			tile.top_tile.funiture.chose_wall_picture();
		}
		else{
			if(tile.top_tile.room != null){
				room = tile.top_tile.room;
			}
		}
		if(tile.funiture.bot_wall){
			tile.bot_tile.funiture.top_wall = false;
			tile.bot_tile.funiture.chose_wall_picture();
		}
		else{
			if(tile.bot_tile.room != null){
				room = tile.bot_tile.room;
			}
		}
		if(tile.funiture.left_wall){
			tile.left_tile.funiture.right_wall = false;
			tile.left_tile.funiture.chose_wall_picture();
		}
		else{
			if(tile.left_tile.room != null){
				room = tile.left_tile.room;
			}
		}
		if(tile.funiture.right_wall){
			tile.right_tile.funiture.left_wall = false;
			tile.right_tile.funiture.chose_wall_picture();
		}
		else{
			if(tile.right_tile.room != null){
				room = tile.right_tile.room;
			}
		}
		
		tile.funiture = null;
		if(room != null){
			tile.room_construcktable();
			room.member = tile.monitor.member;
			room.member.forEach(function(object){
				object.room = room;
				object.set_room();
				object.unhighlight();
			});
		}
		tile.own_ui.draw_image();
	}

	//Löscht einen Raum
	this.delete_room = function(tile){
		tile.room.delete_itself();
		var array = [];
		for(var i = 0; i < rooms.length; i++){
			if(tile.room != rooms[i]){
				array.push(rooms[i]);
			}
		}
		rooms = array;
	}

	//Löscht Funiture Objekte
	this.delete_funiture = function(tile){
		if(tile.funiture.room.kind_of_room == 1){
			this.delete_storage(tile);
		}
		else{
			tile.funiture = null;
			tile.own_ui.draw_image();
		}
	}
	
	//Löscht Funiture Objekte das Lagerplätz erzeug
	this.delete_storage = function(tile){
		if(this.storage_deletable(tile.funiture, false)){
			for(var i = 0; i < tile.funiture.storag_stacks.length; i++){
				var new_array = [];
				for(var j = 0; j < storage.length; j++){
					if(storage[j] != tile.funiture.storag_stacks[i]){
						new_array.push(storage[j]);
					}
				}
				storage = new_array;
			}
			this.storage_deletable(tile.funiture, true);
			tile.funiture = null;
			tile.own_ui.draw_image();
		}
	}
	
	//Prüft ob eine Lagereinrichtung gelöscht werden kann
	this.storage_deletable = function(funiture, check_delet){
		var deletable = true;
		var funiture_empty = true;
		var ware_stacks = funiture.storag_stacks;
		var blocking_wares = [];
		for(var i = 0; i < ware_stacks.length; i++){
			if(ware_stacks[i].ware != null){
				funiture_empty = false;
				var enlisted = false;
				for(var j = 0; j < blocking_wares.length; j++){
					if(blocking_wares[j][0].id == ware_stacks[i].ware.id){
						blocking_wares[j][1] += ware_stacks[i].stored_amount;
						enlisted = true;
						break;
					}
				}
				if(!enlisted){
					blocking_wares.push([ware_stacks[i].ware, ware_stacks[i].stored_amount]);
				}
			}
			else{
			}
		}
		if(!funiture_empty){
			var empty_space = [];
			for(var i = 0; i < storage.length; i++){
				if(ware_stacks.indexOf(storage[i]) == (-1)){
					if(storage[i].ware == null){
						empty_space.push(storage[i]);
					}
					else{
						for(var j = 0; j < blocking_wares.length; j++){
							if(storage[i].ware.id == blocking_wares[j][0].id && storage[i].stored_amount < storage[i].stack_size){
								if(blocking_wares[j][1] >= (storage[i].stack_size - storage[i].stored_amount)){
									blocking_wares[j][1] -= storage[i].stack_size - storage[i].stored_amount;
									if(check_delet){
										storage[i].stored_amount = storage[i].stack_size;
									}
								}
								else{
									if(check_delet){
										storage[i].stored_amount += blocking_wares[j][1];
									}
									blocking_wares[j][1] = 0;
								}	
							}
						}
					}
				}
			}
			var sorted_blocking_array = [];
			while(blocking_wares.length > 0){
				var bigest_stack = [null,0];
				for(var i = 0; i < blocking_wares.length; i++){
					if(bigest_stack[1] < blocking_wares[i][1]){
						bigest_stack = blocking_wares[i];
					}
				}
				var new_array = [];
				for(var i = 0; i < blocking_wares.length; i++){
					if(blocking_wares[i] != bigest_stack){
						new_array.push(blocking_wares[i]);
					}
				}
				blocking_wares = new_array;
				sorted_blocking_array.push(bigest_stack);
			}
			var sorted_storage_array = [];
			var storage_copy = empty_space;
			while(storage_copy.length > 0){
				var bigest_storage = storage_copy[0];
				for(var i = 0; i < storage_copy.length; i++){
					if(bigest_storage.stack_size < storage_copy[i].stack_size){
						bigest_storage = storage_copy[i];
					}
				}
				var new_array = [];
				for(var i = 0; i < storage_copy.length; i++){
					if(storage_copy[i] != bigest_storage){
						new_array.push(storage_copy[i]);
					}
				}
				storage_copy = new_array;
				sorted_storage_array.push(bigest_storage);
			}
			
			for(var i = 0; i < sorted_blocking_array.length; i++){
				for(var j = 0; j < sorted_storage_array.length; j++){
					if(sorted_storage_array[j].stack_size >= sorted_blocking_array[i][1]){
						if(check_delet){
							sorted_storage_array[j].ware = sorted_blocking_array[i][0];
							sorted_storage_array[j].stored_amount = sorted_blocking_array[i][1];
						}
						sorted_blocking_array[i][1] = 0;
						var new_array = [];
						for(var i = 0; i < sorted_storage_array.lenght; i++){
							if(sorted_storage_array[i] != sorted_storage_array[j]){
								new_array.push(sorted_storage_array[i]);
							}
						}
						sorted_storage_array = new_array;
						break;
					}
					else{
						sorted_blocking_array[i][1] -= sorted_storage_array[j].stack_size;
						if(check_delet){
							sorted_storage_array[j].ware = sorted_blocking_array[i][0];
							sorted_storage_array[j].stored_amount = sorted_storage_array[j].stack_size;
						}
						var new_array = [];
						for(var i = 0; i < sorted_storage_array.lenght; i++){
							if(sorted_storage_array[i] != sorted_storage_array[j]){
								new_array.push(sorted_storage_array[i]);
							}
						}
						sorted_storage_array = new_array;
					}
				}
			}
			for(var i = 0; i < sorted_blocking_array.length; i++){
				if(sorted_blocking_array[i][1] != 0){
					deletable = false;
					break;
				}
			}
			
		}
		return deletable;
	}
	
	//neuen Arbeiter einstellen
	this.hire_worker = function(){
		if(money >= 100){
			money -= 100;
			workforce++;
			free_worker++;
			game.head_bar.update_workforce();
			game.head_bar.update_money();
		}
	}
	
	//Arbeiter entlassen
	this.fire_worker = function(){
		if(workforce > 0 && free_worker > 0){
			workforce--;
			free_worker--;
			game.head_bar.update_workforce();
		}
	}
	
	//Lagert eine produzierte oder gekaufte Ware ein
	this.store_ware = function(ware_category, ware_id, amount){
		var place_found = false;
		var new_values = [];
		var new_ids = [];
		
		for(var i = 0; i < storage.length; i++){
			new_values[i] = storage[i].stored_amount;
			new_ids[i] = storage[i].ware;
		}
		
		for(var i = 0; i < storage.length; i++){
			if(new_ids[i] != null && storage[i].ware.id == ware_id && storage[i].ware.category_id == ware_category){
				if(storage[i].stack_size >= new_values[i] + amount){
					new_values[i] += amount;
					amount = 0;
					place_found = true;
					break;
				}
				else if(storage[i].stack_size != new_values[i]){
					amount -= storage[i].stack_size - new_values[i];
					new_values[i] = storage[i].stack_size;
				}
			}
		}
		if(!place_found){
			for(var i = 0; i < storage.length; i++){
				if(new_ids[i] == null){
					new_ids[i] = existing_wares[ware_category][ware_id];
					if(storage[i].stack_size >= amount){
						new_values[i] += amount;
						amount = 0;
						place_found = true;
						break;
					}
					else{
						amount -= storage[i].stack_size;
						new_values[i] = storage[i].stack_size;
					}
				}
			}
		}
		if(!place_found){
			//show_message("Lager voll");
		}
		else{
			for(var i = 0; i < storage.length; i++){
				storage[i].stored_amount = new_values[i];
				storage[i].ware = new_ids[i];
			}
		}
		return place_found;
	}
}

//wechselt zwischen verschiedenen fenstern
function switch_window(window_id){
	actual_window = window_id;
	game.draw_window();
}

//Erstellt die Liste aller Existierender Waren
function define_existing_wares(){
	existing_wares[0] = [];
	existing_wares[0][0] = new Ware(0, 0, "Bronzebarren", 20, 10, "Ein Barren Bronze", [[null, null, 0]], 10);
	existing_wares[0][1] = new Ware(0, 1, "Eisenbarren", 30, 15, "Ein Barren  Eisen", [[null, null, 0]], 10);
	existing_wares[0][2] = new Ware(0, 2, "Silberbarren", 50, 25, "Ein Barren reines Silber", [[null, null, 0]], 10);
	existing_wares[0][3] = new Ware(0, 3, "Goldbarren", 80, 40, "Ein Barren reines Gold", [[null, null, 0]], 10);
	existing_wares[0][4] = new Ware(0, 4, "Froststahlbarren", 100, 50, "Ein Barren eisverzaubertem Stahl", [[null, null, 0]], 10);
	existing_wares[0][5] = new Ware(0, 5, "Flammenstahlbarren", 100, 50, "Ein Barren feuerverzaubertem Stahl", [[null, null, 0]], 10);
	existing_wares[1] = [];
	existing_wares[1][0] = new Ware(1, 0, "Kettenglieder", 30, 15, "Metallringe für Ketten oder Kettenhemden", [[0, 1, 1]], 20);
	existing_wares[2] = [];
	existing_wares[2][0] = new Ware(2, 0, "Helm", 300, 150, "Ein Einfacher Eisenhelm. Er wird in der Schmiede hergestellt und ist in jedem Rüstungsladen erhältlich", [["001", 3]], 60);
	existing_wares[2][1] = new Ware(2, 1, "Kettenhemd", 350, 175, "Ein feingliedrieges Kettenhemd", [[0, 0, 1],[1, 0,2]], 60);
	existing_wares[3] = [];
	existing_wares[3][0] = new Ware(3, 0, "Heilkraut", 10, 5, "Ein Bitters Kraut mit Gelben Blüten", [[null, null, 0]], 10);
	existing_wares[3][1] = new Ware(3, 1, "Schlafkraut", 15, 7, "Ein lilanes Kraut mit Süsem duft", [[null, null, 0]], 10);
	existing_wares[3][2] = new Ware(3, 2, "Feuerkraut", 20, 10, "Ein Blume die nur an den Hängen von Vulkankratern Wächst", [[null, null, 0]], 10);
	existing_wares[3][3] = new Ware(3, 3, "Giftkraut", 20, 10, "Ein Blüte mit hoch giftigem Nectar", [[null, null, 0]], 10);
	existing_wares[3][4] = new Ware(3, 4, "Manakraut", 15, 5, "Ein gewöhnliches Kraut gerne auch für Tee verwendet", [[null, null, 0]], 10);
	existing_wares[4] = [];
	existing_wares[5] = [];
	existing_wares[5][0] = new Ware(5, 0, "Heiltrank", 60, 30, "Ein Trank der kleine Wunden heilt", [[3, 0, 1]], 10);
	existing_wares[5][1] = new Ware(5, 1, "Manatrank", 80, 40, "Ein Trank der etwas Mana wiederherstellt", [[3, 4, 2]], 15);
	existing_wares[5][2] = new Ware(5, 2, "Schlafmittel", 70, 35, "Ein Schlafmittel für Schlafprobleme", [[3, 0, 1],[3, 1, 1]], 15);
	existing_wares[5][3] = new Ware(5, 3, "Gegengift", 120, 60, "Ein Gegenmittel für die meisten gewöhnlichen Gifte", [[3, 0, 2],[3, 3, 1]], 30);
}	
	
//Erstellt die Liste aller Existierender Einrichtungsgegenstände
function define_existing_funiture(){
	existing_funiture[0] = []
	existing_funiture[0][0] = new Funiture_Data("Wand", "Eine Soliede Wand zur Raumteilung", 10, 2, []);
	existing_funiture[0][1] = new Funiture_Data("Tür", "Eine Tür", 10, 2, []);
	existing_funiture[1] = []
	existing_funiture[1][0] = new Funiture_Data("Regal", "Ein Regal das bis zu 5 Einheiten von 4 verschiedenen Waren fassen kann", 50, 5, [4, 5]);
	existing_funiture[1][1] = new Funiture_Data("Kiste", "Eine Kiste die bis zu 30 Einheiten einer Ware fassen kann", 10, 5, [1, 30]);
	existing_funiture[2] = []
	existing_funiture[2][0] = new Funiture_Data("Ambos", "Ein Schmiedeambos für Metalarbeiten", 50, 5, [[1, 0], [2, 0],[2, 1]]);
	existing_funiture[3] = []
	existing_funiture[3][0] = new Funiture_Data("Labortisch", "Ein Labortisch zum Tränke brauen", 50, 300, [[5, 0],[5, 1],[5, 2],[5, 3]]);
	existing_funiture[4] = []
	existing_funiture[4][0] = new Funiture_Data("Aussteller", "Ein Tisch um Waren zum verkauf auszustellen", 50, 5, []);
}

//Läd Speicherdaten
function load_data(){
	var save_data = document.cookie;
	//Wenn keine Daten vorhanden dann default start zustand
	if(true){
		var sice_x = 7;
		var sice_y = 6;
			
		//Rand der auf den Seiten des Spielfelds bleibt berechnen
		var border_left = (1200-sice_x*75)/2;
		if(border_left < 0){
			border_left = 0;
		}
		var border_top = (590-sice_y*75)/2;
		if(border_top < 0){
			border_top = 0;
		}	
	
		for(var i = 0; i < sice_y; i++){
			for(var j = 0; j < sice_x; j++){
				shop_field[i * sice_x + j] = new Shop_Tile(j, i);
				windows[0].game_content[i * sice_x + j] = new Shop_Tile_UI(j, i, border_left, border_top, windows[0], shop_field[i * sice_x + j]);
				shop_field[i * sice_x + j].own_ui = windows[0].game_content[i * sice_x + j];
				var wall = false;
				if(i != 0){	
					shop_field[i * sice_x + j].top_tile = shop_field[(i - 1) * sice_x + j];
					shop_field[(i - 1) * sice_x + j].bot_tile = shop_field[i * sice_x + j];
					if(i == (sice_y - 1)){
						shop_field[i * sice_x + j].outer_wall = true;
						wall = true;
					}
				}
				else{
					shop_field[i * sice_x + j].outer_wall = true;
					wall = true;				
				}
				if(j != 0){
					shop_field[i * sice_x + j].left_tile = shop_field[i * sice_x + (j - 1)];
					shop_field[i * sice_x + (j - 1)].right_tile = shop_field[i * sice_x + j];
					if(j == (sice_x - 1)){
						shop_field[i * sice_x + j].outer_wall = true;
						wall = true;
					}
				}
				else{
					shop_field[i * sice_x + j].outer_wall = true;
					wall = true;
				}
				
				if(wall){
					game.set_funiture(null, 0, shop_field[i * sice_x + j]);
				}
			}
		}
		head_bar.update_money(1000);
	}
	//Ansonsten Daten aus Cookie laden
	else{
		var sice_x = 7;
		var sice_y = 6;
			
		//Rand der auf den Seiten des Spielfelds bleibt berechnen
		var border_left = (1200-sice_x*75)/2;
		if(border_left < 0){
			border_left = 0;
		}
		var border_top = (590-sice_y*75)/2;
		if(border_top < 0){
			border_top = 0;
		}
		save_data = save_data.split(":");
		head_bar.update_money(parseInt(save_data[0]));
		head_bar.update_workforce(parseInt(save_data[1]));
		
		var room_data = save_data[2].split("|");
		var room_member = [];
		for(i in room_data){
			room_member[i] = [];
		}
		
		var all_field_data = save_data[3].split("|");
		var x = 0;
		var y = 0;
		for(i in all_field_data){
			var field_data = all_field_data[i].split(",");
			for(j in field_data){
				if(field_data[j] != ""){
					field_data[j] = parseInt(field_data[j]);
				}
				else{
					field_data[j] = null;
				}
			}
			
			shop_field[i] = new Shop_Tile(x, y);
			windows[0].game_content[i] = new Shop_Tile_UI(x, y, border_left, border_top, windows[0], shop_field[i]);
			shop_field[i].own_ui = windows[0].game_content[i];
			if(y != 0){	
				shop_field[i].top_tile = shop_field[(y - 1) * sice_x + x];
				shop_field[(y - 1) * sice_x + x].bot_tile = shop_field[i];
				if(y == (sice_y - 1)){
					shop_field[y * sice_x + x].outer_wall = true;
				}
			}
			else{
				shop_field[i].outer_wall = true;
			}
			if(x != 0){
				shop_field[i].left_tile = shop_field[i-1];
				shop_field[i-1].right_tile = shop_field[i];
				if(x == (sice_x - 1)){
					shop_field[i].outer_wall = true;
				}
			}
			else{
				shop_field[i].outer_wall = true;
			}
			if(field_data[0] != null){
				room_member[field_data[0]].push(shop_field[i]);
			}
			if(field_data[1] != null){
				game.set_funiture(room_data[field_data[0]], field_data[1], shop_field[i]);
				shop_field[i].funiture.action_id = field_data[2];
				shop_field[i].funiture.time_left = field_data[3];
			}
			x++;
			if(x == sice_x){
				x = 0;
				y++;
			}
		}
		
		for(i in room_data){
			game.build_room(room_member[i], room_data[i]);
		}
	}
}

function init(){
	document.getElementById("wrapper").addEventListener("mousemove",mouse_over_listener,false);
	document.getElementById("wrapper").addEventListener("mousedown",mouse_down_listener,false);
	document.getElementById("wrapper").addEventListener("mouseup",mouse_up_listener,false);
	addEventListener("unload", close_game, false);
	game_canvas = document.getElementById('game_canvas');
	if(game_canvas.getContext){
		game_canvas = game_canvas.getContext('2d');
	}
	ui_canvas = document.getElementById('ui_canvas');
	if(ui_canvas.getContext){
		ui_canvas = ui_canvas.getContext('2d');
	}
	popup_canvas = document.getElementById('popup_canvas');
	if(popup_canvas.getContext){
		popup_canvas = popup_canvas.getContext('2d');
	}
	
	define_existing_wares();	
	define_existing_funiture();
	
	head_bar = new Head_Bar();
	windows[0] = new Window_Shop();
	windows[0].init_window();
	windows[1] = new Window_Storage();
	windows[1].init_window();
	windows[2] = new Window_Market();
	windows[2].init_window();
	
	load_data();
	head_bar.update_money(0);
	default_focus = new UI_Button(1000, 0, 0, windows[0], "");
	focus_object = default_focus
	game.draw_window();
}

function close_game(){
	var cookie = money + ":" + workforce + ":";
	for(var i = 0; i < rooms.length; i++){
		cookie = cookie + rooms[i].kind_of_room + "|";
	}
	if(rooms.length > 0){
		cookie = cookie.slice(0, -1);
	}
	cookie = cookie + ":";
	for(var i = 0; i < shop_field.length; i++){
		if(shop_field[i].room != null){
			cookie = cookie + shop_field[i].room.id + ",";
		}
		else{
			cookie = cookie + ",";
		}
		if(shop_field[i].funiture != null){
			cookie = cookie + shop_field[i].funiture.id + "," + shop_field[i].funiture.action_id + "," + shop_field[i].funiture.time_left;
		}
		cookie = cookie + "|";
	}
	cookie = cookie.slice(0, -1);
	cookie = cookie + "; expires=Thu, 18 Dec 2020 12:00:00 UTC";
	console.log(cookie);
	document.cookie = cookie;
}