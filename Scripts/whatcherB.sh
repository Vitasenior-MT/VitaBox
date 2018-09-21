#!/bin/bash
while true; do
NOW=$(date +"%Y-%m-%d")
DATE=$(date +"%Y/%m/%d %H:%M:%S")
LOGFILE="generatedLogs/log-MEN-ALL-$NOW.log"
echo "total used free" >> "$LOGFILE";
echo "$(free | grep Mem | tr -s ' ' |  cut -d' ' -f2,3,4)" >> "$LOGFILE";
echo "Date: $DATE" >> "$LOGFILE";
sleep "$1";
done
