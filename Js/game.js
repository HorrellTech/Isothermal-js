// CONSTANTS
const canvasId = 'canvasArea';
const textboxId = 'textbox';
const pi = Math.PI; // PI
const self = -1; // The instance which is executing the current block of code
const other = -2; // The other instance involved in a collision event, or the other instance from a with function
const all = -3; // All instances currently active in the room
const noone = -4; // No instance at all

// FONT CONSTANTS
const fa_start = 'start';
const fa_end = 'end';
const fa_left = 'left';
const fa_center = 'center';
const fa_right = 'right';

// BLEND MODE CONSTANTS
const bm_normal = 'source-over';
const bm_xor = 'xor';
const bm_src_in = 'source-in';
const bm_src_out = 'source-out';
const bm_src_atop = 'source-atop';
const bm_src_over = 'source-over';
const bm_dest_in = 'destination-in';
const bm_dest_out = 'destination-out';
const bm_dest_atop = 'destination-atop';
const bm_dest_over = 'destination-over';
const bm_add = 'lighter';
const bm_lighten = 'lighten';
const bm_overlay = 'overlay';
const bm_copy = 'copy';
const bm_multiply = 'multiply';
const bm_darken = 'darken';
const bm_difference = 'difference';
const bm_luminosity = 'luminosity';
const bm_color = 'color';
const bm_screen = 'screen';
const bm_softlight = 'soft-light';
const bm_exclusion = 'exclusion';
const bm_hardlight = 'hard-light';
const bm_saturation = 'saturation';
const bm_colorburn = 'color-burn';
const bm_colordodge = 'color-dodge';

// COLOR CONSTANTS
const c_red = rgb(255, 0, 0);
const c_white = rgb(255, 255, 255);
const c_black = rgb(0, 0, 0);
const c_ltgray = rgb(176, 176, 176);
const c_gray = rgb(128, 128, 128);
const c_dkgray = rgb(64, 64, 64);
const c_blue = rgb(0, 0, 255);
const c_lime = rgb(0, 255, 0);
const c_green = rgb(0, 145, 0);
const c_yellow = rgb(255, 255, 0);
const c_orange = rgb(255, 176, 0);
const c_purple = rgb(255, 0, 255);
const a_100 = 1.0; // Alpha full
const a_50 = 0.5; // Alpha half
const a_0 = 0.0; // Alpha none
const a_25 = 0.25; // Alpha 1/4
const a_75 = 0.75; // Alpha 3/4

// HIDDEN GLOBAL VARIABLES
gameObjects = []; // The game object list
sprites = []; // Hold a list of sprites
surfaces = []; // List holding the surfaces in the game
surfaceTarget = noone; // The current target surface
context = null;
animationFrame = null; // How we will talk to the animation frame requests
mx = 0; // Base mouse x
my = 0; // Base mouse y
tx = 0; // Touch x
ty = 0; // touch y
lastTick = 0; // Last time the frame ticked
font_size = 12;
font_style = "Arial";
globalObj = noone;
tileLayersLow = []; // Keep track of lower tiles
tileLayersHigh = []; // Keep track of higher tiles
tileLayerCount = 1; // We want to have a capped number of tile layers
tileSizeDefault = 32; // Default tile size

images = [];

// GLOBAL VARIABLES
control = noone; // The global instance
room_speed = 30;
room_width = 1024;
room_height = 768;
background_color = c_ltgray;
tile_none = new tile(noone, false);
fps = 0;
view_xview = 0;
view_yview = 0;
view_wview = 640;
view_hview = 480;
view_angle = 0;
mouse_x = 0;
mouse_y = 0;
score = 0;
health = 100;
lives = 3;
instance_count = 0;
object_count = 0;
delta_time = 0;
time_scale = 1.0; // The time scale can be used for slow motion or game pausing
time_current = new Date().getTime();
prevent_default_handler = false; // Prevent key or mouse events from interacting with the website and contain only inside canvas
fullscreen_aspect_ratio = false; // If the canvas size should match the window

document.getElementById('canvasResetButton').addEventListener('click', function() {
  gameResetEval();
});

function gameRestart()
{
    gameStart(640, 480);
}

// Restart the app with code input
function gameRestartCode(c)
{
	gameStart();
    execute_string(c);
}

function gameRestartEval()
{
    var c = document.getElementById(textboxId).value;
    //images = img;
	gameStart();
    execute_string(c);
}

/*window.onload = function() {
    var sources = {
        /*resource1: "img/sprite1.png",
        resource2: "img/sprite2.png",
        resource3: "img/sprite3.png"
    };
    //loadImages(sources, gameRestartEval);  // calls initGame after *all* images have finished loading
};*/

function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function(){
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

function fullscreenify() 
{
    var canvas = game.canvas;
    var style = canvas.getAttribute('style') || '';
    
    window.addEventListener('resize', function () {resize(canvas);}, false);

    resize(canvas);

    function resize(canvas) {
        if(fullscreen_aspect_ratio)
        {
            var scale = {x: 1, y: 1};
            scale.x = (window.innerWidth - 10) / canvas.width;
            scale.y = (window.innerHeight - 10) / canvas.height;
            
            if (scale.x < 1 || scale.y < 1) {
                scale = '1, 1';
            } else if (scale.x < scale.y) {
                scale = scale.x + ', ' + scale.x;
            } else {
                scale = scale.y + ', ' + scale.y;
            }
            
            canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
        }
    }
}

// Scale the canvas relative to it's current size (1 = normal)
function scaleCanvas(xscale, yscale)
{
    if(context != null)
    {
        game.canvas.width *= xscale;
        game.canvas.height *= yscale;
        context.scale(xscale, yscale);
    }
}

// Start the game
function gameStart()
{
    cancelAnimationFrame(animationFrame);
    surfaceTarget = context;
    gameObjects = [];
    /*for(var i = 0; i < 256; i += 1)
    {
        key_down[i] = false;
        key_pressed[i] = false;
        key_released[i] = false;
    }*/

    surfaceTarget = noone;
    for(var i = 0; i < surfaces.length; i += 1)
    {
        surface_free(surfaces[i]);
    }

    surfaces = [];
    room_width = 1024;
    room_height = 768;
    view_xview = 0;
    view_yview = 0;
    view_wview = 640;
    view_hview = 480;
    time_scale = 1.0;
    background_color = c_ltgray;

    // Initialize the tile layers
    /*for(var i = 0; i < tileLayerCount; i += 1)
    {
        tileLayersLow.push(new tileLayer(room_width / tileSizeDefault, room_height / tileSizeDefault, tileSizeDefault));
        tileLayersHigh.push(new tileLayer(room_width / tileSizeDefault, room_height / tileSizeDefault, tileSizeDefault));
    }*/

    game.start(view_wview, view_hview, '2d');
    lastTick = new Date().getTime();

    context = game.context;

    draw_set_font(24, 'Calibri');
    draw_set_align(fa_start);
    draw_set_color(c_white);

    // Game logic here
    globalObj = object_add();

    globalObj.awake = function()
    {
        this.debug_mode = true;
        this.text_color = c_red;
    }

    globalObj.draw_gui = function()
    {
        if(this.debug_mode)
        {
            draw_set_color(this.text_color);
            draw_set_alpha(a_100);
            draw_text(view_xview, view_yview, "Obj Count: " + object_count + "; Inst Count: " + instance_count + "; FPS: " + fps);
            draw_set_color(c_white);
        }
    }

    control = instance_create(0, 0, globalObj);
}

function debug_off()
{
    control.loop = function()
    {
        this.debug_mode = false;
    }
}

function debug_on()
{
    control.loop = function()
    {
        this.debug_mode = true;
    }
}

function randomSkinColor()
{
    var col = '#FFFFFF';
    switch (irandom(3))
    {
        case 0:
            col = ('#FFE0BD');
        break;
        case 1:
            col = ('#FFCD94');
        break;
        case 2:
            col = ('#FFE39F');
        break;
        case 3:
            col = ('#633C1D');
        break;
    }

    return(col);
}

// The main game area where the canvas will be held
var game = 
{
    cont : '2d', // The context
    canvas : createCanvas(),
    start : function(width, height, cont) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.zIndex = 0;
        this.cont = cont;
        this.context = this.canvas.getContext(cont);
        surfaceTarget = this.context;
        updateGameArea();
        view_angle = 0;
        },
    clear : function() {
        if(this.cont == '2d')
        {
            draw_set_color(background_color);
            draw_rectangle(view_xview, view_yview, view_xview + view_wview, view_yview + view_hview);
            draw_set_color(c_white);
        } 
        else if(this.cont == 'webgl')
        {
            this.context.clearColor(1.0, 1.0, 1.0, 1.0);
            this.context.clearDepth(1.0);
            this.context.enable(this.context.DEPTH_TEST);
            this.context.depthFunc(this.context.LEQUAL);
            this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        }
    }
};

