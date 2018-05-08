#!/bin/bash
for((i=1;i<"$#"+1;i++));
do
sh ./whatcher.sh "${!i}" 10 &
done

sleep 10

while true; do
	for((i=1;i<"$#"+1;i++)); do
		python plot.py "${!i}" mem
		python plot.py "${!i}" cpu
		sleep 5
	done
echo "Waiting for the next Action 300 secs"
sleep 300
done
