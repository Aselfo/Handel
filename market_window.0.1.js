//Klasse die, die Marktansicht definiert und verwaltet
function Window_Market(){
	
	this.ui_buttons = [];											//Array mit allen Knopf Objekten
	this.ui_parts = [];												//Array mit allen Ui_Objekten	
	this.storage_fields = [];
	this.buy_screen;
	this.sell_screen;
	
	this.selected_storage = null;
	var actual_visible_storage = 0;
	
	var sell_price = 0;
	var sell_quantity = 0;
	
	//iniziert das Fenster
	this.init_window = function(){
		
		//Kauffenster
		this.buy_screen = new Buy_Screen(this);
		
		//Verkaufsfenster
		this.sell_screen = new Sell_Screen(this);
		
		//Grundobjecte
		this.ui_parts[0] = new Ui_Button(0, 5, 110, this, "Einkauf");
		this.ui_parts[1] = new Ui_Button(1, 210, 110, this, "Verkauf");
		
		this.ui_parts[2] = this.buy_screen;
	}
	
	this.draw_game_canvas = function(){
		game_canvas.beginPath();
		game_canvas.rect(0, 60, 1200, 590);
		game_canvas.fillStyle = "green";
		game_canvas.fill();
	}
	
	//Zeichnet das Fenster neu und Meldet den Kacheln sich selbst neu zu Zeichnen
	this.draw_ui_canvas = function(){
		ui_canvas.clearRect(0, 60, 1200, 590);
		for(i in this.ui_parts){
			this.ui_parts[i].draw_element();
		}
		head_bar.draw_element();
	}
	
	this.mouse_over = function(){
		var set_default = true;		//Flag fals garnichts gefunden wird und das default Objekt eingesetzt werden soll
		
		//Durchsuche alle Knopf Objekte nach einem Treffer
		for(var i = 0; i < this.ui_parts.length; i++){
			if(this.ui_parts[i].mouse_over()){
				set_default = false;
				break;
			}
		}
		for(var i = 0; i < this.storage_fields.length; i++){
			if(this.storage_fields[i].mouse_over()){
				set_default = false;
				break;
			}
		}
		//Setzt das default Objekt ein wenn nichts gefunden wird
		if(set_default){
			focus_object.mouse_out();
			focus_object = default_focus;
		}
	}
	
	this.mouse_down = function(){
		selected_object = default_focus;
		focus_object.mouse_down();
	}
	
	this.mouse_up = function(){
		focus_object.mouse_up();
	}
	
	this.button_click = function(source){
		switch(source){
			case 0: this.switch_screen(true);
					break;
			case 1:	this.switch_screen(false);
					break;
		}
	}

	this.switch_screen = function(state){
		if(state){
			this.ui_parts[2] = this.buy_screen;
		}
		else{
			this.ui_parts[2] = this.sell_screen;
		}
		game.draw_scene();
	}
	
	this.buy_item = function(category_id, id, quantity, buy_price){
		if(buy_price <= money && game.store_ware(category_id, id, quantity)){
			this.draw_ui_canvas();
			head_bar.update_money(-buy_price);
		}
	}
	
	this.sell_item = function(selected_storage, sell_quantity, sell_price){
		selected_storage.sell_ware(sell_quantity);
		head_bar.update_money(sell_price);
	}

	this.set_default = function(){
		
	}
}