// TILE STUFF

// A layer holding a bunch of tiles for static drawing
function tileLayer(width, height, tileSize)
{
    this.tiles = [,];
    this.width = width;
    this.height = height;
    this.tile_size = tileSize;
    this.active = true;

    for(var i = 0; i < this.width; i += 1)
    {
        for(var j = 0; j < this.height; j += 1)
        {
            this.tiles[i, j] = tile_none; 
        }
    }

    // Draw the tiles in the tile layer, but only what is visible in the view
    this.draw = function()
    {
        if(this.active)
        {
            for(var i = round((view_xview - (this.tile_size * 2)) / this.tile_size); i < round((view_xview + view_wview + (this.tile_size * 2))); i += 1)
            {
                for(var j = round((view_yview - (this.tile_size * 2)) / this.tile_size); j < round((view_yview + view_hview + (this.tile_size * 2))); j += 1)
                {
                    if(i >= 0 && j >= 0 && i < room_width / this.tile_size && j < room_height / this.tile_size)
                    {
                        if(this.tiles[i, j] == tile_none)
                        {
                            this.tiles[i, j].draw_debug(i * this.tile_size, j * this.tile_size, this.tile_size, this.tile_size, c_red);
                        }
                        else
                        {
                            this.tiles[i, j].draw(i * this.tile_size, j * this.tile_size);
                        }
                    }
                }
            }
        }
    }
}

// Tile for static drawings seperate to objects
function tile(image, solid)
{
    this.image = image;
    this.solid = solid; // If the standard collision math will treat it as collidable

    // Draw the tile
    this.draw = function(x, y)
    {
        if(this.image != noone)
        {
            context.drawImage(this.image, x, y);
        }
    };

    // Draw the tile debugged
    this.draw_debug = function(x, y, w, h, color)
    {
        draw_set_color(color);
            draw_rectangle(x, y, x + w, y + h, true);
        draw_set_color(c_white);
    };
}

// Create a new surface
function surface_create(width, height)
{
    var s = new surface(surfaces.length, width, height);

    surfaces.push(s);

    return (s);
}

// Remove a surface from the canvas
function surface_free(surface)
{
    if(surface != null)
    {
        surface.free();
    }
}

// Draw a surface
function surface_draw(surface, x, y)
{
    surface.drawMain(x, y);
}

// Draw a surface extended
function surface_draw_ext(surface, x, y, width, height)
{
    surface.drawMainExt(x, y, width, height);
}

// Set the target drawing surface
function surface_set_target(surface)
{
    surfaceTarget = surface.canvas.getContext('2d');
}

// Reset the target drawing surface
function surface_reset_target()
{
    surfaceTarget = context;
}

// Create a sprite from the surface
function sprite_create_from_surface(surface)
{
    var img = new Sprite(surface.getSprite(), 0);

    sprites.push(img);

    return (img);
}

function surface_exists(surface)
{
    return(surface.canvas != null);
}

// Surface object
function surface(id, width, height)
{
    this.canvas = document.createElement('canvas'); // Create a new canvas
    this.canvas.id = 'surface' + id.toString();
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.zIndex = id;

    // Draw the surface itself
    this.drawMain = function(x, y)
    {
        context.drawImage(this.canvas, x, y);
    }

    // Draw the surface itself
    this.drawMainExt = function(x, y, width, height)
    {
        context.drawImage(this.canvas, x, y, width, height);
    }

    this.getSprite = function()
    {
        return (this.canvas.toDataURL());
    }

    this.free = function()
    {
        this.canvas = null;
    }
}

// A sprite object
function sprite(image, frame_count)
{
    this.origin_x = 0;
    this.origin_y = 0;
    this.frame_count = frame_count;

    this.image = new Image(image.width, image.height);
    this.image.src = image;
}

// Create a new instance of an object
function instance_create(x, y, object)
{
    var temp = object.instantiate(x, y);
    temp.isParent = false;

    return(temp);
}

// Create a new object
function object_add()
{
    var temp = new gameObject(0, 0, 0, 0);

    gameObjects.push(temp);

    return(temp);
}

