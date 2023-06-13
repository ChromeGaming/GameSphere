#!/usr/bin/env bash
while read -r
do
	# embed referenced script
	[[ $REPLY == *\<script\ src=* ]] && {
		SRC=${REPLY#*src=\"}
		SRC=${SRC%%\"*}
		[ -r "$SRC" ] && {
			echo -n '<script>'
			esbuild --minify "$SRC"
			echo -n '</script>'
			continue
		}
	}
	# remove indent
	REPLY=${REPLY##*$'\t'}
	# remove empty lines
	[ "$REPLY" ] || continue
	# keep preprocessor statements on a line
	[[ $REPLY == \#* ]] && {
		echo
		echo "$REPLY"
		continue
	}
	# remove optional blanks
	echo -n "$REPLY" | sed '
s/\([CLM]\) /\1/g;
s/ {/{/g;
s/, /,/g;
s/: /:/g;
s/; /;/g;
s/;"/"/g;
s/<!--.*-->//g;
s/><\/circle>/\/>/g;
s/><\/ellipse>/\/>/g;
s/><\/line>/\/>/g;
s/><\/path>/\/>/g;
s/><\/polygon>/\/>/g;
s/><\/polyline>/\/>/g;
s/><\/rect>/\/>/g'
done
