set -e
DIR=$(dirname "${BASH_SOURCE[0]}")

if echo ":$PATH:" | grep -q ":$DIR/.mise/bin:"; then
  exit 0
fi

. $DIR/env.sh
# cd $DIR/../conf
# . $DIR/.env.sh
# cd $DIR
#

bun_i
bun_i srv

# rust_api_url_cargo=rust/api/.url/Cargo.toml
# if ! [ -f "$rust_api_url_cargo" ]; then
#   src=$(dirname $rust_api_url_cargo)/src
#   mkdir -p $src
#   touch $src/lib.rs
#   echo -e '[package]\nname = "url"' >$rust_api_url_cargo
# fi
#
# if command -v rg &>/dev/null; then
#   if [ -z "$EXERG" ]; then
#     export EXERG=$(type -P rg)
#   fi
# fi
#
# if command -v fd &>/dev/null; then
#   if [ -z "$EXEFD" ]; then
#     export EXEFD=$(which fd)
#   fi
# fi