// Game object
function gameObject(x, y, width, height) 
{
    this.instances = [];
    this.isParent = true;
    this.object_id = noone;
    this.id = 0;
    this.need_removed = false;
    this.has_sorted_depth = true;
    this.need_sorted = false;
    this.use_built_in_physics = true;

    this.active = true;
    this.visible = true;
    
    // Hotspots are points on object like anchor points we can attatch other objects to
    this.hotspot_x = [];
    this.hotspot_y = [];

    this.x = x;
    this.y = y;
    this.xstart = x;
    this.ystart = y;
    this.xprevious = x;
    this.yprevious = y;
    this.bbox_left = 0;
    this.bbox_top = 0;
    this.bbox_right = 0;
    this.bbox_bottom = 0;
    this.center_x = 0;
    this.center_y = 0;
    this.depth = 0;
    this.width = width;
    this.height = height;
    this.hspeed = 0;
    this.vspeed = 0; 
    this.friction = 0;   
    this.speed = 0;
    this.direction = 0;
    this.gravity = 0;
    this.gravity_direction = 270;

    this.image_index = 0;
    this.image_number = 1;
    this.offset_x = 0; // Collision box offset x
    this.offset_y = 0; // Collision box offset y

    this.hasWoken = false;

    // When the object is first created
    this.awake = function()
    {};

    // Perform on every loop
    this.loop = function() 
    {};

    // Perform before every loop
    this.loop_begin = function() 
    {};

    // Perform after every loop
    this.loop_end = function() 
    {};

    // Draw on every loop
    this.draw = function()
    {};

    // Will be drawn very last, and on top of every normal draw event
    this.draw_gui = function()
    {};

    // The update called in the game update method (DO NOT OVER WRITE)
    this.updateMain = function()
    {
            if(!this.hasWoken)
            {
                this.awake();
                this.hasWoken = true;
                this.xstart = this.x;
                this.ystart = this.y;
            }

            this.loop_begin();
            this.xprevious = this.x;
            this.yprevious = this.y;

            //this.image_index += 1 % this.image_number;

            this.loop();

            if(this.use_built_in_physics)
            {
                // The speed functionality
                if(this.speed != 0)
                {
                    this.hspeed = lengthdir_x(this.speed, this.direction);
                    this.vspeed = lengthdir_y(this.speed, this.direction);
                }

                // Horizontal speed and vertical speed functionality
                if(this.hspeed != 0)
                {
                    this.x += this.hspeed * time_scale;
                }
                if(this.vspeed != 0)
                {
                    this.y += this.vspeed * time_scale;
                }

                // Gravity functionality
                if(this.gravity != 0)
                {
                    this.hspeed += lengthdir_x(this.gravity, this.gravity_direction);
                    this.vspeed += lengthdir_y(this.gravity, this.gravity_direction);
                }

                // Have the friction work like game maker
                if(this.friction > 0)
                {
                    this.hspeed *= ceil(this.friction) - this.friction;
                    this.vspeed *= ceil(this.friction) - this.friction;
                }
                else
                {
                    this.hspeed *= 1 - this.friction;
                    this.vspeed *= 1 - this.friction;
                }
            }            
            
            if(this.object_id.instances[0] == this) // If we are the first object in the line
            {
                this.object_id.sort_by_depth();
            }

            // Stop direction from exceeding 360 degrees
            this.direction = (this.direction % 360.0);

            // Collision positions
            this.bbox_left = this.x - this.offset_x;
            this.bbox_top = this.y - this.offset_y;
            this.bbox_right = this.bbox_left + this.width;
            this.bbox_bottom = this.bbox_top + this.height;

            // Center of the object based on the collision box center
            this.center_x = this.bbox_left + (this.width / 2);
            this.center_y = this.bbox_top + (this.height / 2);

            this.loop_end();
    };

    // Sort the instances based on their depth
    this.sort_by_depth = function()
    {
        var len = this.instances.length;
        if(len > 1)
        {
            for(var i = len - 1; i >= 0; i -= 1) // Loop through instances
            {
                for(var j = 1; j <= i; j += 1)
                {
                    var d1 = this.instances[j].depth;
                    var d2 = this.instances[j - 1].depth;
                    if(d2 < d1)
                    {
                        var temp2 = this.instances[j - 1];
                        this.instances[j - 1] = this.instances[j];
                        this.instances[j] = temp2;
                    }
                }
            }
        }
    }

    // The draw called in the game update method (DO NOT OVER WRITE)
    this.mainDraw = function()
    {
        this.draw();
    };

    // This is called after every other event, so everything will be drawn last in this event
    this.mainDrawGui = function()
    {
        this.draw_gui();
    }

    // Add a new instance to this object
    this.instantiate = function(x, y)
    {
        var temp = new gameObject(x, y, this.width, this.height);
        temp.hasWoken = false;
        temp.awake = this.awake;
        temp.loop = this.loop;
        temp.loop_begin = this.loop_begin;
        temp.loop_end = this.loop_end;
        temp.draw = this.draw;
        temp.draw_gui = this.draw_gui;
        temp.object_id = this;
        temp.id = this.id;
        temp.isParent = false;

        this.instances.push(temp);

        this.id += 1;

        return(temp);
    };

    // Check if there are inactive instaces waiting to be removed, and if so, remove them
    this.clean_up_instances = function()
    {
        for(var i = 0; i < this.instances.length; i += 1)
        {
            var ins = this.instances[i];
            if(!ins.active)
            {
                if(ins.need_removed)
                {
                    this.instances.splice(i, 1);
                }
            }
        }
    };

    // Remove this instance from the object_id instances list
    this.instance_destroy = function()
    {
        this.active = false;
        this.need_removed = true;
        //object_id.clean_up_instances(); // Make the parent object clean up resources
    };

    // Add motion towards a direction
    this.motion_add = function(direction, speed)
    {
        this.speed += speed;
        this.direction = direction;
    };

    // Set motion in a direction
    this.motion_set = function(direction, speed)
    {
        this.speed = speed;
        this.direction = direction;
    };

    // Move the object towards a point at a speed
    this.move_towards_point = function(x, y, speed)
    {
        var pos = point_direction(this.x, this.y, x, y);
        this.motion_set(pos, speed);
    }

    // Snap the object to a grid
    this.move_snap = function(hsnap, vsnap)
    {
        this.x = snap(this.x, hsnap);
        this.y = snap(this.y, vsnap);
    };

    // Reverse the directions, takes in booleans
    this.move_bounce = function(hbounce, vbounce, dirbounce)
    {
        if(hbounce)
        {
            if(dirbounce)
            {
                this.direction = 2 * 0 - this.direction - 180;
            }
            else
            {
                this.hspeed *= -1;
            }
        }
        if(vbounce)
        {
            if(dirbounce)
            {
                this.direction = 2 * 90 - this.direction - 180;
            }
            else
            {
                this.vspeed *= -1;
            }
        }
    };

    // Check if the object is within the view bounds
    this.within_view = function()
    {
        var x1, y1, x2, y2;
        x1 = this.x;
        y1 = this.y;
        x2 = this.x + this.width;
        y2 = this.y + this.height;
        return (x2 > 0 && y2 > 0 && x1 < view_xview + view_wview && y1 < view_yview + view_hview);
    }

    // Check if the mouse is within the instances bounds
    this.mouse_over = function()
    {
        return (mouse_x > this.x && mouse_y > this.y && mouse_x < this.x + this.width && mouse_y < this.y + this.height);
    }

    // Check if the mouse is within the instances bounds
    this.point_inside = function(x, y)
    {
        return (x > this.x && y > this.y && x < this.x + this.width && y < this.y + this.height);
    }

    // Move the object
    this.move_contact = function(dir, maxdist, object)
    {
        var dist = 1000;
        if(maxdist == 0 || maxdist == -1)
        {
            dist = 1000;
        }
        else
        {
            dist = maxdist;
        }
            for(var i = 0; i < dist; i += 1)
            {
                this.x += lengthdir_x(1, dir);
                this.y += lengthdir_y(1, dir);

                for(var j = 0; j < object.instances.length; j += 1)
                {
                    var ins = object.instances[j];

                    if(ins.active && this.active)
                    {
                        if(checkCollision(this, ins))
                        {
                            return (true);
                        }
                    }
                }
            }
        return(false);
    }

    // If there is an instance at the location hor or ver, push self in the opposite direction at the amount until there is no longer a collision
    this.jump_outside = function(amount, object)
    {
        var ret;
        ret = false;

        for(var i = 0; i < object.instances.length; i += 1)
        {
            var ins = object.instances[i];

            if(ins.active && this.active)
            {
                while(checkCollision(this, ins))
                {
                    var dir = point_direction(ins.bbox_right / 2, ins.bbox_bottom / 2, this.bbox_right / 2, this.bbox_bottom / 2);
                    this.x = this.x + lengthdir_x(amount, dir);
                    this.y = this.y + lengthdir_y(amount, dir);
                }
            }
        }
    }

    // If there is an instance at the location hor or ver, push self in the opposite direction at the amount until there is no longer a collision
    this.push_outside = function(amount, object)
    {
        var ret;
        ret = false;

        for(var i = 0; i < object.instances.length; i += 1)
        {
            var ins = object.instances[i];

            if(ins.active && this.active)
            {
                if(checkCollision(this, ins))
                {
                    var dir = point_direction(ins.bbox_right / 2, ins.bbox_bottom / 2, this.bbox_right / 2, this.bbox_bottom / 2);
                    this.x = this.x + lengthdir_x(amount, dir);
                    this.y = this.y + lengthdir_y(amount, dir);
                }
            }
        }
    }

    // Return if there is a collision with an instance
    this.gridworld_place_meeting = function(x, y, id)
    {
        var xOld, yOld, ret;
        ret = false;
        xOld = this.x;
        yOld = this.y;

        this.x = x;
        this.y = y;


        this.x = xOld;
        this.y = yOld;

        return (ret);
    }

    // Return if there is a collision with an instance
    this.place_meeting = function(x, y, object)
    {
        var xOld, yOld, ret;
        ret = false;
        xOld = this.x;
        yOld = this.y;

        this.x = x;
        this.y = y;

        for(var i = 0; i < object.instances.length; i += 1)
        {
            var ins = object.instances[i];

            if(ins.active && this.active)
            {
                if(checkCollision(this, ins))
                {
                    ret = true;
                }
            }
        }
        this.x = xOld;
        this.y = yOld;

        return (ret);
    }

    // Return a collision with an instance and return the instance
    this.instance_place = function(x, y, object)
    {
        var xOld, yOld, ret;
        ret = noone;
        xOld = this.x;
        yOld = this.y;

        this.x = x;
        this.y = y;

        for(var i = 0; i < object.instances.length; i += 1)
        {
            var ins = object.instances[i];

            if(ins.active && this.active)
            {
                if(collision_with(ins))
                {
                    ret = ins;
                }
            }
        }
        this.x = xOld;
        this.y = yOld;

        return (ret);
    }

    // Detect collision with another instance of object type
    this.collision_with = function(object)
    {
        if(!this.isParent)
        {
            for(var i = 0; i < object.instances.length; i += 1)
            {
                if(this != object.instances[i] && object.instances[i].active)
                {
                    if(checkCollision(object.instances[i], this))
                    {
                        //alert('this = ' + this.id + ', other = ' + object.instances[i].id);
                        return(object.instances[i]);
                    }
                }
            }
        }
        return(noone);
    }

    // Get the nearest instance of an object to a point
    this.instance_nearest = function(x, y, object)
    {
        var nearest = noone;
        var dist = 9999999;
        for(var i = 0; i < object.instances.length; i += 1)
        {
            if(object.instances[i] != this && object.instances[i].active)
            {
                var dist2 = point_distance(x, y, object.instances[i].x, object.instances[i].y);
                if(dist2 < dist)
                {
                    dist = dist2;
                    nearest = object.instances[i];
                }
            }
        }

        return(nearest);
    }
}

