
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
import glob
import distutils.dir_util

def plot(arg1, arg2, arg3):
    if arg3 == "true":
        files = glob.glob("generatedLogs/*.log")
        for f in files:
            splited = f.split("/")[1].split(".log")[0].split("log-")[1]
            name = splited.split("-")[0]
            date = splited.split(name+"-")[1]
            plotDatas(name, "CPU" , date)
            plotDatas(name, "MEM" , date)
    if arg3.lower() == "false":
        plotData(arg1, arg2)
        
def plotDatas(name, process, date):
    print("Generanting " + name + "(" + process + ") - " + date)
    plt.figure(num=1, figsize=(8, 6))
    plt.title(name+"("+process+")", size=14)
    plt.grid(True)
    plt.xlabel('Time', size=14)
    plt.ylabel('Values', size=14)
    f = open("generatedLogs/log-" + name + "-" + date + ".log","r")
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
                if process.upper() == "CPU":
                    data.append(b)
                elif process.upper() == "MEM":
                    data.append(c)
    converted_dates = map(datetime.datetime.strptime, time, len(time)*['%H:%M:%S'])
    plt.plot((converted_dates), arr, color='b', linestyle='--', marker='o')
    plt.gcf().autofmt_xdate()
    distutils.dir_util.mkpath("generatedPlots/"+name+"/"+process+"/")
    plt.savefig("generatedPlots/"+name+"/"+process+"/"+name+"("+process+")"+date+'.png', format='png')
    print("Done generanting " + name + "(" + process + ")")

def plotData(arg1, arg2):
    print("Generanting " + arg1 + "(" + arg2 + ")")
    plt.figure(num=1, figsize=(8, 6))
    plt.title(arg1+"("+arg2+")", size=14)
    plt.grid(True)
    plt.xlabel('Time', size=14)
    plt.ylabel('Values', size=14)
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
    plt.plot((converted_dates), arr, color='b', linestyle='--', marker='o')
    plt.gcf().autofmt_xdate()
    plt.savefig("generatedPlots/"+arg1+"("+arg2+")"+'.png', format='png')
    print("Done generanting " + arg1 + "(" + arg2 + ")")
	
if __name__ == "__main__":
	plot(sys.argv[1], sys.argv[2], sys.argv[3])

#sudo python plot.py 0 0 true // gerar os graficos