#!/bin/bash
while true; do
NOW=$(date +"%Y-%m-%d")
DATE=$(date +"%Y/%m/%d %H:%M:%S")
LOGFILE="generatedLogs/log-$1-$NOW.log"
echo "$(ps -C $1 -o pid,%cpu,%mem)" >> "$LOGFILE";
echo "Date: $DATE" >> "$LOGFILE";
sleep "$2";
done
