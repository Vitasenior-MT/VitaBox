
import sys
import numpy as np
import os
import matplotlib as mpl
if os.environ.get('DISPLAY','') == '':
    print('no display found. Using non-interactive Agg backend')
    mpl.use('Agg')
import matplotlib
from matplotlib import pyplot as plt
from matplotlib import dates
import datetime
from time import gmtime, strftime

def plotData(arg1, arg2):
	print("Generanting " + arg1 + "(" + arg2 + ")")
	plt.figure(num=1, figsize=(8, 6))
        plt.title(arg1+"("+arg2+")", size=14)
	plt.grid(True)
	plt.xlabel('Time', size=14)
        plt.ylabel('Values(%)', size=14)
	f = open("generatedLogs/log-" + arg1 + "-" + strftime("%Y-%m-%d", gmtime())
 + ".log","r")
	arr = []
	data = []
	time = []
	for line in f:
		line = line.strip()
		if line.upper() == "PID||CPU||MEM":
			continue
		elif line == "Reading:":
			continue
		else:
			a,b,c=line.split(" ")
			if a == "Date:":
				data = np.array(data).astype(np.float)
				arr.append(sum(data))
				data = []
				time.append(c)
			else:
				if arg2.upper() == "CPU":
					data.append(b)
				elif arg2.upper() == "MEM":
					data.append(c)
	converted_dates = map(datetime.datetime.strptime, time, len(time)*['%H:%M:%S'])
	plt.plot((converted_dates), arr, color='b', linestyle='--', marker='o', label='y1 data')
	plt.legend(loc='upper left')
	plt.gcf().autofmt_xdate()
	plt.savefig("generatedPlots/"+arg1+"("+arg2+")"+'.png', format='png')
	plt.show()
	print("Done generanting " + arg1 + "(" + arg2 + ")")
if __name__ == "__main__":
	plotData(sys.argv[1], sys.argv[2])