// Set the view centered to a position with a smootheness value(8 is a good smoothness value)
function view_center_position(x, y, smoothness)
{
    if(smoothness == 0)
    {
        view_xview = x - (view_wview / 2);
        view_yview = y - (view_hview / 2);
    }
    else
    {
        var xx, yy, xt, yt, dir, dist;
        xx = view_xview + (view_wview / 2); // Center X position
        yy = view_yview + (view_hview / 2); // Center Y position
        xt = x;
        yt = y;
        dir = point_direction(xx, yy, xt, yt);
        dist = point_distance(xx, yy, xt, yt);
        
        view_xview = (xx + lengthdir_x((dist / smoothness), dir)) - (view_wview / 2);
    view_yview = (yy + lengthdir_y((dist / smoothness), dir)) - (view_hview / 2);
    }
}

// Return the instance(if any) at the position set
function instance_position(x, y, object)
{
    for(var i = 0; i < object.instances.length; i += 1)
    {
        var ins = object.instances[i];

        if(ins.point_inside(x, y))
        {
            return (ins);
        }
    }
    return (noone);
}


function checkCollision(object1, object2)
    {
        if(object1.active && object2.active)
        {
            if(object1.x < object2.x + object2.width  && object1.x+ object1.width  > object2.x &&
            object1.y < object2.y + object2.height && object1.y + object1.height > object2.y)
            {
                return(true);
            }
            else
            {
                return(false);
            }
        }
        else
        {
            return(false);
        }
    }

// Sort all of the objects based on their top instances depth
function sortObjectsByDepth()
{
    if(gameObjects.length > 0)
    {
    var len = gameObjects.length;

        for(var i = len - 1; i >= 0; i -= 1) // Loop through instances
        {
            for(var j = 1; j <= i; j += 1)
            {
                if(gameObjects[j].instances.length > 0)
                {
                    //gameObjects[j].instances[0].object_id.sort_by_depth();
                    var d1 = gameObjects[j].instances[0].depth;
                    var d2 = gameObjects[j - 1].instances[0].depth;
                    if(d2 < d1)
                    {
                        var temp2 = gameObjects[j - 1];
                        gameObjects[j - 1] = gameObjects[j];
                        gameObjects[j] = temp2;
                    }
                }
            }
        }
    }
}

/// 2D GRID BASED WORLD like terraria

// Create a new grid world
function gridworld_create(width, height, blockSize, defaultBlockType)
{
    this.width = width;
    this.height = height;
    this.block_size = blockSize;

    this.grid = array2d_create(width, height, defaultBlockType);

    return (this);
}

// Set the value of a gridworld position
function gridworld_set(id, x, y, value)
{
    id.grid[x][y] = value;
}

// Get the value of the gridworld position
function gridworld_get(id, x, y)
{
    return (id.grid[x][y]);
}

// Get the x view point in the grid world
function gridworld_view_x(id)
{
    return (floor(view_xview / id.block_size));
}

// Get the position + width of the viewport in grid position
function gridworld_view_width(id)
{
    ceil((view_xview + view_wview) / id.block_size);
}

// Get the y view point in the grid world
function gridworld_view_y(id)
{
    return(floor(view_yview / id.block_size));
}

// Get the position + height of the viewport in grid position
function gridworld_view_height(id)
{
    ceil((view_yview + view_hview) / id.block_size);
}

// Get the width of the grid world
function gridworld_get_width(id)
{
    return (id.width);
}

// Get the height of the grid world
function gridworld_get_height(id)
{
    return (id.height);
}

// Get the block size in the grid world
function gridworld_get_block_size(id)
{
    return (id.block_size);
}

// Get the world position of the relative grid position
function gridworld_grid_to_world(id, gridCell)
{
    return(floor(gridCell * id.block_size));
}

// Get the relative grid position of the given world position
function gridworld_world_to_grid(id, worldPosition)
{
    return(floor(worldPosition / id.block_size));
}

// Get the world position of the relative grid position
function gridworld_gtw(id, gridCell)
{
    return(floor(gridCell * id.block_size));
}

// Get the relative grid position of the given world position
function gridworld_wtg(id, worldPosition)
{
    return(floor(worldPosition / id.block_size));
}

// Check if one of the objects has sorted by depth
function objectHasSortedDepth()
{
    for(var i = 0; i < gameObjects.length; i += 1)
    {
        if(gameObjects[i].has_sorted_depth)
        {
            gameObjects[i].has_sorted_depth = false;
            return (true);
        }
    }
    return (false);
}

