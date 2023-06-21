// stadium.js

let kStadiumViews = {};
let kBrushes = {};

let kInfieldDirtArc = [];
let kMoundArc = [];
let kOutfieldGrass = [];
let kWalls = [
    72.42, 72.42,
    68.62, 82.32,
    39.92, 111.02,
    26.92, 118.92,
    11.72, 118.92,
    9.32, 121.72,
    -12.18, 121.72,
    -32.38, 116.32,
    -66.28, 82.48,
    -66.28, 72.48,
    -69.48, 69.48,
    -69.48, 62.52,
    -50.88, 43.92,
    -32.78, 11.32,
    -9.58, -10.68,
    -4.38, -13.88,
    -1.68, -14.58,
    3.02, -14.58,
    5.72, -13.88,
    10.92, -10.68,
    31.92, 8.82,
    52.02, 40.72,
    52.02, 47.02,
    72.62, 67.62,
    72.62, 72.22,
    72.32, 72.52,
];
let kFairWallCount = 22;

let kWMSCWalls = [
    102.42, 72.42,
    72.42, 72.42,
    72.42, 102.42,
    102.42, 102.42,
];

// let kLeftFieldUpperDeck = [
//     63.42, 18 * foot, 94.92,
//     37.42, 18 * foot, 120.92,
//     50.42, 33 * foot, 133.92,
//     76.42, 33 * foot, 107.92,
// ];

// let kLeftFieldLowerBleachers = [
//     72.42, 0, 79.92,
//     34.42, 0, 117.92,
//     40.42, 15 * foot, 123.92,
//     72.42, 15 * foot, 91.92,
// ];

let kBullpenRight = 16;
let kBullpenLeft = 41;
let kBullpenGrass = [
    -16, 104,
    -16, 136,
    kBullpenLeft, 136,
    kBullpenLeft, 104,
    -16, 104,
];
let kBullpenWalls = [
    41, 110,
    41, 136,
    0, 136,
];
let kBullpenPartition = [
    41, 126,
    0, 126,
]

let kBeachRight = -40;
let kBeachLeft = -16;
let kBeach = [
    kBeachRight, 100,
    kBeachRight, 136,
    kBeachLeft, 136,
    kBeachLeft, 100,
    kBeachRight, 100,
];
let kBeachWalls = [
    kBeachRight, 110,
    kBeachRight, 136,
    0, 136,
];

let kBattersEyeUpperHeight = 20;
let kBattersEyeUpper = [
    16, 136,
    16, 128,
    -16, 128,
    -16, 136,
];
let kBattersEyeLowerHeight = 16 * foot;
let kBattersEyeLower = [
    -16, 128,
    -16, 124,
    16, 124,
    16, 128,
];
let kHedges = [
    16, 128,
    21, 128,
    21, 126,
    16, 126,
]

let kBattingViewWalls = [
    72.42, 72.42,
    68.62, 82.32,
    39.92, 111.02,
    26.92, 118.92,
    11.72, 118.92,
    9.32, 121.72,
    -12.18, 121.72,
    -32.38, 116.32,
    -66.28, 82.42,
    -66.28, 72.62,

    -66.28, 0,
    72.42, 0,
];

let kInfieldDirt = [
    -29, 27,
    -4.5, 2.5,
    -4.5, -1,
    0, -4,
    4.5, -1,
    4.5, 2.5,
    29, 27,
    -29, 27,
];
let kInfieldGrass = [
    -3.6, 4.8,
    -16.6, 17.8,
    -13.6, 20.8,
    -13.6, 22.4,
    -14.4, 23.2,
    -3.2, 34.4,
    3.2, 34.4,
    14.4, 23.2,
    13.6, 22.4,
    13.6, 20.8,
    16.6, 17.8,
    3.6, 4.8,
];

let kViewTypes = {
    batting: 'b',
    homePlate: 'h',
    leftFieldLine: 'l',
    rightFieldLine: 'r',
};

