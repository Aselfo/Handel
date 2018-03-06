//Klasse der Lager Ansicht
function Window_Storage(){
	
	this.button_content = [];													//Array mit allen Interface Knöpfen	
	this.storage_content = [];													//Array mit allen Lagerflächen
	
	this.wares = new Scrollable_Ui_Part(40, 70, 910, 570, this);					//Das Hintergrundfeld hinter den Waren
	
	var scroll_y = 0;															//X Verschiebung der Waren durch scrollen
	
	this.init_window = function(){
		this.button_content[0] = new Ui_Button(0, 960, 200, this, "Lager Sortieren");
		this.button_content[0].is_activ = false;			
	}
	
	//Zeichnet das Fenster neu
	this.draw_game_canvas = function(){
		game_canvas.beginPath();
		game_canvas.rect(0, 60, 1200, 590);
		game_canvas.fillStyle = "brown";
		game_canvas.fill();
	}
	
	this.draw_ui_canvas = function(){
		ui_canvas.clearRect(0, 60, 1200, 590);
		ui_canvas.fillStyle = "black";
		for(i in this.button_content){
			this.button_content[i].draw_element();
		}
		this.update_wares();
		this.wares.draw_element();
		head_bar.draw_element();
	}
	
	//Ermittelt den Focus indem die Mausposition mit den Objectpositionen verglichen werden
	this.mouse_over = function(){
		var set_default = true;		//Flag fals garnichts gefunden wird und das default Objekt eingesetzt werden soll
		
		//Durchsuche alle Knopf Objekte nach einem Treffer
		for(var i = 0; i < this.button_content.length; i++){
			if(this.button_content[i].mouse_over()){
				set_default = false;
				break;
			}
		}
		
		if(this.wares.mouse_over()){
			set_default = false;
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
		}
	}
	
	this.update_wares = function(){
		this.wares.sub_parts = [];
		var j = 0;
		var k = 0
		for(i in storage){
			var stack = new Ware_Stack_Storage_Ui( 10 + 430 * j, 10 + k * 125, this);
			stack.set_ware(storage[i]);
			this.wares.add_element(stack);
			if(j == 0){
				j++;
			}
			else{
				j--;
				k++;
			}
		}
	}
	
	this.set_default = function(){
		
	}
}