var image_repository = new function(){	
	//Stetllt sicher das alle bilder vor start geladen werden
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === 11) {
			window.setTimeout(window.init(), 500);
		}
	}
	
	this.head_bar_background = new Image();
	this.shop_tile = new Image();
	this.shop_tile_marking = new Image();
	this.button_image = new Image();
	this.up_down_button = new Image();
	this.funiture = new Image();
	this.funiture_at_work = new Image();
	this.menue_field = new Image();
	this.ware_tile = new Image();
	this.wares = new Image();
	this.market_ware = new Image();
	this.crafting_blueprint = new Image();
	this.sellable_ware = new Image();
	this.ui_part = new Image();
	
	this.head_bar_background.onload = function(){imageLoaded();};
	this.shop_tile.onload = function(){imageLoaded();};
	this.shop_tile_marking.onload = function(){imageLoaded();};
	this.button_image.onload = function(){imageLoaded();};
	this.up_down_button.onload = function(){imageLoaded();};
	this.funiture.onload = function(){imageLoaded();};
	this.funiture_at_work.onload = function(){imageLoaded();};
	this.menue_field.onload = function(){imageLoaded();};
	this.ware_tile.onload = function(){imageLoaded();};
	this.wares.onload = function(){imageLoaded();};
	this.market_ware.onload = function(){imageLoaded();};
	this.ui_part.onload = function(){imageLoaded();};
	this.crafting_blueprint.onload = function(){imageLoaded();};
	this.sellable_ware.onload = function(){imageLoaded();};
	
	this.head_bar_background.src = "imgs/head_bar_background.jpg";
	this.shop_tile.src = "imgs/shop_tile.jpg";
	this.shop_tile_marking.src = "imgs/shop_tile_marking.png";
	this.button_image.src = "imgs/button.jpg";
	this.up_down_button.src = "imgs/up_down_button.jpg";
	this.funiture.src = "imgs/funiture.png";
	this.funiture_at_work.src = "imgs/funiture_at_work.png";
	this.menue_field.src = "imgs/menue_field.jpg";
	this.ware_tile.src = "imgs/ware_tile.gif";
	this.wares.src = "imgs/wares.gif";
	this.market_ware.src = "imgs/market_ware.jpg";
	this.ui_part.src = "imgs/ui_part.jpg";
	this.crafting_blueprint.src = "imgs/craftable_ware.jpg";
	this.sellable_ware.src = "imgs/sellable_ware.jpg";
}