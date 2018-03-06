function customer_enters(offer){
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
				var k = 0;
				if(found_in_store[offer[j].new_product] == 0){
					k = 1;
				}
				else{
					k = 2^found_in_store[offer[j].new_product];
				}
				chance_for_enter += (preference[i][1]/k);
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

function convert_time_to_string(time){
	var seconds = time % 60;
	var minutes = ((time % 3600) - seconds) / 60;
	var hour = (time - (time % 3600)) / 3600;
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

//Klasse für Ein Default Object gegen nullpointer in der verarbeitung von maus und keybord eingaben
function Default_Object(){
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.draw_element = function(){}
	
	this.mouse_down = function(){}
	
	this.mouse_up = function(){}
	
	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){}
	
	//Wird aufgerufen wenn die Maus auß dem Knopf fährt
	this.mouse_out = function(){}
	
	this.mouse_wheel = function(){}
	
	this.key_down = function(key_event){}
	
	this.key_press = function(key_event){}
}

//-------------Algemeine UI Objekte-------------------------------------------
//Klasse für Menüfenster
function Ui_Part(x, y, width, height, own_parent){
	this.canvas = ui_canvas;
	this.own_parent = own_parent;
	this.sub_parts = [];
	
	this.x = x;
	this.y = y;
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = width;
	this.height = height;
	this.border_imag_x = 0;
	this.border_imag_y = 0;
	this.bg_imag_x = 0;
	this.bg_imag_y = 0;
	
	this.is_activ = true;
	
	this.draw_element = function(){
		if(this.is_activ){
			this.canvas.clearRect(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y, this.width, this.height);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x 		, this.border_imag_y 		, 5, 5, this.x           		+ this.parent_x - this.scroll_x, this.y             	  + this.parent_y - this.scroll_y, 5         	  , 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x 		, this.border_imag_y + 5 	, 5, 5, this.x           		+ this.parent_x - this.scroll_x, this.y + 5         	  + this.parent_y - this.scroll_y, 5        	  , this.height - 10);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x 		, this.border_imag_y + 10	, 5, 5, this.x  				+ this.parent_x - this.scroll_x, this.y + this.height - 5 + this.parent_y - this.scroll_y, 5         	  , 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 5 	, this.border_imag_y + 10	, 5, 5, this.x + 5        		+ this.parent_x - this.scroll_x, this.y + this.height - 5 + this.parent_y - this.scroll_y, this.width - 10, 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 10	, this.border_imag_y + 10	, 5, 5, this.x + this.width - 5	+ this.parent_x - this.scroll_x, this.y + this.height - 5 + this.parent_y - this.scroll_y, 5         	  , 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 10	, this.border_imag_y + 5 	, 5, 5, this.x + this.width - 5	+ this.parent_x - this.scroll_x, this.y + 5         	  + this.parent_y - this.scroll_y, 5         	  , this.height - 10);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 10	, this.border_imag_y 		, 5, 5, this.x + this.width - 5	+ this.parent_x - this.scroll_x, this.y             	  + this.parent_y - this.scroll_y, 5         	  , 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 5 	, this.border_imag_y 		, 5, 5, this.x + 5        		+ this.parent_x - this.scroll_x, this.y             	  + this.parent_y - this.scroll_y, this.width - 10, 5				);
			this.canvas.drawImage(image_repository.ui_panel_background	, this.bg_imag_x			, this.bg_imag_y			, 4, 4, this.x + 5				+ this.parent_x - this.scroll_x, this.y + 5 			  + this.parent_y - this.scroll_y, this.width - 10, this.height - 10);
			for(var i = 0; i < this.sub_parts.length; i++){
				this.sub_parts[i].draw_element();
			}
		}
	}
	
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.parent_x + this.width) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.parent_y + this.height)){
			var match = false;
			for(var i = 0; i < this.sub_parts.length; i++){
				if(this.sub_parts[i].mouse_over()){
					match = true;
					break;
				}
			}
			if(!match){
				focus_object.mouse_out();
				focus_object = default_focus;
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	this.add_element = function(new_element){
		new_element.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.sub_parts.push(new_element);
	}
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		}
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		}
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		}	
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].set_canvas(canvas);
		}
	}
	
	this.activate = function(){
		this.is_activ = true;
		this.draw_element();
	}
	
	this.deactivate = function(){
		this.is_activ = false;
		this.canvas.clearRect(this.x - 1, this.y - 1, this.width+ 2, this.height + 2);
	}
	
	this.clear_panel = function(){
		this.canvas.clearRect(this.x - 1, this.y - 1, this.width+ 2, this.height + 2);
	}
}

//Klasse für Scrollfenster
function Scrollable_Ui_Part(x, y, width, height, own_parent){
	this.canvas = ui_canvas;
	this.own_parent = own_parent;
	this.sub_parts = [];
	this.up_button = new Scroll_Button(1000, width - 40, 10, this, true);
	this.up_button.interval_delay = 25;
	this.down_button = new Scroll_Button(1001, width - 40, height - 40, this, false);
	this.down_button.interval_delay = 25;
	
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = width;
	this.height = height;
	this.border_imag_x = 0;
	this.border_imag_y = 0;
	this.bg_imag_x = 0;
	this.bg_imag_y = 0;
	
	this.scroll_value = 0;
	this.is_activ = true;
	
	this.draw_element = function(){
		if(this.is_activ){
			this.canvas.clearRect(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y, this.width, this.height);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x 		, this.border_imag_y 		, 5, 5, this.x           		 + this.parent_x - this.scroll_x, this.y             	  + this.parent_y - this.scroll_y, 5         	  , 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x 		, this.border_imag_y + 5 	, 5, 5, this.x           		 + this.parent_x - this.scroll_x, this.y + 5         	  + this.parent_y - this.scroll_y, 5        	  , this.height - 10);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x 		, this.border_imag_y + 10	, 5, 5, this.x  				 + this.parent_x - this.scroll_x, this.y + this.height - 5 + this.parent_y - this.scroll_y, 5         	  , 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 5 	, this.border_imag_y + 10	, 5, 5, this.x + 5        		 + this.parent_x - this.scroll_x, this.y + this.height - 5 + this.parent_y - this.scroll_y, this.width - 10, 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 10	, this.border_imag_y + 10	, 5, 5, this.x + this.width - 5	 + this.parent_x - this.scroll_x, this.y + this.height - 5 + this.parent_y - this.scroll_y, 5         	  , 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 10	, this.border_imag_y + 5 	, 5, 5, this.x + this.width - 5	 + this.parent_x - this.scroll_x, this.y + 5         	  + this.parent_y - this.scroll_y, 5         	  , this.height - 10);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 10	, this.border_imag_y 		, 5, 5, this.x + this.width - 5	 + this.parent_x - this.scroll_x, this.y             	  + this.parent_y - this.scroll_y, 5         	  , 5				);
			this.canvas.drawImage(image_repository.ui_panel_border		, this.border_imag_x + 5 	, this.border_imag_y 		, 5, 5, this.x + 5        		 + this.parent_x - this.scroll_x, this.y             	  + this.parent_y - this.scroll_y, this.width - 10, 5				);
			this.canvas.drawImage(image_repository.ui_panel_background	, this.bg_imag_x			, this.bg_imag_y			, 4, 4, this.x + 5				 + this.parent_x - this.scroll_x, this.y + 5 			  + this.parent_y - this.scroll_y, this.width - 10, this.height - 10);
			this.up_button.draw_element();
			this.down_button.draw_element();
			
			buffer_canvas.clearRect(this.x + this.parent_x + 5, this.y + this.parent_y + 5, this.width - 10, this.height - 10);			
			for(var i = 0; i < this.sub_parts.length; i++){
				this.sub_parts[i].draw();
			}
			this.canvas.drawImage(raw_buffer_canvas, this.x + this.parent_x + 5, this.y + this.parent_y + 5, this.width - 10, this.height - 10, this.x + this.parent_x + 5, this.y + this.parent_y + 5, this.width - 10, this.height - 10);
		}
	}
	
	this.redraw_element = function(id){
		if(id == 1000){
			this.up_button.draw_element();
		}
		else if(id == 1001){
			this.down_button.draw_element();
		}
		else{
			buffer_canvas.clearRect(this.x + this.parent_x + 5, this.y + this.parent_y + 5, this.width - 10, this.height - 10);			
			this.sub_parts[id].draw();
		}
		this.canvas.drawImage(raw_buffer_canvas, this.x + this.parent_x + 5, this.y + this.parent_y + 5, this.width - 10, this.height - 10, this.x + this.parent_x + 5, this.y + this.parent_y + 5, this.width - 10, this.height - 10);
	}
	
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.parent_x + this.width) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.parent_y + this.height)){
			wheel_focus = this
			var match = false;
			if(this.up_button.mouse_over()){
				match = true;
			}
			if(this.down_button.mouse_over()){
				match = true;
			}
			for(var i = 0; i < this.sub_parts.length; i++){
				
				if(this.sub_parts[i].mouse_over()){
					match = true;
					break;
				}
			}
			if(!match){
				focus_object.mouse_out();
				focus_object = default_focus;
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	this.mouse_out = function(){
		this.mouse_over_status = false;
		wheel_focus = default_focus;
	}
	
	this.mouse_wheel = function(e, value){
		if(value < 0){
			this.scroll_up();
			this.scroll_up();
			this.scroll_up();
		}
		else{
			this.scroll_down();
			this.scroll_down();
			this.scroll_down();
		}
		e.preventDefault();
	}
	
	this.add_element = function(new_element){
		new_element.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.sub_parts.push(new_element);
		new_element.element_id = this.sub_parts.length - 1;
		new_element.set_canvas(buffer_canvas);
		new_element.draw = new_element.draw_element;
		new_element.own_parent = this;
		new_element.draw_element = function(){this.own_parent.redraw_element(this.element_id)};
	}
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		this.up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		}
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		}
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		}
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.up_button.set_canvas(canvas);
		this.down_button.set_canvas(canvas);
	}
	
	this.activate = function(){
		this.is_activ = true;
		this.draw_element();
	}
	
	this.deactivate = function(){
		this.is_activ = false;
		this.canvas.clearRect(this.x - 1, this.y - 1, this.width+ 2, this.height + 2);
	}

	this.clear_panel = function(){
		this.canvas.clearRect(this.x - 1, this.y - 1, this.width+ 2, this.height + 2);
	}
	
	this.scroll_up = function(){
		if(this.scroll_value > 0){
			this.scroll_value -= 5;
			for(var i = 0; i < this.sub_parts.length; i++){
				this.sub_parts[i].scroll_position(0 ,this.scroll_value);
			}
			this.draw_element();
		}
	}
	
	this.scroll_down = function(){
		var size = 10;
		for(i in this.sub_parts){
			if(size < (this.sub_parts[i].y + this.sub_parts[i].height + 10)){
				size = this.sub_parts[i].y + this.sub_parts[i].height + 10;
			}
		}
		if(this.scroll_value < size - this.height){
			this.scroll_value += 5;
			for(var i = 0; i < this.sub_parts.length; i++){
				this.sub_parts[i].scroll_position(0 ,this.scroll_value);
			}
			this.draw_element();
		}
	}
	
	this.reset_scroll = function(){
		this.scroll_value = 0;
		for(var i = 0; i < this.sub_parts.length; i++){
			this.sub_parts[i].scroll_position(0 ,this.scroll_value);
		}
	}

	this.button_click = function(id){
		if(id == 1000){
			this.scroll_up();
		}
		else if(id == 1001){
			this.scroll_down();
		}
	}
	
	this.set_position(x,y);
}

//Klasse für Knöpfe
function Ui_Button(id, x, y, target, label){
	this.canvas = ui_canvas;			//Referenz auf die Zeichenebene
	this.target = target;		//Referenz auf das Fenster zu dem der Knopf gehört
	
	this.x = x;							//X position des Knopfes
	this.y = y;							//Y position des Knopfes
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = 200
	this.height = 40	
	this.pictur_x = 0;					//X position des Bildausschnittes
	this.pictur_y = 0;					//Y position des Bildausschnittes
	
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	
	this.id = id;						//ID Des Knopfes
	this.canvas.font = "bold 16px Arial";
	this.label = new Text_Line(Math.round((this.width - this.canvas.measureText(label).width - 20)/2),2, (this.canvas.measureText(label).width + 20), 16);		//Text_Area mit der Beschriftung des Knopfes
	this.label.set_text(label);
	this.label.background_activ = false;
	this.lock = false;					//Flag ob der Knopf eingerasstet ist
	this.is_activ = true;				//Flag ob der Knopf gerade aktiv ist
	this.tutorial_highlight = false;
	this.mouse_over_text = "";			//String für die Ausgabe als popup
	
	//Zeichnet den Knopf
	this.draw_element = function(){
		if(this.is_activ){
			this.canvas.drawImage(image_repository.button_image, this.pictur_x, this.pictur_y, 200, 40, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y , this.width, this.height);
			this.label.draw_element();
			if(this.tutorial_highlight){
				this.canvas.drawImage(image_repository.shop_tile_marking, 150, 0, 75, 75, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y , this.width, this.height);
			}
		}
	}
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		this.label.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.label.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.label.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.label.set_canvas(canvas);
	}
	
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.mouse_down = function(){

	}
	
	this.mouse_up = function(){
		this.target.button_click(this.id);
		var old = selected_object;
		selected_object = default_focus;
		old.draw_element();
	}
	
	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.width + this.parent_x) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.height + this.parent_y)){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.pictur_x = 200;
				this.draw_element();
				if(this.mouse_over_text != ""){
					mouse_over_tooltip.show_tooltip(this.x + this.parent_x - this.scroll_x + this.width + 15, mpos_y, this.mouse_over_text);
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
		if(this.is_activ){
			this.draw_element();
		}
		if(this.mouse_over_text != ""){
			mouse_over_tooltip.hide_tooltip();
		}
	}
	
	this.set_label = function(label_text){
		this.label.set_text(label_text);
		this.label.x = Math.round((this.width - this.canvas.measureText(label_text).width - 20)/2);
		this.label.width = this.canvas.measureText(label_text).width + 20;
	}
	
	//Activiert einen Knopf
	this.activate = function(){
		this.is_activ = true;
		this.draw_element();
	}
	
	//Deactiviert einen Knopf
	this.deactivate = function(){
		this.is_activ = false;
		this.canvas.clearRect(this.x, this.y, this.width, this.height);
	}
	
	this.set_position(x, y);
}

