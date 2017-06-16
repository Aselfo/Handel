//Einen Dünamisch skalierbarer Fensterhintergrund zeichnen
function draw_background(canvas, x, y, width, height, color){
	canvas.drawImage(image_repository.ui_part, 0 , 0 , 5, 5, x            , y             , 5         , 5);
	canvas.drawImage(image_repository.ui_part, 0 , 7 , 5, 1, x            , y + 5         , 5         , height - 10);
	canvas.drawImage(image_repository.ui_part, 0 , 10, 5, 5, x            , y + height - 5, 5         , 5);
	canvas.drawImage(image_repository.ui_part, 7 , 10, 1, 5, x + 5        , y + height - 5, width - 10, 5);
	canvas.drawImage(image_repository.ui_part, 10, 10, 5, 5, x + width - 5, y + height - 5, 5         , 5);
	canvas.drawImage(image_repository.ui_part, 10, 7 , 5, 1, x + width - 5, y + 5         , 5         , height - 10);
	canvas.drawImage(image_repository.ui_part, 10, 0 , 5, 5, x + width - 5, y             , 5         , 5);
	canvas.drawImage(image_repository.ui_part, 7 , 0 , 1, 5, x + 5        , y             , width - 10, 5);
	
	if(color){
		canvas.drawImage(image_repository.ui_part, 6, 17, 2, 2, x + 5, y + 5, width - 10, height - 10);
	}
	else{
		canvas.drawImage(image_repository.ui_part, 0, 17, 2, 2, x + 5, y + 5, width - 10, height - 10);
	}
}

function customer_enters(offer){
	console.log("moeglicher Kunde");
	var customer_id; 
	var random = Math.random();
	if(random > 0.66){
		customer_id = 2;
	}
	else if(random > 0.33){
		customer_id = 1;
	}
	else if(random >= 0){
		customer_id = 0;
	}
	var customer = existing_customers[customer_id];
	var preference = [];
	var chance_for_enter = 0.2;
	var found_in_store = [];
	for(var i = 0; i < offer.length; i++){
		if(found_in_store[offer[i].new_product] == null){
			found_in_store[offer[i].new_product] = 0;
		}
	}
	for(i in customer.preference){
		preference.push([existing_wares[customer.preference[i][0]][customer.preference[i][1]],customer.preference[i][2],customer.preference[i][3],customer.preference[i][4]]);
		for(j in offer){
			if(offer[j].new_product == preference[i][0]){
				chance_for_enter += (preference[i][1]/2^found_in_store[offer[j].new_product]);
				found_in_store[offer[j].new_product]++;
			}
		}  
	}
	if(Math.random() < chance_for_enter){
		for(i in preference){
			var left = 0;
			for(j in offer){
				if(offer[j].new_product == preference[i][0]){
					if(left == 0){
						var base_price = offer[j].new_product.buy_price;
						var buy_chance = 1 - ((offer[j].sell_price - (base_price)) / ((base_price * (1 + preference[i][3])) - base_price));
						var amount = preference[i][2] * buy_chance;
						console.log(amount);
						if(Math.random() <= (((amount * 100)%100)/100)){
							if((left = offer[j].buy_item(Math.ceil(amount))) == 0){
								break;
							}
						}
						else{
							if((left = offer[j].buy_item(Math.floor(amount))) == 0){
								break;
							}
						}
						console.log(left);
					}
					else{
						if(left = offer[j].buy_item(left) < 0){
							break;
						}
					}
				}
			}
		}
	}
}

//-------------Algemeine UI Objekte-------------------------------------------
//Klasse für Menüfenster
function Ui_Part(canvas, x, y, width, height, color_id, own_parent){
	this.canvas = canvas;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color_id = color_id
	this.own_parent = own_parent;
	this.sub_parts = [];
	this.is_activ = true;
	
	this.draw_image = function(){
		if(this.is_activ){
			draw_background(this.canvas, this.x, this.y, this.width, this.height, this.color_id);
			for(var i = 0; i < this.sub_parts.length; i++){
				this.sub_parts[i].draw_image(0, 0);
			}
		}
	}
	
	this.mouse_over = function(){
		if(this.is_activ){
			for(var i = 0; i < this.sub_parts.length; i++){
				if(this.sub_parts[i].mouse_over()){
					return true;
				}
			}
		}
		return false;
	}
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].x = x + this.sub_parts[i].save_x;
			this.sub_parts[i].y = y + this.sub_parts[i].save_y;
		}
	}
	
	this.activate = function(){
		this.is_activ = true;
		for(var i = 0; i < this.sub_parts.length; i++){
			if(this.sub_parts[i].label != ""){
				this.sub_parts[i].is_activ = true;
			}
		}
		this.draw_image();
	}
	
	this.deactivate = function(){
		this.is_activ = false;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].is_activ = false;
		}
		ui_canvas.clearRect(this.x - 1, this.y - 1, this.width+ 2, this.height + 2);
	}
}

function Scrollable_Ui_Part(canvas, x, y, width, height, color_id, own_parent){
	this.canvas = canvas;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.color_id = color_id
	
	this.own_parent = own_parent;
	this.sub_parts = [];
	this.unscrollt_sub_parts = [];
	this.scroll_position = 0;
	this.up_button = new Scroll_Button(0, x + width - 40, y + 10, this, true);
	this.down_button = new Scroll_Button(1, x + width - 40, y + height - 40, this, false);
	this.up_button.save_x = width - 85;
	this.up_button.save_y = 10
	this.down_button.save_x = width - 85;
	this.down_button.save_y = height - 10;
	this.up_button.mouse_up = function(){this.own_parent.scroll_up()};
	this.down_button.mouse_up = function(){this.own_parent.scroll_down()};
	
	this.is_activ = true;
	
	this.draw_image = function(){
		if(this.is_activ){
			ui_canvas.clearRect(this.x - 1, this.y - 1, this.width+ 2, this.height + 2);
			draw_background(this.canvas, this.x, this.y, this.width, this.height, this.color_id);
			this.up_button.draw_image(0, 0);
			this.down_button.draw_image(0, 0);
			for(var i = 0; i < this.sub_parts.length; i++){
				if((this.sub_parts[i].y - this.scroll_position) > (this.y) && (this.sub_parts[i].y + this.sub_parts[i].height - this.scroll_position) < this.y + this.height){
					this.sub_parts[i].draw_image(0, this.scroll_position);
				}
			}
			for(var i = 0; i < this.unscrollt_sub_parts.length; i++){
				if((this.unscrollt_sub_parts[i].y) > (this.y) && (this.unscrollt_sub_parts[i].y + this.unscrollt_sub_parts[i].height) < this.y + this.height){
					this.unscrollt_sub_parts[i].draw_image(0, 0);
				}
			}
		}
	}
	
	this.mouse_over = function(){
		if(this.is_activ){
			for(var i = 0; i < this.sub_parts.length; i++){
				if((this.sub_parts[i].y - this.scroll_position) > (this.y) && (this.sub_parts[i].y + this.sub_parts[i].height - this.scroll_position) < this.y + this.height){	
					if(this.sub_parts[i].mouse_over()){
						return true;
					}
				}
			}
			for(var i = 0; i < this.unscrollt_sub_parts.length; i++){
				if((this.unscrollt_sub_parts[i].y) > (this.y) && (this.unscrollt_sub_parts[i].y + this.unscrollt_sub_parts[i].height) < this.y + this.height){	
					if(this.unscrollt_sub_parts[i].mouse_over()){
						return true;
					}
				}
			}
			if(this.up_button.mouse_over()){
				return true;
			}
			if(this.down_button.mouse_over()){
				return true;
			}
		}
		return false;
	}
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		this.up_button.x = x + this.up_button.save_x;
		this.up_button.y = y + this.up_button.save_y;
		this.down_button.x = x + this.down_button.save_x;
		this.down_button.y = y + this.down_button.save_y;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].x = x + this.sub_parts[i].save_x;
			this.sub_parts[i].y = y + this.sub_parts[i].save_y;
		}
		for(var i = 0; i < this.unscrollt_sub_parts.length; i++){
			this.unscrollt_sub_parts[i].x = x + this.unscrollt_sub_parts[i].save_x;
			this.unscrollt_sub_parts[i].y = y + this.unscrollt_sub_parts[i].save_y;
		}
	}
	
	this.activate = function(){
		this.is_activ = true;
		for(var i = 0; i < this.sub_parts.length; i++){
			if(this.sub_parts[i].label != ""){
				this.sub_parts[i].is_activ = true;
			}
		}
		for(var i = 0; i < this.unscrollt_sub_parts.length; i++){
			if(this.unscrollt_sub_parts[i].label != ""){
				this.unscrollt_sub_parts[i].is_activ = true;
			}
		}
		this.draw_image();
	}
	
	this.deactivate = function(){
		this.is_activ = false;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].is_activ = false;
		}
		for(var i = 0; i < this.unscrollt_sub_parts.length; i++){
			this.unscrollt_sub_parts[i].is_activ = false;
		}
		ui_canvas.clearRect(this.x - 1, this.y - 1, this.width+ 2, this.height + 2);
	}

	this.scroll_up = function(){
		if(this.sub_parts[0] != null){
			if(this.scroll_position > 0){
				this.scroll_position -= (this.sub_parts[0].height + 10);
				this.draw_image();
			}
		}
	}
	
	this.scroll_down = function(){
		if(this.sub_parts[0] != null){
			var size =- (2* (this.sub_parts[0].height + 10) - 5);
			for(i in this.sub_parts){
				size += (this.sub_parts[i].height + 10);
			}
			if(this.scroll_position < size){
				this.scroll_position += (this.sub_parts[i].height + 10);
				this.draw_image();
			}
		}
	}
}

