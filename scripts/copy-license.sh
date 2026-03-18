#!/bin/sh
# Copies the root LICENSE.md into the current package directory.
# Called as part of each package's build step.
cp "$(git rev-parse --show-toplevel)/LICENSE.md" .
