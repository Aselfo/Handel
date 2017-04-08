//Klasse der Lager Ansicht
function Window_Storage(){
	
	this.init_window = function(){
		
	}
	
	//Zeichnet das Fenster neu
	this.draw_game_canvas = function(){
		game_canvas.beginPath();
		game_canvas.rect(0, 60, 1200, 590);
		game_canvas.fillStyle = "brown";
		game_canvas.fill();
	}
	
	this.draw_ui_canvas = function(){
		ui_canvas.clearRect(0, 60, 1200, 590)
		ui_canvas.fillStyle = "black";
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