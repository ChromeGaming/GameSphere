let BoardAnalizer = {
    isTree: function (board) {
        let visited = new Matrix(board.width, board.height, false);
        let result = true;
        board.forEach(function (element, position) {
            if (result === false || visited.get(position))
                return;
            if (visit(board, visited, position))
                result = false;
        });
        return result;

        function visit(board, visited, position, previous) {
            if (visited.get(position))
                return true;
            visited.set(position, true);

            for (let i = 0; i < Vector2.directions.length; i++) {
                let next = position.add(Vector2.directions[i]);
                if (!next.equals(previous) && board.has(next) && BoardAnalizer.areNeighbours(board, position, next)) {
                    if (visit(board, visited, next, position))
                        return true;
                }
            }
            return false;
        }
    },
    findCycles: function (data) {
        let cycles = data.board.clone(),
            hasCycles = false;

        smooth(cycles);
        removeBridges(cycles);

        cycles.forEach(function (element, position) {
            let partOfCycle = !element.isEmpty();
            if (partOfCycle)
                hasCycles = true;
            data.board.get(position).setCycle(element);
        });

        return hasCycles;

        function smooth(board) {
            board.forEach(function (element, position) {
                for (let i = 0; i < Vector2.directions.length; i++) {
                    let next = position.add(Vector2.directions[i]);
                    if (!board.has(next) || !BoardAnalizer.areNeighbours(board, position, next)) {
                        board.get(position).set(next.sub(position), false);
                    }
                }
            });
        }

        function removeBridges(board) {
            let bridges = findBridges(board);

            bridges.forEach(function (bridge) {
                let posA = new Vector2(Math.floor(bridge[0] / board.size), bridge[0] % board.size),
                    posB = new Vector2(Math.floor(bridge[1] / board.size), bridge[1] % board.size),
                    tileA = board.get(posA),
                    tileB = board.get(posB);

                tileA.set(posB.sub(posA), false);
                tileB.set(posA.sub(posB), false);
            });
        }

        function findBridges(board) {
            let visited = [],
                disc = [],
                low = [],
                parent = [],
                time = 0;
                bridges = [];

            for (let i = 0; i < board.size * board.size; i++) {
                if (!visited[i])
                    bridgeUtil(i);
            }

            return bridges;

            function bridgeUtil(u) {
                visited[u] = true;
                disc[u] = low[u] = ++time;

                let neighbours = getNeighbours(u);
                for (let i = 0; i < neighbours.length; i++) {
                    let v = neighbours[i];

                    if (!visited[v]) {
                        parent[v] = u;
                        bridgeUtil(v);

                        low[u] = Math.min(low[u], low[v]);
                        if (low[v] > disc[u])
                            bridges.push([u, v]);

                    } else if (v != parent[u])
                        low[u] = Math.min(low[u], disc[v]);
                }
            }

            function getNeighbours(u) {
                let neighbours = [];
                x = Math.floor(u / board.size);
                y = u % board.size;

                if (board.hasXY(x + 1, y) && board.getXY(x, y).has('e') && board.getXY(x + 1, y).has('w'))
                    neighbours.push((x + 1) * board.size + y);
                if (board.hasXY(x - 1, y) && board.getXY(x, y).has('w') && board.getXY(x - 1, y).has('e'))
                    neighbours.push((x - 1) * board.size + y);
                if (board.hasXY(x, y + 1) && board.getXY(x, y).has('s') && board.getXY(x, y + 1).has('n'))
                    neighbours.push(x * board.size + y + 1);
                if (board.hasXY(x, y - 1) && board.getXY(x, y).has('n') && board.getXY(x, y - 1).has('s'))
                    neighbours.push(x * board.size + y - 1);

                return neighbours;
            }
        }
    },
    shouldDeleteArray: function (board) {
        let shouldDelete = [],
            fill;

        initArray();
        board.forEachXY(function (element, x, y) {
            if (!shouldDelete[x][y].hasOwnProperty('delete')) {
                fill = {
                    delete: true
                };
                if (element.isPartOfCycle()) {
                    shouldDelete[x][y] = fill;
                } else {
                    floodFillDelete(x, y, fill)
                }
            }
        });
        fixArray();
        return shouldDelete;

        function initArray() {
            let fill = {};
            for (let i = 0; i < board.size; i++) {
                let column = [];
                for (let j = 0; j < board.size; j++) {
                    column.push(fill);
                }
                shouldDelete.push(column);
            };
        }

        function floodFillDelete(x, y, fill) {
            if (!board.hasXY(x, y)) {
                fill.delete = false;
                return;
            } else if (shouldDelete[x][y].hasOwnProperty('delete') || board.getXY(x, y).isPartOfCycle()) {
                return;
            } else {
                shouldDelete[x][y] = fill;
                floodFillDelete(x + 1, y, fill);
                floodFillDelete(x - 1, y, fill);
                floodFillDelete(x, y + 1, fill);
                floodFillDelete(x, y - 1, fill);
            }
        }

        function fixArray() {
            for (let i = 0; i < board.size; i++) {
                for (let j = 0; j < board.size; j++) {
                    shouldDelete[i][j] = shouldDelete[i][j].delete;
                };
            };
        }
    },
    areNeighbours: function (board, a, b) {
        return board.get(a).has(b.sub(a)) && board.get(b).has(a.sub(b));
    }
}
