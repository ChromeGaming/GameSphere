let ComboAnnouncer = {
    good: ['Nice', 'Cool', 'Combo', 'Good'],
    great: ['Wow', 'Great', 'Super', 'Stylish'],
    amazing: ['Amazing', 'Astounding', 'Skillful', 'Master'],
    incredible: ['Incredible', 'Inconcievable', 'Extreme', 'Illusive'],
    best: ['Instanity', 'Godlike', 'Madness', 'Arcane'],
    announce: function(data) {
        if (data.combo.current === 2 || data.combo.current === 3) {
            data.message = new Message(randomText('good'), 1);
        } else if (data.combo.current >= 4 && data.combo.current < 7) {
            data.message = new Message(randomText('great'), 1.2);
        } else if (data.combo.current >= 7 && data.combo.current < 10) {
            data.message = new Message(randomText('amazing'), 1.35);
        } else if (data.combo.current >= 10 && data.combo.current < 13) {
            data.message = new Message(randomText('incredible'), 1.5);
        } else if (data.combo.current >= 13) {
            data.message = new Message(randomText('best'), 2);
        }

        function randomText(tier) {
            return ComboAnnouncer[tier][Math.floor(Math.random() * 4)];
        }
    }
}