//Klasse für Knöpfe
function UI_Button(id, x, y, own_parent, label){
	this.canvas = ui_canvas;			//Referenz auf die Zeichenebene
	this.x = x;							//X position des Knopfes
	this.y = y;							//Y position des Knopfes
	this.width = 200
	this.height = 40
	this.pictur_x = 0;					//X position des Bildausschnittes
	this.pictur_y = 0;					//Y position des Bildausschnittes
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	
	this.id = id;						//ID Des Knopfes
	this.own_parent = own_parent;		//Referenz auf das Fenster zu dem der Knopf gehört
	this.label = label;					//String mit der Beschriftung des Knopfes
	this.lock = false;					//Flag ob der Knopf eingerasstet ist
	this.is_activ = false;				//Flag ob der Knopf gerade aktiv ist
	this.mouse_over_text = "";			//String für die Ausgabe als popup
	
	//Zeichnet den Knopf
	this.draw_image = function(scroll_x, scroll_y){
		this.scroll_x = scroll_x;
		this.scroll_y = scroll_y;
		if(this.is_activ){
			this.canvas.drawImage(image_repository.button_image, this.pictur_x, this.pictur_y, 200, 40, this.x - this.scroll_x, this.y - this.scroll_y, this.width, this.height);
			this.canvas.font = "bold 14px Arial";
			this.canvas.fillText(this.label, this.x - this.scroll_x + (this.width - this.canvas.measureText(this.label).width) / 2, this.y - this.scroll_y + 25);
		}
	}
	
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.mouse_down = function(){

	}
	
	this.mouse_up = function(){
		this.own_parent.button_click(this.id);
	}
	
	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){
		if(mpos_x > (this.x - this.scroll_x) && mpos_x <= (this.x - this.scroll_x + this.width) && mpos_y > (this.y - this.scroll_y) && mpos_y <= (this.y - this.scroll_y + this.height) && this.is_activ){
			if(!this.mouse_over_status){

				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.pictur_x = 200;
				this.draw_image(this.scroll_x, this.scroll_y);
				if(this.mouse_over_text != ""){
					mouse_over_tooltip.show_tooltip(this.x + this.width + 15, mpos_y, this.mouse_over_text);
				}
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	//Wird aufgerufen wenn die Maus auß dem Knopf fährt
	this.mouse_out = function(){
		this.mouse_over_status = false;
		this.pictur_x = 0;
		this.draw_image(this.scroll_x, this.scroll_y);
		if(this.mouse_over_text != ""){
			mouse_over_tooltip.hide_tooltip();
		}
	}
	
	//Activiert einen Knopf
	this.enable_button = function(){
		this.is_activ = true;
		this.draw_image(0, 0);
	}
	
	//Deactiviert einen Knopf
	this.disable_button = function(){
		this.is_activ = false;
		ui_canvas.clearRect(this.x, this.y, this.width, this.height);
	}
}

//Klasse für Scroll_Knöpfe
function Scroll_Button(id, x, y, own_parent, up_down){
	this.x = x;							//X position des Knopfes
	this.y = y;							//Y position des Knopfes
	this.width = 30
	this.hight = 30
	this.scroll_x = 0;
	this.scroll_y = 0;
	if(up_down){
		this.pictur_y = 0;				//Y position des Bildausschnittes
	}
	else{
		this.pictur_y = 30;
	}
		
	this.id = id;						//ID Des Knopfes
	this.own_parent = own_parent;		//Referenz auf das Fenster zu dem der Knopf gehört
	this.is_activ = true;				//Flag ob der Knopf gerade aktiv ist
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	
	//Zeichnet den Knopf
	this.draw_image = function(scroll_x, scroll_y){
		if(this.is_activ){
			this.scroll_x = scroll_x;
			this.scroll_y = scroll_y;
			if(this.mouse_over_status){
				ui_canvas.drawImage(image_repository.up_down_button, 30, this.pictur_y, 30, 30, this.x - this.scroll_x, this.y - this.scroll_y, this.width, this.hight);
			}
			else{
				ui_canvas.drawImage(image_repository.up_down_button, 0, this.pictur_y, 30, 30, this.x - this.scroll_x, this.y - this.scroll_y, this.width, this.hight);
			}
		}
	}
	
	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){
		if(mpos_x > this.x - this.scroll_x && mpos_x <= (this.x + 30 - this.scroll_x) && mpos_y > this.y - this.scroll_y && mpos_y <= (this.y + 30 - this.scroll_y) && this.is_activ){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.draw_image(this.scroll_x, this.scroll_y);
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	//Wird aufgerufen wenn die Maus auß dem Knopf fährt
	this.mouse_out = function(){
		this.mouse_over_status = false;
		this.draw_image(this.scroll_x, this.scroll_y);
	}
	
	this.mouse_down = function(){
		
	}
	
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.mouse_up = function(){
		this.own_parent.button_click(this.id);
	}
}

//------------Einmalige Objekte-----------------------------------------------
//Klasse für Popup Fenster
function Popup_Message(){
	this.x;
	this.y;
	this.height;
	this.width;
	
	this.message_queue = [];
	
	this.add_message = function(message){
		this.message_queue.push(message);
		this.next_message();
	}
	
	this.next_message = function(){
		if(this.message_queue.length > 0){
			this.show_message(this.message_queue.pop());
		}
		else{
			this.hide_message();
		}
	}
	
	this.show_message = function(message){
		popup_message_visible = true;
		popup_canvas.font = "bold 12px Arial";
		this.width = 220;
		
		var message = message.split(" ");
		var j = 0;
		var memory = message;
		message = [];
		message[0] = "";
		for(var i = 0; i < memory.length; i++){
			if(popup_canvas.measureText(message[j] + " " + memory[i]).width <= 300){
				message[j] = message[j] + " " + memory[i];
			}
			else{
				this.width = 320;
				j++;
				message[j] = " " + memory[i];
			}
		}
		if(this.width < popup_canvas.measureText(message[j]).width + 20){
			this.width = popup_canvas.measureText(message[j]).width + 20;
		}
		this.height = message.length * 12 + 32;
		
		this.x = (1200-this.width)/2;
		this.y = (590-this.height)/2;
		
		draw_background(popup_canvas, this.x, this.y, this.width, this.height, 0);
		popup_canvas.fillText(this.message_queue.length + 1, this.x + 10, 20 + this.y);
		
		for(var i = 0; i < message.length; i++){
			popup_canvas.fillText(message[i], this.x + 10, 32 + 12 * i + this.y);
		}
	}
	
	this.hide_message = function(){
		popup_message_visible = false;
		popup_canvas.clearRect(this.x, this.y, this.width, this.height);
	}
}

//Klasse für ein Popupfenster das eine Bestätigung vordert
function Confirm_Request(){
	this.x;
	this.y;
	this.width = 300;
	this.height = 0;
	
	this.actual_parent = null;
	this.ok_button = new UI_Button(1, 0, 0, this, "Ja");
	this.ok_button.canvas = popup_canvas;
	this.ok_button.width = 97;
	this.abort_button = new UI_Button(0, 0, 0, this, "Abbrechen");
	this.abort_button.canvas = popup_canvas;
	this.abort_button.width = 97;
	
	this.is_activ = false;
	
	this.request_answer = function(request_source, x, y, request){
		this.actual_parent = request_source;
		this.x = x;
		this.y = y;
		this.request = request;
		
		var request = request.split(" ");
		var j = 0;
		var memory = request;
		request = [];
		request[0] = "";
		for(var i = 0; i < memory.length; i++){
			if(popup_canvas.measureText(request[j] + " " + memory[i]).width <= 300){
				request[j] = request[j] + " " + memory[i];
			}
			else{
				this.width = 320;
				j++;
				request[j] = " " + memory[i];
			}
		}
		if(this.width < popup_canvas.measureText(request[j]).width + 20){
			this.width = popup_canvas.measureText(request[j]).width + 20;
		}
		this.height = request.length * 12 + 82;
		
		this.ok_button.x = this.x + 112;
		this.ok_button.y = this.y + this.height - 50;
		
		this.abort_button.x = this.x + 10;
		this.abort_button.y = this.y + this.height - 50;
		
		draw_background(popup_canvas, this.x, this.y, this.width, this.height, 0);
		for(var i = 0; i < request.length; i++){
			popup_canvas.fillText(request[i], this.x + 10, 20 + 12 * i + this.y);
		}
		this.ok_button.enable_button();
		this.abort_button.enable_button();
		this.is_activ = true;
	}
	
	this.mouse_over = function(){
		if(this.is_activ){
			if(this.ok_button.mouse_over()){
				return true;
			}
			else if(this.abort_button.mouse_over()){
				return true;
			}
			else{
				focus_object.mouse_out();
				focus_object = default_focus;
			}
			return false;
		}
		else{
			return false;
		}
	}
	
	this.button_click = function(source){
		if(source){
			this.actual_parent.action_on_hold();
			this.actual_parent.action_on_hold = null;
		}
		this.ok_button.disable_button();
		this.abort_button.disable_button();
		popup_canvas.clearRect(this.x - 1, this.y - 1, this.width + 1, this.height + 1);
	}
}

//Klasse für die Spiel Uhr
function Clock(){
	var date;		//Speichervariable für die Aktuelle zeit die man vom System holt
	var day;		//Der Wochentag von 0-6 (nicht welcher tag des Monats)
	var hour;		//Aktuelle Stunde von 0-23
	var minute;		//Aktuelle Minute von 0-59
	var second;		//Aktuelle Sekunde von 0-59
	var weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Sammstag"]; //Array zum übersetzen von Wochentag in Name des Tages
	
	//Funktion zum starten der Uhr
	this.start_clock = function(){
		setTimeout(this.second_tick, 100);
		setInterval(this.second_tick, 1000);
	}
	//Funktion für den sekundentick (neue Zeit holen, formatieren und ausgeben)
	this.second_tick = function(){
		//Daten Auslesen
		date = new Date();
		day = date.getDay();
		hour = date.getHours();
		minute = date.getMinutes();
		second = date.getSeconds();
		
		//Bei Bedarf führende Null setzen
		if(hour < 10){
			hour = "0" + hour;
		}
		if(minute < 10){
			minute = "0" + minute;
		}
		if(second < 10){
			second = "0" + second;
		}
		
		//String bauen und Anzeigen
		var time_string = weekdays[day] + " " + hour + ":" + minute + ":" + second;
		
		ui_canvas.font = "bold 14px Arial";
		ui_canvas.drawImage(image_repository.head_bar_background, 10, 20, 150, 20 ,10, 20, 150, 20);
		ui_canvas.fillText(time_string, 10, 35);
		
		windows[0].timer_tick(1);
		for(i in rooms){
			if(rooms[i].kind_of_room == 4){
				rooms[i].time_tick(1);
			}
		}
	}
}

function Tooltip(){
	this.x;
	this.y;
	this.show_tooltip = function(x, y, tip_text){
		this.x = x;
		this.y = y;
		
		var tip_text = tip_text.split(" ");
		var j = 0;
		var memory = tip_text;
		tip_text = [];
		tip_text[0] = "";
		for(var i = 0; i < memory.length; i++){
			if(popup_canvas.measureText(tip_text[j] + " " + memory[i]).width <= 250){
				tip_text[j] = tip_text[j] + " " + memory[i];
			}
			else{
				j++;
				tip_text[j] = " " + memory[i];
			}
		}
		
		this.height = tip_text.length * 12 + 20;
		
		draw_background(popup_canvas, this.x, this.y, 260, this.height, 0);
		
		for(var i = 0; i < tip_text.length; i++){
			popup_canvas.font = "bold 12px Arial";
			popup_canvas.fillText(tip_text[i], this.x + 10, 20 + 12 * i + this.y);
		}
	}
	
	this.hide_tooltip = function(){
		popup_canvas.clearRect(this.x - 5, this.y - 5, 270, this.height + 10);
	}
}

function Construckt_Menue(){
	var room_or_funiture;
	var tile_backup;
	
	//Initalisieren des Popup wahl menü fensters
	this.menue_window = new Ui_Part(ui_canvas, 0, 0, 220, 210, 0, this);
	this.menue_window.sub_parts.push(new UI_Button(1, 0, 0, this, ""));
	this.menue_window.sub_parts[0].save_x = 10;
	this.menue_window.sub_parts[0].save_y = 10;
	this.menue_window.sub_parts.push(new UI_Button(2, 0, 0, this, ""));
	this.menue_window.sub_parts[1].save_x = 10;
	this.menue_window.sub_parts[1].save_y = 60;
	this.menue_window.sub_parts.push(new UI_Button(3, 0, 0, this, ""));
	this.menue_window.sub_parts[2].save_x = 10;
	this.menue_window.sub_parts[2].save_y = 110;
	this.menue_window.sub_parts.push(new UI_Button(4, 0, 0, this, ""));
	this.menue_window.sub_parts[3].save_x = 10;
	this.menue_window.sub_parts[3].save_y = 160;
	this.menue_window.set_position(230, 210);
	this.menue_window.is_activ = false;
	
	this.mouse_over = function(){
		return this.menue_window.mouse_over();
	}
	
	this.show_room_menue = function(){
		this.menue_window.sub_parts[0].label = "Lager";
		this.menue_window.sub_parts[0].mouse_over_text = "Ein Lager für Rohstoffe, Halbfabrikate und Endprodukte. Jedes Geschäft braucht ein Lager.";
		this.menue_window.sub_parts[1].label = "Schmiede";
		this.menue_window.sub_parts[1].mouse_over_text = "Eine Schmiede für Waffen, Rüstungen und Metallteile.";
		this.menue_window.sub_parts[2].label = "Alchemilabor";
		this.menue_window.sub_parts[2].mouse_over_text = "Ein Laboratorium für Alchemie- und Magiewaren.";
		this.menue_window.sub_parts[3].label = "Laden";
		this.menue_window.sub_parts[3].mouse_over_text = "Ein Einzelhandelsladen um Waren an Privatkunden zu verkaufen.";
		this.menue_window.set_position(230, 210);
		room_or_funiture = true;
		this.menue_window.activate();
	}
	
	this.show_funiture_menue = function(tile, x, y){
		tile_backup = tile;
		for(var i = 0; i < 4; i++){
			if(typeof existing_funiture[tile.room.kind_of_room][i] !== 'undefined'){
				this.menue_window.sub_parts[i].label = existing_funiture[tile.room.kind_of_room][i].name + " " + existing_funiture[tile.room.kind_of_room][i].price + "$ " + existing_funiture[tile.room.kind_of_room][i].get_construction_time();
				this.menue_window.sub_parts[i].mouse_over_text = existing_funiture[tile.room.kind_of_room][i].description;
			}
			else{
				this.menue_window.sub_parts[i].label = "";
				this.menue_window.sub_parts[i].mouse_over_text = "";
				this.menue_window.sub_parts[i].is_activ = false;
			}
			this.menue_window.set_position(x, y);
			room_or_funiture = false;
			this.menue_window.activate();
		}
	}
	
	this.hide_menue = function(){
		this.menue_window.deactivate();
	}
	
	this.button_click = function(source){
		if(room_or_funiture){
			windows[0].chose_room(source);
		}
		else{
			windows[0].chose_funiture(source, tile_backup);
		}
	}
}

//Klasse für das Craftingfenster des Shops
function Crafting_Menue(own_parent){
	this.x = 360;
	this.y = 105;
	
	this.scroll_panel = new Scrollable_Ui_Part(ui_canvas, this.x, this.y, 480, 435, 0, own_parent);
	this.scroll_panel.is_activ = false;
	this.scroll_panel.unscrollt_sub_parts[0] = new UI_Button(2, this.x + 140, this.y + 390, this, "Produzieren");
	this.scroll_panel.unscrollt_sub_parts[0].is_activ = true;
	this.ware_selected = null;
	
	this.actual_tile;
	this.own_parent = own_parent;
	this.draw_image = function(){
		
	}
	
	this.mouse_over = function(){
		return this.scroll_panel.mouse_over();
	}
	
	this.show_crafting_menue = function(tile){
		this.actual_tile = tile;
		var options = [];
		for(i in existing_funiture[tile.room.kind_of_room][tile.funiture.id].craftable_wares){
			options.push(new Craftabel_Tile(this.x + 10, this.y + i * 130 + 10 , existing_funiture[tile.room.kind_of_room][tile.funiture.id].craftable_wares[i], this));
		}
		this.scroll_panel.sub_parts = options;
		this.scroll_panel.activate();
	}
	
	this.hide_crafting_menue = function(){
		this.scroll_panel.deactivate();
		this.own_parent.menue_open = false;
	}
	
	this.button_click = function(source){
		if(this.ware_selected != null){
			game.produce_ware(this.actual_tile.funiture, this.ware_selected.ware, this.ware_selected.quantity);
			this.hide_crafting_menue();
		}else{
			this.hide_crafting_menue();
		}
	}
}

//Klasse für das Verkaufsfenster des Shops
function Sell_Menue(own_parent){
	this.x = 360;
	this.y = 105;
	this.scroll_panel = new Scrollable_Ui_Part(ui_canvas, this.x, this.y, 480, 417, 0, own_parent);
	this.scroll_panel.is_activ = false;
	this.scroll_panel.unscrollt_sub_parts[0] = new UI_Button(2, this.x + 140, this.y + 372, this, "Verkaufen");
	this.scroll_panel.unscrollt_sub_parts[0].is_activ = true;
	
	this.own_parent = own_parent;
	this.ware_selected = null;
	
	this.actual_tile;
	this.draw_image = function(){}
	
	this.mouse_over = function(){
		return this.scroll_panel.mouse_over();
	}
	
	this.show_sell_menue = function(tile){
		this.actual_tile = tile;
		var options = [];
		var available_wares = game.get_available_wares()
		
		for(i in available_wares){
			options.push(new Sell_Tile(this.x + 10, this.y + i * 94 + 10, available_wares[i][0], available_wares[i][1], this));
		}
		this.scroll_panel.sub_parts = options;
		this.scroll_panel.activate();
	}
	
	this.hide_sell_menue = function(){
		this.scroll_panel.deactivate();
		this.own_parent.menue_open = false;
	}

	this.button_click = function(source){
		if(this.ware_selected != null){
			
			if(this.ware_selected.already_on_sale){
				var price = this.actual_tile.room.already_on_sale(this.ware_selected.ware);
				if(price != null && price != this.ware_selected.price){
					this.action_on_hold = function(){this.actual_tile.room.new_price(this.ware_selected.ware, this.ware_selected.price);
													 game.sell_ware(this.actual_tile.funiture, this.ware_selected.ware, this.ware_selected.quantity, this.ware_selected.price);
													 this.hide_sell_menue();}
					confirm_request_message.request_answer(this, mpos_x, mpos_y, "Neuen Preis für alle übernehmen?");
				}
				else{
					game.sell_ware(this.actual_tile.funiture, this.ware_selected.ware, this.ware_selected.quantity, this.ware_selected.price);
					this.hide_sell_menue();
				}
			}
			else{
				game.sell_ware(this.actual_tile.funiture, this.ware_selected.ware, this.ware_selected.quantity, this.ware_selected.price);
				this.hide_sell_menue();
			}
		}
		else{
			this.hide_sell_menue();
		}
	}
}

//Klasse für ein Anzeigefeld für eine Herstellbare Ware
function Craftabel_Tile(x, y, ware, own_parent){
	this.scroll_up_button = new Scroll_Button(0, x + 350, y + 10, this, true);
	this.scroll_down_button = new Scroll_Button(1, x + 385, y + 10, this, false);
	
	this.own_parent = own_parent;
	
	this.x = x;
	this.y = y;
	
	this.width = 425;
	this.height = 120;
	
	this.scroll_x = 0;
	this.scroll_y = 0;
	
	this.pictur_y = 0;
	this.selected = false;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	this.is_activ = false;
	
	this.ware = existing_wares[ware[0]][ware[1]];
	
	this.quantity = 1;
	this.draw_image = function(scroll_x, scroll_y){
		this.scroll_x = scroll_x;
		this.scroll_y = scroll_y;
		ui_canvas.drawImage(image_repository.crafting_blueprint, 0, this.pictur_y, this.width, this.height, this.x, this.y - this.scroll_y, this.width, this.height);
		ui_canvas.font = "bold 12px Arial";
		ui_canvas.fillText(this.ware.name, this.x + 15, this.y + 30 - this.scroll_y);
		var seconds = this.ware.production_time % 60;
		var minutes = ((this.ware.production_time % 3600) - seconds) / 60;
		var hour = (this.ware.production_time - (this.ware.production_time % 3600)) / 3600;
		if(seconds < 10){
			seconds = "0" + seconds;
		}
		if(minutes < 10){
			minutes = "0" + minutes;
		}
		if(hour < 10){
			hour = "0" + hour;
		}
		var time_string = hour + ":" + minutes + ":" + seconds;
		ui_canvas.fillText(time_string, this.x + 153, this.y + 30 - this.scroll_y);
		ui_canvas.fillText(this.quantity, this.x + 291, this.y + 30 - this.scroll_y);
		for(var i = 0; i < this.ware.production_cost.length; i++){
			if(i < 3){
				if(this.quantity > 0){
					ui_canvas.fillText(existing_wares[this.ware.production_cost[i][0]][this.ware.production_cost[i][1]].name + " " + this.ware.production_cost[i][2] * this.quantity + "/" + game.count_ware(this.ware.production_cost[i][0], this.ware.production_cost[i][1]), this.x + 15 + (i * 138), this.y + 65 - this.scroll_y);	
				}
				else{
					ui_canvas.fillText(existing_wares[this.ware.production_cost[i][0]][this.ware.production_cost[i][1]].name + " " + this.ware.production_cost[i][2] + "/" + game.count_ware(this.ware.production_cost[i][0], this.ware.production_cost[i][1]), this.x + 15 + (i * 138), this.y + 65 - this.scroll_y);	
				}
			}
			else{
				if(this.quantity > 0){
					ui_canvas.fillText(existing_wares[this.ware.production_cost[i][0]][this.ware.production_cost[i][1]].name + " " + this.ware.production_cost[i][2] * this.quantity + "/" + game.count_ware(this.ware.production_cost[i][0], this.ware.production_cost[i][1]), this.x + 15 + ((i%3) * 138), this.y + 100 - this.scroll_y);	
				}
				else{
					ui_canvas.fillText(existing_wares[this.ware.production_cost[i][0]][this.ware.production_cost[i][1]].name + " " + this.ware.production_cost[i][2] + "/" + game.count_ware(this.ware.production_cost[i][0], this.ware.production_cost[i][1]), this.x + 15 + ((i%3) * 138), this.y + 100 - this.scroll_y);	
				}
			}
		}
		
		this.scroll_up_button.draw_image(this.scroll_x, this.scroll_y);
		this.scroll_down_button.draw_image(this.scroll_x, this.scroll_y);
	}
	
	this.mouse_over = function(){
		if(mpos_x > this.x && mpos_x <= (this.x + this.width) && mpos_y > (this.y  - this.scroll_y) && mpos_y <= (this.y + this.height - this.scroll_y)){
			if(this.selected){
				if(this.scroll_up_button.mouse_over(this.scroll_x, this.scroll_y)){}
				else if(this.scroll_down_button.mouse_over(this.scroll_x, this.scroll_y)){}
				else{
					if(!this.mouse_over_status){
						this.mouse_over_status = true;
						focus_object.mouse_out();
						focus_object = this;
					}
				}
			}
			else{
				if(!this.mouse_over_status){
					this.mouse_over_status = true;
					focus_object.mouse_out();
					focus_object = this;
				}
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	this.mouse_out = function(){
		this.mouse_over_status = false;
	}
	
	this.mouse_down = function(){
	
	}
	
	this.mouse_up = function(){
		if(!this.selected){
			if(this.own_parent.ware_selected != null){
				this.own_parent.ware_selected.mouse_up();
			}
			this.own_parent.ware_selected = this;
			this.selected = true;
			this.pictur_y = 120;
		}
		else{
			this.own_parent.ware_selected = null;
			this.selected = false;
			this.pictur_y = 0;
			this.quantity = 1;
		}
		this.draw_image(this.scroll_x, this.scroll_y);
	}
	
	this.button_click = function(source){
		switch(source){
				case 0: if(this.quantity < 1000){
							this.quantity++;
						}
						break;
				case 1: if(this.quantity > 0){
							this.quantity--;
						}
						break;
		}
		this.draw_image(this.scroll_x, this.scroll_y);
	}
}

//Klasse für ein Anzeigefeld für eine Verkaufbare Ware
function Sell_Tile(x, y, ware, available_quantity, own_parent){
	this.scroll_quantity_up_button = new Scroll_Button(0, x + 350, y + 10, this, true);
	this.scroll_quantity_down_button = new Scroll_Button(1, x + 385, y + 10, this, false);
	this.scroll_price_up_button = new Scroll_Button(2, x + 350, y + 45, this, true);
	this.scroll_price_down_button = new Scroll_Button(3, x + 385, y + 45, this, false);
	this.own_parent = own_parent;
	
	this.x = x;
	this.y = y;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = 425;
	this.height = 84;
	this.pictur_y = 0;
	this.selected = false;
	this.already_on_sale = false;
	
	this.is_activ = false;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt
	
	this.ware = ware;
	this.available_quantity = available_quantity;
	this.quantity = 1;
	this.price = this.ware.buy_price;
	this.draw_image = function(scroll_x, scroll_y){
		if(this.is_activ){
			this.scroll_x = scroll_x;
			this.scroll_y = scroll_y;
			ui_canvas.drawImage(image_repository.sellable_ware, 0, this.pictur_y, 425, 84, this.x - this.scroll_x, this.y - this.scroll_y, 425, 84);
			ui_canvas.font = "bold 12px Arial";
			ui_canvas.fillText(this.ware.name, this.x + 15, this.y + 30);
			ui_canvas.fillText(this.available_quantity, this.x + 153, this.y + 30);
			ui_canvas.fillText(this.quantity, this.x + 291, this.y + 30);
			ui_canvas.fillText(this.ware.sell_price + "$", this.x + 15, this.y + 65);
			ui_canvas.fillText(this.price + "$", this.x + 270, this.y + 65);
			
			this.scroll_quantity_up_button.draw_image(this.scroll_x, this.scroll_y);
			this.scroll_quantity_down_button.draw_image(this.scroll_x, this.scroll_y);
			this.scroll_price_up_button.draw_image(this.scroll_x, this.scroll_y);
			this.scroll_price_down_button.draw_image(this.scroll_x, this.scroll_y);
		}
	}
	
	this.mouse_over = function(){
		if(mpos_x > (this.x - this.scroll_x) && mpos_x <= (this.x + 425 - this.scroll_x) && mpos_y > (this.y - this.scroll_y) && mpos_y <= (this.y + 84 - this.scroll_y)){
			if(this.selected){
				if(this.scroll_quantity_up_button.mouse_over()){}
				else if(this.scroll_quantity_down_button.mouse_over()){}
				else if(this.scroll_price_up_button.mouse_over()){}
				else if(this.scroll_price_down_button.mouse_over()){}
				else{
					if(!this.mouse_over_status){
						this.mouse_over_status = true;
						focus_object.mouse_out();
						focus_object = this;
					}
				}
			}
			else{
				if(!this.mouse_over_status){
					this.mouse_over_status = true;
					focus_object.mouse_out();
					focus_object = this;
				}
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	this.mouse_out = function(){
		this.mouse_over_status = false;
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		if(!this.selected){
			if(this.own_parent.ware_selected != null){
				this.own_parent.ware_selected.mouse_up();
			}
			var actual_price = this.own_parent.actual_tile.room.already_on_sale(this.ware);
			if(actual_price != null){
				this.price = actual_price;
				this.already_on_sale = true;
			}
			this.own_parent.ware_selected = this;
			this.selected = true;
			this.pictur_y = 84;
		}
		else{
			this.own_parent.ware_selected = null;
			this.selected = false;
			this.pictur_y = 0;
			this.quantity = 1;
			this.price = this.ware.sell_price;
		}
		this.draw_image(this.scroll_x, this.scroll_y);
	}
	
	this.button_click = function(source){
		switch(source){
				case 0: if(this.quantity < this.available_quantity){
							this.quantity++;
						}
						break;
				case 1: if(this.quantity > 0){
							this.quantity--;
						}
						break;
				case 2: if(this.price < 100000){
							this.price++;
						}
						break;
				case 3: if(this.price > this.ware.sell_price){
							this.price--;
						}
						break;
		}
		this.draw_image(this.scroll_x, this.scroll_y);
	}
}

function Shop_Tile_UI(x, y, border_left, border_top, own_parent, own_back_end){
	this.x = x * 75 + Math.round(border_left);		//Grafische X Position des Feldes
	this.y = y * 75 + Math.round(border_top);		//Grafische Y Position des Feldes
	this.pictur_x = 0;								//X Wert des Startpunktes des Ausschnittes der von der Bilddatei angezeigt wird
	this.mouse_over_status = false;					//Flag ob die Maus auf diesem Feld liegt
	this.highlight_status = 0;						//Flag ob und wie dieses Feld Markiert ist
	this.own_parent = own_parent;
	this.own_back_end = own_back_end;
	this.own_back_end.own_ui = this;
	
	this.draw_image = function(){
		game_canvas.drawImage(image_repository.shop_tile, this.pictur_x, 0, 75, 75, this.x - own_parent.view_x, this.y - own_parent.view_y, 75, 75);
		game_canvas.font = "bold 14px Arial";
		game_canvas.fillStyle = "BLACK";
		if(this.own_back_end.funiture != null){
			this.own_back_end.funiture.draw_image(this.x - own_parent.view_x, this.y - own_parent.view_y);
		}
		if(this.highlight_status == 1){
			game_canvas.drawImage(image_repository.shop_tile_marking, 0, 0, 75, 75, this.x - own_parent.view_x, this.y - own_parent.view_y, 75, 75);
		}
		else if(this.highlight_status == 2){
			game_canvas.drawImage(image_repository.shop_tile_marking, 75, 0, 75, 75, this.x - own_parent.view_x, this.y - own_parent.view_y, 75, 75);
		}
	}
	
	//sorgt dafür dass das Feld den korreckten Raum anzeigt
	this.set_room = function(id){
		this.pictur_x = id * 75;
		this.draw_image();
	}
	
	this.mouse_over = function(){
		if(mpos_x > this.x - own_parent.view_x && mpos_x <= (this.x + 75) - own_parent.view_x && mpos_y > this.y - own_parent.view_y && mpos_y <= (this.y + 75) - own_parent.view_y){
			if(!this.mouse_over_status){
				this.highlight_status = this.own_back_end.mouse_over();
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.draw_image();	
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	this.mouse_out = function(){
		this.mouse_over_status = false;
		if(this.own_back_end.monitor == null){
			this.highlight_status = 0;
			this.own_back_end.action_possible = false;
			this.draw_image();
		}
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		this.own_back_end.mouse_up();
	}
	
	//gibt einen Timertick an das Objekt weiter das auf diesem Feld liegt (wenn vorhanden) und zeichnet sich neu
	this.count_down = function(seconds){
		if(this.own_back_end.funiture != null && (this.own_back_end.funiture.time_left != 0 || seconds == 0)){
			this.own_back_end.funiture.count_down(seconds);
			this.draw_image();
		}
	}
}

function Shop_Tile(x_cord, y_cord){
	this.own_ui;
	
	this.x_cord = x_cord;							//X Cordinate des Feldes im Raster des Spielfeldes
	this.y_cord = y_cord;							//Y Cordinate des Feldes im Raster des Spielfeldes
	
	this.top_tile = null;							//Referenz auf das darüberliegende Feld
	this.bot_tile = null;							//Referenz auf das darunterliegende Feld
	this.left_tile = null;							//Referenz auf das linke Feld
	this.right_tile = null;							//Referenz auf das rechte Feld
	
	this.outer_wall = false;						//Flag ob dieses Feld eine Ausenwand ist
	
	this.funiture = null;							//Referenz auf das Objekt das auf diesem Feld liegt(kann null sein)
	this.room = null;								//Referenz auf den Raum zu dem dieses Feld gehört(kann null sein)
	
	this.action_possible = false;
	this.monitor = null;
	
	this.mouse_over = function(){
		switch(windows[0].construction_mode){
			case 0: return 1;
					break;
			
			case 1: if(this.room != null && this.funiture == null){
						this.action_possible = true;
						return 1;
					}
					else{
						this.action_possible = false;
						return 2;
					}
					break;
			
			case 2: if(this.wall_construcktable()){
						this.action_possible = true;
						return 1;
					}
					else{
						this.action_possible = false;
						return 2;
					}
					break;
					
			case 3: return this.room_construcktable();
			
			case 4: if(this.funiture != null && this.room == null && this.wall_deletable()){
						this.action_possible = true;
						return 1;
					}
					else if(this.funiture == null && this.room != null && this.room_deletable()){
						return 1;
					}
					else if(this.funiture != null && this.room != null){
						if(typeof focus_object.own_back_end !== 'undefined' && focus_object.own_back_end.monitor != null){
							focus_object.own_back_end.monitor.unhighlight();
						}
						this.action_possible = true;
						return 1;
					}
					else{
						this.action_possible = false;
						return 2;
					}
		}
		
	}
	
	this.mouse_out = function(){
		
	}
	
	this.status_check = function(){
		if(this.own_ui.mouse_over_status){
			this.own_ui.highlight_status = this.mouse_over();
			this.own_ui.draw_image();
		}
	}
	
	//sorgt dafür dass das Feld den korreckten Raum anzeigt
	this.set_room = function(){
		if(this.room != null){
			this.own_ui.set_room(this.room.kind_of_room);
		}
		else{
			this.own_ui.set_room(0);
		}
	}
	
	this.wall_construcktable = function(){		
		if(this.room == null){
			if(this.funiture == null){
				if((this.top_tile.funiture != null && this.top_tile.funiture.id == 1 && !this.top_tile.funiture.door_direction) ||
				   (this.bot_tile.funiture != null && this.bot_tile.funiture.id == 1 && !this.bot_tile.funiture.door_direction) ||
				   (this.left_tile.funiture != null && this.left_tile.funiture.id == 1 && this.left_tile.funiture.door_direction) ||
				   (this.right_tile.funiture != null && this.right_tile.funiture.id == 1 && this.right_tile.funiture.door_direction)){
					    
					return false;
				}
				else{
					return true;
				}
			}
			else if(this.funiture.id == 0 && this.funiture.action_id == 0){
				if((this.funiture.top_wall && this.funiture.bot_wall && !this.funiture.left_wall && !this.funiture.right_wall && this.top_tile.funiture.id == 0 && this.bot_tile.funiture.id == 0) ||
				(!this.funiture.top_wall && !this.funiture.bot_wall && this.funiture.left_wall && this.funiture.right_wall && this.left_tile.funiture.id == 0 && this.right_tile.funiture.id == 0)){
					return true;
				}
				else{
					return false;
				}
			}
			else if(this.funiture.id == 1 && this.funiture.action_id == 0){
				if(!this.funiture.door_direction){
					var monitor_1 = new function(){
						this.member = [];
						this.exit_found = false;
						this.room_exists = false;
					}
					var monitor_2 = new function(){
						this.member = [];
						this.exit_found = false;
						this.room_exists = false;
					}
					if(this.top_tile != null){
						if(this.top_tile.room != null && this.top_tile.room.kind_of_room == 4){
							this.top_tile.check_shop_path(monitor_1, this);
						}
						else{
							this.top_tile.check_path(monitor_1, this);
						}
					}
					else{
						monitor_1.exit_found = true;
					}
					if(this.bot_tile != null){
						if(this.bot_tile.room != null && this.bot_tile.room.kind_of_room == 4){
							this.bot_tile.check_shop_path(monitor_2, this);
						}
						else{
							this.bot_tile.check_path(monitor_2, this);
						}
					}
					else{
						monitor_2.exit_found = true;
					}
					if((monitor_1.exit_found || !monitor_1.room_exists) && (monitor_2.exit_found || !monitor_2.room_exists)){
						return true;
					}
					else{
						return false;
					}
				}
				else if(this.funiture.door_direction){
					var monitor_1 = new function(){
						this.member = [];
						this.exit_found = false;
						this.room_exists = false;
					}
					var monitor_2 = new function(){
						this.member = [];
						this.exit_found = false;
						this.room_exists = false;
					}
					if(this.left_tile != null){
						if(this.left_tile.room != null && this.left_tile.room.kind_of_room == 4){
							this.left_tile.check_shop_path(monitor_1, this);
						}
						else{
							this.left_tile.check_path(monitor_1, this);
						}
					}
					else{
						monitor_1.exit_found = true;
					}
					if(this.right_tile != null){
						if(this.right_tile.room != null && this.right_tile.room.kind_of_room == 4){
							this.right_tile.check_shop_path(monitor_2, this);
						}
						else{
							this.right_tile.check_path(monitor_2, this);
						}
					}
					else{
						monitor_2.exit_found = true;
					}
					if((monitor_1.exit_found || !monitor_1.room_exists) && (monitor_2.exit_found || !monitor_2.room_exists)){
						return true;
					}
				}
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	}
	
	this.room_construcktable = function(){
		if(this.funiture == null){
			var monitor = new function(){
						   this.member = [];
						   this.path = [];
						   this.wall_complete = true;
						   this.found_exit = false;
						   this.room_empty = true;
						   this.last_status = false;
						   this.add_to_room = function(tile){
								this.member.push(tile);
						   }
						   this.path_checkt = function(tile){
								this.path.push(tile);	
						   }
						   this.check_status = function(){
							   if(this.last_status != (this.wall_complete && this.found_exit && this.room_empty)){
								   this.last_status = this.wall_complete && this.found_exit && this.room_empty;
							   }
						   }
						   this.unhighlight = function(){
							   this.member.forEach(function(i){i.unhighlight()});
							   this.path.forEach(function(i){i.unhighlight()});
						   }
						   };
			var storage;
			if(this.own_ui.own_parent.new_room_id != 4){
				storage = this.check_area(monitor, true);
			}
			else{
				storage = this.check_shop_area(monitor);
			}
			for(tile in monitor.member){
				monitor.member[tile].highlight(monitor.last_status);
				if(monitor.last_status){
					monitor.member[tile].action_possible = true;
				}
			}
			return storage;
		}
		else{
			if(typeof focus_object.own_back_end !== 'undefined' && focus_object.own_back_end.monitor != null){
				focus_object.own_back_end.monitor.unhighlight();
			}
			return 2;
		}
	}
	
	this.wall_deletable = function(){
		if(typeof focus_object.own_back_end !== 'undefined' && focus_object.own_back_end.monitor != null){
			focus_object.own_back_end.monitor.unhighlight();
		}
		if(!this.outer_wall){
			if(this.funiture.id == 1 && this.try_fuse_rooms()){
				return true;
			}
			else if(this.funiture.id == 0){
				if((!this.funiture.top_wall || (this.funiture.top_wall && this.top_tile.funiture.id == 0)) &&
				   (!this.funiture.bot_wall || (this.funiture.bot_wall && this.bot_tile.funiture.id == 0)) &&
				   (!this.funiture.left_wall || (this.funiture.left_wall && this.left_tile.funiture.id == 0)) &&
				   (!this.funiture.right_wall || (this.funiture.right_wall && this.right_tile.funiture.id == 0)) && this.try_fuse_rooms()){
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
			
		}
		else{
			return false;
		}
	}
	
	this.room_deletable = function(){
		var monitor = new function(){
						      this.member = [];
							  this.room_empty = true;
							  
							  this.unhighlight = function(){
							   this.member.forEach(function(i){i.unhighlight()});
							  }
						  }
		this.check_area_deletable(monitor);
		for(tile in monitor.member){
			monitor.member[tile].highlight(monitor.room_empty);
			if(monitor.room_empty){
				monitor.member[tile].action_possible = true;
			}
		}
		return monitor.room_empty;
	}
	
	this.check_area = function(monitor, in_room){
		if(!monitor.member.includes(this) && in_room){
			monitor.add_to_room(this);
			this.monitor = monitor;
			var top_wall = false;
			var bot_wall = false;
			var left_wall = false;
			var right_wall = false;
			if(this.top_tile.funiture == null){
				this.top_tile.check_area(monitor, true);
			}
			else if(this.top_tile.funiture.id == 0){
				top_wall = true;
			}
			else if(this.top_tile.funiture.id == 1){
				top_wall = true;
				if(this.top_tile.outer_wall){
					monitor.found_exit = true;
					monitor.check_status();
				}
				else{
					this.top_tile.check_area(monitor, false);
				}
			}
			if(this.bot_tile.funiture == null){
				this.bot_tile.check_area(monitor, true);
			}
			else if(this.bot_tile.funiture.id == 0){
				bot_wall = true;
			}
			else if(this.bot_tile.funiture.id == 1){
				bot_wall = true;
				if(this.bot_tile.outer_wall){
					monitor.found_exit = true;
					monitor.check_status();
				}
				else{
					this.bot_tile.check_area(monitor, false);
				}
			}
			if(this.left_tile.funiture == null){
				this.left_tile.check_area(monitor, true);
			}
			else if(this.left_tile.funiture.id == 0){
				left_wall = true;
			}
			else if(this.left_tile.funiture.id == 1){
				left_wall = true;
				if(this.left_tile.outer_wall){
					monitor.found_exit = true;
					monitor.check_status();
				}
				else{
					this.left_tile.check_area(monitor, false);
				}
			}
			if(this.right_tile.funiture == null){
				this.right_tile.check_area(monitor, true);
			}
			else if(this.right_tile.funiture.id == 0){
				right_wall = true;
			}
			else if(this.right_tile.funiture.id == 1){
				right_wall = true;
				if(this.right_tile.outer_wall){
					monitor.found_exit = true;
					monitor.check_status();
				}
				else{
					this.right_tile.check_area(monitor, false);
				}
			}
			
			if(!this.check_wall_compleat(top_wall, bot_wall, left_wall, right_wall)){
				monitor.wall_complete = false;
				
			}
			if(this.room != null){
				monitor.room_empty = false;
			}
			monitor.check_status();
			if(this.monitor.last_status){
				return 1;
			}
			else{
				return 2;
			}
		}
		else if(!monitor.path.includes(this) && !in_room){
			monitor.path_checkt(this);
			if(this.room != null){
				monitor.found_exit = true;
				monitor.check_status();
			}
			else{
				if(this.top_tile.funiture == null){
					this.top_tile.check_area(monitor, false);
				}
				else if(this.top_tile.funiture.id == 1){
					if(this.top_tile.outer_wall){
						monitor.found_exit = true;
						monitor.check_status();
					}
					else{
						this.top_tile.check_area(monitor, false);
					}
				}
				if(this.bot_tile.funiture == null){
					this.bot_tile.check_area(monitor, false);
				}
				else if(this.bot_tile.funiture.id == 1){
					if(this.bot_tile.outer_wall){
						monitor.found_exit = true;
						monitor.check_status();
					}
					else{
						this.bot_tile.check_area(monitor, false);
					}
				}
				if(this.left_tile.funiture == null){
					this.left_tile.check_area(monitor, false);
				}
				else if(this.left_tile.funiture.id == 1){
					if(this.left_tile.outer_wall){
						monitor.found_exit = true;
						monitor.check_status();
					}
					else{
						this.left_tile.check_area(monitor, false);
					}
				}
				if(this.right_tile.funiture == null){
					this.right_tile.check_area(monitor, false);
				}
				else if(this.right_tile.funiture.id == 1){
					if(this.right_tile.outer_wall){
						monitor.found_exit = true;
						monitor.check_status();
					}
					else{
						this.right_tile.check_area(monitor, false);
					}
				}
			}
		}
		else{
			if(this.monitor == null){
				return 0;
			}
			else if(this.monitor.last_status){
				return 1;
			}
			else{
				return 2;
			}
		}
	}
	
	this.check_shop_area = function(monitor){
		if(!monitor.member.includes(this)){
			monitor.add_to_room(this);
			this.monitor = monitor;
			var top_wall = false;
			var bot_wall = false;
			var left_wall = false;
			var right_wall = false;
			if(this.top_tile.funiture == null){
				this.top_tile.check_shop_area(monitor, true);
			}
			else if(this.top_tile.funiture.id == 0){
				top_wall = true;
			}
			else if(this.top_tile.funiture.id == 1){
				top_wall = true;
				if(this.top_tile.outer_wall){
					monitor.found_exit = true;
					monitor.check_status();
				}
			}
			if(this.bot_tile.funiture == null){
				this.bot_tile.check_shop_area(monitor, true);
			}
			else if(this.bot_tile.funiture.id == 0){
				bot_wall = true;
			}
			else if(this.bot_tile.funiture.id == 1){
				bot_wall = true;
				if(this.bot_tile.outer_wall){
					monitor.found_exit = true;
					monitor.check_status();
				}
			}
			if(this.left_tile.funiture == null){
				this.left_tile.check_shop_area(monitor, true);
			}
			else if(this.left_tile.funiture.id == 0){
				left_wall = true;
			}
			else if(this.left_tile.funiture.id == 1){
				left_wall = true;
				if(this.left_tile.outer_wall){
					monitor.found_exit = true;
					monitor.check_status();
				}
			}
			if(this.right_tile.funiture == null){
				this.right_tile.check_shop_area(monitor, true);
			}
			else if(this.right_tile.funiture.id == 0){
				right_wall = true;
			}
			else if(this.right_tile.funiture.id == 1){
				right_wall = true;
				if(this.right_tile.outer_wall){
					monitor.found_exit = true;
					monitor.check_status();
				}
			}
			
			if(!this.check_wall_compleat(top_wall, bot_wall, left_wall, right_wall)){
				monitor.wall_complete = false;
				
			}
			if(this.room != null){
				monitor.room_empty = false;
			}
			monitor.check_status();
			if(this.monitor.last_status){
				return 1;
			}
			else{
				return 2;
			}
		}
		else{
			if(this.monitor == null){
				return 0;
			}
			else if(this.monitor.last_status){
				return 1;
			}
			else{
				return 2;
			}
		}
	}
	
	this.check_area_deletable = function(monitor){
		if(!monitor.member.includes(this)){
			this.monitor = monitor;
			monitor.member.push(this);
			if(this.funiture != null){
				monitor.room_empty = false;
			}
			if(this.top_tile.room != null){
				this.top_tile.check_area_deletable(monitor);
			}
			if(this.bot_tile.room != null){
				this.bot_tile.check_area_deletable(monitor);
			}
			if(this.left_tile.room != null){
				this.left_tile.check_area_deletable(monitor);
			}
			if(this.right_tile.room != null){
				this.right_tile.check_area_deletable(monitor);
			}
		}
	}
	
	this.check_wall_compleat = function(top_wall, bot_wall, left_wall, right_wall){
		if(top_wall && !bot_wall && left_wall && right_wall){
			if(this.top_tile.right_tile.room == null && this.top_tile.right_tile.funiture != null && this.top_tile.right_tile.funiture.id == 0 &&
			   this.top_tile.left_tile.room == null && this.top_tile.left_tile.funiture != null && this.top_tile.left_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(top_wall && bot_wall && !left_wall && right_wall){
			if(this.right_tile.bot_tile.room == null && this.right_tile.bot_tile.funiture != null && this.right_tile.bot_tile.funiture.id == 0 &&
			   this.right_tile.top_tile.room == null && this.right_tile.top_tile.funiture != null && this.right_tile.top_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(!top_wall && bot_wall && left_wall && right_wall){
			if(this.bot_tile.left_tile.room == null && this.bot_tile.left_tile.funiture != null && this.bot_tile.left_tile.funiture.id == 0 &&
			   this.bot_tile.right_tile.room == null && this.bot_tile.right_tile.funiture != null && this.bot_tile.right_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(top_wall && bot_wall && left_wall && !right_wall){
			if(this.left_tile.top_tile.room == null && this.left_tile.top_tile.funiture != null && this.left_tile.top_tile.funiture.id == 0 &&
			   this.left_tile.bot_tile.room == null && this.left_tile.bot_tile.funiture != null && this.left_tile.bot_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(top_wall && !bot_wall && !left_wall && right_wall){
			if(this.top_tile.right_tile.room == null && this.top_tile.right_tile.funiture != null && this.top_tile.right_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(!top_wall && bot_wall && !left_wall && right_wall){
			if(this.right_tile.bot_tile.room == null && this.right_tile.bot_tile.funiture != null && this.right_tile.bot_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(!top_wall && bot_wall && left_wall && !right_wall){
			if(this.bot_tile.left_tile.room == null && this.bot_tile.left_tile.funiture != null && this.bot_tile.left_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else if(top_wall && !bot_wall && left_wall && !right_wall){
			if(this.left_tile.top_tile.room == null && this.left_tile.top_tile.funiture != null && this.left_tile.top_tile.funiture.id == 0){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return true;
		}
	}
	
	this.try_fuse_rooms = function(){
		var connected_rooms = [];
		var top_room;
		var bot_room;
		var left_room;
		var right_room;
		
		if(!this.funiture.top_wall){
			connected_rooms.push(this.top_tile.room);
			top_room = this.top_tile.room;
		}
		if(!this.funiture.bot_wall){
			connected_rooms.push(this.bot_tile.room);
			bot_room = this.bot_tile.room;
		}
		if(!this.funiture.left_wall){
			connected_rooms.push(this.left_tile.room);
			left_room = this.left_tile.room;
		}
		if(!this.funiture.right_wall){
			connected_rooms.push(this.right_tile.room);
			right_room = this.right_tile.room;
		}
		
		if(connected_rooms.length == 4){
			return true;
		}
		else if(connected_rooms.length == 2 && !((this.funiture.top_wall && this.funiture.bot_wall) || (this.funiture.left_wall && this.funiture.right_wall))){
			if(this.funiture.top_wall && this.funiture.right_wall && this.bot_tile.room == null && this.right_tile.top_tile.room == null){
				return true;
			}
			else if(this.funiture.right_wall && this.funiture.bot_wall && this.left_tile.room == null && this.right_tile.bot_tile.room == null){
				return true;
			}
			else if(this.funiture.bot_wall && this.funiture.left_wall && this.top_tile.room == null && this.bot_tile.left_tile.room == null){
				return true;
			}
			else if(this.funiture.left_wall && this.funiture.top_wall && this.right_tile.room == null && this.left_tile.top_tile.room == null){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			var room
			for(var i = 0; i < connected_rooms.length; i++){
				if(connected_rooms[i] != null){
					room = connected_rooms[i];
					break;
				}
			}
			if(room != null){
				var fuse = true;
				for(var i = 0; i < connected_rooms.length; i++){
					if(connected_rooms[i] != room && connected_rooms[i] != null){
						fuse = false;
					}
				}
				return fuse;
			}
			else{
				return true;
			}
		}
	}
	
	this.check_path = function(monitor, forbidden_tile){
		if(!monitor.member.includes(this)){
			monitor.member.push(this);
			if(this.room != null){
				monitor.room_exists = true;
			}
			if(this.outer_wall && this.funiture.id == 1){
				monitor.exit_found = true;
			}
			else{
				if(this.top_tile != null && this.top_tile != forbidden_tile && !(this.top_tile.room == null && this.top_tile.funiture != null && this.top_tile.funiture.id == 0)){
					this.top_tile.check_path(monitor, forbidden_tile);
				}
				if(this.bot_tile != null && this.bot_tile != forbidden_tile && !(this.bot_tile.room == null && this.bot_tile.funiture != null && this.bot_tile.funiture.id == 0)){
					this.bot_tile.check_path(monitor, forbidden_tile);
				}
				if(this.left_tile != null && this.left_tile != forbidden_tile && !(this.left_tile.room == null && this.left_tile.funiture != null && this.left_tile.funiture.id == 0)){
					this.left_tile.check_path(monitor, forbidden_tile);
				}
				if(this.right_tile != null && this.right_tile != forbidden_tile && !(this.right_tile.room == null && this.right_tile.funiture != null && this.right_tile.funiture.id == 0)){
					this.right_tile.check_path(monitor, forbidden_tile);
				}
			}
		}
	}
	
	this.check_shop_path = function(monitor, forbidden_tile){
		if(!monitor.member.includes(this)){
			monitor.member.push(this);
			if(this.room != null){
				monitor.room_exists = true;
			}
			if(this.outer_wall && this.funiture.id == 1){
				monitor.exit_found = true;
			}
			else if(this.funiture != null && this.funiture.id == 1 && !this.outer_wall){
				
			}
			else{
				if(this.top_tile != null && this.top_tile != forbidden_tile && !(this.top_tile.room == null && this.top_tile.funiture != null && this.top_tile.funiture.id == 0)){
					this.top_tile.check_shop_path(monitor, forbidden_tile);
				}
				if(this.bot_tile != null && this.bot_tile != forbidden_tile && !(this.bot_tile.room == null && this.bot_tile.funiture != null && this.bot_tile.funiture.id == 0)){
					this.bot_tile.check_shop_path(monitor, forbidden_tile);
				}
				if(this.left_tile != null && this.left_tile != forbidden_tile && !(this.left_tile.room == null && this.left_tile.funiture != null && this.left_tile.funiture.id == 0)){
					this.left_tile.check_shop_path(monitor, forbidden_tile);
				}
				if(this.right_tile != null && this.right_tile != forbidden_tile && !(this.right_tile.room == null && this.right_tile.funiture != null && this.right_tile.funiture.id == 0)){
					this.right_tile.check_shop_path(monitor, forbidden_tile);
				}
			}
		}
	}
	
	this.highlight = function(constructable){
		if(constructable){
			this.own_ui.highlight_status = 1;
			this.action_possible = true;
		}
		else{
			this.own_ui.highlight_status = 2;
		}
		this.own_ui.draw_image();
	}
	
	this.unhighlight = function(){
		this.monitor = null;
		this.own_ui.highlight_status = 0;
		this.action_possible = false;
		this.own_ui.draw_image();
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		this.own_ui.own_parent.tile_click(this);
	}
}

function Ware_Stack_UI(own_parent, x, y){
	this.own_parent = own_parent;
	
	this.x = x;
	this.y = y;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	this.selected = false;
	
	this.pictur_x = 0;							//X position des Bildausschnittes
	
	this.own_back_end = null;
	
	this.draw_image = function(){
		if(this.own_back_end != null){
			ui_canvas.drawImage(image_repository.ware_tile , this.pictur_x, 0, 100, 100, this.x, this.y, 100, 100);
			if(this.own_back_end.ware != null){
				ui_canvas.drawImage(image_repository.wares , 100 * this.own_back_end.ware.id, 100 * this.own_back_end.ware.category_id, 100, 100, this.x, this.y, 100, 100);
			}
			ui_canvas.font = "bold 15px Arial";
			ui_canvas.fillText(this.own_back_end.stored_amount + "/" + this.own_back_end.stack_size, this.x + 65, this.y + 22);
		}
	}
	
	this.mouse_over = function(){
		if(mpos_x > this.x && mpos_x <= (this.x + 100) && mpos_y > this.y && mpos_y <= (this.y + 100)){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	this.mouse_out = function(){
		this.mouse_over_status = false;
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		if(!this.selected){
			this.selected = true;
			this.pictur_x = 100;
			if(this.own_parent.selected_storage == null){
				this.own_parent.selected_storage = this.own_back_end;
			}
			else{
				this.own_parent.selected_storage.own_ui.mouse_up();
				this.own_parent.selected_storage = this.own_back_end;
			}
		}
		else{
			this.selected = false;
			this.pictur_x = 0;
			this.own_parent.selected_storage = null;
		}
		this.draw_image();
	}
}

//Klasse für einen Stack einer Wahre im Lager
function Ware_Stack(storag, size){
	this.own_ui = null;
	
	this.storag = storag; 		//Referenz auf das Objekt dass diesen Stack beherbergt
	this.ware = null;			//Welche Ware liegt in diesem Stack
	this.stack_size = size;		//Wie viel von dieser Ware kann der Stack fassen
	this.stored_amount = 0;		//Wie viel von der Ware liegt jetzt gerade auf dem Stack

	this.is_activ = true;
	this.selected = false;
	
	this.set_ware = function(ware, amount){
		if(this.ware == null && this.stack_size >= amount){
			this.ware = ware;
			this.stored_amount = amount;
			this.draw_ware();
			return true;
		}
		else if(this.ware != null && this.ware.id == ware.id && this.stack_size >= this.stored_amount + amount){
			this.stored_amount += amount;
			this.draw_ware();
			return true;
		}
		else{
			return false;
		}
	}
	
	this.sell_ware = function(amount){
		this.stored_amount -= amount
		if(this.stored_amount == 0){
			this.ware = null;
		}
		this.own_ui.draw_image();
	}
}

//Klasse für eine Angebotsfeld auf dem markt
function Ware_Tile(id, y, ware, own_parent){
	this.x  = 500;
	this.y = y;
	this.width = 425;
	this.height = 120;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.pictur_y = 0;
	this.scroll_up_button = new Scroll_Button(0, this.x + 350, this.y + 10, this, true);
	this.scroll_down_button = new Scroll_Button(1, this.x + 385, this.y + 10, this, false);
	
	this.own_parent = own_parent;
	
	this.selected = false;
	this.is_activ = true;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	
	this.ware = ware;
	this.quantity = 0;
	
	this.draw_image = function(scroll_x, scroll_y){
		if(this.is_activ){
			this.scroll_x = scroll_x;
			this.scroll_y = scroll_y;
			ui_canvas.drawImage(image_repository.market_ware, 0, this.pictur_y, 425, 120, this.x - this.scroll_x, this.y - this.scroll_y, 425, 120);
			ui_canvas.drawImage(image_repository.wares, 100 * this.ware.id, 100 * this.ware.category_id, 100, 100, this.x - this.scroll_x + 5, this.y - this.scroll_y + 5, 100, 100);
			ui_canvas.font = "bold 12px Arial";
			ui_canvas.fillText(this.ware.name, this.x - this.scroll_x + 120, this.y - this.scroll_y + 30);
			ui_canvas.fillText(this.ware.buy_price + "$", this.x - this.scroll_x + 225, this.y - this.scroll_y + 30);
			ui_canvas.fillText(this.quantity, this.x - this.scroll_x + 293, this.y - this.scroll_y + 30);
			for(var i = 0; i < this.ware.description.length; i++){
				ui_canvas.fillText(this.ware.description[i], this.x - this.scroll_x + 120, 62 + 12 * i + this.y - this.scroll_y);
			}
			this.scroll_up_button.draw_image(this.scroll_x, this.scroll_y);
			this.scroll_down_button.draw_image(this.scroll_x, this.scroll_y);
		}
	}
	
	this.mouse_over = function(){
		if(mpos_x > (this.x + 5 - this.scroll_x) && mpos_x <= (this.x + 430 - this.scroll_x) && (mpos_y - this.scroll_y) > this.y && mpos_y <= (this.y + 120 - this.scroll_y) && this.is_activ){
			if(this.selected){
				if(this.scroll_up_button.mouse_over()){}
				else if(this.scroll_down_button.mouse_over()){}
				else{
					if(!this.mouse_over_status){
						this.mouse_over_status = true;
						focus_object.mouse_out();
						focus_object = this;
					}
				}
			}
			else{
				if(!this.mouse_over_status){
					this.mouse_over_status = true;
					focus_object.mouse_out();
					focus_object = this;
					this.draw_image(this.scroll_x, this.scroll_y);
				}
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	//Wird aufgerufen wenn die Maus auß dem Knopf fährt
	this.mouse_out = function(){
		this.mouse_over_status = false;
		this.pictur_x = 0;
		this.draw_image(this.scroll_x, this.scroll_y);
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		if(!this.selected){
			this.selected = true;
			this.pictur_y = 120;
			if(this.own_parent.selected_ware != null){
				this.own_parent.selected_ware.mouse_up();
			}
			this.own_parent.selected_ware = this;
		}
		else if(this.button_focus == null){
			this.selected = false;
			this.pictur_y = 0;
			this.quantity = 0;
			this.own_parent.update_buy_price();
			this.own_parent.selected_ware = null;
		}
		else{
			this.button_focus.mouse_up();
		}
		this.draw_image(this.scroll_x, this.scroll_y);
	}
	
	this.button_click = function(source){
		switch(source){
				case 0: if(this.quantity < 100000){
							this.quantity++;
							this.own_parent.update_buy_price();
						}
						break;
				case 1: if(this.quantity > 0){
							this.quantity--;
							this.own_parent.update_buy_price();
						}
						break;
		}
		this.draw_image(this.scroll_x, this.scroll_y);
	}
}

//Klasse für Einrichtungs Objecte
function Funiture(room, id, tile){
	this.id = id;														//ID des Einrichtungsobjekts
	this.room = room;													//Raum_ID des Einrichtungsobjekts
	this.parent_tile = tile; 											//Referenz auf das Tile auf dem die Einrichtung steht
	this.pictur_x;														//X position des Bildausschnittes
	this.pictur_y;														//Y position des Bildausschnittes
	
	this.action_id = 1;													//ID der Momentan laufenden Aktion(0: Ruhezustand 1: im Bau 2: Produzierend 3: Verkauft)
	if(room != null){
		this.time_left = existing_funiture[room.kind_of_room][id].construckion_time;	//Verbleibende Zeit der aktuellen Aktion in Sekunden
	}
	else{
		this.time_left = existing_funiture[0][id].construckion_time;
	}
	//Zeichnet das Einrichtungsobjekt
	this.draw_image = function(x, y){
		//Zeichnet das Objekt wenn es nicht gerade im bau ist
		if(this.action_id == 0){
			game_canvas.drawImage(image_repository.funiture,this.pictur_x, this.pictur_y, 75, 75, x, y, 75, 75);
		}
		else if(this.action_id > 1){
			game_canvas.drawImage(image_repository.funiture_at_work,this.pictur_x, this.pictur_y, 75, 75, x, y, 75, 75);
		}
		
		//Zeichnet die Aktuelle Zeit wenn ein Time läuft
		if(this.action_id != 0){
			var seconds = this.time_left % 60;
			var minutes = ((this.time_left % 3600) - seconds) / 60;
			var hour = (this.time_left - (this.time_left % 3600)) / 3600;
			if(seconds < 10){
				seconds = "0" + seconds;
			}
			if(minutes < 10){
				minutes = "0" + minutes;
			}
			if(hour < 10){
				hour = "0" + hour;
			}
			var time_string = hour + ":" + minutes + ":" + seconds;
			game_canvas.font = "bold 12px Arial";
			game_canvas.fillStyle = "BLACK";
			game_canvas.fillText(time_string, (x + 15), (y + 65));
		}
	}

	//geht eine Sekunde beim Timer weiter
	this.count_down = function(seconds){
		if((this.time_left - seconds) <= 0){
			this.time_left = 0;
			this.finish_action();
		}
		else{
			this.time_left -= seconds;
		}
	}

	//Beendet die momentane Aktion
	this.finish_action = function(){
	}
}

//Klasse für Räume
function Room(id, kind_of_room, member){
	this.id = id;						//ID des Raums
	this.kind_of_room = kind_of_room;	//ID des Typs des Raums (Schmiede, Laden, Lager, .)
	this.member = member; 				//Array mit den Referenzen auf die Kacheln die Teil des Raums sind
	this.counter = 0;
	
	//Funktion um die Instanz des Raums zu löschen inclusiver der Referenzen der Ehemaligen Kacheln auf diesen Raum
	this.delete_itself = function(){	
		for(var i = 0; i < this.member.length; i++){
			this.member[i].room = null;
			this.member[i].set_room();
		}
	}
	
	this.add_member = function(tile){
		member.push(tile);
		tile.room = this;
		tile.set_room(this.kind_of_room);
	}

	this.time_tick = function(seconds){
	}
}

//Klasse für den Datentüp Funiture der die Definition eines Einrichtungsobjekts enthält
function Funiture_Data(name, description, price, construckion_time, craftable_wares){
	this.name = name;
	this.description = description;
	this.price = price;
	this.construckion_time = construckion_time;
	this.craftable_wares = craftable_wares;
	
	this.get_construction_time = function(){
		var seconds = this.construckion_time % 60;
		var minutes = ((this.construckion_time % 3600) - seconds) / 60;
		var hour = (this.construckion_time - (this.construckion_time % 3600)) / 3600;
		if(seconds < 10){
			seconds = "0" + seconds;
		}
		if(minutes < 10){
			minutes = "0" + minutes;
		}
		if(hour < 10){
			hour = "0" + hour;
		}
		var time_string = hour + ":" + minutes + ":" + seconds;
		return time_string;
	}
}

//Klasse für den Datentüp Ware der die Definition einer Ware enthält
function Ware(category_id, id, name, buy_price, sell_price, description, production_cost, production_time){
	this.category_id = category_id;
	this.id = id;
	this.name = name;
	this.buy_price = buy_price;
	this.sell_price = sell_price;
	this.production_cost = production_cost;
	this.production_time = production_time;
	this.description = description.split(" ");
	var j = 0;
	var memory = this.description;
	this.description = [];
	this.description[0] = "";
	for(var i = 0; i < memory.length; i++){
		if(ui_canvas.measureText(this.description[j] + " " + memory[i]).width <= 240){
			this.description[j] = this.description[j] + " " + memory[i];
		}
		else{
			j++;
			this.description[j] = " " + memory[i];
		}
	}
}

function Customer_Data(id, preference, tolerance){
	this.id = id;
	this.preference = preference;
	this.tolerance = tolerance;
}