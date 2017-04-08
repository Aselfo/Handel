var game_canvas;							//Zeichenfläche der Spielelemente(Untere Zeichenfläche)
var ui_canvas;								//Zeichenfläche der UI_Elemente(Mittlere Zeichenfläche)
var popup_canvas;							//Zeichenfläche für Popup_Fenster und Mouseover Tooltips(Obere Zeichenfläche)
var game = new Game();						//Instanz des Spiels
var head_bar;								//Instanz der Kopfzeile
var windows = [];							//Array mit den Instanzen der Fenster

var mouse_over_tooltip = new Tooltip(); 	//Fenster für mousover tooltips

//Variablen der Maus- und Sichtfeldbewegung
var actual_window = 0;					//Angabe welches Fenster gerade aktiv ist
var mpos_x = 0;							//X Position der Maus
var mpos_y = 0;							//Y Position der Maus

var default_focus;						//default Objekt falls die Maus auf keinem anderen liegt (gegen nullpointer Probleme)
var focus_object						//Objekt auf dem die Maus gerade liegt;

//Spielvariablen
var shop_field = [];

//Spieldatenbanken
var existing_wares = []; 				//Liste aller Existierenden Güter und ihrer Eigenschaften
var existing_funiture = []				//Liste aller Existierenden Einrichtungsgegenständen und ihrer Eigenschaften

var money = 0;							//Momentan vorhandenes Geld

