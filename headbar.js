//Klasse die, die Kopfzeile definiert und verwaltet
function Head_Bar(){
	
	var clock = new Clock();	//Inizialisiere Uhr
	clock.start_clock();		//Starte Uhr
	
	//Zeichnet die Kopfzeile
	this.draw_head_bar = function(){
		ui_canvas.drawImage(image_repository.head_bar_background, 0, 0, 1200, 60);
	}
	
	//Aktualisiert die Geldanzeige
	this.update_money = function(change){
		money += change;
		ui_canvas.clearRect(170, 20 ,100, 20);
		ui_canvas.font = "bold 14px Arial";
		ui_canvas.drawImage(image_repository.head_bar_background, 170, 20, 100, 20 ,170, 20, 100, 20);
		ui_canvas.fillText(money+"$", 170, 35);
		ui_canvas.fillText("Arbeiter: " + free_worker + "/" + workforce, 280, 35);
	}
	
	this.update_workforce = function(change_workforce, change_free_worker){
		workforce += change_workforce;
		free_worker += change_free_worker;
		ui_canvas.clearRect(280, 20 ,100, 20);
		ui_canvas.font = "bold 14px Arial";
		ui_canvas.drawImage(image_repository.head_bar_background, 280, 20 ,100, 20 ,280, 20 ,100, 20);
		ui_canvas.fillText("Arbeiter: " + free_worker + "/" + workforce, 280, 35);
	}
}