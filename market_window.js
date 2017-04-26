//Klasse die, die Marktansicht definiert und verwaltet
function Window_Market(){
	
	this.ui_buttons = [];											//Array mit allen Knopf Objekten
	this.ui_parts = [];												//Array mit allen Ui_Objekten	
	this.storage_buttons = [];
	
	//iniziert das Fenster
	this.init_window = function(){
		this.ui_buttons[0] = new UI_Button(0, 980, 70, this, "Geschäft");
		this.ui_buttons[0].is_activ = true;
		this.ui_buttons[1] = new UI_Button(1, 980, 120, this, "Lager");
		this.ui_buttons[1].is_activ = true;
		this.ui_buttons[2] = new UI_Button(2, 15, 70, this, "Kaufen");
		this.ui_buttons[2].is_activ = true;
		this.ui_buttons[3] = new UI_Button(3, 15, 175, this, "Verkaufen");
		this.ui_buttons[3].is_activ = true;
		
		this.ui_buttons[4] = new Scroll_Button(4, 1075, 535, this, true);
		this.ui_buttons[4].is_activ = true;
		this.ui_buttons[5] = new Scroll_Button(5, 1075, 595, this, false);
		this.ui_buttons[5].is_activ = true;
		
		this.ui_buttons[6] = new Scroll_Button(10, 15, 335, this, true);
		this.ui_buttons[6].is_activ = true;
		this.ui_buttons[7] = new Scroll_Button(11, 55, 335, this, false);
		this.ui_buttons[7].is_activ = true;
		
		this.ui_parts[0] = new Scrollable_Ui_Part(ui_canvas, 225, 70, 255, 440, 0, this);
		this.ui_parts[0].sub_parts[0] = new UI_Button(4, 235, 80, this, "Metalle");
		this.ui_parts[0].sub_parts[0].is_activ = true;
		this.ui_parts[0].sub_parts[1] = new UI_Button(5, 235, 130, this, "Kräuter");
		this.ui_parts[0].sub_parts[1].is_activ = true;
		this.ui_parts[0].sub_parts[2] = new UI_Button(6, 235, 180, this, "Schmiedehalbfabrikate");
		this.ui_parts[0].sub_parts[2].is_activ = true;
		this.ui_parts[0].sub_parts[3] = new UI_Button(7, 235, 230, this, "Alchemiehalbfabrikate");
		this.ui_parts[0].sub_parts[3].is_activ = true;
		this.ui_parts[0].sub_parts[4] = new UI_Button(8, 235, 280, this, "Rüstung");
		this.ui_parts[0].sub_parts[4].is_activ = true;
		this.ui_parts[0].sub_parts[5] = new UI_Button(9, 235, 330, this, "Tränke");
		this.ui_parts[0].sub_parts[5].is_activ = true;
		
		this.ui_parts[1] = new Ui_Part(ui_canvas, 65, 520, 1050, 120, 1, this);
		this.ui_parts[2] = new Scrollable_Ui_Part(ui_canvas, 490, 70, 480, 440, 0, this);
		this.ui_parts[3] = new Ui_Part(ui_canvas, 15, 115, 200, 40, 0, this);
		this.ui_parts[4] = new Ui_Part(ui_canvas, 15, 220, 200, 40, 0, this);
		this.ui_parts[5] = new Ui_Part(ui_canvas, 15, 265, 120, 30, 0, this);
		this.ui_parts[6] = new Ui_Part(ui_canvas, 140, 265, 75, 30, 0, this);
		this.ui_parts[7] = new Ui_Part(ui_canvas, 15, 300, 120, 30, 0, this);
		this.ui_parts[8] = new Ui_Part(ui_canvas, 140, 300, 75, 30, 0, this); 
	}
	
	this.draw_game_canvas = function(){
		game_canvas.beginPath();
		game_canvas.rect(0, 60, 1200, 590);
		game_canvas.fillStyle = "green";
		game_canvas.fill();
	}
	
	//Zeichnet das Fenster neu und Meldet den Kacheln sich selbst neu zu Zeichnen
	this.draw_ui_canvas = function(){
		ui_canvas.clearRect(0, 60, 1200, 590)
		ui_canvas.fillStyle = "black";
		this.ui_parts.forEach(function(object){
			object.draw_image();
		});	
		this.ui_buttons.forEach(function(object){
			object.draw_image(0, 0);
		});
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
		for(var i = 0; i < this.ui_buttons.length; i++){
			if(this.ui_buttons[i].mouse_over()){
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
		focus_object.mouse_down();
	}
	
	this.mouse_up = function(){
		focus_object.mouse_up();
	}
	
	this.set_actual_category = function(id){
		var category_array = [];
		for(i in existing_wares[id]){
			category_array.push(new Ware_Tile( i, 80 + i * 130, existing_wares[id][i], this.ui_parts[2]));
		}
		this.ui_parts[2].sub_parts = category_array;
		this.ui_parts[2].draw_image()
	}
	
	this.button_click = function(source){
		switch(source){
			case 0: switch_window(0);
					break;
			case 1: switch_window(1);
					break;
			case 2: 
					break;
			case 3:
					break;
			case 4: this.set_actual_category(0);
					break;
			case 5: this.set_actual_category(1);
					break;
			case 6: this.set_actual_category(2);
					break;
			case 7: this.set_actual_category(3);
					break;
			case 8: this.set_actual_category(4);
					break;
			case 9: this.set_actual_category(5);
					break;
		}
	}
}