//Klasse für Schließen Knöpfe
function Close_Button(id, x, y, target){
	this.canvas = ui_canvas;
	this.target = target;
	
	this.x = x;							//X position des Knopfes
	this.y = y;							//Y position des Knopfes
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = 30;
	this.height = 30;
	this.pictur_x = 0;					//X position des Bildausschnittes
	this.pictur_y = 0;					//Y position des Bildausschnittes
	
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	this.id = id;						//ID Des Knopfes
	this.is_activ = true;				//Flag ob der Knopf gerade aktiv ist
	
	//Zeichnet den Knopf
	this.draw_element = function(){
		if(this.is_activ){
			this.canvas.drawImage(image_repository.close_button, this.pictur_x, this.pictur_y, 30, 30, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y , this.width, this.height);
		}
	}
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
	}
	
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.mouse_down = function(){

	}
	
	this.mouse_up = function(){
		this.target.button_click(this.id);
		var old = selected_object;
		selected_object = default_focus;
		old.draw_element();
	}
	
	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.width + this.parent_x) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.height + this.parent_y)){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.pictur_x = 30;
				this.draw_element();
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
		this.draw_element();
	}
	
	//Activiert einen Knopf
	this.activate = function(){
		this.is_activ = true;
		this.draw_element();
	}
	
	//Deactiviert einen Knopf
	this.deactivate = function(){
		this.is_activ = false;
		this.canvas.clearRect(this.x, this.y, this.width, this.height);
	}
}

//Klasse für Scrollbutton
function Scroll_Button(button_id, x, y, target, up_down){
	
	this.canvas = ui_canvas;
	this.target = target;
	
	this.x = x;							//X position des Knopfes
	this.y = y;							//Y position des Knopfes
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = 30;
	this.height = 30;
	this.tutorial_highlight = false;
	
	if(up_down){
		this.pictur_y = 0;				//Y position des Bildausschnittes
	}
	else{
		this.pictur_y = 30;
	}
	this.pictur_x = 0;
		
	this.button_id = button_id;						//ID Des Knopfes
	this.is_activ = true;				//Flag ob der Knopf gerade aktiv ist
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	
	this.interval_delay = 150;
	this.interval_id = 0;
	
	//Zeichnet den Knopf
	this.draw_element = function(){
		if(this.is_activ){
			this.canvas.drawImage(image_repository.up_down_button, this.pictur_x, this.pictur_y, 30, 30, this.x - this.scroll_x + this.parent_x, this.y - this.scroll_y + this.parent_y, this.width, this.height);
			if(this.tutorial_highlight){
				this.canvas.drawImage(image_repository.shop_tile_marking, 150, 0, 75, 75, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y , this.width, this.height);
			}
		}
	}
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
	}

	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > this.x - this.scroll_x + this.parent_x && mpos_x <= (this.x + 30 - this.scroll_x + this.parent_x) && mpos_y > this.y - this.scroll_y + this.parent_y && mpos_y <= (this.y + 30 - this.scroll_y + this.parent_y)){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.pictur_x = 30;
				this.draw_element();
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
		if(this.interval_id != null){
			this.mouse_up();
		}
		this.draw_element();
	}
	
	this.mouse_down = function(){
		this.spam_button(this.target, this.button_id);
		this.interval_id = setInterval(this.spam_button, this.interval_delay, this.target, this.button_id);
	}
	
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.mouse_up = function(){
		clearInterval(this.interval_id);
	}
	
	this.spam_button = function(target, id){
		target.button_click(id);
	}
	
	this.activate = function(){
		this.is_activ = true;
		this.draw_element();
	}
	
	this.deactivate = function(){
		this.is_activ = false;
		this.canvas.clearRect(this.x - 1, this.y - 1, this.width+ 2, this.height + 2);
	}
}

function Text_Input(x, y, width, height, font_size, addet_text, own_parent){
	this.is_activ = true;				//Flag ob der Knopf gerade aktiv ist
	this.own_parent = own_parent;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt
	this.background = new Ui_Part(x, y, width, height, this);
	this.canvas = ui_canvas;
	
	this.x = x;
	this.y = y;
	this.parent_x = 0;
	this.parent_y = 0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = width;
	this.height = height;
	
	this.content = "";
	this.addet_text = addet_text;
	this.default_text = "";
	
	this.key_limit = null;
	this.input_length_limit = 0;
	this.curser_position = 0;
	this.background_activ = true;
	
	this.font_size = font_size;
	this.font_style = "bold";
	this.font_family = "Arial";
	this.font_color = "black";
	
	this.element_id = 0;

	this.draw_element = function(){
		if(this.is_activ){
			if(this.background_activ){
				this.background.draw_element();
			}
			if(this.content != ""){
				this.canvas.fillStyle = this.font_color;
				this.canvas.font = this.font_style + " " + this.font_size + "px " + this.font_family;
				this.canvas.fillText(this.content + this.addet_text, this.x + this.parent_x + (this.width - this.canvas.measureText(this.content + this.addet_text).width) - 10 - this.scroll_x, this.y + this.parent_y + this.height - ((this.height - this.font_size) / 2) - this.scroll_y);
				if(selected_object == this){
					var pointer_position_x = this.x + this.parent_x + this.width - 10 - (this.canvas.measureText(this.content.substring(0,this.curser_position)).width) - this.scroll_x - this.canvas.measureText(this.addet_text).width;
					var pointer_position_y = this.y + this.parent_y + (this.height + this.font_size)/2 - this.scroll_y;
					this.canvas.beginPath();
					this.canvas.moveTo(pointer_position_x,pointer_position_y - this.font_size);
					this.canvas.lineTo(pointer_position_x,pointer_position_y);
					this.canvas.stroke();
				}
			}
			else{
				if(selected_object != this){
					this.canvas.fillStyle = this.font_color;
					this.canvas.font = this.font_style + " " + this.font_size + "px " + this.font_family;
					this.canvas.fillText(this.default_text + this.addet_text, this.x + this.parent_x + (this.width - this.canvas.measureText(this.default_text + this.addet_text).width) - 10 - this.scroll_x, this.y + this.parent_y + this.height - ((this.height - this.font_size) / 2) - this.scroll_y);
				}
				else{
					var pointer_position_x = this.x + this.parent_x + this.width - 10 - (this.canvas.measureText(this.content.substring(0,this.curser_position)).width) - this.scroll_x - this.canvas.measureText(this.addet_text).width;
					var pointer_position_y = this.y + this.parent_y + (this.height + this.font_size)/2 - this.scroll_y;
					this.canvas.beginPath();
					this.canvas.moveTo(pointer_position_x,pointer_position_y - this.font_size);
					this.canvas.lineTo(pointer_position_x,pointer_position_y);
					this.canvas.stroke();
				}
			}
		}
	}	
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		this.background.set_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.background.update_position(x, y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.background.scroll_position(x, y);
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.background.set_canvas(canvas);
	}
	
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.mouse_down = function(){

	}
	
	this.mouse_up = function(){
		selected_object = this;
		if(this.background_activ){
			this.draw_element();
		}
		else{
			this.own_parent.draw_element();
		}
	}
	
	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > (this.x + this.parent_x - this.scroll_x) && mpos_x <= (this.x + this.parent_x - this.scroll_x + this.width) && mpos_y > (this.y + this.parent_y - this.scroll_y) && mpos_y <= (this.y + this.parent_y - this.scroll_y + this.height)){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
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
	}
	
	this.unselect = function(){
		selected_object = default_focus;
		this.own_parent.redraw_element(this.element_id);
	}
	
	this.key_down = function(key_event){
		if(key_event.keyCode == 8 && this.content != "" && this.content.length - this.curser_position - 1 >= 0){
			key_event.preventDefault();
			this.content = this.content.slice(0, this.content.length - this.curser_position - 1) + this.content.slice(this.content.length - this.curser_position,this.content.length);
		}
		else if(key_event.keyCode == 37 && this.curser_position < (this.content + this.addet_text).length){
			this.curser_position++;
		}
		else if(key_event.keyCode == 39 && this.curser_position > 0){
			this.curser_position--;
		}
		if(this.background_activ){
			this.draw_element();
		}
		else{
			this.own_parent.draw_element();
		}
	}
	
	this.key_press = function(key_event){
		if(this.input_length_limit == 0 || this.content.length < this.input_length_limit){
			if(key_event.charCode >= 48 && key_event.charCode <= 122){
				if(this.key_limit == null){
					this.content = this.content.slice(0, this.content.length - this.curser_position) + String.fromCharCode(key_event.charCode) + this.content.slice(this.content.length - this.curser_position,this.content.length); 
				}
				else if(this.key_limit.indexOf(key_event.charCode) != (-1)){
					this.content = this.content.slice(0, this.content.length - this.curser_position) + String.fromCharCode(key_event.charCode) + this.content.slice(this.content.length - this.curser_position,this.content.length); 
				}
			}
			if(this.background_activ){
				this.draw_element();
			}
			else{
				this.own_parent.draw_element();
			}
		}
	}

	this.activate = function(){
		this.is_activ = true;
		if(this.background_activ){
			this.draw_element();
		}
		else{
			this.own_parent.draw_element();
		}
	}
	
	this.deactivate = function(){
		this.is_activ = false;
		if(this.background_activ){
			this.canvas.clearRect(this.x, this.y, this.width, this.height);
		}
		else{
			this.own_parent.draw_element();
		}
	}
}

//Klasse für eine Textausgabefeld
function Text_Area(x, y, width, font_size){
	this.is_activ = true;				//Flag ob der Knopf gerade aktiv ist
	this.canvas = ui_canvas;
	this.background = new Ui_Part(x, y, width, 0, this);
	
	this.x = x;
	this.y = y;
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = width;
	this.height = 0;
	
	this.content = "";
	this.background_activ = true;
	
	this.font_size = font_size;
	this.font_style = "bold";
	this.font_family = "Arial";
	this.font_color = "black";
		
	this.draw_element = function(){
		if(this.is_activ){
			if(this.background_activ){
				this.background.draw_element();
			}  
			this.canvas.fillStyle = this.font_color;
			this.canvas.font = this.font_style + " " + this.font_size + "px " + this.font_family;	
			for(var i = 0; i < this.content.length; i++){
				this.canvas.fillText(this.content[i], this.x + this.parent_x - this.scroll_x + 5, this.y + this.parent_y - this.scroll_y + this.font_size + 5 + (this.font_size + 5) * i);
			}
		}
	}

	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		this.background.set_position(x, y);
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.background.update_position(x, y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.background.scroll_position(x, y);
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.background.set_canvas(canvas);
	}
	
	this.set_text = function(text_content){
		this.canvas.font = this.font_style + " " + this.font_size + "px " + this.font_family;
		var memory = text_content.split("//");
		for(i in memory){
			memory[i] = memory[i].split(" ");
		}
		var k = 0;
		this.content = [];
		this.content[0] = "";
		for(var i = 0; i < memory.length; i++){
			for(var j = 0; j < memory[i].length; j++){
				if(this.canvas.measureText(this.content[k] + " " + memory[i][j]).width <= this.width - 10){
					this.content[k] = this.content[k] + " " + memory[i][j];
				}
				else{
					k++;
					this.content[k] = " " + memory[i][j];
				}
			}
			k++;
			this.content[k] = "";
		}
		this.height = this.font_size + (this.font_size + 5) * (k);
		this.background.height = this.height;
	}
	
	this.mouse_over = function(){
	
	}
	
	this.activate = function(){
		this.is_activ = true;
		this.draw_element();
	}
	
	this.deactivate = function(){
		this.is_activ = false;
		this.canvas.clearRect(this.x, this.y, this.width, this.height);
	}
	
	this.clear_text = function(){
		this.canvas.clearRect(this.x, this.y, this.width, this.height);
	}
}

