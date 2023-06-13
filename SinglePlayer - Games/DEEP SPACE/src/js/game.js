window.onload = function() {

    // Is the game the current page?
    var gameActive = false;

    // Get canvas parent elements.
    var container = document.getElementById('planet-canvas-container');
    // Get canvas elements.
    var canvas = document.getElementById('planet-canvas');
    // Get context.
    var ctx = canvas.getContext('2d');
    // Set canvas width/height based on the size of it's parent container.
    ctx.canvas.width = Math.min(container.clientWidth, container.clientHeight);
    ctx.canvas.height = Math.min(container.clientWidth, container.clientHeight);


    // All view buttons.
    var viewToggles = document.querySelectorAll('.view-toggles p span');
    // The item buttons container.
    var itemsMenu = document.getElementById('items-menu');
    // All item buttons.
    var itemToggles = document.querySelectorAll('.item-toggles p');
    // All views.
    var views = document.querySelectorAll('.views .view');
    // All items.
    var items = document.querySelectorAll('.items .item');
    // All back buttons inside items.
    var backButtons = document.querySelectorAll('.ship-view-back');


    // Constants in the game.
    var env = {
        now: 0,
        last: timestamp(),
        dt: 0,
        fps: 60,
        // Current view, planet or map.
        view: 'planet',
        // Centre of canvas.
        centre: {
            x: canvas.width / 2,
            y: canvas.height / 2
        }
    };

    // Visual data.
    var ship = {
        x: Math.min(canvas.width-(canvas.width/6), canvas.height-(canvas.height/6)),
        y: Math.min(canvas.width-(canvas.width/6), canvas.height-(canvas.height/6)),
        // 2/6ths of the canvas width.
        radius: Math.min(canvas.width/3, canvas.height/3),
        angle: 1,
        colour: '#FFFFFF'
    };

    var planet = {
        // 1/6th of the canvas width, but a maximum of 100.
        radius: Math.min(100, canvas.width/6, canvas.height/6),
        colour: '#902EFF',
        glow: {
            radius: Math.min(110, (canvas.width/6)+10, (canvas.height/6)+10),
            from: Math.min(90, (canvas.width/6)-10, (canvas.height/6)-10),
            to: Math.min(104, (canvas.width/6)+4, (canvas.height/6)+4),
            start: 'rgba(144, 46, 255, 0.25)',
            finish: 'rgba(144, 46, 255, 0.25)'
        },
    };

    // Game data - points, purchases, etc.
    var data = loadGameData();


    // Set up stuff for the game before the loop starts.
    gameInitialisation();

    // Game loop.
    setInterval(function() {
        if(gameActive) {
            // Get the timestamp.
            env.now = timestamp();
            // Time passed in seconds.
            env.dt = env.now - env.last;

            updateGameData(env.dt);
            updateVisualData();
            renderVisuals();

            env.last = env.now;
        }

    }, 1000/env.fps);


    /*
     |
     | Game data functions.
     |
     |
     */

     function loadGameData() {
         return {
             // Total points.
             points: 30,
             // Total points per second.
             pps: 2,
             // Current system the player is in.
             system: 0,
             // Current planet the player is orbiting.
             planet: 0,
             items: {
                 solarpanel: {
                     pps: 2,
                     prices: {
                         unlock: 1,
                         repair: 20
                     },
                     count: 1,
                     unlocked: true,
                     visible: true
                 },
                 nanobots: {
                     pps: 10, //3,
                     prices: {
                         unlock: 1000,
                         repair: 150 // 55
                     },
                     count: 0,
                     unlocked: false,
                     visible: true
                 },
                 satellite: {
                     pps: 50,
                     prices: {
                         unlock: 40000, //10000,
                         repair: 2000 // 500
                     },
                     count: 0,
                     unlocked: false,
                     visible: false,
                     instances: []
                 },
                 rover: {
                     pps: 200,
                     prices: {
                         unlock: 150000,
                         repair: 7500
                     },
                     count: 0,
                     unlocked: false,
                     visible: false,
                     instances: []
                 },
                 fusioncell: {
                     pps: 1000,
                     prices: {
                         unlock: 750000,
                         repair: 35000
                     },
                     count: 0,
                     unlocked: false,
                     visible: false
                 },
                 radiatorpanel: {
                     pps: 10000,
                     prices: {
                         unlock: 3000000,
                         repair: 250000
                     },
                     count: 0,
                     unlocked: false,
                     visible: false
                 }
             },
             upgrades: {
                 solararray: {
                     price: 20000, // 5000,
                     available: false, // Requires nanobots.
                     unlocked: false,
                     visible: false
                 },
                 satbuild: {
                     price: 1000000,
                     available: false, // Requires fusion cell.
                     unlocked: false,
                     visible: false
                 },
                 commsnet: {
                     price: 50000000,
                     available: true,
                     unlocked: false,
                     visible: true
                 },
                 contactearth: {
                     price: 100000000,
                     available: false, // Requires commsnet, and radiatorpanel.
                     unlocked: false,
                     visible: false
                 }
             }
         };
     }

    function gameInitialisation() {
        // Initialise the game - render items etc.

        // Render ship components.
        renderItems();
        // Render ship updates.
        renderUpgrades();
    }


    /*
     |
     | Game logic update functions.
     |
     |
     */

    function updateGameData(dt) {
        // Add points to the total, based on the amount of time passed since the last loop.
        data.points += (data.pps * dt/1000);
    }

    function recalculatePps() {
        // Temporary PPS variable.
        var pps = 0;

        for (var key in data.items) {
            // Skip this iteration if the property is from prototype.
            if (!data.items.hasOwnProperty(key)) {
                continue;
            }

            // Add each items pps value to the total.
            pps += (data.items[key].pps * data.items[key].count);
        }

        // Update the PPS variable.
        data.pps = pps;
    }

    function unlockItem(item) {
        // If the item hasn't already been unlocked.
        if(!data.items[item].unlocked) {
            // If the user can afford the unlock.
            if(data.points >= data.items[item].prices.unlock) {
                // Charge user for the unlock.
                data.points -= data.items[item].prices.unlock;
                // Remember the item has been unlocked.
                data.items[item].unlocked = true;

                // Add one level to the item since it's been unlocked.
                data.points += data.items[item].prices.repair;
                repairItem(item);


                if(item == 'nanobots') {
                    // Set solararray to visible and draw it.
                    data.upgrades.solararray.available = true;
                    data.upgrades.solararray.visible = true;
                    itemRedraw('solararray', 1);

                    // Set next item to visible and draw it.
                    data.items.satellite.visible = true;
                    itemRedraw('satellite', 0);
                }
                if(item == 'satellite') {
                    // Set next item to visible and draw it.
                    data.items.rover.visible = true;
                    itemRedraw('rover', 0);
                }
                if(item == 'rover') {
                    // Set next item to visible and draw it.
                    data.items.fusioncell.visible = true;
                    itemRedraw('fusioncell', 0);
                }
                if(item == 'fusioncell') {
                    // Set satbuild to visible and draw it.
                    data.upgrades.satbuild.available = true;
                    data.upgrades.satbuild.visible = true;
                    itemRedraw('satbuild', 1);

                    // Set next item to visible and draw it.
                    data.items.radiatorpanel.visible = true;
                    itemRedraw('radiatorpanel', 0);
                }
                if(item == 'radiatorpanel' && data.upgrades.commsnet.unlocked) {
                    // Set contactearth to visible and draw it.
                    data.upgrades.contactearth.available = true;
                    data.upgrades.contactearth.visible = true;
                    itemRedraw('contactearth', 1);
                }


                // Update relevant items display to use latest information.
                itemRedraw(item, 0);
            }
        }
    }

    function repairItem(item) {
        // If the item has been unlocked.
        if(data.items[item].unlocked) {
            // If the user can afford the repair.
            if(data.points >= data.items[item].prices.repair) {
                // Charge user for the repair.
                data.points -= data.items[item].prices.repair;
                // Add the items points per second to the total points per second.
                data.pps += data.items[item].pps;
                // Remember we have an extra level.
                data.items[item].count += 1;
                // Increase the cost.
                data.items[item].prices.repair = Math.ceil(data.items[item].prices.repair * 1.125);

                if(item == 'satellite') {
                    // Create a new satellite instance.
                    data.items[item].instances.push({
                        x: ship.x,
                        y: ship.y,
                        // Random radius between planet radius and canvas edge.
                        desiredradius: randomIntFromInterval(Math.min(100, canvas.width/6, canvas.height/6) + 20, Math.min(canvas.width/2, canvas.height/2) - 3),
                        // The satellites current radius. This will be increased/decreased until it equals desiredradius.
                        radius: ship.radius,
                        angle: ship.angle,
                        colour: '#FFFFFF'
                    });
                }

                if(item == 'rover') {
                    // Create a new rover instance.
                    data.items[item].instances.push({
                        x: ship.x,
                        y: ship.y,
                        // Rover should sit on edge of planet.
                        desiredradius: planet.radius - 2,
                        // The rovers current radius. This will be decreased until it equals radius (above).
                        radius: ship.radius,
                        angle: ship.angle,
                        colour: '#FFFFFF'
                    });
                }

                // Update relevant items display to use latest information.
                itemRedraw(item, 0);
            }
        }
    }

    function unlockUpgrade(upgrade) {
        // If the upgrade is available and not unlocked.
        if(data.upgrades[upgrade].available && !data.upgrades[upgrade].unlocked) {
            // If the user can afford the unlock.
            if(data.points >= data.upgrades[upgrade].price) {
                // Charge user for the unlock.
                data.points -= data.upgrades[upgrade].price;
                // Remember that the user has unlocked the upgrade.
                data.upgrades[upgrade].unlocked = true;
                // Don't display the upgrade again now it's unlocked.
                data.upgrades[upgrade].visible = false;

                if(upgrade == 'solararray') {
                    // Increase solar panel PPS to 3.
                    data.items.solarpanel.pps = 3;
                    // Recalculate the overal PPS, it will have changed.
                    recalculatePps();
                    // Redraw the solar panel to update its PPS.
                    itemRedraw('solarpanel', 0);
                }
                if(upgrade == 'satbuild') {
                    // Reduce satellite cost by 30% and draw it.
                    data.items.satellite.prices.repair -= Math.floor((data.items.satellite.prices.repair / 100) * 30);
                    itemRedraw('satellite', 0);
                }
                if(upgrade == 'commsnet' && data.items.radiatorpanel.unlocked) {
                    // Increase satellite and rover PPS by x4.
                    data.items.satellite.pps = 200;
                    data.items.rover.pps = 800;
                    // Recalculate the overal PPS, it will have changed.
                    recalculatePps();
                    // Redraw items to update their PPS.
                    itemRedraw('satellite', 0);
                    itemRedraw('rover', 0);

                    // Set contactearth to visible and draw it.
                    data.upgrades.contactearth.available = true;
                    data.upgrades.contactearth.visible = true;
                    itemRedraw('contactearth', 1);
                }


                // Update upgrade to use latest information.
                itemRedraw(upgrade, 1);

                // Click the ship view button for the user, shouldn't display upgrade any more.
                document.getElementById('ship-view-toggle').click();


                // Game ending upgrade, needs different things to happen.
                if(upgrade == 'contactearth') {
                    // Swap to ending page.
                    document.getElementById('mainmenu').classList.remove('active');
                    document.getElementById('intro').classList.remove('active');
                    document.getElementById('game').classList.remove('active');
                    document.getElementById('ending').classList.add('active');

                    // Game is not active.
                    gameActive = false;

                    // Reload and redraw game data, ready for next playthrough.
                    data = loadGameData();
                    gameInitialisation();
                    document.getElementById('planet-view-toggle').click();
                }
            }
        }
    }


    /*
     |
     | Game logic render functions.
     |
     |
     */

    function renderPoints() {
        // Format points to include commas.
        document.getElementById('points').innerHTML = formatNumber(data.points);
        document.getElementById('pps').innerHTML = data.pps + '/s';
    }

    function renderItems() {
        for (var key in data.items) {
            // Skip this iteration if the property is from prototype.
            if (!data.items.hasOwnProperty(key)) {
                continue;
            }

            // Redraw the item if necessary.
            itemRedraw(key, 0);
        }
    }

    function renderUpgrades() {
        for (var key in data.upgrades) {
            // Skip this iteration if the property is from prototype.
            if (!data.upgrades.hasOwnProperty(key)) {
                continue;
            }

            // Redraw the upgrade if necessary.
            itemRedraw(key, 1);
        }
    }

    function itemRedraw(item, isUpgrade) {
        var visible = (isUpgrade ? data.upgrades[item].visible : data.items[item].visible);

        if(visible) {
            // Show the item toggle button.
            document.getElementById(item + '-toggle').classList.remove('hidden');

            // Render the correct item.
            if(isUpgrade) {
                renderUpgrade(item);
            } else {
                renderItem(item);
            }
        } else {
            // Hide the item toggle button.
            document.getElementById(item + '-toggle').classList.add('hidden');
        }
    }

    function renderItem(item) {
        // Update the number of repairs and the PPS for this item.
        document.getElementById(item + '-count').innerHTML = formatNumber(data.items[item].count);
        document.getElementById(item + '-pps').innerHTML = formatNumber((data.items[item].count * data.items[item].pps)) + '/s';

        // Show the correct item section.
        if(data.items[item].unlocked) {
            // Hide the item unlock option.
            document.getElementById(item + '-unlock').classList.add('hidden');
            // Show the item repair option.
            document.getElementById(item + '-repair').classList.remove('hidden');

            // Make sure the correct repair price displays.
            document.getElementById(item + '-repair-price').innerHTML = formatNumber(data.items[item].prices.repair);
        } else {
            // Show the item unlock option.
            document.getElementById(item + '-unlock').classList.remove('hidden');
            // Hide the item repair option.
            document.getElementById(item + '-repair').classList.add('hidden');

            // Make sure the correct unlock price displays.
            document.getElementById(item + '-unlock-price').innerHTML = formatNumber(data.items[item].prices.unlock);
        }
    }

    function renderUpgrade(upgrade) {
        // Make sure the correct unlock price displays.
        document.getElementById(upgrade + '-unlock-price').innerHTML = formatNumber(data.upgrades[upgrade].price);
    }


    /*
     |
     | Game visuals update functions.
     |
     |
     */

    function updateVisualData() {
        // Update the ships position.
        var shipPos = objectRotation(ship, env.centre);
        ship.x = shipPos.x;
        ship.y = shipPos.y;
        ship.angle = shipPos.angle;

        // Satellite positions and radius changes.
        for(var i=0; i<Object.keys(data.items.satellite.instances).length; i++) {

            // If current and desired radiuses do not match, take a step towards making them match.
            if(data.items.satellite.instances[i].radius !== data.items.satellite.instances[i].desiredradius) {
                // Does radius need to increase or decrease?
                if(data.items.satellite.instances[i].radius < data.items.satellite.instances[i].desiredradius) {
                    // Radius needs to increase.

                    // Increase radius over the period of up to three seconds.
                    data.items.satellite.instances[i].radius += ((canvas.width / 3) / 5000);

                    // Set desired radius as the ceiling; increases cannot go past it.
                    if(data.items.satellite.instances[i].radius >= data.items.satellite.instances[i].desiredradius) {
                        data.items.satellite.instances[i].radius = data.items.satellite.instances[i].desiredradius;
                    }
                } else {
                    // Radius needs to decrease.

                    // Decrease radius over the period of up to three seconds.
                    data.items.satellite.instances[i].radius -= ((canvas.width / 3) / 5000);

                    // Set desired radius as the floor; decreases cannot go past it.
                    if(data.items.satellite.instances[i].radius <= data.items.satellite.instances[i].desiredradius) {
                        data.items.satellite.instances[i].radius = data.items.satellite.instances[i].desiredradius;
                    }
                }

            }

            // Update satellite positions.
            var satPos = objectRotation(data.items.satellite.instances[i], env.centre);
            data.items.satellite.instances[i].x = satPos.x;
            data.items.satellite.instances[i].y = satPos.y;
            data.items.satellite.instances[i].angle = satPos.angle;
        }

        // Rover radius changes (position will never change when landed).
        for(var i=0; i<Object.keys(data.items.rover.instances).length; i++) {

            // If current and desired radiuses do not match, take a step towards making them match.
            if(data.items.rover.instances[i].radius !== data.items.rover.instances[i].desiredradius) {
                // Radius always needs to decrease.

                // Decrease radius over the period of up to three seconds.
                data.items.rover.instances[i].radius -= ((canvas.width / 3) / 2500);

                // Set desired radius as the floor; decreases cannot go past it.
                if(data.items.rover.instances[i].radius <= data.items.rover.instances[i].desiredradius) {
                    data.items.rover.instances[i].radius = data.items.rover.instances[i].desiredradius;
                }

                // Update rover positions only if it's deorbiting.
                var roverPos = objectRotation(data.items.rover.instances[i], env.centre);
                data.items.rover.instances[i].x = roverPos.x;
                data.items.rover.instances[i].y = roverPos.y;
                data.items.rover.instances[i].angle = roverPos.angle;
            }

        }
    }


    /*
     |
     | Game visuals render functions.
     |
     |
     */

    function renderVisuals() {
        // Always clear the canvas before redrawing.
    	ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the planet.
        renderPlanet(planet);

        // Draw all satellites.
        for(var i=0; i<Object.keys(data.items.satellite.instances).length; i++) {
            renderSatellite(data.items.satellite.instances[i], 0, 0);
        }

        // Draw all rovers.
        for(var i=0; i<Object.keys(data.items.rover.instances).length; i++) {
            renderSatellite(data.items.rover.instances[i], 0, 1);
        }

        // Draw the ship after satellites/rovers so it isn't hidden.
        renderSatellite(ship, 1, 0);

        // Update the on-screen points with the latest amount.
        renderPoints();
    }

    function renderSatellite(object, ship, rover) {
        if(rover && (object.radius < object.desiredradius + 10)) {
            // Don't draw trail inside planet glow.
        } else {
            // Satellite trail.
            ctx.beginPath();
            // Draw counter clockwise arc from ships position. Length based on ship radius.
            ctx.arc(env.centre.x, env.centre.y, object.radius + 1, object.angle, object.angle + 2, true);
            // Create radial gradient from ships position outwards. Gives faded trail effect based on ship radius.
            var gradient = ctx.createRadialGradient(object.x, object.y, 0, object.x, object.y, object.radius);
            gradient.addColorStop('0', '#2f3e4b');
            gradient.addColorStop('0.9', '#27343f');
            gradient.addColorStop('1', 'rgba(32, 42, 51, 0)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Save canvas state.
        ctx.save();

        // Move origin point to ship position.
        ctx.translate(object.x, object.y);
        // Rotate ship to 'look forward' as it moves.
        ctx.rotate(Math.atan2(object.y - env.centre.y, object.x - env.centre.x));

        if(ship) {
            // Fill colour and draw the solar arrays.
            if(data.upgrades.solararray.unlocked) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillRect(-4, 4, 10, 1);
            }

            // Fill colour and draw ship.
            ctx.fillStyle = object.colour;
            ctx.fillRect(0, 0, 2, 8);
            ctx.fillRect(-1, 0, 4, 3);
        } else {
            // Fill colour and draw satellite.
            ctx.fillStyle = object.colour;
            ctx.fillRect(0, 0, 2, 2);
        }

        // Restore default canvas state.
        ctx.restore();
    }

    function renderPlanet(planet) {
        // Save canvas state.
        ctx.save();
        ctx.beginPath();
        ctx.arc(env.centre.x, env.centre.y, planet.glow.radius, 0, 2*Math.PI);
        var gradient = ctx.createRadialGradient(env.centre.x, env.centre.y, planet.glow.from, env.centre.x, env.centre.y, planet.glow.to);
        gradient.addColorStop('0', planet.glow.start);
        gradient.addColorStop('1', planet.glow.finish);
        ctx.fillStyle = gradient;
        ctx.fill();
        // Restore default canvas state.
        ctx.restore();

        // Planet.
        ctx.beginPath();
        ctx.arc(env.centre.x, env.centre.y, planet.radius, 0, 2*Math.PI);
        ctx.fillStyle = planet.colour;
        ctx.fill();
    }


    /*
     |
     | Misc functions.
     |
     |
     */

     /**
      * Return updated x/y/angle values for rotating an object around a given point.
      *
      * @param Object object
      * @param Object centre
      *
      * @return Object
      */
    function objectRotation(object, centre) {
        // Rotation speed, wrapping after angle hits 360.
        angle = (object.angle + (1 / (object.radius * 3))) % 360; // * (Math.PI / 180);

        return {
            x: centre.x + Math.cos(angle) * object.radius,
            y: centre.y + Math.sin(angle) * object.radius,
            angle: angle
        }
    }

    /**
     * Return a timestamp to calculate time since last loop.
     *
     * @return mixed
     */
    function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    /**
     * Return a random integer from the given interval.
     *
     * @param int min
     * @param int max
     *
     * @return int
     */
    function randomIntFromInterval(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function formatNumber(number) {
        return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }


    /*
     |
     | Event listeners.
     |
     |
     */

     document.getElementById('mmtointro').addEventListener('click', function(e) {
         e.preventDefault();

         document.getElementById('mainmenu').classList.remove('active');
         document.getElementById('intro').classList.add('active');
         document.getElementById('game').classList.remove('active');
         document.getElementById('ending').classList.remove('active');

         // Game is not active.
         gameActive = false;
     });
     document.getElementById('introtogame').addEventListener('click', function(e) {
         e.preventDefault();

         document.getElementById('mainmenu').classList.remove('active');
         document.getElementById('intro').classList.remove('active');
         document.getElementById('game').classList.add('active');
         document.getElementById('ending').classList.remove('active');

         // Reset timestamp so income starts from now.
         env.last = timestamp();
         // Game is now active.
         gameActive = true;
     });
     document.getElementById('endingtointro').addEventListener('click', function(e) {
         e.preventDefault();

         document.getElementById('mainmenu').classList.remove('active');
         document.getElementById('intro').classList.add('active');
         document.getElementById('game').classList.remove('active');
         document.getElementById('ending').classList.remove('active');

         // Game is not active.
         gameActive = false;
     });

    // View toggle button event listeners.
    for(var i=0; i<viewToggles.length; i++) {
        viewToggles[i].addEventListener('click', function(e) {
            // Remove the active class from all view buttons.
            for(var j=0; j<viewToggles.length; j++) {
                viewToggles[j].classList.remove('active');
            }
            // Remove the active class from all views.
            for(var j=0; j<views.length; j++) {
                views[j].classList.remove('active');
            }

            // When changing views, reset the contents of other views.
            // Remove the active class from all items.
            for(var j=0; j<items.length; j++) {
                items[j].classList.remove('active');
            }
            // Show the item buttons again.
            itemsMenu.classList.remove('hidden');

            // Get the ID of the clicked button.
            var toggle_id = this.id;
            // Get the ID of the corresponding view.
            var view_id = this.id.split('-')[0] + '-' + this.id.split('-')[1];
            // Display/Style the correct button/view.
            document.getElementById(toggle_id).classList.add('active');
            document.getElementById(view_id).classList.add('active');
        });
    }

    // Item toggle button event listeners.
    for(var i=0; i<itemToggles.length; i++) {
        itemToggles[i].addEventListener('click', function(e) {
            // Get the clicked buttons corresponding item ID.
            var item = this.id.split('-')[0];
            // Add the active class to the item.
            document.getElementById(item).classList.add('active');

            // Hide the item buttons.
            itemsMenu.classList.add('hidden');
        });
    }

    // Back button event listeners.
    for(var i=0; i<backButtons.length; i++) {
        backButtons[i].addEventListener('click', function(e) {
            // Remove the active class from all items.
            for(var j=0; j<items.length; j++) {
                items[j].classList.remove('active');
            }
            // Show the item buttons.
            itemsMenu.classList.remove('hidden');
        });
    }


    document.getElementById('solarpanel-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockItem('solarpanel');
    });
    document.getElementById('solarpanel-repair-button').addEventListener('click', function(e) {
        e.preventDefault();
        repairItem('solarpanel');
    });

    document.getElementById('nanobots-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockItem('nanobots');
    });
    document.getElementById('nanobots-repair-button').addEventListener('click', function(e) {
        e.preventDefault();
        repairItem('nanobots');
    });

    document.getElementById('satellite-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockItem('satellite');
    });
    document.getElementById('satellite-repair-button').addEventListener('click', function(e) {
        e.preventDefault();
        repairItem('satellite');
    });

    document.getElementById('rover-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockItem('rover');
    });
    document.getElementById('rover-repair-button').addEventListener('click', function(e) {
        e.preventDefault();
        repairItem('rover');
    });

    document.getElementById('fusioncell-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockItem('fusioncell');
    });
    document.getElementById('fusioncell-repair-button').addEventListener('click', function(e) {
        e.preventDefault();
        repairItem('fusioncell');
    });

    document.getElementById('radiatorpanel-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockItem('radiatorpanel');
    });
    document.getElementById('radiatorpanel-repair-button').addEventListener('click', function(e) {
        e.preventDefault();
        repairItem('radiatorpanel');
    });

    document.getElementById('solararray-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockUpgrade('solararray');
    });
    document.getElementById('satbuild-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockUpgrade('satbuild');
    });
    document.getElementById('commsnet-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockUpgrade('commsnet');
    });
    document.getElementById('contactearth-unlock-button').addEventListener('click', function(e) {
        e.preventDefault();
        unlockUpgrade('contactearth');
    });

}
