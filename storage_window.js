//Klasse der Lager Ansicht
function Window_Storage(){
	
	this.button_content = [];													//Array mit allen Interface Knöpfen	
	this.storage_content = [];													//Array mit allen Lagerflächen
	
	var ware_background = new Ui_Part(ui_canvas, 230, 70, 740, 570, 1, this);	//Das Hintergrundfeld hinter den Waren
	
	var scroll_y = 0;															//X Verschiebung der Waren durch scrollen
	
	this.init_window = function(){
		this.button_content[0] = new UI_Button(0, 20, 70, this, "Lager Sortieren");
		//this.button_content[0].is_activ = true;
		this.button_content[1] = new UI_Button(1, 980, 70, this, "Geschäft");
		this.button_content[1].is_activ = true;
		this.button_content[2] = new UI_Button(2, 980, 120, this, "Markt");
		this.button_content[2].is_activ = true;
		
		var y = 0;
		var x = 0;
		for(var i = 0; i < 30; i++){
			this.storage_content[i] = new Ware_Stack_UI(this, 275 + x * 110, 80 + y * 110); 
			x++;
			if(x == 6){
				x = 0;
				y++;
			}
		}
	}
	
	//Zeichnet das Fenster neu
	this.draw_game_canvas = function(){
		game_canvas.beginPath();
		game_canvas.rect(0, 60, 1200, 590);
		game_canvas.fillStyle = "brown";
		game_canvas.fill();
	}
	
	this.draw_ui_canvas = function(){
		for(i in this.storage_content){
			if(typeof storage[i] !== "undefined"){
				this.storage_content[i].own_back_end = storage[i];
				storage[i].own_ui = this.storage_content[i];
			}
			else{
				this.storage_content[i].own_back_end = null;
			}
		}
		ui_canvas.clearRect(0, 60, 1200, 590)
		ui_canvas.fillStyle = "black";
		for(i in this.button_content){
			this.button_content[i].draw_image(0, 0);
		}
		ware_background.draw_image();
		for(i in this.storage_content){
			this.storage_content[i].draw_image();
		}
	}
	
	//Ermittelt den Focus indem die Mausposition mit den Objectpositionen verglichen werden
	this.mouse_over = function(){
		var set_default = true;		//Flag fals garnichts gefunden wird und das default Objekt eingesetzt werden soll
		
		//Durchsuche alle Knopf Objekte nach einem Treffer
		for(var i = 0; i < this.button_content.length; i++){
			if(this.button_content[i].mouse_over(0, 0)){
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
	
	//Bestimmt welcher Befehl bei einem Buttonklick ausgeführt werden soll
	this.button_click = function(source){
		switch(source){
				case 0: this.press_sort_button();
						break;
				
				case 1: switch_window(0);
						break;
				case 2: switch_window(2);
						break;
		}
	}
}