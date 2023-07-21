let engine = Matter.Engine.create()

let rederer = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        height: 925,
        width: 2000,
        wireframes: false
    }
})

let ground = Matter.Bodies.rectangle(600, 400, 250, 30, {
    isStatic: true,
    render: {
        fillStyle: 'brown'
    }
})


let box = Matter.Bodies.rectangle(600, 200, 50, 50)

let composite = Matter.Composites.pyramid(500, 200, 10, 6, 0, 0, function(x, y){
    return Matter.Bodies.rectangle(x, y, 20, 20, {
        render: {
            sprite: {
                texture: './assets/bird2.svg'
            }
        }
    })
})

let ball_pos = {
    x: 200,
    y: 350
}

let ball = Matter.Bodies.circle(ball_pos.x, ball_pos.y, 20, {
    render: {
        sprite: {
            texture: './assets/bird1.svg'
        }
    }
})
let sling = Matter.Constraint.create({
    pointA: {
        x: ball_pos.x,
        y: ball_pos.y
    },
    bodyB: ball,
    stiffness: 0.05
})

let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(rederer.canvas)
})
rederer.mouse = mouseConstraint

Matter.World.add(engine.world, [ground, composite, ball, sling, mouseConstraint])

let isFired = false

Matter.Events.on(mouseConstraint, 'enddrag', function(event){
    if(event.body === ball){
        isFired = true
    }
})

Matter.Events.on(engine, 'afterUpdate', function(event){
    let dist_x = Math.abs(ball.position.x - ball_pos.x)
    let dist_y = Math.abs(ball.position.y - ball_pos.y)
    if(isFired && dist_x < 20 && dist_y < 20){
       ball = Matter.Bodies.circle(ball_pos.x, ball_pos.y, 20, {
        render: {
            sprite: {
                texture: './assets/bird1.svg'
            }
        }
       })
       sling.bodyB = ball
       Matter.World.add(engine.world, ball)
       isFired = false
    }
})


Matter.Render.run(rederer)
Matter.Runner.run(engine)