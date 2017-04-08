//Klasse die, die Marktansicht definiert und verwaltet
function Window_Market(){
	
	this.init_window = function(){
		
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