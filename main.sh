#!/bin/bash
MY_DIR=$(dirname "$(realpath "$0")")
CMD="$1"; shift
subdirs="hooks scripts"

for subdir in $(echo $subdirs | xargs); do
  test -e "$MY_DIR/$subdir/$CMD"
  if [ $? == 0 ]
  then
    $MY_DIR/$subdir/$CMD $@ >&1
    exit $?
  fi
done

echo "Unknown commad"
exit 1