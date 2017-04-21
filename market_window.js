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
		
		/*this.ui_buttons[4] = new Scroll_Button(4, 1075, 535, this, true);
		this.ui_buttons[4].is_activ = true;
		this.ui_buttons[5] = new Scroll_Button(5, 1075, 595, this, false);
		this.ui_buttons[5].is_activ = true;
		this.ui_buttons[6] = new Scroll_Button(6, 440, 80, this, true);
		this.ui_buttons[6].is_activ = true;
		this.ui_buttons[7] = new Scroll_Button(7, 440, 470, this, false);
		this.ui_buttons[7].is_activ = true;
		this.ui_buttons[8] = new Scroll_Button(10, 15, 335, this, true);
		this.ui_buttons[8].is_activ = true;
		this.ui_buttons[9] = new Scroll_Button(11, 55, 335, this, false);
		this.ui_buttons[9].is_activ = true;*/
		
		this.ui_buttons[10] = new UI_Button(12, 235, 80, this, "Metalle");
		this.ui_buttons[10].is_activ = true;
		this.ui_buttons[11] = new UI_Button(13, 235, 130, this, "Kräuter");
		this.ui_buttons[11].is_activ = true;
		this.ui_buttons[12] = new UI_Button(14, 235, 180, this, "Schmiedehalbfabrikate");
		this.ui_buttons[12].is_activ = true;
		this.ui_buttons[13] = new UI_Button(15, 235, 230, this, "Alchemiehalbfabrikate");
		this.ui_buttons[13].is_activ = true;
		this.ui_buttons[14] = new UI_Button(16, 235, 280, this, "Rüstung");
		this.ui_buttons[14].is_activ = true;
		this.ui_buttons[15] = new UI_Button(17, 235, 330, this, "Tränke");
		this.ui_buttons[15].is_activ = true;
		
		this.ui_parts[0] = new Ui_Part(ui_canvas, 15, 115, 200, 40, 0, this);
		this.ui_parts[1] = new Ui_Part(ui_canvas, 225, 70, 255, 440, 0, this);
		this.ui_parts[2] = new Ui_Part(ui_canvas, 65, 520, 1050, 120, 1, this);
		this.ui_parts[3] = new Ui_Part(ui_canvas, 490, 70, 480, 440, 0, this);
		/*this.ui_parts[3].sub_parts[0] = new Ware_Tile(13, 80, null, this);
		this.ui_parts[3].sub_parts[1] = new Ware_Tile(14, 210, null, this);
		this.ui_parts[3].sub_parts[2] = new Ware_Tile(15, 340, null, this);
		this.ui_parts[3].sub_parts[3] =	new Scroll_Button(8, 930, 80, this, true);
		this.ui_parts[3].sub_parts[3].is_activ = true;
		this.ui_parts[3].sub_parts[4] = new Scroll_Button(9, 930, 470, this, false);
		this.ui_parts[3].sub_parts[4].is_activ = true;*/
		
		
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
			object.draw_image();
		});
	}
	
	this.mouse_over = function(){
		
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		
	}
	
	this.button_click = function(source){
		
	}
}