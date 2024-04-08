#!/bin/bash

get_abs_filepath() {
	# $1 : relative filename
	filename=$0
	parentdir=$(dirname "${filename}")

	if [ -d "${filename}" ]; then
		echo "$(cd "${filename}" && pwd)"
	elif [ -d "${parentdir}" ]; then
		echo "$(cd "${parentdir}" && pwd)/$(basename "${filename}")"
	fi
}
scripts=$(dirname "$(get_abs_filepath)")
root=$scripts/..
blogs=$root/blogs

bun run "$scripts"/remove_scripts.ts
mv "$blogs"/* "$root"
rm -r "$blogs"
