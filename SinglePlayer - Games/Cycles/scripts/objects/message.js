function Message(text, size, persistent) {
    this.color = Graphics.getRainbow();
    this.text = text;
    this.size = size;
    this.visible = true;

    let created = persistent === true ? Infinity : Date.now();
    this.update = function(data) {
        if (data.time.now - created > 1000)
            this.visible = false;
    }
}
