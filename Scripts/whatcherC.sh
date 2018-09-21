#!/bin/bash
while true; do
NOW=$(date +"%Y-%m-%d")
DATE=$(date +"%Y/%m/%d %H:%M:%S")
LOGFILE="generatedLogs/log-CPU-ALL-$NOW.log"
echo "$(top -bn 1 | awk 'NR>7{s+=$9} END {print s/4}')" >> "$LOGFILE";
echo "Date: $DATE" >> "$LOGFILE";
sleep "$1";
done
