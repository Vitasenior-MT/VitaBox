#!/bin/bash
while true; do
NOW=$(date +"%Y-%m-%d")
DATE=$(date +"%Y/%m/%d %H:%M:%S")
LOGFILE="generatedLogs/log-$1-$NOW.log"
echo "PID||CPU||MEM" >> "$LOGFILE"
echo "Reading:" >> "$LOGFILE";
echo "$(ps aux -y | grep $1 | awk '{print $2,$3,$4}')" >> "$LOGFILE";
echo "Date: $DATE" >> "$LOGFILE";
sleep "$2";
done