//Klasse für eine Textausgabefeld
function Text_Line(x, y, width, font_size){
	this.is_activ = true;				//Flag ob der Knopf gerade aktiv ist
	this.canvas = ui_canvas;
	this.background = new Ui_Part(x, y, width, font_size + 20, this);
	
	this.x = x;
	this.y = y;
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = width;
	this.height = font_size + 20;
	
	this.content = "";
	this.background_activ = true;
	this.mouse_over_status = false;
	
	this.mouse_over_text = "";			//String für die Ausgabe als popup
	
	this.font_size = font_size;
	this.font_style = "bold";
	this.font_family = "Arial";
	this.font_color = "black";
	
	this.draw_element = function(){
		if(this.is_activ){
			if(this.background_activ){
				this.background.draw_element();
			}  
			this.canvas.fillStyle = this.font_color;
			this.canvas.font = this.font_style + " " + this.font_size + "px " + this.font_family;	
			this.canvas.fillText(this.content, this.x + this.parent_x - this.scroll_x + 10, this.y + this.parent_y - this.scroll_y + this.font_size + 8);

		}
	}

	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		this.background.set_position(x, y);
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.background.update_position(x, y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.background.scroll_position(x, y);
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.background.set_canvas(canvas);
	}
	
	this.set_text = function(text_content){
		this.content = text_content;
		this.background.height = this.font_size + 20;
	}
	
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.width + this.parent_x) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.height + this.parent_y)){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				if(this.mouse_over_text != ""){
					mouse_over_tooltip.show_tooltip(this.x + this.parent_x - this.scroll_x + this.width + 15, mpos_y, this.mouse_over_text);
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
		if(this.is_activ){
			this.draw_element();
		}
		if(this.mouse_over_text != ""){
			mouse_over_tooltip.hide_tooltip();
		}
	}
	
	this.activate = function(){
		this.is_activ = true;
		this.draw_element();
	}
	
	this.deactivate = function(){
		this.is_activ = false;
		this.canvas.clearRect(this.x, this.y, this.width, this.height);
	}
	
	this.clear_text = function(){
		this.canvas.clearRect(this.x, this.y, this.width, this.height);
	}
}

//------------Einmalige Objekte-----------------------------------------------
//Klasse für den hilfe knopf
function Help_Button(x, y){
	this.x = x;							//X position des Knopfes
	this.y = y;							//Y position des Knopfes
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = 30;
	this.height = 30;
	this.pictur_x = 0;					//X position des Bildausschnittes
	this.pictur_y = 0;					//Y position des Bildausschnittes
	
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	this.highlighted = false;
	this.interval_id = 0;
	
	//Zeichnet den Knopf
	this.draw_element = function(){
		ui_canvas.drawImage(image_repository.help_button, this.pictur_x, this.pictur_y, 30, 30, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y , this.width, this.height);
	}
	
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.mouse_down = function(){

	}
	
	this.mouse_up = function(){
		if(this.highlighted){
			this.end_highlight();
		}
		help_screen.show_help();
		var old = selected_object;
		selected_object = default_focus;
		old.draw_element();
	}
	
	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){
		if(mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.width + this.parent_x) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.height + this.parent_y)){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.pictur_x = 30;
				this.draw_element();
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
		this.draw_element();
	}
	
	this.start_highlight = function(){
		this.highlighted = true;
		this.interval_id = setInterval(this.highlight, 500, this);
	}
	
	this.end_highlight = function(){
		this.highlighted = false;
		clearTimeout(this.interval_id);
		this.interval_id = 0;
		this.pictur_y = 0;
	}
	
	this.highlight = function(help_button){
		if(help_button.pictur_y == 0){
			help_button.pictur_y = 30;
		}
		else if(help_button.pictur_y == 30){
			help_button.pictur_y = 0;
		}
		help_button.draw_element()
	}
	this.start_highlight();
}

