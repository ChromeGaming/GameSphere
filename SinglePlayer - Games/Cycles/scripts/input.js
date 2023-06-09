function Input(view, data) {
    let inputProcessor = new InputProcessor(data);
    let ignoreMousePress = false;
    let handledTouch = false;

    this.listen = function () {
        data.offset = {};

        document.body.addEventListener('mousedown', onMouseDown, false);
        document.body.addEventListener('mousemove', onMouseMove, false);
        document.body.addEventListener('mouseup', onMouseUp, false);
        document.body.addEventListener('mouseleave', onMouseLeave, false);

        document.body.addEventListener("touchstart", onTouchStart, false);
        document.body.addEventListener("touchmove", onTouchMove, false);
        document.body.addEventListener("touchend", onTouchEnd, false);
        document.body.addEventListener("touchcancel", onTouchCancel, false);
    };

    function onMouseDown(event) {
        if (data.ignoreInput || ignoreMousePress)
            return;
        if (contained(event, view.mid.getBoundingClientRect())) {
            ignoreMousePress = true;
            inputProcessor.onpress(eventBoardLocation(event));
        } else if (contained(event, view.bot.getBoundingClientRect())) {
            reactIfButtonPressed(event);
        }
    }

    function reactIfButtonPressed(event) {
        let rect = view.bot.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top;
        if (y > rect.height * 0.40 && y < rect.height * 0.75) {
            if (x < rect.height * 0.75 && x > rect.height * 0.20) {
                inputProcessor.restartLevelPressed();
            } else if (x > rect.width - rect.height * 0.75 && x < rect.width - rect.height * 0.20) {
                inputProcessor.wipeSavePressed();
            }
        }
    }

    function onMouseMove(event) {
        if (data.ignoreInput || !ignoreMousePress)
            return;
        inputProcessor.onmove(eventBoardLocation(event));
    }

    function onMouseUp(event) {
        ignoreMousePress = false;
        inputProcessor.onrelease();
    }

    function onMouseLeave(event) {
        ignoreMousePress = false;
        inputProcessor.oncancel();
    }

    function eventBoardLocation(event) {
        let board = view.mid.getBoundingClientRect();
        let size = view.mid.width / data.board.size;
        return {
            x: (event.clientX - board.left) / size,
            y: (event.clientY - board.top) / size
        }
    }

    function contained(event, rectangle) {
        return event.clientX >= rectangle.left && event.clientX < rectangle.right && event.clientY >= rectangle.top && event.clientY < rectangle.bottom;
    }

    function onTouchStart(event) {
        event.preventDefault();
        if (data.ignoreInput || handledTouch !== false)
            return;
        let touch = event.changedTouches[0];
        if (contained(touch, view.mid.getBoundingClientRect())) {
            inputProcessor.onpress(eventBoardLocation(touch));
            handledTouch = touch.identifier;
        } else if (contained(touch, view.bot.getBoundingClientRect())) {
            reactIfButtonPressed(touch);
        }
    };

    function onTouchMove(event) {
        event.preventDefault();
        if (data.ignoreInput || handledTouch === false)
            return;
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === handledTouch) {
                inputProcessor.onmove(eventBoardLocation(event.changedTouches[i]));
            }
        };
    };

    function onTouchEnd(event) {
        if (handledTouch === false)
            return;
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === handledTouch) {
                handledTouch = false;
                inputProcessor.onrelease();
            }
        };
    };

    function onTouchCancel() {
        if (handledTouch === false)
            return;
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === handledTouch) {
                handledTouch = false;
                inputProcessor.oncancel();
            }
        };
    };
}
