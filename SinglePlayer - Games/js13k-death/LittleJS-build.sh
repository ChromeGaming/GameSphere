#!/usr/bin/env bash

cd $(dirname "$0")


LITTLEJS_ENGINE_DIR='../../LittleJS/engine'

if [ ! -d "$LITTLEJS_ENGINE_DIR" ]; then
	echo "  - ERROR! Could not find directory: $LITTLEJS_ENGINE_DIR"
	exit
fi

cd "$LITTLEJS_ENGINE_DIR"


OUTPUT_FILENAME='../../js13k/2022/dev/js/littlejs.custom.js'

if [ -f "$OUTPUT_FILENAME" ]; then
	rm "$OUTPUT_FILENAME"
fi

FILES=(
	'engineRelease.js'
	'engineUtilities.js'
	'engineSettings.js'
	'engine.js'
	'engineObject.js'
	'engineDraw.js'
	'engineInput.js'
	'engineAudio.js'
	# 'engineTileLayer.js'
	# 'engineParticles.js'
	# 'engineMedals.js'
	'engineWebGL.js'
)

for f in ${FILES[@]}; do
	cat "$f" >> "$OUTPUT_FILENAME"
	echo '' >> "$OUTPUT_FILENAME"
done

# Removed "engineMedals.js" to drastically reduce the later ZIP size (~10 kB!).
# Add dummy function to avoid errors:
printf '\nfunction medalsRender() {}\n' >> "$OUTPUT_FILENAME"