// Main update loop
function updateGameArea()
{
    // FPS CALCULATION
    var delta = (new Date().getTime() - lastTick) / 1000;
    lastTick = new Date().getTime();
    fps = ceil(1 / delta);

    time_current = new Date().getTime();

    var oldViewAngle = view_angle; // Store the view angle
    var oldViewW = view_wview;
    var oldViewH = view_hview;
    if(context != game.context)
    {
        context = game.context;
    }

    game.clear();

    // Draw lower tiles
    /*for(var i = 0; i < tileLayerCount; i += 1)
    {
        tileLayersLow[i].draw();
    }*/

    var insCount = 0; // InstanceCount
        // This is the main game loop
        for (var i = 0; i < gameObjects.length; i += 1) 
        {
            if(gameObjects[i].instances != null)
            {
                for(var j = 0; j < gameObjects[i].instances.length; j += 1)
                {
                    var ins = gameObjects[i].instances[j];
                    if(ins.active)
                    {
                        ins.updateMain();
                        insCount += 1;
                    }
                }
            }
        }
        for (var x = 0; x < gameObjects.length; x += 1) 
        {
            if(gameObjects[x].instances != null)
            {
                for(var y = 0; y < gameObjects[x].instances.length; y += 1)
                {
                    var ins = gameObjects[x].instances[y];
                    if(ins.visible && ins.active)
                    {
                        ins.mainDraw();
                    }
                }
            }
        }
        for (var x = 0; x < gameObjects.length; x += 1) 
        {
            if(gameObjects[x].instances != null)
            {
                for(var y = 0; y < gameObjects[x].instances.length; y += 1)
                {
                    var ins = gameObjects[x].instances[y];
                    if(ins.visible && ins.active)
                    {
                        ins.mainDrawGui();
                    }
                }
            }
        }

        instance_count = insCount;
        object_count = gameObjects.length;

        mouse_x = mx + view_xview;
        mouse_y = my + view_yview;

        // If the view angle has changed, change the canvas angle
        /*if(oldViewAngle != view_angle)
        {
            draw_transform_begin();
            context.translate(game.canvas.width / 2, game.canvas.height / 2);
            context.rotate(degtorad(view_angle));
            context.translate(-game.canvas.width / 2, -game.canvas.height / 2);
            draw_transform_end();
        }*/

        if(oldViewH != view_hview)
        {
            game.canvas.height = view_hview;
        }
        if(oldViewW != view_wview)
        {
            game.canvas.width = view_wview;
        }

        view_angle % 360;
        sortObjectsByDepth();

        for(var i = 0; i < key_pressed.length; i += 1)
        {
            key_pressed[i] = false;
        }

        for(var i = 0; i < key_released.length; i += 1)
        {
            key_released[i] = false;
        }

        for(var i = 0; i < mouse_pressed.length; i += 1)
        {
            mouse_pressed[i] = false;
        }

        for(var i = 0; i < mouse_released.length; i += 1)
        {
            mouse_released[i] = false;
        }

        animationFrame = requestAnimationFrame(updateGameArea);
}

// Gets the number of instances of the given object
function instance_number(object_id)
{
    return(object_id.instances.length);
}

// If the canvas exists, use it, otherwise create a new one
function createCanvas()
{
    var canv = document.getElementById(canvasId);

    if(canv == null)
    {
        canv = document.createElement(canvasId);
    }
    canv.oncontextmenu = function(e){ return false; };

    return(canv);
}

// Every timer tick
function everyinterval(n) 
{
    if ((game.frameNo / n) % 1 == 0) 
    {
        return true;
    }
    return false;
}

//#newfile BasicDrawing

// DRAWING STUFF

// Get color from rgb color values
function rgb(r, g, b)
{
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    return ["rgb(",r,",",g,",",b,")"].join("");
}

function hsl(h, s, l)
{
    r = Math.floor(h);
    g = Math.floor(s) * 100;
    b = Math.floor(l) * 100;
    return ["hsl(",r,",",g,"%,",b,"%)"].join("");
}

// Set the drawing blend mode
function draw_set_blend_mode(blendMode)
{
    surfaceTarget.globalCompositeOperation = blendMode;
}

// Set the color of the shadow
function draw_set_shadow_color(color)
{
    surfaceTarget.shadowColor = color;
}

// Set the offset of the shadow
function draw_set_shadow_offset(x, y)
{
    surfaceTarget.shadowOffsetX = x;
    surfaceTarget.shadowOffsetY = y;
}

// Set the blur of the shadow
function draw_set_shadow_blur(amount)
{
    surfaceTarget.shadowBlur = amount;
}

// Set the drawing color
function draw_set_color(color)
{
    surfaceTarget.fillStyle = color;
    surfaceTarget.strokeStyle = color;
}

// Set the drawing alpha 0.0 - 1.0
function draw_set_alpha(alpha)
{
    surfaceTarget.globalAlpha = alpha;
}

// Set the transform for the drawing
function draw_transform_begin()
{
    surfaceTarget.save();
}

// Scale the draw transform
function draw_transform_scale(x, y)
{
    surfaceTarget.scale(x, y);
}

// Rotate the draw transform
function draw_transform_rotate(angle)
{
    surfaceTarget.rotate(angle);
}

// Transform the transform
function draw_transform_transform(m11, m12, m21, m22, dx, dy)
{
    surfaceTarget.transform(m11, m12, m21, m22, dx, dy);
}

// Transform the transform
function draw_transform_set_transform(m11, m12, m21, m22, dx, dy)
{
    surfaceTarget.setTransform(m11, m12, m21, m22, dx, dy);
}

// Get the transform
function draw_transform_get()
{
    return (surfaceTarget.getTransform());
}

// Translate the draw transform
function draw_transform_translate(x, y)
{
    surfaceTarget.translate(x, y);
}

// Reset the transform
function draw_transform_reset()
{
    surfaceTarget.resetTransform();
}

// Reset the transform
function draw_transform_end()
{
    surfaceTarget.restore();
}

// Draw an image
function draw_image(image, x, y)
{
    surfaceTarget.drawImage(image, x, y);
}

// Draw an image with a set width and height
function draw_image_ext(image, x, y, width, height)
{
    surfaceTarget.drawImage(image, x, y, width, height);
}

// Draw part of an image
function draw_image_part(image, x, y, width, height, left, top, right, bottom)
{
    surfaceTarget.drawImage(image, left, top, right, bottom, x, y, width, height);
}

// Clear the canvas/surface with a color
function draw_clear(color)
{
    var w = surfaceTarget.canvas.width;
    var h = surfaceTarget.canvas.height;
    var oldColor = surfaceTarget.fillStyle;

    surfaceTarget.clearRect(0, 0, w, h);

    draw_set_color(color);
    draw_rectangle(0, 0, w, h);
    draw_set_color(oldColor);
}

// Clear the canvas/surface with a color and an alpha
function draw_clear_alpha(color, alpha)
{
    var w = surfaceTarget.canvas.width;
    var h = surfaceTarget.canvas.height;
    var oldColor = surfaceTarget.fillStyle;
    var oldAlpha = surfaceTarget.globalAlpha;

    surfaceTarget.clearRect(0, 0, w, h);

    draw_set_color(color);
    draw_set_alpha(alpha);
    draw_rectangle(0, 0, w, h);
    draw_set_alpha(oldAlpha);
    draw_set_color(oldColor);
}

// Draw a rectangle as outline or filled
function draw_rectangle(x1, y1, x2, y2, outline)
{
    surfaceTarget.beginPath();
    if(outline)
    {
        surfaceTarget.strokeRect(x1 - view_xview, y1 - view_yview, x2 - x1, y2 - y1);
    }
    else
    {
        surfaceTarget.fillRect(x1 - view_xview, y1 - view_yview, x2 - x1, y2 - y1);
    }   
    surfaceTarget.closePath();
}

// Draw a rectangle as outline or filled
function draw_rectangle_color(x1, y1, x2, y2, col1, col2, outline)
{
    surfaceTarget.beginPath();
    var fillStylePrev = surfaceTarget.fillStyle;
    var strokeStylePrev = surfaceTarget.strokeStyle;
    var gradient = surfaceTarget.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, col1);
    gradient.addColorStop(1, col2);
    if(outline)
    {
        surfaceTarget.strokeStyle = gradient;
        surfaceTarget.strokeRect(x1, y1, x2 - x1, y2 - y1);
    }
    else
    {
        surfaceTarget.fillStyle = gradient;
        surfaceTarget.fillRect(x1, y1, x2 - x1, y2 - y1);
    }   
    surfaceTarget.strokeStyle = strokeStylePrev;
    surfaceTarget.fillStyle = fillStylePrev;
    surfaceTarget.closePath();
}

