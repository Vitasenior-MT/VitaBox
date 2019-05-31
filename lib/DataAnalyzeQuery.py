import pandas as pd
import pingouin as pg
import numpy as np
from pandas import ExcelWriter
from pandas import ExcelFile
from matplotlib import pyplot as plt
from tkinter import *
from matplotlib.widgets import Slider, Button, RadioButtons, TextBox
import os
import time
import traceback

# Load data
try:
    lar = pd.read_excel('E:/Downloads/2019_02_11_DadosTestesVitasenior.xlsx', sheet_name='GrupoLar')
    residencia = pd.read_excel('E:/Downloads/2019_02_11_DadosTestesVitasenior.xlsx', sheet_name='GrupoResidencia')
    controlo = pd.read_excel('E:/Downloads/2019_02_11_DadosTestesVitasenior.xlsx', sheet_name='GrupoControlo')

##############BoxPlot#####################
    def dataFiller(data, type):
        dataList = []

        def switch(x):
            return {
                'controlo': controlo[data],
                'residencia': residencia[data],
                'lar': lar[data],
            }[x]
        readList = switch(
            type)
        for i in readList:
            try:
                dataList.append(int(i))
            except:
                print()
        return dataList
    paginaTXT = '7'
    seccaoTXT = '1'
    questaoTXT = '1'
    perguntaTXT = '1'
    initial_text = '7.1.1.1'
    fig, ax = plt.subplots()
    plt.subplots_adjust(bottom=0.2)
    ax.boxplot([dataFiller(initial_text, 'controlo'), dataFiller(initial_text, 'residencia'), dataFiller(initial_text, 'lar')])
    labels = ['', 'Controlo', 'residencia', 'lar']
    y_positions = range(len(labels))
    plt.xticks(y_positions, labels)
    def getPaginaTXT(text):
        global paginaTXT
        paginaTXT = text
    def getSeccaoTXT(text):
        global seccaoTXT
        seccaoTXT = text
    def getQuestaoTXT(text):
        global questaoTXT
        questaoTXT = text
    def getPerguntaTXT(text):
        global perguntaTXT
        perguntaTXT = text
    def submit(arg):
        text = paginaTXT + '.' + seccaoTXT + '.' + questaoTXT + '.' + perguntaTXT
        print(text)
        ax.clear()
        ax.boxplot([dataFiller(text, 'controlo'), dataFiller(text, 'residencia'), dataFiller(text, 'lar')])
        labels = ['', 'Controlo', 'residencia', 'lar']
        y_positions = range(len(labels))
        plt.xticks(y_positions, labels)
        plt.draw()
    pagina = TextBox(plt.axes([0.1, 0.05, 0.1, 0.075]), 'Página', initial=paginaTXT)
    seccao = TextBox(plt.axes([0.3, 0.05, 0.1, 0.075]), 'Secção', initial=seccaoTXT)
    questao = TextBox(plt.axes([0.5, 0.05, 0.1, 0.075]), 'Questão', initial=questaoTXT)
    pergunta = TextBox(plt.axes([0.71, 0.05, 0.1, 0.075]), 'Pergunta', initial=perguntaTXT)
    pagina.on_text_change(getPaginaTXT)
    seccao.on_text_change(getSeccaoTXT)
    questao.on_text_change(getQuestaoTXT)
    pergunta.on_text_change(getPerguntaTXT)
    button_box = Button(plt.axes([0.9, 0.05, 0.1, 0.075]), 'OK')
    button_box.on_clicked(submit)
    plt.show()

    ##############Anova#####################
    def Anova(exelSheet, dvColumn, betweenColumn):
        dataAnova = pg.anova(data=exelSheet, dv=dvColumn, between=betweenColumn, detailed=True)
        root = Tk()
        root.title(excelSheetTXT + ' - ' + dvColumnTXT + ' - ' + betweenColumnTXT)
        text = Text(root, height=10, width=70)
        scroll = Scrollbar(root, command=text.yview)
        text.configure(yscrollcommand=scroll.set)
        text.insert(END, dataAnova)
        text.pack(side=LEFT)
        scroll.pack(side=RIGHT, fill=Y)
    excelSheetTXT = 'residencia'
    dvColumnTXT = '7.1.1.1'
    betweenColumnTXT = 'Sexo'
    def getExcelSheetTXT(text):
        global excelSheetTXT
        excelSheetTXT = text
    def getDvColumnTXT(text):
        global dvColumnTXT
        dvColumnTXT = text
    def getBetweenColumnTXT(text):
        global betweenColumnTXT
        betweenColumnTXT = text
    def submitAnova(arg):
        if excelSheetTXT == 'controlo':
            Anova(controlo, dvColumnTXT, betweenColumnTXT)
        elif excelSheetTXT == 'residencia':
            Anova(residencia, dvColumnTXT, betweenColumnTXT)
        elif excelSheetTXT == 'lar':
            Anova(lar, dvColumnTXT, betweenColumnTXT)
    exelSheet = TextBox(plt.axes([0.15, 0.05, 0.15, 0.075]), 'Exel Sheet', initial=excelSheetTXT)
    dvColumn = TextBox(plt.axes([0.45, 0.05, 0.1, 0.075]), 'dv Column', initial=dvColumnTXT)
    betweenColumn = TextBox(plt.axes([0.75, 0.05, 0.1, 0.075]), 'between Column', initial=betweenColumnTXT)
    exelSheet.on_text_change(getExcelSheetTXT)
    dvColumn.on_text_change(getDvColumnTXT)
    betweenColumn.on_text_change(getBetweenColumnTXT)
    button_box = Button(plt.axes([0.9, 0.05, 0.1, 0.075]), 'OK')
    button_box.on_clicked(submitAnova)
    plt.show()
    
    ##############Histograma#####################
    fig, ax = plt.subplots()
    plt.subplots_adjust(bottom=0.2)
    excelSheetTXT = 'controlo'
    columnTypeTXT = 'Idade'
    plt.hist(residencia.Idade, edgecolor='white')
    plt.xlabel('Idade')
    plt.ylabel('Quantidade')
    plt.title('Histograma da idade')
    def getExcelSheetTXT(text):
        global excelSheetTXT
        excelSheetTXT = text
    def getColumnTypeTXT(text):
        global columnTypeTXT
        columnTypeTXT = text
    def submitHist(arg):
        ax.clear()
        if excelSheetTXT == 'controlo':
            ax.hist(controlo[columnTypeTXT], edgecolor='white')
        elif excelSheetTXT == 'residencia':
            ax.hist(residencia[columnTypeTXT], edgecolor='white')
        elif excelSheetTXT == 'lar':
            ax.hist(lar[columnTypeTXT], edgecolor='white')
        plt.draw()
    excelSheet = TextBox(plt.axes([0.15, 0.02, 0.15, 0.075]), 'Página', initial=excelSheetTXT)
    columnType = TextBox(plt.axes([0.5, 0.02, 0.15, 0.075]), 'Secção', initial=columnTypeTXT)
    excelSheet.on_text_change(getExcelSheetTXT)
    columnType.on_text_change(getColumnTypeTXT)
    button_box = Button(plt.axes([0.9, 0.02, 0.1, 0.075]), 'OK')
    button_box.on_clicked(submitHist)
    plt.show()

    ##############Pie#####################
    fig, ax = plt.subplots()
    plt.subplots_adjust(bottom=0.2)
    excelSheetTXT = 'controlo'
    groupbyTypeTXT = 'Idade'
    data = controlo.groupby(groupbyTypeTXT).Nome.count()
    plt.pie(data.values, labels=data.index, autopct='%d%%')
    plt.axis('equal')
    def getExcelSheetTXT(text):
        global excelSheetTXT
        excelSheetTXT = text
    def getGroupbyTypeTXT(text):
        global groupbyTypeTXT
        groupbyTypeTXT = text
    def submitPie(arg):
        ax.clear()
        if excelSheetTXT == 'controlo':
            controloData = controlo.groupby(groupbyTypeTXT).Nome.count()
            ax.pie(controloData.values, labels=controloData.index, autopct='%d%%')
        elif excelSheetTXT == 'residencia':
            residenciaData = residencia.groupby(groupbyTypeTXT).Nome.count()
            ax.pie(residenciaData.values, labels=residenciaData.index, autopct='%d%%')
        elif excelSheetTXT == 'lar':
            larData = lar.groupby(groupbyTypeTXT).Nome.count()
            ax.pie(larData.values, labels=larData.index, autopct='%d%%')
        plt.draw()
    excelSheet = TextBox(plt.axes([0.15, 0.02, 0.15, 0.075]), 'Excel Sheet', initial=excelSheetTXT)
    groupbyType = TextBox(plt.axes([0.5, 0.02, 0.15, 0.075]), 'Tipo', initial=groupbyTypeTXT)
    excelSheet.on_text_change(getExcelSheetTXT)
    groupbyType.on_text_change(getGroupbyTypeTXT)
    button_box = Button(plt.axes([0.9, 0.02, 0.1, 0.075]), 'OK')
    button_box.on_clicked(submitPie)
    plt.show()
    
except Exception:
    traceback.print_exc()
except:
    print('An error occured.')
input()