function Help_Screen(){
	
	this.help_content = [];
	
	this.panel = new Ui_Part(100, 40, 1000, 600, this)
	this.panel.add_element(new Close_Button(1000, 960, 10, this));
	this.panel.add_element(new Scrollable_Ui_Part(10, 45, 255, 545, this));
	this.panel.add_element(new Scrollable_Ui_Part(270, 45, 720, 545, this));
	
	this.panel.sub_parts[1].add_element(new Ui_Button(0, 10, 10, this, "Grundlagen"));
	this.panel.sub_parts[1].add_element(new Ui_Button(1, 10, 55, this, "Die Handwerkszweige"));
	this.panel.sub_parts[1].add_element(new Ui_Button(2, 10, 100, this, "Bauen"));
	this.panel.sub_parts[1].add_element(new Ui_Button(3, 10, 145, this, "Lager"));
	this.panel.sub_parts[1].add_element(new Ui_Button(4, 10, 190, this, "Markt"));
	this.panel.sub_parts[1].add_element(new Ui_Button(5, 10, 235, this, "Produzieren"));
	this.panel.sub_parts[1].add_element(new Ui_Button(6, 10, 280, this, "Einzelhandel"));
	
	this.panel.set_canvas(popup_canvas);
	
	this.activ = false;

	
	this.mouse_over = function(){
		if(this.activ){
			if(!this.panel.mouse_over()){
				focus_object.mouse_out();
				focus_object = default_focus;
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	this.show_help = function(){
		this.activ = true;
		this.panel.activate();
	}
	
	this.hide_help = function(){
		focus_object.mouse_out();
		focus_object = default_focus;
		this.activ = false;
		this.panel.deactivate();
	}
	
	this.define_help_content = function(){
		//Ä, ä 		\u00c4, \u00e4	Ö, ö 		\u00d6, \u00f6	Ü, ü 		\u00dc, \u00fc	ß 		\u00df
		this.panel.sub_parts[2].add_element(new Text_Area(5, 5, 670, 12));
		this.panel.sub_parts[2].sub_parts[0].set_text("Ziel des Spiels ist es ein Unternehmen aufzubauen und am Ende der Runde der Spieler mit dem h\u00f6chsten Verm\u00f6genswert zu sein. " +
		"Hierf\u00fcr steht dir ein Unternehmensgeb\u00e4ude zur Verf\u00fcgung dass vergr\u00f6\u00dfert, verbessert und nach deiner Unternehmensplanung ausgestattet werden kann.////" +
		"Ob du dich auf einen Handwerkszweig spezialisieren um h\u00f6chste Effizienz zu erreichen oder mehrere verschiedene Werkst\u00e4tten " +
		"betreibst um deine Produktpalette zu erweitern und um von dir ben\u00f6tigten Einzelteile aus anderen Handwerkszweigen selbst g\u00fcnstiger herzustellen liegt bei dir. " +
		"Auch musst du dich entscheiden ob du deine Waren zu relativ stabilen Preisen am Gro\u00dfmarkt mit vergleichsweise geringem Gewinn verkaufen m\u00f6chtest oder ob du in deinem " +
		"Unternehmensgeb\u00e4ude einen eigenen Laden haben m\u00f6chtest in dem du deine Waren im Einzelhandel verkaufst. Der Einzelhandel wirft im Regelfall mehr Gewinn ab, wenn du denn die " +
		"richtigen Kunden findest. Au\u00dferdem verbraucht der Laden, Platz den du nicht mehr f\u00fcr Produktionseinrichtungen verwenden kannst.////" +
		"Du beginnst mit einem Geb\u00e4ude dass eine Gr\u00f6\u00dfe von 5*4 Felder hat. Damit stehen dir 20 Felder zum bebauen wobei die Au\u00dfenwand nicht " +
		"mitgerechnet wird da sie weder abgerissen noch bebaut werden kann.////" +
		"Als Erst musst du dein Geb\u00e4ude mit Mauern in einzelne R\u00e4ume unterteilen. In wie viele ist dir \u00fcberlassen es sei aber gesagt " +
		"dass aufgrund dessen dass du unabh\u00e4ngig von deiner Gesch\u00e4ftsidee auf jeden Fall ein Lager brauchen wirst, es mindestens 2 sein m\u00fcssen.////" +
		"Anschlie\u00dfend kannst du in den von dir ausgelegten Grundriss die R\u00e4ume bauen und diese mit Einrichtung ausstatten. F\u00fcr eine " +
		"Erkl\u00e4rung wie die Regeln beim Bauen sind schaue im Hilfsfenster unter Bauen");
		this.panel.sub_parts[2].sub_parts[0].background_activ = false;
		this.panel.sub_parts[2].set_canvas(popup_canvas);
		this.help_content[0] = this.panel.sub_parts[2].sub_parts;
		this.panel.sub_parts[2].sub_parts = [];
		
		this.panel.sub_parts[2].add_element(new Text_Area(5, 5, 670, 12));
		this.panel.sub_parts[2].sub_parts[0].set_text("Die Beschreibung der einzelen Handwerkszeige");
		this.panel.sub_parts[2].set_canvas(popup_canvas);
		this.panel.sub_parts[2].sub_parts[0].background_activ = false;
		this.help_content[1] = this.panel.sub_parts[2].sub_parts;
		this.panel.sub_parts[2].sub_parts = [];
		
		this.panel.sub_parts[2].add_element(new Text_Area(5, 5, 670, 12));
		this.panel.sub_parts[2].sub_parts[0].set_text("Nachdem du dich entschieden hast, was dein Gesch\u00e4ftsmodell sein soll kannst du nun damit beginnen dein Gesch\u00e4ftsgeb\u00e4ude " +
		"dementsprechend auszubauen.////Der Bau deines Gesch\u00e4fts verl\u00e4uft im allgemeinen in 3 Schritten:////1: Der Grundriss//Als Erstes musst du die Dir zur Verf\u00fcgung stehende " +
		"Baufl\u00e4che mit Mauern in einzelne R\u00e4ume zu unterteilen. Klick hierf\u00fcr in der Gesch\u00e4ftsansicht auf Bauen und w\u00e4hle im nun erscheinenden Untermen\u00fc \"Baue Mauer\". Nun kannst " +
		"kannst du auf freie Fl\u00e4chen klicken um dort Mauerteile zu bauen. Mauern k\u00f6nnen nur auf freien Baufl\u00e4chen errichtet werden die keinem Raum zugeteilt sind und sie d\u00fcrfen nicht " +
		"so platziert werden, dass sie T\u00fcren verdecken. Sollte ein Wandsegment aus irgend einem Grund an einer gew\u00e4hlten Stelle nicht gebaut werden k\u00f6nnen wird sich die Fl\u00e4che von " +
		"statt Blau, Rot f\u00e4rben. In diesem Fall kannst du auf die Fl\u00e4che klicken um zu erfahren was das Problem ist.\\Alle deinem R\u00e4ume ben\u00f6tigen eine T\u00fcr um benutzt werden zu k\u00f6nnen. " +
		"Um eine T\u00fcr zu bauen, klicke auf ein bestehendes Mauersegment. Es darf sich dabei nicht um ein Eckst\u00fcck handeln und die zu bauende T\u00fcr darf nicht durch andere Segmente blockiert " +
		"werden. Um eine T\u00fcr wieder zu zumauern klicke im Mauerbaumodus auf sie. Sollte die T\u00fcr als Pfad ben\u00f6tigt werden kann sie nicht zugemauert werden////2: Die Raumnutzung//Nun " +
		"da du Grundriss deines Geb\u00e4udes festgelegt hast kannst du zuteilen welcher " +
		"Raum f\u00fcr welche Aufgabe genutzt wird. Hierf\u00fcr klickst du im Bau Men\u00fc auf Baue Raum. Im Aufgehenden Fenster w\u00e4hlst du nun einen Raum aus den du bauen m\u00f6chtest und klickst " +
		"anschlie\u00dfend auf einen freien Raum in deinem Gesch\u00e4ft. Hierbei gelten drei Regeln.//Erstens muss die Wand des Raumes durchgehend und L\u00fcckenlos sein.//Zweitens muss die Baufl\u00e4che " +
		"frei sein was bedeutet dass sie keinem anderen Raum zugeteilt sein darf.//Drittens muss jeder Raum eine T\u00fcr haben und \u00fcber diese T\u00fcr einen Pfad zu einem Ausgang des Geb\u00e4udes haben. " +
		"Ein Ausgang ist eine T\u00fcr in der Au\u00dfenwand des Geb\u00e4udes. Der Verkaufsraum stellt einen Sonderfall dar. Da deine Kunden nicht durch dein Lager oder deine Werkst\u00e4tten laufen sollen, " +
		"muss ein Verkaufsraum direkt an der Au\u00dfenwand liegen und muss eine T\u00fcr direkt nach drau\u00dfen haben.////3: Die Einrichtung//Der letzte Schritt besteht nun darin in deinen R\u00e4umen " +
		"R\u00e4umen Einrichtungsobjekte zu Platzieren. Diese bestimmen was genau in deinem Raum gemacht werden kann und was sie f\u00fcr Eigenschaften haben. Hierzu z\u00e4hlen zum Beispiel " +
		"Arbeitsfl\u00e4chen f\u00fcr deine Arbeiter in Werkst\u00e4tten, Ausstelltische in deinem Verkaufsraum um dein Angebot darauf auszubreiten oder Regale und Kisten in deinem Lager.//" +
		"Um Einrichtung zu baue klicke im Baumen\u00fc auf \"Baue Einrichtung\" und klicke anschlie\u00dfen auf eine freie Baufl\u00e4che in einem deiner zugeteilten R\u00e4ume. Nun \u00f6ffnet sich ein " +
		"Fenster in dem du ausw\u00e4hlen kannst welche Einrichtung dort plaziert werden soll.////Zum Schluss nun noch eine Erkl\u00e4rungen zum Abriss f\u00fcr den Fall dass dir ein Fehler unterl\u00e4uft " +
		"oder du umstrukturieren m\u00f6chtest.//Klicke im Baumen\u00fc auf \"Abrei\u00dfen\" und anschlie\u00dfen auf das Objekt dass du abrei\u00dfen m\u00f6chtest. Objekte k\u00f6nnen nur abgerissen werden wenn " +
		"damit keine Regeln des Baus gebrochen werden. Um einen Raum zu Entfernen m\u00fcssen vorher alle Einrichtungsobjekte in diesem Raum entfernt werden und eine Mauer zwischen zwei zugeteilten " +
		"R\u00e4umen kann nicht entfernt werden. Wenn eine Mauer zwischen einem Zugeteilten Raum und einem ungenutzten Raum entfernt wird, wird der Zugeteilte Raum auf die komplette freie Fl\u00e4che " +
		"erweitert. Genauso wird die Fl\u00e4che die beim Abriss einer Mauer frei wird dem angrenzenden Raum zugeteilt. Mauern die direkt an einer T\u00fcr liegen oder die Teil der Au\u00dfenwand sind k\u00f6nnen " +
		"ebenfalls nicht abgerissen werden.");
		this.panel.sub_parts[2].set_canvas(popup_canvas);
		this.panel.sub_parts[2].sub_parts[0].background_activ = false;
		this.help_content[2] = this.panel.sub_parts[2].sub_parts;
		this.panel.sub_parts[2].sub_parts = [];
		
		this.panel.sub_parts[2].add_element(new Text_Area(5, 5, 670, 12));
		this.panel.sub_parts[2].sub_parts[0].set_text("Jedes Gesch\u00e4ft ben\u00f6tigt ein Lager.//Das gesamte Lager besteht aus allen Lagerr\u00e4umen die sich im Gesch\u00e4ftsgeb\u00e4ude befinden.//" +
		"Jedes Einrichtungsobjekt in einem Lager hat eine gewisse anzahl an Lagerpl\u00e4tzen und jeder dieser Pl\u00e4tze hat eine gewisse menge die er fassen kann. Ein einzelner Platz kann " +
		"nur eine Ware fassen.//Ein Einrichtungsobjekt im Lager kann nur dann abgerissen werden wenn es Leer ist oder es m\u00f6glich ist die restlichen Waren darin auf andere Pl\u00e4tze umzulagern");
		this.panel.sub_parts[2].set_canvas(popup_canvas);
		this.panel.sub_parts[2].sub_parts[0].background_activ = false;
		this.help_content[3] = this.panel.sub_parts[2].sub_parts;
		this.panel.sub_parts[2].sub_parts = [];
		
		this.panel.sub_parts[2].add_element(new Text_Area(5, 5, 670, 12));
		this.panel.sub_parts[2].sub_parts[0].set_text("Die erklärung zum Markt");
		this.panel.sub_parts[2].set_canvas(popup_canvas);
		this.panel.sub_parts[2].sub_parts[0].background_activ = false;
		this.help_content[4] = this.panel.sub_parts[2].sub_parts;
		this.panel.sub_parts[2].sub_parts = [];
		
		this.panel.sub_parts[2].add_element(new Text_Area(5, 5, 670, 12));
		this.panel.sub_parts[2].sub_parts[0].set_text("Zur Produktion von Waren wird eine Werkstatt ben\u00f6tigt. Jeder Handwerkszweig hat seine eigene Werkstatt aber sie alle funktionieren auf die gleiche" +
		"Art und Weise.//In Werkst\u00e4tten k\u00f6nnen zwei Arten von Einrichtung platziert werden, Produktionsst\u00e4tten und Unterst\u00fctzungseinrichtung.////Produktionsst\u00e4tten sind Arbeitspl\u00e4tze " +
		"an denen Arbeiter Waren herstellen k\u00f6nnen. An jeder Produktionsst\u00e4tte kann immer nur ein Gegenstand auf einmal hergestellt werden. Mann kann aber die selbe Ware mehrere male "+
		"hintereinander in Auftrag geben oder Anweisen sie endlos herstellen zu lassen.////Unterst\u00fctzungseinrichtung gibt einen Bonus auf die Effizienz der Produktion der f\u00fcr alle Arbeitspl\u00e4tze " +
		"gilt die sich in dem selben Raum befinden. Dieser Bonus kann zum Beispiel eine verk\u00fcrzte Produktionszeit sein oder etwa eine Chance, bei einer Produktion ein zweites Exemplar des " +
		"Endprodukts gratis dazu zu bekommen. Diese Boni k\u00f6nne auf bestimmte Warengattungen oder Waren begrenzt sein.");
		this.panel.sub_parts[2].set_canvas(popup_canvas);
		this.panel.sub_parts[2].sub_parts[0].background_activ = false;
		this.help_content[5] = this.panel.sub_parts[2].sub_parts;
		this.panel.sub_parts[2].sub_parts = [];
		
		this.panel.sub_parts[2].add_element(new Text_Area(5, 5, 670, 12));
		this.panel.sub_parts[2].sub_parts[0].set_text("Sobald du einen Verkaufsraum in deinem Gesch\u00e4ft hast kannst du deine Waren nicht nur am Markt verkaufen, sondern sie auch direkt f\u00fcr Kunden " +
		"zum kauf anbieten. Der Markt bietet mehr Sicherheit da er alle deine Waren garantiert zum momentan aktuellen Preis aufkauft. Der Einzelhandel ist wesentlich komplizierter und " +
		"unsicherer, bietet einem Erfahrenen H\u00e4ndler allerdings die wesentlich h\u00f6heren Gewinnspannen.////Als erstes sei gesagt das du zwar alle Waren in deinem Verkaufsraum anbieten kannst, " +
		"aber du keine Abnehmer f\u00fcr Rohstoffe oder Halbfabrikate finden wirst. Es kann Endprodukte geben die ebenfalls weiterverarbeitet werden k\u00f6nnen und diese k\u00f6nnen auch im Einzelhandel " +
		"verkauft werden aber Waren die keinen Nutzen haben au\u00dfer weiterverarbeitet zu werden sind nur f\u00fcr anderen Gesch\u00e4fte interessant und diese beziehen sie vom Markt.////Damit kommen " +
		"wir nun zur Funktionsweise eines Verkaufsraums.//In regelm\u00e4\u00dfigen Abst\u00e4nden laufen potenzielle Kunden an deinem Verkaufsraum vorbei und entscheiden anhand dessen was sie sehen ob " +
		"sie deinen Laden besuchen. Kunden k\u00f6nnen in verschiedene Gruppen unterteilt werden wobei jede Kundengruppe eine Liste an Waren hat f\u00fcr die sie sich interessieren. Jede Kundengruppe " +
		"hat drei Werte im Zusammenhang mit einer Ware f\u00fcr die sie sich interessiert.////Lockwirkung: Wie stark beeinflusst eine Ware dass ein Kunde aus dieser Gruppe den Laden besucht.////" +
		"Gew\u00fcnschte Menge: Wie viel dieser Ware m\u00f6chte der Kunde dieser Gruppe haben.////Preisakzeptanz: Wie viel % kann die Ware vom Marktpreis abweichen befor es einem Kunden dieser " +
		"Gruppe zu teuer wird.////Dein Verkaufsraum wird mit Ausstellm\u00f6glichkeiten eingerichtet. Jeder dieser Aussteller kann die Wirkung der Ware auf Kunden leicht ver\u00e4ndern. Es kann bei " +
		"jedem Aussteller angegeben werden wie viel dieser Ware auf diesem Aussteller angeboten wird und zu welchem Preis. Mehrere Aussteller k\u00f6nnen die gleiche Ware anbieten aber m\u00fcssen " +
		"den gleichen Preis angeben. Wenn du eine Ware bereits anbietest, sie auf einen weiteren Aussteller anbieten willst und einen neuen Preis angibst wirst du gefragt ob dieser Preis " +
		"f\u00fcr alle bereits bestehenden Angebote \u00fcbernommen werden soll. Wenn du dies nicht m\u00f6chtest musst du den bisherigen Preis nehmen oder abbrechen.////Wenn nun ein Kunde an deinem " +
		"Laden vorbei l\u00e4uft wird zuerst ermittelt zu welcher Kundengruppe er geh\u00f6rt. Anschlie\u00dfend werden die Pr\u00e4ferenzen dieser Gruppe mit deinem Angebot verglichen wobei die Lockwirkung " +
		"einer Ware bei mehrmaligem ausstellen abgeschw\u00e4cht wird (Wenn sie 3 mal angeboten wird lautet die Rechnung 100% + 50% +33% bei einer Lockwirkung von 10% also 10% + 5% + 3% = 18% und keine 30%). " +
		"Anhand des aus der Lockwirkung errechneten %Satzes wird nun gew\u00fcrfelt ob der Kunde den Laden betritt. Wenn er dies tut wird nun aus seinem Wunschmenge, seiner Preisakzeptanz und " +
		"deinen Preisen errechnet ob und wie viel er kauft. Wenn er Beispielsweise 2 Heiltr\u00e4nke kaufen w\u00fcrde aber deine Preise diese menge um 50% dr\u00fccken kauft er nur 1. Wenn die errechnete " +
		"Kaufmenge nicht ganzzahlig ist wird er die Menge die vor dem Komma kaufen und es wird gew\u00fcrfelt ob er eine weitere Einheit kauft mit einer Chance in H\u00f6he der Nachkommastelle " +
		"(bei Beispielsweise einer Kaufmenge von 2.4 wird er 2 kaufen und hat eine 40% Chance eine 3 Einheit zu kaufen). Wenn du nicht mehr genug Einheiten auf Lager hast um den Kaufwunsch " +
		"zu erf\u00fcllen wird er den ganzen Rest nehmen den du noch hast.//Wenn eine Ware ausverkauft ist wird der verkauf auf allen Ausstellern auf denen sie angeboten " +
		"wurde abgebrochen.");
		this.panel.sub_parts[2].set_canvas(popup_canvas);
		this.panel.sub_parts[2].sub_parts[0].background_activ = false;
		this.help_content[6] = this.panel.sub_parts[2].sub_parts;
		this.panel.sub_parts[2].sub_parts = [];
		
		this.panel.sub_parts[2].sub_parts = this.help_content[0];
	}
	
	this.set_help_content = function(id){
		this.panel.sub_parts[2].sub_parts = this.help_content[id];
		for(i in this.panel.sub_parts[2].sub_parts){
			this.panel.sub_parts[2].sub_parts[i].scroll_position(0, 0);
		}
		this.panel.sub_parts[2].scroll_value = 0;
		this.panel.sub_parts[2].draw_element();
	}
	
	this.button_click = function(source){
		if(source == 1000){
			this.hide_help();
		}
		else{
			this.set_help_content(source);
		}
	}
	
	this.define_help_content();
}

//Klasse für ein angezeigbares Bildausschnittes
function Image_Element(x, y, width, height, image_object){
	
	this.canvas = ui_canvas;
	
	this.x = x;
	this.y = y;
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = width;
	this.height = height;
	this.image_x = 0;
	this.image_y = 0;
	this.image_width = image_object.width;
	this.image_height = image_object.height;
	this.image_object = image_object;
	
	this.background = new Ui_Part(x, y, width, height, this);
	this.background_activ = true;
	
	this.draw_element = function(){
		if(this.background_activ){
			this.background.draw_element();
			this.canvas.drawImage(this.image_object, this.image_x, this.image_y, this.image_width, this.image_height, this.x + this.parent_x - this.scroll_x + 5, this.y + this.parent_y - this.scroll_y + 5, this.width - 10, this.height - 10);
		}
		else{
			this.canvas.drawImage(this.image_object, this.image_x, this.image_y, this.image_width, this.image_height, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y, this.width, this.height);
		}
	}
	
	this.mouse_over = function(){
		
	}
	
	this.set_position = function(x, y){
		this.x = x;
		this.y = y;
		this.background.set_position(this.x, this.y);
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.background.update_position(this.parent_x, this.parent_y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.background.scroll_position(this.scroll_x, this.scroll_y);	
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.background.set_canvas(canvas);
	}
}

//Klasse für Popup Fenster
function Popup_Message(){
	this.panel = new Ui_Part(675, 0, 525, 0, null);
	this.panel.add_element(new Text_Line(10, 10, 100, 20));
	this.panel.add_element(new Text_Area(0, 50, 525, 15));
	this.panel.add_element(new Ui_Button(0, 315, 10, this, "weiter"));
	
	this.panel.sub_parts[1].background_activ = false;
	
	this.panel.set_canvas(popup_canvas);
	
	this.button_info = [];
	this.message_queue = [];
	
	this.add_message = function(message, activ_button){
		if(activ_button == undefined){
			activ_button = true;
		}
		this.button_info.push(activ_button);
		this.message_queue.push(message);
		if(!popup_message_visible){
			this.next_message(true);
		}
		else{
			this.panel.sub_parts[0].set_text("" + (this.message_queue.length + 1));
			this.panel.draw_element();
		}
	}
	
	this.next_message = function(and_finish){
		if(this.message_queue.length > 0){
			this.show_message(this.message_queue[0], this.button_info[0]);
			this.message_queue.shift();
			this.button_info.shift();
		}
		else if(and_finish){
			this.hide_message();
		}
	}
	
	this.next_buttonless_message = function(){
		if(this.message_queue.length > 0){
			this.show_message(this.message_queue[0], this.button_info[0]);
			this.message_queue.shift();
			this.button_info.shift();
		}
	}
	
	this.show_message = function(message ,activ_button){
		popup_message_visible = true;
		if(activ_button){
			this.panel.sub_parts[2].is_activ = true;
		}
		else{
			this.panel.sub_parts[2].is_activ = false;
		}
		
		this.panel.sub_parts[1].clear_text();
		this.panel.sub_parts[1].set_text(message);
		this.panel.sub_parts[0].set_text("" + this.message_queue.length);
		this.panel.clear_panel()
		this.panel.height = 50 + this.panel.sub_parts[1].height;
		this.panel.set_position(670, 595 - this.panel.sub_parts[1].height);
		this.panel.activate();
	}
	
	this.hide_message = function(){
		popup_message_visible = false;
		this.panel.deactivate();
		this.panel.sub_parts[2].is_activ = false;
	}
	
	this.mouse_over = function(){
		return this.panel.mouse_over();
	}
	
	this.button_click = function(source){
		this.next_message(true);
	}
}

//Klasse für ein Popupfenster das eine Bestätigung vordert
function Confirm_Request(){
	this.actual_parent = null;
	
	this.panel = new Ui_Part(0, 0, 425, 0, null);
	this.panel.add_element(new Text_Area(0, 0, 425, 12));
	this.panel.add_element(new Ui_Button(0, 10, 0, this, "Abbrechen"));
	this.panel.add_element(new Ui_Button(1, 215, 0, this, "Ja"));
	this.panel.set_canvas(popup_canvas);
	
	this.panel.deactivate();

	
	this.request_answer = function(request_source, x, y, request){
		this.actual_parent = request_source;
		this.panel.set_position(x, y);
		this.panel.sub_parts[0].set_text(request);
		this.panel.height = this.panel.sub_parts[0].height + 60;
		this.panel.sub_parts[1].set_position(215, this.panel.sub_parts[0].height + 5);
		this.panel.sub_parts[2].set_position(10, this.panel.sub_parts[0].height + 5);
		this.panel.sub_parts[1].is_activ = true;
		this.panel.sub_parts[2].is_activ = true;
		
		this.panel.activate();
	}
	
	this.mouse_over = function(){
		return this.panel.mouse_over();
	}
	
	this.button_click = function(source){
		if(source){
			this.actual_parent.action_on_hold();
			this.actual_parent.action_on_hold = null;
		}
		this.panel.deactivate();
		this.panel.sub_parts[1].is_activ = false;
		this.panel.sub_parts[2].is_activ = false;
	}
}

//Klasse für die Spiel Uhr
function Clock(){
	var text_line = new Text_Line(10, 12, 180, 15);
	var date;		//Speichervariable für die Aktuelle zeit die man vom System holt
	var day;		//Der Wochentag von 0-6 (nicht welcher tag des Monats)
	var hour;		//Aktuelle Stunde von 0-23
	var minute;		//Aktuelle Minute von 0-59
	var second;		//Aktuelle Sekunde von 0-59
	var weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Sammstag"]; //Array zum übersetzen von Wochentag in Name des Tages
	
	//Funktion zum starten der Uhr
	this.start_clock = function(){
		setInterval(this.second_tick, 1000);
	}
	
	this.draw_element = function(){
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
		
		text_line.set_text(time_string);
		text_line.draw_element();
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
		
		text_line.set_text(time_string);
		text_line.draw_element();
		
		windows[0].timer_tick(1);
		for(i in rooms){
			if(rooms[i].kind_of_room == 4){
				rooms[i].time_tick(1);
			}
		}
	}
}

//Klasse für ein Tooltipfenster
function Tooltip(){
	this.canvas = popup_canvas;
	
	this.x = 0;
	this.y = 0;
	this.width = 150;
	this.height = 0;
	
	this.text_area = new Text_Area(0, 0, 150, 12);
	this.text_area.canvas = popup_canvas;
	this.text_area.background.canvas = popup_canvas;
	
	this.delay = 0;
	this.time_out_id = 0;
	
	this.show_tooltip = function(x, y, message){
		if(x > 1050){
			x = 1050;
		}
		else{
			x = Math.round(x);
		}
		y = Math.round(y);
		this.time_out_id = setTimeout(this.draw_element, 500, this, x, y, message);
	}

	this.hide_tooltip = function(){
		clearTimeout(this.time_out_id);
		this.delay = 0;
		this.text_area.deactivate();
	}
	
	this.draw_element = function(instanz, x, y, message){
		instanz.text_area.set_position(x, y);
		instanz.text_area.set_text(message);
		instanz.x = x;
		instanz.y = y;
		instanz.height = instanz.text_area.height;
		instanz.text_area.activate();
	}
}

//Klasse für die Ortswahl oben rechts in der Kopfleiste
function Location_Menue(){
	
	this.market_button = new Location_Button(0, 1050, 0, 0, 0, this);
	this.balance_button = new Location_Button(1, 1125, 0, 75, 0, this);
	this.shop_button = new Location_Button(2, 1050, 75, 0, 75, this);
	this.storage_button = new Location_Button(3, 1125, 75, 75, 75, this);
	
	this.market_button.mouse_over_text = "Marktplatz";
	this.balance_button.mouse_over_text = "Buchhaltung";
	this.shop_button.mouse_over_text = "Gesch\u00e4ft";
	this.storage_button.mouse_over_text = "Lager";
	
	this.draw_element = function(){
		this.market_button.draw_element();
		this.balance_button.draw_element();
		this.shop_button.draw_element();
		this.storage_button.draw_element();
	}
	
	this.mouse_over = function(){
		if(this.market_button.mouse_over()){
			return true;
		}
		else if(this.balance_button.mouse_over()){
			return true;
		}
		else if(this.shop_button.mouse_over()){
			return true;
		}
		else if(this.storage_button.mouse_over()){
			return true;
		}
		else{
			return false;
		}
	}
	
	this.button_click = function(id){
		switch(id){
			case 0: switch_window(2);
					break;
			case 1: 
					break;
			case 2: switch_window(0);
					break;
			case 3: switch_window(1);
					break;
		}
	}
}

//Klasse der Buttons des Location Menüs
function Location_Button(id, x, y, pictur_x, pictur_y, own_parent){
	this.x = x;
	this.y = y;
	this.pictur_x = pictur_x;
	this.pictur_y = pictur_y;
	
	this.id = id
	this.own_parent = own_parent;
	this.mouse_over_status = false;
	
	this.mouse_over_text = "";			//String für die Ausgabe als popup
	this.tutorial_highlight = false;
	
	this.draw_element = function(){
		ui_canvas.drawImage(image_repository.location_menue, this.pictur_x, this.pictur_y, 75, 75, this.x, this.y, 75, 75);		
			if(this.tutorial_highlight){
				ui_canvas.drawImage(image_repository.shop_tile_marking, 150, 0, 75, 75, this.x, this.y, 75, 75);
			}		
	}
	
	//Wird aufgerufen wenn die Maus auf den Knopf fährt
	this.mouse_over = function(){
		if(mpos_x > this.x && mpos_x <= (this.x + 75) && mpos_y > this.y && mpos_y <= this.y + 75){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.pictur_x += 150;
				if(this.mouse_over_text != ""){
					mouse_over_tooltip.show_tooltip(mpos_x, mpos_y, this.mouse_over_text);
				}
				this.draw_element();
				
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
		this.pictur_x -= 150;
		if(this.mouse_over_text != ""){
			mouse_over_tooltip.hide_tooltip();
		}
		this.draw_element();
	}
	
	//Meldet dem Fenster dass Dieser Button geklickt wurde und gibt sich selbst zurück
	this.mouse_down = function(){

	}
	
	this.mouse_up = function(){
		this.own_parent.button_click(this.id);
		var old = selected_object;
		selected_object = default_focus;
		old.draw_element();
	}
}

//Klasse für das Konstructionsfenster des Shops
function Construckt_Menue(own_parent){
	this.x = 0;
	this.y = 0;
	
	var room_or_funiture;
	var tile_backup;
	this.own_parent = own_parent;
	
	//Initalisieren des Popup wahl menü fensters
	this.panel = new Ui_Part(230, 60, 480, 440, this);
	this.panel.add_element(new Scrollable_Ui_Part(0, 45, 480, 390, this));
	this.panel.add_element(new Close_Button(100, 440, 10, this));
	this.panel.is_activ = false;
	
	this.mouse_over = function(){
		return this.panel.mouse_over();
	}
	
	this.show_room_menue = function(){	
		activ_popup_menue = this;
		this.panel.sub_parts[0].sub_parts = [];
		this.panel.sub_parts[0].scroll_value = 0;
		for(i in existing_rooms){
			this.panel.sub_parts[0].add_element(new Construckt_Info(10, i * 125 + 10, existing_rooms[i], false, this));
		}

		this.panel.set_position(230, 65);
		room_or_funiture = true;
		this.panel.activate();
	}
	
	this.show_funiture_menue = function(tile){
		activ_popup_menue = this;
		tile_backup = tile;
		this.panel.sub_parts[0].sub_parts = [];
		this.panel.sub_parts[0].scroll_value = 0;
		for(i in existing_funiture[tile.room.kind_of_room]){
			this.panel.sub_parts[0].add_element(new Construckt_Info(10, i * 125 + 10, existing_funiture[tile.room.kind_of_room][i], true, this));
		}
		
		this.panel.set_position(230, 65);
		room_or_funiture = false;
		this.panel.activate();
	}
	
	this.hide_menue = function(){
		activ_popup_menue = null;
		focus_object.mouse_out();
		focus_object = default_focus;
		
		this.panel.deactivate();
	}
	
	this.button_click = function(source){
		if(source == 100){
			if(room_or_funiture){
				this.own_parent.press_construckt_room_button();
			}
			else{
				this.own_parent.press_construckt_funiture_button();
			}
		}
		else{
			if(room_or_funiture){
				windows[0].chose_room(source);
			}
			else{
				windows[0].chose_funiture(source, tile_backup);
			}
		}
	}
}

//Klasse für das Craftingfenster des Shops
function Crafting_Menue(own_parent){
	this.x = 365;
	this.y = 80;
	
	this.panel = new Ui_Part(this.x, this.y, 480, 455, own_parent);
	this.panel.is_activ = false;
	this.panel.add_element(new Scrollable_Ui_Part(0, 0, 480, 400, own_parent));
	this.panel.add_element(new Ui_Button(0, 140, 405, this, "Produzieren"));
	this.panel.add_element(new Close_Button(1, 440, 410, this));
	
	this.ware_selected = null;
	this.actual_tile;
	this.own_parent = own_parent;
	
	this.draw_element = function(){
		this.panel.draw_element();
	}

	this.mouse_over = function(){
		return this.panel.mouse_over();
	}
	
	this.show_crafting_menue = function(tile){
		this.actual_tile = tile;
		this.panel.sub_parts[0].sub_parts = [];
		this.panel.sub_parts[0].scroll_value = 0;
		for(i in existing_funiture[tile.room.kind_of_room][tile.funiture.id].craftable_wares){
			this.panel.sub_parts[0].add_element(new Craftabel_Tile(10, i * 130 + 10 , existing_funiture[tile.room.kind_of_room][tile.funiture.id].craftable_wares[i], this));
		}
		this.panel.activate();
	}
	
	this.hide_crafting_menue = function(){
		focus_object.mouse_out();
		focus_object = default_focus;
		this.ware_selected = null;
		this.panel.deactivate();
		this.own_parent.menue_open = false;
	}
	
	this.button_click = function(source){
		if(source == 0){
			if(this.ware_selected != null && this.ware_selected.actual_quantity != 0){
				game.produce_ware(this.actual_tile.funiture, this.ware_selected.ware, this.ware_selected.actual_quantity);
				this.hide_crafting_menue();
			}
		}
		else if(source == 1){
			this.hide_crafting_menue();
		}
	}
}

//Klasse für das Verkaufsfenster des Shops
function Sell_Menue(own_parent){
	this.x = 365;
	this.y = 80;
	
	this.panel = new Ui_Part(this.x, this.y, 480, 455, own_parent);
	this.panel.is_activ = false;
	this.panel.add_element(new Scrollable_Ui_Part(0, 0, 480, 400, own_parent));
	this.panel.add_element(new Ui_Button(0, 140, 405, this, "Verkaufen"));
	this.panel.add_element(new Close_Button(1, 440, 410, this));
	
	this.own_parent = own_parent;
	this.ware_selected = null;
	
	this.actual_tile;
	
	this.draw_element = function(){
		this.panel.draw_element();
	}
	
	this.mouse_over = function(){
		return this.panel.mouse_over();
	}
	
	this.show_sell_menue = function(tile){
		this.actual_tile = tile;
		this.panel.sub_parts[0].sub_parts = [];
		this.panel.sub_parts[0].scroll_value = 0;
		var available_wares = game.get_available_wares()
		for(i in available_wares){
			this.panel.sub_parts[0].add_element(new Sell_Tile(10, i * 94 + 10, available_wares[i][0], available_wares[i][1], this));
		}
		this.panel.activate();
	}
	
	this.hide_sell_menue = function(){
		focus_object.mouse_out();
		focus_object = default_focus;
		this.ware_selected = null;
		this.panel.deactivate();
		this.own_parent.menue_open = false;
	}

	this.button_click = function(source){
		if(source == 0){
			if(this.ware_selected != null && this.ware_selected.chosen_quantity != 0){
				if(this.ware_selected.already_on_sale){
					var price = this.actual_tile.room.already_on_sale(this.ware_selected.ware);
					if(price != null && price != this.ware_selected.chosen_price){
						this.action_on_hold = function(){this.actual_tile.room.new_price(this.ware_selected.ware, this.ware_selected.chosen_price);
														 game.sell_ware(this.actual_tile.funiture, this.ware_selected.ware, this.ware_selected.chosen_quantity, this.ware_selected.chosen_price);
														 this.hide_sell_menue();}
						confirm_request_message.request_answer(this, mpos_x, mpos_y, "Neuen Preis f\u00fcr alle übernehmen?");
					}
					else{
						game.sell_ware(this.actual_tile.funiture, this.ware_selected.ware, this.ware_selected.chosen_quantity, this.ware_selected.chosen_price);
						this.hide_sell_menue();
					}
				}
				else{
					game.sell_ware(this.actual_tile.funiture, this.ware_selected.ware, this.ware_selected.chosen_quantity, this.ware_selected.chosen_price);
					this.hide_sell_menue();
				}
			}
		}
		else if(source == 1){
			this.hide_sell_menue();
		}
	}
}

//Klasse für ein Anzeigefeld für eine Herstellbare Ware
function Craftabel_Tile(x, y, craftable_ware, target){
	this.up_button = new Scroll_Button(0, 350, 10, this, true);
	this.down_button = new Scroll_Button(1, 385, 10, this, false);
	
	this.target = target;
	this.canvas = popup_canvas;
	
	this.x = x;
	this.y = y;
	
	this.width = 425;
	this.height = 120;
	
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.parent_x = 0;
	this.parent_y = 0;
	
	this.pictur_y = 0;
	this.selected = false;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	this.is_activ = false;
	
	this.tutorial_highlight = false;
	
	this.ware = existing_wares[craftable_ware[0]][craftable_ware[1]];
	
	this.actual_quantity = 0;
	
	this.name = new Text_Line(10, 12, 129, 12);
	this.name.set_text(this.ware.name);
	this.name.background_activ = false;
	this.crafting_time = new Text_Line(146, 12, 129,12);
	this.crafting_time.set_text(convert_time_to_string(this.ware.production_time));
	this.crafting_time.background_activ = false;
	this.quantity = new Text_Input(286, 10, 60, 30, 12, "", this);
	this.quantity.is_activ = true;
	this.quantity.key_limit = [48,49,50,51,52,53,54,55,56,57];
	this.quantity.input_length_limit = 6;
	this.quantity.default_text = 0;
	this.quantity.background_activ = false;
	this.ressource_info = [];
	
	this.ressource_info[0] = new Text_Line(10, 47, 129, 12);
	this.ressource_info[0].background_activ = false;
	this.ressource_info[1] = new Text_Line(146, 47, 129, 12);
	this.ressource_info[1].background_activ = false;
	this.ressource_info[2] = new Text_Line(286, 47, 129, 12);
	this.ressource_info[2].background_activ = false;
	this.ressource_info[3] = new Text_Line(10, 82, 129, 12);
	this.ressource_info[3].background_activ = false;
	this.ressource_info[4] = new Text_Line(146, 82, 129, 12);
	this.ressource_info[4].background_activ = false;
	this.ressource_info[5] = new Text_Line(286, 82, 129, 12);
	this.ressource_info[5].background_activ = false;
	
	this.draw_element = function(){
		this.canvas.drawImage(image_repository.crafting_blueprint, 0, this.pictur_y, this.width, this.height, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y, this.width, this.height);
		this.name.draw_element()	
		this.crafting_time.draw_element();
		this.quantity.draw_element();
		this.update_cost();
		for(i in this.ressource_info){
			this.ressource_info[i].draw_element();
		}
		
		
		this.up_button.draw_element();
		this.down_button.draw_element();
		if(this.tutorial_highlight){
			this.canvas.drawImage(image_repository.shop_tile_marking, 150, 0, 75, 75, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y , this.width, this.height);
		}
	}
	
	this.redraw_element = function(id){
		this.draw_element();
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.crafting_time.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		for(i in this.ressource_info){
			this.ressource_info[i].update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		}
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.crafting_time.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		for(i in this.ressource_info){
			this.ressource_info[i].update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		}
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.up_button.set_canvas(canvas);
		this.down_button.set_canvas(canvas);
		this.name.set_canvas(canvas);
		this.crafting_time.set_canvas(canvas);
		this.quantity.set_canvas(canvas);
		for(i in this.ressource_info){
			this.ressource_info[i].set_canvas(canvas);
		}
	}
	
	this.mouse_over = function(){
		if(mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.width + this.parent_x) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.height + this.parent_y)){
			if(this.selected){
				if(this.up_button.mouse_over()){
					this.draw_element();
				}
				else if(this.down_button.mouse_over()){
					this.draw_element();
				}
				else if(this.quantity.mouse_over()){}
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
			if(this.target.ware_selected != null){
				this.target.ware_selected.mouse_up();
			}
			this.target.ware_selected = this;
			this.selected = true;
			this.pictur_y = 120;
		}
		else{
			this.target.ware_selected = null;
			this.selected = false;
			this.pictur_y = 0;
			selected_object = default_focus;
			this.quantity.content = "";
			this.actual_quantity = 1;
		}
		this.draw_element();
	}
	
	this.update_cost = function(){
		for(i in this.ressource_info){
			if( this.ware.production_cost[i] != undefined){
				if(this.actual_quantity > 0){
					this.ressource_info[i].set_text(existing_wares[this.ware.production_cost[i][0]][this.ware.production_cost[i][1]].name + " " + this.ware.production_cost[i][2] * this.actual_quantity + "/" + game.count_ware(this.ware.production_cost[i][0],this.ware.production_cost[i][1]));
				}
				else{
					this.ressource_info[i].set_text(existing_wares[this.ware.production_cost[i][0]][this.ware.production_cost[i][1]].name + " " + this.ware.production_cost[i][2] + "/" + game.count_ware(this.ware.production_cost[i][0],this.ware.production_cost[i][1]));
				}
			}
		}
	}
	
	this.button_click = function(source){
		switch(source){
				case 0: if(this.actual_quantity < 999999){
							this.actual_quantity++;
						}
						break;
				case 1: if(this.actual_quantity > -1){
							this.actual_quantity--;
						}
						break;
		}
		if(this.actual_quantity > -1){
			this.quantity.font_size = 12;
			this.quantity.content = "" + this.actual_quantity;
		}
		else{
			this.quantity.font_size = 20;
			this.quantity.content = "\u221E";
		}
		this.draw_element();
	}
}

//Klasse für ein Anzeigefeld für eine Verkaufbare Ware
function Sell_Tile(x, y, ware, available_quantity, target){
	this.quantity_up_button = new Scroll_Button(0, 350, 10, this, true);
	this.quantity_down_button = new Scroll_Button(1, 385, 10, this, false);
	this.price_up_button = new Scroll_Button(2, 350, 45, this, true);
	this.price_down_button = new Scroll_Button(3, 385, 45, this, false);
	this.target = target;
	
	this.canvas = popup_canvas;
	
	this.x = x;
	this.y = y;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.parent_x = 0;
	this.parent_y = 0;
	this.width = 425;
	this.height = 84;
	this.pictur_y = 0;
	this.selected = false;
	this.already_on_sale = false;
	
	this.is_activ = true;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt
	
	this.ware = ware;
	this.available_quantity = available_quantity;
	this.chosen_quantity = 0;
	this.chosen_price = this.ware.sell_price;
	
	this.name = new Text_Line(10, 12, 129, 12);
	this.name.set_text(this.ware.name);
	this.name.background_activ = false;
	
	this.available_quantity_line = new Text_Line(148, 12, 129,12);
	this.available_quantity_line.set_text(this.available_quantity);
	this.available_quantity_line.background_activ = false;
	
	this.market_sell_price = new Text_Line(10, 47, 129, 12);
	this.market_sell_price.set_text(this.ware.sell_price + "$");
	this.market_sell_price.background_activ = false;
	
	this.quantity = new Text_Input(286, 10, 60, 30, 12, "", this);
	this.quantity.is_activ = true;
	this.quantity.key_limit = [48,49,50,51,52,53,54,55,56,57];
	this.quantity.input_length_limit = 6;
	this.quantity.default_text = 0;
	this.quantity.background_activ = false;
		
	this.price = new Text_Input(256, 45, 90, 30, 12, "$", this);
	this.price.is_activ = true;
	this.price.key_limit = [48,49,50,51,52,53,54,55,56,57];
	this.price.input_length_limit = 8;
	this.price.default_text = "" + this.ware.sell_price;
	this.price.background_activ = false;
	
	this.draw_element = function(){
		this.canvas.drawImage(image_repository.sellable_ware, 0, this.pictur_y, 425, 84, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y, 425, 84);
		this.canvas.font = "bold 12px Arial";
		this.name.draw_element();
		this.available_quantity_line.draw_element();
		this.quantity.draw_element();
		this.market_sell_price.draw_element();
		this.price.draw_element();
		
		this.quantity_up_button.draw_element();
		this.quantity_down_button.draw_element();
		this.price_up_button.draw_element();
		this.price_down_button.draw_element();
	}
	
	this.redraw_element = function(id){
		this.draw_element();
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.quantity_up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity_down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price_up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price_down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.available_quantity_line.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.market_sell_price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.quantity_up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity_down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price_up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price_down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.available_quantity_line.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.market_sell_price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.quantity_up_button.set_canvas(canvas);
		this.quantity_down_button.set_canvas(canvas);
		this.price_up_button.set_canvas(canvas);
		this.price_down_button.set_canvas(canvas);
		this.quantity.set_canvas(canvas);
		this.price.set_canvas(canvas);
		this.name.set_canvas(canvas);
		this.available_quantity_line.set_canvas(canvas);
		this.market_sell_price.set_canvas(canvas);
	}
	
	this.mouse_over = function(){
		if(mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.width + this.parent_x) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.height + this.parent_y)){
			if(this.selected){
				if(this.quantity_up_button.mouse_over()){
					this.draw_element();
				}
				else if(this.quantity_down_button.mouse_over()){
					this.draw_element();
				}
				else if(this.price_up_button.mouse_over()){
					this.draw_element();
				}
				else if(this.price_down_button.mouse_over()){
					this.draw_element();
				}
				else if(this.quantity.mouse_over()){}
				else if(this.price.mouse_over()){}
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
			if(this.target.ware_selected != null){
				this.target.ware_selected.mouse_up();
			}
			var actual_price = this.target.actual_tile.room.already_on_sale(this.ware);
			if(actual_price != null){
				this.price = actual_price;
				this.already_on_sale = true;
			}
			this.target.ware_selected = this;
			this.selected = true;
			this.pictur_y = 84;
		}
		else{
			this.target.ware_selected = null;
			this.selected = false;
			this.pictur_y = 0;
			this.quantity.content = "";
			selected_object = default_focus;
			this.price.content = "";
		}
		this.draw_element();
	}
	
	this.button_click = function(source){
		switch(source){
				case 0: if(this.chosen_quantity < this.available_quantity){
							this.chosen_quantity++;
						}
						break;
				case 1: if(this.chosen_quantity > -1){
							this.chosen_quantity--;
						}
						break;
				case 2: if(this.chosen_price < 100000){
							this.chosen_price++;
						}
						break;
				case 3: if(this.chosen_price > this.ware.sell_price){
							this.chosen_price--;
						}
						break;
		}
		if(this.chosen_quantity > -1){
			this.quantity.font_size = 12;
			this.quantity.content = "" + this.chosen_quantity;
		}
		else{
			this.quantity.font_size = 20;
			this.quantity.content = "\u221E";
		}
		this.price.content = "" + this.chosen_price;
		this.draw_element();
	}
}

function Construckt_Info(x, y, object, room_funiture, target){
	this.target = target;
	this.canvas = ui_canvas
	
	this.x = x;
	this.y = y;
	
	this.parent_x =	0;
	this.parent_y =	0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.width = 425;
	this.height = 120;
	this.pictur_y = 0;
	
	this.id = object.id;
	this.tutorial_highlight = false;
	
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	this.is_activ = true;
	this.room_funiture = room_funiture;
	
	this.object_image_x = object.pictur_x;
	this.object_image_y = object.pictur_y;
	this.name = new Text_Line(115, 12, 165, 12);
	this.name.background_activ = false;
	this.name.set_text(object.name);
	this.description = new Text_Area(115, 45, 300, 12);
	this.description.background_activ = false;
	this.description.set_text(object.description);
	
	this.draw_element = function(){
		if(this.is_activ){
			this.canvas.drawImage(image_repository.construct_info, 0, this.pictur_y, 425, 120, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y , this.width, this.height);
			if(room_funiture){
				this.canvas.drawImage(image_repository.funiture, this.object_image_x, this.object_image_y, 75, 75, this.x + this.parent_x - this.scroll_x + 10, this.y + this.parent_y - this.scroll_y + 10, 100, 100);
			}
			else{
				this.canvas.drawImage(image_repository.shop_tile, this.object_image_x, this.object_image_y, 75, 75, this.x + this.parent_x - this.scroll_x + 10, this.y + this.parent_y - this.scroll_y + 10, 100, 100);
			}
			this.name.draw_element();
			this.description.draw_element();
			if(this.tutorial_highlight){
				this.canvas.drawImage(image_repository.shop_tile_marking, 150, 0, 75, 75, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y , this.width, this.height);
			}
		}
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.description.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.description.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.name.set_canvas(canvas);
		this.description.set_canvas(canvas);
	}
	
	this.mouse_over = function(){
		if(mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.width + this.parent_x) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.height + this.parent_y)){
			if(!this.mouse_over_status){
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.pictur_y = 120;
				this.draw_element();
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	this.mouse_out = function(){
		this.mouse_over_status = false;
		this.pictur_y = 0;
		this.draw_element();
	}
	
	this.mouse_down = function(){
	
	}
	
	this.mouse_up = function(){
		this.target.button_click(this.id);
	}
}

function Shop_Tile_UI(x, y, border_left, border_top, own_parent, own_back_end){
	this.x = x * 75 + Math.round(border_left);		//Grafische X Position des Feldes
	this.y = y * 75 + Math.round(border_top);		//Grafische Y Position des Feldes
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.pictur_x = 0;								//X Wert des Startpunktes des Ausschnittes der von der Bilddatei angezeigt wird
	this.mouse_over_status = false;					//Flag ob die Maus auf diesem Feld liegt
	this.highlight_status = 0;						//Flag ob und wie dieses Feld Markiert ist
	this.tutorial_highlight = false;
	this.own_parent = own_parent;
	this.own_back_end = own_back_end;
	this.own_back_end.own_ui = this;
	
	this.draw_element = function(){
		game_canvas.drawImage(image_repository.shop_tile, this.pictur_x, 0, 75, 75, this.x - this.scroll_x, this.y - this.scroll_y, 75, 75);
		game_canvas.font = "bold 14px Arial";
		game_canvas.fillStyle = "BLACK";
		if(this.own_back_end.funiture != null){
			this.own_back_end.funiture.draw_element();
		}
		if(this.highlight_status == 1){
			game_canvas.drawImage(image_repository.shop_tile_marking, 0, 0, 75, 75, this.x - this.scroll_x, this.y - this.scroll_y, 75, 75);
		}
		else if(this.highlight_status == 2){
			game_canvas.drawImage(image_repository.shop_tile_marking, 75, 0, 75, 75, this.x - this.scroll_x, this.y - this.scroll_y, 75, 75);
		}
		else if(this.tutorial_highlight){
			game_canvas.drawImage(image_repository.shop_tile_marking, 150, 0, 75, 75, this.x - this.scroll_x, this.y - this.scroll_y, 75, 75);
		}
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		if(this.own_back_end.funiture != null){
			this.own_back_end.funiture.scroll_position(x, y);
		}
	}
	
	//sorgt dafür dass das Feld den korreckten Raum anzeigt
	this.set_room = function(id){
		this.pictur_x = id * 75;
		this.draw_element();
	}
	
	this.mouse_over = function(){
		if(mpos_x > (this.x - this.scroll_x) && mpos_x <= (this.x - this.scroll_x + 75) && mpos_y > (this.y - this.scroll_y) && mpos_y <= (this.y - this.scroll_y + 75)){
			if(!this.mouse_over_status){
				this.highlight_status = this.own_back_end.mouse_over();
				focus_object.mouse_out();
				focus_object = this;
				this.mouse_over_status = true;
				this.draw_element();	
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
			this.draw_element();
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
			this.draw_element();
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
	
	this.fail_reason = "";
	
	this.mouse_over = function(){
		this.fail_reason = "";
		switch(windows[0].construction_mode){
			case 0: return 1;
					break;
			
			case 1: if(this.wall_construcktable()){
						this.action_possible = true;
						return 1;
					}
					else{
						this.action_possible = false;
						return 2;
					}
					break;
					
			case 2: return this.room_construcktable();
			
			case 3: if(this.room != null && this.funiture == null){
						this.action_possible = true;
						return 1;
					}
					else{
						this.action_possible = false;
						return 2;
					}
					break;
			
			
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
						if(this.funiture.new_product == null){
							this.action_possible = true;
							return 1;
						}
						else{
							this.action_possible = false;
							this.fail_reason = "Object ist Besch\u00e4ftigt";
							return 2;
						}
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
			this.own_ui.draw_element();
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
					   
					this.fail_reason = "Mauerbauau nicht m\u00f6glich.//T\u00fcre im Weg";
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
					this.fail_reason = "T\u00fcrbau nicht m\u00f6glich.//Eine T\u00fcre w\u00e4re an dieser Stelle blockiert.";
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
						this.fail_reason = "Zumauern nicht m\u00f6glich.//T\u00fcre wird als Pfad ben\u00f6tigt.";
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
					else{
						this.fail_reason = "Zumauern nicht m\u00f6glich.//T\u00fcre wird als Pfad ben\u00f6tigt.";
						return false;
					}
				}
			}
			else{
				this.fail_reason = "Mauerst\u00fcck ist bereits im bau.";
				return false;
			}
		}
		else{
			this.fail_reason = "Mauerbau nicht m\u00f6glich.//Bauplatz mit Raum belegt.";
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
			if(storage == 2){
				this.fail_reason = "Raum kann nicht erstellt werden.//Kein Pfad zum Augang gefunden";
			}
			return storage;
		}
		else{
			if(typeof focus_object.own_back_end !== 'undefined' && focus_object.own_back_end.monitor != null){
				focus_object.own_back_end.monitor.unhighlight();
			}
			this.fail_reason = "Raum kann nicht erstellt werden.//Fl\u00e4che belegt";
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
					if(this.fail_reason != "Mauer kann nicht abgerissen werden da sie als Raumbegrenzung ben\u00f6tigt wrid" && this.fail_reason != "Mauer kann nicht abgerissen werden da sie 2 R\u00e4ume trennt"){
						this.fail_reason = "Mauersegment kann nicht abgerissen werden da sie teil einer T\u00fcr sind";
					}
					
					return false;
				}
			}
			else{
				return false;
			}
			
		}
		else{
			this.fail_reason = "Die Außenwand kann nicht abgerissen werden";
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
		if(!monitor.room_empty){
			this.fail_reason = "Raum ist nicht leer";
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
				this.fail_reason = "Mauer kann nicht abgerissen werden da sie als Raumbegrenzung ben\u00f6tigt wrid";
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
				if(!fuse){
					this.fail_reason = "Mauer kann nicht abgerissen werden da sie 2 R\u00e4ume trennt";
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
		this.own_ui.draw_element();
	}
	
	this.unhighlight = function(){
		this.monitor = null;
		this.own_ui.highlight_status = 0;
		this.action_possible = false;
		this.own_ui.draw_element();
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		this.own_ui.own_parent.tile_click(this);
	}
}

function Ware_Stack_market_Ui(x, y, target){
	
	this.canvas = ui_canvas;
	this.x = x;
	this.y = y;
	this.width = 425;
	this.height = 120;
	this.parent_x = 0;
	this.parent_y = 0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.pictur_y = 0;
	this.up_button = new Scroll_Button(0, 350, 10, this, true);
	this.down_button = new Scroll_Button(1, 385, 10, this, false);
	
	this.target = target;
	
	this.selected = false;
	this.is_activ = true;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	
	this.ware_stack = null;
	
	this.tutorial_highlight = false;

	this.name = new Text_Line(115,10,98,12);
	this.name.background_activ = false;
	this.price = new Text_Line(220,10,61,12);
	this.price.background_activ = false;
	this.price.mouse_over_text = "Verkaufspreis";
	this.description = new Text_Area(115, 45, 300, 12);
	this.description.background_activ = false;
	this.quantity = new Text_Input(286, 10, 60, 30, 12, "", this);
	this.quantity.key_limit = [48,49,50,51,52,53,54,55,56,57];
	this.quantity.input_length_limit = 6;
	this.quantity.default_text = 0;
	this.quantity.background_activ = false;
	
	this.draw_element = function(){
		if(this.is_activ){
			this.canvas.drawImage(image_repository.market_ware, 0, this.pictur_y, 425, 120, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y, 425, 120);
			this.up_button.draw_element();
			this.down_button.draw_element();
			this.quantity.draw_element();
			if(this.ware_stack.ware != null){
				this.canvas.drawImage(image_repository.wares, 100 * this.ware_stack.ware.id, 100 * this.ware_stack.ware.category_id, 100, 100, this.x + this.parent_x - this.scroll_x + 5, this.y + this.parent_y - this.scroll_y + 5, 100, 100);
				this.name.draw_element();
				this.price.draw_element();
				this.check_quantity_input();
				this.description.draw_element();
			}
			this.target.update_sell_price();
			if(this.tutorial_highlight){
				game_canvas.drawImage(image_repository.shop_tile_marking, 150, 0, 75, 75, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y, 425, 120);
			}
		}
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.description.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.description.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.up_button.set_canvas(canvas);
		this.down_button.set_canvas(canvas);
		this.quantity.set_canvas(canvas);
		this.name.set_canvas(canvas);
		this.price.set_canvas(canvas);
		this.description.set_canvas(canvas);
	}
	
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.parent_x + this.width) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.parent_y + this.height)){
			if(this.selected){
				if(this.up_button.mouse_over()){}
				else if(this.down_button.mouse_over()){}
				else if(this.price.mouse_over()){}
				else if(this.quantity.mouse_over()){}
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
					this.draw_element();
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
		this.draw_element();
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		if(!this.selected && this.ware_stack.ware != null){
			this.selected = true;
			this.pictur_y = 120;
			if(this.target.selected_ware != null){
				this.target.selected_ware.mouse_up();
			}
			this.target.selected_ware = this;
			this.draw_element();
		}
		else if(this.selected){
			this.selected = false;
			selected_object = default_focus;
			this.pictur_y = 0;
			this.quantity.content = "";
			this.target.update_sell_price();
			this.target.selected_ware = null;
			if(this.ware_stack.ware == null){
				this.clear_ware();
			}
			this.set_ware(this.ware_stack);
			this.draw_element();
		}
	}
	
	this.button_click = function(source){
		if(this.quantity.content != ""){
			var x = parseInt(this.quantity.content);
		}
		else{
			var x = 0;
		}
		switch(source){
				case 0: if(x < this.ware_stack.stored_amount){
							x++;
						}
						break;
				case 1: if(x > 0){
							x--;
						}
						break;
		}
		this.quantity.content = "" + x;
		this.draw_element();
	}

	this.set_ware = function(ware_stack){
		this.ware_stack = ware_stack;
		this.quantity.addet_text = "/" + this.ware_stack.stored_amount + "/"+ this.ware_stack.stack_size;
		if(ware_stack.ware != null){
			this.name.set_text(this.ware_stack.ware.name);
			this.price.set_text(this.ware_stack.ware.sell_price + "$");
			this.description.set_text(this.ware_stack.ware.description);
		}
	}
	
	this.clear_ware = function(){
		this.name.set_text("");
		this.price.set_text("");
		this.description.set_text("");
		this.quantity.addet_text = "";
	}
	
	this.check_quantity_input = function(){
		if(this.ware_stack != null && parseInt(this.quantity.content) > this.ware_stack.stack_size){
			this.quantity.content = "" + this.ware_stack.stack_size;
		}
	}
}

function Ware_Stack_Storage_Ui(x, y, own_parent){
	this.x = x;
	this.y = y;
	this.width = 425;
	this.height = 120;
	this.parent_x = 0;
	this.parent_y = 0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.pictur_y = 0;
	
	this.own_parent = own_parent;
	
	this.selected = false;
	this.is_activ = true;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	
	this.ware_stack = null;
	
	this.name = new Text_Line(115,12,98,12);
	this.name.background_activ = false;
	this.buy_price = new Text_Line(220,12,61,12);
	this.buy_price.background_activ = false;
	this.buy_price.mouse_over_text = "Kaufpreis";
	this.sell_price = new Text_Line(286,12,61,12);
	this.sell_price.background_activ = false;
	this.sell_price.mouse_over_text = "Verkaufspreis";
	this.quantity = new Text_Line(353, 12, 60, 12);
	this.quantity.background_activ = false;
	this.description = new Text_Area(115, 45, 300, 12);
	this.description.background_activ = false;
	
	this.draw_element = function(){
		if(this.is_activ){
			ui_canvas.drawImage(image_repository.storage_ware, 0, this.pictur_y, 425, 120, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y, 425, 120);
			this.quantity.draw_element();
			if(this.ware_stack.ware != null){
				ui_canvas.drawImage(image_repository.wares, 100 * this.ware_stack.ware.id, 100 * this.ware_stack.ware.category_id, 100, 100, this.x + this.parent_x - this.scroll_x + 5, this.y + this.parent_y - this.scroll_y + 5, 100, 100);
				this.name.draw_element();
				this.buy_price.draw_element();
				this.sell_price.draw_element();
				this.description.draw_element();
			}
		}
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.buy_price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.sell_price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.description.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.buy_price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.sell_price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.description.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.quantity.set_canvas(canvas);
		this.name.set_canvas(canvas);
		this.buy_price.set_canvas(canvas);
		this.sell_price.set_canvas(canvas);
		this.description.set_canvas(canvas);
	}
	
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.parent_x + this.width) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.parent_y + this.height)){
			if(this.selected){
				if(this.buy_price.mouse_over()){}
				else if(this.sell_price.mouse_over()){}
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
					this.draw_element();
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
		this.draw_element();
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		/*if(!this.selected){
			this.selected = true;
			this.pictur_y = 120;
			this.draw_element();
		}
		else if(this.selected){
			this.selected = false;
			selected_object = default_focus;
			this.pictur_y = 0;
			this.draw_element();
		}*/
	}
	
	this.button_click = function(source){
		
	}

	this.set_ware = function(ware_stack){
		this.ware_stack = ware_stack;
		this.quantity.set_text(this.ware_stack.stored_amount + "/"+ this.ware_stack.stack_size);
		if(ware_stack.ware != null){
			this.name.set_text(this.ware_stack.ware.name);
			this.buy_price.set_text(this.ware_stack.ware.buy_price + "$");
			this.sell_price.set_text(this.ware_stack.ware.sell_price + "$");
			this.description.set_text(this.ware_stack.ware.description);
		}
	}
}

//Klasse für einen Stack einer Wahre im Lager
function Ware_Stack(storag, size){
	
	this.storag = storag; 		//Referenz auf das Objekt dass diesen Stack beherbergt
	this.ware = null;			//Welche Ware liegt in diesem Stack
	this.stack_size = size;		//Wie viel von dieser Ware kann der Stack fassen
	this.stored_amount = 0;		//Wie viel von der Ware liegt jetzt gerade auf dem Stack

	this.is_activ = true;
	
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
	}
}

//Klasse für das Einkaufsfenster
function Buy_Screen(own_parent){
	this.own_parent = own_parent;
	
	this.panel = new Ui_Part(5, 160, 1190, 410);
	this.panel.add_element(new Text_Line(10, 310, 200, 25));
	this.panel.sub_parts[0].set_text("0$");
	this.panel.add_element(new Ui_Button(0, 10, 360, this, "Kaufen"));
	this.panel.add_element(new Scrollable_Ui_Part(10, 10, 255, 285, this));
	this.panel.add_element(new Scrollable_Ui_Part(270, 10, 910, 390, this));
	
	this.selected_ware = null;
	this.buy_price = 0;
	
	this.draw_element = function(){
		this.panel.draw_element();
	}
	
	this.mouse_over = function(){
		return this.panel.mouse_over();
	}
	
	this.button_click = function(id){
		if(id){
			this.set_actual_category(id-1);
		}
		else{
			this.own_parent.buy_item(this.selected_ware.ware.category_id, this.selected_ware.ware.id, parseInt(this.selected_ware.quantity.content), this.buy_price);
			this.selected_ware.mouse_up();
		}
	}
	
	this.set_actual_category = function(id){
		if(this.selected_ware != null){
			this.selected_ware.mouse_up();
		}
		this.panel.sub_parts[3].scroll_value = 0;
		this.panel.sub_parts[3].sub_parts = [];
		var j = 0;
		var k = 0
		for(i in existing_wares[id]){
			this.panel.sub_parts[3].add_element(new Ware_Tile( i, 10 + 430 * j, 10 + k * 125, existing_wares[id][i], this));
			if(j == 0){
				j++;
			}
			else{
				j--;
				k++;
			}
		}
		
		this.draw_element();
	}
	
	this.update_buy_price = function(){
		if(this.selected_ware != null){
			if(this.selected_ware.quantity.content != ""){
				this.buy_price = this.selected_ware.ware.buy_price * parseInt(this.selected_ware.quantity.content);
			}
			else{
				this.buy_price = 0;
			}
			this.panel.sub_parts[0].set_text(this.buy_price + "$");
			this.panel.sub_parts[0].draw_element();
		}
	}
	
	this.define_existing_ware_categorys = function(){
		this.panel.sub_parts[2].add_element(new Ui_Button(1, 10, 10 , this, "Metall"));
		this.panel.sub_parts[2].add_element(new Ui_Button(2, 10, 55 , this, "Metallteile"));
		this.panel.sub_parts[2].add_element(new Ui_Button(3, 10, 100, this, "Schmiedewaren"));
		this.panel.sub_parts[2].add_element(new Ui_Button(4, 10, 145, this, "Alchemizutaten"));
		this.panel.sub_parts[2].add_element(new Ui_Button(5, 10, 190, this, "Alchemidestilate"));
		this.panel.sub_parts[2].add_element(new Ui_Button(6, 10, 235, this, "Alchemiewaren"));
	}
	
	this.define_existing_ware_categorys();
	
}

//Klasse für das Einkaufsfenster
function Sell_Screen(own_parent){
	this.own_parent = own_parent;
	this.panel = new Ui_Part(5, 160, 1190, 410);
	this.panel.add_element(new Text_Line(10, 10, 200, 25));
	this.panel.sub_parts[0].set_text("0$");
	this.panel.add_element(new Ui_Button(0, 10, 60, this, "Verkaufen"));
	this.panel.add_element(new Scrollable_Ui_Part(215, 10, 910, 390, this));
	
	this.selected_ware = null;
	this.sell_price = 0;
	
	this.draw_element = function(){
		this.update_wares();
		this.panel.draw_element();
	}
	
	this.mouse_over = function(){
		return this.panel.mouse_over();
	}
	
	this.button_click = function(id){
		this.own_parent.sell_item(this.selected_ware.ware_stack, parseInt(this.selected_ware.quantity.content), this.sell_price);
		this.selected_ware.mouse_up();
	}
	
	this.update_wares = function(){
		this.panel.sub_parts[2].sub_parts = [];
		var j = 0;
		var k = 0
		for(i in storage){
			var stack = new Ware_Stack_market_Ui( 10 + 430 * j, 10 + k * 125, this);
			stack.set_ware(storage[i]);
			this.panel.sub_parts[2].add_element(stack);
			if(j == 0){
				j++;
			}
			else{
				j--;
				k++;
			}
		}
	}
	
	this.update_sell_price = function(){
		if(this.selected_ware != null){
			if(this.selected_ware.quantity.content != ""){
				this.sell_price = this.selected_ware.ware_stack.ware.sell_price * parseInt(this.selected_ware.quantity.content);
			}
			else{
				this.sell_price = 0;
			}
			this.panel.sub_parts[0].set_text(this.sell_price + "$");
			this.panel.sub_parts[0].draw_element();
		}
	}
}

//Klasse für eine Angebotsfeld auf dem markt
function Ware_Tile(id, x, y, ware, target){
	this.x = x;
	this.y = y;
	this.width = 425;
	this.height = 120;
	this.parent_x = 0;
	this.parent_y = 0;
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.pictur_y = 0;
	this.up_button = new Scroll_Button(0, 350, 10, this, true);
	this.down_button = new Scroll_Button(1, 385, 10, this, false);
	
	this.target = target;
	
	this.selected = false;
	this.is_activ = true;
	this.mouse_over_status = false;		//Flag ob die Maus auf diesem Knopf liegt 
	
	this.ware = ware;
	this.name = new Text_Line(115,10,98,12);
	this.name.set_text(this.ware.name);
	this.name.background_activ = false;
	this.price = new Text_Line(220,10,61,12);
	this.price.set_text(this.ware.buy_price + "$");
	this.price.background_activ = false;
	this.price.mouse_over_text = "Kaufpreis";
	this.description = new Text_Area(115, 45, 300, 12);
	this.description.set_text(this.ware.description);
	this.description.background_activ = false;
	this.quantity = new Text_Input(286, 10, 60, 30, 12, "", this);
	this.quantity.key_limit = [48,49,50,51,52,53,54,55,56,57];
	this.quantity.input_length_limit = 6;
	this.quantity.default_text = 0;
	this.quantity.background_activ = false;
	this.tutorial_highlight = false;
	
	this.draw_element = function(){
		if(this.is_activ){
			ui_canvas.drawImage(image_repository.market_ware, 0, this.pictur_y, 425, 120, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y, 425, 120);
			ui_canvas.drawImage(image_repository.wares, 100 * this.ware.id, 100 * this.ware.category_id, 100, 100, this.x + this.parent_x - this.scroll_x + 5, this.y + this.parent_y - this.scroll_y + 5, 100, 100);
			this.name.draw_element();
			this.price.draw_element();
			this.quantity.draw_element();
			this.description.draw_element();
			this.up_button.draw_element();
			this.down_button.draw_element();
			this.target.update_buy_price();
			if(this.tutorial_highlight){
				ui_canvas.drawImage(image_repository.shop_tile_marking, 150, 0, 75, 75, this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y , this.width, this.height);
			}
		}
	}
	
	this.update_position = function(x, y){
		this.parent_x = x;
		this.parent_y = y;
		this.up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.description.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
		this.up_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.down_button.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.quantity.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.name.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.price.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
		this.description.update_position(this.x + this.parent_x - this.scroll_x, this.y + this.parent_y - this.scroll_y);
	}
	
	this.set_canvas = function(canvas){
		this.canvas = canvas;
		this.up_button.set_canvas(canvas);
		this.down_button.set_canvas(canvas);
		this.quantity.set_canvas(canvas);
		this.name.set_canvas(canvas);
		this.price.set_canvas(canvas);
		this.description.set_canvas(canvas);
	}
	
	this.mouse_over = function(){
		if(this.is_activ && mpos_x > (this.x - this.scroll_x + this.parent_x) && mpos_x <= (this.x - this.scroll_x + this.parent_x + this.width) && mpos_y > (this.y - this.scroll_y + this.parent_y) && mpos_y <= (this.y - this.scroll_y + this.parent_y + this.height)){
			if(this.selected){
				if(this.up_button.mouse_over()){
					this.draw_element();
				}
				else if(this.down_button.mouse_over()){
					this.draw_element();
				}
				else if(this.price.mouse_over()){}
				else if(this.quantity.mouse_over()){}
				else{
					if(!this.mouse_over_status){
						this.mouse_over_status = true;
						focus_object.mouse_out();
						focus_object = this;
						this.draw_element();
					}
				}
			}
			else{
				if(!this.mouse_over_status){
					this.mouse_over_status = true;
					focus_object.mouse_out();
					focus_object = this;
					this.draw_element();
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
		this.draw_element();
	}
	
	this.mouse_down = function(){
		
	}
	
	this.mouse_up = function(){
		if(!this.selected){
			this.selected = true;
			this.pictur_y = 120;
			if(this.target.selected_ware != null){
				this.target.selected_ware.mouse_up();
			}
			this.target.selected_ware = this;
		}
		else{
			this.selected = false;
			selected_object = default_focus;
			this.pictur_y = 0;
			this.quantity.content = "";
			this.target.update_buy_price();
			this.target.selected_ware = null;
		}
		this.draw_element();
	}
	
	this.button_click = function(source){
		if(this.quantity.content != ""){
			var x = parseInt(this.quantity.content);
		}
		else{
			var x = 0;
		}
		switch(source){
				case 0: if(x < 999999){
							x++;
						}
						break;
				case 1: if(x > 0){
							x--;
						}
						break;
		}
		this.quantity.content = "" + x;
		this.draw_element();
	}
}

//Klasse für Einrichtungs Objecte
function Funiture(x, y, room, id, tile){
	this.id = id;														//ID des Einrichtungsobjekts
	this.room = room;													//Raum_ID des Einrichtungsobjekts
	this.parent_tile = tile; 											//Referenz auf das Tile auf dem die Einrichtung steht
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.x = x;
	this.y = y;
	this.pictur_x;														//X position des Bildausschnittes
	this.pictur_y;														//Y position des Bildausschnittes
	this.new_product = null;
	
	this.action_id = 1;													//ID der Momentan laufenden Aktion(0: Ruhezustand 1: im Bau 2: Produzierend 3: Verkauft)
	if(room != null){
		this.time_left = existing_funiture[room.kind_of_room][id].construckion_time;	//Verbleibende Zeit der aktuellen Aktion in Sekunden
	}
	else{
		this.time_left = existing_funiture[0][id].construckion_time;
	}
	//Zeichnet das Einrichtungsobjekt
	this.draw_element = function(){
		//Zeichnet das Objekt wenn es nicht gerade im bau ist
		if(this.action_id == 0){
			game_canvas.drawImage(image_repository.funiture,this.pictur_x, this.pictur_y, 75, 75, this.x - this.scroll_x, this.y - this.scroll_y, 75, 75);
		}
		else if(this.action_id > 1){
			game_canvas.drawImage(image_repository.funiture_at_work,this.pictur_x, this.pictur_y, 75, 75, this.x - this.scroll_x, this.y - this.scroll_y, 75, 75);
		}
		
		//Zeichnet die Aktuelle Zeit wenn ein Time läuft
		if(this.action_id != 0){
			game_canvas.beginPath();
			game_canvas.rect(this.x - this.scroll_x + 5, this.y - this.scroll_y + 52, 65, 16);
			game_canvas.fillStyle = "lightgrey";
			game_canvas.fill();
			game_canvas.fillStyle = "black";
			game_canvas.fillText(convert_time_to_string(this.time_left), this.x - this.scroll_x + 10, this.y - this.scroll_y + 65);
		}
	}
	
	this.scroll_position = function(x, y){
		this.scroll_x = x;
		this.scroll_y = y;
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

function Room_Data(id, name, pictur_x, pictur_y, description){
	this.id = id
	this.name = name
	this.pictur_x = pictur_x 
	this.pictur_y = pictur_y
	this.description = description;
}

//Klasse für den Datentüp Funiture der die Definition eines Einrichtungsobjekts enthält
function Funiture_Data(id, name, description, price, construckion_time, craftable_wares, pictur_x, pictur_y){
	this.id = id;
	this.name = name;
	this.description = description;
	this.price = price;
	this.construckion_time = construckion_time;
	this.craftable_wares = craftable_wares;
	this.pictur_x = pictur_x;
	this.pictur_y = pictur_y;
	
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
	this.description = description;
}

function Customer_Data(id, preference, tolerance){
	this.id = id;
	this.preference = preference;
	this.tolerance = tolerance;
}