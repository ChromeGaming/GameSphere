var game = game || {};

game.LEVELS = [
/*
    {
        paths: [
            {data: "m 560,112.36216 800,0 c 221.6,0 400,178.4 400,400 0,221.6 -178.4,400 -400,400 l -800,0 c -221.6,0 -400,-178.4 -400,-400 0,-221.6 178.4,-400 400,-400 z", atEnd: {path: 0, pos: 0}}
        ],
        cells: [
            {colour: "red", speed: 3, location: {path: 0, pos: 0}}, // pos = int between 0 and 1000
            {colour: "blue", speed: 2, location: {path: 0, pos: 500}}
        ],
        controllers: [
            {type: "wait", location: {path: 0, pos: 600}, paused: false}
        ],
        scorers: [
            {location: {path: 0, pos: 100}, points: 2}
        ],
        breaks: []
    },
*/
    {
        paths: [
            {data: "m 560,112.36216 800,0 c 221.6,0 400,178.4 400,400 0,221.6 -178.4,400 -400,400 l -800,0 c -221.6,0 -400,-178.4 -400,-400 0,-221.6 178.4,-400 400,-400 z", atEnd: {path: 0, pos: 0}},
            {data: "m 855.37725,914.39809 c 0,0 -419.89381,-21.08582 -381.7006,-142.56287 C 533.39115,581.90768 1031.2781,732.24882 1069.2216,551.0927 1099.6806,405.67028 563.96634,391.11228 726.61078,265.96695 889.25523,140.82162 1283.0659,114.20646 1283.0659,114.20646", atEnd: {path: 0, pos: 180}}
        ],
        cells: [
            {colour: "red", speed: 3, location: {path: 0, pos: 0}},
            {colour: "blue", speed: 2.5, location: {path: 0, pos: 330}},
            {colour: "green", speed: 2, location: {path: 0, pos: 660}}
        ],
        controllers: [
            {type: "wait", location: {path: 0, pos: 90}, paused: false},
            {type: "switch", location: {path: 0, pos: 630}, switched: false, leadsTo: {path: 1}}
        ],
        scorers: [
            {location: {path: 0, pos: 0}, points: 1},
            {location: {path: 1, pos: 500}, points: 3}
        ],
        breaks: [
            /*{location: {path: 1, pos: 250}, stage: 0}*/
        ]
    },
    
    {
        paths: [
            {data: "m 96.5802,74.331642 1726.8396,0 0,876.061038 -1726.8396,0 z", atEnd: {path: 0, pos: 0}},
            {data: "M 924.35929,75.116641 1825.7246,521.20048", atEnd: {path: 0, pos: 418}},
            {data: "M 1823.427,523.4963 894.46529,948.89269", atEnd: {path: 0, pos: 678}},
            {data: "M 896.76647,951.18851 96.574851,486.70946", atEnd: {path: 0, pos: 920}},
            {data: "M 91.975727,489.00912 919.76081,75.116381", atEnd: {path: 0, pos: 158}}
        ],
        cells: [
            {colour: "red", speed: 2.5, location: {path: 0, pos: 0}},
            {colour: "blue", speed: 2.5, location: {path: 0, pos: 250}},
            {colour: "green", speed: 2, location: {path: 0, pos: 500}},
            {colour: "yellow", speed: 2, location: {path: 0, pos: 750}}
        ],
        controllers: [
            {type: "switch", location: {path: 0, pos: 158}, switched: false, leadsTo: {path: 1}},
            {type: "switch", location: {path: 0, pos: 418}, switched: false, leadsTo: {path: 2}},
            {type: "switch", location: {path: 0, pos: 678}, switched: false, leadsTo: {path: 3}},
            {type: "switch", location: {path: 0, pos: 920}, switched: false, leadsTo: {path: 4}}
        ],
        scorers: [
            {location: {path: 0, pos: 250}, points: 1},
            {location: {path: 1, pos: 500}, points: 2}
        ],
        breaks: [
            {location: {path: 2, pos: 500}, stage: 0},
            //{location: {path: 3, pos: 500}, stage: 0},
            {location: {path: 4, pos: 500}, stage: 0}
        ]
    },
    
    {
        paths: [
            {data: "m 790.202,680.67096 c -19.7904,169.6321 -163.3914,297.6138 -334.1739,297.8262 -186.0432,-5e-4 -336.8608,-150.8182 -336.8613,-336.86134 -6e-4,-186.04391 150.8174,-336.86275 336.8613,-336.86329 57.5037,0.1403 114.0143,14.99865 164.1504,43.16016", atStart: {path: 1, pos: 370, reverse: true}},
            {data: "M 1293.7365,385.02833 A 336.86227,336.86227 0 0 1 956.87425,721.8906 336.86227,336.86227 0 0 1 620.01197,385.02833 336.86227,336.86227 0 0 1 956.87425,48.166055 336.86227,336.86227 0 0 1 1293.7365,385.02833 Z", atEnd: {path: 1, pos: 0}},
            {data: "m 1119.8747,680.67139 c 19.7904,169.6321 163.3914,297.6138 334.1739,297.8262 186.0432,-5e-4 336.8608,-150.8182 336.8613,-336.86134 6e-4,-186.04391 -150.8174,-336.86274 -336.8613,-336.86328 -57.5037,0.1403 -114.0143,14.99865 -164.1504,43.16016", atEnd: {path: 1, pos: 980}}
        ],
        cells: [
            {colour: "red", speed: 3, location: {path: 1, pos: 0}},
            {colour: "blue", speed: 2.5, location: {path: 1, pos: 330}},
            {colour: "green", speed: 2, location: {path: 1, pos: 660}}
        ],
        controllers: [
            {type: "wait", location: {path: 0, pos: 580}, paused: false},
            {type: "wait", location: {path: 2, pos: 580}, paused: false},
            {type: "switch", location: {path: 1, pos: 170}, switched: false, leadsTo: {path: 2, pos: 0}},
            {type: "switch", location: {path: 1, pos: 520}, switched: false, leadsTo: {path: 0, pos: 999, reverse: true}}
        ],
        scorers: [
            {location: {path: 0, pos: 290}, points: 1},
            {location: {path: 1, pos: 750}, points: 1},
            {location: {path: 2, pos: 290}, points: 1}
        ],
        breaks: [
            //{location: {path: 0, pos: 800}, stage: 0},
            {location: {path: 2, pos: 800}, stage: 0}
        ]
    },

    {
        paths: [
            {data: "m 1366.994,819.32225 c 194.4055,-108.0719 -160.958,-166.81269 -160.958,-335.71259 0,-168.8999 136.9204,-305.82033 305.8203,-305.82037 168.8999,-2e-5 305.8204,136.92043 305.8204,305.82037 0,168.89994 -155.3157,365.60482 -841.5809,363.30539 -686.26522,-2.29941 -873.77249,-192.10608 -873.77249,-361.00601 -1e-5,-168.89993 136.92044,-305.82038 305.82037,-305.82038 168.89993,-1e-5 305.82039,136.92045 305.82038,305.82038 0,168.89993 -261.08811,243.73655 -62.08385,340.31139", atEnd: {path: 0, pos: 565, reverse: true}, atStart: {path: 0, pos: 425, reverse: true}}
        ],
        cells: [
            {colour: "red", speed: 3, location: {path: 0, pos: 250}},
            {colour: "blue", speed: 2.5, location: {path: 0, pos: 500}},
            {colour: "green", speed: 2.5, location: {path: 0, pos: 750}}
        ],
        controllers: [
            {type: "wait", location: {path: 0, pos: 95}, paused: false},
            {type: "wait", location: {path: 0, pos: 910}, paused: false},
            {type: "switch", location: {path: 0, pos: 420}, switched: false, leadsTo: {path: 0, reverse: true}},
            {type: "switch", location: {path: 0, pos: 570}, switched: false, leadsTo: {path: 0, pos: 999, reverse: true}}
        ],
        scorers: [
            {location: {path: 0, pos: 500}, points: 1}
        ],
        breaks: []
    },
    
    {
        paths: [
            {data: "m 393.13897,264.5341 0,338.1643 c 0,32.72559 -6.81784,61.24683 -20.4535,85.56375 -13.63566,24.31692 -32.8392,43.29322 -57.61066,56.92888 -24.77143,13.40839 -53.7472,20.11258 -86.9273,20.11258 -22.95337,0 -45.1113,-5.227 -66.47383,-15.681 -21.13528,-10.68126 -37.72531,-24.65782 -49.77015,-41.92966", atStart: {path: 1, pos: 0, reverse: true}},
            {data: "m 485.52054,703.94317 0,0 c 24.08966,20.45348 51.0201,35.79359 80.79129,46.02032 29.99845,10.22675 62.95128,15.34012 98.85851,15.34012 57.72429,0 102.49469,-12.49935 134.31123,-37.49805 31.81654,-24.9987 47.7248,-60.33779 47.7248,-106.01723 0.36669,-53.00521 -57.46001,-83.48765 -98.85851,-95.5085 -72.10094,-20.50421 -133.42102,-29.78521 -189.3652,-49.91114 -45.05449,-19.11732 -49.94061,-42.29793 -49.94061,-71.38731 l 0,-0.3409 c 0,-46.13399 15.34012,-81.81395 46.02035,-107.03991 30.68023,-25.45324 73.97345,-38.17985 129.87964,-38.17985 26.58955,0 52.61093,4.31795 78.06414,12.95388 25.45323,8.40866 55.91541,28.95016 80.00507,46.44926", atEnd: {path: 2, pos: 0}},
            {data: "m 915.0438,311.5771 140.1063,-47.043 0,495.65614", atEnd: {path: 3, pos: 0}},
            {data: "m 1155.0313,380.09629 c 7.045,-38.63437 22.7262,-68.51916 47.0431,-89.65444 24.5441,-21.36255 55.5653,-32.04381 93.0634,-32.04381 42.4977,0 75.4507,11.24943 98.8585,33.74826 23.6351,22.49884 35.4527,54.20172 35.4527,95.1087 l 0,16.0219 c 0,23.18063 -6.7041,43.40685 -20.1126,60.67868 -13.4085,17.04457 -32.3849,29.54392 -56.929,37.49805 27.0441,5.45427 47.9522,17.95362 62.724,37.49808 14.9994,19.54443 22.499,44.4295 22.499,74.65522 l 0,16.02189 c 0,43.40685 -12.3858,77.04148 -37.1572,100.90387 -24.7714,23.86239 -59.7696,35.79359 -104.9945,35.79359 -41.8159,0 -75.7916,-10.90852 -101.9266,-32.72556 -25.9077,-21.81706 -41.4753,-52.61092 -46.7022,-92.38159 l 0,-0.34088 m 8.1814,-260.44106 0,-0.3409", atEnd: {path: 4, pos: 0}},
            {data: "m 1545.1976,265.96696 4.5988,496.67065", atEnd: {path: 5, pos: 0}},
            {data: "M 1770.5389,265.96696 1545.1976,546.4939", atEnd: {path: 4, pos: 600}},
            {data: "M 1779.7365,753.44001 1618.7784,463.71546", atStart: {path: 0, pos: 999}}
        ],
        cells: [
            {colour: "red", speed: -1.7, location: {path: 0, pos: 500}},
            {colour: "blue", speed: 2, location: {path: 1, pos: 500}},
            {colour: "green", speed: 2.3, location: {path: 2, pos: 500}},
            {colour: "yellow", speed: 2.6, location: {path: 3, pos: 500}}
        ],
        controllers: [
            {type: "switch", location: {path: 5, pos: 700}, switched: false, leadsTo: {path: 6, pos: 999, reverse: true}},
            {type: "wait", location: {path: 1, pos: 140}, paused: false},
            {type: "wait", location: {path: 3, pos: 150}, paused: false},
            {type: "teleporter", location: {path: 0, pos: 0}},
            {type: "teleporter", location: {path: 1, pos: 999}},
            {type: "teleporter", location: {path: 2, pos: 999}},
            {type: "teleporter", location: {path: 3, pos: 999}},
            {type: "teleporter", location: {path: 4, pos: 999}},
            {type: "teleporter", location: {path: 6, pos: 0}}
        ],
        scorers: [
            {location: {path: 0, pos: 95}, points: 1},
            {location: {path: 0, pos: 650}, points: 1}
        ],
        breaks: []
    },
    
    {
        paths: [
            {data: "M 951.56373,521.02191 C 791.95957,766.46146 730.31276,904.87986 517.19808,904.87986 c -213.11468,0 -385.87826,-172.76358 -385.87827,-385.87826 0,-213.11468 172.76359,-385.87827 385.87827,-385.87827 213.11468,0 309.10664,194.98695 436.38596,385.87827", atStart: {path: 1, pos: 0, reverse: true}},
            {data: "M 954.51152,516.96099 C 1114.1157,271.52145 1175.7625,133.10305 1388.8771,133.10305 c 213.1147,0 385.8783,172.76358 385.8783,385.87825 0,213.11468 -172.7636,385.87827 -385.8783,385.87827 -213.1146,0 -309.1066,-194.98695 -436.38588,-385.87827", atEnd: {path: 0, pos: 999, reverse: true}},
            {data: "M 741.45196,818.02708 C 906.32888,877.27309 975.73741,1195.824 1097.0256,735.19457", atEnd: {path: 1, pos: 900}}
        ],
        cells: [
            {colour: "red", speed: -1.7, location: {path: 0, pos: 250}},
            {colour: "blue", speed: -2, location: {path: 0, pos: 750}},
            {colour: "green", speed: 2.3, location: {path: 1, pos: 250}},
            {colour: "yellow", speed: 2.6, location: {path: 1, pos: 700}}
        ],
        controllers: [
            {type: "switch", location: {path: 0, pos: 150}, switched: false, leadsTo: {path: 2, pos: 0, reverse: true}},
            {type: "wait", location: {path: 1, pos: 500}, paused: false}
        ],
        scorers: [
            {location: {path: 0, pos: 50}, points: 2}
        ],
        breaks: []
    },


    {
        paths: [
            {data: "m 117.31475,511.12973 220.92059,-0.053 220.86771,0.053", atEnd: {path: 1, pos: 0}},
            {data: "M 559.61772,510.63639 959.73559,112.65817", atEnd: {path: 5, pos: 0}},
            {data: "M 559.61772,510.63639 961.87526,912.89393", atEnd: {path: 7, pos: 0}},
            {data: "M 964.01492,112.65817 1357.7138,510.63639", atEnd: {path: 6, pos: 0}},
            {data: "M 961.87526,908.61457 1355.5741,512.77606", atEnd: {path: 6, pos: 0}},
            {data: "m 961.55402,112.07163 372.19158,-2 372.1915,2", atEnd: {path: 0, pos: 0}},
            {data: "m 1357.1966,511.12973 173.992,-2 173.992,2", atEnd: {path: 0, pos: 0}},
            {data: "m 961.66155,908.80353 371.38125,-2 371.3812,2", atEnd: {path: 0, pos: 0}}
        ],
        cells: [
            {colour: "red", speed: 2.5, location: {path: 5, pos: 200}},
            {colour: "blue", speed: 2.1, location: {path: 6, pos: 200}},
            {colour: "green", speed: 1.7, location: {path: 7, pos: 200}}
        ],
        controllers: [
            {type: "switch", location: {path: 0, pos: 999}, switched: false, leadsTo: {path: 2, pos: 0}},
            {type: "switch", location: {path: 1, pos: 999}, switched: false, leadsTo: {path: 3, pos: 0}},
            {type: "switch", location: {path: 2, pos: 999}, switched: false, leadsTo: {path: 4, pos: 0}},
            {type: "wait", location: {path: 6, pos: 500}, paused: false},
            {type: "teleporter", location: {path: 5, pos: 999}},
            {type: "teleporter", location: {path: 6, pos: 999}},
            {type: "teleporter", location: {path: 7, pos: 999}}
        ],
        scorers: [
            {location: {path: 0, pos: 500}, points: 1}
        ],
        breaks: [
            {location: {path: 3, pos: 500}, stage: 0}
        ]
    },
    
    {
        paths: [
            {data: "m 1031.5314,569.62254 c 1.7481,36.56817 -40.90513,54.1561 -71.42852,47.61911 -54.5992,-11.69314 -77.72863,-74.41767 -61.90487,-123.80947 23.22201,-72.48446 108.32599,-101.83687 176.19039,-76.19062 90.4527,34.1824 126.1636,142.36698 90.4764,228.57135 -44.9087,108.4794 -176.4694,150.6013 -280.95229,104.76214 C 757.36974,695.05767 708.80955,539.96901 764.86462,417.24181 830.92357,272.61206 1009.6285,217.59713 1150.5788,283.90816 1313.3114,360.46687 1374.7919,562.84417 1298.1982,722.00327 1211.1675,902.84995 985.08012,970.80361 807.72215,883.90844 608.75331,786.4252 534.32103,536.60099 631.53122,341.05145 739.45296,123.9544 1013.0336,43.039351 1226.7692,150.57476", atStart: {path: 0, pos: 999}},
            {data: "M 883.68475,291.5259 C 742.53049,275.16153 895.52537,200.72924 762.51341,187.6548", atEnd: {path: 0, pos: 880, reverse: true}},
            {data: "m 1225.3955,334.24954 c 0.9644,134.097 -92.647,-1.89579 -89.3823,124.22781", atStart: {path: 0, pos: 455}},
            {data: "M 940.01646,610.00756 C 1036.4959,715.69358 870.11654,670.873 962.60383,768.6878", atEnd: {path: 0, pos: 205, reverse: true}}
        ],
        cells: [
            {colour: "red", speed: -2.5, location: {path: 0, pos: 200}},
            {colour: "blue", speed: -2.1, location: {path: 0, pos: 500}},
            {colour: "green", speed: -1.7, location: {path: 0, pos: 800}}
        ],
        controllers: [
            {type: "switch", location: {path: 0, pos: 377}, switched: false, leadsTo: {path: 1, pos: 0, reverse: true}},
            {type: "switch", location: {path: 0, pos: 125}, switched: false, leadsTo: {path: 2, pos: 999}},
            {type: "switch", location: {path: 0, pos: 40}, switched: false, leadsTo: {path: 3, pos: 0, reverse: true}},
            {type: "teleporter", location: {path: 0, pos: 0}}
        ],
        scorers: [
            {location: {path: 0, pos: 180}, points: 1},
            {location: {path: 0, pos: 650}, points: 1}
        ],
        breaks: [
            {location: {path: 0, pos: 950}, stage: 0}
        ]
    },
    
    {
        paths: [
            {data: "m 108.57143,509.50502 868.57144,2.85714 834.28573,-2.85714", atEnd: {path: 0, pos: 0}},
            {data: "m 346.42062,510.4839 99.29371,-329.56205 99.2937,329.56206", atEnd: {path: 0, pos: 300}},
            {data: "m 689.65867,511.65822 99.29371,329.56205 99.29369,-329.56206", atEnd: {path: 0, pos: 500}},
            {data: "m 1032.8967,508.91786 99.2937,-329.56205 99.2937,329.56206", atEnd: {path: 0, pos: 700}},
            {data: "m 1376.1349,510.09218 99.2937,329.56205 99.2937,-329.56206", atEnd: {path: 0, pos: 900}}
        ],
        cells: [
            {colour: "red", speed: 2.6, location: {path: 0, pos: 200}},
            {colour: "blue", speed: 2.3, location: {path: 0, pos: 500}},
            {colour: "green", speed: 2, location: {path: 0, pos: 800}}
        ],
        controllers: [
            {type: "switch", location: {path: 0, pos: 125}, switched: false, leadsTo: {path: 1, pos: 0}},
            {type: "switch", location: {path: 0, pos: 335}, switched: false, leadsTo: {path: 2, pos: 0}},
            {type: "switch", location: {path: 0, pos: 545}, switched: false, leadsTo: {path: 3, pos: 0}},
            {type: "switch", location: {path: 0, pos: 755}, switched: false, leadsTo: {path: 4, pos: 0}},
            {type: "teleporter", location: {path: 0, pos: 999}}
        ],
        scorers: [
            {location: {path: 0, pos: 50}, points: 1}
        ],
        breaks: [
            {location: {path: 2, pos: 750}, stage: 0},
            {location: {path: 4, pos: 750}, stage: 0}
        ]
    }

];