// Draw a line from one point to another
function draw_line(x1, y1, x2, y2)
{
        surfaceTarget.beginPath();
        surfaceTarget.moveTo(x1 - view_xview, y1 - view_yview);
        surfaceTarget.lineTo(x2 - view_xview, y2 - view_yview);
        surfaceTarget.stroke();
        surfaceTarget.closePath();
}

// Start drawing a primivite shape, from the x and y position
function draw_primitive_begin()
{
    surfaceTarget.beginPath();
}

// Point to draw to next
function draw_vertex(x, y)
{
    surfaceTarget.lineTo(x - view_xview, y - view_yview);
}

// End the primitive and set if it is filled or not
function draw_primitive_end(fill)
{
    surfaceTarget.closePath();
    if(fill)
    {
        surfaceTarget.fill();
    }
    else
    {
        surfaceTarget.stroke();
    }
}

// Set the drawing filter  using fl_* and fl_calc_*
function draw_set_filter(filter, value, calc_type)
{
    var fil = filter.toString() + '(' + value.toString() + calc_type.toString() + ')';
    //if(context.filter == 'none')
    //{
        surfaceTarget.filter = fil;
    //}
}

// Reset the drawing filter
function draw_reset_filter()
{
    surfaceTarget.filter = 'none';
}

// Set the text font, '30' 'Arial' for example
function draw_set_font(size, name)
{
    surfaceTarget.beginPath();
    surfaceTarget.font = size.toString() + 'px ' + name;
    font_size = size;
    font_style = name;
    surfaceTarget.closePath();
}

// Align the text using fa_*
function draw_set_align(align)
{
    surfaceTarget.textAlign = align;
}

// Draw a text to the screen
function draw_text(x, y, text)
{
    surfaceTarget.fillText(text, x - view_xview, y - view_yview + font_size);
}

// Draw a text to the screen
function draw_text_outline(x, y, text)
{
    surfaceTarget.strokeText(text, x - view_xview, y - view_yview + font_size);
}

// Draw a circle
function draw_circle(x, y, r, outline)
{
	if(r > 0)
	{
		if(outline)
		{
			surfaceTarget.beginPath();
			surfaceTarget.arc(x - view_xview, y - view_yview, r, 0, 2 * pi);
			surfaceTarget.closePath();
			surfaceTarget.stroke();
		}
		else
		{
			var oldLineWidth = surfaceTarget.lineWidth;
			surfaceTarget.lineWidth = 0;
			surfaceTarget.beginPath();
			surfaceTarget.arc(x - view_xview, y - view_yview, r, 0, 2 * pi);
			surfaceTarget.closePath();
			surfaceTarget.fill();
			surfaceTarget.lineWidth = oldLineWidth;
		}
	}
}

// Draw a circle
function draw_circle_color(x, y, r, color1, color2, outline)
{
	if(r > 0)
	{
        var fsOld;
        fsOld = surfaceTarget.fillStyle;
        surfaceTarget.beginPath();
        var grad = surfaceTarget.createRadialGradient(x, y, 1, x, y, r);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
		if(outline)
		{
			surfaceTarget.arc(x - view_xview, y - view_yview, r, 0, 2 * pi);
			surfaceTarget.closePath();
			surfaceTarget.stroke();
		}
		else
		{
			var oldLineWidth = surfaceTarget.lineWidth;
			surfaceTarget.lineWidth = 0;
			surfaceTarget.arc(x - view_xview, y - view_yview, r, 0, 2 * pi);
            surfaceTarget.closePath();
            surfaceTarget.fillStyle = grad;
			surfaceTarget.fill();
			surfaceTarget.lineWidth = oldLineWidth;
        }
        surfaceTarget.fillStyle = fsOld;
	}
}

// Draw a ray, and return a rayInfo about the ray
function ray_cast(id, x, y, stepSize, length, direction, object)
{
    var info = new ray_info();
    this.id = id;
    
    for(var i = 0; i < length; i += stepSize)
    {
        var xx = x + lengthdir_x(i, direction);
        var yy = y + lengthdir_y(i, direction);
        
        var ob = noone;
        if(object != noone)
        {
            
            ob = instance_position(xx, yy, object);
        }

        if(ob != noone)
        {
            info.hit_instance = ob;
            info.hit_distance = i;
            return(info);
        }
    }
}

// Draw a ray
function ray_draw(id, x, y, stepSize, length, direction, object)
{
    this.id = id;
    
    for(var i = 0; i < length; i += stepSize)
    {
        var xx = x + lengthdir_x(i, direction);
        var yy = y + lengthdir_y(i, direction);
        
        var ob = noone;
        if(object != noone)
        {
            
            ob = instance_position(xx, yy, object);
        }

        if(ob == noone)
        {
            draw_line(xx, yy, xx + lengthdir_x(stepSize, direction), yy + lengthdir_y(stepSize, direction));
        }
        else
        {
            break;
        }
    }
}

// To hold information about the distance etc of the ray
function ray_info()
{
    this.hit_instance = noone;
    this.hit_distance = 0;
    this.ray_id = 0;
}

//#newfile MathHelper

// ARRAY STUFF

// Create a new list
function list_create()
{
    var arr = [];

    return(arr);
}

// Add to the list
function list_add(id, value)
{
    id.push(value);
}

// Set an item to a certain value in the list
function list_set(id, pos, value)
{
    id[pos] = value;
}

// Get the value of an item in the list
function list_get(id, pos)
{
    return(id[pos]);
}

// Create and initialize a 2d array
function array2d_create(width, height, defaultValue)
{
    var arr = [];

    for(var i = 0; i < width; i += 1)
    {
        for(var j = 0; j < height; j += 1)
        {
            arr.push([i, j]);
            arr[i][j] = defaultValue;
        }
    }

    return(arr);
}

// Set the value of the 2d array
function array2d_set(array, x, y, value)
{
    array[x][y] = value;
}

// Get the value of the 2d array
function array2d_get(array, x, y)
{
    return(array[x][y]);
}

// Create and initialize a 2d array
function array3d_create(width, height, depth, defaultValue)
{
    var arr = [];

    for(var i = 0; i < width; i += 1)
    {
        for(var j = 0; j < height; j += 1)
        {
            for(var f = 0; f < depth; f += 1)
            {
                arr.push([i, j, f]);
                arr[i][j][f] = defaultValue;
            }
        }
    }

    return(arr);
}

// Set the value of the 2d array
function array3d_set(array, x, y, z, value)
{
    array[x][y][z] = value;
}

// Get the value of the 2d array
function array3d_get(array, x, y, z)
{
    return(array[x][y][z]);
}

// Clear the array
function array_clear(array)
{
    array = [];

    return(array);
}

// MATH STUFF

// Returns the greatest integer less than or equal to its numeric argument
function floor(x)
{
    return (Math.floor(x));
}

// Returns the smallest integer greater than or equal to its numeric argument
function ceil(x)
{
    return (Math.ceil(x));
}

// Returns the absolute value of a number
function abs(x)
{
    return (Math.abs(x));
}

// Returns a supplied numeric expression rounded to the nearest number
function round(x)
{
    return (Math.round(x));
}

// Returns the value of a base expression taken to a specific power
function power(x, y)
{
    return (Math.pow(x, y));
}

// Returns the sine of a number
function sin(x)
{
    return (Math.sin(x));
}

// Returns the cosine of a number
function cos(x)
{
    return (Math.cos(x));
}