//----------------------------Mouse Listener--------------------------------------------
//Funktion die aufgerufen wird wenn sich die Maus innerhalb des Wrappers bewegt.
var mouse_over_listener = function(event){
	if(actual_window){
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
	windows[actual_window].mouse_up();
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
			
		}
		else if(room.kind_of_room == 1){
			tile.funiture = new Funiture(room, id, tile);
			this.upgrade_to_storage(tile.funiture);
		}
		else if(room.kind_of_room > 1 && room.kind_of_room < 3){
			tile.funiture = new Funiture(room, id, tile);
			this.upgrade_to_production(tile.funiture);
		}
		else if(room.kind_of_room == 3){
			tile.funiture = new Funiture(room, id, tile);
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
				}
			}
			else if(this.top_wall || this.bot_wall){
				if(this.id == 0){
					this.pictur_x = 750;
				}
				else if(this.id == 1){
					this.pictur_x = 900;
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

	//Erstellt einen Neuen Raum 
	this.build_new_room = function(new_room_id){
		var new_room = new Room(rooms.length, new_room_id, this.new_room_member);
		this.new_room_member[0].highlight_crawler(false);
		this.new_room_member.forEach(function(object){
			object.room = new_room;
			object.set_room();
		});
		rooms.push(new_room);
			
		game.windows[actual_window].draw_game_canvas();
	}
	
	this.delete_wall = function(tile){
		if(tile.funiture.top_wall){
			tile.top_tile.funiture.bot_wall = false;
			tile.top_tile.funiture.chose_wall_picture();
		}
		if(tile.funiture.bot_wall){
			tile.bot_tile.funiture.top_wall = false;
			tile.bot_tile.funiture.chose_wall_picture();
		}
		if(tile.funiture.left_wall){
			tile.left_tile.funiture.right_wall = false;
			tile.left_tile.funiture.chose_wall_picture();
		}
		if(tile.funiture.right_wall){
			tile.right_tile.funiture.left_wall = false;
			tile.right_tile.funiture.chose_wall_picture();
		}
		
		if(tile.funiture.id == 0){
			tile.funiture = null;
			tile.own_ui.draw_image();
		}
		else{
			
		}
	}
}

//Erstellt die Liste aller Existierender Waren
/*function define_existing_wares(){
	existing_wares[0] = [];
	existing_wares[0][0] = new Ware("000", "Bronzebarren", 20, 10, "Ein Barren Bronze", [[null, 0]], 10);
	existing_wares[0][1] = new Ware("001", "Eisenbarren", 30, 15, "Ein Barren  Eisen", [[null, 0]], 10);
	existing_wares[0][2] = new Ware("002", "Silberbarren", 50, 25, "Ein Barren reines Silber", [[null, 0]], 10);
	existing_wares[0][3] = new Ware("003", "Goldbarren", 80, 40, "Ein Barren reines Gold", [[null, 0]], 10);
	existing_wares[0][4] = new Ware("004", "Froststahlbarren", 100, 50, "Ein Barren eisverzaubertem Stahl", [[null, 0]], 10);
	existing_wares[0][5] = new Ware("005", "Flammenstahlbarren", 100, 50, "Ein Barren feuerverzaubertem Stahl", [[null, 0]], 10);
	existing_wares[1] = [];
	existing_wares[1][0] = new Ware("100", "Kettenglieder", 30, 15, "Metallringe für Ketten oder Kettenhemden", [["001", 1]], 20);
	existing_wares[2] = [];
	existing_wares[2][0] = new Ware("200", "Helm", 300, 150, "Ein Einfacher Eisenhelm. Er wird in der Schmiede hergestellt und ist in jedem Rüstungsladen erhältlich", [["001", 3]], 60);
	existing_wares[2][1] = new Ware("201", "Kettenhemd", 350, 175, "Ein feingliedrieges Kettenhemd", [["000", 1],["100",2]], 60);
	existing_wares[3] = [];
	existing_wares[3][0] = new Ware("300", "Heilkraut", 10, 5, "Ein Bitters Kraut mit Gelben Blüten", [[null, 0]], 10);
	existing_wares[3][1] = new Ware("301", "Schlafkraut", 15, 7, "Ein lilanes Kraut mit Süsem duft", [[null, 0]], 10);
	existing_wares[3][2] = new Ware("302", "Feuerkraut", 20, 10, "Ein Blume die nur an den Hängen von Vulkankratern Wächst", [[null, 0]], 10);
	existing_wares[3][3] = new Ware("303", "Giftkraut", 20, 10, "Ein Blüte mit hoch giftigem Nectar", [[null, 0]], 10);
	existing_wares[3][4] = new Ware("304", "Manakraut", 15, 5, "Ein gewöhnliches Kraut gerne auch für Tee verwendet", [[null, 0]], 10);
	existing_wares[4] = [];
	existing_wares[5] = [];
	existing_wares[5][0] = new Ware("500", "Heiltrank", 60, 30, "Ein Trank der kleine Wunden heilt", [["300", 1]], 10);
	existing_wares[5][1] = new Ware("501", "Manatrank", 80, 40, "Ein Trank der etwas Mana wiederherstellt", [["304", 2]], 15);
	existing_wares[5][2] = new Ware("502", "Schlafmittel", 70, 35, "Ein Schlafmittel für Schlafprobleme", [["300", 1],["301",1]], 15);
	existing_wares[5][3] = new Ware("503", "Gegengift", 120, 60, "Ein Gegenmittel für die meisten gewöhnlichen Gifte", [["300", 2],["303",1]], 30);
	}
*/	
//Erstellt die Liste aller Existierender Einrichtungsgegenstände
function define_existing_funiture(){
	existing_funiture[0] = []
	existing_funiture[0][0] = new Funiture_Data("Wand", "Eine Soliede Wand zur Raumteilung", 10, 2, []);
	existing_funiture[0][1] = new Funiture_Data("Tür", "Eine Tür", 10, 2, []);
	existing_funiture[1] = []
	existing_funiture[1][0] = new Funiture_Data("Regal", "Ein Regal das bis zu 5 Einheiten von 4 verschiedenen Waren fassen kann", 50, 5, [4, 5]);
	existing_funiture[1][1] = new Funiture_Data("Kiste", "Eine Kiste die bis zu 30 Einheiten einer Ware fassen kann", 10, 5, [1, 30]);
	existing_funiture[2] = []
	existing_funiture[2][0] = new Funiture_Data("Ambos", "Ein Schmiedeambos für Metalarbeiten", 50, 5, ["100","200","201"]);
	existing_funiture[3] = []
	existing_funiture[3][0] = new Funiture_Data("Labortisch", "Ein Labortisch zum Tränke brauen", 50, 5, ["500","501","502","503"]);
	existing_funiture[4] = []
	existing_funiture[4][0] = new Funiture_Data("Aussteller", "Ein Tisch um Waren zum verkauf auszustellen", 50, 5, []);
}

//Läd Speicherdaten
function load_data(){
	var save_data = document.cookie;
	//Wenn keine Daten vorhanden dann default start zustand
	if(save_data == ""){
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
					game.build_funiture(null, 0, shop_field[i * sice_x + j]);
					shop_field[i * sice_x + j].funiture.action_id = 0;
					shop_field[i * sice_x + j].funiture.time_left = 0;
				}
				
			}
		}
		head_bar.update_money(1000);
	}
	//Ansonsten Daten aus Cookie laden
	else{
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
	
	//define_existing_wares();	
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
	
}