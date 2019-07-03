#!/bin/bash

set -eo pipefail

# Project dir
basedir="$(pwd)"

function patch_nodegit {
    local marker_file=".jcm-patched"
    pushd node_modules/nodegit >/dev/null
    if [[ -e "$marker_file" ]]; then
        return
    fi

    patch_file="$basedir/patches/libgit2-patch"
    pushd vendor/libgit2 >/dev/null
    patch -p1 <"$patch_file" >/dev/null
    popd >/dev/null

    # rebuild libgit2
    node-gyp rebuild -j 40 >/dev/null

    # Mark as it is patched.
    touch "$marker_file"
    popd >/dev/null

}


# [TODO] This is workaround for VSCode.
# VSCode doesn't recoginise 'paths' option of typescripts.
# So, to make VSCode happy, all types should at 'node_modules/@types'.
function link_typings {
    pushd node_modules/@types >/dev/null
    for f in $(ls ../../src/types); do rm -rf $f; ln -s ../../src/types/$f; done
    popd >/dev/null
}

# DO NOTHINGN: native jcm patch will NOT be used!
# echo "POST-INSTALL: Patching nodegit:libgit2"
# patch_nodegit

echo 'POST-INSTALL: Link typings "node_modules/@types" => "src/types"'
link_typings
