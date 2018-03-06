//Klasse die, die Kopfzeile definiert und verwaltet
function Head_Bar(){
	
	this.background = new Ui_Part(0, 0, 1200, 60, this);
	this.background.bg_imag_x = 6
	this.money_display = new Text_Line(200, 12, 150, 15);
	this.money_display.set_text(money+"$");
	this.worker_display = new Text_Line(360, 12, 150, 15);
	this.worker_display.set_text("Arbeiter: " + free_worker + "/" + workforce);
	this.clock = new Clock();	//Inizialisiere Uhr
	this.clock.start_clock();		//Starte Uhr
	
	this.help = new Help_Button(1015, 15);
	this.location_menue = new Location_Menue();
	
	//Zeichnet die Kopfzeile
	this.draw_element = function(){
		this.background.draw_element();
		this.clock.draw_element();
		this.money_display.draw_element();
		this.worker_display.draw_element();	
		this.help.draw_element();
		this.location_menue.draw_element();
	}
	
	this.mouse_over = function(){
		if(this.help.mouse_over()){
			return true;
		}
		else if(this.location_menue.mouse_over()){
			return true;
		}
		else{
			return false;
		}
	}
	
	this.button_click = function(id){
		
	}
	
	//Aktualisiert die Geldanzeige
	this.update_money = function(change){
		money += change;
		this.money_display.set_text(money+"$");
		this.money_display.draw_element();
	}
	
	this.update_workforce = function(change_workforce, change_free_worker){
		workforce += change_workforce;
		free_worker += change_free_worker;
		this.worker_display.set_text("Arbeiter: " + free_worker + "/" + workforce);
		this.worker_display.draw_element();
	}
}