// Returns the cosine of a number from degrees to radians
function dcos(x)
{
    return (cos(degtorad(x)));
}

function sign(x)
{
    return (Math.sign(x));
}

// Returns degrees to radians
function degtorad2()
{
    return ((pi * 2) / -360);
}

// Returns degrees to radians
function degtorad(x)
{
    return (x * pi / 180);
}

// Returns radians to degrees
function radtodeg(x)
{
    return (x * 180 / pi);
}

// Snap a position to a grid position
function snap(position, grid_size)
{
    return (floor(position / grid_size) * grid_size);
}

// Return the distance between 2 points
function point_distance(x1, y1, x2, y2)
{
    var a = (x1) - (x2);
    var b = (y1) - (y2);
    return (Math.sqrt((a * a) + (b * b)));
}

// Return the direction from one point to another
function point_direction(x1, y1, x2, y2)
{
    var xdiff = (x2) - x1;
    var ydiff = (y2) - y1;

    return (-(Math.atan2(ydiff, xdiff) * 180.0 / Math.PI));
}

// Returns the length and direction on the x axis
function lengthdir_x(length, direction)
{
    return (length * cos(direction * degtorad2()));
}

// Returns the length and direction on the y axis
function lengthdir_y(length, direction)
{
    return (length * sin(direction * degtorad2()));
}

// Lerp a value towards another value
function lerp(from, to, amount)
{
    return (from + amount * (to - from)); 
}

// Get the max value from the array
function max(...values)
{
    return (Math.max(values));
}

// Get the min value from the array
function min(...values)
{
    return (Math.min(values));
}

// Returns a random floating point from 1 to max value
function random(max)
{
    return ((Math.random() * max) + 1);
}

// Returns a random floating point from min to max value
function random_range(min, max)
{
    return (Math.random() * (max - min) + min);
}

// Returns a random integer from 1 to max value
function irandom(max)
{
    return (floor((Math.random() * max) + 1));
}

// Returns a random integer from min to max value
function irandom_range(min, max)
{
    return (floor(Math.random() * (max - min) + min));
}

// Returns either true or false
function random_bool()
{
    return (Math.random() >= 0.5);
}

// Replace every occurance of a string inside another string
function string_replace_all(str, find, replace) 
{
    return (str.replace(new RegExp(escapeRegExp(find), 'g'), replace));
}

// Returns a value to a string
function to_string(val)
{
    return (val.toString());
}

// Converts a string to an integer
function to_int(val)
{
    return (parseInt(val));
}

// Returns a value pulsing at the rate of delay to a maximum number
/*
	var red = pulse(10, 255);
*/
function pulse(delay, max)
{
    var val = sin(time_current / delay) * max;
	return (val);
}

// Returns a value pulsing at the rate of delay from 0 to a maximum number
function pulse_positive(delay, max)
{
	var val = sin(time_current / delay) * max;
	return (keep_positive(val));
}

// Returns a value pulsing at the rate of delay from 0 to a maximum number
function pulse_negative(delay, max)
{
	var val = sin(time_current / delay) * max;
	return (keep_negative(val));
}

// Clamp a value to a max and min value
function clamp(value, min, max)
{
    if(value > max) { value = max; }
    if(value < min) { value = min; }

    return (value);
}

// Return a number that is always positive
function keep_positive(x)
{
    if(x < 0)
    {
        x *= -1;
    }

    return (x);
}

// Return a number that is always negative
function keep_negative(x)
{
    if(x > 0)
    {
        x *= -1;
    }

    return (x);
}

// Create a new vector2
function vec2(x, y)
{
    this.x = x;
    this.y = y;
}

// Create a new vector2
function vec3(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
}

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
function doPolygonsIntersect (a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                console.log("polygons don't intersect!");
                return false;
            }
        }
    }
    return true;
};

// Execute javascript code from a string
function execute_string(string)
{
    eval(string);
}

// Returns the width of the screen
function screen_get_width()
{
    return (screen.width);
}

// Returns the height of the screen
function screen_get_height()
{
    return (screen.height);
}

// Returns whether or not a rectangle is inside the view bounds
function within_view(x1, y1, x2, y2)
{
    var xx, yy, w, h; // View bounds
    xx = view_xview;
    yy = view_yview;
    w = view_xview + view_wview;
    h = view_yview + view_hview;
    return (
        x1 + (x2) >= xx && y1 + (y2) >= yy && x1 <= w && y1 <= h
    );
}

//#newfile Fake3D

// F3D FUNCTIONS FOR FAKE 3D (Based off w3d by TheSnidr on Game Maker Forums)

// Calculate the natural depth of the instance
// depth = f3d_depth(x, y, 0);
function f3d_depth(x, y, aditional_depth)
{
    return ((point_distance(view_xview + (view_wview / 2), view_yview + (view_hview / 2), x, y) / 10) + aditional_depth);
}

// To make a better feel of 3d, this function should be used
function f3d_calculate_z(z)
{
    if(z <= 0)
    {
        return ((-10 * z) / (0.02 * z - 10));
    }
    return (power(0.8 * z, (0.0008 * z + 1)));
}

function f3d_get_hor(x)
{
    return ((view_xview + view_wview / 2 - x) / 500);
}

function f3d_get_ver(y)
{
    return ((view_yview + view_hview / 2 - y) / 500);
}

function f3d_get_x(x, z)
{
    return (x - f3d_calculate_z(z) * f3d_get_hor(x));
}

function f3d_get_y(y, z)
{
    return (y - f3d_calculate_z(z) * f3d_get_ver(y));
}

// Draw a fake 3d line
function f3d_draw_line(x1, y1, z1, x2, y2, z2)
{
    var z11,z22;
    z11=f3d_calculate_z(z1)
    z22=f3d_calculate_z(z2)
    draw_line(
        x1-(z11 * f3d_get_hor(x1)), 
        y1-(z11 * f3d_get_ver(y1)), 
        x2-(z22 * f3d_get_hor(x2)), 
        y2-(z22 * f3d_get_ver(y2))
    );
}

// Draw a text in fake 3d space
function f3d_draw_text(x, y, z, text)
{
    var tempZ = f3d_calculate_z(z);
    var hor = f3d_get_hor(x);
    var ver = f3d_get_ver(y);

    draw_text(x - (tempZ * hor), y - (tempZ * ver), text);
}

// Draw a circle in fake 3d
function f3d_draw_circle(x, y, z, r, outline)
{
    var tempZ = f3d_calculate_z(z);
    var hor = f3d_get_hor(x);
    var ver = f3d_get_ver(y);

    draw_circle(x - (tempZ * hor), y - (tempZ * ver), r, outline);
}

// Draw a vertext point in 3D
function f3d_draw_vertex(x, y, z)
{
    var zz = f3d_calculate_z(z);

    draw_vertex(x - (zz * f3d_get_hor(x)), y - (zz * f3d_get_ver(y)));
}

// Draw a cylinder in fake 3d 
function f3d_draw_cylinder(x, y, z, r, height, outline)
{
    var xx, yy;

    draw_primitive_begin();
        for(var i = -360 / 10; i < 360; i += 360 / 10)
        {
            xx = x + lengthdir_x(r, i);
            yy = y + lengthdir_y(r, i);

            f3d_draw_vertex(xx, yy, z);
            f3d_draw_vertex(xx, yy, z + height);
        }
    draw_primitive_end(!outline);
}

