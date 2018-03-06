var image_repository = new function(){	
	//Stetllt sicher das alle bilder vor start geladen werden
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === 21) {
			window.setTimeout(window.init(), 500);
		}
	}
	//game assets
	this.location_menue = new Image();
	this.shop_tile = new Image();
	this.shop_tile_marking = new Image();
	this.button_image = new Image();
	this.close_button = new Image();
	this.up_down_button = new Image();
	this.funiture = new Image();
	this.funiture_at_work = new Image();
	this.sold_sign = new Image();
	this.menue_field = new Image();
	this.ware_tile = new Image();
	this.wares = new Image();
	this.market_ware = new Image();
	this.storage_ware = new Image();
	this.crafting_blueprint = new Image();
	this.sellable_ware = new Image();
	this.ui_panel_border = new Image();
	this.ui_panel_background = new Image();
	this.construct_info = new Image();
	this.help_button = new Image();
	
	this.location_menue.onload = function(){imageLoaded();};
	this.shop_tile.onload = function(){imageLoaded();};
	this.shop_tile_marking.onload = function(){imageLoaded();};
	this.button_image.onload = function(){imageLoaded();};
	this.close_button.onload = function(){imageLoaded();};
	this.up_down_button.onload = function(){imageLoaded();};
	this.funiture.onload = function(){imageLoaded();};
	this.funiture_at_work.onload = function(){imageLoaded();};
	this.sold_sign.onload = function(){imageLoaded();};
	this.menue_field.onload = function(){imageLoaded();};
	this.ware_tile.onload = function(){imageLoaded();};
	this.wares.onload = function(){imageLoaded();};
	this.market_ware.onload = function(){imageLoaded();};
	this.storage_ware.onload = function(){imageLoaded();};
	this.ui_panel_border.onload = function(){imageLoaded();};
	this.ui_panel_background.onload = function(){imageLoaded();};
	this.crafting_blueprint.onload = function(){imageLoaded();};
	this.sellable_ware.onload = function(){imageLoaded();};
	this.construct_info.onload = function(){imageLoaded();};
	this.help_button.onload = function(){imageLoaded();};
	
	this.location_menue.src = "imgs/location_menue.png";
	this.shop_tile.src = "imgs/shop_tile.jpg";
	this.shop_tile_marking.src = "imgs/shop_tile_marking.png";
	this.button_image.src = "imgs/button.jpg";
	this.close_button.src = "imgs/close_button.png";
	this.up_down_button.src = "imgs/up_down_button.jpg";
	this.funiture.src = "imgs/funiture.png";
	this.funiture_at_work.src = "imgs/funiture_at_work.png";
	this.sold_sign.src = "imgs/sold_sign.png";
	this.menue_field.src = "imgs/menue_field.jpg";
	this.ware_tile.src = "imgs/ware_tile.gif";
	this.wares.src = "imgs/wares.gif";
	this.market_ware.src = "imgs/market_ware.jpg";
	this.storage_ware.src = "imgs/storage_ware.jpg";
	this.ui_panel_border.src = "imgs/ui_panel_border.jpg";
	this.ui_panel_background.src = "imgs/ui_panel_background.png";
	this.crafting_blueprint.src = "imgs/craftable_ware.jpg";
	this.sellable_ware.src = "imgs/sellable_ware.jpg";
	this.construct_info.src = "imgs/construct_info.jpg";
	this.help_button.src = "imgs/help_button.png";
	
	//help images
	this.tutorial_image_test = new Image();
	
	this.tutorial_image_test.onload = function(){imageLoaded();};
	
	this.tutorial_image_test.src = "help_imgs/tutorial_image_test.png";
}