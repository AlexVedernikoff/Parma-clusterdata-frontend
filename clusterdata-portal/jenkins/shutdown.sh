#!/bin/bash

# Останавливаем процесс
for FILE in cluster-data-portal.pid
do
  if [ -f "$FILE" ];
  then
    read pid < "$FILE"
    kill -9 "$pid"
    echo "Процесс $pid успешно уничтожен."
    rm "$FILE"
  fi
done