class StadiumView
{
    constructor(viewType)
    {
        this.viewType = viewType;
        this.follow = true;
        this.chalkWidth = 1;

        this.dirtLayer = kWalls;
        if(viewType == kViewTypes.batting)
        {
            this.SetCameraLookAt(
                new Vec3(0, 2.0, -5.0),
                new Vec3(0, 1.0, 0),
                new Vec3(0, 1, 0));

            this.canvasWidth = screenWidth;
            this.canvasHeight = screenHeight;
            let aspectRatio = screenWidth / screenHeight;
            this.screenHalfWidthOverAspectRatio = screenHalfWidth / aspectRatio;
            this.viewPlaneHalfWidth = aspectRatio;
            this.viewPlaneHalfHeight = 1.0;
            this.chalkWidth = 10;

            this.homePlate = {x: this.canvasWidth / 2, y: screenHeight};

            this.dirtLayer = kBattingViewWalls;

            this.DrawBall = this.DrawBallBatting;
            this.WorldToScreen = function(p)
            {
                let pWorld = this.viewMatrix.TransformPoint(p);
                return this.PerspectiveProjection(pWorld);
            }
            this.SetTransform = function(ctx)
            {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }
        // else if(viewType == kViewTypes.homePlate)
        // {
        //     this.follow = true;
        //     this.ppm = 10;
        //     let leftFoulPole = 336 * footSqrt2 * this.ppm;
        //     let rightFoulPole = 322 * footSqrt2 * this.ppm;
        //     this.canvasWidth = Math.floor(leftFoulPole + rightFoulPole + 200);
        //     this.canvasHeight = Math.floor(leftFoulPole + rightFoulPole + 400) / 2;
        //     this.homePlate = {x: this.canvasWidth / 2, y: this.canvasHeight - 75};
        //     this.wallHeight = 10 * foot;

        //     this.WorldToScreen = function(vec)
        //     {
        //         return {
        //             x: this.homePlate.x - vec.x * this.ppm, 
        //             y: this.homePlate.y - vec.z * this.ppm / 2 - vec.y * this.ppm
        //         };
        //     }
        // }
        else if(viewType == kViewTypes.leftFieldLine)
        {
            this.ppm = 10;
            let leftFoulPole = 336 * footSqrt2 * this.ppm;
            let rightFoulPole = 322 * footSqrt2 * this.ppm;
            this.canvasWidth = 1780;
            this.canvasHeight = 1200;
            this.homePlate = {x: 240, y: this.canvasHeight - 100};
            this.wallHeight = 10 * foot;
            this.WorldToScreen = function(vec)
            {
                return {
                    x: this.homePlate.x + (-vec.x + vec.z) * this.ppm,
                    y: this.homePlate.y + (-vec.x / 2 - vec.z / 2) * this.ppm - vec.y * this.ppm,
                    z: 0,
                }
            }
        }
        else if(viewType == kViewTypes.rightFieldLine)
        {
            this.ppm = 10;
            let leftFoulPole = 336 * footSqrt2 * this.ppm;
            let rightFoulPole = 322 * footSqrt2 * this.ppm;
            this.canvasWidth = 1780;
            this.canvasHeight = 1200;
            this.homePlate = {x: 1540, y: this.canvasHeight - 100};
            this.wallHeight = 10 * foot;
            this.WorldToScreen = function(vec)
            {
                return {
                    x: this.homePlate.x + (-vec.x - vec.z) * this.ppm,
                    y: this.homePlate.y - (-vec.x / 2 + vec.z / 2) * this.ppm - vec.y * this.ppm,
                    z: 0,
                }
            }
        }
    }

    CtxMoveTo(ctx, pt)
    {
        ctx.moveTo(pt.x, pt.y);
    }
    CtxLineTo(ctx, pt)
    {
        ctx.lineTo(pt.x, pt.y);
    }

    DrawLines(ctx)
    {
        let leftFoulPole = 336 * footSqrt2;
        let rightFoulPole = 322 * footSqrt2;
        let homeHeight = footSqrt2 + halfPlateWidth;
        let rightEdge = footSqrt2 + foot / 2;
        let leftEdge = -footSqrt2 - foot / 2;
        let halfBox = homeHeight / 2;
        let topBox = halfBox + 3 * foot;
        let delta = topBox;

        // bases and rubber
        ctx.fillStyle = '#fff';
        ctx.beginPath();

        let rubber = {x: 0, y: 60.5 * foot};

        // home
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(0, 0, 0)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 + footSqrt2, 0, footSqrt2)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 + footSqrt2, 0, footSqrt2 + halfPlateWidth)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 - footSqrt2, 0, footSqrt2 + halfPlateWidth)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 - footSqrt2, 0, footSqrt2)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0, 0, 0)));
        // first
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(0 - footSqrt2 * 89, 0, 0 + footSqrt2 * 89)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 - footSqrt2 * 90, 0, 0 + footSqrt2 * 90)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 - footSqrt2 * 89, 0, 0 + footSqrt2 * 91)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 - footSqrt2 * 88, 0, 0 + footSqrt2 * 90)));
        // second
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(0, -0.03, 0 + footSqrt2 * 178)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 - footSqrt2, 0, 0 + footSqrt2 * 179)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0, 0.03, 0 + footSqrt2 * 180)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 + footSqrt2, 0, 0 + footSqrt2 * 179)));
        // third
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(0 + footSqrt2 * 89, 0, 0 + footSqrt2 * 89)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 + footSqrt2 * 90, 0, 0 + footSqrt2 * 90)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 + footSqrt2 * 89, 0, 0 + footSqrt2 * 91)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(0 + footSqrt2 * 88, 0, 0 + footSqrt2 * 90)));
        // rubber
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(rubber.x - foot * .75, 0.03, rubber.y)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(rubber.x + foot * .75, 0.03, rubber.y)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(rubber.x + foot * .75, 0, rubber.y - 0.3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(rubber.x - foot * .75, 0, rubber.y - 0.3 * foot)));
        ctx.fill();


        ctx.strokeStyle = '#fff';
        ctx.lineWidth = this.chalkWidth;
        ctx.beginPath();

        // foul lines
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(leftFoulPole, 0, leftFoulPole)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(delta, 0, topBox)));
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(-delta, 0, topBox)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(-rightFoulPole, 0, rightFoulPole)));
        // left batters box
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(rightEdge, 0, halfBox)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(rightEdge, 0, halfBox - 3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(rightEdge + 3 * foot, 0, halfBox - 3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(rightEdge + 3 * foot, 0, halfBox + 3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(rightEdge, 0, halfBox + 3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(rightEdge, 0, halfBox)));
        // right batters box
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(leftEdge, 0, halfBox)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(leftEdge, 0, halfBox - 3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(leftEdge - 3 * foot, 0, halfBox - 3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(leftEdge - 3 * foot, 0, halfBox + 3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(leftEdge, 0, halfBox + 3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(leftEdge, 0, halfBox)));
        // // catcher's box
        this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(-21.5 * foot / 12, 0, halfBox - 3 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(-21.5 * foot / 12, 0, halfBox - 8 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(21.5 * foot / 12, 0, halfBox - 8 * foot)));
        this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(21.5 * foot / 12, 0, halfBox - 3 * foot)));
        ctx.stroke();
    }

    GetWallSections()
    {
        let wallSections = [];

        for(let i = 2; i < kWalls.length; i+= 2)
        {
            wallSections.push({
                points: [
                    {x: kWalls[i - 2], y: kWalls[i - 1]},
                    {x: kWalls[i], y: kWalls[i + 1]},
                ],
                minHeight: 0,
                height: 8 * foot,
                fair: (i < kFairWallCount),
                toggleOutOfPark: (i >= kFairWallCount),
            });
        }

        for(let i = 2; i < kWMSCWalls.length; i += 2)
        {
            wallSections.push({
                points: [
                    {x: kWMSCWalls[i - 2], y: kWMSCWalls[i - 1]},
                    {x: kWMSCWalls[i], y: kWMSCWalls[i + 1]},
                ],
                minHeight: 0,
                height: 61.2 * foot,
                fair: (i > 2),
                newFloor: true,
                msg: "OFF THE WAREHOUSE!",
                overMsg: "OVER THE WAREHOUSE!",
            });
        }

        wallSections.push({
            points: [
                {x: kWalls[20], y: kWalls[21]},
                {x: kWalls[20] + footSqrt2 * 3, y: kWalls[21] + footSqrt2 * 3}
            ],
            height: 70 * foot,
            minHeight: 8 * foot,
            fair: true,
            msg: 'OFF THE FOUL POLE!'
        });

        for(let i = 2; i < kBattersEyeLower.length; i+= 2)
        {
            wallSections.push({
                points: [
                    {x: kBattersEyeLower[i - 2], y: kBattersEyeLower[i - 1]},
                    {x: kBattersEyeLower[i], y: kBattersEyeLower[i + 1]},
                ],
                minHeight: 0,
                height: kBattersEyeLowerHeight,
                fair: true,
                newFloor: true,
            });
        }
        for(let i = 2; i < kBattersEyeUpper.length; i+= 2)
        {
            wallSections.push({
                points: [
                    {x: kBattersEyeUpper[i - 2], y: kBattersEyeUpper[i - 1]},
                    {x: kBattersEyeUpper[i], y: kBattersEyeUpper[i + 1]},
                ],
                minHeight: 0,
                height: kBattersEyeUpperHeight,
                fair: true,
                newFloor: true,
                msg: "OFF THE BATTER'S EYE!",
                overMsg: "OVER THE BATTER'S EYE!",
            });
        }
        for(let i = 2; i < kBeachWalls.length; i+= 2)
        {
            wallSections.push({
                points: [
                    {x: kBeachWalls[i - 2], y: kBeachWalls[i - 1]},
                    {x: kBeachWalls[i], y: kBeachWalls[i + 1]},
                ],
                minHeight: 0,
                height: 8 * foot,
                fair: true,
                newFloor: false,
            });
        }
        for(let i = 2; i < kBullpenWalls.length; i+= 2)
        {
            wallSections.push({
                points: [
                    {x: kBullpenWalls[i - 2], y: kBullpenWalls[i - 1]},
                    {x: kBullpenWalls[i], y: kBullpenWalls[i + 1]},
                ],
                minHeight: 0,
                height: 8 * foot,
                fair: true,
                newFloor: false,
            });
        }
        wallSections.push({
            points: [
                {x: kBullpenPartition[0], y: kBullpenPartition[1]},
                {x: kBullpenPartition[2], y: kBullpenPartition[3]},
            ],
            minHeight: 0,
            height: 8 * foot,
            fair: true, 
            newFloor: false,
        })


        return wallSections;
    }

    DrawWall(ctx, p1, p2, height, brush, topColor)
    {
        let p1h = p1.Copy();
        p1h.y += height;
        let p2h = p2.Copy();
        p2h.y += height;

        let pt1 = this.WorldToScreen(p1);
        let pt2 = this.WorldToScreen(p2);
        let pt1h = this.WorldToScreen(p1h);
        let pt2h = this.WorldToScreen(p2h);
        
        if(pt1.z < 0 || pt2.z < 0)
        {
            return;
        }
        if(topColor)
        {
            ctx.strokeStyle = topColor;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(pt1h.x, pt1h.y);
            ctx.lineTo(pt2h.x, pt2h.y);
            ctx.stroke();
        }
        else
        {
            ctx.fillStyle = brush;
            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.lineTo(pt1h.x, pt1h.y);
            ctx.lineTo(pt2h.x, pt2h.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.lineTo(pt1.x, pt1.y);
            ctx.fill();
        }

    }

    Draw3dPoly(ctx, points, brush, shadow)
    {
        if(shadow)
        {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            for(let i = 0; i < points.length; i += 3)
            {
                let pt = this.WorldToScreen(new Vec3(points[i], 0, points[i + 2]));
                if(i == 0)
                {
                    ctx.moveTo(pt.x, pt.y);
                }
                else 
                {
                    ctx.lineTo(pt.x, pt.y);
                }
            }
            ctx.fill();
        }

        ctx.fillStyle = brush;
        ctx.beginPath();
        for(let i = 0; i < points.length; i += 3)
        {
            let pt = this.WorldToScreen(new Vec3(points[i], points[i + 1], points[i + 2]));
            if(i == 0)
            {
                ctx.moveTo(pt.x, pt.y);
            }
            else 
            {
                ctx.lineTo(pt.x, pt.y);
            }
        }
        ctx.fill();
    }

    Draw3dPoly2(ctx, pointsIn, height, brush, shadow)
    {
        let points = [];
        for(let i = 0; i < pointsIn.length; i+=2)
        {
            points.push(pointsIn[i]);
            points.push(height);
            points.push(pointsIn[i + 1]);
        }
        this.Draw3dPoly(ctx, points, brush, shadow);
    }

    FillGroundPolygon(ctx, points, brush)
    {
        ctx.fillStyle = brush;
        ctx.beginPath();
        for(let i = 0; i < points.length; i += 2)
        {
            let pt = this.WorldToScreen(new Vec3(points[i], 0, points[i + 1]));
            if(i == 0)
            {
                ctx.moveTo(pt.x, pt.y);
            }
            else 
            {
                ctx.lineTo(pt.x, pt.y);
            }
        }
        ctx.fill();
    }

    DrawWMSC(ctx)
    {
        if(this.viewType != kViewTypes.batting)
        {
            // Western Metal Supply Co
            let heights = [0, 55 * foot, 6.2 * foot];
            let brushes = [kBrushes.brickBrush, '#222'];
            for(let h = 0; h < heights.length - 1; h++)
            {
                let wallPt1 = new Vec3(kWMSCWalls[0], heights[h], kWMSCWalls[1]);
                for(let i = 2; i < kWMSCWalls.length; i += 2)
                {
                    let wallPt2 = new Vec3(kWMSCWalls[i], heights[h], kWMSCWalls[i + 1]);
                    this.DrawWall(ctx, wallPt1, wallPt2, heights[h + 1], brushes[h]);
                    wallPt1 = wallPt2;
                }
            }

            // roof
            this.Draw3dPoly2(ctx, kWMSCWalls, 61.2 * foot, '#444');

            // left foul pole
            this.DrawWall(
                ctx, new Vec3(kWalls[0], 0, kWalls[1]), 
                new Vec3(kWalls[0], 0, kWalls[1] + 1), 
                61.2 * foot, "#dd0");

            // right foul pole
            this.DrawWall(
                ctx, new Vec3(kWalls[20], 0, kWalls[21]), 
                new Vec3(kWalls[20] + 2 * footSqrt2, 0, kWalls[21] + 2 * footSqrt2), 
                70 * foot, "#dd0");

            // left field bleachers
            //  this.Draw3dPoly(ctx, kLeftFieldLowerBleachers, '#04d');
            //  this.Draw3dPoly(ctx, kLeftFieldUpperDeck, '#04d');
        }
    }

    DrawWallArray(ctx, walls, height, brush, topBrush)
    {
        for(let phase = 0; phase < 2; phase++)
        {
            let wallPt1 = new Vec3(walls[0], 0, walls[1]);
            for(let i = 2; i < walls.length; i += 2)
            {
                let wallPt2 = new Vec3(walls[i], 0, walls[i + 1]);
                this.DrawWall(ctx, wallPt1, wallPt2, height, brush, phase == 1 ? topBrush : null);
                wallPt1 = wallPt2;
            }
        }
    }

    MakeCanvas()
    {
        if(this.canvasInfo)
        {
            return this.canvasInfo;
        }
        let canvas = document.createElement('canvas');
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        let ctx = canvas.getContext('2d');
    
        ctx.fillStyle = kBrushes.crowdBrush;
        ctx.filter = 'blur(2px)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';

        // bullpen grass
        this.FillGroundPolygon(ctx, kBullpenGrass, kBrushes.grassBrush);
        this.DrawWallArray(ctx, kBullpenGrass, 10*foot, '#00d', '#44d');
        this.DrawWallArray(ctx, kBullpenPartition, 8*foot, '#00d', '#44d');
        this.DrawWallArray(ctx, kBeach, 10*foot, '#00d', '#44d');
        // beach
        this.FillGroundPolygon(ctx, kBeach, kBrushes.sandBrush);

        // dirt everywhere
        this.FillGroundPolygon(ctx, this.dirtLayer, kBrushes.dirtBrush);

        // grass on top of dirt, 8 feet from wall
        let outfieldGrass = [];
        for(let i = 0; i < this.dirtLayer.length; i += 2)
        {
            let center = new Vec3(0, 0, 200 * foot);
            let wall = new Vec3(this.dirtLayer[i], 0, this.dirtLayer[i + 1]);
            let d = center.Sub(wall);
            let proj = wall.Add(d.Normalize().Scale(8 * foot));
            outfieldGrass.push(proj.x);
            outfieldGrass.push(proj.z);
        }    
        this.FillGroundPolygon(ctx, outfieldGrass, kBrushes.grassBrush);

        // infield dirt
        this.FillGroundPolygon(ctx, kInfieldDirt, kBrushes.dirtBrush);

        // infield dirt arc
        if(kInfieldDirtArc.length == 0)
        {
            let center = new Vec3(0, 0, 60.5 * foot);
            kInfieldDirtArc.push(center.x);
            kInfieldDirtArc.push(center.z);
            let theta = 164*kDegToRad;
            let segments = 20;
            let dirtRadius = 30.2;
            
            for(let i = 0; i < segments; i++)
            {
                let v = center.Add(new Vec3(Math.cos(theta), 0, Math.sin(theta)).Scale(dirtRadius));
                kInfieldDirtArc.push(v.x);
                kInfieldDirtArc.push(v.z);
                theta -= 148/(segments-1) * kDegToRad;
            }
        }
        this.FillGroundPolygon(ctx, kInfieldDirtArc, kBrushes.dirtBrush);
        this.FillGroundPolygon(ctx, kInfieldGrass, kBrushes.grassBrush);

        if(kMoundArc.length == 0)
        {
            let center = new Vec3(0, 0, 59 * foot);
            kMoundArc.push(center.x);
            kMoundArc.push(center.y);
            let theta = 0;
            let moundRadius = 18 * foot;
            let segments = 20;
            for(let i = 0; i < segments; i++)
            {
                let v = center.Add(new Vec3(Math.cos(theta), 0, Math.sin(theta)).Scale(moundRadius));
                kMoundArc.push(v.x);
                kMoundArc.push(v.z);
                theta += 360/(segments-1) * kDegToRad;
            }
        }
        this.FillGroundPolygon(ctx, kMoundArc, kBrushes.dirtBrush);

        this.DrawLines(ctx);

        if(this.viewType == kViewTypes.leftFieldLine || this.viewType == kViewTypes.homePlate)
        {
            this.DrawWMSC(ctx);
        }

        // draw batter's eye
        let wallPt1 = new Vec3(kBattersEyeUpper[0], 0, kBattersEyeUpper[1]);
        for(let i = 2; i < kBattersEyeUpper.length; i += 2)
        {
            let wallPt2 = new Vec3(kBattersEyeUpper[i], 0, kBattersEyeUpper[i + 1]);
            this.DrawWall(ctx, wallPt1, wallPt2, kBattersEyeUpperHeight, '#00b');
            wallPt1 = wallPt2;
        }
        this.Draw3dPoly2(ctx, kBattersEyeUpper, kBattersEyeUpperHeight, '#777');

        wallPt1 = new Vec3(kBattersEyeLower[0], 0, kBattersEyeLower[1]);
        for(let i = 2; i < kBattersEyeLower.length; i += 2)
        {
            let wallPt2 = new Vec3(kBattersEyeLower[i], 0, kBattersEyeLower[i + 1]);
            this.DrawWall(ctx, wallPt1, wallPt2, kBattersEyeLowerHeight, '#00c');
            wallPt1 = wallPt2;
        }
        this.Draw3dPoly2(ctx, kBattersEyeLower, kBattersEyeLowerHeight, '#777');

        // walls!
        for(let phase = 0; phase < 2; phase++)
        {
            let wallPt1 = new Vec3(kWalls[0], 0, kWalls[1]);
            for(let i = 2; i < kWalls.length; i += 2)
            {
                let wallPt2 = new Vec3(kWalls[i], 0, kWalls[i + 1]);
                this.DrawWall(ctx, wallPt1, wallPt2, 10 * foot, '#00f', phase == 1 ? i < kFairWallCount ? '#dd0' : '#44f' : null);
                wallPt1 = wallPt2;
            }
        }

        if(this.viewType == kViewTypes.rightFieldLine)
        {
            this.DrawWMSC(ctx);
        }

        if(this.viewType != kViewTypes.batting)
        {
            // left stripe on wall
            let pt1 = this.WorldToScreen(kWalls[0], 0, kWalls[1]);
            let pt2 = this.WorldToScreen(kWalls[0], 10 * foot, kWalls[1]);
            ctx.strokeStyle = "#dd0";
            ctx.beginPath();
            this.CtxMoveTo(ctx, this.WorldToScreen(new Vec3(kWalls[0], 0, kWalls[1])));
            this.CtxLineTo(ctx, this.WorldToScreen(new Vec3(kWalls[0], 10 * foot, kWalls[1])));
            ctx.stroke();
        }

        this.canvasInfo = {
            canvas: canvas,
            bounds: {x: canvas.width - screenWidth, y: canvas.height - screenHeight},
            homePlate: this.homePlate,
            center: {
                x: this.homePlate.x + screenWidth / 2, 
                y: canvas.height + screenHeight
            },
            wallSections: [],
        };
        return this.canvasInfo;
    }

    SetCameraLookAt(pos, target, up)
    {
        if(!this.viewMatrix)
        {
            this.viewMatrix = new Matrix4x4(new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1), new Vec3(0, 0, 0));
        }

        let zAxis = pos.Sub(target).Normalize();
        let xAxis = up.Cross(zAxis).Normalize();
        let yAxis = zAxis.Cross(xAxis).Normalize();

        this.cameraPos = pos;
        this.cameraDir = zAxis.Invert();

        // Invert = transpose for orthonormal matrices (basis vectors are normal and orthogonal).
        // We could multiply basis TM against -translation TM, but quicker to just calculate final column
        // since everything else will cancel in normal matrix multiply.
        this.viewMatrix.c0 = new Vec3(xAxis.x, yAxis.x, zAxis.x);
        this.viewMatrix.c1 = new Vec3(xAxis.y, yAxis.y, zAxis.y);
        this.viewMatrix.c2 = new Vec3(xAxis.z, yAxis.z, zAxis.z);
        this.viewMatrix.c3 = new Vec3(-pos.Dot(xAxis), -pos.Dot(yAxis), -pos.Dot(zAxis));
    }

    PerspectiveProjection(p)
    {
        let scale = 3.5;    // Focal length scaling
        return new Vec3(screenHalfWidth + (((p.x*scale) / -p.z) * this.screenHalfWidthOverAspectRatio),
                        screenHalfHeight - (((p.y*scale) / -p.z) * screenHalfHeight),
                        -p.z);
    }

    SetTransform(ctx, ball)
    {
        let bp = this.WorldToScreen(ball.pos);
        let sp = this.WorldToScreen(ball.GetShadowPos());
        let ballHeight = sp.y - bp.y;
        let scale = 1;
        let minScale = screenHeight / this.canvasHeight;
        let offset = screenHalfHeight;

        // if(ballHeight > screenHalfHeight - 40)
        // {
        //     //scale = Math.max(screenHalfHeight / ballHeight, minScale);
        //     offset = ballHeight + 40;
        // }
        
        if(this.follow)
        {
            this.center = sp;
            this.center.x -= screenHalfWidth; 
            this.center.y -= offset; // screenHalfHeight;
            this.center.x *= scale;
            this.center.y *= scale;
        }

        let maxCenter = {
            x: this.canvasWidth * scale - screenWidth, 
            y: this.canvasHeight * scale - screenHeight,
        };

        this.center.x = Math.max(0, Math.min(this.center.x, maxCenter.x));
        this.center.y = Math.max(0, Math.min(this.center.y, maxCenter.y));

        let cx = this.center.x;
        let cy = this.center.y;


        ctx.setTransform(scale, 0, 0, scale, -cx, -cy);
    }

    DrawBall(ctx, ball)
    {
        let bp = this.WorldToScreen(ball.pos);
        let sp = this.WorldToScreen(ball.GetShadowPos());
        let radius = 3;

        aw.ctx.fillStyle = "#000";
        aw.ctx.beginPath();
        aw.ctx.arc(sp.x, sp.y, 3, 0, TAU, false);
        aw.ctx.fill();

        aw.ctx.fillStyle = "#fff";
        aw.ctx.beginPath();
        aw.ctx.arc(bp.x, bp.y, 3, 0, TAU, false);
        aw.ctx.fill();

        this.ballOffscreen = (sp.x > this.canvasWidth || sp.x < 0 || sp.y < 0 || sp.y > this.canvasHeight);
    }

    DrawBallBatting(ctx, ball)
    {
        let bp = this.WorldToScreen(ball.pos);
        let mp = this.WorldToScreen(ball.GetRadiusPos());
        let sp = this.WorldToScreen(ball.GetShadowPos());
        let radius = Math.abs(mp.x - bp.x);
        
        if(this.zeroPointRadius === undefined)
        {
            let a = this.WorldToScreen(new Vec3(0, 1, 0));
            let b = this.WorldToScreen(new Vec3(ball.radius, 1, 0));
            this.zeroPointRadius = Math.abs(a.x - b.x);
        }

        // draw shadow
        if(sp.z >= 0)
        {
            aw.ctx.fillStyle = '#000';
            aw.ctx.beginPath();
            aw.ctx.arc(sp.x, sp.y, radius, 0, TAU, false);
            aw.ctx.fill();
        }

        // draw ball
        if(bp.z >= 0)
        {
            aw.ctx.fillStyle = '#fff';
            aw.ctx.beginPath();
            aw.ctx.arc(bp.x, bp.y, radius, 0, TAU, false);
            aw.ctx.fill();
        }

        // draw target
        if(ball.pitching || ball.isHit)
        {
            let projected = ball.GetProjectedPlatePos();
            projected.x = ball.pos.x;
            let tp = this.WorldToScreen(projected);

            if(this.strikeZone === undefined)
            {
                this.strikeZone = {};
                this.strikeZone.ul = this.WorldToScreen(new Vec3(halfPlateWidth, foot * 4, 0));
                this.strikeZone.br = this.WorldToScreen(new Vec3(-halfPlateWidth, foot * 1.5, 0));
            }

            aw.ctx.strokeStyle = '#d00';
            aw.ctx.lineWidth = 2;
            aw.ctx.beginPath();
            aw.ctx.moveTo(this.strikeZone.ul.x, this.strikeZone.ul.y);
            aw.ctx.lineTo(this.strikeZone.ul.x, this.strikeZone.br.y);
            aw.ctx.lineTo(this.strikeZone.br.x, this.strikeZone.br.y);
            aw.ctx.lineTo(this.strikeZone.br.x, this.strikeZone.ul.y);
            aw.ctx.lineTo(this.strikeZone.ul.x, this.strikeZone.ul.y);
            aw.ctx.stroke();

            if(ball.timeAtPlate == 0)
            {
                aw.ctx.fillStyle = 'rgba(255, 64, 64, 0.5)';
                aw.ctx.beginPath();
                aw.ctx.arc(tp.x, tp.y, this.zeroPointRadius, 0, TAU, false);
                aw.ctx.fill();
            }
            else
            {
                aw.ctx.fillStyle = 'rgba(255, 255, 64, 0.5)';
                aw.ctx.beginPath();
                aw.ctx.arc(ball.screenPointAtPlate.x, ball.screenPointAtPlate.y, this.zeroPointRadius, 0, TAU, false);
                aw.ctx.fill();
            }
        }
    }

    Render(ctx, ball)
    {
        this.SetTransform(ctx, ball);
        ctx.drawImage(this.canvasInfo.canvas, 0, 0);
        if(ball)
        {
            this.DrawBall(ctx, ball);
        }
    }

}