// Draw a floor or fake 3d rectangle
function f3d_draw_floor(x1, y1, x2, y2, z, outline)
{
    draw_primitive_begin();
        f3d_draw_vertex(x1, y1, z);
        f3d_draw_vertex(x1, y2, z);
        f3d_draw_vertex(x2, y2, z);
        f3d_draw_vertex(x2, y1, z);
    draw_primitive_end(!outline);

    if(outline)
    {
        //f3d_draw_line(x1, y2, z, x2, y1, z);
        f3d_draw_line(x1, y1, z, x2, y2, z);
    }
}

// Draw a fake 3d wall
function f3d_draw_wall(x1, y1, x2, y2, z, height, outline)
{
    draw_primitive_begin();
        f3d_draw_vertex(x1, y1, z);
        f3d_draw_vertex(x1, y1, z + height);
        f3d_draw_vertex(x2, y2, z + height);
        f3d_draw_vertex(x2, y2, z);
    draw_primitive_end(!outline);

    if(outline)
    {
        //f3d_draw_line(x1, y2, z, x2, y1, z + height);
        f3d_draw_line(x2, y1, z, x1, y2, z + height);
    }
}

// Draw a fake 3d cube
function f3d_draw_cube(x1, y1, x2, y2, z, height, outline)
{
    //f3d_draw_floor(x1, y1, x2, y2, z, outline); // The floor (not needed)
    var n, e, s, w, vx, vy; // corners
    n = y1; // up
    e = x2; // right
    s = y2; // down
    w = x1; // left

    vx = view_xview + (view_wview / 2); // Center along the x view
    vy = view_yview + (view_hview / 2); // Center along the y view

    if(n >= vy)
    {
        f3d_draw_wall(x1, y1, x2, y1, z, height, outline); // Top wall
    }
    if(e <= vx)
    {
        f3d_draw_wall(x2, y1, x2, y2, z, height, outline); // Right wall
    }
    if(s <= vy)
    {
        f3d_draw_wall(x2, y2, x1, y2, z, height, outline); // Bottom wall
    }
    if(w >= vx)
    {
        f3d_draw_wall(x1, y2, x1, y1, z, height, outline); // Left wall
    }
    f3d_draw_floor(x1, y1, x2, y2, z + height, outline); // The roof
}

// Draw a fake 3d cube with basic looking lighting
function f3d_draw_test_cube(x1, y1, x2, y2, z, height, outline)
{
    var n, e, s, w, vx, vy; // corners
    n = y1; // up
    e = x2; // right
    s = y2; // down
    w = x1; // left

    vx = view_xview + (view_wview / 2); // Center along the x view
    vy = view_yview + (view_hview / 2); // Center along the y view

    if(n >= vy)
    {
        draw_set_color(rgb(128, 128, 128));
        f3d_draw_wall(x1, y1, x2, y1, z, height, outline); // Top wall
    }
    if(e <= vx)
    {
        draw_set_color(rgb(64, 64, 64));
        f3d_draw_wall(x2, y1, x2, y2, z, height, outline); // Right wall
    }
    if(s <= vy)
    {
        draw_set_color(rgb(156, 156, 156));
        f3d_draw_wall(x2, y2, x1, y2, z, height, outline); // Bottom wall
    }
    if(w >= vx)
    {
        draw_set_color(rgb(200, 200, 200));
        f3d_draw_wall(x1, y2, x1, y1, z, height, outline); // Left wall
    }
    draw_set_color(c_white);
    f3d_draw_floor(x1, y1, x2, y2, z + height, outline);
}

//#newfile 3D

//#newfile PlayerInput

var mouse_down = [], mouse_pressed = [], mouse_released = [],
key_down = [], key_pressed = [], key_released = [], 
touch_x = [], touch_y = [], touch_count = 0;
mb_left = 0;
mb_right = 2;
mb_middle = 1;

// Input events
document.body.addEventListener('keydown', function(e) 
{
    if (!key_down[e.keyCode]) {
		key_pressed[e.keyCode] = true;
	}
    key_down[e.keyCode] = true;

    if(prevent_default_handler)
    {
        e.preventDefault();
    }
});

document.body.addEventListener('keyup', function(e) 
{
    if (key_down[e.keyCode]) {
		key_released[e.keyCode] = true;
	}
    key_down[e.keyCode] = false;

    if(prevent_default_handler)
    {
        e.preventDefault();
    }
});

document.body.addEventListener('mousemove', function(e)
{
    var el = document.getElementById('canvasdiv');
    if(el != null)
    {
        mx = e.x - el.offsetLeft - game.canvas.offsetLeft;// - document.scrollLeft;
        my = e.y - el.offsetTop - game.canvas.offsetTop;// - document.scrollTop;
    }
    else
    {
        mx = e.x - game.canvas.offsetLeft;// - document.scrollLeft;
        my = e.y - game.canvas.offsetTop;
    }
});

document.body.addEventListener('mousedown', function(e) 
{
    if (!mouse_down[e.button]) {
		mouse_pressed[e.button] = true;
	}
    mouse_down[e.button] = true;

    if(prevent_default_handler)
    {
        e.preventDefault();
    }
});

document.body.addEventListener('mouseup', function(e) 
{  
    if (mouse_down[e.button]) {
		mouse_released[e.button] = true;
	}
    mouse_down[e.button] = false;

    if(prevent_default_handler)
    {
        e.preventDefault();
    }
});

// PLAYER INPUT
function keyboard_check(key)
{
    var v = key_down[key];
    
    return (v);
}

// PLAYER INPUT
function keyboard_check_pressed(key)
{
    var v = key_pressed[key];
    
    return (v);
}

// PLAYER INPUT
function keyboard_check_released(key)
{
    var v = key_released[key];
    
    return (v);
}

function mouse_check_button(button)
{
    return (mouse_down[button]);
}

function mouse_check_button_pressed(button)
{
    return (mouse_pressed[button]);
}

function mouse_check_button_released(button)
{
    return (mouse_released[button]);
}

// KEYBOARD KEYS
var vk_0 = 48, vk_1 = 49, vk_2 = 50, vk_3 = 51, vk_4 = 52, vk_5 = 53, vk_6 = 54,
	vk_7 = 55, vk_8 = 56, vk_9 = 57, vk_a = 65, vk_add = 107, vk_alt = 18, vk_b = 66,
	vk_backspace = 8, vk_c = 67, vk_ctrl = 17, vk_d = 68, vk_decimal = 110, vk_delete = 46,
	vk_divide = 111, vk_down = 40, vk_e = 69, vk_end = 35, vk_enter = 13, vk_escape = 27,
	vk_f1 = 112, vk_f2 = 113, vk_f3 = 114, vk_f4 = 115, vk_f5 = 116, vk_f6 = 117,
	vk_f7 = 118, vk_f8 = 119, vk_f9 = 120, vk_f10 = 121, vk_f11 = 122, vk_f12 = 123,
	vk_g = 71, vk_h = 72, vk_home = 36, vk_f = 70, vk_i = 73, vk_insert = 45, vk_j = 74, vk_k = 75,
	vk_l = 76, vk_left = 37, vk_m = 77, vk_multiply = 106, vk_n = 78, vk_num0 = 96, vk_num1 = 97,
	vk_num2 = 98, vk_num3 = 99, vk_num4 = 100, vk_num5 = 101, vk_num6 = 102, vk_num7 = 103,
	vk_num8 = 104, vk_num9 = 105, vk_o = 79, vk_p = 80, vk_pagedown = 34, vk_pageup = 33,
	vk_pause = 19, vk_q = 81, vk_r = 82, vk_right = 39, vk_s = 83, vk_shift = 16, vk_space = 32,
	vk_subtract = 109, vk_t = 84, vk_tab = 9, vk_u = 85, vk_up = 38, vk_v = 86, vk_w = 87,
	vk_x = 88, vk_y = 89, vk_z = 90;